"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
const admin = require("firebase-admin");
const serviceAccount = require("../server/key.json");
const dotenv = require("dotenv");
dotenv.config();
const clave = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
});
const firestore = admin.firestore();
exports.firestore = firestore;
const rtdb = admin.database();
exports.rtdb = rtdb;
