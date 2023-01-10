document.onselectstart = function () {
  return false;
};
const startBtn = document.body.querySelector(".menu__btn--start");
const menu = document.body.querySelector(".menu");
const html = document.querySelector("html");
const pointsNumber = document.querySelector(".game__statistics--points");
const targetsNumber = document.querySelector(".game__statistics--targets");

let counter = 0;
let activeElements = 0;
let resultOFGame;
let pointsToWin = 25;
let amountOfElements;
let visibilityTime;

const difficultyLevelButtons = [...document.querySelectorAll(".menu__btn")];

difficultyLevelButtons.forEach((button) => {
  button.addEventListener("click", function () {
    difficultyLevelButtons.forEach((btn) => {
      btn.classList.remove("menu__btn--checked");
    });
    button.classList.add("menu__btn--checked");

    if (difficultyLevelButtons[0] == this) {
      amountOfElements = 8;
      visibilityTime = 800;
    } else if (difficultyLevelButtons[1] == this) {
      amountOfElements = 6;
      visibilityTime = 600;
    } else if (difficultyLevelButtons[2] == this) {
      amountOfElements = 5;
      visibilityTime = 500;
    }
  });
});

//funkcja wykrywa czy uzytkownik trafil w cel i zwieksza licznik
function shotOnTarget() {
  document.body.removeChild(this);
  counter++;
  activeElements--;
  pointsNumber.textContent = `Points: ${counter}`;
}

//funkcja wyświetla stan po zakończeniu gry
function endGame() {
  function elementsAfterGame() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => {
      dot.classList.add("invisible");
    });
    const gameResult = document.querySelector(".result__title");
    const statisticsOfGame = document.querySelector(".result__statistics");
    statisticsOfGame.innerHTML = `
    <p class="result__point">${pointsNumber}</p>
    `;
    pointsNumber.innerHTML = "";
    targetsNumber.innerHTML = "";

    gameResult.classList.add("result__visible");

    function statusGame() {
      if (resultOFGame == 2) {
        gameResult.innerText = "You won!";
      } else if (resultOFGame == 1) {
        gameResult.innerText = "You lost!";
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
function startGame() {
  document.querySelector(".menu").remove();
  pointsNumber.innerHTML = `Points: ${counter}/${pointsToWin}`;
  targetsNumber.innerHTML = `Targets: ${activeElements}`;

  //funcja tworzy cele i ustala warunki wygranej i przegranej
  function makeTargets() {
    const positionY = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
    const positionX = Math.floor(Math.random() * (95 - 1 + 1)) + 1;

    if (counter === pointsToWin) {
      resultOFGame = 2;
      endGame();
      window.clearInterval(targets);
    } else if (activeElements > amountOfElements) {
      resultOFGame = 1;
      endGame();
      window.clearInterval(targets);
    } else {
      const dot = document.createElement("div");
      dot.className = "dot";
      document.body.appendChild(dot);
      activeElements++;
      targetsNumber.textContent = `Targets: ${activeElements}`;
      dot.style.top = positionY + "%";
      dot.style.left = positionX + "%";

      dot.addEventListener("click", shotOnTarget);
    }
  }

  const targets = window.setInterval(makeTargets, visibilityTime);
}

startBtn.addEventListener("click", startGame);
