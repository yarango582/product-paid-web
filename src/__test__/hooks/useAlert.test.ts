// useAlert.test.ts
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useAlert } from '../../hooks/useAlert';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

test('El estado inicial de alert es null', () => {
  const { result } = renderHook(() => useAlert());

  expect(result.current.alert).toBeNull();
});

test('showAlert actualiza el estado de alert con el mensaje y tipo proporcionados', () => {
  const { result } = renderHook(() => useAlert());

  act(() => {
    result.current.showAlert('Test message', 'success');
  });

  expect(result.current.alert).toEqual({
    message: 'Test message',
    type: 'success',
  });
});

test('hideAlert restablece el estado de alert a null', () => {
  const { result } = renderHook(() => useAlert());

  act(() => {
    result.current.showAlert('Test message', 'success');
  });

  act(() => {
    result.current.hideAlert();
  });

  expect(result.current.alert).toBeNull();
});

test('showAlert con duración restablece el estado de alert después del tiempo especificado', () => {
  const { result } = renderHook(() => useAlert());

  act(() => {
    result.current.showAlert('Test message', 'success', 5000);
  });

  expect(result.current.alert).toEqual({
    message: 'Test message',
    type: 'success',
  });

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(result.current.alert).toBeNull();
});
