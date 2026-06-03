/**
 * Nextron - Sequential Flip-Flops Simulation View
 */

export const render = async () => {
    return `
        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Sector 04: Digital Memory
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>Sequential Flip-Flops & Memory</h2>
                <p>Observe gate-feedback loops storing binary data, trigger clock edges manually, and benchmark timing history waveforms.</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 380px;">
                        <div class="visualizer-labels">
                            <span class="status-indicator completed"></span> Latch Logic Feedback Diagram
                        </div>
                        <!-- Schematic Canvas -->
                        <canvas id="flipflops-canvas" class="visualizer-canvas gates-sandbox-canvas"></canvas>
                    </div>
                    
                    <!-- Dynamic Wave Timing Diagram -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="color: var(--accent-secondary); margin-bottom: 16px;">Logic Wave Timing Diagram</h3>
                        <div class="visualizer-wrapper" style="height: 180px; background: #020409;">
                            <canvas id="timing-canvas" class="visualizer-canvas"></canvas>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">Sequential Theory</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>Sequential Memory Lab Exercises</h3>
                            <p>Follow these experiments to analyze logic memory cells:</p>
                            <ul>
                                <li><strong>Experiment 1: SR Set & Reset</strong> - Select the <strong>SR Latch</strong> in the control panel. Click the **Input S (Set)** button to 1. Notice Output Q turns high (1) and Q-bar turns low (0). Now toggle S back to 0. Notice the Q output <em>holds</em> its state! You have successfully stored one bit of data. Click **Input R (Reset)** to 1 to clear the memory.</li>
                                <li><strong>Experiment 2: Forbidden Latch States</strong> - In SR Latch mode, toggle both S and R inputs to 1. Notice both Q and Q-bar drop to 0, which is invalid. Toggle both back to 0. The output enters an unpredictable race condition!</li>
                                <li><strong>Experiment 3: JK Edge-Triggering</strong> - Switch to the <strong>JK Flip-Flop</strong>. Toggle J to 1 and K to 0. Notice output Q remains 0. Click the **Trigger CLOCK** pulse button. On the clock edge trigger, the state updates! JK is edge-triggered.</li>
                                <li><strong>Experiment 4: Race-Around Toggle Mode</strong> - With the JK Flip-Flop selected, toggle J=1 and K=1. Click **Hold CLK High**. In level-triggered gates, when both inputs are 1, the output continuously toggles back and forth. Watch the race oscillation warning glow in action!</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>Sequential Feedback Physics</h3>
                            <p>Unlike basic combinational logic gates whose outputs depend solely on current inputs, <strong>sequential circuits</strong> contain memory. Their outputs are determined by both current inputs and the <strong>history of past states</strong>.</p>
                            <p><strong>Feedback Loop:</strong> Memory is created physically by connecting the output of one gate back to the input of another. In a cross-coupled NAND latch, the output of Gate 1 keeps Gate 2 stable, and vice-versa, creating two stable conditions (0 and 1).</p>
                            <p><strong>Race-Around Problem:</strong> In JK flip-flops, when J=1 and K=1, the outputs toggle. If the clock stays high ($CLK=1$) longer than the internal gate propagation delays, the output toggles repeatedly, resulting in an unpredictable state when clock falls. This is resolved using **edge-triggering** (e.g. Master-Slave flip-flops) that capture values only during sub-nanosecond clock edge transitions.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel">
                    <!-- Mode Selector Card -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="cpu"></i> Circuit Select</h3>
                        <div class="toggle-group">
                            <button class="toggle-btn active" id="btn-mode-sr">SR Latch</button>
                            <button class="toggle-btn" id="btn-mode-jk">JK Flip-Flop</button>
                        </div>
                    </div>
                    
                    <!-- Input Toggles Card -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="toggle-left"></i> Inputs</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            <button class="toggle-btn" id="btn-input-1" style="border: 1px solid var(--border-color); font-size: 1rem;">
                                <span id="label-input-1">S (Set)</span>: <span style="font-weight: 800;" id="val-input-1">0</span>
                            </button>
                            <button class="toggle-btn" id="btn-input-2" style="border: 1px solid var(--border-color); font-size: 1rem;">
                                <span id="label-input-2">R (Reset)</span>: <span style="font-weight: 800;" id="val-input-2">0</span>
                            </button>
                        </div>
                        
                        <!-- CLOCK Pulse button -->
                        <div id="clock-controls-container" style="display: none; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                            <button class="btn btn-primary" id="btn-clk-pulse" style="width: 100%;">
                                <i data-lucide="square-play"></i> Trigger CLOCK Edge
                            </button>
                            <button class="btn btn-secondary" id="btn-clk-hold" style="width: 100%; font-size: 0.85rem; padding: 8px;">
                                <i data-lucide="zap"></i> Hold CLK High
                            </button>
                        </div>
                        
                        <!-- Readout -->
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Output Q:</span>
                                <span id="readout-q" style="color: var(--text-muted); font-weight: bold;">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Output Q-bar:</span>
                                <span id="readout-qbar" style="color: var(--text-muted); font-weight: bold;">1</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lab Actions -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-flipflops-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
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

export const mount = () => {
    // 1. Hook up tabs
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

    // 2. Logic parameters
    let isSRMode = true; // false = JK Flip-Flop
    let in1 = 0; // S or J
    let in2 = 0; // R or K
    let clk = 0;
    let holdClkHigh = false;
    
    let outQ = 0;
    let outQBar = 1;
    
    // Waveforms histories arrays for timing diagram
    const timingHistory = {
        clk: Array(100).fill(0),
        in1: Array(100).fill(0),
        in2: Array(100).fill(0),
        q: Array(100).fill(0)
    };

    // Canvas setups
    const mainCanvas = document.getElementById('flipflops-canvas');
    const timingCanvas = document.getElementById('timing-canvas');
    if (!mainCanvas || !timingCanvas) return;
    
    const mCtx = mainCanvas.getContext('2d');
    const tCtx = timingCanvas.getContext('2d');
    
    let mWidth = mainCanvas.width = mainCanvas.parentElement.clientWidth;
    let mHeight = mainCanvas.height = 380;
    
    let tWidth = timingCanvas.width = timingCanvas.parentElement.clientWidth;
    let tHeight = timingCanvas.height = 180;
    
    const handleResize = () => {
        if (!mainCanvas || !timingCanvas) return;
        mWidth = mainCanvas.width = mainCanvas.parentElement.clientWidth;
        tWidth = timingCanvas.width = timingCanvas.parentElement.clientWidth;
        mHeight = mainCanvas.height = 380;
        tHeight = timingCanvas.height = 180;
    };
    window.addEventListener('resize', handleResize);
    mainCanvas._resizeHandler = handleResize;

    // Controls DOM
    const btnModeSR = document.getElementById('btn-mode-sr');
    const btnModeJK = document.getElementById('btn-mode-jk');
    
    const btnInput1 = document.getElementById('btn-input-1');
    const btnInput2 = document.getElementById('btn-input-2');
    const labelInput1 = document.getElementById('label-input-1');
    const labelInput2 = document.getElementById('label-input-2');
    const valInput1 = document.getElementById('val-input-1');
    const valInput2 = document.getElementById('val-input-2');
    
    const clockContainer = document.getElementById('clock-controls-container');
    const btnClkPulse = document.getElementById('btn-clk-pulse');
    const btnClkHold = document.getElementById('btn-clk-hold');
    
    const readQ = document.getElementById('readout-q');
    const readQBar = document.getElementById('readout-qbar');

    // Switch between Latch and JK Flip-Flop
    btnModeSR.addEventListener('click', () => {
        isSRMode = true;
        btnModeSR.classList.add('active');
        btnModeJK.classList.remove('active');
        clockContainer.style.display = 'none';
        labelInput1.textContent = 'S (Set)';
        labelInput2.textContent = 'R (Reset)';
        holdClkHigh = false;
        btnClkHold.classList.remove('active');
        resetState();
    });

    btnModeJK.addEventListener('click', () => {
        isSRMode = false;
        btnModeSR.classList.remove('active');
        btnModeJK.classList.add('active');
        clockContainer.style.display = 'flex';
        labelInput1.textContent = 'J (Jack)';
        labelInput2.textContent = 'K (King)';
        resetState();
    });

    function resetState() {
        in1 = 0;
        in2 = 0;
        outQ = 0;
        outQBar = 1;
        clk = 0;
        refreshUI();
    }

    // Toggle Inputs
    btnInput1.addEventListener('click', () => {
        in1 = in1 ? 0 : 1;
        if (isSRMode) {
            evaluateSR();
        }
        refreshUI();
    });

    btnInput2.addEventListener('click', () => {
        in2 = in2 ? 0 : 1;
        if (isSRMode) {
            evaluateSR();
        }
        refreshUI();
    });

    // Clock Actions
    btnClkPulse.addEventListener('click', () => {
        if (isSRMode) return;
        // Edge trigger simulator: pulse goes 0 -> 1 -> 0 quickly
        clk = 1;
        evaluateJK(true); // Rising edge!
        refreshUI();
        setTimeout(() => {
            clk = 0;
            refreshUI();
        }, 120);
    });

    btnClkHold.addEventListener('click', () => {
        if (isSRMode) return;
        holdClkHigh = !holdClkHigh;
        if (holdClkHigh) {
            btnClkHold.classList.add('active');
            clk = 1;
            evaluateJK(true);
        } else {
            btnClkHold.classList.remove('active');
            clk = 0;
        }
        refreshUI();
    });

    // Reset button
    const btnReset = document.getElementById('btn-flipflops-reset');
    btnReset.addEventListener('click', () => {
        resetState();
    });

    // SR Latch evaluators (level triggered)
    function evaluateSR() {
        if (in1 === 1 && in2 === 0) {
            outQ = 1; outQBar = 0;
        } else if (in1 === 0 && in2 === 1) {
            outQ = 0; outQBar = 1;
        } else if (in1 === 1 && in2 === 1) {
            // invalid state
            outQ = 0; outQBar = 0;
        }
        // If 0,0 - Q keeps its past state!
    }

    // JK Flip Flop evaluators
    function evaluateJK(isEdgeTrigger) {
        if (!isEdgeTrigger) return;
        
        if (in1 === 1 && in2 === 0) {
            outQ = 1; outQBar = 0;
        } else if (in1 === 0 && in2 === 1) {
            outQ = 0; outQBar = 1;
        } else if (in1 === 1 && in2 === 1) {
            // Toggle outputs!
            const prevQ = outQ;
            outQ = outQBar;
            outQBar = prevQ;
        }
    }

    function refreshUI() {
        valInput1.textContent = in1;
        valInput2.textContent = in2;
        
        if (in1) btnInput1.classList.add('active');
        else btnInput1.classList.remove('active');
        
        if (in2) btnInput2.classList.add('active');
        else btnInput2.classList.remove('active');

        readQ.textContent = outQ;
        readQBar.textContent = outQBar;
    }

    // Capture timing history data
    function updateWaveHistory() {
        timingHistory.clk.push(clk);
        timingHistory.clk.shift();
        
        timingHistory.in1.push(in1);
        timingHistory.in1.shift();
        
        timingHistory.in2.push(in2);
        timingHistory.in2.shift();
        
        timingHistory.q.push(outQ);
        timingHistory.q.shift();
    }

    // 3. Main Loop
    let raceTick = 0;
    let particleOffset = 0;
    const runFlipflopLoop = () => {
        // --- 1. HANDLE RACE CONDITION RAPID TOGGLING ---
        // Level-triggered race condition: If J=1, K=1, and CLK=1 (and not edge triggered)
        if (!isSRMode && in1 === 1 && in2 === 1 && clk === 1 && holdClkHigh) {
            raceTick++;
            if (raceTick % 8 === 0) {
                // Toggles outputs frantically at 10Hz
                const prevQ = outQ;
                outQ = outQBar;
                outQBar = prevQ;
                refreshUI();
            }
        } else {
            raceTick = 0;
        }

        updateWaveHistory();

        // --- 2. DRAW INTERNAL LATCH GATE CIRCUIT DIAGRAM ---
        mCtx.clearRect(0, 0, mWidth, mHeight);
        
        // Faint grid background
        mCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        mCtx.lineWidth = 0.8;
        for (let x = 0; x < mWidth; x += 30) {
            mCtx.beginPath(); mCtx.moveTo(x, 0); mCtx.lineTo(x, mHeight); mCtx.stroke();
        }
        for (let y = 0; y < mHeight; y += 30) {
            mCtx.beginPath(); mCtx.moveTo(0, y); mCtx.lineTo(mWidth, y); mCtx.stroke();
        }

        const cX = mWidth / 2;
        const cY = mHeight / 2;
        
        // Draw cross-coupled Latch Box structure in center
        // Let's make it look like a gorgeous microchip diagram
        mCtx.save();
        mCtx.strokeStyle = (in1 === 1 && in2 === 1 && !isSRMode && clk === 1 && holdClkHigh)
            ? `rgba(239, 68, 68, ${0.4 + Math.sin(animationFrameId * 0.2) * 0.3})` // flashing red alert
            : 'rgba(99, 102, 241, 0.25)';
        mCtx.lineWidth = 4;
        mCtx.fillStyle = '#0f172a';
        mCtx.beginPath();
        mCtx.roundRect(cX - 110, cY - 100, 220, 200, 16);
        mCtx.fill(); mCtx.stroke();
        
        // Internal schematic labels
        mCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        mCtx.font = '800 15px var(--font-heading)';
        mCtx.textAlign = 'center';
        mCtx.fillText(isSRMode ? 'SR NOR LATCH' : 'JK EDGE-TRIGGERED FF', cX, cY - 70);
        
        // Input leads labels
        mCtx.font = 'bold 12px monospace';
        mCtx.fillStyle = in1 ? '#06b6d4' : 'rgba(255,255,255,0.4)';
        mCtx.fillText(isSRMode ? 'S (SET)' : 'J', cX - 85, cY - 40);
        
        mCtx.fillStyle = in2 ? '#06b6d4' : 'rgba(255,255,255,0.4)';
        mCtx.fillText(isSRMode ? 'R (RESET)' : 'K', cX - 85, cY + 40);
        
        if (!isSRMode) {
            mCtx.fillStyle = clk ? '#06b6d4' : 'rgba(255,255,255,0.4)';
            mCtx.fillText('CLK ⏵', cX - 85, cY);
        }
        
        // Output leads labels
        mCtx.fillStyle = outQ ? '#10b981' : 'rgba(255,255,255,0.4)';
        mCtx.fillText('Q', cX + 85, cY - 40);
        
        mCtx.fillStyle = outQBar ? '#10b981' : 'rgba(255,255,255,0.4)';
        mCtx.fillText('Q̅', cX + 85, cY + 40);
        
        // Draw cross feedback paths (cross lines inside box)
        mCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        mCtx.lineWidth = 2.5;
        mCtx.beginPath();
        mCtx.moveTo(cX - 30, cY - 40); mCtx.lineTo(cX + 30, cY + 40);
        mCtx.moveTo(cX - 30, cY + 40); mCtx.lineTo(cX + 30, cY - 40);
        mCtx.stroke();
        
        // Active feedback glow animation
        mCtx.strokeStyle = outQ ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.03)';
        mCtx.beginPath();
        mCtx.moveTo(cX - 30, cY + 40); mCtx.lineTo(cX + 30, cY - 40);
        mCtx.stroke();
        
        mCtx.strokeStyle = outQBar ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.03)';
        mCtx.beginPath();
        mCtx.moveTo(cX - 30, cY - 40); mCtx.lineTo(cX + 30, cY + 40);
        mCtx.stroke();
        
        mCtx.restore();

        // Input wire pins lines
        mCtx.strokeStyle = in1 ? '#06b6d4' : '#2d3748';
        mCtx.lineWidth = in1 ? 3.5 : 2;
        mCtx.beginPath(); mCtx.moveTo(cX - 180, cY - 40); mCtx.lineTo(cX - 110, cY - 40); mCtx.stroke();
        
        mCtx.strokeStyle = in2 ? '#06b6d4' : '#2d3748';
        mCtx.lineWidth = in2 ? 3.5 : 2;
        mCtx.beginPath(); mCtx.moveTo(cX - 180, cY + 40); mCtx.lineTo(cX - 110, cY + 40); mCtx.stroke();
        
        if (!isSRMode) {
            mCtx.strokeStyle = clk ? '#06b6d4' : '#2d3748';
            mCtx.lineWidth = clk ? 3.5 : 2;
            mCtx.beginPath(); mCtx.moveTo(cX - 180, cY); mCtx.lineTo(cX - 110, cY); mCtx.stroke();
        }
        
        // Output wire pins lines
        mCtx.strokeStyle = outQ ? '#10b981' : '#2d3748';
        mCtx.lineWidth = outQ ? 3.5 : 2;
        mCtx.beginPath(); mCtx.moveTo(cX + 110, cY - 40); mCtx.lineTo(cX + 180, cY - 40); mCtx.stroke();
        
        mCtx.strokeStyle = outQBar ? '#10b981' : '#2d3748';
        mCtx.lineWidth = outQBar ? 3.5 : 2;
        mCtx.beginPath(); mCtx.moveTo(cX + 110, cY + 40); mCtx.lineTo(cX + 180, cY + 40); mCtx.stroke();

        // Alert visual overlay for race condition
        if (!isSRMode && in1 === 1 && in2 === 1 && clk === 1 && holdClkHigh) {
            mCtx.fillStyle = 'rgba(239, 68, 68, 0.08)';
            mCtx.fillRect(cX - 110, cY - 100, 220, 200);
            
            mCtx.fillStyle = '#ef4444';
            mCtx.font = 'bold 11px var(--font-heading)';
            mCtx.textAlign = 'center';
            mCtx.fillText('⚠ RACE-AROUND INSTABILITY ACTIVATED', cX, cY + 82);
        }

        // --- 3. DRAW TIMING DIAGRAM ON WAVE CANVAS ---
        tCtx.clearRect(0, 0, tWidth, tHeight);
        
        // Timeline grids
        tCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        tCtx.lineWidth = 1;
        const colSpacing = tWidth / 10;
        for (let i = 0; i < 10; i++) {
            tCtx.beginPath(); tCtx.moveTo(i * colSpacing, 0); tCtx.lineTo(i * colSpacing, tHeight); tCtx.stroke();
        }
        
        const rowCount = isSRMode ? 3 : 4;
        const rowHeight = tHeight / rowCount;
        
        // Draw division text lines
        tCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        for (let i = 1; i < rowCount; i++) {
            tCtx.beginPath(); tCtx.moveTo(0, i * rowHeight); tCtx.lineTo(tWidth, i * rowHeight); tCtx.stroke();
        }

        // Draw individual waveforms
        const drawWave = (label, data, rowIndex, color) => {
            const startY = rowIndex * rowHeight + rowHeight * 0.75;
            const highY = rowIndex * rowHeight + rowHeight * 0.25;
            
            // Label
            tCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            tCtx.font = 'bold 9px monospace';
            tCtx.textAlign = 'left';
            tCtx.fillText(label, 8, rowIndex * rowHeight + 16);
            
            tCtx.strokeStyle = color;
            tCtx.lineWidth = 1.8;
            tCtx.beginPath();
            
            const stepX = tWidth / 100;
            
            for (let i = 0; i < 100; i++) {
                const xCoord = i * stepX;
                const activeVal = data[i];
                const targetY = activeVal ? highY : startY;
                
                if (i === 0) {
                    tCtx.moveTo(xCoord, targetY);
                } else {
                    const prevVal = data[i-1];
                    if (prevVal !== activeVal) {
                        // Draw sharp vertical transition edge
                        tCtx.lineTo(xCoord, targetY);
                    }
                    tCtx.lineTo(xCoord, targetY);
                }
            }
            tCtx.stroke();
        };

        if (isSRMode) {
            drawWave('INPUT S', timingHistory.in1, 0, '#06b6d4');
            drawWave('INPUT R', timingHistory.in2, 1, '#06b6d4');
            drawWave('OUTPUT Q', timingHistory.q, 2, '#10b981');
        } else {
            drawWave('CLOCK CLK', timingHistory.clk, 0, '#6366f1');
            drawWave('INPUT J', timingHistory.in1, 1, '#06b6d4');
            drawWave('INPUT K', timingHistory.in2, 2, '#06b6d4');
            drawWave('OUTPUT Q', timingHistory.q, 3, '#10b981');
        }

        animationFrameId = requestAnimationFrame(runFlipflopLoop);
    };

    runFlipflopLoop();
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
    
    const mainCanvas = document.getElementById('flipflops-canvas');
    if (mainCanvas && mainCanvas._resizeHandler) {
        window.removeEventListener('resize', mainCanvas._resizeHandler);
    }
};
