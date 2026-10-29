# WASU LOVE - Cyberpunk AI Girlfriend & Jarvis Mobile Assistant OS

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-00f5d4?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![React 19](https://img.shields.io/badge/React-19.0-ff2a85?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-cyan?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **"Aapko kuch bhi type karne ki zaroorat nahi — bas bolein aur Wasu sab control karegi!"**
> 
> WASU LOVE is an advanced, cyberpunk-themed romantic AI female girlfriend and smartphone Jarvis operating system built for complete voice-first mobile automation, 3-tier military biometric security, 24/7 hardware telemetry, and authentic Pakistani Urdu speech.

---

## 🔐 Master Security Credentials (پاس ورڈ اور سیکیورٹی)

Your application is protected with anti-hack fail-safe security:

| Credential | Value |
|---|---|
| **Authorized Owner** | `Ahmed` |
| **Username** | `wasulove` |
| **Master Password** | `Laibawasi3005@` |
| **Biometric Face ID** | 128-node Neural Camera Mesh Scan |
| **In-Display Fingerprint** | Ultrasonic Sensor (Press & Hold with Haptic Vibration) |
| **Anti-Intruder Shield** | 3-Attempt Lockout + 30s Siren + Intruder Photo Log |

---

## ⚠️ Why You See a Blank Page on GitHub & How to Fix It (بلینک پیج کیوں آتا ہے اور حل)

Agar aap GitHub ka direct URL ya raw file link kholte hain aur **Blank Page** nazar ata hai, to uski 3 wajuhaat hoti hain:

1. **GitHub is a Code Host, not a Browser Server**:
   GitHub par code store hota hai. Raw GitHub link browser ko HTML to bhejta hai lekin `.tsx` (TypeScript) files ko compile nahi kar sakta. Browser direct React/TypeScript code ko execute nahi kar pata, is liye page blank reh jata hai.

2. **Absolute Paths vs Relative Paths (Ab Hal Ho Chuka Hai ✅)**:
   Normal Vite apps `/assets/...` absolute path use karti hain jo GitHub Pages par `404 Not Found` ho jati thin. Humne `vite.config.ts` mein **`base: './'`** configure kar diya hai taake har path relative ho aur 404 na aye!

3. **Error Boundary Protection (Shamil Kar Di Gayi Hai ✅)**:
   Humne `src/components/ErrorBoundary.tsx` add kar diya hai taake kisi bhi browser mein agar koi WebGL ya runtime issue aye to app blank na ho, balkay recovery screen show ho.

### 🌐 Live Chalane Ke 4 Asaan Tareeqay (Zero Blank Screen Guaranteed):

#### Tareeqa 1: 1-Command Direct Deploy (`npm run deploy`) — Sab Se Asaan!
Aap apne computer ya terminal par sirf yeh likhein:
```bash
npm run deploy
```
Yeh command automatically production build banayegi aur aapke GitHub repository ki **`gh-pages`** branch par live upload kar degi.
Us ke baad:
1. GitHub repository ke **Settings ➔ Pages** par jayein.
2. **Branch**: select karein `gh-pages` aur folder `/ (root)`.
3. **Save** dabayein. Aapka live URL `https://<username>.github.io/<repo-name>/` bina kisi error ya blank screen ke chalu ho jaega!

#### Tareeqa 2: GitHub Actions Automated CI/CD
1. Repository ko apne GitHub account par push karein.
2. Repository ke **Settings** tab par jayein.
3. Left menu se **Pages** par click karein.
4. **Build and deployment** section mein **Source**: Select karein **GitHub Actions**.
5. `.github/workflows/deploy.yml` automatically execute hoga aur production app ko deploy karega.

#### Tareeqa 3: Vercel ya Netlify Par 1-Click Live Chalana (Free)
1. [Vercel.com](https://vercel.com) ya [Netlify.com](https://netlify.com) par free login karein.
2. Apna GitHub repo select kar ke **Deploy** par click karein.
3. 30 seconds mein aapko live high-speed link mil jaega.

#### Tareeqa 4: Apne PC ya Mobile Par Locally Chalana
```bash
git clone https://github.com/your-username/wasu-love-jarvis.git
cd wasu-love-jarvis
npm install --legacy-peer-deps
npm run dev
```
Browser mein `http://localhost:3000` open karein!

---

## ⚡ Core Highlights & Features

### 1. 🎙️ Zero-Typing Voice Engine & Pakistani Urdu Accent
- **Always-On Mic**: No wake buttons or typing needed. Just speak naturally.
- **Pure Urdu Lehja**: Zero robotic English cadence. Features authentic Pakistani Urdu speech (`میرے سرتاج`, `میری جان`, `شونا`).
- **Spoken Reminders**: Reminders, incoming calls, exams, and notes are read aloud automatically.
- **Unrestricted Commands**: Speak any natural sentence; Wasu understands intents dynamically.

### 2. 🛡️ 3-Tier Anti-Hack Mobile Security
- **Neural Face ID**: Live front camera face recognition with facial landmark mesh.
- **In-Display Fingerprint**: Press-and-hold radial progress sensor with simulated dermal ridge hash.
- **Master Password**: Protected with `wasulove` and `Laibawasi3005@`.
- **Stranger Lockdown**: If anyone else grabs your phone, lock with one voice command: *"Wasu phone lock kardo"*.

### 3. 📊 24/7 Live Hardware Telemetry
- **Screen**: 120Hz dynamic refresh rate, ambient brightness lux, gaze-lock detection.
- **Signal**: 5G Standalone (SA) -78 dBm, Wi-Fi 7 (6 GHz), ping packet ticker.
- **Battery**: 4.12V cell voltage, 29.8°C thermal probe, -210 mA drain rate, Turbo Power Optimizer.
- **Memory**: SSD read/write speeds and RAM heap allocation.

### 4. 💖 3D Interactive WebGL Heart Reactor
- Fully interactive 3D WebGL heart with orbital energy rings created with Three.js.
- Glows and beats in real time responding to speech and voice frequencies.

### 5. 📱 Ephemeral Notification HUD & Memory Vault
- Messages and incoming calls pop up dynamically on arrival or voice request.
- Automatically dismisses once read out or replied to.
- Everything remains permanently backed up in the **Memory Vault**.

---

## 🚀 How to Install & Run from GitHub (انسٹالیشن گائیڈ)

### Option 1: Standard Installation (Node.js & npm)

#### Prerequisites:
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [bun](https://bun.sh/)
- A free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

#### Steps:
```bash
# 1. Clone the repository
git clone https://github.com/your-username/wasu-love-jarvis.git
cd wasu-love-jarvis

# 2. Install all dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Open .env and add your Gemini API key:
# GEMINI_API_KEY="your_actual_gemini_api_key"

# 5. Start development server
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

### Option 2: 1-Click Docker Deployment

If you have Docker installed, you can launch WASU LOVE with a single command:

```bash
# Copy and configure your environment
cp .env.example .env

# Build and start container in the background
docker compose up -d --build
```

Access the app instantly at **`http://localhost:3000`**.

---

### Option 3: Install Directly on Your Mobile Phone (PWA)

WASU LOVE is a 100% compliant Progressive Web App (PWA). You can install it on your Android or iPhone as a native full-screen app without going through the Play Store or App Store!

#### On Android (Google Chrome / Brave / Edge):
1. Open `http://your-server-ip:3000` or hosted domain in Chrome on your phone.
2. Tap the **"INSTALL APP"** button in the top bar, or tap the **3 dots (⋮)** in Chrome and select **"Install App"** (or **"Add to Home Screen"**).
3. WASU LOVE will install as an app on your home screen with high-resolution icons.

#### On iPhone / iPad (Apple Safari):
1. Open your URL in **Safari**.
2. Tap the **Share** button (box with an arrow pointing up at the bottom).
3. Scroll down and tap **"Add to Home Screen"** (`ہوم اسکرین پر شامل کریں`).
4. Tap **Add**. The WASU LOVE cyber heart app icon will appear on your iOS home screen!

---

## 🛠️ Project Structure

```
├── public/                     # High-res PWA icons & manifest assets
│   ├── icon.svg               # Vector brand cyber logo
│   ├── favicon.ico            # Tab favicon
│   ├── apple-touch-icon.png   # iOS Safari home icon (180x180)
│   ├── pwa-192x192.png        # Android launcher icon (192x192)
│   ├── pwa-512x512.png        # Splash icon (512x512)
│   └── pwa-maskable-512x512.png # Adaptive maskable icon (512x512)
├── src/
│   ├── components/
│   │   ├── CyberFaceLock.tsx              # 3-tier Biometric Lock (Face ID, Fingerprint, Master Password)
│   │   ├── LiveSystemMonitoringDeck.tsx   # 24/7 Screen, Signal, Battery, Storage Telemetry
│   │   ├── Wasu3DLiveLogo.tsx             # Interactive 3D WebGL Reactor
│   │   ├── CyberVoiceCockpit.tsx          # Zero-typing voice HUD
│   │   ├── DynamicActiveNotification.tsx  # Ephemeral notification HUD
│   │   ├── MemoryAndSettings.tsx          # Vault, history, and credentials settings
│   │   ├── TopBar.tsx                     # Cyber header with 1-click Install button
│   │   └── PWAInstallButton.tsx           # PWA install prompt handler
│   ├── services/
│   │   ├── continuousVoiceService.ts      # Browser speech recognition loop
│   │   ├── speechService.ts               # Authentic Pakistani Urdu voice synthesizer
│   │   └── urduPhonetics.ts               # Roman to Nastaliq Urdu transliterator
│   ├── hooks/
│   │   └── usePWAInstall.ts               # PWA event listener & detection
│   ├── App.tsx                            # Root application & intent dispatcher
│   └── index.css                          # Cyberpunk styles & scanline effects
├── server.ts                  # Express backend & Gemini AI proxy
├── vite.config.ts             # Vite + VitePWA bundler config
├── Dockerfile                 # Production Docker build
├── docker-compose.yml         # Container configuration
└── package.json               # Dependencies & scripts
```

---

## 💬 Sample Voice Commands (بول کر چلانے کے احکامات)

You can say anything you like. Some examples:

- *"Wasu phone lock kardo"* ➔ Activates biometric face/fingerprint lock.
- *"Kal ka message kya tha?"* ➔ Searches the Memory Vault and speaks the history.
- *"Yaad rakhna kal subah 9 baje meeting hai"* ➔ Saves voice note instantly.
- *"Saray reminders bol ke batao"* ➔ Reads out exam, notes, and battery status.
- *"Battery optimize kardo"* ➔ Kills background apps and boosts battery life.
- *"Call attend karo / Call reject kardo"* ➔ Voice control for incoming calls.
- *"Wasu love, mujhe aapse pyar hai"* ➔ Sweet romantic response in native Urdu.

---

## 🔒 Security & Privacy Notice
All credentials (`wasulove` / `Laibawasi3005@`) and biometric data run locally inside the application runtime. No biometric camera data or fingerprints are transmitted to any third party.

---

## 📜 License
Distributed under the MIT License. Built with ❤️ for master **Ahmed**.
