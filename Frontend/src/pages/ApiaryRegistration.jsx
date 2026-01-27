import React, { useState, useEffect } from 'react';
import { criarApiario, buscarApiarios } from '../services/apiarioService';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';

// Componente para centralizar no usuário
const LocateUser = () => {
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, 14);
        });
    }, [map]);

    return null;
};

const ApiaryRegistration = () => {
    const navigate = useNavigate();
    const [polygonCoords, setPolygonCoords] = useState([]);
    const [toast, setToast] = useState(null);
    const [existingApiaries, setExistingApiaries] = useState([]);
    const [formData, setFormData] = useState({
        nomeApelido: '',
        tipoAbelha: ''
    });

    // Carrega apiários existentes da API
    useEffect(() => {
        const loadApiaries = async () => {
            try {
                let data = await buscarApiarios();
                // Tratamento do wrapper 'dados'
                if (data && !Array.isArray(data) && Array.isArray(data.dados)) {
                    data = data.dados;
                }

                const safeData = Array.isArray(data) ? data : [];

                // Mapeia para adicionar polígono visual se tiver coordenadas
                const mappedApiaries = safeData.map(api => {
                    let polygon = [];
                    // Tenta carregar polígono real da Referencia, senão usa o padrão
                    if (api.localizacao?.referencia) {
                        try {
                            const parsed = JSON.parse(api.localizacao.referencia);
                            if (Array.isArray(parsed) && parsed.length >= 4) {
                                polygon = parsed;
                            }
                        } catch (e) {
                            console.warn("Erro ao parsear polígono da referencia", e);
                        }
                    }

                    if (polygon.length === 0 && api.coord_X && api.coord_Y) {
                        const lat = parseFloat(api.coord_Y);
                        const lng = parseFloat(api.coord_X);
                        if (!isNaN(lat) && !isNaN(lng)) {
                            polygon = [
                                { lat: lat + 0.001, lng: lng - 0.001 },
                                { lat: lat + 0.001, lng: lng + 0.001 },
                                { lat: lat - 0.001, lng: lng + 0.001 },
                                { lat: lat - 0.001, lng: lng - 0.001 }
                            ];
                        }
                    }

                    return { ...api, polygon };
                });

                setExistingApiaries(mappedApiaries);
            } catch (error) {
                console.error("Erro ao carregar apiários:", error);
            }
        };
        loadApiaries();
    }, []);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handlePolygonCreated = (e) => {
        const layer = e.layer;
        const coords = layer.getLatLngs()[0].map(latlng => ({
            lat: latlng.lat,
            lng: latlng.lng
        }));
        setPolygonCoords(coords);
    };

    const handlePolygonEdited = (e) => {
        const layers = e.layers;
        layers.eachLayer(layer => {
            const coords = layer.getLatLngs()[0].map(latlng => ({
                lat: latlng.lat,
                lng: latlng.lng
            }));
            setPolygonCoords(coords);
        });
    };

    const handlePolygonDeleted = () => {
        setPolygonCoords([]);
    };

    // ... (restante dos imports)

    const handleSave = async () => {
        if (!formData.nomeApelido || !formData.tipoAbelha) {
            showToast('Por favor, preencha o nome e o tipo de abelha.', 'error');
            return;
        }

        if (polygonCoords.length < 4) {
            showToast('Por favor, desenhe a área (quadrado) do apiário no mapa.', 'error');
            return;
        }

        // Calcula o centro do polígono para enviar como coordenada principal
        const latTotal = polygonCoords.reduce((sum, p) => sum + p.lat, 0);
        const lngTotal = polygonCoords.reduce((sum, p) => sum + p.lng, 0);
        const centerLat = latTotal / polygonCoords.length;
        const centerLng = lngTotal / polygonCoords.length;

        // Prepara o payload conforme especificação da API
        const apiPayload = {
            localizacao: {
                rua: "Não informado", // Valores padrão ou adicionar campos futuros
                bairro: "Não informado",
                cidade: "Não informado",
                estado: "NI",
                descricaoLocal: formData.nomeApelido,
                referencia: JSON.stringify(polygonCoords) // Salva os pontos reais para manter o tamanho
            },
            coord_X: centerLng.toString(), // Longitude como X
            coord_Y: centerLat.toString(), // Latitude como Y
            bioma: "Não informado", // Campo obrigatório na API
            tipoDeAbelha: formData.tipoAbelha,
            tipoDeMel: "Não informado", // Evita string vazia
            atividade: 1 // 1 para Ativo (conforme enum provável)
        };

        console.log("Payload CriarApiario:", apiPayload);

        try {
            const response = await criarApiario(apiPayload);

            showToast('Apiário cadastrado com sucesso!', 'success');

            // Redireciona para o dashboard ou cadastro de colmeia
            // O desenho não é salvo na API, apenas as coordenadas centrais serão usadas na listagem
            setTimeout(() => {
                // Redireciona passando o ID retornado pela API
                navigate('/cadastro-colmeia', {
                    state: { apiarioId: response.id }
                });
            }, 1500);



        } catch (error) {
            console.error("Erro ao salvar apiário:", error);
            showToast('Erro ao salvar os dados. Verifique a conexão.', 'error');
        }
    };

    return (
        <div className="registration-page">
            <Navbar />

            <main className="reg-content">
                <div className="reg-header-bar">
                    <div className="title-box">
                        <h1>Cadastro de apiário</h1>
                    </div>
                    <ActionButtons
                        onCancel={handleBack}
                        onSave={handleSave}
                        disabled={
                            !formData.nomeApelido ||
                            !formData.tipoAbelha ||
                            polygonCoords.length < 4
                        }
                    />
                </div>

                <div className="reg-grid">
                    {/* Left Column: General Info */}
                    <div className="reg-card card-info">
                        <h2>Informações gerais</h2>
                        <div className="input-group">
                            <label>Nome ou Apelido <span className="required-star">*</span></label>
                            <input
                                type="text"
                                placeholder="Ex: Apiário da Colina"
                                value={formData.nomeApelido}
                                onChange={(e) => setFormData({ ...formData, nomeApelido: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de abelha <span className="required-star">*</span></label>
                            <input
                                type="text"
                                placeholder="Ex: Apis mellifera"
                                value={formData.tipoAbelha}
                                onChange={(e) => setFormData({ ...formData, tipoAbelha: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right Column: Location */}
                    <div className="reg-card card-location">
                        <h2>Área do Apiário</h2>
                        <div className="input-group-map">
                            <label>Desenhar Área no Mapa <span className="required-star">*</span></label>
                            <div className="map-container-reg" style={{ height: '300px' }}>
                                <MapContainer center={[-23.5505, -46.6333]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocateUser />

                                    {/* Mostra apiários existentes */}
                                    {existingApiaries.map((apiary) => (
                                        apiary.polygon && apiary.polygon.length > 0 && (
                                            <Polygon
                                                key={`existing-${apiary.id}`}
                                                positions={apiary.polygon.map(p => [p.lat, p.lng])}
                                                pathOptions={{
                                                    color: '#888888',
                                                    fillColor: '#888888',
                                                    fillOpacity: 0.15,
                                                    weight: 2,
                                                    dashArray: '5, 5'
                                                }}
                                            >
                                                <Popup>{apiary.nomeApelido}</Popup>
                                            </Polygon>
                                        )
                                    ))}

                                    <FeatureGroup>
                                        <EditControl
                                            position="topright"
                                            onCreated={handlePolygonCreated}
                                            onEdited={handlePolygonEdited}
                                            onDeleted={handlePolygonDeleted}
                                            draw={{
                                                rectangle: {
                                                    shapeOptions: {
                                                        color: '#ffbd59',
                                                        fillColor: '#ffbd59',
                                                        fillOpacity: 0.3
                                                    },
                                                    metric: true,
                                                    showArea: true,
                                                    repeatMode: false
                                                },
                                                circle: false,
                                                circlemarker: false,
                                                marker: false,
                                                polyline: false,
                                                polygon: false
                                            }}
                                            edit={{
                                                remove: true
                                            }}
                                        />
                                    </FeatureGroup>
                                </MapContainer>
                            </div>
                            {polygonCoords.length > 0 ? (
                                <p style={{ marginTop: '10px', color: 'var(--hf-text-muted)', fontSize: '14px' }}>
                                    ✓ Área definida! Você pode redimensioná-la usando o ícone de edição.
                                </p>
                            ) : (
                                <p style={{ marginTop: '10px', color: 'var(--hf-text-muted)', fontSize: '14px' }}>
                                    Selecione a ferramenta de retângulo acima e <strong>clique e arraste</strong> para dimensionar a área.
                                </p>
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

export default ApiaryRegistration;
