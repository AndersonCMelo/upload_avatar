import React from 'react';
import styles from './styles.module.scss';
import { UploadFile } from '../../components/UploadFile';

import { useCropImage } from '../../context/CropImageContext';

export const AvatarUpload: React.FC = () => {
  const { croppedImage } = useCropImage();

  console.log(croppedImage); // Imagem presente no componente pai

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Upload your avatar</h1>

        <span>PNG, JPG and SVG are allowed</span>

        <UploadFile />
      </div>
    </div>
  )
}