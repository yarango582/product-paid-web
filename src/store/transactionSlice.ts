// src/store/transactionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../types';

interface TransactionState {
  currentTransaction: Transaction | null;
  error: string | null;
}

export const initialState: TransactionState = {
  currentTransaction: null,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setCurrentTransaction: (state, action: PayloadAction<Transaction>) => {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentTransaction, clearCurrentTransaction, setError } = transactionSlice.actions;

export default transactionSlice.reducer;