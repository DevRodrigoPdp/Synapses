import { useState, useEffect, useRef } from "react";
import "../estilos/menu.css";
import { Link } from "react-router-dom";
import { useAuth } from "../servicios/context/AuthContext";
import { useCarrito } from "../servicios/context/CarritoContext";

// Importamos los hooks y componentes del Modo Oscuro
import useDarkSide from "../hooks/useDarkSide";
import ThemeToggle from "../componentes/ThemeToggle"; 

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Configuración Modo Oscuro
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === "light" ? true : false);

    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

    const { user, signOut } = useAuth();
    const { carrito, total } = useCarrito();

    // Solo mostramos el panel si el correo coincide
    const esPropietario = user?.email === 'rpuertadelpozo@gmail.com';

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleLogout = async () => {
        await signOut();
        setMobileMenuOpen(false);
    };

    const toggleCarrito = () => setIsOpen(!isOpen);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    // Calculamos la cantidad total de artículos para el badge
    const cantidadTotalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

    const formatearMoneda = (cantidad) => {
        return Number(cantidad).toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    const fechaUltimoAcceso = user?.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        : '';

    return (
        <header className="header-carrito">
            <div className="header-container">
                <Link to="/" className="logo" onClick={closeMobileMenu} aria-label="Ir a inicio">
                    SYNAPSES
                </Link>

                <nav className={`header-nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeMobileMenu}>Inicio</Link>
                    <Link to="/rebajas" onClick={closeMobileMenu}>Rebajas</Link>
                    <Link to="/autor" onClick={closeMobileMenu}>Autor</Link>
                    {esPropietario && <Link to="/administracion" onClick={closeMobileMenu}>Panel Admin</Link>}

                    <div className="mobile-user-actions">
                        {user ? (
                            <>
                                <Link to="/perfil" onClick={closeMobileMenu}>MI PERFIL</Link>
                                <button onClick={handleLogout} className="btn-logout-mobile">Cerrar Sesión</button>
                            </>
                        ) : (
                            /* --- CAMBIO 1: Texto en Inglés para Móvil --- */
                            <Link to="/iniciar_sesion" onClick={closeMobileMenu} className="btn-login-mobile">
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </nav>

                <div className="header-right-actions">
                    <div className="desktop-user-info">
                        {user ? (
                            <div className="user-details-group">
                                <div className="user-text-info">
                                    <span className="user-hello">Hola, {user.email}</span>
                                    <span className="user-date">Acceso: {fechaUltimoAcceso}</span>
                                </div>
                                
                                <Link to="/perfil" className="link-expediente" aria-label="Ver mi expediente">
                                    [VER EXPEDIENTE]
                                </Link>

                                <button onClick={handleLogout} className="btn-logout-text">SALIR</button>
                            </div>
                        ) : (
                            /* --- CAMBIO 2: Texto en Inglés para Escritorio --- */
                            <Link to="/iniciar_sesion" className="login-link">
                                Login / Sign Up
                            </Link>
                        )}
                    </div>

                    <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                        <ThemeToggle 
                            isDark={darkSide} 
                            toggleDarkMode={toggleDarkMode} 
                        />
                    </div>

                    <div className="menu-carrito-container" ref={menuRef}>
                        <button className="menu-carrito-btn" onClick={toggleCarrito} aria-expanded={isOpen} aria-label="Carrito">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                {cantidadTotalItems > 0 && <span className="cart-badge">{cantidadTotalItems}</span>}
                            </div>
                            {total > 0 && <span className="cart-price">{formatearMoneda(total)} €</span>}
                        </button>

                        {isOpen && (
                            <div className="carrito-desplegable">
                                <div className="carrito-header">
                                    <h4>Tu Cesta ({cantidadTotalItems})</h4>
                                    <button onClick={() => setIsOpen(false)} className="close-cart">×</button>
                                </div>
                                <div className="carrito-items-list">
                                    {carrito.length > 0 ? (
                                        <>
                                            {carrito.map((item, index) => (
                                                <div className="carrito-item" key={index}>
                                                    <div className="cart-item-info">
                                                        <span className="cart-item-name">{item.nombre}</span>
                                                        <span className="cart-item-qty">x{item.cantidad || 1}</span>
                                                    </div>
                                                    <span className="cart-item-price">
                                                        {formatearMoneda(Number(item.precio) * (item.cantidad || 1))} €
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="carrito-footer">
                                                <div className="total-row">
                                                    <span>TOTAL</span>
                                                    <span> {formatearMoneda(total)} €</span>
                                                </div>
                                                
                                                <Link 
                                                    to="/detalle-carrito" 
                                                    className="btn-checkout" 
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    TRAMITAR PEDIDO
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="carrito-vacio"><p>Tu cesta está vacía</p></div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="hamburger-btn" onClick={toggleMobileMenu}>
                        <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Menu;