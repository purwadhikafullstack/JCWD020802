import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfpyZ44ogOpKIdzcEzgdNOMSHdWEcsrms",
  authDomain: "district-kayu-a78cd.firebaseapp.com",
  projectId: "district-kayu-a78cd",
  storageBucket: "district-kayu-a78cd.appspot.com",
  messagingSenderId: "341480338539",
  appId: "1:341480338539:web:26a291715755e395856d2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)