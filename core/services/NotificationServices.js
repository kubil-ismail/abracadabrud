import apiService from './apiService';

const NotificationServices = {
  getNotifications: async ({ types = 'payment,vote', limit = 10, page = 1 }) => {
    let url = `/notifications?page_size=${limit}&page=${page}`;
    if (types) {
      url += `&types=${types}`;
    }
    const {
      data: { data, un_has_read, un_has_read_general, un_has_read_winner }
    } = await apiService.get(url);
    return {
      notifications: data,
      un_has_read,
      un_has_read_general,
      un_has_read_winner
    };
  },
  bulkReadNotifications: async ({ ids }) => {
    const formData = new FormData();
    ids?.forEach((id) => formData.append('notifications[]', id));
    const {
      data: { data, un_has_read_general, un_has_read_winner, un_has_read }
    } = await apiService.post('/notifications/read', formData);
    return {
      notifications: data,
      un_has_read_general,
      un_has_read_winner,
      un_has_read
    };
  }
};

export default NotificationServices;
