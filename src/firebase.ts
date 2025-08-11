import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARB6oX1e-paXByUHjAk1EMwKDoqvwsnhs",
  authDomain: "gym-app-aa128.firebaseapp.com",
  projectId: "gym-app-aa128",
  storageBucket: "gym-app-aa128.firebasestorage.app",
  messagingSenderId: "986232713458",
  appId: "1:986232713458:web:4939ead5d4078a2e26a06b",
  measurementId: "G-SPLJJDV8V3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);