const {
  deleteAccountQuestions,
} = require('../inquirers/accounts');

const {
  getAccounts,
  addAccount,
  replaceAccounts,
  getCSVItems,
} = require('../utils');

const atob = require('atob');

const inquirer = require('inquirer');

const importAccounts = async () => {
  const accounts = await getCSVItems();
  for (let i = 1; i < accounts.length; i += 1) {
    const account = accounts[i];
    if (account.length === 4) {
      const accObj = {
        site: account[0],
        accountName: account[1],
        username: account[2],
        password: account[3],
      }
      await addAccount(accObj);
    }
  }
};

const deleteAccount = async () => {
  const { site, accountName } = await inquirer.prompt(deleteAccountQuestions);
  const accounts = await getAccounts();
  delete accounts[site][accountName];
  await replaceAccounts(accounts);
};

const clearAccountCookies = async () => {
  const { site, accountName } = await inquirer.prompt(deleteAccountQuestions);
  const accounts = await getAccounts();
  delete accounts[site][accountName].cookies;
  await replaceAccounts(accounts);
}

module.exports = {
  importAccounts,
  deleteAccount,
  clearAccountCookies,
};
