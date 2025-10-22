
import React from 'react';
import { WardrobeIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex items-center space-x-3">
          <WardrobeIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Virtual Stylist
          </h1>
        </div>
      </div>
    </header>
  );
};
