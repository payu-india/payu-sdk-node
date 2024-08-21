import { generateHash as generateHashUtil, validateHash as validateHashUtil } from './payu/hasher';
import type {Params,HashParams} from './payu/hasher'
interface PayUConfig {
  key: string;
  salt: string;
}

interface PayU {
  hasher: {
    generateHash: (params: Omit<Params , 'key'|'salt'>) => string;
    validateHash: (hash: string, params: Omit<HashParams,'key'|'salt'>) => boolean;
  };
  VERSION: string;
}

function PayU(config: PayUConfig): PayU {
  const { key, salt } = config;

  if (!key || !salt) {
    throw new Error(`key/salt is mandatory. Set it using require('payu-sdk')({
      key: <your_key>,
      salt: <your_salt>,
    });`);
  }

  return {
    hasher: {
      generateHash: (params) => generateHashUtil({ ...params, key, salt }),
      validateHash: (hash, params ) => validateHashUtil(hash, { ...params, key, salt }),
    },
    VERSION: "1.2.0",
  };
}

export = PayU;
