import { useState } from 'react';
import { useAuth } from '../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export const useLoginForm = () => {
    const { signIn, signUp, resetPassword, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState({});
    const [mostrarPassword, setMostrarPassword] = useState(false);
    
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '' 
    });

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await loginWithGoogle();
            if (error) throw error;
        } catch (error) {
            console.error(error);
            toast.error("Error al iniciar sesión con Google");
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        const { value: emailInput } = await Swal.fire({
            title: 'Recuperar Contraseña',
            text: 'Introduce tu email para recibir el enlace de recuperación',
            input: 'email',
            inputPlaceholder: 'ejemplo@correo.com',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
        });

        if (emailInput) {
            setLoading(true);
            try {
                const { error } = await resetPassword(emailInput);
                if (error) {
                    toast.error("Error: " + error.message);
                } else {
                    Swal.fire('¡Enviado!', 'Revisa tu correo para restablecer la contraseña.', 'success');
                }
            } catch (error) {
                toast.error("Error de conexión");
            } finally {
                setLoading(false);
            }
        }
    };

    const gestionarCampos = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validar = () => {
        const nuevosErrores = {};

        if (!form.email.trim()) {
            nuevosErrores.email = 'El email es obligatorio';
        }

        if (!form.password.trim()) {
            nuevosErrores.password = 'La contraseña es obligatoria';
        } else {
            const erroresPass = [];
            if (form.password.length < 8) erroresPass.push("al menos 8 caracteres");
            if (!/[A-Z]/.test(form.password)) erroresPass.push("una mayúscula");
            if (!/[0-9]/.test(form.password)) erroresPass.push("un número");

            if (erroresPass.length > 0) {
                nuevosErrores.password = "La contraseña debe tener: " + erroresPass.join(", ");
            }
        }
        
        if (isSignUp) {
            if (!form.confirmPassword) {
                nuevosErrores.confirmPassword = "Debes confirmar la contraseña";
            } else if (form.password !== form.confirmPassword) {
                nuevosErrores.confirmPassword = "Las contraseñas no coinciden";
            }
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();
        
        if (!validar()) {
            toast.warn("Por favor revisa los campos del formulario");
            return;
        }

        setLoading(true);
        setErrores({});

        try {
            let result;
            if (isSignUp) {
                result = await signUp(form.email, form.password);
                if (!result.error) {
                    toast.success('¡Registro exitoso! Revisa tu email de confirmación.');
                    setIsSignUp(false);
                }
            } else {
                result = await signIn(form.email, form.password);
                if (!result.error) {
                    await Swal.fire({
                        title: '¡Bienvenido!',
                        text: `Hola de nuevo, ${form.email}`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    navigate('/');
                }
            }

            if (result.error) {
                const msg = result.error.message;
                setErrores({ auth: msg }); 
                toast.error(`Error: ${msg}`); 
            }

        } catch (err) {
            setErrores({ auth: 'Error de conexión' });
            toast.error('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const cambiarModo = (e) => {
        e.preventDefault();
        setIsSignUp(!isSignUp);
        setErrores({});
        setForm(prev => ({ ...prev, confirmPassword: '' })); 
    };

    return {
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
    };
};
