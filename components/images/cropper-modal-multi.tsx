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

export function CropperModalMulti({ modal, setModal, imageRef, setImages, multiple = false }) {
  function handleCropChange(newCrop: Crop) {
    setModal((m) => ({ ...m, crop: newCrop }));
  }

  function handleImageLoaded(img: HTMLImageElement) {
    const canvasWidth = img.width;
    const canvasHeight = img.height;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    if (!modal.aspect) return false;

    const newCrop = getCenteredCrop(canvasWidth, canvasHeight, naturalWidth, naturalHeight, modal.aspect);
    setModal((m) => ({ ...m, crop: newCrop }));
    return false;
  }

  function getCenteredCrop(canvasWidth, canvasHeight, imageWidth, imageHeight, aspect) {
    let width, height, x, y;
    if (!aspect) {
      width = canvasWidth * 0.9;
      height = canvasHeight * 0.9;
    } else if (aspect === 1) {
      width = height = Math.min(canvasWidth, canvasHeight) * 0.9;
    } else if (aspect > 1) {
      width = canvasWidth * 0.9;
      height = width / aspect;
      if (height > canvasHeight) {
        height = canvasHeight * 0.9;
        width = height * aspect;
      }
    } else {
      height = canvasHeight * 0.9;
      width = height * aspect;
      if (width > canvasWidth) {
        width = canvasWidth * 0.9;
        height = width / aspect;
      }
    }
    x = (canvasWidth - width) / 2;
    y = (canvasHeight - height) / 2;
    return { unit: "px", width: Math.round(width), height: Math.round(height), x: Math.round(x), y: Math.round(y), aspect };
  }

  function setAspectRatio(aspect?: number) {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvasWidth = img.width;
    const canvasHeight = img.height;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const newCrop = getCenteredCrop(canvasWidth, canvasHeight, naturalWidth, naturalHeight, aspect);
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
    const { x, y, width, height } = modal.crop;

    const scaleX = naturalWidth / img.width;
    const scaleY = naturalHeight / img.height;

    const cropX = x * scaleX;
    const cropY = y * scaleY;
    const cropWidth = width * scaleX;
    const cropHeight = height * scaleY;

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
      return multiple ? updated : [updated[0]]; // Only keep one image if multiple is false
    });

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
          <ReactCrop crop={modal.crop} onChange={handleCropChange} onImageLoaded={handleImageLoaded} keepSelection ruleOfThirds locked={modal.aspect !== undefined}>
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
