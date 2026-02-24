import React, { useState } from 'react';
import { useAuth } from '../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../estilos/perfil.css';

const Perfil = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pedidos');

    const [historial, setHistorial] = useState(() => {
        return JSON.parse(localStorage.getItem('historial_synapses') || '[]');
    });

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handlePurgeHistory = () => {
        localStorage.removeItem('historial_synapses');
        setHistorial([]);
    };

    if (!user) return <div className="loading-screen">ACCESO DENEGADO</div>;

    const lastLogin = new Date(user.last_sign_in_at).toLocaleString('es-ES', {
        timeZone: 'UTC', hour12: false
    });
    const createdAt = new Date(user.created_at).toLocaleDateString('es-ES');
    const userName = user.email.split('@')[0];

    // Función para el color del estado
    const getStatusClass = (estado) => {
        switch (estado) {
            case 'COMPLETADO': case 'ENTREGADO': return 'status-success';
            case 'ENVIADO': return 'status-shipped';
            case 'PROCESANDO': case 'EN PROCESO': return 'status-processing';
            case 'CANCELADO': return 'status-cancelled';
            default: return 'status-processing';
        }
    };

    const getStatusIcon = (estado) => {
        switch (estado) {
            case 'COMPLETADO': case 'ENTREGADO': return '✓';
            case 'ENVIADO': return '🚚';
            case 'PROCESANDO': case 'EN PROCESO': return '⟳';
            case 'CANCELADO': return '✕';
            default: return '⟳';
        }
    };

    return (
        <div className="perfil-container">
            {/* CABECERA DEL PERFIL */}
            <div className="perfil-header-pro">
                <div className="perfil-avatar">
                    <span>{userName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="perfil-user-info">
                    <h1>{userName}</h1>
                    <p className="perfil-email">{user.email}</p>
                    <div className="perfil-meta-badges">
                        <span className="meta-badge">Miembro desde {createdAt}</span>
                        <span className="meta-badge">Último acceso: {lastLogin}</span>
                    </div>
                </div>
                <button className="btn-logout-pro" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>

            {/* TABS */}
            <div className="perfil-tabs">
                <button
                    className={`perfil-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pedidos')}
                >
                    Mis Pedidos ({historial.length})
                </button>
                <button
                    className={`perfil-tab ${activeTab === 'cuenta' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cuenta')}
                >
                    Mi Cuenta
                </button>
            </div>

            {/* CONTENIDO TABS */}
            <div className="perfil-tab-content">

                {/* TAB: MIS PEDIDOS */}
                {activeTab === 'pedidos' && (
                    <div className="orders-section">
                        {historial.length > 0 ? (
                            <>
                                <div className="orders-header-bar">
                                    <span className="orders-count">{historial.length} pedido{historial.length > 1 ? 's' : ''}</span>
                                    <button className="btn-clear-history" onClick={handlePurgeHistory}>
                                        Borrar historial
                                    </button>
                                </div>
                                <div className="orders-list">
                                    {historial.map((order, index) => (
                                        <div key={index} className="order-card">
                                            <div className="order-card-header">
                                                <div className="order-card-left">
                                                    <span className="order-ref">{order.id}</span>
                                                    <span className="order-date">{order.fecha}</span>
                                                </div>
                                                <span className={`order-status-badge ${getStatusClass(order.estado)}`}>
                                                    <span className="status-icon">{getStatusIcon(order.estado)}</span>
                                                    {order.estado}
                                                </span>
                                            </div>

                                            <div className="order-card-items">
                                                {order.items.map((item, idx) => {
                                                    const nombre = typeof item === 'string' ? item : item.nombre;
                                                    const cantidad = typeof item === 'string' ? 1 : item.cantidad;
                                                    return (
                                                        <div key={idx} className="order-item-row">
                                                            <span className="order-item-name">{nombre}</span>
                                                            <span className="order-item-qty">x{cantidad}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="order-card-footer">
                                                <span className="order-total-label">Total</span>
                                                <span className="order-total-value">{order.total}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-orders">
                                <div className="empty-orders-icon">📦</div>
                                <h3>No tienes pedidos todavía</h3>
                                <p>Cuando realices una compra, podrás ver el estado de tus pedidos aquí.</p>
                                <button className="btn-shop-now" onClick={() => navigate('/')}>
                                    IR A LA TIENDA
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: MI CUENTA */}
                {activeTab === 'cuenta' && (
                    <div className="account-section">
                        <div className="account-card">
                            <h3>Información de la cuenta</h3>
                            <div className="account-row">
                                <span className="account-label">Email</span>
                                <span className="account-value">{user.email}</span>
                            </div>
                            <div className="account-row">
                                <span className="account-label">Proveedor</span>
                                <span className="account-value">{user.app_metadata.provider || 'Email'}</span>
                            </div>
                            <div className="account-row">
                                <span className="account-label">Fecha de alta</span>
                                <span className="account-value">{createdAt}</span>
                            </div>
                            <div className="account-row">
                                <span className="account-label">Rol</span>
                                <span className="account-value">{user.role || 'Usuario'}</span>
                            </div>
                            <div className="account-row">
                                <span className="account-label">ID</span>
                                <span className="account-value account-id">{user.id}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Perfil;