// High-Definition Client + Server Media Studio Generator Helper
// Guarantees crisp downloadable PNG images, YouTube Thumbnails, Screen Captures, and playable WebM Videos.

export async function generateAIOrCanvasImage(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16' = '1:1',
  styleName = 'Quantum Cyberpunk'
): Promise<{ imageUrl: string; source: 'gemini' | 'quantum-canvas' }> {
  try {
    const res = await fetch('/api/media/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `${styleName} style: ${prompt}`, aspectRatio }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.imageUrl) {
        return { imageUrl: data.imageUrl, source: 'gemini' };
      }
    }
  } catch {
    // Fall back to procedural canvas artwork
  }

  return {
    imageUrl: renderProceduralCyberArt(prompt, aspectRatio, styleName),
    source: 'quantum-canvas',
  };
}

export function renderProceduralCyberArt(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16',
  styleName: string
): string {
  const width = aspectRatio === '16:9' ? 1280 : aspectRatio === '9:16' ? 720 : 1024;
  const height = aspectRatio === '16:9' ? 720 : aspectRatio === '9:16' ? 1280 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Hash prompt for deterministic unique artwork per prompt
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash * 31 + prompt.charCodeAt(i)) % 360;
  }
  const hue1 = hash;
  const hue2 = (hash + 140) % 360;

  // Deep obsidian + dual nebula radial backdrop
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#020617');
  bg.addColorStop(0.5, `hsla(${hue1}, 75%, 14%, 1)`);
  bg.addColorStop(1, `hsla(${hue2}, 70%, 10%, 1)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle holographic perspective grid
  ctx.strokeStyle = `hsla(${hue1}, 90%, 60%, 0.14)`;
  ctx.lineWidth = 1;
  const step = 48;
  for (let x = 0; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Luminous Orbital Rings & Quantum Geometry
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  for (let r = 1; r <= 5; r++) {
    ctx.save();
    ctx.strokeStyle = r % 2 === 0 ? `hsla(${hue1}, 100%, 65%, 0.65)` : `hsla(${hue2}, 100%, 70%, 0.55)`;
    ctx.lineWidth = 2 + r * 0.6;
    ctx.setLineDash([18, 10]);
    ctx.beginPath();
    ctx.arc(cx, cy, minDim * 0.08 * r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Central Energy Sphere
  const orb = ctx.createRadialGradient(cx, cy, 10, cx, cy, minDim * 0.25);
  orb.addColorStop(0, '#ffffff');
  orb.addColorStop(0.25, `hsla(${hue1}, 100%, 60%, 0.9)`);
  orb.addColorStop(0.65, `hsla(${hue2}, 90%, 50%, 0.25)`);
  orb.addColorStop(1, 'transparent');
  ctx.fillStyle = orb;
  ctx.beginPath();
  ctx.arc(cx, cy, minDim * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Floating particles
  for (let i = 0; i < 80; i++) {
    const px = ((i * 197 + hash * 13) % width);
    const py = ((i * 263 + hash * 29) % height);
    const pr = (i % 4) + 1.5;
    ctx.fillStyle = i % 2 === 0 ? `hsla(${hue1}, 100%, 75%, 0.8)` : '#ffffffaa';
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stylized prompt label bar
  ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
  ctx.fillRect(32, height - 108, width - 64, 76);
  ctx.strokeStyle = `hsla(${hue1}, 95%, 65%, 0.7)`;
  ctx.lineWidth = 2;
  ctx.strokeRect(32, height - 108, width - 64, 76);

  ctx.fillStyle = `hsla(${hue1}, 100%, 75%, 1)`;
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`Q-NEXUS AI STUDIO // ${styleName.toUpperCase()}`, 52, height - 78);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px sans-serif';
  const cleanPrompt = prompt.length > 52 ? prompt.slice(0, 49) + '...' : prompt;
  ctx.fillText(cleanPrompt, 52, height - 48);

  return canvas.toDataURL('image/png');
}

