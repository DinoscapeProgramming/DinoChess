if (localStorage.getItem("backgroundImage")) {
  document.body.style.backgroundImage = "url(" + localStorage.getItem("backgroundImage") + ")";
};
document.documentElement.style.setProperty("--opacity", (1 - (Boolean(localStorage.getItem("backgroundImage")) * 0.2)).toString());

document.getElementById("playGamePopupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!document.getElementById("modalContainerInput").value) return;
  if (!document.getElementById("modalContainerInput").dataset.gameId) {
    fetch("/api/v1/games/matchMaking")
    .then((response) => response.json())
    .then(({ gameId }) => {
      let link = document.createElement("a");
      link.href = "/game/" + gameId + "?username=" + document.getElementById("modalContainerInput").value;
      link.click();
    });
  };
});

window.addEventListener("click", ({ target }) => {
  if (target === document.getElementById("playGamePopup")) {
    document.getElementById("playGamePopup").style.display = "none";
  }
});

window.addEventListener("touchend", ({ target }) => {
  if (target === document.getElementById("playGamePopup")) {
    document.getElementById("playGamePopup").style.display = "none";
  }
});

/*if (isElectron) {
  window.addEventListener("offline", () => {
    require("electron").ipcRenderer.send("noInternetConnection");
  });
}*/

if (!["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) && !navigator.userAgent.includes("Mac") && !("ontouchend" in document)) {
  let serviceWorkerRegistration = document.createElement("script");
  serviceWorkerRegistration.setAttribute("defer", "");
  serviceWorkerRegistration.setAttribute("src", "/pages/serviceWorker.js");
  document.head.appendChild(serviceWorkerRegistration);
};