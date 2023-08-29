customElements.define("button-el", class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }
    render() {
        const button = document.createElement("button");
        const style = document.createElement("style");
        button.textContent = this.textContent;
        button.classList.add("button-game");
        style.innerHTML = `
        .button-game {
          background-color: #ff6347;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 10px 20px;
          font-family: "Odibee Sans";
          font-size: 24px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button-game:hover {
          transform: scale(1.1)
        }
      `;
        this.shadowRoot?.appendChild(button);
        this.shadowRoot?.appendChild(style);
    }
});
