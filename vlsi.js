/**
 * Nextron - VLSI Design & CMOS Inverter View
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
                    Sector 06: Micro-electronics
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>CMOS Inverter Sizing & VTC Laboratory</h2>
                <p>Manipulate channel widths (W/L ratio) of PMOS and NMOS transistors. Watch the silicon well boundaries morph and plot active Voltage Transfer Characteristics (VTC).</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 440px; background: #010409;">
                        <div class="visualizer-labels" style="border-color: rgba(6, 182, 212, 0.25);">
                            <span class="status-indicator completed" style="background: #06b6d4;"></span> CMOS Silicon Well cross-section & VTC Transfer Curve
                        </div>
                        <div class="diode-split" style="height: 100%;">
                            <!-- Left: CMOS Silicon Layout cross-section -->
                            <canvas id="vlsi-silicon-canvas" class="diode-model-canvas"></canvas>
                            <!-- Right: VTC Curve Graph -->
                            <canvas id="vlsi-vtc-canvas" class="diode-graph-canvas"></canvas>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">CMOS Physics</button>
                            <button class="tab-btn" data-tab="applications">Sizing & Noise Margins</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>VLSI Laboratory Exercises</h3>
                            <p>Follow these procedures to size transistors:</p>
                            <ul>
                                <li><strong>Experiment 1: Symmetrical Switching (Wp = 2.5Wn)</strong> - Set **NMOS Width** to 2.0μm and **PMOS Width** to 5.0μm. Slowly drag the **Input Voltage ($V_{in}$)** slider. Notice the VTC curve transitions exactly in the center ($V_{in} \approx 2.5\text{V}$). This represents perfect symmetrical design!</li>
                                <li><strong>Experiment 2: Skewed Threshold Shifts</strong> - Set **NMOS Width** to 8.0μm and **PMOS Width** to 2.0μm. Look at the VTC curve—it shifts left! The threshold voltage $V_{th}$ drops, making the inverter trigger much faster under rising input signals.</li>
                                <li><strong>Experiment 3: Carrier Inversion Channels</strong> - Look at the Silicon Well canvas. Set $V_{in}$ to 5.0V. Notice how the PMOS channel blocks current, while the NMOS channel attracts a dense blue layer of electrons, connecting source and drain, shorting the output to ground!</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>CMOS Inverter Substrate layers</h3>
                            <p>A **CMOS Inverter** is built by pairing a PMOS transistor (pull-up to VDD) and an NMOS transistor (pull-down to Ground):</p>
                            <ul>
                                <li><strong>NMOS Transistor:</strong> Fabricated directly in a p-type substrate. It uses heavily doped $n^+$ regions for source and drain. When input gate voltage $V_{GS}$ exceeds the threshold ($V_{tn} \approx 0.7\text{V}$), an inversion channel of negative electrons forms, turning it ON.</li>
                                <li><strong>PMOS Transistor:</strong> Fabricated inside a localized n-well substrate. It uses heavily doped $p^+$ regions for source and drain. When the gate is low, holes accumulate to create a positive channel, turning it ON.</li>
                                <li><strong>Isolation:</strong> Because the substrates are biased oppositely, they behave like reverse-biased diodes, isolating adjacent transistors electrically.</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-applications">
                            <h3>Transistor Sizing & Noise Margins</h3>
                            <p>To ensure high noise immunity in digital logic, a CMOS gate must have a high **Noise Margin** ($NM_H$ and $NM_L$). The **Voltage Transfer Characteristic (VTC)** is a graphical plot of $V_{out}$ vs $V_{in}$ displaying five key voltage levels:</p>
                            <ul>
                                <li>$V_{OH}$ (Output High) and $V_{OL}$ (Output Low)</li>
                                <li>$V_{IH}$ and $V_{IL}$ (Input High/Low limits, where the curve slope is exactly $-1$)</li>
                                <li>The noise margins are defined mathematically as:
                                $$NM_L = V_{IL} - V_{OL} \\quad \\text{and} \\quad NM_H = V_{OH} - V_{IH}$$</li>
                                <li>Because hole mobility inside PMOS silicon is about $2.5 \\times$ slower than electron mobility in NMOS, the PMOS channel width must be sized larger ($W_p \\approx 2.5 W_n$) to balance switching delays and noise immunity.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel">
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="sliders"></i> Sizing Parameters</h3>
                        
                        <!-- NMOS Width -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name" style="color: var(--accent-secondary); font-weight: bold;">NMOS Width (Wn)</span>
                                <span class="slider-val" id="val-vlsi-wn" style="color: var(--accent-secondary); font-weight: bold;">2.0 μm</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-vlsi-wn" min="1.0" max="8.0" step="0.5" value="2.0" style="background: rgba(6, 182, 212, 0.15);">
                        </div>
                        
                        <!-- PMOS Width -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name" style="color: var(--accent-purple); font-weight: bold;">PMOS Width (Wp)</span>
                                <span class="slider-val" id="val-vlsi-wp" style="color: var(--accent-purple); font-weight: bold;">5.0 μm</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-vlsi-wp" min="1.0" max="8.0" step="0.5" value="5.0" style="background: rgba(99, 102, 241, 0.15);">
                        </div>
                        
                        <!-- Input Gate Voltage -->
                        <div class="slider-group" style="margin-bottom: 24px;">
                            <div class="slider-label-row">
                                <span class="slider-name">Input Voltage (Vin)</span>
                                <span class="slider-val" id="val-vlsi-vin">2.5 V</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-vlsi-vin" min="0.0" max="5.0" step="0.1" value="2.5">
                        </div>
                        
                        <!-- Dynamic readout card -->
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Output Voltage (Vout):</span>
                                <span id="readout-vlsi-vout" style="color: #fff; font-weight: bold;">2.50 V</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">CMOS Switching Vth:</span>
                                <span id="readout-vlsi-vth" style="color: var(--warning); font-weight: bold;">2.50 V</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Noise Margin High (NMH):</span>
                                <span id="readout-vlsi-nmh" style="color: var(--success); font-weight: bold;">2.10 V</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Noise Margin Low (NML):</span>
                                <span id="readout-vlsi-nml" style="color: var(--success); font-weight: bold;">2.10 V</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation / Actions -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-vlsi-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                            <i data-lucide="refresh-cw"></i> Symmetrical Sizing
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
    const siliconCanvas = document.getElementById('vlsi-silicon-canvas');
    const vtcCanvas = document.getElementById('vlsi-vtc-canvas');
    if (!siliconCanvas || !vtcCanvas) return;

    const sCtx = siliconCanvas.getContext('2d');
    const vCtx = vtcCanvas.getContext('2d');
    
    let sWidth = siliconCanvas.width = siliconCanvas.parentElement.clientWidth * 0.5;
    let sHeight = siliconCanvas.height = 440;
    
    let vWidth = vtcCanvas.width = vtcCanvas.parentElement.clientWidth * 0.5;
    let vHeight = vtcCanvas.height = 440;
    
    const handleResize = () => {
        if (!siliconCanvas || !vtcCanvas) return;
        const totalWidth = siliconCanvas.parentElement.clientWidth;
        sWidth = siliconCanvas.width = totalWidth * 0.5;
        vWidth = vtcCanvas.width = totalWidth * 0.5;
        sHeight = siliconCanvas.height = 440;
        vHeight = vtcCanvas.height = 440;
    };
    window.addEventListener('resize', handleResize);
    siliconCanvas._resizeHandler = handleResize;

    // Sizing States
    let wn = 2.0;
    let wp = 5.0;
    let vin = 2.5;

    const sliderWn = document.getElementById('slider-vlsi-wn');
    const sliderWp = document.getElementById('slider-vlsi-wp');
    const sliderVin = document.getElementById('slider-vlsi-vin');
    
    const labelWn = document.getElementById('val-vlsi-wn');
    const labelWp = document.getElementById('val-vlsi-wp');
    const labelVin = document.getElementById('val-vlsi-vin');

    const readVout = document.getElementById('readout-vlsi-vout');
    const readVth = document.getElementById('readout-vlsi-vth');
    const readNMH = document.getElementById('readout-vlsi-nmh');
    const readNML = document.getElementById('readout-vlsi-nml');

    // CMOS inverter output calculator based on sizing and input voltage
    function calculateVTC(vinIn) {
        wn = parseFloat(sliderWn.value);
        wp = parseFloat(sliderWp.value);
        vin = parseFloat(sliderVin.value);

        labelWn.textContent = `${wn.toFixed(1)} μm`;
        labelWp.textContent = `${wp.toFixed(1)} μm`;
        labelVin.textContent = `${vin.toFixed(1)} V`;

        // Switch threshold voltage Vth
        // Vth = VDD / (1 + sqrt(BetaN / BetaP)) where Beta = W/L * mobility
        // Mobility ratio is roughly 2.5. So ratio = (wn / (wp / 2.5))
        const mobilityRatio = 2.5;
        const kn = wn;
        const kp = wp / mobilityRatio;
        const ratio = kn / kp;
        
        const vth = 5.0 / (1.0 + Math.sqrt(ratio));
        readVth.textContent = `${vth.toFixed(2)} V`;

        // Simple smooth VTC curve evaluator: Vout = VDD * (1 - 1 / (1 + exp(-5 * (Vin - Vth))))
        const evaluateVout = (vinVal) => {
            const sharpness = 6.0; // Slope sharpness
            return 5.0 * (1.0 - 1.0 / (1.0 + Math.exp(-sharpness * (vinVal - vth))));
        };

        const activeVout = evaluateVout(vin);
        readVout.textContent = `${activeVout.toFixed(2)} V`;

        // Noise Margins calculations
        // Simplified mapping depending on Vth shift
        const vil = vth - 0.4;
        const vih = vth + 0.4;
        const nmh = 5.0 - vih;
        const nml = vil - 0.0;
        
        readNMH.textContent = `${nmh.toFixed(2)} V`;
        readNML.textContent = `${nml.toFixed(2)} V`;

        return { vth, evaluateVout };
    }

    sliderWn.addEventListener('input', () => calculateVTC(vin));
    sliderWp.addEventListener('input', () => calculateVTC(vin));
    sliderVin.addEventListener('input', () => calculateVTC(vin));

    // Reset parameters to symmetrical
    const btnReset = document.getElementById('btn-vlsi-reset');
    btnReset.addEventListener('click', () => {
        sliderWn.value = 2.0;
        sliderWp.value = 5.0;
        sliderVin.value = 2.5;
        calculateVTC(2.5);
    });

    calculateVTC(2.5);

    // Animation Loop
    let particleOffset = 0;
    const runVLSILoop = () => {
        const { vth, evaluateVout } = calculateVTC(vin);
        const activeVout = evaluateVout(vin);

        // --- 1. DRAW SILICON CROSS-SECTION (Left Canvas) ---
        sCtx.clearRect(0, 0, sWidth, sHeight);

        // Substrate blocks
        sCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        sCtx.fillRect(10, 10, sWidth - 20, sHeight - 20);
        sCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        sCtx.strokeRect(10, 10, sWidth - 20, sHeight - 20);

        // Substrates layers boundaries
        // Left side: PMOS in N-Well
        sCtx.fillStyle = 'rgba(99, 102, 241, 0.04)'; // N-well
        sCtx.fillRect(15, 60, sWidth / 2 - 20, sHeight - 120);
        sCtx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        sCtx.strokeRect(15, 60, sWidth / 2 - 20, sHeight - 120);

        sCtx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        sCtx.font = 'bold 9px sans-serif';
        sCtx.fillText('N-WELL (PMOS Substrate)', 25, 76);

        // Right side: NMOS in P-Substrate
        sCtx.fillStyle = 'rgba(6, 182, 212, 0.03)'; // P-substrate
        sCtx.fillRect(sWidth / 2 + 5, 60, sWidth / 2 - 20, sHeight - 120);
        sCtx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        sCtx.strokeRect(sWidth / 2 + 5, 60, sWidth / 2 - 20, sHeight - 120);

        sCtx.fillStyle = 'rgba(6, 182, 212, 0.3)';
        sCtx.fillText('P-SUBSTRATE (NMOS)', sWidth / 2 + 15, 76);

        // Dynamic Gate Width representation
        // Sizing scales channel block sizes visually
        const pmosGateW = wp * 8 + 20;
        const nmosGateW = wn * 8 + 20;

        // PMOS Gate oxide electrode
        const pxGate = sWidth / 4;
        sCtx.fillStyle = '#1e293b';
        sCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        sCtx.fillRect(pxGate - pmosGateW / 2, 120, pmosGateW, 10);
        sCtx.strokeRect(pxGate - pmosGateW / 2, 120, pmosGateW, 10);

        // NMOS Gate oxide electrode
        const nxGate = (3 * sWidth) / 4;
        sCtx.fillStyle = '#1e293b';
        sCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        sCtx.fillRect(nxGate - nmosGateW / 2, 120, nmosGateW, 10);
        sCtx.strokeRect(nxGate - nmosGateW / 2, 120, nmosGateW, 10);

        // Draw sources and drains doped regions (colored blocks)
        sCtx.fillStyle = '#ef4444'; // p+ region for PMOS
        sCtx.fillRect(pxGate - pmosGateW / 2 - 25, 130, 25, 20);
        sCtx.fillRect(pxGate + pmosGateW / 2, 130, 25, 20);

        sCtx.fillStyle = '#06b6d4'; // n+ region for NMOS
        sCtx.fillRect(nxGate - nmosGateW / 2 - 25, 130, 25, 20);
        sCtx.fillRect(nxGate + nmosGateW / 2, 130, 25, 20);

        sCtx.font = 'bold 8px monospace';
        sCtx.fillStyle = '#fff';
        sCtx.fillText('p+', pxGate - pmosGateW / 2 - 18, 142);
        sCtx.fillText('p+', pxGate + pmosGateW / 2 + 8, 142);
        sCtx.fillText('n+', nxGate - nmosGateW / 2 - 18, 142);
        sCtx.fillText('n+', nxGate + nmosGateW / 2 + 8, 142);

        // Draw Inversion Channel layer if active
        // NMOS inversion channel is active when Vin > Vtn (high inputs)
        if (vin > 0.8) {
            sCtx.fillStyle = 'rgba(6, 182, 212, 0.4)';
            sCtx.fillRect(nxGate - nmosGateW / 2, 130, nmosGateW, 6);
            
            // Draw moving electrons
            sCtx.fillStyle = '#06b6d4';
            for (let i = 0; i < nmosGateW; i += 15) {
                const px = nxGate - nmosGateW / 2 + ((i + particleOffset) % nmosGateW);
                sCtx.beginPath();
                sCtx.arc(px, 133, 2, 0, Math.PI * 2);
                sCtx.fill();
            }
        }

        // PMOS inversion channel is active when Vin is low
        if (vin < 4.2) {
            sCtx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            sCtx.fillRect(pxGate - pmosGateW / 2, 130, pmosGateW, 6);

            // Draw moving holes
            sCtx.fillStyle = '#ef4444';
            for (let i = 0; i < pmosGateW; i += 15) {
                const px = pxGate - pmosGateW / 2 + ((i + particleOffset) % pmosGateW);
                sCtx.beginPath();
                sCtx.arc(px, 133, 2, 0, Math.PI * 2);
                sCtx.fill();
            }
        }

        // Label gates
        sCtx.fillStyle = 'rgba(255,255,255,0.7)';
        sCtx.font = 'bold 10px monospace';
        sCtx.fillText('PMOS Gate', pxGate - 28, 110);
        sCtx.fillText('NMOS Gate', nxGate - 28, 110);

        // --- 2. DRAW VTC PLOT (Right Canvas) ---
        vCtx.clearRect(0, 0, vWidth, vHeight);

        // Graph boundaries
        const oX = 50;
        const oY = vHeight - 50;
        const graphW = vWidth - 75;
        const graphH = vHeight - 100;

        // Draw grid
        vCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        vCtx.lineWidth = 0.8;
        for (let x = oX; x <= oX + graphW; x += 40) {
            vCtx.beginPath(); vCtx.moveTo(x, 30); vCtx.lineTo(x, oY); vCtx.stroke();
        }
        for (let y = oY; y > 30; y -= 40) {
            vCtx.beginPath(); vCtx.moveTo(oX, y); vCtx.lineTo(oX + graphW, y); vCtx.stroke();
        }

        // Draw axes
        vCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        vCtx.lineWidth = 1.5;
        vCtx.beginPath();
        vCtx.moveTo(oX, 30); vCtx.lineTo(oX, oY); vCtx.lineTo(oX + graphW, oY);
        vCtx.stroke();

        vCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        vCtx.font = '600 10px sans-serif';
        vCtx.textAlign = 'right';
        vCtx.fillText('Vin (V)', oX + graphW, oY + 22);
        vCtx.textAlign = 'left';
        vCtx.fillText('Vout (V)', oX - 10, 20);

        // Draw axes labels (0V to 5V)
        for (let i = 0; i <= 5; i++) {
            const vx = oX + (i / 5) * graphW;
            const vy = oY - (i / 5) * graphH;

            vCtx.fillStyle = 'rgba(255,255,255,0.4)';
            vCtx.font = '9px monospace';
            vCtx.textAlign = 'center';
            vCtx.fillText(`${i}V`, vx, oY + 12);
            vCtx.textAlign = 'right';
            vCtx.fillText(`${i}V`, oX - 8, vy + 4);
        }

        // Plot VTC curve
        vCtx.beginPath();
        vCtx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
        vCtx.lineWidth = 2.5;

        for (let v = 0.0; v <= 5.0; v += 0.05) {
            const plotVout = evaluateVout(v);
            const gx = oX + (v / 5) * graphW;
            const gy = oY - (plotVout / 5) * graphH;

            if (v === 0) vCtx.moveTo(gx, gy);
            else vCtx.lineTo(gx, gy);
        }
        vCtx.stroke();

        // Crosshair operating cursor point
        const activeX = oX + (vin / 5) * graphW;
        const activeY = oY - (activeVout / 5) * graphH;

        vCtx.strokeStyle = 'rgba(255,255,255,0.15)';
        vCtx.lineWidth = 1;
        vCtx.setLineDash([3, 3]);
        vCtx.beginPath();
        vCtx.moveTo(activeX, 30); vCtx.lineTo(activeX, oY);
        vCtx.moveTo(oX, activeY); vCtx.lineTo(oX + graphW, activeY);
        vCtx.stroke();
        vCtx.restore();

        // Dynamic pulsing cursor
        vCtx.fillStyle = 'var(--accent-secondary)';
        vCtx.beginPath();
        vCtx.arc(activeX, activeY, 5 + Math.sin(animationFrameId * 0.1) * 2, 0, Math.PI*2);
        vCtx.fill();
        vCtx.strokeStyle = '#fff';
        vCtx.lineWidth = 1.2;
        vCtx.stroke();

        // Print active coordinates
        vCtx.fillStyle = '#fff';
        vCtx.font = 'bold 9px monospace';
        vCtx.textAlign = 'left';
        vCtx.fillText(`(${vin.toFixed(1)}V, ${activeVout.toFixed(1)}V)`, activeX + 10, activeY - 4);

        particleOffset += 0.4;
        animationFrameId = requestAnimationFrame(runVLSILoop);
    };

    runVLSILoop();
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

    const siliconCanvas = document.getElementById('vlsi-silicon-canvas');
    if (siliconCanvas && siliconCanvas._resizeHandler) {
        window.removeEventListener('resize', siliconCanvas._resizeHandler);
    }
};
