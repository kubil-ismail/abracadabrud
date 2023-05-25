import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // general
  payment_for: null,

  // video
  video_upload_fee: null,

  // membership
  membership_fee: null,
  membership_id: null,

  // points
  points_fee: null,
  points_id: null, // TODO: this is used if backend support options of points

  // cc
  paymentMethodsId: null,
  tokenCC: null,
  event_id: null,
  event_contest_id: null,
  events: [],
  isUsingCC: false,
  data: null,
  isQris: false

  // bank transfer

  // ewallet

  // midtrans

  // summary
};

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPaymentMethodsId: (state, action) => {
      state.paymentMethodsId = action.payload;
    },
    setTokenId: (state, action) => {
      state.tokenCC = action.payload;
    },
    setEventId: (state, action) => {
      state.event_id = action.payload;
    },
    setContestId: (state, action) => {
      state.event_contest_id = action.payload;
    },
    setVideoUploadFee: (state, action) => {
      state.video_upload_fee = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setIsUsingCC: (state, action) => {
      state.isUsingCC = action.payload;
    },
    resetPayment: (state) => {
      state.paymentMethodsId = null;
      state.tokenCC = null;
      state.event_id = null;
      state.contest_id = null;
      state.video_upload_fee = null;
      state.events = [];
      state.data = null;
      state.isUsingCC = false;
      state.membership_fee = null;
      state.membership_id = null;
    },
    setPaymentFor: (state, action) => {
      state.payment_for = action.payload;
    },
    setMembershipFee: (state, action) => {
      state.membership_fee = action.payload;
    },
    setMembershipId: (state, action) => {
      state.membership_id = action.payload;
    },

    // reset per state
    resetPaymentMethodsId: (state) => {
      state.paymentMethodsId = null;
    },
    resetTokenId: (state) => {
      state.tokenCC = null;
    },
    resetEventId: (state) => {
      state.event_id = null;
    },
    resetContestId: (state) => {
      state.contest_id = null;
    },
    resetVideoUploadFee: (state) => {
      state.video_upload_fee = null;
    },
    resetEvents: (state) => {
      state.events = [];
    },
    resetData: (state) => {
      state.data = null;
    },
    setPaymentQris: (state, { payload }) => {
      state.isQris = payload;
    },
    setPointsFee: (state, { payload }) => {
      state.points_fee = payload;
    },
    setPointsId: (state, { payload }) => {
      state.points_id = payload;
    }
  }
});

export const {
  setPaymentFor,
  setPaymentMethodsId,
  setTokenId,
  setEventId,
  setContestId,
  resetPayment,
  setVideoUploadFee,
  setEvents,
  setData,
  setIsUsingCC,
  setMembershipFee,
  setMembershipId,
  setPaymentQris,
  setPointsFee,
  setPointsId
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
