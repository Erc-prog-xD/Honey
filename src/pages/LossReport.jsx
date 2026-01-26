import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import '../assets/css/HiveRegistration.css';
import '../assets/css/Reports.css';

// Components
import Navbar from '../components/Navbar';
import CustomSelect from '../components/CustomSelect';

const LossReport = () => {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState('honey'); // 'honey' or 'reason'
    const [periodo, setPeriodo] = useState('ano');
    const [ano, setAno] = useState('2025');
    const [tipoMel, setTipoMel] = useState('silvestre');
    const [lossData, setLossData] = useState([]);

    const periodOptions = [
        { value: 'ano', label: 'Ano' },
        { value: 'mes', label: 'Mês' },
        { value: 'semana', label: 'Semana' }
    ];

    const yearOptions = [
        { value: '2026', label: '2026' },
        { value: '2025', label: '2025' },
        { value: '2024', label: '2024' }
    ];

    const honeyOptions = [
        { value: 'silvestre', label: 'Silvestre' },
        { value: 'eucalipto', label: 'Eucalipto' },
        { value: 'laranjeira', label: 'Laranjeira' }
    ];

    // Mock data based on the image provided
    const getMockData = () => {
        return [
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '', valor: 0 },
            { name: '7', valor: 7 },
            { name: '10', valor: 10 },
            { name: '8', valor: 8 }
        ];
    };

    useEffect(() => {
        setLossData(getMockData());
    }, [filterType, periodo, ano, tipoMel]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="registration-page">
            <Navbar />

            <main className="reg-content">
                <div className="reg-header-bar">
                    <div className="title-box">
                        <h1>Relatório de Perdas</h1>
                    </div>
                    <div className="action-buttons-container">
                        <button className="btn-action btn-cancel-action" onClick={handleBack}>
                            <ArrowLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>

                <div className="loss-report-filters-container">
                    <div className="filter-header-label">Filtrar por:</div>
                    <div className="filter-tabs-row">
                        <button
                            className={`filter-tab-btn ${filterType === 'honey' ? 'active' : ''}`}
                            onClick={() => setFilterType('honey')}
                        >
                            Tipo de Mel
                        </button>
                        <button
                            className={`filter-tab-btn ${filterType === 'reason' ? 'active' : ''}`}
                            onClick={() => setFilterType('reason')}
                        >
                            Motivo da Perda
                        </button>
                    </div>

                    <div className="filter-inputs-row">
                        <div className="filter-col">
                            <label>Tipo de mel</label>
                            <CustomSelect
                                options={honeyOptions}
                                value={tipoMel}
                                onChange={setTipoMel}
                            />
                        </div>
                    </div>

                    <div className="filter-inputs-row mt-10">
                        <div className="filter-col">
                            <label>Período</label>
                            <CustomSelect
                                options={periodOptions}
                                value={periodo}
                                onChange={setPeriodo}
                            />
                        </div>
                        <div className="filter-col">
                            <label>Ano</label>
                            <CustomSelect
                                options={yearOptions}
                                value={ano}
                                onChange={setAno}
                            />
                        </div>
                    </div>
                </div>

                <div className="loss-chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={lossData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={true} tickLine={true} />
                            <YAxis domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} axisLine={true} tickLine={true} />
                            <Tooltip />
                            <Bar dataKey="valor" fill="#ff4d4d" radius={[0, 0, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
};

export default LossReport;
