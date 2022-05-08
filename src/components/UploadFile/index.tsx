import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import { FiX } from 'react-icons/fi';
import { Slider } from '@mui/material';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';
import { getCroppedImg } from './cropImage';

import styles from './styles.module.scss';

import mediaIcon from '../../assets/media.svg';
import errorImage from '../../assets/image_error.png';

import { useCropImage } from '../../context/CropImageContext';

interface FileProps {
  id: string;
  name: string;
  readableSize: string;
  uploaded?: boolean;
  preview: string;
  file: File | null;
  progress?: number;
  error?: boolean;
  url?: string;
}

export const UploadFile = () => {
  const { croppedImage, setCroppedImage } = useCropImage();

  const [uploadedAvatar, setUploadedAvatar] = useState<FileProps[]>([]);
  const [statusUpload, setStatusUpload] = useState({
    uploaded: false,
    error: false,
    saved: false,
  });

  const onDrop = useCallback((files: File[]) => {
    setUploadedAvatar([]);

    const uploadFile: FileProps[] = files.map((file: File) => ({
      file: file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
    }));

    setUploadedAvatar((state) => state.concat(uploadFile));
    setStatusUpload({
      uploaded: true,
      error: false,
      saved: false
    })
  }, [])

  const {getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept} = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.svg'] },
    onDrop
  })

  function onDragMessage() {
    if (isDragAccept) {
      return <p>Drop your file here</p>
    }
    if (isDragReject) {
      return <p>Unsupported file type</p>
    }
  }

  function resetUpload() {
    setUploadedAvatar([]);
    
    setStatusUpload({
      uploaded: false,
      error: false,
      saved: false
    });
  }

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  // const [croppedImage, setCroppedImage] = useState<any>(null);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const saveCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        uploadedAvatar[0].preview,
        croppedAreaPixels,
        // rotation
      )
      setCroppedImage(croppedImage);
      setStatusUpload({
        uploaded: false,
        error: false,
        saved: true,
      })
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, setCroppedImage, uploadedAvatar]);

  return (
    <div className={styles.container}>
      {/* Upload */}
      {((!statusUpload.uploaded && !statusUpload.error && !statusUpload.saved) &&
        <div className={styles.dropContainer} {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            onDragMessage()
          ) : (
            <div className={styles.dropContent}>
              <div>
                <img src={mediaIcon} alt="media icon" />
                <span>Organization Logo</span>
              </div>
              
              <span>Drop the image here or click to browse.</span>
            </div>
          )}
        </div>
      )}

      {/* Crop */}
      {statusUpload.uploaded && (
        <div className={styles.cropContainer}>
          <div>
            {/* <img src={uploadedAvatar[0].preview} alt="" /> */}
            <div className={styles.cropArea}>
              <Cropper
                image={uploadedAvatar[0].preview}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onZoomChange={setZoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
                zoomSpeed={100}
                cropSize={{ width: 115, height: 115 }}
                zoomWithScroll={true}
                style={{ containerStyle: { borderRadius: '50%' } }}
              />
            </div>
            <div className={styles.cropControl}>
              <p>Crop</p>
              <Slider
                defaultValue={1}
                size="small"
                color="primary"
                min={1}
                max={5}  
                value={zoom}
                onChange={(e, zoom) => setZoom(Number(zoom))}
              />

              <button type='button' onClick={() => saveCroppedImage()}>Save</button>
            </div>
          </div>

          <button type='button' onClick={() => resetUpload()}>
            <FiX size={20} />
          </button>
        </div>
      )}

      {/* Error */}
      {statusUpload.error && (
        <div className={styles.errorContent}>
          <div>
            <img src={errorImage} alt="" />
            <div>
              <p>Sorry, the upload failed.</p>

              <button type='button' onClick={() => resetUpload()}>Try again</button>
            </div>
          </div>
        </div>
      )}

      {/* Saved */}
      {statusUpload.saved && (
        <div className={styles.savedContainer}>
          <img src={croppedImage} alt="" />
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              onDragMessage()
            ) : (
              <div className={styles.dropContent}>
                <div>
                  <img src={mediaIcon} alt="media icon" />
                  <span>Organization Logo</span>
                </div>
                
                <span>Drop the image here or click to browse.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
