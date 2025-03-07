import { Slider } from "@/components/ui/slider";
import { debounce } from "lodash";
import { CropIcon, X } from "lucide-react";
import { useCallback, useState } from "react";

export function ImagePreview({ originalImage, value, onChange, openCropper, removeImage }) {
  const [width, setWidth] = useState(100);

  const updateBase64AfterResize = useCallback(
    debounce(async (newWidthPercentage) => {
      if (!originalImage) return;

      const img = new Image();
      img.src = originalImage.src;

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

        const resizedBase64 = canvas.toDataURL("image/png");
        onChange({ id: value.id, src: resizedBase64 });
      };
    }, 500),
    [originalImage, onChange]
  );

  return (
    <div className='relative group flex flex-col items-center'>
      {value && (
        <img
          src={value}
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
      )}

      <div className='absolute bottom-2 w-48 opacity-0 transition-opacity group-hover:opacity-100'>
        <Slider
          defaultValue={[100]}
          min={40}
          max={100}
          step={5}
          value={[width]}
          onValueChange={(value) => {
            setWidth(value[0]);
            updateBase64AfterResize(value[0]);
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
