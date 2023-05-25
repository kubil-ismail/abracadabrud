const crypto = require('crypto');

const ENC_KEY = 'aDhyvGE4CAm1FjoQhkke/mBKAuLFmEZWrHAGeN3z+uc=';
const IV = '5183666c72eec9e4';

class Aes {
  static encrypt = (val) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  };

  static decrypt = (encrypted) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    const decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
  };
}
export default Aes;
