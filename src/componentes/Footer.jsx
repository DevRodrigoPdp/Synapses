import React from 'react';
import { Link } from 'react-router-dom';
import '../estilos/footer.css';

const Footer = () => {
    return (
        <footer className="footer-professional">
            <div className="footer-container">
                <div className="footer-column brand-column">
                    <span className="footer-brand-name">SYNAPSES LAB</span>
                    <p className="footer-brand-desc">
                        Ingeniería de precisión y rendimiento sin concesiones.
                        Diseccionando los límites del ciclismo moderno.
                    </p>
                    <div className="footer-socials">
                        {/* Redes sociales usando links y SVGs simples */}
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">TW</a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4>TIENDA</h4>
                    <Link to="/">Bicicletas</Link>
                    <Link to="/">Equipación</Link>
                    <Link to="/">Accesorios</Link>
                    <Link to="/rebajas">Ofertas</Link>
                </div>

                <div className="footer-column">
                    <h4>SOPORTE</h4>
                    <Link to="/faq">Preguntas Frecuentes</Link>
                    <Link to="/envios">Envíos y Devoluciones</Link>
                    <Link to="/garantia">Garantía</Link>
                    <Link to="/contacto">Contacto</Link>
                </div>

                <div className="footer-column">
                    <h4>SYNAPSES</h4>
                    <Link to="/autor">Sobre Nosotros</Link>
                    <Link to="/tecnologia">Tecnología</Link>
                    <Link to="/equipo">El Equipo</Link>
                    <Link to="/prensa">Prensa</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-legal-links">
                    <Link to="/aviso-legal">Aviso Legal</Link>
                    <Link to="/privacidad">Política de Privacidad</Link>
                    <Link to="/cookies">Política de Cookies</Link>
                </div>
                <div className="footer-copyright">
                    <span>© {new Date().getFullYear()} SYNAPSES LAB. ALL RIGHTS RESERVED.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;