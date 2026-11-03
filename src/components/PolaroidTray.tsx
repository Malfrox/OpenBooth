import { useState } from "react";
import { Download, Trash2, Check, Sparkles, Layers } from "lucide-react";
import { useBooth, type Photo } from "@/lib/photobooth-context";
import { generatePhotoStrip } from "@/lib/strip-generator";
import { exportOrShareImage } from "@/lib/media-export";
import { toast } from "sonner";

export interface PolaroidTrayProps {
  className?: string;
  maxItems?: number;
}

export function PolaroidTray({ className = "", maxItems = 4 }: PolaroidTrayProps) {
  const { photos, removePhoto, settings } = useBooth();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isGeneratingStrip, setIsGeneratingStrip] = useState(false);

  if (!photos || photos.length === 0) {
    return null;
  }

  // Display the latest captured photos (up to maxItems, default 4)
  const recentPhotos = photos.slice(0, maxItems);
  const canMakeStrip = photos.length >= 2;
  const isFullFourStrip = photos.length >= 4;

  const handleDownloadStrip = async () => {
    try {
      setIsGeneratingStrip(true);
      const stripDataUrl = await generatePhotoStrip({
        photos,
        settings,
        format: settings?.format || "png",
      });
      const baseTitle =
        (settings?.title || "photobooth").trim().toLowerCase().replace(/\s+/g, "-") || "photobooth";
      const ext = settings?.format || "png";
      const filename = `${baseTitle}-4strip-${Date.now().toString().slice(-4)}.${ext}`;
      const userTitle = (settings?.title || "").trim();

      const res = await exportOrShareImage({
        dataUrl: stripDataUrl,
        filename,
        title: userTitle ? `${userTitle} Photo Strip` : "Photo Strip",
      });

      toast.success(
        res === "shared"
          ? "Opened share sheet"
          : isFullFourStrip
            ? "4-Photo strip downloaded!"
            : `${Math.min(photos.length, 4)}-Photo strip downloaded!`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate photo strip");
    } finally {
      setIsGeneratingStrip(false);
    }
  };

  const handleDownload = async (photo: Photo, index: number) => {
    try {
      setDownloadingId(photo.id);
      const baseTitle =
        (settings?.title || "photobooth").trim().toLowerCase().replace(/\s+/g, "-") || "photobooth";
      const ext = settings?.format || "png";
      const fileData = photo.dataUrl.startsWith("data:")
        ? photo.dataUrl.replace(/^data:image\/[^;]+/, `data:image/${ext}`)
        : photo.dataUrl;
      const filename = `${baseTitle}-${Date.now().toString().slice(-4)}-${index + 1}.${ext}`;
      const userTitle = (settings?.title || "").trim();

      const res = await exportOrShareImage({
        dataUrl: fileData,
        filename,
        ...(userTitle ? { title: userTitle } : {}),
      });

      toast.success(res === "shared" ? "Opened share sheet" : "Photo downloaded");
      setTimeout(() => setDownloadingId(null), 1000);
    } catch {
      toast.error("Failed to download photo");
      setDownloadingId(null);
    }
  };

  const handleDelete = (id: string) => {
    removePhoto(id);
    toast.success("Photo removed");
  };

  return (
    <div
      aria-label="Recent polaroid captures"
      className={`relative z-20 flex w-full flex-col items-center justify-end ${className}`}
    >
      {/* 4-Strip Download Bar */}
      {canMakeStrip && (
        <div className="mb-2 flex w-full items-center justify-between gap-2 rounded-md border border-[#D4A574]/30 bg-[#F9F7F3] px-3 py-1.5 shadow-sm dark:bg-[#2A2520] dark:border-[#524B40]">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#3D3830] dark:text-[#EFECE6]">
            <Layers size={14} className="text-[#D97040]" />
            <span>
              {isFullFourStrip ? "4-Photo Strip ready!" : `${photos.length}/4 for full strip`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadStrip}
            disabled={isGeneratingStrip}
            className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#D97040] px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-[#C25E30] active:scale-95 disabled:opacity-50"
            title="Download retro vertical photobooth strip"
          >
            {isGeneratingStrip ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Sparkles size={13} />
            )}
            <span>Download 4-Strip</span>
          </button>
        </div>
      )}

      <div className="scroll-x flex max-w-full items-end justify-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
        {recentPhotos.map((photo, index) => {
          // Slight playful rotation offset for retro tactile feel: newest photo stays straight or slight tilt
          const rotationAngle = index === 0 ? "-1deg" : index === 1 ? "2deg" : "-2.5deg";
          const isLatest = index === 0;

          return (
            <div
              key={photo.id}
              className={`group relative flex shrink-0 flex-col items-center rounded-[3px] bg-[#F9F7F3] p-2 text-[#3D3830] shadow-[0_8px_20px_rgba(61,56,48,0.22)] transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(61,56,48,0.3)] dark:bg-[#EFECE6] dark:text-[#2A2520] ${
                isLatest ? "animate-polaroid-eject" : ""
              }`}
              style={{
                width: isLatest ? "130px" : "110px",
                transform: `rotate(${rotationAngle})`,
              }}
            >
              {/* Retro Film Slot / Ejection Indicator badge for freshest photo */}
              {isLatest && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-[#D4A574]/40 bg-[#D97040] px-2 py-0.5 text-[9px] font-semibold tracking-wider text-white uppercase shadow-sm">
                  Latest
                </div>
              )}

              {/* Square photo display mimicking Polaroid emulsion window */}
              <div
                className="relative aspect-square w-full overflow-hidden rounded-[2px] bg-[#2A2520] shadow-inner"
                style={{
                  filter:
                    photo.filterCss && photo.filterCss !== "none" ? photo.filterCss : undefined,
                }}
              >
                <img
                  src={photo.dataUrl}
                  alt={`Capture from ${new Date(photo.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                  className="h-full w-full object-cover touch-manipulation"
                  loading="lazy"
                />

                {/* Subtle sheen highlight over photo emulsion */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
                  }}
                />
              </div>

              {/* Classic bottom polaroid chin with timestamp & quick action buttons */}
              <div className="mt-2 flex w-full items-center justify-between gap-1 px-0.5">
                <span className="truncate font-mono text-[10px] text-[#8B8680]">
                  {new Date(photo.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>

                {/* Quick Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDownload(photo, index)}
                    aria-label="Download photo"
                    title="Download photo"
                    className="inline-flex size-6 items-center justify-center rounded-[3px] border border-[#D4D0C8] bg-white text-[#3D3830] transition-colors hover:border-[#D97040] hover:bg-[#D97040] hover:text-white active:scale-95"
                  >
                    {downloadingId === photo.id ? <Check size={12} /> : <Download size={12} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id)}
                    aria-label="Delete photo"
                    title="Delete photo"
                    className="inline-flex size-6 items-center justify-center rounded-[3px] border border-[#D4D0C8] bg-white text-[#8B8680] transition-colors hover:border-[#A85245] hover:bg-[#A85245] hover:text-white active:scale-95"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
