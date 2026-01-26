import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import '../assets/css/Toast.css';

const ToastCenter = ({ message, type = 'info', onClose, duration = 2000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-center-icon" size={20} />;
      case 'error':
        return <XCircle className="toast-center-icon" size={20} />;
      case 'warning':
        return <AlertCircle className="toast-center-icon" size={20} />;
      case 'info':
      default:
        return <Info className="toast-center-icon" size={20} />;
    }
  };

  return (
    <div className={`toast-center toast-center-${type}`}>
      <div className="toast-center-inner">
        <div className="toast-center-icon-wrapper">
          {getIcon()}
        </div>
        <div className="toast-center-text">
          <h3 className="toast-center-title">
            {type === 'success' && 'Sucesso!'}
            {type === 'error' && 'Erro!'}
            {type === 'warning' && 'Aviso!'}
            {type === 'info' && 'Informação'}
          </h3>
          <p className="toast-center-message">{message}</p>
        </div>
        <button
          className="toast-center-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ToastCenter;
