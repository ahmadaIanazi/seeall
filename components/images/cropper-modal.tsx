"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export interface CropModalState {
  show: boolean;
  crop: Crop;
  tempSrc: string | null;
  aspect?: number;
}

export function getDefaultModalState(): CropModalState {
  return {
    show: false,
    crop: { unit: "%", width: 50, height: 50, x: 25, y: 25, aspect: 1 },
    tempSrc: null,
    aspect: 1,
  };
}

export function CropperModal({ modal, setModal, imageRef, value, onChange }) {
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

  async function handleCropComplete() {
    if (!modal.tempSrc || !imageRef.current) {
      setModal(getDefaultModalState());
      return;
    }
    const canvas = document.createElement("canvas");
    const img = imageRef.current;
    const { naturalWidth, naturalHeight } = img;
    const { x, y, width, height } = modal.crop;

    const scaleX = naturalWidth / img.width;
    const scaleY = naturalHeight / img.height;

    canvas.width = width * scaleX;
    canvas.height = height * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0, 0, width * scaleX, height * scaleY);
    const croppedImage = canvas.toDataURL("image/png");
    onChange(croppedImage);
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
