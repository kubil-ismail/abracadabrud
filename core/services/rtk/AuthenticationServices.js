import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiService from '../apiService';
import { logout } from '../../redux/reducers/authenticationSlice';
import { decrypt, encrypt } from 'lib/Aes.v2';

export const authenticationApi = createApi({
  reducerPath: 'authenticationApi',
  tagTypes: ['User', 'Video', 'Me'],
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
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/login`,
        method: 'POST',
        body: {
          payload: encrypt({
            identity: email,
            password
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      },
      protected: builder.mutation({
        query: () => 'protected'
      }),
      invalidatesTags: ['User']
    }),
    register: builder.mutation({
      query: ({ email, phone }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/register`,
        method: 'POST',
        body: {
          payload: encrypt({
            email: email,
            phone: phone
          })
        }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return { data: decrypt(response?.data?.result) };
        }

        return response;
      },
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ['User']
    }),
    confirmOtpRegister: builder.mutation({
      query: ({ otp }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/otp/confirm`,
        method: 'POST',
        body: {
          payload: encrypt({
            otp: otp
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result)?.data?.data;
        }

        if (response.data.data) {
          return response.data.data;
        }

        return response;
      },
      providesTags: ['User'],
      invalidatesTags: ['User']
    }),
    resendOtp: builder.mutation({
      query: ({ identity }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/register/otp/resend`,
        method: 'POST',
        body: { payload: encrypt({ identifier: identity }) }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }
        return response;
      },
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      }
    }),
    resendOtpChanged: builder.mutation({
      query: ({ email, password }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/profile/change-email`,
        method: 'POST',
        body: {
          payload: encrypt({
            new_email: email,
            password
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }
        if (response.data) {
          return response.data;
        }
        return response;
      },
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      }
    }),
    resetPassword: builder.mutation({
      query: ({ otp, password, password_confirmation }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/forgot-password/reset`,
        method: 'POST',
        body: {
          payload: encrypt({
            otp,
            password,
            password_confirmation
          })
        }
      }),
      transformResponse: (response) => {
        if (response.data) {
          return response.data;
        }
        return response;
      },
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      }
    }),
    completeBasicProfile: builder.mutation({
      query: ({
        firstname,
        username,
        email,
        phone,
        password,
        password_confirmation,
        referal_code,
        pref_language
      }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/register/basic-profile`,
        method: 'POST',
        body: {
          payload: encrypt({
            firstname,
            lastname: '-',
            email,
            username,
            phone,
            password,
            password_confirmation,
            referal_code,
            pref_genre_ids: [1],
            pref_language
          })
        }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return { data: decrypt(response?.data?.result) };
        }

        return response;
      },
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      }
    }),
    selectRole: builder.mutation({
      query: ({ role }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/register/select-user-type`,
        method: 'POST',
        body: {
          payload: encrypt({
            user_type: role
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      }
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/forgot-password`,
        method: 'POST',
        body: { payload: encrypt({ email }) }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      },
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);

          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }
        return response;
      }
    }),
    contestantProfile: builder.mutation({
      query: ({ artist_band_name, description, genre_ids, member_names, member_emails }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/register/contestant-profile`,
        method: 'POST',
        body: {
          payload: encrypt({
            artist_band_name,
            description,
            genre_ids,
            member_names,
            member_emails
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      }
    }),
    me: builder.query({
      query: (token) => {
        return {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/me`,
          method: 'GET'
        };
      },
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response.data) {
          return response.data;
        }

        return response;
      },
      // if error, logout
      onError: (arg, { dispatch }) => {
        dispatch(logout());
      },
      providesTags: ['Me']
    }),
    getMyVideos: builder.query({
      query: () => '/me/videos',
      transformResponse: (response) => {
        if (response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Video']
    }),
    updatePhoto: builder.mutation({
      // send formData
      query: ({ photo }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/my-account/update-photo`,
        method: 'POST',
        body: {
          payload: encrypt({
            photo
          })
        }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      }
    }),
    updateBanner: builder.mutation({
      query: ({ banner }) => ({
        url: '/auth/my-account/update-banner',
        method: 'POST',
        body: {
          banner
        }
      })
    }),
    updateBasicProfile: builder.mutation({
      query: ({ fullname, username, email, phone }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/my-account/update-basic-profile`,
        method: 'POST',
        body: { payload: encrypt({ firstname: fullname, username, email, phone }) }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      }
    }),
    updatePassword: builder.mutation({
      query: ({ current_password, password, password_confirmation }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/my-account/update-password`,
        method: 'POST',
        body: { payload: encrypt({ current_password, password, password_confirmation }) }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return decrypt(response?.data?.result);
        }

        return response;
      }
    }),
    updatePerformerProfile: builder.mutation({
      query: ({ artist_band_name, description, genre_ids, member_names, member_emails }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/my-account/update-performer-profile`,
        method: 'POST',
        body: {
          payload: encrypt({
            artist_band_name,
            description,
            genre_ids,
            member_names,
            member_emails
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          return decrypt(response?.result);
        }

        return response;
      },
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return { data: decrypt(response?.data?.result) };
        }

        return response;
      }
    }),
    updateAdditionalInformation: builder.mutation({
      query: ({
        preferredLanguage,
        dateOfBirth,
        favoriteMusicGenres,
        zipCode,
        gender,
        aboutMe
      }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/my-account/update-additional-information`,
        method: 'POST',
        body: {
          payload: encrypt({
            pref_language: preferredLanguage,
            dateofbirth: dateOfBirth,
            pref_genre_ids: favoriteMusicGenres,
            zip_code: zipCode,
            gender,
            about_me: aboutMe
          })
        }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return { data: decrypt(response?.data?.result) };
        }

        return response;
      },
      invalidatesTags: ['User']
    }),
    updateSurveyQuestion: builder.mutation({
      query: ({ answer_1_id, answer_2_id, answer_3_id, answer_4_ids, answer_5_ids }) => ({
        url: '/auth/register/survey',
        method: 'POST',
        body: { answer_1_id, answer_2_id, answer_3_id, answer_4_ids, answer_5_ids }
      })
    }),
    updateSocialMediaAccounts: builder.mutation({
      query: (props) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/my-account/update-social-media`,
        method: 'POST',
        body: { payload: encrypt({ ...props }) }
      })
    }),
    dataSocialMedia: builder.query({
      query: ({ user }) => 'auth/my-account/get-social-media',
      transformResponse: (response) => {
        if (response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['SocialMedia']
    }),
    updateEmail: builder.mutation({
      query: ({ otp }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/profile/change-email/otp/confirm`,
        method: 'POST',
        body: {
          payload: encrypt({
            otp
          })
        }
      }),
      transformResponse: (response) => {
        if (response?.encrypt) {
          const result = decrypt(response?.result);
          if (result?.status === 429) {
            return result;
          }
          return result?.data;
        }

        if (response?.data) {
          return response?.data;
        }

        return response;
      }
    }),
    checkTokenStatus: builder.query({
      query: () => '/auth/check-token-status'
    }),
    confirmOtpForgotPassword: builder.mutation({
      query: ({ otp }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/forgot-password/otp/confirm`,
        method: 'POST',
        body: {
          payload: encrypt({
            otp
          })
        }
      }),
      transformErrorResponse: (response) => {
        if (response?.data && response?.data?.encrypt) {
          return { data: decrypt(response?.data?.result) };
        }

        return response;
      }
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmOtpRegisterMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useCompleteBasicProfileMutation,
  useSelectRoleMutation,
  useForgotPasswordMutation,
  useContestantProfileMutation,
  useMeQuery,
  useGetMyVideosQuery,
  useUpdatePhotoMutation,
  useUpdateBannerMutation,
  useUpdateBasicProfileMutation,
  useUpdatePasswordMutation,
  useUpdatePerformerProfileMutation,
  useUpdateAdditionalInformationMutation,
  useUpdateSurveyQuestionMutation,
  useUpdateSocialMediaAccountsMutation,
  useResendOtpChangedMutation,
  useUpdateEmailMutation,
  useDataSocialMediaQuery,
  useCheckTokenStatusQuery,
  useConfirmOtpForgotPasswordMutation
} = authenticationApi;
