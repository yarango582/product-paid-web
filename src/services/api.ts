import { Product } from '../types';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${VITE_API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};
