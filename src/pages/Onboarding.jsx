import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useSchool } from '../hooks/useSchool';
import { completeOnboarding } from '../api/onboarding';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

// Import step components
import StepSchoolName from '../components/onboarding/StepSchoolName';
import StepSchoolAddress from '../components/onboarding/StepSchoolAddress';
import StepUnhcrStatus from '../components/onboarding/StepUnhcrStatus';
import StepSchoolLogo from '../components/onboarding/StepSchoolLogo';
import StepPrincipalInfo from '../components/onboarding/StepPrincipalInfo';
import StepInviteTeachers from '../components/onboarding/StepInviteTeachers';
import StepReview from '../components/onboarding/StepReview';
import StepSuccess from '../components/onboarding/StepSuccess';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { setSchool, refetch } = useSchool();
  const navigate = useNavigate();

  // Store all form data
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolAddress: '',
    unhcrStatus: false,
    logoFile: null,
    logoPreview: null,
    principalName: '',
    principalPhone: '',
    teacherEmails: [],
  });

  const totalSteps = 8;

  // Update form data
  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1 && currentStep < 8) { // Can't go back from success screen
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  };

  // Handle onboarding completion
  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await completeOnboarding({
        user,
        schoolInfo: {
          schoolName: formData.schoolName,
          schoolAddress: formData.schoolAddress,
          unhcrStatus: formData.unhcrStatus,
          logoFile: formData.logoFile,
          principalName: formData.principalName,
          principalPhone: formData.principalPhone,
        },
        teacherEmails: formData.teacherEmails,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update school context
      setSchool(result.data.school);
      await refetch();

      // Move to success screen
      nextStep();
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle finish and navigate to dashboard
  const handleFinish = () => {
    navigate('/');
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepSchoolName
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepSchoolAddress
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <StepUnhcrStatus
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <StepSchoolLogo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <StepPrincipalInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <StepInviteTeachers
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <StepReview
            data={formData}
            onSubmit={handleComplete}
            onBack={prevStep}
            loading={loading}
            error={error}
          />
        );
      case 8:
        return (
          <StepSuccess
            schoolName={formData.schoolName}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  // Progress bar calculation
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {currentStep < 8 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              {renderStep()}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Help Text */}
        {currentStep < 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-gray-600">
              Need help? Contact support at{' '}
              <a href="mailto:support@edusync.com" className="text-blue-600 hover:text-blue-700">
                support@edusync.com
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
