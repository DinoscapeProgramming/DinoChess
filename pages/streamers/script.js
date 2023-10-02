if (localStorage.getItem("backgroundImage")) {
  document.body.style.backgroundImage = "url(" + localStorage.getItem("backgroundImage") + ")";
};
document.documentElement.style.setProperty("--opacity", (1 - (Boolean(localStorage.getItem("backgroundImage")) * 0.2)).toString());
fetch("https://api.chess.com/pub/streamers")
.then((response) => response.json())
.then(({ streamers }) => {
  streamers.filter((streamer) => streamer.is_live).forEach((streamer, index) => {
    let collapsibleContainer = document.createElement("div");
    let collapsibleButton = document.createElement("button");
    collapsibleButton.style.borderTopLeftRadius = (!index) ? "10px" : "0";
    collapsibleButton.style.borderTopRightRadius = (!index) ? "10px" : "0";
    collapsibleButton.style.borderBottomLeftRadius = ((index + 1) === streamers.filter((streamer) => streamer.is_live).length) ? "10px" : "0";
    collapsibleButton.style.borderBottomRightRadius = ((index + 1) === streamers.filter((streamer) => streamer.is_live).length) ? "10px" : "0";
    collapsibleButton.className = "collapsibleButton";
    let collapsibleButtonIcon = document.createElement("img");
    collapsibleButtonIcon.className = "collapsibleButtonIcon";
    collapsibleButtonIcon.src = streamer.avatar;
    let collapsibleButtonLink = document.createElement("a");
    collapsibleButtonLink.className = "collapsibleButtonLink";
    collapsibleButtonLink.target = "_blank";
    collapsibleButtonLink.href = streamer.twitch_url;
    collapsibleButtonLink.innerText = streamer.username;
    let collapsibleContent = document.createElement("div");
    collapsibleContent.className = "collapsibleContent";
    let collapsibleContentVideoPlayer = document.createElement("iframe");
    collapsibleContentVideoPlayer.className = "collapsibleContentVideoPlayer";
    collapsibleContentVideoPlayer.setAttribute("allowfullscreen", "");
    collapsibleButton.addEventListener("click", () => {
      console.log("a")
      collapsibleButton.classList.toggle("active");
      if (collapsibleContent.style.display === "block") {
        collapsibleContentVideoPlayer.removeAttribute("src");
        collapsibleContent.style.display = "none";
      } else {
        collapsibleContentVideoPlayer.src = "https://player.twitch.tv?channel=" + streamer.twitch_url.split("/")[3] + "&parent=" + location.hostname;
        collapsibleContent.style.display = "block";
      }
    });
    collapsibleButton.appendChild(collapsibleButtonIcon);
    collapsibleButton.appendChild(collapsibleButtonLink);
    collapsibleContent.appendChild(collapsibleContentVideoPlayer);
    collapsibleContainer.appendChild(collapsibleButton);
    collapsibleContainer.appendChild(collapsibleContent);
    document.getElementById("mainContainer").appendChild(collapsibleContainer);
  });
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