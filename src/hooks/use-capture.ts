import { useRef, useState, useCallback, useEffect } from "react";

export function useCapture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const capture = useCallback(
    (
      video: HTMLVideoElement,
      filterCss: string,
      format: string = "png",
      flip: boolean = false,
    ): string | null => {
      if (!video.videoWidth) return null;
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvasRef.current = canvas;

      const targetRatio = video.clientWidth / video.clientHeight;
      let sw = video.videoWidth;
      let sh = video.videoHeight;
      if (sw / sh > targetRatio) {
        sw = sh * targetRatio;
      } else {
        sh = sw / targetRatio;
      }
      const sx = (video.videoWidth - sw) / 2;
      const sy = (video.videoHeight - sh) / 2;

      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.filter = filterCss || "none";
      if (flip) {
        ctx.translate(sw, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = "none";

      return canvas.toDataURL(`image/${format}`);
    },
    [],
  );

  const startTimer = useCallback(
    (seconds: number, onDone: () => void, onTick?: (remaining: number) => void) => {
      if (seconds <= 0) {
        onDone();
        return;
      }
      let current = seconds;
      setCountdown(current);
      onTick?.(current);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        current -= 1;
        if (current <= 0) {
          clearInterval(timerRef.current);
          setCountdown(null);
          onDone();
        } else {
          setCountdown(current);
          onTick?.(current);
        }
      }, 1000);
    },
    [],
  );

  const cancelTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setCountdown(null);
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const captureBurst = useCallback(
    async (
      video: HTMLVideoElement,
      filterCss: string,
      format: string = "png",
      flip: boolean = false,
      count: number = 3,
      intervalMs: number = 250,
      onFrame?: (dataUrl: string) => void,
    ): Promise<string[]> => {
      const frames: string[] = [];
      for (let i = 0; i < count; i++) {
        const frame = capture(video, filterCss, format, flip);
        if (frame) {
          frames.push(frame);
          onFrame?.(frame);
        }
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }
      return frames;
    },
    [capture],
  );

  return { capture, captureBurst, countdown, startTimer, cancelTimer };
}
