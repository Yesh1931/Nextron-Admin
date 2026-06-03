/**
 * Nextron - Simulation Management Panel
 * Manages simulation assets, categories, enablement toggles, and usage statistics.
 */

import { db, isFirebaseActive } from "../js/firebase-config.js";
import { logAdminAction } from "./admin-dashboard.js";

// Main render entrypoint
export async function render(mountPoint, tabName, preselectedSimId = null) {
    mountPoint.innerHTML = `
        <section class="mb-20 flex-between">
            <div>
                <h2 class="m-0">Virtual Simulator Registry</h2>
                <p style="margin: 4px 0 0 0;">Manage interactive laboratory simulators, category classifications, and track student usage statistics.</p>
            </div>
            <button class="btn btn-primary" id="btn-sim-create"><i data-lucide="plus-circle"></i> Register Simulator</button>
        </section>

        <!-- Stats Overview Cards -->
        <div class="grid-3 mb-20">
            <div class="stats-card">
                <div class="stats-label">Registered Simulators</div>
                <div class="stats-value" id="stats-sim-total">0</div>
            </div>
            <div class="stats-card">
                <div class="stats-label">Active Simulators</div>
                <div class="stats-value" id="stats-sim-active">0</div>
            </div>
            <div class="stats-card">
                <div class="stats-label">Cumulative Simulator Launches</div>
                <div class="stats-value" id="stats-sim-launches">0</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
            <!-- Simulators directory -->
            <div class="admin-card">
                <h3 class="mb-20">Simulator Directories</h3>
                <div class="table-wrap">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Simulator</th>
                                <th>Category</th>
                                <th>Launches</th>
                                <th>State</th>
                                <th style="text-align:right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="sims-directory-tbody">
                            <tr><td colspan="5" style="text-align:center;">Querying registry registers...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Editor Pane -->
            <div class="admin-card" id="sim-editor-pane">
                <div class="flex-center" style="height: 300px; flex-direction:column; color:var(--text-muted);">
                    <i data-lucide="sliders" style="width: 48px; height: 48px; margin-bottom:16px;"></i>
                    <p>Select a simulator to customize parameters or track metrics.</p>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind actions
    document.getElementById("btn-sim-create").onclick = () => renderSimEditorForm(null);

    // Initial load
    await loadSimulationsPanel(preselectedSimId);
}

// Fetches simulations, seeding defaults if empty
export async function fetchSimulationsData() {
    let sims = [];
    if (isFirebaseActive) {
        try {
            const { collection, getDocs, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "simulations"));
            
            if (snapshot.empty) {
                console.log("Seeding default simulations configurations to Firestore...");
                const defaultSims = [
                    { id: "logic-gate-sim", title: "Logic Gate Simulator", category: "Digital Core", desc: "Interactive logic gate truth table visualizer and timing diagram tracer.", enabled: true, launches: 142, route: "#/sandbox" },
                    { id: "mosfet-sim", title: "MOSFET Simulator", category: "Active Devices", desc: "Interactive depletion and enhancement MOSFET I-V characteristic sweep plotter.", enabled: true, launches: 98, route: "#/concept/transistor" },
                    { id: "op-amp-sim", title: "Op-Amp Simulator", category: "Analog Circuits", desc: "Virtual operational amplifier laboratory: Inverting, non-inverting, and comparator tuning.", enabled: true, launches: 73, route: "#/circuit-lab" },
                    { id: "dsp-signal-sim", title: "DSP Signal Simulator", category: "Signal Processing", desc: "Digital signal reconstruction, sampling rates, quantization step visualizer, and FFT tracer.", enabled: true, launches: 110, route: "#/concept/dsp" },
                    { id: "network-theorem-sim", title: "Network Theorem Calculator", category: "Circuit Analysis", desc: "Live nodal analysis, mesh loops, and Thevenin equivalent circuit layout compiler.", enabled: true, launches: 54, route: "#/concept/networks" }
                ];

                for (const sim of defaultSims) {
                    await setDoc(doc(db, "simulations", sim.id), sim);
                }
                const freshSnapshot = await getDocs(collection(db, "simulations"));
                freshSnapshot.forEach(doc => sims.push({ id: doc.id, ...doc.data() }));
            } else {
                snapshot.forEach(doc => sims.push({ id: doc.id, ...doc.data() }));
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        // Local Mock Data
        try {
            const saved = JSON.parse(localStorage.getItem("ece-mock-sims"));
            if (saved) {
                sims = saved;
            } else {
                sims = [
                    { id: "logic-gate-sim", title: "Logic Gate Simulator", category: "Digital Core", desc: "Interactive logic gate truth table visualizer and timing diagram tracer.", enabled: true, launches: 142, route: "#/sandbox" },
                    { id: "mosfet-sim", title: "MOSFET Simulator", category: "Active Devices", desc: "Interactive depletion and enhancement MOSFET I-V characteristic sweep plotter.", enabled: true, launches: 98, route: "#/concept/transistor" },
                    { id: "op-amp-sim", title: "Op-Amp Simulator", category: "Analog Circuits", desc: "Virtual operational amplifier laboratory: Inverting, non-inverting, and comparator tuning.", enabled: true, launches: 73, route: "#/circuit-lab" },
                    { id: "dsp-signal-sim", title: "DSP Signal Simulator", category: "Signal Processing", desc: "Digital signal reconstruction, sampling rates, quantization step visualizer, and FFT tracer.", enabled: true, launches: 110, route: "#/concept/dsp" },
                    { id: "network-theorem-sim", title: "Network Theorem Calculator", category: "Circuit Analysis", desc: "Live nodal analysis, mesh loops, and Thevenin equivalent circuit layout compiler.", enabled: true, launches: 54, route: "#/concept/networks" }
                ];
                localStorage.setItem("ece-mock-sims", JSON.stringify(sims));
            }
        } catch (e) {}
    }
    return sims;
}

async function loadSimulationsPanel(preselectId = null) {
    const tbody = document.getElementById("sims-directory-tbody");
    if (!tbody) return;

    const sims = await fetchSimulationsData();

    // Compute sums for stats
    let totalSims = sims.length;
    let activeSims = sims.filter(s => s.enabled).length;
    let totalLaunches = sims.reduce((acc, s) => acc + (s.launches || 0), 0);

    document.getElementById("stats-sim-total").textContent = totalSims;
    document.getElementById("stats-sim-active").textContent = activeSims;
    document.getElementById("stats-sim-launches").textContent = totalLaunches;

    tbody.innerHTML = sims.map(s => `
        <tr>
            <td>
                <div style="font-weight:600; color:#fff;">${s.title}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${s.id}</div>
            </td>
            <td>${s.category}</td>
            <td style="font-family:monospace;">${s.launches || 0}</td>
            <td>${s.enabled 
                ? `<span class="badge badge-success">Enabled</span>`
                : `<span class="badge badge-error">Disabled</span>`
            }</td>
            <td>
                <button class="btn btn-secondary btn-sim-edit" data-id="${s.id}" style="padding:4px 8px; font-size:0.75rem;"><i data-lucide="edit-2" style="width:12px; height:12px;"></i> Customize</button>
            </td>
        </tr>
    `).join("");

    if (window.lucide) window.lucide.createIcons();

    // Bind click events
    tbody.querySelectorAll(".btn-sim-edit").forEach(btn => {
        btn.onclick = () => renderSimEditorForm(btn.getAttribute("data-id"));
    });

    if (preselectId) {
        renderSimEditorForm(preselectId);
    }
}

async function renderSimEditorForm(simId = null) {
    const pane = document.getElementById("sim-editor-pane");
    if (!pane) return;

    pane.innerHTML = `<div class="flex-center" style="height:250px;"><div class="spinner"></div></div>`;

    const sims = await fetchSimulationsData();
    let sim = null;

    if (simId) {
        sim = sims.find(s => s.id === simId);
    } else {
        sim = {
            id: "",
            title: "",
            category: "Digital Core",
            desc: "",
            enabled: false,
            launches: 0,
            route: ""
        };
    }

    pane.innerHTML = `
        <form id="sim-editor-form" style="text-align:left;">
            <div class="flex-between mb-20" style="border-bottom:1px solid var(--border-admin); padding-bottom:12px;">
                <h4 style="color:#fff; margin:0;">${simId ? 'Customize Simulator' : 'Register Simulator'}</h4>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="btn btn-secondary" id="btn-sim-editor-cancel" style="padding:6px 12px; font-size:0.8rem;">Cancel</button>
                    ${simId ? `<button type="button" class="btn btn-secondary text-error" id="btn-sim-editor-delete" style="padding:6px 12px; font-size:0.8rem;">Delete</button>` : ''}
                    <button type="submit" class="btn btn-primary" style="padding:6px 20px; font-size:0.8rem; border:none;">Save Config</button>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Simulator ID (Unique Tag)</label>
                <input type="text" class="form-input" id="sim-id" value="${sim.id}" ${simId ? 'disabled' : 'required'} placeholder="e.g. logic-gate-sim">
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Simulator Title</label>
                    <input type="text" class="form-input" id="sim-title" value="${sim.title}" required placeholder="e.g. Logic Gate Simulator">
                </div>
                <div class="form-group">
                    <label class="form-label">Classification Category</label>
                    <input type="text" class="form-input" id="sim-category" value="${sim.category}" required placeholder="e.g. Digital Core">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Workspace URL Hash Route</label>
                <input type="text" class="form-input" id="sim-route" value="${sim.route}" required placeholder="e.g. #/sandbox">
            </div>

            <div class="form-group">
                <label class="form-label">Simulator Summary Description</label>
                <textarea class="form-textarea" id="sim-desc" style="height:70px;" required placeholder="Brief description of the simulation engine functionality...">${sim.desc}</textarea>
            </div>

            <!-- Enabled toggle -->
            <div class="form-group flex-between" style="background:rgba(255,255,255,0.02); padding:14px; border-radius:6px; border:1px solid var(--border-admin); margin-bottom:0;">
                <div>
                    <strong style="color:#fff; font-size:0.95rem;">Active Simulator Status</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Disabled simulators will not be selectable inside student labs.</div>
                </div>
                <label style="position:relative; display:inline-block; width:44px; height:24px;">
                    <input type="checkbox" id="sim-enabled" ${sim.enabled ? 'checked' : ''} style="opacity:0; width:0; height:0;">
                    <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--bg-admin-input); border:1px solid var(--border-admin); border-radius:34px; transition:0.3s;" id="sim-enabled-slider"></span>
                </label>
            </div>
        </form>
    `;

    // Toggle color style
    const enabledCheckbox = document.getElementById("sim-enabled");
    const enabledSlider = document.getElementById("sim-enabled-slider");
    const applyToggleStyle = () => {
        enabledSlider.style.backgroundColor = enabledCheckbox.checked ? "var(--success)" : "var(--bg-admin-input)";
    };
    applyToggleStyle();
    enabledCheckbox.onchange = applyToggleStyle;

    // Cancel Button
    document.getElementById("btn-sim-editor-cancel").onclick = () => {
        render(pane.parentElement.parentElement, "simulations", simId);
    };

    // Delete Button
    const delBtn = document.getElementById("btn-sim-editor-delete");
    if (delBtn) {
        delBtn.onclick = async () => {
            if (confirm(`Wipe simulation registration '${sim.title}' entirely from system registers?`)) {
                await deleteSimulationRecord(sim.id);
                render(pane.parentElement.parentElement, "simulations");
            }
        };
    }

    // Submit
    const form = document.getElementById("sim-editor-form");
    form.onsubmit = async (e) => {
        e.preventDefault();

        const saveId = document.getElementById("sim-id").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (saveId.length === 0) return alert("Please specify a valid alphanumeric Simulator ID.");

        const saveSim = {
            id: saveId,
            title: document.getElementById("sim-title").value.trim(),
            category: document.getElementById("sim-category").value.trim(),
            route: document.getElementById("sim-route").value.trim(),
            desc: document.getElementById("sim-desc").value.trim(),
            enabled: enabledCheckbox.checked,
            launches: sim.launches || 0
        };

        await saveSimulationRecord(saveSim);
        render(pane.parentElement.parentElement, "simulations", saveSim.id);
    };
}

async function saveSimulationRecord(simObj) {
    if (isFirebaseActive) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(db, "simulations", simObj.id), simObj);
        } catch (e) {
            console.error(e);
        }
    } else {
        const sims = await fetchSimulationsData();
        const index = sims.findIndex(s => s.id === simObj.id);
        if (index !== -1) {
            sims[index] = simObj;
        } else {
            sims.push(simObj);
        }
        localStorage.setItem("ece-mock-sims", JSON.stringify(sims));
    }
    await logAdminAction("Simulator Config Updated", "admin", `Saved simulator configurations for Simulator ID: ${simObj.id}`);
    window.AdminState.showToast(`Simulator configuration updated for ${simObj.title}`, "success");
}

async function deleteSimulationRecord(id) {
    if (isFirebaseActive) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(db, "simulations", id));
        } catch (e) {
            console.error(e);
        }
    } else {
        const sims = await fetchSimulationsData();
        const filtered = sims.filter(s => s.id !== id);
        localStorage.setItem("ece-mock-sims", JSON.stringify(filtered));
    }
    await logAdminAction("Simulator Unregistered", "admin", `Purged simulator configuration details for ID: ${id}`);
    window.AdminState.showToast("Simulator registry cleared.", "info");
}

// Global launch event logger helper for simulators to call on main website
export async function trackSimulatorLaunch(simId) {
    if (isFirebaseActive) {
        try {
            const { doc, getDoc, updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const docRef = doc(db, "simulations", simId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                await updateDoc(docRef, { launches: increment(1) });
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        try {
            const sims = JSON.parse(localStorage.getItem("ece-mock-sims")) || [];
            const index = sims.findIndex(s => s.id === simId);
            if (index !== -1) {
                sims[index].launches = (sims[index].launches || 0) + 1;
                localStorage.setItem("ece-mock-sims", JSON.stringify(sims));
            }
        } catch (e) {}
    }
}
