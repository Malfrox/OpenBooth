import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Photo = { id: string; dataUrl: string; filterCss: string; timestamp: number };

export type BoothSettings = {
  timer: number; // 0 | 3 | 5 | 10
  facingMode: "user" | "environment";
  format: "png" | "jpeg";
  resolution: { w: number; h: number };
  title: string;
};

type Ctx = {
  photos: Photo[];
  addPhoto: (p: Photo) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  selectedFilter: string;
  setSelectedFilter: (css: string) => void;
  selectedFilterName: string;
  setSelectedFilterName: (name: string) => void;
  settings: BoothSettings;
  updateSettings: (patch: Partial<BoothSettings>) => void;
};

const BoothContext = createContext<Ctx | null>(null);

const defaultSettings: BoothSettings = {
  timer: 3,
  facingMode: "user",
  format: "png",
  resolution: { w: 1080, h: 1440 },
  title: "",
};

export const BoothProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [selectedFilterName, setSelectedFilterName] = useState("Normal");
  const [settings, setSettings] = useState<BoothSettings>(defaultSettings);

  const addPhoto = useCallback((p: Photo) => setPhotos((prev) => [p, ...prev]), []);
  const removePhoto = useCallback(
    (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id)),
    [],
  );
  const clearPhotos = useCallback(() => setPhotos([]), []);
  const updateSettings = useCallback(
    (patch: Partial<BoothSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [],
  );

  return (
    <BoothContext.Provider
      value={{
        photos,
        addPhoto,
        removePhoto,
        clearPhotos,
        selectedFilter,
        setSelectedFilter,
        selectedFilterName,
        setSelectedFilterName,
        settings,
        updateSettings,
      }}
    >
      {children}
    </BoothContext.Provider>
  );
};

export function useBooth() {
  const ctx = useContext(BoothContext);
  if (!ctx) throw new Error("useBooth must be used within BoothProvider");
  return ctx;
}
