
import React from 'react';
import type { Outfit } from '../types';
import { OutfitCard } from './OutfitCard';

interface OutfitDisplayProps {
  outfits: Outfit[];
  onEdit: (index: number, prompt: string) => void;
}

export const OutfitDisplay: React.FC<OutfitDisplayProps> = ({ outfits, onEdit }) => {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Your Styled Outfits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {outfits.map((outfit, index) => (
          <OutfitCard
            key={outfit.occasion}
            outfit={outfit}
            onEdit={(prompt) => onEdit(index, prompt)}
          />
        ))}
      </div>
    </div>
  );
};
