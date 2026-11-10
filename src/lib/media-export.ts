/**
 * Cross-platform media export & share utilities
 * Supports Web Share API (Level 2 with files for iOS "Save to Photos" / native share sheet)
 * with graceful fallback to standard browser anchor tag download.
 */

/**
 * Converts a data URL (e.g. data:image/png;base64,...) to a real binary Blob.
 */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * Converts a data URL (e.g. data:image/png;base64,...) to a File object.
 */
export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const blob = await dataUrlToBlob(dataUrl);
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
 * Trigger browser file download using a binary Blob URL.
 * Converts data URL to Blob, creates an Object URL with explicit MIME type,
 * triggers download, and cleanly revokes the Object URL after a short timeout.
 * Android Chrome's download manager sets the correct MIME type from the Blob,
 * allowing Android's MediaScanner to index the file directly into Gallery/Photos.
 */
export async function downloadBlobUrl(dataUrl: string, filename: string): Promise<void> {
  const blob = await dataUrlToBlob(dataUrl);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
}

/**
 * Backwards compatibility alias for downloadBlobUrl.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  void downloadBlobUrl(dataUrl, filename);
}

/**
 * Attempts to save a file using the File System Access API (showSaveFilePicker).
 * Specifically passes `startIn: 'pictures'` so Android Chromium suggests saving
 * directly into the device's Pictures folder, indexed by Android Gallery/Google Photos.
 */
export async function saveWithFilePicker(
  blob: Blob,
  filename: string,
  mime: string,
): Promise<"saved" | "dismissed"> {
  if (typeof window === "undefined" || !("showSaveFilePicker" in window)) {
    throw new Error("showSaveFilePicker is not supported in this browser");
  }

  const ext = filename.split(".").pop() || "png";
  try {
    const pickerFn = (
      window as unknown as {
        showSaveFilePicker: (opts: {
          suggestedName: string;
          startIn?: string;
          types?: Array<{
            description?: string;
            accept: Record<string, string[]>;
          }>;
        }) => Promise<{
          createWritable: () => Promise<{
            write: (data: Blob) => Promise<void>;
            close: () => Promise<void>;
          }>;
        }>;
      }
    ).showSaveFilePicker;

    const handle = await pickerFn({
      suggestedName: filename,
      startIn: "pictures",
      types: [
        {
          description: "Image",
          accept: { [mime]: [`.${ext}`] },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return "saved";
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err.name === "AbortError" ||
        err.message.includes("abort") ||
        err.message.includes("canceled"))
    ) {
      return "dismissed";
    }
    throw err;
  }
}

export type ExportAction = "auto" | "download" | "share";

/**
 * Detects whether the client is running on an Android device.
 */
export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Detects whether the client is running on an iOS device (iPhone, iPad, iPod).
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export interface ExportOrShareOptions {
  dataUrl: string;
  filename: string;
  title?: string;
  text?: string;
  action?: ExportAction;
}

/**
 * Exports or shares an image across platforms:
 * - On Android: Prioritizes direct file download (Tier 3 Blob URL anchor) unless explicit action === 'share',
 *   avoiding the system intent chooser modal when users intend to download.
 * - On iOS / Safari: Prioritizes Web Share API Level 2 (files) for native "Save Image" to Photos.
 * - On Desktop / Other: Uses direct Blob download or Web Share when requested.
 *
 * Returns:
 * - 'shared': Shared via navigator.share (or user dismissed share sheet)
 * - 'saved': Saved directly via showSaveFilePicker
 * - 'downloaded': Downloaded via Blob URL anchor fallback
 */
export async function exportOrShareImage(
  options: ExportOrShareOptions,
): Promise<"shared" | "saved" | "downloaded"> {
  const { dataUrl, filename, title, text, action = "auto" } = options;

  // If explicit action is "download" or if on Android (without explicit action="share"),
  // directly trigger file download instead of opening the system share sheet.
  const preferDirectDownload =
    action === "download" || (action !== "share" && isAndroidDevice());

  if (!preferDirectDownload && canNativeShareFiles()) {
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
      // Any other unexpected share error: fall through to save picker / blob download
      console.warn("Web Share failed, falling back to download:", err);
    }
  }

  // Tier 2: File System Access API (when available and not explicitly falling back to anchor)
  // Note: On Android browsers, showSaveFilePicker can also trigger file save dialogs;
  // direct blob URL download is standard for instant browser download.
  if (action === "share" && typeof window !== "undefined" && "showSaveFilePicker" in window) {
    try {
      const blob = await dataUrlToBlob(dataUrl);
      const mime =
        blob.type ||
        (filename.endsWith(".jpg") || filename.endsWith(".jpeg") ? "image/jpeg" : "image/png");
      const result = await saveWithFilePicker(blob, filename, mime);
      if (result === "saved") {
        return "saved";
      }
      if (result === "dismissed") {
        return "saved";
      }
    } catch (err: unknown) {
      console.warn("File System Access API failed, falling back to blob download:", err);
    }
  }

  // Tier 3: Direct Binary Blob URL anchor download
  await downloadBlobUrl(dataUrl, filename);
  return "downloaded";
}
