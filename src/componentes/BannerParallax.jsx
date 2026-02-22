import React from 'react';
import '../estilos/bannerParallax.css';

const BannerParallax = () => {
    return (
        <div className="parallax-container">
            <div className="parallax-overlay"></div>
            <div className="parallax-content">
                <span className="parallax-badge">INNOVACIÓN 360°</span>
                <h2 className="parallax-title">
                    DISEÑADAS PARA <br />
                    DOMINAR <span className="text-outline">EL TERRENO</span>
                </h2>
                <button className="parallax-btn">
                    VER TECNOLOGÍA
                </button>
            </div>
        </div>
    );
};

export default BannerParallax;
