import apiService from './apiService';

const GlobalServices = {
  getGenres: async ({ all = true }) => {
    if (all) {
      const {
        data: { genres, message }
      } = await apiService.get('/genres?all=true');
      return { genres, message };
    }
    // TODO - implement pagination
    return { genres: [], message: 'Not implemented' };
  },
  getSeo: async ({ path }) => {
    try {
      const path64 = Buffer.from(path).toString('base64');
      const {
        data: { data: seo }
      } = await apiService.get(`/seo-settings/${path64}`);
      return seo;
    } catch {
      return null;
    }
  },
  hasUpload: async ({ eventId }) => {
    const {
      data: { message, videos }
    } = await apiService.get(`/videos/events/${eventId}/hasUpload`);
    return { message, videos };
  }
};

export default GlobalServices;
