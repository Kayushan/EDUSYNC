import { motion } from 'framer-motion';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import Badge from '../common/Badge';

const StepReview = ({ data, onSubmit, onBack, loading, error }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Information ✓
        </h2>
        <p className="text-gray-600">
          Please review your school details before completing the setup.
        </p>
      </motion.div>

      <div className="space-y-4 mb-6">
        {/* School Information */}
        <Card className="p-6 bg-white/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            School Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">School Name:</span>
              <span className="text-sm text-gray-900 font-semibold text-right">{data.schoolName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">Address:</span>
              <span className="text-sm text-gray-900 text-right">
                {data.schoolAddress || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">UNHCR Status:</span>
              <Badge variant={data.unhcrStatus ? 'success' : 'default'}>
                {data.unhcrStatus ? 'Recognized' : 'Not Recognized'}
              </Badge>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">School Logo:</span>
              <span className="text-sm text-gray-900">
                {data.logoFile ? '✓ Uploaded' : 'Not uploaded'}
              </span>
            </div>
          </div>
        </Card>

        {/* Logo Preview */}
        {data.logoPreview && (
          <Card className="p-6 bg-white/10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Logo Preview</h3>
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <img
                  src={data.logoPreview}
                  alt="School logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Principal Information */}
        <Card className="p-6 bg-white/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            Principal Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">Name:</span>
              <span className="text-sm text-gray-900 font-semibold text-right">{data.principalName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">Phone:</span>
              <span className="text-sm text-gray-900 text-right">
                {data.principalPhone || 'Not provided'}
              </span>
            </div>
          </div>
        </Card>

        {/* Teacher Invitations */}
        <Card className="p-6 bg-white/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Teacher Invitations
          </h3>
          {data.teacherEmails && data.teacherEmails.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                {data.teacherEmails.length} teacher(s) will be invited:
              </p>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {data.teacherEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded px-3 py-2">
                    <span className="text-blue-500">✉</span>
                    {email}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No teachers will be invited at this time. You can invite them later.
            </p>
          )}
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          <strong>Error:</strong> {error}
        </motion.div>
      )}

      {/* Confirmation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-800">
          <strong>Ready to continue?</strong> By clicking "Complete Setup", you'll create your school account and begin using EduSync.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={loading}
          className="text-gray-700"
        >
          ← Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              Setting up...
            </div>
          ) : (
            'Complete Setup ✓'
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepReview;
