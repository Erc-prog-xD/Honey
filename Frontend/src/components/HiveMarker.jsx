import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import beeIcon from '../assets/img/Beehive.svg';

/**
 * Componente visual do Pin de Colmeia
 * Pode ser usado como componente React normal ou convertido para ícone do Leaflet
 * @param {string} className - Classes CSS adicionais
 * @param {number} size - Tamanho do ícone (largura)
 */
export const HiveMarkerPin = ({ size = 40, className = '' }) => {
    // Cores baseadas no global.css
    const primaryColor = '#ffbd59'; // --hf-primary
    const darkColor = '#d97706';    // --hf-primary-dark

    // Proporção original baseada no SVG 
    const width = 46; // largura original do desenho
    const height = 62; // altura original do desenho

    // Calcula altura proporcional se apenas width (size) for fornecido
    const calcHeight = (size * height) / width;

    return (
        <svg
            width={size}
            height={calcHeight}
            viewBox="0 0 46 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))' }} // Sombra nativa do SVG
        >
            {/* Shape do Pin (Gota invertida) */}
            <path
                d="M23 0C10.2975 0 0 10.2975 0 23C0 35.7025 23 62 23 62C23 62 46 35.7025 46 23C46 10.2975 35.7025 0 23 0Z"
                fill={primaryColor}
                stroke="white"
                strokeWidth="2"
            />

            {/* Círculo Branco Interno */}
            <circle cx="23" cy="23" r="16" fill="white" />

            {/* Ícone de Colmeia (Imagem Base64 do Beehive.svg) - Centralizado no círculo */}
            <image
                x="10"
                y="10"
                width="26"
                height="26"
                href={beeIcon}
            />
        </svg>
    );
};

/**
 * Função helper para criar o ícone do Leaflet
 * @returns {L.DivIcon} - Objeto DivIcon do Leaflet pronto para uso
 */
export const createHiveIcon = () => {
    const iconMarkup = renderToStaticMarkup(<HiveMarkerPin size={46} />);

    return L.divIcon({
        className: 'custom-hive-marker', // Classe vazia para não dar conflito com estilos padrão
        html: iconMarkup,
        iconSize: [46, 62],
        iconAnchor: [23, 62], // Ponta do pino na coordenada correta
        popupAnchor: [0, -60] // Popup aparece acima do pino
    });
};

export default HiveMarkerPin;
