import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createHiveIcon } from './HiveMarker';

// Define o ícone padrão do Leaflet como o nosso HiveMarker
L.Marker.prototype.options.icon = createHiveIcon();

// Componente para voar até uma localização específica
const FlyToLocation = ({ location }) => {
    const map = useMap();

    useEffect(() => {
        if (location && location.lat && location.lng) {
            map.flyTo([location.lat, location.lng], 16, {
                duration: 1.5
            });
        }
    }, [location, map]);

    return null;
};

const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng);
            // Salva a localização no localStorage para usar como inicial na próxima vez
            localStorage.setItem('hf_user_location', JSON.stringify({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            }));
            map.flyTo(e.latlng, 14, { duration: 1.5 });
        },
    });

    useEffect(() => {
        map.locate();
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Sua localização atual</Popup>
        </Marker>
    );
};

// Componente para polígono clicável
const ClickablePolygon = ({ apiary, navigate }) => {
    const handleClick = () => {
        navigate(`/apiario/${apiary.id}`);
    };

    if (!apiary.polygon || apiary.polygon.length === 0) return null;

    return (
        <Polygon
            positions={apiary.polygon.map(p => [p.lat, p.lng])}
            pathOptions={{
                color: '#ffbd59',
                fillColor: '#ffbd59',
                fillOpacity: 0.2,
                weight: 2
            }}
            eventHandlers={{
                click: handleClick
            }}
        >
            <Popup>
                <strong>{apiary.nomeApelido}</strong><br />
                Tipo: {apiary.tipoAbelha || 'N/A'}<br />
                <em style={{ fontSize: '12px', color: '#666' }}>Clique para ver detalhes</em>
            </Popup>
        </Polygon>
    );
};

const MapArea = ({ flyToLocation }) => {
    const navigate = useNavigate();

    // Usa última localização salva ou fallback para Crateús/CE
    const getInitialPosition = () => {
        const saved = localStorage.getItem('hf_user_location');
        if (saved) {
            const { lat, lng } = JSON.parse(saved);
            return [lat, lng];
        }
        return [-5.1753, -40.6769]; // Crateús, CE como fallback
    };

    const initialPosition = getInitialPosition();
    const [hives, setHives] = useState([]);
    const [apiaries, setApiaries] = useState([]);

    useEffect(() => {
        // Carrega as colmeias do localStorage
        const storedHives = JSON.parse(localStorage.getItem('hf_hives') || '[]');
        setHives(storedHives);

        // Carrega os apiários do localStorage
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        setApiaries(storedApiaries);
    }, []);

    // Encontra o nome do apiário pelo ID
    const getApiaryName = (apiarioId) => {
        const apiary = apiaries.find(ap => String(ap.id) === String(apiarioId));
        return apiary ? apiary.nomeApelido : `Apiário ${apiarioId}`;
    };

    return (
        <div className="map-area-container">
            <MapContainer
                center={initialPosition}
                zoom={13}
                className="map-leaflet"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                <FlyToLocation location={flyToLocation} />

                {/* Renderiza polígonos clicáveis para cada apiário */}
                {apiaries.map((apiary) => (
                    <ClickablePolygon
                        key={`apiary-${apiary.id}`}
                        apiary={apiary}
                        navigate={navigate}
                    />
                ))}

                {/* Renderiza marcadores para cada colmeia salva (apenas ativas) */}
                {hives.map((hive) => (
                    hive.lat && hive.lng && hive.active !== false && (
                        <Marker
                            key={hive.id}
                            position={[parseFloat(hive.lat), parseFloat(hive.lng)]}
                            icon={createHiveIcon()} // Usa o ícone personalizado
                            eventHandlers={{
                                click: () => {
                                    if (hive.apiario) {
                                        navigate(`/apiario/${hive.apiario}`);
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <strong>Colmeia #{hive.id}</strong><br />
                                Apiário: {getApiaryName(hive.apiario)}<br />
                                Ano: {hive.anoColmeia}<br />
                                Rainha: {hive.anoRainha || 'N/A'}<br />
                                <em style={{ fontSize: '12px', color: '#666' }}>Clique para ver detalhes</em>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default MapArea;