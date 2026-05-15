import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
const historyList = document.getElementById('history-list');

// 1. Wait for User Authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchHistory(user.uid);
    } else {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// 2. Fetch Records from Firebase
async function fetchHistory(userId) {
    const recordsRef = collection(db, "blood_records");
    // Querying results specifically for the logged-in user, ordered by date
    const q = query(recordsRef, where("uid", "==", userId), orderBy("timestamp", "desc"));

    try {
        const querySnapshot = await getDocs(q);
        historyList.innerHTML = ""; // Clear loader/previous data

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            renderCard(data);
        });
    } catch (error) {
        console.error("Error fetching history: ", error);
    }
}

// 3. Render Data into Medical Card Template
function renderCard(data) {
    const date = data.timestamp?.toDate().toLocaleDateString() || "Unknown Date";
    
    const cardHTML = `
        <div class="medical-card">
            <div class="card-header">Report Date: ${date}</div>
            <div class="card-body">
                <h3>${data.estimatedVolume} Liters</h3>
                <p>Status: <strong>${data.status || 'Normal'}</strong></p>
            </div>
            <div class="card-footer">
                Reference ID: ${data.reportId || 'N/A'}
            </div>
        </div>
    `;
    historyList.innerHTML += cardHTML;
}
