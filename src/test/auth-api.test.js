import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase first
vi.mock('../api/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      refreshSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

import { authAPI, secureQuery, profileAPI, sessionManager } from '../api/auth';
import { supabase } from '../api/supabaseClient';

describe('authAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockData = { user: { id: '1', email: 'test@example.com' } };
      supabase.auth.signUp.mockResolvedValue({ data: mockData, error: null });

      const result = await authAPI.signUp('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {},
          emailRedirectTo: 'http://localhost:3000/login',
        }
      });
    });

    it('should handle sign up error', async () => {
      const mockError = new Error('Email already exists');
      supabase.auth.signUp.mockResolvedValue({ data: null, error: mockError });

      const result = await authAPI.signUp('existing@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already exists');
    });

    it('should use custom options', async () => {
      const mockData = { user: { id: '1', email: 'test@example.com' } };
      supabase.auth.signUp.mockResolvedValue({ data: mockData, error: null });

      await authAPI.signUp('test@example.com', 'password123', {
        data: { full_name: 'John Doe' },
        emailRedirectTo: 'http://localhost:3000/custom'
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'John Doe' },
          emailRedirectTo: 'http://localhost:3000/custom',
        }
      });
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockData = { user: { id: '1', email: 'test@example.com' } };
      supabase.auth.signInWithPassword.mockResolvedValue({ data: mockData, error: null });

      const result = await authAPI.signIn('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign in error', async () => {
      const mockError = new Error('Invalid credentials');
      supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: mockError });

      const result = await authAPI.signIn('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });

      const result = await authAPI.signOut();

      expect(result.success).toBe(true);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out error', async () => {
      const mockError = new Error('Sign out failed');
      supabase.auth.signOut.mockResolvedValue({ error: mockError });

      const result = await authAPI.signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sign out failed');
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email successfully', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await authAPI.resetPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset email sent!');
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'http://localhost:3000/reset-password' }
      );
    });

    it('should handle reset password error', async () => {
      const mockError = new Error('Email not found');
      supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: mockError });

      const result = await authAPI.resetPassword('nonexistent@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email not found');
    });
  });

  describe('getCurrentSession', () => {
    it('should get current session successfully', async () => {
      const mockSession = { user: { id: '1', email: 'test@example.com' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const result = await authAPI.getCurrentSession();

      expect(result.success).toBe(true);
      expect(result.session).toBe(mockSession);
    });

    it('should handle get session error', async () => {
      const mockError = new Error('Session expired');
      supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: mockError });

      const result = await authAPI.getCurrentSession();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Session expired');
    });
  });
});

describe('sessionManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isSessionValid', () => {
    it('should return true for valid session', async () => {
      const mockSession = { user: { id: '1', email: 'test@example.com' } };
      supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const result = await sessionManager.isSessionValid();

      expect(result).toBe(true);
    });

    it('should return false for invalid session', async () => {
      supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      const result = await sessionManager.isSessionValid();

      expect(result).toBe(false);
    });

    it('should return false for session error', async () => {
      const mockError = new Error('Session error');
      supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: mockError });

      const result = await sessionManager.isSessionValid();

      expect(result).toBe(false);
    });
  });

  describe('refreshSession', () => {
    it('should refresh session successfully', async () => {
      const mockSession = { user: { id: '1', email: 'test@example.com' } };
      supabase.auth.refreshSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const result = await sessionManager.refreshSession();

      expect(result.success).toBe(true);
      expect(result.session).toBe(mockSession);
    });

    it('should handle refresh session error', async () => {
      const mockError = new Error('Refresh failed');
      supabase.auth.refreshSession.mockResolvedValue({ data: { session: null }, error: mockError });

      const result = await sessionManager.refreshSession();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Refresh failed');
    });
  });

  describe('onAuthStateChange', () => {
    it('should set up auth state change listener', () => {
      const mockCallback = vi.fn();
      const mockSubscription = { data: { subscription: { unsubscribe: vi.fn() } } };
      supabase.auth.onAuthStateChange.mockReturnValue(mockSubscription);

      const result = sessionManager.onAuthStateChange(mockCallback);

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback);
      expect(result).toBe(mockSubscription);
    });
  });
});