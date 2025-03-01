import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClgHHTFWcVB7SWg-8au8nB1A4Q0F5a3JU",
  authDomain: "sticket-s004.firebaseapp.com",
  databaseURL: "https://sticket-s004-default-rtdb.firebaseio.com",
  projectId: "sticket-s004",
  storageBucket: "sticket-s004.appspot.com",
  messagingSenderId: "802371056186",
  appId: "1:802371056186:web:eab2d5eab37ca5c2dffb03",
  measurementId: "G-1L43DG4LE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
