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
    """Support normal scripts and frozen .exe while preferring real folder containing node_modules."""
    if getattr(sys, "frozen", False):
        exe_dir = Path(sys.executable).resolve().parent
        for cand in (Path.cwd(), exe_dir, exe_dir.parent):
            if (cand / "server.ts").exists() and (cand / "node_modules").exists():
                return cand
        if hasattr(sys, "_MEIPASS"):
            meipass = Path(sys._MEIPASS)
            if (meipass / "server.ts").exists():
                return meipass
    return Path(__file__).resolve().parent


APP_ROOT = resolve_app_root()
PORT = int(os.environ.get("PORT", "3000"))
APP_URL = f"http://127.0.0.1:{PORT}"
SERVER_PROC: subprocess.Popen | None = None


def find_free_port(start_port: int = 3001) -> int:
    for p in range(start_port, start_port + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", p)) != 0:
                return p
    return start_port


def is_current_core_healthy(port: int) -> bool:
    """Verify an already-open port actually serves our real /api/system/telemetry endpoint."""
    try:
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        with opener.open(f"http://127.0.0.1:{port}/api/system/telemetry", timeout=1.5) as resp:
            if resp.status != 200:
                return False
            ctype = (resp.headers.get("Content-Type") or "").lower()
            if "json" not in ctype:
                return False
            import json
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))
            return bool(isinstance(data, dict) and data.get("realHost") is True)
    except Exception:
        return False


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


