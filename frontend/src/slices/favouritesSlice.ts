import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FavouriteJob {
  userId?: string;
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  url?: string;
  source?: string;
}

interface FavouritesState {
  items: FavouriteJob[];
}

const initialState: FavouritesState = {
  items: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite(state, action: PayloadAction<FavouriteJob>) {
      const exists = state.items.find(i => i.url === action.payload.url && i.userId === action.payload.userId);
      if (!exists) state.items.push(action.payload);
    },
    removeFavourite(state, action: PayloadAction<{ userId?: string; url?: string }>) {
      state.items = state.items.filter(i => !(i.url === action.payload.url && i.userId === action.payload.userId));
    },
    setFavourites(state, action: PayloadAction<FavouriteJob[]>) {
      state.items = action.payload;
    },
    clearFavourites(state) {
      state.items = [];
    },
  },
});

export const { addFavourite, removeFavourite, setFavourites, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;