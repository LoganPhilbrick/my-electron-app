const { contextBridge, ipcRenderer } = require("electron");
const { Buffer } = require("buffer");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
  closeWindow: () => ipcRenderer.send("close-window"),
  ipcRenderer: ipcRenderer,
  send: (channel, data) => ipcRenderer.send(channel, data), // Explicitly expose `send`
  bufferFrom: (arrayBuffer) => Buffer.from(arrayBuffer), // Safe Buffer conversion
});
