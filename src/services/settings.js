const {
  editWebhookQuestions,
  editCatchallQuestions,
  edit2CaptchaQuestions,
  editBrowserPathQuestions,
  editGlobalQuestions,
} = require('../inquirers/settings');
const { addWebhook, addCatchall, add2Captcha, addBrowserPath, setGlobal } = require('../utils');

const inquirer = require('inquirer');
const atob = require('atob');

const editGlobalWebhook = async () => {
  const { global } = await inquirer.prompt(editGlobalQuestions);
  await setGlobal(global);
}

const editWebhook = async () => {
  const { webhook } = await inquirer.prompt(editWebhookQuestions);
  await addWebhook(webhook);
};

const editCatchall = async () => {
  const { catchall } = await inquirer.prompt(editCatchallQuestions);
  await addCatchall(catchall);
};

const editCaptchaKey = async () => {
  const { captchaKey } = await inquirer.prompt(edit2CaptchaQuestions);
  await add2Captcha(captchaKey);
};

const editBrowserPath = async () => {
  const { browserPath } = await inquirer.prompt(editBrowserPathQuestions);
  await addBrowserPath(browserPath);
}

module.exports = {
  editWebhook,
  editCatchall,
  editCaptchaKey,
  editBrowserPath,
  editGlobalWebhook,
};
