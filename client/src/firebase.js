import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUTrJtGKbdkFoTDVPjict6WQtECO5DgB4",
  authDomain: "kitchenconnect-d4fd0.firebaseapp.com",
  projectId: "kitchenconnect-d4fd0",
  storageBucket: "kitchenconnect-d4fd0.firebasestorage.app",
  messagingSenderId: "191720249460",
  appId: "1:191720249460:web:6284f9f74539c2d0cbd921"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
