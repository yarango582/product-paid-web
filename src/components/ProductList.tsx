import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductSkeleton from './ProductSkeleton';
import styles from '../styles/App.module.css';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ products, loading, error }) => {
  if (error) {
    return <div className={styles.card}>Error: {error}</div>;
  }

  return (
    <div className={styles.productGrid}>
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))
      ) : (
        products.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className={styles.productItem}>
            <div className={styles.card}>
              <img src={product.publicImageURL} alt={product.name} className={styles.productImage} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ProductList;