import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';

export const globalApi = createApi({
  reducerPath: 'globalApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiService.defaults.baseURL }),
  endpoints: (builder) => ({
    getGenres: builder.query({
      query: ({ all = true }) => ({
        url: '/genres',
        params: { all }
      })
    }),
    getSeo: builder.query({
      query: ({ path }) => ({
        url: `/seo-settings/${Buffer.from(path).toString('base64')}`
      })
    }),
    hasUpload: builder.query({
      query: ({ eventId }) => ({
        url: `/videos/events/${eventId}/hasUpload`
      })
    })
  })
});

export const { useGetGenresQuery, useGetSeoQuery, useHasUploadQuery } = globalApi;
