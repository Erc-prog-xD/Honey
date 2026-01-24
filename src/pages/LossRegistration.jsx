import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';

const LossRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        volumePerdido: '',
        dataPerda: '',
        razaoMotivo: ''
    });

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleSave = () => {
        if (!formData.volumePerdido || !formData.dataPerda || !formData.razaoMotivo) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const newLoss = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        try {
            const existingLosses = JSON.parse(localStorage.getItem('hf_losses') || '[]');
            const updatedLosses = [...existingLosses, newLoss];
            localStorage.setItem('hf_losses', JSON.stringify(updatedLosses));

            showToast('Perda registrada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            showToast('Erro ao salvar os dados. Tente novamente.', 'error');
        }
    };

    return (
        <div className="registration-page">
            <Navbar />

            <main className="reg-content">
                <div className="reg-header-bar">
                    <div className="title-box">
                        <h1>Registro de Perdas</h1>
                    </div>
                    <ActionButtons onCancel={handleBack} onSave={handleSave} />
                </div>

                <div className="reg-full-width">
                    <div className="reg-card">
                        <h2>Informações gerais</h2>

                        <div className="input-group">
                            <label>Volume perdido</label>
                            <input
                                type="number"
                                placeholder=""
                                value={formData.volumePerdido}
                                onChange={(e) => setFormData({ ...formData, volumePerdido: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Data da perda</label>
                            <input
                                type="date"
                                value={formData.dataPerda}
                                onChange={(e) => setFormData({ ...formData, dataPerda: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Razão/Motivo</label>
                            <input
                                type="text"
                                placeholder=""
                                value={formData.razaoMotivo}
                                onChange={(e) => setFormData({ ...formData, razaoMotivo: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </main>

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

export default LossRegistration;
