/**
 * Nextron - Admin Dashboard Main Entrypoint
 */

import { AdminAuth } from "./admin-auth.js";

// Global Admin Dashboard State
export const AdminState = {
    activeTab: "dashboard",
    searchQuery: "",
    loadedModules: {},
    isFirebase: false,
    
    // Global Toast Notification
    showToast(message, type = "info") {
        const container = document.getElementById("admin-toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `admin-toast ${type}`;
        
        let iconName = "info";
        if (type === "success") iconName = "check-circle";
        if (type === "error") iconName = "alert-triangle";
        if (type === "warning") iconName = "alert-circle";
        
        toast.innerHTML = `
            <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        // Trigger slide-in
        setTimeout(() => toast.classList.add("show"), 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    // Modal Helpers
    openModal(htmlContent, onCloseCallback = null) {
        const overlay = document.getElementById("admin-modal-host");
        const inner = document.getElementById("admin-modal-inner");
        if (!overlay || !inner) return;

        inner.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-host-title" style="margin:0;">System Command</h3>
                <span class="modal-close-btn" id="modal-host-close">&times;</span>
            </div>
            <div class="modal-body">${htmlContent}</div>
        `;
        
        overlay.classList.add("open");
        document.body.style.overflow = "hidden"; // Prevent page scroll
        
        if (window.lucide) window.lucide.createIcons();

        const closeBtn = document.getElementById("modal-host-close");
        const handleClose = () => {
            overlay.classList.remove("open");
            document.body.style.overflow = "";
            if (onCloseCallback) onCloseCallback();
        };

        closeBtn.onclick = handleClose;
        overlay.onclick = (e) => {
            if (e.target === overlay) handleClose();
        };
    },

    closeModal() {
        const overlay = document.getElementById("admin-modal-host");
        if (overlay) {
            overlay.classList.remove("open");
            document.body.style.overflow = "";
        }
    }
};

window.AdminState = AdminState;

// Bootstrap Admin Panel
document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementById("admin-login-screen");
    const mainLayout = document.getElementById("admin-main-layout");
    const loginForm = document.getElementById("admin-login-form");
    const loginError = document.getElementById("login-error-msg");
    const logoutBtn = document.getElementById("btn-admin-logout");
    const searchInput = document.getElementById("global-admin-search");
    
    // 1. Monitor Authentication State
    AdminAuth.init((isAuthenticated, user, errorReason) => {
        if (isAuthenticated) {
            loginScreen.classList.add("hidden");
            mainLayout.classList.remove("hidden");
            
            // Set header profile info
            document.getElementById("admin-profile-email").textContent = user.email;
            document.getElementById("admin-avatar-char").textContent = user.email.charAt(0).toUpperCase();
            
            AdminState.showToast(`Decryption complete. Operator session verified for ${user.email}`, "success");
            
            // Initial view load
            handleTabSwitch(AdminState.activeTab);
        } else {
            mainLayout.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            
            if (errorReason === "not-admin") {
                loginError.textContent = "Access Denied: Account lacks administrative key mappings.";
                loginError.classList.remove("hidden");
                AdminState.showToast("Access Restricted: Administrator role required.", "error");
            }
        }
    });

    // 2. Handle Login Form Submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginError.classList.add("hidden");
        
        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-password").value;
        
        // Show spinner / loading state
        const submitBtn = loginForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px; margin: 0; display: inline-block;"></span> Verifying key...`;
        submitBtn.disabled = true;
        
        const result = await AdminAuth.login(email, pass);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        if (!result.success) {
            loginError.textContent = result.error || "Decryption failed. Please verify credentials.";
            loginError.classList.remove("hidden");
            AdminState.showToast(result.error || "Connection failed.", "error");
        }
    });

    // 3. Handle Logout Click
    logoutBtn.addEventListener("click", async () => {
        if (confirm("Terminate current administrator session?")) {
            await AdminAuth.logout();
            location.reload();
        }
    });

    // 4. Sidebar Tabs Switching
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const tabName = e.currentTarget.getAttribute("data-tab");
            if (tabName) {
                // Remove active classes
                sidebarLinks.forEach(l => l.classList.remove("active"));
                e.currentTarget.classList.add("active");
                
                // Clear search when switching tabs
                if (searchInput) {
                    searchInput.value = "";
                    AdminState.searchQuery = "";
                }
                
                handleTabSwitch(tabName);
            }
        });
    });

    // 5. Global Searching Mechanism
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            AdminState.searchQuery = query;
            if (query.length > 0) {
                renderSearchResults(query);
            } else {
                // Restore active tab rendering
                handleTabSwitch(AdminState.activeTab);
            }
        });
    }

    // Dynamic Tab Loading Function
    async function handleTabSwitch(tabName) {
        AdminState.activeTab = tabName;
        const mount = document.getElementById("admin-main-mount");
        if (!mount) return;
        
        // Show loading screen in workspace
        mount.innerHTML = `
            <div class="flex-center" style="height: 60vh;">
                <div class="spinner"></div>
            </div>
        `;
        
        try {
            let module = null;
            if (tabName === "dashboard") {
                module = await import("./admin-dashboard.js");
            } else if (tabName === "users") {
                module = await import("./admin-users.js");
            } else if (tabName === "content") {
                module = await import("./admin-content.js");
            } else if (tabName === "quizzes") {
                module = await import("./admin-quizzes.js");
            } else if (tabName === "simulations") {
                module = await import("./admin-simulations.js");
            } else if (tabName === "announcements") {
                // Reuse settings or content module for announcements
                module = await import("./admin-settings.js");
            } else if (tabName === "feedback") {
                module = await import("./admin-users.js"); // Feedback shares users data load or custom render
            } else if (tabName === "analytics") {
                module = await import("./admin-analytics.js");
            } else if (tabName === "settings") {
                module = await import("./admin-settings.js");
            } else if (tabName === "logs") {
                module = await import("./admin-dashboard.js"); // Shared with dashboard logger
            }
            
            if (module && typeof module.render === "function") {
                await module.render(mount, tabName);
            } else {
                mount.innerHTML = `
                    <div class="admin-card text-center" style="padding: 48px;">
                        <h3 style="color:var(--error);"><i data-lucide="alert-triangle"></i> Module Load Mismatch</h3>
                        <p>The workspace interface for '${tabName}' could not resolve. Contact system integrator.</p>
                    </div>
                `;
            }
            
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            console.error(`Error switching to tab ${tabName}: `, err);
            mount.innerHTML = `
                <div class="admin-card text-center" style="padding: 48px;">
                    <h3 style="color:var(--error);"><i data-lucide="alert-triangle"></i> Workspace Exception</h3>
                    <p>A runtime failure occurred while launching this terminal sector: ${err.message}</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    // Renders the global search outcome grid
    async function renderSearchResults(queryText) {
        const mount = document.getElementById("admin-main-mount");
        if (!mount) return;

        mount.innerHTML = `
            <div class="admin-card">
                <h2>Search Results</h2>
                <p>System database matches for: <strong>"${queryText}"</strong></p>
                <div id="search-results-list" style="display:flex; flex-direction:column; gap:20px;">
                    <div class="flex-center" style="padding:40px;"><div class="spinner"></div></div>
                </div>
            </div>
        `;

        try {
            // Fetch and aggregate search matches
            // We dynamic import the sub-modules to query their datasets
            const contentModule = await import("./admin-content.js");
            const usersModule = await import("./admin-users.js");
            const quizModule = await import("./admin-quizzes.js");
            const simModule = await import("./admin-simulations.js");

            const matches = [];

            // 1. Search CMS Topics
            const topics = await contentModule.fetchCMSData();
            topics.forEach(t => {
                if (t.title.toLowerCase().includes(queryText) || t.category.toLowerCase().includes(queryText)) {
                    matches.push({
                        type: "Educational Content",
                        title: t.title,
                        desc: `CMS Concept under ${t.category} (${t.published ? 'Published' : 'Draft'})`,
                        action: () => {
                            const sidebarLinks = document.querySelectorAll(".sidebar-link");
                            sidebarLinks.forEach(l => l.classList.remove("active"));
                            document.querySelector("[data-tab='content']").classList.add("active");
                            contentModule.render(mount, "content", t.id);
                        }
                    });
                }
            });

            // 2. Search Users
            const users = await usersModule.fetchUsersData();
            users.forEach(u => {
                if (u.name.toLowerCase().includes(queryText) || u.email.toLowerCase().includes(queryText)) {
                    matches.push({
                        type: "User Profile",
                        title: u.name,
                        desc: `Registered Student: ${u.email} • Status: ${u.status}`,
                        action: () => {
                            const sidebarLinks = document.querySelectorAll(".sidebar-link");
                            sidebarLinks.forEach(l => l.classList.remove("active"));
                            document.querySelector("[data-tab='users']").classList.add("active");
                            usersModule.render(mount, "users", u.uid);
                        }
                    });
                }
            });

            // 3. Search Quizzes
            const quizzes = await quizModule.fetchQuizzesData();
            quizzes.forEach(q => {
                if (q.title.toLowerCase().includes(queryText)) {
                    matches.push({
                        type: "Quiz System",
                        title: q.title,
                        desc: `Assessment containing ${q.questions ? q.questions.length : 0} questions`,
                        action: () => {
                            const sidebarLinks = document.querySelectorAll(".sidebar-link");
                            sidebarLinks.forEach(l => l.classList.remove("active"));
                            document.querySelector("[data-tab='quizzes']").classList.add("active");
                            quizModule.render(mount, "quizzes", q.id);
                        }
                    });
                }
            });

            // 4. Search Simulations
            const sims = await simModule.fetchSimulationsData();
            sims.forEach(s => {
                if (s.title.toLowerCase().includes(queryText) || s.category.toLowerCase().includes(queryText)) {
                    matches.push({
                        type: "Simulation Lab",
                        title: s.title,
                        desc: `Interactive ${s.category} simulator (${s.enabled ? 'Enabled' : 'Disabled'})`,
                        action: () => {
                            const sidebarLinks = document.querySelectorAll(".sidebar-link");
                            sidebarLinks.forEach(l => l.classList.remove("active"));
                            document.querySelector("[data-tab='simulations']").classList.add("active");
                            simModule.render(mount, "simulations", s.id);
                        }
                    });
                }
            });

            const listMount = document.getElementById("search-results-list");
            if (matches.length === 0) {
                listMount.innerHTML = `
                    <div style="text-align:center; padding: 40px; color: var(--text-muted);">
                        <i data-lucide="info" style="width:36px; height:36px; margin-bottom:12px;"></i>
                        <p>No matching database records found inside Platform registry.</p>
                    </div>
                `;
            } else {
                listMount.innerHTML = matches.map((m, idx) => `
                    <div class="glass-card" style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-left:4px solid var(--accent-secondary);">
                        <div>
                            <span class="badge badge-info" style="margin-bottom:6px;">${m.type}</span>
                            <h4 style="margin:0; font-size:1.1rem; color:#fff;">${m.title}</h4>
                            <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">${m.desc}</p>
                        </div>
                        <button class="btn btn-secondary btn-search-go" data-idx="${idx}" style="padding:6px 14px; font-size:0.8rem;">Open Sector</button>
                    </div>
                `).join("");

                listMount.querySelectorAll(".btn-search-go").forEach(btn => {
                    btn.onclick = (e) => {
                        const idx = parseInt(e.target.getAttribute("data-idx"));
                        if (matches[idx]) matches[idx].action();
                    };
                });
            }

            if (window.lucide) window.lucide.createIcons();

        } catch (err) {
            console.error("Search query execution failed: ", err);
        }
    }
});
