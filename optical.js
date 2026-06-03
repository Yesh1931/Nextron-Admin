/**
 * Nextron - Optical & Microwave Engineering View
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
                    Sector 07: High-Frequency Comms
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>Waveguide Optics & Microwave Radar Laboratory</h2>
                <p>Simulate electromagnetic boundaries. Trace laser ray paths undergoing Total Internal Reflection (TIR) and sweep microwave radar Doppler reflections.</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Main Lab Area -->
                <div class="simulator-main">
                    <!-- Twin Visualization Deck -->
                    <div class="visualizer-wrapper" style="height: 440px; background: #010409;">
                        <div class="visualizer-labels" style="border-color: rgba(6, 182, 212, 0.25);">
                            <span class="status-indicator completed" style="background: #06b6d4;"></span> Fiber Optic Ray Tracer & Doppler Radar sweep
                        </div>
                        <div class="diode-split" style="height: 100%;">
                            <!-- Left: Fiber Optic Total Internal Reflection Ray Tracer -->
                            <canvas id="optical-ray-canvas" class="diode-model-canvas"></canvas>
                            <!-- Right: Microwave Radar Doppler Sweep -->
                            <canvas id="optical-radar-canvas" class="diode-graph-canvas"></canvas>
                        </div>
                    </div>
                    
                    <!-- Theoretical & Lab Explanations -->
                    <div class="glass-card explanation-panel">
                        <div class="explanation-tabs">
                            <button class="tab-btn active" data-tab="walkthrough">Lab Experiments</button>
                            <button class="tab-btn" data-tab="theory">Waveguide Optics</button>
                            <button class="tab-btn" data-tab="applications">Doppler Radar</button>
                        </div>
                        
                        <div class="tab-content active" id="tab-walkthrough">
                            <h3>Optical & Radar Lab Exercises</h3>
                            <p>Follow these procedures to trace waves:</p>
                            <ul>
                                <li><strong>Experiment 1: Secure Waveguide Confinement (TIR)</strong> - Set **Core index ($n_1$)** to 1.60 and **Cladding index ($n_2$)** to 1.40. Set **Launch Angle ($\theta_i$)** to $30^\circ$. Observe the left canvas—the neon red laser undergoes perfect **Total Internal Reflection**!</li>
                                <li><strong>Experiment 2: Refraction Leakage</strong> - Set **Launch Angle ($\theta_i$)** to $75^\circ$. Look at the ray tracer—the launch angle is too steep, exceeding the **Acceptance Cone** boundary. The ray escapes from the core, refracting out through the cladding!</li>
                                <li><strong>Experiment 3: Doppler Radar Sweeper</strong> - Look at the right canvas. It sweeps a microwave signal. The approaching red dots represent a vehicle. Notice the return frequency is compressed (higher pitch frequency), illustrating a positive Doppler frequency shift!</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-theory">
                            <h3>Total Internal Reflection & Acceptance Angle</h3>
                            <p>An optical fiber confines light waves within its core using the principle of **Total Internal Reflection (TIR)**. This requires the core refractive index ($n_1$) to be strictly greater than the cladding index ($n_2$).</p>
                            <ul>
                                <li>The boundary **Critical Angle** is the angle of incidence above which light is entirely reflected:
                                $$\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)$$</li>
                                <li>The **Numerical Aperture (NA)** defines the fiber's light-gathering capacity and acceptance cone angle:
                                $$NA = \\sqrt{n_1^2 - n_2^2} = \\sin(\\theta_{acc})$$</li>
                                <li>Any rays launched at angles steeper than $\theta_{acc}$ cannot undergo TIR and will leak out, causing signal attenuation.</li>
                            </ul>
                        </div>
                        
                        <div class="tab-content" id="tab-applications">
                            <h3>Microwave Doppler Radar</h3>
                            <p>Microwaves are electromagnetic waves operating in the 1 GHz to 300 GHz band. They are central to active remote sensing and **Doppler Radar** tracking. By transmitting a microwave wave train at frequency $f_t$ towards a moving object, the returned echo exhibits a frequency shift proportional to the target's relative velocity ($v$):</p>
                            $$f_d = \\frac{2 \\cdot v \\cdot f_t}{c}$$
                            <p>Approaching targets shift the return waves to higher frequencies (compression), while receding targets shift them to lower frequencies (expansion).</p>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Panel -->
                <div class="control-panel">
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="sliders"></i> Refractive Indices</h3>
                        
                        <!-- Core refractive index n1 -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name" style="color: var(--accent-secondary); font-weight: bold;">Core Index (n1)</span>
                                <span class="slider-val" id="val-optical-n1" style="color: var(--accent-secondary); font-weight: bold;">1.55</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-optical-n1" min="1.4" max="1.8" step="0.02" value="1.55" style="background: rgba(6, 182, 212, 0.15);">
                        </div>
                        
                        <!-- Cladding index n2 -->
                        <div class="slider-group" style="margin-bottom: 20px;">
                            <div class="slider-label-row">
                                <span class="slider-name" style="color: var(--accent-purple); font-weight: bold;">Cladding Index (n2)</span>
                                <span class="slider-val" id="val-optical-n2" style="color: var(--accent-purple); font-weight: bold;">1.42</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-optical-n2" min="1.3" max="1.5" step="0.02" value="1.42" style="background: rgba(99, 102, 241, 0.15);">
                        </div>
                        
                        <!-- Launch entry angle -->
                        <div class="slider-group" style="margin-bottom: 24px;">
                            <div class="slider-label-row">
                                <span class="slider-name">Launch Angle (θi)</span>
                                <span class="slider-val" id="val-optical-theta">30°</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-optical-theta" min="0" max="80" step="2" value="30">
                        </div>
                        
                        <!-- Dynamic readout card -->
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Numerical Aperture (NA):</span>
                                <span id="readout-optical-na" style="color: var(--success); font-weight: bold;">0.62</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Boundary Critical θc:</span>
                                <span id="readout-optical-thetac" style="color: #fff; font-weight: bold;">66.5°</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Wave Confinement:</span>
                                <span id="readout-optical-state" style="color: var(--success); font-weight: bold;">TOTAL REFLECTION</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation / Actions -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                        <button id="btn-optical-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                            <i data-lucide="refresh-cw"></i> Reset Indices
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
    const rayCanvas = document.getElementById('optical-ray-canvas');
    const radarCanvas = document.getElementById('optical-radar-canvas');
    if (!rayCanvas || !radarCanvas) return;

    const rCtx = rayCanvas.getContext('2d');
    const dCtx = radarCanvas.getContext('2d');
    
    let rWidth = rayCanvas.width = rayCanvas.parentElement.clientWidth * 0.52;
    let rHeight = rayCanvas.height = 440;
    
    let dWidth = radarCanvas.width = radarCanvas.parentElement.clientWidth * 0.48;
    let dHeight = radarCanvas.height = 440;
    
    const handleResize = () => {
        if (!rayCanvas || !radarCanvas) return;
        const totalWidth = rayCanvas.parentElement.clientWidth;
        rWidth = rayCanvas.width = totalWidth * 0.52;
        dWidth = radarCanvas.width = totalWidth * 0.48;
        rHeight = rayCanvas.height = 440;
        dHeight = 440;
    };
    window.addEventListener('resize', handleResize);
    rayCanvas._resizeHandler = handleResize;

    // Optical States
    let n1 = 1.55;
    let n2 = 1.42;
    let thetaI = 30; // degrees

    const sliderN1 = document.getElementById('slider-optical-n1');
    const sliderN2 = document.getElementById('slider-optical-n2');
    const sliderTheta = document.getElementById('slider-optical-theta');
    
    const labelN1 = document.getElementById('val-optical-n1');
    const labelN2 = document.getElementById('val-optical-n2');
    const labelTheta = document.getElementById('val-optical-theta');

    const readNA = document.getElementById('readout-optical-na');
    const readThetac = document.getElementById('readout-optical-thetac');
    const readState = document.getElementById('readout-optical-state');

    function calculateOptical() {
        n1 = parseFloat(sliderN1.value);
        n2 = parseFloat(sliderN2.value);
        thetaI = parseFloat(sliderTheta.value);

        // Core index must be strictly greater than cladding index
        if (n1 <= n2) {
            sliderN1.value = (n2 + 0.02).toFixed(2);
            n1 = n2 + 0.02;
        }

        labelN1.textContent = n1.toFixed(2);
        labelN2.textContent = n2.toFixed(2);
        labelTheta.textContent = `${thetaI}°`;

        // NA = sqrt(n1^2 - n2^2)
        const na = Math.sqrt(n1*n1 - n2*n2);
        readNA.textContent = na.toFixed(3);

        // thetaC = arcsin(n2 / n1) in degrees
        const thetaC = (Math.asin(n2 / n1) * 180) / Math.PI;
        readThetac.textContent = `${thetaC.toFixed(1)}°`;

        // Check waveguide confinement
        // Acceptance cone limit: sin(theta_acc) = NA
        const thetaAcc = (Math.asin(Math.min(1.0, na)) * 180) / Math.PI;
        if (thetaI <= thetaAcc) {
            readState.textContent = "TOTAL REFLECTION (CONFINED)";
            readState.style.color = "var(--success)";
        } else {
            readState.textContent = "CLADDING LEAKAGE (ESCAPE)";
            readState.style.color = "var(--error)";
        }

        return { na, thetaC, thetaAcc };
    }

    sliderN1.addEventListener('input', calculateOptical);
    sliderN2.addEventListener('input', calculateOptical);
    sliderTheta.addEventListener('input', calculateOptical);

    // Reset parameters
    const btnReset = document.getElementById('btn-optical-reset');
    btnReset.addEventListener('click', () => {
        sliderN1.value = 1.55;
        sliderN2.value = 1.42;
        sliderTheta.value = 30;
        calculateOptical();
    });

    calculateOptical();

    // Radar states
    let radarSweepAngle = 0;
    let approachingCarX = dWidth * 0.8;

    // Animation Loop
    const runOpticalLoop = () => {
        const { na, thetaC, thetaAcc } = calculateOptical();

        // --- 1. DRAW FIBER OPTIC RAY TRACER (Left Canvas) ---
        rCtx.clearRect(0, 0, rWidth, rHeight);

        // Substrate card outline
        rCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        rCtx.fillRect(10, 10, rWidth - 20, rHeight - 20);
        rCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        rCtx.strokeRect(10, 10, rWidth - 20, rHeight - 20);

        // Define waveguide geometry
        const yCoreTop = 130;
        const yCoreBottom = rHeight - 130;
        const hCore = yCoreBottom - yCoreTop;
        const yMiddle = rHeight / 2;

        // Draw Cladding areas (top and bottom blocks)
        rCtx.fillStyle = 'rgba(99, 102, 241, 0.05)'; // cladding
        rCtx.fillRect(15, 15, rWidth - 30, yCoreTop - 15);
        rCtx.fillRect(15, yCoreBottom, rWidth - 30, rHeight - yCoreBottom - 15);

        rCtx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        rCtx.lineWidth = 1.5;
        rCtx.beginPath();
        rCtx.moveTo(15, yCoreTop); rCtx.lineTo(rWidth - 15, yCoreTop);
        rCtx.moveTo(15, yCoreBottom); rCtx.lineTo(rWidth - 15, yCoreBottom);
        rCtx.stroke();

        rCtx.fillStyle = 'rgba(99, 102, 241, 0.4)';
        rCtx.font = 'bold 9px sans-serif';
        rCtx.fillText(`Cladding (n2 = ${n2.toFixed(2)})`, 25, yCoreTop - 15);
        rCtx.fillText(`Cladding (n2 = ${n2.toFixed(2)})`, 25, yCoreBottom + 25);

        // Draw Core area (middle block)
        rCtx.fillStyle = 'rgba(6, 182, 212, 0.03)'; // core
        rCtx.fillRect(15, yCoreTop, rWidth - 30, hCore);
        
        rCtx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        rCtx.fillText(`Core (n1 = ${n1.toFixed(2)})`, 25, yMiddle + 4);

        // Trace Laser Ray propagation
        const isTIR = thetaI <= thetaAcc;

        rCtx.strokeStyle = '#ef4444';
        rCtx.lineWidth = 3;
        rCtx.shadowBlur = 10;
        rCtx.shadowColor = '#ef4444';

        rCtx.beginPath();
        
        // Laser starts at (15, yMiddle) entering core
        const startX = 15;
        const startY = yMiddle;

        // Angle in radians within the core (refraction at boundary)
        // sin(thetaI) = n1 * sin(theta_r)
        const thetaI_rad = (thetaI * Math.PI) / 180;
        const thetaR_rad = Math.asin(Math.sin(thetaI_rad) / n1);

        // First vector inside core from (15, yMiddle) to top boundary
        // dy = dx * tan(thetaR_rad)
        const dyFirst = hCore / 2;
        const dxFirst = dyFirst / Math.tan(thetaR_rad);

        const pt1x = startX + dxFirst;
        const pt1y = yCoreTop;

        rCtx.moveTo(startX, startY);

        if (pt1x < rWidth - 15) {
            rCtx.lineTo(pt1x, pt1y);
            
            // Determine bouncing
            if (isTIR) {
                // Total internal reflection - bounce infinitely
                let currentX = pt1x;
                let currentY = pt1y;
                let directionUp = false;

                const dxBounce = hCore / Math.tan(thetaR_rad);

                for (let step = 0; step < 8; step++) {
                    const nextX = currentX + dxBounce;
                    const nextY = directionUp ? yCoreTop : yCoreBottom;
                    
                    if (nextX < rWidth - 15) {
                        rCtx.lineTo(nextX, nextY);
                        currentX = nextX;
                        currentY = nextY;
                        directionUp = !directionUp;
                    } else {
                        // Exit fiber core end
                        const remX = rWidth - 15 - currentX;
                        const remY = currentY + (directionUp ? -1 : 1) * remX * Math.tan(thetaR_rad);
                        rCtx.lineTo(rWidth - 15, remY);
                        break;
                    }
                }
            } else {
                // Escapes core - refracts out into cladding
                // sin(theta_cladding) = n1 * sin(90-thetaR) / n2 (Fresnel refraction)
                const angleClad_rad = Math.asin((n1 * Math.cos(thetaR_rad)) / n2) || Math.PI / 4;
                const escapeX = pt1x + 60 * Math.cos(angleClad_rad);
                const escapeY = pt1y - 60 * Math.sin(angleClad_rad);
                rCtx.lineTo(escapeX, escapeY);
            }
        } else {
            // Straight line exiting fiber end
            rCtx.lineTo(rWidth - 15, yMiddle - (rWidth - 30) * Math.tan(thetaR_rad));
        }

        rCtx.stroke();
        rCtx.restore(); // Clear shadow blur

        // --- 2. DRAW MICROWAVE RADAR SWEEP (Right Canvas) ---
        dCtx.clearRect(0, 0, dWidth, dHeight);

        // Card borders
        dCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        dCtx.fillRect(10, 10, dWidth - 20, dHeight - 20);
        dCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        dCtx.strokeRect(10, 10, dWidth - 20, dHeight - 20);

        // Antenna center
        const xDish = 50;
        const yDish = dHeight / 2;

        // Draw radar dish
        dCtx.strokeStyle = 'rgba(255,255,255,0.4)';
        dCtx.lineWidth = 2.5;
        dCtx.beginPath();
        dCtx.arc(xDish - 15, yDish, 20, -Math.PI/3, Math.PI/3);
        dCtx.stroke();

        dCtx.strokeStyle = '#06b6d4';
        dCtx.beginPath();
        dCtx.moveTo(xDish - 15, yDish);
        dCtx.lineTo(xDish + 5, yDish);
        dCtx.stroke();

        dCtx.fillStyle = '#fff';
        dCtx.font = 'bold 9px var(--font-heading)';
        dCtx.fillText('RADAR DISH', xDish - 12, yDish + 42);

        // Sweeping radar waves
        radarSweepAngle += 0.05;
        const maxSweepDist = dWidth - 120;
        const activeSweepR = (radarSweepAngle * 45) % maxSweepDist;

        dCtx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        dCtx.lineWidth = 2.0;
        dCtx.beginPath();
        dCtx.arc(xDish + 5, yDish, activeSweepR, -Math.PI / 6, Math.PI / 6);
        dCtx.stroke();

        // Approaching target vehicle
        approachingCarX -= 0.5;
        if (approachingCarX < xDish + 60) approachingCarX = dWidth - 40;

        dCtx.fillStyle = '#ef4444';
        dCtx.beginPath();
        dCtx.arc(approachingCarX, yDish, 8, 0, Math.PI * 2);
        dCtx.fill();
        dCtx.strokeStyle = '#fff';
        dCtx.lineWidth = 1;
        dCtx.stroke();

        dCtx.fillStyle = '#fff';
        dCtx.font = 'bold 9px monospace';
        dCtx.fillText('TARGET', approachingCarX - 18, yDish + 20);

        // Draw returning compressed Doppler waves when sweep strikes target
        if (Math.abs(activeSweepR - (approachingCarX - xDish)) < 30) {
            dCtx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
            dCtx.lineWidth = 2.5;
            for (let i = 0; i < 4; i++) {
                dCtx.beginPath();
                // Higher frequency compressed returning ripples
                dCtx.arc(approachingCarX, yDish, 10 + i * 8, Math.PI - Math.PI / 4, Math.PI + Math.PI / 4);
                dCtx.stroke();
            }

            dCtx.fillStyle = 'var(--accent-secondary)';
            dCtx.font = 'bold 10px monospace';
            dCtx.fillText('+fd (APPROACHING COMPRESSION)', xDish + 30, 44);
        }

        animationFrameId = requestAnimationFrame(runOpticalLoop);
    };

    runOpticalLoop();
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

    const rayCanvas = document.getElementById('optical-ray-canvas');
    if (rayCanvas && rayCanvas._resizeHandler) {
        window.removeEventListener('resize', rayCanvas._resizeHandler);
    }
};
