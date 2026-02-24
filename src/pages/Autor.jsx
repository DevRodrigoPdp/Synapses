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
                    <div className="hero-tag">PROYECTO CONTINUO</div>
                    <h1 className="dossier-main-title">EL PROYECTO <br /><span className="outline">DAW & MÁS ALLÁ</span></h1>
                    <p className="hero-lead">
                        Bienvenido a Synapses. Lo que comenzó como un proyecto para el ciclo de Desarrollo de Aplicaciones Web (DAW), ha evolucionado hasta convertirse en una plataforma de e-commerce perfeccionada y ampliada de forma independiente por Rodrigo Puerta.
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
                    <h3>¿QUÉ ES SYNAPSES?</h3>
                    <p>Es una tienda online de ciclismo de alto rendimiento. Implementa un catálogo dinámico, control de stock real, carrito de compras híbrido, filtros por categorías y un panel de administración protegido.</p>
                </div>

                {/* BLOQUE 2: IMAGEN TALLER */}
                <div className="grid-block block-image section-taller-img"></div>

                {/* BLOQUE 3: BIOMECÁNICA (DETALLE) */}
                <div className="grid-block block-white">
                    <span className="block-number">02</span>
                    <h3>TECNOLOGÍAS</h3>
                    <ul className="spec-list">
                        <li><span>FRONTEND:</span> React.js, Vite, Hooks de Contexto</li>
                        <li><span>BACKEND:</span> Supabase (Backend-as-a-Service, Auth y PostgreSQL)</li>
                        <li><span>DISEÑO:</span> CSS3 Puro y Responsive Design</li>
                    </ul>
                </div>

                {/* BLOQUE 4: EL AUTOR */}
                <div className="grid-block block-red">
                    <span className="block-number">03</span>
                    <h3>DESARROLLADOR WEB</h3>
                    <h2>RODRIGO PUERTA</h2>
                    <p>Estudiante de DAW apasionado por el desarrollo web full-stack. Synapses es su laboratorio personal: nació en las aulas, pero ha crecido gracias a su dedicación autodidacta explorando nuevas arquitecturas y código limpio.</p>
                </div>

            </div>

            {/* --- SECCIÓN FINAL: ACCIÓN --- */}
            <section className="dossier-cta">
                <div className="cta-box">
                    <h2>¿QUIERES VER EL RESULTADO?</h2>
                    <Link to="/" className="btn-lab">
                        VOLVER AL CATÁLOGO DE LA TIENDA
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Autor;