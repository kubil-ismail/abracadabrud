import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';

export const profilesApi = createApi({
  reducerPath: 'profilesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiService.defaults.baseURL }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ id }) => ({
        url: `/profiles/${id}`
      })
      // transformResponse: (response) => response?.data?.data
    }),
    getMostPoint: builder.query({
      query: ({ eventId, data }) => ({
        url: `points/event/${eventId}/most-points?page=1&with_exits_winner=1`,
        params: data
      }),
      transformResponse: (response) => response?.data?.points
    }),
    getMostVoted: builder.query({
      query: ({ eventId, data }) => ({
        url: `/contestants/events/${eventId}/most-voted`,
        params: data
      })
      // transformResponse: (response) => response?.contestants?.data
    })
  })
});

export const { useGetUserQuery, useGetMostPointQuery, useGetMostVotedQuery } = profilesApi;
