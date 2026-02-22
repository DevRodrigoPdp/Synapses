import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
// AÑADIDO: Importamos el hook de almacenamiento local
import UseStorageState from '../storage/UseLocalStorage'

// 1. Crear el contexto de autenticación
const AuthContext = createContext({})

// 2. Hook personalizado
export const useAuth = () => useContext(AuthContext)

// 3. Proveedor de Autenticación
export const AuthProvider = ({ children }) => {
  // --- ESTADOS ---
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // --- EFECTO DE INICIALIZACIÓN ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) 

  // --- FUNCIONES DE AUTENTICACIÓN ---

  // Iniciar Sesión (Correo/Pass)
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  // Registrar Usuario
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  // Cerrar Sesión
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Recuperar Contraseña
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // Ajusta la URL si es necesario
      // redirectTo: 'http://localhost:5173/update-password', 
    })
    return { data, error }
  }

  // Actualizar Contraseña (con sesión activa)
  const updateUserPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  }

  // --- INICIAR SESIÓN CON GOOGLE (ACTIVADO) ---
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Forzamos el prompt para asegurar que Google pregunte cuenta
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Redirige a la misma página donde estabas (o al home)
        redirectTo: window.location.origin 
      },
    })
    return { data, error }
  }

  // Objeto con todos los valores y funciones expuestos
  const value = {
    user,
    session,
    loading,
    
    // Funciones Originales
    signIn,
    signUp,
    signOut,
    
    // ALIAS (Para compatibilidad con tus componentes Login y Menu)
    login: signIn,   // Ahora puedes usar { login } en Login.jsx
    logout: signOut, // Ahora puedes usar { logout } en Menu.jsx y Profile.jsx
    
    // Funciones Extra
    resetPassword,
    updateUserPassword,
    loginWithGoogle, // ¡Añadido!
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}