import apiService from './apiService';

const CoachMarkServices = {
  setByKey: async (key, value = 1) => {
    const {
      data: { data: coachMark }
    } = await apiService.post(`/coachmarks/set-by-key/${key}`, { value });
    return coachMark;
  },
  getAll: async () => {
    const {
      data: { data: coachMarks }
    } = await apiService.get('/coachmarks');
    return coachMarks;
  },
  getCoachMarkByKey: async (key) => {
    const {
      data: { data: coachMark }
    } = await apiService.get(`/coachmarks/get-by-key/${key}`);
    return coachMark;
  }
};

export default CoachMarkServices;
