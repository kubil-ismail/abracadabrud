import { ONGOING_EVENT } from '../globals/constants';
import apiService from './apiService';

const EventServices = {
  getEvents: async ({ page = 1, search, page_size = 10, type = ONGOING_EVENT }) => {
    let params = {
      page,
      page_size,
      type
    };

    if (search) {
      params = {
        ...params,
        search
      };
    }

    const {
      data: { data }
    } = await apiService.get('/event-list', { params });
    return data;
  },
  enrollEvent: async ({ eventId }) => {
    const {
      data: { message }
    } = await apiService.post(`/events/${eventId}/enroll`);
    return { message };
  },
  uploadVideo: async ({ contest_id, artist_id, genre_ids, video_url, caption }) => {
    const {
      data: { message }
    } = await apiService.post('/videos', {
      contest_id,
      artist_id,
      genre_ids,
      video_url,
      caption
    });
    return { message };
  },
  getEventLuckyDrawContestant: async ({ locale, eventId }) => {
    const {
      data: { data }
    } = await apiService.get(`/events/${eventId}/lucky-draw-contestant?language=${locale}`);
    return data;
  },
  getEventLuckyDrawPerformer: async ({ locale, eventId }) => {
    const {
      data: { data }
    } = await apiService.get(`/events/${eventId}/lucky-draw-performer?language=${locale}`);
    return data;
  },
  getEventMemberships: async ({ locale, eventId }) => {
    const {
      data: { data }
    } = await apiService.get(`/events/${eventId}/event-memberships?language=${locale}`);
    return data;
  },
  getEventContestRules: async ({ locale, eventId }) => {
    const {
      data: { data }
    } = await apiService.get(`/events/${eventId}/event-contest-rules?language=${locale}`);
    return data;
  }
};

export default EventServices;
