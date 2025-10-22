
export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export interface Outfit {
  occasion: string;
  imageUrl: string;
  base64: string;
  mimeType: string;
  isEditing?: boolean;
}
