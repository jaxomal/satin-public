const inquirer = require('inquirer');
const atob = require('atob');

const optionMap = require('../maps/options');

const editWebhookQuestion = {
  type: 'input',
  name: 'webhook',
  message: 'Webhook:',
};

const editCatchallQuestion = {
  type: 'input',
  name: 'catchall',
  message: 'Catchall:',
};

const settingsOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap['settings']),
};

const edit2CaptchaQuestion = {
  type: 'input',
  name: 'captchaKey',
  message: '2captcha Key:',
};

const editBrowserPathQuestion = {
  type: 'input',
  name: 'browserPath',
  message: 'Browser Path:',
}

const editGlobalQuestion = {
  type: 'confirm',
  name: 'global',
  message: 'Send Global Webhook:'
}

const editBrowserPathQuestions = [editBrowserPathQuestion];

const settingsOptionQuestions = [settingsOptionQuestion];

const editWebhookQuestions = [editWebhookQuestion];

const editCatchallQuestions = [editCatchallQuestion];

const edit2CaptchaQuestions = [edit2CaptchaQuestion];

const editGlobalQuestions = [editGlobalQuestion];

module.exports = {
  settingsOptionQuestions,
  editWebhookQuestions,
  editCatchallQuestions,
  edit2CaptchaQuestions,
  editBrowserPathQuestions,
  editGlobalQuestions,
};
