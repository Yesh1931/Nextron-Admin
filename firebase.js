/**
 * Nextron - Firebase Configuration & Initialization
 * 
 * If valid API keys are supplied here, the platform automatically connects to Firestore.
 * Otherwise, it falls back to Local Mock Mode using localStorage and static files.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4Xd4LMrMAOAMk-euuDY6zd4jfcmtzQ5U",
    authDomain: "nextron-48514.firebaseapp.com",
    projectId: "nextron-48514",
    storageBucket: "nextron-48514.firebasestorage.app",
    messagingSenderId: "93642127644",
    appId: "1:93642127644:web:38a9ceb2aa1252f8dc62d9",
    measurementId: "G-EL09LP2BNN"
};

// Check if credentials have been replaced
export const isFirebaseActive =
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "[GCP_API_KEY]" &&
    firebaseConfig.apiKey.trim() !== "[GCP_API_KEY]";

let app = null;
let auth = null;
let db = null;

if (isFirebaseActive) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("⚡ Firebase successfully initialized and connected to Firestore.");
    } catch (err) {
        console.error("❌ Failed to initialize Firebase: ", err);
    }
} else {
    console.warn("⚠️ Firebase configuration missing. ECE Platform running in LOCAL MOCK MODE (localStorage).");
}

export { app, auth, db };
