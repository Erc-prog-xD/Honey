import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../assets/css/HiveRegistration.css';

// Components
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import ToastCenter from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
import { createHiveIcon } from '../components/HiveMarker';

// Custom Marker Icon
const customIcon = createHiveIcon();

// Função para verificar se um ponto está dentro de um polígono (Ray-casting algorithm)
const isPointInPolygon = (point, polygon) => {
    if (!polygon || polygon.length < 3) return false;

    const x = point.lat;
    const y = point.lng;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat, yi = polygon[i].lng;
        const xj = polygon[j].lat, yj = polygon[j].lng;

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

const LocationPicker = ({ onLocationSelect, apiaryPolygon, showError }) => {
    const [position, setPosition] = useState(null);
    const [hasLocated, setHasLocated] = useState(false);
    const map = useMap();

    useEffect(() => {
        if (!hasLocated) {
            map.locate().on("locationfound", function (e) {
                // Apenas centraliza o mapa na localização do usuário
                // NÃO seleciona automaticamente - usuário precisa clicar
                map.flyTo(e.latlng, 15);
                setHasLocated(true);
            });
        }
    }, [map, hasLocated]);

    useMapEvents({
        click(e) {
            // Verifica se o clique está dentro do polígono do apiário
            if (apiaryPolygon && apiaryPolygon.length > 0) {
                const clickedPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
                if (!isPointInPolygon(clickedPoint, apiaryPolygon)) {
                    showError('A colmeia deve ser posicionada dentro da área do apiário!');
                    return;
                }
            }
            // Somente quando o usuário clica dentro da área é que define a posição
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon} />
    );
};

// Componente para centralizar no polígono do apiário selecionado
const FlyToApiary = ({ apiary }) => {
    const map = useMap();

    useEffect(() => {
        if (apiary && apiary.polygon && apiary.polygon.length > 0) {
            const bounds = L.latLngBounds(apiary.polygon.map(p => [p.lat, p.lng]));
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
        }
    }, [apiary, map]);

    return null;
};

const HiveRegistration = () => {
    const navigate = useNavigate();
    const [coords, setCoords] = useState({ lat: '', lng: '' });
    const [toast, setToast] = useState(null);
    const [apiaries, setApiaries] = useState([]);
    const [selectedApiary, setSelectedApiary] = useState(null);
    const [honeyTypes, setHoneyTypes] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [formData, setFormData] = useState({
        apiario: '',
        anoColmeia: '',
        anoRainha: '',
        tipoMel: ''
    });

    const location = useLocation();

    // Carrega apiários e tipos de mel do localStorage
    useEffect(() => {
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        setApiaries(storedApiaries);

        // Carrega tipos de mel salvos
        const storedHoneyTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
        setHoneyTypes(storedHoneyTypes);

        // Preenche o apiário se vier da navegação (após cadastro de apiário)
        if (location.state?.apiarioId) {
            setFormData(prev => ({ ...prev, apiario: String(location.state.apiarioId) }));
        }
    }, [location.state]);

    // Atualiza o apiário selecionado quando muda a seleção
    useEffect(() => {
        if (formData.apiario) {
            const apiary = apiaries.find(ap => String(ap.id) === formData.apiario);
            setSelectedApiary(apiary || null);
        } else {
            setSelectedApiary(null);
        }
    }, [formData.apiario, apiaries]);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleLocationSelect = (lat, lng) => {
        setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    };

    // Handler para input de tipo de mel com autocomplete
    const handleHoneyTypeChange = (value) => {
        setFormData({ ...formData, tipoMel: value });

        if (value.trim().length > 0) {
            const filtered = honeyTypes.filter(type =>
                type.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Seleciona uma sugestão
    const handleSelectSuggestion = (type) => {
        setFormData({ ...formData, tipoMel: type });
        setShowSuggestions(false);
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleSave = () => {
        // Validação de campos obrigatórios
        if (!formData.apiario) {
            showToast('Por favor, selecione um apiário.', 'error');
            return;
        }
        if (!formData.anoColmeia) {
            showToast('Por favor, informe o ano da colmeia.', 'error');
            return;
        }
        if (!coords.lat || !coords.lng) {
            showToast('Obrigatório: Clique no mapa para selecionar a localização da colmeia!', 'error');
            return;
        }

        const newHive = {
            id: Date.now(),
            ...formData,
            ...coords,
            createdAt: new Date().toISOString()
        };

        try {
            const existingHives = JSON.parse(localStorage.getItem('hf_hives') || '[]');
            const updatedHives = [...existingHives, newHive];
            localStorage.setItem('hf_hives', JSON.stringify(updatedHives));

            // Salva novo tipo de mel se não existir
            if (formData.tipoMel && formData.tipoMel.trim()) {
                const existingTypes = JSON.parse(localStorage.getItem('hf_honey_types') || '[]');
                if (!existingTypes.includes(formData.tipoMel.trim())) {
                    const updatedTypes = [...existingTypes, formData.tipoMel.trim()];
                    localStorage.setItem('hf_honey_types', JSON.stringify(updatedTypes));
                }
            }

            showToast('Colmeia cadastrada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/dashboard');
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
                        <h1>Cadastro de colmeia</h1>
                    </div>
                    <ActionButtons onCancel={handleBack} onSave={handleSave} />
                </div>

                <div className="reg-grid">
                    {/* Left Column: General Info */}
                    <div className="reg-card card-info">
                        <h2>Informações gerais</h2>
                        <div className="input-group">
                            <label>Selecione o apiário <span style={{ color: 'red' }}>*</span></label>
                            <div className="select-with-btn">
                                <CustomSelect
                                    options={apiaries.map(ap => ({
                                        value: String(ap.id),
                                        label: ap.nomeApelido
                                    }))}
                                    value={formData.apiario}
                                    onChange={(val) => setFormData({ ...formData, apiario: val })}
                                    placeholder="Selecione o apiário"
                                />
                                <button className="add-apiary-btn" onClick={() => navigate('/cadastro-apiario')}>+</button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Ano da colmeia <span className="required-star">*</span></label>
                            <input
                                type="text"
                                placeholder=""
                                value={formData.anoColmeia}
                                onChange={(e) => setFormData({ ...formData, anoColmeia: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Ano da rainha <span className="required-star">*</span></label>
                            <input
                                type="text"
                                placeholder=""
                                value={formData.anoRainha}
                                onChange={(e) => setFormData({ ...formData, anoRainha: e.target.value })}
                            />
                        </div>

                        <div className="input-group autocomplete-container">
                            <label>Tipo de mel <span className="required-star">*</span></label>
                            <input
                                type="text"
                                placeholder="Digite ou selecione o tipo de mel"
                                value={formData.tipoMel}
                                onChange={(e) => handleHoneyTypeChange(e.target.value)}
                                onFocus={() => {
                                    if (formData.tipoMel.trim().length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                onBlur={() => {
                                    // Delay para permitir clique nas sugestões
                                    setTimeout(() => setShowSuggestions(false), 200);
                                }}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="suggestions-dropdown">
                                    {suggestions.map((type, index) => (
                                        <div
                                            key={index}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(type)}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Location */}
                    <div className="reg-card card-location">
                        <h2>Localização <span style={{ color: 'red' }}>*</span></h2>
                        <div className="map-picker-container">
                            <label>Selecione a localização no mapa <span className="required-star">*</span></label>
                            <div className="mini-map-wrapper">
                                <MapContainer center={[-23.5505, -46.6333]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker
                                        onLocationSelect={handleLocationSelect}
                                        apiaryPolygon={selectedApiary?.polygon}
                                        showError={(msg) => showToast(msg, 'error')}
                                    />
                                    <FlyToApiary apiary={selectedApiary} />

                                    {/* Mostra o polígono do apiário selecionado */}
                                    {selectedApiary && selectedApiary.polygon && selectedApiary.polygon.length > 0 && (
                                        <Polygon
                                            positions={selectedApiary.polygon.map(p => [p.lat, p.lng])}
                                            pathOptions={{
                                                color: '#ffbd59',
                                                fillColor: '#ffbd59',
                                                fillOpacity: 0.2,
                                                weight: 2
                                            }}
                                        />
                                    )}
                                </MapContainer>
                            </div>
                        </div>

                        <div className="coords-row">
                            <div className="input-group">
                                <label>Longitude</label>
                                <div className="coord-input">
                                    <span>X:</span>
                                    <input type="text" value={coords.lng} readOnly />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Latitude</label>
                                <div className="coord-input">
                                    <span>Y:</span>
                                    <input type="text" value={coords.lat} readOnly />
                                </div>
                            </div>
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

export default HiveRegistration;
