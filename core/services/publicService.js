import axios from 'axios';
import CryptoJS from 'crypto-js';

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

apiService.interceptors.response.use((response) => {
  if (response?.data?.encrypt) {
    const bytes = CryptoJS.AES.decrypt(response?.data?.result, 'secret key 123');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
  }

  return response;
});

export default apiService;
