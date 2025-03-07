"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export interface CropModalState {
  show: boolean;
  index: number | null;
  crop: Crop;
  tempSrc: string | null;
  aspect?: number;
}

export function getDefaultModalState(): CropModalState {
  return {
    show: false,
    index: null,
    crop: { unit: "%", width: 50, height: 50, x: 25, y: 25, aspect: 1 },
    tempSrc: null,
    aspect: 1,
  };
}

export function CropperModalMulti({ modal, setModal, imageRef, setOriginalImage = null, setImages }) {
  function handleCropChange(newCrop: Crop) {
    setModal((m) => ({ ...m, crop: newCrop }));
  }

  function handleImageLoaded(img: HTMLImageElement) {
    const canvasWidth = img.width; // Actual display size in the modal
    const canvasHeight = img.height;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    console.log("🖼 Canvas Size (Displayed):", { canvasWidth, canvasHeight });
    console.log("🔹 Image Natural Size:", { naturalWidth, naturalHeight });

    if (!modal.aspect) return false;

    const newCrop = getCenteredCrop(canvasWidth, canvasHeight, naturalWidth, naturalHeight, modal.aspect);
    console.log("📏 Initial Crop:", newCrop);

    setModal((m) => ({
      ...m,
      crop: newCrop,
    }));

    return false;
  }

  function getCenteredCrop(canvasWidth: number, canvasHeight: number, imageWidth: number, imageHeight: number, aspect?: number) {
    let width, height, x, y;

    console.log("🖼 Canvas Display Size:", { width: canvasWidth, height: canvasHeight });
    console.log("🛠 Aspect Ratio Selected:", aspect);

    if (!aspect) {
      // ✅ Freeform selection (Default 90% of the image)
      width = canvasWidth * 0.9;
      height = canvasHeight * 0.9;
    } else if (aspect === 1) {
      // ✅ Square (1:1) → Take the largest possible square
      if (canvasWidth > canvasHeight) {
        width = height = canvasHeight * 0.9;
      } else {
        width = height = canvasWidth * 0.9;
      }
    } else if (aspect > 1) {
      // ✅ Landscape (16:9 or wider) → Maximize width, ensure height fits
      width = canvasWidth * 0.9;
      height = width / aspect;

      // 🔹 If height exceeds bounds, adjust width instead
      if (height > canvasHeight) {
        height = canvasHeight * 0.9;
        width = height * aspect;
      }
    } else {
      // ✅ Portrait (9:16 or taller) → Maximize height, ensure width fits
      height = canvasHeight * 0.9;
      width = height * aspect;

      // 🔹 If width exceeds bounds, adjust height instead
      if (width > canvasWidth) {
        width = canvasWidth * 0.9;
        height = width / aspect;
      }
    }

    // ✅ Center the crop area properly
    x = (canvasWidth - width) / 2;
    y = (canvasHeight - height) / 2;

    const crop = {
      unit: "px",
      width: Math.round(width),
      height: Math.round(height),
      x: Math.round(x),
      y: Math.round(y),
      aspect,
    };

    console.log("📏 FINAL CALCULATED CROP:", crop);
    return crop;
  }

  function setAspectRatio(aspect?: number) {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvasWidth = img.width;
    const canvasHeight = img.height;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    console.log("🛠 Setting Aspect Ratio:", aspect);
    console.log("🔍 Image Size:", { width: naturalWidth, height: naturalHeight });

    const newCrop = getCenteredCrop(canvasWidth, canvasHeight, naturalWidth, naturalHeight, aspect);

    console.log("📏 New Crop Selection:", newCrop);

    setModal((m) => ({
      ...m,
      aspect,
      crop: newCrop,
    }));
  }

  async function handleCropComplete() {
    if (modal.index == null || !modal.tempSrc || !imageRef.current) {
      setModal(getDefaultModalState());
      return;
    }

    const canvas = document.createElement("canvas");
    const img = imageRef.current;
    const { naturalWidth, naturalHeight } = img;
    const { x = 0, y = 0, width = 0, height = 0 } = modal.crop;

    const scaleX = naturalWidth / img.width;
    const scaleY = naturalHeight / img.height;

    console.log("🖼 Original Image Size:", { naturalWidth, naturalHeight });
    console.log("📐 Crop Selection:", { x, y, width, height });
    console.log("🔍 Scale Factors:", { scaleX, scaleY });

    const cropX = x * scaleX;
    const cropY = y * scaleY;
    const cropWidth = width * scaleX;
    const cropHeight = height * scaleY;

    console.log("🖌 Final Cropping Area:", { cropX, cropY, cropWidth, cropHeight });

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setModal(getDefaultModalState());
      return;
    }

    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const base64Image = canvas.toDataURL("image/png");
    setImages((prev) => {
      const updated = [...prev];
      updated[modal.index!] = { ...updated[modal.index!], src: base64Image };

      return updated;
    });
    if (setOriginalImage) {
      setOriginalImage((prev) => {
        if (!prev) return { id: crypto.randomUUID(), src: base64Image }; // Handle null case
        return { ...prev, src: base64Image }; // Handle single-object case (AvatarUpload)
      });
    }

    setModal(getDefaultModalState());
  }

  function closeWithoutChanges() {
    setModal(getDefaultModalState());
  }

  return (
    <Dialog open={modal.show} onOpenChange={closeWithoutChanges}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Pick an aspect ratio or leave free form. Adjust your image and press <strong>Save</strong> when done.
          </DialogDescription>
        </DialogHeader>

        {/* Aspect Ratio Buttons */}
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          <Button variant='outline' size='sm' onClick={() => setAspectRatio(1)}>
            1:1 (Square)
          </Button>
          <Button variant='outline' size='sm' onClick={() => setAspectRatio(9 / 16)}>
            9:16 (Portrait)
          </Button>
          <Button variant='outline' size='sm' onClick={() => setAspectRatio(16 / 9)}>
            16:9 (Landscape)
          </Button>
          <Button variant='outline' size='sm' onClick={() => setAspectRatio(undefined)}>
            Manual
          </Button>
        </div>

        {/* Image Cropper */}
        {modal.tempSrc && (
          <ReactCrop
            crop={modal.crop}
            onChange={handleCropChange}
            onImageLoaded={handleImageLoaded}
            keepSelection
            ruleOfThirds
            locked={modal.aspect !== undefined} // Lock manual resizing if aspect ratio is selected
          >
            <img ref={imageRef} src={modal.tempSrc} alt='Crop Preview' style={{ maxHeight: 400, maxWidth: "100%" }} />
          </ReactCrop>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={closeWithoutChanges}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
