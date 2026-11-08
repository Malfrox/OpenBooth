# OpenBooth Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Web Worker rendering offload, Offline PWA service worker support, and Burst / Animated sequence export for OpenBooth.

**Architecture:** Add modular worker pipeline for heavy canvas operations with automatic fallback; register PWA service worker & manifest in root route; add burst capture and animated sequence preview/export in booth & gallery.

**Tech Stack:** React 19, Vite 8, TanStack Router, Canvas API, Web Audio API, Service Worker API.

**Spec:** `docs/superpowers/specs/2026-11-08-improvements-design.md`

## Global Constraints

- Pure client-side operation with 100% privacy and zero server telemetry.
- Must cleanly degrade if Web Workers, OffscreenCanvas, or Service Workers are not supported.
- Type-safe TypeScript throughout.

---

### Task 1: Offline PWA Support (Manifest & Service Worker)

**Files:**

- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Create `public/manifest.webmanifest`**
- [ ] **Step 2: Create `public/sw.js` with Cache-First strategy for assets and Stale-While-Revalidate for app routes**
- [ ] **Step 3: Register Service Worker and manifest link in `src/routes/__root.tsx`**

---

### Task 2: Web Worker Filter & Canvas Pipeline

**Files:**

- Create: `src/workers/filter.worker.ts`
- Create: `src/lib/worker-pipeline.ts`
- Modify: `src/lib/strip-generator.ts`

- [ ] **Step 1: Create `src/workers/filter.worker.ts` for OffscreenCanvas manipulation**
- [ ] **Step 2: Create `src/lib/worker-pipeline.ts` with feature detection and graceful fallback**
- [ ] **Step 3: Wire strip generator to use worker offload when available**

---

### Task 3: Burst Capture & Looping Motion Export

**Files:**

- Create: `src/lib/burst-generator.ts`
- Modify: `src/hooks/use-capture.ts`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/gallery.tsx`

- [ ] **Step 1: Create `src/lib/burst-generator.ts` to assemble multi-frame animated sequences**
- [ ] **Step 2: Add `captureBurst` method to `src/hooks/use-capture.ts`**
- [ ] **Step 3: Add burst mode toggle / trigger to `src/routes/index.tsx`**
- [ ] **Step 4: Add animated burst preview and download action in `src/routes/gallery.tsx`**

---

### Task 4: Integration Verification & Build Check

**Files:**

- Run build & lint checks
- Verify no TypeScript or runtime errors

- [ ] **Step 1: Run `npm run build` to verify type checking and bundling**
- [ ] **Step 2: Commit changes to branch `feat/enhancements-v1`**
