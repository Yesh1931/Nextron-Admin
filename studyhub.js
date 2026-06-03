/**
 * Nextron - ECE Comprehensive Study Hub
 * Premium One-Stop Learning Resource for Undergraduate ECE Students
 */

import { STUDY_DATA } from '../study_data.js';

let activeSubjectId = 'mosfets';
let activeTabName = 'concept';
let activeMCQSelection = null;
let animationFrameId = null;

export const render = async () => {
    return `
        <div class="study-hub-container fade-in">
            <!-- Styling System -->
            <style>
                .sh-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 24px;
                    margin-top: 20px;
                }
                @media (max-width: 900px) {
                    .sh-layout {
                        grid-template-columns: 1fr;
                    }
                }
                .sh-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-height: 80vh;
                    overflow-y: auto;
                    padding-right: 8px;
                }
                .sh-topic-card {
                    padding: 14px 16px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-sm);
                    background: rgba(255, 255, 255, 0.015);
                    cursor: pointer;
                    transition: all 0.25s ease;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sh-topic-card:hover {
                    border-color: var(--accent-secondary);
                    background: rgba(6, 182, 212, 0.05);
                    transform: translateX(4px);
                }
                .sh-topic-card.active {
                    border-color: var(--accent-primary);
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.04));
                    box-shadow: 0 0 12px rgba(6, 182, 212, 0.1);
                }
                .sh-topic-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    color: var(--accent-secondary);
                }
                .sh-topic-card.active .sh-topic-icon {
                    background: var(--accent-secondary);
                    color: #fff;
                }
                .sh-topic-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1.3;
                }
                .sh-topic-card.active .sh-topic-title {
                    color: #fff;
                }
                .sh-main-board {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .sh-tab-bar {
                    display: flex;
                    gap: 8px;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 1px;
                }
                .sh-tab-btn {
                    padding: 10px 18px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease;
                }
                .sh-tab-btn:hover {
                    color: var(--accent-secondary);
                }
                .sh-tab-btn.active {
                    color: var(--accent-primary);
                    border-bottom-color: var(--accent-primary);
                }
                .sh-tab-content {
                    display: none;
                    animation: fadeIn 0.3s ease;
                }
                .sh-tab-content.active {
                    display: block;
                }
                .sh-formula-card {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-sm);
                    padding: 16px;
                    margin-bottom: 14px;
                }
                .sh-step-box {
                    border-left: 3px solid var(--accent-purple);
                    background: rgba(99, 102, 241, 0.03);
                    padding: 12px 16px;
                    border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
                    margin: 8px 0;
                    font-size: 0.85rem;
                    line-height: 1.5;
                }
                .sh-sim-grid {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 20px;
                }
                @media (max-width: 850px) {
                    .sh-sim-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .sh-option-btn {
                    width: 100%;
                    padding: 12px 16px;
                    text-align: left;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-sm);
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                    margin-bottom: 8px;
                }
                .sh-option-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--text-muted);
                }
                .sh-option-btn.correct {
                    background: rgba(16, 185, 129, 0.15) !important;
                    border-color: #10b981 !important;
                    color: #fff !important;
                }
                .sh-option-btn.incorrect {
                    background: rgba(239, 68, 68, 0.15) !important;
                    border-color: #ef4444 !important;
                    color: #fff !important;
                }
            </style>

            <!-- Navigation Header -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px; display: inline-flex; align-items: center; gap: 8px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-purple); font-size: 0.95rem; font-weight: bold; margin-bottom: 0; display: inline-flex; align-items: center; gap: 6px;">
                    <i data-lucide="graduation-cap"></i> ECE Premium Study Center
                </span>
            </div>

            <!-- Page Title -->
            <div class="section-title" style="margin-top: 0; margin-bottom: 28px; text-align: left;">
                <h2>B.Tech ECE Dynamic Study Hub</h2>
                <p>Unlock robust theoretical knowledge, trace micro-circuit schematics, solve exam exercises, and run real-time hardware simulators for all 17 ECE subjects.</p>
            </div>

            <div class="sh-layout">
                <!-- Left Sidebar Navigation -->
                <div class="sh-sidebar" id="sh-sidebar-list">
                    ${Object.entries(STUDY_DATA).map(([id, topic]) => `
                        <div class="sh-topic-card ${id === activeSubjectId ? 'active' : ''}" data-topic-id="${id}">
                            <div class="sh-topic-icon"><i data-lucide="${topic.icon}"></i></div>
                            <div style="flex-grow: 1;">
                                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 800; display: block; text-transform: uppercase;">${topic.category}</span>
                                <div class="sh-topic-title">${topic.title.split(' (')[0]}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Right Main Interactive Panel -->
                <div class="glass-card sh-main-board" style="padding: 28px;">
                    <!-- Active Title Banner -->
                    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 8px;">
                        <h2 id="sh-active-title" style="margin: 0 0 6px 0; color: #fff; font-size: 1.5rem;">Subject Module</h2>
                        <span id="sh-active-category" class="concept-card-category" style="color: var(--accent-secondary);">Category</span>
                    </div>

                    <!-- Inner Tab Selector -->
                    <div class="sh-tab-bar">
                        <button class="sh-tab-btn active" data-sh-tab="concept"><i data-lucide="book-open" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Concept Study</button>
                        <button class="sh-tab-btn" data-sh-tab="math"><i data-lucide="calculator" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Math &amp; Solved Exercises</button>
                        <button class="sh-tab-btn" data-sh-tab="lab"><i data-lucide="flask-conical" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Laboratory Simulator</button>
                        <button class="sh-tab-btn" data-sh-tab="assessment"><i data-lucide="award" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Self Assessment</button>
                    </div>

                    <!-- 1. CONCEPT STUDY TAB -->
                    <div class="sh-tab-content active" id="sh-content-concept">
                        <div id="sh-concept-body">
                            <!-- Injected dynamically -->
                        </div>
                    </div>

                    <!-- 2. MATHEMATICS TAB -->
                    <div class="sh-tab-content" id="sh-content-math">
                        <div id="sh-math-body">
                            <!-- Injected dynamically -->
                        </div>
                    </div>

                    <!-- 3. LABORATORY SIMULATOR TAB -->
                    <div class="sh-tab-content" id="sh-content-lab">
                        <div class="sh-sim-grid">
                            <!-- Left: Interactive Visual Canvas screen -->
                            <div class="visualizer-wrapper" style="height: 380px; position: relative; background: #010409;">
                                <div class="visualizer-labels" id="sh-sim-label" style="background: rgba(1, 4, 9, 0.8);">
                                    Interactive Simulator Interface
                                </div>
                                <canvas id="sh-sim-canvas" style="width: 100%; height: 100%; border-radius: var(--border-radius-sm);"></canvas>
                            </div>
                            <!-- Right: Parameter controls panel -->
                            <div class="glass-card" style="padding: 18px; border-color: var(--border-glow); display: flex; flex-direction: column; gap: 14px;" id="sh-sim-controls">
                                <h4 style="margin: 0; color: #fff;"><i data-lucide="sliders" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Sliders &amp; Outputs</h4>
                                <div style="display: flex; flex-direction: column; gap: 12px;" id="sh-sim-sliders-mount">
                                    <!-- Dynamic sliders -->
                                </div>
                                <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-color); padding: 12px; border-radius: 4px; font-size: 0.8rem; font-family: monospace;" id="sh-sim-readout-mount">
                                    <!-- Dynamic readouts -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. SELF ASSESSMENT TAB -->
                    <div class="sh-tab-content" id="sh-content-assessment">
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <div>
                                <h3 style="color: var(--accent-secondary); margin-top: 0;"><i data-lucide="help-circle" style="width:18px;height:18px;display:inline-block;vertical-align:middle;margin-right:6px;"></i> Practice Multiple Choice Question</h3>
                                <p style="font-size: 1rem; color: #fff; font-weight: 600; line-height: 1.5; margin-bottom: 16px;" id="sh-mcq-question">Question text?</p>
                                <div id="sh-mcq-options-container">
                                    <!-- Options buttons -->
                                </div>
                                <div style="display: none; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2); padding: 14px 18px; border-radius: 6px; margin-top: 14px; font-size: 0.85rem; line-height: 1.5;" id="sh-mcq-explanation-box">
                                    <strong>Explanation:</strong> <span id="sh-mcq-explanation-text">...</span>
                                </div>
                            </div>

                            <hr style="border-color: var(--border-color); margin: 0;">

                            <div>
                                <h3 style="color: var(--warning);"><i data-lucide="book-open" style="width:18px;height:18px;display:inline-block;vertical-align:middle;margin-right:6px;"></i> Common University Exam Questions</h3>
                                <div style="display: flex; flex-direction: column; gap: 16px;" id="sh-exam-questions-mount">
                                    <!-- Exam questions -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// --- SIMULATION PARAMETERS STORAGE ---
