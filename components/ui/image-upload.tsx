"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (base64: string) => void;
  value?: string;
  disabled?: boolean;
}

export function ImageUpload({ onChange, value, disabled }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className='space-y-4 w-full'>
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 
          ${dragActive ? "border-primary" : "border-border"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          transition-colors
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input type='file' accept='image/*' className='hidden' onChange={handleChange} disabled={disabled} id='image-upload' />
        <label htmlFor='image-upload' className='flex flex-col items-center gap-2 cursor-pointer'>
          {value ? (
            <div className='relative w-full aspect-video'>
              <Image src={value} alt='Upload' fill className='object-cover rounded-lg' />
              <Button
                type='button'
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2'
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove();
                }}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2 py-4'>
              <ImagePlus className='h-8 w-8 text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>Drag & drop an image here, or click to select</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
