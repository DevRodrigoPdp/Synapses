import React from 'react';
import '../estilos/portada.css'

const Portada = () => {
    return (
        <div className="hero-container">
            {/* Capa oscura para que el texto se lea bien */}
            <div className="hero-overlay"></div>
            
            <div className="hero-content">
                <span className="hero-badge">COLECCIÓN 2026</span>
                <h1 className="hero-title">
                    REDEFINE <br />
                    <span className="text-outline">TU LÍMITE</span>
                </h1>
                <p className="hero-subtitle">
                    Ingeniería de precisión, ligereza extrema y rendimiento sin concesiones.
                    Bienvenido a la nueva era del ciclismo.
                </p>
                <a href="#productos" className="btn-hero">
                    DESCUBRIR MODELOS
                </a>
            </div>

            {/* Pequeño scroll indicator animado */}
            <div className="scroll-indicator">
                <span>SCROLL</span>
                <div className="linea-scroll"></div>
            </div>
        </div>
    );
};

export default Portada;