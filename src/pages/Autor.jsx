import React from 'react';
import '../estilos/autor.css'; 
import { Link } from 'react-router-dom';

// 1. IMPORTAMOS EL NEWSLETTER
import Newsletter from '../componentes/Newsletter';

function Autor() {
    return (
        <div className="dossier-container">
            {/* --- SECCIÓN HERO: EL MANIFIESTO --- */}
           <section className="dossier-hero">
                
                {/* NUEVO CONTENEDOR PARA EL TEXTO */}
                <div className="hero-content-wrapper">
                    <div className="hero-tag">PROJECT: SYNAPSES 2026</div>
                    <h1 className="dossier-main-title">EL ARTE DE LA <br/><span className="outline">PRECISIÓN</span></h1>
                    <p className="hero-lead">
                        No fabricamos bicicletas. Calibramos extensiones del cuerpo humano. 
                        Bienvenido al santuario técnico de Rodrigo Puerta del Pozo.
                    </p>
                </div>

                {/* INDICADOR DE SCROLL (SE QUEDA FUERA DEL WRAPPER) */}
                <div className="scroll-indicator">
                    <span className="scroll-text">EXPLORAR DOSSIER</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </section>

            {/* --- GRID TÉCNICO --- */}
            <div className="dossier-grid">
                {/* ... resto de tu código ... */}
                
                {/* BLOQUE 1: FILOSOFÍA */}
                <div className="grid-block block-dark">
                    <span className="block-number">01</span>
                    <h3>LA FILOSOFÍA</h3>
                    <p>En SYNAPSES LAB, el ruido visual desaparece. Cada ángulo, cada gramo y cada rodamiento tiene un propósito: la eficiencia absoluta.</p>
                </div>

                {/* BLOQUE 2: IMAGEN TALLER */}
                <div className="grid-block block-image section-taller-img"></div>

                {/* BLOQUE 3: BIOMECÁNICA (DETALLE) */}
                <div className="grid-block block-white">
                    <span className="block-number">02</span>
                    <h3>OPERACIONES</h3>
                    <ul className="spec-list">
                        <li><span>BUILD:</span> Montajes a la carta (Custom)</li>
                        <li><span>SERVICE:</span> Suspensiones Certificadas</li>
                        <li><span>DATA:</span> Ajuste Biomecánico 3D</li>
                    </ul>
                </div>

                {/* BLOQUE 4: EL AUTOR */}
                <div className="grid-block block-red">
                    <span className="block-number">03</span>
                    <h3>CHIEF ENGINEER</h3>
                    <h2>RODRIGO PUERTA</h2>
                    <p>Mecánico jefe y artífice de la visión Synapses. 10 años optimizando el rendimiento en la alta competición.</p>
                </div>

            </div>

            {/* --- SECCIÓN FINAL: ACCIÓN --- */}
            <section className="dossier-cta">
                <div className="cta-box">
                    <h2>¿LISTO PARA TU PRÓXIMA ETAPA?</h2>
                    <Link to="/" className="btn-lab">
                        SOLICITAR CONSULTA TÉCNICA
                    </Link>
                </div>
            </section>       
        </div>
    );
}

export default Autor;