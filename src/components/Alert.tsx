import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
  };

  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
  };

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${iconStyles[type]}`} />,
    error: <AlertCircle className={`w-5 h-5 ${iconStyles[type]}`} />,
  };

  return (
    <div className={`p-4 rounded-lg ${styles[type]} flex items-center gap-3`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Alert;