import React from 'react';
import '../assets/css/DashboardCard.css';

const DashboardCard = ({ icon: Icon, title, onClick }) => {
    return (
        <button className="dashboard-card" onClick={onClick}>
            <div className="card-icon-wrapper">
                <Icon size={48} strokeWidth={1} />
            </div>
            <span className="card-title">{title}</span>
        </button>
    );
};

export default DashboardCard;