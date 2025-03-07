"use client";
import imageCompression from "browser-image-compression";
import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import { CropModalState, CropperModal, getDefaultModalState } from "./cropper-modal";
import { ImagePreview } from "./image-preview";

interface ImageUploadProps {
  value: string;
  onChange: (image: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [modal, setModal] = useState<CropModalState>(getDefaultModalState());
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleDrop(files, setOriginalImage, onChange),
    multiple: false,
  });

  return (
    <div className='space-y-4'>
      {!value && <DropzoneArea getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive} />}
      {value && (
        <ImagePreview
          originalImage={originalImage}
          value={value}
          onChange={onChange}
          openCropper={() => openCropper(value, setModal)}
          removeImage={() => {
            setOriginalImage(null);
            onChange("");
          }}
        />
      )}
      <CropperModal
        modal={modal}
        setModal={setModal}
        imageRef={imageRef}
        value={originalImage}
        onChange={(img) => {
          setOriginalImage(img);
          onChange(img);
        }}
      />
    </div>
  );
}

async function handleDrop(acceptedFiles: File[], setOriginalImage: (image: string) => void, onChange: (image: string) => void) {
  const file = acceptedFiles[0];
  if (!file) return;

  const compressedFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  const reader = new FileReader();
  reader.onload = () => {
    if (reader.result) {
      const imageBase64 = reader.result.toString();
      setOriginalImage(imageBase64);
      onChange(imageBase64);
    }
  };
  reader.readAsDataURL(compressedFile);
}

function openCropper(image: string, setModal: React.Dispatch<React.SetStateAction<CropModalState>>) {
  setModal({
    show: true,
    crop: { unit: "%", width: 50, height: 50, x: 25, y: 25, aspect: 1 },
    tempSrc: image,
    aspect: 1,
  });
}

function DropzoneArea({ getRootProps, getInputProps, isDragActive }) {
  return (
    <div
      {...getRootProps({
        className: "flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4 transition hover:border-primary",
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-sm'>Drop the file here...</p>
      ) : (
        <div className='flex flex-col items-center'>
          <ImagePlus className='mb-2 h-6 w-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Drag & drop or click to upload an image.</p>
        </div>
      )}
    </div>
  );
}
