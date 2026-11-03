# Android Gallery & Photo Saving Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ensure captured photos and photobooth strips on Android seamlessly index and save directly into the device's Gallery / Google Photos.

**Architecture:**
- **Tier 1 (Direct to Pictures):** Implement Chromium `window.showSaveFilePicker()` with `startIn: "pictures"` on supported Android browsers so the file saves into the Android `Pictures` folder, which `MediaStore` indexes directly into Gallery apps.
- **Tier 2 (Native Share Sheet):** Fall back to Web Share API (`navigator.share({ files: [file] })`) on mobile devices so users can pick Google Photos ("Upload to Photos"), Quick Share, or device storage.
- **Tier 3 (Blob URL Anchor with explicit MIME):** When falling back to anchor download, use `URL.createObjectURL(blob)` instead of raw data URIs, ensuring Android Chrome's download manager sets the correct MIME type so Android's `MediaScanner` immediately scans it into the Photos/Download album.
- **In-App Mobile Guidance:** Update modals and preview screens with dual iOS/Android hints (e.g. how to save directly to Gallery or Google Photos).

## Constraints
- Strict Ponytail discipline: minimal diff, standard web APIs, zero extra libraries.
- No direct unauthorized git commits or pushes without user request.
- Cross-platform safety: preserve iOS Safari behavior (`navigator.share` / long-press).

---

### Task 1: Enhance `src/lib/media-export.ts` with File System Access & Blob Downloads

**Files:**
- Modify: `C:/Users/SahithMovva/OpenBooth/src/lib/media-export.ts`

- [x] **Step 1: Implement `downloadBlobUrl` using `URL.createObjectURL`**
  - Revoke URL safely after trigger.
- [x] **Step 2: Add `trySaveFilePicker` with `startIn: 'pictures'`**
  - Check `if (typeof window !== 'undefined' && 'showSaveFilePicker' in window)`
  - Provide `suggestedName`, `startIn: "pictures"`, and `types: [{ accept: { [mime]: [`.${ext}`] } }]`
  - Write file stream and return `'saved'`
- [x] **Step 3: Update `exportOrShareImage` priority ladder**
  - On mobile/desktop where user chooses, or priority flow:
    - Attempt File System Access (`showSaveFilePicker`) if on supported Chromium Android/desktop when direct save is preferred, or prioritize Web Share on mobile, with Blob URL download as safe fallback.
- [x] **Step 4: Verify type safety and compilation**

---

### Task 2: Update Gallery & Tray Modal Prompts for Android

**Files:**
- Modify: `C:/Users/SahithMovva/OpenBooth/src/routes/gallery.tsx`
- Modify: `C:/Users/SahithMovva/OpenBooth/src/components/PolaroidTray.tsx`

- [x] **Step 1: Update modal hint in `gallery.tsx`**
  - Show platform-aware or inclusive tip:
    "Tip: On iPhone hold image to 'Save to Photos'. On Android tap 'Save to Photos / Share' to send to Google Photos or save directly to your Pictures folder."
- [x] **Step 2: Verify `npm run lint` and `npm run build`**
