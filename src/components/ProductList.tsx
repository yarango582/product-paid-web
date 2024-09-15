import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductSkeleton from './ProductSkeleton';
import styles from '../styles/ProductList.module.css';
import { formatCurrency } from '../utils/currency.util';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ products, loading, error }) => {
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
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
            <div className={styles.productCard}>
              <div className={styles.imageContainer}>
                <img src={product.publicImageURL} alt={product.name} className={styles.productImage} />
                {product.stockQuantity <= 0 && (
                  <div className={styles.outOfStock}>Agotado</div>
                )}
              </div>
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