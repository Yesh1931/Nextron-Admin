/**
 * Nextron - Boolean Logic Gates Simulation & Challenge View
 */

export const render = async () => {
    return `
        <style>
            .mode-tab-bar {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
            }
            .mode-tab-btn {
                flex: 1;
                background: transparent;
                border: 1px solid var(--border-color);
                color: var(--text-muted);
                padding: 10px;
                font-size: 0.9rem;
                font-weight: 600;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .mode-tab-btn:hover {
                background: rgba(255, 255, 255, 0.03);
                color: var(--text-normal);
            }
            .mode-tab-btn.active {
                background: linear-gradient(135deg, var(--accent-secondary), var(--accent-purple));
                color: #fff;
                border-color: transparent;
                box-shadow: 0 0 12px rgba(6, 182, 212, 0.35);
            }
            
            .challenge-box {
                background: rgba(245, 158, 11, 0.03);
                border: 1.5px dashed rgba(245, 158, 11, 0.3);
                border-radius: var(--border-radius-sm);
                padding: 20px;
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
            }
            .challenge-box.completed {
                background: rgba(16, 185, 129, 0.05);
                border: 1.5px solid rgba(16, 185, 129, 0.4);
            }
            .challenge-title {
                color: var(--warning);
                font-size: 0.8rem;
                font-weight: 800;
                text-transform: uppercase;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .challenge-title.completed {
                color: var(--success);
            }
            .challenge-desc {
                font-size: 1.05rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 12px;
                line-height: 1.4;
            }
            
            @keyframes quest-pulse {
                0% { box-shadow: 0 0 4px rgba(16, 185, 129, 0.2); }
                50% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
                100% { box-shadow: 0 0 4px rgba(16, 185, 129, 0.2); }
            }
            
            .success-toast {
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid var(--success);
                color: #6ee7b7;
                padding: 12px;
                border-radius: var(--border-radius-sm);
                font-size: 0.85rem;
                text-align: center;
                font-weight: bold;
                margin-top: 10px;
                animation: quest-pulse 2s infinite;
            }
        </style>

        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Sector 03: Digital Core
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>Digital Logic Gates Workbench</h2>
                <p>Toggle binary inputs, synthesize standard gate behaviors, and trace electric charge streams directly through logic structures in Sandbox or Challenge modes.</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Top Sandbox vs Challenge selector -->
                    <div class="mode-tab-bar">
                        <button class="mode-tab-btn active" id="mode-sandbox-btn">
                            <i data-lucide="terminal"></i> Sandbox Workbench
                        </button>
                        <button class="mode-tab-btn" id="mode-challenge-btn">
                            <i data-lucide="trophy"></i> Gate Challenge Mode
                        </button>
                    </div>

                    <!-- Challenge Card Panel (Initially hidden) -->
                    <div class="challenge-box" id="challenge-card-deck" style="display: none;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div class="challenge-title" id="challenge-deck-title">
                                <i data-lucide="award"></i> ACTIVE LOGIC TARGET
                            </div>
                            <span id="challenge-score-readout" style="font-family: monospace; font-size: 0.8rem; color: var(--text-secondary); font-weight: bold;">Solved: 0/5</span>
                        </div>
                        <div class="challenge-desc" id="challenge-quest-desc">
                            Adjust gate and inputs to output 1 for XOR gate
                        </div>
                        <div class="success-toast" id="challenge-success-toast" style="display: none;">
                            🎉 TARGET SOLVED! Glowing logic pathway validated.
                        </div>
                        <button class="btn btn-primary" id="btn-next-quest" style="width: 100%; margin-top: 14px; display: none;">
                            Next Quest Challenge <i data-lucide="arrow-right"></i>
                        </button>
                    </div>

                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 380px;">
                        <div class="visualizer-labels">
                            <span class="status-indicator completed"></span> Gate Schematic Visualizer
                        </div>
                        <!-- Schematic Canvas -->
                        <canvas id="gates-canvas" class="visualizer-canvas gates-sandbox-canvas"></canvas>
                    </div>
                    
                    <!-- Dynamic Truth Table -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="color: var(--accent-secondary); margin-bottom: 16px;">Live Boolean Truth Table</h3>
                        <div class="truth-table-wrapper">
                            <table class="truth-table" id="truth-table-body">
                                <!-- Populated dynamically by JS -->
                            </table>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">Digital Logic Theory</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>Boolean Logic Lab Exercises</h3>
                            <p>Interact with the logic gate simulator using these steps:</p>
                            <ul>
                                <li><strong>Experiment 1: Input Toggling</strong> - Select the <strong>AND Gate</strong> in the control panel. Click the **Input A** and **Input B** toggle buttons. Notice that the output LED and schematic lines only light up (high cyan) when <em>both</em> inputs are 1. Observe the live truth table row highlight shift accordingly.</li>
                                <li><strong>Experiment 2: Universal NAND Tying</strong> - Select the <strong>NAND Gate</strong>. Tie both inputs to 1. The output turns off (0). Tie both to 0, output is 1. NAND is a universal gate; this inversion behavior represents a NOT gate!</li>
                                <li><strong>Experiment 3: XOR Odd Detector</strong> - Select the <strong>XOR (Exclusive OR)</strong> gate. Observe that output is 1 ONLY when inputs are different (e.g. A=1, B=0). When both inputs are 1, output is 0. XOR is widely used as a digital parity odd-detector!</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>Digital Gate Physics</h3>
                            <p>In digital systems, continuous electrical voltages are partitioned into two discrete binary logic states:</p>
                            <ul>
                                <li><strong>Logic 1 (High):</strong> Typically $+5V$ or $+3.3V$, representing True or On.</li>
                                <li><strong>Logic 0 (Low):</strong> Typically $0V$ (Ground), representing False or Off.</li>
                            </ul>
                            <p><strong>Universal Gate Principle:</strong> NAND and NOR gates are defined as 'universal' because combinations of their logic gates can build AND, OR, and NOT gates, enabling complete computers to be fabricated from a single physical gate component block.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel">
                    <!-- Gate Selector Card -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="cpu"></i> Gate Select</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" id="gate-selection-grid">
                            <button class="toggle-btn active" data-gate="AND">AND</button>
                            <button class="toggle-btn" data-gate="OR">OR</button>
                            <button class="toggle-btn" data-gate="NOT">NOT</button>
                            <button class="toggle-btn" data-gate="NAND">NAND</button>
                            <button class="toggle-btn" data-gate="NOR">NOR</button>
                            <button class="toggle-btn" data-gate="XOR">XOR</button>
                            <button class="toggle-btn" data-gate="XNOR">XNOR</button>
                        </div>
                    </div>
                    
                    <!-- Input Toggles Card -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="toggle-left"></i> Gate Inputs</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            <button class="toggle-btn" id="btn-input-a" style="border: 1px solid var(--border-color); font-size: 1rem;">
                                Input A: <span style="font-weight: 800;" id="val-input-a">0</span>
                            </button>
                            <button class="toggle-btn" id="btn-input-b" style="border: 1px solid var(--border-color); font-size: 1rem;">
                                Input B: <span style="font-weight: 800;" id="val-input-b">0</span>
                            </button>
                        </div>
                        
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Logical Output Y:</span>
                                <span id="readout-output-y" style="color: var(--text-muted); font-weight: bold; font-size: 1rem;">0 (LOW)</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lab Actions -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-gates-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                            <i data-lucide="refresh-cw"></i> Reset Inputs
                        </button>
                        <a href="#/quiz" class="btn btn-primary" style="width: 100%;">
                            <i data-lucide="award"></i> Enter Sector Quiz
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Canvas animation states
let animationFrameId = null;
let activeTabHandler = null;
let activeGateHandler = null;

export const mount = () => {
    // 1. Hook up explanation tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    activeTabHandler = (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        e.currentTarget.classList.add('active');
        document.getElementById(`tab-${targetTab}`).classList.add('active');
    };
    tabButtons.forEach(btn => btn.addEventListener('click', activeTabHandler));

    // Sandbox vs Challenge tabs
    const modeSandboxBtn = document.getElementById('mode-sandbox-btn');
    const modeChallengeBtn = document.getElementById('mode-challenge-btn');
    const challengeCardDeck = document.getElementById('challenge-card-deck');
    
    let activeMode = 'sandbox'; // sandbox vs challenge

    modeSandboxBtn.addEventListener('click', () => {
        modeSandboxBtn.classList.add('active');
        modeChallengeBtn.classList.remove('active');
        challengeCardDeck.style.display = 'none';
        activeMode = 'sandbox';
        refreshGateState();
    });

    modeChallengeBtn.addEventListener('click', () => {
        modeChallengeBtn.classList.add('active');
        modeSandboxBtn.classList.remove('active');
        challengeCardDeck.style.display = 'block';
        activeMode = 'challenge';
        refreshGateState();
    });

    // 2. Logic and Challenge lists
    let activeGate = 'AND';
    let inputA = 0;
    let inputB = 0;
    let outputY = 0;

    const challenges = [
        { text: "Make Output Y = 1 using the XOR gate.", validate: (g, a, b, y) => g === 'XOR' && y === 1 },
        { text: "Make Output Y = 0 using the NOR gate with both inputs equal to 0.", validate: (g, a, b, y) => g === 'NOR' && a === 0 && b === 0 && y === 0 },
        { text: "Make Output Y = 0 using the NOT gate.", validate: (g, a, b, y) => g === 'NOT' && y === 0 },
        { text: "Make Output Y = 1 using the NAND gate with Input A = 0 and Input B = 1.", validate: (g, a, b, y) => g === 'NAND' && a === 0 && b === 1 && y === 1 },
        { text: "Make Output Y = 1 using the XNOR gate.", validate: (g, a, b, y) => g === 'XNOR' && y === 1 }
    ];
    let currQuestIndex = 0;
    let score = 0;
    let isCurrentQuestSolved = false;

    // Canvas init
    const canvas = document.getElementById('gates-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = 380;
    
    const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 380;
    };
    window.addEventListener('resize', handleResize);
    canvas._resizeHandler = handleResize;

    // Logic gate outputs
    function evaluateGate(gate, a, b) {
        switch (gate) {
            case 'AND': return a && b ? 1 : 0;
            case 'OR':  return a || b ? 1 : 0;
            case 'NOT': return a ? 0 : 1; // Ignores B
            case 'NAND': return !(a && b) ? 1 : 0;
            case 'NOR':  return !(a || b) ? 1 : 0;
            case 'XOR':  return a !== b ? 1 : 0;
            case 'XNOR': return a === b ? 1 : 0;
            default: return 0;
        }
    }

    // Refresh UI updates
    const btnInputA = document.getElementById('btn-input-a');
    const btnInputB = document.getElementById('btn-input-b');
    
    const valInputA = document.getElementById('val-input-a');
    const valInputB = document.getElementById('val-input-b');
    const readoutOutputY = document.getElementById('readout-output-y');

    const questDesc = document.getElementById('challenge-quest-desc');
    const successToast = document.getElementById('challenge-success-toast');
    const btnNextQuest = document.getElementById('btn-next-quest');
    const scoreReadout = document.getElementById('challenge-score-readout');
    const challengeDeckTitle = document.getElementById('challenge-deck-title');
    const challengeCardDeckE = document.getElementById('challenge-card-deck');
    
    function refreshGateState() {
        outputY = evaluateGate(activeGate, inputA, inputB);
        
        valInputA.textContent = inputA;
        valInputB.textContent = inputB;
        
        // Color inputs toggles active
        if (inputA) {
            btnInputA.classList.add('active');
        } else {
            btnInputA.classList.remove('active');
        }
        if (inputB && activeGate !== 'NOT') {
            btnInputB.classList.add('active');
        } else {
            btnInputB.classList.remove('active');
        }
        
        // Hide input B for NOT gate
        if (activeGate === 'NOT') {
            btnInputB.style.display = 'none';
        } else {
            btnInputB.style.display = 'block';
        }
        
        // Readout
        if (outputY) {
            readoutOutputY.textContent = '1 (HIGH)';
            readoutOutputY.style.color = 'var(--accent-secondary)';
        } else {
            readoutOutputY.textContent = '0 (LOW)';
            readoutOutputY.style.color = 'var(--text-muted)';
        }
        
        renderTruthTable();

        // Challenge Validation
        if (activeMode === 'challenge') {
            const currentQuest = challenges[currQuestIndex];
            questDesc.textContent = currentQuest.text;
            scoreReadout.textContent = `Solved: ${score}/${challenges.length}`;
            
            const matched = currentQuest.validate(activeGate, inputA, inputB, outputY);
            if (matched && !isCurrentQuestSolved) {
                isCurrentQuestSolved = true;
                score++;
                scoreReadout.textContent = `Solved: ${score}/${challenges.length}`;
                successToast.style.display = 'block';
                btnNextQuest.style.display = 'block';
                challengeCardDeckE.classList.add('completed');
                challengeDeckTitle.classList.add('completed');
                challengeDeckTitle.innerHTML = `<i data-lucide="check-circle" style="color:var(--success)"></i> CHALLENGE COMPLETED`;
            }
        }
    }

    // Next quest click
    btnNextQuest.addEventListener('click', () => {
        isCurrentQuestSolved = false;
        successToast.style.display = 'none';
        btnNextQuest.style.display = 'none';
        challengeCardDeckE.classList.remove('completed');
        challengeDeckTitle.classList.remove('completed');
        challengeDeckTitle.innerHTML = `<i data-lucide="award"></i> ACTIVE LOGIC TARGET`;
        
        currQuestIndex = (currQuestIndex + 1) % challenges.length;
        if (currQuestIndex === 0) {
            // cycle done, reset score
            score = 0;
        }
        refreshGateState();
    });

    // Input switch listeners
    btnInputA.addEventListener('click', () => {
        inputA = inputA ? 0 : 1;
        refreshGateState();
    });
    btnInputB.addEventListener('click', () => {
        inputB = inputB ? 0 : 1;
        refreshGateState();
    });

    // Gate Select triggers
    const gateButtons = document.querySelectorAll('[data-gate]');
    activeGateHandler = (e) => {
        gateButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeGate = e.currentTarget.getAttribute('data-gate');
        refreshGateState();
    };
    gateButtons.forEach(btn => btn.addEventListener('click', activeGateHandler));

    // Reset inputs
    const btnReset = document.getElementById('btn-gates-reset');
    btnReset.addEventListener('click', () => {
        inputA = 0;
        inputB = 0;
        refreshGateState();
    });

    // Draw active truth table rows
    function renderTruthTable() {
        const table = document.getElementById('truth-table-body');
        if (!table) return;
        
        let html = '';
        if (activeGate === 'NOT') {
            html += `
                <tr>
                    <th>Input A</th>
                    <th>Output Y</th>
                </tr>
                <tr class="${inputA === 0 ? 'active-row' : ''}">
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr class="${inputA === 1 ? 'active-row' : ''}">
                    <td>1</td>
                    <td>0</td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <th>Input A</th>
                    <th>Input B</th>
                    <th>Output Y</th>
                </tr>
            `;
            
            const rows = [
                {a: 0, b: 0},
                {a: 0, b: 1},
                {a: 1, b: 0},
                {a: 1, b: 1}
            ];
            
            rows.forEach(r => {
                const isActive = (inputA === r.a && inputB === r.b);
                const outVal = evaluateGate(activeGate, r.a, r.b);
                html += `
                    <tr class="${isActive ? 'active-row' : ''}">
                        <td>${r.a}</td>
                        <td>${r.b}</td>
                        <td>${outVal}</td>
                    </tr>
                `;
            });
        }
        
        table.innerHTML = html;
    }

    refreshGateState();

    // 4. Main Animated Schematic Drawer Loop
    let particleOffset = 0;
    const drawSchematicLoop = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Grid lines overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 0.8;
        const gSpacing = 30;
        for (let x = 0; x < width; x += gSpacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += gSpacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Circuit coordinates
        const cX = width / 2;
        const cY = height / 2;
        
        const inAX = cX - 120;
        const inAY = activeGate === 'NOT' ? cY : cY - 45;
        
        const inBX = cX - 120;
        const inBY = cY + 45;
        
        const outX = cX + 120;
        const outY = cY;

        // Draw input wires paths
        // Wire A
        ctx.strokeStyle = inputA ? '#06b6d4' : '#2d3748';
        ctx.lineWidth = inputA ? 3.5 : 2;
        ctx.beginPath();
        ctx.moveTo(inAX - 20, inAY);
        ctx.lineTo(cX - 45, inAY);
        ctx.stroke();

        // Wire B
        if (activeGate !== 'NOT') {
            ctx.strokeStyle = inputB ? '#06b6d4' : '#2d3748';
            ctx.lineWidth = inputB ? 3.5 : 2;
            ctx.beginPath();
            ctx.moveTo(inBX - 20, inBY);
            ctx.lineTo(cX - 45, inBY);
            ctx.stroke();
        }

        // Draw output wire path
        // Special color for celebration spark
        const isSol = activeMode === 'challenge' && isCurrentQuestSolved;
        ctx.strokeStyle = isSol ? '#10b981' : (outputY ? '#06b6d4' : '#2d3748');
        ctx.lineWidth = outputY ? 3.5 : 2;
        ctx.beginPath();
        ctx.moveTo(activeGate === 'NAND' || activeGate === 'NOR' || activeGate === 'XNOR' ? cX + 55 : cX + 45, cY);
        ctx.lineTo(outX + 20, outY);
        ctx.stroke();

        // Draw moving charge pulses along the active wires
        ctx.fillStyle = isSol ? '#10b981' : '#fff';
        particleOffset = (particleOffset + (isSol ? 1.8 : 0.9)) % 30;
        
        // Input A dots
        if (inputA) {
            for (let d = inAX - 20 + particleOffset; d < cX - 45; d += 35) {
                ctx.beginPath(); ctx.arc(d, inAY, 3, 0, Math.PI*2); ctx.fill();
            }
        }
        // Input B dots
        if (inputB && activeGate !== 'NOT') {
            for (let d = inBX - 20 + particleOffset; d < cX - 45; d += 35) {
                ctx.beginPath(); ctx.arc(d, inBY, 3, 0, Math.PI*2); ctx.fill();
            }
        }
        // Output dots
        if (outputY) {
            const outStart = activeGate === 'NAND' || activeGate === 'NOR' || activeGate === 'XNOR' ? cX + 55 : cX + 45;
            for (let d = outStart + particleOffset; d < outX + 20; d += 35) {
                ctx.beginPath(); ctx.arc(d, outY, 3, 0, Math.PI*2); ctx.fill();
            }
        }

        // Draw Input nodes (switches)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        
        // Node A
        ctx.fillStyle = inputA ? '#06b6d4' : 'rgba(255,255,255,0.03)';
        ctx.beginPath(); ctx.arc(inAX - 20, inAY, 7, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px var(--font-heading)';
        ctx.textAlign = 'center';
        ctx.fillText('A', inAX - 20, inAY - 12);
        
        // Node B
        if (activeGate !== 'NOT') {
            ctx.fillStyle = inputB ? '#06b6d4' : 'rgba(255,255,255,0.03)';
            ctx.beginPath(); ctx.arc(inBX - 20, inBY, 7, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.fillText('B', inBX - 20, inBY - 12);
        }

        // Draw glowing output LED
        ctx.fillStyle = isSol ? '#10b981' : (outputY ? '#06b6d4' : 'rgba(255,255,255,0.03)');
        ctx.strokeStyle = isSol ? '#6ee7b7' : (outputY ? '#22d3ee' : 'rgba(255,255,255,0.15)');
        ctx.lineWidth = outputY ? 2.5 : 1;
        ctx.beginPath();
        ctx.arc(outX + 25, outY, 12, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        
        // LED light beam
        if (outputY || isSol) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(outX + 25, outY, 25, 0, Math.PI*2);
            const grad = ctx.createRadialGradient(outX + 25, outY, 5, outX + 25, outY, 25);
            grad.addColorStop(0, isSol ? 'rgba(16, 185, 129, 0.45)' : 'rgba(6, 182, 212, 0.45)');
            grad.addColorStop(1, isSol ? 'rgba(16, 185, 129, 0)' : 'rgba(6, 182, 212, 0)');
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px var(--font-heading)';
        ctx.fillText('OUT Y', outX + 25, outY - 18);

        // --- DRAW STANDARDIZED GATE SYMBOLS IN CENTER ---
        ctx.save();
        ctx.translate(cX, cY);
        ctx.strokeStyle = isSol ? '#6ee7b7' : 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 3.5;
        ctx.fillStyle = '#0f172a'; // solid backing dark
        
        switch (activeGate) {
            case 'AND':
                ctx.beginPath();
                ctx.moveTo(-40, -45);
                ctx.lineTo(0, -45);
                ctx.arc(0, 0, 45, -Math.PI/2, Math.PI/2);
                ctx.lineTo(-40, 45);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;
                
            case 'OR':
                ctx.beginPath();
                ctx.moveTo(-45, -45);
                ctx.quadraticCurveTo(-20, 0, -45, 45);
                ctx.lineTo(0, 45);
                ctx.quadraticCurveTo(35, 30, 45, 0);
                ctx.quadraticCurveTo(35, -30, 0, -45);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;
                
            case 'NOT':
                ctx.beginPath();
                ctx.moveTo(-35, -35);
                ctx.lineTo(20, 0);
                ctx.lineTo(-35, 35);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Inverter bubble
                ctx.beginPath();
                ctx.arc(28, 0, 7, 0, Math.PI*2);
                ctx.fillStyle = '#0f172a';
                ctx.fill(); ctx.stroke();
                break;
                
            case 'NAND':
                ctx.beginPath();
                ctx.moveTo(-45, -45);
                ctx.lineTo(-5, -45);
                ctx.arc(-5, 0, 45, -Math.PI/2, Math.PI/2);
                ctx.lineTo(-45, 45);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Bubble
                ctx.beginPath();
                ctx.arc(48, 0, 7, 0, Math.PI*2);
                ctx.fillStyle = '#0f172a';
                ctx.fill(); ctx.stroke();
                break;
                
            case 'NOR':
                ctx.beginPath();
                ctx.moveTo(-45, -45);
                ctx.quadraticCurveTo(-20, 0, -45, 45);
                ctx.lineTo(-5, 45);
                ctx.quadraticCurveTo(30, 30, 40, 0);
                ctx.quadraticCurveTo(30, -30, -5, -45);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Bubble
                ctx.beginPath();
                ctx.arc(49, 0, 7, 0, Math.PI*2);
                ctx.fillStyle = '#0f172a';
                ctx.fill(); ctx.stroke();
                break;
                
            case 'XOR':
                // Extra input arc
                ctx.beginPath();
                ctx.arc(-58, 0, 45, -Math.PI/3, Math.PI/3);
                ctx.strokeStyle = isSol ? '#6ee7b7' : 'rgba(255,255,255,0.85)';
                ctx.stroke();
                
                // OR body
                ctx.beginPath();
                ctx.moveTo(-45, -45);
                ctx.quadraticCurveTo(-20, 0, -45, 45);
                ctx.lineTo(0, 45);
                ctx.quadraticCurveTo(35, 30, 45, 0);
                ctx.quadraticCurveTo(35, -30, 0, -45);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;
                
            case 'XNOR':
                // Extra input arc
                ctx.beginPath();
                ctx.arc(-58, 0, 45, -Math.PI/3, Math.PI/3);
                ctx.strokeStyle = isSol ? '#6ee7b7' : 'rgba(255,255,255,0.85)';
                ctx.stroke();
                
                // OR body
                ctx.beginPath();
                ctx.moveTo(-45, -45);
                ctx.quadraticCurveTo(-20, 0, -45, 45);
                ctx.lineTo(-5, 45);
                ctx.quadraticCurveTo(30, 30, 40, 0);
                ctx.quadraticCurveTo(30, -30, -5, -45);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Bubble
                ctx.beginPath();
                ctx.arc(49, 0, 7, 0, Math.PI*2);
                ctx.fillStyle = '#0f172a';
                ctx.fill(); ctx.stroke();
                break;
        }
        
        // Write gate label inside gate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 11px var(--font-heading)';
        ctx.textAlign = 'center';
        const labelOffset = activeGate === 'NOT' ? -12 : (activeGate === 'NAND' || activeGate === 'NOR' || activeGate === 'XNOR' ? -10 : -3);
        ctx.fillText(activeGate, labelOffset, 4);
        
        ctx.restore();

        animationFrameId = requestAnimationFrame(drawSchematicLoop);
    };

    drawSchematicLoop();
};

export const unmount = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (activeTabHandler) {
        tabButtons.forEach(btn => btn.removeEventListener('click', activeTabHandler));
    }
    
    const gateButtons = document.querySelectorAll('[data-gate]');
    if (activeGateHandler) {
        gateButtons.forEach(btn => btn.removeEventListener('click', activeGateHandler));
    }
    
    const canvas = document.getElementById('gates-canvas');
    if (canvas && canvas._resizeHandler) {
        window.removeEventListener('resize', canvas._resizeHandler);
    }
};
