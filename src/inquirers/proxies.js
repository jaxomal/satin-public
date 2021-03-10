const {
  getProxySets,
} = require('../utils');
const atob = require('atob');

const optionMap = require('../maps/options');

const nameQuestion = {
  type: 'input',
  name: 'name',
  message: 'Name:',
};

const deleteChoiceQuestion = {
  type: 'list',
  name: 'deleteChoice',
  message: 'Delete Proxy Set:',
  default: 0,
  choices: async () => {
    return Object.keys(await getProxySets());
  },
};

const deleteProxySetQuestions = [deleteChoiceQuestion];

const proxySetOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap['proxies']),
};

const createProxySetQuestions = [nameQuestion];

const proxySetOptionQuestions = [proxySetOptionQuestion];

module.exports = {
  createProxySetQuestions,
  deleteProxySetQuestions,
  proxySetOptionQuestions,
};
