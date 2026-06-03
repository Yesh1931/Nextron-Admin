/**
 * Nextron - Content Management System (CMS) Panel
 * Manages ECE subjects, concepts, syllabus, formulas, and reviews.
 */

import { db, isFirebaseActive } from "../js/firebase-config.js";
import { logAdminAction } from "./admin-dashboard.js";

// Main render entrypoint
export async function render(mountPoint, tabName, preselectedTopicId = null) {
    mountPoint.innerHTML = `
        <section class="mb-20 flex-between">
            <div>
                <h2 class="m-0">Syllabus & Concept CMS</h2>
                <p style="margin: 4px 0 0 0;">Create, customize, reorder, and publish curriculum topics across 12 ECE disciplines.</p>
            </div>
            <button class="btn btn-primary" id="btn-cms-new-topic"><i data-lucide="plus-circle"></i> Create ECE Topic</button>
        </section>

        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start;">
            <!-- Left Panel: Topics Tree -->
            <div class="admin-card" style="padding: 16px 20px;">
                <h4 style="color:#fff; margin-bottom:12px;">Curriculum Outline</h4>
                <div style="display:flex; flex-direction:column; gap:6px; max-height: 60vh; overflow-y:auto; padding-right:4px;" id="cms-topics-list">
                    <div class="flex-center" style="padding: 20px;"><div class="spinner"></div></div>
                </div>
            </div>

            <!-- Right Panel: Editor Canvas -->
            <div class="admin-card" id="cms-editor-canvas" style="position:relative; min-height: 400px;">
                <div class="flex-center" style="height: 350px; flex-direction:column; color:var(--text-muted);">
                    <i data-lucide="edit-3" style="width: 48px; height: 48px; margin-bottom:16px;"></i>
                    <p>Select a topic from the curriculum outline or create a new one to begin editing.</p>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind create new topic button
    document.getElementById("btn-cms-new-topic").onclick = () => renderEditorForm(null);

    // Initial load
    await loadTopicsSidebar(preselectedTopicId);
}

// Fetches CMS data, seeding it with defaults if empty
export async function fetchCMSData() {
    let topics = [];
    if (isFirebaseActive) {
        try {
            const { collection, getDocs, addDoc, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "concepts"));
            
            if (snapshot.empty) {
                // Seed default ECE syllabus data
                console.log("Seeding default curriculum data to Firestore...");
                const { CURRICULUM_DATA } = await import("../js/views/concepts.js");
                for (const item of CURRICULUM_DATA) {
                    await setDoc(doc(db, "concepts", item.id), {
                        ...item,
                        published: true,
                        order: CURRICULUM_DATA.indexOf(item)
                    });
                }
                // Reload
                const freshSnapshot = await getDocs(collection(db, "concepts"));
                freshSnapshot.forEach(doc => topics.push({ id: doc.id, ...doc.data() }));
            } else {
                snapshot.forEach(doc => topics.push({ id: doc.id, ...doc.data() }));
            }
        } catch (err) {
            console.error("Firestore CMS load error: ", err);
        }
    } else {
        // Local Mock Data
        try {
            const { CURRICULUM_DATA } = await import("../js/views/concepts.js");
            const saved = JSON.parse(localStorage.getItem("ece-mock-concepts"));
            if (saved) {
                topics = saved;
            } else {
                topics = CURRICULUM_DATA.map((item, idx) => ({
                    ...item,
                    published: true,
                    order: idx
                }));
                localStorage.setItem("ece-mock-concepts", JSON.stringify(topics));
            }
        } catch (e) {}
    }

    // Sort by order ascending
    return topics.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function loadTopicsSidebar(preselectId = null) {
    const listMount = document.getElementById("cms-topics-list");
    if (!listMount) return;

    const topics = await fetchCMSData();
    
    listMount.innerHTML = topics.map(t => `
        <div class="sidebar-link cms-tree-node ${preselectId === t.id ? 'active' : ''}" data-id="${t.id}" style="padding: 8px 12px; font-size: 0.88rem; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                <i data-lucide="${t.icon || 'book-open'}" style="width:14px; height:14px; flex-shrink:0;"></i>
                <span style="white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${t.title}</span>
            </div>
            ${t.published 
                ? `<span style="font-size:0.65rem; color:var(--success); border:1px solid rgba(16,185,129,0.3); border-radius:4px; padding:2px 4px;">LIVE</span>`
                : `<span style="font-size:0.65rem; color:var(--text-muted); border:1px solid var(--border-admin); border-radius:4px; padding:2px 4px;">DRAFT</span>`
            }
        </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();

    // Bind sidebar clicks
    listMount.querySelectorAll(".cms-tree-node").forEach(node => {
        node.onclick = (e) => {
            listMount.querySelectorAll(".cms-tree-node").forEach(n => n.classList.remove("active"));
            e.currentTarget.classList.add("active");
            renderEditorForm(e.currentTarget.getAttribute("data-id"));
        };
    });

    if (preselectId) {
        renderEditorForm(preselectId);
    }
}

