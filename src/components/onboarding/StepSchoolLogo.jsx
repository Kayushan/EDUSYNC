import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const StepSchoolLogo = ({ data, updateData, onNext, onBack }) => {
  const [preview, setPreview] = useState(data.logoPreview);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        updateData({ 
          logoFile: file,
          logoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    updateData({ 
      logoFile: null,
      logoPreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSkip = () => {
    updateData({ 
      logoFile: null,
      logoPreview: null,
    });
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
          Add Your School Logo 🎨
        </h2>
        <p className="text-gray-600">
          Upload your school's logo to personalize your account. (Optional)
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div className="flex flex-col items-center">
          {preview ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={preview}
                  alt="School logo preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                ✕
              </button>
            </motion.div>
          ) : (
            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-md h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-50/50"
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF or WebP (max 5MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.label>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Tips:</strong>
          </p>
          <ul className="mt-2 text-xs text-gray-600 space-y-1">
            <li>• Use a square image for best results</li>
            <li>• Recommended size: 512x512 pixels or larger</li>
            <li>• Make sure the logo is clear and recognizable</li>
          </ul>
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
          <Button
            type="button"
            variant="secondary"
            onClick={handleSkip}
            className="text-gray-700"
          >
            Skip
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onNext}
            disabled={!preview}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepSchoolLogo;
