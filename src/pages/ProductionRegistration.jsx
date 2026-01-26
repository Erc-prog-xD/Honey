import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
import CustomCalendar from '../components/CustomCalendar';

const ProductionRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [apiaries, setApiaries] = useState([]);
    const [honeyTypes, setHoneyTypes] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    const [formData, setFormData] = useState({
        apiario: '',
        volumeLitros: '',
        dataExtracao: new Date(),
        tipoMel: ''
    });

    // Carrega apiários e tipos de mel do localStorage
    useEffect(() => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        setApiaries(storedApiaries);

        const storedHoneyTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
        setHoneyTypes(storedHoneyTypes);
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
            dataExtracao: formData.dataExtracao instanceof Date ? formData.dataExtracao.toISOString() : formData.dataExtracao,
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

    const handleDateChange = (date) => {
        setFormData({ ...formData, dataExtracao: date });
        setShowCalendar(false);
    };

    // Close calendar on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date) => {
        if (!(date instanceof Date)) return date;
        return date.toLocaleDateString('pt-BR');
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
                                placeholder="0.00"
                                value={formData.volumeLitros}
                                onChange={(e) => setFormData({ ...formData, volumeLitros: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de mel</label>
                            <CustomSelect
                                options={honeyTypes.map(type => ({
                                    value: type,
                                    label: type
                                }))}
                                value={formData.tipoMel}
                                onChange={(val) => setFormData({ ...formData, tipoMel: val })}
                                placeholder="Selecione o tipo de mel"
                            />
                        </div>

                        <div className="input-group" style={{ position: 'relative' }} ref={calendarRef}>
                            <label>Data da extração</label>
                            <div
                                className="datepicker-trigger"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <span>{formatDate(formData.dataExtracao)}</span>
                                <CalendarIcon size={20} color="var(--hf-primary-dark)" />
                            </div>

                            {showCalendar && (
                                <div className="datepicker-popup">
                                    <CustomCalendar
                                        value={formData.dataExtracao}
                                        onChange={handleDateChange}
                                    />
                                </div>
                            )}
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
