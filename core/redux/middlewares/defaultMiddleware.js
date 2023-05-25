import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

const defaultMiddleware = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
  },
  // GANTI KALAU SEMUA SUDAH PAKAI SLICE
  immutableCheck: false
};

export default defaultMiddleware;
