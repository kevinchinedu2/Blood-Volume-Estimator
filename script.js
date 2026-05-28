
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqrxvB5yCQtnj0hf8NWzATad8uUY5DkSU",
  authDomain: "blood-volume-estimator.firebaseapp.com",
  databaseURL: "https://blood-volume-estimator-default-rtdb.firebaseio.com",
  projectId: "blood-volume-estimator",
  storageBucket: "blood-volume-estimator.firebasestorage.app",
  messagingSenderId: "37511784419",
  appId: "1:37511784419:web:41ce1639ed3880ce2762d6"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// 3. Check if user is logged in
onAuthStateChanged(auth, (user) => {
if (user) {
currentUser = user;
} else {
// If not logged in, send them to login page
window.location.href = 'index.html';
}
});

document.addEventListener('DOMContentLoaded', () => {
const calculateBtn = document.getElementById('calculate-btn');
const closeModal = document.getElementById('close-modal');
const modalOverlay = document.getElementById('modal-overlay');
const mainDashboard = document.getElementById('main-dashboard');

if (!calculateBtn || !closeModal || !modalOverlay || !mainDashboard) return;

calculateBtn.addEventListener('click', async () => {
const sex = document.getElementById('sex').value;
const height = parseFloat(document.getElementById('height').value);
const weight = parseFloat(document.getElementById('weight').value);
let currentBlood = document.getElementById('current-blood').value;

if (!height || !weight) {    
    alert('Please fill in both Height and Weight!');    
    return;    
}    

let calculatedLiters = 0;    
if (currentBlood === "") {    
    const heightM = height / 100;    
    if (sex === 'male') {    
        calculatedLiters = (0.3669 * Math.pow(heightM, 3)) + (0.03219 * weight) + 0.6041;    
    } else {    
        calculatedLiters = (0.3561 * Math.pow(heightM, 3)) + (0.03308 * weight) + 0.1833;    
    }    
} else {    
    calculatedLiters = parseFloat(currentBlood);    
}    

// Percentage Logic    
let visualPercentage = (calculatedLiters / 5.5) * 100;    
if (visualPercentage > 100) visualPercentage = 100;    
if (visualPercentage < 0) visualPercentage = 0;    
    
const descText = document.getElementById('description-text');    
const circularProgress = document.querySelector('.circular-progress');    
let ringColor = '#2ecc71';    
let remark = "";    

if (calculatedLiters < 2.75) {    
    remark = "Low! You need to see your doctor";    
    ringColor = '#e74c3c';    
} else if (calculatedLiters >= 2.75 && calculatedLiters <= 4.49) {    
    remark = "Go and see a physician";    
    ringColor = '#f39c12';    
} else if (calculatedLiters >= 4.50) {    
    remark = "Normal";    
    ringColor = '#2ecc71';    
}    

if (descText) {    
    descText.innerText = remark;    
    descText.style.color = ringColor;    
}    

document.getElementById('hero-number').innerHTML = `${calculatedLiters.toFixed(2)}<span>L</span>`;    
document.getElementById('percentage-text').innerText = `${Math.round(visualPercentage)}%`;    
    
if (circularProgress) {    
    const degrees = visualPercentage * 3.6;    
    circularProgress.style.background = `conic-gradient(${ringColor} ${degrees}deg, #ecf0f1 ${degrees}deg)`;    
}    

// SAVE TO FIREBASE    
await saveToFirebase(calculatedLiters.toFixed(2), remark, sex, height, weight);    

mainDashboard.classList.add('blurred');    
modalOverlay.classList.add('active');

});

async function saveToFirebase(liters, remark, sex, height, weight) {
if (!currentUser) return;

try {    
    await addDoc(collection(db, "history"), {    
        userId: currentUser.uid,    
        gender: sex,    
        height: height,    
        weight: weight,    
        bloodVolume: liters,    
        remark: remark,    
        timestamp: serverTimestamp() // Using server time for accuracy    
    });    
    console.log("Report saved to Firebase History!");    
} catch (e) {    
    console.error("Error adding document: ", e);    
}

}

closeModal.addEventListener('click', () => {
mainDashboard.classList.remove('blurred');
modalOverlay.classList.remove('active');
});

});
