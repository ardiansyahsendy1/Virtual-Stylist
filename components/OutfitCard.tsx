
import React, { useState } from 'react';
import type { Outfit } from '../types';
import { EditIcon } from './IconComponents';
import { Loader } from './Loader';

interface OutfitCardProps {
  outfit: Outfit;
  onEdit: (prompt: string) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onEdit }) => {
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onEdit(editPrompt);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1">
      <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-100">
        {outfit.isEditing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                <Loader />
            </div>
        ) : null}
        <img
          src={outfit.imageUrl}
          alt={`${outfit.occasion} outfit`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-lg font-semibold text-gray-800">{outfit.occasion}</h4>
        <div className="mt-4 flex-grow">
          <form onSubmit={handleEditSubmit}>
            <label htmlFor={`edit-prompt-${outfit.occasion}`} className="sr-only">Edit this outfit</label>
            <div className="relative">
              <input
                id={`edit-prompt-${outfit.occasion}`}
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g., 'Add a retro filter'"
                disabled={outfit.isEditing}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={outfit.isEditing || !editPrompt.trim()}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <EditIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
