const atob = require('atob');

const {
  captchaIpQuestions,
} = require('../inquirers/solvers');

const {
  getCaptchaCookies,
  getCaptchaAccounts,
  saveCaptchaCookies,
  getBrowserPath,
  parseProxy,
} = require('../utils');

const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const tough = require('tough-cookie');

const inquirer = require('inquirer');

puppeteer.use(pluginStealth());

class CaptchaSolver {
  constructor(manager, page, proxy) {
    this.manager = manager;
    this.page = page;
    this.proxy = proxy;
    this.free = true;
  }

  async loadCaptcha(options) {
    const { task: { type } } = options;
    switch (type) {
      case 'recaptcha':
        this.loadNormalCaptcha(options);
        break;
      case 'px':
        this.loadPxCaptcha(options);
        break;
    }
  }

  async loadPxCaptcha(options) {
    const { manager, page, proxy } = this;
    const { task, task: { pxUrl } } = options;
    this.free = false;
    await page.setRequestInterception(true);

    page.on('request', async req => {
      const pageUrl = req.url();
      if (req._method === 'POST' && pageUrl.includes('bundle')) {
        req.continue();
        await sleep(2000);
        const cookies = await page.cookies();
        const px3 = cookies.filter(ckie => ckie.name === '_px3')[0];
        task.gettingCaptcha = false;
        task.px3 = new tough.Cookie({
          key: px3.name,
          value: px3.value,
          domain: '.walmart.com'
        });
        task.handlePxCaptcha();
        this.free = true;
        const browser = await page.browser();
        const newPage = await browser.newPage();
        if (proxy && proxy.auth) {
          await newPage.authenticate({
            username: proxy.auth.username,
            password: proxy.auth.password,
          });
        }
        const originalPage = (await browser.pages())[0];
        await originalPage.close();
        this.page = newPage;
        manager.alert(this);
      } else {
        req.continue();
      }
    });

    await page.goto(pxUrl);
  }

  async loadNormalCaptcha(options) {
    const { manager, page, proxy } = this;
    const { task, sitekey, host } = options;

    await page.setRequestInterception(true);

    this.free = false;

    await page.exposeFunction('sendCaptcha', async token => {
      task.gettingCaptcha = false;
      task.recaptchaToken = token;
      task.handleCaptcha();
      this.free = true;
      const browser = await page.browser();
      const newPage = await browser.newPage();
      if (proxy && proxy.auth) {
        await newPage.authenticate({
          username: proxy.auth.username,
          password: proxy.auth.password,
        });
      }
      const originalPage = (await browser.pages())[0];
      await originalPage.close();
      this.page = newPage;
      manager.alert(this);
    });

    const captchaTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Captcha Harvester</title>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        <style>
          .flex {
            display: flex;
          }
          .justify-center {
            justify-content: center;
          }
          .items-center {
            align-items: center;
          }
          .mt-6 {
            margin-top: 1.5rem;
          }
        </style>
      </head>
      <body>
        <div class="flex justify-center items-center mt-6">
          <div id="captchaFrame" class="g-recaptcha" data-callback="sendCaptcha" data-sitekey=${sitekey} data-theme="dark"></div>
        </div>
      </body>
      </html>
    `;

    page.on('request', req => {
      if (req.url() === host) {
        req.respond({
          status: 200,
          contentType: 'text/html',
          body: captchaTemplate,
        });
      } else {
        req.continue();
      }
    });

    await page.goto(host);
  }
}

const createCaptchaHarvester = async (proxy) => {
  const browserPath = await getBrowserPath();
  const options = {
    headless: false,
    devtools: false,
    executablePath: browserPath || './chromium/chrome.exe',
    slowMo: 10,
    width: 1080,
    height: 750,
  }
  if (proxy) {
    options.args = [
      `--proxy-server=http://${proxy.host}:${proxy.port}`,
      '--no-sandbox',
      '--ignore-certificate-errors',
      '--enable-features=NetworkService',
      '--allow-running-insecure-content',
      '--disable-web-security',
      `--window-size=${options.width},${options.height}`,
    ];
  } else {
    options.args = [
      '--no-sandbox',
      '--ignore-certificate-errors',
      '--enable-features=NetworkService',
      '--allow-running-insecure-content',
      '--disable-web-security',
      `--window-size=${options.width},${options.height}`,
    ];
  }
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  const originalPage = (await browser.pages())[0];
  await originalPage.close();
  if (proxy && proxy.auth) {
    await page.authenticate({
      username: proxy.auth.username,
      password: proxy.auth.password,
    });
  }

  await page.setUserAgent(
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36`
  );

  await page.setViewport({
    width: 1080,
    height: 750,
  });

  return page;
}

const addCaptchaHarvester = async (manager, ask = true) => {
  manager.solvers.push({});
  let proxy;
  if (ask) {
    const { proxyStr } = await inquirer.prompt(captchaIpQuestions);
    proxy = parseProxy(proxyStr);
  } else {
    proxy = undefined;
  }
  const page = await createCaptchaHarvester(proxy);
  manager.solvers.pop();
  const captchaSolver = new CaptchaSolver(manager, page, proxy);
  manager.solvers.push(captchaSolver);
}

const removeCaptchaHarvester = async (manager) => {
  const { choice } =  await inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'Which Solver Do You Want To Remove?',
    choices: Object.keys(manager.solvers)
  }]);
  const solver = manager.solvers.splice(choice, 1)[0];
  const browser = await solver.browser();
  await browser.close();
}

const saveGmailCookies = async (manager) => {
  const { choice } =  await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Which Solver Do You Want to Save?',
      choices: Object.keys(manager.solvers)
    }
  ]);
  const solver = manager.solvers[choice].page;
  await solver.goto('https://accounts.google.com/signin/v2/identifier?hl=en&continue=https%3A%2F%2Fmail.google.com%2Fmail&service=mail&ec=GAlAFw&flowName=GlifWebSignIn&flowEntry=AddSession');
  const { gmail } = await inquirer.prompt([{
    type: 'input',
    name: 'gmail',
    message: 'Save To Account When You Are Finished Logging In'
  }]);
  const rawCookies = await solver.cookies();
  const acc = {
    name: gmail,
    cookies: rawCookies,
  }
  await saveCaptchaCookies(acc);
}

const loadGmailCookies = async (manager) => {
  const { choice, gmail } =  await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Which Solver Do You Want to Load?',
      choices: Object.keys(manager.solvers)
    },
    {
      type: 'list',
      name: 'gmail',
      choices: Object.keys(await getCaptchaAccounts())
    }
  ]);
  const solver = manager.solvers[choice].page;
  const captchaCookies = await getCaptchaCookies(gmail);
  await solver.setCookie(...captchaCookies);
}

const testCaptcha = async (manager) => {
  manager.queue({
    siteName: 'walmart',
  })
}

module.exports = {
  addCaptchaHarvester,
  removeCaptchaHarvester,
  loadGmailCookies,
  saveGmailCookies,
  testCaptcha,
};
