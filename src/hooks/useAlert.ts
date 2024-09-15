import { useState, useCallback } from 'react';

type AlertType = 'success' | 'error';

interface AlertState {
  message: string;
  type: AlertType;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((message: string, type: AlertType, duration?: number) => {
    setAlert({ message, type });

    if (duration) {
      setTimeout(() => {
        setAlert(null);
      }, duration);
    }
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return { alert, showAlert, hideAlert };
};