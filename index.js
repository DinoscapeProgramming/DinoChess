const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*"
  }
});
const chessEngine = require("chess-ai-kong");
chessEngine.setOptions({
  depth: 4,
  monitor: false,
  strategy: "basic",
  timeout: 30000
});
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Database = require("@replit/database");
const db = new Database();
const server = require('./server.js');
const api = require('./api.js');
let games = {};


app.set("views", __dirname);
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use("/pages", express.static("pages"));
app.use("/images", express.static("images"));
app.use(bodyParser.json());
app.use(api, server);

db.set("matchMakingGames", JSON.stringify([])).then(() => {
  console.log("Successfully cleared all games for matchmaking");
});;

io.on("connection", async (socket, name) => {
  let { Chess } = await import("chess.js");
  socket.on("joinGame", async ({ gameId, username }) => {
    if (
      (
        (
          typeof gameId !== "string"
        ) || (
          gameId.length < 1
        )
      ) || (
        (
          typeof username !== "string"
        ) || (
          username.length < 1
        )
      ) || (
        io.sockets.adapter.rooms.get(gameId)?.size > 1
      )
    ) return;
    if (io.sockets.adapter.rooms.get(gameId)?.size > 0) {
      db.set("matchMakingGames", JSON.stringify((JSON.parse(await db.get("matchMakingGames")) || []).filter((_, index) => Boolean(index))));
    };
    games = {
      ...games,
      ...{
        [gameId]: {
          active: io.sockets.adapter.rooms.get(gameId)?.size > 0,
          game: (!Object.keys(games).includes(gameId)) ? new Chess() : (games[gameId] || {}).game,
          colors: {
            ...(games[gameId] || {}).colors || {},
            ...{
              [socket.id]: (Object.entries((games[gameId] || {}).colors || {}).length > 0) ? ((Object.values((games[gameId] || {}).colors || {})[0]) ? 0 : 1) : Math.floor(Math.random() * 2)
            }
          },
          players: {
            ...(games[gameId] || {}).players || {},
            ...{
              [socket.id]: username
            }
          }
        }
      }
    };
    socket.join(gameId);
    socket.to(gameId).emit("activeState", {
      activeState: games[gameId].active,
      opponent: username
    });
    socket.emit("chessBoard", {
      active: games[gameId].active,
      board: (games[gameId].colors[socket.id]) ?  games[gameId].game.board() : games[gameId].game.board().reverse().map((row) => row.reverse()),
      moves: games[gameId].game.moves({
        verbose: true
      }),
      color: games[gameId].colors[socket.id],
      opponent: (Object.entries(games[gameId].players).length > 1) ? Object.entries(games[gameId].players).find(([playerId]) => playerId !== socket.id)?.[1] : false
    });
    socket.on("move", (move) => {
      if (!games[gameId] || !games[gameId].active || (games[gameId].colors[socket.id] === (games[gameId].game.history().length % 2)) || !games[gameId].game.moves().includes(move)) return;
      io.to(gameId).emit("move", {
        move: games[gameId].game.move(move),
        newMoves: games[gameId].game.moves({
          verbose: true
        }),
        gameEnd: (games[gameId].game.isGameOver()) ? {
          type: (games[gameId].game.isCheckmate()) ? "checkmate" : ((games[gameId].game.isStalemate()) ? "stalemate" : ((games[gameId].game.isThreefoldRepetition()) ? "threefold repetition" : ((games[gameId].game.isInsufficientMaterial()) ? "insufficient material" : "50-move rule"))),
          draw: !games[gameId].game.isCheckmate(),
          winner: (games[gameId].game.isCheckmate()) ? socket.id : false
        } : false,
        players: games[gameId].players
      }, () => {
        if (games[gameId].game.isGameOver()) {
          io.sockets.adapter.rooms.get(gameId).forEach((player) => {
            io.of("/").sockets.get(player).disconnect();
          });
        };
      });
    });
    socket.on("disconnecting", () => {
      if (!games[gameId] || !games[gameId].active) return;
      socket.to(gameId).emit("disconnectionGameEnd", (Object.entries(games[gameId].players).length > 1) ? Object.entries(games[gameId].players).find(([playerId]) => playerId !== socket.id)?.[1] : false, () => {
        games = Object.entries(games).filter((game) => game[0] !== gameId).reduce((data, entry) => ({
          ...data,
          ...{
            [entry[0]]: entry[1]
          }
        }), {});
      });
    });
  });
  socket.on("playComputer", () => {
    let chess = new Chess();
    let turn = 0;
    socket.emit("chessBoard", {
      board: chess.board(),
      moves: chess.moves({
        verbose: true
      })
    });
    socket.on("move", (move) => {
      if (turn || !chess.moves().includes(move)) return;
      chess.move(move);
      let chessEngineMoveData;
      let winner;
      if (!chess.isGameOver()) {
        turn = 1;
        chessEngineMoveData = chess.move(chessEngine.play(chess.history()));
        if (chess.isCheckmate()) {
          winner = 1;
        };
      } else if (chess.isCheckmate()) {
        winner = 0;
      };
      turn = 0;
      socket.emit("move", {
        chessEngineMoveData,
        newMoves: chess.moves({
          verbose: true
        }),
        gameEnd: (chess.isGameOver()) ? {
          type: (chess.isCheckmate()) ? "checkmate" : ((chess.isStalemate()) ? "stalemate" : ((chess.isThreefoldRepetition()) ? "threefold repetition" : ((chess.isInsufficientMaterial()) ? "insufficient material" : "50-move rule"))),
          draw: !chess.isCheckmate(),
          winner: (chess.isCheckmate()) ? winner : false
        } : false
      });
    });
  });
});

const listen = http.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
});