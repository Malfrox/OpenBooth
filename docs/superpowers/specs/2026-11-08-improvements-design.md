# Design Document: OpenBooth Improvements

**Author:** Harold Finch (Root / Chief Engineer)  
**Date:** 2026-11-08  
**Branch:** `feat/enhancements-v1`  
**Status:** Approved by Boss

---

## 1. Objectives & Scope

Implement the three suggested architectural and user-experience improvements for OpenBooth:

1. **Web Worker Filter & Rendering Pipeline (`src/workers/filter.worker.ts`)**
   - Provide non-blocking canvas image processing and strip rendering support via OffscreenCanvas / Web Workers where supported, maintaining synchronous/canvas fallback for legacy or non-worker environments.
2. **Offline PWA Capabilities (`public/sw.js`, `manifest.json`, Registration)**
   - Add progressive web app support with manifest, icons, and a lightweight Service Worker caching static assets and web fonts for full offline photobooth operation at remote events or low-signal venues.
3. **Burst / Animated GIF / Motion Preview Export (`src/lib/burst-generator.ts`)**
   - Provide multi-frame burst capture capabilities and export options (generating looping animated sequence or multi-frame montage) alongside existing static photobooth strips in the Gallery.

---

## 2. Technical Architecture & Component Decisions

### 2.1 Web Worker Processing Pipeline

- **Worker file**: `src/workers/filter.worker.ts`
- **Helper abstraction**: `src/lib/worker-pipeline.ts`
- **Behavior**: Uses `OffscreenCanvas` when available to perform pixel-level adjustments or heavy image compositing off the main UI thread. If `OffscreenCanvas` or Worker is unavailable, transparently falls back to main thread Canvas.

### 2.2 Offline PWA

- **Manifest**: `public/manifest.webmanifest` defining booth app metadata, theme color (`#1c1917`), background color, and icons.
- **Service Worker**: `public/sw.js` implementing Cache-First / Stale-While-Revalidate for application shell, styles, and font assets.
- **Registration**: Registered cleanly in `src/routes/__root.tsx` on client-side mount.

### 2.3 Burst & Animated Preview Export

- **Capture Hook**: Extend `useCapture` or provide `captureBurst(count: number, intervalMs: number)` to snapshot 3 rapid succession frames.
- **Export Utility**: `src/lib/burst-generator.ts` with frame sequence player and animated loop generator (canvas-based animated webm/gif frame export).
- **Gallery Integration**: Add burst action button and preview in Gallery page.

---

## 3. Constraints & Principles

- 100% Client-Side: Zero server storage or external API calls.
- Fail-safe fallback: If browser lacks Web Worker or Service Worker support, the existing sync path functions seamlessly.
- Non-breaking changes: Existing photo strip format and single photo capture continue to work as expected.
