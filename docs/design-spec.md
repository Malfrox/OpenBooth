# Open Booth

# **Open Booth — Complete Design Specification**

## **1. COLOR PALETTE**

### **Primary Colors**

| **Use**               | **Name**          | **Hex** | **RGB**       | **Notes**                         |
| --------------------- | ----------------- | ------- | ------------- | --------------------------------- |
| Page Background       | Cream             | #F9F7F3 | 249, 247, 243 | Off-white, warm undertone         |
| Primary Action Button | Terracotta        | #D97040 | 217, 112, 64  | Warm, tactile, captures attention |
| Secondary Action      | Sage Green        | #6BA89E | 107, 168, 158 | Muted teal, retro-friendly        |
| Text Primary          | Warm Charcoal     | #3D3830 | 61, 56, 48    | Not pure black, warm cast         |
| Text Secondary        | Muted Brown       | #8B8680 | 139, 134, 128 | Supporting copy, labels           |
| Borders & Dividers    | Soft Tan          | #D4D0C8 | 212, 208, 200 | Subtle, photo-paper feel          |
| Accent Success        | Film Gold         | #D4A574 | 212, 165, 116 | Confirmation, highlights          |
| Hover State           | Darker Terracotta | #C25A2E | 194, 90, 46   | Primary button hover              |

### **Dark Mode Palette (Optional, minimal use)**

| **Use**               | **Hex** | **Notes**            |
| --------------------- | ------- | -------------------- |
| Background            | #1A1815 | Deep warm dark       |
| Card/Surface          | #2A2520 | Slightly lighter     |
| Text Primary          | #F5F3EF | Off-white            |
| Terracotta (adjusted) | #E8956F | Lighter for contrast |

### **Semantic Colors**

| **State**       | **Color**  | **Hex** | **Use**                               |
| --------------- | ---------- | ------- | ------------------------------------- |
| Success         | Film Gold  | #D4A574 | ✓ Photo captured, filter applied      |
| Warning/Pending | Soft Amber | #E8B85D | ⏳ Timer running, processing          |
| Error           | Rust Red   | #A85245 | ✗ Camera access denied, export failed |
| Info/Hint       | Soft Sage  | #A8C5BE | ℹ️ Helper text, tips                  |

---

## **2. TYPOGRAPHY**

### **Font Choices**

| **Role**                       | **Font Family**                        | **Fallback Stack**                               | **Rationale**                                      |
| ------------------------------ | -------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **Serif (Headlines)**          | Georgia or Crimson Text (Google Fonts) | Georgia, serif                                   | Warm, handwritten feel; retro without being cheesy |
| **Sans-serif (Body/Controls)** | Inter or Outfit (Google Fonts)         | system-ui, -apple-system, 'Segoe UI', sans-serif | Clean, modern, highly legible at small sizes       |
| **Monospace (Timer, Codes)**   | IBM Plex Mono (Google Fonts)           | 'Courier New', monospace                         | Mechanical, retro photobooth timer feel            |

### **Type Scale**

| **Element**                   | **Font** | **Size** | **Weight** | **Line Height** | **Letter Spacing** | **Notes**                      |
| ----------------------------- | -------- | -------- | ---------- | --------------- | ------------------ | ------------------------------ |
| **H1** (Page Title)           | Serif    | 32px     | 600        | 1.2             | -0.5px             | "Photobooth" header            |
| **H2** (Section Title)        | Serif    | 24px     | 500        | 1.3             | -0.3px             | "Vintage Filters", "Templates" |
| **H3** (Card Title)           | Serif    | 18px     | 500        | 1.4             | -0.2px             | Filter names, template names   |
| **Body** (Regular)            | Sans     | 16px     | 400        | 1.6             | 0                  | Main copy, descriptions        |
| **Body Small**                | Sans     | 14px     | 400        | 1.5             | 0                  | Secondary text, helper text    |
| **Label** (Buttons, Controls) | Sans     | 14px     | 500        | 1.4             | 0.5px              | Button text, form labels       |
| **Caption**                   | Sans     | 12px     | 400        | 1.4             | 0.3px              | Timestamps, metadata, hints    |
| **Timer** (Countdown)         | Mono     | 48px     | 700        | 1               | 0                  | Large, bold, mechanical        |

