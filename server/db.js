"use strict";
exports.__esModule = true;
exports.rtdb = exports.firestore = void 0;
var dotenv = require("dotenv");
var admin = require("firebase-admin");
dotenv.config();
var key_json = process.env.KEY_JSON;
admin.initializeApp({
    credential: admin.credential.cert(key_json),
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
