import admin from "firebase-admin";
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestoreConnection = admin.firestore();

export default firestoreConnection;
