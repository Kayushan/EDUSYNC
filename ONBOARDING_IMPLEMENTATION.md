# Onboarding Wizard Implementation

## Overview
The multi-step onboarding wizard has been implemented for new principals to set up their school accounts in EduSync. This wizard guides users through 8 steps to collect all necessary school information.

## Features Implemented

### 1. Multi-Step Wizard Flow
- **Step 1: School Name** - Required field for the institution name
- **Step 2: School Address** - Optional field for physical location
- **Step 3: UNHCR Recognition** - Binary choice for UNHCR status
- **Step 4: School Logo** - Optional logo upload with preview
- **Step 5: Principal Information** - Contact details for the principal
- **Step 6: Invite Teachers** - Optional teacher email invitations
- **Step 7: Review** - Summary of all entered information
- **Step 8: Success** - Completion screen with confetti animation

### 2. Components Created

#### Main Component
- `/src/pages/Onboarding.jsx` - Main orchestrator for the wizard flow

#### Step Components (in `/src/components/onboarding/`)
- `StepSchoolName.jsx` - School name input with validation
- `StepSchoolAddress.jsx` - Address input (optional, with skip)
- `StepUnhcrStatus.jsx` - UNHCR recognition selection
- `StepSchoolLogo.jsx` - Logo upload with file validation
- `StepPrincipalInfo.jsx` - Principal contact information
- `StepInviteTeachers.jsx` - Teacher email management
- `StepReview.jsx` - Review all information before submission
- `StepSuccess.jsx` - Success screen with confetti

### 3. API Functions (in `/src/api/onboarding.js`)
- `createSchool()` - Creates school record in database
- `updateUserProfile()` - Links user to school with principal role
- `uploadSchoolLogo()` - Uploads logo to Supabase Storage
- `updateSchoolLogo()` - Updates school logo URL
- `sendTeacherInvitations()` - Sends invitation emails to teachers
- `completeOnboarding()` - Orchestrates the complete onboarding process
- `checkOnboardingStatus()` - Checks if user has completed onboarding

### 4. Validation Schemas (in `/src/utils/validators.js`)
- `schoolNameSchema` - School name validation (3-100 characters)
- `schoolAddressSchema` - Address validation (max 200 characters)
- `unhcrStatusSchema` - Boolean validation
- `principalInfoSchema` - Principal details with phone regex
- `teacherEmailsSchema` - Array of email addresses

### 5. Database Setup
- Migration file: `/supabase/migrations/0001_storage_school_assets.sql`
- Creates `school-assets` storage bucket for logos
- Sets up RLS policies for secure file access

## Features

### Client-Side Validation
- All inputs validated using Zod schemas
- Real-time error feedback
- Required field indicators
- File type and size validation for logos

### Progress Tracking
- Visual progress bar showing completion percentage
- Step counter (Step X of 8)
- Animated transitions between steps

### Navigation
- Forward navigation with validation
- Back button to return to previous steps
- Skip options for optional fields
- Cannot go back from success screen

### Error Handling
- API error display on review step
- Graceful fallback for failed operations
- User-friendly error messages

### Loading States
- Loading spinner during API calls
- Disabled buttons during submission
- Visual feedback for async operations

### File Upload
- Drag-and-drop support for logo upload
- Image preview before submission
- File type validation (JPEG, PNG, GIF, WebP)
- File size limit (5MB)
- Remove uploaded file option

### Teacher Invitations
- Add multiple teacher emails
- Email validation
- Remove individual emails
- Visual email list with avatars
- Press Enter to add email

### Success Celebration
- Confetti animation on completion
- Success screen with next steps
- Direct navigation to dashboard

## Integration

### Routing
The onboarding route is protected and requires authentication:
```jsx
<Route path="/onboarding" element={
  <ProtectedRoute>
    <PublicLayout>
      <Onboarding />
    </PublicLayout>
  </ProtectedRoute>
} />
```

### Automatic Redirection
- New registrations redirect to `/onboarding`
- Protected routes check onboarding status
- Users without completed onboarding are redirected automatically

### ProtectedRoute Enhancement
The `ProtectedRoute` component now:
1. Checks authentication status
2. Verifies onboarding completion
3. Redirects to `/onboarding` if incomplete
4. Allows access to dashboard only after completion

