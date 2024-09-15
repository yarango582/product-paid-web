// useValidateCard.test.ts
import { renderHook, act } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import { useValidateCard } from '../../hooks/useValidateCard';
import * as api from '../../services/api';
import { TransactionData } from '../../types';

// Mock del módulo completo
vi.mock('../../services/api', () => ({
  createCardToken: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test('El estado inicial es correcto', () => {
  const cardInfo: TransactionData = {
    productId: '1',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  };

  const { result } = renderHook(() => useValidateCard(cardInfo));

  expect(result.current.cardToken).toBeNull();
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
  expect(typeof result.current.validateCard).toBe('function');
});

test('validateCard actualiza cardToken en caso de éxito', async () => {
  const cardInfo: TransactionData = {
    productId: '1',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  };

  const mockTokenResponse = { data: { id: 'token_123' } };

  // Accedemos a la función mockeada
  const createCardTokenMock = api.createCardToken as MockedFunction<typeof api.createCardToken>;
  createCardTokenMock.mockResolvedValue(mockTokenResponse);

  const { result } = renderHook(() => useValidateCard(cardInfo));

  await act(async () => {
    await result.current.validateCard();
  });

  expect(createCardTokenMock).toHaveBeenCalledWith(cardInfo);
  expect(result.current.cardToken).toBe('token_123');
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
});

test('validateCard actualiza error en caso de fallo', async () => {
  const cardInfo: TransactionData = {
    productId: '1',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  };

  const errorMessage = 'Network Error';

  const createCardTokenMock = api.createCardToken as MockedFunction<typeof api.createCardToken>;
  createCardTokenMock.mockRejectedValue(new Error(errorMessage));

  const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

  const { result } = renderHook(() => useValidateCard(cardInfo));

  await act(async () => {
    await result.current.validateCard();
  });

  expect(createCardTokenMock).toHaveBeenCalledWith(cardInfo);
  expect(result.current.cardToken).toBeNull();
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe('Failed to validate card');
  expect(consoleErrorMock).toHaveBeenCalled();

  consoleErrorMock.mockRestore();
});

test('loading se actualiza correctamente durante validateCard', async () => {
  const cardInfo: TransactionData = {
    productId: '1',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
  };

  const createCardTokenMock = api.createCardToken as MockedFunction<typeof api.createCardToken>;

  let resolvePromise: () => void;
  const pendingPromise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  createCardTokenMock.mockReturnValue(pendingPromise);

  const { result } = renderHook(() => useValidateCard(cardInfo));

  act(() => {
    result.current.validateCard();
  });

  expect(result.current.loading).toBe(true);

  await act(async () => {
    resolvePromise();
  });

  expect(result.current.loading).toBe(false);
});
