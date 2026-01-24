import React from 'react';
import '../assets/css/ActionButtons.css';

const ActionButtons = ({ onCancel, onSave, cancelText = "Cancelar", saveText = "Salvar" }) => {
    return (
        <div className="action-buttons-container">
            <button className="btn-action btn-cancel-action" onClick={onCancel}>
                {cancelText}
            </button>
            <button className="btn-action btn-save-action" onClick={onSave}>
                {saveText}
            </button>
        </div>
    );
};

export default ActionButtons;
