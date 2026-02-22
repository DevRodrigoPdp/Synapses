import React, { useState } from 'react';
import { useAuth } from '../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../estilos/perfil.css';

const Perfil = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

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
    }).toUpperCase();

    const createdAt = new Date(user.created_at).toLocaleDateString('es-ES').toUpperCase();

    return (
        <div className="perfil-container">
            <div className="perfil-header">
                <div className="system-status">
                    <span className="dot-green blink"></span> SYSTEM: ONLINE
                </div>
                <h1>EXPEDIENTE DE USUARIO</h1>
                <p className="uuid-code">SUBJ_ID: {user.id}</p>
            </div>

            <div className="perfil-grid">
                
                {/* TARJETA 1: DATOS */}
                <div className="card-tech">
                    <h3>// CREDENCIALES</h3>
                    <div className="data-row">
                        <span className="label">EMAIL:</span>
                        <span className="value">{user.email}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">PROVEEDOR:</span>
                        <span className="value">{user.app_metadata.provider || 'EMAIL'}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">ALTA:</span>
                        <span className="value">{createdAt}</span>
                    </div>
                </div>

                {/* TARJETA 2: TELEMETRÍA */}
                <div className="card-tech">
                    <h3>// TELEMETRÍA SESIÓN</h3>
                    <div className="data-row">
                        <span className="label">ÚLTIMO ACCESO:</span>
                        <span className="value">{lastLogin}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">ROL:</span>
                        <span className="value">{user.role || 'USER'}</span>
                    </div>
                </div>

                {/* TARJETA 3: HISTORIAL */}
                <div className="card-tech full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>// LOG DE OPERACIONES (PEDIDOS)</h3>
                        
                        {historial.length > 0 && (
                            <button className="btn-purge" onClick={handlePurgeHistory}>
                                [PURGE_DATA]
                            </button>
                        )}
                    </div>
                    
                    {historial.length > 0 ? (
                        <div className="history-list">
                            {historial.map((order, index) => (
                                <div key={index} className="history-item">
                                    <div className="history-header">
                                        <span className="order-id">REF: {order.id}</span>
                                        <span className={`order-status status-${order.estado === 'COMPLETADO' ? 'green' : 'yellow'}`}>
                                            [{order.estado}]
                                        </span>
                                    </div>
                                    <div className="history-body">
                                        <div className="history-meta">
                                            <span>TIMESTAMP: {order.fecha}</span>
                                            <span>VALUATION: {order.total}</span>
                                        </div>
                                        <div className="history-payload">
                                            <span className="payload-label">PAYLOAD:</span>
                                            
                                            {/* CAMBIO AQUÍ: FORMATEAR LISTA CON CANTIDADES */}
                                            {order.items.map((item, idx) => {
                                                // Compatibilidad: Si es un pedido viejo (solo string) o nuevo (objeto)
                                                const nombre = typeof item === 'string' ? item : item.nombre;
                                                const cantidad = typeof item === 'string' ? 1 : item.cantidad;
                                                
                                                // Si es el último, no ponemos coma
                                                const isLast = idx === order.items.length - 1;
                                                
                                                return (
                                                    <span key={idx}>
                                                        {nombre} {cantidad > 1 && <strong>(x{cantidad})</strong>}
                                                        {!isLast && ", "}
                                                    </span>
                                                );
                                            })}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>NO SE HAN REGISTRADO OPERACIONES RECIENTES.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="perfil-actions">
                <button className="btn-logout-tech" onClick={handleLogout}>
                    CERRAR SESIÓN [TERMINATE]
                </button>
            </div>
        </div>
    );
};

export default Perfil;