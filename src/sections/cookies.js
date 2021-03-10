const inquirer = require('inquirer');
const { cookieOptionQuestions } = require('../inquirers/cookies');
const {
  importCookies,
  deleteCookies,
} = require('../services/cookies');
const atob = require('atob');

const accountSection = async () => {
  while (true) {
    const { option } = await inquirer.prompt(cookieOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'Import Cookies':
        await importCookies();
        break;
      case 'Delete Cookies':
        await deleteCookies();
        break;
      default:
    }
  }
};

module.exports = accountSection;
