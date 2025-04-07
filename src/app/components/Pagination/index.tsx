"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    pageNumbers.push(1); // Always include the first page

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pageNumbers.push("..."); // Ellipsis before the current page range
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push("..."); // Ellipsis after the current page range
    }
    if (totalPages > 1) {
      pageNumbers.push(totalPages); // Always include the last page
    }
    return pageNumbers;
  };

  if (totalPages <= 1) return null; // No pagination needed if there's only one page

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-item ${
          currentPage === 1 ? "pagination-disabled" : "hover:bg-gray-100"
        }`}
        aria-label="Previous page"
      >
        &laquo;
      </button>
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`pagination-item ${
              currentPage === page ? "pagination-active" : "hover:bg-gray-100"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="pagination-item">
            {page}
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`pagination-item ${
          currentPage === totalPages
            ? "pagination-disabled"
            : "hover:bg-gray-100"
        }`}
        aria-label="Next page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
