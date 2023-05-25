// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import { encrypt } from 'lib/Aes.v2';
import getCredential from 'core/services/helpers/getCredential';

export default function handler(req, res) {
  const { _token } = getCredential({ req }) || {};
  const eventId = req.query?.id;
  const page = req.query?.page;

  if (req.method !== 'GET') {
    res.status(400).json({
      message: 'Page not found'
    });
  }

  axios
    .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/contestants/events/${eventId}/most-voted`, {
      headers: { Authorization: `Bearer ${_token}` },
      params: {
        page
      }
    })
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
