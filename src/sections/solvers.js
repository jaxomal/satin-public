const inquirer = require('inquirer');
const { solverOptionQuestions } = require('../inquirers/solvers');
const {
  addCaptchaHarvester,
  removeCaptchaHarvester,
  saveGmailCookies,
  loadGmailCookies,
  testCaptcha,
} = require('../services/solvers');

const atob = require('atob');

const solversSection = async (manager) => {
  while (true) {
    const { option } = await inquirer.prompt(solverOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'Add Captcha Harvester':
        await addCaptchaHarvester(manager);
        break;
      case 'Remove Captcha Harvester':
        await removeCaptchaHarvester(manager);
        break;
      case 'Save Gmail Cookies':
        await saveGmailCookies(manager);
        break;
      case 'Load Gmail Cookies':
        await loadGmailCookies(manager);
        break;
      case 'Test Captcha':
        await testCaptcha(manager);
        break;
      default:
        break;
    }
  }
};

module.exports = solversSection;
