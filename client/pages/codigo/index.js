import { state } from "../../state";
import { Router } from "@vaadin/router";
export class CodigoComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        state.subscribe(() => {
            this.updateRoomId();
            const cs = state.getState();
            const currentGame = cs.currentGame;
            if (currentGame && currentGame.jugador1 && currentGame.jugador2) {
                const jugador1 = currentGame.jugador1.online;
                const jugador2 = currentGame.jugador2.online;
                if (jugador1 && jugador2 && window.location.pathname !== "/playGame" && window.location.pathname !== "/results") {
                    Router.go("/comenzar");
                }
            }
        });
    }
    render() {
        state.init();
        const cs = state.getState();
        const roomId = cs.roomId || "";
        const nombreState = cs.nombre || "";
        this.innerHTML = `
      <div class="home-container">
        <h1>¡Bienvenido <span class="nombre-state">${nombreState}</span>!</h1>
        <h1 class="title">Comparte este código con tu oponente y espera a que se conecte:</h1>
        <h1 class="roomId">${roomId}</h1>
        <div class="container-hands">
          <rock-el class="hand hand-rock"></rock-el>
          <paper-el class="hand hand-paper"></paper-el>
          <scissors-el class="hand hand-scissors"></scissors-el>
        </div>
      </div>
    `;
        const style = document.createElement("style");
        style.innerHTML = `
      .home-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100vh;
        background-color: #f2f2f2;
        font-family: Arial, sans-serif;
      }

      .nombre-state {
        color: #ff6347; /* Cambiar aquí el color deseado */
      } 

      .img-instructions {
        width: 284px;
        height: 200px;
        margin-top: 50px;
      }

      .title {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
      }

      .roomId {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 40px;
        text-align: center;
        color: #333;
      }

      .container-hands {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
      }

      .hand {
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        animation: pulse 1.5s infinite;
        width: 100px;
        height: 150px;
      }
    `;
        this.appendChild(style);
    }
    updateRoomId() {
        const cs = state.getState();
        const roomId = cs.roomId || "";
        const roomIdElement = this.querySelector(".roomId");
        if (roomIdElement) {
            roomIdElement.textContent = roomId;
        }
    }
}
customElements.define("codigo-page", CodigoComponent);
