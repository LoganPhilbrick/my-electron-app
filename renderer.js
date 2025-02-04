const { ipcRenderer, bufferFrom } = window.electronAPI;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const video = document.querySelector("video");

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener("click", () => {
  navigator.mediaDevices
    .getDisplayMedia({
      audio: true,
      video: {
        width: 1920,
        height: 1080,
        frameRate: 60,
      },
    })
    .then((stream) => {
      // video.srcObject = stream;
      // video.muted = true;
      // console.log(video.srcObject);
      // video.onloadedmetadata = (e) => video.play();

      // Create MediaRecorder instance
      mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });

      // Push data chunks to the recordedChunks array
      mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };

      // When recording stops, create a Blob from chunks and trigger a download
      const { send, bufferFrom } = window.electronAPI; // Use exposed APIs

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const arrayBuffer = await blob.arrayBuffer();

        // Convert ArrayBuffer to Buffer using the exposed function
        const buffer = bufferFrom(arrayBuffer);

        // Send data to the main process for saving
        send("save-video", buffer);
      };

      mediaRecorder.start();
    })
    .catch((e) => console.log(e));
});

stopButton.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    // video.srcObject = null;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.getElementById("closeButton");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      console.log("Close button clicked");
      window.electronAPI.closeWindow();
    });
  }
});
