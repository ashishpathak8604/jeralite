import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArDUdzXsz2mBlj7d8gyPI1SnTULNZ2GLQ",
  authDomain: "jeralite-ca210.firebaseapp.com",
  projectId: "jeralite-ca210",
  storageBucket: "jeralite-ca210.firebasestorage.app",
  messagingSenderId: "1057581205074",
  appId: "1:1057581205074:web:7ec65c85a7e5c8a389018b",
  measurementId: "G-JLDXM7HE8N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
