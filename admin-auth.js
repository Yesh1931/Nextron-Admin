/**
 * Nextron - Admin Authentication System
 * Uses Firebase Auth and Firestore, falling back to localStorage in mock mode.
 */

import { auth, db, isFirebaseActive } from "./firebase.js";

// Mock Admins database for local development
const MOCK_ADMINS = [
    { email: "admin@nextron.edu", password: "password123", role: "admin" },
    { email: "super@nextron.edu", password: "password123", role: "admin" }
];

export const AdminAuth = {
    currentUser: null,
    isAdminUser: false,
    authUpdateCallback: null,

    async init(onAuthStateUpdate) {
        this.authUpdateCallback = onAuthStateUpdate;
        if (isFirebaseActive) {
            const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // Fetch admin privileges from Firestore
                    const isAd = await this.verifyAdminPrivileges(user.uid, user.email);
                    if (isAd) {
                        this.currentUser = user;
                        this.isAdminUser = true;
                        localStorage.setItem("ece-admin-user", JSON.stringify({ email: user.email, uid: user.uid }));
                        onAuthStateUpdate(true, user);
                    } else {
                        // Logged in but not an admin - sign out and redirect to home
                        console.error("Access denied: User is not registered in 'admins' collection.");
                        await this.logout();
                        onAuthStateUpdate(false, null, "not-admin");
                    }
                } else {
                    this.currentUser = null;
                    this.isAdminUser = false;
                    localStorage.removeItem("ece-admin-user");
                    onAuthStateUpdate(false, null);
                }
            });
        } else {
            // Local Mock Session check
            const savedAdmin = localStorage.getItem("ece-admin-user");
            if (savedAdmin) {
                try {
                    const adminObj = JSON.parse(savedAdmin);
                    this.currentUser = adminObj;
                    this.isAdminUser = true;
                    onAuthStateUpdate(true, adminObj);
                } catch (e) {
                    onAuthStateUpdate(false, null);
                }
            } else {
                onAuthStateUpdate(false, null);
            }
        }
    },

    async verifyAdminPrivileges(uid, email) {
        if (!isFirebaseActive) return true;
        try {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const adminDocRef = doc(db, "admins", uid);
            const docSnap = await getDoc(adminDocRef);

            if (docSnap.exists() && docSnap.data().role === "admin") {
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error verifying admin privileges: ", err);
            return false;
        }
    },

    async login(email, password) {
        if (isFirebaseActive) {
            const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                // Verify admin collection mapping
                const isAd = await this.verifyAdminPrivileges(user.uid, user.email);
                if (!isAd) {
                    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
                    await signOut(auth);
                    throw new Error("Access Denied: Not registered as administrator.");
                }
                return { success: true, user };
            } catch (err) {
                return { success: false, error: err.message };
            }
        } else {
            // Mock Login Process
            const foundAdmin = MOCK_ADMINS.find(a => a.email === email && a.password === password);
            if (foundAdmin) {
                const mockUser = { uid: "mock-uid-" + email.replace(/[^a-zA-Z0-9]/g, ""), email: foundAdmin.email };
                this.currentUser = mockUser;
                this.isAdminUser = true;
                localStorage.setItem("ece-admin-user", JSON.stringify(mockUser));
                
                // Track activity
                this.logMockActivity("Admin Login", mockUser.email, "Access granted to admin panel");
                
                if (this.authUpdateCallback) {
                    this.authUpdateCallback(true, mockUser);
                }
                return { success: true, user: mockUser };
            } else {
                return { success: false, error: "Incorrect credentials or operator key." };
            }
        }
    },

    async logout() {
        if (isFirebaseActive) {
            const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
            try {
                await signOut(auth);
            } catch (err) {
                console.error("Error signing out: ", err);
            }
        }
        this.currentUser = null;
        this.isAdminUser = false;
        localStorage.removeItem("ece-admin-user");
        
        // Redirect to login page on logout
        window.location.hash = "#/login";
    },

    // Registers a new administrator (restricted to existing admins in database)
    async registerNewAdmin(email, uid) {
        if (isFirebaseActive) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            try {
                const adminDocRef = doc(db, "admins", uid);
                await setDoc(adminDocRef, {
                    email: email,
                    role: "admin",
                    createdAt: new Date()
                });
                return { success: true };
            } catch (err) {
                return { success: false, error: err.message };
            }
        } else {
            // Mock registration
            if (!MOCK_ADMINS.some(a => a.email === email)) {
                MOCK_ADMINS.push({ email, password: "password123", role: "admin" });
                this.logMockActivity("Admin Creation", email, "Elevated user permissions to admin operator");
            }
            return { success: true };
        }
    },

    logMockActivity(action, user, details) {
        try {
            const logs = JSON.parse(localStorage.getItem("ece-mock-logs")) || [];
            logs.push({
                action,
                user,
                timestamp: new Date().toISOString(),
                details
            });
            localStorage.setItem("ece-mock-logs", JSON.stringify(logs));
        } catch (e) {}
    }
};
