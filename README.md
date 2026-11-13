# Q-NEXUS: Quantum Tachyon Jarvis OS (4K UHD Edition)

An advanced, high-privacy, **4K UHD** cyberpunk AI Desktop Operating Assistant featuring a **Full-Body Cyber Girlfriend (Zoya)** with voice/text-controlled full-body movements, crystal-clear **Pakistani Urdu female voice**, 7 switchable **Quantum Fields HUD themes** synced with 3D holographic cores, Google Maps geospatial tracking, digital device bridge, Creative Media Studio (Image, Video, Thumbnail & Auto Social Poster), and PC Desktop App packaging via Python & Electron.

---

## Key Features
- **Full-Body Cyber Girlfriend (Zoya):** Single photorealistic full-body female tactical humanoid combining her dark-haired cybernetic face with the white tactical jumpsuit, black ribbed cuffs, black thigh holster, and white buckled combat boots, executing **11 live body movements** (*Wave / Haath Hilao, Dance, Catwalk, 360° Spin, Flying Kiss, Warm Hug, Commander Salute, Sit, Thruster Jump, Nod, Standby*) via voice, text chat, wake words, or 1-click controls.
- **Clear Pakistani Urdu Female Voice:** Prioritizes server-side **Gemini Neural TTS (`gemini-3.8-flash-lite-tts` / `Kore`)** tuned for natural Islamabad/Lahore Pakistani Urdu female pronunciation, optional **ElevenLabs** neural voices, plus `ur-PK` female synthesis fallback.
- **7 Quantum Fields & Synced 3D Logos:** Switch between 7 futuristic HUD interfaces (*Cockpit Field, Vector HUD 4, Aegis S.H.I.E.L.D. OS, Tesseract Carbon, Stark Mark III, Cosmic Nebula, Mark LXXXV*) with synchronized 3D Three.js holograms rendered at up to 3x DPI (`4K UHD`).
- **Privacy & Security Suite:** Password-protected Quantum Security Gate (`wasu3005`), Privacy Cloak screen redaction, Air-Gap telemetry kill-switch, and local server-side API proxy (`/api/*`).
- **Creative Studio & Automation:** In-chat & Studio Image/Video generation, Thumbnail Maker, Auto Social Post scheduler, Screen Help vision analyzer, YouTube Link analyzer, and Google Maps / IoT device bridge.

---

## 1. Push This Project to Your GitHub Repository

Run these commands inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Q-NEXUS Quantum Jarvis OS UHD with Full-Body Cyber Girlfriend & Python PC App"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/q-nexus-quantum-jarvis.git
git push -u origin main
```

---

## 2. Run & Install as a Windows PC Desktop App via Python

### Option A: Instant 1-Click Installer & Launcher (Windows)
1. Install **Python 3.10+** (`python.org`) and **Node.js 20+ LTS** (`nodejs.org`).
2. Copy `.env.example` to `.env` and add your keys (`GEMINI_API_KEY`, optional `ELEVENLABS_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY`).
3. Double-click **`install_and_run.bat`** (or run in PowerShell/CMD):
   ```bat
   install_and_run.bat
   ```
   It automatically installs Python + Node packages, builds the UHD bundle, creates a Windows Desktop launcher, and opens **Q-NEXUS Jarvis OS** in a **4K UHD Desktop Window**.

### Option B: Run Manually with Python
```bash
pip install -r requirements.txt
npm install
npm run build
python jarvis_desktop.py
```

### Option C: Convert into Standalone `.exe` & PC Installer (`QuantumJarvisOS.exe`)
```bash
python build_pc_app.py
```
This compiles a standalone Windows executable inside `dist_pc/QuantumJarvisOS.exe` and creates a **Quantum Jarvis OS** shortcut directly on your Desktop.

---

## 3. Linux / macOS Quick Install
```bash
chmod +x install_and_run.sh
./install_and_run.sh
```

---

## Environment Variables (`.env`)
See `.env.example` for all supported variables:
- `GEMINI_API_KEY` — Server-side Gemini AI chat, screen vision, image/video, & Pakistani Urdu Neural TTS
- `ELEVENLABS_API_KEY` — Optional ElevenLabs ultra-realistic voice engine
- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps geospatial radar key

---

## License
MIT License — see [LICENSE](LICENSE).
