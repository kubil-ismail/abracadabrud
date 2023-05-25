import { loadingBarReducer } from 'react-redux-loading-bar';
import authenticationReducer from './authenticationSlice';
import coachMarkReducer from './coachmarkSlice';
import favoriteVideosReducer from './favoriteVideoSlice';
import globalReducer from './globalSlice';
import notificationReducer from './notificationSlice';
import pointReducer from './pointSlice';
import voteReducer from './voteSlice';
import modalSlice from './modalSlice';
import paymentsSlice from './paymentsSlice';
import membershipReducer from './membershipsSlice';
import threedotsSlice from './threedotsSlice';

const reducers = {
  authentication: authenticationReducer,
  loadingBar: loadingBarReducer,
  global: globalReducer,
  notifications: notificationReducer,
  points: pointReducer,
  votes: voteReducer,
  favoriteVideos: favoriteVideosReducer,
  coachMark: coachMarkReducer,
  modal: modalSlice,
  payments: paymentsSlice,
  memberships: membershipReducer,
  threeDots: threedotsSlice,
};

export default reducers;
