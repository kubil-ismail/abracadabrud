import thunk from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import newReducers from '../core/redux/reducers';
import persistStoreConfig from '../core/redux/persistStoreConfig';
import defaultMiddleware from '../core/redux/middlewares/defaultMiddleware';
import { setupListeners } from '@reduxjs/toolkit/query';
import { eventApi } from '../core/services/rtk/EventServices';
import { globalApi } from '../core/services/rtk/GlobalServices';
import { pointApi } from '../core/services/rtk/MeServices';
import { membershipApi } from '../core/services/rtk/MembershipServices';
import { authenticationApi } from '../core/services/rtk/AuthenticationServices';
import { adsApi } from 'core/services/rtk/AdsServices';
import { profilesApi } from '../core/services/rtk/ProfileServices';
import { midtransApi } from '../core/services/rtk/EventServices';
import { homeFeedsApi } from 'core/services/rtk/HomeFeedsServices';
import { notificationApi } from '../core/services/rtk/NotificationServices';

const reducers = combineReducers({
  ...newReducers,
  [eventApi.reducerPath]: eventApi.reducer,
  [pointApi.reducerPath]: pointApi.reducer,
  [adsApi.reducerPath]: adsApi.reducer,
  [globalApi.reducerPath]: globalApi.reducer,
  [membershipApi.reducerPath]: membershipApi.reducer,
  [profilesApi.reducerPath]: profilesApi.reducer,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [midtransApi.reducerPath]: midtransApi.reducer,
  [homeFeedsApi.reducerPath]: homeFeedsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
});

const persistedReducer = persistReducer(persistStoreConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(defaultMiddleware).concat(
      thunk,
      eventApi.middleware,
      pointApi.middleware,
      globalApi.middleware,
      authenticationApi.middleware,
      profilesApi.middleware,
      midtransApi.middleware,
      adsApi.middleware,
      homeFeedsApi.middleware,
      membershipApi.middleware,
      notificationApi.middleware,
    )
});

const makeStore = () => store;

const wrapper = createWrapper(makeStore);

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export default wrapper;
