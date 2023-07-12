import { Router } from "@vaadin/router";
import { state } from "../../state";

export class ComenzarButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const cs = state.getState();
    const currentGame = cs.currentGame;

    const nombreJugador1 = currentGame.jugador1.nombre;
    const nombreJugador2 = currentGame.jugador2.nombre;

    this.innerHTML = `
      <div class="button-container">
        <div class="nombres-container">
          <div class="nombre-jugador">${nombreJugador1}</div>
          <div class="vs-text">vs</div>
          <div class="nombre-jugador">${nombreJugador2}</div>
        </div>
        <button class="comenzar-button">Comenzar</button>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
      }

      .nombres-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-bottom: 20px;
      }

      .nombre-jugador {
        font-size: 80px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        color: #0a2441;
      }

      .vs-text {
        font-size: 36px;
        margin-bottom: 10px;
        color: #000;
      }

      .comenzar-button {
        padding: 30px 60px;
        font-size: 36px;
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

      .comenzar-button:hover {
        background-color: #ff4632;
      }
    `;

    this.appendChild(style);

    const button = this.querySelector(".comenzar-button")  as HTMLButtonElement;
    button.addEventListener("click", () => {
      const jugador1 = cs.currentGame.jugador1.nombre;
      const jugador2 = cs.currentGame.jugador2.nombre;

      if (jugador1 == cs.nombre) {
        this.startJugador1();
      } else if (jugador2 == cs.nombre) {
        this.startJugador2();
      }
    });
  }
  startJugador1() {
    const cs = state.getState();
    state.startJugador1(() => {
      Router.go("/playGame");
    });
  }

  startJugador2() {
    const cs = state.getState();
    state.startJugador2(() => {
      Router.go("/playGame");
    });
  }
}
  

customElements.define("comenzar-button", ComenzarButton);