def ensure_utf8_sources(work_dir: Path) -> None:
    """Repair any source file corrupted with non-UTF-8 (e.g. Windows-1252) bytes before Vite/Rolldown builds."""
    src_dir = work_dir / "src"
    if not src_dir.exists():
        return
    exts = {".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".json"}
    for file_path in src_dir.rglob("*"):
        if not file_path.is_file() or file_path.suffix.lower() not in exts:
            continue
        raw = file_path.read_bytes()
        if raw.startswith(b"\xef\xbb\xbf"):
            raw = raw[3:]
            file_path.write_bytes(raw)
        try:
            raw.decode("utf-8")
        except UnicodeDecodeError:
            try:
                fixed = raw.decode("cp1252")
            except UnicodeDecodeError:
                fixed = raw.decode("utf-8", errors="replace")
            file_path.write_text(fixed, encoding="utf-8", newline="\n")
            print(f"[Q-NEXUS] Repaired invalid UTF-8 encoding in {file_path.relative_to(work_dir)}")


def ensure_node_ready(work_dir: Path) -> None:
    node_bin = shutil.which("node")
    npm_bin = shutil.which("npm")
    if not node_bin or not npm_bin:
        print(
            "[ERROR] Node.js (v20+) is required to run Q-NEXUS backend.\n"
            "Download and install from https://nodejs.org and relaunch."
        )
        sys.exit(1)

    vite_bin = work_dir / "node_modules" / ".bin" / ("vite.cmd" if os.name == "nt" else "vite")
    if not vite_bin.exists():
        print("[Q-NEXUS] Installing Node dependencies (first-time setup)...")
        res = subprocess.run([npm_bin, "install"], cwd=str(work_dir))
        if res.returncode != 0:
            print("[Q-NEXUS] Retrying npm install with --legacy-peer-deps...")
            subprocess.run([npm_bin, "install", "--legacy-peer-deps"], cwd=str(work_dir), check=True)

    dist_index = work_dir / "dist" / "index.html"
    if not dist_index.exists():
        ensure_utf8_sources(work_dir)
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


def _stream_logs(proc: subprocess.Popen) -> None:
    if not proc.stdout:
        return
    try:
        for raw_line in iter(proc.stdout.readline, b""):
            text = raw_line.decode("utf-8", errors="replace").rstrip()
            if text:
                print(f"[CORE] {text}")
    except Exception:
        pass


def start_backend(work_dir: Path) -> None:
    global SERVER_PROC, PORT, APP_URL
    if is_port_open(PORT):
        if is_current_core_healthy(PORT):
            print(f"[Q-NEXUS] Quantum Core server already active at {APP_URL}")
            return
        # Port occupied by an older/stale server without live telemetry -> boot fresh core on free port
        PORT = find_free_port(PORT + 1)
        APP_URL = f"http://127.0.0.1:{PORT}"
        print(f"[Q-NEXUS] Stale process detected on port 3000; starting fresh Core on {APP_URL}...")

    ensure_node_ready(work_dir)
    env = load_env_file(work_dir)
    env["PORT"] = str(PORT)
    env.setdefault("NODE_ENV", "production")
    env.setdefault("HOST", "127.0.0.1")
    if not getattr(sys, "frozen", False):
        env["PYTHON_BIN"] = sys.executable
    else:
        env["PYTHON_BIN"] = shutil.which("python") or shutil.which("python3") or "python"
        exe_dir = Path(sys.executable).resolve().parent
        for cand in (Path.cwd(), exe_dir, exe_dir.parent):
            nm = cand / "node_modules"
            if nm.exists():
                env["NODE_PATH"] = str(nm)
                break

    node_bin = shutil.which("node") or "node"
    tsx_cli = work_dir / "node_modules" / "tsx" / "dist" / "cli.mjs"
    if not tsx_cli.exists() and env.get("NODE_PATH"):
        tsx_cli = Path(env["NODE_PATH"]) / "tsx" / "dist" / "cli.mjs"
    npx_bin = shutil.which("npx") or ("npx.cmd" if os.name == "nt" else "npx")
    tsx_local = work_dir / "node_modules" / ".bin" / ("tsx.cmd" if os.name == "nt" else "tsx")

    if tsx_cli.exists():
        cmd = [node_bin, str(tsx_cli), "server.ts"]
    elif tsx_local.exists():
        cmd = [str(tsx_local), "server.ts"]
    else:
        cmd = [npx_bin, "tsx", "server.ts"]

    creation_flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" and hasattr(subprocess, "CREATE_NO_WINDOW") else 0
    print(f"[Q-NEXUS] Booting Quantum Tachyon Core on {APP_URL}...")
    SERVER_PROC = subprocess.Popen(
        cmd,
        cwd=str(work_dir),
        env=env,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        creationflags=creation_flags,
    )

    import threading
    threading.Thread(target=_stream_logs, args=(SERVER_PROC,), daemon=True).start()

    # Bypass any Windows system proxy/VPN when probing local 127.0.0.1 server
    local_opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    # Wait up to 25 seconds for HTTP 200 readiness
    for _ in range(50):
        if SERVER_PROC.poll() is not None:
            raise RuntimeError(f"Server exited early with code {SERVER_PROC.returncode}")
        try:
            with local_opener.open(APP_URL, timeout=1.0) as resp:
                if resp.status == 200:
                    print("[Q-NEXUS] Quantum Server ready!")
                    return
        except Exception:
            time.sleep(0.4)

    raise RuntimeError(f"Timed out waiting for Quantum Server at {APP_URL}")


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


def resolve_webview_icon() -> str | None:
    """Return a platform-safe window icon path (Windows .NET Icon requires BMP-encoded .ico, never .png)."""
    png = APP_ROOT / "desktop" / "icon.png"
    ico = APP_ROOT / "desktop" / "icon.ico"
    if os.name != "nt":
        return str(png) if png.exists() else None
    if png.exists():
        try:
            from PIL import Image  # type: ignore

            win_ico = APP_ROOT / "desktop" / "icon_win.ico"
            if not win_ico.exists():
                img = Image.open(png).convert("RGBA")
                img.save(win_ico, format="ICO", bitmap_format="bmp", sizes=[(32, 32), (48, 48), (64, 64)])
            return str(win_ico)
        except Exception:
            pass
    if ico.exists():
        data = ico.read_bytes()
        if len(data) >= 22:
            off = int.from_bytes(data[18:22], "little")
            if off + 4 <= len(data) and data[off:off + 4] == b"\x28\x00\x00\x00":
                return str(ico)
    return None


def main() -> None:
    enable_windows_uhd_dpi()
    atexit.register(stop_backend)
    start_backend(APP_ROOT)

    icon_file = resolve_webview_icon()
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
            icon=icon_file,
        )
    except Exception as exc:
        print(f"[Q-NEXUS] Native PyWebView fallback ({exc}); opening frameless Desktop App window...")
        launch_browser_app_fallback()
    finally:
        stop_backend()


if __name__ == "__main__":
    main()
