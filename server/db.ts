import * as dotenv from 'dotenv';         
const admin = require("firebase-admin");
dotenv.config()
const key_json = process.env.KEY_JSON



admin.initializeApp({
    credential: admin.credential.cert(key_json),
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
 });

 const firestore = admin.firestore()
const rtdb = admin.database()


export {firestore, rtdb}