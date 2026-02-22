import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../servicios/context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando verificación...</div>;
  }

  if (!user) {    
    return <Navigate to="/iniciar_sesion" replace />;    
  }

  return <Outlet />;
};

export default ProtectedRoute;