import React from "react";
function Pagination({ totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i < Math.ceil(totalItems / 6) + 1; i++) {
    pageNumbers.push(i);
  }
  const styles = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  };
  return (
    <div>
      <ul style={styles} className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={
              number === currentPage ? "page-item active" : "page-item"
            }
            onClick={() => paginate(number)}
          >
            <span className="page-link">{number}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pagination;
