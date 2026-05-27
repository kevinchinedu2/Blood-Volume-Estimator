import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqrxvB5yCQtnj0hf8NWzATad8uUY5DkSU",
  authDomain: "blood-volume-estimator.firebaseapp.com",
  projectId: "blood-volume-estimator",
  storageBucket: "blood-volume-estimator.firebasestorage.app",
  messagingSenderId: "37511784419",
  appId: "1:37511784419:web:41ce1639ed3880ce2762d6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showStatus(message, isError = false) {
  const msgBox = document.getElementById('message-box');
  if (msgBox) {
    msgBox.textContent = message;
    msgBox.style.color = isError ? "#ff4d4d" : "#2ecc71";
    msgBox.style.display = "block";
    
    setTimeout(() => { msgBox.style.display = "none"; }, 4000);
  } else {
    console.log(message);
  }
}

window.switchTab = function(tabId) {
  document.querySelectorAll('.form-content').forEach(form => form.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  const buttons = document.querySelectorAll('.tab-btn');
  if (tabId === 'register') buttons[0].classList.add('active');
  if (tabId === 'login') buttons[1].classList.add('active');
}

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

  showStatus("Processing registration...");

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
    setTimeout(() => switchTab('index'), 1500); 
  } catch (error) {
    showStatus(error.message, true);
  }
});

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

document.getElementById('forgot-password-link').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;

  if (!email) {
    showStatus("Please enter your email in the login box.", true);
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showStatus("A reset link has been sent to your email.");
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      showStatus("No account found with this email address.", true);
    } else if (error.code === 'auth/invalid-email') {
      showStatus("Please enter a valid email address.", true);
    } else {
      showStatus("Error: " + error.message, true);
    }
  }
});
