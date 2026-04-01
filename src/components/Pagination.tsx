import React from "react";

interface Props {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPage(page - 1)}>
            Prev
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPage(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPage(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
