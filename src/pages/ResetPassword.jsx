import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/ForgotPassword.css'; // Reusing base container and card styles
import logoBee from '../assets/img/logo_hf.svg';
import ToastCenter from '../components/Toast';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (passwords.newPassword.length < 6) {
            showToast('A senha deve ter pelo menos 6 caracteres.', 'warning');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }

        setIsLoading(true);

        try {
            // Simular atualização no "banco de dados" (localStorage para este protótipo)
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSuccess(true);
            showToast('Senha redefinida com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao redefinir senha. Tente novamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="left-panel">
                    <img src={logoBee} alt="Bee Logo" className="bee-logo" />
                </div>

                <div className="right-panel">
                    {!isSuccess ? (
                        <>
                            <h1>Nova Senha</h1>
                            <p className="subtitle">Crie uma nova senha segura para acessar sua conta HoneyFlow.</p>

                            <form className="forgot-form" onSubmit={handleReset}>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        className="input-field"
                                        type={showPass ? "text" : "password"}
                                        placeholder="Nova senha"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        className="input-field"
                                        type={showConfirmPass ? "text" : "password"}
                                        placeholder="Confirmar nova senha"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    >
                                        {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Redefinindo...' : 'Atualizar Senha'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-message">
                            <div className="success-icon">
                                <CheckCircle size={40} />
                            </div>
                            <h1>Tudo pronto!</h1>
                            <p className="subtitle">Sua senha foi atualizada. Agora você já pode fazer login normalmente.</p>
                            <button className="submit-btn" onClick={() => navigate('/')}>
                                Voltar ao Login
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {toast && (
                <ToastCenter
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ResetPassword;
