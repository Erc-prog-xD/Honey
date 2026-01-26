import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import logoBee from '../assets/img/logo-hf.svg';
import ToastCenter from '../components/Toast';

// --- Componente Input ---
const Input = ({ icon: Icon, prefix, ...props }) => {
  return (
    <div className="input-wrapper">
      {Icon && <Icon className="input-icon" size={20} />}
      {prefix && <span className="input-prefix">{prefix}</span>}
      <input className="input-field" {...props} />
    </div>
  );
};

const Login = () => {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Simulação de Login: Salva o usuário no localStorage para o ProtectedRoute validar
    const mockUser = {
      name: 'Vicente Neto',
      email: loginEmail,
      role: 'Administrador'
    };

    localStorage.setItem('user', JSON.stringify(mockUser));

    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => navigate('/dashboard'), 700);
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Lado Esquerdo - Amarelo */}
        <div className="left-panel">
          <img src={logoBee} alt="Bee Logo" className="bee-logo" />
        </div>

        {/* Lado Direito - Branco */}
        <div className="right-panel">
          <h1>Bem-vindo</h1>

          {/* Formulário de Login */}
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <Input
              type="email"
              placeholder="Email"
              icon={Mail}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              icon={Lock}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <div className="form-bottom">
              <Link to="/forgot-password" className="forgot-link">
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" className="submit-btn">
              Entrar
            </button>
          </form>
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

export default Login;