import axios from 'axios';
import resolveResponseMessage from '../resolveResponseMessage';
import rateLimit from 'axios-rate-limit';

const ssApiService = rateLimit(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    // adapter: cache.adapter
  }),
  { maxRequests: 4, perMilliseconds: 1000, maxRPS: 2 }
);

ssApiService.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => Promise.reject(error)
);

ssApiService.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      response.data.message = resolveResponseMessage(response.data.message);
    }
    return response;
  },
  (error) => {
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

export default ssApiService;
