const captchaMap = require('../maps/captcha');
const tough = require('tough-cookie');
const { promisify } = require('util');
const { addCaptchaHarvester } = require('./solvers');

const sleep = promisify(setTimeout);

class CaptchaManager {
  constructor() {
    this.solvers = [];
    this.requests = [];
  }

  async queue(task) {
    const { solvers, requests } = this;
    const { siteName } = task;
    const config = captchaMap[siteName];
    const request = {
      task,
      ...config,
    }
    if (solvers.length == 0) {
      await addCaptchaHarvester(this, false);
    }
    for (const solver of solvers) {
      if (solver.free) {
        solver.loadCaptcha(request);
        return;
      }
    }
    requests.push(request);
  }

  alert(solver) {
    const { requests } = this;
    if (requests.length > 0) {
      const request = requests.shift();
      solver.loadCaptcha(request);
    }
  }
}

module.exports = {
  CaptchaManager
};
