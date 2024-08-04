// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA82DCAM1ryeZJuLsVcSyPErP02CJl7ajc",
  authDomain: "pantry-inventory-tracker-f8df1.firebaseapp.com",
  projectId: "pantry-inventory-tracker-f8df1",
  storageBucket: "pantry-inventory-tracker-f8df1.appspot.com",
  messagingSenderId: "286698011556",
  appId: "1:286698011556:web:f4d67229ef706846205f31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);