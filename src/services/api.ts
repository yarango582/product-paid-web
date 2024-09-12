import { Product, Transaction, TransactionData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const processTransaction = async (data: TransactionData): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to process transaction');
  }
  return response.json();
};