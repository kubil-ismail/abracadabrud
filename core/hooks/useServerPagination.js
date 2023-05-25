import { useState } from 'react';

const useServerPagination = ({
  current_page = 1,
  per_page = 10,
  total: existedTotal,
  last_page: existedLastPage
}) => {
  const [currentPage] = useState(current_page);
  const [total] = useState(existedTotal);
  const [pageSizes, setPageSizes] = useState(per_page);
  const [lastPage] = useState(existedLastPage);

  return {
    currentPage,
    total,
    pageSizes,
    lastPage,
    setPageSizes
  };
};

export default useServerPagination;
