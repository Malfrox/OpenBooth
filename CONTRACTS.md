# OpenBooth - Cross-Domain Contracts

## 1. Media Data Models

```typescript
export interface CapturedFrame {
  id: string;
  dataUrl: string; // Base64 image/png or image/jpeg
  timestamp: number;
  filter: string; // e.g., 'kodak-gold', 'fuji-superia', 'bw-contrast'
}

export interface PhotoStripConfig {
  frames: CapturedFrame[]; // Typically 3 or 4 frames
  layout: "vertical-4" | "polaroid" | "grid-2x2";
  borderColor: string;
  showTimestamp: boolean;
  brandingText?: string;
}
```

## 2. Audio Subsystem Contract

- `playCountdownBeep(frequency?: number): void`
- `playShutterSound(): void`
- Audio generated deterministically via Web Audio API oscillators/noise buffers (no external audio assets required).

## 3. UI Token Standards

- Tactile analog aesthetic: warm neutrals, textured backgrounds, mechanical toggle states, vintage film typography accents.
