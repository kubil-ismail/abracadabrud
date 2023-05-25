import { ASSET_URL } from './constants';

const resolveImage = (path, defaultPath = 'https://via.placeholder.com/150') => {
  try {
    if (!path || path === '') return defaultPath;
    if (path.includes('http')) {
      return path;
    }
    return ASSET_URL + path;
  } catch {
    return defaultPath;
  }
};

export default resolveImage;
