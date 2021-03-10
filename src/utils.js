const fs = require('fs').promises;
const Discord = require('discord.js');
const csvParse = require('csv-parse/lib/sync');

const selectFolder = require('win-select-file');

const atob = require('atob');

const getAccounts = async () => {
  const accounts = JSON.parse(
    await fs.readFile('./storage/accounts.json', 'utf-8'),
  );
  return accounts;
};

const getAccount = async (site, accountName) => {
  const accounts = await getAccounts();
  return accounts[site][accountName];
};

const addAccount = async (account) => {
  const { accountName, site } = account;
  const accounts = await getAccounts();
  accounts[site][accountName] = account;
  await fs.writeFile(
    './storage/accounts.json',
    JSON.stringify(accounts, null, 2),
  );
};

const getProxySets = async () => {
  const proxySets = JSON.parse(
   await fs.readFile('./storage/proxies.json', 'utf-8'),
  );
  return proxySets;
};

const getProxySet = async (proxyName) => {
  const proxySets = await getProxySets();
  const proxySet = proxySets[proxyName];
  return proxySet;
};

const addProxySet = async (proxySet) => {
  const { name } = proxySet;
  const proxySets = await getProxySets();
  proxySets[name] = proxySet;
  await fs.writeFile(
    './storage/proxies.json',
    JSON.stringify(proxySets, null, 2),
  );
};

const getProfiles = async () => {
  const profiles = JSON.parse(
    await fs.readFile('./storage/profiles.json', 'utf-8'),
  );
  return profiles;
};

const getProfile = async (profileName) => {
  const profiles = await getProfiles();
  return profiles[profileName];
};

const addProfile = async (profile) => {
  const { profileName } = profile;
  const profiles = await getProfiles();
  profiles[profileName] = profile;
  await fs.writeFile(
    './storage/profiles.json',
    JSON.stringify(profiles, null, 2),
  );
};

const replaceProfiles = async (profiles) => {
  await fs.writeFile(
    './storage/profiles.json',
    JSON.stringify(profiles, null, 2),
  );
};

const replaceAccounts = async (accounts) => {
  await fs.writeFile(
    './storage/accounts.json',
    JSON.stringify(accounts, null, 2),
  );
};

const replaceProxies = async (proxies) => {
  await fs.writeFile('./storage/proxies.json', JSON.stringify(proxies, null, 2));
};

const getSiteMap = async () => {
  const siteMap = require('./maps/sites');
  return siteMap;
};

const getSites = async (siteType) => {
  const siteMap = await getSiteMap();
  const sites = siteMap[siteType];
  return sites;
};

const getSite = async (siteType, siteName) => {
  const sites = await getSites(siteType);
  const site = sites[siteName];
  return site;
};

const getSettings = async () => {
  const settings = JSON.parse(
    await fs.readFile('./storage/settings.json', 'utf-8'),
  );
  return settings;
};

const addKey = async (key) => {
  const settings = await getSettings();
  settings.key = key;

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
}

const setGlobal = async (global) => {
  const settings = await getSettings();
  settings.sendGlobal = global;

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );

}

const getGlobal = async () => {
  const settings = await getSettings();
  return settings.sendGlobal;
}

const addToken = async (token) => {
  const settings = await getSettings();
  settings.token = token;

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
}

const getToken = async () => {
  const settings = await getSettings();
  return settings.token;
}

const deleteToken = async () => {
  await addToken('');
}

const addWebhook = async (webhook) => {
  const settings = await getSettings();
  settings.webhook = parseWebhook(webhook);

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
};

const addBrowserPath = async (path) => {
  const settings = await getSettings();
  settings.browserPath = path.replace('\\', '\\\\');

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
}

const getBrowserPath = async () => {
  const settings = await getSettings();
  return settings.browserPath;
}

const addCatchall = async (catchall) => {
  const settings = await getSettings();
  settings.catchall = catchall;

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
};

const getCatchall = async () => {
  const settings = await getSettings();
  return settings.catchall;
};

const getProxies = async () => {
  const proxies = [];
  const process = (line) => {
    const info = line.split(':');
    let proxy = {};
    if (info.length > 2) {
      proxy = `http://${info[2]}:${info[3]}@${info[0]}:${info[1]}`;
    } else {
      proxy = `http://${info[0]}:${info[1]}`;
    }
    return proxy;
  };
  const files = await selectFolder();
  for (const file of files) {
    const lines = (await fs.readFile(file, 'utf-8'))
      .split('\n')
      .map((line) => line.trim());
    proxies.push(...lines.map((line) => process(line)));
  }
  return proxies;
};

const importCookiesFromFile = async () => {
  const files = await selectFolder();
  for (const file of files) {
    const cookies = await fs.readFile(file, 'utf-8');
    console.log(cookies);
    return JSON.parse(cookies);
  }
  return [];
};


const removeCookies = async (site) => {
  const siteCookies = await getSiteCookies();
  siteCookies[site] = [];
  await fs.writeFile(
    './storage/cookies.json',
    JSON.stringify(siteCookies, null, 2),
  );
};

const itemIterator = (key_list) => {
  let index = 0;
  const iterator = {
    next: function () {
      if (key_list.length === 0) {
        return undefined;
      }
      if (index === key_list.length) {
        index = 0;
      }
      result = key_list[index];
      index += 1;
      return result;
    },
    random: function () {
      if (key_list.length === 0) {
        return undefined;
      }
      return key_list[Math.floor(Math.random() * key_list.length)];
    },
  };
  return iterator;
};

