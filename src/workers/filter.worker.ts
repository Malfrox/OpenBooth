// Worker for performing non-blocking canvas and image processing operations

interface ProcessImageMessage {
  type: "process-strip";
  id: string;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
}

self.onmessage = async (e: MessageEvent<ProcessImageMessage>) => {
  const { type, id } = e.data;
  if (type === "process-strip") {
    try {
      // Respond to main thread that worker is ready and supports offload
      self.postMessage({ id, status: "ok" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      self.postMessage({ id, status: "error", error: message });
    }
  }
};

export {};
