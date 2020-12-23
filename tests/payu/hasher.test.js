const { generateHash, validateHash } = require('../../lib/payu/hasher');

describe('hash.generateHash', () => {
  describe('missing parameters', () => {
    it('should throw error', async () => {
      expect(() => generateHash({
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
      })).toThrow(TypeError);
    });
  });

  describe('invalid parameters', () => {
    it('should throw error', async () => {
      expect(() => generateHash({
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
        amount: 1000,
        productinfo: 'mobile',
        firstname: 'Jacob',
        email: 'test@payu.in',
      })).toThrow(TypeError);
    });
  });

  describe('valid parameters', () => {
    it('should generateHash and return String', async () => {
      expect(generateHash({
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
        amount: '1000',
        productinfo: 'mobile',
        firstname: 'Jacob',
        email: 'test@payu.in',
      })).toBe('19d0822939b32b371847521c89aba3521de3a9bfeabeee5dab2d6f41962ff9fcdcee87067bb3a3de870acce488f9ff88a3511bb78c6143344a277b1b91ad38b8');
    });
  });

});


describe('hash.validateHash', () => {
  describe('missing parameters', () => {
    it('should throw error', async () => {
      expect(() => validateHash('reverse_hash', {
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
      })).toThrow(TypeError);
    });
  });

  describe('invalid parameters', () => {
    it('should throw error', async () => {
      expect(() => validateHash('reverse_hash', {
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
        amount: 1000,
        productinfo: 'mobile',
        firstname: 'Jacob',
        email: 'test@payu.in',
      })).toThrow(TypeError);
    });
  });

  describe('valid parameters', () => {
    it('should validate hash and return false', async () => {
      expect(validateHash('19d0822939b32b371847521c89aba3521de3a9bf', {
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
        amount: '1000',
        productinfo: 'mobile',
        firstname: 'Jacob',
        email: 'test@payu.in',
        status: 'success',
      })).toBeFalsy();
    });


    it('should validate hash and return true', async () => {
      const reverseHash = `687c82156a84271a7a6c63d0e8774d5ac567d9b894a334a47d72e47b72392a5167a1b2add5b253490b70731d9eb3e3a3b7225e0c5f26829befafbbee71977c4c`;
      expect(validateHash(reverseHash, {
        key: 'bjg$121',
        salt: 'vhgvs75',
        txnid: '3123',
        amount: '1000',
        productinfo: 'mobile',
        firstname: 'Jacob',
        email: 'test@payu.in',
        status: 'success',
      })).toBeTruthy();
    });

  });

});