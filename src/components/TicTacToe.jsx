import React, { useState, useEffect } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import Reset from "./Reset";
import GameState from "./GameState";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";
import { Button, TextField } from "@mui/material";
import "../styles/tictac.css";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

function checkWinnerSimple(tiles) {
  for (const { combo } of winningCombinations) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      return tiles[a];
    }
  }
  return null;
}

function minimax(newTiles, isMaximizing) {
  const winner = checkWinnerSimple(newTiles);
  if (winner !== null) {
    if (winner === PLAYER_O) return { score: 1 };
    if (winner === PLAYER_X) return { score: -1 };
    return { score: 0 };
  }

  const moves = [];

  newTiles.forEach((_, index) => {
    if (newTiles[index] === null) {
      const copy = [...newTiles];
      copy[index] = isMaximizing ? PLAYER_O : PLAYER_X;
      const result = minimax(copy, !isMaximizing);
      moves.push({ index, score: result.score });
    }
  });

  if (moves.length === 0) {
    return { score: 0 };
  }

  return isMaximizing
    ? moves.reduce((best, move) => (move.score > best.score ? move : best), { score: -Infinity })
    : moves.reduce((best, move) => (move.score < best.score ? move : best), { score: Infinity });
}

function TicTacToe() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState(null);
  const [gameState, setGameState] = useState(GameState.inProgress);
  const [mode, setMode] = useState(""); // "" | "human" | "robot"
  const [playerXName, setPlayerXName] = useState("");
  const [playerOName, setPlayerOName] = useState("");
  const [namesSet, setNamesSet] = useState(false);

  const handleTileClick = (index) => {
    if (gameState !== GameState.inProgress || tiles[index] !== null) return;

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    clickSound.play();

    if (mode === "human") {
      setPlayerTurn(playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X);
    } else {
      const bestMove = minimax(newTiles, true).index;
      if (bestMove !== undefined) {
        newTiles[bestMove] = PLAYER_O;
        setTiles(newTiles);
      }
    }
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass(null);
  };

  const handleNameSubmit = () => {
    if (playerXName.trim()) {
      if (mode === "robot") {
        setPlayerOName("Robot");
      }
      if (mode === "human" && !playerOName.trim()) {
        alert("Please enter names for both players.");
        return;
      }
      setNamesSet(true);
    } else {
      alert("Please enter the name for Player X.");
    }
  };

  useEffect(() => {
    const winner = checkWinnerSimple(tiles);
    if (winner) {
      setGameState(winner === PLAYER_X ? GameState.playerXWins : GameState.playerOWins);
    } else if (tiles.every((tile) => tile !== null)) {
      setGameState(GameState.draw);
    }
  }, [tiles]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();
    }
  }, [gameState]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      {!mode ? (
        <div className="mode-selection">
          <h2>Select Game Mode</h2>
          <label>
            <input
              type="radio"
              value="human"
              checked={mode === "human"}
              onChange={() => setMode("human")}
            />
            Human vs Human
          </label><br/>
          <label>
            <input
              type="radio"
              value="robot"
              checked={mode === "robot"}
              onChange={() => setMode("robot")}
            />
            Human vs Robot
          </label>
        </div>
      ) : !namesSet ? (
        <div className="mode-selection">
          <div className="inp">
            <TextField
              value={playerXName}
              onChange={(e) => setPlayerXName(e.target.value)}
              variant="filled"
              color="primary"
              placeholder="Enter Player X Name"
              required
            /><br/><br/>
        
          {mode === "human" && (
            
              <TextField
                value={playerOName}
                onChange={(e) => setPlayerOName(e.target.value)}
                variant="filled"
                color="primary"
                placeholder="Enter Player O Name"
                required
              />
            
          )}
          
        <br/></div>
          <Button variant="contained" color="white" onClick={handleNameSubmit}>Start Game</Button>
          
        </div>
      ) : (
        <div>
          <p>Player X: {playerXName}</p>
          <p>Player O: {playerOName}</p>
          <div>
            <label>
              <input
                type="radio"
                value="human"
                checked={mode === "human"}
                onChange={() => setMode("human")}
              />
              Human vs Human
            </label>
            <label>
              <input
                type="radio"
                value="robot"
                checked={mode === "robot"}
                onChange={() => setMode("robot")}
              />
              Human vs Robot
            </label>
          </div>
          <Board
            playerTurn={playerTurn}
            tiles={tiles}
            onTileClick={handleTileClick}
            strikeClass={strikeClass}
          />
          <GameOver
            gameState={gameState}
            playerXName={playerXName}
            playerOName={playerOName}
          />
          <Reset gameState={gameState} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
