import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';
import CustomSelect from '../components/CustomSelect';

const ProductionRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [apiaries, setApiaries] = useState([]);
    const [formData, setFormData] = useState({
        apiario: '',
        volumeLitros: '',
        dataExtracao: ''
    });

    // Carrega apiários do localStorage
    useEffect(() => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        setApiaries(storedApiaries);
    }, []);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleSave = () => {
        if (!formData.apiario || !formData.volumeLitros || !formData.dataExtracao) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const newProduction = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        try {
            const existingProductions = JSON.parse(localStorage.getItem('hf_productions') || '[]');
            const updatedProductions = [...existingProductions, newProduction];
            localStorage.setItem('hf_productions', JSON.stringify(updatedProductions));

            showToast('Produção registrada com sucesso!', 'success');

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
                        <h1>Registro de Produção</h1>
                    </div>
                    <ActionButtons onCancel={handleBack} onSave={handleSave} />
                </div>

                <div className="reg-full-width">
                    <div className="reg-card">
                        <h2>Informações gerais</h2>

                        <div className="input-group">
                            <label>Selecione o apiário</label>
                            <div className="select-with-btn">
                                <CustomSelect
                                    options={apiaries.map(ap => ({
                                        value: String(ap.id),
                                        label: ap.nomeApelido
                                    }))}
                                    value={formData.apiario}
                                    onChange={(val) => setFormData({ ...formData, apiario: val })}
                                    placeholder="Selecione o apiário"
                                />
                                <button className="add-apiary-btn" onClick={() => navigate('/cadastro-apiario')}>+</button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Volume total (Litros)</label>
                            <input
                                type="number"
                                placeholder=""
                                value={formData.volumeLitros}
                                onChange={(e) => setFormData({ ...formData, volumeLitros: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Data da extração</label>
                            <input
                                type="date"
                                value={formData.dataExtracao}
                                onChange={(e) => setFormData({ ...formData, dataExtracao: e.target.value })}
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

export default ProductionRegistration;
