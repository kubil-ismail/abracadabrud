// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import getCredential from 'core/services/helpers/getCredential';
import { encrypt } from 'lib/Aes.v2';

export default function handler(req, res) {
  const { _token } = getCredential({ req }) || {};
  const payment_platform = req.query?.payment_platform;

  if (req.method !== 'GET') {
    res.status(400).json({
      message: 'Page not found'
    });
  }

  axios
    .get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/method?payment_platform=${payment_platform}`,
      {
        headers: { Authorization: `Bearer ${_token}` }
      }
    )
    .then((result) => {
      res.status(200).json({
        result: encrypt(result?.data),
        encrypt: true
      });
    })
    .catch((result) => {
      res.status(result?.response?.status ?? 500).json({
        result: encrypt(result?.response?.data),
        encrypt: true
      });
    });
}
