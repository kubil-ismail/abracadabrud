import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';

export const homeFeedsApi = createApi({
  reducerPath: 'homeFeedsApi',
  tagTypes: ['Video', 'Ads', 'Ftv'],
  baseQuery: fetchBaseQuery({
    baseUrl: apiService.defaults.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().authentication;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // new home feeds query
    getVideos: builder.query({
      query: (data) => ({
        url: '/get-data-video-ads',
        method: 'GET',
      }),
      providesTags: ['Video'],
      merge: (existing, incoming) => {
        if (!existing) return incoming;
        return {
          ...incoming,
          data: [...existing.data, ...incoming.data],
        };
      },
      forceRefetch: (a, b) => {
        return a.page !== b.page;
      },
    }),
    getFtv: builder.query({
      query: (data) => ({
        url: '/ftv',
        method: 'GET',
      }),
      providesTags: ['Ftv'],
    }),
    getAdsList: builder.query({
      query: (data) => ({
        url: '/ads-list',
        method: 'GET',
        params: {
          page: data.page,
        },
      }),
      providesTags: ['Ads'],
      merge: (existing, incoming) => {
        if (!existing) return incoming;
        return {
          ...incoming,
          data: [...existing?.data?.data, ...incoming?.data?.data],
        };
      },
      forceRefetch: (a, b) => {
        return a.page !== b.page;
      },
    }),
  })
})

export const { useGetVideosQuery, useGetFtvQuery, useGetAdsListQuery } = homeFeedsApi;
