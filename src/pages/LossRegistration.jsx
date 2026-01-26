import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
import CustomCalendar from '../components/CustomCalendar';

const LossRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);
    const [honeyTypes, setHoneyTypes] = useState([]);
    const [formData, setFormData] = useState({
        volumePerdido: '',
        dataPerda: new Date(),
        razaoMotivo: '',
        tipoMel: ''
    });

    // Carrega tipos de mel do localStorage
    useEffect(() => {
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
        if (!formData.volumePerdido || !formData.dataPerda || !formData.razaoMotivo) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const newLoss = {
            id: Date.now(),
            ...formData,
            dataPerda: formData.dataPerda.toISOString(),
            createdAt: new Date().toISOString()
        };

        try {
            const existingLosses = JSON.parse(localStorage.getItem('hf_losses') || '[]');
            const updatedLosses = [...existingLosses, newLoss];
            localStorage.setItem('hf_losses', JSON.stringify(updatedLosses));

            // Salva novo tipo de mel se não existir
            if (formData.tipoMel && formData.tipoMel.trim()) {
                const existingTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
                if (!existingTypes.includes(formData.tipoMel.trim())) {
                    const updatedTypes = [...existingTypes, formData.tipoMel.trim()];
                    localStorage.setItem('hf_honey_types', JSON.stringify(updatedTypes));
                }
            }

            showToast('Perda registrada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            showToast('Erro ao salvar os dados. Tente novamente.', 'error');
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dataPerda: date });
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
        return date.toLocaleDateString('pt-BR');
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
                        <h2>Informações da Perda</h2>

                        <div className="input-group">
                            <label>Volume perdido (L) <span className="required-star">*</span></label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.volumePerdido}
                                onChange={(e) => setFormData({ ...formData, volumePerdido: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de mel <span className="required-star">*</span></label>
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
                            <label>Data da perda <span className="required-star">*</span></label>
                            <div
                                className="datepicker-trigger"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <span>{formatDate(formData.dataPerda)}</span>
                                <CalendarIcon size={20} color="var(--hf-primary-dark)" />
                            </div>

                            {showCalendar && (
                                <div className="datepicker-popup">
                                    <CustomCalendar
                                        value={formData.dataPerda}
                                        onChange={handleDateChange}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Razão/Motivo <span className="required-star">*</span></label>
                            <input
                                type="text"
                                placeholder="Ex: Quebra de pote, Formigas, etc."
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
