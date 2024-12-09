// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-next-f707c.firebaseapp.com",
  projectId: "x-next-f707c",
  storageBucket: "x-next-f707c.firebasestorage.app",
  messagingSenderId: "147188741806",
  appId: "1:147188741806:web:21be03837c9067d8abdf3f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
