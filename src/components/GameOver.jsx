import React from "react";
import GameState from "./GameState";

function GameOver({ gameState, playerXName, playerOName }) {
  let message = "";

  if (gameState === GameState.playerXWins) {
    message = `Winner: ${playerXName}`;
  } else if (gameState === GameState.playerOWins) {
    message = `Winner: ${playerOName}`;
  } else if (gameState === GameState.draw) {
    message = "It's a draw!";
  }

  return <h2>{message}</h2>;
}

export default GameOver;
