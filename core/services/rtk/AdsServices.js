import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';
import { decrypt } from 'lib/Aes.v2';

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiService.defaults.baseURL }),
  endpoints: (builder) => ({
    getAdsSponsor: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/partner-videos`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    getRunningText: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/running-text`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    })
  })
});

export const { useGetAdsSponsorQuery, useGetRunningTextQuery } = adsApi;
