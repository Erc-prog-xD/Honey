import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/ForgotPassword.css';
import logoBee from '../assets/img/logo_hf.svg';
import ToastCenter from '../components/Toast';

// --- Componente Input ---
const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="input-wrapper">
      {Icon && <Icon className="input-icon" size={20} />}
      <input className="input-field" {...props} />
    </div>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Por favor, insira um email válido.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast('Email de recuperação enviado com sucesso!', 'success');
      setIsSubmitted(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      showToast('Erro ao enviar email de recuperação. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">

        {/* Lado Esquerdo - Amarelo */}
        <div className="left-panel">
          <img src={logoBee} alt="Bee Logo" className="bee-logo" />
        </div>

        {/* Lado Direito - Branco */}
        <div className="right-panel">
          <button className="back-btn" onClick={handleGoBack} aria-label="Voltar">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <h1>Recuperar Senha</h1>
          <p className="subtitle">
            {isSubmitted
              ? 'Um email de recuperação foi enviado para você. Verifique sua caixa de entrada.'
              : 'Insira o email associado à sua conta para receber um link de redefinição de senha.'}
          </p>

          {!isSubmitted ? (
            <form className="forgot-form" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />

              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>Você será redirecionado em breve...</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-center-container">
          <ToastCenter
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
