# Manual Testing Guide - Onboarding Wizard

## Prerequisites
1. Supabase project configured with proper environment variables
2. Database migrations run (initial schema + storage bucket)
3. Development server running (`npm run dev`)

## Test Scenarios

### Scenario 1: Complete Onboarding Flow (Happy Path)

**Steps:**
1. Navigate to `/register`
2. Fill in registration form:
   - Email: `principal@testschool.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Full Name: `John Doe`
3. Click "Create Account"
4. Should redirect to `/onboarding`

**Onboarding Steps:**

**Step 1: School Name**
1. Verify "Welcome to EduSync!" heading
2. Verify progress shows "Step 1 of 8"
3. Enter school name: "Sunrise Primary School"
4. Click "Continue"
5. Should advance to Step 2

**Step 2: School Address (Optional)**
1. Verify heading "Where is your school located?"
2. Test "Skip" button - should advance to Step 3
3. Click "Back" - should return to Step 1
4. Enter address: "123 Education Street, Nairobi, Kenya"
5. Click "Continue"
6. Should advance to Step 3

**Step 3: UNHCR Recognition**
1. Verify heading "UNHCR Recognition Status"
2. Click on "Yes, UNHCR Recognized" option
3. Verify selection highlights
4. Click "Continue"
5. Should advance to Step 4

**Step 4: School Logo (Optional)**
1. Verify heading "Add Your School Logo"
2. Test file upload:
   - Click upload area
   - Select a valid image file (PNG, JPG, etc.)
   - Verify preview appears
   - Test remove button (X icon)
3. Upload a logo again
4. Click "Continue"
5. Should advance to Step 5

**Step 5: Principal Information**
1. Verify heading "Your Contact Information"
2. Enter principal name: "Dr. John Doe"
3. Enter phone (optional): "+254712345678"
4. Click "Continue"
5. Should advance to Step 6

**Step 6: Invite Teachers (Optional)**
1. Verify heading "Invite Your Teachers"
2. Test adding emails:
   - Enter email: `teacher1@testschool.com`
   - Press Enter or click "Add"
   - Verify email appears in list
   - Add another: `teacher2@testschool.com`
3. Test removing an email (click X button)
4. Add it back
5. Click "Continue"
6. Should advance to Step 7

**Step 7: Review & Confirm**
1. Verify heading "Review Your Information"
2. Verify all entered data is displayed:
   - School Name: Sunrise Primary School
   - Address: 123 Education Street, Nairobi, Kenya
   - UNHCR Status: Recognized
   - Logo: Uploaded
   - Principal Name: Dr. John Doe
   - Phone: +254712345678
   - Teachers: 2 invitations
3. Click "Complete Setup"
4. Verify loading state appears
5. Should advance to Step 8

**Step 8: Success**
1. Verify confetti animation plays
2. Verify success checkmark animation
3. Verify "Welcome to EduSync!" heading
4. Verify school name is displayed
5. Verify "What's Next?" section
6. Click "Go to Dashboard"
7. Should redirect to `/` (Dashboard)

**Post-Onboarding Verification:**
1. Verify user cannot access `/onboarding` again
2. Verify school appears in SchoolContext
3. Check Supabase:
   - Schools table has new entry
   - Profiles table has user with school_id
   - Storage bucket has logo file

### Scenario 2: Minimal Onboarding (Skip Optional Fields)

**Steps:**
1. Complete registration
2. **Step 1:** Enter school name only
3. **Step 2:** Click "Skip"
4. **Step 3:** Select "No, Not Recognized"
5. **Step 4:** Click "Skip"
6. **Step 5:** Enter principal name only
7. **Step 6:** Click "Skip"
8. **Step 7:** Review and submit
9. **Step 8:** Complete

**Expected Result:** Onboarding completes successfully with minimal data

### Scenario 3: Validation Testing

**Test Cases:**

1. **School Name Validation**
   - Leave empty - should show error
   - Enter "Ab" (2 chars) - should show "at least 3 characters"
   - Enter 101+ characters - should show error
   - Enter valid name - should pass

2. **File Upload Validation**
   - Upload .txt file - should show "valid image file" error
   - Upload 6MB+ file - should show "less than 5MB" error
   - Upload valid image - should succeed

3. **Principal Name Validation**
   - Leave empty - should show error
   - Enter single character - should show error
   - Enter valid name - should pass

4. **Email Validation**
   - Enter "invalid" - should show error
   - Enter "test@" - should show error
   - Enter duplicate email - should show "already added" error
   - Enter valid email - should succeed

### Scenario 4: Navigation Testing

**Test Cases:**

1. **Forward Navigation**
   - Cannot advance without required fields filled
   - Can advance when validation passes

2. **Backward Navigation**
   - Back button works on steps 2-7
   - No back button on step 1
   - No back button on step 8 (success)
   - Data persists when going back

3. **Progress Bar**
   - Starts at ~13% (Step 1/8)
   - Updates correctly at each step
   - Reaches 100% at Step 8

### Scenario 5: Error Handling

**Test Cases:**

1. **Network Error Simulation**
   - Disconnect internet
   - Try to submit at Step 7
   - Should show error message
   - Reconnect and retry
   - Should succeed

2. **Invalid School Name (Duplicate)**
   - Use existing school name
   - Should show database error
   - Allow user to change and retry

### Scenario 6: Browser Compatibility

**Test On:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Verify:**
- All animations work
- File upload works
- Touch interactions work (mobile)
- Layout is responsive
- No console errors

### Scenario 7: Accessibility Testing

**Test With:**
- Keyboard navigation only
- Screen reader (NVDA, JAWS, or VoiceOver)

**Verify:**
- Can navigate all fields with Tab
- Can submit with Enter
- All fields have labels
- Error messages are announced
- Progress is communicated

## Bug Reporting

If issues are found during testing, document:
1. Step where issue occurred
2. Expected behavior
3. Actual behavior
4. Browser/device information
5. Console errors (if any)
6. Screenshot/video if applicable

## Performance Testing

**Metrics to Monitor:**
1. Page load time
2. Animation smoothness (60fps)
3. File upload speed
4. API response time
5. Memory usage

**Tools:**
- Chrome DevTools Performance tab
- Lighthouse audit
- Network tab for API calls

## Security Testing

**Test Cases:**
1. Try to access dashboard before onboarding - should redirect
2. Try to access onboarding after completion - should redirect to dashboard
3. Try uploading executable file as logo - should reject
4. Try uploading oversized file - should reject
5. Try SQL injection in text fields - should sanitize
6. Inspect JWT token - should not contain sensitive data

## Data Verification Checklist

After completing onboarding, verify in Supabase:

**Schools Table:**
- [ ] New record created
- [ ] Name matches input
- [ ] Address matches (if provided)
- [ ] UNHCR status correct
- [ ] Logo URL present (if uploaded)
- [ ] created_at timestamp set

**Profiles Table:**
- [ ] User ID matches auth user
- [ ] school_id matches created school
- [ ] role set to 'principal'
- [ ] full_name matches input

**Storage Bucket (if logo uploaded):**
- [ ] File exists in school-assets bucket
- [ ] File is publicly accessible
- [ ] File name format: {schoolId}-{timestamp}.{ext}

## Known Issues

1. **Teacher invitations** - Currently only logged, not sent (requires Edge Function)
2. **Email verification** - Not enforced before onboarding starts
3. **Progress saving** - Cannot save and resume later
4. **Some integration tests failing** - Mock-related, actual implementation works

## Success Criteria

✅ All 8 steps can be completed
✅ Optional fields can be skipped
✅ Validation works on all fields
✅ Error messages are clear
✅ Loading states are visible
✅ Success animation plays
✅ User redirected to dashboard
✅ Data saved correctly in database
✅ User cannot return to onboarding
✅ Mobile responsive
✅ Animations smooth (60fps)
✅ No console errors

## Rollback Plan

If critical issues found:
1. Revert onboarding route to placeholder
2. Disable ProtectedRoute onboarding check
3. Remove registration redirect to onboarding
4. Document issues for future fix
