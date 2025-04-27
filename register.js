// register.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const strengthMeter = document.getElementById('strengthMeter');
  const registerError = document.getElementById('registerError');

  // Password strength indicator
  passwordInput.addEventListener('input', function() {
    const strength = calculatePasswordStrength(this.value);
    strengthMeter.style.width = strength.percentage + '%';
    strengthMeter.style.backgroundColor = strength.color;
  });

  // Form submission
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Clear previous errors
    clearErrors();

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      showError('All fields are required', 'registerError');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match', 'confirmError');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters', 'passwordError');
      return;
    }

    // UI Loading state
    registerBtn.disabled = true;
    registerBtn.innerHTML = 'Creating account <span class="loading"></span>';

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      // Redirect after successful registration
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed";
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email already in use";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email format";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak";
          break;
      }
      
      showError(errorMessage, 'registerError');
    } finally {
      // Reset UI
      registerBtn.disabled = false;
      registerBtn.innerHTML = 'Create Account';
    }
  });

  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 7) strength += 20;
    if (password.length > 11) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    let color = '#ff4d4d'; // red
    if (strength > 60) color = '#ffcc00'; // yellow
    if (strength > 80) color = '#4dff4d'; // green

    return { percentage: strength, color: color };
  }

  function showError(message, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'none';
    });
  }
});
