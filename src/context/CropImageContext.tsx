import React, { createContext, useState, useContext } from 'react';

interface CropImageContextData {
  croppedImage?: string;
  setCroppedImage?: any;
}

interface ContextProps {
  children: React.ReactNode;
};

const CropImageContext = createContext<CropImageContextData>({} as CropImageContextData);

const CropImageProvider = ({ children }: ContextProps) => {
  const [croppedImage, setCroppedImage] = useState();

  return (
    <CropImageContext.Provider value={{ croppedImage, setCroppedImage }}>
      {children}
    </CropImageContext.Provider>
  );
}

function useCropImage() {
  const context = useContext(CropImageContext);
  const { croppedImage, setCroppedImage } = context;
  return { croppedImage, setCroppedImage };
}

export { CropImageProvider, useCropImage };
