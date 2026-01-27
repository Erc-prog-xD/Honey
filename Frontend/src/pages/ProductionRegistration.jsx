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
import { buscarApiarios, registrarMovimentacao, buscarColmeiasDoApiario, buscarTiposMel } from '../services/apiarioService';

const ProductionRegistration = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [apiaries, setApiaries] = useState([]);
    const [honeyTypes, setHoneyTypes] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const calendarRef = useRef(null);

    const [formData, setFormData] = useState({
        apiarioId: '',
        volumeLitros: '',
        dataExtracao: new Date(),
        tipoMel: ''
    });

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    // Carrega apiários e tipos de mel da API
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await buscarApiarios();
                const apiariesData = Array.isArray(response) ? response : (response?.dados || []);
                setApiaries(apiariesData);
                setHoneyTypes(buscarTiposMel());
            } catch (error) {
                console.error('Erro ao buscar apiários:', error);
                showToast('Erro ao carregar apiários', 'error');
            }
        };
        loadData();
    }, []);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleSave = async () => {
        if (!formData.apiarioId || !formData.volumeLitros || !formData.dataExtracao) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Verifica se o apiário tem colmeias
        try {
            const hives = await buscarColmeiasDoApiario(formData.apiarioId);
            const hivesArray = Array.isArray(hives) ? hives : (hives?.dados || []);

            if (hivesArray.length === 0) {
                showToast('Não é possível registrar produção para um apiário sem colmeias.', 'error');
                return;
            }
        } catch (error) {
            showToast('Erro ao verificar colmeias.', 'error');
            return;
        }

        const payload = {
            tipo: 1, // Colheita
            quantidadeKg: parseFloat(formData.volumeLitros),
            data: formData.dataExtracao instanceof Date ? formData.dataExtracao.toISOString().split('T')[0] : formData.dataExtracao,
            observacao: `Tipo de mel: ${formData.tipoMel}`
        };

        try {
            setLoading(true);
            const response = await registrarMovimentacao(formData.apiarioId, payload);

            if (response?.sucesso || response?.success || response?.dados) {
                showToast('Produção registrada com sucesso!', 'success');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                showToast('Erro ao registrar produção.', 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar produção:', error);
            showToast('Erro ao salvar os dados. Tente novamente.', 'error');
        } finally {
            setLoading(false);
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
                    <ActionButtons onCancel={handleBack} onSave={handleSave} loading={loading} />
                </div>

                <div className="reg-full-width">
                    <div className="reg-card">
                        <h2>Informações gerais</h2>

                        <div className="input-group">
                            <label>Selecione o apiário <span className="required-star">*</span></label>
                            <div className="select-with-btn">
                                <CustomSelect
                                    options={apiaries.map(ap => ({
                                        value: String(ap.id),
                                        label: ap.nomeApelido
                                    }))}
                                    value={formData.apiarioId}
                                    onChange={(val) => setFormData({ ...formData, apiarioId: val })}
                                    placeholder="Selecione o apiário"
                                />
                                <button className="add-apiary-btn" onClick={() => navigate('/cadastro-apiario')}>+</button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Volume total (Litros) <span className="required-star">*</span></label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.volumeLitros}
                                onChange={(e) => setFormData({ ...formData, volumeLitros: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de mel <span className="required-star">*</span></label>
                            <CustomSelect
                                options={honeyTypes}
                                value={formData.tipoMel}
                                onChange={(val) => setFormData({ ...formData, tipoMel: val })}
                                placeholder="Selecione o tipo de mel"
                            />
                        </div>

                        <div className="input-group" style={{ position: 'relative' }} ref={calendarRef}>
                            <label>Data da extração <span className="required-star">*</span></label>
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
