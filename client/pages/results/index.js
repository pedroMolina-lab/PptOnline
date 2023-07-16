"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsPage = void 0;
const state_1 = require("../../state");
const router_1 = require("@vaadin/router");
class ResultsPage extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const cs = state_1.state.getState();
        const jugador1Choice = cs.currentGame.jugador1.choice;
        const jugador2Choice = cs.currentGame.jugador2.choice;
        const result = state_1.state.whoWins(jugador1Choice, jugador2Choice);
        const jugador1Element = getHandElement(jugador1Choice);
        const jugador2Element = getHandElement(jugador2Choice);
        const jugador1Nombre = cs.currentGame.jugador1.nombre;
        const jugador2Nombre = cs.currentGame.jugador2.nombre;
        let ganador = "Empate";
        if (result === "gano jugador 1") {
            state_1.state.sumarPunto1();
            state_1.state.actualizarRecord1();
            ganador = jugador1Nombre;
        }
        else if (result === "gano jugador 2") {
            state_1.state.sumarPunto2();
            state_1.state.actualizarRecord2();
            ganador = jugador2Nombre;
        }
        const jugador1Record = cs.currentGame.jugador1.score;
        const jugador2Record = cs.currentGame.jugador2.score;
        this.innerHTML = `
      <div class="container">
        <div class="player-names">
          <div>${jugador1Nombre}: ${jugador1Record}</div>
          <div>vs</div>
          <div>${jugador2Nombre}: ${jugador2Record}</div>
        </div>
        <h2>Resultado</h2>
        <div class="hands">
          <div class="hand">
            ${jugador1Element}
            <p class="name">${jugador1Nombre}</p>
          </div>
          <div class="hand">
            ${jugador2Element}
            <p class="name">${jugador2Nombre}</p>
          </div>
        </div>
        <p class="winner">Ganador: ${ganador}</p>
        <button class="play-again">Jugar de nuevo</button>
        <button class="new-game">Comenzar otra partida</button>
      </div>
    `;
        const style = document.createElement("style");
        style.innerHTML = `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .player-names {
        font-size: 40px;
        font-weight: bold;
        color: #007fa6;
        margin-bottom: 20px;
        text-align: center;
      }

      .player-names div {
        margin-bottom: 10px;
      }

      h2 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .hands {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
      }

      .hand {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 20px;
      }
      .name{
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
      }

      .hand rock-el,
      .hand paper-el,
      .hand scissors-el {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .winner {
        font-size: 40px;
        font-weight: bold;
        color: #007fa6;
        margin-bottom: 20px;
        text-align: center;
      }

      .play-again,
      .new-game {
        padding: 30px 60px;
        font-size: 20px;
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        animation: slide-up 1s ease-out;
        margin-bottom: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }

      .play-again:hover,
      .new-game:hover {
        background-color: #ddd;
      }
    `;
        this.appendChild(style);
        function getHandElement(choice) {
            if (choice === "rock") {
                return `<rock-el class="hand-img" data-play="rock"></rock-el>`;
            }
            else if (choice === "paper") {
                return `<paper-el class="hand-img" data-play="paper"></paper-el>`;
            }
            else if (choice === "scissors") {
                return `<scissors-el class="hand-img" data-play="scissors"></scissors-el>`;
            }
        }
        const playAgainButton = this.querySelector(".play-again");
        playAgainButton.addEventListener("click", () => {
            state_1.state.reiniciarChoice1();
            state_1.state.reiniciarChoice2();
            router_1.Router.go("/playGame");
        });
        const newGameButton = this.querySelector(".new-game");
        newGameButton.addEventListener("click", () => {
            router_1.Router.go("/");
            setTimeout(() => {
                window.location.reload();
            }, 10);
        });
    }
}
exports.ResultsPage = ResultsPage;
customElements.define("results-page", ResultsPage);
