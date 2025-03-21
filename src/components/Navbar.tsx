import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo/Name */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors duration-200">
              EasyJob
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <a
              href="/"
              className="text-blue-600 font-medium px-3 py-2 rounded-md text-sm border-b-2 border-blue-600 transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="/jobs"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Jobs
            </a>
            <a
              href="/skills"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Skills
            </a>
            <a
              href="/about"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              About
            </a>
          </div>

          {/* Analyze Resume Button */}
          <div className="flex items-center">
            <button
              className="text-gray-900 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Analyze Resume
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;