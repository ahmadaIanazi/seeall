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

interface ImageUploadMultiProps {
  multiple?: boolean;
  value: ImageData[];
  onChange: (images: ImageData[]) => void;
}

export function ImageUploadMulti({ multiple = false, value, onChange }: ImageUploadMultiProps) {
  const [modal, setModal] = useState<CropModalState>(getDefaultModalState());
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleDrop(files, onChange, multiple),
    multiple,
  });

  return (
    <div className='space-y-4'>
      {!multiple && value.length > 0 ? null : <DropzoneArea getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive} />}
      <ImageGallery multiple={multiple} images={value} openCropper={(i) => openCropper(i, value, setModal)} removeImage={(i) => removeImage(i, onChange, value, multiple)} />
      <CropperModalMulti multiple={multiple} modal={modal} setModal={setModal} imageRef={imageRef} setImages={onChange} />
    </div>
  );
}

// ========================= HANDLERS =========================

async function handleDrop(acceptedFiles: File[], onChange: (images: ImageData[]) => void, multiple: boolean) {
  const newImages = await Promise.all(
    acceptedFiles.map(async (file) => {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      return new Promise<ImageData>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve({ id: crypto.randomUUID(), src: reader.result.toString() });
          }
        };
        reader.readAsDataURL(compressedFile);
      });
    })
  );

  onChange(multiple ? (prev) => [...prev, ...newImages] : newImages);
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

function removeImage(index: number, onChange: (images: ImageData[]) => void, images: ImageData[], multiple: boolean) {
  onChange(multiple ? images.filter((_, i) => i !== index) : []);
}

// ========================= COMPONENTS =========================

function DropzoneArea({ getRootProps, getInputProps, isDragActive }) {
  return (
    <div {...getRootProps({ className: "flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4 transition hover:border-primary" })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-sm'>Drop the file here...</p>
      ) : (
        <div className='flex flex-col items-center'>
          <ImagePlus className='mb-2 h-6 w-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Drag & drop or click to select a file</p>
        </div>
      )}
    </div>
  );
}

function ImageGallery({ multiple, images, openCropper, removeImage }) {
  return (
    images.length > 0 && (
      <div className={`flex ${multiple ? "flex-wrap gap-4" : "justify-center"} `}>
        {images.map((img, i) => (
          <div key={img.id} className='relative group overflow-hidden rounded-md border' style={{ maxWidth: "100%" }}>
            <img src={img.src} alt={`Preview ${i}`} className='object-contain' style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "250px" }} />
            <button
              className='absolute top-1 right-1 hidden rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:block group-hover:opacity-100'
              onClick={() => removeImage(i)}
            >
              <X className='h-4 w-4' />
            </button>
            <button
              className={`absolute top-1 left-1 hidden rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:block group-hover:opacity-100 ${
                !multiple ? "hidden" : ""
              }`}
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
