import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser'; // Asegúrate de tener esto instalado
import '../estilos/newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [enviando, setEnviando] = useState(false);
    
    // ESTADOS PARA MENSAJES
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState(''); // <--- NUEVO: Para el mensaje de éxito
    
    const formRef = useRef(); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Limpiamos mensajes previos antes de validar
        setMensajeError(''); 
        setMensajeExito('');

        // 1. VALIDACIÓN DEL EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            setMensajeError("El campo de email no puede estar vacío.");
            return;
        }
        
        if (!emailRegex.test(email)) {
            setMensajeError("Por favor, introduce un email válido (ej: hola@gmail.com).");
            return;
        }

        // 2. VALIDACIÓN CHECKBOX
        if (!privacyAccepted) {
            setMensajeError("Es necesario aceptar la política de privacidad.");
            return;
        }

        // Si todo está bien, procedemos
        setEnviando(true);

        const SERVICE_ID = 'service_u0oq4sq'; // Tus credenciales
        const TEMPLATE_ID = 'template_7l2d3rw';
        const PUBLIC_KEY = 's8gae-j7wjnlgu-zf';

        // Enviamos el objeto formRef.current o los params manuales
        const templateParams = { user_email: email };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            .then((result) => {
                // --- AQUÍ ES DONDE CAMBIAMOS EL MENSAJE ---
                const textoBienvenida = "¡Bienvenido a la comunidad!";
                
                toast.success(textoBienvenida); // Mensaje flotante
                setMensajeExito(textoBienvenida); // Mensaje fijo en pantalla
                
                // Limpiamos el formulario
                setEmail(''); 
                setPrivacyAccepted(false); 
                setEnviando(false);
            }, (error) => {
                console.error("Error:", error.text);
                setMensajeError("Hubo un error técnico. Inténtalo de nuevo.");
                toast.error("Error al suscribirse");
                setEnviando(false);
            });
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <div className="newsletter-content">
                    <h3>Join The <br/>Syndicate.</h3>
                    <p>Recibe novedades sobre lanzamientos, ingeniería y ofertas exclusivas.</p>
                </div>

                <form className="newsletter-form" ref={formRef} onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="user_email"
                            className={`newsletter-input ${mensajeError ? 'input-error' : ''} ${mensajeExito ? 'input-success' : ''}`}
                            placeholder="TU EMAIL AQUÍ"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if(mensajeError) setMensajeError('');
                                if(mensajeExito) setMensajeExito(''); // Limpiar éxito si vuelve a escribir
                            }}
                            disabled={enviando}
                        />
                        <button 
                            type="submit" 
                            className="newsletter-btn"
                            disabled={enviando}
                            style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'wait' : 'pointer' }}
                        >
                            {enviando ? '...' : 'SUSCRIBIRSE'}
                        </button>
                    </div>

                    {/* MUESTRA MENSAJE DE ERROR (Rojo) */}
                    {mensajeError && (
                        <p className="mensaje-feedback-error" style={{ color: 'red', marginTop: '10px' }}>
                            {mensajeError}
                        </p>
                    )}

                    {/* MUESTRA MENSAJE DE ÉXITO (Verde) */}
                    {mensajeExito && (
                        <p className="mensaje-feedback-success" style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: '10px' }}>
                            {mensajeExito}
                        </p>
                    )}

                    <label className="legal-check">
                        <input 
                            type="checkbox" 
                            checked={privacyAccepted}
                            onChange={(e) => {
                                setPrivacyAccepted(e.target.checked);
                                if(mensajeError) setMensajeError('');
                            }}
                        />
                        <span>Acepto la política de privacidad.</span>
                    </label>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;