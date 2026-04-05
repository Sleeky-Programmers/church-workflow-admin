import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritePage = {
  path: string;
  label: string;
};

type FavoritesStore = {
  favorites: FavoritePage[];
  toggleFavorite: (page: FavoritePage) => void;
  isFavorite: (path: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (page) => {
        const exists = get().favorites.some((fav) => fav.path === page.path);

        set({
          favorites: exists
            ? get().favorites.filter((fav) => fav.path !== page.path)
            : [...get().favorites, page],
        });
      },

      isFavorite: (path) => get().favorites.some((fav) => fav.path === path),
    }),
    {
      name: "favorites-pages",
    },
  ),
);
