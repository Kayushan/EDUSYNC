import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';

const StepInviteTeachers = ({ data, updateData, onNext, onBack }) => {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState(data.teacherEmails || []);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setError('This email has already been added');
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setEmailInput('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleContinue = () => {
    updateData({ teacherEmails: emails });
    onNext();
  };

  const handleSkip = () => {
    updateData({ teacherEmails: [] });
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
          Invite Your Teachers 👥
        </h2>
        <p className="text-gray-600">
          Add teacher email addresses to send them invitations to join your school. (Optional)
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Teacher Email Address
          </label>
          <div className="flex gap-2">
            <Input
              id="teacherEmail"
              type="email"
              placeholder="teacher@example.com"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              error={!!error}
              className="flex-1 text-gray-900"
            />
            <Button
              type="button"
              variant="primary"
              onClick={handleAddEmail}
              className="bg-blue-500 text-white px-6"
            >
              Add
            </Button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Press Enter or click Add to include the email
          </p>
        </div>

        {/* Email List */}
        {emails.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Teachers to Invite ({emails.length})
              </h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence>
                {emails.map((email, index) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {email[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Invited teachers will receive an email with instructions to create their account and join your school.
            You can always invite more teachers later from the dashboard.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="text-gray-700"
        >
          ← Back
        </Button>
        <div className="flex gap-3">
          {emails.length === 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
              className="text-gray-700"
            >
              Skip
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepInviteTeachers;
