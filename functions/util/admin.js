//inport firebase admin package and initialize the firestore database object

const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

//export so that other modules can use it.
module.exports = {admin, db};