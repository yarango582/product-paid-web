import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import configureStore from 'redux-mock-store';

import CreditCardForm from '../../components/CreditCardForm';
import { RootState } from '../../store/store';
import { setCurrentTransaction, setError } from '../../store/transactionSlice';
import * as api from '../../services/api';
import { useAlert } from '../../hooks/useAlert';
import { initialState as productInitialState } from '../../store/productSlice';
import { initialState as transactionInitialState } from '../../store/transactionSlice';

// Configuración del store mock
const mockStore = configureStore<Partial<RootState>>([]);

const mockProduct = {
  id: '1',
  name: 'Producto de Prueba',
  description: 'Descripción del producto de prueba',
  price: 100,
  stockQuantity: 10,
  publicImageURL: 'https://via.placeholder.com/150',
};

const initialState: Partial<RootState> = {
  product: {
    ...productInitialState,
    selectedProduct: mockProduct,
  },
  transaction: transactionInitialState,
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock del módulo de API
vi.mock('../../services/api');
const apiMock = vi.mocked(api);

const showAlertMock = vi.fn();
const hideAlertMock = vi.fn();

vi.mock('../../hooks/useAlert', () => ({
  useAlert: () => ({
    showAlert: showAlertMock,
    alert: null,
    hideAlert: hideAlertMock,
  }),
}));

// Limpia los mocks después de cada prueba
afterEach(() => {
  vi.clearAllMocks();
});

test('Renderiza el formulario de tarjeta de crédito correctamente', () => {
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CreditCardForm />
      </MemoryRouter>
    </Provider>
  );

  // Verificamos que los campos del formulario están presentes
  expect(screen.getByLabelText(/Número de tarjeta/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Nombre del titular/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Mes de expiración/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Año de expiración/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/CVC/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Cantidad/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Pagar ahora/i })).toBeInTheDocument();
});

test('Procesa el pago correctamente y navega a la página de resumen', async () => {
  const store = mockStore(initialState);
  const mockDispatch = vi.fn();
  store.dispatch = mockDispatch;

  // Configuramos las funciones de API para que devuelvan valores resueltos
  apiMock.createCardToken.mockResolvedValue({ data: { id: 'token123' } });
  apiMock.processTransaction.mockResolvedValue({
    data: { externalTransactionId: 'txn_123', amount: 100 },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CreditCardForm />
      </MemoryRouter>
    </Provider>
  );

  // Llenamos los campos del formulario
  fireEvent.change(screen.getByLabelText(/Número de tarjeta/i), {
    target: { value: '4111111111111111' },
  });
  fireEvent.change(screen.getByLabelText(/Nombre del titular/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/Mes de expiración/i), {
    target: { value: '12' },
  });
  fireEvent.change(screen.getByLabelText(/Año de expiración/i), {
    target: { value: '25' },
  });
  fireEvent.change(screen.getByLabelText(/CVC/i), {
    target: { value: '123' },
  });
  fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
    target: { value: 'john@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/Cantidad/i), {
    target: { value: '1' },
  });

  // Simulamos el envío del formulario
  fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/i }));

  // Esperamos a que las llamadas asíncronas se completen
  await waitFor(() => {
    expect(apiMock.createCardToken).toHaveBeenCalled();
    expect(apiMock.processTransaction).toHaveBeenCalled();
  });

  // Verificamos que se ha despachado la acción correcta
  expect(mockDispatch).toHaveBeenCalledWith(
    setCurrentTransaction({
      data: { externalTransactionId: 'txn_123', amount: 100 },
    })
  );

  // Verificamos que se ha navegado a la página de resumen
  expect(navigateMock).toHaveBeenCalledWith('/summary');
});

test('Muestra un mensaje de error si el pago falla', async () => {
  const store = mockStore(initialState);
  const mockDispatch = vi.fn();
  store.dispatch = mockDispatch;

  // Configuramos las funciones de API para que la transacción falle
  apiMock.createCardToken.mockResolvedValue({ data: { id: 'token123' } });
  apiMock.processTransaction.mockRejectedValue(new Error('Payment failed'));

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CreditCardForm />
      </MemoryRouter>
    </Provider>
  );

  // Llenamos los campos del formulario
  fireEvent.change(screen.getByLabelText(/Número de tarjeta/i), {
    target: { value: '4111111111111111' },
  });
  fireEvent.change(screen.getByLabelText(/Nombre del titular/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/Mes de expiración/i), {
    target: { value: '12' },
  });
  fireEvent.change(screen.getByLabelText(/Año de expiración/i), {
    target: { value: '25' },
  });
  fireEvent.change(screen.getByLabelText(/CVC/i), {
    target: { value: '123' },
  });
  fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
    target: { value: 'john@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/Cantidad/i), {
    target: { value: '1' },
  });

  // Simulamos el envío del formulario
  fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/i }));

  // Esperamos a que las llamadas asíncronas se completen
  await waitFor(() => {
    expect(apiMock.createCardToken).toHaveBeenCalled();
    expect(apiMock.processTransaction).toHaveBeenCalled();
  });

  // Verificamos que se mostró el mensaje de error
  expect(showAlertMock).toHaveBeenCalledWith(
    'Error procesando el pago, verifica los datos de la tarjeta',
    'error'
  );

  // Verificamos que se despachó la acción de error
  expect(mockDispatch).toHaveBeenCalledWith(
    setError('Error processing payment. Please try again.')
  );
});
