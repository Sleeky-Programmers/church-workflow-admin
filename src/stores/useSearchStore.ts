import { create } from "zustand";
import { persist } from "zustand/middleware";

type SearchStore = {
  // State
  searchQuery: string;
  isSearching: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  updateURLSearch: (pathname: string, router: any) => void;
  syncFromURL: (searchParams: URLSearchParams) => void;
};

export const useSearchStore = create<SearchStore>()((set, get) => ({
  // Initial state
  searchQuery: "",
  isSearching: false,

  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, isSearching: !!query });
  },

  // Clear search
  clearSearch: () => {
    set({ searchQuery: "", isSearching: false });
  },

  // Update URL with current search
  updateURLSearch: (pathname: string, router: any) => {
    const { searchQuery } = get();
    const params = new URLSearchParams(window.location.search);

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    const newURL = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newURL, { scroll: false });
  },

  // Sync from URL params
  syncFromURL: (searchParams: URLSearchParams) => {
    const urlSearch = searchParams.get("search") || "";
    const { searchQuery } = get();

    if (urlSearch !== searchQuery) {
      set({ searchQuery: urlSearch, isSearching: !!urlSearch });
    }
  },
}));
