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
    const [tipoMel, setTipoMel] = useState('');
    const [honeyTypes, setHoneyTypes] = useState([]);
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

    // Carrega tipos de mel do localStorage
    useEffect(() => {
        const storedHoneyTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
        setHoneyTypes(storedHoneyTypes);
        if (storedHoneyTypes.length > 0) {
            setTipoMel(storedHoneyTypes[0]);
        }
    }, []);

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
                                options={honeyTypes.map(type => ({
                                    value: type,
                                    label: type
                                }))}
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
                        <BarChart data={lossData} margin={{ top: 20, right: 30, left: 70, bottom: 40 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#E0E0E0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={{ stroke: '#666', strokeWidth: 2 }}
                                tickLine={{ stroke: '#666' }}
                                tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                                label={{ value: 'Mês', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 600, fill: '#333' } }}
                            />
                            <YAxis
                                domain={[0, 10]}
                                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                axisLine={{ stroke: '#666', strokeWidth: 2 }}
                                tickLine={{ stroke: '#666' }}
                                tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value) => `${value}L`}
                                dx={-10}
                                label={{ value: 'Volume (L)', angle: -90, position: 'outside', dx: -50, style: { fontSize: 14, fontWeight: 600, fill: '#333', textAnchor: 'middle' } }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value}L`, 'Perdas']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                                labelStyle={{ fontWeight: 600, color: '#333' }}
                            />
                            <Bar
                                dataKey="valor"
                                fill="#ff4d4d"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
};

export default LossReport;
