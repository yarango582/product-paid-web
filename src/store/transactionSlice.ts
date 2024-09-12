import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionData } from '../types';

interface TransactionState {
  currentTransaction: TransactionData | null;
}

const initialState: TransactionState = {
  currentTransaction: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setCurrentTransaction: (state, action: PayloadAction<TransactionData>) => {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
});

export const { setCurrentTransaction, clearCurrentTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;