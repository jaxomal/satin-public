const {
  createTaskQuestions,
  templateChoiceQuestions,
  templateNameQuestions,
} = require('../inquirers/tasks');
const inquirer = require('inquirer');
const { promisify } = require('util');
const atob = require('atob');
const { getTaskConstructor } = require('../sites');
const Table = require('cli-table3');

const sleep = promisify(setTimeout);
const { getCSVItems, addTaskTemplate, getTaskTemplate, getSite, getSiteMap, getProfiles, getAccounts, deleteTaskTemplate } = require('../utils');

const createTasks = async (tasks) => {
  const taskOptions = await inquirer.prompt(createTaskQuestions);
  const { siteType, siteName, mode } = taskOptions;
  const path = {
    siteType,
    siteName,
    mode,
  };
  const accounts = (await getAccounts())[siteName];
  const profiles = await getProfiles();
  const taskConstructor = getTaskConstructor(siteType, siteName, mode);
  const { amountOfTasks, sku, url, profileName, accountName } = taskOptions;
  if (accountName === 'all') {
    for (const account of Object.values(accounts)) {
      const { accountName: accN } = account;
      if (profileName === 'all') {
        for (const profile of Object.values(profiles)) {
          const { profileName } = profile;
          for (let i = 0; i < amountOfTasks; i += 1) {
            if (sku) {
              const skuComponents = sku.split(',');
              for (const skuComponent of skuComponents) {
                const task = new taskConstructor({
                  ...taskOptions,
                  path,
                  sku: skuComponent,
                  profileName,
                  accountName: accN,
                });
                tasks.push(task);
              }
            } else {
              const urlComponents = url.split(',');
              for (const urlComponent of urlComponents) {
                const task = new taskConstructor({
                  ...taskOptions,
                  path,
                  url: urlComponent,
                  profileName,
                  accountName: accN,
                });
                tasks.push(task);
              }
            }
          }
        }
      } else {
        for (let i = 0; i < amountOfTasks; i += 1) {
          if (sku) {
            const skuComponents = sku.split(',');
            for (const skuComponent of skuComponents) {
              const task = new taskConstructor({
                ...taskOptions,
                path,
                sku: skuComponent,
                accountName: accN,
              });
              tasks.push(task);
            }
          } else {
            const urlComponents = url.split(',');
            for (const urlComponent of urlComponents) {
              const task = new taskConstructor({
                ...taskOptions,
                path,
                url: urlComponent,
                accountName: accN,
              });
              tasks.push(task);
            }
          }
        }
      }
    }
  } else {
    if (profileName === 'all') {
      for (const profile of Object.values(profiles)) {
        const { profileName } = profile;
        for (let i = 0; i < amountOfTasks; i += 1) {
          if (sku) {
            const skuComponents = sku.split(',');
            for (const skuComponent of skuComponents) {
              const task = new taskConstructor({
                ...taskOptions,
                path,
                sku: skuComponent,
                profileName,
              });
              tasks.push(task);
            }
          } else {
            const urlComponents = url.split(',');
            for (const urlComponent of urlComponents) {
              const task = new taskConstructor({
                ...taskOptions,
                path,
                url: urlComponent,
                profileName,
              });
              tasks.push(task);
            }
          }
        }
      }
    } else {
      for (let i = 0; i < amountOfTasks; i += 1) {
        if (sku) {
          const skuComponents = sku.split(',');
          for (const skuComponent of skuComponents) {
            const task = new taskConstructor({
              ...taskOptions,
              path,
              sku: skuComponent,
            });
            tasks.push(task);
          }
        } else {
          const urlComponents = url.split(',');
          for (const urlComponent of urlComponents) {
            const task = new taskConstructor({
              ...taskOptions,
              path,
              url: urlComponent,
            });
            tasks.push(task);
          }
        }
      }
    }
  }
};

const startTasks = (tasks) => {
  for (const task of tasks) {
    task.start();
  }
};

