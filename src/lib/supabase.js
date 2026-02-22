import { createClient } from '@supabase/supabase-js'

// Sacado de tu captura de "API Settings"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// Para la KEY, haz scroll un poco hacia abajo en esa misma pantalla de tu captura 
// hasta donde dice "anon" "public" y cópiala.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)