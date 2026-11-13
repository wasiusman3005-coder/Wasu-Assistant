@echo off
title Q-NEXUS: Quantum Tachyon Jarvis OS — Windows 1-Click Installer & Launcher
color 0b
cd /d "%~dp0"

echo ========================================================================
echo    Q-NEXUS: QUANTUM TACHYON JARVIS OS (4K UHD) — PC INSTALLER
echo ========================================================================
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python 3.10+ not found. Please install from https://www.python.org/downloads/
    pause
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js 20+ not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [INFO] Created .env from .env.example (add your API keys inside .env if needed).
    )
)

echo [1/4] Creating Python virtual environment (.venv)...
if not exist ".venv" (
    python -m venv .venv
)
call .venv\Scripts\activate.bat

echo [2/4] Installing Python desktop packages...
python -m pip install --upgrade pip >nul
pip install -r requirements.txt

echo [3/4] Installing Node dependencies & compiling 4K UHD bundle...
if not exist "node_modules" (
    call npm install
)
call npm run build

echo [4/4] Creating Desktop Shortcut & Launching Q-NEXUS Jarvis OS...
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Quantum Jarvis OS.lnk'); $s.TargetPath = '%~dp0.venv\Scripts\pythonw.exe'; $s.Arguments = '\"%~dp0jarvis_desktop.py\"'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = '%~dp0desktop\icon.ico'; $s.Save()"

python jarvis_desktop.py
exit /b 0
