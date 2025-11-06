import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';
import { validatePassword } from '../utils/validators';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setError(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (data) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      // Validate password requirements
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || data.email.split('@')[0],
          }
        }
      });

      if (error) throw error;
      
      return { success: true, message: 'Account created successfully! Please check your email to verify.' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    authLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    // Always render children so hooks using the AuthContext (including in tests)
    // can access the context values. Components can rely on the `loading`
    // and `authLoading` flags to decide what to show in the UI.
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};