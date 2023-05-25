import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';

const page_size = 2;

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
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
    }),
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ types, page }) => ({
                url: '/notifications',
                params: {
                    page_size: 10,
                    page: page,
                    types: types,
                },
            }),
            transformResponse: (response) => {
                return response.data;
            }
        }),
        getPaymentNotifications: builder.query({
            query: ({ page }) => ({
                url: '/notifications',
                params: {
                    page_size: page_size,
                    page: page,
                    types: 'payment',
                },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: (result, error, arg) => [
                { type: 'Notification', id: 'payment', page: arg.page },
            ],
            // Only have one cache entry because the arg always maps to one string
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data)
            },
            // Refetch when the page arg changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
        getWinnerNotifications: builder.query({
            query: ({ page }) => ({
                url: '/notifications',
                params: {
                    page_size: page_size,
                    page: page,
                    types: 'winner',
                },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: (result, error, arg) => [
                { type: 'Notification', id: 'winner', page: arg.page },
            ],
            // Only have one cache entry because the arg always maps to one string
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data)
            },
            // Refetch when the page arg changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
        getVoteNotifications: builder.query({
            query: ({ page }) => ({
                url: '/notifications',
                params: {
                    page_size: page_size,
                    page: page,
                    types: 'vote',
                },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: (result, error, arg) => [
                { type: 'Notification', id: 'vote', page: arg.page },
            ],
            // Only have one cache entry because the arg always maps to one string
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data)
            },
            // Refetch when the page arg changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetPaymentNotificationsQuery,
    useGetWinnerNotificationsQuery,
    useGetVoteNotificationsQuery,
} = notificationApi;