class LocalStorage {
  static get(key) {
    if (typeof window === 'object' && typeof window.localStorage === 'object') {
      const value = window.localStorage.getItem(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    }
    return null;
  }

  static set(key, value) {
    if (typeof window === 'object' && typeof window.localStorage === 'object') {
      let tempValue = value;
      if (typeof value === 'object') {
        tempValue = JSON.stringify(value);
      }
      if (Array.isArray(value)) {
        tempValue = JSON.stringify(value);
      }
      window.localStorage.setItem(key, tempValue);
    }
  }

  static remove(key) {
    if (typeof window === 'object' && typeof window.localStorage === 'object') {
      window.localStorage.removeItem(key);
    }
  }
}

export default LocalStorage;
