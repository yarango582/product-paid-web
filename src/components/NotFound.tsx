import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFound}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" className={styles.homeLink}>Volver a la página principal</Link>
    </div>
  );
};

export default NotFound;