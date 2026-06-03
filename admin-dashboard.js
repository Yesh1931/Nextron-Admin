/**
 * Nextron - Admin Dashboard Panel
 * Computes statistical summaries and displays recent activity logs.
 */

import { db, isFirebaseActive } from "../js/firebase-config.js";

// Renders the main dashboard overview page
export async function render(mountPoint, tabName) {
    if (tabName === "logs") {
        await renderLogsView(mountPoint);
        return;
    }

    mountPoint.innerHTML = `
        <section class="mb-20">
            <h2 class="m-0">System Command Center</h2>
            <p style="margin: 4px 0 0 0;">Real-time overview of ECE learning ecosystem telemetry.</p>
        </section>

        <!-- Stats Grid Cards -->
        <div class="stats-grid" id="dashboard-stats-grid">
            <div class="stats-card"><div class="stats-label">Loading...</div></div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; align-items: start;">
            <!-- Activity Logs Panel -->
            <div class="admin-card" style="margin-bottom:0;">
                <div class="flex-between mb-20">
                    <h3 class="m-0">Live Activity Feed</h3>
                    <button class="btn btn-secondary" id="btn-dashboard-logs-go" style="padding: 6px 12px; font-size: 0.8rem;">View All Logs</button>
                </div>
                <div class="table-wrap">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Operator/User</th>
                                <th>Action Category</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody id="dashboard-logs-tbody">
                            <tr><td colspan="4" style="text-align:center;">Loading logs...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Quick Action Command Panel -->
            <div class="admin-card" style="margin-bottom:0;">
                <h3 class="mb-20">Quick Terminals</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <button class="btn btn-secondary w-100" onclick="document.querySelector('[data-tab=\\'content\\']').click()" style="justify-content:flex-start; text-align:left;">
                        <i data-lucide="plus-circle" style="width:16px; height:16px; color:var(--accent-secondary);"></i> Create CMS Topic
                    </button>
                    <button class="btn btn-secondary w-100" onclick="document.querySelector('[data-tab=\\'quizzes\\']').click()" style="justify-content:flex-start; text-align:left;">
                        <i data-lucide="plus" style="width:16px; height:16px; color:var(--accent-purple);"></i> Construct New Quiz
                    </button>
                    <button class="btn btn-secondary w-100" onclick="document.querySelector('[data-tab=\\'settings\\']').click()" style="justify-content:flex-start; text-align:left;">
                        <i data-lucide="megaphone" style="width:16px; height:16px; color:var(--warning);"></i> Post Notice Board
                    </button>
                    <button class="btn btn-secondary w-100" onclick="document.querySelector('[data-tab=\\'settings\\']').click()" style="justify-content:flex-start; text-align:left;">
                        <i data-lucide="shield-alert" style="width:16px; height:16px; color:var(--error);"></i> Toggle Maintenance Mode
                    </button>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind full logs view redirect
    document.getElementById("btn-dashboard-logs-go").onclick = () => {
        const sidebarLinks = document.querySelectorAll(".sidebar-link");
        sidebarLinks.forEach(l => l.classList.remove("active"));
        document.querySelector("[data-tab='logs']").classList.add("active");
        renderLogsView(mountPoint);
    };

    // Load Live Telemetry Data
    await loadDashboardData();
}

async function loadDashboardData() {
    const statsGrid = document.getElementById("dashboard-stats-grid");
    const logsTbody = document.getElementById("dashboard-logs-tbody");
    
    let stats = {
        totalUsers: 0,
        activeUsers: 0,
        newUsersWeek: 0,
        totalSubjects: 12,
        totalConcepts: 12,
        totalQuizzes: 0,
        quizAttempts: 0,
        averageQuizScore: 0,
        totalSimulations: 0,
        pendingFeedback: 0,
        totalAnnouncements: 0
    };
    
    let activityLogs = [];

    if (isFirebaseActive) {
        try {
            const { collection, getDocs, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // 1. Fetch Users
            const usersSnap = await getDocs(collection(db, "users"));
            stats.totalUsers = usersSnap.size;
            
            let oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            usersSnap.forEach(doc => {
                const data = doc.data();
                if (data.lastLogin && data.lastLogin.toMillis() > (Date.now() - 24 * 60 * 60 * 1000)) {
                    stats.activeUsers++;
                }
                if (data.createdAt && data.createdAt.toMillis() > oneWeekAgo) {
                    stats.newUsersWeek++;
                }
            });

            // 2. Fetch CMS
            const conceptsSnap = await getDocs(collection(db, "concepts"));
            stats.totalConcepts = conceptsSnap.size || 12;

            // 3. Fetch Quizzes & Quiz Attempts
            const quizzesSnap = await getDocs(collection(db, "quizzes"));
            stats.totalQuizzes = quizzesSnap.size;

            const attemptsSnap = await getDocs(collection(db, "quizAttempts"));
            stats.quizAttempts = attemptsSnap.size;
            
            let totalScore = 0;
            attemptsSnap.forEach(doc => {
                totalScore += doc.data().score || 0;
            });
            stats.averageQuizScore = stats.quizAttempts > 0 ? Math.round(totalScore / stats.quizAttempts) : 0;

            // 4. Fetch Simulations
            const simsSnap = await getDocs(collection(db, "simulations"));
            stats.totalSimulations = simsSnap.size;

            // 5. Fetch Feedback
            const feedbackSnap = await getDocs(collection(db, "feedback"));
            feedbackSnap.forEach(doc => {
                if (doc.data().status !== "resolved") stats.pendingFeedback++;
            });

            // 6. Fetch Announcements
            const annSnap = await getDocs(collection(db, "announcements"));
            stats.totalAnnouncements = annSnap.size;

            // 7. Fetch Activity Logs
            const logsQuery = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"), limit(10));
            const logsSnap = await getDocs(logsQuery);
            logsSnap.forEach(doc => {
                activityLogs.push(doc.data());
            });

        } catch (err) {
            console.error("Error loading stats from Firestore: ", err);
        }
    } else {
        // --- Local Storage Mock Loading ---
        try {
            const users = JSON.parse(localStorage.getItem("ece-explorer-users")) || [];
            stats.totalUsers = users.length + 3; // Mocks included
            stats.activeUsers = Math.max(1, Math.round(stats.totalUsers * 0.45));
            stats.newUsersWeek = Math.max(1, Math.round(stats.totalUsers * 0.15));

            // CMS
            stats.totalConcepts = 12;

            // Quizzes & Attempts
            stats.totalQuizzes = 12;
            const completed = JSON.parse(localStorage.getItem("ece-student-quizzes")) || {};
            stats.quizAttempts = Object.keys(completed).length || 5;
            let sum = 0;
            Object.values(completed).forEach(v => sum += v);
            stats.averageQuizScore = stats.quizAttempts > 0 ? Math.round(sum / stats.quizAttempts) : 75;

            // Feedback
            const feed = JSON.parse(localStorage.getItem("ece-mock-feedback")) || [];
            stats.pendingFeedback = feed.filter(f => f.status !== "resolved").length;

            // Announcements
            const anns = JSON.parse(localStorage.getItem("ece-mock-announcements")) || [];
            stats.totalAnnouncements = anns.length || 2;

            // Sims
            stats.totalSimulations = 5;

            // Logs
            activityLogs = JSON.parse(localStorage.getItem("ece-mock-logs")) || [];
            if (activityLogs.length === 0) {
                // Seed basic mock logs
                activityLogs = [
                    { action: "User Login", user: "scholar@college.edu", timestamp: new Date(Date.now() - 300000).toISOString(), details: "Authorized B.Tech student session" },
                    { action: "Quiz Attempt", user: "scholar@college.edu", timestamp: new Date(Date.now() - 600000).toISOString(), details: "Scored 90% on PN Junction Diode Lab" },
                    { action: "Admin Login", user: "admin@nextron.edu", timestamp: new Date(Date.now() - 1200000).toISOString(), details: "Operator decryption key verified" }
                ];
                localStorage.setItem("ece-mock-logs", JSON.stringify(activityLogs));
            }
        } catch (e) {
            console.error("Local mock stats error: ", e);
        }
    }

    // Populate Cards in DOM
    if (statsGrid) {
        const items = [
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active Users", value: stats.activeUsers },
            { label: "New Users This Week", value: stats.newUsersWeek },
            { label: "Total Subjects", value: stats.totalSubjects },
            { label: "Total Concepts", value: stats.totalConcepts },
            { label: "Total Quizzes", value: stats.totalQuizzes },
            { label: "Quiz Attempts", value: stats.quizAttempts },
            { label: "Average Quiz Score", value: `${stats.averageQuizScore}%` },
            { label: "Total Simulations", value: stats.totalSimulations },
            { label: "Pending Feedback", value: stats.pendingFeedback },
            { label: "Total Announcements", value: stats.totalAnnouncements }
        ];

        statsGrid.innerHTML = items.map(item => `
            <div class="stats-card">
                <div class="stats-label">${item.label}</div>
                <div class="stats-value">${item.value}</div>
            </div>
        `).join("");
    }

    // Populate Logs in DOM
    if (logsTbody) {
        if (activityLogs.length === 0) {
            logsTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No activity logged yet.</td></tr>';
        } else {
            logsTbody.innerHTML = activityLogs.slice(0, 10).map(log => {
                const date = new Date(log.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                return `
                    <tr>
                        <td style="font-family: monospace; font-size: 0.85rem;">${timeStr}</td>
                        <td style="color:#fff; font-weight:600;">${log.user}</td>
                        <td><span class="badge ${getLogBadgeClass(log.action)}">${log.action}</span></td>
                        <td style="font-size:0.88rem;">${log.details}</td>
                    </tr>
                `;
            }).join("");
        }
    }
}

// Full page Activity Logs rendering
export async function renderLogsView(mountPoint) {
    mountPoint.innerHTML = `
        <section class="mb-20 flex-between">
            <div>
                <h2 class="m-0">Activity Audits Log</h2>
                <p style="margin: 4px 0 0 0;">Historical registry of all database operations, quiz completions, and admin events.</p>
            </div>
            <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=\\'dashboard\\']').click()">Back to Dashboard</button>
        </section>

        <div class="admin-card">
            <div class="table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Date / Time</th>
                            <th>Identity</th>
                            <th>Action Action</th>
                            <th>Audit Trail Details</th>
                        </tr>
                    </thead>
                    <tbody id="logs-view-tbody">
                        <tr><td colspan="4" style="text-align:center;"><div class="spinner"></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const logsTbody = document.getElementById("logs-view-tbody");
    let logs = [];

    if (isFirebaseActive) {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const logsSnap = await getDocs(query(collection(db, "activityLogs"), orderBy("timestamp", "desc")));
            logsSnap.forEach(doc => logs.push(doc.data()));
        } catch (e) {
            console.error(e);
        }
    } else {
        logs = JSON.parse(localStorage.getItem("ece-mock-logs")) || [];
    }

    if (logsTbody) {
        if (logs.length === 0) {
            logsTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No historical audits found.</td></tr>';
        } else {
            logsTbody.innerHTML = logs.map(log => {
                const date = new Date(log.timestamp);
                const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return `
                    <tr>
                        <td style="font-family: monospace; font-size: 0.85rem;">${dateStr}</td>
                        <td style="color:#fff; font-weight:600;">${log.user}</td>
                        <td><span class="badge ${getLogBadgeClass(log.action)}">${log.action}</span></td>
                        <td style="font-size:0.88rem;">${log.details}</td>
                    </tr>
                `;
            }).join("");
        }
    }
}

function getLogBadgeClass(action) {
    const act = action.toLowerCase();
    if (act.includes("login") || act.includes("auth")) return "badge-success";
    if (act.includes("create") || act.includes("add")) return "badge-info";
    if (act.includes("update") || act.includes("edit")) return "badge-warning";
    if (act.includes("delete") || act.includes("disable") || act.includes("remove")) return "badge-error";
    return "badge-info";
}

// Audit logger helper for other panels to invoke
export async function logAdminAction(action, user, details) {
    const timestamp = new Date().toISOString();
    
    if (isFirebaseActive) {
        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await addDoc(collection(db, "activityLogs"), {
                action,
                user,
                timestamp,
                details
            });
        } catch (err) {
            console.error("Firestore logging failed: ", err);
        }
    } else {
        try {
            const logs = JSON.parse(localStorage.getItem("ece-mock-logs")) || [];
            logs.unshift({ action, user, timestamp, details });
            localStorage.setItem("ece-mock-logs", JSON.stringify(logs));
        } catch (e) {}
    }
}
