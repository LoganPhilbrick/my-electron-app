const { app, BrowserWindow, ipcMain, desktopCapturer, session } = require("electron/main");
const path = require("node:path");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    resizable: false,
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
  createWindow();

  session.defaultSession.setDisplayMediaRequestHandler(
    (request, callback) => {
      desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
        // Grant access to the first screen found.
        callback({ video: sources[0], audio: "loopback" });
      });
      // If true, use the system picker if available.
      // Note: this is currently experimental. If the system picker
      // is available, it will be used and the media request handler
      // will not be invoked.
    },
    { useSystemPicker: true }
  );

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
