# Payu node SDK

## Installation

Install package:

    $ npm install payu-sdk

  OR

    $ yarn add payu-sdk

## Usage


Next, you need to bootstrap using key and salt by following:
key & salt can be found in your payu dashboard

```js
const payu = require('payu-sdk')({
  key: '<payu_key>',
  salt:  '<payu_salt>', // should be on server side only
});
```

It is recommended to keep key and salt as env variables so that they are not pushed to git accidentally

### Hash API

```js
const hash = payu.hasher.generateHash({
  txnid: '20201223',
  amount: '1000',
  productinfo: 'iPhone',
  firstname: 'Ashish',
  email: 'ashish.25@mailinator.com',
});
```

# Verify reverse hash received from payu after checkout
```js
const reverseHash = '<payu_hash>' // hash received after payment from payu
const txnStatus = '<payu_txn_status>' // status received after payment from payu
const isValidHash = payu.hasher.validateHash(reverseHash, {
  txnid: '20201223',
  amount: '1000',
  productinfo: 'iPhone',
  firstname: 'Ashish',
  email: 'ashish.25@mailinator.com',
  status: txnStatus,
})
```
