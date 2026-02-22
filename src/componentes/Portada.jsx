import React, { useState, useEffect } from 'react';
import '../estilos/portada.css'

const slides = [
    {
        id: 1,
        image: 'https://www.bielsa.com/wp-content/uploads/2024/10/BIELSATROCS.webp',
        badge: 'COLECCIÓN 2026',
        title1: 'REDEFINE',
        title2: 'TU LÍMITE',
        subtitle: 'Ingeniería de precisión, ligereza extrema y rendimiento sin concesiones. Bienvenido a la nueva era del ciclismo.',
        linkText: 'VER CATÁLOGO'
    },
    {
        id: 2,
        image: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2015/10/15/1331753773822_11/wyn-masters-en-el-skyline-bike-park-nueva-zelanda',
        badge: 'NUEVA RACE SERIES',
        title1: 'VELOCIDAD',
        title2: 'PURA',
        subtitle: 'Diseñada en el túnel de viento. La aerodinámica elevada a la máxima potencia para cruzar la meta primero.',
        linkText: 'DESCUBRIR'
    },
    {
        id: 3,
        image: 'https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2024/4/2/dy4sfonij6abmh0ovwzv/jess-blewitt',
        badge: 'FREERIDE EVOLUTION',
        title1: 'GRAVEDAD',
        title2: 'CERO',
        subtitle: 'Amortiguación inteligente y geometría agresiva para los saltos más espectaculares del planeta.',
        linkText: 'VER MODELO'
    }
];

const Portada = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play del slider cada 5 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="hero-carousel">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id} 
                    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="hero-overlay"></div>
                    
                    <div className="hero-content">
                        <span className="hero-badge">{slide.badge}</span>
                        <h1 className="hero-title">
                            {slide.title1} <br />
                            <span className="text-outline">{slide.title2}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {slide.subtitle}
                        </p>
                        <a href="#productos" className="btn-hero">
                            {slide.linkText}
                        </a>
                    </div>
                </div>
            ))}

            {/* Controles de Navegación del Carrusel (Puntos) */}
            <div className="hero-dots">
                {slides.map((_, index) => (
                    <button 
                        key={index} 
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Scroll indicator - Solo visible decorativo */}
            <div className="scroll-indicator">
                <span>SCROLL</span>
                <div className="linea-scroll"></div>
            </div>
        </div>
    );
};

export default Portada;