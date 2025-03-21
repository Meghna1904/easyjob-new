import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Solid white background, remove gradient */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Animated shapes (optional, can be adjusted or removed) */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40 animate-pulse" />
      </div>

      <div className="container mx-auto px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
              Find Your <span className="text-blue-600">Perfect Job Match</span> With AI Precision
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Upload your resume and let our intelligent matching system find the ideal job opportunities that align with your skills and experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/upload-resume"
                className="button-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Upload Resume
              </Link>
              <Link
                to="#how-it-works"
                className="button-secondary text-blue-400 hover:text-blue-300 px-6 py-3 rounded-md font-medium transition-colors duration-200"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

     
    </div>
  );
}

export default Hero; // Change to default export