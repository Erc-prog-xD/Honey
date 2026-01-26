import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import '../assets/css/HiveRegistration.css';
import '../assets/css/Reports.css';

// Components
import Navbar from '../components/Navbar';
import CustomSelect from '../components/CustomSelect';

const ApiaryPerformance = () => {
    const navigate = useNavigate();
    const [apiaries, setApiaries] = useState([]);
    const [selectedApiary, setSelectedApiary] = useState('');
    const [periodo, setPeriodo] = useState('ano');
    const [ano, setAno] = useState('2025');
    const [mes, setMes] = useState('01');
    const [semana, setSemana] = useState('1');
    const [activeTab, setActiveTab] = useState('producao');
    const [chartData, setChartData] = useState([]);

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

    const monthOptions = [
        { value: '01', label: 'Janeiro' },
        { value: '02', label: 'Fevereiro' },
        { value: '03', label: 'Março' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Maio' },
        { value: '06', label: 'Junho' },
        { value: '07', label: 'Julho' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Setembro' },
        { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' },
        { value: '12', label: 'Dezembro' }
    ];

    const weekOptions = [
        { value: '1', label: 'Semana 1' },
        { value: '2', label: 'Semana 2' },
        { value: '3', label: 'Semana 3' },
        { value: '4', label: 'Semana 4' },
        { value: '5', label: 'Semana 5' }
    ];

    // Carrega apiários do localStorage
    useEffect(() => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        setApiaries(storedApiaries);
        if (storedApiaries.length > 0) {
            setSelectedApiary(String(storedApiaries[0].id));
        }
    }, []);

    // Dados mockados para demonstração
    const getMockData = () => {
        // Dados de produção por mês (litros)
        const producaoAnual = [
            { name: 'Jan', valor: 85 },
            { name: 'Fev', valor: 120 },
            { name: 'Mar', valor: 95 },
            { name: 'Abr', valor: 140 },
            { name: 'Mai', valor: 180 },
            { name: 'Jun', valor: 160 },
            { name: 'Jul', valor: 145 },
            { name: 'Ago', valor: 200 },
            { name: 'Set', valor: 220 },
            { name: 'Out', valor: 195 },
            { name: 'Nov', valor: 175 },
            { name: 'Dez', valor: 150 }
        ];

        const vendaAnual = [
            { name: 'Jan', valor: 70 },
            { name: 'Fev', valor: 95 },
            { name: 'Mar', valor: 80 },
            { name: 'Abr', valor: 110 },
            { name: 'Mai', valor: 150 },
            { name: 'Jun', valor: 130 },
            { name: 'Jul', valor: 120 },
            { name: 'Ago', valor: 165 },
            { name: 'Set', valor: 185 },
            { name: 'Out', valor: 160 },
            { name: 'Nov', valor: 145 },
            { name: 'Dez', valor: 190 }
        ];

        const perdaAnual = [
            { name: 'Jan', valor: 5 },
            { name: 'Fev', valor: 8 },
            { name: 'Mar', valor: 3 },
            { name: 'Abr', valor: 12 },
            { name: 'Mai', valor: 7 },
            { name: 'Jun', valor: 15 },
            { name: 'Jul', valor: 10 },
            { name: 'Ago', valor: 6 },
            { name: 'Set', valor: 4 },
            { name: 'Out', valor: 9 },
            { name: 'Nov', valor: 11 },
            { name: 'Dez', valor: 8 }
        ];

        // Dados mensais (por dia do mês selecionado)
        const getMensalData = (baseValue) => {
            const dias = [];
            for (let i = 1; i <= 30; i++) {
                dias.push({
                    name: `${i}`,
                    valor: Math.floor(baseValue * (0.5 + Math.random()))
                });
            }
            return dias;
        };

        // Dados semanais (por dia da semana)
        const getSemanalData = (baseValue) => {
            return [
                { name: 'Seg', valor: Math.floor(baseValue * (0.8 + Math.random() * 0.4)) },
                { name: 'Ter', valor: Math.floor(baseValue * (0.7 + Math.random() * 0.5)) },
                { name: 'Qua', valor: Math.floor(baseValue * (0.9 + Math.random() * 0.3)) },
                { name: 'Qui', valor: Math.floor(baseValue * (0.6 + Math.random() * 0.6)) },
                { name: 'Sex', valor: Math.floor(baseValue * (0.85 + Math.random() * 0.35)) },
                { name: 'Sáb', valor: Math.floor(baseValue * (0.4 + Math.random() * 0.3)) },
                { name: 'Dom', valor: Math.floor(baseValue * (0.2 + Math.random() * 0.2)) }
            ];
        };

        let data;
        let baseValue;

        // Escolhe os dados base conforme a tab ativa
        switch (activeTab) {
            case 'producao':
                data = producaoAnual;
                baseValue = 8;
                break;
            case 'venda':
                data = vendaAnual;
                baseValue = 6;
                break;
            case 'perda':
                data = perdaAnual;
                baseValue = 1;
                break;
            default:
                data = producaoAnual;
                baseValue = 8;
        }

        // Retorna dados conforme o período
        switch (periodo) {
            case 'ano':
                return data;
            case 'mes':
                return getMensalData(baseValue);
            case 'semana':
                return getSemanalData(baseValue * 2);
            default:
                return data;
        }
    };

    // Atualiza dados do gráfico baseado nos filtros
    useEffect(() => {
        setChartData(getMockData());
    }, [selectedApiary, ano, mes, semana, periodo, activeTab]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const apiaryOptions = apiaries.length > 0
        ? apiaries.map(ap => ({ value: String(ap.id), label: ap.nomeApelido }))
        : [{ value: '', label: 'Apiário 1' }];

    return (
        <div className="registration-page">
            <Navbar />

            <main className="reg-content">
                <div className="reg-header-bar">
                    <div className="title-box">
                        <h1>Desempenho de apiário</h1>
                    </div>
                    <div className="action-buttons-container">
                        <button className="btn-action btn-cancel-action" onClick={handleBack}>
                            <ArrowLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>

                <div className="report-filters-full">
                    <div className="filter-row">
                        <div className="filter-group full-width">
                            <label>Selecione o apiário</label>
                            <CustomSelect
                                options={apiaryOptions}
                                value={selectedApiary}
                                onChange={setSelectedApiary}
                                placeholder="Selecione o apiário"
                            />
                        </div>
                    </div>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Período</label>
                            <CustomSelect
                                options={periodOptions}
                                value={periodo}
                                onChange={setPeriodo}
                                placeholder="Selecione o período"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Ano</label>
                            <CustomSelect
                                options={yearOptions}
                                value={ano}
                                onChange={setAno}
                                placeholder="Selecione o ano"
                            />
                        </div>
                        {/* Mostra seletor de mês quando período = mês ou semana */}
                        {(periodo === 'mes' || periodo === 'semana') && (
                            <div className="filter-group">
                                <label>Mês</label>
                                <CustomSelect
                                    options={monthOptions}
                                    value={mes}
                                    onChange={setMes}
                                    placeholder="Selecione o mês"
                                />
                            </div>
                        )}
                        {/* Mostra seletor de semana quando período = semana */}
                        {periodo === 'semana' && (
                            <div className="filter-group">
                                <label>Semana</label>
                                <CustomSelect
                                    options={weekOptions}
                                    value={semana}
                                    onChange={setSemana}
                                    placeholder="Selecione a semana"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="category-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'producao' ? 'active' : ''}`}
                        onClick={() => setActiveTab('producao')}
                    >
                        Produção
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'perda' ? 'active' : ''}`}
                        onClick={() => setActiveTab('perda')}
                    >
                        Perda
                    </button>
                </div>

                <div className="chart-full">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 70, bottom: 60 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#E0E0E0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                                axisLine={{ stroke: '#666', strokeWidth: 2 }}
                                tickLine={{ stroke: '#666' }}
                                label={{ value: 'Mês', position: 'insideBottom', offset: -55, style: { fontSize: 14, fontWeight: 600, fill: '#333' } }}
                            />
                            <YAxis
                                axisLine={{ stroke: '#666', strokeWidth: 2 }}
                                tickLine={{ stroke: '#666' }}
                                tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value) => `${value}L`}
                                dx={-10}
                                label={{ value: 'Volume (L)', angle: -90, position: 'outside', dx: -50, style: { fontSize: 14, fontWeight: 600, fill: '#333', textAnchor: 'middle' } }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value}L`, activeTab === 'producao' ? 'Produção' : activeTab === 'venda' ? 'Venda' : 'Perda']}
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
                                fill="#2ecc71"
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

export default ApiaryPerformance;
