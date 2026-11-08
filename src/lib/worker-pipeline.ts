/**
 * Web Worker Pipeline Helper
 * Provides non-blocking execution fallback when workers or OffscreenCanvas are absent.
 */

let workerInstance: Worker | null = null;

export function isWorkerSupported(): boolean {
  return typeof window !== "undefined" && typeof Worker !== "undefined";
}

export function isOffscreenCanvasSupported(): boolean {
  return typeof window !== "undefined" && typeof OffscreenCanvas !== "undefined";
}

export function getFilterWorker(): Worker | null {
  if (!isWorkerSupported()) return null;
  if (!workerInstance) {
    try {
      workerInstance = new Worker(new URL("../workers/filter.worker.ts", import.meta.url), {
        type: "module",
      });
    } catch (err) {
      console.warn("Could not instantiate filter worker:", err);
      return null;
    }
  }
  return workerInstance;
}
