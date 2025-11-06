import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePassword, emailSchema, passwordSchema, loginSchema, registerSchema } from '../utils/validators';

describe('Password Validation', () => {
  it('should validate strong password', () => {
    const result = validatePassword('StrongPass123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject password that is too short', () => {
    const result = validatePassword('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('should reject password without uppercase letter', () => {
    const result = validatePassword('lowercase123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should reject password without lowercase letter', () => {
    const result = validatePassword('UPPERCASE123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should reject password without number', () => {
    const result = validatePassword('NoNumbers!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should reject password without special character', () => {
    const result = validatePassword('NoSpecialChar123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('should reject password with multiple issues', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(2);
  });
});

describe('Email Schema Validation', () => {
  it('should validate correct email format', () => {
    const result = emailSchema.safeParse('test@example.com');
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = emailSchema.safeParse('invalid-email');
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

describe('Password Schema Validation', () => {
  it('should validate password meeting all requirements', () => {
    const result = passwordSchema.safeParse('ValidPass123!');
    expect(result.success).toBe(true);
  });

  it('should reject password not meeting requirements', () => {
    const result = passwordSchema.safeParse('weak');
    expect(result.success).toBe(false);
  });
});

describe('Login Schema Validation', () => {
  it('should validate correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email in login', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123'
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty password in login', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: ''
    });
    expect(result.success).toBe(false);
  });
});

describe('Register Schema Validation', () => {
  it('should validate correct registration data', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      fullName: 'John Doe'
    });
    expect(result.success).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'DifferentPass123!',
      fullName: 'John Doe'
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("Passwords don't match");
  });

  it('should reject weak password in registration', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak',
      fullName: 'John Doe'
    });
    expect(result.success).toBe(false);
  });

  it('should accept registration without full name', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!'
    });
    expect(result.success).toBe(true);
  });

  it('should reject full name that is too short', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      fullName: 'A'
    });
    expect(result.success).toBe(false);
  });
});