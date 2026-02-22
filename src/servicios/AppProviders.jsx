import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProductosProvider } from './context/ProductosContext';
import { CarritoProvider } from './context/CarritoContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ProductosProvider>
        <CarritoProvider>
          {children}
        </CarritoProvider>
      </ProductosProvider>
    </AuthProvider>
  );
};

export default AppProviders;
