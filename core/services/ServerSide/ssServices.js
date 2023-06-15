import ssApiService from './ssApiService';
import { decrypt, encrypt } from 'lib/Aes.v2';

const SSServices = {
  getEvent: async ({ eventId }) => {
    const {
      data: { event }
    } = await ssApiService.get(`/events/${eventId}`);
    return event;
  },
  getEventsSiteMap: async () => {
    const {
      data: { data: events }
    } = await ssApiService.get('/events-sitemap');
    return events;
  },
  getGenres: async () => {
    const {
      data: { genres }
    } = await ssApiService.get('/genres?all=true');
    return genres;
  },
  getEventArtists: async ({ eventId }) => {
    const {
      data: { data }
    } = await ssApiService.get(`/event-artists/${eventId}`);
    return data;
  },
  getSeo: async ({ path }) => {
    try {
      const path64 = Buffer.from(path).toString('base64');
      const {
        data: { data: seo }
      } = await ssApiService.get(`/seo-settings/${path64}`);
      return seo;
    } catch {
      return null;
    }
  },
  getConcurrent: async (concurrent) => {
    const {
      data: { data }
    } = await ssApiService.get(`/concurrent/${concurrent}`);
    return data;
  },
  getFaqCategoriesWithFaqs: async () => {
    const {
      data: { data: faqCategories }
    } = await ssApiService.get('/faqcategories-with-faqs');
    return faqCategories;
  },
  getFaq: async (faqId) => {
    const {
      data: { data: faq }
    } = await ssApiService.get(`/faqs/${faqId}`);
    return faq;
  },
  getCoachMarks: async () => {
    const {
      data: { data: coachMarks }
    } = await ssApiService.get('/coachmarks');
    return coachMarks;
  },
  getMemberships: async ({ token }) => {
    try {
      const {
        data: { memberships }
      } = await ssApiService.get('/active-memberships-v2', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return memberships;
    } catch (error) {
      return error;
    }
  },
  getShowVideo: async (videoId) => {
    try {
      const video = await ssApiService.get(`/videos/${videoId}`);
      return video;
    } catch (error) {
      return error;
    }
  },
  getRequiredToEnroll: async ({ token }) => {
    try {
      const {
        data: { data: required_to_enroll }
      } = await ssApiService.get('/event/check-status-enroll', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return required_to_enroll;
    } catch (error) {
      return error;
    }
  },
  getAllEvents: async () => {
    try {
      const { data } = await ssApiService.get('/all-events');
      return data;
    } catch (error) {
      return error;
    }
  },
  getMyPoints: async ({ token, client }) => {
    try {
      const url = client ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/points/me` : `/points/me`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentMethod: async ({ platform, token }) => {
    try {
      const { data } = await ssApiService.get(`/payments/method?payment_platform=${platform}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentsMembership: async ({ id, token, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/membership`
        : `/payments/membership?user_id=${id}`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentMembershipId: async ({ id, token, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/membership/${id}`
        : `/payments/membership/${id}`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentVideoId: async ({ id, token, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/video/${id}`
        : `/payments/video/${id}`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentsVideo: async ({ client, id, token }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/video`
        : `/payments/video?user_id=${id}`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentBuyPointsId: async ({ id, token, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/buy-points/${id}`
        : `/payments/buy-points/${id}`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getPaymentsBuyPoints: async ({ client, id, token }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/buy-points`
        : `/payments/buy-points?user_id=${id}`;

      const { data } = await ssApiService.get(
        url,
        client ? {} : { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getVoteAndFavorite: async ({ token }) => {
    try {
      const {
        data: { data }
      } = await ssApiService.get(`/is-voted-and-favorited-videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return error;
    }
  },
  getMe: async ({ token }) => {
    try {
      const { data } = await ssApiService.get(`/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return error;
    }
  },
  getMyVote: async ({ token, page, pageSize }) => {
    try {
      const { data } = await ssApiService.get(
        `/me/vote-activity?page=${page}&page_size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return data;
    } catch (error) {
      return error;
    }
  },
  getMyVideos: async ({ token, page, pageSize }) => {
    try {
      const { data } = await ssApiService.get(
        `/me/videos?page=${page || 1}&page_size=${pageSize || 6}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return data;
    } catch (error) {
      return error;
    }
  },
  getFavoriteVideo: async ({ token, page, pageSize }) => {
    try {
      const { data } = await ssApiService.get(
        `/me/favorite-videos?page=${page || 1}&page_size=${pageSize || 6}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return data;
    } catch (error) {
      return error;
    }
  },
  getMembershipsStatus: async ({ token, datas, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/active-memberships-v2`
        : `/active-memberships-v2`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getActiveMembership: async ({ token, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/active-memberships-v2`
        : `/active-memberships-v2`;

      const { data } = await ssApiService.get(url, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  watchAds: async ({ id }) => {
    try {
      const { data } = await ssApiService.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/ads-watch-add-user/${id}`
      );

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  checkoutMembership: async ({ token, datas, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/membership`
        : `/checkout/membership`;

      const { data } = await ssApiService.post(url, client ? { payload: encrypt(datas) } : datas, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  checkoutVideo: async ({ token, datas, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/video`
        : `/checkout/video`;

      const { data } = await ssApiService.post(url, client ? { payload: encrypt(datas) } : datas, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  checkoutPoints: async ({ token, datas, client }) => {
    try {
      const url = client
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/buy-points`
        : `/checkout/buy-points`;

      const { data } = await ssApiService.post(url, client ? { payload: encrypt(datas) } : datas, {
        headers: { Authorization: client ? null : `Bearer ${token}` }
      });

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  canUpload: async ({ token, eventId }) => {
    try {
      const { data } = await ssApiService.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/events/${eventId}/can-upload`
      );

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getUserSocialMedia: async ({ userId }) => {
    try {
      const { data } = await ssApiService.get(`/user-social-media/${userId}`);
      return data;
    } catch (error) {
      return error;
    }
  },
  getProfiles: async ({ userId }) => {
    try {
      const { data } = await ssApiService.get(`/profiles/${userId}`);
      return data;
    } catch (error) {
      return error;
    }
  },
  getRunningText: async () => {
    try {
      const { data } = await ssApiService.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/running-text`
      );

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  },
  getRunningText: async () => {
    try {
      const { data } = await ssApiService.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/running-text`
      );

      if (data?.encrypt) {
        return decrypt(data?.result);
      }

      return data;
    } catch (error) {
      return error;
    }
  }
};

export default SSServices;
