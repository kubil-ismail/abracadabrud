// component error message
import React from 'react';

const ErrorMessage = ({ message }) => {
  return <div className="text-red-500 text-sm error-message">{message}</div>;
};

export default ErrorMessage;
