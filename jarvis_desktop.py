"""
Q-NEXUS: Quantum Tachyon Jarvis OS — Python 4K UHD Desktop App Launcher
Runs the Node/Express + Vite backend cleanly on port 3000 and opens a hardware-accelerated,
high-DPI 4K UHD Desktop Window (using PyWebView WebView2, with automatic Edge/Chrome --app fallback).
"""

import atexit
import ctypes
import os
import shutil
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


def resolve_app_root() -> Path:
    """Support both normal script execution and PyInstaller frozen --onefile extraction."""
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        meipass = Path(sys._MEIPASS)
        if (meipass / "server.ts").exists():
            return meipass
    return Path(__file__).resolve().parent


APP_ROOT = resolve_app_root()
PORT = int(os.environ.get("PORT", "3000"))
APP_URL = f"http://127.0.0.1:{PORT}"
SERVER_PROC: subprocess.Popen | None = None


def enable_windows_uhd_dpi() -> None:
    """Enable per-monitor v2 DPI awareness on Windows for razor-sharp 4K UHD rendering."""
    if os.name != "nt":
        return
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass


def is_port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.4)
        return sock.connect_ex(("127.0.0.1", port)) == 0


def ensure_node_ready(work_dir: Path) -> None:
    node_bin = shutil.which("node")
    npm_bin = shutil.which("npm")
    if not node_bin or not npm_bin:
        print(
            "[ERROR] Node.js (v20+) is required to run Q-NEXUS backend.\n"
            "Download and install from https://nodejs.org and relaunch."
        )
        sys.exit(1)

    if not (work_dir / "node_modules").exists():
        print("[Q-NEXUS] Installing Node dependencies (first-time setup)...")
        subprocess.run([npm_bin, "install"], cwd=str(work_dir), check=True)

    dist_index = work_dir / "dist" / "index.html"
    if not dist_index.exists():
        print("[Q-NEXUS] Building 4K UHD production bundle...")
        subprocess.run([npm_bin, "run", "build"], cwd=str(work_dir), check=True)


def load_env_file(work_dir: Path) -> dict[str, str]:
    env = os.environ.copy()
    env_file = work_dir / ".env"
    if not env_file.exists():
        # Also check working directory alongside .exe
        cwd_env = Path.cwd() / ".env"
        if cwd_env.exists():
            env_file = cwd_env
    if env_file.exists():
        for raw_line in env_file.read_text(encoding="utf-8", errors="ignore").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    env["PORT"] = str(PORT)
    return env


def start_backend(work_dir: Path) -> None:
    global SERVER_PROC
    if is_port_open(PORT):
        print(f"[Q-NEXUS] Quantum Core server already active at {APP_URL}")
        return

    ensure_node_ready(work_dir)
    env = load_env_file(work_dir)
    env.setdefault("NODE_ENV", "production")

    npx_bin = shutil.which("npx") or ("npx.cmd" if os.name == "nt" else "npx")
    tsx_local = work_dir / "node_modules" / ".bin" / ("tsx.cmd" if os.name == "nt" else "tsx")
    cmd = [str(tsx_local), "server.ts"] if tsx_local.exists() else [npx_bin, "tsx", "server.ts"]

    creation_flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" and hasattr(subprocess, "CREATE_NO_WINDOW") else 0
    print(f"[Q-NEXUS] Booting Quantum Tachyon Core on {APP_URL}...")
    SERVER_PROC = subprocess.Popen(
        cmd,
        cwd=str(work_dir),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        creationflags=creation_flags,
    )

    # Wait up to 25 seconds for HTTP 200 readiness
    for _ in range(50):
        try:
            with urllib.request.urlopen(APP_URL, timeout=1.0) as resp:
                if resp.status == 200:
                    print("[Q-NEXUS] Quantum Server ready!")
                    return
        except Exception:
            time.sleep(0.5)
            if SERVER_PROC.poll() is not None:
                out = SERVER_PROC.stdout.read().decode("utf-8", errors="ignore") if SERVER_PROC.stdout else ""
                raise RuntimeError(f"Server exited early:\n{out}")


def stop_backend() -> None:
    global SERVER_PROC
    if SERVER_PROC and SERVER_PROC.poll() is None:
        try:
            SERVER_PROC.terminate()
            SERVER_PROC.wait(timeout=3)
        except Exception:
            SERVER_PROC.kill()
        SERVER_PROC = None


def launch_browser_app_fallback() -> None:
    """Clean frameless standalone app window fallback via Edge/Chrome if pywebview is unavailable."""
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        shutil.which("msedge"),
        shutil.which("google-chrome"),
        shutil.which("chromium"),
    ]
    for browser in candidates:
        if browser and Path(browser).exists():
            proc = subprocess.Popen([
                browser,
                f"--app={APP_URL}",
                "--window-size=1920,1080",
                "--high-dpi-support=1",
                "--force-device-scale-factor=1",
            ])
            proc.wait()
            return

    import webbrowser
    webbrowser.open(APP_URL)
    print(f"[Q-NEXUS] Opened in default browser at {APP_URL}. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass


def main() -> None:
    enable_windows_uhd_dpi()
    atexit.register(stop_backend)
    start_backend(APP_ROOT)

    icon_path = APP_ROOT / "desktop" / "icon.png"
    try:
        import webview  # type: ignore

        window = webview.create_window(
            title="Q-NEXUS: Quantum Tachyon Jarvis OS (4K UHD)",
            url=APP_URL,
            width=1600,
            height=960,
            min_size=(1100, 700),
            resizable=True,
            background_color="#02050f",
            text_select=True,
        )
        webview.start(
            gui="edgechromium" if os.name == "nt" else None,
            debug=False,
            icon=str(icon_path) if icon_path.exists() else None,
        )
    except Exception as exc:
        print(f"[Q-NEXUS] Native PyWebView fallback ({exc}); opening frameless Desktop App window...")
        launch_browser_app_fallback()
    finally:
        stop_backend()


if __name__ == "__main__":
    main()
