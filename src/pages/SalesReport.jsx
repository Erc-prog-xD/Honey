import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import '../assets/css/HiveRegistration.css';
import '../assets/css/Reports.css';

// Components
import Navbar from '../components/Navbar';
import CustomSelect from '../components/CustomSelect';

const SalesReport = () => {
    const navigate = useNavigate();
    const [periodo, setPeriodo] = useState('ano');
    const [ano, setAno] = useState('2025');
    const [mes, setMes] = useState('01');
    const [semana, setSemana] = useState('1');
    const [salesData, setSalesData] = useState([]);
    const [priceData, setPriceData] = useState([]);

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

    // Dados mockados para demonstração
    const getMockData = () => {
        // Dados anuais de vendas (R$)
        const vendasAnual = [
            { name: 'Jan', valor: 2450 },
            { name: 'Fev', valor: 3200 },
            { name: 'Mar', valor: 2890 },
            { name: 'Abr', valor: 3650 },
            { name: 'Mai', valor: 4200 },
            { name: 'Jun', valor: 3980 },
            { name: 'Jul', valor: 3540 },
            { name: 'Ago', valor: 4580 },
            { name: 'Set', valor: 5120 },
            { name: 'Out', valor: 4750 },
            { name: 'Nov', valor: 4320 },
            { name: 'Dez', valor: 5890 }
        ];

        // Preço por litro ao longo do ano
        const precosAnual = [
            { name: 'Jan', valor: 28 },
            { name: 'Fev', valor: 30 },
            { name: 'Mar', valor: 29 },
            { name: 'Abr', valor: 32 },
            { name: 'Mai', valor: 35 },
            { name: 'Jun', valor: 33 },
            { name: 'Jul', valor: 31 },
            { name: 'Ago', valor: 34 },
            { name: 'Set', valor: 36 },
            { name: 'Out', valor: 38 },
            { name: 'Nov', valor: 37 },
            { name: 'Dez', valor: 40 }
        ];

        // Dados mensais (por dia)
        const getMensalData = (baseVenda, basePreco) => {
            const dias = [];
            const diasPreco = [];
            for (let i = 1; i <= 30; i++) {
                dias.push({
                    name: `${i}`,
                    valor: Math.floor(baseVenda * (0.3 + Math.random() * 0.9))
                });
                diasPreco.push({
                    name: `${i}`,
                    valor: Math.floor(basePreco * (0.9 + Math.random() * 0.2))
                });
            }
            return { vendas: dias, precos: diasPreco };
        };

        // Dados semanais (por dia da semana)
        const getSemanalData = (baseVenda, basePreco) => {
            return {
                vendas: [
                    { name: 'Seg', valor: Math.floor(baseVenda * (0.8 + Math.random() * 0.4)) },
                    { name: 'Ter', valor: Math.floor(baseVenda * (0.7 + Math.random() * 0.5)) },
                    { name: 'Qua', valor: Math.floor(baseVenda * (0.9 + Math.random() * 0.3)) },
                    { name: 'Qui', valor: Math.floor(baseVenda * (0.6 + Math.random() * 0.6)) },
                    { name: 'Sex', valor: Math.floor(baseVenda * (1.0 + Math.random() * 0.4)) },
                    { name: 'Sáb', valor: Math.floor(baseVenda * (1.2 + Math.random() * 0.5)) },
                    { name: 'Dom', valor: Math.floor(baseVenda * (0.5 + Math.random() * 0.3)) }
                ],
                precos: [
                    { name: 'Seg', valor: basePreco },
                    { name: 'Ter', valor: basePreco },
                    { name: 'Qua', valor: basePreco },
                    { name: 'Qui', valor: basePreco },
                    { name: 'Sex', valor: Math.floor(basePreco * 1.05) },
                    { name: 'Sáb', valor: Math.floor(basePreco * 1.1) },
                    { name: 'Dom', valor: Math.floor(basePreco * 1.1) }
                ]
            };
        };

        switch (periodo) {
            case 'ano':
                return { vendas: vendasAnual, precos: precosAnual };
            case 'mes':
                return getMensalData(150, 35);
            case 'semana':
                return getSemanalData(450, 35);
            default:
                return { vendas: vendasAnual, precos: precosAnual };
        }
    };

    useEffect(() => {
        const mockData = getMockData();
        setSalesData(mockData.vendas);
        setPriceData(mockData.precos);
    }, [ano, mes, semana, periodo]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="registration-page">
            <Navbar />

            <main className="reg-content">
                <div className="reg-header-bar">
                    <div className="title-box">
                        <h1>Relatório de Vendas</h1>
                    </div>
                    <div className="action-buttons-container">
                        <button className="btn-action btn-cancel-action" onClick={handleBack}>
                            <ArrowLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>

                <div className="report-filters">
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

                <div className="charts-grid">
                    <div className="chart-card">
                        <h3 className="chart-title">Vendas (R$)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={salesData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
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
                                />
                                <YAxis
                                    axisLine={{ stroke: '#666', strokeWidth: 2 }}
                                    tickLine={{ stroke: '#666' }}
                                    tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `R$ ${value}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    formatter={(value) => [`R$ ${value}`, 'Vendas']}
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
                                    fill="#4dd0e1"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">Variação de preços por litro (R$/L)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={priceData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
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
                                />
                                <YAxis
                                    axisLine={{ stroke: '#666', strokeWidth: 2 }}
                                    tickLine={{ stroke: '#666' }}
                                    tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `R$ ${value}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    formatter={(value) => [`R$ ${value}/L`, 'Preço']}
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
                                    fill="#ffbd59"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SalesReport;
