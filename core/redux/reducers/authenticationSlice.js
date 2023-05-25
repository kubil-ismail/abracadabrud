import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authenticationApi } from '../../services/rtk/AuthenticationServices';

const initialState = {
  user: null,
  token: null,
  mustOtp: false,
  identity: null,
  lastLogin: null,
  otp: null,
  provider: null,
  emailForgotPassword: null,
  isAuthenticated: false,
  mainLang: 'id',
  required_to_enroll: false,

  registerUser: null,
  referralCode: null,
  registerWithOauth: false,

  dataLogin: null,
  errorLogin: null,
  loadingLogin: false,

  dataLoginOauth: null,
  errorLoginOauth: null,
  loadingLoginOauth: false,

  dataResendOtp: null,
  errorResendOtp: null,
  loadingResendOtp: false,

  dataConfirmOtp: null,
  errorConfirmOtp: null,
  loadingConfirmOtp: false,

  dataForgotPassword: null,
  errorForgotPassword: null,
  loadingForgotPassword: false,

  dataResendOtpForgotPassword: null,
  errorResendOtpForgotPassword: null,
  loadingResendOtpForgotPassword: false,

  dataConfirmOtpForgotPassword: null,
  errorConfirmOtpForgotPassword: null,
  loadingConfirmOtpForgotPassword: false,

  dataResetPassword: null,
  errorResetPassword: null,
  loadingResetPassword: false,

  dataRegister: null,
  errorRegister: null,
  loadingRegister: false,

  dataRegisterOauth: null,
  errorRegisterOauth: null,
  loadingRegisterOauth: false,

  dataConfirmOtpRegister: null,
  errorConfirmOtpRegister: null,
  loadingConfirmOtpRegister: false,

  dataSelectRole: null,
  errorSelectRole: null,
  loadingSelectRole: false,

  dataCompleteBasicProfile: null,
  errorCompleteBasicProfile: null,
  loadingCompleteBasicProfile: false,

  dataContestantProfile: null,
  errorContestantProfile: null,
  loadingContestantProfile: false,

  dataMe: null,
  errorMe: null,
  loadingMe: false,

  dataConnectedAccounts: null,
  errorConnectedAccounts: null,
  loadingConnectedAccounts: false,

  connectedAccounts: [],

  dataDisconnectAccount: null,
  errorDisconnectAccount: null,
  loadingDisconnectAccount: false,

  dataExtraProfile: null,
  errorExtraProfile: null,
  loadingExtraProfile: false,

  dataSurvey: null,
  errorSurvey: null,
  loadingSurvey: false,

  dataRecoveryPassword: null,
  errorRecoveryPassword: null,
  loadingRecoveryPassword: false
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsAuthenticated: (state, { payload }) => {
      state.isAuthenticated = payload;
    },
    setCredentials: (state, { payload }) => {
      if (payload?.user) {
        state.user = payload.user;
      }
      if (payload?.token) {
        state.token = payload.token;
      }
    },
    setRegister: (state, { payload }) => {
      state.dataRegister = payload;
    },
    setResendOtp: (state, { payload }) => {
      state.dataResendOtp = payload;
    },
    setOtpState: (state, { payload }) => {
      state.otp = payload;
    },
    setRequiredToEnroll: (state, { payload }) => {
      state.required_to_enroll = payload;
    },
    resetLogin: (state) => {
      state.dataLogin = null;
      state.errorLogin = null;
      state.loadingLogin = false;
    },
    resetLoginOauth: (state) => {
      state.dataLoginOauth = null;
      state.errorLoginOauth = null;
      state.loadingLoginOauth = false;
    },
    resetResendOtp: (state) => {
      state.dataResendOtp = null;
      state.errorResendOtp = null;
      state.loadingResendOtp = false;
    },
    resetConfirmOtp: (state) => {
      state.dataConfirmOtp = null;
      state.errorConfirmOtp = null;
      state.loadingConfirmOtp = false;
    },
    setProvider: (state, { payload }) => {
      state.provider = payload;
    },
    resetProvider: (state) => {
      state.provider = null;
    },
    resetForgotPassword: (state) => {
      state.dataForgotPassword = null;
      state.errorForgotPassword = null;
      state.loadingForgotPassword = false;
    },
    resetResendOtpForgotPassword: (state) => {
      state.dataResendOtpForgotPassword = null;
      state.errorResendOtpForgotPassword = null;
      state.loadingResendOtpForgotPassword = false;
      state.emailForgotPassword = null;
    },
    resetConfirmOtpForgotPassword: (state) => {
      state.dataConfirmOtpForgotPassword = null;
      state.errorConfirmOtpForgotPassword = null;
      state.loadingConfirmOtpForgotPassword = false;
    },
    resetResetPassword: (state) => {
      state.dataResetPassword = null;
      state.errorResetPassword = null;
      state.loadingResetPassword = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.mustOtp = false;
      state.identity = null;
      state.lastLogin = null;
      state.provider = null;
      state.emailForgotPassword = null;
      state.dataLogin = null;
      state.errorLogin = null;
      state.dataLoginOauth = null;
      state.errorLoginOauth = null;
      state.dataConfirmOtp = null;
      state.errorConfirmOtp = null;
      state.dataResendOtp = null;
      state.isAuthenticated = false;
      state.connectedAccounts = [];
      state.dataRegister = null;
    },
    resetRegister: (state) => {
      state.dataRegister = null;
      state.errorRegister = null;
      state.loadingRegister = false;
    },
    resetRegisterOauth: (state) => {
      state.dataRegisterOauth = null;
      state.errorRegisterOauth = null;
      state.loadingRegisterOauth = false;
    },
    setUser(state, { payload }) {
      state.user = payload;
    },
    resetConfirmOtpRegister: (state) => {
      state.dataConfirmOtpRegister = null;
      state.errorConfirmOtpRegister = null;
      state.loadingConfirmOtpRegister = false;
    },
    resetSelectRole: (state) => {
      state.dataSelectRole = null;
      state.errorSelectRole = null;
      state.loadingSelectRole = false;
    },
    setReferralCode(state, { payload }) {
      state.referralCode = payload;
    },
    resetReferralCode(state) {
      state.referralCode = null;
    },
    resetCompleteBasicProfile: (state) => {
      state.dataCompleteBasicProfile = null;
      state.errorCompleteBasicProfile = null;
      state.loadingCompleteBasicProfile = false;
    },
    resetContestantProfile: (state) => {
      state.dataContestantProfile = null;
      state.errorContestantProfile = null;
      state.loadingContestantProfile = false;
    },
    setIsAuthenticated(state, { payload }) {
      state.isAuthenticated = payload;
    },
    setToken(state, { payload }) {
      state.token = payload;
    },
    resetDisconnectAccount: (state) => {
      state.dataDisconnectAccount = null;
      state.errorDisconnectAccount = null;
      state.loadingDisconnectAccount = false;
    },
    resetExtraProfile: (state) => {
      state.dataExtraProfile = null;
      state.errorExtraProfile = null;
      state.loadingExtraProfile = false;
    },
    resetSurvey: (state) => {
      state.dataSurvey = null;
      state.errorSurvey = null;
      state.loadingSurvey = false;
    },
    resetRecoveryPassword: (state) => {
      state.dataRecoveryPassword = null;
      state.errorRecoveryPassword = null;
      state.loadingRecoveryPassword = false;
    },
    changePhotoProfile: (state, { payload }) => {
      if (state.user?.photo) {
        state.user.photo = payload;
      }
    },
    changePhotoBanner: (state, { payload }) => {
      if (state.user?.banner) {
        state.user.banner = payload;
      }
    },
    setMainLang: (state, { payload }) => {
      state.mainLang = payload;
    },
    setChangedEmail: (state, { payload }) => {
      if (state.user?.email) {
        state.user.email = payload;
      }
    },
    setNameProfile: (state, { payload }) => {
      state.user.firstname = payload;
    },
    setFtvProfile: (state, { payload }) => {
      if (state.user?.ftv_view) {
        state.user.ftv_view = payload;
      }
    }
  }
});

