/**
 * Nextron - Main Application Entrypoint
 */

import { Router } from './router.js';
import { isFirebaseActive, db, auth } from './firebase.js';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// Global Application State
export const AppState = {
    theme: 'dark',
    completedQuizzes: {}, // e.g. { "pn-junction": score }
    sandboxCircuits: [],
    currentUser: null,
    gamificationProfile: null, // loaded from ece-quiz-gamification

    async registerUser(username, email, password, college) {
        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    username: username,
                    name: username,
                    email: email,
                    college: college,
                    status: "active",
                    role: "user",
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                }
            );

            this.currentUser = {
                username,
                email,
                college
            };

            localStorage.setItem(
                'ece-current-user',
                JSON.stringify(this.currentUser)
            );

            this.updateAuthUI();

            this.showToast(
                `Welcome to Nextron, ${username}!`,
                "success"
            );

            if (window.appRouter && window.appRouter.activeView) {
                window.appRouter.handleRouting();
            }

            return true;

        } catch (error) {

            console.error(error);

            this.showToast(
                error.message,
                "error"
            );

            return false;
        }
    },

    loginUser(username, password) {

        // TEST USER BYPASS
        if (username.toLowerCase() === "scholar" && password === "password") {
            this.currentUser = { username: "scholar", email: "scholar@college.edu" };
            localStorage.setItem('ece-current-user', JSON.stringify(this.currentUser));

            // Instantly fill completed quizzes to 100% to unlock all chapters!
            this.completedQuizzes = {
                "signals": 100,
                "networks": 100,
                "pn-junction": 100,
                "transistor": 100,
                "logic-gates": 100,
                "flip-flops": 100,
                "microcontrollers": 100,
                "dsp": 100,
                "comms": 100,
                "vlsi": 100,
                "embedded": 100,
                "optical": 100
            };
            localStorage.setItem('ece-student-quizzes', JSON.stringify(this.completedQuizzes));

            this.updateAuthUI();
            this.showToast("Test Account Connected! All syllabus chapters unlocked.", "success");

            if (window.appRouter && window.appRouter.activeView) {
                window.appRouter.handleRouting();
            }
            return true;
        }

        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('ece-explorer-users')) || [];
        } catch (e) {
            users = [];
        }

        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (!user) {
            this.showToast("Incorrect username or password. Connection failed!", "error");
            return false;
        }

        this.currentUser = { username: user.username, email: user.email };
        localStorage.setItem('ece-current-user', JSON.stringify(this.currentUser));
        this.updateAuthUI();

        this.showToast(`Welcome back, ${user.username}!`, "success");

        // Force refresh current view to update personalized greetings
        if (window.appRouter && window.appRouter.activeView) {
            window.appRouter.handleRouting();
        }
        return true;
    },

    logoutUser() {
        const username = this.currentUser ? this.currentUser.username : "Scholar";
        this.currentUser = null;
        localStorage.removeItem('ece-current-user');
        this.updateAuthUI();
        this.showToast(`Logged out. Farewell, ${username}!`, "info");

        // Force refresh current view to update personalized greetings
        if (window.appRouter && window.appRouter.activeView) {
            window.appRouter.handleRouting();
        }
    },

    updateAuthUI() {
        const pillContainer = document.getElementById('auth-header-pill');
        const navItem = document.getElementById('auth-nav-item');

        if (this.currentUser) {
            document.body.classList.add('user-logged-in');
            const username = this.currentUser.username;
            if (pillContainer) {
                pillContainer.innerHTML = `
                    <div class="auth-header-pill">
                        <div class="auth-avatar">${username[0].toUpperCase()}</div>
                        <span style="color: var(--text-primary); font-size: 0.85rem; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${username}</span>
                        <button class="auth-logout-btn" id="btn-header-logout" title="Sign Out">
                            <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
                        </button>
                    </div>
                `;

                // Logout listener
                document.getElementById('btn-header-logout').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.logoutUser();
                });
            }

            if (navItem) {
                navItem.innerHTML = `
                    <a href="#/" class="nav-link text-error" id="btn-nav-logout" style="color: var(--error);">
                        <i data-lucide="log-out"></i> Log Out
                    </a>
                `;
                document.getElementById('btn-nav-logout').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logoutUser();
                });
            }
        } else {
            document.body.classList.remove('user-logged-in');
            if (pillContainer) {
                pillContainer.innerHTML = `
                    <button class="btn btn-secondary btn-signin-trigger" style="padding: 6px 14px; font-size: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="log-in" style="width: 12px; height: 12px;"></i> Sign In
                    </button>
                `;

                // Signin listeners
                pillContainer.querySelector('.btn-signin-trigger').addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.hash = '#/login';
                });
            }

            if (navItem) {
                navItem.innerHTML = `
                    <a href="#/login" class="nav-link" data-route="login">
                        <i data-lucide="log-in"></i> Sign In
                    </a>
                `;
            }
        }

        if (window.lucide) window.lucide.createIcons();
    },

    // Toast Notification System
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
};
window.AppState = AppState;

