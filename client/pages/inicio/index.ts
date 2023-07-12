import { Router } from "@vaadin/router";
import { state } from "../../state";

const imageHome = require("url:../../../client/imagenes/img-home.png");

export class InicioPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    const buttonCreate = this.querySelector(
      ".button-game"
    ) as HTMLButtonElement;
    const buttonJoin = this.querySelector(
      ".button-gameUni"
    ) as HTMLButtonElement;

    buttonCreate.addEventListener("click", () => {
      state.askNewRoom(() => {
        Router.go("/codigo");
      });
    });

    buttonJoin.addEventListener("click", () => {
      const roomCodeInput = this.querySelector(
        ".room-code-input"
      ) as HTMLInputElement;
      const roomId = roomCodeInput.value;
      if (roomId) {
        state.setRoomId(roomId);
        state.accessToRoom(() => {
          state.loginJugador2(() => {
            Router.go("/codigo");
          });
        });
      } else {
        alert("El código de sala no existe. Inténtalo de nuevo.");
      }
    });
  }

  render() {
    this.innerHTML = `
      <div class="home-container">
        <img src="${imageHome}" class="img-title"></img>
        <div class="input-container">
          <button-el class="button-game">Crear Sala</button-el>
          <button-el class="button-gameUni">Unirse a Sala</button-el>
          <div class="input-wrapper">
            <input class="room-code-input" type="text" placeholder="ej:1234" />
          </div>
        </div>
        <div class="container-hands">
          <rock-el class="hand-rock"></rock-el>
          <paper-el class="hand-paper"></paper-el>
          <scissors-el class="hand-scissors"></scissors-el>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .home-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100vh;
        background-color: #f2f2f2;
      }
  
      .img-title {
        width: 284px;
        height: 200px;
        margin-top: 114px;
        animation: fade-in 1s ease-in;
      }
  
      .input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
      }
  
      .input-wrapper {
        margin-top: 10px;
      }
  
      .room-code-input {
        padding: 10px;
        font-size: 16px;
        border: 1px solid #000;
        border-radius: 5px;
        width: 200px;
      }
  
      .button-game {
        padding: 10px 20px;
        font-size: 18px;
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        animation: slide-up 1s ease-out;
        margin-bottom: 10px;
      }
      .button-gameUni {
        padding: 10px 20px;
        font-size: 18px;
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        animation: slide-up 1s ease-out;
        margin-bottom: 10px;
      }
  
      .button-game:hover {
        background-color: #ff4632;
      }
  
      .container-hands {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        margin-bottom: 10px;
      }
  
      .hand-rock,
      .hand-paper,
      .hand-scissors {
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        animation: pulse 1.5s infinite;
      }
  
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
  
      @keyframes slide-up {
        from {
          transform: translateY(50px);
        }
        to {
          transform: translateY(0);
        }
      }
  
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
    `;

    this.appendChild(style);
  }
}

customElements.define("inicio-page", InicioPage);
