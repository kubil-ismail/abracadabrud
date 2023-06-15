// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import { encrypt, decrypt } from 'lib/Aes.v2';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      message: 'Page not found'
    });
  }

  axios
    .post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/forgot-password`,
      decrypt(req.body?.payload)
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
