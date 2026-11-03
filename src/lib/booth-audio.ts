import { useState, useEffect, useCallback } from "react";

// Singleton AudioContext reference across the client lifecycle
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

/**
 * Get or initialize the Web Audio context.
 * Safely handles autoplay restrictions by resuming on interaction.
 */
export function initAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return null;

    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioCtx();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {
        // Autoplay policy may block until genuine user interaction
      });
    }

    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Configure global sound output toggle.
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/**
 * Get current sound enabled state.
 */
export function getSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Play a retro countdown beep synthesized with Web Audio.
 * Defaults to 600Hz, 80ms duration.
 */
export function playCountdownBeep(freq = 600, duration = 0.08): void {
  if (!soundEnabled) return;
  const ctx = initAudio();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
    return;
  }
  if (ctx.state !== "running") return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope: quick attack, clean decay to avoid clicks
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}

/**
 * Play a realistic mechanical photobooth shutter sound.
 * Combines two mechanical impulse clicks (blade opening & closing)
 * layered with filtered white noise burst and body resonance.
 */
export function playShutterClick(): void {
  if (!soundEnabled) return;
  const ctx = initAudio();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
    return;
  }
  if (ctx.state !== "running") return;

  try {
    const now = ctx.currentTime;

    // Helper: generate a single mechanical burst click
    const createClickBurst = (
      startTime: number,
      duration: number,
      bandFreq: number,
      volume: number,
    ) => {
      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Noise with sharp exponential decay
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp((-i / bufferSize) * 6);
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(bandFreq, startTime);
      bandpass.Q.setValueAtTime(2.5, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(startTime);
      noiseSource.stop(startTime + duration);
    };

    // Shutter phase 1: First curtain / mechanical mirror flap (t = 0)
    createClickBurst(now, 0.035, 1800, 0.45);

    // Body resonance (thump)
    const thumpOsc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thumpOsc.type = "triangle";
    thumpOsc.frequency.setValueAtTime(160, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

    thumpGain.gain.setValueAtTime(0.4, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.05);

    // Shutter phase 2: Second curtain snap / latch close (t = +45ms)
    createClickBurst(now + 0.045, 0.04, 2400, 0.5);
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}

/**
 * Hook providing audio controls and automatic interaction listener
 * to unlock AudioContext on first user touch/pointerdown.
 */
export function useBoothAudio() {
  const [enabled, setEnabled] = useState<boolean>(() => getSoundEnabled());

  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggleSound = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  }, []);

  const playBeep = useCallback((freq = 600, duration = 0.08) => {
    playCountdownBeep(freq, duration);
  }, []);

  const playShutter = useCallback(() => {
    playShutterClick();
  }, []);

  return {
    soundEnabled: enabled,
    setSoundEnabled: (value: boolean) => {
      soundEnabled = value;
      setEnabled(value);
    },
    toggleSound,
    playCountdownBeep: playBeep,
    playShutterClick: playShutter,
    initAudio,
  };
}
