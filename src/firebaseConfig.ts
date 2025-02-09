import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "ecomfire-d10d9.firebaseapp.com",
  projectId: "ecomfire-d10d9",
  storageBucket: "ecomfire-d10d9.firebasestorage.app",
  messagingSenderId: "505758039932",
  appId: "1:505758039932:web:48e18727a6d44e7d60eef9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
