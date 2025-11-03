// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOwchIXrJgzFs-LHrpdEWIbPmSL5NzuGw",
  authDomain: "qhosp---suporte-hospitalar.firebaseapp.com",
  projectId: "qhosp---suporte-hospitalar",
  storageBucket: "qhosp---suporte-hospitalar.firebasestorage.app",
  messagingSenderId: "556238705129",
  appId: "1:556238705129:web:8edb6b6ef3c859ba233b78",
  measurementId: "G-DKYT2KH3G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };