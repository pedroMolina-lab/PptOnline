import { Router } from "@vaadin/router";
import { state } from "../../state";
const imageHome = require("url:../../../client/imagenes/img-home.png");
export class HomeComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        const button = this.querySelector(".button-game");
        button.addEventListener("click", () => {
            const nameInput = this.querySelector(".name-input");
            const playerName = nameInput.value;
            state.setNombre(playerName);
            state.signUp(() => {
                Router.go("/inicio");
            }, playerName);
        });
    }
    render() {
        this.innerHTML = `
    <div class="home-container">
         <img src="${imageHome}" class="img-title"></img>
        <div class="input-container">
          <input type="text" class="name-input" placeholder="Ingresa tu nombre"></input>
          <button-el class="button-game">Comenzar</button-el>
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

      .name-input {
        padding: 10px 20px;
        font-size: 18px;
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 5px;
        margin-bottom: 10px;
        width: 200px;
        text-align: center;
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
customElements.define("home-page", HomeComponent);
