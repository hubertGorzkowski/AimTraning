document.onselectstart = function () {
  return false;
};
const startBtn = document.body.querySelector(".menu__btn--play");
const menu = document.body.querySelector("main.menu");
const gameSection = document.querySelector(".game");
const result = document.querySelector(".result");
const html = document.querySelector("html");
const pointsNumber = document.querySelector(".game__statistics--points");
const targetsNumber = document.querySelector(".game__statistics--targets");
let difficultyLevel = "normal";
let isStarted = false;
const custom = document.querySelector(".menu__custom");
const exitCustomSettings = document.querySelector(".fa-times");
const saveSettingsBtn = document.querySelector(".menu__saveSettingsBtn");

let counter = 0;
let activeElements = 0;
let resultOFGame;
let pointsToWin = 25;
let amountOfElements = 6;
let addTargetTime = 600;

let pointToGet = document.getElementById("points");
let targetsMax = document.getElementById("targets");
let addNewTarget = document.getElementById("speed");

const difficultyLevelButtons = [
  ...document.querySelectorAll(".menu__wrapper .menu__btn"),
];

//obsługa wyjscia z custom
const exitSettings = () => {
  custom.classList.remove("menu__custom--active");
};
exitCustomSettings.addEventListener("click", exitSettings);

//pobranie zasad gry z custom
function takeValues() {
  difficultyLevel = "custom";
  pointsToWin = pointToGet.value;
  amountOfElements = targetsMax.value;
  addTargetTime = addNewTarget.value;
  exitSettings();
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
}

//funkcja wyświetla stan po zakończeniu gry
function endGame() {
  function elementsAfterGame() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => {
      dot.remove();
    });
    result.style.zIndex = "0";
    const gameResult = document.querySelector(".result__title");
    const statisticsOfGame = document.querySelector(".result__statistics");
    pointsNumber.innerHTML = "";
    targetsNumber.innerHTML = "";

    gameResult.classList.add("result__visible");

    function statusGame() {
      if (resultOFGame == 2) {
        gameResult.innerText = "You won!";
        gameResult.classList.add("result__win");
        statisticsOfGame.innerHTML = `
    <p class="result__text">Congratulations, you've won. You've shot down enough targets for ${difficultyLevel} difficulty.</p>
    <p class="result__text">If you want to play again, press the button!</p>
    `;
      } else if (resultOFGame == 1) {
        gameResult.innerText = "You lost!";
        gameResult.classList.add("result__lost");
        statisticsOfGame.innerHTML = `
    <p class="result__text">Unfortunately, you failed to win. Shoot down ${counter}/${pointsToWin} targets on ${difficultyLevel} difficulty.</p>
    <p class="result__text">If you want to try again, <span class="result__span">press the button!</span></p>
    `;
      }
    }
    statusGame();

    const resetGame = () => {
      custom.classList.remove("menu__custom--active");
      isStarted = false;
      counter = 0;
      activeElements = 0;
      resultOFGame = 0;
      pointsToWin = 25;
      amountOfElements = 6;
      addTargetTime = 600;
      gameSection.style.zIndex = "-1";
      result.style.zIndex = "-1";
      difficultyLevelButtons[1].classList.add("menu__btn--checked");
    };
    const playAgainBtn = document.querySelector(".result__playAgain");
    playAgainBtn.addEventListener("click", resetGame);
  }
  elementsAfterGame();
}

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
        return;
      }, 500);
    } else {
      div.innerText = countdownArr[arrayIndex];
      arrayIndex++;
      setTimeout(countdownTimeout, 1000);
    }
  };
  setTimeout(countdownTimeout, 1000);
};

//funkcja zaczyna grę. Znika początkowy wygląd, pojawiaja się counter
function startGame() {
  if (!isStarted) {
    menu.classList.add("hide");
    gameSection.classList.add("show");
    isStarted = !isStarted;
    setTimeout(countdown, 1500);
  } else {
    isStarted = !isStarted;
    console.log(isStarted);
    menu.classList.remove("hide");
  }

  // gameSection.style.zIndex = "0";
  // isStarted = true;

  // pointsNumber.innerHTML = `Points: ${counter}/${pointsToWin}`;
  // targetsNumber.innerHTML = `Targets: ${activeElements}/${amountOfElements}`;

  // //funcja tworzy cele i ustala warunki wygranej i przegranej
  // function makeTargets() {
  //   const positionY = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
  //   const positionX = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
  //   const dot = document.createElement("div");
  //   dot.className = "dot";
  //   if (counter == pointsToWin) {
  //     resultOFGame = 2;
  //     endGame();
  //     window.clearInterval(targets);
  //   } else if (activeElements == amountOfElements) {
  //     resultOFGame = 1;
  //     endGame();
  //     window.clearInterval(targets);
  //   } else {
  //     gameSection.appendChild(dot);
  //     activeElements++;
  //     targetsNumber.textContent = `Targets: ${activeElements}/${amountOfElements}`;
  //     dot.style.top = positionY + "%";
  //     dot.style.left = positionX + "%";

  //     dot.addEventListener("click", shotOnTarget);
  //   }
  // }

  // const targets = window.setInterval(makeTargets, addTargetTime);
}

startBtn.addEventListener("click", startGame);
