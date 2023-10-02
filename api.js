const express = require("express");
const router = express.Router();
const Database = require("@replit/database");
const db = new Database();
const fs = require("fs");
const crypto = require("crypto");
const { parse } = require("node-html-parser");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { parseMoves, ChessGif } = require("pgn2gif");
let chessGif = new ChessGif();

router.all("/api/v1/games/matchMaking", (req, res) => {
  db.get("matchMakingGames").then((matchMakingGames) => {
    if ((JSON.parse(matchMakingGames) || []).length) {
      res.json({
        err: null,
        gameId: (JSON.parse(matchMakingGames) || [])[0]
      });
    } else {
      crypto.randomBytes(4, (err, gameId) => {
        if (err) return res.json({
          err,
          gameId: null
        });
        db.set("matchMakingGames", JSON.stringify([
          ...JSON.parse(matchMakingGames) || [],
          ...[
            gameId.toString("hex")
          ]
        ])).then(() => {
          res.json({
            err: null,
            gameId: gameId.toString("hex")
          });
        });
      });
    }
  });
});

router.all("/api/v1/puzzle/random", (req, res) => {
  let requestPuzzle = async () => {
    let response = await (await fetch("https://api.chess.com/pub/puzzle/random")).json();
    let extractedMoves = parseMoves(response.pgn).map((move) => move.split("\r")[0]);
    let moves = [];
    let correctMovesRespondData = [];
    let chess = new (
      await import("chess.js")
    ).Chess();
    let errorFound = false;
    chess.load(response.fen);
    /*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => !(index % 2)).forEach((move, index) => {
      moves = [
        ...moves || [],
        ...[
          chess.moves({
            verbose: true
          })
        ]
      ];
      if (!chess.moves().includes(/*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => !(index % 2))[index])) {
        errorFound = true;
        return;
      };
      chess.move(/*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => !(index % 2))[index]);
      if (index !== (/*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => !(index % 2)).length - 1)) {
        if (!chess.moves().includes(/*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => index % 2)[index])) {
          errorFound = true;
          return;
        };
        correctMovesRespondData = [
          ...correctMovesRespondData || [],
          ...[
            chess.move(/*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => index % 2)[index])
          ]
        ];
      };
    });
    if (errorFound) return requestPuzzle();
    let gameEnd = chess.isGameOver();
    chess.load(response.fen);
    res.json({
      title: response.title,
      url: response.url,
      board: (chess.moves({
        verbose: true
      })[0].color === "w") ? chess.board() : chess.board().reverse().map((row) => row.reverse()),
      moves,
      correctMoves: /*response.pgn.split("\r\n").filter((element) => element !== "*").slice(-1)[0].split(" ").filter((move) => !Number(move.substring(0, 1)))parseMoves(response.pgn)*/extractedMoves.filter((_, index) => !(index % 2)),
      correctMovesRespondData,
      color: chess.moves({
        verbose: true
      })[0].color === "w",
      gameEnd
    });
  };
  requestPuzzle();
});

router.all("/api/v1/news", (req, res) => {
  fetch("https://worldchess.com/news")
  .then((response) => response.text())
  .then((response) => {
    res.json(parse(response).childNodes[1].childNodes[3].childNodes.find((childNode) => childNode.rawTagName === "main").childNodes.filter((childNode) => Array.from(childNode.classList?._set || []).includes("e2-note")).map((node) => ({
      title: node.childNodes[1].childNodes[1].childNodes[1].innerText,
      content: node.childNodes[1].childNodes[3].innerText,
      images: node.getElementsByTagName("img").map((image) => image.getAttribute("src"))
    })));
  });
});

router.all("/api/v1/gifs/create", (req, res) => {
  if (!parseMoves(req.body.pgn).length) return res.json({
    err: "No moves specified",
    gifId: null
  });
  chessGif.resetCache();
  chessGif.loadMoves(parseMoves(req.body.pgn));
  chessGif.createGif(0, parseMoves(req.body.pgn).length, false).then(() => {
    chessGif.asBase64Gif().arrayBuffer().then((arrayBuffer) => {
      crypto.randomBytes(4, (err, gifId) => {
        if (err) return res.json({
          err,
          gifId: null
        });
        fs.writeFile("./public/chess/gifs/" + gifId.toString("hex") + ".gif", Buffer.from(arrayBuffer), (err) => {
          if (err) return res.json({
            err,
            gifId: null
          });
          res.json({
            err: null,
            gifId: gifId.toString("hex")
          });
        });
      });
    });
  });
});

router.all("/api/v1/forum/posts/create", (req, res) => {
  
});

module.exports = router;