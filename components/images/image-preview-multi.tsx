// To be created. (From Image Gallery)
import { Slider } from "@/components/ui/slider"; // ShadCN Slider
import { debounce } from "lodash"; // Import lodash debounce
import { CropIcon, X } from "lucide-react";
import { useCallback, useState } from "react";

export function ImagePreviewMulti({ originalImage, image, setImage, openCropper, removeImage }) {
  const [width, setWidth] = useState(100); // UI preview width %

  // Debounced function to resize AFTER user stops sliding
  const updateBase64AfterResize = useCallback(
    debounce(async (newWidthPercentage) => {
      const img = new Image();
      img.src = originalImage.src; // Always resize from the high-quality original

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scaleFactor = newWidthPercentage / 100;
        const newWidth = Math.round(img.naturalWidth * scaleFactor);
        const newHeight = Math.round(img.naturalHeight * scaleFactor);

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const resizedBase64 = canvas.toDataURL("image/png"); // Convert to base64
        setImage({ id: image.id, src: resizedBase64 }); // Update resized image
      };
    }, 500), // 500ms delay to avoid excessive updates
    [originalImage, setImage]
  );

  return (
    <div className='relative group flex flex-col items-center'>
      {/* Image preview (no base64 conversion, just CSS resizing) */}
      <img
        src={image.src}
        alt='Preview'
        className='object-contain transition border-0 group-hover:border group-hover:border-gray-300'
        style={{
          display: "block",
          width: `${width}%`,
          height: "auto",
          maxWidth: "100%",
          maxHeight: "calc(100vh - 50px)",
        }}
      />

      {/* Slider appears on hover */}
      <div className='absolute bottom-2 w-48 opacity-0 transition-opacity group-hover:opacity-100'>
        <Slider
          defaultValue={[100]}
          min={40}
          max={100}
          step={5}
          value={[width]}
          onValueChange={(value) => {
            setWidth(value[0]); // Instantly adjust UI preview (CSS-based)
            updateBase64AfterResize(value[0]); // Debounced update (preserves quality)
          }}
        />
      </div>

      <button
        className='absolute top-1 right-1 hidden rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:block group-hover:opacity-100'
        onClick={removeImage}
      >
        <X className='h-4 w-4' />
      </button>

      <button className='absolute top-1 left-1 hidden rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:block group-hover:opacity-100' onClick={openCropper}>
        <CropIcon className='h-4 w-4' />
      </button>
    </div>
  );
}
