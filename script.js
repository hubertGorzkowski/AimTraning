document.onselectstart = function () {
  return false;
};
const startBtn = document.body.querySelector(".menu__btn--start");
const menu = document.body.querySelector(".menu");
const gameSection = document.querySelector(".game");
const result = document.querySelector(".result");
const html = document.querySelector("html");
const pointsNumber = document.querySelector(".game__statistics--points");
const targetsNumber = document.querySelector(".game__statistics--targets");
let difficultyLevel = "normal";

let counter = 0;
let activeElements = 0;
let resultOFGame;
let pointsToWin = 25;
let amountOfElements = 6;
let addTargetTime = 600;

const difficultyLevelButtons = [...document.querySelectorAll(".menu__btn")];

difficultyLevelButtons.forEach((button) => {
  //obsługa pop-up'u
  const custom = document.querySelector(".menu__custom");
  const exitCustomSettings = document.querySelector(".fa-times");
  exitCustomSettings.addEventListener("click", function () {
    custom.classList.remove("menu__custom--active");
    difficultyLevelButtons[3].classList.remove("menu__btn--checked");
    difficultyLevelButtons[1].classList.add("menu__btn--checked");
  });

  //wybieranie buttonu (pojawia sie kolor tła inny)
  button.addEventListener("click", function () {
    difficultyLevelButtons.forEach((btn) => {
      btn.classList.remove("menu__btn--checked");
    });
    button.classList.add("menu__btn--checked");

    //w zaleznosci od przycisku kliknieto ustawia reguly gry
    if (difficultyLevelButtons[0] == this) {
      difficultyLevel = "easy";
      amountOfElements = 10;
      addTargetTime = 800;
    } else if (difficultyLevelButtons[1] == this) {
      difficultyLevel = "normal";
      amountOfElements = 8;
      addTargetTime = 600;
    } else if (difficultyLevelButtons[2] == this) {
      difficultyLevel = "hard";
      amountOfElements = 5;
      addTargetTime = 600;
    } else if (difficultyLevelButtons[3] == this) {
      //włączenie pop-up
      custom.classList.add("menu__custom--active");
      //pobranie wartosci z custom
      function takeValues() {
        const pointToGet = document.getElementById("points");
        const targetsMax = document.getElementById("targets");
        const addNewTarget = document.getElementById("speed");
        difficultyLevel = "custom";
        pointsToWin = pointToGet.value;
        console.log(pointsToWin);
        amountOfElements = targetsMax.value;
        addTargetTime = addNewTarget.value;
        startGame();
      }
      const customBtn = document.querySelector(".menu__btn--custom");
      customBtn.addEventListener("click", takeValues);
    }
  });
});

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
        statisticsOfGame.innerHTML = `
    <p className="result__text">Congratulations, you've won. You've shot down enough targets for ${difficultyLevel} difficulty.</p>
    <p className="result__playAgain">If you want to play again, press the button.</p>
    `;
      } else if (resultOFGame == 1) {
        gameResult.innerText = "You lost!";
        statisticsOfGame.innerHTML = `
    <p className="result__text">Unfortunately, you failed to win. Shoot down ${counter}/${pointsToWin} targets on ${difficultyLevel} difficulty.</p>
    <p className="result__playAgain">If you want to try again, press the button</p>
    `;
      }
    }
    statusGame();
    // btn.addEventListener("click", function () {
    //   window.location.reload();
    // });
  }
  elementsAfterGame();
}

//funkcja zaczyna grę. Znika początkowy wygląd, pojawiaja się counter
let isStarted = false;
function startGame() {
  if (!isStarted) {
    gameSection.style.zIndex = "0";
    isStarted = true;
  }

  pointsNumber.innerHTML = `Points: ${counter}/${pointsToWin}`;
  targetsNumber.innerHTML = `Targets: ${activeElements}/${amountOfElements}`;

  //funcja tworzy cele i ustala warunki wygranej i przegranej
  function makeTargets() {
    const positionY = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
    const positionX = Math.floor(Math.random() * (95 - 1 + 1)) + 1;
    const dot = document.createElement("div");
    dot.className = "dot";
    if (counter == pointsToWin) {
      resultOFGame = 2;
      endGame();
      window.clearInterval(targets);
    } else if (activeElements == amountOfElements) {
      resultOFGame = 1;
      endGame();
      window.clearInterval(targets);
    } else {
      gameSection.appendChild(dot);
      activeElements++;
      targetsNumber.textContent = `Targets: ${activeElements}/${amountOfElements}`;
      dot.style.top = positionY + "%";
      dot.style.left = positionX + "%";

      dot.addEventListener("click", shotOnTarget);
    }
  }

  const targets = window.setInterval(makeTargets, addTargetTime);
}

startBtn.addEventListener("click", startGame);
