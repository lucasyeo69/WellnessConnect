// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjMdvjHQgE2RE9wdZ56A4ndaziPL2cDpQ",
  authDomain: "proid-64265.firebaseapp.com",
  projectId: "proid-64265",
  storageBucket: "proid-64265.firebasestorage.app",
  messagingSenderId: "724755762419",
  appId: "1:724755762419:web:ff8a632d266ba40586fb86",
  measurementId: "G-DH19EXYJZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;