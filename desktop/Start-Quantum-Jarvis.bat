@echo off
title Q-NEXUS: Quantum Tachyon Jarvis OS - Launcher
color 0b

echo ======================================================================
echo           Q-NEXUS: QUANTUM TACHYON JARVIS OS (PC DESKTOP LAUNCHER)
echo                     Commander: WASI (wasu3005)
echo ======================================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please download Node.js LTS from https://nodejs.org
    pause
    exit /b
)

echo [2/3] Installing dependencies and starting Quantum Engine...
call npm install
start /b npm run dev

echo [3/3] Waiting for Quantum Tachyon Engine initialization...
timeout /t 3 /nobreak >nul

echo.
echo ======================================================================
echo       Quantum Core is ONLINE! Launching Standalone Desktop Window...
echo ======================================================================

:: Launch in Chrome/Edge Standalone App Window (Looks like a real Desktop Software)
start msedge --app=http://localhost:3000 --window-size=1440,900 || start chrome --app=http://localhost:3000 --window-size=1440,900 || start http://localhost:3000

exit
