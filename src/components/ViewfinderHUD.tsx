import { SwitchCamera, Timer } from "lucide-react";
import { useBooth } from "@/lib/photobooth-context";
import { cn } from "@/lib/utils";

const TIMER_CYCLE: readonly (0 | 3 | 5 | 10)[] = [0, 3, 5, 10];

export interface ViewfinderHUDProps {
  className?: string;
}

export function ViewfinderHUD({ className }: ViewfinderHUDProps) {
  const { settings, updateSettings } = useBooth();

  const handleFlipCamera = () => {
    updateSettings({
      facingMode: settings.facingMode === "user" ? "environment" : "user",
    });
  };

  const handleCycleTimer = () => {
    const currentIndex = TIMER_CYCLE.indexOf(settings.timer as 0 | 3 | 5 | 10);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % TIMER_CYCLE.length;
    const nextTimer = TIMER_CYCLE[nextIndex] ?? 0;
    updateSettings({ timer: nextTimer });
  };

  const timerLabel = settings.timer === 0 ? "Off" : `${settings.timer}s`;

  return (
    <div
      aria-label="Viewfinder Controls"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex items-start justify-between p-3 sm:p-4",
        className,
      )}
    >
      {/* Spacer for left side to balance top row (filter badge occupies left-3 top-3 in viewfinder) */}
      <div className="flex-1" />

      {/* Top-center: Timer cycle button */}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={handleCycleTimer}
          aria-label={`Timer: ${timerLabel}. Click to cycle.`}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/40 active:scale-95"
        >
          <Timer size={14} className="shrink-0 text-white/90" />
          <span>{timerLabel}</span>
        </button>
      </div>

      {/* Top-right: Camera flip button */}
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={handleFlipCamera}
          aria-label={`Flip camera (currently ${settings.facingMode === "user" ? "front" : "back"})`}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/40 active:scale-95"
        >
          <SwitchCamera size={14} className="shrink-0 text-white/90" />
          <span className="hidden xs:inline sm:inline">
            {settings.facingMode === "user" ? "Front" : "Back"}
          </span>
        </button>
      </div>
    </div>
  );
}
