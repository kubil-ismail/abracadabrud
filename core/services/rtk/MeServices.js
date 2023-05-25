import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';
import { decrypt } from 'lib/Aes.v2';

export const pointApi = createApi({
  reducerPath: 'pointApi',
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
  tagTypes: [
    'MyEvents',
    'Points',
    'Vote',
    'HistoryPoint',
    'Favorite',
    'VideoPaymentHistory',
    'MembershipPaymentHistory'
  ],
  endpoints: (builder) => ({
    getMyEvents: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/events?all`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['MyEvents']
    }),
    getMyVideos: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/videos`,
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['MyEvents']
    }),
    getPoints: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/points/me`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['Points']
    }),
    getMyVote: builder.query({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/vote-activity?page=${data?.page}&page_size=${data?.pageSize}`,
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['Vote']
    }),
    getHistoryPoint: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/point-activity?page=${page}&page_size=${pageSize}`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['HistoryPoint']
    }),
    getFavoriteVideo: builder.query({
      query: ({ page = 1, pageSize = 5 }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/favorite-videos?page=${page}&page_size=${pageSize}`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['Favorite']
    }),
    getPaymentsVideo: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/video`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['VideoPaymentHistory']
    }),
    getPaymentsMembership: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/membership`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      providesTags: ['MembershipPaymentHistory']
    }),
    getCurrentEvent: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/points/me/event`
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

export const {
  useGetMyEventsQuery,
  useGetMyVideosQuery,
  useGetMyVoteQuery,
  useGetHistoryPointQuery,
  useGetPointsQuery,
  useGetFavoriteVideoQuery,
  useGetPaymentsVideoQuery,
  useGetPaymentsMembershipQuery,
  useGetCurrentEventQuery
} = pointApi;
