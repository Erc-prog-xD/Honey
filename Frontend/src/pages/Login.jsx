import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';
import logoBee from '../assets/img/logo-hf.svg';
import ToastCenter from '../components/Toast';

import { apiFetch, decodeJWT } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiFetch('/api/Auth/Login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      // DEBUG: Mostra toda a resposta recebida
      console.log('%c[Login] Resposta completa:', 'color: #8b5cf6; font-weight: bold;', response);

      // Verifica se o login foi bem-sucedido:
      // 1. O campo 'status' deve ser true
      // 2. O campo 'dados' (token) deve existir e não ser vazio
      const loginSuccess = response.status === true && response.dados;

      console.log('%c[Login] Status:', 'color: #8b5cf6;', response.status);
      console.log('%c[Login] Dados (Token):', 'color: #8b5cf6;', response.dados);
      console.log('%c[Login] Login bem-sucedido?', 'color: #8b5cf6;', loginSuccess);

      if (loginSuccess) {
        // Salva o token no localStorage
        localStorage.setItem('Token', response.dados);

        // Decodifica o JWT para extrair os dados do usuário
        const userData = decodeJWT(response.dados);
        console.log('%c[Login] Dados do usuário (JWT):', 'color: #10b981; font-weight: bold;', userData);

        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        showToast('Login realizado com sucesso!', 'success');
        setTimeout(() => navigate('/dashboard'), 700);
      } else {
        // Login falhou - mostra a mensagem da API
        const errorMessage = response.mensage || 'Email ou senha inválidos.';
        console.log('%c[Login] Falha:', 'color: #ef4444;', errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('%c[Login] Erro de conexão:', 'color: #ef4444; font-weight: bold;', error);
      showToast(error.mensage || 'Erro ao conectar com o servidor.', 'error');
    } finally {
      setIsLoading(false);
    }
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
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="form-bottom">
              <Link to="/forgot-password" className="forgot-link">
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
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