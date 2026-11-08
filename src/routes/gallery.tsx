import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Share2, Trash2, Layers, X, Camera, Info, Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useBooth, type Photo } from "@/lib/photobooth-context";
import { generatePhotoStrip } from "@/lib/strip-generator";
import { createBurstCollage } from "@/lib/burst-generator";
import { exportOrShareImage } from "@/lib/media-export";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Open Booth" },
      {
        name: "description",
        content: "Browse captured photos and download retro photobooth strips.",
      },
      { property: "og:title", content: "Gallery — Open Booth" },
      {
        property: "og:description",
        content: "Browse captured photos and download retro photobooth strips.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { photos, removePhoto, clearPhotos, settings } = useBooth();

  // Modal states
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [stripModalUrl, setStripModalUrl] = useState<string | null>(null);
  const [isGeneratingStrip, setIsGeneratingStrip] = useState(false);
  const [isGeneratingBurst, setIsGeneratingBurst] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleCreateStrip = async () => {
    if (photos.length === 0) {
      toast.error("Take some photos first!");
      return;
    }
    try {
      setIsGeneratingStrip(true);
      const stripDataUrl = await generatePhotoStrip({
        photos,
        settings,
        format: settings?.format || "png",
      });
      setStripModalUrl(stripDataUrl);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate photo strip");
    } finally {
      setIsGeneratingStrip(false);
    }
  };

  const handleCreateBurst = async () => {
    if (photos.length === 0) {
      toast.error("Take some photos first!");
      return;
    }
    try {
      setIsGeneratingBurst(true);
      const burstUrl = await createBurstCollage(photos);
      setStripModalUrl(burstUrl);
      toast.success("Motion burst montage generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate burst montage");
    } finally {
      setIsGeneratingBurst(false);
    }
  };

  const handleShareOrSave = async (
    dataUrl: string,
    filename: string,
    title?: string,
    onSuccess?: () => void,
  ) => {
    try {
      const userTitle = (title ?? settings?.title ?? "").trim();
      const res = await exportOrShareImage({
        dataUrl,
        filename,
        ...(userTitle ? { title: userTitle } : {}),
      });
      if (res === "shared") {
        toast.success("Opened share sheet / Saved");
      } else if (res === "saved") {
        toast.success("Saved to Pictures / Photos");
      } else {
        toast.success("Photo downloaded");
      }
      onSuccess?.();
    } catch {
      toast.error("Failed to export photo");
    }
  };

  const handleDownloadSingle = async (photo: Photo, index: number) => {
    setDownloadingId(photo.id);
    const baseTitle =
      (settings?.title || "photobooth").trim().toLowerCase().replace(/\s+/g, "-") || "photobooth";
    const ext = settings?.format || "png";
    const filename = `${baseTitle}-${Date.now().toString().slice(-4)}-${index + 1}.${ext}`;
    const userTitle = (settings?.title || "").trim();

    await handleShareOrSave(photo.dataUrl, filename, userTitle || undefined, () => {
      setDownloadingId(photo.id);
      setTimeout(() => setDownloadingId(null), 1200);
    });
  };

  const handleStripExport = async () => {
    if (!stripModalUrl) return;
    const baseTitle =
      (settings?.title || "photobooth").trim().toLowerCase().replace(/\s+/g, "-") || "photobooth";
    const ext = settings?.format || "png";
    const filename = `${baseTitle}-strip-${Date.now().toString().slice(-4)}.${ext}`;
    const userTitle = (settings?.title || "").trim();
    const shareTitle = userTitle ? `${userTitle} Photo Strip` : "Photo Strip";

    await handleShareOrSave(stripModalUrl, filename, shareTitle);
  };

  const handleDeletePhoto = (id: string) => {
    removePhoto(id);
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
    toast.success("Photo removed");
  };

  const handleClearAll = () => {
    clearPhotos();
    setIsConfirmingClear(false);
    setSelectedPhoto(null);
    setStripModalUrl(null);
    toast.success("Gallery cleared");
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(timestamp));
    } catch {
      return "";
    }
  };

  return (
    <AppShell>
      <div className="py-6">
        {/* Header section */}
        <section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="type-h2">Gallery</h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {photos.length} {photos.length === 1 ? "photo" : "photos"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your captured photobooth memories. Tap to view or hold to save.
            </p>
          </div>

          {photos.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCreateStrip}
                disabled={isGeneratingStrip}
                className="btn-primary flex items-center gap-1.5"
              >
                <Layers size={16} />
                <span>
                  {isGeneratingStrip
                    ? "Generating..."
                    : photos.length >= 4
                      ? "Create 4-Strip"
                      : `Create ${photos.length}-Strip`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCreateBurst}
                disabled={isGeneratingBurst}
                className="btn-secondary flex items-center gap-1.5"
              >
                <Camera size={16} />
                <span>{isGeneratingBurst ? "Generating..." : "Burst Montage"}</span>
              </button>

              {isConfirmingClear ? (
                <div className="flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 p-1">
                  <span className="px-2 text-xs font-medium text-destructive">Clear all?</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground hover:opacity-90"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(false)}
                    className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(true)}
                  className="btn-secondary text-muted-foreground hover:text-destructive"
                  title="Clear all photos"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Empty State */}
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 shadow-inner">
              <Camera className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <h2 className="type-h3 text-foreground">No photos yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Step into the photobooth to snap vintage-filtered pictures and generate your retro
              print strips.
            </p>
            <Link to="/" className="btn-primary mt-6 inline-flex items-center gap-2">
              <Camera size={16} />
              <span>Open the Booth</span>
            </Link>
          </div>
        ) : (
          /* Grid of photos */
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xs transition hover:shadow-md"
              >
                {/* Photo container - iOS long-press compliant */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPhoto(photo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedPhoto(photo);
                    }
                  }}
                  className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-muted/40"
                  aria-label={`View photo taken at ${formatDate(photo.timestamp)}`}
                >
                  <img
                    src={photo.dataUrl}
                    alt={`OpenBooth snapshot ${index + 1}`}
                    style={{ filter: photo.filterCss }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay for desktop */}
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>

                {/* Footer metadata & actions */}
                <div className="flex items-center justify-between border-t border-border/60 bg-card px-2.5 py-2">
                  <div className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <Calendar size={12} className="shrink-0" />
                    <span className="truncate">{formatDate(photo.timestamp)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(photo, index)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                      title="Save or Share"
                    >
                      {downloadingId === photo.id ? (
                        <Check size={14} className="text-primary" />
                      ) : (
                        <Share2 size={14} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                      title="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full-Screen Preview Modal for Single Photo */}
        {selectedPhoto && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="type-caption font-medium text-foreground">
                  Photo Preview • {formatDate(selectedPhoto.timestamp)}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Image body with iOS long-press callout */}
              <div className="relative flex flex-1 items-center justify-center overflow-auto bg-black/30 p-2 sm:p-4">
                <img
                  src={selectedPhoto.dataUrl}
                  alt="Full-size snapshot preview"
                  style={{ filter: selectedPhoto.filterCss }}
                  className="max-h-[60vh] w-auto max-w-full rounded-md object-contain shadow-lg"
                />
              </div>

              {/* Mobile hint */}
              <div className="flex items-center gap-1.5 border-t border-border/50 bg-secondary/5 px-4 py-2 text-xs text-muted-foreground">
                <Info size={14} className="shrink-0 text-primary" />
                <span>
                  Tip: On iPhone hold image to “Save to Photos”. On Android, tap “Save to Photos /
                  Share” to send directly to Google Photos or save to your Pictures folder.
                </span>
              </div>

              {/* Modal actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card p-4">
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="btn-secondary text-destructive hover:border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const ext = settings?.format || "png";
                      const userTitle = (settings?.title || "").trim();
                      handleShareOrSave(
                        selectedPhoto.dataUrl,
                        `openbooth-${selectedPhoto.id.slice(0, 6)}.${ext}`,
                        userTitle || undefined,
                      );
                    }}
                    className="btn-primary flex items-center gap-1.5"
                  >
                    <Share2 size={16} />
                    <span>Save to Photos / Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4-Strip Preview Modal */}
        {stripModalUrl && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setStripModalUrl(null)}
          >
            <div
              className="relative flex max-h-[95vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="type-caption font-medium text-foreground">Photobooth Strip</span>
                <button
                  type="button"
                  onClick={() => setStripModalUrl(null)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close strip modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Strip Image */}
              <div className="relative flex flex-1 items-center justify-center overflow-auto bg-[#1a1714] p-4">
                <img
                  src={stripModalUrl}
                  alt="Rendered photobooth strip"
                  className="max-h-[62vh] w-auto max-w-full rounded shadow-2xl"
                />
              </div>

              {/* Mobile hint */}
              <div className="flex items-center gap-1.5 border-t border-border/50 bg-secondary/5 px-4 py-2 text-xs text-muted-foreground">
                <Info size={14} className="shrink-0 text-primary" />
                <span>
                  Tip: On iPhone hold image to “Save to Photos”. On Android, tap “Save to Photos /
                  Share” to send directly to Google Photos or save to your Pictures folder.
                </span>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-border bg-card p-4">
                <button
                  type="button"
                  onClick={() => setStripModalUrl(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleStripExport}
                  className="btn-primary flex items-center gap-1.5"
                >
                  <Download size={16} />
                  <span>Save to Photos / Share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
