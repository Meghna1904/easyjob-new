import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 
          className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors duration-200"
        >
          EasyJob
        </h1>
        {/* Optional: Add additional header elements */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            Simplifying Your Job Search
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;