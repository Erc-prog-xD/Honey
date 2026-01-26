import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import '../assets/css/Navbar.css';
import logo from '../assets/img/logo-hf-lateral.svg';
import LogoutModal from './LogoutModal';

const Navbar = () => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        // Limpa dados de autenticação
        localStorage.removeItem('Token');
        localStorage.removeItem('user');
        setShowLogoutModal(false);
        navigate('/');
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo-container">
                    <img src={logo} alt="HoneyFlow Logo" className="navbar-logo" />
                </div>
                <div className="navbar-actions">
                    <button className="navbar-action-btn" onClick={() => navigate('/perfil')}>
                        <User size={20} />
                        <span className="action-text">Perfil</span>
                    </button>
                    <button className="navbar-logout-btn" onClick={handleLogoutClick}>
                        <LogOut size={20} />
                        <span className="logout-text">Sair</span>
                    </button>
                </div>
            </nav>
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </>
    );
};

export default Navbar;
