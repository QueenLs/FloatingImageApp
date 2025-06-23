const { app, BrowserWindow } = require("electron");
const path = require("path");
const remoteMain = require("@electron/remote/main");
const AutoLaunch = require("electron-auto-launch"); // ⬅️ נוספה שורה

remoteMain.initialize();

let mainWindow;

// ⬅️ הגדרת האוטו־לאנץ'
const appLauncher = new AutoLaunch({
  name: "FloatingImageApp",
  path: app.getPath("exe"),
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  remoteMain.enable(mainWindow.webContents);

  mainWindow.loadFile("index.html");
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setIgnoreMouseEvents(false);
}

// ⬅️ כשהאפליקציה מוכנה – גם מפעילים את AutoLaunch
app.whenReady().then(() => {
  appLauncher.enable();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
