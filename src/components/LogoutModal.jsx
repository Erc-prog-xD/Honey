import React from 'react';
import '../assets/css/LogoutModal.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay" onClick={onCancel}>
            <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-header">
                    <h3>Sair do Sistema</h3>
                </div>
                <div className="logout-modal-body">
                    <p>Tem certeza que deseja sair?</p>
                </div>
                <div className="logout-modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="btn-confirm" onClick={onConfirm}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
