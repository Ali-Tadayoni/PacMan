// Selectors
const $ = document;
const canvas = $.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = $.getElementById("animations");
const ghostFrames = $.getElementById("ghost");

const createReact = (x, y, width, height, color) => {
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

const DIRECTION_LEFT = 4;
const DIRECTION_RIGHT = 3;
const DIRECTION_UP = 2;
const DIRECTION_BOTTOM = 1;

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

let gameLoop = () => {
  update();
  draw();
};

let update = () => {
  pacman.moveProcess();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let draw = () => {
  createReact(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  pacman.draw();
};

let drawWalls = () => {
  for (i = 0; i < map.length; i++) {
    for (j = 0; j < map[i].length; j++) {
      if (map[i][j] == 1) {
        // So this will be a wall
        createReact(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
      }

      if (j > 0 && map[i][j - 1] == 1) {
        createReact(
          j * oneBlockSize,
          i * oneBlockSize + wallOfset,
          wallSpaceWidth + wallOfset,
          wallSpaceWidth,
          wallInnerColor
        );
      }

      if (j < map[0].length - 1 && map[i][j + 1] == 1) {
        createReact(
          j * oneBlockSize + wallOfset,
          i * oneBlockSize + wallOfset,
          wallSpaceWidth + wallOfset,
          wallSpaceWidth,
          wallInnerColor
        );
      }
      if (i > 0 && map[i - 1][j] == 1) {
        createReact(
          j * oneBlockSize + wallOfset,
          i * oneBlockSize,
          wallSpaceWidth,
          wallSpaceWidth + wallOfset,
          wallInnerColor
        );
      }
      if (i < map.length - 1 && map[i + 1][j] == 1) {
        createReact(
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

createNewPacman();
gameLoop();
