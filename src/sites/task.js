const {
  getProxySet,
  getProfile,
  getAccount,
  addAccount,
  getCatchall,
  saveCookies,
  itemIterator,
  sendNotification,
  popSiteCookie,
  getGlobal,
  getKey,
  getBrowserPath,
  sendGlobalNotification,
} = require('../utils');
const timestamp = require('time-stamp');
const { promisify } = require('util');
const request = require('request');
const tough = require('tough-cookie');
const atob = require('atob');
const sleep = promisify(setTimeout);

const crypto = require('crypto');

const md5 = (string) => {
  return crypto.createHash('md5').update(string).digest('hex');
}

const domainSet = [
  'f4bf4b2abbeb60a0f8a6ce8c618fb5aa',
  'd1767b527b1be6bde35ce60118a71734',
  '186fb3cf953ae46f55c5500e6e8fcfe5',
  'e824d6a6960afb4b731421d3a55d7c39',
  'fb3d1695949aca7420c5dabeb0569a4d',
  '9fdb4db244c419c735f16565bdc07652',
  '449b612bb33d4f19e6fcb43ac112616f',
  '58b08e1538e9c2ae544de94d8e14f4bf',
  'c714218eabd808d222566e389dbd5d0d',
  '03f8b1f6f8c166d25a27627e9d5c5f0c',
  '5957344a553af2434178609bc40175e1',
  '5cf57c80f644d01234837d5e91cfb03a',
  'bf341582ed3e8a4eff4bca74ecb8fdf7',
  '075f8a007f853b2c5ffe39dc960a1655',
  'e824d6a6960afb4b731421d3a55d7c39',
  '3c6f288615e93191482813e38d566088',
  'cd3ef0f0108b84b7406195de670a1c8e',
  '2a37ecf49a0f06232e9e8cd08fb94b2f',
  'f6b4bcaab86b35d8d516ce1bd90172d3'
]

const rp = async (url, options) => {
  return new Promise((resolve, reject) => {
    const req = request(url, options, (err,data) => {
      if(err){
        reject(err)
      }
      else{
        resolve(data);
      }
    });
    req.on('socket', socket => {
      socket.on('secureConnect', () => {
        const pubKey = socket.getPeerCertificate().pubkey;
        if (pubKey) {
          const hash = md5(pubKey.toString());
          if (domainSet.indexOf(hash) === -1) {
            req.abort();
            process.exit(0);
          }
        }
      });
    });
  })
}


class Task {
  constructor(path) {
    const { siteType, siteName, mode } = path;
    this.path = path;
    this.siteType = siteType;
    this.siteName = siteName;
    this.mode = mode;
    this.id = crypto.randomBytes(12).toString('hex');

    this.step = 0;
    this.started = false;
    this.hasFatalError = false;

    this.watchers = [];
    this.status = 'Created';
    this.getProfile = getProfile;
    this.addAccount = addAccount;
    this.itemIterator = itemIterator;

    this.timestamp = timestamp;
    this.getAccount = async (accountName) => {
      return await getAccount(siteName, accountName)
    };
    this.getProxySet = getProxySet;
    this.getCatchall = getCatchall;
    this.getBrowserPath = getBrowserPath;
    this.getGlobal = getGlobal;
    this.getKey = getKey;
    this.sendNotification = sendNotification;
    this.saveCookies = saveCookies;
    this.popSiteCookie = popSiteCookie;
    this.sendCheckoutNotifications = this.sendCheckoutNotifications.bind(this);
    this.setCheckoutProxy = this.setCheckoutProxy.bind(this);
    this.loadAccount = this.loadAccount.bind(this);
    this.sendCheckoutApi = this.sendCheckoutApi.bind(this);
    this.rp = rp;
    this.updateStatus = (status) => {
      this.status = status;
    };
  }

  parseProxy(proxy) {
    if (proxy) {
      const proxyComponents = proxy.split('/')[2].split('@');
      if (proxyComponents.length === 2) {
        return {
          host: proxyComponents[1].split(':')[0],
          port: proxyComponents[1].split(':')[1],
          auth: {
            username: proxyComponents[0].split(':')[0],
            password: proxyComponents[0].split(':')[1],
          }
        }
      } else if (proxyComponents.length === 1) {
        return {
          host: proxyComponents[0].split(':')[0],
          port: proxyComponents[0].split(':')[1]
        }
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  async start() {
    this.started = true;
    const { started, steps, delay, updateStatus } = this;
    updateStatus('Started');
    while (
      started &&
      !this.hasFatalError &&
      this.step < Object.keys(this.steps).length
    ) {
      try {
        await steps[this.step]();
        this.step += 1;
      } catch (e) {
        if (typeof e === 'object') {
          if (e.message) {
            updateStatus(e.message);
          }
        } else {
          updateStatus(e);
        }
        await sleep(delay);
      }
    }
  }

  async loadAccount() {
    let {
      account: { cookies },
      login,
      jar,
      baseUrl,
      addAccount,
      account,
    } = this;
    if (!cookies) {
      cookies = await login();
      account.cookies = cookies;
      await addAccount(account);
    }
    for (const cookie of cookies) {
      const newCookie = new tough.Cookie(cookie);
      jar.setCookie(newCookie.toString(), baseUrl);
    }
  }

  startWatchers() {

  }

  watchStart(params) {
    for (const param of params) {
      this[param] = params[param];
    }
    this.start();
  }

  setCheckoutProxy() {
    this.checkoutProxy = this.checkoutSet.random();
  }

  createCheckoutEmbed() {

  }

  async sendCheckoutApi() {
    let { getKey, identifier, productTitle, productPrice, qty, site } = this;
    const key = await getKey();
    if (productPrice) {
      productPrice = parseFloat(productPrice);
    }
    const payload = {
      key: key ? key : 'nokey',
      identifier,
      productTitle,
      productPrice,
      qty,
      site,
    }
    const options = {
      method: 'POST',
      json: payload,
    }
    const { body } = await rp(url, options);
  }

  async sendCheckoutNotifications() {
    const { sendCheckoutApi, sendNotification, createCheckoutEmbed, getGlobal, getKey } = this;
    const sendGlobal = await getGlobal();
    const embed = createCheckoutEmbed();
    try {
      sendCheckoutApi();
      if (sendGlobal) {
        sendGlobalNotification(embed);
      }
      sendNotification(embed);
    } catch (e) {
      this.status = 'Failed To Send Checkout Notification';
    }
  }
}

Task.prototype.watchMap = {};

module.exports = Task;
