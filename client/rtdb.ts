import firebase from "firebase";


const app = firebase.initializeApp({
  apiKey: "kJmAbTncEbn1H6UbaOaKGi6QuUzQPZeK8vyYjZzZ",
  databaseURL: "https://dwf-modulo6-default-rtdb.firebaseio.com",
  authDomain: "dwf-modulo6.firebaseapp.com",
});

const rtdb = firebase.database();

export {rtdb}