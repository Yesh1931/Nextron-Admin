/**
 * Nextron - PN Junction Diode Simulation View
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
                    Sector 01: Semiconductors
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>PN Junction Diode Laboratory</h2>
                <p>Manipulate voltage bias, thermal levels, and carrier doping to observe the quantum mechanical boundaries of semiconductors in real-time.</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 440px;">
                        <div class="visualizer-labels">
                            <span class="status-indicator completed"></span> Real-time Bias Physics & I-V Analyzer
                        </div>
                        <div class="diode-split" style="height: 100%;">
                            <!-- Left: Charge Carrier Physics Model -->
                            <canvas id="diode-physics-canvas" class="diode-model-canvas"></canvas>
                            <!-- Right: I-V Characteristic Curve Plotter -->
                            <canvas id="diode-graph-canvas" class="diode-graph-canvas"></canvas>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">Physical Theory</button>
                            <button class="tab-btn" data-tab="applications">Practical Uses</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>PN Junction Lab Exercises</h3>
                            <p>Follow these steps to explore semiconductor physics:</p>
                            <ul>
                                <li><strong>Experiment 1: Zero Bias (0.0V)</strong> - Set the Biasing region to Forward Bias with voltage at 0.0V. Notice how electrons (blue particles) and holes (orange circles) are pushed away from the center line. The grey barrier represents the <strong>Depletion Region</strong>.</li>
                                <li><strong>Experiment 2: Forward Bias (> 0.7V)</strong> - Increase the Forward Voltage slider past 0.7V. Notice the depletion region shrinks to zero, and a flood of carrier charges recombines at the center junction, letting exponential current flow (demonstrated by the glowing green I-V line).</li>
                                <li><strong>Experiment 3: Reverse Bias & Zener Breakdown</strong> - Toggle the region to Reverse Bias and drag the voltage slider towards 50V. The depletion region widens, locking down carrier motion. As you pass 35V, notice a massive spike in current - this is <strong>Avalanche/Zener Breakdown</strong>!</li>
                                <li><strong>Experiment 4: Temperature Leakage</strong> - Select Reverse Bias at 15V. Maximize the Temperature slider. Notice how thermal energy creates minority carriers, causing the reverse leakage current to increase.</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>Diffusion, Drift, and Barrier Potentials</h3>
                            <p>A <strong>PN Junction</strong> is created by joining a positive-doped (P-type) and negative-doped (N-type) semiconductor.</p>
                            <p><strong>Diffusion:</strong> Because concentration is highly uneven, majority electrons in the N-type diffuse into the P-type, and holes diffuse into the N-type. At the interface, they recombine, leaving behind exposed, fixed positive ions in the N-region and negative ions in the P-region. This builds the <strong>Depletion Region</strong>.</p>
                            <p><strong>Drift:</strong> The fixed ions set up a barrier electric field ($E$). This field opposes diffusion, pushing carrier drift in the opposite direction. Eventually, diffusion equals drift, establishing a stable barrier voltage:
                            $$V_D = V_T \\cdot \\ln\\left(\\frac{N_A \\cdot N_D}{n_i^2}\\right)$$
                            Where $V_T$ is the thermal voltage (approx 26mV), $N_A$/$N_D$ are dopant levels, and $n_i$ is intrinsic carrier density.</p>
                        </div>
                        
                        <div class="tab-content" id="tab-applications">
                            <h3>Diodes in the Real World</h3>
                            <p>Diodes act as one-way valves for electric current, forming the backbone of power electronics:</p>
                            <ul>
                                <li><strong>AC to DC Rectification:</strong> Diodes are configured in bridge arrangements to convert alternating current (AC) power lines into clean, single-direction direct current (DC) for phone chargers.</li>
                                <li><strong>Light Emitting Diodes (LEDs):</strong> When electrons recombine with holes at a forward-biased junction, they drop to lower energy bands and release energy as photons. The dopant bandgap determines the color of the emitted light.</li>
                                <li><strong>Photovoltaics:</strong> In solar cells, incoming photons strike the depletion region, breaking covalent bonds and creating electron-hole pairs. The built-in electric field drives them apart, creating electric power!</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel" style="display: flex; flex-direction: column; gap: 16px; padding-bottom: 40px;">
                    <div class="glass-card" style="padding: 18px 20px;">
                        <h3 class="panel-section-title" style="font-size: 1.05rem; padding-bottom: 8px; margin-bottom: 12px;"><i data-lucide="sliders"></i> Parameters</h3>
                        
                        <!-- Biasing Region Toggle -->
                        <div class="slider-group" style="margin-bottom: 14px;">
                            <span class="slider-name" style="font-size: 0.8rem; font-weight: 600;">Biasing Region</span>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px;">
                                <button class="toggle-btn active" id="btn-mode-forward" style="font-size: 0.75rem; padding: 6px;">Forward Bias</button>
                                <button class="toggle-btn" id="btn-mode-reverse" style="font-size: 0.75rem; padding: 6px;">Reverse Bias</button>
                            </div>
                        </div>

                        <!-- Forward Voltage Slider -->
                        <div class="slider-group" id="group-forward-volt" style="margin-bottom: 14px;">
                            <div class="slider-label-row" style="font-size: 0.8rem;">
                                <span class="slider-name">Forward Voltage (V_f)</span>
                                <span class="slider-val" id="val-forward" style="color: var(--success); font-weight: bold;">0.00 V</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-bias-fwd" min="0.0" max="1.0" step="0.02" value="0.0" style="background: rgba(16, 185, 129, 0.1);">
                        </div>

                        <!-- Reverse Voltage Slider (Hidden initially) -->
                        <div class="slider-group" id="group-reverse-volt" style="margin-bottom: 14px; display: none;">
                            <div class="slider-label-row" style="font-size: 0.8rem;">
                                <span class="slider-name">Reverse Voltage (V_r)</span>
                                <span class="slider-val" id="val-reverse" style="color: var(--error); font-weight: bold;">0.0 V</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-bias-rev" min="0.0" max="50.0" step="1.0" value="0.0" style="background: rgba(239, 68, 68, 0.1);">
                        </div>
                        
                        <!-- Parameter 2: Doping Slider -->
                        <div class="slider-group" style="margin-bottom: 14px;">
                            <div class="slider-label-row" style="font-size: 0.8rem;">
                                <span class="slider-name">Doping Concentration</span>
                                <span class="slider-val" id="val-doping" style="color: var(--accent-secondary); font-weight: bold;">Medium</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-doping" min="1" max="3" step="1" value="2" style="background: rgba(6, 182, 212, 0.1);">
                        </div>
                        
                        <!-- Parameter 3: Temperature Slider -->
                        <div class="slider-group" style="margin-bottom: 18px;">
                            <div class="slider-label-row" style="font-size: 0.8rem;">
                                <span class="slider-name">Temperature (K)</span>
                                <span class="slider-val" id="val-temp" style="color: var(--accent-purple); font-weight: bold;">300 K</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-temp" min="250" max="400" step="5" value="300" style="background: rgba(99, 102, 241, 0.1);">
                        </div>
                        
                        <!-- Dynamic readout card -->
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 14px; border-radius: var(--border-radius-sm); font-size: 0.8rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Depletion Region Width:</span>
                                <span id="readout-width" style="color: #fff; font-weight: bold;">0.350 μm</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Current Flow Level:</span>
                                <span id="readout-current" style="color: var(--success); font-weight: bold;">0.00 mA</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Barrier Potential:</span>
                                <span id="readout-barrier" style="color: var(--warning); font-weight: bold;">0.70 eV</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation / Actions -->
                    <div class="glass-card" style="padding: 18px 20px; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <h3 class="panel-section-title" style="font-size: 1.05rem; padding-bottom: 8px; margin-bottom: 12px;"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-diode-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 10px; padding: 10px; font-size: 0.85rem;">
                            <i data-lucide="refresh-cw"></i> Reset Parameters
                        </button>
                        <a href="#/quiz" class="btn btn-primary" style="width: 100%; padding: 10px; font-size: 0.85rem;">
                            <i data-lucide="award"></i> Enter Sector Quiz
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// State fields for running simulation loops
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
        const targetElement = document.getElementById(`tab-${targetTab}`);
        targetElement.classList.add('active');
        
        // Re-render KaTeX on the newly visible tab content to handle hidden rendering issues
        if (window.renderMathInElement) {
            window.renderMathInElement(targetElement, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    };
    
    tabButtons.forEach(btn => btn.addEventListener('click', activeTabHandler));

    // 2. Initialize Canvas elements
    const physicsCanvas = document.getElementById('diode-physics-canvas');
    const graphCanvas = document.getElementById('diode-graph-canvas');
    if (!physicsCanvas || !graphCanvas) return;

    const pCtx = physicsCanvas.getContext('2d');
    const gCtx = graphCanvas.getContext('2d');
    
    // Resize dimensions
    let pWidth = physicsCanvas.width = physicsCanvas.parentElement.clientWidth * 0.65;
    let pHeight = physicsCanvas.height = 440;
    
    let gWidth = graphCanvas.width = physicsCanvas.parentElement.clientWidth * 0.35;
    let gHeight = graphCanvas.height = 440;
    
    const handleResize = () => {
        if (!physicsCanvas || !graphCanvas) return;
        const totalWidth = physicsCanvas.parentElement.clientWidth;
        pWidth = physicsCanvas.width = totalWidth * 0.62;
        gWidth = graphCanvas.width = totalWidth * 0.38;
        pHeight = physicsCanvas.height = 440;
        gHeight = graphCanvas.height = 440;
    };
    window.addEventListener('resize', handleResize);
    physicsCanvas._resizeHandler = handleResize;

    // Simulation States
    let isForwardBias = true;
    let biasVoltage = 0.0;
    let dopingDensity = 2; // 1: Low, 2: Med, 3: High
    let temperature = 300;
    
    // Physics particles
    const carriers = [];

    // Setup carrier particles
    function initParticles() {
        carriers.length = 0;
        const carrierCount = dopingDensity * 15 + 10;
        
        // P-region Holes (left side: x from 0 to pWidth/2)
        for (let i = 0; i < carrierCount; i++) {
            carriers.push({
                x: Math.random() * (pWidth / 2 - 30) + 15,
                y: Math.random() * (pHeight - 40) + 20,
                type: 'hole', // positive charges
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 5
            });
        }
        // N-region Electrons (right side: x from pWidth/2 to pWidth)
        for (let i = 0; i < carrierCount; i++) {
            carriers.push({
                x: Math.random() * (pWidth / 2 - 30) + (pWidth / 2) + 15,
                y: Math.random() * (pHeight - 40) + 20,
                type: 'electron', // negative charges
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 4
            });
        }
    }

    initParticles();

    // 3. Hook Controls
    const btnModeForward = document.getElementById('btn-mode-forward');
    const btnModeReverse = document.getElementById('btn-mode-reverse');
    const groupForward = document.getElementById('group-forward-volt');
    const groupReverse = document.getElementById('group-reverse-volt');

    const sliderBiasFwd = document.getElementById('slider-bias-fwd');
    const sliderBiasRev = document.getElementById('slider-bias-rev');
    const sliderDoping = document.getElementById('slider-doping');
    const sliderTemp = document.getElementById('slider-temp');
    
    const valForward = document.getElementById('val-forward');
    const valReverse = document.getElementById('val-reverse');
    const valDoping = document.getElementById('val-doping');
    const valTemp = document.getElementById('val-temp');
    
    const readWidth = document.getElementById('readout-width');
    const readCurrent = document.getElementById('readout-current');
    const readBarrier = document.getElementById('readout-barrier');

    // Toggling Regions
    btnModeForward.addEventListener('click', () => {
        isForwardBias = true;
        btnModeForward.classList.add('active');
        btnModeReverse.classList.remove('active');
        groupForward.style.display = 'block';
        groupReverse.style.display = 'none';
        updateReadouts();
    });

    btnModeReverse.addEventListener('click', () => {
        isForwardBias = false;
        btnModeReverse.classList.add('active');
        btnModeForward.classList.remove('active');
        groupForward.style.display = 'none';
        groupReverse.style.display = 'block';
        updateReadouts();
    });

    function updateReadouts() {
        if (isForwardBias) {
            biasVoltage = parseFloat(sliderBiasFwd.value);
            valForward.textContent = `${biasVoltage.toFixed(2)} V`;
        } else {
            biasVoltage = -parseFloat(sliderBiasRev.value);
            valReverse.textContent = `${Math.abs(biasVoltage).toFixed(0)} V`;
        }
        
        dopingDensity = parseInt(sliderDoping.value);
        temperature = parseInt(sliderTemp.value);
        
        const dopingLabels = ["Low (1e15/cm³)", "Medium (1e16/cm³)", "High (1e17/cm³)"];
        valDoping.textContent = dopingLabels[dopingDensity - 1];
        valTemp.textContent = `${temperature} K`;
        
        // Capped stable depletion width
        const intrinsicBarrier = 0.70;
        const maxBarrierWidth = pWidth * 0.35;
        let depletionWidth = 0;
        
        if (biasVoltage < intrinsicBarrier) {
            const rawWidth = Math.max(0.01, intrinsicBarrier - biasVoltage);
            depletionWidth = (0.35 / Math.sqrt(dopingDensity)) * Math.sqrt(rawWidth);
        } else {
            depletionWidth = 0.005; // extremely narrow
        }
        readWidth.textContent = `${depletionWidth.toFixed(3)} μm`;
        
        // Advanced high-voltage diode calculations
        const VT = (26 * (temperature / 300)) / 1000; // thermal voltage
        const Is = 1e-9 * (temperature / 300) ** 3 * Math.exp(-1.1 / VT);
        let diodeCurrent = 0;
        if (biasVoltage >= 0) {
            diodeCurrent = Is * (Math.exp(Math.min(25, biasVoltage / VT)) - 1) * 1e11;
        } else {
            diodeCurrent = -Is * 1e11;
            // Breakdown at -35V
            if (biasVoltage < -35.0) {
                diodeCurrent += (biasVoltage + 35.0) * 12; // Zener breakdown steep current
            }
        }
        
        const absoluteCurrent = Math.abs(diodeCurrent);
        if (absoluteCurrent > 99) {
            readCurrent.textContent = `${diodeCurrent < 0 ? '-' : ''}99.00+ mA`;
            readCurrent.style.color = diodeCurrent < 0 ? 'var(--error)' : 'var(--success)';
        } else {
            readCurrent.textContent = `${diodeCurrent.toFixed(2)} mA`;
            readCurrent.style.color = diodeCurrent < 0 ? 'var(--error)' : 'var(--success)';
        }
        
        const currentBarrier = Math.max(0, intrinsicBarrier - biasVoltage);
        readBarrier.textContent = `${currentBarrier.toFixed(2)} eV`;
    }

    sliderBiasFwd.addEventListener('input', updateReadouts);
    sliderBiasRev.addEventListener('input', updateReadouts);
    sliderDoping.addEventListener('input', () => {
        updateReadouts();
        initParticles();
    });
    sliderTemp.addEventListener('input', updateReadouts);

    // Reset button
    const btnReset = document.getElementById('btn-diode-reset');
    btnReset.addEventListener('click', () => {
        isForwardBias = true;
        btnModeForward.classList.add('active');
        btnModeReverse.classList.remove('active');
        groupForward.style.display = 'block';
        groupReverse.style.display = 'none';
        
        sliderBiasFwd.value = 0.0;
        sliderBiasRev.value = 0.0;
        sliderDoping.value = 2;
        sliderTemp.value = 300;
        
        updateReadouts();
        initParticles();
    });

    updateReadouts();

    // 4. Main Physics and Graph animation loop
    const runDiodeLoop = () => {
        // --- PART 1: DRAW PHYSICS SEMICONDUCTOR MODEL ---
        pCtx.clearRect(0, 0, pWidth, pHeight);
        
        pCtx.fillStyle = 'rgba(239, 68, 68, 0.04)'; // faint red
        pCtx.fillRect(0, 0, pWidth / 2, pHeight);
        pCtx.fillStyle = 'rgba(6, 182, 212, 0.04)'; // faint cyan
        pCtx.fillRect(pWidth / 2, 0, pWidth / 2, pHeight);
        
        pCtx.font = '800 13px var(--font-heading)';
        pCtx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        pCtx.textAlign = 'left';
        pCtx.fillText('P-TYPE (Holes)', 15, 25);
        pCtx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        pCtx.fillText('N-TYPE (Electrons)', pWidth - 145, 25);
        
        const maxBarrierWidth = pWidth * 0.35;
        let depletionSpan = 4;
        if (biasVoltage < 0.7) {
            const rawWidth = Math.max(0.01, 0.70 - biasVoltage);
            depletionSpan = maxBarrierWidth * (Math.sqrt(rawWidth) / 8.0);
        }
        
        const depletionLeft = pWidth / 2 - depletionSpan;
        const depletionRight = pWidth / 2 + depletionSpan;
        
        pCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        pCtx.fillRect(depletionLeft, 0, depletionSpan * 2, pHeight);
        pCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(depletionLeft, 0); pCtx.lineTo(depletionLeft, pHeight);
        pCtx.moveTo(depletionRight, 0); pCtx.lineTo(depletionRight, pHeight);
        pCtx.stroke();
        
        pCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        pCtx.font = '500 10px var(--font-heading)';
        pCtx.textAlign = 'center';
        if (depletionSpan > 30) {
            pCtx.fillText('DEPLETION BARRIER', pWidth / 2, pHeight - 20);
        }
        
        // Draw fixed ions
        if (depletionSpan > 15) {
            pCtx.fillStyle = 'rgba(239, 68, 68, 0.25)'; // Negative ions P side
            const ionRadius = 8;
            for (let y = 60; y < pHeight - 40; y += 80) {
                pCtx.beginPath();
                pCtx.arc(depletionLeft + depletionSpan * 0.3, y, ionRadius, 0, Math.PI * 2);
                pCtx.fill();
                pCtx.strokeStyle = 'rgba(255,255,255,0.15)';
                pCtx.stroke();
                pCtx.beginPath();
                pCtx.moveTo(depletionLeft + depletionSpan * 0.3 - 4, y);
                pCtx.lineTo(depletionLeft + depletionSpan * 0.3 + 4, y);
                pCtx.stroke();
            }
            
            pCtx.fillStyle = 'rgba(6, 182, 212, 0.25)'; // Positive ions N side
            for (let y = 60; y < pHeight - 40; y += 80) {
                pCtx.beginPath();
                pCtx.arc(depletionRight - depletionSpan * 0.3, y, ionRadius, 0, Math.PI * 2);
                pCtx.fill();
                pCtx.stroke();
                pCtx.beginPath();
                pCtx.moveTo(depletionRight - depletionSpan * 0.3 - 4, y);
                pCtx.lineTo(depletionRight - depletionSpan * 0.3 + 4, y);
                pCtx.moveTo(depletionRight - depletionSpan * 0.3, y - 4);
                pCtx.lineTo(depletionRight - depletionSpan * 0.3, y + 4);
                pCtx.stroke();
            }
        }

        // Particle dynamics
        carriers.forEach(p => {
            let forceX = 0;
            if (biasVoltage > 0) {
                if (p.type === 'hole') forceX = biasVoltage * 0.08;
                else forceX = -biasVoltage * 0.08;
            } else {
                if (p.type === 'hole') forceX = (biasVoltage / 50.0) * 0.6; // reverse pulls out
                else forceX = -(biasVoltage / 50.0) * 0.6;
            }

            p.vx += forceX + (Math.random() - 0.5) * 0.05 * (temperature / 300);
            p.vy += (Math.random() - 0.5) * 0.05 * (temperature / 300);

            p.vx = Math.max(-1.8, Math.min(1.8, p.vx));
            p.vy = Math.max(-0.6, Math.min(0.6, p.vy));

            p.x += p.vx;
            p.y += p.vy;

            if (p.y - p.radius < 0 || p.y + p.radius > pHeight) p.vy *= -1;
            
            if (p.x < 10) { p.x = 10; p.vx *= -1; }
            if (p.x > pWidth - 10) { p.x = pWidth - 10; p.vx *= -1; }

            if (p.type === 'hole') {
                if (p.x > depletionLeft && biasVoltage < 0.68) {
                    p.x = depletionLeft;
                    p.vx *= -0.5;
                }
            } else {
                if (p.x < depletionRight && biasVoltage < 0.68) {
                    p.x = depletionRight;
                    p.vx *= -0.5;
                }
            }

            // Recombination flash
            if (biasVoltage >= 0.68) {
                const centerLine = pWidth / 2;
                if (p.type === 'hole' && p.x > centerLine - 5) {
                    pCtx.beginPath(); pCtx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI*2);
                    pCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; pCtx.fill();
                    p.x = Math.random() * 80 + 10; p.vx = 0.5;
                } else if (p.type === 'electron' && p.x < centerLine + 5) {
                    pCtx.beginPath(); pCtx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI*2);
                    pCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; pCtx.fill();
                    p.x = pWidth - (Math.random() * 80 + 10); p.vx = -0.5;
                }
            }

            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            if (p.type === 'hole') {
                pCtx.fillStyle = '#ef4444'; pCtx.fill();
                pCtx.strokeStyle = '#fca5a5'; pCtx.lineWidth = 1; pCtx.stroke();
            } else {
                pCtx.fillStyle = '#06b6d4'; pCtx.fill();
            }
        });

        // Current flow conventional arrows
        if (biasVoltage >= 0.7) {
            pCtx.save();
            pCtx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
            pCtx.lineWidth = 3 + (biasVoltage - 0.7) * 4;
            pCtx.setLineDash([8, 6]);
            pCtx.lineDashOffset = -animationFrameId * 0.4;
            pCtx.beginPath(); pCtx.moveTo(25, pHeight / 2); pCtx.lineTo(pWidth - 25, pHeight / 2); pCtx.stroke();
            pCtx.fillStyle = '#10b981';
            pCtx.font = 'bold 11px var(--font-heading)'; pCtx.textAlign = 'center';
            pCtx.fillText('CONVENTIONAL CURRENT FLOW (P → N)', pWidth / 2, pHeight / 2 - 12);
            pCtx.restore();
        } else if (biasVoltage < -35.0) {
            // Breakdown reverse conventional current
            pCtx.save();
            pCtx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
            pCtx.lineWidth = 4;
            pCtx.setLineDash([8, 6]);
            pCtx.lineDashOffset = animationFrameId * 0.4; // reverse direction!
            pCtx.beginPath(); pCtx.moveTo(25, pHeight / 2); pCtx.lineTo(pWidth - 25, pHeight / 2); pCtx.stroke();
            pCtx.fillStyle = '#ef4444';
            pCtx.font = 'bold 11px var(--font-heading)'; pCtx.textAlign = 'center';
            pCtx.fillText('REVERSE BREAKDOWN CURRENT FLOW (N → P)', pWidth / 2, pHeight / 2 - 12);
            pCtx.restore();
        }

        // --- PART 2: DRAW I-V CHARACTERISTICS PLOTTER ---
        gCtx.clearRect(0, 0, gWidth, gHeight);
        
        gCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        gCtx.lineWidth = 0.8;
        const gSpacing = 40;
        for (let x = 0; x < gWidth; x += gSpacing) {
            gCtx.beginPath(); gCtx.moveTo(x, 0); gCtx.lineTo(x, gHeight); gCtx.stroke();
        }
        for (let y = 0; y < gHeight; y += gSpacing) {
            gCtx.beginPath(); gCtx.moveTo(0, y); gCtx.lineTo(gWidth, y); gCtx.stroke();
        }

        const originX = gWidth * 0.48;
        const originY = gHeight * 0.55;
        
        gCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        gCtx.lineWidth = 1.5;
        gCtx.beginPath(); gCtx.moveTo(10, originY); gCtx.lineTo(gWidth - 10, originY);
        gCtx.moveTo(originX, 10); gCtx.lineTo(originX, gHeight - 10);
        gCtx.stroke();
        
        gCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        gCtx.font = '600 10px var(--font-heading)';
        gCtx.textAlign = 'right'; gCtx.fillText('V (Bias)', gWidth - 12, originY - 6);
        gCtx.textAlign = 'left'; gCtx.fillText('I (mA)', originX + 6, 20);
        gCtx.fillText('0', originX - 10, originY + 12);

        // Standard silicon segmented graph scales
        const scaleX_forward = (gWidth - originX - 25) / 1.0;
        const scaleX_reverse = (originX - 25) / -50.0;
        const scaleY = 4.0; 

        // Plot Forward + Reverse Regions
        gCtx.beginPath();
        for (let v = -50.0; v <= 1.0; v += 0.5) {
            const plotX = v >= 0 ? originX + v * scaleX_forward : originX + v * scaleX_reverse;
            let current = 0;
            
            if (v >= 0) {
                current = 0.002 * (Math.exp(Math.min(12, v / 0.13)) - 1) * 1e4;
            } else {
                current = -0.002;
                if (v < -35.0) {
                    current += (v + 35.0) * 12; // Zener knee curve
                }
            }
            
            const plotY = originY - current * scaleY;
            if (plotY >= 10 && plotY <= gHeight - 10) {
                if (v === -50.0) gCtx.moveTo(plotX, plotY);
                else gCtx.lineTo(plotX, plotY);
            }
        }
        gCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        gCtx.lineWidth = 2.5;
        gCtx.stroke();

        // Highlight regions on graph
        gCtx.fillStyle = 'rgba(16, 185, 129, 0.06)'; // Forward Region
        gCtx.fillRect(originX, 10, gWidth - originX - 10, originY - 10);
        gCtx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        gCtx.font = 'bold 8px monospace';
        gCtx.fillText('FWD BIAS', gWidth - 60, originY - 20);

        gCtx.fillStyle = 'rgba(239, 68, 68, 0.03)'; // Reverse Region
        gCtx.fillRect(10, 10, originX - 10, gHeight - 20);
        gCtx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        gCtx.fillText('REV BIAS', 15, originY + 20);

        // Dynamic operating point cursor
        const activeX = biasVoltage >= 0 ? originX + biasVoltage * scaleX_forward : originX + biasVoltage * scaleX_reverse;
        let activeCurr = 0;
        if (biasVoltage >= 0) {
            activeCurr = 0.002 * (Math.exp(Math.min(12, biasVoltage / 0.13)) - 1) * 1e4;
        } else {
            activeCurr = -0.002;
            if (biasVoltage < -35.0) {
                activeCurr += (biasVoltage + 35.0) * 12;
            }
        }
        const activeY = originY - activeCurr * scaleY;
        
        gCtx.beginPath();
        gCtx.arc(activeX, activeY, 6 + Math.sin(animationFrameId * 0.15) * 1.5, 0, Math.PI*2);
        gCtx.fillStyle = biasVoltage >= 0.7 ? '#10b981' : (biasVoltage < -35.0 ? '#ef4444' : '#06b6d4');
        gCtx.fill();
        gCtx.strokeStyle = '#fff';
        gCtx.lineWidth = 1.5;
        gCtx.stroke();
        
        gCtx.fillStyle = '#fff';
        gCtx.font = 'bold 9px monospace';
        gCtx.textAlign = biasVoltage > 0.5 ? 'right' : 'left';
        
        const textOffset = biasVoltage > 0.5 ? -12 : 12;
        gCtx.fillText(
            `(${biasVoltage.toFixed(1)}V, ${activeCurr.toFixed(1)}mA)`, 
            activeX + textOffset, 
            activeY - 4
        );

        animationFrameId = requestAnimationFrame(runDiodeLoop);
    };

    runDiodeLoop();
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
    
    const physicsCanvas = document.getElementById('diode-physics-canvas');
    if (physicsCanvas && physicsCanvas._resizeHandler) {
        window.removeEventListener('resize', physicsCanvas._resizeHandler);
    }
};
