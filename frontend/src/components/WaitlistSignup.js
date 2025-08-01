import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaPhone, FaGraduationCap, FaHeart, FaArrowRight, FaIdCard, FaBook } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const WaitlistSignup = ({ onClose, isVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    phone: '',
    graduation_year: '',
    major: '',
    interests: [],
    referral_source: 'website'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const interestOptions = [
    'Basketball Games',
    'Greek Life',
    'Student Organizations',
    'Campus Events',
    'Study Groups',
    'Social Activities',
    'Leadership Opportunities',
    'Community Service'
  ];

  const graduationYears = [
    { value: '', label: 'Select Graduation Year' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' }
  ];

  const majorOptions = [
    { value: '', label: 'Select Major' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Communication Studies', label: 'Communication Studies' },
    { value: 'Film and Television Production', label: 'Film and Television Production' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' },
    { value: 'Political Science', label: 'Political Science' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Theology', label: 'Theology' },
    { value: 'Art History', label: 'Art History' },
    { value: 'Studio Arts', label: 'Studio Arts' },
    { value: 'Music', label: 'Music' },
    { value: 'Theatre Arts', label: 'Theatre Arts' },
    { value: 'Journalism', label: 'Journalism' },
    { value: 'Public Relations', label: 'Public Relations' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Accounting', label: 'Accounting' },
    { value: 'International Relations', label: 'International Relations' },
    { value: 'Environmental Science', label: 'Environmental Science' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.student_id) {
      toast.error('Please fill in your name, email, and student ID');
      return;
    }

    // Validate student ID format (8 digits)
    if (!/^\d{8}$/.test(formData.student_id)) {
      toast.error('Please enter a valid 8-digit student ID');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/waitlist', formData);
      
      if (response.data.success) {
        setIsSuccess(true);
        toast.success('Welcome to the waitlist! 🦁');
        
        // Show success message for 3 seconds then close
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to join waitlist';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaHeart className="text-green-600 text-2xl" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome! 🦁</h3>
            <p className="text-gray-600 mb-4">
              You're now on the waitlist! We'll notify you as soon as the app is ready.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Your position:</strong> #{response?.data?.waitlist_position || '42'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Awesome!
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHeart className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Join the Waitlist! 🦁
              </h2>
              <p className="text-gray-600 text-sm">
                Be the first to experience the new LMU Campus LLM app
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@lmu.edu"
                  required
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaIdCard className="inline mr-2" />
                  Student ID Number *
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345678"
                  required
                  maxLength="8"
                />
                <p className="text-xs text-gray-500 mt-1">8-digit LMU student ID</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaGraduationCap className="inline mr-2" />
                  Graduation Year
                </label>
                <select
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {graduationYears.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Major */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaBook className="inline mr-2" />
                  Major
                </label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {majorOptions.map(major => (
                    <option key={major.value} value={major.value}>
                      {major.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What interests you? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map(interest => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>Join Waitlist</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WaitlistSignup;