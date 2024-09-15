import React from 'react';
import styles from '../styles/ProductSkeleton.module.css';

const ProductSkeleton: React.FC = () => {
  return (
    <div className={`${styles.card} ${styles.productSkeleton}`}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonPrice}></div>
    </div>
  );
};

export default ProductSkeleton;