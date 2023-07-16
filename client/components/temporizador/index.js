import { state } from "../../state";
customElements.define("timer-component", class Timer extends HTMLElement {
    countdown;
    timerInterval;
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.countdown = 6;
        this.timerInterval = null;
        this.render();
    }
    connectedCallback() {
        this.startTimer();
    }
    render() {
        const countdownElement = document.createElement("div");
        countdownElement.classList.add("countdown");
        this.shadowRoot.innerHTML = `
          <style>
            .countdown {
              font-size: 80px;
              font-weight: bold;
              color: #0a2441;
              opacity: 1;
              animation: pulse 1s ease-in-out infinite;
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
          </style>
        `;
        this.shadowRoot.appendChild(countdownElement);
    }
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown >= 1) {
                this.updateCountdown();
            }
            else {
                this.stopTimer();
            }
        }, 1000);
    }
    updateCountdown() {
        const countdownElement = this.shadowRoot.querySelector(".countdown");
        countdownElement.textContent = this.countdown.toString();
    }
    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        const countdownElement = this.shadowRoot.querySelector(".countdown");
        countdownElement.classList.add("fade-out");
        setTimeout(() => {
            if (this.countdown === 0) {
                state.randomPlay();
            }
        }, 500);
    }
});
