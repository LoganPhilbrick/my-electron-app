const func = async () => {
  const response = await window.versions.ping();
  console.log(response);
};

func();

document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.getElementById("closeButton");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      console.log("Close button clicked");
      window.electronAPI.closeWindow();
    });
  }
});
