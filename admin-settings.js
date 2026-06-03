/**
 * Nextron - Settings & Announcements Manager Panel
 * Handles site configurations, maintenance toggles, and notices.
 */

import { db, isFirebaseActive } from "./firebase.js";
import { logAdminAction } from "./admin-dashboard.js";

// Main render entrypoint
export async function render(mountPoint, tabName) {
    if (tabName === "announcements") {
        await renderAnnouncementsPanel(mountPoint);
        return;
    }

    mountPoint.innerHTML = `
        <section class="mb-20">
            <h2 class="m-0">Global Website Settings</h2>
            <p style="margin: 4px 0 0 0;">Configure platform name, banners, support channels, default themes, and toggle Maintenance Mode.</p>
        </section>

        <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:24px; align-items:start;">
            
            <!-- General Settings Form -->
            <div class="admin-card">
                <h3 class="mb-20">Platform Customization</h3>
                <form id="settings-general-form">
                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">Website Name</label>
                            <input type="text" class="form-input" id="set-site-name" required placeholder="e.g. Nextron ECE Platform">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Logo Brand Text</label>
                            <input type="text" class="form-input" id="set-logo-text" required placeholder="Nextron">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Homepage Welcome Banner Message</label>
                        <input type="text" class="form-input" id="set-banner-msg" placeholder="Welcome to Nextron visual simulators workspace...">
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label">Contact / Support Email</label>
                            <input type="email" class="form-input" id="set-contact-email" required placeholder="support@nextron.edu">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Default Core Theme</label>
                            <select class="form-select" id="set-default-theme">
                                <option value="dark">Dark Theme (Recommended)</option>
                                <option value="light">Light Theme</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Footer Copyright Statement</label>
                        <input type="text" class="form-input" id="set-footer-text" required placeholder="© 2026 Nextron. All rights reserved.">
                    </div>

                    <h4 style="color:#fff; margin-top:20px; margin-bottom:12px; border-bottom:1px dashed var(--border-admin); padding-bottom:6px;">Social Reference Channels</h4>
                    <div class="grid-3">
                        <div class="form-group">
                            <label class="form-label">GitHub</label>
                            <input type="url" class="form-input" id="set-git" placeholder="https://github.com/...">
                        </div>
                        <div class="form-group">
                            <label class="form-label">LinkedIn</label>
                            <input type="url" class="form-input" id="set-linkedin" placeholder="https://linkedin.com/in/...">
                        </div>
                        <div class="form-group">
                            <label class="form-label">YouTube</label>
                            <input type="url" class="form-input" id="set-youtube" placeholder="https://youtube.com/...">
                        </div>
                    </div>

                    <div style="text-align:right; margin-top:20px; border-top:1px solid var(--border-admin); padding-top:16px;">
                        <button type="submit" class="btn btn-primary" style="border:none;">Save Settings</button>
                    </div>
                </form>
            </div>

            <!-- Maintenance Mode Panel -->
            <div class="admin-card" style="border-color: rgba(239,68,68,0.25);">
                <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
                    <span style="font-size:2rem;">⚠️</span>
                    <h3 class="m-0" style="color:var(--error);">Maintenance Portal</h3>
                </div>
                <p style="font-size:0.9rem; line-height:1.4; margin-bottom:20px;">Activating Maintenance Mode blocks non-administrative users from exploring laboratories, mounting a lock screen stating <strong>"Website is currently under maintenance."</strong> Administrators can continue to log in and manage resources.</p>
                
                <div class="form-group flex-between" style="background:rgba(239,68,68,0.06); padding:16px; border-radius:8px; border:1px solid rgba(239,68,68,0.2);">
                    <div>
                        <strong style="color:#fff; font-size:0.95rem;">Maintenance Overrides</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);" id="maintenance-status-label">Offline Lockout: Disabled</div>
                    </div>
                    <label style="position:relative; display:inline-block; width:44px; height:24px;">
                        <input type="checkbox" id="set-maintenance-toggle" style="opacity:0; width:0; height:0;">
                        <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--bg-admin-input); border:1px solid var(--border-admin); border-radius:34px; transition:0.3s;" id="maintenance-slider"></span>
                    </label>
                </div>
            </div>

        </div>
    `;

    // Bind Maintenance Toggle event
    const maintenanceToggle = document.getElementById("set-maintenance-toggle");
    const maintenanceSlider = document.getElementById("maintenance-slider");
    const statusLabel = document.getElementById("maintenance-status-label");

    const updateSliderColor = () => {
        const active = maintenanceToggle.checked;
        maintenanceSlider.style.backgroundColor = active ? "var(--error)" : "var(--bg-admin-input)";
        statusLabel.textContent = active ? "Offline Lockout: ENABLED" : "Offline Lockout: Disabled";
        statusLabel.style.color = active ? "var(--error)" : "var(--text-muted)";
    };

    maintenanceToggle.onchange = async () => {
        updateSliderColor();
        await saveMaintenanceMode(maintenanceToggle.checked);
    };

    // Load configurations
    await loadGlobalSettings(maintenanceToggle, updateSliderColor);

    // Bind settings form submission
    const form = document.getElementById("settings-general-form");
    form.onsubmit = async (e) => {
        e.preventDefault();
        const settingsObj = {
            websiteName: document.getElementById("set-site-name").value.trim(),
            logoText: document.getElementById("set-logo-text").value.trim(),
            bannerMessage: document.getElementById("set-banner-msg").value.trim(),
            contactEmail: document.getElementById("set-contact-email").value.trim(),
            defaultTheme: document.getElementById("set-default-theme").value,
            footerText: document.getElementById("set-footer-text").value.trim(),
            githubLink: document.getElementById("set-git").value.trim(),
            linkedinLink: document.getElementById("set-linkedin").value.trim(),
            youtubeLink: document.getElementById("set-youtube").value.trim(),
            maintenanceMode: maintenanceToggle.checked
        };
        await saveGlobalSettings(settingsObj);
    };
}

