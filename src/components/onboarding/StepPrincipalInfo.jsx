import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { principalInfoSchema } from '../../utils/validators';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';

const StepPrincipalInfo = ({ data, updateData, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(principalInfoSchema),
    defaultValues: {
      principalName: data.principalName,
      principalPhone: data.principalPhone,
    },
  });

  const onSubmit = (formData) => {
    updateData(formData);
    onNext();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Contact Information 👤
        </h2>
        <p className="text-gray-600">
          Help us know how to reach you as the school principal.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="principalName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="principalName"
            type="text"
            placeholder="e.g., Dr. Jane Smith"
            {...register('principalName')}
            error={!!errors.principalName}
            className="w-full text-gray-900"
          />
          {errors.principalName && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.principalName.message}
            </motion.p>
          )}
        </div>

        <div>
          <label htmlFor="principalPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            id="principalPhone"
            type="tel"
            placeholder="e.g., +1 234 567 8900"
            {...register('principalPhone')}
            error={!!errors.principalPhone}
            className="w-full text-gray-900"
          />
          {errors.principalPhone && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.principalPhone.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Optional - for important notifications and account recovery
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Privacy:</strong> Your contact information is private and will only be used for account management and important notifications.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="text-gray-700"
          >
            ← Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
          >
            Continue →
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StepPrincipalInfo;
