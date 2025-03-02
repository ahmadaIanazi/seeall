"use client";

import { useCallback } from "react";
import { CropIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { imageToBase64 } from "@/lib/utils/image";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const base64 = await imageToBase64(file);
        onChange(base64);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    },
    [onChange]
  );

  return (
    <div className={cn("relative", className)}>
      <input type='file' accept='image/*' className='hidden' id='logo-upload' onChange={handleFileChange} />
      <label htmlFor='logo-upload' className='group cursor-pointer'>
        {value ? (
          <div className='relative aspect-square w-full overflow-hidden rounded-full'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt='Logo' className='h-full w-full object-cover transition group-hover:opacity-50' />
            <div className='absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100'>
              <CropIcon className='h-6 w-6 text-white' />
            </div>
          </div>
        ) : (
          <div className='flex aspect-square w-full items-center justify-center rounded-full border-2 border-dashed transition hover:border-primary'>
            <CropIcon className='h-6 w-6 text-muted-foreground' />
          </div>
        )}
      </label>
    </div>
  );
}
