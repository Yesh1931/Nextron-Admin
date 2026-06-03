/**
 * Nextron - User Management & Student Feedback
 */

import { db, isFirebaseActive } from "./js/firebase-config.js";
import { logAdminAction } from "./admin-dashboard.js";

// Main render entrypoint
export async function render(mountPoint, tabName, preselectedId = null) {
    if (tabName === "feedback") {
        await renderFeedbackTab(mountPoint);
        return;
    }

    mountPoint.innerHTML = `
        <section class="mb-20 flex-between">
            <div>
                <h2 class="m-0">Student Registry & Analytics</h2>
                <p style="margin: 4px 0 0 0;">Manage student accounts, override credentials, and audit individual academic progress maps.</p>
            </div>
        </section>

        <!-- Filters Block -->
        <div class="admin-card" style="padding:16px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; gap:12px; align-items:center;">
                    <div class="header-search-box" style="width:260px; background:rgba(0,0,0,0.25);">
                        <i data-lucide="search" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
                        <input type="text" id="user-filter-search" placeholder="Search by name or email...">
                    </div>
                    <select class="form-select" id="user-filter-status" style="width:160px; padding: 8px 12px; font-size: 0.85rem;">
                        <option value="all">All Accounts</option>
                        <option value="active">Active Only</option>
                        <option value="disabled">Disabled Only</option>
                    </select>
                </div>
                <div style="font-size:0.85rem; color:var(--text-muted);" id="user-count-display">Showing 0 users</div>
            </div>
        </div>

        <!-- Users Directory Card -->
        <div class="admin-card" style="position:relative;">
            <div class="loading-spinner-overlay" id="users-loading-overlay"><div class="spinner"></div></div>
            
            <div class="table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email Address</th>
                            <th>Registration Date</th>
                            <th>Last Active</th>
                            <th>Attempts</th>
                            <th>Avg Score</th>
                            <th>Status</th>
                            <th style="text-align:right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="users-directory-tbody">
                        <tr><td colspan="8" style="text-align:center;">Querying database registers...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind event listeners
    const search = document.getElementById("user-filter-search");
    const statusSelect = document.getElementById("user-filter-status");

    const refreshList = async () => {
        const query = search.value.toLowerCase().trim();
        const status = statusSelect.value;
        await loadUsersGrid(query, status);
    };

    search.addEventListener("input", refreshList);
    statusSelect.addEventListener("change", refreshList);

    // Load initial grid
    await refreshList();

    // Direct redirection from global search
    if (preselectedId) {
        viewUserProfile(preselectedId);
    }
}

// Fetches all users and aggregates their stats
export async function fetchUsersData() {
    let users = [];
    if (isFirebaseActive) {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "users"));
            snapshot.forEach(doc => {
                users.push({ uid: doc.id, ...doc.data() });
            });
        } catch (e) {
            console.error(e);
        }
    } else {
        // Local Mock Data
        try {
            let registered = JSON.parse(localStorage.getItem("ece-explorer-users")) || [];
            const seeded = localStorage.getItem("ece-mock-users-seeded");
            if (!seeded) {
                const defaultMocks = [
                    { username: "Scholar", name: "Scholar Test User", email: "scholar@college.edu", college: "IIT Bombay", status: "active", createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), lastLogin: new Date().toISOString() },
                    { username: "ananya", name: "Ananya Sharma", email: "ananya.sharma@nitk.edu.in", college: "NIT Surathkal", status: "active", createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(), lastLogin: new Date(Date.now() - 36 * 3600 * 1000).toISOString() },
                    { username: "rohit", name: "Rohit Verma", email: "rohit.verma@iitd.ac.in", college: "IIT Delhi", status: "disabled", createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(), lastLogin: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString() }
                ];
                defaultMocks.forEach(m => {
                    if (!registered.some(r => r.email === m.email)) {
                        registered.push(m);
                    }
                });
                localStorage.setItem("ece-explorer-users", JSON.stringify(registered));
                localStorage.setItem("ece-mock-users-seeded", "true");
            }

            users = registered.map(r => ({
                uid: r.uid || "mock-uid-" + (r.username || r.name || r.email.split('@')[0]),
                name: r.name || r.username,
                email: r.email,
                college: r.college || "India Institute",
                status: r.status || "active",
                createdAt: r.createdAt || new Date().toISOString(),
                lastLogin: r.lastLogin || new Date().toISOString()
            }));
        } catch (e) { }
    }
    return users;
}

async function loadUsersGrid(searchQuery = "", statusFilter = "all") {
    const tbody = document.getElementById("users-directory-tbody");
    const overlay = document.getElementById("users-loading-overlay");
    const countDisplay = document.getElementById("user-count-display");

    if (overlay) overlay.classList.add("active");

    const users = await fetchUsersData();
    let quizAttempts = [];

    if (isFirebaseActive) {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "quizAttempts"));
            snapshot.forEach(doc => quizAttempts.push(doc.data()));
        } catch (e) { }
    } else {
        // Mock Quiz Attempts mapping
        try {
            const completed = JSON.parse(localStorage.getItem("ece-student-quizzes")) || {};
            Object.entries(completed).forEach(([key, val]) => {
                quizAttempts.push({
                    userEmail: "scholar@college.edu",
                    quizKey: key,
                    score: val,
                    timestamp: new Date().toISOString()
                });
            });
            // Add some noise attempts for other users
            quizAttempts.push({ userEmail: "ananya.sharma@nitk.edu.in", quizKey: "signals", score: 85, timestamp: new Date().toISOString() });
            quizAttempts.push({ userEmail: "ananya.sharma@nitk.edu.in", quizKey: "networks", score: 92, timestamp: new Date().toISOString() });
        } catch (e) { }
    }

    // Filter list
    const filtered = users.filter(u => {
        const matchesQuery = u.name.toLowerCase().includes(searchQuery) || u.email.toLowerCase().includes(searchQuery);
        const matchesStatus = statusFilter === "all" || u.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    if (countDisplay) countDisplay.textContent = `Showing ${filtered.length} of ${users.length} users`;

    if (tbody) {
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No student accounts matching criteria.</td></tr>`;
        } else {
            tbody.innerHTML = filtered.map(u => {
                const uAttempts = quizAttempts.filter(a => a.userEmail === u.email);
                const attemptsCount = uAttempts.length;
                let sum = 0;
                uAttempts.forEach(a => sum += a.score);
                const avgScore = attemptsCount > 0 ? Math.round(sum / attemptsCount) : 0;

                const regDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A";
                const lastDate = u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "N/A";

                const isAct = u.status === "active";
                const statusBadge = isAct
                    ? `<span class="badge badge-success">Active</span>`
                    : `<span class="badge badge-error">Disabled</span>`;

                const toggleBtn = isAct
                    ? `<button class="btn btn-secondary btn-user-toggle text-error" data-uid="${u.uid}" data-action="disable" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="shield-off" style="width:12px; height:12px;"></i> Block</button>`
                    : `<button class="btn btn-secondary btn-user-toggle text-success" data-uid="${u.uid}" data-action="enable" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="shield" style="width:12px; height:12px;"></i> Unblock</button>`;

                return `
                    <tr>
                        <td>
                            <div style="font-weight:600; color:#fff;">${u.name}</div>
                            <div style="font-size:0.75rem; color:var(--text-muted);">${u.college || 'Unspecified'}</div>
                        </td>
                        <td>${u.email}</td>
                        <td>${regDate}</td>
                        <td>${lastDate}</td>
                        <td style="font-family: monospace;">${attemptsCount}</td>
                        <td style="font-family: monospace; font-weight:700; color:${avgScore >= 80 ? 'var(--success)' : 'var(--text-primary)'};">${avgScore ? avgScore + '%' : '-'}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <div style="display:flex; gap:6px; justify-content:flex-end;">
                                <button class="btn btn-secondary btn-user-profile" data-uid="${u.uid}" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="eye" style="width:12px; height:12px;"></i> Profile</button>
                                ${toggleBtn}
                                <button class="btn btn-secondary btn-user-delete text-error" data-uid="${u.uid}" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="trash-2" style="width:12px; height:12px;"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");

            // Bind actions
            tbody.querySelectorAll(".btn-user-profile").forEach(btn => {
                btn.onclick = () => viewUserProfile(btn.getAttribute("data-uid"));
            });

            tbody.querySelectorAll(".btn-user-toggle").forEach(btn => {
                btn.onclick = () => toggleUserStatus(btn.getAttribute("data-uid"), btn.getAttribute("data-action"));
            });

            tbody.querySelectorAll(".btn-user-delete").forEach(btn => {
                btn.onclick = () => deleteUserAccount(btn.getAttribute("data-uid"));
            });
        }
    }

    if (window.lucide) window.lucide.createIcons();
    if (overlay) overlay.classList.remove("active");
}

// ─── USER PROFILE ANALYTICS DRAWER ───────────────────────────────────────────
async function viewUserProfile(uid) {
    const users = await fetchUsersData();
    const user = users.find(u => u.uid === uid);
    if (!user) return;

    let attempts = [];
    if (isFirebaseActive) {
        try {
            const { collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(query(collection(db, "quizAttempts"), where("userEmail", "==", user.email)));
            snapshot.forEach(doc => attempts.push(doc.data()));
        } catch (e) { }
    } else {
        // Mock attempts
        attempts = [
            { quizKey: "signals", score: 85, timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), durationSeconds: 240 },
            { quizKey: "networks", score: 92, timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), durationSeconds: 180 },
            { quizKey: "pn-junction", score: 70, timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), durationSeconds: 310 }
        ];
    }

    // Compute badges earned (Score >= 80% on quiz)
    const passedQuizzes = attempts.filter(a => a.score >= 80);
    const badges = passedQuizzes.map(a => {
        const title = a.quizKey.charAt(0).toUpperCase() + a.quizKey.slice(1);
        return { name: `${title} Master`, icon: "🏅", desc: `Earned ${a.score}% score` };
    });

    const totalSeconds = attempts.reduce((acc, a) => acc + (a.durationSeconds || 0), 0);
    const timeSpentMinutes = Math.round(totalSeconds / 60) || 12;

    const modalHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; text-align:left;">
            <div>
                <h4 style="color:#fff; margin-bottom:12px;">Personal Information</h4>
                <div style="display:flex; flex-direction:column; gap:8px; font-size:0.92rem; background:rgba(0,0,0,0.15); padding:16px; border-radius:8px;">
                    <div><span style="color:var(--text-muted);">Name:</span> <strong style="color:#fff;">${user.name}</strong></div>
                    <div><span style="color:var(--text-muted);">Email:</span> <strong>${user.email}</strong></div>
                    <div><span style="color:var(--text-muted);">College:</span> <strong>${user.college || 'Unspecified'}</strong></div>
                    <div><span style="color:var(--text-muted);">Joined:</span> <strong>${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</strong></div>
                    <div><span style="color:var(--text-muted);">Last Login:</span> <strong>${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</strong></div>
                </div>

                <h4 style="color:#fff; margin-top:20px; margin-bottom:12px;">Badges Earned</h4>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    ${badges.length === 0
            ? `<span style="font-size:0.85rem; color:var(--text-muted);">No mastery badges earned yet.</span>`
            : badges.map(b => `
                            <div style="background:rgba(217, 70, 239, 0.1); border:1px solid rgba(217,70,239,0.3); border-radius:6px; padding:6px 12px; display:flex; align-items:center; gap:6px;">
                                <span>${b.icon}</span>
                                <div>
                                    <div style="font-weight:700; font-size:0.8rem; color:#fff;">${b.name}</div>
                                    <div style="font-size:0.65rem; color:var(--text-muted);">${b.desc}</div>
                                </div>
                            </div>
                        `).join("")
        }
                </div>
            </div>

            <div>
                <h4 style="color:#fff; margin-bottom:12px;">Learning Progress</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
                    <div style="background:rgba(0,0,0,0.15); padding:12px; border-radius:6px; text-align:center;">
                        <div style="color:var(--accent-secondary); font-size:1.4rem; font-weight:800;">${attempts.length}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Quiz Attempts</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.15); padding:12px; border-radius:6px; text-align:center;">
                        <div style="color:var(--accent-purple); font-size:1.4rem; font-weight:800;">${timeSpentMinutes} mins</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Time spent learning</div>
                    </div>
                </div>

                <h4 style="color:#fff; margin-bottom:12px;">Quiz History Curve</h4>
                <div style="height:180px; width:100%; background:rgba(0,0,0,0.25); border:1px solid var(--border-admin); border-radius:6px; padding:8px; box-sizing:border-box;">
                    <canvas id="user-progress-chart-canvas"></canvas>
                </div>
            </div>
        </div>

        <div style="margin-top:24px; display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-secondary text-error" id="btn-profile-reset-progress" style="padding:8px 16px; font-size:0.85rem;"><i data-lucide="rotate-ccw" style="width:14px; height:14px;"></i> Reset Progress</button>
            <button class="btn btn-primary" id="btn-profile-modal-close" style="padding:8px 24px; font-size:0.85rem;">Close Profile</button>
        </div>
    `;

    window.AdminState.openModal(modalHTML);
    document.getElementById("modal-host-title").innerHTML = `<i data-lucide="user" style="width:16px; height:16px; vertical-align:middle; margin-right:4px;"></i> Student Profile Analytics`;

    // Draw Progress Chart using Chart.js
    setTimeout(() => {
        const canvas = document.getElementById("user-progress-chart-canvas");
        if (canvas) {
            const labels = attempts.map((_, idx) => `Q${idx + 1}`);
            const dataScores = attempts.map(a => a.score);

            new Chart(canvas.getContext("2d"), {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Score %",
                        data: dataScores,
                        borderColor: "#06b6d4",
                        backgroundColor: "rgba(6, 182, 212, 0.15)",
                        tension: 0.3,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: "#6366f1"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { min: 0, max: 100, ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                        x: { ticks: { color: "#94a3b8" }, grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }, 50);

    // Bind modal actions
    document.getElementById("btn-profile-modal-close").onclick = () => window.AdminState.closeModal();
    document.getElementById("btn-profile-reset-progress").onclick = async () => {
        if (confirm(`Reset academic progress map and quiz completions for ${user.name}? This action is irreversible.`)) {
            await resetUserProgressRecord(user.email, user.uid);
            window.AdminState.closeModal();
            await loadUsersGrid();
        }
    };

    if (window.lucide) window.lucide.createIcons();
}

async function toggleUserStatus(uid, action) {
    const newStatus = action === "disable" ? "disabled" : "active";
    if (isFirebaseActive) {
        try {
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await updateDoc(doc(db, "users", uid), { status: newStatus });
        } catch (e) {
            console.error(e);
        }
    } else {
        // Mock toggle
        try {
            const registered = JSON.parse(localStorage.getItem("ece-explorer-users")) || [];
            const userIndex = registered.findIndex(r => {
                const calculatedUid = r.uid || "mock-uid-" + (r.username || r.name || r.email.split('@')[0]);
                return calculatedUid === uid;
            });
            if (userIndex !== -1) {
                registered[userIndex].status = newStatus;
                localStorage.setItem("ece-explorer-users", JSON.stringify(registered));
                window.AdminState.showToast(`Operator override: Account status updated to ${newStatus}.`, "success");
            }
        } catch (e) {
            console.error(e);
        }
    }

    await logAdminAction(`User Status Modified`, `admin`, `Status of user account ${uid} set to ${newStatus}`);
    await loadUsersGrid();
}

async function deleteUserAccount(uid) {
    if (confirm("Delete this student registration entirely? All profile metrics and certifications will be wiped.")) {
        if (isFirebaseActive) {
            try {
                const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await deleteDoc(doc(db, "users", uid));
            } catch (e) {
                console.error(e);
            }
        } else {
            // Mock delete
            try {
                const registered = JSON.parse(localStorage.getItem("ece-explorer-users")) || [];
                const filtered = registered.filter(r => {
                    const calculatedUid = r.uid || "mock-uid-" + (r.username || r.name || r.email.split('@')[0]);
                    return calculatedUid !== uid;
                });
                localStorage.setItem("ece-explorer-users", JSON.stringify(filtered));
            } catch (e) {
                console.error(e);
            }
        }
        await logAdminAction(`User Registration Deleted`, `admin`, `Student profile database record ${uid} deleted`);
        window.AdminState.showToast("Account successfully purged from system directory.", "success");
        await loadUsersGrid();
    }
}

async function resetUserProgressRecord(email, uid) {
    if (isFirebaseActive) {
        try {
            const { collection, getDocs, query, where, doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const q = query(collection(db, "quizAttempts"), where("userEmail", "==", email));
            const snap = await getDocs(q);
            snap.forEach(async (d) => {
                await deleteDoc(doc(db, "quizAttempts", d.id));
            });
        } catch (e) {
            console.error(e);
        }
    } else {
        localStorage.removeItem("ece-student-quizzes");
    }
    await logAdminAction(`User Progress Reset`, `admin`, `Academic metrics and quiz sheets wiped for student: ${email}`);
    window.AdminState.showToast("Student progress wiped from registers.", "info");
}

// ─── STUDENT FEEDBACK PANEL RENDERING ─────────────────────────────────────────
async function renderFeedbackTab(mountPoint) {
    mountPoint.innerHTML = `
        <section class="mb-20">
            <h2 class="m-0">Student Feedback Hub</h2>
            <p style="margin: 4px 0 0 0;">Review student suggestions, issue answers, and moderate educational critiques.</p>
        </section>

        <!-- Filters -->
        <div class="admin-card" style="padding:16px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                <select class="form-select" id="feedback-filter-status" style="width:180px; padding: 8px 12px; font-size: 0.85rem;">
                    <option value="all">All Feedback Messages</option>
                    <option value="pending">Pending Reply</option>
                    <option value="resolved">Resolved Messages</option>
                </select>
                <div style="font-size:0.85rem; color:var(--text-muted);" id="feedback-count-display">Showing 0 inputs</div>
            </div>
        </div>

        <!-- Feedback Messages Grid -->
        <div style="display:flex; flex-direction:column; gap:20px;" id="feedback-cards-mount">
            <div class="flex-center" style="padding:60px;"><div class="spinner"></div></div>
        </div>
    `;

    const statusSelect = document.getElementById("feedback-filter-status");
    const refreshList = async () => {
        await loadFeedbackGrid(statusSelect.value);
    };

    statusSelect.addEventListener("change", refreshList);
    await refreshList();
}

async function loadFeedbackGrid(statusFilter = "all") {
    const mount = document.getElementById("feedback-cards-mount");
    const countDisplay = document.getElementById("feedback-count-display");

    let feedback = [];

    if (isFirebaseActive) {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "feedback"));
            snapshot.forEach(doc => feedback.push({ id: doc.id, ...doc.data() }));
        } catch (e) { }
    } else {
        // Mock Feedback Database
        try {
            feedback = JSON.parse(localStorage.getItem("ece-mock-feedback")) || [];
            if (feedback.length === 0) {
                feedback = [
                    { id: "mock-fb-1", senderName: "Scholar Test User", senderEmail: "scholar@college.edu", category: "Simulator Bug", message: "The MOSFET simulator output curve is slightly clipped at saturation inputs above 4.5V.", timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), status: "pending", reply: "" },
                    { id: "mock-fb-2", senderName: "Ananya Sharma", senderEmail: "ananya@nitk.edu", category: "Content Correction", message: "Equation 3 in the DSP Lecture contains a tiny typo inside the summation bounds.", timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), status: "resolved", reply: "Thank you Ananya, the summation indices have been rectified." }
                ];
                localStorage.setItem("ece-mock-feedback", JSON.stringify(feedback));
            }
        } catch (e) { }
    }

    const filtered = feedback.filter(f => {
        return statusFilter === "all" || f.status === statusFilter;
    });

    if (countDisplay) countDisplay.textContent = `Showing ${filtered.length} of ${feedback.length} messages`;

    if (mount) {
        if (filtered.length === 0) {
            mount.innerHTML = `
                <div class="admin-card text-center" style="padding:48px;">
                    <i data-lucide="message-square-off" style="width:36px; height:36px; color:var(--text-muted); margin-bottom:12px;"></i>
                    <p style="margin:0;">No student feedback messages found matching criteria.</p>
                </div>
            `;
        } else {
            mount.innerHTML = filtered.map(f => {
                const dateStr = new Date(f.timestamp).toLocaleString();
                const isPending = f.status === "pending";

                return `
                    <div class="glass-card" style="border-left: 4px solid ${isPending ? 'var(--warning)' : 'var(--success)'}; padding:24px;">
                        <div class="flex-between mb-10">
                            <div>
                                <strong style="font-size:1.1rem; color:#fff;">${f.senderName}</strong>
                                <span style="font-size:0.8rem; color:var(--text-muted); margin-left:8px;">(${f.senderEmail})</span>
                            </div>
                            <span class="badge ${isPending ? 'badge-warning' : 'badge-success'}">${f.status}</span>
                        </div>
                        
                        <div style="font-size:0.75rem; color:var(--accent-secondary); font-weight:700; text-transform:uppercase; margin-bottom:8px;">
                            Category: ${f.category}
                        </div>
                        
                        <p style="font-size:0.95rem; margin-bottom:16px; color:var(--text-primary); line-height:1.5;">${f.message}</p>
                        
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">
                            Submitted: ${dateStr}
                        </div>

                        ${!isPending
                        ? `<div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border-admin); padding:14px; border-radius:6px; margin-top:12px; font-size:0.9rem;">
                                <div style="font-weight:700; color:var(--success); margin-bottom:4px;"><i data-lucide="corner-down-right" style="width:14px; height:14px; vertical-align:middle; margin-right:4px;"></i> Reply Operator:</div>
                                <div style="color:var(--text-secondary);">${f.reply}</div>
                               </div>`
                        : `<div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
                                <textarea class="form-textarea" placeholder="Compose reply to student..." id="reply-text-${f.id}" style="height:70px; font-size:0.85rem; padding:8px 12px;"></textarea>
                                <div style="display:flex; gap:10px; justify-content:flex-end;">
                                    <button class="btn btn-secondary btn-feedback-delete text-error" data-id="${f.id}" style="padding:6px 14px; font-size:0.8rem;">Delete</button>
                                    <button class="btn btn-primary btn-feedback-reply" data-id="${f.id}" style="padding:6px 20px; font-size:0.8rem; border:none;">Send Reply</button>
                                </div>
                               </div>`
                    }
                    </div>
                `;
            }).join("");

            // Bind actions
            mount.querySelectorAll(".btn-feedback-reply").forEach(btn => {
                btn.onclick = async () => {
                    const id = btn.getAttribute("data-id");
                    const txtVal = document.getElementById(`reply-text-${id}`).value.trim();
                    if (txtVal.length === 0) return alert("Reply draft cannot be blank.");
                    await submitFeedbackReply(id, txtVal);
                };
            });

            mount.querySelectorAll(".btn-feedback-delete").forEach(btn => {
                btn.onclick = async () => {
                    const id = btn.getAttribute("data-id");
                    await deleteFeedbackMessage(id);
                };
            });
        }
    }

    if (window.lucide) window.lucide.createIcons();
}

async function submitFeedbackReply(id, replyText) {
    if (isFirebaseActive) {
        try {
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await updateDoc(doc(db, "feedback", id), {
                reply: replyText,
                status: "resolved"
            });
        } catch (e) {
            console.error(e);
        }
    } else {
        // Mock reply
        const feedback = JSON.parse(localStorage.getItem("ece-mock-feedback")) || [];
        const index = feedback.findIndex(f => f.id === id);
        if (index !== -1) {
            feedback[index].reply = replyText;
            feedback[index].status = "resolved";
            localStorage.setItem("ece-mock-feedback", JSON.stringify(feedback));
        }
    }

    await logAdminAction(`Feedback Resolved`, `admin`, `Sent reply response to feedback message ${id}`);
    window.AdminState.showToast("Student feedback resolved and reply dispatched.", "success");
    await loadFeedbackGrid();
}

async function deleteFeedbackMessage(id) {
    if (confirm("Purge this feedback message from the system archives?")) {
        if (isFirebaseActive) {
            try {
                const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await deleteDoc(doc(db, "feedback", id));
            } catch (e) {
                console.error(e);
            }
        } else {
            const feedback = JSON.parse(localStorage.getItem("ece-mock-feedback")) || [];
            const filtered = feedback.filter(f => f.id !== id);
            localStorage.setItem("ece-mock-feedback", JSON.stringify(filtered));
        }
        await logAdminAction("Feedback Purged", "admin", `Purged student feedback message ID: ${id}`);
        window.AdminState.showToast("Feedback record deleted.", "info");
        await loadFeedbackGrid();
    }
}
