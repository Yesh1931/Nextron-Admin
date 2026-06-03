/**
 * Nextron - Digital Signal Processing (DSP), Z-Plane Filters & Aliasing View
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
            
            .alert-banner {
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #f87171;
                padding: 12px;
                border-radius: var(--border-radius-sm);
                font-size: 0.85rem;
                text-align: center;
                font-weight: bold;
                margin-bottom: 16px;
                animation: pulse-border 1.5s infinite;
            }
            
            @keyframes pulse-border {
                0% { border-color: rgba(239, 68, 68, 0.3); }
                50% { border-color: rgba(239, 68, 68, 0.8); }
                100% { border-color: rgba(239, 68, 68, 0.3); }
            }
        </style>

        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Sector 05: Signal Processing
                </span>
            </div>
            
            <!-- Top Lab switching tabs -->
            <div class="lab-selector-tabs">
                <button class="lab-tab-btn active" id="btn-select-zplane">Lab 1: Z-Plane Complex Filters</button>
                <button class="lab-tab-btn" id="btn-select-sampling">Lab 2: Sampling & Aliasing Visualizer</button>
            </div>

            <!-- LAB 1: Z-PLANE FILTERS -->
            <div id="zplane-lab-section">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>Digital Signal Processing & Z-Plane Filter Laboratory</h2>
                    <p>Locate poles and zeros dynamically in the complex Z-plane. Observe real-time changes in filter stability and frequency magnitude response.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 440px; background: #010409;">
                            <div class="visualizer-labels" style="border-color: rgba(99, 102, 241, 0.25);">
                                <span class="status-indicator completed" style="background: #6366f1;"></span> Z-Plane Coordinates & Magnitude Spectrum
                            </div>
                            <div class="diode-split" style="height: 100%;">
                                <canvas id="dsp-zplane-canvas" class="diode-model-canvas"></canvas>
                                <canvas id="dsp-freq-canvas" class="diode-graph-canvas"></canvas>
                            </div>
                        </div>
                        
                        <div class="glass-card explanation-panel">
                            <div class="explanation-tabs">
                                <button class="tab-btn active" data-tab="zplane-walkthrough">Lab Experiments</button>
                                <button class="tab-btn" data-tab="zplane-theory">Z-Plane Mathematics</button>
                            </div>
                            
                            <div class="tab-content active" id="tab-zplane-walkthrough">
                                <h3>DSP Laboratory Exercises</h3>
                                <p>Follow these procedures to design digital filters:</p>
                                <ul>
                                    <li><strong>Experiment 1: Resonant Bandpass Filter</strong> - Set the **Pole Radius** to 0.8 and the **Pole Angle** to 45°. Notice the sharp peak in the frequency magnitude graph on the right at exactly $0.25\pi$ ($45^\circ$). Moving a pole near the unit circle boosts frequencies at that angle!</li>
                                    <li><strong>Experiment 2: Notch Filter Design</strong> - Set the **Zero Radius** to 1.0 (perfectly on the unit circle) and the **Zero Angle** to 90°. Look at the frequency graph—the magnitude drops to absolute zero at $0.5\pi$ ($90^\circ$). This is a perfect notch filter!</li>
                                    <li><strong>Experiment 3: Filter Stability Bounds</strong> - In practice, if you drag a pole radius beyond 1.0 (outside the unit circle), the system's impulse response grows exponentially, resulting in unstable explosion. We cap the slider at 0.98 for structural safety!</li>
                                </ul>
                            </div>
                            
                            <div class="tab-content" id="tab-zplane-theory">
                                <h3>Poles, Zeros, and Euler Transfer Math</h3>
                                <p>A discrete LTI system can be analyzed using the **Z-Transform**, yielding a complex transfer function:</p>
                                $$H(z) = \\frac{\\sum b_k z^{-k}}{\\sum a_k z^{-k}} = K \\cdot \\frac{\\prod (z - z_i)}{\\prod (z - p_i)}$$
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="sliders"></i> Filter Coeffs</h3>
                            
                            <!-- Pole radius -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--accent-purple); font-weight: bold;">Pole Radius (Rp)</span>
                                    <span class="slider-val" id="val-pole-r" style="color: var(--accent-purple); font-weight: bold;">0.80</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-pole-r" min="0.0" max="0.98" step="0.02" value="0.80" style="background: rgba(99, 102, 241, 0.15);">
                            </div>
                            
                            <!-- Pole angle -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--accent-purple); font-weight: bold;">Pole Angle (θp)</span>
                                    <span class="slider-val" id="val-pole-theta" style="color: var(--accent-purple); font-weight: bold;">45°</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-pole-theta" min="0" max="180" step="5" value="45" style="background: rgba(99, 102, 241, 0.15);">
                            </div>
                            
                            <!-- Zero radius -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--accent-secondary); font-weight: bold;">Zero Radius (Rz)</span>
                                    <span class="slider-val" id="val-zero-r" style="color: var(--accent-secondary); font-weight: bold;">0.00</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-zero-r" min="0.0" max="1.0" step="0.05" value="0.00" style="background: rgba(6, 182, 212, 0.15);">
                            </div>

                            <!-- Zero angle -->
                            <div class="slider-group" style="margin-bottom: 24px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--accent-secondary); font-weight: bold;">Zero Angle (θz)</span>
                                    <span class="slider-val" id="val-zero-theta" style="color: var(--accent-secondary); font-weight: bold;">90°</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-zero-theta" min="0" max="180" step="5" value="90" style="background: rgba(6, 182, 212, 0.15);">
                            </div>
                            
                            <!-- Dynamic readout card -->
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                    <span style="color: var(--text-secondary);">Active Pole conjugate:</span>
                                    <span id="readout-pole-coords" style="color: #fff; font-weight: bold; font-family: monospace;">0.56 ± j0.56</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                    <span style="color: var(--text-secondary);">Active Zero conjugate:</span>
                                    <span id="readout-zero-coords" style="color: #fff; font-weight: bold; font-family: monospace;">0.00 ± j0.00</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--text-secondary);">Filter Classification:</span>
                                    <span id="readout-dsp-class" style="color: var(--success); font-weight: bold;">IIR Bandpass</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Actions -->
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                            <button id="btn-dsp-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                                <i data-lucide="refresh-cw"></i> Clear Poles/Zeros
                            </button>
                            <a href="#/quiz" class="btn btn-primary" style="width: 100%;">
                                <i data-lucide="award"></i> Enter Sector Quiz
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LAB 2: SAMPLING AND ALIASING -->
            <div id="sampling-lab-section" style="display: none;">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>Signal Sampling & Aliasing Laboratory</h2>
                    <p>Sample continuous analog waves into discrete digital signals. Watch high frequencies fold back to lower frequencies when Nyquist sampling limits are violated.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <!-- Nyquist violation flashing warning banner -->
                        <div class="alert-banner" id="aliasing-warning-banner" style="display: none;">
                            🔴 ALIASING DETECTED! Nyquist limit violated (Sampling Freq Fs &lt; 2 * Signal Freq F).
                        </div>
                        
                        <div class="visualizer-wrapper" style="height: 440px; background: #010409;">
                            <div class="visualizer-labels">
                                <span class="status-indicator completed"></span> Continuous Signal vs Discrete Sample Stalks
                            </div>
                            <div class="diode-split" style="height: 100%;">
                                <!-- Left: Continuous & Sampled wave -->
                                <canvas id="sampling-time-canvas" class="diode-model-canvas"></canvas>
                                <!-- Right: Reconstructed wave -->
                                <canvas id="sampling-recon-canvas" class="diode-graph-canvas"></canvas>
                            </div>
                        </div>
                        
                        <div class="glass-card explanation-panel">
                            <div class="explanation-tabs">
                                <button class="tab-btn active" data-tab="sampling-walkthrough">Lab Experiments</button>
                                <button class="tab-btn" data-tab="sampling-theory">Nyquist Theorem</button>
                            </div>
                            
                            <div class="tab-content active" id="tab-sampling-walkthrough">
                                <h3>Sampling Laboratory Exercises</h3>
                                <p>Interact with frequencies to inspect DSP aliasing folding:</p>
                                <ul>
                                    <li><strong>Experiment 1: Perfect Reconstruction</strong> - Set the **Signal Frequency (F)** to 4 Hz and the **Sampling Frequency (Fs)** to 24 Hz. The Nyquist condition is satisfied ($Fs = 24\text{Hz} > 2F = 8\text{Hz}$). Notice the reconstructed wave (cyan, right) perfectly matches the continuous input!</li>
                                    <li><strong>Experiment 2: Critical Nyquist Limit</strong> - Keep F = 4 Hz. Lower Fs to 8 Hz. The sampling rate is exactly $2F$. Note how the sample points are locked, but reconstruction is barely possible.</li>
                                    <li><strong>Experiment 3: Aliasing Folding</strong> - Keep F = 8 Hz. Lower Fs to 12 Hz. Nyquist is violated ($12 < 16$). The reconstructed wave on the right slow down dramatically to **exactly 4 Hz** ($12 - 8 = 4\text{Hz}$). The high frequency folds back as an alias!</li>
                                </ul>
                            </div>
                            
                            <div class="tab-content" id="tab-sampling-theory">
                                <h3>Nyquist-Shannon Sampling Theorem</h3>
                                <p>This theorem is the bridge between continuous and digital signals. It states that to perfectly reconstruct a bandlimited analog signal, the sampling rate ($f_s$) must exceed twice the maximum frequency component ($f_{max}$) contained in the signal:</p>
                                $$f_s \\ge 2 \\cdot f_{max}$$
                                <p>If $f_s < 2 f$, frequencies above $f_s/2$ are folded (aliased) symmetrically back into the baseband spectrum:
                                $$f_{apparent} = \\left| f - k \\cdot f_s \\right|$$</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="sliders"></i> DSP Variables</h3>
                            
                            <!-- Signal Freq (F) -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--warning);">Signal Freq (F)</span>
                                    <span class="slider-val" id="val-samp-f" style="color: var(--warning);">4 Hz</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-samp-f" min="1" max="15" step="1" value="4">
                            </div>
                            
                            <!-- Sampling Freq (Fs) -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--accent-secondary);">Sampling Freq (Fs)</span>
                                    <span class="slider-val" id="val-samp-fs" style="color: var(--accent-secondary);">24 Hz</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-samp-fs" min="2" max="40" step="1" value="24" style="background: rgba(6, 182, 212, 0.15);">
                            </div>
                            
                            <!-- Signal Amp -->
                            <div class="slider-group" style="margin-bottom: 24px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Signal Amplitude</span>
                                    <span class="slider-val" id="val-samp-amp">2.0 V</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-samp-amp" min="0.5" max="3.0" step="0.1" value="2.0">
                            </div>
                            
                            <h3 class="panel-section-title" style="margin-top: 20px;"><i data-lucide="gauge"></i> Telemetry</h3>
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Nyquist frequency:</span>
                                    <span id="read-samp-nyquist" style="color: #fff; font-weight: bold;">12.0 Hz</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Apparent Frequency:</span>
                                    <span id="read-samp-fapparent" style="color: var(--accent-purple); font-weight: bold;">4.0 Hz</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                            <button id="btn-samp-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                                <i data-lucide="refresh-cw"></i> Reset Sampling
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

// Animation frame states
let animationFrameId = null;
let activeTabHandlers = [];

export const mount = () => {
    // Top tab select BJT vs Opamp
    const btnSelectZplane = document.getElementById('btn-select-zplane');
    const btnSelectSampling = document.getElementById('btn-select-sampling');
    
    const zplaneSection = document.getElementById('zplane-lab-section');
    const samplingSection = document.getElementById('sampling-lab-section');
    
    let activeLab = 'zplane'; // zplane vs sampling

    const handleLabSwitch = (lab) => {
        activeLab = lab;
        if (lab === 'zplane') {
            btnSelectZplane.classList.add('active');
            btnSelectSampling.classList.remove('active');
            zplaneSection.style.display = 'block';
            samplingSection.style.display = 'none';
        } else {
            btnSelectSampling.classList.add('active');
            btnSelectZplane.classList.remove('active');
            zplaneSection.style.display = 'none';
            samplingSection.style.display = 'block';
        }
        triggerResize();
    };

    btnSelectZplane.addEventListener('click', () => handleLabSwitch('zplane'));
    btnSelectSampling.addEventListener('click', () => handleLabSwitch('sampling'));

    // Sub tabs
    const initSubTabs = (tabContainerId) => {
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

    initSubTabs('zplane-lab-section');
    initSubTabs('sampling-lab-section');

    // 1. LAB 1 Canvases
    const zplaneCanvas = document.getElementById('dsp-zplane-canvas');
    const freqCanvas = document.getElementById('dsp-freq-canvas');
    const zCtx = zplaneCanvas.getContext('2d');
    const fCtx = freqCanvas.getContext('2d');
    
    let zWidth = zplaneCanvas.width = zplaneCanvas.parentElement.clientWidth * 0.45;
    let fWidth = freqCanvas.width = zplaneCanvas.parentElement.clientWidth * 0.55;
    let zHeight = zplaneCanvas.height = 440;
    let fHeight = freqCanvas.height = 440;

    // 2. LAB 2 Canvases
    const tCanvas = document.getElementById('sampling-time-canvas');
    const rCanvas = document.getElementById('sampling-recon-canvas');
    const tCtx = tCanvas.getContext('2d');
    const rCtx = rCanvas.getContext('2d');

    let tWidth = tCanvas.width = tCanvas.parentElement.clientWidth * 0.50;
    let rWidth = rCanvas.width = rCanvas.parentElement.clientWidth * 0.50;
    let tHeight = tCanvas.height = 440;
    let rHeight = rCanvas.height = 440;

    const handleResize = () => {
        if (activeLab === 'zplane') {
            const totalWidth = zplaneCanvas.parentElement.clientWidth;
            zWidth = zplaneCanvas.width = totalWidth * 0.45;
            fWidth = freqCanvas.width = totalWidth * 0.55;
            zHeight = zplaneCanvas.height = 440;
            fHeight = freqCanvas.height = 440;
        } else {
            const totalWidth = tCanvas.parentElement.clientWidth;
            tWidth = tCanvas.width = totalWidth * 0.50;
            rWidth = rCanvas.width = totalWidth * 0.50;
            tHeight = tCanvas.height = 440;
            rHeight = rCanvas.height = 440;
        }
    };
    window.addEventListener('resize', handleResize);
    zplaneCanvas._resizeHandler = handleResize;

    const triggerResize = () => {
        setTimeout(handleResize, 50);
    };

    // LAB 1 parameter state
    let poleR = 0.8;
    let poleTheta = 45;
    let zeroR = 0.0;
    let zeroTheta = 90;

    const sliderPoleR = document.getElementById('slider-pole-r');
    const sliderPoleTheta = document.getElementById('slider-pole-theta');
    const sliderZeroR = document.getElementById('slider-zero-r');
    const sliderZeroTheta = document.getElementById('slider-zero-theta');
    
    const labelPoleR = document.getElementById('val-pole-r');
    const labelPoleTheta = document.getElementById('val-pole-theta');
    const labelZeroR = document.getElementById('val-zero-r');
    const labelZeroTheta = document.getElementById('val-zero-theta');

    const readoutPoleCoords = document.getElementById('readout-pole-coords');
    const readoutZeroCoords = document.getElementById('readout-zero-coords');
    const readoutClass = document.getElementById('readout-dsp-class');

    function calculateZPlane() {
        poleR = parseFloat(sliderPoleR.value);
        poleTheta = parseFloat(sliderPoleTheta.value);
        zeroR = parseFloat(sliderZeroR.value);
        zeroTheta = parseFloat(sliderZeroTheta.value);

        labelPoleR.textContent = poleR.toFixed(2);
        labelPoleTheta.textContent = `${poleTheta}°`;
        labelZeroR.textContent = zeroR.toFixed(2);
        labelZeroTheta.textContent = `${zeroTheta}°`;

        const poleReal = poleR * Math.cos((poleTheta * Math.PI) / 180);
        const poleImag = poleR * Math.sin((poleTheta * Math.PI) / 180);
        readoutPoleCoords.textContent = `${poleReal.toFixed(2)} ± j${poleImag.toFixed(2)}`;

        const zeroReal = zeroR * Math.cos((zeroTheta * Math.PI) / 180);
        const zeroImag = zeroR * Math.sin((zeroTheta * Math.PI) / 180);
        readoutZeroCoords.textContent = `${zeroReal.toFixed(2)} ± j${zeroImag.toFixed(2)}`;

        if (poleR === 0 && zeroR > 0) {
            readoutClass.textContent = "FIR Notch/All-Zero";
        } else if (poleR > 0 && zeroR === 0) {
            readoutClass.textContent = "IIR All-Pole Filter";
        } else if (poleR > 0 && zeroR > 0) {
            if (poleTheta === zeroTheta) {
                readoutClass.textContent = "IIR Band-reject Notch";
            } else {
                readoutClass.textContent = "IIR Bandpass/Resonant";
            }
        } else {
            readoutClass.textContent = "Flat / Bystander Mode";
        }
    }

    sliderPoleR.addEventListener('input', calculateZPlane);
    sliderPoleTheta.addEventListener('input', calculateZPlane);
    sliderZeroR.addEventListener('input', calculateZPlane);
    sliderZeroTheta.addEventListener('input', calculateZPlane);

    document.getElementById('btn-dsp-reset').addEventListener('click', () => {
        sliderPoleR.value = 0.0;
        sliderPoleTheta.value = 0;
        sliderZeroR.value = 0.0;
        sliderZeroTheta.value = 0;
        calculateZPlane();
    });

    calculateZPlane();

    // LAB 2 parameter state (Sampling & Aliasing)
    let samp = { f: 4, fs: 24, amp: 2.0 };

    const sSampF = document.getElementById('slider-samp-f');
    const sSampFs = document.getElementById('slider-samp-fs');
    const sSampAmp = document.getElementById('slider-samp-amp');

    const vSampF = document.getElementById('val-samp-f');
    const vSampFs = document.getElementById('val-samp-fs');
    const vSampAmp = document.getElementById('val-samp-amp');

    const readNyquist = document.getElementById('read-samp-nyquist');
    const readFApparent = document.getElementById('read-samp-fapparent');
    const bannerWarning = document.getElementById('aliasing-warning-banner');

    function calculateSampling() {
        samp.f = parseInt(sSampF.value);
        samp.fs = parseInt(sSampFs.value);
        samp.amp = parseFloat(sSampAmp.value);

        vSampF.textContent = `${samp.f} Hz`;
        vSampFs.textContent = `${samp.fs} Hz`;
        vSampAmp.textContent = `${samp.amp.toFixed(1)} V`;

        const nyquistVal = samp.fs / 2;
        readNyquist.textContent = `${nyquistVal.toFixed(1)} Hz`;

        // Exact Apparent Aliased frequency folding solver
        let fApparent = samp.f;
        if (samp.f > nyquistVal) {
            // Aliasing folding logic
            const remainder = samp.f % samp.fs;
            if (remainder <= nyquistVal) {
                fApparent = remainder;
            } else {
                fApparent = samp.fs - remainder;
            }
            bannerWarning.style.display = 'block';
        } else {
            bannerWarning.style.display = 'none';
        }

        readFApparent.textContent = `${fApparent.toFixed(1)} Hz`;
        return { fApparent, isAliased: samp.f > nyquistVal };
    }

    sSampF.addEventListener('input', calculateSampling);
    sSampFs.addEventListener('input', calculateSampling);
    sSampAmp.addEventListener('input', calculateSampling);

    document.getElementById('btn-samp-reset').addEventListener('click', () => {
        sSampF.value = 4;
        sSampFs.value = 24;
        sSampAmp.value = 2.0;
        calculateSampling();
    });

    calculateSampling();

    // 3. MASTER ANIMATION LOOP
    let masterTick = 0;

    const runMasterLoop = () => {
        if (activeLab === 'zplane') {
            // --- 1. DRAW Z-PLANE (Left Canvas) ---
            zCtx.clearRect(0, 0, zWidth, zHeight);

            const zOriginX = zWidth / 2;
            const zOriginY = zHeight / 2;
            const scaleRadius = zWidth * 0.38;

            zCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            zCtx.lineWidth = 1.2;
            zCtx.beginPath();
            zCtx.moveTo(20, zOriginY); zCtx.lineTo(zWidth - 20, zOriginY);
            zCtx.moveTo(zOriginX, 20); zCtx.lineTo(zOriginX, zHeight - 20);
            zCtx.stroke();

            // unit circle
            zCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            zCtx.lineWidth = 1.8;
            zCtx.beginPath();
            zCtx.arc(zOriginX, zOriginY, scaleRadius, 0, Math.PI * 2);
            zCtx.stroke();

            zCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            zCtx.font = 'bold 10px monospace';
            zCtx.textAlign = 'right';
            zCtx.fillText('Re', zWidth - 10, zOriginY - 6);
            zCtx.textAlign = 'left';
            zCtx.fillText('Im', zOriginX + 6, 24);
            zCtx.fillText('1.0', zOriginX + scaleRadius + 6, zOriginY + 12);
            zCtx.fillText('-1.0', zOriginX - scaleRadius - 26, zOriginY + 12);

            // Conjugate zeros (O)
            const drawZero = (r, theta) => {
                if (r <= 0.01) return;
                const thetaRad = (theta * Math.PI) / 180;
                const px1 = zOriginX + r * Math.cos(thetaRad) * scaleRadius;
                const py1 = zOriginY - r * Math.sin(thetaRad) * scaleRadius;
                const px2 = zOriginX + r * Math.cos(-thetaRad) * scaleRadius;
                const py2 = zOriginY - r * Math.sin(-thetaRad) * scaleRadius;

                zCtx.strokeStyle = 'var(--accent-secondary)';
                zCtx.lineWidth = 2.5;
                zCtx.beginPath(); zCtx.arc(px1, py1, 5, 0, Math.PI*2); zCtx.stroke();
                if (theta > 0 && theta < 180) {
                    zCtx.beginPath(); zCtx.arc(px2, py2, 5, 0, Math.PI*2); zCtx.stroke();
                }
            };

            // Conjugate poles (X)
            const drawPole = (r, theta) => {
                if (r <= 0.01) return;
                const thetaRad = (theta * Math.PI) / 180;
                const px1 = zOriginX + r * Math.cos(thetaRad) * scaleRadius;
                const py1 = zOriginY - r * Math.sin(thetaRad) * scaleRadius;
                const px2 = zOriginX + r * Math.cos(-thetaRad) * scaleRadius;
                const py2 = zOriginY - r * Math.sin(-thetaRad) * scaleRadius;

                zCtx.strokeStyle = 'rgba(99, 102, 241, 0.95)';
                zCtx.lineWidth = 2.5;

                const drawX = (cx, cy) => {
                    zCtx.beginPath();
                    zCtx.moveTo(cx - 5, cy - 5); zCtx.lineTo(cx + 5, cy + 5);
                    zCtx.moveTo(cx + 5, cy - 5); zCtx.lineTo(cx - 5, cy + 5);
                    zCtx.stroke();
                };
                drawX(px1, py1);
                if (theta > 0 && theta < 180) {
                    drawX(px2, py2);
                }
            };

            drawZero(zeroR, zeroTheta);
            drawPole(poleR, poleTheta);

            // --- 2. DRAW MAGNITUDE SPECTRUM (Right Canvas) ---
            fCtx.clearRect(0, 0, fWidth, fHeight);

            const oX = 50;
            const oY = fHeight - 50;
            const graphW = fWidth - 75;
            const graphH = fHeight - 100;

            // Grid
            fCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            fCtx.lineWidth = 0.8;
            for (let x = oX; x <= oX + graphW; x += 40) {
                fCtx.beginPath(); fCtx.moveTo(x, 30); fCtx.lineTo(x, oY); fCtx.stroke();
            }
            for (let y = oY; y > 30; y -= 40) {
                fCtx.beginPath(); fCtx.moveTo(oX, y); fCtx.lineTo(oX + graphW, y); fCtx.stroke();
            }

            fCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            fCtx.lineWidth = 1.5;
            fCtx.beginPath(); fCtx.moveTo(oX, 30); fCtx.lineTo(oX, oY); fCtx.lineTo(oX + graphW, oY); fCtx.stroke();

            fCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            fCtx.font = '600 10px sans-serif';
            fCtx.textAlign = 'right';
            fCtx.fillText('Frequency (ω)', oX + graphW, oY + 22);
            fCtx.textAlign = 'left';
            fCtx.fillText('|H(e^jω)|', oX - 10, 20);

            const ticksCount = 4;
            for (let i = 0; i <= ticksCount; i++) {
                const tx = oX + (i / ticksCount) * graphW;
                fCtx.fillStyle = 'rgba(255,255,255,0.4)';
                fCtx.font = '9px monospace';
                fCtx.textAlign = 'center';
                let label = '0';
                if (i === ticksCount) label = 'π';
                else if (i === ticksCount / 2) label = '0.5π';
                else if (i > 0) label = `${(i / ticksCount).toFixed(2)}π`;
                fCtx.fillText(label, tx, oY + 12);
            }

            // Math poles zeros curve solver
            fCtx.beginPath();
            fCtx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
            fCtx.lineWidth = 3;

            let peakVal = 0.001;
            const magnitudes = [];

            const samplesCount = 100;
            const pRad = (poleTheta * Math.PI) / 180;
            const zRad = (zeroTheta * Math.PI) / 180;

            for (let i = 0; i <= samplesCount; i++) {
                const omega = (i / samplesCount) * Math.PI;
                const ejwReal = Math.cos(omega);
                const ejwImag = Math.sin(omega);

                let num = 1.0;
                if (zeroR > 0) {
                    const z1Real = zeroR * Math.cos(zRad);
                    const z1Imag = zeroR * Math.sin(zRad);
                    const dist1 = Math.sqrt(Math.pow(ejwReal - z1Real, 2) + Math.pow(ejwImag - z1Imag, 2));

                    const z2Real = zeroR * Math.cos(-zRad);
                    const z2Imag = zeroR * Math.sin(-zRad);
                    const dist2 = Math.sqrt(Math.pow(ejwReal - z2Real, 2) + Math.pow(ejwImag - z2Imag, 2));

                    num = dist1 * dist2;
                }

                let den = 1.0;
                if (poleR > 0) {
                    const p1Real = poleR * Math.cos(pRad);
                    const p1Imag = poleR * Math.sin(pRad);
                    const distP1 = Math.sqrt(Math.pow(ejwReal - p1Real, 2) + Math.pow(ejwImag - p1Imag, 2));

                    const p2Real = poleR * Math.cos(-pRad);
                    const p2Imag = poleR * Math.sin(-pRad);
                    const distP2 = Math.sqrt(Math.pow(ejwReal - p2Real, 2) + Math.pow(ejwImag - p2Imag, 2));

                    den = distP1 * distP2;
                }

                const mag = num / den;
                magnitudes.push(mag);
                if (mag > peakVal) peakVal = mag;
            }

            for (let i = 0; i <= samplesCount; i++) {
                const gx = oX + (i / samplesCount) * graphW;
                const mag = magnitudes[i];
                const gy = oY - (mag / (peakVal * 1.1)) * graphH;
                if (i === 0) fCtx.moveTo(gx, gy);
                else fCtx.lineTo(gx, gy);
            }
            fCtx.stroke();

            // Pulsating theta angle vertical indicator line
            const activeX = oX + (poleTheta / 180) * graphW;
            fCtx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
            fCtx.lineWidth = 1;
            fCtx.setLineDash([4, 4]);
            fCtx.beginPath(); fCtx.moveTo(activeX, 30); fCtx.lineTo(activeX, oY); fCtx.stroke();
            fCtx.restore();

        } else if (activeLab === 'sampling') {
            const { fApparent, isAliased } = calculateSampling();

            // --- 3. DRAW CONTINUOUS & SAMPLED SIGNAL (Left Canvas) ---
            tCtx.clearRect(0, 0, tWidth, tHeight);
            
            // Grid
            tCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            tCtx.lineWidth = 1;
            for (let x = 0; x < tWidth; x += 30) {
                tCtx.beginPath(); tCtx.moveTo(x, 0); tCtx.lineTo(x, tHeight); tCtx.stroke();
            }
            for (let y = 0; y < tHeight; y += 30) {
                tCtx.beginPath(); tCtx.moveTo(0, y); tCtx.lineTo(tWidth, y); tCtx.stroke();
            }

            const tOriginY = tHeight / 2;
            tCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            tCtx.lineWidth = 1.2;
            tCtx.beginPath(); tCtx.moveTo(10, tOriginY); tCtx.lineTo(tWidth - 10, tOriginY); tCtx.stroke();

            // Draw Continuous analog signal (thin dashed orange line)
            tCtx.save();
            tCtx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
            tCtx.lineWidth = 2.0;
            tCtx.setLineDash([4, 4]);
            tCtx.beginPath();
            
            const scopeSpeed = 0.005;

            for (let x = 0; x < tWidth; x++) {
                const t = x * scopeSpeed - masterTick * 0.03;
                const val = samp.amp * Math.sin(2 * Math.PI * samp.f * t);
                const py = tOriginY - val * 45;
                if (x === 0) tCtx.moveTo(x, py);
                else tCtx.lineTo(x, py);
            }
            tCtx.stroke();
            tCtx.restore();

            // Draw Sample Stalks (vertical cyan stems with circles)
            // Interval in pixels
            // A time interval between samples: dt = 1 / Fs
            // In graph pixels: dx = dt / scopeSpeed = 1 / (Fs * scopeSpeed)
            const sampleDistanceX = 1 / (samp.fs * scopeSpeed);
            // Starting index offset based on masterTick to look like signal moves left smoothly
            const timeShiftOffset = (masterTick * 0.03 / scopeSpeed) % sampleDistanceX;

            for (let sx = tWidth - timeShiftOffset; sx > 10; sx -= sampleDistanceX) {
                // Calculate original time mapping
                const mappedTime = sx * scopeSpeed - masterTick * 0.03;
                const sampleVal = samp.amp * Math.sin(2 * Math.PI * samp.f * mappedTime);
                const sy = tOriginY - sampleVal * 45;

                // draw stem
                tCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
                tCtx.lineWidth = 1.5;
                tCtx.beginPath();
                tCtx.moveTo(sx, tOriginY);
                tCtx.lineTo(sx, sy);
                tCtx.stroke();

                // draw dot
                tCtx.fillStyle = '#06b6d4';
                tCtx.beginPath();
                tCtx.arc(sx, sy, 4.5, 0, Math.PI * 2);
                tCtx.fill();
                tCtx.strokeStyle = '#fff';
                tCtx.lineWidth = 1;
                tCtx.stroke();
            }

            tCtx.fillStyle = 'rgba(255,255,255,0.7)';
            tCtx.font = 'bold 11px var(--font-heading)';
            tCtx.fillText('ANALOG SIGNAL (Dashed Amber)', 15, 25);
            tCtx.fillStyle = '#06b6d4';
            tCtx.fillText('DISCRETE SAMPLES (Cyan Stems)', 15, 42);

            // --- 4. DRAW RECONSTRUCTED SIGNAL (Right Canvas) ---
            rCtx.clearRect(0, 0, rWidth, rHeight);
            
            // Grid
            rCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            rCtx.lineWidth = 1;
            for (let x = 0; x < rWidth; x += 30) {
                rCtx.beginPath(); rCtx.moveTo(x, 0); rCtx.lineTo(x, rHeight); rCtx.stroke();
            }
            for (let y = 0; y < rHeight; y += 30) {
                rCtx.beginPath(); rCtx.moveTo(0, y); rCtx.lineTo(rWidth, y); rCtx.stroke();
            }

            rCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            rCtx.lineWidth = 1.2;
            rCtx.beginPath(); rCtx.moveTo(10, tOriginY); rCtx.lineTo(rWidth - 10, tOriginY); rCtx.stroke();

            // Draw Reconstructed Output Signal (Solid glowing cyan/purple)
            rCtx.beginPath();
            rCtx.strokeStyle = isAliased ? 'var(--accent-purple)' : '#10b981';
            rCtx.lineWidth = 3.0;

            for (let x = 0; x < rWidth; x++) {
                const t = x * scopeSpeed - masterTick * 0.03;
                
                // Reconstructed frequency: folds due to aliasing math calculated above
                // Note phase can invert in folding: let's keep it simple
                const val = samp.amp * Math.sin(2 * Math.PI * fApparent * t);
                const py = tOriginY - val * 45;

                if (x === 0) rCtx.moveTo(x, py);
                else rCtx.lineTo(x, py);
            }
            rCtx.stroke();

            // Display active apparent frequency telemetry text
            rCtx.fillStyle = isAliased ? 'var(--accent-purple)' : '#10b981';
            rCtx.font = 'bold 11px var(--font-heading)';
            if (isAliased) {
                rCtx.fillText(`RECONSTRUCTED ALIASED SINE (${fApparent.toFixed(1)} Hz)`, 15, 25);
            } else {
                rCtx.fillText(`RECONSTRUCTED IDEAL SINE (${fApparent.toFixed(1)} Hz)`, 15, 25);
            }
        }

        masterTick += 0.1;
        animationFrameId = requestAnimationFrame(runMasterLoop);
    };

    runMasterLoop();
};

export const unmount = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    const zplaneCanvas = document.getElementById('dsp-zplane-canvas');
    if (zplaneCanvas && zplaneCanvas._resizeHandler) {
        window.removeEventListener('resize', zplaneCanvas._resizeHandler);
    }

    activeTabHandlers.forEach(item => {
        item.buttons.forEach(btn => btn.removeEventListener('click', item.handler));
    });
    activeTabHandlers = [];
};
