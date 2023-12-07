import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// import { getAuth } from "firebase/auth";

const appSettings = {
  databaseURL:
    "https://realtime-database-7acf7-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);

// const firebaseConfig = {
//   apiKey: "AIzaSyAVeTUfURGxT-lORZ_woUMRRNyGCuvDHrQ",
//   authDomain: "realtime-database-7acf7.firebaseapp.com",
//   databaseURL: "https://realtime-database-7acf7-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "realtime-database-7acf7",
//   storageBucket: "realtime-database-7acf7.appspot.com",
// };
// const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// const auth = getAuth(app)

console.log(database);
export { database, ref, push, onValue, remove, update, serverTimestamp };
