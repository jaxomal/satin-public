const inquirer = require('inquirer');
const { accountOptionQuestions } = require('../inquirers/accounts');
const {
  importAccounts,
  deleteAccount,
  clearAccountCookies,
} = require('../services/accounts');
const atob = require('atob');

const accountSection = async () => {
  while (true) {
    const { option } = await inquirer.prompt(accountOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'Import Accounts':
        await importAccounts();
        break;
      case 'Delete Account':
        await deleteAccount();
        break;
      case 'Clear Cookies':
        await clearAccountCookies();
        break;
      default:
    }
  }
};

module.exports = accountSection;
