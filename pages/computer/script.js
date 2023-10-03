const socket = io("/");
let sounds = [
  [
    "moveSelf",
    new Audio("/public/chess/sounds/move-self.mp3")
  ],
  [
    "moveCheck",
    new Audio("/public/chess/sounds/move-check.mp3")
  ],
  [
    "capture",
    new Audio("/public/chess/sounds/capture.mp3")
  ],
  [
    "castle",
    new Audio("/public/chess/sounds/castle.mp3")
  ],
  [
    "notify",
    new Audio("/public/chess/sounds/notify.mp3")
  ]
].reduce((data, sound) => ({
  ...data,
  ...{
    [sound[0]]: sound[1]
  }
}), {});
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

socket.emit("playComputer");

socket.on("chessBoard", ({ board, moves }) => {
  let allowedMoves = moves;
  let selectedPiece = [];
  let highlightedPieces = [];
  let piecePromotionField = [];
  let piecePromotionEventListeners = [];
  let turn = 0;
  for (let a = 0; a < 8; a++) {
    let lineContainer = document.createElement("div");
    lineContainer.className = "lineContainer";
    for (let b = 0; b < 8; b++) {
      let pieceContainer = document.createElement("div");
      if ([0, 7].includes(a) && [0, 7].includes(b)) pieceContainer.style["border" + ((a) ? "Bottom" : "Top") + ((b) ? "Right" : "Left") + "Radius"] = "5px";
      pieceContainer.className = "pieceContainer " + (((a % 2) === (b % 2)) ? "unevenSquare" : "evenSquare");
      let pieceImage = document.createElement("img");
      pieceImage.className = "pieceImage";
      if (board[a][b]) {
        pieceImage.alt = "Piece Image";
        pieceImage.src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/" + board[a][b].color + board[a][b].type.toUpperCase() + ".svg";
      };
      let moveDot = document.createElement("img");
      moveDot.className = "moveDot";
      moveDot.style.display = "none";
      moveDot.src = "/public/chess/moveDot.png";
      let piecePromotionContainer;
      if (!a) {
        piecePromotionContainer = document.createElement("div");
        piecePromotionContainer.style.display = "none";
        piecePromotionContainer.className = "piecePromotionContainer";
        ["q", "r", "b", "n"].forEach((piece, pieceIndex) => {
          let piecePromotionContainerImage = document.createElement("img");
          piecePromotionContainerImage.className = "pieceImage piecePromotionContainerImage";
          piecePromotionContainerImage.style.top = (50 + (pieceIndex * 75)).toString() + "%";
          piecePromotionContainerImage.alt = "Piece Image";
          piecePromotionContainerImage.src = "/public/chess/pieces/" + (localStorage.getItem("") || "cburnett") + "/w" + piece.toUpperCase() + ".svg";
          piecePromotionContainer.appendChild(piecePromotionContainerImage);
        });
      };
      pieceContainer.addEventListener("click", () => {
        if (turn) return;
        if ((piecePromotionField[0] !== a) || (piecePromotionField[1] !== b)) {
          piecePromotionEventListeners.forEach((piecePromotionEventListener) => {
            piecePromotionEventListener[0].removeEventListener("click", piecePromotionEventListener[1]);
          });
          if (piecePromotionField.length > 1) {
            document.getElementById("chessBoard").children[piecePromotionField[0]].children[piecePromotionField[1]].children[0].style.display = "block";
          };
        };
        let displayedMoveDot = moveDot.style.display;
        Array.from(document.getElementById("chessBoard").children).forEach((moveDotLineContainer, moveDotLineIndex) => {
          Array.from(moveDotLineContainer.children).forEach((moveDotPieceContainer, moveDotPieceIndex) => {
            moveDotPieceContainer.children[1].style.display = "none";
            if (moveDotPieceContainer.children.length > 2) {
              moveDotPieceContainer.children[2].style.display = "none";
            };
          });
        });
        if (displayedMoveDot === "none") {
          if ((selectedPiece[0] !== a) || (selectedPiece[1] !== b)) {
            selectedPiece = [a, b];
            allowedMoves.filter((move) => (move.color === "w") && (move.from === (["a", "b", "c", "d", "e", "f", "g", "h"][b] + (8 - a).toString()))).forEach((move) => {
              document.getElementById("chessBoard").children[8 - Number(move.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(move.to[0])].children[1].style.display = "block";
            });
          } else {
            selectedPiece = [];
          };
        } else {
          turn = 1;
          let makeMove = (move) => {
            if (document.getElementById("chessBoard").children[a].children[b].children[0].src) {
              sounds.capture.play();
            } else if (move.san.startsWith("O-O")) {
              sounds.castle.play();
              document.getElementById("chessBoard").children[7].children[3 + (!move.san.startsWith("O-O-O") * 2)].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/wR.svg";
              document.getElementById("chessBoard").children[7].children[!move.san.startsWith("O-O-O") * 7].children[0].removeAttribute("src");
              document.getElementById("chessBoard").children[7].children[!move.san.startsWith("O-O-O") * 7].children[0].removeAttribute("alt");
              document.getElementById("chessBoard").children[7].children[!move.san.startsWith("O-O-O") * 7].children[0].style.display = "none";
              document.getElementById("chessBoard").children[7].children[!move.san.startsWith("O-O-O") * 7].children[0].style.display = "block";
            } else {
              sounds.moveSelf.play();
            };
            highlightedPieces.forEach((highlightedPiece) => {
              highlightedPiece.removeAttribute("style");
            });
            highlightedPieces = [
              document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]],
              document.getElementById("chessBoard").children[a].children[b]
            ];
            document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
            document.getElementById("chessBoard").children[a].children[b].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[a].children[b].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
            if (move.promotion) {
              document.getElementById("chessBoard").children[a].children[b].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/w" + move.promotion.toUpperCase() + ".svg";
            } else {
              document.getElementById("chessBoard").children[a].children[b].children[0].src = document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].src;
            };
            document.getElementById("chessBoard").children[a].children[b].children[0].alt = "Piece Image";
            document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].removeAttribute("src");
            document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].removeAttribute("alt");
            document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].style.display = "none";
            document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].style.display = "block";
            setTimeout(() => {
              socket.emit("move", move.san);
            }, 1000);
          };
          if (!a && (document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].src[document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].src.length - 5] === "P")) {
            pieceImage.style.display = "none";
            piecePromotionContainer.style.display = "block";
            piecePromotionField = [a, b];
            Array.from(piecePromotionContainer.children).forEach((piecePromotionContainerImage, piecePromotionContainerImageIndex) => {
              piecePromotionEventListeners = [
                ...piecePromotionEventListeners || [],
                ...[
                  [
                    piecePromotionContainerImage,
                    () => {
                      piecePromotionField = [];
                      piecePromotionEventListeners.forEach((piecePromotionEventListener) => {
                        piecePromotionEventListener[0].removeEventListener("click", piecePromotionEventListener[1]);
                      });
                      piecePromotionContainer.style.display = "none";
                      pieceImage.style.display = "block";
                      makeMove(allowedMoves.find((move) => (move.from === (["a", "b", "c", "d", "e", "f", "g", "h"][selectedPiece[1]] + (8 - selectedPiece[0]).toString())) && (move.to === (["a", "b", "c", "d", "e", "f", "g", "h"][b] + (8 - a).toString())) && (move.promotion === ["q", "r", "b", "n"][piecePromotionContainerImageIndex])));
                    }
                  ]
                ]
              ];
              piecePromotionContainerImage.addEventListener("click", piecePromotionEventListeners[piecePromotionEventListeners.length - 1][1]);
            });
          } else {
            makeMove(allowedMoves.find((move) => (move.from === (["a", "b", "c", "d", "e", "f", "g", "h"][selectedPiece[1]] + (8 - selectedPiece[0]).toString())) && (move.to === (["a", "b", "c", "d", "e", "f", "g", "h"][b] + (8 - a).toString()))));
          };
        };
      });
      pieceContainer.appendChild(pieceImage);
      pieceContainer.appendChild(moveDot);
      if (!a) {
        pieceContainer.appendChild(piecePromotionContainer);
      };
      lineContainer.appendChild(pieceContainer);
    };
    document.getElementById("chessBoard").appendChild(lineContainer);
  };
  socket.on("move", ({ chessEngineMoveData, newMoves, gameEnd }) => {
    allowedMoves = newMoves;
    if (chessEngineMoveData) {
      if (gameEnd) {
        sounds.moveCheck.play();
      } else if (document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])].children[0].src) {
        sounds.capture.play();
      } else if (chessEngineMoveData.san.startsWith("O-O")) {
        sounds.castle.play();
        document.getElementById("chessBoard").children[0].children[3 + (!chessEngineMoveData.san.startsWith("O-O-O") * 2)].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/bR.svg";
        document.getElementById("chessBoard").children[0].children[!chessEngineMoveData.san.startsWith("O-O-O") * 7].children[0].removeAttribute("src");
        document.getElementById("chessBoard").children[0].children[!chessEngineMoveData.san.startsWith("O-O-O") * 7].children[0].removeAttribute("alt");
        document.getElementById("chessBoard").children[0].children[!chessEngineMoveData.san.startsWith("O-O-O") * 7].children[0].style.display = "none";
        document.getElementById("chessBoard").children[0].children[!chessEngineMoveData.san.startsWith("O-O-O") * 7].children[0].style.display = "block";
      } else {
        sounds.moveSelf.play();
      };
      highlightedPieces.forEach((highlightedPiece) => {
        highlightedPiece.removeAttribute("style");
      });
      highlightedPieces = [
        document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])],
        document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])]
      ];
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
      if (chessEngineMoveData.promotion) {
        document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/b" + chessEngineMoveData.promotion.toUpperCase() + ".svg";
      } else {
        document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])].children[0].src = document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].children[0].src;
      };
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.to[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.to[0])].children[0].alt = "Piece Image";
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].children[0].removeAttribute("src");
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].children[0].removeAttribute("alt");
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].children[0].style.display = "none";
      document.getElementById("chessBoard").children[8 - Number(chessEngineMoveData.from[1])].children[["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(chessEngineMoveData.from[0])].children[0].style.display = "block";
    };
    turn = 0;
    if (gameEnd) {
      document.getElementById("gameEndPopup").children[0].children[0].children[0].children[0].innerText = (gameEnd.draw) ? "drew" : ((gameEnd.winner) ? "lost" : "won");
      document.getElementById("gameEndPopup").children[0].children[0].children[0].children[2].innerText = gameEnd.type;
      html2canvas(document.getElementById("chessBoard")).then((chessBoardCanvas) => {
        chessBoardCanvas.style.width = "var(--board-canvas-size)";
        chessBoardCanvas.style.paddingTop = "12.5px";
        document.getElementById("gameEndPopup").children[0].children[0].appendChild(chessBoardCanvas);
        document.getElementById("gameEndPopup").style.display = "block";
      });
    }
  });
});

window.addEventListener("click", ({ target }) => {
  if (target === document.getElementById("gameEndPopup")) {
    document.getElementById("gameEndPopup").style.display = "none";
  }
});

window.addEventListener("touchend", ({ target }) => {
  if (target === document.getElementById("gameEndPopup")) {
    document.getElementById("gameEndPopup").style.display = "none";
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