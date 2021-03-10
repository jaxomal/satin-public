const puppeteer = require('puppeteer-extra');
const crypto = require('crypto');
const { promisify } = require('util');
const inquirer = require('inquirer');
const fs = require('fs');
const { addSiteCookies, itemIterator, getProxySet, getBrowserPath } = require('../utils');

const sleep = promisify(setTimeout);

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());
let chunk = [];
const parseProxy = (proxy) => {
  if (!proxy) {
    return undefined;
  }
  if (proxy.split('@').length === 2) {
    const comp0 = proxy.split('@')[0];
    const comp1 = proxy.split('@')[1];
    const authComp = comp0.split('/')[2];
    return {
      host: comp1.split(':')[0],
      port: comp1.split(':')[1],
      auth: {
        username: authComp.split(':')[0],
        password: authComp.split(':')[1],
      }
    }
  } else {
    const ipComp = proxy.split('/')[2];
    return {
      host: ipComp.split(':')[0],
      port: ipComp.split(':')[1],
    }
  }
}

const createPage = async (proxyStr) => {
  const proxy = parseProxy(proxyStr);
  const browserPath = await getBrowserPath();
  if (!browserPath) {
    throw new Error('Browser Path Not Set');
  }
  const browserOptions = {
    headless: false,
    devtools: false,
    executablePath: browserPath,
    slowMo: 10
  }
  if (proxy) {
    browserOptions.args = [ `--proxy-server=http://${proxy.host}:${proxy.port}` ];
  }
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();
  if (proxy) {
    await page.authenticate({
      username: proxy.auth.username,
      password: proxy.auth.password,
    });
  }
  await page.setRequestInterception(true);
  await page.setCacheEnabled(false);
  page.on('request', async request => {
    const { _method, _url, _headers } = request;
    if (_method === 'POST' && _url === 'https://gsp.target.com/gsp/authentications/v1/credential_validations?client_id=ecom-web-1.0.0') {
      const currHeaders = {};
      Object.keys(_headers).filter(header => {
        return header.includes('x-');
      }).map(header => {
        currHeaders[header] = _headers[header];
      });
      currHeaders['timestamp'] = Date.now();
      console.log('Got Header');
      chunk.push(currHeaders);
      if (chunk.length === 15) {
        console.log('sending chunk');
        await addSiteCookies('target', chunk);
        chunk = [];
      }
      await request.abort();
    } else {
      await request.continue();
    }
  });
  return page;
}

const generateTarget = async (delay, monitorSetName) => {
  let iterate = true;
  const proxySet = itemIterator((await getProxySet(monitorSetName)).proxies);
  let page = await createPage(proxySet.random());
  let cnt = 0;
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'ob',
        message: 'Done:',
      },
    ])
    .then(async () => {
      iterate = false;
      await (await page.browser()).close();
    });
  while (iterate) {
    await page.goto(`https://gsp.target.com/gsp/authentications/v1/auth_codes?client_id=ecom-web-1.0.0&state=${Date.now()}&redirect_uri=https%3A%2F%2Fwww.target.com%2F&assurance_level=M`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', `${crypto.randomBytes(10).toString('hex')}@gmail.com`);
    await page.type('input[name="password"]', crypto.randomBytes(10).toString('hex'));
    await page.click('#login');
    const client = await page.target().createCDPSession();	
    await client.send('Network.clearBrowserCookies');
    await sleep(delay);
    cnt += 1;
    if (cnt % 15 === 0) {
      await (await page.browser()).close();
      page = await createPage(proxySet.random());
    }
  }
}

module.exports = {
  generateTarget,
};