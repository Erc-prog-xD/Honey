import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';

const SalesRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        volumeVendido: '',
        valorTotal: ''
    });

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleSave = () => {
        if (!formData.volumeVendido || !formData.valorTotal) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const newSale = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        try {
            const existingSales = JSON.parse(localStorage.getItem('hf_sales') || '[]');
            const updatedSales = [...existingSales, newSale];
            localStorage.setItem('hf_sales', JSON.stringify(updatedSales));

            showToast('Venda registrada com sucesso!', 'success');

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
                        <h1>Registro de Vendas</h1>
                    </div>
                    <ActionButtons onCancel={handleBack} onSave={handleSave} />
                </div>

                <div className="reg-full-width">
                    <div className="reg-card">
                        <h2>Informações gerais</h2>

                        <div className="input-group">
                            <label>Volume vendido</label>
                            <input
                                type="number"
                                placeholder=""
                                value={formData.volumeVendido}
                                onChange={(e) => setFormData({ ...formData, volumeVendido: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Valor total da venda</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder=""
                                value={formData.valorTotal}
                                onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
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

export default SalesRegistration;
