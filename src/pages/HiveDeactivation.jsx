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

const HiveDeactivation = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [apiaries, setApiaries] = useState([]);
    const [hives, setHives] = useState([]);
    const [filteredHives, setFilteredHives] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const calendarRef = useRef(null);

    const [formData, setFormData] = useState({
        apiario: '',
        colmeia: '',
        razaoMotivo: '',
        dataDesativacao: new Date()
    });

    // Carrega apiários e colmeias do localStorage
    useEffect(() => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        const storedHives = JSON.parse(localStorage.getItem('hf_hives') || '[]');
        setApiaries(storedApiaries);
        setHives(storedHives);
    }, []);

    // Filtra colmeias quando o apiário é selecionado
    useEffect(() => {
        if (formData.apiario) {
            const filtered = hives.filter(hive => String(hive.apiario) === formData.apiario);
            setFilteredHives(filtered);
        } else {
            setFilteredHives([]);
        }
        // Reset colmeia selection when apiario changes
        setFormData(prev => ({ ...prev, colmeia: '' }));
    }, [formData.apiario, hives]);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleInitialSave = () => {
        if (!formData.apiario || !formData.colmeia || !formData.razaoMotivo || !formData.dataDesativacao) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }
        setIsModalOpen(true);
    };

    const confirmDeactivation = () => {
        const newDeactivation = {
            id: Date.now(),
            ...formData,
            dataDesativacao: formData.dataDesativacao instanceof Date ? formData.dataDesativacao.toISOString() : formData.dataDesativacao,
            createdAt: new Date().toISOString()
        };

        try {
            const existingDeactivations = JSON.parse(localStorage.getItem('hf_deactivated_hives') || '[]');
            const updatedDeactivations = [...existingDeactivations, newDeactivation];
            localStorage.setItem('hf_deactivated_hives', JSON.stringify(updatedDeactivations));

            setIsModalOpen(false);
            showToast('Colmeia desativada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            showToast('Erro ao salvar os dados. Tente novamente.', 'error');
            setIsModalOpen(false);
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dataDesativacao: date });
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
                        <h1>Desativar Colmeia</h1>
                    </div>
                    <ActionButtons onCancel={handleBack} onSave={handleInitialSave} />
                </div>

                <div className="reg-full-width">
                    <div className="reg-card">
                        <h2>Informações da Desativação</h2>

                        <div className="input-group">
                            <label>Apiário</label>
                            <CustomSelect
                                options={apiaries.map(ap => ({
                                    value: String(ap.id),
                                    label: ap.nomeApelido
                                }))}
                                value={formData.apiario}
                                onChange={(val) => setFormData({ ...formData, apiario: val })}
                                placeholder="Selecione o apiário"
                            />
                        </div>

                        <div className="input-group">
                            <label>Colmeia</label>
                            <CustomSelect
                                options={filteredHives.map(hive => ({
                                    value: String(hive.id),
                                    label: `Colmeia ${hive.anoColmeia}${hive.anoRainha ? ` - Rainha ${hive.anoRainha}` : ''}`
                                }))}
                                value={formData.colmeia}
                                onChange={(val) => setFormData({ ...formData, colmeia: val })}
                                placeholder={formData.apiario ? "Selecione a colmeia" : "Selecione um apiário primeiro"}
                                disabled={!formData.apiario}
                            />
                        </div>

                        <div className="input-group">
                            <label>Razão/Motivo</label>
                            <input
                                type="text"
                                placeholder="Ex: Colmeia fraca, Rainha morta, etc."
                                value={formData.razaoMotivo}
                                onChange={(e) => setFormData({ ...formData, razaoMotivo: e.target.value })}
                            />
                        </div>

                        <div className="input-group" style={{ position: 'relative' }} ref={calendarRef}>
                            <label>Data da desativação</label>
                            <div
                                className="datepicker-trigger"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <span>{formatDate(formData.dataDesativacao)}</span>
                                <CalendarIcon size={20} color="var(--hf-primary-dark)" />
                            </div>

                            {showCalendar && (
                                <div className="datepicker-popup">
                                    <CustomCalendar
                                        value={formData.dataDesativacao}
                                        onChange={handleDateChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: 'var(--hf-radius-md)',
                        boxShadow: 'var(--hf-shadow-lg)',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--hf-text-main)' }}>Confirmar Desativação</h3>
                        <p style={{ marginBottom: '24px', color: 'var(--hf-text-secondary)' }}>
                            Tem certeza que deseja desativar esta colmeia? Esta ação registrará o fim do ciclo produtivo dela.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeactivation}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'var(--hf-primary)',
                                    color: 'var(--hf-text-main)',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default HiveDeactivation;
