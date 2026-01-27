import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Pencil, Power, ArrowLeft, Bug, Droplets, Calendar, MapPin, Hexagon, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../assets/css/ApiaryDetails.css';
import { buscarApiarios, editarApiario, buscarColmeiasDoApiario, editarColmeia } from '../services/apiarioService';

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
    const [formData, setFormData] = useState({
        nomeApelido: '',
        tipoAbelha: '',
        volumeProduzido: '',
        tipoMel: ''
    });
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const showToast = (message, type) => setToast({ message, type });

    const handleHiveClick = (hive) => {
        setSelectedHive(hive);
    };

    const handleCloseModal = () => {
        setSelectedHive(null);
    };

    const handleToggleHive = async (hiveId) => {
        try {
            const hive = hives.find(h => h.id === hiveId);
            if (!hive) return;

            // Inverte o status: se active !== false (ou seja, true/undefined) vira 0 (Inativo), senão 1 (Ativo)
            const newStatus = hive.active !== false ? 0 : 1;

            // Payload para API
            const payload = {
                apiarioId: parseInt(hive.apiarioId || id),
                anoColmeia: parseInt(hive.anoColmeia),
                anoRainha: parseInt(hive.anoRainha || hive.anoColmeia),
                status: newStatus,
                tipoMel: hive.tipoMel || "Silvestre"
            };

            await editarColmeia(hiveId, payload);

            // Atualiza estado local
            setHives(prev => prev.map(h =>
                h.id === hiveId ? { ...h, active: newStatus === 1, status: newStatus } : h
            ));

            if (selectedHive && selectedHive.id === hiveId) {
                setSelectedHive(prev => ({ ...prev, active: newStatus === 1, status: newStatus }));
            }

            showToast(`Colmeia ${newStatus === 1 ? 'ativada' : 'desativada'} com sucesso!`, 'success');

        } catch (error) {
            console.error("Erro ao alterar status da colmeia:", error);
            showToast("Erro ao atualizar status da colmeia.", "error");
        }
    };

    const handleModalToggleActive = () => {
        if (selectedHive) {
            handleToggleHive(selectedHive.id);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Buscar Apiário
                let apiarios = await buscarApiarios();
                if (apiarios && !Array.isArray(apiarios) && Array.isArray(apiarios.dados)) {
                    apiarios = apiarios.dados;
                }

                const foundApiary = (Array.isArray(apiarios) ? apiarios : []).find(a => String(a.id) === String(id));

                if (foundApiary) {
                    setApiary({
                        ...foundApiary,
                        // Mapeia campos da API para o state local se necessário
                        nomeApelido: foundApiary.localizacao?.descricaoLocal || 'Apiário Sem Nome',
                        tipoAbelha: foundApiary.tipoDeAbelha,
                        // Gera polígono padrão baseado nas coordenadas
                        polygon: (foundApiary.coord_X && foundApiary.coord_Y) ? [
                            { lat: parseFloat(foundApiary.coord_Y) + 0.001, lng: parseFloat(foundApiary.coord_X) - 0.001 },
                            { lat: parseFloat(foundApiary.coord_Y) + 0.001, lng: parseFloat(foundApiary.coord_X) + 0.001 },
                            { lat: parseFloat(foundApiary.coord_Y) - 0.001, lng: parseFloat(foundApiary.coord_X) + 0.001 },
                            { lat: parseFloat(foundApiary.coord_Y) - 0.001, lng: parseFloat(foundApiary.coord_X) - 0.001 }
                        ] : []
                    });

                    setFormData({
                        nomeApelido: foundApiary.localizacao?.descricaoLocal || '',
                        tipoAbelha: foundApiary.tipoDeAbelha || '',
                        volumeProduzido: '0', // API não retornou produção no exemplo
                        tipoMel: foundApiary.tipoDeMel || ''
                    });
                }

                // 2. Buscar Colmeias
                let colmeiasApi = await buscarColmeiasDoApiario(id);
                if (colmeiasApi && !Array.isArray(colmeiasApi) && Array.isArray(colmeiasApi.dados)) {
                    colmeiasApi = colmeiasApi.dados;
                }
                setHives(Array.isArray(colmeiasApi) ? colmeiasApi : []);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                showToast("Erro ao carregar informações do apiário", "error");
            }
        };

        loadData();

        // Carrega tipos de mel (mantém local por enquanto ou move para constante)
        // Tipos de mel padrão
        setHoneyTypes(["Silvestre", "Eucalipto", "Laranjeira", "Jataí", "Mandaçaia"]);

    }, [id]);



    const handleSaveApiaryData = async (updatedData) => {
        try {
            // Mapeia estrutura para atualização
            // Nota: Precisamos enviar o objeto completo conforme PUT costuma exigir, 
            // então mesclamos com o estado atual 'apiary'
            const payload = {
                localizacao: {
                    ...apiary.localizacao,
                    descricaoLocal: updatedData.nomeApelido || apiary.localizacao?.descricaoLocal
                },
                coord_X: apiary.coord_X,
                coord_Y: apiary.coord_Y,
                bioma: apiary.bioma || "Não informado",
                tipoDeAbelha: updatedData.tipoAbelha || apiary.tipoDeAbelha,
                tipoDeMel: updatedData.tipoMel || apiary.tipoDeMel,
                atividade: apiary.atividade || 1
            };

            await editarApiario(id, payload);

            setApiary(prev => ({ ...prev, ...updatedData }));
            // Mantém formData sincronizado
            setFormData(prev => ({ ...prev, ...updatedData }));

        } catch (error) {
            console.error("Erro ao salvar:", error);
            showToast("Erro ao atualizar apiário.", "error");
            throw error; // Propaga erro para quem chamou tratar UI se precisar
        }
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
        // Se tem polígono, valida e usa o centro dele
        if (apiary?.polygon?.length > 0) {
            try {
                const validPoints = apiary.polygon
                    .map(p => {
                        const lat = parseFloat(String(p.lat).trim());
                        const lng = parseFloat(String(p.lng).trim());

                        if (isNaN(lat) || isNaN(lng)) return null;
                        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

                        return { lat, lng };
                    })
                    .filter(p => p !== null);

                if (validPoints.length >= 3) {
                    const lats = validPoints.map(p => p.lat);
                    const lngs = validPoints.map(p => p.lng);
                    return [
                        (Math.min(...lats) + Math.max(...lats)) / 2,
                        (Math.min(...lngs) + Math.max(...lngs)) / 2
                    ];
                }
            } catch (e) {
                console.warn("Erro ao processar polígono:", e);
            }
        }

        // Se não tem polígono mas tem coordenadas da API, valida e usa elas
        if (apiary?.coord_Y || apiary?.coord_X) {
            try {
                // Remove espaços e converte para número
                const latStr = String(apiary.coord_Y || '').trim();
                const lngStr = String(apiary.coord_X || '').trim();

                // Pula valores "Não informado" ou vazios
                if (latStr === '' || latStr === 'Não informado' ||
                    lngStr === '' || lngStr === 'Não informado') {
                    console.warn(`⚠️ Coordenadas não informadas para ${apiary?.nomeApelido}`);
                } else {
                    const lat = parseFloat(latStr);
                    const lng = parseFloat(lngStr);

                    // Validação rigorosa
                    if (!isNaN(lat) && !isNaN(lng) &&
                        lat >= -90 && lat <= 90 &&
                        lng >= -180 && lng <= 180) {
                        console.log(`✅ Usando coordenadas válidas: [${lat}, ${lng}]`);
                        return [lat, lng];
                    } else {
                        console.warn(`⚠️ Coordenadas fora do range: lat=${lat}, lng=${lng}`);
                    }
                }
            } catch (e) {
                console.warn("Erro ao parsear coordenadas:", e);
            }
        }

        // Fallback padrão
        console.warn(`⚠️ Sem coordenadas válidas para ${apiary?.nomeApelido}, usando fallback`);
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
                                        Tipo de abelha <span className="required-star">*</span>
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
