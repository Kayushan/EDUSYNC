import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Mock hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    authLoading: false,
    error: null,
    clearError: vi.fn(),
    resetPassword: vi.fn(),
  }),
}));

describe('Authentication Components', () => {
  describe('Login Component', () => {
    it('should render login form', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByText('Welcome to EduSync')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your school management portal')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should show forgot password link', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });
  });

  describe('Register Component', () => {
    it('should render registration form', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join EduSync school management system')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('should show password strength indicator', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      expect(screen.getByText('Password Strength:')).toBeInTheDocument();
    });
  });

  describe('ProtectedRoute Component', () => {
    it('should show loading spinner initially', () => {
      vi.mock('../hooks/useAuth', () => ({
        useAuth: () => ({
          loading: true,
          isAuthenticated: false,
        }),
      }));

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Look for spinner SVG
    });

    it('should show content when authenticated', () => {
      vi.mock('../hooks/useAuth', () => ({
        useAuth: () => ({
          loading: false,
          isAuthenticated: true,
        }),
      }));

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});