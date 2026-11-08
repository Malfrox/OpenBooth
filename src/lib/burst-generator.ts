import type { Photo } from "@/lib/photobooth-context";

export interface BurstSequence {
  frames: Photo[];
  intervalMs: number;
}

/**
 * Creates an animated video or sequence of frames from captured photos.
 * In the browser, this exports a canvas-rendered sequence or multi-frame collage.
 */
export async function createBurstCollage(photos: Photo[]): Promise<string> {
  if (photos.length === 0) throw new Error("No photos to create burst collage");

  const canvas = document.createElement("canvas");
  const size = 400;
  const count = Math.min(photos.length, 4);

  // 2x2 grid
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = "#1c1917";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(
    photos.slice(0, 4).map((p) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = p.dataUrl;
      });
    }),
  );

  images.forEach((img, idx) => {
    const x = (idx % 2) * size;
    const y = Math.floor(idx / 2) * size;
    ctx.drawImage(img, x + 8, y + 8, size - 16, size - 16);
  });

  return canvas.toDataURL("image/png");
}
