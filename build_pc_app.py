"""
Q-NEXUS: Quantum Tachyon Jarvis OS — Python PC App (.EXE & Desktop Shortcut) Builder
Run `python build_pc_app.py` to compile a standalone Windows `.exe` via PyInstaller
and install a Desktop shortcut so Q-NEXUS launches as a native 4K UHD PC application.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def run(cmd: list[str], cwd: Path = ROOT) -> None:
    print(f"\n>>> {' '.join(cmd)}")
    subprocess.run(cmd, cwd=str(cwd), check=True)


def create_windows_desktop_shortcut(target_exe: Path) -> None:
    if os.name != "nt":
        return
    desktop_dir = Path(os.path.join(os.environ.get("USERPROFILE", ""), "Desktop"))
    if not desktop_dir.exists():
        return
    shortcut_path = desktop_dir / "Quantum Jarvis OS.lnk"
    icon_path = ROOT / "desktop" / "icon.ico"
    ps_script = (
        f'$WshShell = New-Object -comObject WScript.Shell; '
        f'$Shortcut = $WshShell.CreateShortcut("{shortcut_path}"); '
        f'$Shortcut.TargetPath = "{target_exe}"; '
        f'$Shortcut.WorkingDirectory = "{ROOT}"; '
        f'$Shortcut.IconLocation = "{icon_path}"; '
        f'$Shortcut.Description = "Q-NEXUS: Quantum Tachyon Jarvis OS (4K UHD)"; '
        f'$Shortcut.Save()'
    )
    try:
        subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], check=True)
        print(f"[SUCCESS] Desktop shortcut created: {shortcut_path}")
    except Exception as exc:
        print(f"[INFO] Shortcut creation skipped ({exc}); you can run {target_exe} directly.")


def main() -> None:
    print("=================================================================")
    print("  Q-NEXUS: QUANTUM TACHYON JARVIS OS — PYTHON PC APP BUILDER")
    print("=================================================================")

    npm_bin = shutil.which("npm")
    if not npm_bin:
        print("[ERROR] Node.js / npm is required. Install from https://nodejs.org")
        sys.exit(1)

    # 1. Install Python dependencies
    run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    # 2. Install Node modules & build 4K UHD web bundle
    if not (ROOT / "node_modules").exists():
        run([npm_bin, "install"])
    run([npm_bin, "run", "build"])

    # 3. Verify icons exist
    icon_ico = ROOT / "desktop" / "icon.ico"
    icon_png = ROOT / "desktop" / "icon.png"
    if not icon_ico.exists() or not icon_png.exists():
        print("[ERROR] desktop/icon.ico or desktop/icon.png missing.")
        sys.exit(1)

    # 4. Package standalone .exe with PyInstaller
    sep = ";" if os.name == "nt" else ":"
    pyinstaller_cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--onefile",
        "--noconsole",
        "--name",
        "QuantumJarvisOS",
        "--distpath",
        "dist_pc",
        "--workpath",
        "build_pc",
        f"--icon={icon_ico}",
        f"--add-data=dist{sep}dist",
        f"--add-data=public{sep}public",
        f"--add-data=desktop{sep}desktop",
        f"--add-data=server.ts{sep}.",
        f"--add-data=package.json{sep}.",
        f"--add-data=.env.example{sep}.",
        "jarvis_desktop.py",
    ]
    run(pyinstaller_cmd)

    exe_name = "QuantumJarvisOS.exe" if os.name == "nt" else "QuantumJarvisOS"
    output_exe = ROOT / "dist_pc" / exe_name
    print(f"\n[COMPLETE] PC Desktop App compiled: {output_exe}")

    if os.name == "nt" and output_exe.exists():
        create_windows_desktop_shortcut(output_exe)

    print("\nTo launch right now, double-click dist_pc/QuantumJarvisOS or your Desktop shortcut!")


if __name__ == "__main__":
    main()
