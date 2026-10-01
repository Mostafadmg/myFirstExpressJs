import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../utils/constants.js";

// Generic page-number state, reused by any list page (listings, orders,
// admin tables, ...) instead of re-declaring page/totalPages everywhere.
export function usePagination(initialPage = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  function nextPage() {
    setPage((p) => Math.min(p + 1, totalPages));
  }

  function prevPage() {
    setPage((p) => Math.max(p - 1, 1));
  }

  return { page, setPage, pageSize, totalPages, setTotalPages, nextPage, prevPage };
}
