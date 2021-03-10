const {
  getSiteCookies,
} = require('../utils');
const atob = require('atob');

const optionMap = require('../maps/options.js');

const siteChoiceQuestion = {
  type: 'list',
  name: 'choice',
  message: 'Choose:',
  choices: async () => {
    return Object.keys(await getSiteCookies());
  }
}

const cookieChoice = {
  type: 'list',
  name: 'option',
  message: 'Choice:',
  choices: () => {
    return Object.keys(optionMap['cookies']);
  }
}


const siteChoiceQuestions = [siteChoiceQuestion];
const cookieOptionQuestions = [cookieChoice];

module.exports = {
  siteChoiceQuestions,
  cookieOptionQuestions,
};
