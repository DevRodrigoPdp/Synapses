import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- ZONA DE SEGURIDAD ---
// Inyectamos esto en global y en window para asegurar que JSDOM lo tenga
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder;

// Mock de scroll (necesario para React Router v7 en tests)
window.scrollTo = vi.fn();

// Mock de React-PDF
vi.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children }) => children({ loading: false }),
  Font: { register: vi.fn() },
  StyleSheet: { create: (s) => s }
}));