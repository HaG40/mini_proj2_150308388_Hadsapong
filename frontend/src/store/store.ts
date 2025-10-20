import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import favouritesReducer from '../slices/favouritesSlice';

const store = configureStore({
  reducer: {
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;