import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

const persistStoreConfig = {
  key: 'root',
  storage,

  transforms: [
    encryptTransform({
      secretKey: 'my-super-secret-key',
      onError: function (error) {
        // Handle the error.
      }
    })
  ]
};

export default persistStoreConfig;
