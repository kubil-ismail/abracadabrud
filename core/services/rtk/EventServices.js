import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';
import { decrypt, encrypt } from 'lib/Aes.v2';

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_BASE_URL = process.env.NEXT_PUBLIC_MIDTRANS_BASE_URL;

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiService.defaults.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().authentication;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');
      return headers;
    }
  }),
  tagTypes: [
    'Event',
    'GetContestId',
    'Video',
    'Vote',
    'Comment',
    'Favorite',
    'isFavorite',
    'PaymentMethods',
    'PaymentVideo',
    'PaymentMembership',
    'ActiveMemberships',
    'Video-Cache'
  ],
  endpoints: (builder) => ({
    // Event services start here
    getEvents: builder.query({
      query: (data) => ({
        url: '/events',
        params: data
      })
    }),
    getAllEvents: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-events`
        // url: '/all-events'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    getContestId: builder.query({
      query: () => ({
        url: '/contest-id',
        method: 'GET'
      }),
      providesTags: ['getContestId']
    }),
    getEvent: builder.query({
      query: (id) => ({
        url: `/events/${id}`
      }),
      providesTags: (result, error, arg) =>
        result ? [{ type: 'Event', id: result?.event?.id }] : []
    }),
    enroll: builder.mutation({
      query: (id) => ({
        url: `/events/${id}/enroll`,
        method: 'POST'
      })
    }),
    getVideo: builder.query({
      query: () => ({
        url: '/all-videos-and-ads',
        method: 'GET'
      }),
      providesTags: ['Video']
    }),
    getCachingDataVideo: builder.query({
      query: (props) => {
        return {
          url: `/caching-data-video-ads?page=${props}`,
          method: 'GET'
        };
      }
    }),
    getComments: builder.query({
      query: ({ id, page }) => ({
        url: `/videos/${id}/comments`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) => (result ? [{ type: 'Comment', id: arg.id }] : [])
    }),
    getVotesHistory: builder.query({
      query: ({ id, page }) => ({
        url: `/videos/${id}/get-votes`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) => (result ? [{ type: 'Vote', id: arg.id }] : [])
    }),
    addComments: builder.mutation({
      query: ({ idVideo, idArray, comment }) => ({
        url: `/videos/${idVideo}/comments`,
        method: 'POST',
        body: { comment }
      }),
      invalidatesTags: (result, error, arg) =>
        result ? [{ type: 'Comment', id: arg.idVideo }] : []
    }),
    addVotes: builder.mutation({
      query: ({ id, vote }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/${id}/votes`,
        method: 'POST',
        body: { payload: encrypt({ vote: vote }) }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    addFavorite: builder.mutation({
      query: ({ idVideo }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/favorites`,
        method: 'POST',
        body: { payload: encrypt({ video_id: idVideo }) }
      }),
      async onQueryStarted({ idVideo }, { dispatch, queryFulfilled }) {
        const optimistic = dispatch(
          eventApi.util.updateQueryData('isFavorite', idVideo, (draft) => {
            draft.data = true;
          })
        );

        try {
          await queryFulfilled;
        } catch (err) {
          optimistic.undo();
        }
      }
    }),
    reportVideo: builder.mutation({
      query: ({ idVideo, reasonId, description }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/report`,
        method: 'POST',
        body: { payload: encrypt({ video_id: idVideo, reason_id: reasonId, description }) }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    isFavorite: builder.query({
      query: ({ id }) => ({
        url: `/videos/${id}/is-favorite`,
        method: 'GET'
      }),
      transformResponse: (response) => response.data.is_favorite,
      providesTags: (result, error, arg) => (result ? [{ type: 'isFavorite', id: arg.id }] : [])
    }),
    getFavorites: builder.query({
      query: ({ id }) => ({
        url: `/videos/${id}/all-favorites`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Favorite', id })), 'Favorite']
          : ['Favorite']
    }),
    getFavoritesHistory: builder.query({
      query: ({ id }) => ({
        url: `/videos/${id}/favorites-history`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) => (result ? [{ type: 'Favorite', id: arg.id }] : [])
    }),
    enrollEvent: builder.mutation({
      query: ({ eventId }) => ({
        url: `/events/${eventId}/enroll`,
        method: 'POST'
      })
    }),
    getEventLuckyDraw: builder.query({
      query: ({ locale, eventId }) => ({
        url: `/events/${eventId}/lucky-draw`,
        params: { locale }
      })
    }),
    getShowVideo: builder.query({
      query: ({ id }) => ({
        url: `/videos/${id}`
        // params: { locale },
      })
    }),
    uploadVideo: builder.mutation({
      query: ({ contest_id, artist_id, genre_ids, video_url, caption }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/performer-video`,
        method: 'POST',
        body: {
          payload: encrypt({ contest_id, artist_id, genre_ids, video_url, caption })
        }
      }),
      invalidatesTags: ['Video']
    }),
    enrollUserToAllEvents: builder.mutation({
      query: () => ({
        url: '/auth/enroll-user-to-every-event',
        method: 'GET'
      })
    }),
    getGenres: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/genres`
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    // Event services end here

    // Payment services start here
    canUpload: builder.query({
      query: ({ eventId }) => ({
        url: `events/${eventId}/can-upload`,
        method: 'GET'
      })
    }),
    getPaymentMethods: builder.query({
      query: ({ platform }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/method?payment_platform=${platform}`,
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result)?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      },
      providesTags: ['PaymentMethods']
    }),
    checkoutVideo: builder.mutation({
      query: (data) => ({
        url: '/checkout/video',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['PaymentVideo']
    }),
    getStatusPaymentVideo: builder.query({
      query: ({ event_contest_id }) => ({
        url: `/payments/video/check`,
        method: 'GET',
        params: { event_contest_id }
      }),
      providesTags: (result, error, arg) =>
        result ? [{ type: 'PaymentVideo', id: arg.event_contest_id }] : []
    }),
    getPaymentVideoId: builder.query({
      query: ({ video_contest_id }) => ({
        url: `/payments/video/${video_contest_id}`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) =>
        result ? [{ type: 'PaymentVideo', id: arg.video_contest_id }] : []
    }),
    cancelVideoPayment: builder.mutation({
      query: ({ video_contest_id }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/video/cancel`,
        method: 'POST',
        body: { payload: encrypt({ video_payment_id: video_contest_id }) }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      },
      invalidatesTags: ['PaymentVideo']
    }),
    cancelPointsPayment: builder.mutation({
      query: ({ buy_points_payment_id }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/points/cancel`,
        method: 'POST',
        body: { payload: encrypt({ buy_points_payment_id: buy_points_payment_id }) }
      }),
      invalidatesTags: ['PaymentVideo']
    }),
    checkoutMembership: builder.mutation({
      query: (data) => ({
        url: '/checkout/membership',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['PaymentMembership']
    }),
    getStatusPaymentMembership: builder.query({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/membership/check`,
        method: 'GET',
        params: {
          event_contest_id: data.event_contest_id,
          membership_id: data.membership_id
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result)?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      },
      providesTags: (result, error, arg) =>
        result ? [{ type: 'PaymentMembership', id: arg.event_contest_id }] : []
    }),
    getPaymentMembershipId: builder.query({
      query: ({ membership_id }) => ({
        url: `/payments/membership/${membership_id}`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) =>
        result ? [{ type: 'PaymentMembership', id: arg.membership_id }] : []
    }),
    cancelMembershipPayment: builder.mutation({
      query: ({ membership_id }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/membership/cancel`,
        method: 'POST',
        body: { payload: encrypt({ membership_payment_id: membership_id }) }
      }),
      invalidatesTags: ['PaymentMembership']
    }),
    activeMemberships: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/active-memberships-v2`,
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result)?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      },
      providesTags: ['ActiveMemberships']
    }),
    getEventsAll: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/historyevent`,
        method: 'GET'
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      }
    }),
    checkStatusEnroll: builder.query({
      query: () => ({
        url: '/event/check-status-enroll',
        method: 'GET'
      })
    })
    // Payment services end here
  })
});

export const {
  // Event services start here
  useGetEventsQuery,
  useGetAllEventsQuery,
  useGetContestIdQuery,
  useGetEventQuery,
  useEnrollMutation,
  useGetVideoQuery,
  useGetCommentsQuery,
  useGetVotesHistoryQuery,
  useGetShowVideoQuery,
  useAddCommentsMutation,
  useAddVotesMutation,
  useAddFavoriteMutation,
  useReportVideoMutation,
  useIsFavoriteQuery,
  useGetFavoritesQuery,
  useGetFavoritesHistoryQuery,
  useEnrollEventMutation,
  useGetEventLuckyDrawQuery,
  useUploadVideoMutation,
  useEnrollUserToAllEventsMutation,
  useGetGenresQuery,
  useGetEventsAllQuery,
  useCheckStatusEnrollQuery,
  // Event services end here

  // Payment services start here
  useCanUploadQuery,
  useGetPaymentMethodsQuery,
  useCheckoutVideoMutation,
  useGetStatusPaymentVideoQuery,
  useGetPaymentVideoIdQuery,
  useCheckoutMembershipMutation,
  useGetStatusPaymentMembershipQuery,
  useGetPaymentMembershipIdQuery,
  useCancelVideoPaymentMutation,
  useCancelPointsPaymentMutation,
  useCancelMembershipPaymentMutation,
  useActiveMembershipsQuery,
  useGetCachingDataVideoQuery
  // Payment services end here
} = eventApi;

export const midtransApi = createApi({
  reducerPath: 'midtransApi',
  baseQuery: fetchBaseQuery({
    baseUrl: MIDTRANS_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // const token = getState().authentication.token;
      // if (token) {
      //     headers.set('Authorization', `Bearer ${token}`);
      // }
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getCCToken: builder.mutation({
      query: ({ card_number, card_exp_month, card_exp_year, card_cvv }) => ({
        url: '/token?client_key=' + MIDTRANS_CLIENT_KEY,
        method: 'GET',
        params: { card_number, card_exp_month, card_exp_year, card_cvv }
      })
    })
  })
});

export const { useGetCCTokenMutation } = midtransApi;
