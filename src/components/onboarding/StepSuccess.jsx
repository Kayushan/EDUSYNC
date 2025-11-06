import { motion } from 'framer-motion';
import Button from '../common/Button';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const StepSuccess = ({ schoolName, onFinish }) => {
  useEffect(() => {
    // Trigger confetti animation on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          🎉 Welcome to EduSync!
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Your school has been successfully set up
        </p>
        <p className="text-xl font-semibold text-blue-600 mb-6">
          {schoolName}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-4 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What's Next?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Explore Your Dashboard</h4>
                <p className="text-sm text-gray-600">
                  View attendance, manage students, and track reports
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <h4 className="font-semibold text-gray-900">Manage Your Team</h4>
                <p className="text-sm text-gray-600">
                  Invite teachers and administrators to your school
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <h4 className="font-semibold text-gray-900">Add Students</h4>
                <p className="text-sm text-gray-600">
                  Start building your student database
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="font-semibold text-gray-900">Try AI Assistant</h4>
                <p className="text-sm text-gray-600">
                  Get help with any questions about using EduSync
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          type="button"
          variant="primary"
          onClick={onFinish}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 text-lg font-semibold"
        >
          Go to Dashboard →
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-sm text-gray-500"
      >
        Need help getting started? Check out our{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
          Quick Start Guide
        </a>
      </motion.p>
    </div>
  );
};

export default StepSuccess;
