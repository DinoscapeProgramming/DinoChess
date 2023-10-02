const express = require("express");
const router = express.Router();
const { parse } = require("node-html-parser");
const { parseMoves, ChessGif } = require("pgn2gif");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const videos = require("./videos.json");

router.all("/", (req, res) => {
  fetch("https://worldchess.com/news")
  .then((response) => response.text())
  .then((response) => {
    res.render("pages/home/index.ejs", {
      news: parse(response).childNodes[1].childNodes[3].childNodes.find((childNode) => childNode.rawTagName === "main").childNodes.filter((childNode) => Array.from(childNode.classList?._set || []).includes("e2-note")).map((node) => ({
        title: node.childNodes[1].childNodes[1].childNodes[1].innerText,
        content: node.childNodes[1].childNodes[3].innerText,
        images: node.getElementsByTagName("img").map((image) => image.getAttribute("src"))
      }))
    });
  });
});

router.all("/game/:gameId", (req, res) => {
  res.sendFile("pages/game/index.html", {
    root: __dirname
  });
});

router.all("/computer", (req, res) => {
  res.sendFile("pages/computer/index.html", {
    root: __dirname 
  });
});

router.all("/puzzles", (req, res) => {
  res.sendFile("pages/puzzles/index.html", {
    root: __dirname 
  });
});

router.all("/vision", (req, res) => {
  res.sendFile("pages/vision/index.html", {
    root: __dirname 
  });
});

router.all("/news/:newsId", async (req, res) => {
  res.render("pages/news/index.ejs", {
    newsId: req.params.newsId,
    news: (await Promise.all(["https://worldchess.com/news/", "https://worldchess.com/news/page-2/", "https://worldchess.com/news/page-3/"].map(async (newsPage) => parse(await (await fetch(newsPage)).text()).childNodes[1].childNodes[3].childNodes.find((childNode) => childNode.rawTagName === "main").childNodes.filter((childNode) => Array.from(childNode.classList?._set || []).includes("e2-note")).map((node) => ({
      title: node.childNodes[1].childNodes[1].childNodes[1].innerText,
      content: node.childNodes[1].childNodes[3].innerText,
      images: node.getElementsByTagName("img").map((image) => image.getAttribute("src"))
    }))))).flat()
  });
});

router.all("/videos", (req, res) => {
  res.render("pages/videos/index.ejs", {
    videos
  });
});

router.all("/video/:videoId", (req, res) => {
  fetch("https://lichess.org/video/" + req.params.videoId)
  .then((response) => response.text())
  .then((response) => {
    res.render("pages/video/index.ejs", {
      videoId: req.params.videoId,
      videoTitle: videos.find((video) => video.id === req.params.videoId)?.title,
      videoAuthor: videos.find((video) => video.id === req.params.videoId)?.author,
      videoDescription: parse(response).querySelector(".description")?.innerText
    });
  });
});

router.all("/streamers", (req, res) => {
  res.sendFile("pages/streamers/index.html", {
    root: __dirname 
  });
});

router.all("/gifMaker", (req, res) => {
  res.sendFile("pages/gifMaker/index.html", {
    root: __dirname 
  });
});

router.all("/manifest.json", (req, res) => {
  res.sendFile("manifest.json", {
    root: __dirname
  });
});

router.all("/serviceWorker.js", (req, res) => {
  res.sendFile("serviceWorker.js", {
    root: __dirname
  });
});

router.all("/robots.txt", (req, res) => {
  res.sendFile("robots.txt", {
    root: __dirname
  });
});

module.exports = router;