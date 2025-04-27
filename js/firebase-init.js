
// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDN6CsE-CgDCCQMpAuf9vAui5YOgXPPBAw",
  authDomain: "exctatio.firebaseapp.com",
  projectId: "exctatio",
  storageBucket: "exctatio.firebasestorage.app",
  messagingSenderId: "286639091178",
  appId: "1:286639091178:web:7c6c6d235a8d0637019693",
  measurementId: "G-MNE2G0PFLY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
