import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPKSh0oMHIXTgX1mHRfsRHG5tpLqtufIw",
  authDomain: "music-c309d.firebaseapp.com",
  projectId: "music-c309d",
  storageBucket: "music-c309d.appspot.com",
  messagingSenderId: "133923593231",
  appId: "1:133923593231:web:716900e5cbc9681e39577a",
  measurementId: "G-FDF3VQPQDQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
