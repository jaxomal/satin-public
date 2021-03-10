const { mainOptionQuestions } = require('./inquirers/main');
const { auth } = require('./services/auth');
const inquirer = require('inquirer');
const atob = require('atob');
const {
  accountSection,
  profileSection,
  settingsSection,
  tasksSection,
  proxiesSection,
  solversSection,
  cookieSection,
} = require('./sections');
const Task = require('./sites/task');
const { CaptchaManager } = require('./services/captcha');

const main = async () => {
  const res = await auth();
  if (!res) {
    process.exit(0);
  }
  const tasks = [];
  const manager = new CaptchaManager();
  Task.prototype.CaptchaManager = manager;
  while (true) {
    try {
      const { option } = await inquirer.prompt(mainOptionQuestions);
      switch (option) {
        case 'Exit Bot':
          return;
        case 'tasks':
          await tasksSection(tasks);
          break;
        case 'profiles':
          await profileSection();
          break;
        case 'proxies':
          await proxiesSection();
          break;
        case 'accounts':
          await accountSection();
          break;
        case 'settings':
          await settingsSection();
          break;
        case 'cookies':
          await cookieSection();
          break;
        case 'solvers':
          await solversSection(manager);
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
  }
};

main().catch(e => console.log(e));
