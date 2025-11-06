import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createSchool, 
  updateUserProfile, 
  uploadSchoolLogo,
  updateSchoolLogo,
  sendTeacherInvitations,
  completeOnboarding,
  checkOnboardingStatus
} from '../api/onboarding';
import { supabase } from '../api/supabaseClient';

// Mock Supabase client
vi.mock('../api/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}));

describe('Onboarding API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSchool', () => {
    it('creates a school successfully', async () => {
      const mockSchool = {
        id: 'school-123',
        name: 'Test School',
        address: '123 Test St',
        unhcr_status: true,
      };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSchool, error: null }),
      };

      supabase.from.mockReturnValue(mockChain);

      const result = await createSchool({
        name: 'Test School',
        address: '123 Test St',
        unhcr_status: true,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSchool);
      expect(supabase.from).toHaveBeenCalledWith('schools');
    });

    it('handles errors when creating school', async () => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        }),
      };

      supabase.from.mockReturnValue(mockChain);

      const result = await createSchool({
        name: 'Test School',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('updateUserProfile', () => {
    it('updates user profile successfully', async () => {
      const validSchoolId = '12345678-1234-5678-8abc-123456789abc';
      const mockProfile = {
        id: 'user-123',
        school_id: validSchoolId,
        role: 'principal',
        full_name: 'John Doe',
      };

      const mockChain = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      supabase.from.mockReturnValue(mockChain);

      const result = await updateUserProfile(
        'user-123',
        validSchoolId,
        'principal',
        'John Doe'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProfile);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('validates school ID format', async () => {
      const result = await updateUserProfile(
        'user-123',
        'not-a-valid-uuid',
        'principal',
        'John Doe'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid school ID format');
    });
  });

  describe('uploadSchoolLogo', () => {
    const validSchoolId = '12345678-1234-5678-8abc-123456789abc';

    it('uploads logo successfully', async () => {
      const mockFile = new File(['logo'], 'logo.png', { type: 'image/png' });
      const mockUrl = 'https://storage.example.com/logo.png';

      const mockStorage = {
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ 
          data: { publicUrl: mockUrl } 
        }),
      };

      supabase.storage.from.mockReturnValue(mockStorage);

      const result = await uploadSchoolLogo(mockFile, validSchoolId);

      expect(result.success).toBe(true);
      expect(result.url).toBe(mockUrl);
      expect(supabase.storage.from).toHaveBeenCalledWith('school-assets');
    });

    it('validates file type', async () => {
      const mockFile = new File(['content'], 'file.txt', { type: 'text/plain' });
      
      const result = await uploadSchoolLogo(mockFile, validSchoolId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid image file');
    });

    it('validates file size', async () => {
      // Create a file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { 
        type: 'image/png' 
      });
      
      const result = await uploadSchoolLogo(largeFile, validSchoolId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('File size must be less than 5MB');
    });
  });

  describe('sendTeacherInvitations', () => {
    const validSchoolId = '12345678-1234-5678-8abc-123456789abc';

    it('handles teacher invitations', async () => {
      const emails = ['teacher1@test.com', 'teacher2@test.com'];
      
      const result = await sendTeacherInvitations(
        emails,
        validSchoolId,
        'Test School'
      );

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.message).toContain('2 invitation(s)');
    });

    it('handles empty email list', async () => {
      const result = await sendTeacherInvitations([], validSchoolId, 'Test School');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('completeOnboarding', () => {
    it('completes full onboarding process', async () => {
      const validSchoolId = '12345678-1234-5678-8abc-123456789abc';
      const mockSchool = {
        id: validSchoolId,
        name: 'Test School',
      };

      const mockProfile = {
        id: 'user-123',
        school_id: validSchoolId,
        role: 'principal',
      };

      // Mock createSchool
      const schoolChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSchool, error: null }),
      };

      // Mock updateUserProfile
      const profileChain = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      supabase.from.mockImplementation((table) => {
        if (table === 'schools') return schoolChain;
        if (table === 'profiles') return profileChain;
      });

      const result = await completeOnboarding({
        user: { id: 'user-123', email: 'test@test.com' },
        schoolInfo: {
          schoolName: 'Test School',
          schoolAddress: '123 Test St',
          unhcrStatus: true,
          principalName: 'John Doe',
        },
        teacherEmails: ['teacher@test.com'],
      });

      expect(result.success).toBe(true);
      expect(result.data.school).toEqual(mockSchool);
      expect(result.data.profile).toEqual(mockProfile);
    });
  });

  describe('checkOnboardingStatus', () => {
    it('returns true when user has completed onboarding', async () => {
      const mockProfile = {
        school_id: 'school-123',
        role: 'principal',
      };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      supabase.from.mockReturnValue(mockChain);

      const result = await checkOnboardingStatus('user-123');

      expect(result.success).toBe(true);
      expect(result.hasCompletedOnboarding).toBe(true);
      expect(result.profile).toEqual(mockProfile);
    });

    it('returns false when user has not completed onboarding', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: 'PGRST116' } // Not found error
        }),
      };

      supabase.from.mockReturnValue(mockChain);

      const result = await checkOnboardingStatus('user-123');

      expect(result.success).toBe(true);
      expect(result.hasCompletedOnboarding).toBe(false);
    });
  });
});
