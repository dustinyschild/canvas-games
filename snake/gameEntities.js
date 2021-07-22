"use strict";

function randomNumber(min, max) {
  const diff = max - min;
  const number = Math.floor(Math.random() * diff);

  return number + min;
}

class GameArea {
  constructor(units, unitSize) {
    this.canvas = document.getElementById("myCanvas");
    this.rectSize = units * unitSize;
    this.canvas.height = this.rectSize;
    this.canvas.width = this.rectSize;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "48px serif";
  }

  fillBackground() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.rectSize, this.rectSize);
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    this.fillBackground();
  
    snake.map(this.drawNode);
    if (game.food) {
      this.drawNode(game.food);
    }
  }

  write(message, x, y) {
    this.ctx.fillText(message, x, y);
  }
  
  drawNode = (node) => {
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(node.x, node.y, 8, 8);
    this.ctx.fill();
    this.ctx.closePath();
  }

}

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Node extends Coordinate {
  constructor(x, y, direction, next) {
    super(x, y);
    this.direction = direction;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
    this.direction = "right";
  }

  insertAtHead(x, y, direction) {
    const newNode = new Node(x, y, direction, this.head);

    this.head = newNode;
    this.length++;
    return newNode;
  }

  getTail() {
    let currentNode = this.head;
    while (currentNode.next) {
      currentNode = currentNode.next;
    }

    return currentNode;
  }

  insertAtTail() {
    const currentTail = this.getTail();
    let newTailX;
    let newTailY;

    switch (currentTail.direction) {
      case "up":
        newTailX = currentTail.x;
        newTailY = currentTail.y + 8;
      case "down":
        newTailX = currentTail.x;
        newTailY = currentTail.y - 8;
      case "left":
        newTailX = currentTail.x + 8;
        newTailY = currentTail.y;
      case "right":
        newTailX = currentTail.x - 8;
        newTailY = currentTail.y;
    }

    currentTail.next = new Node(
      newTailX,
      newTailY,
      currentTail.direction,
      null
    );
    this.length++;
  }

  map(callback) {
    const values = [];
    let currentNode = this.head;

    for (let i = 0; i < this.length; i++) {
      values.push(callback(currentNode));
      currentNode = currentNode.next;
    }

    return values;
  }

  setTailAsHead() {
    let previousNode = null;
    let currentNode = this.head;

    // store last 2 nodes for update
    while (currentNode.next) {
      previousNode = currentNode;
      currentNode = currentNode.next;
    }

    previousNode.next = null;
    currentNode.direction = this.direction;
    currentNode.next = this.head;
    this.head = currentNode;
  }
}

class Snake extends LinkedList {
  move() {
    const direction = this.direction;
    const previousHead = this.head;
    this.setTailAsHead();

    switch (direction) {
      case "up":
        this.head.x = previousHead.x;
        this.head.y = previousHead.y - 8;
        break;
      case "down":
        this.head.x = previousHead.x;
        this.head.y = previousHead.y + 8;
        break;
      case "left":
        this.head.x = previousHead.x - 8;
        this.head.y = previousHead.y;
        break;
      case "right":
        this.head.x = previousHead.x + 8;
        this.head.y = previousHead.y;
        break;
    }
  }

  grow() {
    this.insertAtTail();
  }
}

class Food extends Coordinate {
  constructor(length, increment) {
    const numberOfUnits = length / increment;
    super(
      randomNumber(0, numberOfUnits) * increment,
      randomNumber(0, numberOfUnits) * increment
    );
  }
}

class Game {
  constructor(speed) {
    this.speed = speed;
    this.tickCount = 0;
    this.interval = null;
    this.score = 0;
    this.rules = [this.isInBounds, this.isNotOverlapping, this.foundFood];
    this.food = null;
  }

  placeFood = () => {
    this.food = new Food(gameArea.rectSize, 8);
  }

  start = () => {
    if (this.interval) {
      return;
    }
    this.interval = setInterval(this.update, this.speed);
  };

  pause = (message = "Paused", x = 186, y = 256) => {
    clearInterval(this.interval);
    this.interval = null;

    gameArea.draw();
    gameArea.write(message, x, y);
  };

  update = () => {
    //This might need to move to after the update is made? investigate further
    const hasBrokenRules = this.rules.some((rule) => {
      const ruleBroken = !rule();

      return ruleBroken;
    });

    if (hasBrokenRules) {
      this.pause("Game Over", 144, 256);
      return;
    }

    snake.move();
    this.tickCount++;
    gameArea.draw();
  };

  foundFood = () => {
    if (snake.head.x === this.food.x && snake.head.y === this.food.y) {
      // side effects
      // increment score count?
  
      snake.grow();
      this.placeFood();
    }
  
    return true;
  };

  isInBounds = () => {
    //this is adjusted to account for coordinates based off the top left corner
    const top = 0,
      bottom = 504,
      left = 0,
      right = 504;
  
    if (snake.head.y < top) {
      return false;
    }
    if (snake.head.y > bottom) {
      return false;
    }
    if (snake.head.x < left) {
      return false;
    }
    if (snake.head.x > right) {
      return false;
    }
  
    return true;
  };

  isNotOverlapping = () => {
    // get x and y coords as a string
    const nodes = snake.map(node => node.x.toString() + node.y.toString());

    //remove duplicates
    const uniqueNodes = new Set(nodes);

    // if no duplicates are found, then they are not overlapping
    return nodes.length === uniqueNodes.size;
  }
}