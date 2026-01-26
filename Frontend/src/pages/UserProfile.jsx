import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { User, Mail, Lock, UserPlus, Trash2, ArrowLeft, Shield, Eye, EyeOff, Key, Check, XCircle, Phone } from 'lucide-react';
import '../assets/css/HiveRegistration.css'; // Reusing some grid styles
import '../assets/css/UserProfile.css';

// Components
import Navbar from '../components/Navbar';
import ToastCenter from '../components/Toast';
import { apiFetch, getCurrentUser, isAdmin } from '../services/api';

const UserProfile = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [users, setUsers] = useState([]);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    // Helper: Mask CPF (000.000.000-00)
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    // Helper: Validate CPF Checksum
    const validateCPF = (cpf) => {
        const cleanCPF = String(cpf).replace(/\D/g, '');
        if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;

        let sum = 0;
        let rest;

        for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(cleanCPF.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(cleanCPF.substring(10, 11))) return false;

        return true;
    };

    // Personal Info State
    const [personalInfo, setPersonalInfo] = useState({
        name: 'Vicente Neto',
        email: 'vicente@honeyflow.com',
        cpf: '000.000.000-00',
        password: '',
        confirmPassword: ''
    });

    // New User State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        cpf: '',
        celular: '',
        password: '',
        confirmPassword: '',
        role: 'Operador'
    });

    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // Visibility States
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showNewConfirmPass, setShowNewConfirmPass] = useState(false);

    useEffect(() => {
        // Verifica se o usuário é administrador
        setUserIsAdmin(isAdmin());

        // Carrega usuário atual do token JWT
        const currentUser = getCurrentUser();
        if (currentUser) {
            setPersonalInfo(prev => ({
                ...prev,
                name: currentUser.name || '',
                email: currentUser.email || '',
                cpf: currentUser.cpf ? maskCPF(currentUser.cpf) : '',
                password: '',
                confirmPassword: ''
            }));
        }
    }, []);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleSavePersonalInfo = (e) => {
        e.preventDefault();

        if (personalInfo.cpf && !validateCPF(personalInfo.cpf)) {
            showToast('CPF pessoal inválido!', 'error');
            return;
        }

        if (personalInfo.password && personalInfo.password !== personalInfo.confirmPassword) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }

        localStorage.setItem('user', JSON.stringify({
            ...personalInfo,
            password: '',
            confirmPassword: ''
        }));
        showToast('Dados atualizados com sucesso!', 'success');
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!newUser.name || !newUser.email || !newUser.cpf || !newUser.celular || !newUser.password) {
            showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!validateCPF(newUser.cpf)) {
            showToast('O CPF digitado é inválido!', 'error');
            return;
        }

        if (newUser.password !== newUser.confirmPassword) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }

        setIsRegistering(true);

        try {
            // Remove a máscara do CPF e do celular para enviar apenas números
            const cleanCPF = newUser.cpf.replace(/\D/g, '');
            const cleanCelular = newUser.celular.replace(/\D/g, '');

            const response = await apiFetch('/api/Auth/Register', {
                method: 'POST',
                body: JSON.stringify({
                    nome: newUser.name,
                    cpf: cleanCPF,
                    email: newUser.email,
                    celular: cleanCelular,
                    password: newUser.password
                })
            });

            console.log('%c[Register] Resposta:', 'color: #8b5cf6; font-weight: bold;', response);

            if (response.status === true) {
                // Enviar E-mail de Boas-vindas via EmailJS (opcional)
                const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
                const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME_ID;
                const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

                if (serviceId && templateId && publicKey) {
                    const templateParams = {
                        user_name: newUser.name,
                        user_email: newUser.email,
                        user_password: newUser.password,
                        login_url: window.location.origin
                    };

                    emailjs.send(serviceId, templateId, templateParams, publicKey)
                        .then(() => console.log('E-mail de boas-vindas enviado!'))
                        .catch((err) => console.error('Erro ao enviar e-mail:', err));
                }

                // Adiciona o usuário à lista local para exibição
                const userToAdd = {
                    id: Date.now(),
                    name: newUser.name,
                    email: newUser.email,
                    cpf: newUser.cpf,
                    celular: newUser.celular,
                    role: newUser.role
                };
                setUsers(prev => [...prev, userToAdd]);

                setNewUser({ name: '', email: '', cpf: '', celular: '', password: '', confirmPassword: '', role: 'Operador' });
                setShowNewUserForm(false);
                showToast(response.mensage || 'Usuário cadastrado com sucesso!', 'success');
            } else {
                showToast(response.mensage || 'Erro ao cadastrar usuário.', 'error');
            }
        } catch (error) {
            console.error('%c[Register] Erro:', 'color: #ef4444; font-weight: bold;', error);
            showToast(error.mensage || 'Erro ao conectar com o servidor.', 'error');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Tem certeza que deseja remover este usuário?')) {
            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            localStorage.setItem('hf_users', JSON.stringify(updatedUsers));
            showToast('Usuário removido com sucesso!', 'success');
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="registration-page">
            <Navbar />

            <main className="reg-content">
                <div className="reg-header-bar">
                    <div className="title-box">
                        <h1>Meu Perfil</h1>
                    </div>
                    <div className="action-buttons-container">
                        <button className="btn-action btn-cancel-action" onClick={handleBack}>
                            <ArrowLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>

                <div className={userIsAdmin ? "reg-grid" : "reg-full-width"}>
                    {/* Seção Meus Dados */}
                    <div className="reg-card">
                        <h2>Meus Dados</h2>
                        <form onSubmit={handleSavePersonalInfo}>
                            <div className="input-group">
                                <label>Nome completo <span className="required-star">*</span></label>
                                <div className="input-with-icon">
                                    <div className="icon-wrapper"><User size={20} /></div>
                                    <input
                                        type="text"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>E-mail <span className="required-star">*</span></label>
                                <div className="input-with-icon">
                                    <div className="icon-wrapper"><Mail size={20} /></div>
                                    <input
                                        type="email"
                                        value={personalInfo.email}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>CPF <span className="required-star">*</span></label>
                                <div className="input-with-icon">
                                    <div className="icon-wrapper"><Key size={20} /></div>
                                    <input
                                        type="text"
                                        value={personalInfo.cpf || ''}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, cpf: maskCPF(e.target.value) })}
                                        placeholder="000.000.000-00"
                                    />
                                    {personalInfo.cpf && personalInfo.cpf.length === 14 && (
                                        <div className={`validation-icon ${validateCPF(personalInfo.cpf) ? 'valid' : 'invalid'}`}>
                                            {validateCPF(personalInfo.cpf) ? <Check size={18} /> : <XCircle size={18} />}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Alterar Senha</label>
                                <div className="input-with-icon">
                                    <div className="icon-wrapper"><Lock size={20} /></div>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={personalInfo.password}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, password: e.target.value })}
                                        placeholder="Deixe em branco para manter a atual"
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {personalInfo.password && (
                                <div className="input-group">
                                    <label>Confirmar Nova Senha</label>
                                    <div className="input-with-icon">
                                        <div className="icon-wrapper"><Lock size={20} /></div>
                                        <input
                                            type={showConfirmPass ? "text" : "password"}
                                            value={personalInfo.confirmPassword}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, confirmPassword: e.target.value })}
                                            placeholder="Confirme sua nova senha"
                                        />
                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        >
                                            {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="profile-save-btn">
                                Salvar Alterações
                            </button>
                        </form>
                    </div>

                    {/* Seção Cadastrar Novo Usuário - Apenas para Administradores */}
                    {userIsAdmin && (
                        <div className="reg-card">
                            <h2>Cadastrar Novo Usuário</h2>

                            <form className="new-user-form" onSubmit={handleAddUser}>
                                <div className="new-user-grid">
                                    <div className="input-group">
                                        <label>E-mail <span className="required-star">*</span></label>
                                        <div className="input-with-icon">
                                            <div className="icon-wrapper"><Mail size={20} /></div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Nome <span className="required-star">*</span></label>
                                        <div className="input-with-icon">
                                            <div className="icon-wrapper"><User size={20} /></div>
                                            <input
                                                type="text"
                                                placeholder="Nome completo"
                                                value={newUser.name}
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>CPF <span className="required-star">*</span></label>
                                        <div className="input-with-icon">
                                            <div className="icon-wrapper"><Key size={20} /></div>
                                            <input
                                                type="text"
                                                placeholder="000.000.000-00"
                                                value={newUser.cpf}
                                                onChange={(e) => setNewUser({ ...newUser, cpf: maskCPF(e.target.value) })}
                                            />
                                            {newUser.cpf && newUser.cpf.length === 14 && (
                                                <div className={`validation-icon ${validateCPF(newUser.cpf) ? 'valid' : 'invalid'}`}>
                                                    {validateCPF(newUser.cpf) ? <Check size={18} /> : <XCircle size={18} />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Celular <span className="required-star">*</span></label>
                                        <div className="input-with-icon">
                                            <div className="icon-wrapper"><Phone size={20} /></div>
                                            <input
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                value={newUser.celular}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    const masked = value
                                                        .replace(/(\d{2})(\d)/, '($1) $2')
                                                        .replace(/(\d{5})(\d)/, '$1-$2')
                                                        .slice(0, 15);
                                                    setNewUser({ ...newUser, celular: masked });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Senha <span className="required-star">*</span></label>
                                        <div className="input-with-icon">
                                            <div className="icon-wrapper"><Lock size={20} /></div>
                                            <input
                                                type={showNewPass ? "text" : "password"}
                                                placeholder="Senha"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="eye-btn"
                                                onClick={() => setShowNewPass(!showNewPass)}
                                            >
                                                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Confirmar Senha <span className="required-star">*</span></label>
                                        <div className="input-with-icon">
                                            <div className="icon-wrapper"><Lock size={20} /></div>
                                            <input
                                                type={showNewConfirmPass ? "text" : "password"}
                                                placeholder="Confirmar Senha"
                                                value={newUser.confirmPassword}
                                                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="eye-btn"
                                                onClick={() => setShowNewConfirmPass(!showNewConfirmPass)}
                                            >
                                                {showNewConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="add-user-confirm-btn" disabled={isRegistering}>
                                    {isRegistering ? 'Cadastrando...' : 'Cadastrar Usuário'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>

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

export default UserProfile;
