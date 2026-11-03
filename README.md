# OpenBooth

<div align="center">

<p align="center">
  <a href="https://openbooth.vercel.app">
    <img src="assets/demo.gif" alt="OpenBooth Demo" width="720" style="border-radius: 12px; max-width: 100%;" />
  </a>
</p>

# OpenBooth

**The retro, tactile photo booth experience right in your browser.**

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start%20%2F%20Router-FF4154)](https://tanstack.com/router)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMalfrox%2FOpenBooth)

[**Try Live Demo**](https://openbooth.vercel.app) · [**Report Bug**](https://github.com/Malfrox/OpenBooth/issues)

</div>

---

## Overview

**OpenBooth** brings back the analog joy of mechanical photo booths with a warm, tactile design. Capture instant portraits, test curated analog film tones, and export authentic 4-photo vertical strips and Polaroid frames directly from your browser—with zero server uploads.

### ✨ Live Demo & One-Click Deploy

Experience OpenBooth in action:  
👉 **[openbooth.vercel.app](https://openbooth.vercel.app)**

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMalfrox%2FOpenBooth)

---

## Key Features

- **📸 Tactile Viewfinder & Camera HUD**
  - Live mirror preview with rule-of-thirds alignment grid and subtle vignette.
  - Cycleable countdown timer (`Off`, `3s`, `5s`, `10s`) with audio countdown beeps and mechanical shutter feedback.
  - Quick front/rear camera flip for mobile and dual-camera devices.
  - Authentic flash animation on capture.

- **🎞️ Vintage Photo Strip & Polaroid Layouts**
  - Generates classic vertical 4-shot photobooth strips complete with timestamps and custom branding.
  - Individual polaroid cards with instant preview and download controls.
  - Customizable borders, frames, and export formats (PNG/JPEG).

- **🎨 Curated Analog Film Filters**
  - **Vintage Film:** *Kodak Gold 200*, *Fujifilm Superia*, *Polaroid SX70*, *Cinestill 800T*.
  - **Monochrome & Classic:** *Classic B&W*, *High Contrast B&W*, *Normal*.
  - **Creative & Effects:** *Golden Hour*, *Pastel*, *Vibrant*, *Cyberpunk*.
  - Real-time CSS canvas shader filtering for latency-free live preview.

- **🔒 Privacy First & 100% Client-Side**
  - All video processing, filter rendering, and photo strip assembly happen locally on your device via HTML5 Canvas.
  - Photos and camera feeds never leave your browser—zero server storage, tracking, or telemetry.

- **⚡ Modern, Ultra-Fast Stack**
  - Powered by **React 19**, **TanStack Start / TanStack Router**, **Tailwind CSS v4**, and **Vite**.
  - Accessible toast notifications via **Sonner** and icons from **Lucide**.

---

## Quick Start (Run Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Malfrox/OpenBooth.git
   cd OpenBooth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal). Grant camera permissions when prompted.

---

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Starts Vite development server with hot-reload |
| `npm run build` | Builds client & server bundles for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint checks across project files |
| `npm run format` | Formats codebase with Prettier |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [React 19](https://react.dev/) & [TanStack Start](https://tanstack.com/router) |
| **Routing** | [TanStack Router](https://tanstack.com/router) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [tw-animate-css](https://github.com) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications**| [Sonner](https://sonner.emilkowal.ski/) |
| **Tooling** | [Vite 8](https://vitejs.dev/), TypeScript, Nitro |
| **Deployment** | [Vercel](https://vercel.com) |

---

## Design System

OpenBooth is built around a warm, vintage-inspired palette:

- **Cream (`#F9F7F3`)**: Off-white photo-paper backdrop
- **Terracotta (`#D97040`)**: Tactile shutter action button
- **Sage Green (`#6BA89E`)**: Retro secondary accents
- **Warm Charcoal (`#3D3830`)**: High-legibility headline tone
- **Film Gold (`#D4A574`)**: Golden hour and success state highlight

---

## Contributing

Contributions, feature ideas, and pull requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` or repository root for details.

---

<div align="center">
  <sub>Built with ❤️ for photobooth lovers. Inspired by analog photobooths and classic film.</sub>
</div>
