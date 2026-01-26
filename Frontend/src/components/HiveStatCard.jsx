import React from 'react';
import '../assets/css/HiveStatCard.css';

const HiveStatCard = ({ icon: Icon, value, label, color = 'default' }) => {
    return (
        <div className={`hive-stat-card ${color}`}>
            <div className="stat-icon-wrapper">
                <Icon size={24} strokeWidth={2} />
            </div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
};

export default HiveStatCard;
