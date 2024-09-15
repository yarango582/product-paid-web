import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import styles from '../styles/TransactionList.module.css';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = () => {
  const { transactions, loading, error } = useTransactions();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading) {
    return <div className={styles.loading}>Cargando transacciones...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Historial de Transacciones</h2>
      {transactions.length === 0 ? (
        <p className={styles.emptyMessage}>No hay transacciones disponibles.</p>
      ) : (
        <>
          <ul className={styles.transactionList}>
            {currentTransactions.map((transaction) => (
              <li key={transaction.id} className={styles.transactionItem}>
                <div className={styles.imageContainer}>
                  <img
                    src={transaction.product.publicImageURL}
                    alt={transaction.product.name}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.transactionDetails}>
                  <h3 className={styles.productName}>{transaction.product.name}</h3>
                  <p className={styles.transactionId}>ID: {transaction.id}</p>
                  <p className={styles.quantity}>Cantidad: {transaction.quantity}</p>
                  <p className={styles.amount}>
                    Total: ${transaction.totalAmount.toLocaleString()}
                  </p>
                  <p className={`${styles.status} ${styles[transaction.status.toLowerCase()]}`}>
                    {transaction.status === 'APPROVED' ? 'Aprobada' : 'Fallida'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Anterior
            </button>
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionList;