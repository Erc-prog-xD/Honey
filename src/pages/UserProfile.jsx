import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { User, Mail, Lock, UserPlus, Trash2, ArrowLeft, Shield, Eye, EyeOff, Key, Check, XCircle } from 'lucide-react';
import '../assets/css/HiveRegistration.css'; // Reusing some grid styles
import '../assets/css/UserProfile.css';

// Components
import Navbar from '../components/Navbar';
import ToastCenter from '../components/Toast';

const UserProfile = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [users, setUsers] = useState([]);

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
        password: '',
        confirmPassword: '',
        role: 'Operador'
    });

    const [showNewUserForm, setShowNewUserForm] = useState(false);

    // Visibility States
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showNewConfirmPass, setShowNewConfirmPass] = useState(false);

    useEffect(() => {
        // Carrega usuário atual do localStorage se existir
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.name) {
            setPersonalInfo(prev => ({ ...prev, ...storedUser, password: '', confirmPassword: '' }));
        }

        // Carrega lista de usuários
        const storedUsers = JSON.parse(localStorage.getItem('hf_users') || '[]');
        if (storedUsers.length === 0) {
            // Mock inicial se estiver vazio
            const initialUsers = [
                { id: 1, name: 'Vicente Neto', email: 'vicente@honeyflow.com', cpf: '123.456.789-00', role: 'Administrador' },
                { id: 2, name: 'João Silva', email: 'joao@honeyflow.com', cpf: '987.654.321-11', role: 'Operador' }
            ];
            localStorage.setItem('hf_users', JSON.stringify(initialUsers));
            setUsers(initialUsers);
        } else {
            setUsers(storedUsers);
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

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email || !newUser.cpf || !newUser.password) {
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

        const userToAdd = {
            id: Date.now(),
            ...newUser
        };

        // Enviar E-mail de Boas-vindas via EmailJS
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (serviceId && templateId && publicKey) {
            const templateParams = {
                user_name: newUser.name,
                user_email: newUser.email,
                user_password: newUser.password,
                login_url: window.location.origin // Redireciona para a home/login do app
            };

            emailjs.send(serviceId, templateId, templateParams, publicKey)
                .then(() => {
                    console.log('E-mail de boas-vindas enviado!');
                })
                .catch((err) => {
                    console.error('Erro ao enviar e-mail:', err);
                });
        }

        const updatedUsers = [...users, userToAdd];
        setUsers(updatedUsers);
        localStorage.setItem('hf_users', JSON.stringify(updatedUsers));

        setNewUser({ name: '', email: '', cpf: '', password: '', confirmPassword: '', role: 'Operador' });
        setShowNewUserForm(false);
        showToast('Usuário cadastrado e e-mail enviado!', 'success');
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

                <div className="profile-grid">
                    {/* Seção Meus Dados */}
                    <div className="reg-card profile-card">
                        <div className="card-header">
                            <User className="header-icon" />
                            <h2>Meus Dados</h2>
                        </div>
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

                    {/* Seção Gestão de Usuários */}
                    <div className="reg-card profile-card">
                        <div className="card-header">
                            <Shield className="header-icon" />
                            <h2>Gestão de Usuários</h2>
                            <button
                                className="add-user-toggle-btn"
                                onClick={() => setShowNewUserForm(!showNewUserForm)}
                            >
                                <UserPlus size={18} />
                                {showNewUserForm ? 'Fechar' : 'Novo Usuário'}
                            </button>
                        </div>

                        {showNewUserForm && (
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
                                                placeholder="Nome"
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
                                                placeholder="CPF"
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
                                    <div className="input-group">
                                        <select
                                            className="role-select"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="Operador">Operador</option>
                                            <option value="Administrador">Administrador</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="add-user-confirm-btn">Cadastrar Usuário</button>
                            </form>
                        )}

                        <div className="users-list">
                            {users.map(user => (
                                <div key={user.id} className="user-item">
                                    <div className="user-avatar">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-email">{user.email}</span>
                                        <div className="user-meta">
                                            <span className="user-cpf">{user.cpf}</span>
                                            <span className="user-role">{user.role}</span>
                                        </div>
                                    </div>
                                    {user.email !== personalInfo.email && (
                                        <button className="user-delete-btn" onClick={() => handleDeleteUser(user.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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
