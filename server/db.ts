const admin = require("firebase-admin");
import * as dotenv from "dotenv"
dotenv.config()
const clave = process.env.FIREBASE_SERVICE_ACCOUNT_KEY


admin.initializeApp({
  credential: admin.credential.cert(clave),
  databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