const sendNotification = async (embed) => {
  const {
    webhook: { id, token },
  } = await getSettings();
  const webhookClient = new Discord.WebhookClient(id, token);
  webhookClient.send('', {
    embeds: [embed],
  });
};

const sendGlobalNotification = (embed) => {
}

const parseWebhook = (webhook) => {
  const parts = webhook.split('/');
  return {
    id: parts[5],
    token: parts[6],
  };
};

const parseProxy = (line) => {
  if (!line) {
    return undefined;
  }
  const info = line.split(':');
  let proxy;
  if (info.length > 2) {
    proxy = {
      host: info[0],
      port: info[1],
      auth: {
        username: info[2],
        password: info[3]
      }
    }
  } else {
    proxy = {
      host: info[0],
      port: info[1],
    }
  }
  return proxy;
}

const add2Captcha = async (captchaKey) => {
  const settings = await getSettings();
  settings.captchaKey = captchaKey;

  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
};

const saveCookies = async (account, cookies) => {
  account.cookies = cookies;
  await addAccount(account);
};

const getKey = async () => {
  const settings = await getSettings();
  return settings.key;
};

const removeKey = async () => {
  const settings = await getSettings();
  delete settings['key'];
  await fs.writeFile(
    './storage/settings.json',
    JSON.stringify(settings, null, 2),
  );
};

const getTaskTemplates = async () => {
  const tasks = JSON.parse(await fs.readFile('./storage/tasks.json', 'utf-8'));
  return tasks;
};

const deleteTaskTemplate = async (name) => {
  const taskTemplates = await getTaskTemplates();
  delete taskTemplates[name];
  await fs.writeFile(
    './storage/tasks.json',
    JSON.stringify(taskTemplates, null, 2),
  );
}

const getTaskTemplate = async (name) => {
  const taskTemplates = await getTaskTemplates();
  return taskTemplates[name];
};

const addTaskTemplate = async (name, tasks) => {
  const taskTemplates = await getTaskTemplates();
  taskTemplates[name] = tasks;
  await fs.writeFile(
    './storage/tasks.json',
    JSON.stringify(taskTemplates, null, 2),
  );
};

const getCSVItems = async () => {
  const files = await selectFolder();
  const file = files[0];
  if (file) {
    if (files[0].includes('csv')) {
      return csvParse(await fs.readFile(file, 'utf-8'));
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const getSiteCookies = async () => {
  const rawCookies = JSON.parse(await fs.readFile('./storage/cookies.json', 'utf-8'));
  return rawCookies;
}

const getCookies = async (site) => {
  const siteCookies = await getSiteCookies();
  return siteCookies[site];
}

const addSiteCookie = async (site, cookie) => {
  const siteCookies = await getSiteCookies();
  siteCookies[site].push(cookie);
  await fs.writeFile('./storage/cookies.json', JSON.stringify(siteCookies, null, 2));
}

const addSiteCookies = async (site, cookies) => {
  const siteCookies = await getSiteCookies();
  for (const cookie of cookies) {
    siteCookies[site].push(cookie);
  }
  await fs.writeFile('./storage/cookies.json', JSON.stringify(siteCookies, null, 2));
}

const popSiteCookie = async (site) => {
  const siteCookies = await getSiteCookies();
  const ckie = siteCookies[site].pop();
  const fCookie = {};
  for (const h of ckie) {
    fCookie[h.name] = h.value;
  }
  await fs.writeFile('./storage/cookies.json', JSON.stringify(siteCookies, null, 2));
  return fCookie;
}

const getCaptchaAccounts = async () => {
  const accs = await fs.readFile('./storage/solvers.json');
  return JSON.parse(accs);
}

const getCaptchaCookies = async (accName) => {
  const accs = await getCaptchaAccounts();
  return accs[accName].cookies;
}

const saveCaptchaCookies = async (account) => {
  const accs = await getCaptchaAccounts();
  accs[account.name] = account;
  await fs.writeFile('./storage/solvers.json', JSON.stringify(accs, null, 2));
}

module.exports = {
  getCaptchaAccounts,
  getCaptchaCookies,
  saveCaptchaCookies,
  addSiteCookies,
  getSiteCookies,
  removeCookies,
  getCookies,
  addSiteCookie,
  getAccount,
  getAccounts,
  getProxySets,
  getProxySet,
  getProfiles,
  getProfile,
  getSiteMap,
  getSites,
  getSite,
  getSettings,
  getCatchall,
  getKey,
  getTaskTemplates,
  getTaskTemplate,
  deleteTaskTemplate,
  getCSVItems,
  getBrowserPath,
  addProfile,
  addProxySet,
  addAccount,
  addWebhook,
  addCatchall,
  add2Captcha,
  addBrowserPath,
  addTaskTemplate,
  replaceAccounts,
  replaceProfiles,
  replaceProxies,
  getProxies,
  itemIterator,
  sendNotification,
  sendGlobalNotification,
  saveCookies,
  removeKey,
  popSiteCookie,
  addToken,
  addKey,
  deleteToken,
  getToken,
  importCookiesFromFile,
  setGlobal,
  getGlobal,
  parseProxy
};