// Fetch general website configurations, seeding defaults if empty
export async function fetchSettingsData() {
    let settings = {
        websiteName: "Nextron ECE",
        logoText: "Nextron",
        bannerMessage: "Welcome to Nextron visual simulators workspace",
        contactEmail: "support@nextron.edu",
        defaultTheme: "dark",
        footerText: "© 2026 Nextron. All rights reserved.",
        githubLink: "",
        linkedinLink: "",
        youtubeLink: "",
        maintenanceMode: false
    };

    if (isFirebaseActive) {
        try {
            const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const docRef = doc(db, "settings", "globalConfig");
            const snap = await getDoc(docRef);
            
            if (snap.exists()) {
                settings = snap.data();
            } else {
                console.log("Seeding default settings configuration to Firestore...");
                await setDoc(docRef, settings);
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        try {
            const saved = JSON.parse(localStorage.getItem("ece-mock-settings-config"));
            if (saved) settings = saved;
            else localStorage.setItem("ece-mock-settings-config", JSON.stringify(settings));
        } catch (e) {}
    }
    return settings;
}

async function loadGlobalSettings(toggleInput, updateSliderCallback) {
    const config = await fetchSettingsData();
    
    document.getElementById("set-site-name").value = config.websiteName;
    document.getElementById("set-logo-text").value = config.logoText;
    document.getElementById("set-banner-msg").value = config.bannerMessage || "";
    document.getElementById("set-contact-email").value = config.contactEmail;
    document.getElementById("set-default-theme").value = config.defaultTheme || "dark";
    document.getElementById("set-footer-text").value = config.footerText;
    document.getElementById("set-git").value = config.githubLink || "";
    document.getElementById("set-linkedin").value = config.linkedinLink || "";
    document.getElementById("set-youtube").value = config.youtubeLink || "";
    
    toggleInput.checked = !!config.maintenanceMode;
    updateSliderCallback();
}

async function saveGlobalSettings(settingsObj) {
    if (isFirebaseActive) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(db, "settings", "globalConfig"), settingsObj);
        } catch (e) {
            console.error(e);
        }
    } else {
        localStorage.setItem("ece-mock-settings-config", JSON.stringify(settingsObj));
    }
    await logAdminAction("Settings Modified", "admin", "Saved global website configurations");
    window.AdminState.showToast("Global website settings updated successfully.", "success");
}

async function saveMaintenanceMode(isEnabled) {
    const config = await fetchSettingsData();
    config.maintenanceMode = isEnabled;
    
    if (isFirebaseActive) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(db, "settings", "globalConfig"), config);
        } catch (e) {
            console.error(e);
        }
    } else {
        localStorage.setItem("ece-mock-settings-config", JSON.stringify(config));
    }

    const stateStr = isEnabled ? "ENABLED (Platform Lockdown)" : "Disabled (Nominal Operations)";
    await logAdminAction("Maintenance State Shifted", "admin", `Set maintenance mode to: ${stateStr}`);
    window.AdminState.showToast(`Maintenance Mode successfully ${isEnabled ? 'Activated' : 'Deactivated'}.`, isEnabled ? "warning" : "success");
}

