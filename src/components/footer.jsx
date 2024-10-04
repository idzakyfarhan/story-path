// src/components/Footer.jsx
import React from 'react';
import instagramLogo from '../assets/instagram.png';
import linkedinLogo from '../assets/linkedin.png'; 

function Footer() {
  return (
    <footer className="flex flex-col items-center bg-zinc-50 text-center text-surface dark:bg-neutral-700 dark:text-white">
      <div className="container px-6 pt-6">
        <div className="mb-6 flex justify-center space-x-4">
          <a
            href="https://www.instagram.com/idzakyfarhan"
            className="rounded-full bg-gray-300 p-3 hover:bg-gray-400 transition duration-150 ease-in-out"
          >
            <img 
                src={instagramLogo} 
                alt="Instagram" 
                className="h-6 w-6" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/dzakyfarhan/"
            className="rounded-full bg-gray-300 p-3 hover:bg-gray-400 transition duration-150 ease-in-out"
          >
            <img 
                src={linkedinLogo} 
                alt="LinkedIn" 
                className="h-6 w-6" />
          </a>
        </div>
      </div>

      <div className="w-full bg-black/5 p-4 text-center">
        Made by Muhammad Dzaky Farhan - University of Queensland
      </div>
    </footer>
  );
}

export default Footer;
