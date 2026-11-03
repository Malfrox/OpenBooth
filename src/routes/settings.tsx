import { createFileRoute } from "@tanstack/react-router";
import { Download, SwitchCamera, Layers } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useBooth } from "@/lib/photobooth-context";
import { downloadPhotoStrip } from "@/lib/strip-generator";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Open Booth" },
      {
        name: "description",
        content: "Timer, camera, quality and export preferences for your photobooth.",
      },
      { property: "og:title", content: "Settings — Open Booth" },
      {
        property: "og:description",
        content: "Timer, camera, quality and export preferences for your photobooth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings, photos } = useBooth();

  const handleDownloadStrip = async () => {
    if (photos.length === 0) {
      toast.error("Take some photos first!");
      return;
    }
    try {
      await downloadPhotoStrip({
        photos,
        settings,
        format: settings.format,
      });
      toast.success("Photo strip downloaded!");
    } catch {
      toast.error("Failed to generate photo strip");
    }
  };

  const handleDownloadAll = () => {
    if (photos.length === 0) {
      toast.error("No photos to download");
      return;
    }
    const fallbackTitle = settings.title.trim() || "photobooth";
    photos.forEach((photo, i) => {
      const a = document.createElement("a");
      a.href = photo.dataUrl;
      a.download = `${fallbackTitle}-${i + 1}.${settings.format}`;
      a.click();
    });
    toast.success(`Downloaded ${photos.length} photo(s)`);
  };

  return (
    <AppShell>
      <section className="pt-6">
        <h1 className="type-h2">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tune your booth</p>
      </section>

      <div className="mt-6 grid gap-6 pb-12 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4">
          <h2 className="type-h3">Capture</h2>

          <div className="mt-4">
            <p className="type-label mb-1.5">Timer</p>
            <div className="grid grid-cols-4 gap-2">
              {([0, 3, 5, 10] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateSettings({ timer: t })}
                  className={`btn-secondary justify-center px-2 ${
                    settings.timer === t
                      ? "border-primary bg-primary/8 text-primary"
                      : "hover:border-secondary hover:bg-secondary/8"
                  }`}
                >
                  {t === 0 ? "Off" : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="type-label mb-1.5 block" htmlFor="title">
              Photo title (optional)
            </label>
            <input
              id="title"
              className="field-input"
              placeholder="Optional title (e.g. Saturday Night)"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
            />
          </div>

          <button
            type="button"
            className="btn-secondary mt-4 w-full justify-center"
            onClick={() =>
              updateSettings({
                facingMode: settings.facingMode === "user" ? "environment" : "user",
              })
            }
          >
            <SwitchCamera size={18} />
            Flip camera
          </button>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h2 className="type-h3">Export</h2>

          <div className="mt-4">
            <label className="type-label mb-1.5 block" htmlFor="format">
              Format
            </label>
            <select
              id="format"
              className="field-input"
              value={settings.format}
              onChange={(e) => updateSettings({ format: e.target.value as "png" | "jpeg" })}
            >
              <option value="png">PNG — best quality</option>
              <option value="jpeg">JPG — smaller file</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="type-label mb-1.5 block" htmlFor="size">
              Resolution
            </label>
            <select
              id="size"
              className="field-input"
              value={`${settings.resolution.w}x${settings.resolution.h}`}
              onChange={(e) => {
                const parts = e.target.value.split("x").map(Number);
                updateSettings({ resolution: { w: parts[0] ?? 1080, h: parts[1] ?? 1920 } });
              }}
            >
              <option value="1080x1920">1080 × 1920</option>
              <option value="1440x2560">1440 × 2560</option>
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              className="btn-primary w-full justify-center"
              onClick={handleDownloadStrip}
              disabled={photos.length === 0}
            >
              <Layers size={18} />
              Download 4-Strip ({Math.min(photos.length, 4)})
            </button>

            <button
              type="button"
              className="btn-secondary w-full justify-center"
              onClick={handleDownloadAll}
              disabled={photos.length === 0}
            >
              <Download size={18} />
              Get all individual photos ({photos.length})
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
