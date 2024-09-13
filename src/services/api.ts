import { IProcessPayment, Product, Transaction, TransactionData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const processTransaction = async (data: IProcessPayment): Promise<Transaction> => {
  const body = {
    productId: data.productId,
    quantity: data.quantity,
    cardToken: data.cardToken,
    email: data.email,
  }
  const response = await fetch(`${API_BASE_URL}/api/payments/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Failed to process transaction');
  }
  return response.json();
};

export const createCardToken = async (cardData: TransactionData) => {
  const body = {
    number: cardData.cardNumber,
    cvc: cardData.cvv,
    expMonth: cardData.expiryDate.split('/')[0],
    expYear: cardData.expiryDate.split('/')[1],
    cardHolder: cardData.cardHolder,
  }
  const response = await fetch(`${API_BASE_URL}/api/card/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.status === 200) {
    return response.json();
  }
  return null;
};