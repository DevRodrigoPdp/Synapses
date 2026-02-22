import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // NOTA: Hemos quitado el bloque 'test' porque ahora usamos 'vitest.config.js'
});