
const admin = require("firebase-admin");

const serviceAccount = require('../server/key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com"
 });

 const firestore = admin.firestore()
const rtdb = admin.database()


export {firestore, rtdb}