import { z } from 'zod';

// Password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation schema
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Auth form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Password validation function for manual validation
export const validatePassword = (password) => {
  const result = passwordSchema.safeParse(password);
  
  if (result.success) {
    return { isValid: true, errors: [] };
  }
  
  return {
    isValid: false,
    errors: result.error.issues.map(err => err.message)
  };
};

// General input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// School ID validation for query filtering
export const validateSchoolId = (schoolId) => {
  if (!schoolId || typeof schoolId !== 'string') {
    throw new Error('Valid school ID is required');
  }
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(schoolId)) {
    throw new Error('Invalid school ID format');
  }
  
  return schoolId;
};

// Role validation
export const validateRole = (role) => {
  const validRoles = ['principal', 'administrator', 'teacher', 'student'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid user role');
  }
  return role;
};

// Query sanitization helper
export const sanitizeQuery = (query, userRole, schoolId) => {
  if (!query || typeof query !== 'object') {
    throw new Error('Invalid query object');
  }
  
  // Always add school_id filter for security
  if (schoolId) {
    query.school_id = validateSchoolId(schoolId);
  }
  
  // Add role-based filtering if needed
  if (userRole) {
    validateRole(userRole);
  }
  
  return query;
};

// Onboarding validation schemas
export const schoolNameSchema = z.object({
  schoolName: z.string()
    .min(3, 'School name must be at least 3 characters')
    .max(100, 'School name must not exceed 100 characters')
    .trim(),
});

export const schoolAddressSchema = z.object({
  schoolAddress: z.string()
    .max(200, 'Address must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
});

export const unhcrStatusSchema = z.object({
  unhcrStatus: z.boolean(),
});

export const principalInfoSchema = z.object({
  principalName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  principalPhone: z.string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
});

export const teacherEmailsSchema = z.object({
  teacherEmails: z.array(
    z.string().email('Please enter valid email addresses')
  ).optional(),
});