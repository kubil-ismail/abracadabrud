import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import NotificationServices from '../../services/NotificationServices';

const initialState = {
  generalNotifications: [],
  generalNotificationsPagination: {},

  winnerNotifications: [],
  winnerNotificationsPagination: {},

  unHasReadGeneralNotifications: 0,
  unHasReadWinnerNotifications: 0,

  loadingGetGeneralNotifications: false,
  loadingGetWinnerNotifications: false,

  errorGetGeneralNotifications: null,
  errorGetWinnerNotifications: null
};

export const asyncGetGeneralNotifications = createAsyncThunk(
  'notifications/getGeneralNotifications',
  async ({ page = 1, limit = 10 }) => {
    const { notifications, un_has_read, un_has_read_general, un_has_read_winner } =
      await NotificationServices.getNotifications({
        types: 'payment,vote',
        limit,
        page
      });
    return {
      notifications,
      un_has_read,
      un_has_read_general,
      un_has_read_winner
    };
  }
);

export const asyncGetWinnerNotifications = createAsyncThunk(
  'notifications/getWinnerNotifications',
  async ({ page = 1, limit = 10 }) => {
    const { notifications, un_has_read, un_has_read_general, un_has_read_winner } =
      await NotificationServices.getNotifications({
        types: 'winner',
        limit,
        page
      });
    return {
      notifications,
      un_has_read,
      un_has_read_general,
      un_has_read_winner
    };
  }
);

export const asyncBulkReadNotifications = createAsyncThunk(
  'notifications/bulkReadNotifications',
  async ({ ids }) => {
    const { notifications, un_has_read_general, un_has_read_winner, un_has_read } =
      await NotificationServices.bulkReadNotifications({ ids });
    return {
      notifications,
      un_has_read_general,
      un_has_read_winner,
      un_has_read
    };
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnhasReadGeneralNotifications: (state, { payload }) => {
      state.unHasReadGeneralNotifications = payload;
    },
    setUnhasReadWinnerNotifications: (state, { payload }) => {
      state.unHasReadWinnerNotifications = payload;
    },
    resetNotifications: (state) => {
      state.winnerNotifications = [];
      state.generalNotifications = [];
      state.unHasReadGeneralNotifications = 0;
      state.unHasReadWinnerNotifications = 0;
      state.generalNotificationsPagination = null;
      state.winnerNotificationsPagination = null;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(asyncGetGeneralNotifications.pending, (state) => {
      state.loadingGetGeneralNotifications = true;
      state.errorGetGeneralNotifications = null;
    });
    addCase(asyncGetGeneralNotifications.fulfilled, (state, { payload }) => {
      state.loadingGetGeneralNotifications = false;
      const { data, ...pagination } = payload.notifications;
      if (pagination.current_page === 1) {
        state.generalNotifications = data;
      } else {
        const newNotifications = data.filter(
          (notification) => !state.generalNotifications.find((n) => n.id === notification.id)
        );
        const updatedNotifications = state.generalNotifications.map((notification) => {
          const updatedNotification = data.find((n) => n.id === notification.id);
          return updatedNotification || notification;
        });
        state.generalNotifications = [...updatedNotifications, ...newNotifications];
      }
      state.generalNotificationsPagination = pagination;
      state.unHasReadGeneralNotifications = payload.un_has_read_general;
      state.unHasReadWinnerNotifications = payload.un_has_read_winner;
    });
    addCase(asyncGetGeneralNotifications.rejected, (state, { error }) => {
      state.loadingGetGeneralNotifications = false;
      state.errorGetGeneralNotifications = error.message;
    });

    addCase(asyncGetWinnerNotifications.pending, (state) => {
      state.loadingGetWinnerNotifications = true;
      state.errorGetWinnerNotifications = null;
    });
    addCase(asyncGetWinnerNotifications.fulfilled, (state, { payload }) => {
      state.loadingGetWinnerNotifications = false;
      const { data, ...pagination } = payload.notifications;
      if (pagination.current_page === 1) {
        state.winnerNotifications = data;
      } else {
        const newNotifications = data.filter(
          (notification) => !state.winnerNotifications.find((n) => n.id === notification.id)
        );
        const updatedNotifications = state.winnerNotifications.map((notification) => {
          const updatedNotification = data.find((n) => n.id === notification.id);
          return updatedNotification || notification;
        });
        state.winnerNotifications = [...updatedNotifications, ...newNotifications];
      }
      state.winnerNotificationsPagination = pagination;
      state.unHasReadGeneralNotifications = payload.un_has_read_general;
      state.unHasReadWinnerNotifications = payload.un_has_read_winner;
    });
    addCase(asyncGetWinnerNotifications.rejected, (state, { error }) => {
      state.loadingGetWinnerNotifications = false;
      state.errorGetWinnerNotifications = error.message;
    });
    addCase(asyncBulkReadNotifications.fulfilled, (state, { payload }) => {
      const data = payload.notifications;
      state.generalNotifications = state.generalNotifications.map((notification) => {
        const updatedNotification = data.find((n) => n.id === notification.id);
        return updatedNotification || notification;
      });
      state.winnerNotifications = state.winnerNotifications.map((notification) => {
        const updatedNotification = data.find((n) => n.id === notification.id);
        return updatedNotification || notification;
      });
      state.unHasReadGeneralNotifications = payload.un_has_read_general;
      state.unHasReadWinnerNotifications = payload.un_has_read_winner;
    });
  }
});

export const notificationState = (state) => state.notifications;

export const unHasReadNotificationState = (state) => {
  const { unHasReadGeneralNotifications, unHasReadWinnerNotifications } = state.notifications;
  return unHasReadGeneralNotifications + unHasReadWinnerNotifications;
};

export const {
  setUnhasReadGeneralNotifications,
  setUnhasReadWinnerNotifications,
  resetNotifications
} = notificationSlice.actions;

const notificationReducer = notificationSlice.reducer;

export default notificationReducer;
