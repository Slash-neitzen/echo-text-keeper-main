
import React from 'react';
import { Mic } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-electric-blue" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Voice-to-Text <span className="text-electric-blue">Notes App</span>
          </h1>
        </div>
      </div>
      <div className="text-center mt-1 text-sm text-gray-500">
        Course Code: 22CSE48 | Semester IV | March–June 2025
      </div>
    </header>
  );
};

export default Header;
