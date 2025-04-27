// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9RrUvieH8rzJRU9LTijUgm-ODr1_SlEQ",
  authDomain: "excitatio-7d5e4.firebaseapp.com",
  projectId: "excitatio-7d5e4",
  storageBucket: "excitatio-7d5e4.firebasestorage.app",
  messagingSenderId: "1014891623997",
  appId: "1:1014891623997:web:a1a07ba52702d68bd1dc54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  serverTimestamp
};