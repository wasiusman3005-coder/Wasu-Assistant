/**
 * Web Audio API Synthesizer for Quantum Jarvis OS
 * Generates futuristic sci-fi sound effects in real-time without external assets.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  public soundEnabled = true;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playClick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext policy fallback
    }
  }

  playBeepConfirm() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Note 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1320, now + 0.09); // E6
      gain2.gain.setValueAtTime(0.12, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.22);
    } catch {
      // AudioContext policy fallback
    }
  }

  playQuantumStartup() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Deep Sub Sweep
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "triangle";
      sub.frequency.setValueAtTime(60, now);
      sub.frequency.exponentialRampToValueAtTime(240, now + 1.2);
      subGain.gain.setValueAtTime(0.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 1.4);

      // High Shimmer Chime
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = "sine";
      shimmer.frequency.setValueAtTime(520, now + 0.3);
      shimmer.frequency.exponentialRampToValueAtTime(2093, now + 1.1); // C7
      shimmerGain.gain.setValueAtTime(0.15, now + 0.3);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmer.start(now + 0.3);
      shimmer.stop(now + 1.5);
    } catch {
      // AudioContext policy fallback
    }
  }

  playAlert() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(900, now + 0.12);
      osc.frequency.setValueAtTime(600, now + 0.24);
      osc.frequency.setValueAtTime(900, now + 0.36);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // AudioContext policy fallback
    }
  }

  playScan() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(1800, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // AudioContext policy fallback
    }
  }

  startQuantumBinauralHum() {
    if (!this.soundEnabled) return;
    try {
      if (this.humOsc) return;
      const ctx = this.getContext();
      this.humOsc = ctx.createOscillator();
      this.humGain = ctx.createGain();

      this.humOsc.type = "sine";
      this.humOsc.frequency.setValueAtTime(108, ctx.currentTime); // 108Hz grounding quantum hum

      this.humGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.humGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(ctx.destination);
      this.humOsc.start();
    } catch {
      // Fallback
    }
  }

  stopQuantumBinauralHum() {
    try {
      if (this.humGain && this.ctx) {
        this.humGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.humOsc) {
            this.humOsc.stop();
            this.humOsc.disconnect();
            this.humOsc = null;
          }
          this.humGain = null;
        }, 500);
      }
    } catch {
      this.humOsc = null;
      this.humGain = null;
    }
  }

  playQuantumWarp() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // AudioContext policy fallback
    }
  }

  playShockwave() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Sub Bass Thud
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(180, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.4);
      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.45);

      // Cyber Laser Resonance
      const laser = ctx.createOscillator();
      const laserGain = ctx.createGain();
      laser.type = "triangle";
      laser.frequency.setValueAtTime(2200, now);
      laser.frequency.exponentialRampToValueAtTime(440, now + 0.25);
      laserGain.gain.setValueAtTime(0.12, now);
      laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      laser.connect(laserGain);
      laserGain.connect(ctx.destination);
      laser.start(now);
      laser.stop(now + 0.3);
    } catch {
      // AudioContext policy fallback
    }
  }

  playResonanceChime(frequency = 528) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // AudioContext policy fallback
    }
  }
}

export const soundEffects = new SoundEffectsService();
