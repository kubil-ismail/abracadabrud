import CryptoJS from 'crypto-js';

export const decrypt = (response) => {
  const bytes = CryptoJS.AES.decrypt(response, 'secret key 123');
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};

export const encrypt = (response) => {
  return CryptoJS.AES.encrypt(JSON.stringify(response), 'secret key 123').toString();
};


export const encryptId = (response) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(response));
};
