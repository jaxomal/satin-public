const inquirer = require('inquirer');
const {
  getAccounts,
  getProxySets,
  getProfiles,
  getSiteMap,
  getSites,
  getSite,
  getTaskTemplates,
} = require('../utils');
const atob = require('atob');

const optionMap = require('../maps/options');

const enforceCaptchaQuestion = {
  type: 'confirm',
  name: 'enforceCaptcha',
  message: 'Enforce Captcha: ',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('enforceCaptcha') !== -1;
  },
}

const cookieLoginQuestion = {
  type: 'confirm',
  name: 'cookieLogin',
  message: 'Cookie Login: ',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('cookieLogin') !== -1;
  },
}

const urlQuestion = {
  type: 'input',
  name: 'url',
  message: 'Url:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('url') !== -1;
  },
};

const radiusQuestion = {
  type: 'number',
  name: 'radius',
  message: 'Radius:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('radius') !== -1;
  }
}

const amazonMonitorMethodQuesiton = {
  type: 'list',
  name: 'amazonMonitorMethod',
  message: 'Monitor Method:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('amazonMonitorMethod') !== -1;
  },
  choices: ['normal1', 'normal2', 'fast1', 'fast2']
}

const walmartMonitorMethodQuesiton = {
  type: 'list',
  name: 'walmartMonitorMethod',
  message: 'Monitor Method:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('walmartMonitorMethod') !== -1;
  },
  choices: ['web', 'mobile']
}

const skuQuestion = {
  type: 'input',
  name: 'sku',
  message: 'Sku:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('sku') !== -1;
  },
};

const profileQuestion = {
  type: 'list',
  name: 'profileName',
  message: 'Profile:',
  default: 0,
  choices: async () => {
    const profiles = await getProfiles();
    return ['all', ...Object.keys(profiles)];
  },
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('profileName') !== -1;
  },
};

const monitorQuestion = {
  type: 'list',
  name: 'monitorSetName',
  message: 'Monitor Set',
  default: 0,
  choices: async () => {
    const proxySets = await getProxySets();
    return Object.keys(proxySets);
  },
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('monitorSetName') !== -1;
  },
};

const checkoutQuestion = {
  type: 'list',
  name: 'checkoutSetName',
  message: 'Checkout Set',
  default: 0,
  choices: async () => {
    const proxySets = await getProxySets();
    return Object.keys(proxySets);
  },
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('checkoutSetName') !== -1;
  },
};

const siteTypeQuestion = {
  type: 'list',
  name: 'siteType',
  message: 'Site Type:',
  default: 0,
  choices: async () => {
    const siteMap = await getSiteMap();
    return Object.keys(siteMap);
  },
};

const delayQuestion = {
  type: 'number',
  name: 'delay',
  message: 'Delay:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('delay') !== -1;
  },
  validate: (input) => {
    return !isNaN(input);
  },
};

const qtyQuestion = {
  type: 'number',
  name: 'qty',
  message: 'Quantity:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('qty') !== -1;
  },
  validate: (input) => {
    return !isNaN(input);
  },
};

const priceQuestion = {
  type: 'number',
  name: 'price',
  message: 'Price:',
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('price') !== -1;
  },
  validate: (input) => {
    return !isNaN(input);
  },
};

const modeQuestion = {
  type: 'list',
  name: 'mode',
  message: 'Mode:',
  when: async ({ siteType, siteName }) => {
    const site = await getSite(siteType, siteName);
    return site.modes;
  },
  choices: async ({ siteType, siteName }) => {
    const site = await getSite(siteType, siteName);
    const modes = Object.keys(site.modes);
    return modes;
  },
};

const siteQuestion = {
  type: 'list',
  name: 'siteName',
  message: 'Site:',
  choices: async ({ siteType }) => {
    const sites = await getSites(siteType);
    return Object.keys(sites);
  },
};

const accountQuestion = {
  type: 'list',
  name: 'accountName',
  message: 'Account:',
  choices: async ({ siteName }) => {
    const accounts = await getAccounts();
    return ['all', ...Object.keys(accounts[siteName])];
  },
  when: async ({ siteType, siteName, mode }) => {
    if (!mode) {
      return false;
    }
    const site = await getSite(siteType, siteName);
    const { params } = site.modes[mode];
    return params.indexOf('accountName') !== -1;
  },
};

const amountOfTasksQuestion = {
  type: 'number',
  name: 'amountOfTasks',
  message: 'Amount of Tasks:',
  validate: (input) => {
    return !isNaN(input);
  },
};

const taskOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap['tasks']),
};

const taskChangeOptionQuestion = {
  type: 'list',
  name: 'option',
  message: 'Option:',
  default: 0,
  choices: Object.keys(optionMap['tasks']['Mass Change']),
};

const taskOptionQuestions = [taskOptionQuestion];

const templateChoiceQuestion = {
  type: 'list',
  name: 'name',
  message: 'Option:',
  default: 0,
  choices: async () => Object.keys(await getTaskTemplates()),
};

const templateChoiceQuestions = [templateChoiceQuestion];

const templateNameQuestion = {
  type: 'input',
  name: 'name',
  message: 'Template Name',
};

const taskChangeOptionQuestions = [taskChangeOptionQuestion];

const templateNameQuestions = [templateNameQuestion];

const createTaskQuestions = [
  siteTypeQuestion,
  siteQuestion,
  modeQuestion,
  urlQuestion,
  skuQuestion,
  profileQuestion,
  monitorQuestion,
  checkoutQuestion,
  amazonMonitorMethodQuesiton,
  walmartMonitorMethodQuesiton,
  delayQuestion,
  cookieLoginQuestion,
  qtyQuestion,
  radiusQuestion,
  priceQuestion,
  accountQuestion,
  enforceCaptchaQuestion,
  amountOfTasksQuestion,
];

module.exports = {
  createTaskQuestions,
  taskOptionQuestions,
  taskChangeOptionQuestions,
  templateChoiceQuestions,
  templateNameQuestions,
};
