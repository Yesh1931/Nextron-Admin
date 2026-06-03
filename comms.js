/**
 * Nextron - Communication Systems & Multi-Trace Modulation View
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
                    Sector 05: Telecommunications
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>Carrier Modulation & Constellation Laboratory</h2>
                <p>Synthesize analog and digital communications signals. Tweak carrier frequencies, noise channel models, and modulation variables to see signal traces stack and symbols scatter.</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 480px; background: #010409;">
                        <div class="visualizer-labels" style="border-color: rgba(16, 185, 129, 0.25);">
                            <span class="status-indicator completed" style="background: #10b981;"></span> Message, Carrier, Modulated Signals & IQ Constellation
                        </div>
                        <div class="diode-split" style="height: 100%;">
                            <!-- Left: Modulated Multi-Trace Screen -->
                            <canvas id="comms-wave-canvas" class="diode-model-canvas"></canvas>
                            <!-- Right: IQ Constellation Screen -->
                            <canvas id="comms-iq-canvas" class="diode-graph-canvas"></canvas>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">Carrier Modulation</button>
                            <button class="tab-btn" data-tab="applications">QAM Constellations</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>Communication Lab Exercises</h3>
                            <p>Follow these procedures to analyze noise limits:</p>
                            <ul>
                                <li><strong>Experiment 1: Amplitude Modulation Envelope</strong> - Select **Amplitude Modulation (AM)**. Drag the **Modulation Index** up to 1.0. Look at the stacked traces: the top trace is the message, the middle is the carrier, and the bottom modulated trace is a carrier whose outer envelope traces the message. If the index exceeds 1.0, severe envelope distortion (overmodulation) occurs!</li>
                                <li><strong>Experiment 2: Digital QAM Constellation</strong> - Select **16-QAM Modulation** mode. Notice the IQ grid on the right displays 16 clean orange dot clusters. Each dot represents a unique 4-bit symbol (amplitude and phase combination).</li>
                                <li><strong>Experiment 3: Gaussian Channel Noise</strong> - Under **16-QAM** mode, slowly increase the **Channel Noise** slider. Watch the constellation dots scatter in circular clouds around their centers. If noise is too high, symbols overlap, causing digital bit-errors at the receiver!</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>Analog Modulation Principles</h3>
                            <p>Modulation translates low-frequency message information into high-frequency channels by changing parameters of a sinusoidal carrier wave:</p>
                            <ul>
                                <li><strong>Amplitude Modulation (AM):</strong> The carrier amplitude is varied linearly with the message signal:
                                $$s(t) = [A_c + m(t)] \\cdot \\cos(2\\pi f_c t)$$</li>
                                <li><strong>Frequency Modulation (FM):</strong> The instantaneous frequency of the carrier is shifted in proportion to the message amplitude, keeping carrier height perfectly constant:
                                $$s(t) = A_c \\cdot \\cos\\left(2\\pi f_c t + \\beta \\int m(\\tau) d\\tau\\right)$$</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-applications">
                            <h3>QAM Constellations & Bandwidth Efficiency</h3>
                            <p>Quadrature Amplitude Modulation (QAM) is the bedrock of modern high-speed internet (WiFi, LTE, 5G). By splitting a carrier wave into two orthogonal components: In-Phase ($I$, a cosine wave) and Quadrature ($Q$, a sine wave), QAM transmits amplitude and phase variations simultaneously.</p>
                            <ul>
                                <li><strong>BPSK (Binary PSK):</strong> Transmits 1 bit per symbol (2 dots at phase $0^\circ$ and $180^\circ$).</li>
                                <li><strong>QPSK (Quad PSK):</strong> Transmits 2 bits per symbol (4 dots in quadrants).</li>
                                <li><strong>16-QAM:</strong> Transmits 4 bits per symbol using a $4 \times 4$ grid, doubling spectral efficiency relative to QPSK in the same bandwidth! However, closer dot packing makes QAM highly sensitive to channel noise.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel" style="max-height: 720px; overflow-y: auto;">
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="sliders"></i> Modulator</h3>
                        
                        <!-- Modulation type select -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <span class="slider-name" style="font-size: 0.85rem; font-weight: 600;">Select Scheme</span>
                            <select id="comms-scheme-select" style="width: 100%; padding: 10px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; font-family: monospace; font-size: 0.85rem; margin-top: 6px; cursor: pointer;">
                                <option value="am">AM (Amplitude Modulation)</option>
                                <option value="fm">FM (Frequency Modulation)</option>
                                <option value="qpsk">QPSK (Digital Quadrature PSK)</option>
                                <option value="16qam">16-QAM (Digital Quadrature AM)</option>
                            </select>
                        </div>

                        <!-- Modulation index slider -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name" id="label-index-name">Modulation Index (m)</span>
                                <span class="slider-val" id="val-comms-index">0.70</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-comms-index" min="0.1" max="1.5" step="0.05" value="0.70">
                        </div>
                        
                        <!-- Carrier frequency slider -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name">Carrier Freq (fc)</span>
                                <span class="slider-val" id="val-comms-fc">60 Hz</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-comms-fc" min="20" max="120" step="5" value="60">
                        </div>
                        
                        <!-- Channel noise slider -->
                        <div class="slider-group" style="margin-bottom: 24px;">
                            <div class="slider-label-row">
                                <span class="slider-name" style="color: var(--error); font-weight: bold;">Gaussian Channel Noise</span>
                                <span class="slider-val" id="val-comms-noise" style="color: var(--error); font-weight: bold;">0.05</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-comms-noise" min="0.0" max="0.6" step="0.02" value="0.05" style="background: rgba(239, 68, 68, 0.15);">
                        </div>
                        
                        <!-- Dynamic readout card -->
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Signal-to-Noise Ratio (SNR):</span>
                                <span id="readout-comms-snr" style="color: var(--success); font-weight: bold;">26.0 dB</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Symbol Bit-Capacity:</span>
                                <span id="readout-comms-bits" style="color: #fff; font-weight: bold;">4 bits / symbol</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Estimated BER:</span>
                                <span id="readout-comms-ber" style="color: var(--warning); font-weight: bold;">0.00% (Clear Channel)</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation / Actions -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-comms-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                            <i data-lucide="refresh-cw"></i> Reset Channel
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
    const waveCanvas = document.getElementById('comms-wave-canvas');
    const iqCanvas = document.getElementById('comms-iq-canvas');
    if (!waveCanvas || !iqCanvas) return;

    const wCtx = waveCanvas.getContext('2d');
    const iCtx = iqCanvas.getContext('2d');
    
    let wWidth = waveCanvas.width = waveCanvas.parentElement.clientWidth * 0.62;
    let wHeight = waveCanvas.height = 480;
    
    let iWidth = iqCanvas.width = iqCanvas.parentElement.clientWidth * 0.38;
    let iHeight = iqCanvas.height = 480;
    
    const handleResize = () => {
        if (!waveCanvas || !iqCanvas) return;
        const totalWidth = waveCanvas.parentElement.clientWidth;
        wWidth = waveCanvas.width = totalWidth * 0.62;
        iWidth = iqCanvas.width = totalWidth * 0.38;
        wHeight = waveCanvas.height = 480;
        iHeight = iqCanvas.height = 480;
    };
    window.addEventListener('resize', handleResize);
    waveCanvas._resizeHandler = handleResize;

    // Modulator States
    let activeScheme = "am";
    let modIndex = 0.7;
    let fc = 60;
    let noiseStd = 0.05;

    const selectScheme = document.getElementById('comms-scheme-select');
    const sliderIndex = document.getElementById('slider-comms-index');
    const sliderFc = document.getElementById('slider-comms-fc');
    const sliderNoise = document.getElementById('slider-comms-noise');
    
    const labelIndexName = document.getElementById('label-index-name');
    const valIndex = document.getElementById('val-comms-index');
    const valFc = document.getElementById('val-comms-fc');
    const valNoise = document.getElementById('val-comms-noise');

    const readSNR = document.getElementById('readout-comms-snr');
    const readBits = document.getElementById('readout-comms-bits');
    const readBER = document.getElementById('readout-comms-ber');

    function calculateTelemetry() {
        activeScheme = selectScheme.value;
        modIndex = parseFloat(sliderIndex.value);
        fc = parseInt(sliderFc.value);
        noiseStd = parseFloat(sliderNoise.value);

        valIndex.textContent = modIndex.toFixed(2);
        valFc.textContent = `${fc} Hz`;
        valNoise.textContent = noiseStd.toFixed(2);

        // Modify label depending on scheme
        if (activeScheme === "am") {
            labelIndexName.textContent = "Modulation Index (m)";
            readBits.textContent = "Analog (Infinite)";
        } else if (activeScheme === "fm") {
            labelIndexName.textContent = "Frequency Deviation (β)";
            readBits.textContent = "Analog (Infinite)";
        } else if (activeScheme === "qpsk") {
            labelIndexName.textContent = "Amplitude scaling";
            readBits.textContent = "2 bits / symbol";
        } else if (activeScheme === "16qam") {
            labelIndexName.textContent = "Grid scaling";
            readBits.textContent = "4 bits / symbol";
        }

        // Calculate visual SNR: SNR(dB) = 20 * log10 (1 / noiseStd)
        if (noiseStd <= 0.001) {
            readSNR.textContent = "Infinite (Clean Channel)";
            readBER.textContent = "0.00% (Clear Channel)";
            readBER.style.color = "var(--success)";
        } else {
            const snr = 20 * Math.log10(1.0 / noiseStd);
            readSNR.textContent = `${snr.toFixed(1)} dB`;
            
            // BER estimate helper
            let ber = 0;
            if (activeScheme === "16qam") {
                if (snr < 12) ber = 15.5;
                else if (snr < 18) ber = 3.2;
                else if (snr < 22) ber = 0.45;
                else ber = 0.00;
            } else if (activeScheme === "qpsk") {
                if (snr < 8) ber = 12.0;
                else if (snr < 14) ber = 1.1;
                else ber = 0.00;
            }

            if (ber > 0) {
                readBER.textContent = `${ber.toFixed(2)}% (Errors Present)`;
                readBER.style.color = "var(--error)";
            } else {
                readBER.textContent = "0.00% (Error-Free Decoding)";
                readBER.style.color = "var(--success)";
            }
        }
    }

    selectScheme.addEventListener('change', () => {
        calculateTelemetry();
    });
    sliderIndex.addEventListener('input', calculateTelemetry);
    sliderFc.addEventListener('input', calculateTelemetry);
    sliderNoise.addEventListener('input', calculateTelemetry);

    // Reset button
    const btnReset = document.getElementById('btn-comms-reset');
    btnReset.addEventListener('click', () => {
        sliderIndex.value = 0.70;
        sliderFc.value = 60;
        sliderNoise.value = 0.05;
        calculateTelemetry();
    });

    calculateTelemetry();

    // Box-Muller Gaussian Noise generator
    function getGaussianNoise(std) {
        if (std <= 0) return 0;
        const u1 = Math.random();
        const u2 = Math.random();
        return std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    // Static Constellation points
    const QPSK_POINTS = [
        { i: 0.7, q: 0.7 },
        { i: -0.7, q: 0.7 },
        { i: 0.7, q: -0.7 },
        { i: -0.7, q: -0.7 }
    ];

    const QAM16_POINTS = [];
    const qamLevels = [-0.9, -0.3, 0.3, 0.9];
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            QAM16_POINTS.push({ i: qamLevels[x], q: qamLevels[y] });
        }
    }

    // Animation Loop
    let timeTick = 0;
    const runCommsLoop = () => {
        // --- 1. DRAW THREE STACKED WAVEFORMS (Left Canvas) ---
        wCtx.clearRect(0, 0, wWidth, wHeight);

        const subPlotHeight = wHeight / 3;
        
        // Phosphor grid lines for all subplots
        wCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        wCtx.lineWidth = 0.8;
        for (let x = 0; x < wWidth; x += 25) {
            wCtx.beginPath(); wCtx.moveTo(x, 0); wCtx.lineTo(x, wHeight); wCtx.stroke();
        }
        for (let y = 0; y < wHeight; y += 20) {
            wCtx.beginPath(); wCtx.moveTo(0, y); wCtx.lineTo(wWidth, y); wCtx.stroke();
        }

        // Draw sub-divided margins
        wCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        wCtx.lineWidth = 1.2;
        wCtx.beginPath();
        wCtx.moveTo(0, subPlotHeight); wCtx.lineTo(wWidth, subPlotHeight);
        wCtx.moveTo(0, 2 * subPlotHeight); wCtx.lineTo(wWidth, 2 * subPlotHeight);
        wCtx.stroke();

        const timeScale = 0.00015;
        const msgFreq = 8; // Low message freq

        // Trace 1: Message Signal m(t) (Amber)
        wCtx.beginPath();
        wCtx.strokeStyle = '#f59e0b';
        wCtx.lineWidth = 2.0;
        const originY1 = subPlotHeight / 2;

        for (let x = 0; x < wWidth; x++) {
            const t = (x - wWidth / 2) * timeScale + timeTick;
            let mVal = 0;
            if (activeScheme === "am" || activeScheme === "fm") {
                mVal = Math.sin(2 * Math.PI * msgFreq * t);
            } else {
                // Digital steps
                const symbolPeriod = 0.08;
                const activeSymbolIndex = Math.floor(t / symbolPeriod) % 6;
                const amplitudes = [0.4, 0.9, -0.4, 0.9, -0.9, 0.4];
                mVal = amplitudes[activeSymbolIndex] / 0.9;
            }
            const py = originY1 - mVal * 30;
            if (x === 0) wCtx.moveTo(x, py);
            else wCtx.lineTo(x, py);
        }
        wCtx.stroke();

        // Trace 2: Carrier Wave c(t) (Blue)
        wCtx.beginPath();
        wCtx.strokeStyle = '#6366f1';
        wCtx.lineWidth = 1.5;
        const originY2 = subPlotHeight + subPlotHeight / 2;

        for (let x = 0; x < wWidth; x++) {
            const t = (x - wWidth / 2) * timeScale + timeTick;
            const cVal = Math.cos(2 * Math.PI * fc * t);
            const py = originY2 - cVal * 30;
            if (x === 0) wCtx.moveTo(x, py);
            else wCtx.lineTo(x, py);
        }
        wCtx.stroke();

        // Trace 3: Modulated Wave s(t) (Green)
        wCtx.beginPath();
        wCtx.strokeStyle = '#10b981';
        wCtx.lineWidth = 2.2;
        const originY3 = 2 * subPlotHeight + subPlotHeight / 2;

        for (let x = 0; x < wWidth; x++) {
            const t = (x - wWidth / 2) * timeScale + timeTick;
            const message = Math.sin(2 * Math.PI * msgFreq * t);
            const carrier = Math.cos(2 * Math.PI * fc * t);
            let sVal = 0;

            if (activeScheme === "am") {
                const envelope = 1.0 + modIndex * message;
                sVal = envelope * carrier;

                // Faint envelope boundary
                if (x % 8 === 0) {
                    wCtx.fillStyle = 'rgba(245, 158, 11, 0.3)';
                    wCtx.fillRect(x, originY3 - envelope * 30, 2, 2);
                    wCtx.fillRect(x, originY3 + envelope * 30, 2, 2);
                }
            } else if (activeScheme === "fm") {
                sVal = Math.cos(2 * Math.PI * fc * t - modIndex * 6 * Math.cos(2 * Math.PI * msgFreq * t));
            } else {
                // Digital
                const symbolPeriod = 0.08;
                const activeSymbolIndex = Math.floor(t / symbolPeriod) % 6;
                const amplitudes = [0.4, 0.9, -0.4, 0.9, -0.9, 0.4];
                const activeAmp = amplitudes[activeSymbolIndex];
                sVal = activeAmp * carrier;
            }

            sVal += getGaussianNoise(noiseStd * 0.15);
            const py = originY3 - sVal * 30;
            if (x === 0) wCtx.moveTo(x, py);
            else wCtx.lineTo(x, py);
        }
        wCtx.stroke();

        // Titles and metadata texts
        wCtx.font = 'bold 9px monospace';
        wCtx.fillStyle = '#f59e0b';
        wCtx.fillText('Message Signal m(t)', 15, 16);
        wCtx.fillStyle = '#6366f1';
        wCtx.fillText('Carrier Wave c(t)', 15, subPlotHeight + 16);
        wCtx.fillStyle = '#10b981';
        wCtx.fillText('Modulated Signal s(t)', 15, 2 * subPlotHeight + 16);

        // --- 2. DRAW IQ CONSTELLATION (Right Canvas) ---
        iCtx.clearRect(0, 0, iWidth, iHeight);

        const iOriginX = iWidth / 2;
        const iOriginY = iHeight / 2;
        const scaleGrid = iWidth * 0.38;

        // Draw axes
        iCtx.strokeStyle = 'rgba(255,255,255,0.15)';
        iCtx.lineWidth = 1.2;
        iCtx.beginPath();
        iCtx.moveTo(20, iOriginY); iCtx.lineTo(iWidth - 20, iOriginY);
        iCtx.moveTo(iOriginX, 20); iCtx.lineTo(iOriginX, iHeight - 20);
        iCtx.stroke();

        // Labels
        iCtx.fillStyle = 'rgba(255,255,255,0.4)';
        iCtx.font = 'bold 9px monospace';
        iCtx.textAlign = 'right';
        iCtx.fillText('In-Phase (I)', iWidth - 10, iOriginY - 6);
        iCtx.textAlign = 'left';
        iCtx.fillText('Quadrature (Q)', iOriginX + 6, 24);

        // Scatter points
        const points = activeScheme === "16qam" ? QAM16_POINTS : QPSK_POINTS;

        points.forEach(pt => {
            const cloudSize = activeScheme === "16qam" ? 5 : 8;
            for (let i = 0; i < cloudSize; i++) {
                const noiseI = getGaussianNoise(noiseStd * 0.4);
                const noiseQ = getGaussianNoise(noiseStd * 0.4);
                
                const sx = iOriginX + (pt.i * modIndex + noiseI) * scaleGrid;
                const sy = iOriginY - (pt.q * modIndex + noiseQ) * scaleGrid;

                iCtx.fillStyle = activeScheme === "16qam" ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.5)';
                iCtx.beginPath();
                iCtx.arc(sx, sy, 1.8, 0, Math.PI * 2);
                iCtx.fill();
            }

            const tx = iOriginX + pt.i * modIndex * scaleGrid;
            const ty = iOriginY - pt.q * modIndex * scaleGrid;
            iCtx.fillStyle = '#fff';
            iCtx.beginPath();
            iCtx.arc(tx, ty, 3, 0, Math.PI * 2);
            iCtx.fill();
        });

        // Time sweep increment
        timeTick += 0.0006;
        animationFrameId = requestAnimationFrame(runCommsLoop);
    };

    runCommsLoop();
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

    const waveCanvas = document.getElementById('comms-wave-canvas');
    if (waveCanvas && waveCanvas._resizeHandler) {
        window.removeEventListener('resize', waveCanvas._resizeHandler);
    }
};
