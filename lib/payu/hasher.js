const crypto = require("crypto");

const EMAIL_REGEX =
  /^(?=.{6,254}$)[A-Za-z0-9_\-\.]{1,64}\@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,}$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

function validateParams(params) {
  Object.keys(params).forEach((k) => {
    if (typeof params[k] !== "string") {
      throw new TypeError(`TypeError: Param "${k}" required of type String`);
    }
  });
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  } = params;

  if (!EMAIL_REGEX.test(email)) {
    throw new Error("ArgumentError: Invalid Email");
  }
  if (!AMOUNT_REGEX.test(amount)) {
    throw new Error(
      "ArgumentError: amount should contain digits with upto 2 decimal places"
    );
  }
  if (txnid.length > 25) {
    throw new Error(
      "ArgumentError: txnid length should be less than equal to 25"
    );
  }
  if (productinfo.length > 100) {
    throw new Error(
      "ArgumentError: productinfo length should be less than equal to 100"
    );
  }
  if (firstname.length > 60) {
    throw new Error(
      "ArgumentError: firstname length should be less than equal to 60"
    );
  }
  if (email.length > 50) {
    throw new Error(
      "ArgumentError: email length should be less than equal to 50"
    );
  }
  [udf1, udf2, udf3, udf4, udf5].forEach((udf) => {
    if (udf.length > 255) {
      throw new Error(
        "ArgumentError: udf length should be less than equal to 255"
      );
    }
  });
}

function generateHash({
  key,
  salt,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
} = {}) {
  validateParams({
    key,
    salt,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  });
  const cryp = crypto.createHash("sha512");
  const text =
    key +
    "|" +
    txnid +
    "|" +
    amount +
    "|" +
    productinfo +
    "|" +
    firstname +
    "|" +
    email +
    "|" +
    udf1 +
    "|" +
    udf2 +
    "|" +
    udf3 +
    "|" +
    udf4 +
    "|" +
    udf5 +
    "||||||" +
    salt;
  cryp.update(text);
  return cryp.digest("hex");
}

/* Response received from Payment Gateway at this page.
It is absolutely mandatory that the hash (or checksum) is computed again after you receive response from PayU and compare it with request and post back parameters. This will protect you from any tampering by the user and help in ensuring a safe and secure transaction experience. It is mandate that you secure your integration with PayU by implementing Verify webservice and Webhook/callback as a secondary confirmation of transaction response.

Hash string without Additional Charges -
hash = sha512(SALT|status||||||udf5|||||email|firstname|productinfo|amount|txnid|key)

With additional charges - 
hash = sha512(additionalCharges|SALT|status||||||udf5|||||email|firstname|productinfo|amount|txnid|key)

*/

function validateHash(
  hash,
  {
    key,
    salt,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    status,
    additionalCharges,
  } = {}
) {
  validateParams({
    key,
    salt,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
  });
  if (typeof status !== "string") {
    throw new TypeError('TypeError: Param "status" required of type String');
  }
  // const keyString =
  //   key +
  //   "|" +
  //   txnid +
  //   "|" +
  //   amount +
  //   "|" +
  //   productinfo +
  //   "|" +
  //   firstname +
  //   "|" +
  //   email +
  //   "|" +
  //   udf1 +
  //   "|" +
  //   udf2 +
  //   "|" +
  //   udf3 +
  //   "|" +
  //   udf4 +
  //   "|" +
  //   udf5 +
  //   "|||||";
  // const keyArray = keyString.split("|");
  // const reverseKeyArray = keyArray.reverse();
  // let reverseKeyString = salt + "|" + status + "|" + reverseKeyArray.join("|");
  reverseKeyString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  if (additionalCharges) {
    reverseKeyString = additionalCharges + "|" + reverseKeyString;
  }
  const cryp = crypto.createHash("sha512");
  cryp.update(reverseKeyString);
  const calchash = cryp.digest("hex");
  return calchash === hash;
}

module.exports = {
  generateHash,
  validateHash,
};
