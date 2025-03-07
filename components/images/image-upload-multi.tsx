"use client";
import imageCompression from "browser-image-compression";
import { CropIcon, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import { CropModalState, getDefaultModalState } from "./cropper-modal";
import { CropperModalMulti } from "./cropper-modal-multi";

interface ImageData {
  id: string;
  src: string;
}

export function ImageUploadMulti() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [modal, setModal] = useState<CropModalState>(getDefaultModalState());

  const imageRef = useRef<HTMLImageElement | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleDrop(files, setImages),
  });

  return (
    <div className='space-y-4'>
      <DropzoneArea getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive} />
      <ImageGallery images={images} openCropper={(i) => openCropper(i, images, setModal)} removeImage={(i) => removeImage(i, setImages)} />
      <CropperModalMulti modal={modal} setModal={setModal} imageRef={imageRef} setImages={setImages} />
    </div>
  );
}

// ========================= HANDLERS =========================

async function handleDrop(acceptedFiles: File[], setImages: React.Dispatch<React.SetStateAction<ImageData[]>>) {
  const newImages: ImageData[] = [];
  for (const file of acceptedFiles) {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        newImages.push({ id: crypto.randomUUID(), src: reader.result.toString() });
        setImages((prev) => [...prev, ...newImages]);
      }
    };
    reader.readAsDataURL(compressedFile);
  }
}

function openCropper(index: number, images: ImageData[], setModal: React.Dispatch<React.SetStateAction<CropModalState>>) {
  setModal({
    show: true,
    index,
    crop: { unit: "%", width: 50, height: 50, x: 25, y: 25, aspect: 1 },
    tempSrc: images[index].src,
    aspect: 1,
  });
}

function removeImage(index: number, setImages: React.Dispatch<React.SetStateAction<ImageData[]>>) {
  setImages((prev) => prev.filter((_, i) => i !== index));
}

// ========================= COMPONENTS =========================

function DropzoneArea({ getRootProps, getInputProps, isDragActive }) {
  return (
    <div
      {...getRootProps({
        className: "flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4 transition hover:border-primary",
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-sm'>Drop the files here...</p>
      ) : (
        <div className='flex flex-col items-center'>
          <ImagePlus className='mb-2 h-6 w-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Drag & drop or click to select files</p>
        </div>
      )}
    </div>
  );
}

function ImageGallery({ images, openCropper, removeImage }) {
  return (
    images.length > 0 && (
      <div className='grid grid-cols-3 gap-4'>
        {images.map((img, i) => (
          <div key={img.id} className='relative group overflow-hidden rounded-md border'>
            <img src={img.src} alt={`Preview ${i}`} className='h-full w-full object-cover' />
            <button
              className='absolute top-1 right-1 hidden rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:block group-hover:opacity-100'
              onClick={() => removeImage(i)}
            >
              <X className='h-4 w-4' />
            </button>
            <button
              className='absolute top-1 left-1 hidden rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:block group-hover:opacity-100'
              onClick={() => openCropper(i)}
            >
              <CropIcon className='h-4 w-4' />
            </button>
          </div>
        ))}
      </div>
    )
  );
}
