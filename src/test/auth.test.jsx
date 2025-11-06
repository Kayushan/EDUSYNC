import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

// Mock Supabase first
vi.mock('../api/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

import { AuthProvider } from '../contexts/AuthContext';
import { useAuth, useRequireAuth, useRequireRole } from '../hooks/useAuth';
import { supabase } from '../api/supabaseClient';

// Wrapper component for testing hooks
const createWrapper = () => {
  return ({ children }) => (
    <AuthProvider>
      <div>{children}</div>
    </AuthProvider>
  );
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide authentication context', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.authLoading).toBe(false);
    });
  });

  it('should handle authenticated user', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // Wait for the useEffect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBe(mockUser);
  });

  it('should handle sign in', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const signInResult = await result.current.signIn({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(signInResult.success).toBe(true);
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should handle sign in error', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const mockError = new Error('Invalid credentials');
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const signInResult = await result.current.signIn({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      expect(signInResult.success).toBe(false);
      expect(signInResult.error).toBe('Invalid credentials');
    });

    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should handle sign out', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    supabase.auth.signOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const signOutResult = await result.current.signOut();
      expect(signOutResult.success).toBe(true);
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle password reset', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const resetResult = await result.current.resetPassword('test@example.com');
      expect(resetResult.success).toBe(true);
      expect(resetResult.message).toBe('Password reset email sent!');
    });

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      { redirectTo: 'http://localhost:3000/reset-password' }
    );
  });
});

describe('useRequireAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    supabase.auth.getSession.mockReturnValue(new Promise(() => {}));
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireAuth(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.authenticated).toBe(false);
  });

  it('should return authenticated state for logged in user', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.authenticated).toBe(true);
    expect(result.current.user).toBe(mockUser);
  });

  it('should return unauthenticated state for logged out user', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.authenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});

describe('useRequireRole Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should authorize user with sufficient role', async () => {
    const mockUser = { 
      id: '1', 
      email: 'admin@example.com',
      user_metadata: { role: 'principal' }
    };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireRole('administrator'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.authorized).toBe(true);
    expect(result.current.userRole).toBe('principal');
  });

  it('should not authorize user with insufficient role', async () => {
    const mockUser = { 
      id: '1', 
      email: 'teacher@example.com',
      user_metadata: { role: 'teacher' }
    };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireRole('principal'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.authorized).toBe(false);
    expect(result.current.reason).toBe('insufficient_permissions');
  });

  it('should not authorize unauthenticated user', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireRole('teacher'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.authorized).toBe(false);
    expect(result.current.reason).toBe('not_authenticated');
  });

  it('should not authorize user without role', async () => {
    const mockUser = { 
      id: '1', 
      email: 'user@example.com',
      user_metadata: {} // No role defined
    };
    const mockSession = { user: mockUser };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useRequireRole('teacher'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.authorized).toBe(false);
    expect(result.current.reason).toBe('no_role');
  });
});