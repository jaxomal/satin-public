const inquirer = require('inquirer');
const optionMap = require('../maps/options');
const atob = require('atob');

const mainOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap),
};

const keyQuestion = {
  type: 'input',
  name: 'key',
  message: 'Key:',
};

const mainOptionQuestions = [mainOptionQuestion];

const keyQuestions = [keyQuestion];

module.exports = {
  mainOptionQuestions,
  keyQuestions,
};
