document.onselectstart = function () {
  return false;
};
const btn = document.body.querySelector("button");
const section = document.body.querySelector("section");
const html = document.querySelector("html");
const h2 = document.querySelector("h2");
const h4 = document.querySelector("h4");

let counter = 0;
let activeElements = 0;
let resultOFGame;

//funkcja wykrywa czy uzytkownik trafil w cel i zwieksza licznik
function shotOnTarget(event) {
  document.body.removeChild(this);
  counter++;
  activeElements--;
  const h2 = document.body.querySelector("h2");
  h2.textContent = `Liczba punktów: ${counter}`;
}

//funkcja wyświetla stan po zakończeniu gry
function endGame() {
  function elementsAfterGame() {
    const main = document.createElement("main");
    document.body.appendChild(main);
    const h3 = document.createElement("h3");
    main.appendChild(h3);
    html.style.cursor = "default";
    const btn = document.createElement("button");
    main.appendChild(btn);
    btn.textContent = "Zagraj ponownie";
    btn.classList.add("afterGame");
    main.classList.add("afterGame");
    h3.classList.add("afterGame");

    function statusGame() {
      if (resultOFGame == 2) {
        h3.innerText = `Wygrałeś! Twój czas to: ${timerTxt.textContent}`;
      } else if (resultOFGame == 1) {
        h3.innerText = `Przegrałeś! Zdobyłeś ${counter} punktów!`;
      }
    }
    statusGame();
    btn.addEventListener("click", function () {
      window.location.reload();
    });
  }
  elementsAfterGame();
}

const timerTxt = document.createElement("p");
document.body.appendChild(timerTxt);
timerTxt.classList.add("timer");
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
  document.body.removeChild(section);
  html.style.cursor = "crosshair";
  document.body.style.backgroundColor = "black";
  h2.innerHTML = `Liczba punktów: ${counter}`;
  h4.innerHTML = `Liczba kropek: ${activeElements}`;

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
      const div = document.createElement("div");
      document.body.appendChild(div);
      activeElements++;
      h4.textContent = `Liczba kropek: ${activeElements}`;
      div.style.top = positionY + "%";
      div.style.left = positionX + "%";

      div.addEventListener("click", shotOnTarget);
    }
  }

  const targets = window.setInterval(makeTargets, 500);
  timer();
}

btn.addEventListener("click", startGame);
