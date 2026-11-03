import type { Photo, BoothSettings } from "@/lib/photobooth-context";

export interface StripGeneratorOptions {
  photos: Photo[];
  settings?: BoothSettings;
  format?: "png" | "jpeg";
  title?: string;
}

/**
 * Loads an HTMLImageElement safely from a data URL or src.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Assembles 1 to 4 photos vertically into a retro photobooth keepsake strip.
 * Features:
 * - Vintage cream/paper background (#F9F7F3)
 * - Subtle inner drop borders around each photo
 * - Classic photobooth header/footer with title, date, and frame numbers
 * - High resolution output suitable for saving/printing
 */
export async function generatePhotoStrip({
  photos,
  settings,
  format = "png",
  title,
}: StripGeneratorOptions): Promise<string> {
  if (!photos || photos.length === 0) {
    throw new Error("No photos available to generate strip");
  }

  // Use the most recent up to 4 photos, presented in chronological capture order (oldest top to newest bottom)
  // Since photos are stored newest-first in context, take first 4 and reverse them.
  const stripPhotos = photos.slice(0, 4).reverse();
  const count = stripPhotos.length;

  // Geometry constants (high-res strip)
  const stripWidth = 600;
  const paddingX = 36;
  const paddingTop = 44;
  const paddingBottom = 72;
  const photoGap = 24;

  const photoWidth = stripWidth - paddingX * 2; // 528px
  const photoHeight = Math.round(photoWidth * (4 / 3)); // 704px (3:4 ratio standard photobooth frame)

  const stripHeight = paddingTop + count * photoHeight + (count - 1) * photoGap + paddingBottom;

  const canvas = document.createElement("canvas");
  canvas.width = stripWidth;
  canvas.height = stripHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // 1. Vintage paper textured background
  ctx.fillStyle = "#F9F7F3";
  ctx.fillRect(0, 0, stripWidth, stripHeight);

  // Subtle outer vintage border
  ctx.strokeStyle = "#E8E3D9";
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, stripWidth - 12, stripHeight - 12);

  // 2. Preload all photo images
  const loadedImages = await Promise.all(
    stripPhotos.map((p) => loadImage(p.dataUrl).catch(() => null)),
  );

  // 3. Draw each photo frame
  let currentY = paddingTop;
  for (let i = 0; i < stripPhotos.length; i++) {
    const img = loadedImages[i];

    // Photo background shadow & frame border
    ctx.fillStyle = "#2A2520";
    ctx.fillRect(paddingX - 1, currentY - 1, photoWidth + 2, photoHeight + 2);

    if (img && img.naturalWidth && img.naturalHeight) {
      // Calculate aspect-fill crop for photo window
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const targetAspect = photoWidth / photoHeight;
      const srcAspect = nw / nh;

      let sx = 0;
      let sy = 0;
      let sw = nw;
      let sh = nh;

      if (srcAspect > targetAspect) {
        sw = Math.round(nh * targetAspect);
        sx = Math.round((nw - sw) / 2);
      } else {
        sh = Math.round(nw / targetAspect);
        sy = Math.round((nh - sh) / 2);
      }

      ctx.save();
      // Apply photo filter if saved (dataUrl may already have it baked in from capture)
      ctx.drawImage(img, sx, sy, sw, sh, paddingX, currentY, photoWidth, photoHeight);
      ctx.restore();
    } else {
      // Fallback placeholder
      ctx.fillStyle = "#4A443C";
      ctx.fillRect(paddingX, currentY, photoWidth, photoHeight);
    }

    // Classic frame number stamp in corner (e.g., 01, 02...)
    ctx.font = "600 13px monospace";
    ctx.fillStyle = "rgba(249, 247, 243, 0.75)";
    ctx.fillText(`0${i + 1} / 0${count}`, paddingX + 12, currentY + 22);

    currentY += photoHeight + photoGap;
  }

  // 4. Photobooth Chin / Footer details
  const displayTitle = (title || settings?.title || "OPEN BOOTH").toUpperCase();

  const footerCenterY = currentY + (paddingBottom - photoGap) / 2;

  // Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#3D3830";
  ctx.font = "700 18px 'Courier New', Courier, monospace";
  ctx.fillText(displayTitle, stripWidth / 2, footerCenterY - 4);

  // Date and branding stamp
  const timestamp = stripPhotos[stripPhotos.length - 1]?.timestamp || Date.now();
  const dateStr = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  ctx.fillStyle = "#8B8680";
  ctx.font = "500 12px monospace";
  ctx.fillText(`${dateStr} • ${timeStr}`, stripWidth / 2, footerCenterY + 16);

  const mime = format === "jpeg" ? "image/jpeg" : "image/png";
  return canvas.toDataURL(mime, 0.95);
}

/**
 * Helper to trigger immediate browser download of the 4-strip
 */
export async function downloadPhotoStrip(options: StripGeneratorOptions): Promise<void> {
  const dataUrl = await generatePhotoStrip(options);
  const baseTitle = (options.title || options.settings?.title || "openbooth")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const ext = options.format || options.settings?.format || "png";

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${baseTitle}-4strip-${Date.now().toString().slice(-4)}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
