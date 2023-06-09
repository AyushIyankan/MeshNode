import { create } from 'zustand';

type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: any[];
};

type PaginationActions = {
  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setItems: (items: any[]) => void;
};

const usePaginationStore = create<PaginationState & PaginationActions>(
  (set) => ({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    items: [],
    setCurrentPage: (page) => set({ currentPage: page }),
    setPageSize: (pageSize) => set({ pageSize }),
    setTotalItems: (totalItems) => set({ totalItems }),
    setTotalPages: (totalPages) => set({ totalPages }),
    setItems: (items) => set({ items }),
  })
);

export default usePaginationStore;
