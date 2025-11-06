import { supabase } from './supabaseClient';
import { validateSchoolId } from '../utils/validators';

/**
 * Creates a new school in the database
 * @param {Object} schoolData - The school information
 * @returns {Promise<Object>} The created school
 */
export const createSchool = async (schoolData) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([{
        name: schoolData.name,
        address: schoolData.address || null,
        unhcr_status: schoolData.unhcr_status || false,
        logo_url: schoolData.logo_url || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating school:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Updates user profile with school association and role
 * @param {string} userId - The user's ID
 * @param {string} schoolId - The school's ID
 * @param {string} role - The user's role
 * @param {string} fullName - The user's full name
 * @returns {Promise<Object>} The updated profile
 */
export const updateUserProfile = async (userId, schoolId, role, fullName) => {
  try {
    validateSchoolId(schoolId);

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        school_id: schoolId,
        role: role,
        full_name: fullName,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Uploads school logo to Supabase Storage
 * @param {File} file - The logo file
 * @param {string} schoolId - The school's ID
 * @returns {Promise<Object>} The uploaded file URL
 */
export const uploadSchoolLogo = async (file, schoolId) => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    validateSchoolId(schoolId);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${schoolId}-${Date.now()}.${fileExt}`;
    const filePath = `school-logos/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('school-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('school-assets')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Updates school logo URL in the database
 * @param {string} schoolId - The school's ID
 * @param {string} logoUrl - The logo URL
 * @returns {Promise<Object>} The updated school
 */
export const updateSchoolLogo = async (schoolId, logoUrl) => {
  try {
    validateSchoolId(schoolId);

    const { data, error } = await supabase
      .from('schools')
      .update({ logo_url: logoUrl })
      .eq('id', schoolId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating school logo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sends teacher invitation emails
 * @param {Array<string>} emails - Array of teacher email addresses
 * @param {string} schoolId - The school's ID
 * @param {string} schoolName - The school's name
 * @returns {Promise<Object>} Invitation results
 */
export const sendTeacherInvitations = async (emails, schoolId, schoolName) => {
  try {
    if (!emails || emails.length === 0) {
      return { success: true, data: [] };
    }

    validateSchoolId(schoolId);

    // In a production environment, this would call a Supabase Edge Function
    // to send actual emails. For now, we'll just log the invitations.
    // The actual invitation logic would be implemented in a Supabase Function.
    
    // TODO: Implement actual email sending via Supabase Edge Function
    const invitations = emails.map(email => ({
      email,
      school_id: schoolId,
      school_name: schoolName,
      status: 'pending',
      sent_at: new Date().toISOString(),
    }));

    console.log('Teacher invitations to be sent:', invitations);

    return { 
      success: true, 
      data: invitations,
      message: `${emails.length} invitation(s) will be sent to teachers.`
    };
  } catch (error) {
    console.error('Error sending invitations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Complete onboarding process
 * @param {Object} onboardingData - All onboarding data
 * @returns {Promise<Object>} Complete onboarding result
 */
export const completeOnboarding = async (onboardingData) => {
  try {
    const { user, schoolInfo, teacherEmails } = onboardingData;

    // Step 1: Create school
    const schoolResult = await createSchool({
      name: schoolInfo.schoolName,
      address: schoolInfo.schoolAddress,
      unhcr_status: schoolInfo.unhcrStatus,
    });

    if (!schoolResult.success) {
      throw new Error(schoolResult.error);
    }

    const school = schoolResult.data;

    // Step 2: Upload logo if provided
    if (schoolInfo.logoFile) {
      const logoResult = await uploadSchoolLogo(schoolInfo.logoFile, school.id);
      if (logoResult.success) {
        await updateSchoolLogo(school.id, logoResult.url);
      }
    }

    // Step 3: Update user profile
    const profileResult = await updateUserProfile(
      user.id,
      school.id,
      'principal',
      schoolInfo.principalName || user.email.split('@')[0]
    );

    if (!profileResult.success) {
      throw new Error(profileResult.error);
    }

    // Step 4: Send teacher invitations
    if (teacherEmails && teacherEmails.length > 0) {
      await sendTeacherInvitations(teacherEmails, school.id, school.name);
    }

    return {
      success: true,
      data: {
        school,
        profile: profileResult.data,
      },
    };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if user has completed onboarding
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} Onboarding status
 */
export const checkOnboardingStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('school_id, role')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }

    return {
      success: true,
      hasCompletedOnboarding: !!data?.school_id,
      profile: data,
    };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return {
      success: false,
      error: error.message,
      hasCompletedOnboarding: false,
    };
  }
};
