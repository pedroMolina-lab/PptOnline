"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express = require("express");
const uuid_1 = require("uuid");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const userColl = db_1.firestore.collection("users");
const roomColl = db_1.firestore.collection("rooms");
app.use(cors());
app.use(express.json());
app.post("/signup", (req, res) => {
    const nombre = req.body.nombre;
    userColl
        .where("nombre", "==", nombre)
        .get()
        .then((searchResponse) => {
        if (searchResponse.empty) {
            userColl
                .add({
                nombre,
            })
                .then((newUser) => {
                res.json({
                    id: newUser.id,
                    new: true,
                });
            });
        }
        else {
            res.status(400).json({
                id: searchResponse.docs[0].id,
            });
        }
    });
});
app.post("/rooms", async (req, res) => {
    try {
        const { userId, nombre } = req.body;
        const doc = await userColl.doc(userId.toString()).get();
        if (doc.exists) {
            const roomRef = db_1.rtdb.ref("rooms/" + (0, uuid_1.v4)());
            await roomRef.set({
                owner: userId,
                currentGame: {
                    jugador1: {
                        nombre: nombre,
                        userId: userId,
                        choice: "",
                        online: true,
                        start: false,
                        score: 0,
                    },
                },
            });
            const roomLongId = roomRef.key;
            const roomId = Math.floor(Math.random() * 9000) + 1000;
            await roomColl.doc(roomId.toString()).set({
                rtdbRoomId: roomLongId,
            });
            res.json({
                id: roomId.toString(),
                rtdbRoomId: roomLongId,
            });
        }
        else {
            res.status(401).json({
                message: "El usuario no existe",
            });
        }
    }
    catch (error) {
        console.error("Error al crear la sala:", error);
        res.status(500).json({
            message: "Error al crear la sala",
        });
    }
});
app.get("/rooms/:roomId", (req, res) => {
    const { roomId } = req.params;
    const userId = req.query.userId;
    if (userId) {
        userColl
            .doc(userId.toString())
            .get()
            .then((doc) => {
            if (doc.exists) {
                roomColl
                    .doc(roomId)
                    .get()
                    .then((snap) => {
                    const data = snap.data();
                    if (data) {
                        const roomRef = db_1.rtdb.ref("rooms/" + data.rtdbRoomId);
                        res.json(data);
                    }
                    else {
                        res.status(404).json({
                            message: "La sala no existe",
                        });
                    }
                });
            }
            else {
                res.status(401).json({
                    message: "El usuario no existe",
                });
            }
        });
    }
    else {
        res.status(400).json({
            message: "Falta el parámetro 'userId'",
        });
    }
});
app.post("/rooms/jugador2", (req, res) => {
    const { nombre, rtdbRoomId, userId } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/`);
    roomRef
        .update({
        jugador2: {
            nombre: nombre,
            userId: userId,
            choice: "",
            online: true,
            start: false,
            score: 0,
        },
    })
        .then(() => {
        res.status(200).json({ message: "Jugador 2 actualizado correctamente" });
    })
        .catch((error) => {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/game/jugador2", (req, res) => {
    const { rtdbRoomId, choice } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador2/choice`);
    roomRef
        .set(choice)
        .then(() => {
        res.status(200).json({ message: "Jugador 2 actualizado correctamente" });
    })
        .catch((error) => {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/game/jugador1", (req, res) => {
    const { rtdbRoomId, choice } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador1/choice`);
    roomRef
        .set(choice)
        .then(() => {
        res.status(200).json({ message: "Jugador 1 actualizado correctamente" });
    })
        .catch((error) => {
        res.status(500).json({ error: "Error al actualizar Jugador 1" });
    });
});
app.post("/start/jugador1", (req, res) => {
    const { rtdbRoomId, start } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador1/start`);
    roomRef
        .set(start)
        .then(() => {
        res.status(200).json({ message: "Jugador 1 actualizado correctamente" });
    })
        .catch((error) => {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/start/jugador2", (req, res) => {
    const { rtdbRoomId, start } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador2/start`);
    roomRef
        .set(start)
        .then(() => {
        res.status(200).json({ message: "Jugador 2 actualizado correctamente" });
    })
        .catch((error) => {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/record/jugador1", (req, res) => {
    const { rtdbRoomId, jugador1 } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador1/score`);
    roomRef
        .set(jugador1)
        .then(() => {
        res.sendStatus(200);
    })
        .catch((error) => {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.post("/record/jugador2", (req, res) => {
    const { rtdbRoomId, jugador2 } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador2/score`);
    roomRef
        .set(jugador2)
        .then(() => {
        res.sendStatus(200);
    })
        .catch((error) => {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.post("/reiniciar/jugador1", (req, res) => {
    const { rtdbRoomId, choice } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador1/choice`);
    roomRef
        .set(choice)
        .then(() => {
        res.sendStatus(200);
    })
        .catch((error) => {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.post("/reiniciar/jugador2", (req, res) => {
    const { rtdbRoomId, choice } = req.body;
    const roomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/currentGame/jugador2/choice`);
    roomRef
        .set(choice)
        .then(() => {
        res.sendStatus(200);
    })
        .catch((error) => {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.get("/jugadores/:rtdbId", (req, res) => {
    const { rtdbId } = req.params;
    const rtdbRef = db_1.rtdb.ref(`/rooms/${rtdbId}/currentGame`);
    rtdbRef.once("value", (snap) => {
        const fullData = snap.val();
        res.status(200).json(fullData);
    });
});
const staticDirPath = path.join(__dirname, "../dist/index.html");
app.use(express.static("dist"));
app.get("*", (req, res) => {
    res.sendFile((staticDirPath));
});
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${port}`);
});
