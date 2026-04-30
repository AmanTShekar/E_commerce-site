import { useState, useCallback } from 'react';
import { ToastType } from '../components/ui/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToastState] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToastState({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, show: false }));
  }, []);

  return { toast, showToast, hideToast };
};
