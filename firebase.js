// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN6CsE-CgDCCQMpAuf9vAui5YOgXPPBAw",
  authDomain: "exctatio.firebaseapp.com",
  projectId: "exctatio",
  storageBucket: "exctatio.firebasestorage.app",
  messagingSenderId: "286639091178",
  appId: "1:286639091178:web:7c6c6d235a8d0637019693",
  measurementId: "G-MNE2G0PFLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };