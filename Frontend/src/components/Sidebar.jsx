import React, { useState, useEffect } from 'react';
import { Archive, Hexagon, ChevronDown, ChevronRight, X } from 'lucide-react';
import '../assets/css/Sidebar.css';

const SidebarItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="sidebar-group">
            <div className="sidebar-header" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Archive className="icon-apiary" size={18} />
                <span>{title}</span>
            </div>
            {isOpen && <div className="sidebar-content">{children}</div>}
        </div>
    );
};

const HiveItem = ({ name, onClick }) => (
    <div className="hive-item" onClick={onClick} style={{ cursor: 'pointer' }}>
        <Hexagon className="icon-hive" size={16} />
        <span>{name}</span>
    </div>
);

const Sidebar = ({ onHiveSelect }) => {
    const [apiaries, setApiaries] = useState([]);
    const [hives, setHives] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Carrega apiários e colmeias do localStorage
        const storedApiaries = JSON.parse(localStorage.getItem('hf_apiaries') || '[]');
        const storedHives = JSON.parse(localStorage.getItem('hf_hives') || '[]');

        // RF20: Filtra apenas apiários que TÊM colmeias (ativas ou inativas)
        const apiariesWithHives = storedApiaries.filter(apiary => {
            const hasHives = storedHives.some(hive => String(hive.apiario) === String(apiary.id));
            return hasHives;
        });

        // Se algum apiário foi removido, atualiza o localStorage
        if (apiariesWithHives.length !== storedApiaries.length) {
            localStorage.setItem('hf_apiaries', JSON.stringify(apiariesWithHives));
        }

        setApiaries(apiariesWithHives);
        setHives(storedHives);
    }, []);

    const handleHiveClick = (hive) => {
        if (onHiveSelect && hive.lat && hive.lng) {
            onHiveSelect(parseFloat(hive.lat), parseFloat(hive.lng));
        }
        setIsMobileMenuOpen(false); // Fecha o menu ao selecionar
    };

    // Agrupa colmeias por apiário (apenas ativas)
    const getHivesForApiary = (apiaryId) => {
        return hives.filter(hive => hive.apiario === String(apiaryId) && hive.active !== false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const renderSidebarContent = () => (
        <>
            {apiaries.length === 0 ? (
                <div className="sidebar-empty">Nenhum apiário cadastrado</div>
            ) : (
                apiaries.map((apiary) => (
                    <SidebarItem key={apiary.id} title={apiary.nomeApelido || `Apiário ${apiary.id}`}>
                        {getHivesForApiary(apiary.id).length === 0 ? (
                            <div className="sidebar-empty-hives">Sem colmeias</div>
                        ) : (
                            getHivesForApiary(apiary.id).map((hive, hiveIndex) => (
                                <HiveItem
                                    key={hive.id}
                                    name={`Colmeia ${hiveIndex + 1}`}
                                    onClick={() => handleHiveClick(hive)}
                                />
                            ))
                        )}
                    </SidebarItem>
                ))
            )}
        </>
    );

    return (
        <>
            {/* Botão FAB mobile para apiários */}
            <button className="sidebar-fab" onClick={toggleMobileMenu}>
                <Hexagon size={24} />
            </button>

            {/* Overlay para fechar o menu */}
            {isMobileMenuOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar Desktop */}
            <div className="sidebar-container sidebar-desktop">
                {renderSidebarContent()}
            </div>

            {/* Sidebar Mobile (dropdown) */}
            <div className={`sidebar-container sidebar-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-mobile-header">
                    <span>Seus Apiários</span>
                    <button className="sidebar-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                {renderSidebarContent()}
            </div>
        </>
    );
};

export default Sidebar;