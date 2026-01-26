import React, { useState, useEffect } from 'react';
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

    // Carrega apiários existentes do localStorage
    useEffect(() => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        setExistingApiaries(storedApiaries);
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

    const handlePolygonDeleted = () => {
        setPolygonCoords([]);
    };

    const handleSave = () => {
        if (!formData.nomeApelido || !formData.tipoAbelha) {
            showToast('Por favor, preencha o nome e o tipo de abelha.', 'error');
            return;
        }

        if (polygonCoords.length < 3) {
            showToast('Por favor, desenhe a área do apiário no mapa (mínimo 3 pontos).', 'error');
            return;
        }

        const newApiary = {
            id: Date.now(),
            ...formData,
            polygon: polygonCoords,
            createdAt: new Date().toISOString()
        };

        try {
            const existingApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
            const updatedApiaries = [...existingApiaries, newApiary];
            localStorage.setItem('hf_apiaries', JSON.stringify(updatedApiaries));

            showToast('Apiário cadastrado com sucesso!', 'success');

            setTimeout(() => {
                navigate('/cadastro-colmeia', {
                    state: { apiarioId: newApiary.id }
                });
            }, 1500);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            showToast('Erro ao salvar os dados. Tente novamente.', 'error');
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
                    <ActionButtons onCancel={handleBack} onSave={handleSave} />
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
                                            onDeleted={handlePolygonDeleted}
                                            draw={{
                                                rectangle: false,
                                                circle: false,
                                                circlemarker: false,
                                                marker: false,
                                                polyline: false,
                                                polygon: {
                                                    allowIntersection: false,
                                                    drawError: {
                                                        color: '#e1e100',
                                                        message: '<strong>Erro:</strong> áreas não podem se cruzar!'
                                                    },
                                                    shapeOptions: {
                                                        color: '#ffbd59',
                                                        fillColor: '#ffbd59',
                                                        fillOpacity: 0.3
                                                    }
                                                }
                                            }}
                                            edit={{
                                                featureGroup: null,
                                                remove: true
                                            }}
                                        />
                                    </FeatureGroup>
                                </MapContainer>
                            </div>
                            {polygonCoords.length > 0 && (
                                <p style={{ marginTop: '10px', color: 'var(--hf-text-muted)', fontSize: '14px' }}>
                                    ✓ Área definida com {polygonCoords.length} pontos
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
