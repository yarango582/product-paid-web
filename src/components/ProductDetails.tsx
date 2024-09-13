import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import styles from '../styles/ProductDetails.module.css';
import { formatCurrency } from '../utils/currency.util';
import { setSelectedProduct } from '../store/productSlice';
import { useDispatch } from 'react-redux';

interface ProductDetailsProps {
  products: Product[];
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className={styles.error}>Producto no encontrado</div>;
  }

  const handleBuyClick = () => {
    dispatch(setSelectedProduct(product));
    navigate(`/checkout/${product.id}`);
  };

  return (
    <div className={styles.productDetails}>
      <img src={product.publicImageURL} alt={product.name} className={styles.productImage} />
      <h2 className={styles.productName}>{product.name}</h2>
      <p className={styles.productDescription}>{product.description}</p>
      <p className={styles.productPrice}>Precio: {formatCurrency(product.price)}</p>
      <p className={styles.productStock}>Stock: {product.stockQuantity}</p>
      <button onClick={handleBuyClick} className={styles.buyButton}>
        Comprar con tarjeta de crédito
      </button>
    </div>
  );
};

export default ProductDetails;