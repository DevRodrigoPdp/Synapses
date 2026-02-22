import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // Esto asegura que el archivo setup se cargue ANTES de los tests
    setupFiles: './src/test/setupTests.js',
    css: true,
  },
});