const inquirer = require('inquirer');
const { settingsOptionQuestions } = require('../inquirers/settings');
const {
  editWebhook,
  editCatchall,
  editCaptchaKey,
  editBrowserPath,
  editGlobalWebhook,
} = require('../services/settings');
const atob = require('atob');

const settingsSection = async () => {
  while (true) {
    const { option } = await inquirer.prompt(settingsOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'webhook':
        await editWebhook();
        break;
      case 'catchall':
        await editCatchall();
        break;
      case 'captchaKey':
        await editCaptchaKey();
        break;
      case 'browserPath':
        await editBrowserPath();
        break;
      case 'Send Global Webhook?':
        await editGlobalWebhook();
        break;
      default:
        break;
    }
  }
};

module.exports = settingsSection;
