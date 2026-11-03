# Gallery & iOS Photo Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the `/gallery` route in OpenBooth and enable direct "Save to Photos" on iOS/mobile devices via Web Share API alongside native long-press support.

**Architecture:**
- Create a cross-platform helper `src/lib/media-export.ts` using Web Share API (`navigator.share({ files })`) with fallback to anchor download and image-preview modal for long-press saving.
- Create `/gallery` route (`src/routes/gallery.tsx`) featuring captured photo grid, retro 4-strip generator with live image preview modal, individual downloads/shares, and batch management.
- Update `AppShell.tsx` navigation to include the Gallery tab on both desktop and mobile bottom navigation.
- Fix `PolaroidTray.tsx` by enabling touch events/long-press on Polaroid preview images and integrating the native Web Share helper for one-tap iOS photo saving.
- Update `strip-generator.ts` to export strip sharing utilities.

**Tech Stack:** React 19, TanStack Router / TanStack Start, Tailwind CSS v4, Lucide React, Sonner.

## Global Constraints
- Strictly adhere to SOUL.md rules: no git commits or git pushes unless explicitly directed by the boss.
- Mandatory Ponytail discipline: clean, minimal diff, zero unnecessary dependencies, verified build & linting.
- Mobile/iOS compliance: preserve long-press context menus (`touch-action`, `-webkit-touch-callout: default`, no `pointer-events-none` on rendered images) and support `navigator.share({ files: [file] })`.

---

### Task 1: Cross-Platform Media Export Helper (`src/lib/media-export.ts`)

**Files:**
- Create: `C:/Users/SahithMovva/OpenBooth/src/lib/media-export.ts`

**Interfaces:**
- Produces:
  - `dataUrlToFile(dataUrl: string, filename: string): Promise<File>`
  - `exportOrShareImage(options: { dataUrl: string; filename: string; title?: string }): Promise<'shared' | 'downloaded'>`
  - `canNativeShareFiles(): boolean`

- [ ] **Step 1: Implement `src/lib/media-export.ts`**
  - Convert base64 data URLs to Blobs and `File` objects.
  - Check `navigator.canShare?.({ files: [file] })`. If supported, invoke `navigator.share({ files: [file], title })`.
  - Fall back to standard anchor click download.

---

### Task 2: Fix iOS Long-Press & Add One-Tap Share in `PolaroidTray.tsx`

**Files:**
- Modify: `C:/Users/SahithMovva/OpenBooth/src/components/PolaroidTray.tsx`

**Interfaces:**
- Consumes: `exportOrShareImage` from `src/lib/media-export.ts`

- [ ] **Step 1: Remove `pointer-events-none select-none` from Polaroid `<img>`**
  - Enable iOS Safari context menu so users can long-press and tap "Save to Photos".
- [ ] **Step 2: Connect `exportOrShareImage` to the download/share button**
  - Support both individual photo download/share and 4-strip download/share directly from the tray.

---

### Task 3: Build `/gallery` Route & Full-Screen Image Modal

**Files:**
- Create: `C:/Users/SahithMovva/OpenBooth/src/routes/gallery.tsx`
- Modify: `C:/Users/SahithMovva/OpenBooth/src/components/AppShell.tsx`

**Interfaces:**
- Consumes: `useBooth`, `exportOrShareImage`, `generatePhotoStrip`
- Produces: Route definition for `/gallery` with photo grid, 4-strip preview modal with long-press support and direct save button.

- [ ] **Step 1: Create `src/routes/gallery.tsx`**
  - Gallery view listing all captured photos in reverse chronological order.
  - Strip builder with customizable layout / title.
  - Full-screen modal for any photo or generated strip with an explicit `<img />` allowing long-press "Save to Photos" and a "Save to Photos / Share" action button.
- [ ] **Step 2: Add Gallery tab to `src/components/AppShell.tsx`**
  - Add `{ to: "/gallery", label: "Gallery", icon: Images }` to `tabs`.

---

### Task 4: Type Check & Production Build Verification

- [ ] **Step 1: Run `npm run build`**
  - Verify route tree generation and TypeScript compilation.
- [ ] **Step 2: Verify git status remains uncommitted**
