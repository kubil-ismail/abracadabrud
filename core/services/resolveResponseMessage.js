export const USER_NOT_FOUND = 'User not found';
export const INVALID_CREDENTIALS = 'The password you entered is incorrect. Please try again';
export const INVALID_OTP = 'Invalid OTP';
export const SUCCESS_LOGIN = 'Login success';
export const SUCCESS_FORGOT_PASSWORD = 'Forgot password success';
export const SUCCESS_RESET_PASSWORD = 'Reset password success';
export const SUCCESS_SEND_OTP = 'OTP has been send to your email';
export const EVENT_NOT_FOUND = 'Event not found';
export const ALREADY_ENROLLED = 'You have already enrolled this event';
export const EVENT_HAS_ENDED = 'This event has ended';
export const VIDEO_UPLOAD_SUCCESS = 'Video uploaded successfully';
export const MUST_ORDER_QUOTA_UPLOADED = 'You must order quota before uploading video';
export const ACCOUNT_ALREADY_EXISTS = 'Account already exists';
export const ACCOUNT_ALREADY_CONNECTED_WITH_OTHER_USER =
  'Account already connected with other user';
export const EMAIL_NOT_FOUND =
  'Could not connect to your account. Your email is required to connect your account.';

const apiResponses = {
  'api.auth.login.user_not_found': USER_NOT_FOUND,
  'api.auth.login.password_invalid': INVALID_CREDENTIALS,
  'OTP is invalid': INVALID_OTP,
  'api.auth.login.success': SUCCESS_LOGIN,
  'api.auth.forgot_password.success': SUCCESS_FORGOT_PASSWORD,
  'api.auth.reset_password.success': SUCCESS_RESET_PASSWORD,
  'api.auth.forgot_password.send_otp.success': SUCCESS_SEND_OTP,
  'api.auth.forgot_password.confirm_otp.success': SUCCESS_RESET_PASSWORD,
  'api.events.show.not_found': EVENT_NOT_FOUND,
  'api.events.enroll.already_enrolled': ALREADY_ENROLLED,
  'api.events.enroll.event_ended': EVENT_HAS_ENDED,
  'api.video.created': VIDEO_UPLOAD_SUCCESS,
  'api.video.must_order_quota_upload': MUST_ORDER_QUOTA_UPLOADED,
  account_already_exists: ACCOUNT_ALREADY_EXISTS,
  account_already_connected_with_other_user: ACCOUNT_ALREADY_CONNECTED_WITH_OTHER_USER,
  account_not_found: USER_NOT_FOUND,
  email_not_found: EMAIL_NOT_FOUND
};

const resolveResponseMessage = (message) => apiResponses[message] || message;

export default resolveResponseMessage;
