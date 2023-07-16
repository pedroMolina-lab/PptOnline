import * as dotenv from 'dotenv';         
dotenv.config()
const admin = require("firebase-admin");
const serviceAccount = require("../server/key.json")


console.log("Valor de FIREBASE_SERVICE_ACCOUNT_KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

console.log("la clave es", serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