// ─── ANNOUNCEMENTS SYSTEM NOTICE BOARD ────────────────────────────────────────
async function renderAnnouncementsPanel(mountPoint) {
    mountPoint.innerHTML = `
        <section class="mb-20 flex-between">
            <div>
                <h2 class="m-0">Announcements Notice Board</h2>
                <p style="margin: 4px 0 0 0;">Broadcast notices, schedule alert items, and pin priority notices for student dashboards.</p>
            </div>
            <button class="btn btn-primary" id="btn-ann-create"><i data-lucide="plus-circle"></i> Post Announcement</button>
        </section>

        <!-- Active notices directory -->
        <div class="admin-card">
            <h3 class="mb-20">Active Broadcast Feed</h3>
            <div class="table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Notice Title & Message</th>
                            <th>Priority</th>
                            <th>Release Date</th>
                            <th>Expiration</th>
                            <th>Pins</th>
                            <th style="text-align:right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="anns-directory-tbody">
                        <tr><td colspan="6" style="text-align:center;"><div class="spinner"></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind actions
    document.getElementById("btn-ann-create").onclick = () => openAnnouncementModal(null);

    // Initial load
    await loadAnnouncementsList();
}

async function fetchAnnouncementsData() {
    let anns = [];
    if (isFirebaseActive) {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "announcements"));
            snapshot.forEach(doc => anns.push({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error(e);
        }
    } else {
        try {
            anns = JSON.parse(localStorage.getItem("ece-mock-announcements")) || [];
            if (anns.length === 0) {
                anns = [
                    { id: "mock-ann-1", title: "Semester Lab Examinations Scheduled", message: "All ECE students must complete pre-requisite simulator chapters and attain 80% score by June 15th.", priority: "high", publishDate: new Date().toISOString().slice(0,10), expiryDate: "2026-06-15", pinned: true },
                    { id: "mock-ann-2", title: "MOSFET Simulator Optimization Complete", message: "Fine tuning adjustments applied to depletion region modeling algorithms.", priority: "medium", publishDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().slice(0,10), expiryDate: "2026-06-30", pinned: false }
                ];
                localStorage.setItem("ece-mock-announcements", JSON.stringify(anns));
            }
        } catch (e) {}
    }
    // Pinned notices first, then date descending
    return anns.sort((a,b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.publishDate) - new Date(a.publishDate);
    });
}

async function loadAnnouncementsList() {
    const tbody = document.getElementById("anns-directory-tbody");
    if (!tbody) return;

    const anns = await fetchAnnouncementsData();

    tbody.innerHTML = anns.map(a => {
        const pub = a.publishDate ? new Date(a.publishDate).toLocaleDateString() : "Immediate";
        const exp = a.expiryDate ? new Date(a.expiryDate).toLocaleDateString() : "Infinite";

        let priorityBadge = "badge-info";
        if (a.priority === "high") priorityBadge = "badge-error";
        if (a.priority === "medium") priorityBadge = "badge-warning";

        return `
            <tr>
                <td>
                    <div style="font-weight:600; color:#fff;">${a.title}</div>
                    <div style="font-size:0.82rem; color:var(--text-secondary); max-width:440px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${a.message}</div>
                </td>
                <td><span class="badge ${priorityBadge}">${a.priority}</span></td>
                <td>${pub}</td>
                <td>${exp}</td>
                <td>${a.pinned ? '📌 Pinned' : '-'}</td>
                <td>
                    <div style="display:flex; gap:6px; justify-content:flex-end;">
                        <button class="btn btn-secondary btn-ann-edit" data-id="${a.id}" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="edit" style="width:12px; height:12px;"></i> Edit</button>
                        <button class="btn btn-secondary btn-ann-delete text-error" data-id="${a.id}" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="trash" style="width:12px; height:12px;"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();

    // Bind actions
    tbody.querySelectorAll(".btn-ann-edit").forEach(btn => {
        btn.onclick = () => openAnnouncementModal(btn.getAttribute("data-id"));
    });
    tbody.querySelectorAll(".btn-ann-delete").forEach(btn => {
        btn.onclick = () => deleteAnnouncementRecord(btn.getAttribute("data-id"));
    });
}