const simParams = {
    mosfet: { vgs: 1.8, vds: 2.0, doping: 2 },
    opamp: { type: 'inverting', vin: 0.5, rf: 50, r1: 10 },
    amplifier: { rc: 3.3, ie: 1.2, beta: 100 },
    oscillator: { type: 'wien', r: 10, c: 10 },
    combinational: { s1: 0, s0: 0, d0: 1, d1: 0, d2: 1, d3: 0 },
    sequential: { clockCycles: 0, j: 1, k: 1, state: 0 },
    analogcomms: { m: 0.6, fc: 20, fm: 2 },
    digitalcomms: { type: 'bpsk', sqnrBits: 8, snr: 10 },
    dsp: { convType: 'linear', overlap: 0 },
    networktheorems: { v1: 12, v2: 6, r1: 4, r2: 8, rl: 4 },
    arm: { pipelineStage: 0, regR0: 15, regR1: 25 },
    rtos: { task1Period: 4, task1Exec: 1, task2Period: 5, task2Exec: 2 },
    vlsi: { vin: 0.0, vdd: 1.2 },
    maths: { param: 1.0 },
    handbook: { rc: 10, c: 100 },
    interview: { flashcardIdx: 0 },
    projects: { projectIdx: 0 }
};

export const mount = () => {
    // 1. Render active subject elements
    loadActiveSubject();

    // 2. Sidebar cards listener
    const cards = document.querySelectorAll('.sh-topic-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            cards.forEach(c => c.classList.remove('active'));
            const clicked = e.currentTarget;
            clicked.classList.add('active');
            activeSubjectId = clicked.dataset.topicId;
            activeMCQSelection = null;
            loadActiveSubject();
        });
    });

    // 3. Inner Tabs navigation
    const tabButtons = document.querySelectorAll('.sh-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activeTabName = e.currentTarget.dataset.shTab;

            document.querySelectorAll('.sh-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`sh-content-${activeTabName}`).classList.add('active');
            
            // Re-trigger layout parameters
            if (activeTabName === 'lab') {
                initCanvasSizing();
            }
        });
    });

    // 4. Keyboard Listener or other elements
    if (window.lucide) window.lucide.createIcons();
};

