import apiService from './apiService';

const ProfileServices = {
  basicProfile: async (data) => {
    const {
      data: {
        data: { user },
        message
      }
    } = await apiService.post('me/profile/basic', data);
    return { user, message };
  },
  aditionalProfile: async ({ provider, token }) => {
    const {
      data: {
        data: { user, token: newToken }
      }
    } = await apiService.post(`/auth/oauth/${provider}/login`, { token });
    return { user, token: newToken };
  },
  password: async ({ identity }) => {
    const {
      data: { message }
    } = await apiService.post('/auth/register/otp/resend', { identifier: identity });
    return { message };
  },
  prefGenre: async ({ otp }) => {
    const {
      data: {
        data: { user, token },
        message
      }
    } = await apiService.post('/auth/login/otp/confirm', { otp });
    return { user, token, message };
  },
  pointActivity: async ({ page = 1, pageSize = 10 } = { page: 1, pageSize: 10 }) => {
    const {
      data: { data, ...pagination }
    } = await apiService.get(`/me/point-activity?page=${page}&page_size=${pageSize}`);
    return { data, pagination };
  },
  voteActivity: async ({ page = 1, pageSize = 10 } = { page: 1, pageSize: 10 }) => {
    const {
      data: { data, ...pagination }
    } = await apiService.get(`/me/vote-activity?page=${page}&page_size=${pageSize}`);
    return { data, pagination };
  },
  favoriteVideos: async ({ page = 1, pageSize = 10 } = { page: 1, pageSize: 10 }) => {
    const {
      data: { data, ...pagination }
    } = await apiService.get(`/me/favorite-videos?page=${page}&page_size=${pageSize}`);
    return { data, pagination };
  }
};

export default ProfileServices;
