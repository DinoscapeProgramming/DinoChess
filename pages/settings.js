let iconSelect = new IconSelect("pieceStyleIconSelect", {
  selectedIconWidth: 23,
  selectedIconHeight: 23,
  selectedBoxPadding: 1,
  iconsWidth: 48,
  iconsHeight: 48,
  boxIconSpace: 1,
  vectoralIconNumber: 2,
  horizontalIconNumber: 6
});
iconSelect.refresh(['alpha', 'anarcandy', 'caliente', 'california', 'cardinal',  'cburnett', 'celtic', 'chess7', 'chessnut', 'companion', /*'disguised', */'dubrovny', 'fantasy', 'fresca', 'gioco', 'governor', 'horsey', 'icpieces', 'kiwen-suwi', 'kosal', 'leipzig', 'letter', 'libra', 'maestro', 'merida', /*'mono', */'mpchess', 'pirouetti', 'pixel', 'reillycraig', 'riohacha', 'shapes', 'spatial', 'staunty', 'tatiana'].map((pieceStyle) => ({
  iconFilePath: "/public/chess/pieces/" + pieceStyle + "/wN.svg",
  iconValue: pieceStyle
})));
iconSelect.setSelectedIndex(iconSelect.getIcons().map((pieceStyleIcon) => pieceStyleIcon.iconValue).indexOf(localStorage.getItem("pieceStyle") || "cburnett"));

document.getElementById("settingsIcon").addEventListener("click", () => {
  document.getElementById("pieceStyleIconSelect").style.display = (document.getElementById("pieceStyleIconSelect").style.display === "block") ? "none" : "block";
  document.getElementById("backgroundImageFileInput").style.display = (document.getElementById("backgroundImageFileInput").style.display === "block") ? "none" : "block";
});
document.getElementById("pieceStyleIconSelect").addEventListener("click", () => {
  if (document.getElementById("pieceStyleIconSelect-box-scroll").style.display === "none") {
    localStorage.setItem("pieceStyle", iconSelect.getSelectedValue());
  };
});
document.getElementById("backgroundImageFileInput").addEventListener("dragover", (event) => {
  event.preventDefault();
});
document.getElementById("backgroundImageFileInput").addEventListener("dragenter", (event) => {
  event.preventDefault();
});
document.getElementById("backgroundImageFileInput").addEventListener("drop", ({ dataTransfer }) => {
  event.preventDefault();
  document.getElementById("backgroundImageFileInput").files = dataTransfer.files;
  let createdEvent = document.createEvent("HTMLEvents");
  createdEvent.initEvent("change", true, true);
  createdEvent.eventName = "change";
  document.getElementById("backgroundImageFileInput").dispatchEvent(createdEvent);
});
document.getElementById("backgroundImageFileInput").addEventListener("change", () => {
  var fileReader = new FileReader();
  fileReader.addEventListener('load', () => {
    localStorage.setItem("backgroundImage", fileReader.result);
    document.body.style.backgroundImage = "url(" + fileReader.result + ")";
    document.documentElement.style.setProperty("--opacity", "0.8");
  });
  fileReader.readAsDataURL(document.getElementById("backgroundImageFileInput").files[0]);
});