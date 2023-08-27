customElements.define("button-el", class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }
    render() {
        var _a, _b;
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
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(button);
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(style);
    }
});
