document.onselectstart = function () {
  return false;
};
const startBtn = document.body.querySelector(".menu__btn--play");
const menu = document.body.querySelector("main.menu");
const gameSection = document.querySelector(".game");
const statisticsWrapper = document.querySelector(".game__statisticsWrapper");
const result = document.querySelector(".result");
const pointsNumber = document.querySelector(".game__statistics--points");
const targetsNumber = document.querySelector(".game__statistics--targets");
let difficultyLevel = "normal";
let isStarted = false;
const custom = document.querySelector(".menu__custom");
const exitCustomSettings = document.querySelector(".fa-times");
const saveSettingsBtn = document.querySelector(".menu__saveSettingsBtn");
const gameResult = document.querySelector(".result__title");
const statisticsOfGame = document.querySelector(".result__statistics");
const playAgainBtn = document.querySelector(".result__playAgain");
const backToMenuBtn = document.querySelector(".result__backToMenu");

let counter = 0;
let activeElements = 0;
let resultOfGame;
let pointsToWin = 25;
let amountOfElements = 8;
let addTargetTime = 500;
let onOffInterval = false;
const clickedBtnsIndex = [1];
let targets;

let pointToGet = document.getElementById("points");
let targetsMax = document.getElementById("targets");
let addNewTarget = document.getElementById("speed");

const difficultyLevelButtons = [
  ...document.querySelectorAll(".menu__wrapper .menu__btn"),
];

//obsługa wyjscia z custom
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

//pobranie zasad gry z custom
function takeValues() {
  difficultyLevel = "custom";
  pointsToWin = pointToGet.value;
  amountOfElements = targetsMax.value;
  addTargetTime = addNewTarget.value;
  custom.classList.remove("menu__custom--active");
  console.log(pointsToWin, amountOfElements, addTargetTime);
}

//ustawienia poziomów trudności
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
    //włączenie customMenu
    custom.classList.add("menu__custom--active");
    saveSettingsBtn.addEventListener("click", takeValues);
  }
};

//zmiana wybranego trybu gry
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

//funkcja wykrywa czy uzytkownik trafil w cel i zwieksza licznik
function shotOnTarget() {
  gameSection.removeChild(this);
  counter++;
  activeElements--;
  pointsNumber.textContent = `Points: ${counter}/${pointsToWin}`;
  targetsNumber.textContent = `Targets: ${activeElements}/${amountOfElements}`;
}

// funkcja usuwa kropki i zmienia widoczność sekcji
const elementsAfterGame = () => {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    dot.remove();
  });
  gameSection.classList.remove("show");
  gameSection.classList.add("hide");
  result.classList.remove("hide");
  result.classList.add("show");
};

//funkcja sprawdza stan gry i wyświetla odpowiednie komunikaty
const statusGame = () => {
  if (resultOfGame == 2) {
    console.log("win");
    gameResult.classList.add("result__win");
    gameResult.innerText = "You won!";
    statisticsOfGame.innerHTML = `
  <p class="result__text result__text1">You shot down enough targets for ${difficultyLevel} level.</p>
  <p class="result__text result__text2">If you want to play again on the same difficulty press the <span>"PLAY
  AGAIN"</span> button! If you want change the level press <span>"GO TO MENU"!</span></p>
  `;
  } else if (resultOfGame == 1) {
    console.log("lose");
    gameResult.classList.add("result__lost");
    gameResult.innerText = "You lost!";

    statisticsOfGame.innerHTML = `
  <p class="result__text">You shot down <span>${counter}/${pointsToWin}</span> targets on ${difficultyLevel} difficulty. Unfortunetly it was not enought to win!</p>

  <p class="result__text result__text2">Try again by pressing the <span>"PLAY AGAIN"</span> button! If you want change the level press <span>"GO TO MENU"</span>!</p>
  `;
  }
};

//funkcja wyświetla stan po zakończeniu gry
function endGame() {
  elementsAfterGame();
  statusGame();
}

//funkcja zaczyna nową grę na tych samych zasadach co poprzednio
const playAgain = () => {
  console.log("dz");
  gameSection.classList.remove("hide");
  result.classList.remove("show");
  result.classList.add("hide");
  statisticsWrapper.classList.remove("showStats");
  isStarted = false;
  counter = 0;
  activeElements = 0;
  resultOfGame = 0;
  onOffInterval = false;
  gameResult.classList.remove("result__lost");
  gameResult.classList.remove("result__win");
  startGame();
  // custom.classList.remove("menu__custom--active");
  // gameSection.style.zIndex = "-1";
  // result.style.zIndex = "-1";
  // difficultyLevelButtons[1].classList.add("menu__btn--checked");
};

playAgainBtn.addEventListener("click", playAgain);

const backToMenu = () => {
  window.location.reload();
};

backToMenuBtn.addEventListener("click", backToMenu);

//odliczanie przed rozpoczeciem gry
const countdown = () => {
  const countdownArr = ["3", "2", "1", "Shoot!"];
  const div = document.createElement("div");
  gameSection.appendChild(div);
  div.classList.add("countingToStart");

  let arrayIndex = 0;

  const countdownTimeout = () => {
    console.log("w odliczaniu");
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

//funcja tworzy i dodaje cele i kontroluje kiedy jest przegrana i wygrana
function makeTargets() {
  console.log("w tworzeniu targetów");
  const positionY = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
  const positionX = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
  const dot = document.createElement("div");
  dot.className = "dot";

  if (counter == pointsToWin) {
    resultOfGame = 2;
    window.clearInterval(targets);
    endGame();
  } else if (activeElements == amountOfElements) {
    resultOfGame = 1;
    window.clearInterval(targets);
    endGame();
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

//start gry, zmiana sekcji na game, obsługa animacji
function startGame() {
  menu.style.pointerEvents = "none";
  setTimeout(function () {
    menu.style.pointerEvents = "auto";
  }, 4000);

  if (!isStarted) {
    menu.classList.add("hide");
    gameSection.classList.add("show");
    isStarted = !isStarted;
    console.log("if w start game");
    setTimeout(countdown, 1000);
  } else {
    isStarted = !isStarted;
    menu.classList.remove("hide");
  }
}

startBtn.addEventListener("click", startGame);
