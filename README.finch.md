# OpenBooth - Finch Project Architecture & Overview

## 1. Executive Summary

OpenBooth is a retro, tactile browser-based photo booth application. It recreates analog mechanical photo booth experiences with real-time camera capture, analog film filters, vertical 4-shot strip generation, Polaroid cards, and client-side media export.

## 2. Stack & Architecture

- **Framework & Runtime**: React 19, TanStack Start (Nitro SSR/server endpoints), TanStack Router (file-based routing under `src/routes`), Vite 8.
- **Styling & UI**: Tailwind CSS v4, Lucide React icons, Sonner toast notifications, custom tactile UI styling (`tw-animate-css`).
- **Core Engineering**:
  - **Camera & Capture**: WebRTC `getUserMedia`, device selection, mirror/orientation handling (`use-camera.ts`, `use-capture.ts`).
  - **Audio Feedback**: Synthesized Web Audio API countdown beeps and mechanical shutter sounds (`booth-audio.ts`).
  - **Filter Engine**: Real-time CSS and canvas shader-style filters (Kodak Gold 200, Fujifilm Superia, Polaroid SX-70, Cinestill 800T, Golden Hour, B&W, Cyberpunk).
  - **Strip & Layout Generation**: HTML5 Canvas rendering for vertical 4-shot photobooth strips with custom borders, branding, and timestamps (`strip-generator.ts`).
  - **Client-Side Export**: Local downloads (PNG/JPEG), clipboard copy, and native Web Share / mobile photo library export (`media-export.ts`).
  - **Privacy**: 100% client-side execution; zero server media uploads.

## 3. Key Routes & Components

- `src/routes/index.tsx`: Main booth interface (ViewfinderHUD, FilterStrip, PolaroidTray, capture flow).
- `src/routes/gallery.tsx`: Session gallery review, strip customization, export actions.
- `src/routes/settings.tsx`: Camera device settings, resolution, aspect ratio, timer duration.
- `src/components/ViewfinderHUD.tsx`: Live camera HUD, grid overlay, shutter button, countdown trigger.
- `src/components/FilterStrip.tsx`: Filter selector strip with live analog previews.
- `src/components/PolaroidTray.tsx`: Polaroid film eject animation and quick-inspect tray.
