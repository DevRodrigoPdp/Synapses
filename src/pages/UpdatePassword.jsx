import { useState } from "react";
import { useAuth } from '../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../estilos/login.css'; // Reutilizamos el CSS del login
import Swal from 'sweetalert2';

const UpdatePassword = () => {
    const { updateUserPassword } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password.length < 6) {
            Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
            setLoading(false);
            return;
        }

        const { error } = await updateUserPassword(password);

        if (!error) {
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Tu contraseña ha sido actualizada',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/'); 
        } else {
            Swal.fire('Error', error.message, 'error');
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="right"></div>
            <div className="left">
                <div className="header">
                    <h2 className="animation a1">Nueva Contraseña</h2>
                    <h4 className="animation a2">Introduce tu nueva clave para finalizar</h4>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="form-field animation a3"
                        placeholder="Escribe tu nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="animation a4" disabled={loading}>
                        {loading ? 'GUARDANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;