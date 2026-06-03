/**
 * Nextron - Network Theory, Max Power & RC Transient View
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
            
            .transient-btn-group {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
            }
            .transient-btn {
                flex: 1;
                padding: 12px;
                font-weight: bold;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid var(--border-color);
                font-size: 0.9rem;
            }
            .transient-btn-charge {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border-color: rgba(16, 185, 129, 0.3);
            }
            .transient-btn-charge.active {
                background: #10b981;
                color: #fff;
                box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
                border-color: transparent;
            }
            .transient-btn-discharge {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border-color: rgba(239, 68, 68, 0.3);
            }
            .transient-btn-discharge.active {
                background: #ef4444;
                color: #fff;
                box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
                border-color: transparent;
            }
        </style>

        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-purple); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Semester 2: Circuit Analysis
                </span>
            </div>
            
            <!-- Top Lab selector tabs -->
            <div class="lab-selector-tabs">
                <button class="lab-tab-btn active" id="btn-select-maxpower">Lab 1: Maximum Power Transfer</button>
                <button class="lab-tab-btn" id="btn-select-rctransient">Lab 2: RC Transient Analyzer</button>
            </div>

            <!-- LAB 1: MAXIMUM POWER TRANSFER -->
            <div id="maxpower-lab-section">
                <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                    <h2>Maximum Power Transfer Laboratory</h2>
                    <p>Verify Maximum Power Transfer theorems. Tweak internal source resistance and load resistances to watch power load curves match theoretical limits.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 400px; background: #07090e; padding: 12px;">
                            <canvas id="network-canvas" class="visualizer-canvas" style="border-radius: var(--border-radius-sm); border: 1px solid rgba(157, 78, 221, 0.15);"></canvas>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Thevenin Voltage (V_th)</span>
                                        <span class="slider-val" id="val-net-vth">10.0 V</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-net-vth" min="1.0" max="20.0" step="0.5" value="10.0">
                                </div>
                                
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Thevenin Resistance (R_th)</span>
                                        <span class="slider-val" id="val-net-rth">100 Ω</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-net-rth" min="10" max="200" step="10" value="100">
                                </div>
                            </div>
                            
                            <div class="slider-group" style="margin-top: 16px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Load Resistance (R_L)</span>
                                    <span class="slider-val" id="val-net-rl">50 Ω</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-net-rl" min="10" max="200" step="5" value="50">
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="gauge"></i> Circuit Analysis Readings</h3>
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary);">Loop Current (I_L):</span>
                                    <span id="lbl-net-il" style="color: var(--success); font-weight: bold;">66.67 mA</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary);">Load Voltage (V_L):</span>
                                    <span id="lbl-net-vl" style="color: var(--accent-secondary); font-weight: bold;">3.33 V</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--text-secondary);">Load Power (P_L):</span>
                                    <span id="lbl-net-pl" style="color: var(--warning); font-weight: bold;">222.2 mW</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title" style="color: var(--warning);"><i data-lucide="book-open"></i> Theorem Verification</h3>
                            <p style="font-size: 0.82rem; line-height: 1.5; margin-bottom: 0;">
                                <strong>Maximum Power Transfer Theorem:</strong> States that a source will deliver maximum power to an external load resistance ($R_L$) if and only if the load resistance equals the internal Source Resistance ($R_{th}$). 
                                <br><br>
                                Watch the curve peak exactly when $R_L = R_{th}$ on the graph!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LAB 2: RC TRANSIENT ANALYZER -->
            <div id="rctransient-lab-section" style="display: none;">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>RC Circuit Transient Analyzer Laboratory</h2>
                    <p>Observe exponential voltage transitions across resistors and capacitors. Control the charge/discharge states and analyze time constant ($\tau = RC$) milestones.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 400px; background: #07090e; padding: 12px;">
                            <div class="signals-visual-grid" style="height: 100%;">
                                <div style="position: relative; height: 100%;">
                                    <div class="visualizer-labels">
                                        <span class="status-indicator completed"></span> Capacitor Plates & Exponential Charging Curve
                                    </div>
                                    <canvas id="transient-canvas" class="visualizer-canvas" style="border-radius: var(--border-radius-sm); border: 1px solid rgba(6, 182, 212, 0.15);"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Transient Actions (Charge / Discharge toggles) -->
                        <div class="transient-btn-group">
                            <button class="transient-btn transient-btn-charge active" id="btn-transient-charge">
                                <i data-lucide="battery-charging"></i> Charge Capacitor
                            </button>
                            <button class="transient-btn transient-btn-discharge" id="btn-transient-discharge">
                                <i data-lucide="zap-off"></i> Discharge Capacitor
                            </button>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Resistance (R)</span>
                                        <span class="slider-val" id="val-rc-r">5.0 kΩ</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-rc-r" min="1.0" max="10.0" step="0.5" value="5.0">
                                </div>
                                
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Capacitance (C)</span>
                                        <span class="slider-val" id="val-rc-c">50 μF</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-rc-c" min="10" max="100" step="10" value="50" style="background: rgba(6, 182, 212, 0.15);">
                                </div>
                                
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Voltage (Vin)</span>
                                        <span class="slider-val" id="val-rc-vin">8.0 V</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-rc-vin" min="2.0" max="12.0" step="0.5" value="8.0">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <!-- Telemetry readings -->
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="gauge"></i> Transient Readings</h3>
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary);">Time Constant (τ):</span>
                                    <span id="read-rc-tau" style="color: var(--accent-purple); font-weight: bold;">0.25 s</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary);">Capacitor Voltage (Vc):</span>
                                    <span id="read-rc-vc" style="color: var(--accent-secondary); font-weight: bold;">0.00 V</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--text-secondary);">Resistor Voltage (Vr):</span>
                                    <span id="read-rc-vr" style="color: #ef4444; font-weight: bold;">8.00 V</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--text-secondary);">Loop Current (i):</span>
                                    <span id="read-rc-i" style="color: var(--success); font-weight: bold;">1.60 mA</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title" style="color: var(--warning);"><i data-lucide="book-open"></i> Time Constant Milestone</h3>
                            <p style="font-size: 0.82rem; line-height: 1.5; margin-bottom: 0;">
                                At exactly $t = 1\tau$ (where $\tau = R \cdot C$):
                                <br><br>
                                📈 **Charging:** The capacitor voltage reaches exactly **63.2%** of its input value $V_{in}$.
                                <br><br>
                                📉 **Discharging:** The capacitor voltage drops to exactly **36.8%** of its initial starting value.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

let animationFrameId = null;

export const mount = () => {
    // Top selector tabs
    const btnSelectMaxpower = document.getElementById('btn-select-maxpower');
    const btnSelectRctransient = document.getElementById('btn-select-rctransient');
    const maxpowerSection = document.getElementById('maxpower-lab-section');
    const rctransientSection = document.getElementById('rctransient-lab-section');
    
    let activeLab = 'maxpower'; // maxpower vs rctransient

    const handleLabSwitch = (lab) => {
        activeLab = lab;
        if (lab === 'maxpower') {
            btnSelectMaxpower.classList.add('active');
            btnSelectRctransient.classList.remove('active');
            maxpowerSection.style.display = 'block';
            rctransientSection.style.display = 'none';
        } else {
            btnSelectRctransient.classList.add('active');
            btnSelectMaxpower.classList.remove('active');
            maxpowerSection.style.display = 'none';
            rctransientSection.style.display = 'block';
        }
        triggerResize();
    };

    btnSelectMaxpower.addEventListener('click', () => handleLabSwitch('maxpower'));
    btnSelectRctransient.addEventListener('click', () => handleLabSwitch('rctransient'));

    // LAB 1: Max Power
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = 376;

    // LAB 2: RC Transient
    const tCanvas = document.getElementById('transient-canvas');
    const tCtx = tCanvas.getContext('2d');
    let tWidth = tCanvas.width = tCanvas.parentElement.clientWidth;
    let tHeight = tCanvas.height = 376;

    const handleResize = () => {
        if (activeLab === 'maxpower') {
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = 376;
        } else {
            tWidth = tCanvas.width = tCanvas.parentElement.clientWidth;
            tHeight = tCanvas.height = 376;
        }
    };
    window.addEventListener('resize', handleResize);
    canvas._resizeHandler = handleResize;

    const triggerResize = () => {
        setTimeout(handleResize, 50);
    };

    // LAB 1 Param state
    const sVth = document.getElementById('slider-net-vth');
    const sRth = document.getElementById('slider-net-rth');
    const sRl = document.getElementById('slider-net-rl');
    
    const valVth = document.getElementById('val-net-vth');
    const valRth = document.getElementById('val-net-rth');
    const valRl = document.getElementById('val-net-rl');
    
    const lblIl = document.getElementById('lbl-net-il');
    const lblVl = document.getElementById('lbl-net-vl');
    const lblPl = document.getElementById('lbl-net-pl');

    let vth = 10.0;
    let rth = 100.0;
    let rl = 50.0;

    function solveMaxPower() {
        vth = parseFloat(sVth.value);
        rth = parseFloat(sRth.value);
        rl = parseFloat(sRl.value);

        valVth.textContent = `${vth.toFixed(1)} V`;
        valRth.textContent = `${rth.toFixed(0)} Ω`;
        valRl.textContent = `${rl.toFixed(0)} Ω`;

        const il = vth / (rth + rl); // Amperes
        const vl = il * rl; // Volts
        const pl = il * il * rl; // Watts

        lblIl.textContent = `${(il * 1000).toFixed(2)} mA`;
        lblVl.textContent = `${vl.toFixed(2)} V`;
        lblPl.textContent = `${(pl * 1000).toFixed(1)} mW`;
    }

    sVth.addEventListener('input', solveMaxPower);
    sRth.addEventListener('input', solveMaxPower);
    sRl.addEventListener('input', solveMaxPower);
    solveMaxPower();

    // LAB 2 Param state (Transient)
    const btnCharge = document.getElementById('btn-transient-charge');
    const btnDischarge = document.getElementById('btn-transient-discharge');

    const sR = document.getElementById('slider-rc-r');
    const sC = document.getElementById('slider-rc-c');
    const sVin = document.getElementById('slider-rc-vin');

    const valR = document.getElementById('val-rc-r');
    const valC = document.getElementById('val-rc-c');
    const valVin = document.getElementById('val-rc-vin');

    const readTau = document.getElementById('read-rc-tau');
    const readVc = document.getElementById('read-rc-vc');
    const readVr = document.getElementById('read-rc-vr');
    const readI = document.getElementById('read-rc-i');

    let transientMode = 'charge'; // charge vs discharge
    let r = 5.0; // kOhms
    let c = 50.0; // uF
    let vin = 8.0; // Volts

    let tau = 0.25; // seconds
    let capVoltage = 0.0; // dynamic capacitor voltage
    let capStartingVoltage = 0.0; // starting point of discharge/charge toggle
    let transientStartTime = Date.now();

    btnCharge.addEventListener('click', () => {
        btnCharge.classList.add('active');
        btnDischarge.classList.remove('active');
        transientMode = 'charge';
        capStartingVoltage = capVoltage;
        transientStartTime = Date.now();
    });

    btnDischarge.addEventListener('click', () => {
        btnDischarge.classList.add('active');
        btnCharge.classList.remove('active');
        transientMode = 'discharge';
        capStartingVoltage = capVoltage;
        transientStartTime = Date.now();
    });

    const solveTransient = () => {
        r = parseFloat(sR.value);
        c = parseFloat(sC.value);
        vin = parseFloat(sVin.value);

        valR.textContent = `${r.toFixed(1)} kΩ`;
        valC.textContent = `${c.toFixed(0)} μF`;
        valVin.textContent = `${vin.toFixed(1)} V`;

        // τ = R * C (kOhms * uF = milliseconds)
        // e.g. 5 kΩ * 50 uF = 250 ms = 0.25 s
        tau = (r * 1000) * (c * 1e-6);
        readTau.textContent = `${tau.toFixed(3)} s`;

        const elapsed = (Date.now() - transientStartTime) / 1000; // seconds

        if (transientMode === 'charge') {
            // Charging: Vc(t) = capStartingVoltage + (vin - capStartingVoltage) * (1 - e^-t/τ)
            capVoltage = capStartingVoltage + (vin - capStartingVoltage) * (1 - Math.exp(-elapsed / tau));
            if (capVoltage > vin - 0.001) capVoltage = vin;
        } else {
            // Discharging: Vc(t) = capStartingVoltage * e^-t/τ
            capVoltage = capStartingVoltage * Math.exp(-elapsed / tau);
            if (capVoltage < 0.001) capVoltage = 0.0;
        }

        const vr = transientMode === 'charge' ? vin - capVoltage : -capVoltage;
        // Loop current i = Vr / R (in mA)
        const currentMA = vr / r;

        readVc.textContent = `${capVoltage.toFixed(2)} V`;
        readVr.textContent = `${Math.abs(vr).toFixed(2)} V`;
        readI.textContent = `${Math.abs(currentMA).toFixed(3)} mA`;

        return { elapsed, currentMA };
    };

    sR.addEventListener('input', solveTransient);
    sC.addEventListener('input', solveTransient);
    sVin.addEventListener('input', solveTransient);

    document.getElementById('btn-samp-reset')?.addEventListener('click', () => {
        sR.value = 5.0;
        sC.value = 50;
        sVin.value = 8.0;
        solveTransient();
    });

    solveTransient();

    // 4. ANIMATED RUN LOOP
    let electronOffset = 0;
    const drawMasterLoop = () => {
        if (activeLab === 'maxpower') {
            ctx.clearRect(0, 0, width, height);

            const leftWidth = width * 0.45;
            const rightWidth = width * 0.55;

            // Divider
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(leftWidth, 0); ctx.lineTo(leftWidth, height); ctx.stroke();

            // --- DRAW THEVENIN SCHEMATIC ---
            const cX = leftWidth / 2;
            const cY = height / 2;

            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(cX - 70, cY - 50, 140, 100);

            // Active glowing loop current wires
            ctx.strokeStyle = 'rgba(157, 78, 221, 0.4)';
            ctx.lineWidth = 3.5;
            ctx.strokeRect(cX - 70, cY - 50, 140, 100);

            const il = vth / (rth + rl);
            electronOffset = (electronOffset + il * 100) % 40;
            ctx.fillStyle = '#fff';
            
            // Move dots
            for (let x = cX - 70 + electronOffset; x < cX + 70; x += 40) {
                ctx.beginPath(); ctx.arc(x, cY - 50, 2, 0, Math.PI*2); ctx.fill();
            }
            for (let y = cY - 50 + electronOffset; y < cY + 50; y += 40) {
                ctx.beginPath(); ctx.arc(cX + 70, y, 2, 0, Math.PI*2); ctx.fill();
            }
            for (let x = cX + 70 - electronOffset; x > cX - 70; x -= 40) {
                ctx.beginPath(); ctx.arc(x, cY + 50, 2, 0, Math.PI*2); ctx.fill();
            }
            for (let y = cY + 50 - electronOffset; y > cY - 50; y -= 40) {
                ctx.beginPath(); ctx.arc(cX - 70, y, 2, 0, Math.PI*2); ctx.fill();
            }

            // source
            ctx.fillStyle = '#07090e';
            ctx.beginPath(); ctx.arc(cX - 70, cY, 12, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#6366f1';
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('+', cX - 70, cY - 2);
            ctx.fillText('-', cX - 70, cY + 6);
            ctx.font = '9px monospace';
            ctx.fillText('Vth', cX - 94, cY + 3);

            // Rth
            ctx.fillStyle = '#07090e';
            ctx.fillRect(cX - 20, cY - 56, 40, 12);
            ctx.strokeStyle = '#06b6d4';
            ctx.strokeRect(cX - 15, cY - 56, 30, 12);
            ctx.fillStyle = '#fff';
            ctx.font = '10px var(--font-heading)';
            ctx.fillText('Rth', cX, cY - 60);

            // RL
            ctx.fillStyle = '#07090e';
            ctx.fillRect(cX + 64, cY - 20, 12, 40);
            ctx.strokeStyle = '#f59e0b';
            ctx.strokeRect(cX + 64, cY - 15, 12, 30);
            ctx.fillStyle = '#fff';
            ctx.fillText('RL', cX + 90, cY + 4);

            // --- DRAW MAXIMUM POWER TRANSFER GRAPH ---
            const gX = leftWidth + 45;
            const gY = height - 40;
            const gW = rightWidth - 65;
            const gH = height - 80;

            ctx.strokeStyle = 'rgba(255,255,255,0.02)';
            ctx.lineWidth = 1;
            for (let gx = gX; gx < gX + gW; gx += gW / 5) {
                ctx.beginPath(); ctx.moveTo(gx, gY - gH); ctx.lineTo(gx, gY); ctx.stroke();
            }
            for (let gy = gY - gH; gy < gY; gy += gH / 4) {
                ctx.beginPath(); ctx.moveTo(gX, gy); ctx.lineTo(gX + gW, gy); ctx.stroke();
            }

            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.moveTo(gX, gY - gH); ctx.lineTo(gX, gY); ctx.lineTo(gX + gW, gY);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('RL (Ω)', gX + gW, gY + 12);
            ctx.fillText('P_Load (mW)', gX - 10, gY - gH - 8);

            ctx.strokeStyle = 'rgba(157, 78, 221, 0.7)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();

            const maxPl = (vth * vth) / (4 * rth);
            for (let rx = 10; rx <= 200; rx += 2) {
                const rxCurr = vth / (rth + rx);
                const rxPl = rxCurr * rxCurr * rx;
                const px = gX + ((rx - 10) / 190) * gW;
                const py = gY - (rxPl / (maxPl * 1.2 || 1)) * gH;
                if (rx === 10) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // active RL dot
            const activeCurr = vth / (rth + rl);
            const activePl = activeCurr * activeCurr * rl;
            const dotX = gX + ((rl - 10) / 190) * gW;
            const dotY = gY - (activePl / (maxPl * 1.2 || 1)) * gH;

            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 8, 0, Math.PI*2); ctx.stroke();

            if (Math.abs(rl - rth) < 1) {
                ctx.fillStyle = '#10b981';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('MATCHED! MAX POWER DELIVERED', gX + gW/2, gY - gH + 15);
            }

        } else if (activeLab === 'rctransient') {
            const { elapsed, currentMA } = solveTransient();

            tCtx.clearRect(0, 0, tWidth, tHeight);

            const leftWidth = tWidth * 0.45;
            const rightWidth = tWidth * 0.55;

            // Divider
            tCtx.strokeStyle = 'rgba(255,255,255,0.05)';
            tCtx.lineWidth = 1;
            tCtx.beginPath(); tCtx.moveTo(leftWidth, 0); tCtx.lineTo(leftWidth, tHeight); tCtx.stroke();

            // --- 1. DRAW PHYSICAL RC SCHEMATIC ---
            const cX = leftWidth / 2;
            const cY = tHeight / 2 - 20;

            tCtx.strokeStyle = 'rgba(255,255,255,0.1)';
            tCtx.lineWidth = 2;
            tCtx.strokeRect(cX - 70, cY - 50, 140, 100);

            // Glowing moving wires proportional to currentMA
            if (Math.abs(currentMA) > 0.005) {
                tCtx.strokeStyle = transientMode === 'charge' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
                tCtx.lineWidth = 3.5;
                tCtx.strokeRect(cX - 70, cY - 50, 140, 100);

                // Move dot speed
                const speed = transientMode === 'charge' ? currentMA * 4 : -currentMA * 4;
                electronOffset = (electronOffset + speed) % 40;
                tCtx.fillStyle = '#fff';

                // Dot loop
                for (let x = cX - 70 + electronOffset; x < cX + 70; x += 40) {
                    tCtx.beginPath(); tCtx.arc(x, cY - 50, 2, 0, Math.PI*2); tCtx.fill();
                }
                for (let y = cY - 50 + electronOffset; y < cY + 50; y += 40) {
                    tCtx.beginPath(); tCtx.arc(cX + 70, y, 2, 0, Math.PI*2); tCtx.fill();
                }
            }

            // Draw Voltage Source
            tCtx.fillStyle = '#07090e';
            tCtx.beginPath(); tCtx.arc(cX - 70, cY, 12, 0, Math.PI*2); tCtx.fill();
            tCtx.strokeStyle = '#f59e0b';
            tCtx.stroke();
            tCtx.fillStyle = '#fff';
            tCtx.font = 'bold 8px monospace';
            tCtx.textAlign = 'center';
            tCtx.fillText('+', cX - 70, cY - 2);
            tCtx.fillText('-', cX - 70, cY + 6);
            tCtx.font = '9px monospace';
            tCtx.fillText('Vin', cX - 94, cY + 3);

            // Draw Resistor Box
            tCtx.fillStyle = '#07090e';
            tCtx.fillRect(cX - 20, cY - 56, 40, 12);
            tCtx.strokeStyle = '#ef4444';
            tCtx.strokeRect(cX - 15, cY - 56, 30, 12);
            tCtx.fillStyle = '#fff';
            tCtx.font = '10px var(--font-heading)';
            tCtx.fillText('R', cX, cY - 60);

            // Draw Capacitor Plates (Two parallel bars)
            const capX = cX + 70;
            tCtx.fillStyle = '#07090e';
            tCtx.fillRect(capX - 20, cY - 10, 40, 20); // clear loop wire segment
            
            tCtx.fillStyle = 'rgba(6, 182, 212, 0.9)';
            tCtx.fillRect(capX - 8, cY - 20, 4, 40); // left plate
            tCtx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            tCtx.fillRect(capX + 4, cY - 20, 4, 40); // right plate

            tCtx.strokeStyle = 'rgba(255,255,255,0.4)';
            tCtx.lineWidth = 2;
            tCtx.beginPath();
            tCtx.moveTo(capX - 25, cY); tCtx.lineTo(capX - 8, cY);
            tCtx.moveTo(capX + 8, cY); tCtx.lineTo(capX + 25, cY);
            tCtx.stroke();

            // Plate Charge electron sign accumulation animation!
            const maxSigns = 8;
            const activeSigns = Math.min(Math.round((capVoltage / vin) * maxSigns), maxSigns);
            tCtx.font = 'bold 8px monospace';
            tCtx.textAlign = 'center';
            for (let i = 0; i < activeSigns; i++) {
                const sy = cY - 15 + i * 4.5;
                // left plate gets positive charges
                tCtx.fillStyle = '#06b6d4';
                tCtx.fillText('+', capX - 14, sy);
                // right plate gets negative charges
                tCtx.fillStyle = '#ef4444';
                tCtx.fillText('-', capX + 14, sy);
            }

            tCtx.fillStyle = '#fff';
            tCtx.font = '10px var(--font-heading)';
            tCtx.fillText('C', capX + 30, cY + 4);

            // --- 2. DRAW EXPONENTIAL CURVE ---
            const gX = leftWidth + 45;
            const gY = tHeight - 40;
            const gW = rightWidth - 65;
            const gH = tHeight - 80;

            // Grid
            tCtx.strokeStyle = 'rgba(255,255,255,0.02)';
            tCtx.lineWidth = 1;
            for (let gx = gX; gx < gX + gW; gx += gW / 5) {
                tCtx.beginPath(); tCtx.moveTo(gx, gY - gH); tCtx.lineTo(gx, gY); tCtx.stroke();
            }
            for (let gy = gY - gH; gy < gY; gy += gH / 4) {
                tCtx.beginPath(); tCtx.moveTo(gX, gy); tCtx.lineTo(gX + gW, gy); tCtx.stroke();
            }

            tCtx.strokeStyle = 'rgba(255,255,255,0.3)';
            tCtx.lineWidth = 1.5;
            tCtx.beginPath();
            tCtx.moveTo(gX, gY - gH); tCtx.lineTo(gX, gY); tCtx.lineTo(gX + gW, gY);
            tCtx.stroke();

            tCtx.fillStyle = 'rgba(255,255,255,0.5)';
            tCtx.font = 'bold 8px monospace';
            tCtx.fillText('Time t (s)', gX + gW, gY + 12);
            tCtx.fillText('Voltage (V)', gX - 10, gY - gH - 8);

            // Plot dynamic charging or discharging curve
            tCtx.strokeStyle = 'var(--accent-secondary)';
            tCtx.lineWidth = 2.5;
            tCtx.beginPath();

            const timeLimit = 5 * tau; // plot up to 5 tau (settled)
            const mapXScale = gW / timeLimit;

            for (let t = 0; t <= timeLimit; t += timeLimit / 100) {
                let v = 0;
                if (transientMode === 'charge') {
                    v = vin * (1 - Math.exp(-t / tau));
                } else {
                    v = vin * Math.exp(-t / tau);
                }
                const px = gX + t * mapXScale;
                const py = gY - (v / (vin * 1.2)) * gH;
                if (t === 0) tCtx.moveTo(px, py);
                else tCtx.lineTo(px, py);
            }
            tCtx.stroke();

            // Draw current active dot coordinate
            if (elapsed <= timeLimit) {
                const activeX = gX + elapsed * mapXScale;
                const activeY = gY - (capVoltage / (vin * 1.2)) * gH;

                tCtx.fillStyle = '#fff';
                tCtx.beginPath(); tCtx.arc(activeX, activeY, 5, 0, Math.PI*2); tCtx.fill();
                tCtx.strokeStyle = '#06b6d4';
                tCtx.lineWidth = 2;
                tCtx.beginPath(); tCtx.arc(activeX, activeY, 8, 0, Math.PI*2); tCtx.stroke();
            }

            // Draw τ milestone vertical indicator line
            const tauX = gX + tau * mapXScale;
            tCtx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
            tCtx.lineWidth = 1;
            tCtx.setLineDash([4, 4]);
            tCtx.beginPath();
            tCtx.moveTo(tauX, gY);
            tCtx.lineTo(tauX, gY - gH);
            tCtx.stroke();
            tCtx.restore();

            tCtx.fillStyle = 'rgba(99, 102, 241, 0.7)';
            tCtx.font = 'bold 8px monospace';
            tCtx.fillText('1τ (63.2%/36.8%)', tauX, gY - gH + 12);
        }

        animationFrameId = requestAnimationFrame(drawMasterLoop);
    };

    drawMasterLoop();
};

export const unmount = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    const canvas = document.getElementById('network-canvas');
    if (canvas && canvas._resizeHandler) {
        window.removeEventListener('resize', canvas._resizeHandler);
    }
};
