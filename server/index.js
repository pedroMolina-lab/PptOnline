"use strict";
exports.__esModule = true;
var db_1 = require("./db");
var express = require("express");
var uuid_1 = require("uuid");
var cors = require("cors");
var app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
var userColl = db_1.firestore.collection("users");
var roomColl = db_1.firestore.collection("rooms");
app.post("/signup", function (req, res) {
    var nombre = req.body.nombre;
    userColl
        .where("nombre", "==", nombre)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            userColl
                .add({
                nombre: nombre
            })
                .then(function (newUser) {
                res.json({
                    id: newUser.id,
                    "new": true
                });
            });
        }
        else {
            res.status(400).json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.post("/rooms", function (req, res) {
    var _a = req.body, userId = _a.userId, nombre = _a.nombre;
    userColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var roomRef_1 = db_1.rtdb.ref("rooms/" + (0, uuid_1.v4)());
            roomRef_1
                .set({
                owner: userId,
                currentGame: {
                    jugador1: {
                        nombre: nombre,
                        userId: userId,
                        choice: "",
                        online: true,
                        start: false,
                        score: 0
                    }
                }
            })
                .then(function () {
                var roomLongId = roomRef_1.key;
                var roomId = Math.floor(Math.random() * 9000) + 1000;
                roomColl
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: roomLongId
                })
                    .then(function () {
                    res.json({
                        id: roomId.toString(),
                        rtdbRoomId: roomLongId
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "El usuario no existe"
            });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var roomId = req.params.roomId;
    var userId = req.query.userId;
    if (userId) {
        userColl
            .doc(userId.toString())
            .get()
            .then(function (doc) {
            if (doc.exists) {
                roomColl
                    .doc(roomId)
                    .get()
                    .then(function (snap) {
                    var data = snap.data();
                    if (data) {
                        var roomRef = db_1.rtdb.ref("rooms/" + data.rtdbRoomId);
                        res.json(data);
                    }
                    else {
                        res.status(404).json({
                            message: "La sala no existe"
                        });
                    }
                });
            }
            else {
                res.status(401).json({
                    message: "El usuario no existe"
                });
            }
        });
    }
    else {
        res.status(400).json({
            message: "Falta el parámetro 'userId'"
        });
    }
});
app.post("/rooms/jugador2", function (req, res) {
    var _a = req.body, nombre = _a.nombre, rtdbRoomId = _a.rtdbRoomId, userId = _a.userId;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/"));
    roomRef
        .update({
        jugador2: {
            nombre: nombre,
            userId: userId,
            choice: "",
            online: true,
            start: false,
            score: 0
        }
    })
        .then(function () {
        res.status(200).json({ message: "Jugador 2 actualizado correctamente" });
    })["catch"](function (error) {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/game/jugador2", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, choice = _a.choice;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador2/choice"));
    roomRef
        .set(choice)
        .then(function () {
        res.status(200).json({ message: "Jugador 2 actualizado correctamente" });
    })["catch"](function (error) {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/game/jugador1", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, choice = _a.choice;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador1/choice"));
    roomRef
        .set(choice)
        .then(function () {
        res.status(200).json({ message: "Jugador 1 actualizado correctamente" });
    })["catch"](function (error) {
        res.status(500).json({ error: "Error al actualizar Jugador 1" });
    });
});
app.post("/start/jugador1", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, start = _a.start;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador1/start"));
    roomRef
        .set(start)
        .then(function () {
        res.status(200).json({ message: "Jugador 1 actualizado correctamente" });
    })["catch"](function (error) {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/start/jugador2", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, start = _a.start;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador2/start"));
    roomRef
        .set(start)
        .then(function () {
        res.status(200).json({ message: "Jugador 2 actualizado correctamente" });
    })["catch"](function (error) {
        res.status(500).json({ error: "Error al actualizar Jugador 2" });
    });
});
app.post("/record/jugador1", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, jugador1 = _a.jugador1;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador1/score"));
    roomRef
        .set(jugador1)
        .then(function () {
        res.sendStatus(200);
    })["catch"](function (error) {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.post("/record/jugador2", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, jugador2 = _a.jugador2;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador2/score"));
    roomRef
        .set(jugador2)
        .then(function () {
        res.sendStatus(200);
    })["catch"](function (error) {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.post("/reiniciar/jugador1", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, choice = _a.choice;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador1/choice"));
    roomRef
        .set(choice)
        .then(function () {
        res.sendStatus(200);
    })["catch"](function (error) {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.post("/reiniciar/jugador2", function (req, res) {
    var _a = req.body, rtdbRoomId = _a.rtdbRoomId, choice = _a.choice;
    var roomRef = db_1.rtdb.ref("rooms/".concat(rtdbRoomId, "/currentGame/jugador2/choice"));
    roomRef
        .set(choice)
        .then(function () {
        res.sendStatus(200);
    })["catch"](function (error) {
        console.error("Error al actualizar los registros:", error);
        res.sendStatus(500);
    });
});
app.get("/jugadores/:rtdbId", function (req, res) {
    var rtdbId = req.params.rtdbId;
    var rtdbRef = db_1.rtdb.ref("/rooms/".concat(rtdbId, "/currentGame"));
    rtdbRef.once("value", function (snap) {
        var fullData = snap.val();
        res.status(200).json(fullData);
    });
});
app.use(express.static("../dist"));
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("El servidor se est\u00E1 ejecutando en http://localhost:".concat(port));
});
