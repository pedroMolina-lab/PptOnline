const rock = require("url:../../../client/imagenes/piedra.png");
customElements.define("rock-el", class Rock extends HTMLElement {
    shadow;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.render();
    }
    render() {
        const style = document.createElement("style");
        this.shadow.innerHTML = `
      <img class="rock" src = "${rock}">
            `;
        style.innerHTML = `
        .rock{
          width:100%;
          height:100%;
        }
      `;
        this.shadow.appendChild(style);
    }
});
