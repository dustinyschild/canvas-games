"use strict";

const gameArea = new GameArea(64, 8);
const game = new Game(75);
const snake = new Snake();

snake.insertAtHead(8, 8, "right");
snake.insertAtHead(16, 8, "right");
snake.insertAtHead(24, 8, "right");
snake.insertAtHead(32, 8, "right");

game.placeFood();

window.addEventListener("keydown", function (e) {
  const useableKeys = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "w",
    "s",
    "a",
    "d",
    " ",
  ];

  if (useableKeys.indexOf(e.key) !== -1) {
    //prevent key defaults
    e.preventDefault();
  }

  const opposite = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  let newDirection;
  if (e.key === "ArrowUp" || e.key === "w") {
    newDirection = "up";
  } else if (e.key === "ArrowDown" || e.key === "s") {
    newDirection = "down";
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    newDirection = "left";
  } else if (e.key === "ArrowRight" || e.key === "d") {
    newDirection = "right";
  } else {
    return;
  }

  //snake can't turn back on itself
  if (newDirection === opposite[snake.direction]) {
    return;
  } else {
    snake.direction = newDirection;
  }
});

//initialize game screen
gameArea.draw();
