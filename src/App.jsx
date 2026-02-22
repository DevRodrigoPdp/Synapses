import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// COMPONENTES FIJOS
import Menu from './componentes/Menu';
import Footer from './componentes/Footer';
import ProtectedRoute from './componentes/ProtectedRoute';

import AppProviders from './servicios/AppProviders';

// PÁGINAS LAZY
const Portada = lazy(() => import('./componentes/Portada'));
const Rebajas = lazy(() => import('./pages/Rebajas'));
const Autor = lazy(() => import('./pages/Autor'));
const Administracion = lazy(() => import('./pages/Administracion'));
const DetalleProducto = lazy(() => import('./pages/DetalleProducto'));
const DetalleCarrito = lazy(() => import('./pages/DetalleCarrito'));
const Login = lazy(() => import('./componentes/Login'));
const Perfil = lazy(() => import('./pages/Perfil')); // Importado correctamente
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const Pagina404 = lazy(() => import('./pages/Pagina404'));

const Cuerpo = lazy(() => import('./pages/Cuerpo')); 
const Newsletter = lazy(() => import('./componentes/Newsletter'));

function App() {
  return (
    <div className="app-container">
      <AppProviders>
        
        <Menu />

            <Suspense fallback={<div style={{padding: '50px', textAlign: 'center'}}>Cargando Synapses...</div>}>
              <Routes>
                
                {/* RUTA DE INICIO */}
                <Route path="/" element={
                  <>
                    {/* CORRECCIÓN: Faltaba añadir la Portada aquí */}
                    <Cuerpo />
                    <Newsletter />
                  </>
                } />

                <Route path="/rebajas" element={<Rebajas />} />
                <Route path="/autor" element={<Autor />} />
                <Route path="/detalle/:id" element={<DetalleProducto />} />
                <Route path="/detalle-carrito" element={<DetalleCarrito />} />
                <Route path="/iniciar_sesion" element={<Login />} />
                <Route path="/update-password" element={<UpdatePassword />} />

                {/* RUTAS PROTEGIDAS (Solo usuarios logueados) */}
                {/* Aquí es donde redirigirá el botón de "Tramitar Pedido" si el usuario está logueado */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/administracion" element={<Administracion />} />
                    <Route path="/perfil" element={<Perfil />} />
                </Route>

                <Route path="*" element={<Pagina404 />} />
              </Routes>
            </Suspense>

        <Footer />

      </AppProviders>
    </div>
  );
}

export default App;