import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolAddressSchema } from '../../utils/validators';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';

const StepSchoolAddress = ({ data, updateData, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schoolAddressSchema),
    defaultValues: {
      schoolAddress: data.schoolAddress,
    },
  });

  const onSubmit = (formData) => {
    updateData(formData);
    onNext();
  };

  const handleSkip = () => {
    updateData({ schoolAddress: '' });
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
          Where is your school located? 📍
        </h2>
        <p className="text-gray-600">
          This helps us understand your school's geographic context. (Optional)
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 mb-2">
            School Address
          </label>
          <textarea
            id="schoolAddress"
            rows="3"
            placeholder="e.g., 123 Education Street, City, Country"
            {...register('schoolAddress')}
            className={`w-full px-3 py-2 rounded-md border transition-shadow focus:outline-none text-gray-900 ${
              errors.schoolAddress
                ? 'border-red-400 bg-red-500/5 focus:ring-2 focus:ring-red-300'
                : 'border-white/20 bg-white/3 focus:ring-2 focus:ring-white/10'
            }`}
          />
          {errors.schoolAddress && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.schoolAddress.message}
            </motion.p>
          )}
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
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
              className="text-gray-700"
            >
              Skip
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
            >
              Continue →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StepSchoolAddress;
