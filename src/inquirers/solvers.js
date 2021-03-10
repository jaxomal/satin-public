const optionMap = require('../maps/options');

const solverOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap['solvers']),
};

const solverOptionQuestions = [solverOptionQuestion];

const captchaIpQuestion = {
  type: 'input',
  name: 'proxyStr',
  message: 'Proxy Ip:'
}

const captchaIpQuestions = [captchaIpQuestion];

module.exports = {
  captchaIpQuestions,
  solverOptionQuestions
}
