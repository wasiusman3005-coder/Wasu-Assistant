#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "========================================================================"
echo "  Q-NEXUS: QUANTUM TACHYON JARVIS OS (4K UHD) — LINUX / MAC INSTALLER"
echo "========================================================================"

command -v python3 >/dev/null 2>&1 || { echo "[ERROR] Python 3.10+ is required."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "[ERROR] Node.js 20+ is required."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "[ERROR] npm is required."; exit 1; }

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
  echo "[INFO] Created .env from .env.example"
fi

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate

pip install -r requirements.txt

if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build

python3 jarvis_desktop.py
