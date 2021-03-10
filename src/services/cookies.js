const {
  siteChoiceQuestions,
} = require('../inquirers/cookies');

const {
  addSiteCookies,
  removeCookies,
  importCookiesFromFile
} = require('../utils');

const atob = require('atob');

const inquirer = require('inquirer');

const importCookies = async () => {
  const cookies = await importCookiesFromFile();
  const { choice } = await inquirer.prompt(siteChoiceQuestions);
  await addSiteCookies(choice, cookies);
};

const deleteCookies = async () => {
  const { choice } = await inquirer.prompt(siteChoiceQuestions);
  await removeCookies(choice);
};


module.exports = {
  importCookies,
  deleteCookies,
};
