import React from 'react';
import { Link } from 'react-router-dom'; 

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">Welcome to StoryPath</h2>
        <p className="text-lg text-gray-600 mb-8">
          Create engaging tours, hunts, and adventures!
        </p>
        <ul className="text-gray-600 mb-8 list-disc list-inside space-y-2">
          <li>Museum Tours</li>
          <li>Campus Tours</li>
          <li>Treasure Hunts</li>
          <li>And more!</li>
        </ul>
        <Link
          to="/projects" 
          className="inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
