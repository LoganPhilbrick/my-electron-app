document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.getElementById("closeButton");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      console.log("Close button clicked");
      window.electronAPI.closeWindow();
    });
  }
});
