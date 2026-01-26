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

const SalesRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);
    const [honeyTypes, setHoneyTypes] = useState([]);
    const [formData, setFormData] = useState({
        volumeVendido: '',
        valorTotal: '',
        dataVenda: new Date(),
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
        if (!formData.volumeVendido || !formData.valorTotal || !formData.dataVenda) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const newSale = {
            id: Date.now(),
            ...formData,
            dataVenda: formData.dataVenda instanceof Date ? formData.dataVenda.toISOString() : formData.dataVenda,
            createdAt: new Date().toISOString()
        };

        try {
            const existingSales = JSON.parse(localStorage.getItem('hf_sales') || '[]');
            const updatedSales = [...existingSales, newSale];
            localStorage.setItem('hf_sales', JSON.stringify(updatedSales));

            // Salva novo tipo de mel se não existir
            if (formData.tipoMel && formData.tipoMel.trim()) {
                const existingTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
                if (!existingTypes.includes(formData.tipoMel.trim())) {
                    const updatedTypes = [...existingTypes, formData.tipoMel.trim()];
                    localStorage.setItem('hf_honey_types', JSON.stringify(updatedTypes));
                }
            }

            showToast('Venda registrada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            showToast('Erro ao salvar os dados. Tente novamente.', 'error');
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dataVenda: date });
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
                        <h1>Registro de Vendas</h1>
                    </div>
                    <ActionButtons onCancel={handleBack} onSave={handleSave} />
                </div>

                <div className="reg-full-width">
                    <div className="reg-card">
                        <h2>Informações gerais</h2>

                        <div className="input-group">
                            <label>Volume vendido (L)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.volumeVendido}
                                onChange={(e) => setFormData({ ...formData, volumeVendido: e.target.value })}
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

                        <div className="input-group">
                            <label>Valor total da venda (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.valorTotal}
                                onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                            />
                        </div>

                        <div className="input-group" style={{ position: 'relative' }} ref={calendarRef}>
                            <label>Data da venda</label>
                            <div
                                className="datepicker-trigger"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <span>{formatDate(formData.dataVenda)}</span>
                                <CalendarIcon size={20} color="var(--hf-primary-dark)" />
                            </div>

                            {showCalendar && (
                                <div className="datepicker-popup">
                                    <CustomCalendar
                                        value={formData.dataVenda}
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

export default SalesRegistration;