### **Color Application**

| **Element**    | **Color**                 | **Hex**                  |
| -------------- | ------------------------- | ------------------------ |
| H1, H2, H3     | Warm Charcoal             | #3D3830                  |
| Body Text      | Warm Charcoal             | #3D3830                  |
| Secondary Text | Muted Brown               | #8B8680                  |
| Disabled Text  | Muted Brown (60% opacity) | rgba(139, 134, 128, 0.6) |
| Links/Actions  | Terracotta                | #D97040                  |

---

## **3. SPACING & LAYOUT**

### **Spacing Scale (Base unit: 8px)**

| **Token** | **px** | **Ratio** | **Uses**                                   |
| --------- | ------ | --------- | ------------------------------------------ |
| xs        | 4px    | —         | Tight spacing within components            |
| sm        | 8px    | 1x        | Padding inside buttons, gaps between icons |
| md        | 16px   | 2x        | Card padding, section gaps                 |
| lg        | 24px   | 3x        | Between major sections                     |
| xl        | 32px   | 4x        | Page-level margins, large breathing room   |
| xxl       | 48px   | 6x        | Top/bottom margins on full sections        |

### **Layout Grid**

- **Container width**: 360px (mobile) → 800px (tablet) → 1200px (desktop)
- **Gutter**: 16px on mobile, 24px on desktop
- **Column count**: 1 (mobile) → 2 (tablet) → 3 (desktop)

### **Safe Zones**

| **Area**     | **Spacing**                      | **Reason**                  |
| ------------ | -------------------------------- | --------------------------- |
| Top (header) | 16px padding                     | Account for status bar      |
| Bottom (nav) | 16px padding + safe area         | Thumb reach, notch safety   |
| Sides        | 16px on mobile, 24px+ on desktop | Breathing room, readability |

---

## **4. COMPONENT SPECIFICATIONS**

### **A. Capture Button (Hero CTA)**