async function renderEditorForm(topicId = null) {
    const canvas = document.getElementById("cms-editor-canvas");
    if (!canvas) return;

    canvas.innerHTML = `<div class="flex-center" style="height:350px;"><div class="spinner"></div></div>`;

    const topics = await fetchCMSData();
    let topic = null;

    if (topicId) {
        topic = topics.find(t => t.id === topicId);
    } else {
        // Create new empty topic template
        topic = {
            id: "",
            title: "",
            category: "Semiconductors",
            semester: 1,
            desc: "",
            published: false,
            order: topics.length,
            icon: "activity",
            isSim: false,
            route: "",
            details: {
                syllabus: [""],
                formulas: [""],
                notes: "",
                videos: "",
                references: ""
            }
        };
    }

    canvas.innerHTML = `
        <form id="cms-editor-form" style="text-align:left;">
            <div class="flex-between mb-20" style="border-bottom:1px solid var(--border-admin); padding-bottom:12px;">
                <h3 class="m-0">${topicId ? 'Edit ECE Topic' : 'Create ECE Topic'}</h3>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="btn btn-secondary" id="btn-editor-cancel">Cancel</button>
                    ${topicId ? `<button type="button" class="btn btn-secondary text-error" id="btn-editor-delete">Delete</button>` : ''}
                    <button type="submit" class="btn btn-primary" style="border:none;">Save Config</button>
                </div>
            </div>

            <!-- Top Grid info -->
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Topic ID (Unique Tag)</label>
                    <input type="text" class="form-input" id="edit-id" value="${topic.id}" ${topicId ? 'disabled' : 'required'} placeholder="e.g. pn-junction-lab">
                </div>
                <div class="form-group">
                    <label class="form-label">Display Title</label>
                    <input type="text" class="form-input" id="edit-title" value="${topic.title}" required placeholder="e.g. MOSFET Characteristic Curves">
                </div>
            </div>

            <div class="grid-3">
                <div class="form-group">
                    <label class="form-label">Sub-Category</label>
                    <input type="text" class="form-input" id="edit-category" value="${topic.category}" required placeholder="e.g. Micro-electronics">
                </div>
                <div class="form-group">
                    <label class="form-label">Target Semester</label>
                    <input type="number" class="form-input" id="edit-semester" value="${topic.semester}" min="1" max="8" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Lucide Icon ID</label>
                    <input type="text" class="form-input" id="edit-icon" value="${topic.icon || 'book-open'}" placeholder="e.g. activity, cpu, zap">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Short Description</label>
                <textarea class="form-textarea" id="edit-desc" style="height:70px;" required placeholder="Brief summary of the concept and laboratory targets...">${topic.desc}</textarea>
            </div>

            <!-- Simulation specific properties -->
            <div class="glass-card" style="padding:16px; margin-bottom:20px; border-color:var(--border-glow);">
                <div class="flex-between">
                    <div>
                        <strong style="color:#fff; font-size:0.95rem;">Interactive Simulator Attachment</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">Does this concept include a virtual simulation laboratory workspace?</div>
                    </div>
                    <label style="position:relative; display:inline-block; width:44px; height:24px;">
                        <input type="checkbox" id="edit-issim" ${topic.isSim ? 'checked' : ''} style="opacity:0; width:0; height:0;">
                        <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--bg-admin-input); border:1px solid var(--border-admin); border-radius:34px; transition:0.3s;" id="issim-slider"></span>
                    </label>
                </div>
                <div id="sim-path-group" class="${topic.isSim ? '' : 'hidden'}" style="margin-top:14px; display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                    <div>
                        <label class="form-label">Simulator Route Path</label>
                        <input type="text" class="form-input" id="edit-route" value="${topic.route || ''}" placeholder="e.g. #/concept/diode or #/sandbox">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Syllabus Benchmarks (One per line)</label>
                <textarea class="form-textarea" id="edit-syllabus" style="height:90px;" placeholder="Add target benchmarks, one per line...">${topic.details?.syllabus ? topic.details.syllabus.join("\n") : ""}</textarea>
            </div>

            <!-- Formulas CMS with Live LaTeX Preview -->
            <div class="form-group">
                <label class="form-label">Essential Mathematics & Equations (LaTeX syntax, one per line)</label>
                <textarea class="form-textarea" id="edit-formulas" style="height:90px;" placeholder="e.g. Standard Sinusoid: $v(t) = V_p \\cdot \\sin(2\\pi f t)$">${topic.details?.formulas ? topic.details.formulas.join("\n") : ""}</textarea>
                <div style="margin-top:8px; display:flex; gap:10px; align-items:center;">
                    <button type="button" class="btn btn-secondary" id="btn-preview-formulas" style="padding:4px 12px; font-size:0.75rem;">Test LaTeX Previews</button>
                    <div id="latex-preview-mount" style="flex:1; padding:10px; background:rgba(0,0,0,0.2); border:1px dashed var(--border-admin); border-radius:4px; font-size:0.88rem; min-height:30px;">LaTeX Preview Box</div>
                </div>
            </div>

            <!-- Study guide Markdown review notes -->
            <div class="form-group">
                <div class="flex-between mb-10">
                    <label class="form-label" style="margin-bottom:0;">Academic Review Notes (Rich HTML Supported)</label>
                    <div style="display:flex; gap:6px;">
                        <button type="button" class="btn btn-secondary btn-editor-tag" data-tag="b" style="padding:2px 8px; font-size:0.7rem;">Bold</button>
                        <button type="button" class="btn btn-secondary btn-editor-tag" data-tag="i" style="padding:2px 8px; font-size:0.7rem;">Italic</button>
                        <button type="button" class="btn btn-secondary btn-editor-tag" data-tag="code" style="padding:2px 8px; font-size:0.7rem;">Code</button>
                        <button type="button" class="btn btn-secondary btn-editor-tag" data-tag="h4" style="padding:2px 8px; font-size:0.7rem;">Header</button>
                    </div>
                </div>
                <textarea class="form-textarea" id="edit-notes" style="height:160px;" placeholder="Compose detailed conceptual guide review notes. Bold, Italic, lists, and HTML code blocks are fully parsed.">${topic.details?.notes || ""}</textarea>
            </div>

            <!-- Publish state -->
            <div class="form-group flex-between" style="background:rgba(255,255,255,0.02); padding:14px; border-radius:6px; border:1px solid var(--border-admin);">
                <div>
                    <strong style="color:#fff; font-size:0.95rem;">Publish Sector Concept</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Unpublished concepts will be locked and saved as Drafts.</div>
                </div>
                <label style="position:relative; display:inline-block; width:44px; height:24px;">
                    <input type="checkbox" id="edit-published" ${topic.published ? 'checked' : ''} style="opacity:0; width:0; height:0;">
                    <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:var(--bg-admin-input); border:1px solid var(--border-admin); border-radius:34px; transition:0.3s;" id="published-slider"></span>
                </label>
            </div>

        </form>
    `;

    // Dynamic slider colors
    const applyToggleStyle = (checkbox, slider) => {
        slider.style.backgroundColor = checkbox.checked ? "var(--success)" : "var(--bg-admin-input)";
    };
    const isSimCheckbox = document.getElementById("edit-issim");
    const isSimSlider = document.getElementById("issim-slider");
    const publishedCheckbox = document.getElementById("edit-published");
    const publishedSlider = document.getElementById("published-slider");

    applyToggleStyle(isSimCheckbox, isSimSlider);
    applyToggleStyle(publishedCheckbox, publishedSlider);

    isSimCheckbox.onchange = () => {
        applyToggleStyle(isSimCheckbox, isSimSlider);
        document.getElementById("sim-path-group").classList.toggle("hidden", !isSimCheckbox.checked);
    };
    publishedCheckbox.onchange = () => applyToggleStyle(publishedCheckbox, publishedSlider);

    // Cancel Button
    document.getElementById("btn-editor-cancel").onclick = () => render(canvas.parentElement.parentElement, "content", topicId);

    // Delete Button
    const delBtn = document.getElementById("btn-editor-delete");
    if (delBtn) {
        delBtn.onclick = async () => {
            if (confirm(`Wipe topic '${topic.title}' entirely from syllabus database registers?`)) {
                await deleteTopicRecord(topic.id);
                // Reload CMS view
                render(canvas.parentElement.parentElement, "content");
            }
        };
    }

    // Rich Text Tag Injectors
    document.querySelectorAll(".btn-editor-tag").forEach(btn => {
        btn.onclick = () => {
            const tag = btn.getAttribute("data-tag");
            const textfield = document.getElementById("edit-notes");
            const start = textfield.selectionStart;
            const end = textfield.selectionEnd;
            const text = textfield.value;
            const selected = text.substring(start, end);
            
            let replacement = "";
            if (tag === "b" || tag === "i" || tag === "code" || tag === "h4") {
                replacement = `<${tag}>${selected || 'text'}</${tag}>`;
            }
            
            textfield.value = text.substring(0, start) + replacement + text.substring(end);
            textfield.focus();
        };
    });

    // LaTeX Previews triggers
    document.getElementById("btn-preview-formulas").onclick = () => {
        const formulas = document.getElementById("edit-formulas").value.split("\n").filter(f => f.trim().length > 0);
        const previewMount = document.getElementById("latex-preview-mount");
        if (formulas.length === 0) {
            previewMount.textContent = "No formula strings typed.";
            return;
        }
        
        previewMount.innerHTML = formulas.map(f => `<div style="padding:4px 0;">${f}</div>`).join("");
        
        if (window.renderMathInElement) {
            window.renderMathInElement(previewMount, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    };

    // Form Submit (Save changes)
    const form = document.getElementById("cms-editor-form");
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const saveId = document.getElementById("edit-id").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (saveId.length === 0) return alert("Please specify a valid alphanumeric Topic ID.");

        const saveTopic = {
            id: saveId,
            title: document.getElementById("edit-title").value.trim(),
            category: document.getElementById("edit-category").value.trim(),
            semester: parseInt(document.getElementById("edit-semester").value),
            icon: document.getElementById("edit-icon").value.trim() || "book-open",
            desc: document.getElementById("edit-desc").value.trim(),
            isSim: isSimCheckbox.checked,
            route: isSimCheckbox.checked ? document.getElementById("edit-route").value.trim() : "",
            published: publishedCheckbox.checked,
            order: topic.order,
            details: {
                syllabus: document.getElementById("edit-syllabus").value.split("\n").map(s => s.trim()).filter(s => s.length > 0),
                formulas: document.getElementById("edit-formulas").value.split("\n").map(s => s.trim()).filter(s => s.length > 0),
                notes: document.getElementById("edit-notes").value.trim()
            }
        };

        await saveTopicRecord(saveTopic);
        
        // Reload CMS panel
        render(canvas.parentElement.parentElement, "content", saveTopic.id);
    };
}

async function saveTopicRecord(topicObj) {
    if (isFirebaseActive) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(db, "concepts", topicObj.id), topicObj);
        } catch (e) {
            console.error(e);
        }
    } else {
        const topics = await fetchCMSData();
        const index = topics.findIndex(t => t.id === topicObj.id);
        if (index !== -1) {
            topics[index] = topicObj;
        } else {
            topics.push(topicObj);
        }
        localStorage.setItem("ece-mock-concepts", JSON.stringify(topics));
    }
    
    await logAdminAction(`CMS Update`, `admin`, `Saved curriculum topic metadata for ID: ${topicObj.id}`);
    window.AdminState.showToast(`Syllabus database updated for topic: ${topicObj.title}`, "success");
}

async function deleteTopicRecord(id) {
    if (isFirebaseActive) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(db, "concepts", id));
        } catch (e) {
            console.error(e);
        }
    } else {
        const topics = await fetchCMSData();
        const filtered = topics.filter(t => t.id !== id);
        localStorage.setItem("ece-mock-concepts", JSON.stringify(filtered));
    }
    
    await logAdminAction(`CMS Delete`, `admin`, `Deleted curriculum topic database record: ${id}`);
    window.AdminState.showToast(`Topic removed from curriculum directory.`, "info");
}
