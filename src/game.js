// Selectors
const $ = document;
const canvas = $.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = $.getElementById("animations");
const ghostFrames = $.getElementById("ghost");

const createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

let fps = 30;
let oneBlockSize = 20;
// let pacman;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.3; // 18.18 // if it goes bigger, the black blocks gets smaller
let wallOfset = (oneBlockSize - wallSpaceWidth) / 2; // 0.9
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (map[0].length - 2) * oneBlockSize,
    y: (map.length - 2) * oneBlockSize,
  },
];

let gameLoop = () => {
  draw();
  update();
};

let update = () => {
  pacman.moveProcess();
  pacman.eat();
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
  if (pacman.checkGhostCollision()) {
    console.log("hahahha");
    restartGame();
  }
};
let restartGame = () => {
  createNewPacman();
  createGhosts();
  lives--;
  if (lives == 0) {
    gameOver();
  }
};
let gameOver = () => {
  drawGameOver();
  clearInterval(gameInterval);
};
let drawGameOver = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Game Over!", 150, 200);
};

let drawLives = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1) + 10);

  for (let i = 0; i < lives; i++) {
    canvasContext.drawImage(
      pacmanFrames,
      2 * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      350 + i * oneBlockSize,
      oneBlockSize * map.length + 10,
      oneBlockSize,
      oneBlockSize
    );
  }
};

let drawFoods = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 3,
          oneBlockSize / 3,
          foodColor
        );
      }
    }
  }
};
let drawScore = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Score: " + score,
    0,
    oneBlockSize * (map.length + 1) + 10
  );
};

let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
};

let draw = () => {
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  drawScore();
  drawFoods();
  pacman.draw();
  drawGhosts();
  drawLives();
};
let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
  for (i = 0; i < map.length; i++) {
    for (j = 0; j < map[i].length; j++) {
      if (map[i][j] == 1) {
        // So this will be a wall
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
      }

      if (j > 0 && map[i][j - 1] == 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize + wallOfset,
          wallSpaceWidth + wallOfset,
          wallSpaceWidth,
          wallInnerColor
        );
      }

      if (j < map[0].length - 1 && map[i][j + 1] == 1) {
        createRect(
          j * oneBlockSize + wallOfset,
          i * oneBlockSize + wallOfset,
          wallSpaceWidth + wallOfset,
          wallSpaceWidth,
          wallInnerColor
        );
      }
      if (i > 0 && map[i - 1][j] == 1) {
        createRect(
          j * oneBlockSize + wallOfset,
          i * oneBlockSize,
          wallSpaceWidth,
          wallSpaceWidth + wallOfset,
          wallInnerColor
        );
      }
      if (i < map.length - 1 && map[i + 1][j] == 1) {
        createRect(
          j * oneBlockSize + wallOfset,
          i * oneBlockSize + wallOfset,
          wallSpaceWidth,
          wallSpaceWidth + wallOfset,
          wallInnerColor
        );
      }
    }
  }
};

let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5
  );
};

let createGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount * 2; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i
    );
    ghosts.push(newGhost);
  }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;

  setTimeout(() => {
    if (k == 37 || k == 65) {
      // Left
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      // Up
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      // Right
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 83 || k == 40) {
      // Button
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});
