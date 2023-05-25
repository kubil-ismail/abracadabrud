const getNextPage = ({ currentPage, totalData, pageSize }) => {
  const totalPage = Math.ceil(totalData / pageSize);
  const nextPage = currentPage + 1;

  if (nextPage > totalPage) {
    return null;
  }

  return nextPage;
};

export default getNextPage;
