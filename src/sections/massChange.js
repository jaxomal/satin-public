const inquirer = require('inquirer');
const { taskChangeOptionQuestions } = require('../inquirers/tasks');
const atob = require('atob');

const changeSection = async (tasks) => {
  while (true) {
    const { option } = await inquirer.prompt(taskChangeOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'sku':
        const { sku } = await inquirer.prompt({
          type: 'input',
          name: 'sku',
          message: 'Sku Change:',
        })
        for (const task of tasks) {
          task.hasFatalError = false;
          task.sku = sku;
          task.identifier = sku;
          task.step = 0;
        }
        break;
      case 'url':
        const { url } = await inquirer.prompt({
          type: 'input',
          name: 'url',
          message: 'Url Change:',
        })
        for (const task of tasks) {
          task.hasFatalError = false;
          task.url = url;
          task.identifier = url;
          task.step = 0;
        }
        break;
      case 'delay':
        const { delay } = await inquirer.prompt({
          type: 'number',
          name: 'delay',
          message: 'Delay Change:',
        })
        for (const task of tasks) {
          task.hasFatalError = false;
          task.delay = delay;
        }
        break;
    }
  }
};

module.exports = changeSection;
