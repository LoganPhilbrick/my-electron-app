const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");

  createWindow();

  ipcMain.on("close-window", () => {
    if (win) {
      win.close();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
