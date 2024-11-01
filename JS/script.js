document.onselectstart = function () {
  return false;
};

//main scenes
const menu = document.body.querySelector("main.menu");
const gameSection = document.querySelector(".game");
const result = document.querySelector(".result");

//buttons
const startBtn = document.body.querySelector(".menu__btn--play");
const saveSettingsBtn = document.querySelector(".menu__saveSettingsBtn");
const playAgainBtn = document.querySelector(".result__playAgain");
const backToMenuBtn = document.querySelector(".result__backToMenu");
const difficultyLevelButtons = [
  ...document.querySelectorAll(".menu__wrapper .menu__btn"),
];

//variables to handle menu section
const custom = document.querySelector(".menu__custom");
const exitCustomSettings = document.querySelector(".fa-times");
const clickedBtnsIndex = [1];
let pointToGet = document.getElementById("points");
let targetsMax = document.getElementById("targets");
let addNewTarget = document.getElementById("speed");
let difficultyLevel = "normal";
let isStarted = false;

//variables to handle game section
const statisticsWrapper = document.querySelector(".game__statisticsWrapper");
const pointsNumber = document.querySelector(".game__statistics--points");
const targetsNumber = document.querySelector(".game__statistics--targets");
let pointsToWin = 25;
let amountOfElements = 8;
let addTargetTime = 500;
let counter = 0;
let activeElements = 0;
let onOffInterval = false;
let targets;

//variables to handle result section
const gameResult = document.querySelector(".result__title");
const statisticsOfGame = document.querySelector(".result__statistics");
let resultOfGame;

//exit custom settings using 'X'
const exitSettingsUsingX = () => {
  const index = clickedBtnsIndex[clickedBtnsIndex.length - 2];
  const lastButton = difficultyLevelButtons[index];
  difficultyLevelButtons.forEach((btn) => {
    btn.classList.remove("menu__btn--checked");
  });
  lastButton.classList.add("menu__btn--checked");
  custom.classList.remove("menu__custom--active");
};
exitCustomSettings.addEventListener("click", exitSettingsUsingX);

//take values from custom settings
function takeValues() {
  difficultyLevel = "custom";
  pointsToWin = pointToGet.value;
  amountOfElements = targetsMax.value;
  addTargetTime = addNewTarget.value;
  custom.classList.remove("menu__custom--active");
}

//difficulty level settings
const gameRules = (button) => {
  const clickedButton = button.target;
  if (difficultyLevelButtons[0] == clickedButton) {
    difficultyLevel = "easy";
    pointsToWin = 20;
    amountOfElements = 10;
    addTargetTime = 800;
  } else if (difficultyLevelButtons[1] == clickedButton) {
    difficultyLevel = "normal";
    pointsToWin = 25;
    amountOfElements = 8;
    addTargetTime = 600;
  } else if (difficultyLevelButtons[2] == clickedButton) {
    difficultyLevel = "hard";
    pointsToWin = 30;
    amountOfElements = 5;
    addTargetTime = 600;
  } else if (difficultyLevelButtons[3] == clickedButton) {
    //open custom settingsg
    custom.classList.add("menu__custom--active");
    saveSettingsBtn.addEventListener("click", takeValues);
  }
};

//change difficulty level
const chooseDifficultyLevel = (button) => {
  const lastClickedBtn = difficultyLevelButtons.indexOf(button.target);
  clickedBtnsIndex.push(lastClickedBtn);
  difficultyLevelButtons.forEach((btn) => {
    btn.classList.remove("menu__btn--checked");
  });
  button.target.classList.add("menu__btn--checked");
  gameRules(button);
};

difficultyLevelButtons.forEach((button) =>
  button.addEventListener("click", chooseDifficultyLevel)
);

//handle target hit
function shotOnTarget() {
  gameSection.removeChild(this);
  counter++;
  activeElements--;
  pointsNumber.textContent = `Points: ${counter}/${pointsToWin}`;
  targetsNumber.textContent = `Targets: ${activeElements}/${amountOfElements}`;
}

