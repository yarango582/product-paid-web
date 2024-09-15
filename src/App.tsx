import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ProductList } from "./components/ProductList";
import { ProductDetails } from "./components/ProductDetails";
import { CreditCardForm } from "./components/CreditCardForm";
import { TransactionList } from "./components/TransactionList";
import NotFound from "./components/NotFound";
import { useProducts } from "./hooks/useProducts";
import { useTransactions } from "./hooks/useTransactions";
import styles from "./styles/App.module.css";
import Summary from "./components/Summary";

const App: React.FC = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactions();

  if (productsLoading || transactionsLoading)
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <div>Cargando datos...</div>
      </div>
    );
  if (productsError || transactionsError)
    return <div>Error al cargar los datos</div>;

  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.logo}>
              Tony Stark Shop
            </Link>
            <nav className={styles.nav}>
              <ul>
                <li>
                  <Link to="/transactions">Transacciones</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  products={products}
                  loading={productsLoading}
                  error={productsError}
                />
              }
            />
            <Route
              path="/products/:id"
              element={<ProductDetails products={products} />}
            />
            <Route path="/checkout/:id" element={<CreditCardForm />} />
            <Route
              path="/transactions"
              element={<TransactionList transactions={transactions} />}
            />
            <Route path="/summary" element={<Summary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
