let lastTime = 0;
let gameOver = false;
let SNAKE_SPEED = 5;
const snakeBody = [{ x: 11, y: 11 }];
let newBody = 0;
let GRID_SIZE = 21;
let food = randomFood();
const EXPANSION_RATE = 1;
const gameBoard = document.querySelector("#game-board");
const eazyBtn = document.querySelector(".eazy");
const mediumBtn = document.querySelector(".medium");
const hardBtn = document.querySelector(".hard");
const diff = document.querySelector(".difficulty");
// ================================================================
// 頁面刷新
function animation(currentTime) {
  if (gameOver) {
    return alert("You loose!");
  }

  let timeDuration;
  timeDuration = (currentTime - lastTime) / 1000;
  window.requestAnimationFrame(animation);
  if (timeDuration < 1 / SNAKE_SPEED) return;
  lastTime = currentTime;

  update();
  draw();
}

window.requestAnimationFrame(animation);

// ================================================================
// 所有執行的function

function update() {
  updateSnake();
  updateFood();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = "";
  drawSnake(gameBoard);
  drawFood(gameBoard);
}

// ================================================================
// 檢查有沒有死掉

function checkDeath() {
  gameOver = insideOfSnake() || outofGrid(getSnakeHead());
}

// ================================================================
// snakeBody array狀態更新

function updateSnake() {
  // 蛇變長

  // 蛇移動的邏輯
  const inputDirection = getInputDirection();

  //   這個for loop是會在每一次刷新更換每項snakeBody的物件成為他上一個物件
  // 假如snakeBody[0]是{x:1,y:1} 這個array會讓snakeBody[1]在下次刷新變成{x:1,y:1}

  //   如果蛇的長度只有1不會跑下面的loop
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  // 此時的snakeBody[0]和snakeBody[1]是一樣的

  //   這個是會刷新snakehead

  //   這邊才是改變snakeBody[0]之後

  snakeBodyIncreaseLength();
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
  }
}

function drawSnake(gameBoard) {
  snakeBody.forEach((eachbody) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = eachbody.y;
    snakeElement.style.gridColumnStart = eachbody.x;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  });

}

function expandSnake(amount) {
  // amount等於是增加長度的比例
  newBody += amount;
}

function onSnake(position, { ignoreHead = false } = {}) {
  let onSnake = snakeBody.some((body, index) => {
    if (ignoreHead && index === 0) return false;
    return position.x === body.x && position.y === body.y;
  });
  return onSnake;
}

// snake要增加的長度
//
function snakeBodyIncreaseLength() {
  for (let i = 0; i < newBody; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  console.log(newBody);
  newBody = 0;
}

// 找到snake的頭
function getSnakeHead() {
  return snakeBody[0];
}

// snake碰到自己就會回傳false
export function insideOfSnake() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}

function updateFood() {
  if (onSnake(food)) {
    food = randomFood();
  }
}

function drawFood(gameBoard) {
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function randomFood() {
  let newFoodPosition;

  while (newFoodPosition === undefined || onSnake(newFoodPosition)) {
    newFoodPosition = newFood();
  }
  return newFoodPosition;
}

function newFood() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

function outofGrid(position) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}


// ================================================================
// 難度設定

eazyBtn.addEventListener("click", () => {
  console.log(SNAKE_SPEED);
  SNAKE_SPEED = 3;
  diff.style.display = "none";
  readyToStart()
});
mediumBtn.addEventListener("click", () => {
  SNAKE_SPEED = 10;
  diff.style.display = "none";
  readyToStart()
});
hardBtn.addEventListener("click", () => {
  SNAKE_SPEED = 15;
  diff.style.display = "none";
  readyToStart()
});

// ================================================================
// 操作設定

let inputDirection = { x: 0, y: 0 };


function readyToStart() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (inputDirection.y != 0) return;
        inputDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (inputDirection.y != 0) return;
        inputDirection = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (inputDirection.x != 0) return;
        inputDirection = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (inputDirection.x != 0) return;
        inputDirection = { x: 1, y: 0 };
        break;
    }
  });

}


function getInputDirection() {
  return inputDirection;
}