export const authenticationState = (state) => state.authentication;

export const getCurrentUser = (state) => authenticationState(state).user;

export const getConnectedAccountByProvider = (state) => (provider) =>
  authenticationState(state).connectedAccounts.find((account) => account.provider === provider);

export const {
  setIsAuthenticated,
  setCredentials,
  setRegister,
  setResendOtp,
  setOtpState,
  resetLogin,
  resetResendOtp,
  resetConfirmOtp,
  setProvider,
  resetProvider,
  resetLoginOauth,
  resetForgotPassword,
  resetResendOtpForgotPassword,
  resetConfirmOtpForgotPassword,
  resetResetPassword,
  logout,
  resetRegister,
  resetRegisterOauth,
  setUser,
  resetConfirmOtpRegister,
  resetSelectRole,
  resetCompleteBasicProfile,
  setToken,
  resetDisconnectAccount,
  resetContestantProfile,
  resetExtraProfile,
  resetSurvey,
  resetRecoveryPassword,
  setReferralCode,
  resetReferralCode,
  changePhotoProfile,
  changePhotoBanner,
  setMainLang,
  setChangedEmail,
  setRequiredToEnroll,
  setNameProfile,
  setFtvProfile
} = authenticationSlice.actions;

const authenticationReducer = authenticationSlice.reducer;

export default authenticationReducer;
