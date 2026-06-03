/**
 * Nextron - BJT Transistor & Operational Amplifier Simulation View
 */

export const render = async () => {
    return `
        <style>
            .lab-selector-tabs {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 8px;
            }
            .lab-tab-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 8px 16px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                border-radius: var(--border-radius-sm);
                transition: all 0.3s ease;
            }
            .lab-tab-btn:hover {
                color: var(--text-normal);
                background: rgba(255, 255, 255, 0.05);
            }
            .lab-tab-btn.active {
                color: #fff;
                background: linear-gradient(135deg, var(--accent-purple), var(--accent-secondary));
                box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
            }
            
            .badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: bold;
                text-transform: uppercase;
                display: inline-block;
            }
            .badge-cutoff {
                background: rgba(239, 68, 68, 0.15);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            .badge-active {
                background: rgba(6, 182, 212, 0.15);
                color: #06b6d4;
                border: 1px solid rgba(6, 182, 212, 0.3);
            }
            .badge-saturation {
                background: rgba(16, 185, 129, 0.15);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .readout-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-top: 16px;
            }
            .readout-box {
                background: rgba(0,0,0,0.3);
                border: 1px solid var(--border-color);
                padding: 10px 14px;
                border-radius: var(--border-radius-sm);
                font-family: 'Space Grotesk', sans-serif;
            }
            .readout-box-label {
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-bottom: 2px;
            }
            .readout-box-val {
                font-size: 1.05rem;
                font-weight: bold;
            }
            
            /* Channel color markers */
            .ch-input { color: #6366f1; }
            .ch-output { color: #10b981; }
            .ch-clipped { color: #ef4444; }
        </style>

        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Sector 02: Active Devices
                </span>
            </div>
            
            <!-- Top Lab switching tabs -->
            <div class="lab-selector-tabs">
                <button class="lab-tab-btn active" id="btn-select-bjt">Lab 1: NPN Transistor Characteristics</button>
                <button class="lab-tab-btn" id="btn-select-opamp">Lab 2: Operational Amplifier Virtual Lab</button>
            </div>

            <!-- LAB 1: BJT TRANSISTOR -->
            <div id="bjt-lab-section">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>BJT NPN Transistor Laboratory</h2>
                    <p>Modulate base current injections and load line dynamics to master high-speed electronic switching and linear analog amplification.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 440px;">
                            <div class="visualizer-labels">
                                <span class="status-indicator completed"></span> Active NPN Micro-Physics Schematic & Load Line
                            </div>
                            <div class="diode-split" style="height: 100%;">
                                <canvas id="transistor-physics-canvas" class="diode-model-canvas"></canvas>
                                <canvas id="transistor-graph-canvas" class="diode-graph-canvas"></canvas>
                            </div>
                        </div>
                        
                        <div class="glass-card explanation-panel">
                            <div class="explanation-tabs">
                                <button class="tab-btn active" data-tab="bjt-walkthrough">Lab Experiments</button>
                                <button class="tab-btn" data-tab="bjt-theory">Biasing Theory</button>
                            </div>
                            
                            <div class="tab-content active" id="tab-bjt-walkthrough">
                                <h3>NPN Transistor Lab Exercises</h3>
                                <p>Follow these steps to analyze dynamic electron amplification systems:</p>
                                <ul>
                                    <li><strong>Experiment 1: Cutoff Mode (Off Switch)</strong> - Set the Base Current ($I_B$) to 0 μA. Note that zero electrons flow from Emitter to Collector. The transistor acts as an <strong>open circuit switch</strong>, with $V_{CE}$ matching the supply $V_{CC}$ fully.</li>
                                    <li><strong>Experiment 2: Linear Active Mode (Amplifier)</strong> - Set $I_B$ to 40 μA, $\\beta$ to 150, $R_C$ to 500 Ω, and $V_{CC}$ to 10 V. The active electron stream flows. The collector current is $I_C = \\beta \\cdot I_B = 6.0\\text{ mA}$. The output voltage is pulled down to $V_{CE} = V_{CC} - I_C R_C = 7.0\\text{ V}$. This is <strong>linear amplification</strong>!</li>
                                    <li><strong>Experiment 3: Saturation Region (On Switch)</strong> - Keep $V_{CC} = 10\\text{ V}$ and $R_C = 500\\Omega$. Increase $I_B$ to 100 μA. The theoretical active current $I_{C,\\mathrm{active}} = 15.0\\text{ mA}$ exceeds the saturation limit $I_{C,\\mathrm{sat}} \\approx V_{CC}/R_C = 20\\text{ mA}$? No, wait: set $R_C$ to 1000 Ω. Now the saturation current is $I_{C,\\mathrm{sat}} \\approx 10\\text{ mA}$. With $I_B = 80\\mu\\text{A}$, $I_{C,\\mathrm{active}} = 12\\text{ mA} > 10\\text{ mA}$. The collector-emitter voltage drops to its saturated minimum (\\approx 0.2\\text{ V}), acting as a **closed switch**.</li>
                                </ul>
                            </div>
                            
                            <div class="tab-content" id="tab-bjt-theory">
                                <h3>NPN Transistor Physics</h3>
                                <p>An NPN Bipolar Junction Transistor controls a large current between Emitter and Collector using a very small current injected into the Base.</p>
                                <p><strong>Key Equations:</strong></p>
                                <ul>
                                    <li>Active Current: $I_C = \\beta \\cdot I_B$</li>
                                    <li>Emitter Current: $I_E = I_C + I_B$</li>
                                    <li>Collector-Emitter Voltage: $V_{CE} = V_{CC} - I_C \\cdot R_C$</li>
                                    <li>Saturation Limit: $I_{C,\\mathrm{sat}} = \\frac{V_{CC} - V_{CE,\\mathrm{sat}}}{R_C}$ where $V_{CE,\\mathrm{sat}} \\approx 0.2\\text{ V}$</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="sliders"></i> BJT Parameters</h3>
                            
                            <!-- Base Current -->
                            <div class="slider-group" style="margin-bottom: 18px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Base Current (Ib)</span>
                                    <span class="slider-val" id="val-bjt-ib" style="color: var(--accent-purple);">40 μA</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-bjt-ib" min="0" max="100" step="5" value="40" style="background: rgba(99,102,241,0.15);">
                            </div>
                            
                            <!-- Beta Gain -->
                            <div class="slider-group" style="margin-bottom: 18px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Current Gain (β)</span>
                                    <span class="slider-val" id="val-bjt-beta" style="color: var(--warning);">150</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-bjt-beta" min="50" max="300" step="10" value="150">
                            </div>
                            
                            <!-- RC Resistor -->
                            <div class="slider-group" style="margin-bottom: 18px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Collector Resistor (Rc)</span>
                                    <span class="slider-val" id="val-bjt-rc" style="color: var(--accent-secondary);">500 Ω</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-bjt-rc" min="100" max="1000" step="50" value="500" style="background: rgba(6,182,212,0.15);">
                            </div>
                            
                            <!-- VCC Rails -->
                            <div class="slider-group" style="margin-bottom: 24px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Supply Voltage (Vcc)</span>
                                    <span class="slider-val" id="val-bjt-vcc" style="color: #ef4444;">10.0 V</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-bjt-vcc" min="1" max="15" step="0.5" value="10">
                            </div>
                            
                            <h3 class="panel-section-title" style="margin-top: 20px;"><i data-lucide="gauge"></i> Readout Deck</h3>
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Operating State:</span>
                                    <span id="badge-bjt-state" class="badge badge-active">ACTIVE</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Collector Current (Ic):</span>
                                    <span id="read-bjt-ic" style="color: var(--accent-secondary); font-weight: bold; font-family: monospace;">6.00 mA</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Emitter Current (Ie):</span>
                                    <span id="read-bjt-ie" style="color: #fff; font-weight: bold; font-family: monospace;">6.04 mA</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Collector-Emitter (Vce):</span>
                                    <span id="read-bjt-vce" style="color: var(--warning); font-weight: bold; font-family: monospace;">7.00 V</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                            <button id="btn-bjt-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                                <i data-lucide="refresh-cw"></i> Reset Parameters
                            </button>
                            <a href="#/quiz" class="btn btn-primary" style="width: 100%;">
                                <i data-lucide="award"></i> Enter Sector Quiz
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LAB 2: OP-AMP VIRTUAL LAB -->
            <div id="opamp-lab-section" style="display: none;">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>Operational Amplifier Virtual Laboratory</h2>
                    <p>Configure inverting, non-inverting, and comparator amplifier topologies. Feed dynamic signal waves and witness clipping limits.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 440px; background: #010409;">
                            <div class="visualizer-labels">
                                <span class="status-indicator completed"></span> Op-Amp Circuit Diagram & Real-Time Oscilloscope Trace
                            </div>
                            <div class="diode-split" style="height: 100%;">
                                <canvas id="opamp-circuit-canvas" class="diode-model-canvas"></canvas>
                                <canvas id="opamp-scope-canvas" class="diode-graph-canvas"></canvas>
                            </div>
                        </div>
                        
                        <div class="glass-card explanation-panel">
                            <div class="explanation-tabs">
                                <button class="tab-btn active" data-tab="opamp-walkthrough">Lab Experiments</button>
                                <button class="tab-btn" data-tab="opamp-theory">Operational Equations</button>
                            </div>
                            
                            <div class="tab-content active" id="tab-opamp-walkthrough">
                                <h3>Op-Amp Laboratory Exercises</h3>
                                <p>Select different configurations to inspect mathematical gain scaling:</p>
                                <ul>
                                    <li><strong>Experiment 1: Inverting Scaling</strong> - Choose <strong>Inverting Mode</strong>. Set $R_f = 20\\text{ k}\\Omega$ and $R_{in} = 10\\text{ k}\\Omega$. The calculated gain is $A_v = -R_f/R_{in} = -2.0$. Observe the output wave on the oscilloscope is <strong>exactly twice as tall</strong> and <strong>180° inverted</strong> relative to the input!</li>
                                    <li><strong>Experiment 2: Rail Saturation (Clipping)</strong> - In Inverting Mode with $A_v = -2.0$, increase the Input Amplitude $V_{in}$ to $7.0\\text{ V}$. Note the theoretical output would be $14.0\\text{ V}$. However, the physical power supply rails constrain the Op-Amp to $\\pm 12.0\\text{ V}$. Notice the output wave gets flat-topped (clipped) with a flashing red warning indicator!</li>
                                    <li><strong>Experiment 3: Comparator Mode</strong> - Switch to <strong>Comparator Mode</strong>. Note the gain is effectively infinite. The output snaps immediately to $+12\\text{V}$ when the input is positive, and to $-12\\text{V}$ when the input is negative, creating a perfect high-speed square wave!</li>
                                </ul>
                            </div>
                            
                            <div class="tab-content" id="tab-opamp-theory">
                                <h3>Ideal Operational Amplifiers</h3>
                                <p>An Operational Amplifier is a high-gain differential voltage amplifier featuring near-infinite input impedance and near-zero output impedance.</p>
                                <p><strong>Key Configurations:</strong></p>
                                <ul>
                                    <li><strong>Inverting Amplifier:</strong> $V_{out} = -\\left(\\frac{R_f}{R_{in}}\\right) V_{in}$ (Phase shift: $180^\\circ$)</li>
                                    <li><strong>Non-Inverting Amplifier:</strong> $V_{out} = \\left(1 + \\frac{R_f}{R_{in}}\\right) V_{in}$ (Phase shift: $0^\\circ$)</li>
                                    <li><strong>Comparator:</strong> $V_{out} = V_{in} > 0 ? +V_{sat} : -V_{sat}$</li>
                                    <li>Power Rails Limitation: $-12\\text{V} \\le V_{out} \\le +12\\text{V}$</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="cpu"></i> Configuration</h3>
                            
                            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                                <button class="toggle-btn active" id="btn-opamp-inv">Inverting Amp</button>
                                <button class="toggle-btn" id="btn-opamp-noninv">Non-Inverting Amp</button>
                                <button class="toggle-btn" id="btn-opamp-comp">Comparator</button>
                            </div>
                            
                            <h3 class="panel-section-title"><i data-lucide="sliders"></i> Circuit Resistors</h3>
                            
                            <!-- Rf Resistor -->
                            <div class="slider-group" id="group-opamp-rf" style="margin-bottom: 18px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Feedback Resistor (Rf)</span>
                                    <span class="slider-val" id="val-opamp-rf" style="color: var(--accent-secondary);">20 kΩ</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-opamp-rf" min="10" max="100" step="5" value="20" style="background: rgba(6,182,212,0.15);">
                            </div>
                            
                            <!-- Rin Resistor -->
                            <div class="slider-group" id="group-opamp-rin" style="margin-bottom: 18px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Input Resistor (Rin)</span>
                                    <span class="slider-val" id="val-opamp-rin" style="color: var(--accent-purple);">10 kΩ</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-opamp-rin" min="5" max="50" step="1" value="10" style="background: rgba(99,102,241,0.15);">
                            </div>
                            
                            <h3 class="panel-section-title"><i data-lucide="activity"></i> Input Sine Signal</h3>
                            
                            <!-- Vin Amplitude -->
                            <div class="slider-group" style="margin-bottom: 18px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Amplitude (Vin Peak)</span>
                                    <span class="slider-val" id="val-opamp-vin" style="color: var(--warning);">2.0 V</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-opamp-vin" min="0.5" max="8.0" step="0.5" value="2.0">
                            </div>
                            
                            <!-- Input Freq -->
                            <div class="slider-group" style="margin-bottom: 24px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Signal Frequency</span>
                                    <span class="slider-val" id="val-opamp-freq" style="color: #fff;">4 Hz</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-opamp-freq" min="1" max="10" step="1" value="4">
                            </div>
                            
                            <h3 class="panel-section-title" style="margin-top: 20px;"><i data-lucide="gauge"></i> Readout Deck</h3>
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Amplifier Status:</span>
                                    <span id="badge-opamp-state" class="badge badge-active" style="background: rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3)">Ideal Active</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Voltage Gain (Av):</span>
                                    <span id="read-opamp-gain" style="color: var(--accent-purple); font-weight: bold; font-family: monospace;">-2.00</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Output peak-to-peak:</span>
                                    <span id="read-opamp-vout" style="color: var(--accent-secondary); font-weight: bold; font-family: monospace;">8.00 Vpp</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                            <button id="btn-opamp-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                                <i data-lucide="refresh-cw"></i> Reset Parameters
                            </button>
                            <a href="#/quiz" class="btn btn-primary" style="width: 100%;">
                                <i data-lucide="award"></i> Enter Sector Quiz
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Animation loop states
let animationFrameId = null;
let activeTabHandlers = [];
let activeModeHandlers = [];

export const mount = () => {
    // 1. Hook up top lab selector tabs
    const btnSelectBjt = document.getElementById('btn-select-bjt');
    const btnSelectOpamp = document.getElementById('btn-select-opamp');
    
    const bjtSection = document.getElementById('bjt-lab-section');
    const opampSection = document.getElementById('opamp-lab-section');
    
    let activeLab = 'bjt'; // bjt or opamp

    btnSelectBjt.addEventListener('click', () => {
        btnSelectBjt.classList.add('active');
        btnSelectOpamp.classList.remove('active');
        bjtSection.style.display = 'block';
        opampSection.style.display = 'none';
        activeLab = 'bjt';
        triggerResize();
    });

    btnSelectOpamp.addEventListener('click', () => {
        btnSelectOpamp.classList.add('active');
        btnSelectBjt.classList.remove('active');
        bjtSection.style.display = 'none';
        opampSection.style.display = 'block';
        activeLab = 'opamp';
        triggerResize();
    });

    // Sub-tab handlers (Experiments vs Theory)
    const initSubTabs = (tabContainerId, contentPrefix) => {
        const parent = document.getElementById(tabContainerId);
        if (!parent) return;
        const tabButtons = parent.querySelectorAll('.tab-btn');
        const tabContents = parent.querySelectorAll('.tab-content');
        
        const handler = (e) => {
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
        tabButtons.forEach(btn => btn.addEventListener('click', handler));
        activeTabHandlers.push({ buttons: tabButtons, handler });
    };

    initSubTabs('bjt-lab-section', 'bjt-');
    initSubTabs('opamp-lab-section', 'opamp-');

    // 2. BJT Transistor Lab Logic & Loop
    const bPhysicsCanvas = document.getElementById('transistor-physics-canvas');
    const bGraphCanvas = document.getElementById('transistor-graph-canvas');
    const bpCtx = bPhysicsCanvas.getContext('2d');
    const bgCtx = bGraphCanvas.getContext('2d');

    let bpWidth = bPhysicsCanvas.width = bPhysicsCanvas.parentElement.clientWidth * 0.60;
    let bgWidth = bGraphCanvas.width = bPhysicsCanvas.parentElement.clientWidth * 0.40;
    let bpHeight = bPhysicsCanvas.height = 440;
    let bgHeight = bGraphCanvas.height = 440;

    const handleResize = () => {
        if (activeLab === 'bjt') {
            const totalWidth = bPhysicsCanvas.parentElement.clientWidth;
            bpWidth = bPhysicsCanvas.width = totalWidth * 0.60;
            bgWidth = bGraphCanvas.width = totalWidth * 0.40;
            bpHeight = bPhysicsCanvas.height = 440;
            bgHeight = bGraphCanvas.height = 440;
        } else {
            const totalWidth = oCircuitCanvas.parentElement.clientWidth;
            opcWidth = oCircuitCanvas.width = totalWidth * 0.52;
            opsWidth = oScopeCanvas.width = totalWidth * 0.48;
            opcHeight = oCircuitCanvas.height = 440;
            opsHeight = oScopeCanvas.height = 440;
        }
    };
    window.addEventListener('resize', handleResize);
    bPhysicsCanvas._resizeHandler = handleResize;

    const triggerResize = () => {
        setTimeout(handleResize, 50);
    };

    // BJT Sliders
    const sBjtIb = document.getElementById('slider-bjt-ib');
    const sBjtBeta = document.getElementById('slider-bjt-beta');
    const sBjtRc = document.getElementById('slider-bjt-rc');
    const sBjtVcc = document.getElementById('slider-bjt-vcc');

    const vBjtIb = document.getElementById('val-bjt-ib');
    const vBjtBeta = document.getElementById('val-bjt-beta');
    const vBjtRc = document.getElementById('val-bjt-rc');
    const vBjtVcc = document.getElementById('val-bjt-vcc');

    const badgeBjtState = document.getElementById('badge-bjt-state');
    const rBjtIc = document.getElementById('read-bjt-ic');
    const rBjtIe = document.getElementById('read-bjt-ie');
    const rBjtVce = document.getElementById('read-bjt-vce');

    let bjt = { ib: 40, beta: 150, rc: 500, vcc: 10 };
    const electrons = [];

    const createElectron = (startX, startY) => {
        return {
            x: startX,
            y: startY,
            vx: Math.random() * 0.5 + 0.4,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 3,
            target: 'collector',
            pathChosen: false
        };
    };

    const solveBJT = () => {
        bjt.ib = parseFloat(sBjtIb.value);
        bjt.beta = parseFloat(sBjtBeta.value);
        bjt.rc = parseFloat(sBjtRc.value);
        bjt.vcc = parseFloat(sBjtVcc.value);

        vBjtIb.textContent = `${bjt.ib.toFixed(0)} μA`;
        vBjtBeta.textContent = bjt.beta;
        vBjtRc.textContent = `${bjt.rc.toFixed(0)} Ω`;
        vBjtVcc.textContent = `${bjt.vcc.toFixed(1)} V`;

        // Physics solver
        const ibAmp = bjt.ib * 1e-6;
        const icActive = ibAmp * bjt.beta; // Amps
        const icSatLimit = (bjt.vcc - 0.2) / bjt.rc; // Saturation limit

        let ic = 0;
        let vce = 0;
        let state = "CUTOFF";

        if (bjt.ib === 0) {
            state = "CUTOFF";
            ic = 0;
            vce = bjt.vcc;
            badgeBjtState.className = "badge badge-cutoff";
        } else if (icActive < icSatLimit) {
            state = "ACTIVE";
            ic = icActive;
            vce = bjt.vcc - ic * bjt.rc;
            badgeBjtState.className = "badge badge-active";
        } else {
            state = "SATURATION";
            ic = icSatLimit;
            vce = 0.2; // saturation voltage
            badgeBjtState.className = "badge badge-saturation";
        }

        badgeBjtState.textContent = state;
        rBjtIc.textContent = `${(ic * 1000).toFixed(2)} mA`;
        rBjtIe.textContent = `${((ic + ibAmp) * 1000).toFixed(3)} mA`;
        rBjtVce.textContent = `${vce.toFixed(2)} V`;

        return { ic, vce, state };
    };

    sBjtIb.addEventListener('input', solveBJT);
    sBjtBeta.addEventListener('input', solveBJT);
    sBjtRc.addEventListener('input', solveBJT);
    sBjtVcc.addEventListener('input', solveBJT);

    document.getElementById('btn-bjt-reset').addEventListener('click', () => {
        sBjtIb.value = 40;
        sBjtBeta.value = 150;
        sBjtRc.value = 500;
        sBjtVcc.value = 10;
        solveBJT();
    });

    // 3. Operational Amplifier Lab Logic & Setup
    const oCircuitCanvas = document.getElementById('opamp-circuit-canvas');
    const oScopeCanvas = document.getElementById('opamp-scope-canvas');
    const ocCtx = oCircuitCanvas.getContext('2d');
    const osCtx = oScopeCanvas.getContext('2d');

    let opcWidth = oCircuitCanvas.width = oCircuitCanvas.parentElement.clientWidth * 0.52;
    let opsWidth = oScopeCanvas.width = oScopeCanvas.parentElement.clientWidth * 0.48;
    let opcHeight = oCircuitCanvas.height = 440;
    let opsHeight = oScopeCanvas.height = 440;

    let opamp = { mode: 'inverting', rf: 20, rin: 10, vin: 2.0, freq: 4 };

    const btnInv = document.getElementById('btn-opamp-inv');
    const btnNonInv = document.getElementById('btn-opamp-noninv');
    const btnComp = document.getElementById('btn-opamp-comp');

    const groupRf = document.getElementById('group-opamp-rf');
    const groupRin = document.getElementById('group-opamp-rin');

    const sOpRf = document.getElementById('slider-opamp-rf');
    const sOpRin = document.getElementById('slider-opamp-rin');
    const sOpVin = document.getElementById('slider-opamp-vin');
    const sOpFreq = document.getElementById('slider-opamp-freq');

    const vOpRf = document.getElementById('val-opamp-rf');
    const vOpRin = document.getElementById('val-opamp-rin');
    const vOpVin = document.getElementById('val-opamp-vin');
    const vOpFreq = document.getElementById('val-opamp-freq');

    const badgeOpampState = document.getElementById('badge-opamp-state');
    const rOpampGain = document.getElementById('read-opamp-gain');
    const rOpampVout = document.getElementById('read-opamp-vout');

    const updateOpampModeUI = (mode) => {
        opamp.mode = mode;
        const btns = [btnInv, btnNonInv, btnComp];
        btns.forEach(btn => btn.classList.remove('active'));
        if (mode === 'inverting') {
            btnInv.classList.add('active');
            groupRf.style.display = 'block';
            groupRin.style.display = 'block';
        } else if (mode === 'noninverting') {
            btnNonInv.classList.add('active');
            groupRf.style.display = 'block';
            groupRin.style.display = 'block';
        } else {
            btnComp.classList.add('active');
            groupRf.style.display = 'none';
            groupRin.style.display = 'none';
        }
        solveOpAmp();
    };

    btnInv.addEventListener('click', () => updateOpampModeUI('inverting'));
    btnNonInv.addEventListener('click', () => updateOpampModeUI('noninverting'));
    btnComp.addEventListener('click', () => updateOpampModeUI('comparator'));

    const solveOpAmp = () => {
        opamp.rf = parseFloat(sOpRf.value);
        opamp.rin = parseFloat(sOpRin.value);
        opamp.vin = parseFloat(sOpVin.value);
        opamp.freq = parseFloat(sOpFreq.value);

        vOpRf.textContent = `${opamp.rf} kΩ`;
        vOpRin.textContent = `${opamp.rin} kΩ`;
        vOpVin.textContent = `${opamp.vin.toFixed(1)} V`;
        vOpFreq.textContent = `${opamp.freq} Hz`;

        let gain = 0;
        let voutP2P = 0;
        let isClipped = false;

        const maxRail = 12.0;

        if (opamp.mode === 'inverting') {
            gain = - (opamp.rf / opamp.rin);
            const peakOut = Math.abs(gain * opamp.vin);
            voutP2P = Math.min(peakOut, maxRail) * 2;
            isClipped = peakOut > maxRail;
            rOpampGain.textContent = gain.toFixed(2);
        } else if (opamp.mode === 'noninverting') {
            gain = 1 + (opamp.rf / opamp.rin);
            const peakOut = Math.abs(gain * opamp.vin);
            voutP2P = Math.min(peakOut, maxRail) * 2;
            isClipped = peakOut > maxRail;
            rOpampGain.textContent = `+${gain.toFixed(2)}`;
        } else {
            gain = Infinity;
            voutP2P = maxRail * 2;
            isClipped = true; // Digital snapping is inherently extreme
            rOpampGain.textContent = "∞ (Open-Loop)";
        }

        rOpampVout.textContent = `${voutP2P.toFixed(2)} Vpp`;

        if (isClipped) {
            badgeOpampState.textContent = "RAIL CLIPPING";
            badgeOpampState.style.background = "rgba(239, 68, 68, 0.15)";
            badgeOpampState.style.color = "#ef4444";
            badgeOpampState.style.borderColor = "rgba(239, 68, 68, 0.3)";
        } else {
            badgeOpampState.textContent = "IDEAL ACTIVE";
            badgeOpampState.style.background = "rgba(16, 185, 129, 0.15)";
            badgeOpampState.style.color = "#10b981";
            badgeOpampState.style.borderColor = "rgba(16, 185, 129, 0.3)";
        }
    };

    sOpRf.addEventListener('input', solveOpAmp);
    sOpRin.addEventListener('input', solveOpAmp);
    sOpVin.addEventListener('input', solveOpAmp);
    sOpFreq.addEventListener('input', solveOpAmp);

    document.getElementById('btn-opamp-reset').addEventListener('click', () => {
        sOpRf.value = 20;
        sOpRin.value = 10;
        sOpVin.value = 2.0;
        sOpFreq.value = 4;
        updateOpampModeUI('inverting');
    });

    solveBJT();
    solveOpAmp();

    // 4. Integrated Simulator Run Loop
    let timeDomainTick = 0;

    const runMasterLoop = () => {
        if (activeLab === 'bjt') {
            const { ic, vce, state } = solveBJT();

            // --- PART 1: DRAW NPN PHYSICS LAYOUT ---
            bpCtx.clearRect(0, 0, bpWidth, bpHeight);
            
            const emitterRight = bpWidth * 0.33;
            const baseRight = bpWidth * 0.50;
            const baseCenter = (emitterRight + baseRight) / 2;

            // Draw blocks
            bpCtx.fillStyle = 'rgba(6, 182, 212, 0.05)'; // Cyan emitter
            bpCtx.fillRect(0, 0, emitterRight, bpHeight);
            bpCtx.fillStyle = 'rgba(239, 68, 68, 0.06)'; // Thin base P
            bpCtx.fillRect(emitterRight, 0, baseRight - emitterRight, bpHeight);
            bpCtx.fillStyle = 'rgba(16, 185, 129, 0.04)'; // Green collector
            bpCtx.fillRect(baseRight, 0, bpWidth - baseRight, bpHeight);

            // Dividing lines
            bpCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            bpCtx.lineWidth = 1;
            bpCtx.beginPath();
            bpCtx.moveTo(emitterRight, 0); bpCtx.lineTo(emitterRight, bpHeight);
            bpCtx.moveTo(baseRight, 0); bpCtx.lineTo(baseRight, bpHeight);
            bpCtx.stroke();

            // Terminals
            bpCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            bpCtx.fillRect(0, bpHeight / 2 - 20, 8, 40); // Emitter
            bpCtx.fillRect(bpWidth - 8, bpHeight / 2 - 20, 8, 40); // Collector
            bpCtx.fillRect(baseCenter - 20, bpHeight - 8, 40, 8); // Base

            // Titles
            bpCtx.font = '800 13px var(--font-heading)';
            bpCtx.textAlign = 'center';
            bpCtx.fillStyle = 'rgba(6, 182, 212, 0.6)';
            bpCtx.fillText('EMITTER (N)', emitterRight / 2, 35);
            bpCtx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            bpCtx.fillText('BASE (P)', baseCenter, 35);
            bpCtx.fillStyle = 'rgba(16, 185, 129, 0.6)';
            bpCtx.fillText('COLLECTOR (N)', baseRight + (bpWidth - baseRight) / 2, 35);

            // Spawn carriers
            if (bjt.ib > 0) {
                const spawnProb = bjt.ib * 0.008;
                if (Math.random() < spawnProb) {
                    electrons.push(createElectron(Math.random() * 30 + 10, Math.random() * (bpHeight - 60) + 30));
                }
            }

            // Update & draw particles
            for (let i = electrons.length - 1; i >= 0; i--) {
                const e = electrons[i];
                e.x += e.vx;
                e.y += e.vy;

                if (e.x > emitterRight && e.x < baseRight && !e.pathChosen) {
                    e.pathChosen = true;
                    // Path choice: collector (Ic) vs base (Ib)
                    // In Saturation, base pull is way higher
                    const basePull = state === 'SATURATION' ? 0.35 : 0.02;
                    if (Math.random() < basePull) {
                        e.target = 'base';
                    }
                }

                if (e.target === 'base' && e.x > emitterRight) {
                    e.vy += 0.08;
                    e.vx *= 0.85;
                } else if (e.x >= baseRight) {
                    e.vx += 0.08; // swept by field
                }

                bpCtx.fillStyle = '#06b6d4';
                bpCtx.beginPath();
                bpCtx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
                bpCtx.fill();

                // Clean boundaries
                if (e.x >= bpWidth - 10 || (e.target === 'base' && e.y >= bpHeight - 10) || e.x < 5 || e.y < 5 || e.y > bpHeight - 5) {
                    electrons.splice(i, 1);
                }
            }

            // --- PART 2: DRAW LOAD LINE GRAPH ---
            bgCtx.clearRect(0, 0, bgWidth, bgHeight);
            
            // Grid
            bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            bgCtx.lineWidth = 1;
            for (let x = 0; x < bgWidth; x += 40) {
                bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, bgHeight); bgCtx.stroke();
            }
            for (let y = 0; y < bgHeight; y += 40) {
                bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(bgWidth, y); bgCtx.stroke();
            }

            const originX = 45;
            const originY = bgHeight - 45;

            bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            bgCtx.lineWidth = 1.5;
            bgCtx.beginPath();
            bgCtx.moveTo(15, originY); bgCtx.lineTo(bgWidth - 15, originY);
            bgCtx.moveTo(originX, 15); bgCtx.lineTo(originX, bgHeight - 15);
            bgCtx.stroke();

            bgCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            bgCtx.font = '600 10px var(--font-heading)';
            bgCtx.textAlign = 'right';
            bgCtx.fillText('Vce (V)', bgWidth - 15, originY + 16);
            bgCtx.textAlign = 'left';
            bgCtx.fillText('Ic (mA)', originX + 6, 22);

            // Calculations for mapping
            const graphMaxVce = 16.0;
            const graphMaxIc = 35.0; // mA

            const scaleX = (bgWidth - originX - 30) / graphMaxVce;
            const scaleY = (originY - 45) / graphMaxIc;

            // Draw current IB curve
            if (bjt.ib > 0) {
                bgCtx.beginPath();
                const currentIbIcMax = (bjt.ib * bjt.beta) / 1000; // mA
                for (let v = 0; v <= graphMaxVce; v += 0.2) {
                    const plotX = originX + v * scaleX;
                    // knee curve
                    const plotIc = currentIbIcMax * (1 - Math.exp(-v / 0.3));
                    const plotY = originY - plotIc * scaleY;
                    if (v === 0) bgCtx.moveTo(plotX, plotY);
                    else bgCtx.lineTo(plotX, plotY);
                }
                bgCtx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
                bgCtx.lineWidth = 2;
                bgCtx.stroke();
            }

            // Draw Static Load Line
            const maxIcSaturated = (bjt.vcc / bjt.rc) * 1000; // mA
            bgCtx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            bgCtx.lineWidth = 2.5;
            bgCtx.beginPath();
            bgCtx.moveTo(originX, originY - maxIcSaturated * scaleY);
            bgCtx.lineTo(originX + bjt.vcc * scaleX, originY);
            bgCtx.stroke();
            bgCtx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            bgCtx.font = 'bold 8px monospace';
            bgCtx.fillText('LOAD LINE', originX + 50, originY - maxIcSaturated * 0.4 * scaleY);

            // Draw Q-Point marker
            const qX = originX + vce * scaleX;
            const qY = originY - (ic * 1000) * scaleY;

            bgCtx.beginPath();
            bgCtx.arc(qX, qY, 6 + Math.sin(timeDomainTick * 10) * 1.5, 0, Math.PI * 2);
            bgCtx.fillStyle = '#6366f1';
            bgCtx.fill();
            bgCtx.strokeStyle = '#fff';
            bgCtx.lineWidth = 1.5;
            bgCtx.stroke();

            bgCtx.fillStyle = '#fff';
            bgCtx.font = 'bold 9px monospace';
            bgCtx.fillText(`Q (${vce.toFixed(1)}V, ${(ic * 1000).toFixed(1)}mA)`, qX + 10, qY - 4);

        } else if (activeLab === 'opamp') {
            solveOpAmp();

            // --- PART 3: DRAW OP-AMP SCHEMATIC ---
            ocCtx.clearRect(0, 0, opcWidth, opcHeight);

            // Drawing simple professional operational amplifier circuit schematic
            const cx = opcWidth / 2;
            const cy = opcHeight / 2 - 20;

            // Draw Op-Amp Triangle body
            ocCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ocCtx.lineWidth = 3;
            ocCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ocCtx.beginPath();
            ocCtx.moveTo(cx - 50, cy - 60);
            ocCtx.lineTo(cx - 50, cy + 60);
            ocCtx.lineTo(cx + 50, cy);
            ocCtx.closePath();
            ocCtx.fill(); ocCtx.stroke();

            // Inputs symbols inside
            ocCtx.fillStyle = '#fff';
            ocCtx.font = 'bold 16px Courier';
            ocCtx.textAlign = 'center';
            // Inverting input symbol is top for inverting mode, bottom for non-inverting mode
            const isInvTop = opamp.mode === 'inverting';
            ocCtx.fillText(isInvTop ? '-' : '+', cx - 38, cy - 30);
            ocCtx.fillText(isInvTop ? '+' : '-', cx - 38, cy + 30);

            // Rails
            ocCtx.strokeStyle = 'rgba(255,255,255,0.2)';
            ocCtx.lineWidth = 1.5;
            // VCC+ rail (top)
            ocCtx.beginPath(); ocCtx.moveTo(cx, cy - 30); ocCtx.lineTo(cx, cy - 70); ocCtx.stroke();
            ocCtx.font = 'bold 9px monospace';
            ocCtx.fillStyle = '#ef4444';
            ocCtx.fillText('+12V', cx, cy - 78);

            // VCC- rail (bottom)
            ocCtx.beginPath(); ocCtx.moveTo(cx, cy + 30); ocCtx.lineTo(cx, cy + 70); ocCtx.stroke();
            ocCtx.fillStyle = '#6366f1';
            ocCtx.fillText('-12V', cx, cy + 78);

            // Draw Wires & Resistors based on mode
            ocCtx.strokeStyle = 'rgba(255,255,255,0.4)';
            ocCtx.lineWidth = 2;
            
            // Output Wire
            ocCtx.beginPath();
            ocCtx.moveTo(cx + 50, cy);
            ocCtx.lineTo(cx + 100, cy);
            ocCtx.stroke();
            ocCtx.fillStyle = '#10b981';
            ocCtx.fillText('Vout', cx + 115, cy + 3);

            // Feedback path
            if (opamp.mode !== 'comparator') {
                // Feedback wire up from input, through resistor, into output
                ocCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                ocCtx.beginPath();
                // Vertical from top input
                ocCtx.moveTo(cx - 65, cy - 35);
                ocCtx.lineTo(cx - 65, cy - 90);
                ocCtx.lineTo(cx - 25, cy - 90);
                ocCtx.stroke();

                // Draw Rf Resistor box
                ocCtx.fillStyle = '#010409';
                ocCtx.fillRect(cx - 25, cy - 98, 50, 16);
                ocCtx.strokeStyle = 'var(--accent-secondary)';
                ocCtx.strokeRect(cx - 25, cy - 98, 50, 16);
                ocCtx.fillStyle = '#fff';
                ocCtx.font = '10px var(--font-heading)';
                ocCtx.fillText('Rf', cx, cy - 105);

                ocCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                ocCtx.beginPath();
                ocCtx.moveTo(cx + 25, cy - 90);
                ocCtx.lineTo(cx + 75, cy - 90);
                ocCtx.lineTo(cx + 75, cy);
                ocCtx.stroke();
            }

            if (opamp.mode === 'inverting') {
                // Enegery source into top (-) terminal
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 50, cy - 35);
                ocCtx.lineTo(cx - 100, cy - 35);
                ocCtx.stroke();

                // Rin Resistor Box
                ocCtx.fillStyle = '#010409';
                ocCtx.fillRect(cx - 130, cy - 43, 30, 16);
                ocCtx.strokeStyle = 'var(--accent-purple)';
                ocCtx.strokeRect(cx - 130, cy - 43, 30, 16);
                ocCtx.fillStyle = '#fff';
                ocCtx.fillText('Rin', cx - 115, cy - 50);

                ocCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 130, cy - 35);
                ocCtx.lineTo(cx - 170, cy - 35);
                ocCtx.stroke();
                ocCtx.fillStyle = '#6366f1';
                ocCtx.fillText('Vin (t)', cx - 185, cy - 32);

                // Bottom terminal (+) to ground
                ocCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 50, cy + 35);
                ocCtx.lineTo(cx - 90, cy + 35);
                ocCtx.stroke();
                // Ground symbol
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 90, cy + 25); ocCtx.lineTo(cx - 90, cy + 45);
                ocCtx.moveTo(cx - 95, cy + 30); ocCtx.lineTo(cx - 95, cy + 40);
                ocCtx.moveTo(cx - 100, cy + 33); ocCtx.lineTo(cx - 100, cy + 37);
                ocCtx.stroke();
            } else if (opamp.mode === 'noninverting') {
                // Enegery source into bottom (+) terminal
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 50, cy + 35);
                ocCtx.lineTo(cx - 150, cy + 35);
                ocCtx.stroke();
                ocCtx.fillStyle = '#6366f1';
                ocCtx.fillText('Vin (t)', cx - 165, cy + 38);

                // Top terminal (-) to ground through Rin
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 50, cy - 35);
                ocCtx.lineTo(cx - 100, cy - 35);
                ocCtx.stroke();

                ocCtx.fillStyle = '#010409';
                ocCtx.fillRect(cx - 130, cy - 43, 30, 16);
                ocCtx.strokeStyle = 'var(--accent-purple)';
                ocCtx.strokeRect(cx - 130, cy - 43, 30, 16);
                ocCtx.fillStyle = '#fff';
                ocCtx.fillText('Rin', cx - 115, cy - 50);

                ocCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 130, cy - 35);
                ocCtx.lineTo(cx - 170, cy - 35);
                ocCtx.stroke();
                // Ground
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 170, cy - 45); ocCtx.lineTo(cx - 170, cy - 25);
                ocCtx.moveTo(cx - 175, cy - 40); ocCtx.lineTo(cx - 175, cy - 30);
                ocCtx.moveTo(cx - 180, cy - 37); ocCtx.lineTo(cx - 180, cy - 33);
                ocCtx.stroke();
            } else {
                // Comparator: Vin directly into top (-), ground to bottom (+)
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 50, cy - 30);
                ocCtx.lineTo(cx - 140, cy - 30);
                ocCtx.stroke();
                ocCtx.fillStyle = '#6366f1';
                ocCtx.fillText('Vin (t)', cx - 155, cy - 27);

                ocCtx.beginPath();
                ocCtx.moveTo(cx - 50, cy + 30);
                ocCtx.lineTo(cx - 100, cy + 30);
                ocCtx.stroke();
                // Ground
                ocCtx.beginPath();
                ocCtx.moveTo(cx - 100, cy + 20); ocCtx.lineTo(cx - 100, cy + 40);
                ocCtx.stroke();
            }

            // --- PART 4: DRAW OSCILLOSCOPE TRACES ---
            osCtx.clearRect(0, 0, opsWidth, opsHeight);

            // Phosphor grid lines
            osCtx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
            osCtx.lineWidth = 1;
            for (let x = 0; x < opsWidth; x += 25) {
                osCtx.beginPath(); osCtx.moveTo(x, 0); osCtx.lineTo(x, opsHeight); osCtx.stroke();
            }
            for (let y = 0; y < opsHeight; y += 25) {
                osCtx.beginPath(); osCtx.moveTo(0, y); osCtx.lineTo(opsWidth, y); osCtx.stroke();
            }

            // Center lines
            osCtx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
            osCtx.lineWidth = 1.2;
            osCtx.beginPath();
            osCtx.moveTo(0, opsHeight/2); osCtx.lineTo(opsWidth, opsHeight/2);
            osCtx.stroke();

            const scopeOriginY = opsHeight / 2;
            const pixelVoltScale = 14; // 1 volt = 14 pixels

            // Plot Input Trace (Purple)
            osCtx.beginPath();
            osCtx.strokeStyle = '#6366f1';
            osCtx.lineWidth = 2.0;

            const speedScale = 0.04;

            for (let x = 0; x < opsWidth; x++) {
                const t = x * speedScale - timeDomainTick * opamp.freq * 4;
                const vval = opamp.vin * Math.sin(t);
                const py = scopeOriginY - vval * pixelVoltScale;

                if (x === 0) osCtx.moveTo(x, py);
                else osCtx.lineTo(x, py);
            }
            osCtx.stroke();

            // Plot Output Trace (Emerald Green, potentially clipped)
            osCtx.beginPath();
            osCtx.strokeStyle = '#10b981';
            osCtx.lineWidth = 2.5;

            let isClippingNow = false;

            for (let x = 0; x < opsWidth; x++) {
                const t = x * speedScale - timeDomainTick * opamp.freq * 4;
                const vinVal = opamp.vin * Math.sin(t);

                let voutVal = 0;
                if (opamp.mode === 'inverting') {
                    const gain = - (opamp.rf / opamp.rin);
                    voutVal = gain * vinVal;
                } else if (opamp.mode === 'noninverting') {
                    const gain = 1 + (opamp.rf / opamp.rin);
                    voutVal = gain * vinVal;
                } else {
                    voutVal = vinVal >= 0 ? 12.0 : -12.0;
                }

                // Rail clamping
                if (voutVal > 12.0) {
                    voutVal = 12.0;
                    isClippingNow = true;
                } else if (voutVal < -12.0) {
                    voutVal = -12.0;
                    isClippingNow = true;
                }

                const py = scopeOriginY - voutVal * pixelVoltScale;

                if (x === 0) osCtx.moveTo(x, py);
                else osCtx.lineTo(x, py);
            }
            osCtx.stroke();

            // Draw flashing alert banner if clipping
            if (isClippingNow) {
                osCtx.save();
                osCtx.fillStyle = 'rgba(239, 68, 68, 0.15)';
                osCtx.fillRect(0, 0, opsWidth, 30);
                osCtx.fillStyle = '#ef4444';
                osCtx.font = 'bold 10px monospace';
                osCtx.textAlign = 'center';
                // flashing using tick
                if (Math.floor(timeDomainTick * 12) % 2 === 0) {
                    osCtx.fillText('⚠️ OP-AMP OUTPUT CLIPPED BY SUPPLY RAILS (±12.0V) ⚠️', opsWidth / 2, 18);
                }
                osCtx.restore();
            }

            // Labels
            osCtx.fillStyle = 'rgba(255,255,255,0.7)';
            osCtx.font = '800 11px var(--font-heading)';
            osCtx.textAlign = 'left';
            osCtx.fillText('INPUT Vin(t) (Purple)', 15, opsHeight - 30);
            osCtx.fillStyle = '#10b981';
            osCtx.fillText('OUTPUT Vout(t) (Green)', 15, opsHeight - 15);
        }

        // Master animation clock increment
        timeDomainTick += 0.005;
        animationFrameId = requestAnimationFrame(runMasterLoop);
    };

    runMasterLoop();
};

export const unmount = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Remove resize listeners
    const bPhysicsCanvas = document.getElementById('transistor-physics-canvas');
    if (bPhysicsCanvas && bPhysicsCanvas._resizeHandler) {
        window.removeEventListener('resize', bPhysicsCanvas._resizeHandler);
    }

    // Remove Top selector events
    // Clear sub tab handlers
    activeTabHandlers.forEach(item => {
        item.buttons.forEach(btn => btn.removeEventListener('click', item.handler));
    });
    activeTabHandlers = [];

    activeModeHandlers = [];
};
