import {
  ENROLL_EVENT_POINT,
  EXTRA_REGISTER_POINT,
  MEMBERSHIP_POINT,
  MOVE_GENERAL_TO_EVENT_POINT,
  REGISTER_POINT,
  REFERRAL_POINT_INVITE,
  REFERRAL_POINT_GOT_INVITED,
  VIDEO_SPONSOR_POINT,
  COMPLETE_PROFILE_POINT,
  COMPLETE_SURVEY_POINT,
  BUY_POINTS,
} from '../../lib/constants';

export default function activityNamingResolve(module, value, data = {}, t = (str) => str) {
  const points = {
    [REGISTER_POINT]: 'Points awarded for completing your Registration.',
    [EXTRA_REGISTER_POINT]: 'Success to complete your profile',
    [ENROLL_EVENT_POINT]: 'Success enroll to event {event}',
    [MOVE_GENERAL_TO_EVENT_POINT]: 'Success move general point to event',
    [MEMBERSHIP_POINT]: 'Points awarded for becoming Premium Member.',
    [REFERRAL_POINT_INVITE]: 'Points awarded for referring a friend to abracadabra.',
    [REFERRAL_POINT_GOT_INVITED]: 'Points awarded for signing up to abracadabra from your friend’s referral',
    [VIDEO_SPONSOR_POINT]: 'Points awarded for watching a sponsor video.',
    [COMPLETE_PROFILE_POINT]: 'Points awarded for completing the Additional Info section on your My Account page.',
    [COMPLETE_SURVEY_POINT]: 'Points awarded for completing Survey Questions section on your My Account page.',
    [BUY_POINTS]: 'Points awarded for buying points.',
  };
  try {
    switch (module) {
      case 'points': {
        const resolve = t(points[value]);
        if (value === ENROLL_EVENT_POINT) {
          return resolve.replace('{event}', data.event.title);
        }
        return t(resolve);
      }
      default:
        return t(value);
    }
  } catch (error) {
    return t(value);
  }
}
