// Summary.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi } from 'vitest';

import Summary from '../../components/Summary';
import { RootState } from '../../store/store';
import { initialState as productInitialState } from '../../store/productSlice';
import { initialState as transactionInitialState } from '../../store/transactionSlice';

const mockStore = configureStore<Partial<RootState>>([]);

afterEach(() => {
  vi.clearAllMocks();
});

// Mock de useNavigate
const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

test('Renderiza el resumen de la transacción correctamente', () => {
  const mockTransaction = {
    externalTransactionId: 'txn_123',
    status: 'success',
    amount: 100,
  };

  const mockProduct = {
    id: '1',
    name: 'Producto de Prueba',
    price: 100,
  };

  const store = mockStore({
    transaction: {
      ...transactionInitialState,
      currentTransaction: mockTransaction,
    },
    product: {
      ...productInitialState,
      selectedProduct: mockProduct,
    },
  });

  render(
    <Provider store={store}>
      <Summary />
    </Provider>
  );

  // Verificamos que los detalles de la transacción se muestran correctamente
  expect(screen.getByText('Transaction ID:')).toBeInTheDocument();
  expect(screen.getByText('txn_123')).toBeInTheDocument();
  expect(screen.getByText('Status:')).toBeInTheDocument();
  expect(screen.getByText('success')).toBeInTheDocument();
  expect(screen.getByText('Product:')).toBeInTheDocument();
  expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
});

test('Navega al inicio si no hay transacción o producto seleccionado', () => {
  const store = mockStore({
    transaction: transactionInitialState,
    product: productInitialState,
  });

  render(
    <Provider store={store}>
      <Summary />
    </Provider>
  );

  // Verificamos que se ha llamado a navigate('/') una vez
  expect(navigateMock).toHaveBeenCalledWith('/');
});
