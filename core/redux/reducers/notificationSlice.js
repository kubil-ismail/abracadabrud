import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  refetchNotifications: true
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setRefetchNotifications: (state, action) => {
      state.refetchNotifications = action.payload;
    }
  }
});

export const {
  setRefetchNotifications
} = notificationSlice.actions;

const notificationReducer = notificationSlice.reducer;

export default notificationReducer;
