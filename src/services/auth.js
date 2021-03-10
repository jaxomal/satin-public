const { addToken, getToken, deleteToken, addKey } = require('../utils');
const request = require('request');
const { promisify } = require('util');
const inquirer = require('inquirer');
const machineUuid = require('machine-uuid');
const { keyQuestions } = require('../inquirers/main');
const os = require('os');
const atob = require('atob');
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
  'f82b93e4b31948fbe84348544058ff6c',
  'f20f25a2ee186e9c46fe548155980886'
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
            console.log(hash);
            req.abort();
            process.exit(0);
          }
        }
      });
    });
  })
}

const auth = async () => {
  try {
    const existingToken = await getToken();
    if (existingToken) {
      const tokenRes = await checkToken(existingToken);
      if (tokenRes) {
        return true;
      }
    }
    const { key } = await inquirer.prompt([{
      type: 'input',
      message: 'Key: ',
      name: 'key',
    }]);
    await addKey(key);
    const activationRes = await createActivation(key);
    return activationRes;
  } catch (e) {
    return false;
  }
}

const checkToken = async (token) => {
}

const createActivation = async (key) => {
}


module.exports = {
  auth,
};
