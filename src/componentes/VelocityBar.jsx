import React from "react";
import "../estilos/velocityBar.css";

const VelocityBar = () => {
  // Contenido técnico y directo
  const technicalItems = [
    "SYSTEM STATUS: ONLINE",
    "WORLDWIDE SHIPPING: [ENABLED]",
    "NEW DROP: LAB71 SERIES",
    "FINANCING OPTIONS: AVAILABLE",
    "SECURE CHECKOUT: ENCRYPTED"
  ];

  return (
    <div className="velocity-container">
      <div className="velocity-track">
        {/* Renderizamos duplicado para el loop infinito perfecto */}
        <div className="velocity-content">
          {technicalItems.map((item, index) => (
            <span key={index} className="ticker-item">
              {item} <span className="separator">///</span>
            </span>
          ))}
        </div>
        
        {/* Duplicado necesario para la animación sin cortes */}
        <div className="velocity-content">
          {technicalItems.map((item, index) => (
            <span key={`dup-${index}`} className="ticker-item">
              {item} <span className="separator">///</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VelocityBar;