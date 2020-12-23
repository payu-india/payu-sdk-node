const { generateHash: generateHashUtil, validateHash: validateHashUtil } = require('./payu/hash');
const pkg = require('../package.json');

function PayU(config) {
  const { key, salt } = config;

  if (!key || !salt) {
    throw new Error(`key/salt is mandatory. Set is using require('payu-sdk')({
      key: <your_key>,
      salt: <your_salt>,
    });`;
  }

  return {
    hasher: {
      generateHash: (params = {}) => generateHashUtil({...params, key, salt }),
      validateHash: (hash, params = {}) => validateHashUtil(hash, { ...params, key, salt }),
    },
    VERSION: pkg.version,
  }
}


module.exports = PayU;
