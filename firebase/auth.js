import { auth } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = "Registration failed";
    switch(error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "Email already in use";
        break;
      case 'auth/invalid-email':
        errorMessage = "Invalid email format";
        break;
      case 'auth/weak-password':
        errorMessage = "Password should be at least 6 characters";
        break;
    }
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = "Login failed";
    switch(error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = "Invalid email or password";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Too many attempts. Try again later";
        break;
    }
    return { success: false, error: errorMessage };
  }
};
