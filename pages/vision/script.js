let points = 0;
let field;
if (localStorage.getItem("backgroundImage")) {
  document.body.style.backgroundImage = "url(" + localStorage.getItem("backgroundImage") + ")";
};
document.documentElement.style.setProperty("--opacity", (1 - (Boolean(localStorage.getItem("backgroundImage")) * 0.2)).toString());
if ((Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - 130) > ((0.82 * Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)))) {
  document.getElementsByClassName("menuBar")[0].style.display = "none";
  document.getElementById("mainContainer").style.marginLeft = "1%";
  document.getElementById("mainContainer").children[2].style.marginLeft = "0%";
  document.documentElement.style.setProperty("--board-size", ((Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth) - 35) / 8).toString() + "px");
} else {
  document.documentElement.style.setProperty("--board-size", ((Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - 130) / 8).toString() + "px");
};
window.addEventListener("resize", () => {
  if ((Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - 130) > ((0.82 * Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)))) {
    document.getElementsByClassName("menuBar")[0].style.display = "none";
    document.getElementById("mainContainer").style.marginLeft = "1%";
    document.getElementById("mainContainer").children[2].style.marginLeft = "0%";
    document.documentElement.style.setProperty("--board-size", ((Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth) - 35) / 8).toString() + "px");
  } else {
    document.documentElement.style.setProperty("--board-size", ((Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - 130) / 8).toString() + "px");
  };
});

let changeField = () => {
  field = [
    Math.floor(Math.random() * 8),
    Math.floor(Math.random() * 8)
  ];
  document.getElementById("mainContainer").children[0].children[0].innerText = (["a", "b", "c", "d", "e", "f", "g", "h"][field[1]] + (8 - field[0]).toString());
};

for (let a = 0; a < 8; a++) {
  let lineContainer = document.createElement("div");
  lineContainer.className = "lineContainer";
  for (let b = 0; b < 8; b++) {
    let pieceContainer = document.createElement("div");
    if ([0, 7].includes(a) && [0, 7].includes(b)) pieceContainer.style["border" + ((a) ? "Bottom" : "Top") + ((b) ? "Right" : "Left") + "Radius"] = "5px";
    pieceContainer.className = "pieceContainer " + (((a % 2) === (b % 2)) ? "unevenSquare" : "evenSquare");
    pieceContainer.addEventListener("click", () => {
      if ((a === field[0]) && (b === field[1])) {
        points++;
        document.getElementById("mainContainer").children[2].children[0].innerText = points.toString() + " Points";
        changeField();
      };
    });
    lineContainer.appendChild(pieceContainer);
  };
  document.getElementById("chessBoard").appendChild(lineContainer);
};

changeField();

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