import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentPage = {
  path: string;
  label: string;
};

type RecentStore = {
  recents: RecentPage[];
  addRecent: (page: RecentPage) => void;
  clearRecents: () => void;
};

const MAX_RECENTS = 6;

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      recents: [],

      addRecent: (page) => {
        const existing = get().recents.filter((r) => r.path !== page.path);

        set({
          recents: [page, ...existing].slice(0, MAX_RECENTS),
        });
      },

      clearRecents: () => set({ recents: [] }),
    }),
    {
      name: "recent-pages",
    },
  ),
);
