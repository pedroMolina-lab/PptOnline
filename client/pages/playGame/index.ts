  import { Router } from "@vaadin/router";
  import { state } from "../../state";

  export class PlayGame extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
      state.subscribe(() => {
        const cs = state.getState();
        const currentGame = cs.currentGame;

        const jugador1Choice = currentGame.jugador1.choice;
        const jugador2Choice = currentGame.jugador2.choice;
        if (jugador1Choice && jugador2Choice) {
          Router.go("/results")
          }
        
      });

      this.addEventListeners();
    }

    render() {
      this.innerHTML = `
        <div class="container">
          <div class="game-area">
          <timer-component class="temp"></timer-component>
          </div>
          <div class="container-hands">
            <rock-el class="hand-img" data-play="rock"></rock-el>
            <paper-el class="hand-img" data-play="paper"></paper-el>
            <scissors-el class="hand-img" data-play="scissors"></scissors-el>
          </div>
        </div>
      `;

      const style = document.createElement("style");
      style.innerHTML = `
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100vh;
        }

      
        .game-area {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 500px; 
        }
    

        .container-hands {
          display: flex;
          justify-content: space-evenly;
          width: 100%;
          margin-bottom: 10px;
        }

        .hand-img {
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          animation: pulse 1.5s infinite;
          cursor: pointer;
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

        .selected {
          animation: none;
          transform: translateY(-50%);
          transition: transform 0.5s;
        }
      `;

      this.appendChild(style);
    }

    addEventListeners() {
      const handImages = this.querySelectorAll(".hand-img");

      handImages.forEach((image) => {
        image.addEventListener("click", (e) => {
          e.preventDefault();

          const play = image.getAttribute("data-play");

          handImages.forEach((hand) => {
            if (hand !== image) {
              (hand as HTMLElement).style.display = "none";
            }
          });

          (image as HTMLElement).classList.add("selected");

          const cs = state.getState();
          const jugador1 = cs.currentGame.jugador1.nombre;
          const jugador2 = cs.currentGame.jugador2.nombre;

          if (jugador2 == cs.nombre) {
            state.setGame2(play);
            state.pushGameJugador2(() => {
              console.log("funciona jugador 2");
            });
          }

          if (jugador1 === cs.nombre) {
            state.setGame(play);
            state.pushGameJugador1(() => {
              console.log("funciona jugador1");
            });
          }

          state.setState(cs);
        });
      });
    }
  }

  customElements.define("play-game", PlayGame);
