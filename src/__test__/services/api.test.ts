// api.test.ts
import { vi, it, expect, beforeEach, afterEach } from 'vitest';
import { fetchProducts, processTransaction, createCardToken } from '../../services/api';
import { IProcessPayment, TransactionData, Product, Transaction } from '../../types';

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.resetAllMocks();
});

it('fetchProducts debe devolver una lista de productos cuando la respuesta es exitosa', async () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 100,
      stockQuantity: 10,
      publicImageURL: 'https://example.com/product1.jpg',
    },
    // Puedes agregar más productos si lo deseas
  ];

  // Configuramos fetch para que devuelva una respuesta exitosa
  (global.fetch as vi.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockProducts,
  });

  const products = await fetchProducts();

  expect(products).toEqual(mockProducts);
  expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
});

it('fetchProducts debe lanzar un error cuando la respuesta no es exitosa', async () => {
  (global.fetch as vi.Mock).mockResolvedValue({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
  });

  await expect(fetchProducts()).rejects.toThrow('Failed to fetch products');
  expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
});

it('processTransaction debe devolver una transacción cuando la respuesta es exitosa', async () => {
  const mockTransaction: Transaction = {
    id: 'txn_123',
    externalTransactionId: 'ext_txn_123',
    status: 'APPROVED',
    amount: 100,
    // Otros campos según tu tipo Transaction
  };

  const inputData: IProcessPayment = {
    paymentDetails: {
      cardNumber: '4111111111111111',
      cardHolder: 'John Doe',
      expirationDate: '12/25',
      cvv: '123',
    },
    productId: '1',
    quantity: 1,
    cardToken: 'token_123',
    email: 'john@example.com',
  };

  // Configuramos fetch para que devuelva una respuesta exitosa
  (global.fetch as vi.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockTransaction,
  });

  const transaction = await processTransaction(inputData);

  expect(transaction).toEqual(mockTransaction);
  expect(global.fetch).toHaveBeenCalledWith(
    `${import.meta.env.VITE_API_BASE_URL}/api/payments/process`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: inputData.productId,
        quantity: inputData.quantity,
        cardToken: inputData.cardToken,
        email: inputData.email,
      }),
    }
  );
});

it('processTransaction debe lanzar un error cuando la respuesta no es exitosa', async () => {
  const inputData: IProcessPayment = {
    paymentDetails: {
      cardNumber: '4111111111111111',
      cardHolder: 'John Doe',
      expirationDate: '12/25',
      cvv: '123',
    },
    productId: '1',
    quantity: 1,
    cardToken: 'token_123',
    email: 'john@example.com',
  };

  // Configuramos fetch para que devuelva una respuesta con error
  (global.fetch as vi.Mock).mockResolvedValue({
    ok: false,
    status: 400,
    statusText: 'Bad Request',
  });

  await expect(processTransaction(inputData)).rejects.toThrow('Failed to process transaction');
  expect(global.fetch).toHaveBeenCalledWith(
    `${import.meta.env.VITE_API_BASE_URL}/api/payments/process`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: inputData.productId,
        quantity: inputData.quantity,
        cardToken: inputData.cardToken,
        email: inputData.email,
      }),
    }
  );
});

it('createCardToken debe devolver un token cuando la respuesta es exitosa', async () => {
  const mockToken = { id: 'token_123' };

  const cardData: TransactionData = {
    productId: '1',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  };

  // Configuramos fetch para que devuelva una respuesta exitosa
  (global.fetch as vi.Mock).mockResolvedValue({
    status: 200,
    json: async () => mockToken,
  });

  const token = await createCardToken(cardData);

  expect(token).toEqual(mockToken);
  expect(global.fetch).toHaveBeenCalledWith(
    `${import.meta.env.VITE_API_BASE_URL}/api/card/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: cardData.cardNumber,
        cvc: cardData.cvv,
        expMonth: '12',
        expYear: '25',
        cardHolder: cardData.cardHolder,
      }),
    }
  );
});

it('createCardToken debe devolver null cuando la respuesta no es exitosa', async () => {
  const cardData: TransactionData = {
    productId: '1',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  };

  // Configuramos fetch para que devuelva una respuesta con estado diferente a 200
  (global.fetch as vi.Mock).mockResolvedValue({
    status: 400,
    json: async () => null,
  });

  const token = await createCardToken(cardData);

  expect(token).toBeNull();
  expect(global.fetch).toHaveBeenCalledWith(
    `${import.meta.env.VITE_API_BASE_URL}/api/card/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: cardData.cardNumber,
        cvc: cardData.cvv,
        expMonth: '12',
        expYear: '25',
        cardHolder: cardData.cardHolder,
      }),
    }
  );
});
