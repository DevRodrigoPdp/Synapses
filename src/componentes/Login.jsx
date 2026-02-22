import React from "react";
import '../estilos/login.css';
import { useLoginForm } from '../hooks/useLoginForm';
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Importaciones de librerías UX
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const {
        isSignUp,
        loading,
        errores,
        mostrarPassword,
        setMostrarPassword,
        form,
        gestionarCampos,
        enviarFormulario,
        handleGoogleLogin,
        handleResetPassword,
        cambiarModo
    } = useLoginForm();

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />

            <div className="right"></div>
            <div className="left">
                <div className="header">
                    <h2 className="animation a1">
                        {isSignUp ? 'Crear Cuenta' : 'Bienvenido'}
                    </h2>
                    <h4 className="animation a2">
                        {isSignUp
                            ? 'Completa los datos para registrarte'
                            : 'Inicia sesión con tu correo y contraseña'}
                    </h4>
                </div>

                <form className="form" onSubmit={enviarFormulario}>
                    {errores.auth && <p className="error-text animation a2">{errores.auth}</p>}

                    <input
                        type="email"
                        name="email"
                        className="form-field animation a3"
                        value={form.email}
                        onChange={gestionarCampos}
                        placeholder="Email Address"
                    />
                    {errores.email && <p className="error-text">{errores.email}</p>}

                    <div className="password-wrapper animation a4">
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            className="form-field"
                            style={{ marginTop: 0, width: '100%' }} 
                            value={form.password}
                            onChange={gestionarCampos}
                            placeholder="Password"
                        />
                        
                        <button 
                            type="button"
                            className="btn-eye-toggle"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            tabIndex="-1"
                            title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                                {mostrarPassword ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                        </button>
                    </div>
                    {errores.password && <p className="error-text">{errores.password}</p>}

                    {isSignUp && (
                        <div className="animation a5">
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-field"
                                value={form.confirmPassword}
                                onChange={gestionarCampos}
                                placeholder="Confirmar Password"
                            />
                            {errores.confirmPassword && (
                                <p className="error-text">
                                    {errores.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    {!isSignUp && (
                        <div className="forgot-pass-container animation a5">
                            <a href="#" onClick={handleResetPassword}>
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    )}

                    <button type="submit" className="animation a6" disabled={loading}>
                        {loading ? 'Procesando...' : (isSignUp ? 'REGISTRARSE' : 'LOGIN')}
                    </button>

                    {/* 2. MODIFICADO: Botón Google con la lógica real e icono SVG */}
                    <button 
                        type="button" 
                        className="google-btn animation a6" 
                        disabled={loading}
                        onClick={handleGoogleLogin} // <-- Aquí conectamos la función
                    >
                        <FcGoogle size={22} style={{ marginRight: '8px' }} />
                        Sign in with Google
                    </button>

                    <p className="toggle-mode-container animation a7">
                        <a href="#" onClick={cambiarModo}>
                            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;