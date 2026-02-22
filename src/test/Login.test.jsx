import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// AJUSTA LA RUTA si tu Login.jsx está en otra carpeta (ej: ../pages/Login)
import Login from '../componentes/Login'; 

// --- MOCKS ---

// 1. AuthContext: Usamos vi.hoisted para evitar errores de elevación
const { mockSignIn, mockSignUp, mockLoginWithGoogle, mockNavigate } = vi.hoisted(() => {
  return {
    mockSignIn: vi.fn(),
    mockSignUp: vi.fn(),
    mockLoginWithGoogle: vi.fn(),
    mockNavigate: vi.fn(),
  };
});

// 2. React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 3. AuthContext Provider
vi.mock('../servicios/context/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    LoginWithGoogle: mockLoginWithGoogle,
    resetPassword: vi.fn(),
  }),
}));

// 4. UI Libraries
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(() => Promise.resolve({ value: true })) }
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// --- TESTS ---

describe('Pruebas en <Login />', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Debe renderizar el formulario correctamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('Debe mostrar errores si el formulario está vacío', async () => {
    const user = userEvent.setup();
    render(<BrowserRouter><Login /></BrowserRouter>);

    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText(/El email es obligatorio/i)).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  test('Debe llamar a signIn con datos válidos', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ error: null });

    render(<BrowserRouter><Login /></BrowserRouter>);

    await user.type(screen.getByPlaceholderText(/Email Address/i), 'juan@test.com');
    await user.type(screen.getByPlaceholderText(/Password/i), 'Pass1234'); // Mayús + Núm

    await user.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('juan@test.com', 'Pass1234');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Debe llamar a LoginWithGoogle', async () => {
    const user = userEvent.setup();
    render(<BrowserRouter><Login /></BrowserRouter>);

    const btnGoogle = screen.getByText(/Sign in with Google/i);
    await user.click(btnGoogle);

    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });
});
