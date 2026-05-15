import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqrxvB5yCQtnj0hf8NWzATad8uUY5DkSU",
  authDomain: "blood-volume-estimator.firebaseapp.com",
  projectId: "blood-volume-estimator",
  storageBucket: "blood-volume-estimator.firebasestorage.app",
  messagingSenderId: "37511784419",
  appId: "1:37511784419:web:41ce1639ed3880ce2762d6"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * HELPER FUNCTION: Display Messages
 * This replaces the "alert()" and removes the "localhost" header.
 * Make sure you have an element with id="message-box" in your HTML.
 */
function showStatus(message, isError = false) {
  const msgBox = document.getElementById('message-box');
  if (msgBox) {
    msgBox.textContent = message;
    msgBox.style.color = isError ? "#ff4d4d" : "#2ecc71";
    msgBox.style.display = "block";
    
    // Auto-hide after 4 seconds
    setTimeout(() => { msgBox.style.display = "none"; }, 4000);
  } else {
    // Fallback if you haven't added the HTML element yet
    console.log(message);
  }
}

// 3. Tab Switching Logic
window.switchTab = function(tabId) {
  document.querySelectorAll('.form-content').forEach(form => form.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  const buttons = document.querySelectorAll('.tab-btn');
  if (tabId === 'register') buttons[0].classList.add('active');
  if (tabId === 'login') buttons[1].classList.add('active');
}

// 4. Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const fname = document.getElementById('reg-fname').value;
  const lname = document.getElementById('reg-lname').value;

  if (password !== confirmPassword) {
    showStatus("Passwords do not match!", true);
    return;
  }

  showStatus("Processing registration..."); // "Just a processor" phase

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      firstName: fname,
      lastName: lname,
      email: email,
      role: "user"
    });

    showStatus("Registration Successful!");
    setTimeout(() => switchTab('dashboard'), 1500); 
  } catch (error) {
    showStatus(error.message, true);
  }
});

// 5. Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  showStatus("Authenticating...");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showStatus("Login Successful!");
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
  } catch (error) {
    showStatus("Login failed: " + error.message, true);
  }
});
