import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDN6CsE-CgDCCQMpAuf9vAui5YOgXPPBAw",
  authDomain: "exctatio.firebaseapp.com",
  projectId: "exctatio",
  storageBucket: "exctatio.appspot.com",
  messagingSenderId: "286639091178",
  appId: "1:286639091178:web:7c6c6d235a8d0637019693",
  measurementId: "G-MNE2G0PFLY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
