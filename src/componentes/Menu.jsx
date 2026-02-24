import { useState, useEffect, useRef } from "react";
import "../estilos/menu.css";
import { Link } from "react-router-dom";
import { useAuth } from "../servicios/context/AuthContext";
import { useCarrito } from "../servicios/context/CarritoContext";

// Modo Oscuro
import useDarkSide from "../hooks/useDarkSide";
import ThemeToggle from "../componentes/ThemeToggle";
import ProductSearch from "./ProductSearch";

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const userMenuRef = useRef(null);

    // Modo Oscuro
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === "light" ? true : false);
    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

    const { user, signOut } = useAuth();
    const { carrito, total } = useCarrito();
    const esPropietario = user?.email === 'rpuertadelpozo@gmail.com';

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    };

    const toggleCarrito = () => setIsOpen(!isOpen);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const cantidadTotalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

    const formatearMoneda = (cantidad) => {
        return Number(cantidad).toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    // Nombre corto del usuario
    const userDisplayName = user?.email ? user.email.split('@')[0] : '';

    return (
        <header className="header-carrito">
            <div className="header-container">
                {/* ===== IZQUIERDA: LOGO ===== */}
                <Link to="/" className="logo" onClick={closeMobileMenu} aria-label="Ir a inicio">
                    SYNAPSES
                </Link>

                {/* ===== CENTRO: NAVEGACIÓN (solo los enlaces esenciales) ===== */}
                <nav className={`header-nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeMobileMenu}>Inicio</Link>
                    <Link to="/rebajas" onClick={closeMobileMenu}>Ofertas</Link>
                    <Link to="/autor" onClick={closeMobileMenu}>Nosotros</Link>
                    {esPropietario && <Link to="/administracion" onClick={closeMobileMenu}>Admin</Link>}

                    {/* Buscador dentro del menú en móvil */}
                    <div className="mobile-search-wrapper">
                        <ProductSearch />
                    </div>

                    {/* Acciones de usuario en móvil */}
                    <div className="mobile-user-actions">
                        {user ? (
                            <>
                                <Link to="/perfil" onClick={closeMobileMenu}>Mi Perfil</Link>
                                <button onClick={handleLogout} className="btn-logout-mobile">Cerrar Sesión</button>
                            </>
                        ) : (
                            <Link to="/iniciar_sesion" onClick={closeMobileMenu} className="btn-login-mobile">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </nav>

                {/* ===== DERECHA: ICONOS (búsqueda, usuario, tema, carrito) ===== */}
                <div className="header-right-actions">
                    {/* Buscador en escritorio */}
                    <div className="desktop-search-wrapper">
                        <ProductSearch />
                    </div>

                    {/* ICONO DE USUARIO con dropdown */}
                    <div className="user-icon-container" ref={userMenuRef}>
                        <button
                            className="icon-btn user-icon-btn"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            aria-label="Menú de usuario"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            {user && <span className="user-dot-online"></span>}
                        </button>

                        {userMenuOpen && (
                            <div className="user-dropdown">
                                {user ? (
                                    <>
                                        <div className="user-dropdown-header">
                                            <span className="user-dropdown-name">{userDisplayName}</span>
                                            <span className="user-dropdown-email">{user.email}</span>
                                        </div>
                                        <div className="user-dropdown-divider"></div>
                                        <Link to="/perfil" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                            Mi Perfil
                                        </Link>
                                        {esPropietario && (
                                            <Link to="/administracion" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                                Panel Admin
                                            </Link>
                                        )}
                                        <div className="user-dropdown-divider"></div>
                                        <button className="user-dropdown-item logout" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/iniciar_sesion" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                            Iniciar Sesión
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* MODO OSCURO */}
                    <ThemeToggle isDark={darkSide} toggleDarkMode={toggleDarkMode} />

                    {/* CARRITO */}
                    <div className="menu-carrito-container" ref={menuRef}>
                        <button className="menu-carrito-btn" onClick={toggleCarrito} aria-expanded={isOpen} aria-label="Carrito">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                    {/* HAMBURGUESA (móvil) */}
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