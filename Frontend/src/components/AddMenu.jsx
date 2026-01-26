import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/AddMenu.css';

const AddMenu = ({ onClose }) => {
    const navigate = useNavigate();
    return (
        <div className="add-modal" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="add-card" onClick={(e) => e.stopPropagation()}>
                <div className="add-header">
                    <span>Adicionar</span>
                    <button className="close-x" onClick={onClose}>×</button>
                </div>
                <div className="add-content">
                    <button
                        className="btn-menu-add btn-yellow-add"
                        onClick={() => { navigate('/cadastro-colmeia'); onClose(); }}
                    >
                        Colmeia
                    </button>
                    <button className="btn-menu-add btn-orange-add" onClick={() => { navigate('/cadastro-apiario'); onClose(); }}>Apiário</button>
                </div>
            </div>
        </div>
    );
};

export default AddMenu;
