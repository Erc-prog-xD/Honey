import React, { useState } from 'react';
import { X, Hexagon, MapPin, Plus } from 'lucide-react';
import '../assets/css/Menu.css';

const Menu = () => {
  const [showAdd, setShowAdd] = useState(true);

  return (
    <div className="menu-page">
      <main className="content">
        {showAdd && (
          <>
            {/* Overlay escuro */}
            <div className="modal-overlay" onClick={() => setShowAdd(false)} />

            {/* Modal */}
            <div className="add-modal" role="dialog" aria-modal="true">
              <div className="add-card">
                <div className="add-header">
                  <div className="add-header-icon">
                    <Plus size={20} />
                  </div>
                  <span>Adicionar</span>
                  <button className="close-x" onClick={() => setShowAdd(false)}>
                    <X size={18} />
                  </button>
                </div>
                <div className="add-content">
                  <button className="btn-option btn-colmeia">
                    <div className="btn-option-icon">
                      <Hexagon size={24} />
                    </div>
                    <div className="btn-option-text">
                      <span className="btn-option-title">Colmeia</span>
                      <span className="btn-option-desc">Adicionar nova colmeia</span>
                    </div>
                  </button>
                  <button className="btn-option btn-apiario">
                    <div className="btn-option-icon">
                      <MapPin size={24} />
                    </div>
                    <div className="btn-option-text">
                      <span className="btn-option-title">Apiário</span>
                      <span className="btn-option-desc">Criar novo apiário</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Menu;