"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = void 0;
const firebase_1 = require("firebase");
const app = firebase_1.default.initializeApp({
    apiKey: "kJmAbTncEbn1H6UbaOaKGi6QuUzQPZeK8vyYjZzZ",
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com",
    authDomain: "dwf-modulo6.firebaseapp.com",
});
const rtdb = firebase_1.default.database();
exports.rtdb = rtdb;
