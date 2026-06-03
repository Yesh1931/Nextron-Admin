/**
 * Nextron - Quiz Management Panel
 * Manages assessment banks, question definitions, difficulty levels, and exports.
 */

import { db, isFirebaseActive } from "../js/firebase-config.js";
import { logAdminAction } from "./admin-dashboard.js";

// Main render entrypoint
export async function render(mountPoint, tabName, preselectedQuizId = null) {
    mountPoint.innerHTML = `
        <section class="mb-20 flex-between">
            <div>
                <h2 class="m-0">Quiz Bank Manager</h2>
                <p style="margin: 4px 0 0 0;">Manage curriculum assessments, question answers, marks distributions, and import/export pools.</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" id="btn-quiz-import"><i data-lucide="upload"></i> Import Quiz</button>
                <button class="btn btn-primary" id="btn-quiz-create"><i data-lucide="plus-circle"></i> Create Quiz</button>
            </div>
        </section>

        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start;">
            <!-- Left Panel: Quizzes tree -->
            <div class="admin-card" style="padding: 16px 20px;">
                <h4 style="color:#fff; margin-bottom:12px;">Assessments List</h4>
                <div style="display:flex; flex-direction:column; gap:6px; max-height: 60vh; overflow-y:auto; padding-right:4px;" id="quizzes-tree-list">
                    <div class="flex-center" style="padding: 20px;"><div class="spinner"></div></div>
                </div>
            </div>

            <!-- Right Panel: Editor Canvas -->
            <div class="admin-card" id="quiz-editor-canvas" style="position:relative; min-height: 400px;">
                <div class="flex-center" style="height: 350px; flex-direction:column; color:var(--text-muted);">
                    <i data-lucide="award" style="width: 48px; height: 48px; margin-bottom:16px;"></i>
                    <p>Select an assessment from the list or construct a new one to begin editing.</p>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Bind actions
    document.getElementById("btn-quiz-create").onclick = () => renderQuizForm(null);
    document.getElementById("btn-quiz-import").onclick = () => openImportModal();

    // Initial load
    await loadQuizzesTree(preselectedQuizId);
}

// Fetches all quizzes, seeding defaults if empty
export async function fetchQuizzesData() {
    let quizzes = [];
    if (isFirebaseActive) {
        try {
            const { collection, getDocs, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snapshot = await getDocs(collection(db, "quizzes"));
            
            if (snapshot.empty) {
                console.log("Seeding default ECE quiz bank data to Firestore...");
                const { QUIZ_BANK } = await import("../js/database.js");
                for (const [key, val] of Object.entries(QUIZ_BANK)) {
                    await setDoc(doc(db, "quizzes", key), {
                        id: key,
                        title: val.title,
                        questions: val.questions.map(q => ({
                            question: q.question,
                            options: q.options || [],
                            correctIndex: q.correctIndex ?? 0,
                            explanation: q.explanation || "",
                            difficulty: q.difficulty || "easy",
                            topic: key,
                            marks: q.difficulty === "hard" ? 5 : q.difficulty === "medium" ? 3 : 1
                        }))
                    });
                }
                const freshSnapshot = await getDocs(collection(db, "quizzes"));
                freshSnapshot.forEach(doc => quizzes.push({ id: doc.id, ...doc.data() }));
            } else {
                snapshot.forEach(doc => quizzes.push({ id: doc.id, ...doc.data() }));
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        // Local Mock Data
        try {
            const saved = JSON.parse(localStorage.getItem("ece-mock-quizzes"));
            if (saved) {
                quizzes = saved;
            } else {
                const { QUIZ_BANK } = await import("../js/database.js");
                quizzes = Object.entries(QUIZ_BANK).map(([key, val]) => ({
                    id: key,
                    title: val.title,
                    questions: val.questions.map(q => ({
                        question: q.question,
                        options: q.options || [],
                        correctIndex: q.correctIndex ?? 0,
                        explanation: q.explanation || "",
                        difficulty: q.difficulty || "easy",
                        topic: key,
                        marks: q.difficulty === "hard" ? 5 : q.difficulty === "medium" ? 3 : 1
                    }))
                }));
                localStorage.setItem("ece-mock-quizzes", JSON.stringify(quizzes));
            }
        } catch (e) {}
    }
    return quizzes;
}

async function loadQuizzesTree(preselectId = null) {
    const listMount = document.getElementById("quizzes-tree-list");
    if (!listMount) return;

    const quizzes = await fetchQuizzesData();
    
    listMount.innerHTML = quizzes.map(q => `
        <div class="sidebar-link quiz-tree-node ${preselectId === q.id ? 'active' : ''}" data-id="${q.id}" style="padding: 8px 12px; font-size: 0.88rem; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                <i data-lucide="award" style="width:14px; height:14px; flex-shrink:0;"></i>
                <span style="white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${q.title}</span>
            </div>
            <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">${q.questions ? q.questions.length : 0} Qs</span>
        </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();

    // Bind sidebar clicks
    listMount.querySelectorAll(".quiz-tree-node").forEach(node => {
        node.onclick = (e) => {
            listMount.querySelectorAll(".quiz-tree-node").forEach(n => n.classList.remove("active"));
            e.currentTarget.classList.add("active");
            renderQuizForm(e.currentTarget.getAttribute("data-id"));
        };
    });

    if (preselectId) {
        renderQuizForm(preselectId);
    }
}

