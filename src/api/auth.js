import { supabase } from './supabaseClient';
import { validateSchoolId, validateRole, sanitizeQuery } from '../utils/validators';

// Authentication functions
export const authAPI = {
  // Sign up with email and password
  signUp: async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options.data || {},
          emailRedirectTo: options.emailRedirectTo || `${window.location.origin}/login`,
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// Database query helper with security
export const secureQuery = {
  // Execute a query with automatic school_id and role filtering
  execute: async (queryFn, user, schoolId) => {
    try {
      if (!user || !schoolId) {
        throw new Error('Authentication and school context required');
      }

      // Validate inputs
      validateSchoolId(schoolId);
      const userRole = user.user_metadata?.role;
      validateRole(userRole);

      // Execute the query function with context
      const result = await queryFn({ user, schoolId, role: userRole });
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create a filtered query for a specific table
  createQuery: (table, user, schoolId) => {
    validateSchoolId(schoolId);
    
    let query = supabase.from(table).select('*');
    
    // Always filter by school_id for security
    query = query.eq('school_id', schoolId);
    
    // Add role-based filtering if needed
    const userRole = user.user_metadata?.role;
    
    if (userRole === 'teacher') {
      // Teachers can only see their own data
      query = query.eq('user_id', user.id);
    } else if (userRole === 'student') {
      // Students can only see their own data
      query = query.eq('user_id', user.id);
    }
    // Admins and principals can see all data in the school
    
    return query;
  },

  // Sanitize and validate query parameters
  sanitizeParams: (params, user, schoolId) => {
    return sanitizeQuery(params || {}, user.user_metadata?.role, schoolId);
  },
};

// Profile management
export const profileAPI = {
  // Get user profile with school information
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          schools:school_id (
            id,
            name,
            address,
            phone
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get users by school and role
  getUsersBySchool: async (schoolId, role = null) => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('school_id', schoolId);

      if (role) {
        query = query.eq('role', role);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// Session management utilities
export const sessionManager = {
  // Check if session is valid
  isSessionValid: async () => {
    const { success, session } = await authAPI.getCurrentSession();
    return success && !!session;
  },

  // Refresh session
  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { success: true, session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Setup session listener
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};