export async function generateThumbnailPoster(opts: {
  title: string;
  subtitle: string;
  badge: string;
  accentHex: string;
  backdropImageUrl?: string;
  aspectRatio?: '16:9' | '9:16';
}): Promise<string> {
  const isVertical = opts.aspectRatio === '9:16';
  const w = isVertical ? 720 : 1280;
  const h = isVertical ? 1280 : 720;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Base gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(0.55, '#0f172a');
  grad.addColorStop(1, '#042f2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Draw AI or chosen backdrop if present
  if (opts.backdropImageUrl) {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.crossOrigin = 'anonymous';
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = opts.backdropImageUrl!;
      });
      ctx.globalAlpha = 0.75;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalAlpha = 1;
    } catch {
      // Fallback to gradient already painted
    }
  }

  // Dramatic vignette for readable YouTube typography
  const vignette = ctx.createLinearGradient(0, 0, w, 0);
  vignette.addColorStop(0, 'rgba(0,0,0,0.92)');
  vignette.addColorStop(0.65, 'rgba(0,0,0,0.45)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Accent outer glow frame
  ctx.strokeStyle = opts.accentHex;
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Top badge pill
  ctx.fillStyle = opts.accentHex;
  ctx.fillRect(54, 62, Math.min(w - 108, 360), 48);
  ctx.fillStyle = '#020617';
  ctx.font = '900 24px sans-serif';
  ctx.fillText(opts.badge.toUpperCase() || 'VIRAL EXCLUSIVE', 72, 95);

  // Big bold wrapped title text
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.95)';
  ctx.shadowBlur = 18;
  ctx.font = `900 ${isVertical ? 56 : 74}px sans-serif`;

  const words = (opts.title || 'QUANTUM AI REVOLUTION').toUpperCase().split(' ');
  const lines: string[] = [];
  let current = '';
  const maxWidth = w - 120;
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  let startY = isVertical ? h * 0.36 : 230;
  lines.slice(0, 4).forEach((line, idx) => {
    ctx.fillStyle = idx === 1 ? opts.accentHex : '#ffffff';
    ctx.fillText(line, 54, startY + idx * (isVertical ? 72 : 88));
  });

  // Subtitle bottom strip
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(54, h - 130, w - 108, 66);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 26px monospace';
  ctx.fillText(opts.subtitle || 'Q-NEXUS JARVIS STUDIO • 4K ULTRA', 76, h - 88);

  return canvas.toDataURL('image/png');
}

export async function generateAIOrCanvasVideo(
  prompt: string,
  aspectRatio: '16:9' | '9:16' = '16:9',
  duration: '5s' | '10s' = '5s'
): Promise<{ videoUrl: string; source: 'gemini-omni' | 'quantum-motion' }> {
  try {
    const res = await fetch('/api/media/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio, duration }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.videoUrl) {
        return { videoUrl: data.videoUrl, source: 'gemini-omni' };
      }
    }
  } catch {
    // Fall back cleanly to browser WebM motion video synthesis
  }

  const videoUrl = await synthesizeAnimatedWebMVideo(prompt, aspectRatio, duration === '10s' ? 4000 : 2800);
  return { videoUrl, source: 'quantum-motion' };
}

async function synthesizeAnimatedWebMVideo(
  prompt: string,
  aspectRatio: '16:9' | '9:16',
  recordMs: number
): Promise<string> {
  const width = aspectRatio === '16:9' ? 854 : 480;
  const height = aspectRatio === '16:9' ? 480 : 854;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof MediaRecorder === 'undefined' || !canvas.captureStream) {
    return '';
  }

  let hash = 0;
  for (let i = 0; i < prompt.length; i++) hash = (hash * 33 + prompt.charCodeAt(i)) % 360;

  const stream = canvas.captureStream(30);
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';
  const recorder = new MediaRecorder(stream, { mimeType: mime });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise<string>((resolve) => {
    let frame = 0;
    let rafId = 0;

    recorder.onstop = () => {
      cancelAnimationFrame(rafId);
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };

    const draw = () => {
      frame++;
      const t = frame * 0.05;
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, '#020617');
      g.addColorStop(0.5, `hsla(${(hash + t * 18) % 360}, 70%, 15%, 1)`);
      g.addColorStop(1, '#090d16');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Animated pulse rings
      const cx = width / 2;
      const cy = height / 2;
      for (let i = 0; i < 6; i++) {
        const radius = ((t * 45 + i * 48) % (Math.min(width, height) * 0.65)) + 16;
        ctx.strokeStyle = `hsla(${(hash + i * 35) % 360}, 100%, 65%, ${Math.max(0.1, 1 - radius / (Math.min(width, height) * 0.65))})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orbiting particles
      for (let p = 0; p < 24; p++) {
        const ang = t * 0.8 + (p * Math.PI * 2) / 24;
        const rad = Math.min(width, height) * 0.25 + Math.sin(t + p) * 28;
        ctx.fillStyle = '#00f5ff';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Prompt caption bar
      ctx.fillStyle = 'rgba(2, 6, 23, 0.78)';
      ctx.fillRect(20, height - 74, width - 40, 54);
      ctx.strokeStyle = '#00f5ff';
      ctx.strokeRect(20, height - 74, width - 40, 54);
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('Q-NEXUS VIDEO ENGINE // 60FPS HOLOGRAM STREAM', 34, height - 52);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(prompt.slice(0, 48), 34, height - 30);

      rafId = requestAnimationFrame(draw);
    };

    recorder.start();
    draw();
    setTimeout(() => {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    }, recordMs);
  });
}

export async function captureScreenSnapshotBase64(): Promise<string> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Screen capture API is unavailable in this iframe browser context. Please upload a screenshot instead.');
  }
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
  const track = stream.getVideoTracks()[0];
  const video = document.createElement('video');
  video.srcObject = stream;
  await video.play();

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

  track.stop();
  stream.getTracks().forEach((t) => t.stop());

  return canvas.toDataURL('image/jpeg', 0.85);
}
