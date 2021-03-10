const inquirer = require('inquirer');
const { proxySetOptionQuestions } = require('../inquirers/proxies');
const {
  importProxySets,
  deleteProxySet,
} = require('../services/proxies');

const atob = require('atob');

const proxiesSection = async () => {
  while (true) {
    const { option } = await inquirer.prompt(proxySetOptionQuestions);
    switch (option) {
      case 'Go Back':
        return;
      case 'Import Proxy Sets':
        try {
          await importProxySets();
        } catch (e) {
          console.log(e);
        }
        break;
      case 'Delete Proxy Set':
        await deleteProxySet();
        break;
      default:
        break;
    }
  }
};

module.exports = proxiesSection;