## UI/UX Design

### Glassmorphism
All components use the Glassmorphism design language:
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows

### Animations
Using Framer Motion for smooth transitions:
- Page transitions between steps
- Progress bar animation
- Success screen animations
- Confetti celebration

### Mobile-First
- Responsive design for all screen sizes
- Touch-friendly tap targets
- Optimized layouts for mobile devices

### Accessibility
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management

## Testing

### Unit Tests
- API function tests in `/src/test/onboardingApi.test.js`
- Tests for all CRUD operations
- Validation testing
- Error handling verification

### Integration Tests
- Full wizard flow test in `/src/test/Onboarding.test.jsx`
- Step navigation testing
- Form validation testing
- API integration testing
- Error scenario testing

## Dependencies Added
- `canvas-confetti` - For success screen celebration animation

## Security

### Input Validation
- All inputs sanitized before submission
- UUID validation for IDs
- Email validation for teacher invitations
- File type and size validation

### Row-Level Security
- Storage bucket policies restrict access
- Only authenticated users can upload
- Public read access for school logos

### Data Filtering
- All queries filtered by school_id
- Role-based access control enforced
- Profile updates restricted to owner

## Future Enhancements

### Potential Improvements
1. **Email Verification** - Verify principal email before onboarding
2. **SMS Verification** - Optional phone number verification
3. **Actual Email Sending** - Implement Supabase Edge Function for teacher invitations
4. **Logo Cropping** - Allow users to crop uploaded logos
5. **Templates** - Pre-fill data for demo schools
6. **Progress Saving** - Save progress and resume later
7. **Multi-language Support** - Internationalization for different regions
8. **Tooltips** - Contextual help throughout the wizard
9. **Video Tutorial** - Embedded video guide
10. **Analytics** - Track wizard completion rates and drop-off points

### Known Limitations
1. Teacher invitations are logged but not actually sent (requires Edge Function)
2. No email verification before onboarding
3. No draft/progress saving (all or nothing submission)
4. Logo editing/cropping not available

## Usage

### For New Principals
1. Register for an account at `/register`
2. Verify email (if email verification is enabled)
3. Automatically redirected to `/onboarding`
4. Complete all 8 steps
5. Review information
6. Submit to create school
7. Navigate to dashboard

### For Developers
```javascript
// Check onboarding status
import { checkOnboardingStatus } from './api/onboarding';
const status = await checkOnboardingStatus(userId);

// Complete onboarding programmatically
import { completeOnboarding } from './api/onboarding';
const result = await completeOnboarding({
  user,
  schoolInfo: { /* school data */ },
  teacherEmails: ['teacher@example.com']
});
```

## Troubleshooting

### Common Issues

**Issue**: User stuck in onboarding loop
**Solution**: Check `profiles` table for `school_id` - may need manual update

**Issue**: Logo upload fails
**Solution**: Verify storage bucket exists and policies are correct

**Issue**: Teacher invitations not sent
**Solution**: This is expected - Edge Function not yet implemented

**Issue**: Progress bar not updating
**Solution**: Check step calculation in `Onboarding.jsx`

## File Structure
```
src/
├── api/
│   └── onboarding.js (API functions)
├── components/
│   ├── common/
│   │   ├── Badge.jsx (updated with new variants)
│   │   └── ProtectedRoute.jsx (updated with onboarding check)
│   └── onboarding/
│       ├── StepSchoolName.jsx
│       ├── StepSchoolAddress.jsx
│       ├── StepUnhcrStatus.jsx
│       ├── StepSchoolLogo.jsx
│       ├── StepPrincipalInfo.jsx
│       ├── StepInviteTeachers.jsx
│       ├── StepReview.jsx
│       └── StepSuccess.jsx
├── pages/
│   ├── Onboarding.jsx (main wizard)
│   └── Register.jsx (updated to redirect)
├── test/
│   ├── Onboarding.test.jsx
│   └── onboardingApi.test.js
└── utils/
    └── validators.js (updated with onboarding schemas)

supabase/
└── migrations/
    └── 0001_storage_school_assets.sql
```

## Conclusion
The onboarding wizard provides a smooth, intuitive experience for new principals to set up their schools. The implementation follows best practices for validation, error handling, accessibility, and user experience.
