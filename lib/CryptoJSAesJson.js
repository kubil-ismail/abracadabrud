/**
 * AES JSON formatter for CryptoJS
 * @link https://github.com/brainfoolong/cryptojs-aes-php
 * @version 2.1.1
 */
const CryptoJS = require('crypto-js');

const password = process.env.NEXT_PUBLIC_AES_KEY;
class CryptoJSAesJson {
  /**
   * Encrypt any value
   * @param {*} value
   * @param {string} password
   * @return {string}
   */
  static encrypt(value) {
    const str = CryptoJS.AES.encrypt(JSON.stringify(value), password, {
      format: CryptoJSAesJson
    }).toString();
    return Buffer.from(str).toString('base64');
  }

  /**
   * Decrypt a previously encrypted value
   * @param {string} jsonStr
   * @param {string} password
   * @return {*}
   */
  static decrypt(value) {
    const jsonStr = Buffer.from(value, 'base64').toString();
    return JSON.parse(
      CryptoJS.AES.decrypt(jsonStr, password, { format: CryptoJSAesJson }).toString(
        CryptoJS.enc.Utf8
      )
    );
  }

  /**
   * Stringify cryptojs data
   * @param {Object} cipherParams
   * @return {string}
   */
  static stringify(cipherParams) {
    const j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j).replace(/\s/g, '');
  }

  /**
   * Parse cryptojs data
   * @param {string} jsonStr
   * @return {*}
   */
  static parse(jsonStr) {
    const j = JSON.parse(jsonStr);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct)
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  }
}
export default CryptoJSAesJson;
