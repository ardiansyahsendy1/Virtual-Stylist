
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { OutfitDisplay } from './components/OutfitDisplay';
import { Loader } from './components/Loader';
import type { Outfit, UploadedImage } from './types';
import { generateOutfits, editOutfitImage } from './services/geminiService';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage({
        base64: (reader.result as string).split(',')[1],
        mimeType: file.type,
      });
      setOutfits([]);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateOutfits = useCallback(async () => {
    if (!uploadedImage) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutfits([]);
    try {
      const generated = await generateOutfits(uploadedImage.base64, uploadedImage.mimeType);
      setOutfits(generated);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't generate outfits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  const handleEditOutfit = async (outfitIndex: number, prompt: string) => {
    const originalOutfit = outfits[outfitIndex];
    if (!originalOutfit || !prompt) {
      setError("Cannot edit outfit without an image and a prompt.");
      return;
    }

    const tempOutfits = [...outfits];
    tempOutfits[outfitIndex] = { ...tempOutfits[outfitIndex], isEditing: true };
    setOutfits(tempOutfits);
    setError(null);
    
    try {
      const editedImageUrl = await editOutfitImage(originalOutfit.base64, originalOutfit.mimeType, prompt);
      const newOutfits = [...outfits];
      newOutfits[outfitIndex] = {
        ...originalOutfit,
        imageUrl: `data:${originalOutfit.mimeType};base64,${editedImageUrl}`,
        base64: editedImageUrl,
        isEditing: false,
      };
      setOutfits(newOutfits);
    } catch (e) {
      console.error(e);
      setError("Failed to edit the image. Please try again.");
      const resetOutfits = [...outfits];
      resetOutfits[outfitIndex] = { ...resetOutfits[outfitIndex], isEditing: false };
      setOutfits(resetOutfits);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-600 mb-2">
            Never wonder what to wear again.
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Upload a photo of a single clothing item. Our AI stylist will create three complete outfits for you and visualize them in a clean flat-lay style.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <ImageUploader onImageUpload={handleImageUpload} />
          {uploadedImage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGenerateOutfits}
                disabled={isLoading}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? 'Styling...' : 'Generate Outfits'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center my-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && <Loader />}
        
        {!isLoading && outfits.length > 0 && (
          <OutfitDisplay outfits={outfits} onEdit={handleEditOutfit} />
        )}
      </main>
      <footer className="text-center py-6 text-sm text-gray-400">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
