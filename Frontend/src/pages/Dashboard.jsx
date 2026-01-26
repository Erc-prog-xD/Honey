import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ShoppingBag, TrendingDown, BarChart3, Store, Trash2, Bug, Ban } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MapArea from '../components/MapArea';
import DashboardCard from '../components/DashboardCard';
import Navbar from '../components/Navbar';
import AddMenu from '../components/AddMenu';
import '../assets/css/Dashboard.css';
import HiveMarker from '../components/HiveMarker';

// Logo
import logoText from '../assets/img/logo-hf-completo.svg';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleHiveSelect = (lat, lng) => {
        setSelectedLocation({ lat, lng });
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="top-section">
                <div className="sidebar-wrapper">
                    <Sidebar onHiveSelect={handleHiveSelect} />
                </div>
                <div className="map-wrapper">
                    <MapArea flyToLocation={selectedLocation} />
                    <button className="map-add-btn" onClick={() => setShowAddMenu(true)}>+</button>
                </div>
            </div>

            <div className="bottom-section">

                <div className="dashboard-brand-header">
                    <img src={logoText} alt="HoneyFlow" className="brand-logo-large" />
                </div>

                <div className="section-container">
                    <div className="section-divider">Registros</div>
                    <div className="cards-grid">
                        <DashboardCard title="Registro de Produção" icon={Hexagon} onClick={() => navigate('/registro-producao')} />
                        <DashboardCard title="Registro de Vendas" icon={ShoppingBag} onClick={() => navigate('/registro-vendas')} />
                        <DashboardCard title="Registro de Perdas" icon={TrendingDown} onClick={() => navigate('/registro-perdas')} />
                    </div>
                </div>

                <div className="section-container">
                    <div className="section-divider">Relatórios</div>
                    <div className="cards-grid">
                        <DashboardCard title="Desempenho de Apiário" icon={BarChart3} onClick={() => navigate('/desempenho-apiario')} />
                        <DashboardCard title="Relatório de Vendas" icon={Store} onClick={() => navigate('/relatorio-vendas')} />
                        <DashboardCard title="Relatório de Perdas" icon={Trash2} onClick={() => navigate('/relatorio-perdas')} />
                    </div>
                </div>

                <div className="section-container">
                    <div className="section-divider">Controle</div>
                    <div className="cards-grid">
                        <DashboardCard title="Cadastrar Apiário" icon={Hexagon} onClick={() => navigate('/cadastro-apiario')} />
                        <DashboardCard title="Cadastrar Colmeia" icon={Bug} onClick={() => navigate('/cadastro-colmeia')} />
                        <DashboardCard title="Desativar Colmeia" icon={Ban} onClick={() => navigate('/desativar-colmeia')} />
                    </div>
                </div>
            </div>

            {showAddMenu && <AddMenu onClose={() => setShowAddMenu(false)} />}
        </div>
    );
};

export default Dashboard;