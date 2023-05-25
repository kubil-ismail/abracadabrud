const mergeArray = ({ oldArray, newArray, key }) => {
  const oldItems = {};
  for (let i = 0; i < oldArray.length; i += 1) {
    const item = oldArray[i];
    oldItems[item[key]] = item;
  }

  for (let i = 0; i < newArray.length; i += 1) {
    const item = newArray[i];
    if (oldItems[item[key]]) {
      oldItems[item[key]] = item;
    } else {
      oldItems[item[key]] = item;
    }
  }

  const result = Object.values(oldItems);
  return result;
};

export default mergeArray;
