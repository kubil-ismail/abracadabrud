import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';
import { logout } from '../../redux/reducers/authenticationSlice';
import { decrypt } from 'lib/Aes.v2';

export const membershipApi = createApi({
  reducerPath: 'membershipApi',
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
    },
    // on response error 401
    handleResponse: (response, { getState, dispatch }) => {
      if (response.status === 401) {
        dispatch(logout());
      }
      return response;
    }
  }),
  endpoints: (builder) => ({
    getMemberships: builder.query({
      query: () => ({
        url: '/memberships'
      })
    }),
    getMembership: builder.query({
      query: ({ membershipId }) => ({
        url: `/memberships/${membershipId}`
      })
    }),
    getEventMembership: builder.query({
      query: ({ eventId }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/events/${eventId}/event-memberships`,
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    getPremiumContent: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/premium-content`,
        method: 'GET'
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
  useGetMembershipsQuery,
  useGetMembershipQuery,
  useGetEventMembershipQuery,
  useGetPremiumContentQuery
} = membershipApi;
