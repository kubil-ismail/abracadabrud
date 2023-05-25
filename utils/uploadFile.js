import axios from 'axios';

const apiService = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_API_URL || 'https://staging.cms.abracadabra-starquest.events/api',
  headers: {
    Accept: 'application/json'
  }
});

export default function upload({ url, file, field, token }, cb) {
  const body = new FormData();
  body.append([field], file);

  apiService
    .post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => cb(res))
    .catch((err) => cb(err));
}
