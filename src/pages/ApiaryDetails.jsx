import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Pencil, Power, ArrowLeft, Bug, Droplets, Calendar, MapPin, Hexagon, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../assets/css/ApiaryDetails.css';

// Components e Assets
import Navbar from '../components/Navbar';
import CustomSelect from '../components/CustomSelect';
import ToastCenter from '../components/Toast';
import beeIcon from '../assets/img/logo_hf.svg';
import { createHiveIcon } from '../components/HiveMarker';
import HiveStatCard from '../components/HiveStatCard';

const customIcon = createHiveIcon();

const ApiaryDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [apiary, setApiary] = useState(null);
    const [hives, setHives] = useState([]);
    const [toast, setToast] = useState(null);
    const [selectedHive, setSelectedHive] = useState(null);
    const [honeyTypes, setHoneyTypes] = useState([]);

    const handleHiveClick = (hive) => {
        setSelectedHive(hive);
    };

    const handleCloseModal = () => {
        setSelectedHive(null);
    };

    const handleModalToggleActive = () => {
        if (selectedHive) {
            if (selectedHive.active !== false) {
                // Se estiver ativa e for desativar, redireciona para página de desativação
                navigate('/desativar-colmeia', {
                    state: {
                        apiarioId: apiary.id,
                        colmeiaId: selectedHive.id
                    }
                });
            } else {
                // Se estiver inativa e for ativar, mantém lógica simples (toggle)
                handleToggleHive(selectedHive.id);
                setSelectedHive(prev => ({ ...prev, active: !prev.active }));
            }
        }
    };

    const [formData, setFormData] = useState({
        nomeApelido: '',
        tipoAbelha: '',
        volumeProduzido: '',
        tipoMel: ''
    });

    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        // Carrega dados do localStorage ou usa mock
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        const foundApiary = storedApiaries.find(a => String(a.id) === String(id));

        if (foundApiary) {
            setApiary(foundApiary);
            setFormData({
                nomeApelido: foundApiary.nomeApelido || 'Apiário 1',
                tipoAbelha: foundApiary.tipoAbelha || 'Apis mellifera',
                volumeProduzido: foundApiary.volumeProduzido || '450',
                tipoMel: foundApiary.tipoMel || ''
            });
        } else {
            // Dados mockados para demonstração
            setApiary({
                id: id,
                nomeApelido: 'Apiário Principal',
                tipoAbelha: 'Apis mellifera',
                polygon: [],
                createdAt: '2024-03-15'
            });
            setFormData({
                nomeApelido: 'Apiário Principal',
                tipoAbelha: 'Apis mellifera',
                volumeProduzido: '450',
                tipoMel: ''
            });
        }

        // Carrega tipos de mel
        const storedHoneyTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
        setHoneyTypes(storedHoneyTypes);

        // Carrega colmeias do apiário
        const storedHives = JSON.parse(localStorage.getItem('hf_hives') || '[]');
        const apiaryHives = storedHives.filter(h => String(h.apiario) === String(id));

        if (apiaryHives.length > 0) {
            setHives(apiaryHives);
        } else {
            // Dados mockados
            setHives([
                { id: '1', anoColmeia: '2023', anoRainha: '2024', active: true },
                { id: '2', anoColmeia: '2022', anoRainha: '2023', active: true },
                { id: '3', anoColmeia: '2024', anoRainha: '2024', active: true },
                { id: '4', anoColmeia: '2021', anoRainha: '2022', active: false }
            ]);
        }
    }, [id]);

    const showToast = (message, type) => setToast({ message, type });

    const handleDeleteHive = (hiveId) => {
        const storedHives = JSON.parse(localStorage.getItem('hf_hives') || '[]');
        const updatedHives = storedHives.filter(h => String(h.id) !== String(hiveId));
        localStorage.setItem('hf_hives', JSON.stringify(updatedHives));
        setHives(hives.filter(h => String(h.id) !== String(hiveId)));
        showToast('Colmeia removida com sucesso!', 'success');
    };

    const handleToggleHive = (hiveId) => {
        setHives(hives.map(h =>
            String(h.id) === String(hiveId)
                ? { ...h, active: !h.active }
                : h
        ));
        showToast('Status da colmeia atualizado!', 'success');
    };

    const handleSaveApiaryData = (updatedData) => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        const updatedApiaries = storedApiaries.map(a =>
            String(a.id) === String(id) ? { ...a, ...updatedData } : a
        );
        localStorage.setItem('hf_apiaries', JSON.stringify(updatedApiaries));
        setApiary(prev => ({ ...prev, ...updatedData }));
    };

    const handleSaveTitle = () => {
        setIsEditingTitle(false);
        handleSaveApiaryData({ nomeApelido: formData.nomeApelido });
        showToast('Nome atualizado com sucesso!', 'success');
    };

    const handleSaveInfo = () => {
        handleSaveApiaryData({
            tipoAbelha: formData.tipoAbelha,
            tipoMel: formData.tipoMel
        });
        showToast('Informações atualizadas com sucesso!', 'success');
    };

    const handleBack = () => navigate('/dashboard');
    const handleAddHive = () => navigate('/cadastro-colmeia');

    const getPolygonCenter = () => {
        if (apiary?.polygon?.length > 0) {
            const lats = apiary.polygon.map(p => p.lat);
            const lngs = apiary.polygon.map(p => p.lng);
            return [
                (Math.min(...lats) + Math.max(...lats)) / 2,
                (Math.min(...lngs) + Math.max(...lngs)) / 2
            ];
        }
        return [-5.1753, -40.6769]; // Crateús, CE
    };

    const activeHives = hives.filter(h => h.active !== false).length;
    const inactiveHives = hives.filter(h => h.active === false).length;

    if (!apiary) return <div className="loading-page">Carregando...</div>;

    return (
        <div className="registration-page">
            <Navbar />

            {/* Mapa de Fundo */}
            <div className="apiary-map-section">
                <MapContainer
                    center={getPolygonCenter()}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {apiary.polygon && apiary.polygon.length > 0 && (
                        <Polygon
                            positions={apiary.polygon.map(p => [p.lat, p.lng])}
                            pathOptions={{
                                color: '#ffbd59',
                                fillColor: '#ffbd59',
                                fillOpacity: 0.3,
                                weight: 3
                            }}
                        />
                    )}
                    <Marker position={getPolygonCenter()} icon={customIcon} />
                </MapContainer>
            </div>

            {/* Card Principal */}
            <div className="apiary-details-card">
                {/* Cabeçalho */}
                <div className="apiary-title-bar">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            className="title-input"
                            value={formData.nomeApelido}
                            onChange={(e) => setFormData({ ...formData, nomeApelido: e.target.value })}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                            autoFocus
                        />
                    ) : (
                        <h2 className="apiary-title">{formData.nomeApelido}</h2>
                    )}
                    <button className="edit-title-btn" onClick={() => setIsEditingTitle(true)}>
                        <Pencil size={18} />
                    </button>
                </div>

                {/* Estatísticas Rápidas */}
                <div className="stats-bar">
                    <HiveStatCard
                        icon={Hexagon}
                        value={hives.length}
                        label="Colmeias"
                        color="default"
                    />
                    <HiveStatCard
                        icon={Power}
                        value={activeHives}
                        label="Ativas"
                        color="success"
                    />
                    <HiveStatCard
                        icon={Power}
                        value={inactiveHives}
                        label="Inativas"
                        color="danger"
                    />
                    <HiveStatCard
                        icon={Droplets}
                        value={`${formData.volumeProduzido}L`}
                        label="Produção"
                        color="warning"
                    />
                </div>

                <div className="apiary-content">
                    {/* Coluna Esquerda: Lista de Colmeias */}
                    <div className="hives-wrapper">
                        <div className="hives-header-bar">
                            <Hexagon size={16} />
                            <span>Colmeias</span>
                            <button className="add-hive-btn" onClick={handleAddHive}>
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="hives-list">
                            {hives.length === 0 ? (
                                <div className="no-hives">
                                    <Hexagon size={32} />
                                    <p>Nenhuma colmeia cadastrada</p>
                                    <button className="btn-add-first" onClick={handleAddHive}>
                                        Adicionar Colmeia
                                    </button>
                                </div>
                            ) : (
                                hives.map((hive, index) => (
                                    <div
                                        key={hive.id}
                                        className={`hive-row ${hive.active === false ? 'inactive' : ''} ${selectedHive?.id === hive.id ? 'selected' : ''}`}
                                        onClick={() => handleHiveClick(hive)}
                                    >
                                        <div className="hive-info">
                                            <span className="hive-number">{index + 1}</span>
                                            <img src={beeIcon} alt="Bee" className="hive-icon" />
                                            <div className="hive-details">
                                                <span className="hive-name">Colmeia {index + 1}</span>
                                                <span className="hive-meta">
                                                    <Calendar size={12} /> {hive.anoColmeia || '2024'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hive-status">
                                            <span
                                                className={`status-icon ${hive.active === false ? 'inactive' : 'active'}`}
                                                title={hive.active === false ? 'Inativa' : 'Ativa'}
                                            >
                                                <Power size={16} />
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Coluna Direita: Informações (Renderização Condicional) */}
                    <div className="edit-section">
                        {selectedHive ? (
                            /* DETALHES DA COLMEIA SELECIONADA */
                            <>
                                <div className="section-title">
                                    <h3>{selectedHive.name || `Colmeia ${hives.findIndex(h => h.id === selectedHive.id) + 1}`}</h3>
                                </div>

                                <div className="input-group">
                                    <label>Apiário</label>
                                    <input type="text" value={formData.nomeApelido} readOnly className="readonly" />
                                </div>

                                <div className="input-group">
                                    <label>
                                        Ano da colmeia
                                    </label>
                                    <input type="text" value={selectedHive.anoColmeia || ''} readOnly className="readonly" />
                                </div>

                                <div className="input-group">
                                    <label>
                                        Ano da rainha
                                    </label>
                                    <input type="text" value={selectedHive.anoRainha || ''} readOnly className="readonly" />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Tipo de mel
                                    </label>
                                    <input type="text" value={selectedHive.tipoMel || ''} readOnly className="readonly" />
                                </div>

                                <div className="hive-panel-actions">
                                    {selectedHive.active !== false && (
                                        <button
                                            className="btn-action-panel deactivate"
                                            onClick={handleModalToggleActive}
                                        >
                                            <Power size={16} />
                                            Desativar
                                        </button>
                                    )}
                                    <button className="btn-sair" onClick={() => setSelectedHive(null)}>
                                        <ArrowLeft size={16} />
                                        Voltar
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* INFORMAÇÕES DO APIÁRIO (Padrão) */
                            <>
                                <div className="section-title">
                                    <h3>Informações do Apiário</h3>
                                </div>

                                <div className="input-group">
                                    <label>
                                        Tipo de abelha
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tipoAbelha}
                                        onChange={(e) => setFormData({ ...formData, tipoAbelha: e.target.value })}
                                        placeholder="Ex: Apis mellifera"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>
                                        Volume de mel produzido (L)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.volumeProduzido}
                                        readOnly
                                        className="readonly"
                                        placeholder="Ex: 450"
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
                                    <label>
                                        Localização
                                    </label>
                                    <input
                                        type="text"
                                        value="Crateús, CE"
                                        readOnly
                                        className="readonly"
                                    />
                                </div>

                                <div className="hive-panel-actions">
                                    <button className="btn-action-panel" onClick={handleSaveInfo} style={{ backgroundColor: 'var(--hf-primary)', color: 'var(--hf-text-main)' }}>
                                        <Plus size={16} />
                                        Salvar Alterações
                                    </button>
                                    <button className="btn-sair" onClick={handleBack}>
                                        <ArrowLeft size={16} />
                                        Voltar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

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

export default ApiaryDetails;
