"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
var dotenv = require("dotenv");
dotenv.config();
var key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!key) {
    throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida.");
}
var serviceAccount = JSON.parse(key);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
