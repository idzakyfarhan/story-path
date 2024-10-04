import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ projects }) => {
  return (
    <nav className="navbar bg-white shadow-md bg-purple-600 py-4 w-full">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Brand Logo or Name */}
        <Link to="/" className="text-2xl text-white font-semibold">
          Story Path
        </Link>
        
        {/* Navigation Links */}
        <div className="space-x-6">
          {/* Link to Home Page */}
          <Link to="/" className="text-lg text-white font-medium hover:text-gray-200 transition duration-300">
            Home
          </Link>
          
          {/* Link to Project List Page */}
          <Link to="/projects" className="text-lg text-white font-medium hover:text-gray-200 transition duration-300">
            Projects
          </Link>

          {/* Link to All Locations Page */}
          <Link to="/all-locations" className="text-lg text-white font-medium hover:text-gray-200 transition duration-300">
            All Locations
          </Link>

          {/* Conditionally render Review link if projects exist */}
          {projects.length > 0 && (
            <Link to={`/review/${projects[0].id}`} className="text-lg text-white font-medium hover:text-gray-200 transition duration-300">
              Review
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
