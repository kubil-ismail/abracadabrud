import { useState } from 'react';

export default function useLoading() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = (message) => {
    setLoading(true);
    setLoadingMessage(message);
  };

  const hideLoading = () => {
    setLoading(false);
    setLoadingMessage('');
  };

  return {
    loading,
    loadingMessage,
    showLoading,
    hideLoading
  };
}
