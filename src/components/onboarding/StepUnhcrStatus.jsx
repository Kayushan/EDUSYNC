import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Card from '../common/Card';

const StepUnhcrStatus = ({ data, updateData, onNext, onBack }) => {
  const [selected, setSelected] = useState(data.unhcrStatus);

  const handleSelect = (status) => {
    setSelected(status);
  };

  const handleContinue = () => {
    updateData({ unhcrStatus: selected });
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
          UNHCR Recognition Status 🏛️
        </h2>
        <p className="text-gray-600">
          Is your school officially recognized by UNHCR?
        </p>
      </motion.div>

      <div className="space-y-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(true)}
          className="cursor-pointer"
        >
          <Card
            className={`p-6 transition-all ${
              selected === true
                ? 'border-2 border-blue-500 bg-blue-50/50'
                : 'border border-white/20 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === true
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selected === true && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Yes, UNHCR Recognized
                </h3>
                <p className="text-sm text-gray-600">
                  My school is officially recognized by UNHCR and receives support for refugee education.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(false)}
          className="cursor-pointer"
        >
          <Card
            className={`p-6 transition-all ${
              selected === false
                ? 'border-2 border-blue-500 bg-blue-50/50'
                : 'border border-white/20 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === false
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selected === false && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No, Not Recognized
                </h3>
                <p className="text-sm text-gray-600">
                  My school is not currently recognized by UNHCR but may apply in the future.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> UNHCR recognition provides access to additional reporting features and resources for refugee education.
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
          type="button"
          variant="primary"
          onClick={handleContinue}
          disabled={selected === null}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default StepUnhcrStatus;