const stopTasks = (tasks) => {
  for (const task of tasks) {
    task.started = false;
    task.step = 0;
    this.hasFatalError = false;
    task.status = 'Stopped';
  }
};

const deleteTasks = (tasks) => {
  stopTasks(tasks);
  tasks.length = 0;
};

const saveTemplate = async (tasks) => {
  const { name } = await inquirer.prompt(templateNameQuestions);
  const taskTemplates = [];
  for (const task of tasks) {
    const taskTemplate = {};
    const { siteType, siteName, mode } = task;
    const path = { siteType, siteName, mode };
    const site = await getSite(siteType, siteName);
    const params = site.modes[mode].params;
    for (const param of params) {
      taskTemplate[param] = task[param];
    }
    taskTemplates.push({
      path,
      ...taskTemplate,
    });
    console.log(taskTemplates);
  }
  await addTaskTemplate(name, taskTemplates);
};

const loadTemplate = async (tasks) => {
  const { name } = await inquirer.prompt(templateChoiceQuestions);
  const taskTemplates = await getTaskTemplate(name);
  for (const taskTemplate of taskTemplates) {
    const { siteType, siteName, mode } = taskTemplate.path;
    const taskConstructor = getTaskConstructor(siteType, siteName, mode);
    const task = new taskConstructor(taskTemplate);
    tasks.push(task);
  }
};

const deleteTemplate = async () => {
  const { name } = await inquirer.prompt(templateChoiceQuestions);
  await deleteTaskTemplate(name);
}

const showTasks = async (tasks) => {
  isWatching = true;
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'ob',
        message: 'Done:',
      },
    ])
    .then((answers) => {
      isWatching = false;
    });
  while (isWatching) {
    showTasksOnce(tasks);
    await sleep(750);
  }
};

const importTasks = async (tasks) => {
  const params = [
    'site',
    'mode',
    'profile',
    'sku',
    'url',
    'qty',
    'delay',
    'monitorSetName',
    'checkoutSetName',
    'walmartMonitorMethod',
    'amazonMonitorMethod',
    'accountName',
    'maxPrice',
    'enforceCaptcha',
    'cookieLogin'
  ];

  const taskImports = await getCSVItems();
  const siteMap = await getSiteMap();
  for (let i = 1; i < taskImports.length; i += 1) {
    const rawTask = taskImports[i];
    const mode = rawTask[1].toLowerCase();
    const site = rawTask[0].toLowerCase();
    let siteType = Object.keys(siteMap).filter(st => {
      return siteMap[st].hasOwnProperty(site)
    })[0];
    if (siteType) {
      siteType = siteType.toLowerCase();
      const taskConstructor = getTaskConstructor(siteType, site, mode);
      const path = {
        siteType,
        siteName: site,
        mode: mode,
      }
      const taskParams = {};
      taskParams.path = path;
      for (let i = 2; i < params.length; i += 1) {
        if (rawTask[i]) {
          taskParams[params[i]] = rawTask[i];
        }
      }
      const task = new taskConstructor(taskParams);
      tasks.push(task);
    }
  }
}

const showTasksOnce = (tasks) => {
  const table = new Table({
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
    head: ['Count', 'Site', 'State', 'Product', 'Status'],
  });
  const rows = filterTasks(tasks);

  table.push(...rows);

  console.log(table.toString());
};

const filterTasks = (tasks) => {
  const buckets = {};
  for (const task of tasks) {
    const hash = `${task.site}${task.started}${task.status}${task.identifier}`;
    if (!buckets.hasOwnProperty(hash)) {
      buckets[hash] = [
        1,
        task.site,
        task.started ? 'Running' : 'Stopped',
        task.identifier,
        task.status,
      ];
    } else {
      buckets[hash][0] += 1;
    }
  }
  return Object.values(buckets);
};

module.exports = {
  importTasks,
  createTasks,
  startTasks,
  stopTasks,
  deleteTasks,
  showTasks,
  saveTemplate,
  loadTemplate,
  deleteTemplate,
};
