
import { GoogleGenAI, Modality } from "@google/genai";
import type { Outfit } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image';

const getBasePrompt = (occasion: string) => `You are a world-class virtual fashion stylist. Your task is to analyze the provided clothing item. Based on this single item, create a complete, stylish, and cohesive '${occasion}' outfit.

Generate a photorealistic, clean, minimalist flat-lay photograph of the complete outfit. The background must be a neutral, solid light grey. The original clothing item must be clearly and accurately featured as part of the new outfit.`;

const occasions = ['Casual', 'Business', 'Night Out'];

export const generateOutfits = async (base64Image: string, mimeType: string): Promise<Outfit[]> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const generationPromises = occasions.map(async (occasion) => {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { text: getBasePrompt(occasion) },
            imagePart,
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const firstPart = response.candidates?.[0]?.content?.parts?.[0];
      if (firstPart?.inlineData) {
        const generatedBase64 = firstPart.inlineData.data;
        const generatedMimeType = firstPart.inlineData.mimeType;
        return {
          occasion,
          imageUrl: `data:${generatedMimeType};base64,${generatedBase64}`,
          base64: generatedBase64,
          mimeType: generatedMimeType,
        };
      }
      throw new Error(`No image data returned for ${occasion} occasion.`);
    } catch (error) {
      console.error(`Failed to generate outfit for ${occasion}:`, error);
      throw error;
    }
  });

  return Promise.all(generationPromises);
};

export const editOutfitImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart?.inlineData?.data) {
      return firstPart.inlineData.data;
    }
    throw new Error("No image data returned from the edit request.");
  } catch (error) {
    console.error('Failed to edit image:', error);
    throw error;
  }
};
