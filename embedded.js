/**
 * Nextron - Embedded Systems & IoT View
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
                    Sector 06: Systems Integration
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>IoT Wireless Node & Path Loss Laboratory</h2>
                <p>Configure smart edge transceivers. Adjust frequency channels and power limits to analyze Free Space Path Loss (FSPL) and packet packet attenuation.</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 440px; background: #010409;">
                        <div class="visualizer-labels" style="border-color: rgba(99, 102, 241, 0.25);">
                            <span class="status-indicator completed" style="background: #6366f1;"></span> IoT 2D Network Map & Signal Attenuation Curve
                        </div>
                        <div class="diode-split" style="height: 100%;">
                            <!-- Left: 2D Wireless Network Map -->
                            <canvas id="embedded-map-canvas" class="diode-model-canvas"></canvas>
                            <!-- Right: Attenuation Curve Graph -->
                            <canvas id="embedded-graph-canvas" class="diode-graph-canvas"></canvas>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">Path Loss Physics</button>
                            <button class="tab-btn" data-tab="applications">LoRa vs Wi-Fi</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>Embedded Lab Exercises</h3>
                            <p>Follow these procedures to map sensor links:</p>
                            <ul>
                                <li><strong>Experiment 1: WiFi Attenuation Limits</strong> - Select **2.4 GHz (Wi-Fi)** mode. Drag the **Distance** slider to 100m. Notice the RSSI readout drops below $-80\text{dBm}$ (Red status). WiFi attenuates extremely fast, making it unsuitable for long-range agricultural telemetry!</li>
                                <li><strong>Experiment 2: Sub-GHz LoRa Propagation</strong> - Switch the frequency to **868 MHz (LoRa)**. Keep distance at 100m. Notice how the RSSI stays incredibly strong (approx $-65\text{dBm}$, Green status). LoRa utilizes lower frequencies to achieve massive range bounds.</li>
                                <li><strong>Experiment 3: Boost Link Budget</strong> - Set frequency to **2.4 GHz** and distance to 150m (poor connection). Increase the **Transmit Power ($P_t$)** slider from 5dBm to 20dBm. Look at the signal strength map—the sensor link recovers to operational margins!</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>Free Space Path Loss (FSPL) Mathematics</h3>
                            <p>Electromagnetic waves expand in spherical shapes as they travel through vacuum. Therefore, the power density of the radio signal decreases with the square of the distance. This attenuation is calculated using the **Free Space Path Loss** formula:</p>
                            $$FSPL\\text{ (dB)} = 20 \\cdot \\log_{10}(d) + 20 \\cdot \\log_{10}(f) + 32.44$$
                            <p>Where $d$ is distance in kilometers, and $f$ is frequency in megahertz (MHz). The **Received Power** ($P_{rx}$) at the edge device is:</p>
                            $$P_{rx}\\text{ (dBm)} = P_{tx} + G_{tx} + G_{rx} - FSPL$$
                            <p>Where $P_{tx}$ is transmitter power, and $G$ are antenna gains.</p>
                        </div>
                        
                        <div class="tab-content" id="tab-applications">
                            <h3>Wi-Fi vs. LoRa Edge Networks</h3>
                            <p>Embedded systems design requires balancing trade-offs between bandwidth, range, and power consumption:</p>
                            <ul>
                                <li><strong>Wi-Fi (2.4 GHz / 5 GHz):</strong> High data rates (ideal for video streaming), but high power consumption and very short range due to massive path loss at higher gigahertz frequencies.</li>
                                <li><strong>LoRaWAN (868 MHz / 915 MHz):</strong> Ultra-low power (batteries can last 10 years) and massive ranges (up to 15km), achieved by using lower frequencies and Chirp Spread Spectrum (CSS) modulation, which decodes signals even below the thermal noise floor!</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel">
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="sliders"></i> Link Budget</h3>
                        
                        <!-- Transmit Frequency selection -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <span class="slider-name" style="font-size: 0.85rem; font-weight: 600;">Select Protocol / Frequency</span>
                            <select id="embedded-freq-select" style="width: 100%; padding: 10px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; font-family: monospace; font-size: 0.85rem; margin-top: 6px; cursor: pointer;">
                                <option value="wifi">2.4 GHz (Wi-Fi 802.11)</option>
                                <option value="lora">868 MHz (LoRa Sub-GHz)</option>
                            </select>
                        </div>

                        <!-- Transmit Power slider -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name">Transmit Power (Pt)</span>
                                <span class="slider-val" id="val-embedded-pt">14 dBm</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-embedded-pt" min="0" max="20" step="1" value="14">
                            <span style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between;">
                                <span>Low (1 mW)</span>
                                <span>High (100 mW)</span>
                            </span>
                        </div>
                        
                        <!-- Distance slider -->
                        <div class="slider-group" style="margin-bottom: 24px;">
                            <div class="slider-label-row">
                                <span class="slider-name" style="color: var(--accent-secondary); font-weight: bold;">Distance (d)</span>
                                <span class="slider-val" id="val-embedded-d" style="color: var(--accent-secondary); font-weight: bold;">80 m</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-embedded-d" min="10" max="300" step="5" value="80" style="background: rgba(6, 182, 212, 0.15);">
                        </div>
                        
                        <!-- Dynamic readout card -->
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">RSSI Signal Power:</span>
                                <span id="readout-embedded-rssi" style="color: var(--success); font-weight: bold;">-68.5 dBm</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Free Space Path Loss:</span>
                                <span id="readout-embedded-fspl" style="color: var(--error); font-weight: bold;">82.5 dB</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Packet Delivery Rate:</span>
                                <span id="readout-embedded-pdr" style="color: #fff; font-weight: bold;">100% (Optimal Link)</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation / Actions -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-embedded-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                            <i data-lucide="refresh-cw"></i> Reset Link
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
    const mapCanvas = document.getElementById('embedded-map-canvas');
    const graphCanvas = document.getElementById('embedded-graph-canvas');
    if (!mapCanvas || !graphCanvas) return;

    const mCtx = mapCanvas.getContext('2d');
    const gCtx = graphCanvas.getContext('2d');
    
    let mWidth = mapCanvas.width = mapCanvas.parentElement.clientWidth * 0.5;
    let mHeight = mapCanvas.height = 440;
    
    let gWidth = graphCanvas.width = graphCanvas.parentElement.clientWidth * 0.5;
    let gHeight = graphCanvas.height = 440;
    
    const handleResize = () => {
        if (!mapCanvas || !graphCanvas) return;
        const totalWidth = mapCanvas.parentElement.clientWidth;
        mWidth = mapCanvas.width = totalWidth * 0.5;
        gWidth = graphCanvas.width = totalWidth * 0.5;
        mHeight = mapCanvas.height = 440;
        gHeight = graphCanvas.height = 440;
    };
    window.addEventListener('resize', handleResize);
    mapCanvas._resizeHandler = handleResize;

    // Link States
    let freqProto = "wifi"; // "wifi" (2.4GHz) or "lora" (868MHz)
    let ptVal = 14; // dBm
    let dVal = 80; // meters

    const selectFreq = document.getElementById('embedded-freq-select');
    const sliderPt = document.getElementById('slider-embedded-pt');
    const sliderD = document.getElementById('slider-embedded-d');
    
    const labelPt = document.getElementById('val-embedded-pt');
    const labelD = document.getElementById('val-embedded-d');

    const readRSSI = document.getElementById('readout-embedded-rssi');
    const readFSPL = document.getElementById('readout-embedded-fspl');
    const readPDR = document.getElementById('readout-embedded-pdr');

    // Mathematical calculations
    function calculateLink() {
        freqProto = selectFreq.value;
        ptVal = parseInt(sliderPt.value);
        dVal = parseInt(sliderD.value);

        labelPt.textContent = `${ptVal} dBm`;
        labelD.textContent = `${dVal} m`;

        // Calculate FSPL: FSPL = 20*log10(d) + 20*log10(f) + 32.44
        // d is in km, f is in MHz
        const dKm = dVal / 1000.0;
        const fMHz = freqProto === "wifi" ? 2400.0 : 868.0;

        const fspl = 20 * Math.log10(dKm) + 20 * Math.log10(fMHz) + 32.44;
        const rssi = ptVal - fspl; // Received power in dBm

        readFSPL.textContent = `${fspl.toFixed(1)} dB`;
        readRSSI.textContent = `${rssi.toFixed(1)} dBm`;

        // Format RSSI text color based on quality
        if (rssi > -70) {
            readRSSI.style.color = 'var(--success)';
            readPDR.textContent = '100% (Optimal Link)';
            readPDR.style.color = '#fff';
        } else if (rssi > -82) {
            readRSSI.style.color = 'var(--warning)';
            readPDR.textContent = '92% (High Jitter)';
            readPDR.style.color = 'var(--warning)';
        } else {
            readRSSI.style.color = 'var(--error)';
            const pdr = Math.max(0, Math.round(100 + (rssi + 82) * 5));
            readPDR.textContent = `${pdr}% (Packet Loss / Timeout)`;
            readPDR.style.color = 'var(--error)';
        }

        return { rssi, fspl };
    }

    selectFreq.addEventListener('change', calculateLink);
    sliderPt.addEventListener('input', calculateLink);
    sliderD.addEventListener('input', calculateLink);

    // Reset Link
    const btnReset = document.getElementById('btn-embedded-reset');
    btnReset.addEventListener('click', () => {
        selectFreq.value = "wifi";
        sliderPt.value = 14;
        sliderD.value = 80;
        calculateLink();
    });

    calculateLink();

    // Wireless wave ripples states
    let waveRadius = 0;

    // Animation Loop
    const runEmbeddedLoop = () => {
        const { rssi, fspl } = calculateLink();

        // --- 1. DRAW 2D NETWORK TELEMETRY MAP (Left Canvas) ---
        mCtx.clearRect(0, 0, mWidth, mHeight);

        // Substrate card outline
        mCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        mCtx.fillRect(10, 10, mWidth - 20, mHeight - 20);
        mCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        mCtx.strokeRect(10, 10, mWidth - 20, mHeight - 20);

        // Core Nodes Coordinates
        const xGateway = 60;
        const yGateway = mHeight / 2;

        const maxMapDistance = 300; // slider max
        const scaleMapX = mWidth * 0.65;
        const xSensor = xGateway + (dVal / maxMapDistance) * scaleMapX;
        const ySensor = mHeight / 2;

        // Draw concentric expanding radio waves from Gateway
        waveRadius += 0.8;
        if (waveRadius > 160) waveRadius = 0;

        mCtx.strokeStyle = freqProto === "wifi" ? 'rgba(6, 182, 212, 0.12)' : 'rgba(99, 102, 241, 0.15)';
        mCtx.lineWidth = 1.5;
        for (let r = waveRadius % 40; r < scaleMapX + 100; r += 40) {
            mCtx.beginPath();
            mCtx.arc(xGateway, yGateway, r, -Math.PI / 3, Math.PI / 3);
            mCtx.stroke();
        }

        // Draw Internet Gateway Tower
        mCtx.fillStyle = '#1e293b';
        mCtx.strokeStyle = '#fff';
        mCtx.lineWidth = 1.8;
        
        // Draw base triangle
        mCtx.beginPath();
        mCtx.moveTo(xGateway - 16, yGateway + 40);
        mCtx.lineTo(xGateway, yGateway - 25);
        mCtx.lineTo(xGateway + 16, yGateway + 40);
        mCtx.closePath();
        mCtx.fill();
        mCtx.stroke();

        // Gateway active neon dome
        mCtx.fillStyle = 'var(--accent-secondary)';
        mCtx.beginPath();
        mCtx.arc(xGateway, yGateway - 25, 6, 0, Math.PI * 2);
        mCtx.fill();

        mCtx.fillStyle = '#fff';
        mCtx.font = 'bold 9px var(--font-heading)';
        mCtx.textAlign = 'center';
        mCtx.fillText('GATEWAY', xGateway, yGateway + 56);

        // Draw Smart Sensor node
        let sensorColor = 'var(--success)';
        if (rssi < -82) sensorColor = 'var(--error)';
        else if (rssi < -70) sensorColor = 'var(--warning)';

        mCtx.fillStyle = '#1e293b';
        mCtx.strokeStyle = sensorColor;
        mCtx.lineWidth = 2.5;
        mCtx.beginPath();
        mCtx.arc(xSensor, ySensor, 16, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.stroke();

        mCtx.fillStyle = sensorColor;
        mCtx.beginPath();
        mCtx.arc(xSensor, ySensor, 5, 0, Math.PI * 2);
        mCtx.fill();

        mCtx.fillStyle = '#fff';
        mCtx.font = 'bold 9px var(--font-heading)';
        mCtx.fillText('SENSOR', xSensor, ySensor + 30);
        mCtx.font = 'bold 10px monospace';
        mCtx.fillText(`${rssi.toFixed(0)}dBm`, xSensor, ySensor - 24);

        // Connect nodes with a dashed vector line
        mCtx.strokeStyle = 'rgba(255,255,255,0.1)';
        mCtx.lineWidth = 1.2;
        mCtx.setLineDash([4, 4]);
        mCtx.beginPath();
        mCtx.moveTo(xGateway + 15, yGateway);
        mCtx.lineTo(xSensor - 15, ySensor);
        mCtx.stroke();
        mCtx.restore();

        // --- 2. DRAW ATTENUATION PATH LOSS CURVE (Right Canvas) ---
        gCtx.clearRect(0, 0, gWidth, gHeight);

        const oX = 50;
        const oY = gHeight - 50;
        const graphW = gWidth - 75;
        const graphH = gHeight - 100;

        // Draw grid
        gCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        gCtx.lineWidth = 0.8;
        for (let x = oX; x <= oX + graphW; x += 40) {
            gCtx.beginPath(); gCtx.moveTo(x, 30); gCtx.lineTo(x, oY); gCtx.stroke();
        }
        for (let y = oY; y > 30; y -= 40) {
            gCtx.beginPath(); gCtx.moveTo(oX, y); gCtx.lineTo(oX + graphW, y); gCtx.stroke();
        }

        // Draw axes
        gCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        gCtx.lineWidth = 1.5;
        gCtx.beginPath();
        gCtx.moveTo(oX, 30); gCtx.lineTo(oX, oY); gCtx.lineTo(oX + graphW, oY);
        gCtx.stroke();

        gCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        gCtx.font = '600 10px sans-serif';
        gCtx.textAlign = 'right';
        gCtx.fillText('Distance (m)', oX + graphW, oY + 22);
        gCtx.textAlign = 'left';
        gCtx.fillText('RSSI (dBm)', oX - 10, 20);

        // Axis labels (0m to 300m, -30dBm to -110dBm)
        const ticksD = 3;
        for (let i = 0; i <= ticksD; i++) {
            const tx = oX + (i / ticksD) * graphW;
            gCtx.fillStyle = 'rgba(255,255,255,0.4)';
            gCtx.font = '9px monospace';
            gCtx.textAlign = 'center';
            gCtx.fillText(`${Math.round((i / ticksD) * maxMapDistance)}m`, tx, oY + 12);
        }

        const minRSSI = -30;
        const maxRSSI = -110;
        const ticksR = 4;
        for (let i = 0; i <= ticksR; i++) {
            const ty = oY - (i / ticksR) * graphH;
            const val = minRSSI - (i / ticksR) * (minRSSI - maxRSSI);
            gCtx.fillStyle = 'rgba(255,255,255,0.4)';
            gCtx.font = '9px monospace';
            gCtx.textAlign = 'right';
            gCtx.fillText(`${Math.round(val)}`, oX - 8, ty + 4);
        }

        // Plot FSPL path loss curve
        gCtx.beginPath();
        gCtx.strokeStyle = freqProto === "wifi" ? 'rgba(6, 182, 212, 0.6)' : 'rgba(99, 102, 241, 0.7)';
        gCtx.lineWidth = 2.2;

        const getGraphCoords = (distVal, rssiVal) => {
            const gx = oX + (distVal / maxMapDistance) * graphW;
            const gy = oY - ((rssiVal - maxRSSI) / (minRSSI - maxRSSI)) * graphH;
            return { x: gx, y: gy };
        };

        const fMHz = freqProto === "wifi" ? 2400.0 : 868.0;

        for (let d = 10; d <= maxMapDistance; d += 10) {
            const dKm = d / 1000.0;
            const fsplCurve = 20 * Math.log10(dKm) + 20 * Math.log10(fMHz) + 32.44;
            const rssiCurve = ptVal - fsplCurve;

            const pt = getGraphCoords(d, rssiCurve);
            
            if (d === 10) gCtx.moveTo(pt.x, pt.y);
            else gCtx.lineTo(pt.x, pt.y);
        }
        gCtx.stroke();

        // Active dot cursor
        const activePt = getGraphCoords(dVal, rssi);
        gCtx.fillStyle = sensorColor;
        gCtx.beginPath();
        gCtx.arc(activePt.x, activePt.y, 6 + Math.sin(animationFrameId * 0.1) * 2, 0, Math.PI*2);
        gCtx.fill();
        gCtx.strokeStyle = '#fff';
        gCtx.lineWidth = 1.5;
        gCtx.stroke();

        animationFrameId = requestAnimationFrame(runEmbeddedLoop);
    };

    runEmbeddedLoop();
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

    const mapCanvas = document.getElementById('embedded-map-canvas');
    if (mapCanvas && mapCanvas._resizeHandler) {
        window.removeEventListener('resize', mapCanvas._resizeHandler);
    }
};