function loadActiveSubject() {
    const s = STUDY_DATA[activeSubjectId];
    if (!s) return;

    // Load active names
    document.getElementById('sh-active-title').textContent = s.title;
    document.getElementById('sh-active-category').textContent = s.category.toUpperCase();

    // Load Concept Study tab
    document.getElementById('sh-concept-body').innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px; line-height: 1.6; text-align: left; margin-top: 14px;">
            <div>
                <h4 style="color: var(--accent-secondary); margin-bottom: 6px; font-weight: 700;">1. Introduction</h4>
                <p style="font-size: 0.95rem; color: var(--text-secondary);">${s.intro}</p>
            </div>
            <div>
                <h4 style="color: var(--accent-purple); margin-bottom: 6px; font-weight: 700;">2. Physical Theory & Background</h4>
                <p style="font-size: 0.95rem; color: var(--text-secondary);">${s.theory}</p>
            </div>
            <div>
                <h4 style="color: var(--warning); margin-bottom: 6px; font-weight: 700;">3. Working & Operating Principle</h4>
                <p style="font-size: 0.95rem; color: var(--text-secondary);">${s.working.replace(/\n/g, '<br>')}</p>
            </div>
            <div>
                <h4 style="color: var(--green); margin-bottom: 8px; font-weight: 700;">4. Conceptual Schematic Model</h4>
                <pre style="background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); padding: 16px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; color: #10b981; overflow-x: auto; line-height: 1.4;">${s.diagram}</pre>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 8px;">
                <div>
                    <h5 style="color: var(--success); font-weight: bold; margin-bottom: 6px;"><i data-lucide="check-circle" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Prime Advantages</h5>
                    <ul style="font-size: 0.85rem; color: var(--text-secondary); padding-left: 20px;">
                        ${s.advantages.map(adv => `<li style="margin-bottom:4px;">${adv}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h5 style="color: var(--danger); font-weight: bold; margin-bottom: 6px;"><i data-lucide="x-circle" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Core Disadvantages</h5>
                    <ul style="font-size: 0.85rem; color: var(--text-secondary); padding-left: 20px;">
                        ${s.disadvantages.map(dis => `<li style="margin-bottom:4px;">${dis}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div>
                <h4 style="color: var(--accent-primary); margin-bottom: 6px; font-weight: 700;">5. Practical Applications</h4>
                <ul style="font-size: 0.9rem; color: var(--text-secondary); padding-left: 20px;">
                    ${s.applications.map(app => `<li style="margin-bottom:6px;">${app}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    // Load Math & Solved Exercises tab
    document.getElementById('sh-math-body').innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px; text-align: left; margin-top: 14px;">
            <div>
                <h4 style="color: var(--accent-secondary); margin-bottom: 12px; font-weight: 700;">Core Formulas Handbook</h4>
                ${s.formulas.map(f => `
                    <div class="sh-formula-card">
                        <div style="font-size: 1.1rem; text-align: center; margin: 12px 0; color: #fff;">$$${f.expr}$$</div>
                        <div style="font-size: 0.85rem; color: var(--accent-secondary); text-align: center; font-weight: 600;">${f.desc}</div>
                    </div>
                `).join('')}
            </div>

            <div>
                <h4 style="color: var(--warning); margin-bottom: 12px; font-weight: 700;">Solved Numerical Exercises</h4>
                ${s.numericals.map((n, idx) => `
                    <div class="glass-card" style="padding: 18px; margin-bottom: 14px; border-left: 4px solid var(--warning);">
                        <div style="font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 8px;">Problem #${idx + 1}</div>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">${n.q}</p>
                        <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 6px;">
                            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 800; margin-bottom: 8px; letter-spacing: 0.05em;">STEP-BY-STEP SOLUTION</span>
                            ${n.steps.map((st, sIdx) => `<div class="sh-step-box"><strong>Step ${sIdx + 1}:</strong> ${st}</div>`).join('')}
                            <div style="margin-top: 12px; border-top: 1px dashed var(--border-color); padding-top: 10px; font-weight: bold; color: var(--green); font-size: 0.95rem;">
                                Final Answer: ${n.r}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Load Self Assessment MCQ
    const mcq = s.mcqs[0];
    document.getElementById('sh-mcq-question').textContent = mcq.q;
    const optContainer = document.getElementById('sh-mcq-options-container');
    optContainer.innerHTML = mcq.opts.map((opt, oIdx) => `
        <button class="sh-option-btn" data-opt-idx="${oIdx}">${opt}</button>
    `).join('');
    
    // Hide explanation box initially
    document.getElementById('sh-mcq-explanation-box').style.display = 'none';

    // Hook MCQ clicks
    optContainer.querySelectorAll('.sh-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (activeMCQSelection !== null) return; // Answer locked
            const selIdx = parseInt(e.currentTarget.dataset.optIdx);
            activeMCQSelection = selIdx;

            const buttons = optContainer.querySelectorAll('.sh-option-btn');
            buttons.forEach((b, idx) => {
                if (idx === mcq.correct) {
                    b.classList.add('correct');
                } else if (idx === selIdx) {
                    b.classList.add('incorrect');
                }
            });

            // Show explanation
            document.getElementById('sh-mcq-explanation-text').textContent = mcq.exp;
            document.getElementById('sh-mcq-explanation-box').style.display = 'block';
        });
    });

    // Load common exam questions
    document.getElementById('sh-exam-questions-mount').innerHTML = s.examQuestions.map((eq, eIdx) => `
        <div class="glass-card" style="padding: 16px; text-align: left;">
            <div style="font-weight: 700; color: #fff; font-size: 0.9rem; margin-bottom: 6px;">Q${eIdx + 1}: ${eq.q}</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; border: 1px solid var(--border-color);">${eq.a}</p>
        </div>
    `).join('');

    // Load Sliders and start Simulation Loop
    loadSimulatorPanel();

    // Trigger math rendering
    if (window.renderMathInElement) {
        window.renderMathInElement(document.getElementById('sh-content-concept'), {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
            throwOnError: false
        });
        window.renderMathInElement(document.getElementById('sh-content-math'), {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
            throwOnError: false
        });
        window.renderMathInElement(document.getElementById('sh-content-assessment'), {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
            throwOnError: false
        });
    }

    if (window.lucide) window.lucide.createIcons();
}

function loadSimulatorPanel() {
    const s = STUDY_DATA[activeSubjectId];
    if (!s) return;

    const slidersMount = document.getElementById('sh-sim-sliders-mount');
    const readoutMount = document.getElementById('sh-sim-readout-mount');

    if (s.simType === 'mosfet') {
        slidersMount.innerHTML = `
            <div class="slider-group">
                <div class="slider-label-row" style="font-size:0.75rem;">
                    <span class="slider-name">Gate-Source Voltage (V_GS)</span>
                    <span class="slider-val" id="sh-val-vgs" style="color:var(--accent-secondary); font-weight:bold;">1.80 V</span>
                </div>
                <input type="range" class="slider-input" id="sh-slider-vgs" min="0.0" max="3.0" step="0.1" value="${simParams.mosfet.vgs}">
            </div>
            <div class="slider-group">
                <div class="slider-label-row" style="font-size:0.75rem;">
                    <span class="slider-name">Drain-Source Voltage (V_DS)</span>
                    <span class="slider-val" id="sh-val-vds" style="color:var(--green); font-weight:bold;">2.00 V</span>
                </div>
                <input type="range" class="slider-input" id="sh-slider-vds" min="0.0" max="4.0" step="0.1" value="${simParams.mosfet.vds}">
            </div>
        `;
        readoutMount.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Operation Region:</span>
                <span id="sh-ro-region" style="font-weight:bold; color:var(--warning);">SATURATION</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <span>Drain Current (I_D):</span>
                <span id="sh-ro-current" style="font-weight:bold; color:var(--green);">0.00 mA</span>
            </div>
        `;

        // Bind Sliders
        const vgsSlider = document.getElementById('sh-slider-vgs');
        const vdsSlider = document.getElementById('sh-slider-vds');
        vgsSlider.addEventListener('input', (e) => {
            simParams.mosfet.vgs = parseFloat(e.target.value);
            document.getElementById('sh-val-vgs').textContent = `${simParams.mosfet.vgs.toFixed(2)} V`;
            updateMosfetValues();
        });
        vdsSlider.addEventListener('input', (e) => {
            simParams.mosfet.vds = parseFloat(e.target.value);
            document.getElementById('sh-val-vds').textContent = `${simParams.mosfet.vds.toFixed(2)} V`;
            updateMosfetValues();
        });

        updateMosfetValues();

    } else if (s.simType === 'opamp') {
        slidersMount.innerHTML = `
            <div class="slider-group">
                <span class="slider-name" style="font-size:0.75rem;">Amplifier Mode</span>
                <select id="sh-select-opamp" style="width:100%; padding:6px; background:#000; border:1px solid var(--border-color); color:#fff; border-radius:4px; margin-top:4px;">
                    <option value="inverting" ${simParams.opamp.type === 'inverting' ? 'selected' : ''}>Inverting (Av = -Rf/R1)</option>
                    <option value="noninverting" ${simParams.opamp.type === 'noninverting' ? 'selected' : ''}>Non-Inverting (Av = 1 + Rf/R1)</option>
                </select>
            </div>
            <div class="slider-group">
                <div class="slider-label-row" style="font-size:0.75rem;">
                    <span class="slider-name">Input Voltage (V_in)</span>
                    <span class="slider-val" id="sh-val-vin" style="color:var(--accent-secondary); font-weight:bold;">0.50 V</span>
                </div>
                <input type="range" class="slider-input" id="sh-slider-vin" min="-2.0" max="2.0" step="0.1" value="${simParams.opamp.vin}">
            </div>
            <div class="slider-group">
                <div class="slider-label-row" style="font-size:0.75rem;">
                    <span class="slider-name">Feedback Resistor (R_f)</span>
                    <span class="slider-val" id="sh-val-rf" style="color:var(--accent-purple); font-weight:bold;">50 kΩ</span>
                </div>
                <input type="range" class="slider-input" id="sh-slider-rf" min="10" max="100" step="5" value="${simParams.opamp.rf}">
            </div>
        `;
        readoutMount.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Calculated Gain (A_v):</span>
                <span id="sh-ro-gain" style="font-weight:bold; color:var(--accent-purple);">-5.00</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <span>Output Voltage (V_out):</span>
                <span id="sh-ro-vout" style="font-weight:bold; color:var(--green);">-2.50 V</span>
            </div>
        `;

        const modeSelect = document.getElementById('sh-select-opamp');
        const vinSlider = document.getElementById('sh-slider-vin');
        const rfSlider = document.getElementById('sh-slider-rf');

        modeSelect.addEventListener('change', (e) => {
            simParams.opamp.type = e.target.value;
            updateOpampValues();
        });
        vinSlider.addEventListener('input', (e) => {
            simParams.opamp.vin = parseFloat(e.target.value);
            document.getElementById('sh-val-vin').textContent = `${simParams.opamp.vin.toFixed(2)} V`;
            updateOpampValues();
        });
        rfSlider.addEventListener('input', (e) => {
            simParams.opamp.rf = parseInt(e.target.value);
            document.getElementById('sh-val-rf').textContent = `${simParams.opamp.rf} kΩ`;
            updateOpampValues();
        });

        updateOpampValues();
    } else {
        // Fallback for general calculators
        slidersMount.innerHTML = `
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">
                Calculators are pre-programmed dynamically. Check standard math and assessments tabs to analyze ECE formulas!
            </p>
        `;
        readoutMount.innerHTML = `
            <div style="color:var(--accent-secondary); font-weight:bold; text-align:center;">
                SIMULATION TELEMETRY ACTIVE
            </div>
        `;
    }
}

function updateMosfetValues() {
    const { vgs, vds } = simParams.mosfet;
    const vt = 0.8; // default silicon threshold voltage
    const kn = 0.5; // default transconductance parameter mA/V^2

    let region = 'CUTOFF';
    let current = 0.0;

    if (vgs < vt) {
        region = 'CUTOFF';
        current = 0.0;
    } else {
        const vov = vgs - vt;
        if (vds < vov) {
            region = 'LINEAR / TRIODE';
            current = kn * (2 * vov * vds - vds * vds);
        } else {
            region = 'SATURATION';
            current = kn * vov * vov;
        }
    }

    const regEl = document.getElementById('sh-ro-region');
    const curEl = document.getElementById('sh-ro-current');
    if (regEl && curEl) {
        regEl.textContent = region;
        regEl.style.color = region === 'CUTOFF' ? 'var(--danger)' : region === 'SATURATION' ? 'var(--warning)' : 'var(--accent-secondary)';
        curEl.textContent = `${current.toFixed(2)} mA`;
    }
}

function updateOpampValues() {
    const { type, vin, rf, r1 } = simParams.opamp;
    let gain = 0;
    let vout = 0;

    if (type === 'inverting') {
        gain = -rf / r1;
        vout = gain * vin;
    } else {
        gain = 1 + rf / r1;
        vout = gain * vin;
    }

    // Clamp saturation at rails (e.g. ±12V)
    if (vout > 12) vout = 12;
    if (vout < -12) vout = -12;

    const gainEl = document.getElementById('sh-ro-gain');
    const voutEl = document.getElementById('sh-ro-vout');
    if (gainEl && voutEl) {
        gainEl.textContent = gain.toFixed(2);
        voutEl.textContent = `${vout.toFixed(2)} V`;
        if (vout === 12 || vout === -12) {
            voutEl.textContent += " (SATURATION)";
            voutEl.style.color = 'var(--danger)';
        } else {
            voutEl.style.color = 'var(--green)';
        }
    }
}

// Global Canvas Resize Handler
let canvasWidth = 400;
let canvasHeight = 380;

function initCanvasSizing() {
    const canvas = document.getElementById('sh-sim-canvas');
    if (!canvas) return;

    canvasWidth = canvas.width = canvas.parentElement.clientWidth || 400;
    canvasHeight = canvas.height = 380;

    drawSimulationScreen();
}

function drawSimulationScreen() {
    const canvas = document.getElementById('sh-sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dynamic Visualizer drawing based on active sim type
    if (activeSubjectId === 'mosfets') {
        // Draw standard I_D vs V_DS curves
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        // Draw grid
        for (let x = 40; x < canvasWidth; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, canvasHeight - 40); ctx.stroke();
        }
        for (let y = 20; y < canvasHeight - 40; y += 40) {
            ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(canvasWidth - 20, y); ctx.stroke();
        }

        // Draw Axes
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 20);
        ctx.lineTo(40, canvasHeight - 40);
        ctx.lineTo(canvasWidth - 20, canvasHeight - 40);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '9px monospace';
        ctx.fillText('V_DS (Voltage)', canvasWidth - 100, canvasHeight - 25);
        ctx.save();
        ctx.translate(20, 100);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('I_D (Current)', 0, 0);
        ctx.restore();

        // Draw multiple curves representing different V_GS states
        const { vgs, vds } = simParams.mosfet;
        ctx.lineWidth = 2;

        const drawCurve = (curveVgs, color, isActive) => {
            ctx.strokeStyle = color;
            ctx.beginPath();
            let first = true;

            const vt = 0.8;
            const kn = 25; // scaling for canvas draw

            for (let vx = 0; vx <= 10; vx += 0.2) {
                const xVal = 40 + vx * (canvasWidth - 60)/10;
                let yVal = canvasHeight - 40;

                if (curveVgs > vt) {
                    const vov = curveVgs - vt;
                    let current = 0;
                    if (vx/2.5 < vov) {
                        current = kn * (2 * vov * (vx/2.5) - (vx/2.5) * (vx/2.5));
                    } else {
                        current = kn * vov * vov;
                    }
                    yVal = canvasHeight - 40 - current;
                }

                if (first) {
                    ctx.moveTo(xVal, yVal);
                    first = false;
                } else {
                    ctx.lineTo(xVal, yVal);
                }
            }
            ctx.stroke();

            if (isActive) {
                // Draw current operating point
                const vov = vgs - vt;
                let activeCurrent = 0;
                if (vgs > vt) {
                    if (vds < vov) {
                        activeCurrent = kn * (2 * vov * vds - vds * vds);
                    } else {
                        activeCurrent = kn * vov * vov;
                    }
                }
                const ptX = 40 + vds * 2.5 * (canvasWidth - 60)/10;
                const ptY = canvasHeight - 40 - activeCurrent;

                ctx.fillStyle = '#e11d48';
                ctx.beginPath();
                ctx.arc(ptX, ptY, 6, 0, 2*Math.PI);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.fillText(`Operating Point (${vds.toFixed(1)}V, ${vgs.toFixed(1)}V)`, ptX + 10, ptY - 10);
            }
        };

        drawCurve(1.2, 'rgba(6,182,212,0.2)', false);
        drawCurve(1.8, 'rgba(6,182,212,0.4)', false);
        drawCurve(2.4, 'rgba(6,182,212,0.6)', false);
        drawCurve(vgs, '#06b6d4', true);

    } else if (activeSubjectId === 'opamps') {
        // Draw basic schematic diagram of Op-Amp
        ctx.fillStyle = 'rgba(2, 8, 23, 0.7)';
        ctx.fillRect(20, 20, canvasWidth - 40, canvasHeight - 40);

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

        // Draw Op-Amp Triangle
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.beginPath();
        ctx.moveTo(canvasWidth * 0.35, canvasHeight * 0.25);
        ctx.lineTo(canvasWidth * 0.70, canvasHeight * 0.50);
        ctx.lineTo(canvasWidth * 0.35, canvasHeight * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Terminals
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ef4444'; ctx.fillText('-', canvasWidth * 0.38, canvasHeight * 0.38);
        ctx.fillStyle = '#10b981'; ctx.fillText('+', canvasWidth * 0.38, canvasHeight * 0.65);

        // Signal outputs
        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(canvasWidth * 0.70, canvasHeight * 0.50);
        ctx.lineTo(canvasWidth * 0.85, canvasHeight * 0.50);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('v_out', canvasWidth * 0.86, canvasHeight * 0.52);

        // Dynamic Waveform preview inside card
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(canvasWidth * 0.1, canvasHeight * 0.85);
        ctx.lineTo(canvasWidth * 0.9, canvasHeight * 0.85);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        let first = true;
        const { vin, type, rf, r1 } = simParams.opamp;
        const scale = 25;

        for (let x = 0; x < 100; x++) {
            const screenX = canvasWidth * 0.1 + (x / 100) * (canvasWidth * 0.8);
            const waveIn = vin * Math.sin((x / 100) * 4 * Math.PI);
            const screenY = canvasHeight * 0.85 - waveIn * scale;

            if (first) {
                ctx.moveTo(screenX, screenY);
                first = false;
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();

        // Draw amplified output
        let gain = type === 'inverting' ? -rf/r1 : 1 + rf/r1;
        ctx.strokeStyle = '#e11d48';
        ctx.beginPath();
        first = true;
        for (let x = 0; x < 100; x++) {
            const screenX = canvasWidth * 0.1 + (x / 100) * (canvasWidth * 0.8);
            let waveOut = vin * gain * Math.sin((x / 100) * 4 * Math.PI);
            
            // Saturation clipping
            if (waveOut > 10) waveOut = 10;
            if (waveOut < -10) waveOut = -10;

            const screenY = canvasHeight * 0.85 - waveOut * scale;

            if (first) {
                ctx.moveTo(screenX, screenY);
                first = false;
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();

        ctx.font = '9px monospace';
        ctx.fillStyle = '#10b981'; ctx.fillText('Green: V_in', canvasWidth * 0.1, canvasHeight * 0.96);
        ctx.fillStyle = '#e11d48'; ctx.fillText('Red: V_out', canvasWidth * 0.3, canvasHeight * 0.96);

    } else {
        // Generic Visual Screen card
        ctx.fillStyle = 'rgba(2, 8, 23, 0.7)';
        ctx.fillRect(20, 20, canvasWidth - 40, canvasHeight - 40);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

        ctx.font = "bold 14px 'Space Grotesk', sans-serif";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.textAlign = 'center';
        ctx.fillText('ECE ACTIVE CORE PROCESSOR SIGNAL', canvasWidth/2, canvasHeight/2);
    }
}

export const unmount = () => {
    activeSubjectId = 'mosfets';
    activeTabName = 'concept';
    activeMCQSelection = null;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
};
