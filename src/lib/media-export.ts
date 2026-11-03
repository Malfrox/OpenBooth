/**
 * Cross-platform media export & share utilities
 * Supports Web Share API (Level 2 with files for iOS "Save to Photos" / native share sheet)
 * with graceful fallback to standard browser anchor tag download.
 */

/**
 * Converts a data URL (e.g. data:image/png;base64,...) to a File object.
 */
export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const mime = blob.type || "image/png";
  return new File([blob], filename, { type: mime });
}

/**
 * Checks if the browser natively supports sharing files via Web Share API Level 2.
 */
export function canNativeShareFiles(): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) {
    return false;
  }

  try {
    const dummyFile = new File([new Uint8Array(1)], "test.png", { type: "image/png" });
    return navigator.canShare({ files: [dummyFile] });
  } catch {
    return false;
  }
}

/**
 * Trigger browser file download using a hidden anchor element.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export interface ExportOrShareOptions {
  dataUrl: string;
  filename: string;
  title?: string;
  text?: string;
}

/**
 * Attempts to share the image via Web Share API (native share sheet on iOS/Android/macOS),
 * which allows users to directly select "Save to Photos" / "Save Image".
 * Falls back to anchor tag download if Web Share is unsupported or fails non-abortively.
 *
 * Returns 'shared' if shared via navigator.share, or 'downloaded' if saved via fallback.
 */
export async function exportOrShareImage(options: {
  dataUrl: string;
  filename: string;
  title?: string;
  text?: string;
}): Promise<"shared" | "downloaded"> {
  const { dataUrl, filename, title, text } = options;

  if (canNativeShareFiles()) {
    try {
      const file = await dataUrlToFile(dataUrl, filename);
      if (navigator.canShare({ files: [file] })) {
        const shareData: ShareData = {
          files: [file],
          title: title || filename,
        };
        if (text) {
          shareData.text = text;
        }
        await navigator.share(shareData);
        return "shared";
      }
    } catch (err: unknown) {
      // AbortError is raised when the user cancels/dismisses the native share sheet
      if (
        err instanceof Error &&
        (err.name === "AbortError" ||
          err.message.includes("abort") ||
          err.message.includes("canceled"))
      ) {
        return "shared";
      }
      // Any other unexpected share error: fall through to standard download
      console.warn("Web Share failed, falling back to download:", err);
    }
  }

  // Fallback: standard anchor download
  downloadDataUrl(dataUrl, filename);
  return "downloaded";
}
