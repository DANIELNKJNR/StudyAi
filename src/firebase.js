import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXQIeJ5QOTwXfW6rdTZw3rO81w6b18A3I",
  authDomain: "studyai-5c8eb.firebaseapp.com",
  projectId: "studyai-5c8eb",
  storageBucket: "studyai-5c8eb.firebasestorage.app",
  messagingSenderId: "592227771702",
  appId: "1:592227771702:web:5cdc862db156b4b684ff97",
  measurementId: "G-MML7KZTKZR"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export { signInAnonymously };