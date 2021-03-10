const accountSection = require('./accounts');
const profileSection = require('./profiles');
const settingsSection = require('./settings');
const tasksSection = require('./tasks');
const cookieSection = require('./cookies');
const proxiesSection = require('./proxies');
const solversSection = require('./solvers');

const atob = require('atob');

module.exports = {
  accountSection,
  profileSection,
  settingsSection,
  tasksSection,
  cookieSection,
  solversSection,
  proxiesSection,
};
