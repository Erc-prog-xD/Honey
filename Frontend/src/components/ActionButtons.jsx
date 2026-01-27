import React from 'react';
import { Loader2 } from 'lucide-react';
import '../assets/css/ActionButtons.css';

const ActionButtons = ({ onCancel, onSave, cancelText = "Cancelar", saveText = "Salvar", loading = false }) => {
    return (
        <div className="action-buttons-container">
            <button className="btn-action btn-cancel-action" onClick={onCancel} disabled={loading}>
                {cancelText}
            </button>
            <button className="btn-action btn-save-action" onClick={onSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Salvando..." : saveText}
            </button>
        </div>
    );
};

export default ActionButtons;
