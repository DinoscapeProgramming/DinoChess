if (localStorage.getItem("backgroundImage")) {
  document.body.style.backgroundImage = "url(" + localStorage.getItem("backgroundImage") + ")";
};
document.documentElement.style.setProperty("--opacity", (1 - (Boolean(localStorage.getItem("backgroundImage")) * 0.2)).toString());

document.getElementById("instructionContainerButton").addEventListener("click", () => {
  navigator.clipboard.writeText(`[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2018.09.02"]\n[White "Lordillidan"]\n[Black "Hikaru"]\n[Result "0-1"]\n[ECO "C65"]\n[WhiteElo "2860"]\n[BlackElo "3057"]\n[TimeControl "180"]\n[EndTime "12:49:18 PDT"]\n[Termination "Hikaru won by resignation"]\n[CurrentPosition "r3rbk1/5pp1/2q2n1p/2p1N3/4P3/1nPPB1NP/5PP1/R2R2K1 w - - 0 24"]\n1.e4 {[%clk 0:02:59]} e5 {[%clk 0:02:59]} 2.Nf3 {[%clk 0:02:58]} Nc6 {[%clk 0:02:59]} 3.Bb5 {[%clk 0:02:58]} Nf6 {[%clk 0:02:59]} 4.d3 {[%clk 0:02:57]} Bc5 {[%clk 0:02:57]} 5.c3 {[%clk 0:02:57]} O-O {[%clk 0:02:56]} 6.O-O {[%clk 0:02:56]} Re8 {[%clk 0:02:56]} 7.h3 {[%clk 0:02:54]} a6 {[%clk 0:02:55]} 8.Ba4 {[%clk 0:02:53]} d5 {[%clk 0:02:54]} 9.Nbd2 {[%clk 0:02:51]} h6 {[%clk 0:02:53]} 10.Re1 {[%clk 0:02:50]} b5 {[%clk 0:02:51]} 11.Bb3 {[%clk 0:02:48]} d4 {[%clk 0:02:51]} 12.Nf1 {[%clk 0:02:43]} Be6 {[%clk 0:02:49]} 13.Ng3 {[%clk 0:02:38]} Bxb3 {[%clk 0:02:43]} 14.axb3 {[%clk 0:02:38]} Qd7 {[%clk 0:02:40]} 15.b4 {[%clk 0:02:24]} Bf8 {[%clk 0:02:37]} 16.Qe2 {[%clk 0:02:22]} dxc3 {[%clk 0:02:22]} 17.bxc3 {[%clk 0:02:20]} a5 {[%clk 0:02:20]} 18.bxa5 {[%clk 0:02:16]} Nxa5 {[%clk 0:02:20]} 19.Be3 {[%clk 0:02:11]} c5 {[%clk 0:02:17]} 20.Red1 {[%clk 0:02:06]} Qc6 {[%clk 0:02:08]} 21.Qc2 {[%clk 0:01:45]} b4 {[%clk 0:02:02]} 22.Nxe5 {[%clk 0:01:30]} b3 {[%clk 0:01:53]} 23.Qxb3 {[%clk 0:01:03]} Nxb3 {[%clk 0:01:49]}  0-1`);
});

document.getElementById("createGifButton").addEventListener("click", () => {
  if (!document.getElementById("createGifInput").value) return;
  fetch("/api/v1/gifs/create", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pgn: document.getElementById("createGifInput").value
    })
  })
  .then((response) => response.json())
  .then(({ err, gifId }) => {
    if (err) return;
    let link = document.createElement("a");
    link.target = "_blank";
    link.href = "/public/chess/gifs/" + gifId + ".gif";
    link.click();
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