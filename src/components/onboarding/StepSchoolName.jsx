import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolNameSchema } from '../../utils/validators';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';

const StepSchoolName = ({ data, updateData, onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schoolNameSchema),
    defaultValues: {
      schoolName: data.schoolName,
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
          Welcome to EduSync! 🎓
        </h2>
        <p className="text-gray-600">
          Let's get your school set up. First, what's your school's name?
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
            School Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="schoolName"
            type="text"
            placeholder="e.g., Sunrise Primary School"
            {...register('schoolName')}
            error={!!errors.schoolName}
            className="w-full text-gray-900"
          />
          {errors.schoolName && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.schoolName.message}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Enter the official name of your educational institution
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 font-medium"
          >
            Continue →
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StepSchoolName;
