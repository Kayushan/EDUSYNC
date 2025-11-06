import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';

// Note: Do not mock '../hooks/useAuth' at the top-level here.
// Mocking that module globally interferes with other test suites (auth tests)
// which need the real `useAuth` implementation. Individual tests may mock
// the hook locally when required.

describe('Authentication Components', () => {
  describe('Login Component', () => {
    it('should render login form', () => {
      const mockAuth = {
        loading: false,
        authLoading: false,
        isAuthenticated: false,
        user: null,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        clearError: vi.fn(),
        error: null,
      };

      render(
        <AuthContext.Provider value={mockAuth}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByText('Welcome to EduSync')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your school management portal')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should show forgot password link', () => {
      const mockAuth = {
        loading: false,
        authLoading: false,
        isAuthenticated: false,
        user: null,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        clearError: vi.fn(),
        error: null,
      };

      render(
        <AuthContext.Provider value={mockAuth}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });
  });

  describe('Register Component', () => {
    it('should render registration form', () => {
      const mockAuth = {
        loading: false,
        authLoading: false,
        isAuthenticated: false,
        user: null,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        clearError: vi.fn(),
        error: null,
      };

      render(
        <AuthContext.Provider value={mockAuth}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
      expect(screen.getByText('Join EduSync school management system')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

      it('should show password strength indicator when password is entered', async () => {
      const mockAuth = {
        loading: false,
        authLoading: false,
        isAuthenticated: false,
        user: null,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        clearError: vi.fn(),
        error: null,
      };

      render(
        <AuthContext.Provider value={mockAuth}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </AuthContext.Provider>
      );

        // Get password input and type a value
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, 'TestPass123!');

        // Now the password strength indicator should be visible
        expect(screen.getByText(/Password Strength:/)).toBeInTheDocument();
    });
      

  });

  describe('ProtectedRoute Component', () => {
    it('should show loading spinner initially', () => {
      // Provide a mocked AuthContext where loading is true so ProtectedRoute shows spinner
      const mockAuth = {
        loading: true,
        authLoading: false,
        isAuthenticated: false,
        user: null,
      };

      render(
        <AuthContext.Provider value={mockAuth}>
          <BrowserRouter>
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          </BrowserRouter>
        </AuthContext.Provider>
      );

      // Spinner has role="img" and aria-label="Loading"
      expect(screen.getByRole('img', { name: 'Loading' })).toBeInTheDocument();
    });

    it('should show content when authenticated', () => {
      const mockAuth = {
        loading: false,
        authLoading: false,
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com' },
      };

      render(
        <AuthContext.Provider value={mockAuth}>
          <BrowserRouter>
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          </BrowserRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});