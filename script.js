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
    const gameResult = document.querySelector(".result__title");
    const resultSection = document.querySelector(".result");
    html.style.cursor = "default";
    // btn.classList.add("result__visible");
    // main.classList.add("result__visible");
    gameResult.classList.add("result__visible");

    function statusGame() {
      if (resultOFGame == 2) {
        gameResult.innerText = "You won!";
      } else if (resultOFGame == 1) {
        gameResult.innerText = "You lost!";
      }
    }
    statusGame();
    btn.addEventListener("click", function () {
      window.location.reload();
    });
  }
  elementsAfterGame();
}

const timerTxt = document.querySelector(".game__statistics--timer");
//funckja tworzy stoper, ktory mierzy czas
function timer() {
  let ms = 0;
  let s = 0;
  let m = 0;

  function run() {
    const showTime = function () {
      timerTxt.textContent =
        (m < 10 ? "0" + m : m) +
        ":" +
        (s < 10 ? "0" + s : s) +
        ":" +
        (ms < 10 ? "0" + ms : ms);
      ms++;
      if (ms == 100) {
        ms = 0;
        s++;
      }
      if (s == 60) {
        s = 0;
        m++;
      }
    };
    if (resultOFGame == 1 || resultOFGame == 2) {
      window.clearInterval(on);
      document
        .querySelector("button.afterGame")
        .addEventListener("click", function () {
          ms = 0;
          s = 0;
          m = 0;
        });
      showTime();
    } else {
      showTime();
    }
  }

  const on = setInterval(run, 10);
}

//funkcja zaczyna grę. Znika początkowy wygląd, tło zmienia się na czarne, pojawiaja się counter
function startGame() {
  document.body.removeChild(menu);
  html.style.cursor = "crosshair";
  pointsNumber.innerHTML = `Points: ${counter}`;
  targetsNumber.innerHTML = `Targets: ${activeElements}`;

  //funcja tworzy cele i ustala warunki wygranej i przegranej
  function makeTargets() {
    const positionY = Math.floor(Math.random() * (95 - 10 + 1)) + 10;
    const positionX = Math.floor(Math.random() * (95 - 1 + 1)) + 1;

    if (counter === 10) {
      resultOFGame = 2;
      endGame();
      window.clearInterval(targets);
    } else if (activeElements > 3) {
      resultOFGame = 1;
      endGame();
      window.clearInterval(targets);
    } else {
      const dot = document.createElement("div");
      dot.className = "dot";
      document.body.appendChild(dot);
      activeElements++;
      targetsNumber.textContent = `Liczba kropek: ${activeElements}`;
      dot.style.top = positionY + "%";
      dot.style.left = positionX + "%";

      dot.addEventListener("click", shotOnTarget);
    }
  }

  const targets = window.setInterval(makeTargets, 500);
  timer();
}

startBtn.addEventListener("click", startGame);
