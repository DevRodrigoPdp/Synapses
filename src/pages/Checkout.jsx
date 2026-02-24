import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../servicios/context/CarritoContext';
import { useAuth } from '../servicios/context/AuthContext';
import '../estilos/checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { carrito, total, vaciar } = useCarrito();
    const { user } = useAuth();
    const [step, setStep] = useState(1);

    // Formulario de envío
    const [shipping, setShipping] = useState({
        nombre: '',
        apellidos: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        telefono: ''
    });

    // Formulario de pago simulado
    const [payment, setPayment] = useState({
        tarjeta: '',
        fecha: '',
        cvv: ''
    });

    const [error, setError] = useState('');

    if (carrito.length === 0 && step !== 4) {
        return (
            <div className="checkout-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>TU CARRITO ESTÁ VACÍO</h2>
                <button className="btn-negro-solido mt-4" onClick={() => navigate('/')}>VOLVER A LA TIENDA</button>
            </div>
        );
    }

    const handleNext = () => {
        if (step === 1) {
            // Validar envío
            if (!shipping.nombre || !shipping.direccion || !shipping.ciudad || !shipping.codigoPostal) {
                setError('Por favor, rellena todos los campos obligatorios (*)');
                return;
            }
        } else if (step === 2) {
            // Validar pago
            if (payment.tarjeta.length < 16 || !payment.fecha || payment.cvv.length < 3) {
                setError('Por favor, introduce detalles de pago válidos.');
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
        setError('');
    };

    const handleConfirm = () => {
        // Confirmar pedido (simulación)
        const nuevoPedido = {
            id: `SYN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            fecha: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            estado: 'PROCESANDO',
            total: Number(total).toLocaleString('es-ES') + ' €',
            items: carrito.map(p => ({
                nombre: p.nombre,
                cantidad: p.cantidad || 1
            })),
            envio: shipping
        };

        const historialPrevio = JSON.parse(localStorage.getItem('historial_synapses') || '[]');
        const nuevoHistorial = [nuevoPedido, ...historialPrevio];
        localStorage.setItem('historial_synapses', JSON.stringify(nuevoHistorial));

        vaciar(); // Vaciar carrito
        setStep(4); // Pantalla de éxito
    };

    return (
        <div className="checkout-container">
            {step < 4 && (
                <div className="checkout-progress">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>1. ENVÍO</div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>2. PAGO</div>
                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>3. REVISIÓN</div>
                </div>
            )}

            <div className="checkout-content">
                <div className="checkout-main">
                    {error && <div className="checkout-error">{error}</div>}

                    {step === 1 && (
                        <div className="checkout-form-section fade-in">
                            <h3>INFORMACIÓN DE ENVÍO</h3>
                            <div className="form-grid">
                                <input type="text" placeholder="Nombre *" value={shipping.nombre} onChange={e => setShipping({ ...shipping, nombre: e.target.value })} />
                                <input type="text" placeholder="Apellidos" value={shipping.apellidos} onChange={e => setShipping({ ...shipping, apellidos: e.target.value })} />
                                <input type="text" placeholder="Dirección Completa *" className="full-width" value={shipping.direccion} onChange={e => setShipping({ ...shipping, direccion: e.target.value })} />
                                <input type="text" placeholder="Ciudad *" value={shipping.ciudad} onChange={e => setShipping({ ...shipping, ciudad: e.target.value })} />
                                <input type="text" placeholder="Código Postal *" value={shipping.codigoPostal} onChange={e => setShipping({ ...shipping, codigoPostal: e.target.value })} />
                                <input type="tel" placeholder="Teléfono" value={shipping.telefono} onChange={e => setShipping({ ...shipping, telefono: e.target.value })} />
                            </div>
                            <div className="checkout-actions">
                                <button className="btn-outline-rojo" onClick={() => navigate('/detalle-carrito')}>VOLVER AL CARRITO</button>
                                <button className="btn-negro-solido" onClick={handleNext}>CONTINUAR A PAGO</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="checkout-form-section fade-in">
                            <h3>MÉTODO DE PAGO</h3>
                            <p className="payment-secure-badge">🔒 PAGO SEGURO ENCRIPTADO</p>
                            <div className="form-grid">
                                <input type="text" placeholder="Número de Tarjeta (16 dígitos) *" className="full-width" maxLength="16" value={payment.tarjeta} onChange={e => setPayment({ ...payment, tarjeta: e.target.value })} />
                                <input type="text" placeholder="MM/YY *" maxLength="5" value={payment.fecha} onChange={e => setPayment({ ...payment, fecha: e.target.value })} />
                                <input type="text" placeholder="CVV *" maxLength="4" value={payment.cvv} onChange={e => setPayment({ ...payment, cvv: e.target.value })} />
                                <input type="text" placeholder="Titular de la tarjeta" className="full-width" />
                            </div>
                            <div className="checkout-actions outline-top">
                                <button className="btn-outline-rojo" onClick={handleBack}>VOLVER</button>
                                <button className="btn-negro-solido" onClick={handleNext}>REVISAR PEDIDO</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="checkout-form-section fade-in">
                            <h3>CONFIRMAR PEDIDO</h3>
                            <div className="review-block">
                                <h4>Enviar a:</h4>
                                <p>{shipping.nombre} {shipping.apellidos}</p>
                                <p>{shipping.direccion}</p>
                                <p>{shipping.codigoPostal}, {shipping.ciudad}</p>
                            </div>
                            <div className="review-block">
                                <h4>Pago:</h4>
                                <p>Tarjeta terminada en {payment.tarjeta.slice(-4) || 'XXXX'}</p>
                            </div>
                            <div className="checkout-actions outline-top">
                                <button className="btn-outline-rojo" onClick={handleBack}>VOLVER</button>
                                <button className="btn-negro-solido uppercase" onClick={handleConfirm}>Confirmar y Pagar {Number(total).toLocaleString('es-ES')} €</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="checkout-success fade-in text-center">
                            <div className="success-icon">✓</div>
                            <h2>¡PEDIDO CONFIRMADO!</h2>
                            <p>Gracias por tu compra en SYNAPSES LAB.</p>
                            <p>Recibirás un email de confirmación con los detalles del pedido en breve.</p>
                            <button className="btn-negro-solido mt-4" onClick={() => navigate('/perfil')}>VER MI PEDIDO</button>
                        </div>
                    )}
                </div>

                {/* Resumen lateral visible solo en pasos 1-3 */}
                {step < 4 && (
                    <div className="checkout-sidebar">
                        <div className="summary-box">
                            <h4>RESUMEN DEL PEDIDO</h4>
                            <div className="summary-items">
                                {carrito.map((item, idx) => (
                                    <div className="summary-item" key={idx}>
                                        <div className="summary-item-img">
                                            <img src={item.imagen} alt={item.nombre} />
                                            <span className="summary-item-qty">{item.cantidad || 1}</span>
                                        </div>
                                        <div className="summary-item-details">
                                            <span className="summary-item-name">{item.nombre}</span>
                                            <span className="summary-item-price">{(Number(item.precio) * (item.cantidad || 1)).toLocaleString('es-ES')} €</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-totals">
                                <div className="summary-row"><span>Subtotal</span><span>{Number(total).toLocaleString('es-ES')} €</span></div>
                                <div className="summary-row"><span>Envío</span><span className="text-free">GRATIS</span></div>
                                <div className="summary-row total-row"><span>Total</span><span>{Number(total).toLocaleString('es-ES')} €</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