function openAnnouncementModal(annId = null) {
    fetchAnnouncementsData().then(anns => {
        let ann = null;
        if (annId) {
            ann = anns.find(a => a.id === annId);
        } else {
            ann = {
                title: "",
                message: "",
                priority: "medium",
                publishDate: new Date().toISOString().slice(0, 10),
                expiryDate: "",
                pinned: false
            };
        }

        const html = `
            <form id="ann-edit-form" style="text-align:left;">
                <div class="form-group">
                    <label class="form-label">Notice Title</label>
                    <input type="text" class="form-input" id="ann-title" value="${ann.title}" required placeholder="e.g. Schedule for Lab Demonstrations">
                </div>
                <div class="form-group">
                    <label class="form-label">Broadcast Message Content</label>
                    <textarea class="form-textarea" id="ann-msg" style="height:90px;" required placeholder="Detailed message statement to push to notice board...">${ann.message}</textarea>
                </div>
                <div class="grid-3">
                    <div class="form-group">
                        <label class="form-label">Alert Priority</label>
                        <select class="form-select" id="ann-priority">
                            <option value="low" ${ann.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${ann.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${ann.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Publish Date</label>
                        <input type="date" class="form-input" id="ann-pub" value="${ann.publishDate}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Expiration Date</label>
                        <input type="date" class="form-input" id="ann-exp" value="${ann.expiryDate || ''}">
                    </div>
                </div>

                <div class="form-group flex-between" style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-admin);">
                    <div>
                        <strong style="color:#fff; font-size:0.9rem;">Pin Announcement</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Pinned alerts stay at the top of notice boards.</div>
                    </div>
                    <label style="position:relative; display:inline-block; width:44px; height:24px;">
                        <input type="checkbox" id="ann-pinned" ${ann.pinned ? 'checked' : ''} style="opacity:0; width:0; height:0;">
                        <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--bg-admin-input); border:1px solid var(--border-admin); border-radius:34px; transition:0.3s;" id="ann-pin-slider"></span>
                    </label>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid var(--border-admin); padding-top:16px;">
                    <button type="button" class="btn btn-secondary" onclick="window.AdminState.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="border:none;">Save Notice</button>
                </div>
            </form>
        `;

        window.AdminState.openModal(html);
        document.getElementById("modal-host-title").innerHTML = `<i data-lucide="megaphone" style="width:16px; height:16px; vertical-align:middle; margin-right:4px;"></i> Edit Announcement Notice`;

        // Toggle slider color
        const pinCheckbox = document.getElementById("ann-pinned");
        const pinSlider = document.getElementById("ann-pin-slider");
        const applySliderColor = () => {
            pinSlider.style.backgroundColor = pinCheckbox.checked ? "var(--success)" : "var(--bg-admin-input)";
        };
        applySliderColor();
        pinCheckbox.onchange = applySliderColor;

        // Submit form
        document.getElementById("ann-edit-form").onsubmit = async (e) => {
            e.preventDefault();
            const id = annId || "ann-" + Math.random().toString(36).substr(2, 9);
            const saveAnn = {
                id: id,
                title: document.getElementById("ann-title").value.trim(),
                message: document.getElementById("ann-msg").value.trim(),
                priority: document.getElementById("ann-priority").value,
                publishDate: document.getElementById("ann-pub").value,
                expiryDate: document.getElementById("ann-exp").value,
                pinned: pinCheckbox.checked
            };

            await saveAnnouncementRecord(saveAnn);
            window.AdminState.closeModal();
            await loadAnnouncementsList();
        };
    });
}

async function saveAnnouncementRecord(annObj) {
    if (isFirebaseActive) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(db, "announcements", annObj.id), annObj);
        } catch (e) {
            console.error(e);
        }
    } else {
        const anns = await fetchAnnouncementsData();
        const index = anns.findIndex(a => a.id === annObj.id);
        if (index !== -1) {
            anns[index] = annObj;
        } else {
            anns.push(annObj);
        }
        localStorage.setItem("ece-mock-announcements", JSON.stringify(anns));
    }
    await logAdminAction("Announcement Notice Saved", "admin", `Saved announcement broadcast: ${annObj.title}`);
    window.AdminState.showToast(`Notice board updated: ${annObj.title}`, "success");
}

async function deleteAnnouncementRecord(id) {
    if (confirm("Delete this announcement broadcast? It will instantly disappear from student notice boards.")) {
        if (isFirebaseActive) {
            try {
                const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await deleteDoc(doc(db, "announcements", id));
            } catch (e) {
                console.error(e);
            }
        } else {
            const anns = await fetchAnnouncementsData();
            const filtered = anns.filter(a => a.id !== id);
            localStorage.setItem("ece-mock-announcements", JSON.stringify(filtered));
        }
        await logAdminAction("Announcement Deleted", "admin", `Deleted announcement notice ID: ${id}`);
        window.AdminState.showToast("Announcement notice deleted.", "info");
        await loadAnnouncementsList();
    }
}
