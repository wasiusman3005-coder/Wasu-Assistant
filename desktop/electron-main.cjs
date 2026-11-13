// Electron Desktop Wrapper for Q-NEXUS: Quantum Tachyon Jarvis OS
const { app, BrowserWindow, globalShortcut, Tray, Menu, session } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Q-NEXUS: Quantum Tachyon Jarvis OS',
    backgroundColor: '#030712',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  // Load either local dev server or static build
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  mainWindow.loadURL(appUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Global hotkey: Ctrl + Shift + J to wake Jarvis from anywhere in Windows
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  // Window close to tray
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

// System Tray setup
function createTray() {
  try {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open Quantum Jarvis', click: () => mainWindow.show() },
      { label: 'Deep Focus Mode', click: () => { mainWindow.show(); mainWindow.webContents.send('trigger-focus'); } },
      { type: 'separator' },
      { label: 'Quit Jarvis OS', click: () => { app.isQuitting = true; app.quit(); } }
    ]);
    tray.setToolTip('Q-NEXUS: Quantum Jarvis OS');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => mainWindow.show());
  } catch (err) {
    console.log('Tray creation skipped in dev mode');
  }
}

app.whenReady().then(() => {
  // Grant microphone permissions for voice control
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(false);
  });

  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
