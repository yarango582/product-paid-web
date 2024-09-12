import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductSkeleton from './ProductSkeleton';
import styles from '../styles/ProductList.module.css';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ products, loading, error }) => {
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={styles.productGrid}>
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))
      ) : (
        products.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className={styles.productItem}>
            <div className={styles.productCard}>
              <img src={product.publicImageURL} alt={product.name} className={styles.productImage} />
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>{formatCurrency(product.price)}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ProductList;