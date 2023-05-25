import apiService from './apiService';
import { OTP_EXPIRED } from './resolveApiMessage';

const AuthenticationServices = {
  login: async ({ identity, password, otp = null }) => {
    const {
      data: {
        data: { user, token },
        message
      }
    } = await apiService.post('/auth/login', { identity, password, otp });
    return { user, token, mustOtp: message === OTP_EXPIRED };
  },
  oauthLogin: async ({ provider, token }) => {
    const {
      data: {
        data: { user, token: newToken }
      }
    } = await apiService.post(`/auth/oauth/${provider}/login`, { token });
    return { user, token: newToken };
  },
  resendOtp: async ({ identity }) => {
    const {
      data: { message }
    } = await apiService.post('/auth/register/otp/resend', { identifier: identity });
    return { message };
  },
  confirmOtp: async ({ otp }) => {
    const {
      data: {
        data: { user, token },
        message
      }
    } = await apiService.post('/auth/login/otp/confirm', { otp });
    return { user, token, message };
  },
  forgotPassword: async ({ email }) => {
    const {
      data: { message }
    } = await apiService.post('/auth/forgot-password', { email });
    return { message };
  },
  resendOtpForgotPassword: async ({ email }) => {
    const {
      data: { message }
    } = await apiService.post('/auth/forgot-password/otp/resend', { email });
    return { message };
  },
  confirmOtpForgotPassword: async ({ otp }) => {
    const {
      data: { message }
    } = await apiService.post('/auth/forgot-password/otp/confirm', { otp });
    return { message };
  },
  resetPassword: async ({ otp, password, password_confirmation }) => {
    const {
      data: {
        message,
        data: { token }
      }
    } = await apiService.post('/auth/forgot-password/reset', {
      otp,
      password,
      password_confirmation
    });
    return { message, token };
  },
  register: async ({ email }) => {
    const {
      data: {
        data: { token, user }
      }
    } = await apiService.post('/auth/register', {
      email
    });
    return { token, user };
  },
  oauthRegister: async ({ provider, token }) => {
    const {
      data: {
        data: { user, token: newToken }
      }
    } = await apiService.post(`/auth/oauth/${provider}/register`, { token });
    return { user, token: newToken };
  },
  confirmOtpRegister: async ({ otp }) => {
    const {
      data: {
        data: { user, token },
        message
      }
    } = await apiService.post('/auth/register/otp/confirm', { otp });
    return { user, token, message };
  },
  selectRole: async ({ roleId }) => {
    const {
      data: {
        data: { user, with_oauth },
        message
      }
    } = await apiService.post('/auth/register/select-user-type', { user_type: roleId });
    return { user, message, with_oauth };
  },
  completeBasicProfile: async ({
    firstname,
    lastname,
    username,
    email,
    phone,
    password,
    password_confirmation,
    referral_code,
    pref_genre_ids
  }) => {
    const {
      data: {
        data: { user },
        message
      }
    } = await apiService.post('/auth/register/basic-profile', {
      firstname,
      lastname,
      username,
      email,
      phone,
      password,
      password_confirmation,
      referal_code: referral_code,
      pref_genre_ids
    });
    return { user, message };
  },
  contestantProfile: async ({
    artist_band_name,
    description,
    genre_ids,
    member_names,
    member_emails
  }) => {
    const {
      data: {
        data: { user },
        message
      }
    } = await apiService.post('/auth/register/contestant-profile', {
      artist_band_name,
      description,
      genre_ids,
      member_names,
      member_emails
    });
    return { user, message };
  },
  me: async () => {
    const {
      data: {
        data: { user },
        message
      }
    } = await apiService.get('/auth/me');
    return { user, message };
  },
  getConnectedAccounts: async () => {
    const {
      data: {
        data: { connected_accounts },
        message
      }
    } = await apiService.get('/accounts/connected_accounts');
    return { connected_accounts, message };
  },
  disconnectAccount: async ({ provider }) => {
    const {
      data: {
        data: { connected_accounts },
        message
      }
    } = await apiService.post(`/accounts/${provider}/disconnect`);
    return { connected_accounts, message };
  },
  extraProfile: async ({ photo, dateofbirth, zip_code, banner, gender }) => {
    const formData = new FormData();
    if (photo?.name) {
      formData.append('photo', photo);
    }
    if (banner?.name) {
      formData.append('banner', banner);
    }
    formData.append('dateofbirth', dateofbirth);
    formData.append('zip_code', zip_code);
    formData.append('gender', gender);

    const {
      data: {
        data: { user },
        message
      }
    } = await apiService.post('/auth/register/extra-profile', formData);
    return { user, message };
  },
  survey: async ({ answer_1_id, answer_2_id, answer_3_id, answer_4_ids, answer_5_ids }) => {
    const {
      data: {
        data: { user },
        message
      }
    } = await apiService.post('/auth/register/survey', {
      answer_1_id,
      answer_2_id,
      answer_3_id,
      answer_4_ids,
      answer_5_ids
    });
    return { user, message };
  },
  recoveryPassword: async () => {
    const {
      data: { message }
    } = await apiService.post('/auth/recovery-password');
    return { message };
  }
};

export default AuthenticationServices;
