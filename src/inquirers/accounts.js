const {
  getAccounts,
} = require('../utils');
const atob = require('atob');

const optionMap = require('../maps/options.js');

const deleteChoiceSiteQuestion = {
  type: 'list',
  name: 'site',
  message: 'Delete Account:',
  choices: async () => {
    return Object.keys(await getAccounts());
  },
};

const deleteChoiceAccountQuestion = {
  type: 'list',
  name: 'accountName',
  message: 'Delete Account:',
  choices: async ({ site }) => {
    return Object.keys((await getAccounts())[site]);
  },
};

const accountChoice = {
  type: 'list',
  name: 'option',
  message: 'Choice:',
  choices: () => {
    return Object.keys(optionMap['accounts']);
  }
}


const deleteAccountQuestions = [deleteChoiceSiteQuestion, deleteChoiceAccountQuestion];
const accountOptionQuestions = [accountChoice];

module.exports = {
  accountOptionQuestions,
  deleteAccountQuestions,
};
