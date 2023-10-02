if (localStorage.getItem("backgroundImage")) {
  document.body.style.backgroundImage = "url(" + localStorage.getItem("backgroundImage") + ")";
};
document.documentElement.style.setProperty("--opacity", (1 - (Boolean(localStorage.getItem("backgroundImage")) * 0.2)).toString());
document.getElementById("modalContainerButton").addEventListener("click", matchMaking);
/*document.getElementById("joinGameButton").addEventListener("click", joinGame);
document.getElementById("createGameButton").addEventListener("click", createGame);*/
document.getElementById("modalContainerInput").addEventListener("keydown", ({ repeat, key }) => {
  if (repeat) return;
  if (key !== "Enter") return;
  matchMaking();
});
/*document.getElementById("joinGameInput").addEventListener("keydown", ({ repeat, key }) => {
  if (repeat) return;
  if (key !== "Enter") return;
  joinGame();
});
document.getElementById("createGameInput").addEventListener("keydown", ({ repeat, key }) => {
  if (repeat) return;
  if (key !== "Enter") return;
  createGame();
});*/

function matchMaking() {
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
};

/*function joinGame() {
  if (!document.getElementById("joinGameInput").value) return;
  if (!document.getElementById("joinGameInput").dataset.gameId) {
    document.getElementById("joinGameInput").dataset.gameId = document.getElementById("joinGameInput").value;
    document.getElementById("joinGameInput").placeholder = "Username";
    document.getElementById("joinGameInput").value = "";
    document.getElementById("joinGameButton").innerText = "Join Game";
  } else {
    let link = document.createElement("a");
    link.href = "/game/" + document.getElementById("joinGameInput").dataset.gameId + "?username=" + document.getElementById("joinGameInput").value;
    link.click();
  }
};

function createGame() {
  if (!document.getElementById("createGameInput").value) return;
  let link = document.createElement("a");
  link.href = "/game/" + Math.random().toString(36).slice(-8) + "?username=" + document.getElementById("createGameInput").value;
  link.click();
};*/

window.addEventListener("click", ({ target }) => {
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