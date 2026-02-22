import React from 'react';
import { useAuth } from '../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../estilos/perfil.css'; 

const Profile = () => {
    const { user, logout } = useAuth(); // Asegúrate de que tu contexto exporte 'logout' o 'signOut'
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirige al login al cerrar sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    // Si por alguna razón el usuario no ha cargado aún
    if (!user) return <p>Cargando perfil...</p>;

    return (
        <div className="container">
            <div className="profile-card animation a1">
                <h2>Perfil de Usuario</h2>
                
                <div className="profile-info">
                    {/* NOMBRE (Si no existe, muestra 'Usuario') */}
                    {/* EMAIL */}
                    <p><strong>Email:</strong> {user.email}</p>
                    
                    {/* FECHA ÚLTIMO INICIO */}
                    <p><strong>Último acceso:</strong> {user.metadata?.lastSignInTime || "Primera vez"}</p>
                </div>

                <button 
                    className="logout-btn animation a2" 
                    onClick={handleLogout}
                    style={{ marginTop: '20px', backgroundColor: '#ff4b4b', color: 'white' }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Profile;