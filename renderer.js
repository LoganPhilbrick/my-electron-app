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
        width: 1280,
        height: 720,
        frameRate: 60,
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.muted = true;
      console.log(video.srcObject);
      video.onloadedmetadata = (e) => video.play();

      // Create MediaRecorder instance
      mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });

      // Push data chunks to the recordedChunks array
      mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };

      // When recording stops, create a Blob from chunks and trigger a download
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Trigger download of the video
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm"; // Name of the downloaded file
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
    })
    .catch((e) => console.log(e));
});

stopButton.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    video.srcObject = null;
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
