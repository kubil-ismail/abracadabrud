import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalLogin: false,
  modalRegister: false,
  modalOtp: false,
  modalForgotPassword: false,
  modalResetPassword: false,
  modalContinuePay: false,
  modalReportVideo: false,
  modalReportVideoDescription: false,
  modalTransaction: false,
  modalOrderSummary: false,
  modalShareVideo: false,
  modalChangeEmail: false,
  modalOtpEmail: false,
  modalShare: false,
  modalEmptyVote: false,
  modalLogout:false,

  // data antar modal
  emailOtp: null,
  emailOtpRegister: null,
  emailChangedOtp: null,
  filterContent: null,
  filterContentLoading: null
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setEmailOtp: (state, action) => {
      state.emailOtp = action.payload;
    },
    setEmailOtpRegister: (state, action) => {
      state.emailOtpRegister = action.payload;
    },
    setEmailOtpChanged: (state, action) => {
      state.emailChangedOtp = action.payload;
    },
    setFilterContent: (state, { payload }) => {
      state.filterContent = payload;
    },
    setFilterLoading: (state, { payload }) => {
      state.filterContentLoading = payload;
    },
    resetModal: (state) => {
      state.modalLogin = false;
      state.modalRegister = false;
      state.modalOtp = false;
      state.modalForgotPassword = false;
      state.modalResetPassword = false;
      state.modalContinuePay = false;
      state.modalReportVideo = false;
      state.modalReportVideoDescription = false;
      state.modalTransaction = false;
      state.modalOrderSummary = false;
      state.modalShareVideo = false;
      state.modalChangeEmail = false;
      state.modalOtpEmail = false;
      state.modalShare = false;
      state.modalEmptyVote = false;
      state.modalLogout = false;

      // data antar modal
      state.emailOtp = null;
      state.emailOtpRegister = null;
      state.emailChangedOtp = null;
      state.filterContent = null;
      state.filterContentLoading = null;
    }
  }
});

export const {
  setModal,
  setEmailOtp,
  setEmailOtpRegister,
  setEmailOtpChanged,
  setFilterContent,
  setFilterLoading,
  resetModal
} = modalSlice.actions;

export const selectModal = (state) => state.modal;

export default modalSlice.reducer;
