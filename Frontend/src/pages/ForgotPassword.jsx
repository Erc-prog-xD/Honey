import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
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
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_RECOVERY_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log('Tentando enviar e-mail com:', { serviceId, templateId, publicKey: publicKey ? 'PRESENTE' : 'AUSENTE' });

      if (serviceId && templateId && publicKey) {
        const templateParams = {
          user_email: email,
          reset_link: `${window.location.origin}/reset-password` // Ajuste conforme sua rota de reset
        };

        const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log('Sucesso EmailJS:', result.text);
      } else {
        console.warn('Configurações de E-mail ausentes no .env');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setIsSubmitted(true);
      showToast('E-mail enviado! Verifique sua caixa de entrada.', 'success');

      // Não redireciona imediatamente para o usuário ler a mensagem de sucesso
    } catch (error) {
      console.error('Erro detalhado EmailJS:', error);
      showToast(`Erro: ${error.text || 'Falha ao enviar e-mail'}`, 'error');
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

        {/* Lado Esquerdo - Premium Yellow Panel */}
        <div className="left-panel">
          <img src={logoBee} alt="Bee Logo" className="bee-logo" />
        </div>

        {/* Lado Direito - Form Panel */}
        <div className="right-panel">
          <button className="back-btn" onClick={handleGoBack} aria-label="Voltar">
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>

          {!isSubmitted ? (
            <>
              <h1>Recuperar Senha</h1>
              <p className="subtitle">
                Insira o e-mail associado à sua conta para receber um link de redefinição de senha.
              </p>

              <form className="forgot-form" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Seu e-mail cadastrado"
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
                  {isLoading ? 'Enviando...' : 'Enviar Instruções'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <CheckCircle size={40} />
              </div>
              <h1>E-mail enviado!</h1>
              <p className="subtitle">
                Enviamos um link de recuperação para <strong>{email}</strong>.
                Por favor, verifique sua caixa de entrada e spam.
              </p>
              <button className="submit-btn" onClick={handleGoBack}>
                Voltar ao Login
              </button>
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
