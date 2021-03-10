const {
  createProxySetQuestions,
  editProxySetQuestions,
  deleteProxySetQuestions,
} = require('../inquirers/proxies');

const {
  getProxySets,
  addProxySet,
  replaceProxies,
  getProxies,
} = require('../utils');

const inquirer = require('inquirer');
const atob = require('atob');

const importProxySets = async () => {
  const { name } = await inquirer.prompt(createProxySetQuestions);
  const proxies = await getProxies();
  await addProxySet({
    name,
    proxies,
  });
};

const deleteProxySet = async () => {
  const { deleteChoice } = await inquirer.prompt(deleteProxySetQuestions);
  const sets = await getProxySets();
  delete sets[deleteChoice];
  await replaceProxies(sets);
};

module.exports = {
  importProxySets,
  deleteProxySet,
};
