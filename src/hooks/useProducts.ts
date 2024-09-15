import { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};