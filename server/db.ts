import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({path: "./.env"});


const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
