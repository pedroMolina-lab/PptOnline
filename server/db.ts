import * as admin from "firebase-admin"
import * as dotenv from "dotenv"
dotenv.config()

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY


if (!key) {
  throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida.");
}


const serviceAccount = JSON.parse(key);


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
 });

const firestore = admin.firestore()
const rtdb = admin.database()

export {firestore, rtdb} 