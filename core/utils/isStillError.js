const isStillError = (error) => {
  Object.keys(error).forEach((key) => {
    if (error[key] !== '') {
      return true;
    }
  });
  return false;
};

export default isStillError;
