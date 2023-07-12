import { rtdb } from "./rtdb";

const apiUrl = "http://localhost:3000";

const state = {
  data: {
    idLargo: {
      currentGame: {
        jugador: {
          nombre: "",
          userId: "",
          roomId: "",
          rtdbRoomId: "",
          choice: "",
          online: "",
          start: "",
          score: 0,
        },
        puntos: {
          jugador1: 0,
          jugador2: 0,
        },
      },
    },
  },
  listeners: [],

  init() {
    const lastStorageState = localStorage.getItem("state");
    if (lastStorageState !== null) {
      this.setState(JSON.parse(lastStorageState));
    }
  },

  listenRoom() {
    const cs = this.getState();
    const chatRoomRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    chatRoomRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        cs.currentGame = data.currentGame;
      }

      this.setState(cs);
    });
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado", this.data);
  },

  setNombre(nombre: string) {
    const cs = this.getState();
    cs.nombre = nombre;
    this.setState(cs);
  },

  signUp(callback, nombre) {
    const cs = this.getState();
    if (nombre) {
      fetch(apiUrl + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: nombre }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Nombre enviado al backend:", nombre);
          if (data.id) {
            cs.userId = data.id;
            this.setState(cs);
            callback();
          } else {
            callback(true);
          }
        })
        .catch((error) => {
          console.error(error);
          callback(true);
        });
    } else {
      callback(true);
    }
  },

  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(apiUrl + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId, nombre: cs.nombre }),
      })
        .then((res) => res.json())
        .then((data) => {
          cs.roomId = data.id;
          cs.rtdbRoomId = data.rtdbRoomId;

          this.setState(cs);
          this.listenRoom();

          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay user id");
    }
  },

  accessToRoom(callback) {
    const cs = this.getState();
    const roomId = cs.roomId;

    fetch(apiUrl + "/rooms/" + roomId + "?userId=" + cs.userId)
      .then((res) => res.json())
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();

        if (callback) {
          callback();
        }
      });
  },

  results() {
    const cs = this.getState();
    const rtdbId = cs.rtdbRoomId;

    fetch(apiUrl + "/jugadores/" + rtdbId)
      .then((res) => res.json())
      .then((data) => {
        const jugador1Choice = data.jugador1.choice;
        const jugador2Choice = data.jugador2.choice;
        console.log("el jugador 1 elijio ", jugador1Choice);
        console.log("el jugador 2 elijio ", jugador2Choice);

        const ganador = this.whoWins(jugador1Choice, jugador2Choice);
        if (ganador === "gano jugador 1") {
          this.sumarPunto("jugador1");
        } else if (ganador === "gano jugador 2") {
          this.sumarPunto("jugador2");
        }
      });
  },

  whoWins(jugador1Choice, jugador2Choice) {
    if (jugador1Choice === jugador2Choice) {
      return "Empate";
    } else if (
      (jugador1Choice === "rock" && jugador2Choice === "scissors") ||
      (jugador1Choice === "paper" && jugador2Choice === "rock") ||
      (jugador1Choice === "scissors" && jugador2Choice === "paper")
    ) {
      return "gano jugador 1";
    } else {
      return "gano jugador 2";
    }
  },

  loginJugador2(callback?) {
    const cs = this.getState();

    fetch(apiUrl + "/rooms/jugador2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nombre: cs.nombre,
        userId: cs.userId,
        rtdbRoomId: cs.rtdbRoomId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        if (callback) {
          this.setState(cs);
          callback();
        }
      });
  },
  setRoomId(roomId) {
    const cs = this.getState();
    cs.roomId = roomId;
    this.setState(cs);
  },

  subscribe(callback) {
    this.listeners.push(callback);
  },

  setGame(choice) {
    const cs = this.getState();
    cs.currentGame.jugador1.choice = choice;
    this.setState(cs);
  },

  pushGameJugador1(callback) {
    const cs = this.getState();
    fetch(apiUrl + "/game/jugador1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nombre: cs.nombre,
        rtdbRoomId: cs.rtdbRoomId,
        userId: cs.userId,
        choice: cs.currentGame.jugador1.choice,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  },

  pushGameJugador2(callback) {
    const cs = this.getState();
    fetch(apiUrl + "/game/jugador2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nombre: cs.nombre,
        userId: cs.userId,
        rtdbRoomId: cs.rtdbRoomId,

        choice: cs.currentGame.jugador2.choice,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  },

  reiniciarChoice1(callback?) {
    const cs = this.getState();
    fetch(apiUrl + "/reiniciar/jugador1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: cs.rtdbRoomId,
        choice: "", 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  },

  reiniciarChoice2(callback?) {
    const cs = this.getState();
    fetch(apiUrl + "/reiniciar/jugador2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: cs.rtdbRoomId,
        choice: "", 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  },


  setGame2(choice) {
    const cs = this.getState();
    cs.currentGame.jugador2.choice = choice;
    this.setState(cs);
  },

  startJugador1(callback?) {
    const cs = this.getState();

    fetch(apiUrl + "/start/jugador1", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: cs.rtdbRoomId,
        start: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  },

  startJugador2(callback?) {
    const cs = this.getState();

    fetch(apiUrl + "/start/jugador2", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: cs.rtdbRoomId,
        start: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  },

  actualizarRecord1(callback?) {
    const cs = this.getState();
    fetch(apiUrl + "/record/jugador1", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: cs.rtdbRoomId,
        jugador1: cs.currentGame.jugador1.score,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      });
  },


  sumarPunto1(callback?) {
    const cs = this.getState();
    cs.currentGame.jugador1.score += 1;
    console.log("actualizando");
    
    if (callback) {
      this.setState(cs);
      callback();
    }
  },

  actualizarRecord2(callback?) {
    const cs = this.getState();
    fetch(apiUrl + "/record/jugador2", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: cs.rtdbRoomId,
        jugador2: cs.currentGame.jugador2.score,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) {
          this.setState(cs);
          callback(data);
        }
      });
  },

  randomPlay() {
    const move = ["piedra", "papel", "tijera"];
    const RandomPlay = Math.floor(Math.random() * 3);
    return move[RandomPlay];
  },


  sumarPunto2(callback?) {
    const cs = this.getState();
    cs.currentGame.jugador2.score += 1;
    console.log("actualizando");
    if(callback){
      this.setState(cs);
      callback()
    }
  },

};

export { state };