//add content to elements in section result
const statusGame = () => {
  if (resultOfGame == 2) {
    gameResult.classList.add("result__win");
    gameResult.innerText = "You won!";
    statisticsOfGame.innerHTML = `
  <p class="result__text result__text1">You shot down enough targets for ${difficultyLevel} level.</p>
  <p class="result__text result__text2">If you want to play again on the same difficulty press the <span>"PLAY
  AGAIN"</span> button! If you want change the level press <span>"GO TO MENU"!</span></p>
  `;
  } else if (resultOfGame == 1) {
    gameResult.classList.add("result__lost");
    gameResult.innerText = "You lost!";

    statisticsOfGame.innerHTML = `
  <p class="result__text">You shot down <span>${counter}/${pointsToWin}</span> targets on ${difficultyLevel} difficulty. Unfortunetly it was not enought to win!</p>

  <p class="result__text result__text2">Try again by pressing the <span>"PLAY AGAIN"</span> button! If you want change the level press <span>"GO TO MENU"</span>!</p>
  `;
  }
};

//handle scene change, on section result, off section game
const elementsAfterGame = () => {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    dot.remove();
  });
  gameSection.classList.remove("show");
  gameSection.classList.add("hide");
  result.classList.remove("hide");
  result.classList.add("show");
  statusGame();
};

//start new game on previously selected rules
const playAgain = () => {
  gameSection.classList.remove("hide");
  result.classList.remove("show");
  result.classList.add("hide");
  statisticsWrapper.classList.remove("showStats");
  gameResult.classList.remove("result__lost");
  gameResult.classList.remove("result__win");
  isStarted = false;
  counter = 0;
  activeElements = 0;
  resultOfGame = 0;
  onOffInterval = false;
  startGame();
};
playAgainBtn.addEventListener("click", playAgain);

//handle backToMenu button
const backToMenu = () => {
  window.location.reload();
};
backToMenuBtn.addEventListener("click", backToMenu);

//countdown before a game
const countdown = () => {
  const countdownArr = ["3", "2", "1", "Shoot!"];
  const div = document.createElement("div");
  gameSection.appendChild(div);
  div.classList.add("countingToStart");

  let arrayIndex = 0;

  const countdownTimeout = () => {
    if (arrayIndex === countdownArr.length) {
      setTimeout(function () {
        div.remove();
        arrayIndex = 0;
        makeTargets();
        return;
      }, 10);
    } else {
      div.innerText = countdownArr[arrayIndex];
      arrayIndex++;
      setTimeout(countdownTimeout, 1000);
    }

    if (arrayIndex === countdownArr.length - 1) {
      pointsNumber.innerHTML = `Points: ${counter}/${pointsToWin}`;
      targetsNumber.innerHTML = `Targets: ${activeElements}/${amountOfElements}`;
      statisticsWrapper.classList.add("showStats");
    }
  };
  setTimeout(countdownTimeout, 1000);
};

//add new targets, handle result of game
function makeTargets() {
  const positionY = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
  const positionX = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
  const dot = document.createElement("div");
  dot.className = "dot";

  if (counter == pointsToWin) {
    resultOfGame = 2;
    window.clearInterval(targets);
    elementsAfterGame();
  } else if (activeElements == amountOfElements) {
    resultOfGame = 1;
    window.clearInterval(targets);
    elementsAfterGame();
  } else {
    gameSection.appendChild(dot);
    activeElements++;
    targetsNumber.textContent = `Targets: ${activeElements}/${amountOfElements}`;
    dot.style.top = positionY + "%";
    dot.style.left = positionX + "%";
    dot.addEventListener("click", shotOnTarget);
  }

  if (onOffInterval === false) {
    onOffInterval = true;
    targets = setInterval(makeTargets, addTargetTime);
  }
}

//handle game start, on game section, off menu section
function startGame() {
  menu.style.pointerEvents = "none";
  setTimeout(function () {
    menu.style.pointerEvents = "auto";
  }, 4000);

  if (!isStarted) {
    menu.classList.add("hide");
    gameSection.classList.add("show");
    isStarted = !isStarted;
    setTimeout(countdown, 1000);
  } else {
    isStarted = !isStarted;
    menu.classList.remove("hide");
  }
}
startBtn.addEventListener("click", startGame);
