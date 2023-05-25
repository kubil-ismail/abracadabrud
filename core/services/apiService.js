import axios from 'axios';
import resolveResponseMessage from './resolveResponseMessage';
import Aes from '../../lib/CryptoJSAesJson';
import CryptoJS from 'crypto-js';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const apiService = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_API_URL || 'https://dev.cms.abracadabra-starquest.events/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

apiService.interceptors.request.use(
  (config) => {
    const { token } = store.getState().authentication;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const fieldToEncrypts = [
      'identity',
      'password',
      'password_confirmation',
      'new_password',
      'new_password_confirmation',
      'old_password',
      'email',
      'otp'
    ];
    if (config?.method === 'post') {
      fieldToEncrypts?.forEach((field) => {
        if (config?.data?.[field]) {
          try {
            config.data[field] = Aes.encrypt(config.data[field]);
          } catch (error) {
            console.log(error);
          }
        }
      });
    }

    config.headers['Access-Control-Allow-Origin'] = '*';

    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) => {
    if (response?.data?.encrypt) {
      const bytes = CryptoJS.AES.decrypt(response?.data?.result, 'secret key 123');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    }

    if (response.data.message) {
      response.data.message = resolveResponseMessage(response.data.message);
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch({ type: 'authentication/logout' });
    }

    if (error?.response?.data) {
      const resolveError = error.response.data;
      resolveError.code = error.response.status;
      if (resolveError.message) {
        resolveError.message = resolveResponseMessage(resolveError.message);
      }
      if (resolveError.errors) {
        const errors = {};
        Object.keys(resolveError.errors).forEach((key) => {
          errors[key] = resolveResponseMessage(resolveError.errors[key][0]);
        });
        resolveError.errors = errors;
      }
      return Promise.reject(resolveError);
    }

    return Promise.reject(error);
  }
);

export default apiService;
