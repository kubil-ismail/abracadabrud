const isStillEmpty = (value) => {
  Object.keys(value).forEach((key) => {
    if (value[key] === '') {
      return true;
    }
  });
  return false;
};

export default isStillEmpty;
