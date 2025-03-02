export async function imageToBytes(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export function bytesToDataUrl(bytes: Uint8Array | null): string | null {
  if (!bytes) return null;
  const base64 = Buffer.from(bytes).toString("base64");
  return `data:image/png;base64,${base64}`;
}

export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function isBase64Image(str: string | null): boolean {
  if (!str) return false;
  return str.startsWith("data:image");
}
