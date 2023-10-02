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
let generatePuzzle = async () => {
  let { title, url, board, moves, correctMoves, correctMovesRespondData, color, gameEnd } = await (await fetch("/api/v1/puzzle/random")).json();
  document.getElementById("chessBoard").innerHTML = "";
  document.getElementById("puzzleEndPopup").style.display = "none";
  document.getElementById("puzzleEndPopup").children[0].children[0].children[2]?.remove();
  document.getElementById("mainContainer").children[2].children[0].innerText = (color) ? "White" : "Black";
  document.getElementById("mainContainer").children[0].children[0].children[0].innerText = (color) ? "Black" : "White";
  document.getElementById("mainContainer").children[0].children[0].children[1].href = url;
  let moveCount = 0;
  let selectedPiece = [];
  let highlightedPieces = [];
  let piecePromotionField = [];
  let piecePromotionEventListeners = [];
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
          piecePromotionContainerImage.src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/w" + piece.toUpperCase() + ".svg";
          piecePromotionContainer.appendChild(piecePromotionContainerImage);
        });
      };
      pieceContainer.addEventListener("click", async () => {
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
            (moves[moveCount] || []).filter((move) => (move.color === ((color) ? "w" : "b")) && (move.from === (["a", "b", "c", "d", "e", "f", "g", "h"][(color) ? b : (7 - b)] + ((color) ? (8 - a) : (a + 1)).toString()))).forEach((move) => {
              document.getElementById("chessBoard").children[(color) ? (8 - Number(move.to[1])) : (Number(move.to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(move.to[0])].children[1].style.display = "block";
            });
          } else {
            selectedPiece = [];
          };
        } else {
          let makeMove = (move) => {
            if (move.san === correctMoves[moveCount]) {
              if (gameEnd && (moveCount === (correctMoves.length - 1))) {
                sounds.moveCheck.play();
              } else if (document.getElementById("chessBoard").children[a].children[b].children[0].src) {
                sounds.capture.play();
              } else if (move.san.startsWith("O-O")) {
                sounds.castle.play();
                document.getElementById("chessBoard").children[7].children[(3 - !color) + (((color) ? !move.san.startsWith("O-O-O") : move.san.startsWith("O-O-O")) * 2)].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/" + ((color) ? "w" : "b") + "R.svg";
                document.getElementById("chessBoard").children[7].children[((color) ? !move.san.startsWith("O-O-O") : move.san.startsWith("O-O-O")) * 7].children[0].removeAttribute("src");
                document.getElementById("chessBoard").children[7].children[((color) ? !move.san.startsWith("O-O-O") : move.san.startsWith("O-O-O")) * 7].children[0].removeAttribute("alt");
                document.getElementById("chessBoard").children[7].children[((color) ? !move.san.startsWith("O-O-O") : move.san.startsWith("O-O-O")) * 7].children[0].style.display = "none";
                document.getElementById("chessBoard").children[7].children[((color) ? !move.san.startsWith("O-O-O") : move.san.startsWith("O-O-O")) * 7].children[0].style.display = "block";
              } else {
                sounds.moveSelf.play();
              };
              highlightedPieces.forEach((highlightedPiece) => {
                highlightedPiece.removeAttribute("style");
              });
              if (move.promotion) {
                document.getElementById("chessBoard").children[a].children[b].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/" + ((color) ? "w" : "b") + move.promotion.toUpperCase() + ".svg";
              } else {
                document.getElementById("chessBoard").children[a].children[b].children[0].src = document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].src;
              };
              document.getElementById("chessBoard").children[a].children[b].children[0].alt = "Piece Image";
              document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].removeAttribute("src");
              document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].removeAttribute("alt");
              document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].style.display = "none";
              document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].children[0].style.display = "block";
              if (moveCount !== (correctMoves.length - 1)) {
                if (correctMovesRespondData[moveCount].san.startsWith("O-O")) {
                  document.getElementById("chessBoard").children[0].children[(3 - color) + (((color) ? !correctMovesRespondData[moveCount].san.startsWith("O-O-O") : correctMovesRespondData[moveCount].san.startsWith("O-O-O")) * 2)].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/" + ((color) ? "b" : "w") + "R.svg";
                  document.getElementById("chessBoard").children[0].children[((color) ? !correctMovesRespondData[moveCount].san.startsWith("O-O-O") : correctMovesRespondData[moveCount].san.startsWith("O-O-O")) * 7].children[0].removeAttribute("src");
                  document.getElementById("chessBoard").children[0].children[((color) ? !correctMovesRespondData[moveCount].san.startsWith("O-O-O") : correctMovesRespondData[moveCount].san.startsWith("O-O-O")) * 7].children[0].removeAttribute("alt");
                  document.getElementById("chessBoard").children[0].children[((color) ? !correctMovesRespondData[moveCount].san.startsWith("O-O-O") : correctMovesRespondData[moveCount].san.startsWith("O-O-O")) * 7].children[0].style.display = "none";
                  document.getElementById("chessBoard").children[0].children[((color) ? !correctMovesRespondData[moveCount].san.startsWith("O-O-O") : correctMovesRespondData[moveCount].san.startsWith("O-O-O")) * 7].children[0].style.display = "block";
                }
                highlightedPieces = [
                  document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])],
                  document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].to[1])) : (Number(correctMovesRespondData[moveCount].to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].to[0])]
                ];
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].to[1])) : (Number(correctMovesRespondData[moveCount].to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].to[0])].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].to[1])) : (Number(correctMovesRespondData[moveCount].to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].to[0])].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
                if (correctMovesRespondData[moveCount].promotion) {
                  document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].to[1])) : (Number(correctMovesRespondData[moveCount].to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].to[0])].children[0].src = "/public/chess/pieces/" + (localStorage.getItem("pieceStyle") || "cburnett") + "/" + ((color) ? "b" : "w") + correctMovesRespondData[moveCount].promotion.toUpperCase() + ".svg";
                } else {
                  document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].to[1])) : (Number(correctMovesRespondData[moveCount].to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].to[0])].children[0].src = document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].children[0].src;
                };
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].to[1])) : (Number(correctMovesRespondData[moveCount].to[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].to[0])].children[0].alt = "Piece Image";
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].children[0].removeAttribute("src");
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].children[0].removeAttribute("alt");
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].children[0].style.display = "none";
                document.getElementById("chessBoard").children[(color) ? (8 - Number(correctMovesRespondData[moveCount].from[1])) : (Number(correctMovesRespondData[moveCount].from[1]) - 1)].children[((color) ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]).indexOf(correctMovesRespondData[moveCount].from[0])].children[0].style.display = "block";
                moveCount++;
              } else {
                highlightedPieces = [
                  document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]],
                  document.getElementById("chessBoard").children[a].children[b]
                ];
                document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[selectedPiece[0]].children[selectedPiece[1]].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
                document.getElementById("chessBoard").children[a].children[b].style.backgroundColor = (Array.from(document.getElementById("chessBoard").children[a].children[b].classList).includes("unevenSquare")) ? "#cdd26a" : "#aaa23a";
                document.getElementById("puzzleEndPopup").children[0].children[0].children[0].children[0].innerText = title;
                html2canvas(document.getElementById("chessBoard")).then((chessBoardCanvas) => {
                  chessBoardCanvas.style.width = "var(--board-canvas-size)";
                  chessBoardCanvas.style.paddingTop = "12.5px";
                  document.getElementById("puzzleEndPopup").children[0].children[0].appendChild(chessBoardCanvas);
                  document.getElementById("puzzleEndPopup").style.display = "block";
                });
              };
            } else {
              selectedPiece = [];
            };
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
                      makeMove((moves[moveCount] || []).find((move) => (move.from === (["a", "b", "c", "d", "e", "f", "g", "h"][(color) ? selectedPiece[1] : (7 - selectedPiece[1])] + ((color) ? (8 - selectedPiece[0]) : (selectedPiece[0] + 1)).toString())) && (move.to === (["a", "b", "c", "d", "e", "f", "g", "h"][(color) ? b : (7 - b)] + ((color) ? (8 - a) : (a + 1)).toString())) && (move.promotion === ["q", "r", "b", "n"][piecePromotionContainerImageIndex])));
                    }
                  ]
                ]
              ];
              piecePromotionContainerImage.addEventListener("click", piecePromotionEventListeners[piecePromotionEventListeners.length - 1][1]);
            });
          } else {
            makeMove((moves[moveCount] || []).find((move) => (move.from === (["a", "b", "c", "d", "e", "f", "g", "h"][(color) ? selectedPiece[1] : (7 - selectedPiece[1])] + ((color) ? (8 - selectedPiece[0]) : (selectedPiece[0] + 1)).toString())) && (move.to === (["a", "b", "c", "d", "e", "f", "g", "h"][(color) ? b : (7 - b)] + ((color) ? (8 - a) : (a + 1)).toString()))));
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
};

generatePuzzle();

window.addEventListener("click", ({ target }) => {
  if (target === document.getElementById("puzzleEndPopup")) {
    document.getElementById("puzzleEndPopup").style.display = "none";
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