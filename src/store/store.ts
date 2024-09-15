import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import transactionReducer from './transactionSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;