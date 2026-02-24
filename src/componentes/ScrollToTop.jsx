import React, { useState, useEffect } from 'react';
import '../estilos/scrollToTop.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Muestra el botón cuando el usuario hace scroll hacia abajo
    const toggleVisibility = () => {
        if (window.scrollY > 500) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Función para volver al inicio suavemente
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <div className="scroll-to-top">
            {isVisible && (
                <button onClick={scrollToTop} className="scroll-btn" aria-label="Volver arriba">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                </button>
            )}
        </div>
    );
}

export default ScrollToTop;
