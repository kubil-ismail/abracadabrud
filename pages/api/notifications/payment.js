// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import getCredential from 'core/services/helpers/getCredential';
import { encrypt } from 'lib/Aes.v2';

export default function handler(req, res) {
  const { page, page_size, types } = req.query;
  const { _token } = getCredential({ req }) || {};

  if (req.method !== 'GET') {
    res.status(400).json({
      message: 'Page not found'
    });
  }

  axios
    .get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications?page=${page}&page_size=${page_size}&types=${types}`,
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
