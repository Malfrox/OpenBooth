import { createFileRoute } from "@tanstack/react-router";
import { Camera, ImageOff } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { FilterStrip } from "@/components/FilterStrip";
import { ViewfinderHUD } from "@/components/ViewfinderHUD";
import { PolaroidTray } from "@/components/PolaroidTray";
import { useBooth } from "@/lib/photobooth-context";
import { useCamera } from "@/hooks/use-camera";
import { useCapture } from "@/hooks/use-capture";
import { useBoothAudio } from "@/lib/booth-audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Open Booth — Retro Camera Booth" },
      {
        name: "description",
        content:
          "A warm, retro photobooth: live preview, vintage film filters, and printable layouts.",
      },
      { property: "og:title", content: "Open Booth — Retro Camera Booth" },
      {
        property: "og:description",
        content:
          "A warm, retro photobooth: live preview, vintage film filters, and printable layouts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Booth,
});

function Booth() {
  const { selectedFilter, selectedFilterName, settings, addPhoto } = useBooth();
  const { videoRef, state: camState, start: startCamera } = useCamera(settings.facingMode);
  const { capture, captureBurst, countdown, startTimer } = useCapture();
  const { playCountdownBeep, playShutterClick } = useBoothAudio();
  const [flash, setFlash] = useState(false);

  // Auto-start camera on mount or whenever facingMode changes
  useEffect(() => {
    // ponytail: typeof window guard is enough for SSR safety
    if (typeof window !== "undefined") {
      startCamera(settings.facingMode);
    }
  }, [settings.facingMode, startCamera]);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || camState !== "active") return;

    startTimer(
      settings.timer,
      () => {
        const dataUrl = capture(
          videoRef.current!,
          selectedFilter,
          settings.format,
          settings.facingMode === "user",
        );
        if (!dataUrl) return;

        // Mechanical shutter sound & flash effect
        playShutterClick();
        setFlash(true);
        setTimeout(() => setFlash(false), 200);

        addPhoto({
          id: crypto.randomUUID(),
          dataUrl,
          filterCss: selectedFilter,
          timestamp: Date.now(),
        });
        toast.success("Photo captured!");
      },
      () => {
        // Countdown beep tick
        playCountdownBeep();
      },
    );
  }, [
    camState,
    settings,
    selectedFilter,
    addPhoto,
    capture,
    startTimer,
    videoRef,
    playCountdownBeep,
    playShutterClick,
  ]);

  return (
    <AppShell>
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 py-4">
        <div className="min-w-0">
          <h1 className="type-h1 truncate text-[26px] sm:text-[32px]">Open Booth</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ready?</p>
        </div>
      </section>

      <div className="grid gap-4 pb-8 md:grid-cols-2 md:gap-8">
        {/* Camera Preview */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">
          <div className="relative aspect-[3/4] max-h-[min(64vh,560px)] w-full sm:aspect-[9/16] md:aspect-[3/4] md:max-h-none">
            <>
              {/* Live video with selected filter applied via CSS */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  filter: selectedFilter,
                  transform: settings.facingMode === "user" ? "scaleX(-1)" : "none",
                }}
              />
              {/* Grid overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(249,247,243,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(249,247,243,.5) 1px, transparent 1px)",
                  backgroundSize: "33.33% 33.33%",
                }}
              />
              {/* Vignette */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 45%, rgba(61,56,48,0.35) 100%)",
                }}
              />
            </>

            {camState === "denied" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card p-8 text-center">
                <ImageOff size={48} className="text-destructive" />
                <h2 className="type-h2">Camera access needed</h2>
                <p className="text-sm text-muted-foreground">
                  Allow camera access in your browser to use photobooth
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => startCamera(settings.facingMode)}
                >
                  Try again
                </button>
              </div>
            )}

            {(camState === "idle" || camState === "requesting") && (
              <div className="absolute inset-0 flex items-center justify-center bg-card">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent" />
              </div>
            )}

            {/* Flash overlay */}
            {flash && (
              <div className="pointer-events-none absolute inset-0 animate-fade-out bg-white" />
            )}

            {/* Countdown */}
            {countdown !== null && (
              <span className="type-timer absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-background drop-shadow-lg">
                {countdown}
              </span>
            )}

            {/* Filter name badge */}
            {camState === "active" && (
              <span className="absolute left-3 top-3 z-20 rounded bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {selectedFilterName}
              </span>
            )}

            {/* Viewfinder Controls HUD */}
            <ViewfinderHUD />

            {/* Capture button */}
            <button
              type="button"
              aria-label="Capture photo"
              onClick={handleCapture}
              disabled={camState !== "active" || countdown !== null}
              className="absolute bottom-6 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-capture)] transition-transform duration-200 ease-[var(--ease-spring)] hover:scale-105 hover:bg-primary-hover hover:shadow-[var(--shadow-capture-hover)] active:scale-95 active:shadow-[var(--shadow-capture-active)] disabled:opacity-50"
            >
              <Camera size={28} />
            </button>
          </div>
        </div>

        {/* Sidebar: Filters */}
        <div className="min-w-0 space-y-4 md:space-y-6">
          <div className="overflow-hidden rounded-lg border border-border">
            <FilterStrip />
          </div>

          {/* Polaroid Captured Tray */}
          <PolaroidTray />
        </div>
      </div>
    </AppShell>
  );
}
