import { Button } from "@mui/material";
import React from "react";

function Reset({ gameState, onReset }) {
  return (
    <Button variant="contained" color="success" onClick={onReset}>
      {gameState === 0 ? "Reset Game" : "Play Again"}
    </Button>
  );
}

export default Reset;
