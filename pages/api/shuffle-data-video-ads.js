// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import getCredential from 'core/services/helpers/getCredential';
import { encrypt } from 'lib/Aes.v2';

export default function handler(req, res) {
  const { _token } = getCredential({ req }) || {};

  if (req.method !== 'GET') {
    res.status(400).json({
      message: 'Page not found'
    });
  }

  const sort = req?.query?.sort;
  const search = req?.query?.search;
  const start_date = req?.query?.start_date;
  const end_date = req?.query?.end_date;
  const event_id = req?.query?.event_id;

  axios
    .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/shuffle-data-video-ads`, {
      params: {
        sort,
        search,
        start_date,
        end_date,
        event_id
      },
      headers: { Authorization: _token ? `Bearer ${_token}` : null }
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