- **Size**: 64px diameter (circular)
- **Background**: Terracotta (#D97040)
- **Border**: None
- **Border-radius**: 50% (perfect circle)
- **Box-shadow**: 0 4px 12px rgba(217, 112, 64, 0.25)
- **Icon**: Camera icon (Tabler `ti-camera`), 28px, white
- **Position**: Center-bottom of screen, 24px from bottom

**Hover state:**

- Background: Darker Terracotta (#C25A2E)
- Scale: 1.05x
- Shadow: 0 6px 16px rgba(217, 112, 64, 0.35)

**Active state:**

- Scale: 0.95x
- Shadow: 0 2px 6px rgba(217, 112, 64, 0.15)
- Flash overlay: White fade (200ms)

---

### **B. Filter Strips (Horizontal Scroll)**

**Container:**

- Height: 100px
- Background: rgba(212, 208, 200, 0.3) (soft border, no solid fill)
- Border-top: 0.5px solid #D4D0C8
- Padding: 8px 16px
- Overflow-x: auto (smooth scroll)
- Gap: 12px between items

**Individual Filter Tile:**

- Width: 70px
- Height: 84px
- Background: white (#F9F7F3)
- Border: 1px solid #D4D0C8
- Border-radius: 4px
- Padding: 4px

**Thumbnail (inside):**

- Size: 62x56px
- Object-fit: cover
- Border-radius: 2px

**Label (below):**

- Font: Sans, 11px, 400
- Color: Muted Brown (#8B8680)
- Truncate: 1 line
- Text-align: center
- Margin-top: 4px

**Hover state:**

- Border: 1px solid Sage Green (#6BA89E)
- Box-shadow: 0 2px 8px rgba(107, 168, 158, 0.15)

**Selected state:**

- Border: 2px solid Terracotta (#D97040)
- Background: rgba(217, 112, 64, 0.05)

---

### **C. Template Selector Cards**

**Grid Layout:**

- Columns: 2 on mobile, 3 on desktop
- Gap: 12px
- Container padding: 16px

**Individual Card:**

- Width: 100% (flex)
- Aspect ratio: 1:1 (square)
- Background: white (#F9F7F3)
- Border: 1px solid #D4D0C8
- Border-radius: 6px
- Padding: 8px
- Overflow: hidden

**Template Preview:**

- SVG or canvas illustration
- Shows layout (e.g., 2x2 grid, strip)
- Subtle color: Muted (grays, soft accents)
- Size: Fill card minus padding

**Label (below card):**

- Font: Serif, 14px, 500
- Color: Warm Charcoal (#3D3830)
- Margin-top: 8px

**Hover state:**

- Border: 1px solid Sage Green (#6BA89E)
- Box-shadow: 0 4px 12px rgba(107, 168, 158, 0.12)
- Translate: 0 -2px (subtle lift)

**Selected state:**

- Border: 2px solid Terracotta (#D97040)
- Background: rgba(217, 112, 64, 0.08)
- Box-shadow: 0 4px 16px rgba(217, 112, 64, 0.15)

---

### **D. Secondary Buttons (Gallery, Settings, Download)**

**Base:**

- Height: 44px (touch target)
- Padding: 8px 16px
- Background: white (#F9F7F3)
- Border: 1px solid #D4D0C8
- Border-radius: 6px
- Font: Sans, 14px, 500
- Color: Warm Charcoal (#3D3830)
- Display: flex, align-items: center, gap: 8px

**Icon (if present):**

- Size: 18px
- Color: inherit from text

**Hover state:**

- Background: rgba(107, 168, 158, 0.08)
- Border: 1px solid Sage Green (#6BA89E)
- Cursor: pointer

**Active state:**

- Scale: 0.97x
- Background: rgba(107, 168, 158, 0.12)

**Disabled state:**

- Opacity: 0.5
- Cursor: not-allowed

---

### **E. Form Inputs (e.g., collage title, export settings)**

**Container:**

- Width: 100%
- Margin-bottom: 16px

**Label:**

- Font: Sans, 14px, 500
- Color: Warm Charcoal (#3D3830)
- Margin-bottom: 6px

**Input Field:**

- Height: 40px
- Padding: 8px 12px
- Background: white (#F9F7F3)
- Border: 1px solid #D4D0C8
- Border-radius: 4px
- Font: Sans, 14px, 400
- Color: Warm Charcoal (#3D3830)

**Placeholder:**

- Color: Muted Brown (#8B8680)
- Opacity: 1 (not faded)

**Focus state:**

- Border: 1px solid Sage Green (#6BA89E)
- Box-shadow: 0 0 0 3px rgba(107, 168, 158, 0.1)
- Outline: none

---

## **5. SCREEN LAYOUTS & SPACING**

### **A. Main Photobooth Screen**

```
┌────────────────────────────────────────┐
│  Header (16px padding)                  │
│  "Photobooth" (Serif H1)                │
│  Subtitle: "Ready?" (Sans, small)       │
├────────────────────────────────────────┤
│                                         │
│      🎥 LIVE CAMERA PREVIEW            │
│      (Full width - 16px margin)         │
│      (Aspect ratio: 9:16 on mobile)    │
│      (Grid overlay, soft vignette)      │
│                                         │
│      [________64px CAPTURE BUTTON_____] │
│      Centered, 24px from bottom         │
│                                         │
├────────────────────────────────────────┤
│  FILTER STRIP (scroll horizontal)      │
│  Border-top separates                  │
│  [Vintage|Modern|Effects] ➜            │
│                                         │
├────────────────────────────────────────┤
│  BOTTOM NAV (56px height)               │
│  [Gallery] [Templates] [Settings]      │
│  Icons + Labels, centered               │
└────────────────────────────────────────┘
```

**Spacing:**

- Header top: 16px
- Camera preview: full-bleed margins (16px)
- Capture button: 24px from bottom nav
- Filter strip: 12px padding internal
- Nav: 56px fixed height, 8px icon margin

---

### **B. Templates Screen**

```
┌────────────────────────────────────────┐
│  Header: "Choose Layout" (24px top)    │
│  Subtitle: "Pick your style" (8px gap) │
├────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ 2x2 Grid │  │  Strip   │           │
│  │ Preview  │  │ Preview  │           │
│  └──────────┘  └──────────┘           │
│   Gap: 12px between cards              │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ Collage  │  │ Polyptych│           │
│  │ Preview  │  │ Preview  │           │
│  └──────────┘  └──────────┘           │
│                                         │
├────────────────────────────────────────┤
│  [Back] [Confirm Selection]            │
│  Buttons at bottom, 16px gap           │
└────────────────────────────────────────┘
```

---

### **C. Collage Builder Screen**

```
┌────────────────────────────────────────┐
│  "Build Your Collage" (H2)             │
│  "Drag & arrange" (subtle label)       │
├────────────────────────────────────────┤
│                                         │
│      [Preview Canvas - 100% width]     │
│      Show collage layout + placed photos│
│                                         │
├────────────────────────────────────────┤
│  "Available Photos" (H3, 16px top)     │
│                                         │
│  [Photo 1] [Photo 2] [Photo 3]        │
│  Horizontal scroll, 8px gaps           │
│                                         │
├────────────────────────────────────────┤
│  Settings Row:                          │
│  [Background Color] [Spacing] [Border] │
│  Compact controls, 12px gaps           │
│                                         │
├────────────────────────────────────────┤
│  [Cancel] [Save & Download]            │
│  Full-width buttons, 8px gap           │
└────────────────────────────────────────┘
```

---

## **6. FILTER THUMBNAIL DESIGN**

### **Visual Style**

- **Thumbnail Dimensions**: 62px wide × 56px tall
- **Border**: 1px subtle, rounded 2px
- **Applied Filter**: Use LUT or canvas filter
- **Label Placement**: Below thumbnail, centered
- **Label Truncate**: "Kodak Gold 200" → "Kodak G…" (if overflow)

### **Color Palette for Names**

- **Vintage Group**: Serif labels, warm beige accent border
- **Modern Group**: Clean sans labels, sage accent border
- **Effects Group**: Bold sans labels, terracotta accent border

**Examples:**

- "Kodak Gold 200" (Serif, 11px, Muted Brown)
- "Fujifilm Superia" (Serif, 11px, Muted Brown)
- "Neon 80s" (Sans, 11px, Muted Brown)
- "B&W Film Grain" (Sans, 11px, Muted Brown)

### **Filter Groups Visual Distinction**

**VINTAGE FILTERS:**

- Serif group label above strip
- Thumbnails show: slightly faded colors, warm grain
- Border accent on selected: warm terracotta

**MODERN FILTERS:**

- Clean sans group label
- Thumbnails show: vibrant, smooth, polished
- Border accent: sage green

**EFFECTS:**

- Bold sans label
- Thumbnails show: distortion/blur preview
- Border accent: film gold

---

## **7. MICRO-INTERACTIONS & ANIMATIONS**

### **A. Capture Button Press**

**Timeline:**

```
[Tap]
↓ (0ms) Scale: 1 → 0.95, Box-shadow reduces
↓ (50ms) Flash overlay appears (white, opacity 1)
↓ (150ms) Flash fades out (opacity 0)
↓ (200ms) Photo preview slides up from bottom
↓ (300ms) Button returns to normal scale (1.0)
```

- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1) (spring-like)
- **Total**: 300ms
- **Sound**: Optional camera shutter (20-50ms)

---

### **B. Filter Selection**

**Timeline:**

```
[Tap filter]
↓ (0ms) Preview updates (canvas re-renders)
↓ (100ms) Filter name fades in above preview
↓ (150ms) Filter strip item gets highlight border
↓ (200ms) Name fades out (auto-hide after 1.5s)
```

- **Easing**: ease-out
- **Total**: 200ms
- **Feedback**: Haptic pulse (if available)

---

### **C. Template Selection**

**Timeline:**

```
[Tap template]
↓ (0ms) Card scales to 1.02x (subtle)
↓ (50ms) Border animates to accent color
↓ (100ms) Background tint fades in
↓ (200ms) Other cards fade to 0.6 opacity
↓ (300ms) Confirmation state reached
```

- **Easing**: ease-out
- **Total**: 300ms

---

### **D. Photo Capture Success**

**Timeline:**

```
[Photo captured]
↓ (0ms) Success toast appears (bottom-center, slide up)
↓ (100ms) Checkmark animates (scale + rotate)
↓ (2000ms) Toast auto-hides (fade out)
```

**Toast Layout:**

- Background: rgba(212, 165, 116, 0.95) (Film Gold)
- Text: "Photo captured!" (white, sans 14px)
- Icon: Checkmark (Tabler `ti-check`)
- Padding: 12px 16px
- Border-radius: 6px
- Position: Bottom-center, 16px from bottom

---

### **E. Page Transitions**

**Enter new screen:**

- Fade in: 200ms (from opacity 0 → 1)
- Slide up: 200ms (from translateY +16px → 0)

**Exit current screen:**

- Fade out: 150ms
- Slide down: 150ms (translateY -16px)

- **Easing**: ease-out
- **Stagger**: Stagger child elements by 30ms for depth

---

## **8. RESPONSIVE DESIGN**

### **Breakpoints**

| **Device**  | **Width** | **Layout Notes**                          |
| ----------- | --------- | ----------------------------------------- |
| **Mobile**  | ≤480px    | 1 column, full-width buttons, stacked nav |
| **Tablet**  | 481–768px | 2 columns (filters), side nav             |
| **Desktop** | ≥769px    | 3 columns, top nav, wider spacing         |

### **Mobile-Specific Adjustments**

**Camera Preview:**

- Height: max(60vh, 360px) (portrait safe)
- Aspect ratio: 9:16 (portrait lock recommended)

**Buttons:**

- Min height: 44px (touch target)
- Min width: 44px (touch target)
- Padding: 12px 16px (larger for thumbs)

**Filter Strip:**

- Scroll direction: Horizontal (thumb-friendly)
- Tile size: 70px (large enough to tap)

**Templates Grid:**

- 2 columns on mobile (not 3)
- Larger previews for clarity

**Bottom Nav:**

- Fixed, 56px height
- Icons + labels centered
- Safe area padding on notched devices

**Spacing:**

- Margins: 16px (not 24px+)
- Gaps: 8–12px (compact but breathable)

### **Desktop-Specific Adjustments**

**Camera Preview:**

- Width: 50% (left side of screen)
- Sidebar: 50% (filters, templates, gallery on right)

**Layouts:**

- Top nav (horizontal) instead of bottom
- 3-column grid for templates
- Larger type scales (18px body)

**Spacing:**

- Margins: 24px+
- Gaps: 16px–24px
- Breathing room emphasized

---

## **9. FILTER & EFFECT VISUAL SPECS**

### **Vintage Filters Library**

| Filter Name      | Grain | Vignette | Color Cast  | LUT Strength |
| ---------------- | ----- | -------- | ----------- | ------------ |
| Kodak Gold 200   | 15%   | Soft     | Warm yellow | 0.8          |
| Fujifilm Superia | 12%   | Medium   | Green cast  | 0.75         |
| Agfa Precisa     | 8%    | None     | Cool blue   | 0.7          |
| Polaroid SX70    | 20%   | Strong   | Warm, faded | 0.85         |
| Film Noir        | 25%   | Heavy    | B&W         | 1.0          |
| Cinestill 800T   | 18%   | Soft     | Orange/cyan | 0.8          |

### **Modern Filters Library**

| Filter Name | Style             | Saturation | Contrast |
| ----------- | ----------------- | ---------- | -------- |
| Vibrant     | High-sat, pop     | +40%       | +20%     |
| Pastel      | Desaturated, soft | -30%       | -10%     |
| Neon 80s    | Acid colors       | +60%       | +30%     |
| Moody Blue  | Cool tones        | -20%       | +15%     |
| Golden Hour | Warm, glowy       | +15%       | 0%       |
| Cyberpunk   | High contrast     | +20%       | +50%     |

### **Effects Library**

| Effect Name       | Behavior                            |
| ----------------- | ----------------------------------- |
| Light Leak (warm) | Organic light bloom, top-left       |
| Light Leak (cool) | Blue/cyan glow, top-right           |
| Film Grain        | Noise overlay, adjustable           |
| Vignette          | Darkened edges, adjustable strength |
| Glitch            | RGB offset distortion               |
| Fisheye           | Barrel distortion                   |
| Bokeh             | Blur + light particles              |
| Cross Lens Flare  | Star-like effect from bright areas  |

---

## **10. TEMPLATE PREVIEW DESIGNS**

### **Template 1: 2x2 Grid**

```
Visual:
┌─────┬─────┐
│  1  │  2  │
├─────┼─────┤
│  3  │  4  │
└─────┴─────┘
```

- **Spacing**: 8px between photos
- **Border**: 1px #D4D0C8
- **Aspect**: 1:1 square per cell
- **Label**: "2x2 Grid" (Serif, 14px)

---

### **Template 2: Photobooth Strip**

```
Visual:
┌─────────┐
│    1    │  ← 1:1 aspect
├─────────┤
│    2    │  8px gap
├─────────┤
│    3    │
├─────────┤
│    4    │
└─────────┘
```

- **Width**: Full-width photo
- **Spacing**: 8px between photos
- **Label**: "Photobooth Strip" (Serif, 14px)

---

### **Template 3: Mixed Collage**

```
Visual:
┌──────────┬────┐
│          │    │  ← Large photo (left)
│    1     │ 2  │    + 2 stacked small
│          │    │
│          ├────┤
│          │ 3  │
├──────────┴────┘
│    4          │  ← Large photo (bottom)
└───────────────┘
```

- **Ratios**: 1.5x1.5 : 1 : 1 : 2x1
- **Spacing**: 8px gaps
- **Label**: "Mixed" (Serif, 14px)

---

### **Template 4: Polyptych (5-panel)**

```
Visual:
┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │  5  │     │
└─────┴─────┴─────┘
```

- **Spacing**: 6px between photos
- **Aspect**: Mixed (3x in top, 2x in bottom, 1 empty)
- **Label**: "Polyptych" (Serif, 14px)

---

## **11. EMPTY STATES & FEEDBACK**

### **Empty Gallery**

- **Icon**: Camera icon (Tabler `ti-camera-off`, 48px, Sage Green)
- **Heading**: "No photos yet" (Serif H2)
- **Body**: "Press the button to capture your first shot" (Sans, secondary)
- **CTA**: [Ready to capture?] (Button, Terracotta)
- **Spacing**: Icon 24px from heading, heading 12px from body, body 24px from CTA

---

### **Camera Access Denied**

- **Icon**: Lock icon (Tabler `ti-lock`, 48px, Rust Red)
- **Heading**: "Camera access needed" (Serif H2)
- **Body**: "Allow camera access in settings to use photobooth" (Sans)
- **CTA**: [Open Settings] (Button, Terracotta)

---

### **Filter Applying (Loading State)**

- **Icon**: Spinner animation (Tabler `ti-loader`, 24px, fade pulse)
- **Text**: "Applying filter..." (Sans, 14px, secondary)
- **Display**: Brief, 200–500ms max
- **Position**: Center of preview

---

### **Toast Notifications**

- **Success**: Green checkmark + "Photo saved!" (white text, Film Gold bg)
- **Error**: Red exclamation + "Export failed. Try again." (white text, Rust Red bg)
- **Info**: Blue info icon + "Timer set to 5s" (dark text, Soft Sage bg)
- **Position**: Bottom-center, 16px from bottom
- **Duration**: 2–4 seconds (auto-dismiss)

---

## **12. ACCESSIBILITY STANDARDS**

### **Color Contrast**

- All text vs. background: ≥4.5:1 (AA compliance)
- UI elements (buttons, icons): ≥3:1 (AA compliance)
- Dark mode adjustments to maintain ratios

### **Touch Targets**

- Min size: 44×44px (mobile)
- Min spacing: 8px between targets
- Capture button: 64px (generous)

### **Keyboard Navigation**

- Tab order: Logical (left-to-right, top-to-bottom)
- Focus indicator: Visible outline or border
- Focus style: Sage Green border + shadow (visible in light & dark)

### **Semantic HTML**

- Buttons: `<button>` (not divs)
- Links: `<a href="">` (with aria-label if icon-only)
- Images: alt text for all photos
- Form labels: Associated with `<label for="">` or aria-label

### **Reduced Motion**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **Dark Mode Support**

```css
@media (prefers-color-scheme: dark) {
  /* Text colors invert for readability */
  /* Background becomes dark (#1A1815) */
  /* Border colors lighten slightly */
  /* No logo/imagery color shifts needed (use SVG with currentColor) */
}
```

---

## **13. COMPLETE COMPONENT CHECKLIST**

- ✓ **Camera Preview** — Full-width, live feed, grid overlay, vignette
- ✓ **Capture Button** — 64px circle, terracotta, centered bottom, glow shadow
- ✓ **Filter Strip** — Horizontal scroll, thumbnail + label, 70px tiles
- ✓ **Template Grid** — 2-col mobile, 3-col desktop, card design
- ✓ **Collage Builder** — Drag/drop canvas, photo queue, background settings
- ✓ **Export Modal** — Format/resolution options, download CTA
- ✓ **Gallery Sidebar** — Thumbnails, delete button, usage stats
- ✓ **Settings Panel** — Timer options, camera flip, quality, auto-save
- ✓ **Bottom Nav** — Fixed, 56px, icon + label, 4 tabs
- ✓ **Toast Notifications** — Success, error, info states
- ✓ **Empty States** — Camera denied, no photos, loading
- ✓ **Focus Indicators** — Keyboard navigation, visible outlines

---

## **14. FINAL DESIGN PRINCIPLES (Summary)**

1. **Warmth Over Cold** — Terracotta, cream, soft grays. No harsh blacks or neons (except accent).
2. **Tactile & Physical** — Buttons feel pressable. Feedback is immediate (flash, scale, sound).
3. **Hero Photography** — Camera preview dominates. Controls are supporting players.
4. **Instant Gratification** — No spinners or waits. Photos appear immediately.
5. **Playful Copy** — "Ready?" not "Begin capture". "Get your photos" not "Download".
6. **Serif Warmth** — Headlines use serif for personality; body uses clean sans for clarity.
7. **Minimal Chrome** — No unnecessary borders, gradients, or decorations.
8. **Mobile-First** — Responsive scaling, generous touch targets, thumb-friendly layout.

---

## **15. READY TO BUILD**

This spec is your source of truth. Export as:

- **Figma Design File** — Components library (Button, Filter Tile, Template Card, etc.)
- **Design Tokens JSON** — Colors, typography, spacing (for dev sync)
- **Storybook** — Interactive component documentation
- **CSS Spec** — Exact hex/px values for frontend team

**🎬 Ready to build the photobooth app!**

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
