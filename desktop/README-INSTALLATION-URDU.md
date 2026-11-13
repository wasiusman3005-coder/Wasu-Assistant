# Q-NEXUS: Quantum Tachyon Jarvis OS - PC Installation Guide (Urdu / Hindi)

Wasi Sahab, aapke PC par is Quantum Jarvis ko aik mukammal Desktop Application bananay aur install karne ke liye 3 asaan tareeqe hain:

---

## Tareeqa 1: Sub se Asaan aur Fori Desktop App (Instant PWA Desktop Mode - 10 Seconds)
Is tareeqe mein aapko koi software compile karne ki zaroorat nahi parti, yeh direct Windows ki asli desktop app ban jati hai:

1. **Google Chrome** ya **Microsoft Edge** browser mein yeh application open karein.
2. Browser ke top-right corner par **3 dots (Menu)** par click karein.
3. **"Save and share"** ya **"Apps"** par click karein.
4. **"Install Q-NEXUS: Quantum Tachyon Jarvis OS as App"** (ya "Install this site as an app") par click karein.
5. Windows aapse puchegi: *"Pin to Taskbar & Create Desktop Shortcut?"* -> **Yes** karein.
6. **Mubarak ho!** Ab aapke PC ke Desktop par aur Taskbar par Quantum Jarvis ka icon aa jayega. Jab aap click kareinge to yeh bina kisi browser address bar ke aik real desktop software ki tarah open hoga.

---

## Tareeqa 2: Windows 1-Click Batch Launcher (Start-Quantum-Jarvis.bat)
Aap is code ko apne PC par download kar ke aik click se chala sakte hain:

1. Apne PC par **Node.js** install karein (https://nodejs.org se LTS version download karein agar pehle se nahi hai).
2. Is app ke folder mein `desktop` folder ke andar majood file:
   `Start-Quantum-Jarvis.bat`
   par double click karein!
3. Yeh khud ba khud server start karega aur aapke PC par standalone high-tech window launch kar dega.

---

## Tareeqa 3: Asli Windows `.exe` Installer Banana (Electron Native App)
Agar aap iski mukammal `.exe` file bana kar hamesha ke liye install karna chahte hain:

1. Terminal / CMD open karein aur project folder mein jayein:
   ```bash
   cd desktop
   npm install
   ```
2. Native Windows application build karne ke liye command run karein:
   ```bash
   npm run dist
   ```
3. `dist-electron` folder ke andar aapko `Quantum Jarvis OS Setup.exe` file mil jayegi!
4. Double click kar ke install karein. Yeh Windows ke Start Menu, Desktop aur System Tray mein aa jayegi.
5. Global Shortcut: **Ctrl + Shift + J** press karte hi Jarvis aapke samnay hazir ho jayega!

---

## Login Credentials:
- **Username:** `wasu3005`
- **Password:** `Wasi3005@`
*(Yeh password secure aur hidden hai, login ke baad quantum system self-check chalayega)*
