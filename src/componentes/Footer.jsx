import React from 'react';
import { Link } from 'react-router-dom';
import '../estilos/footer.css';

const Footer = () => {
    return (
        <footer className="footer-compact">
            <div className="footer-line"></div>
            
            <div className="footer-content">
                {/* IZQUIERDA: MARCA */}
                <div className="footer-brand">
                    <span className="brand-name">SYNAPSES LAB</span>
                    <span className="brand-loc">// MADRID</span>
                </div>

                {/* CENTRO: ENLACES LEGALES (Opcional, si quieres que sea ultra-minimal quita esto) */}
                <nav className="footer-legal">
                    <Link to="/aviso-legal">Legal</Link>
                    <Link to="/privacidad">Privacidad</Link>
                    <Link to="/cookies">Cookies</Link>
                </nav>

                {/* DERECHA: COPYRIGHT */}
                <div className="footer-copy">
                    <span>©{new Date().getFullYear()} ALL RIGHTS RESERVED</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;