// --- Ambient Particle Line Background Simulation ---
class AmbientParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 55;
        this.connectionDist = 120;

        this.mouse = { x: null, y: null, radius: 150 };

        this.init();

        // Listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    init() {
        this.resizeCanvas();
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(99, 102, 241, 0.4)'
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const theme = document.documentElement.getAttribute('data-theme');
        const isDark = theme === 'dark';

        // Draw Particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Connect to mouse
            if (this.mouse.x && this.mouse.y) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const alpha = (1 - dist / this.mouse.radius) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = isDark
                        ? `rgba(6, 182, 212, ${alpha})`
                        : `rgba(79, 70, 229, ${alpha})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }

            // Connect to other particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDist) {
                    const alpha = (1 - dist / this.connectionDist) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = isDark
                        ? `rgba(255, 255, 255, ${alpha})`
                        : `rgba(15, 23, 42, ${alpha})`;
                    this.ctx.lineWidth = 0.6;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// --- Bootstrap Application ---
document.addEventListener('DOMContentLoaded', async () => {
    // 0. Path Interceptor & Redirection to Admin Panel
    const pathname = window.location.pathname;
    if (pathname === '/admin' || pathname === '/admin/login' || pathname.startsWith('/admin/')) {
        window.location.href = '/admin/admin.html';
        return;
    }

    // 0b. Maintenance Mode Check
    let isMaintenance = false;
    if (isFirebaseActive) {
        try {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDoc(doc(db, "settings", "globalConfig"));
            if (snap.exists() && snap.data().maintenanceMode) {
                isMaintenance = true;
            }
        } catch (e) {
            console.error("Error reading firebase settings: ", e);
        }
    } else {
        try {
            const saved = JSON.parse(localStorage.getItem("ece-mock-settings-config"));
            if (saved && saved.maintenanceMode) {
                isMaintenance = true;
            }
        } catch (e) { }
    }

    if (isMaintenance && !localStorage.getItem("ece-admin-user")) {
        // Enforce Lockdown Screen
        document.body.innerHTML = `
            <div class="glass-card flex-center fade-in" style="flex-direction: column; min-height: 100vh; text-align: center; padding: 48px; border:none; background: radial-gradient(circle at center, #111029, #05060b); border-radius:0; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; box-sizing:border-box;">
                <div style="width:70px; height:70px; border-radius:12px; background:linear-gradient(135deg, var(--error), var(--warning)); display:flex; align-items:center; justify-content:center; font-size:2rem; color:white; margin-bottom:24px; box-shadow:0 0 20px rgba(239,68,68,0.25);">⚠️</div>
                <h1 style="color: var(--text-primary); margin-bottom: 16px; font-size: 2.6rem; font-family:'Outfit', sans-serif;">System Maintenance</h1>
                <p style="font-size: 1.15rem; color: var(--text-secondary); max-width:550px; line-height:1.6; margin-bottom:32px;">Website is currently under maintenance. We are updating laboratory simulations. Normal operations will resume shortly.</p>
                <div style="display:flex; gap:16px;">
                    <a href="/admin/admin.html" class="btn btn-secondary" style="padding: 10px 24px; font-size: 0.9rem; border: 1px solid var(--border-color); border-radius:var(--border-radius-sm); color:var(--text-primary);">Admin Access</a>
                    <button onclick="window.location.reload()" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.9rem; border:none; border-radius:var(--border-radius-sm); background:linear-gradient(135deg, var(--accent-secondary), var(--accent-primary)); color:white;">Retry Connection</button>
                </div>
            </div>
        `;
        return;
    }

    // 1. Initialize Particles Background
    new AmbientParticleBackground('particle-bg');

    const themeBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('ece-explorer-theme') || 'dark';
    setTheme(storedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        AppState.showToast(`Theme switched to ${newTheme} mode!`, 'info');
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ece-explorer-theme', theme);
        AppState.theme = theme;
    }

    // 3. Mobile Navigation Drawer Toggle
    const mobileBtn = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    // 4. Initialize Hash SPA Routes
    const routes = [
        { path: '#/', name: 'home', loadView: () => import('./home.js') },
        { path: '#/login', name: 'login', loadView: () => import('./login.js') },
        { path: '#/concepts', name: 'concepts', loadView: () => import('./concepts.js') },
        { path: '#/concept/diode', name: 'concepts', loadView: () => import('./diode.js') },
        { path: '#/concept/transistor', name: 'concepts', loadView: () => import('./transistor.js') },
        { path: '#/concept/gates', name: 'concepts', loadView: () => import('./gates.js') },
        { path: '#/concept/flipflops', name: 'concepts', loadView: () => import('./flipflops.js') },
        { path: '#/concept/signals', name: 'concepts', loadView: () => import('./signals.js') },
        { path: '#/concept/networks', name: 'concepts', loadView: () => import('./networks.js') },
        { path: '#/concept/microcontrollers', name: 'concepts', loadView: () => import('./microcontrollers.js') },
        { path: '#/concept/dsp', name: 'concepts', loadView: () => import('./dsp.js') },
        { path: '#/concept/comms', name: 'concepts', loadView: () => import('./comms.js') },
        { path: '#/concept/vlsi', name: 'concepts', loadView: () => import('./vlsi.js') },
        { path: '#/concept/embedded', name: 'concepts', loadView: () => import('./embedded.js') },
        { path: '#/concept/optical', name: 'concepts', loadView: () => import('./optical.js') },
        { path: '#/sandbox', name: 'sandbox', loadView: () => import('./sandbox.js') },
        { path: '#/circuit-lab', name: 'circuit-lab', loadView: () => import('./circuitlab.js') },
        { path: '#/math-center', name: 'math-center', loadView: () => import('./mathcenter.js') },
        { path: '#/notes', name: 'notes', loadView: () => import('./notes.js') },
        { path: '#/study-hub', name: 'study-hub', loadView: () => import('./studyhub.js') },
        { path: '#/quiz', name: 'quiz', loadView: () => import('./quiz.js') },
        { path: '#/quiz-analytics', name: 'quiz-analytics', loadView: () => import('./quiz-analytics.js') },
        { path: '#/leaderboard', name: 'leaderboard', loadView: () => import('./quiz-leaderboard.js') },
        { path: '#/dashboard', name: 'dashboard', loadView: () => import('./dashboard.js') },
        { path: '#/about', name: 'about', loadView: () => import('./about.js') }
    ];

    // Load student records from localStorage
    const savedQuizzes = localStorage.getItem('ece-student-quizzes');
    if (savedQuizzes) {
        try {
            AppState.completedQuizzes = JSON.parse(savedQuizzes);
        } catch (e) { }
    }

    // Load gamification profile asynchronously (non-blocking)
    import('./quiz-engine.js').then(({ loadProfile }) => {
        AppState.gamificationProfile = loadProfile();
    }).catch(() => { });

    // Load current logged-in user
    const savedUser = localStorage.getItem('ece-current-user');
    if (savedUser) {
        try {
            AppState.currentUser = JSON.parse(savedUser);
        } catch (e) { }
    }

    // Initial Auth UI Draw
    AppState.updateAuthUI();

    // Initialize Router (Must occur AFTER user and quiz data are loaded to prevent routing guard race conditions)
    window.appRouter = new Router(routes, 'app-root');
});