async function renderQuizForm(quizId = null) {
    const canvas = document.getElementById("quiz-editor-canvas");
    if (!canvas) return;

    canvas.innerHTML = `<div class="flex-center" style="height:350px;"><div class="spinner"></div></div>`;

    const quizzes = await fetchQuizzesData();
    let quiz = null;

    if (quizId) {
        quiz = quizzes.find(q => q.id === quizId);
    } else {
        quiz = {
            id: "",
            title: "",
            questions: []
        };
    }

    canvas.innerHTML = `
        <form id="quiz-editor-form" style="text-align:left;">
            <div class="flex-between mb-20" style="border-bottom:1px solid var(--border-admin); padding-bottom:12px;">
                <h3 class="m-0">${quizId ? 'Edit Quiz Config' : 'Create Quiz Config'}</h3>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="btn btn-secondary" id="btn-quiz-editor-cancel">Cancel</button>
                    ${quizId ? `<button type="button" class="btn btn-secondary" id="btn-quiz-editor-export"><i data-lucide="download" style="width:14px; height:14px;"></i> Export</button>` : ''}
                    ${quizId ? `<button type="button" class="btn btn-secondary text-error" id="btn-quiz-editor-delete">Delete</button>` : ''}
                    <button type="submit" class="btn btn-primary" style="border:none;">Save Quiz</button>
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Quiz ID (Unique Tag matching Concept ID)</label>
                    <input type="text" class="form-input" id="quiz-id" value="${quiz.id}" ${quizId ? 'disabled' : 'required'} placeholder="e.g. pn-junction">
                </div>
                <div class="form-group">
                    <label class="form-label">Quiz Display Title</label>
                    <input type="text" class="form-input" id="quiz-title" value="${quiz.title}" required placeholder="e.g. PN Junction Diode Lab Quiz">
                </div>
            </div>

            <!-- Questions section header -->
            <div class="flex-between mb-10" style="margin-top:20px; border-bottom:1px dashed var(--border-admin); padding-bottom:8px;">
                <h4 style="color:#fff; margin:0;">Questions Pool (${quiz.questions.length} total)</h4>
                <button type="button" class="btn btn-secondary" id="btn-quiz-add-q" style="padding:4px 10px; font-size:0.75rem;"><i data-lucide="plus" style="width:12px; height:12px;"></i> Add Question</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:16px;" id="quiz-questions-editor-mount">
                <!-- Injected questions editor components -->
            </div>
        </form>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Render questions fields
    let questionsList = [...quiz.questions];
    const questionsMount = document.getElementById("quiz-questions-editor-mount");

    const redrawQuestions = () => {
        if (questionsList.length === 0) {
            questionsMount.innerHTML = `
                <div style="text-align:center; padding:30px; color:var(--text-muted); font-size:0.9rem; background:rgba(0,0,0,0.15); border-radius:6px;">
                    No questions added. Click 'Add Question' above to insert items.
                </div>
            `;
            return;
        }

        questionsMount.innerHTML = questionsList.map((q, idx) => `
            <div class="glass-card quiz-q-field-card" style="padding:20px; border-left:3px solid var(--accent-primary); background:rgba(0,0,0,0.15); position:relative;">
                <button type="button" class="btn-quiz-q-delete" data-idx="${idx}" style="position:absolute; top:12px; right:12px; color:var(--error); font-size:1.1rem; background:none; border:none; cursor:pointer;">&times;</button>
                <div style="font-weight:700; color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; margin-bottom:12px;">Question #${idx + 1}</div>
                
                <div class="form-group">
                    <label class="form-label">Question Text</label>
                    <input type="text" class="form-input q-text" data-idx="${idx}" value="${escapeHtml(q.question)}" required placeholder="e.g. What is the typical barrier potential of a Silicon diode?">
                </div>

                <div class="grid-2" style="gap:12px;">
                    <div class="form-group" style="margin-bottom:10px;">
                        <label class="form-label">Option A</label>
                        <input type="text" class="form-input q-opt-a" data-idx="${idx}" value="${escapeHtml(q.options[0] || '')}" required placeholder="Option A text">
                    </div>
                    <div class="form-group" style="margin-bottom:10px;">
                        <label class="form-label">Option B</label>
                        <input type="text" class="form-input q-opt-b" data-idx="${idx}" value="${escapeHtml(q.options[1] || '')}" required placeholder="Option B text">
                    </div>
                </div>

                <div class="grid-2" style="gap:12px;">
                    <div class="form-group" style="margin-bottom:10px;">
                        <label class="form-label">Option C</label>
                        <input type="text" class="form-input q-opt-c" data-idx="${idx}" value="${escapeHtml(q.options[2] || '')}" required placeholder="Option C text">
                    </div>
                    <div class="form-group" style="margin-bottom:10px;">
                        <label class="form-label">Option D</label>
                        <input type="text" class="form-input q-opt-d" data-idx="${idx}" value="${escapeHtml(q.options[3] || '')}" required placeholder="Option D text">
                    </div>
                </div>

                <div class="grid-3" style="gap:12px; margin-top:10px;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Correct Option</label>
                        <select class="form-select q-correct-idx" data-idx="${idx}">
                            <option value="0" ${q.correctIndex === 0 ? 'selected' : ''}>Option A</option>
                            <option value="1" ${q.correctIndex === 1 ? 'selected' : ''}>Option B</option>
                            <option value="2" ${q.correctIndex === 2 ? 'selected' : ''}>Option C</option>
                            <option value="3" ${q.correctIndex === 3 ? 'selected' : ''}>Option D</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Difficulty</label>
                        <select class="form-select q-diff" data-idx="${idx}">
                            <option value="easy" ${q.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                            <option value="medium" ${q.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="hard" ${q.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">Marks</label>
                        <input type="number" class="form-input q-marks" data-idx="${idx}" value="${q.marks ?? 1}" min="1" max="10">
                    </div>
                </div>

                <div class="form-group" style="margin-top:14px; margin-bottom:0;">
                    <label class="form-label">Answer Explanation</label>
                    <input type="text" class="form-input q-exp" data-idx="${idx}" value="${escapeHtml(q.explanation || '')}" placeholder="Contextual explanation for the correct answer...">
                </div>
            </div>
        `).join("");

        // Bind delete question clicks
        questionsMount.querySelectorAll(".btn-quiz-q-delete").forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.getAttribute("data-idx"));
                questionsList.splice(idx, 1);
                redrawQuestions();
            };
        });

        // Bind key updates to state
        questionsMount.querySelectorAll(".q-text").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].question = e.target.value;
        });
        questionsMount.querySelectorAll(".q-opt-a").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].options[0] = e.target.value;
        });
        questionsMount.querySelectorAll(".q-opt-b").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].options[1] = e.target.value;
        });
        questionsMount.querySelectorAll(".q-opt-c").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].options[2] = e.target.value;
        });
        questionsMount.querySelectorAll(".q-opt-d").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].options[3] = e.target.value;
        });
        questionsMount.querySelectorAll(".q-correct-idx").forEach(select => {
            select.onchange = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].correctIndex = parseInt(e.target.value);
        });
        questionsMount.querySelectorAll(".q-diff").forEach(select => {
            select.onchange = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].difficulty = e.target.value;
        });
        questionsMount.querySelectorAll(".q-marks").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].marks = parseInt(e.target.value) || 1;
        });
        questionsMount.querySelectorAll(".q-exp").forEach(input => {
            input.oninput = (e) => questionsList[parseInt(e.target.getAttribute("data-idx"))].explanation = e.target.value;
        });
    };

    // Add Question Click
    document.getElementById("btn-quiz-add-q").onclick = () => {
        questionsList.push({
            question: "",
            options: ["", "", "", ""],
            correctIndex: 0,
            explanation: "",
            difficulty: "easy",
            topic: quiz.id,
            marks: 1
        });
        redrawQuestions();
    };

    // Run initial drawing
    redrawQuestions();

    // Cancel Click
    document.getElementById("btn-quiz-editor-cancel").onclick = () => render(canvas.parentElement.parentElement, "quizzes", quizId);

    // Export JSON sheet Click
    const expBtn = document.getElementById("btn-quiz-editor-export");
    if (expBtn) {
        expBtn.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quiz, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${quiz.id}-quiz-config.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            window.AdminState.showToast("Quiz sheet configuration exported to file system.", "success");
        };
    }

    // Delete Quiz Click
    const delBtn = document.getElementById("btn-quiz-editor-delete");
    if (delBtn) {
        delBtn.onclick = async () => {
            if (confirm(`Wipe quiz '${quiz.title}' entirely from syllabus assessment registers?`)) {
                await deleteQuizRecord(quiz.id);
                render(canvas.parentElement.parentElement, "quizzes");
            }
        };
    }

    // Form Submit (Save changes)
    const form = document.getElementById("quiz-editor-form");
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const saveId = document.getElementById("quiz-id").value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (saveId.length === 0) return alert("Please specify a valid alphanumeric Quiz ID.");

        // Update topic tags
        questionsList.forEach(q => q.topic = saveId);

        const saveQuiz = {
            id: saveId,
            title: document.getElementById("quiz-title").value.trim(),
            questions: questionsList
        };

        await saveQuizRecord(saveQuiz);
        render(canvas.parentElement.parentElement, "quizzes", saveQuiz.id);
    };
}

async function saveQuizRecord(quizObj) {
    if (isFirebaseActive) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(db, "quizzes", quizObj.id), quizObj);
        } catch (e) {
            console.error(e);
        }
    } else {
        const quizzes = await fetchQuizzesData();
        const index = quizzes.findIndex(q => q.id === quizObj.id);
        if (index !== -1) {
            quizzes[index] = quizObj;
        } else {
            quizzes.push(quizObj);
        }
        localStorage.setItem("ece-mock-quizzes", JSON.stringify(quizzes));
    }
    
    await logAdminAction(`Quiz Config Saved`, `admin`, `Saved assessment questions pool for Quiz ID: ${quizObj.id}`);
    window.AdminState.showToast(`Quiz database saved for: ${quizObj.title}`, "success");
}

async function deleteQuizRecord(id) {
    if (isFirebaseActive) {
        try {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(db, "quizzes", id));
        } catch (e) {
            console.error(e);
        }
    } else {
        const quizzes = await fetchQuizzesData();
        const filtered = quizzes.filter(q => q.id !== id);
        localStorage.setItem("ece-mock-quizzes", JSON.stringify(filtered));
    }
    
    await logAdminAction(`Quiz Deleted`, `admin`, `Purged assessment questions pool for Quiz ID: ${id}`);
    window.AdminState.showToast(`Quiz purged from curriculum registers.`, "info");
}

// Open Import JSON configurations Modal
function openImportModal() {
    const html = `
        <div style="text-align:left;">
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:14px;">Paste ECE Quiz configuration JSON string below. Must follow the schema containing <code>id</code>, <code>title</code>, and <code>questions</code> array.</p>
            <div class="form-group">
                <label class="form-label">JSON Configuration Sheet</label>
                <textarea class="form-textarea" id="import-json-area" style="height:220px; font-family:monospace; font-size:0.8rem;" placeholder='{\n  "id": "sample-quiz",\n  "title": "Sample Quiz",\n  "questions": [\n    {\n      "question": "Sample?",\n      "options": ["A", "B", "C", "D"],\n      "correctIndex": 0,\n      "explanation": "Exp",\n      "difficulty": "easy",\n      "marks": 1\n    }\n  ]\n}'></textarea>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button class="btn btn-secondary" onclick="window.AdminState.closeModal()">Cancel</button>
                <button class="btn btn-primary" id="btn-import-apply" style="border:none;">Import Config</button>
            </div>
        </div>
    `;

    window.AdminState.openModal(html);
    document.getElementById("modal-host-title").innerHTML = `<i data-lucide="upload" style="width:16px; height:16px; vertical-align:middle; margin-right:4px;"></i> Import Assessment Sheet`;

    document.getElementById("btn-import-apply").onclick = async () => {
        const text = document.getElementById("import-json-area").value.trim();
        try {
            const quizObj = JSON.parse(text);
            if (!quizObj.id || !quizObj.title || !Array.isArray(quizObj.questions)) {
                throw new Error("Invalid schema structure. Must contain id, title, and questions array.");
            }
            
            // Clean question objects
            quizObj.questions = quizObj.questions.map(q => ({
                question: q.question || "Untitled question",
                options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["A", "B", "C", "D"],
                correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
                explanation: q.explanation || "",
                difficulty: q.difficulty || "easy",
                topic: quizObj.id,
                marks: q.marks || 1
            }));

            await saveQuizRecord(quizObj);
            window.AdminState.closeModal();
            
            // Reload Quiz Manager tab
            const mount = document.getElementById("admin-main-mount");
            await render(mount.parentElement.parentElement, "quizzes", quizObj.id);

        } catch (err) {
            alert(`JSON configuration parsing failed: ${err.message}`);
        }
    };
}

function escapeHtml(string) {
    if (!string) return "";
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
