const { app, BrowserWindow, ipcMain, desktopCapturer, session, dialog } = require("electron/main");
const path = require("path");
const fs = require("fs");

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
      nodeIntegration: false,
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

ipcMain.on("save-video", async (event, buffer) => {
  // Define the Killfeed folder inside the user's Videos directory
  const killfeedFolder = path.join(app.getPath("videos"), "Killfeed");

  // Ensure the Killfeed folder exists, create it if not
  if (!fs.existsSync(killfeedFolder)) {
    fs.mkdirSync(killfeedFolder, { recursive: true }); // Create folder if it doesn't exist
  }

  // Define the full save path inside Killfeed
  const savePath = path.join(killfeedFolder, `recording_${Date.now()}.webm`);

  // Write the file
  fs.writeFile(savePath, buffer, (err) => {
    if (err) {
      console.error("Failed to save video:", err);
    } else {
      console.log("Video saved to:", savePath);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
