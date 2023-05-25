import { useState } from 'react';

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const next = () => {
    setCurrentPage((_currentPage) => Math.min(_currentPage + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage((_currentPage) => Math.max(_currentPage - 1, 1));
  };

  const jump = (page) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, maxPage));
  };

  return {
    next,
    prev,
    jump,
    currentItems,
    currentPage,
    maxPage
  };
};

export default usePagination;
