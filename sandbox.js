/**
 * Nextron - Visual Circuit Sandbox View
 */

import { AppState } from '../app.js';

export const render = async () => {
    return `
        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Dashboard
                </a>
                <span class="concept-card-category" style="color: var(--accent-purple); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Sandbox Environment
                </span>
            </div>
            
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>ECE Visual Circuit Sandbox</h2>
                <p>Construct electrical loops, cycle interchangeable components, and analyze current flow. Warning: Overloading sensitive LEDs will blow their fuses!</p>
            </div>
            
            <div class="simulator-layout">
                <!-- Sandbox Board Workspace -->
                <div class="simulator-main">
                    <!-- Interactive Schematic Board Canvas -->
                    <div class="visualizer-wrapper" style="height: 420px; background: #07090e;">
                        <div class="visualizer-labels">
                            <span class="status-indicator completed" id="sandbox-status-indicator" style="background: var(--text-muted);"></span> 
                            Breadboard Status: <span id="sandbox-status-txt" style="margin-left: 4px; font-weight: 800; color: var(--text-secondary);">OFF</span>
                        </div>
                        <canvas id="sandbox-canvas" class="visualizer-canvas"></canvas>
                    </div>
                    
                    <!-- Sandbox Circuit Controls -->
                    <div class="glass-card" style="padding: 24px;">
                        <div class="grid-2" style="align-items: center;">
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Variable DC Source Voltage</span>
                                    <span class="slider-val" id="val-sandbox-volts">5.0 V</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-sandbox-volts" min="0.0" max="10.0" step="0.5" value="5.0">
                            </div>
                            
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button class="btn btn-secondary" id="btn-sandbox-switch" style="min-width: 140px;">
                                    <i data-lucide="toggle-left"></i> Switch: OPEN
                                </button>
                                <button class="btn btn-primary" id="btn-sandbox-run" style="min-width: 160px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-primary));">
                                    <i data-lucide="play"></i> RUN SIMULATION
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Component Shelf Panel -->
                <div class="control-panel">
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title" style="color: var(--accent-purple);"><i data-lucide="wrench"></i> Lab Constructor</h3>
                        <p style="font-size: 0.85rem; margin-bottom: 16px;">
                            We have configured a series loop breadboard. <strong>Click directly on the highlighted slots [Slot A, B, C]</strong> on the canvas to cycle through available parts:
                        </p>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.8rem; font-family: monospace;">
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
                                <i data-lucide="minus" style="color: var(--text-muted); width: 16px;"></i>
                                <span><strong>Wire:</strong> Zero resistance conduit.</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
                                <i data-lucide="spline" style="color: var(--accent-secondary); width: 16px;"></i>
                                <span><strong>Resistor (100Ω):</strong> Limits loop currents.</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
                                <i data-lucide="zap" style="color: var(--success); width: 16px;"></i>
                                <span><strong>Diode:</strong> Allows current forward only.</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
                                <i data-lucide="lightbulb" style="color: var(--warning); width: 16px;"></i>
                                <span><strong>LED (Green):</strong> Glows on current. Fuses at >45mA!</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Real-time Multimeter Readout -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 class="panel-section-title"><i data-lucide="gauge"></i> Multimeter Scope</h3>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Loop Current:</span>
                                <span id="multimeter-current" style="color: var(--success); font-weight: bold;">0.00 mA</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Total Resistance:</span>
                                <span id="multimeter-res" style="color: var(--accent-secondary); font-weight: bold;">0 Ω</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">LED Voltage Drop:</span>
                                <span id="multimeter-led-drop" style="color: var(--warning); font-weight: bold;">0.00 V</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sandbox resets -->
                    <div class="glass-card" style="padding: 24px;">
                        <button id="btn-sandbox-reset" class="btn btn-secondary" style="width: 100%;">
                            <i data-lucide="refresh-cw"></i> Clear Breadboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Canvas animation state fields
let animationFrameId = null;
let canvasClickHandler = null;

export const mount = () => {
    // Canvas workspace
    const canvas = document.getElementById('sandbox-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = 420;
    
    const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);
    canvas._resizeHandler = handleResize;

    // Sandbox Core Parameters
    let sourceVoltage = 5.0; // variable DC source
    let switchClosed = false; // switch status
    let isRunning = false; // running simulation status
    
    // Interchangeable slots components
    // Slot options: 'wire', 'resistor', 'diode', 'led'
    const slots = {
        A: 'resistor',
        B: 'led',
        C: 'wire'
    };
    const slotCycle = ['wire', 'resistor', 'diode', 'led'];

    // Sparks particles drawer for LED blowout
    const sparks = [];
    let isBlownOut = false;

    // Slots dimensions mapping inside canvas coordinates
    const getSlotCoords = () => {
        const cX = width / 2;
        const cY = height / 2;
        
        return {
            A: { x: cX - 60, y: cY - 80, label: 'Slot A', id: 'A' },
            B: { x: cX + 80, y: cY, label: 'Slot B', id: 'B' },
            C: { x: cX - 60, y: cY + 80, label: 'Slot C', id: 'C' }
        };
    };

    // DOM selectors
    const sliderVolts = document.getElementById('slider-sandbox-volts');
    const valVolts = document.getElementById('val-sandbox-volts');
    
    const btnSwitch = document.getElementById('btn-sandbox-switch');
    const btnRun = document.getElementById('btn-sandbox-run');
    const btnReset = document.getElementById('btn-sandbox-reset');
    
    const statusIndicator = document.getElementById('sandbox-status-indicator');
    const statusTxt = document.getElementById('sandbox-status-txt');
    
    const meterCurrent = document.getElementById('multimeter-current');
    const meterRes = document.getElementById('multimeter-res');
    const meterLEDDrop = document.getElementById('multimeter-led-drop');

    // Canvas click detection: Toggles slots on clicking coordinates
    canvasClickHandler = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Scale click coordinates with actual canvas pixels
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        
        const canvasX = clickX * scaleX;
        const canvasY = clickY * scaleY;
        
        const coords = getSlotCoords();
        
        // Check slots collisions
        for (const slotId in coords) {
            const slot = coords[slotId];
            const dist = Math.sqrt((canvasX - slot.x) * (canvasX - slot.x) + (canvasY - slot.y) * (canvasY - slot.y));
            if (dist < 32) {
                // Click collision! Cycle component
                const currentType = slots[slotId];
                const nextIndex = (slotCycle.indexOf(currentType) + 1) % slotCycle.length;
                slots[slotId] = slotCycle[nextIndex];
                
                // Clear blowout if we change components
                if (isBlownOut) {
                    isBlownOut = false;
                    sparks.length = 0;
                }
                
                calculateCircuit();
                return;
            }
        }
    };
    canvas.addEventListener('click', canvasClickHandler);

    // Switch toggler
    btnSwitch.addEventListener('click', () => {
        switchClosed = !switchClosed;
        if (switchClosed) {
            btnSwitch.classList.add('active');
            btnSwitch.innerHTML = '<i data-lucide="toggle-right"></i> Switch: CLOSED';
        } else {
            btnSwitch.classList.remove('active');
            btnSwitch.innerHTML = '<i data-lucide="toggle-left"></i> Switch: OPEN';
        }
        if (window.lucide) window.lucide.createIcons();
        calculateCircuit();
    });

    // Run simulator toggler
    btnRun.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            btnRun.classList.add('active');
            btnRun.innerHTML = '<i data-lucide="square"></i> STOP SIMULATION';
            statusIndicator.style.background = 'var(--success)';
            statusIndicator.style.boxShadow = '0 0 10px var(--success)';
            statusTxt.textContent = 'RUNNING';
            statusTxt.style.color = 'var(--success)';
        } else {
            btnRun.classList.remove('active');
            btnRun.innerHTML = '<i data-lucide="play"></i> RUN SIMULATION';
            statusIndicator.style.background = 'var(--text-muted)';
            statusIndicator.style.boxShadow = 'none';
            statusTxt.textContent = 'OFF';
            statusTxt.style.color = 'var(--text-secondary)';
        }
        if (window.lucide) window.lucide.createIcons();
        calculateCircuit();
    });

    // Reset breadboard
    btnReset.addEventListener('click', () => {
        slots.A = 'wire';
        slots.B = 'wire';
        slots.C = 'wire';
        switchClosed = false;
        isRunning = false;
        isBlownOut = false;
        sparks.length = 0;
        sliderVolts.value = 5.0;
        
        btnSwitch.classList.remove('active');
        btnSwitch.innerHTML = '<i data-lucide="toggle-left"></i> Switch: OPEN';
        
        btnRun.classList.remove('active');
        btnRun.innerHTML = '<i data-lucide="play"></i> RUN SIMULATION';
        
        statusIndicator.style.background = 'var(--text-muted)';
        statusIndicator.style.boxShadow = 'none';
        statusTxt.textContent = 'OFF';
        statusTxt.style.color = 'var(--text-secondary)';
        
        if (window.lucide) window.lucide.createIcons();
        calculateCircuit();
    });

    // Voltage updates
    sliderVolts.addEventListener('input', () => {
        sourceVoltage = parseFloat(sliderVolts.value);
        valVolts.textContent = `${sourceVoltage.toFixed(1)} V`;
        calculateCircuit();
    });

    // Circuit solving engine
    let calculatedCurrent = 0; // mA
    let totalRes = 0;
    let ledVoltageDrop = 0;
    
    function calculateCircuit() {
        if (!isRunning || !switchClosed || isBlownOut) {
            calculatedCurrent = 0;
            meterCurrent.textContent = '0.00 mA';
            meterCurrent.style.color = 'var(--text-muted)';
            meterLEDDrop.textContent = '0.00 V';
            return;
        }

        // Sum components
        let resistanceSum = 0.1; // wiring resistance base
        let diodeBarrierSum = 0;
        let hasLED = false;
        let hasDiode = false;

        for (const slotId in slots) {
            const comp = slots[slotId];
            if (comp === 'resistor') {
                resistanceSum += 100; // 100 Ohms
            } else if (comp === 'diode') {
                diodeBarrierSum += 0.7; // Silicon diode drop
                hasDiode = true;
            } else if (comp === 'led') {
                diodeBarrierSum += 2.0; // Green LED drop typical 2.0V
                hasLED = true;
            }
        }
        
        totalRes = Math.round(resistanceSum);
        meterRes.textContent = `${totalRes} Ω`;

        // Calculate loop current: I = (V_source - V_diode_barriers) / R
        const drivingVoltage = sourceVoltage - diodeBarrierSum;
        
        if (drivingVoltage <= 0) {
            // Insufficient voltage to overcome diodes knee voltage barriers!
            calculatedCurrent = 0;
            ledVoltageDrop = 0;
        } else {
            // Ohm's law: Current in amperes
            const ampCurrent = drivingVoltage / resistanceSum;
            calculatedCurrent = ampCurrent * 1000; // convert to mA
            ledVoltageDrop = hasLED ? 2.0 + (ampCurrent * 15) : 0; // dynamic drop
        }

        // --- LED BLOWOUT FUSE CRITICAL CHECKS ---
        // Green LED fuses (blows out) if current exceeds 45mA!
        if (hasLED && calculatedCurrent > 45.0) {
            isBlownOut = true;
            calculatedCurrent = 0;
            ledVoltageDrop = 0;
            spawnSparks();
            AppState.showToast('💥 LED BLOWN OUT! Exceeded safe current (45mA). Always insert a Resistor!', 'error');
        }

        meterCurrent.textContent = `${calculatedCurrent.toFixed(2)} mA`;
        meterCurrent.style.color = calculatedCurrent > 0 ? 'var(--success)' : 'var(--text-muted)';
        meterLEDDrop.textContent = `${ledVoltageDrop.toFixed(2)} V`;
    }

    // Sparks spawner
    function spawnSparks() {
        sparks.length = 0;
        const coords = getSlotCoords();
        let targetX = width / 2;
        let targetY = height / 2;
        
        // Find LED slot coordinate to blow up
        for (const slotId in slots) {
            if (slots[slotId] === 'led') {
                targetX = coords[slotId].x;
                targetY = coords[slotId].y;
                break;
            }
        }

        for (let i = 0; i < 35; i++) {
            sparks.push({
                x: targetX,
                y: targetY,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2, // upwards bias
                radius: Math.random() * 3 + 1,
                alpha: 1.0,
                color: Math.random() > 0.4 ? '#ff9f43' : '#ff4757' // fiery colors
            });
        }
    }

    calculateCircuit();

    // 4. Schematic Painting Animation Loop
    let particleOffset = 0;
    const drawSandboxLoop = () => {
        ctx.clearRect(0, 0, width, height);
        
        const cX = width / 2;
        const cY = height / 2;
        const coords = getSlotCoords();

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 0.8;
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Draw structural connecting lines (series circuit rectangle)
        // Rect: Top: cY-80, Bottom: cY+80, Left: cX-180, Right: cX+180
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(cX - 180, cY - 80, 360, 160);

        // Active current flow line overlays
        if (calculatedCurrent > 0 && isRunning && switchClosed && !isBlownOut) {
            ctx.save();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
            ctx.lineWidth = 4;
            ctx.strokeRect(cX - 180, cY - 80, 360, 160);
            ctx.restore();
            
            // Draw moving electron dots clockwise
            ctx.fillStyle = '#fff';
            particleOffset = (particleOffset + calculatedCurrent * 0.05) % 40;
            
            // Draw particles along the rectangle loop
            // Top wire: (cX-180, cY-80) to (cX+180, cY-80)
            for (let x = cX - 180 + particleOffset; x < cX + 180; x += 40) {
                ctx.beginPath(); ctx.arc(x, cY - 80, 2.5, 0, Math.PI*2); ctx.fill();
            }
            // Right wire: (cX+180, cY-80) to (cX+180, cY+80)
            for (let y = cY - 80 + particleOffset; y < cY + 80; y += 40) {
                ctx.beginPath(); ctx.arc(cX + 180, y, 2.5, 0, Math.PI*2); ctx.fill();
            }
            // Bottom wire: (cX+180, cY+80) to (cX-180, cY+80) (moves left)
            for (let x = cX + 180 - particleOffset; x > cX - 180; x -= 40) {
                ctx.beginPath(); ctx.arc(x, cY + 80, 2.5, 0, Math.PI*2); ctx.fill();
            }
            // Left wire: (cX-180, cY+80) to (cX-180, cY-80) (moves up)
            for (let y = cY + 80 - particleOffset; y > cY - 80; y -= 40) {
                ctx.beginPath(); ctx.arc(cX - 180, y, 2.5, 0, Math.PI*2); ctx.fill();
            }
        }

        // Draw DC voltage source terminal symbol (Left side: cX-180, cY)
        ctx.save();
        ctx.fillStyle = '#07090e';
        ctx.beginPath();
        ctx.arc(cX - 180, cY, 18, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = isRunning ? '#6366f1' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Plus and minus indicators inside source
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('+', cX - 180, cY - 4);
        ctx.fillText('-', cX - 180, cY + 8);
        ctx.font = 'bold 9px var(--font-heading)';
        ctx.fillText('V_DC', cX - 212, cY + 4);
        ctx.restore();

        // Draw Switch (Bottom-left side: cX - 180, cY + 80)
        ctx.fillStyle = '#07090e';
        ctx.fillRect(cX - 135, cY + 68, 30, 24);
        
        ctx.strokeStyle = switchClosed ? '#10b981' : '#ff4757';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cX - 135, cY + 80);
        if (switchClosed) {
            ctx.lineTo(cX - 105, cY + 80);
        } else {
            // tilted open switch path
            ctx.lineTo(cX - 110, cY + 68);
        }
        ctx.stroke();
        
        // Small connector dots
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cX - 135, cY + 80, 3, 0, Math.PI*2);
        ctx.arc(cX - 105, cY + 80, 3, 0, Math.PI*2);
        ctx.fill();

        // --- DRAW INTERCHANGEABLE COMPONENT SLOTS ---
        for (const slotId in coords) {
            const slot = coords[slotId];
            const type = slots[slotId];
            
            // Draw interactive selection highlight circles on slots
            ctx.save();
            ctx.fillStyle = 'rgba(157, 78, 221, 0.05)';
            ctx.strokeStyle = 'rgba(157, 78, 221, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(slot.x, slot.y, 32, 0, Math.PI*2);
            ctx.fill(); ctx.stroke();
            
            // Draw interactive slots pointer indicator
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(slot.label, slot.x, slot.y - 36);
            ctx.restore();

            // Clear backing rect for actual component graphics
            ctx.fillStyle = '#07090e';
            ctx.fillRect(slot.x - 22, slot.y - 20, 44, 40);

            // Draw specific components vectors
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2.5;
            
            if (type === 'wire') {
                ctx.strokeStyle = (calculatedCurrent > 0) ? '#06b6d4' : 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                if (slotId === 'B') {
                    ctx.moveTo(slot.x, slot.y - 20); ctx.lineTo(slot.x, slot.y + 20);
                } else {
                    ctx.moveTo(slot.x - 20, slot.y); ctx.lineTo(slot.x + 20, slot.y);
                }
                ctx.stroke();
            } 
            else if (type === 'resistor') {
                // draw zig-zag resistor symbol
                ctx.strokeStyle = '#06b6d4'; // cyan
                ctx.beginPath();
                if (slotId === 'B') {
                    ctx.moveTo(slot.x, slot.y - 20);
                    ctx.lineTo(slot.x, slot.y - 12);
                    ctx.lineTo(slot.x - 8, slot.y - 8);
                    ctx.lineTo(slot.x + 8, slot.y - 2);
                    ctx.lineTo(slot.x - 8, slot.y + 4);
                    ctx.lineTo(slot.x + 8, slot.y + 10);
                    ctx.lineTo(slot.x, slot.y + 14);
                    ctx.lineTo(slot.x, slot.y + 20);
                } else {
                    ctx.moveTo(slot.x - 20, slot.y);
                    ctx.lineTo(slot.x - 12, slot.y);
                    ctx.lineTo(slot.x - 8, slot.y - 8);
                    ctx.lineTo(slot.x - 2, slot.y + 8);
                    ctx.lineTo(slot.x + 4, slot.y - 8);
                    ctx.lineTo(slot.x + 10, slot.y + 8);
                    ctx.lineTo(slot.x + 14, slot.y);
                    ctx.lineTo(slot.x + 20, slot.y);
                }
                ctx.stroke();
            } 
            else if (type === 'diode') {
                ctx.strokeStyle = '#10b981'; // emerald green
                ctx.save();
                ctx.translate(slot.x, slot.y);
                if (slotId === 'B') ctx.rotate(Math.PI / 2); // vertical
                
                // Triangle
                ctx.beginPath();
                ctx.moveTo(-12, -10);
                ctx.lineTo(10, 0);
                ctx.lineTo(-12, 10);
                ctx.closePath();
                ctx.stroke();
                
                // Vertical barrier bar
                ctx.beginPath();
                ctx.moveTo(10, -10);
                ctx.lineTo(10, 10);
                ctx.stroke();
                
                ctx.restore();
            } 
            else if (type === 'led') {
                if (isBlownOut) {
                    // Draw charred burnt cross mark
                    ctx.strokeStyle = '#ff4757';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(slot.x - 12, slot.y - 12); ctx.lineTo(slot.x + 12, slot.y + 12);
                    ctx.moveTo(slot.x + 12, slot.y - 12); ctx.lineTo(slot.x - 12, slot.y + 12);
                    ctx.stroke();
                    
                    ctx.fillStyle = '#ff4757';
                    ctx.font = 'bold 7px var(--font-heading)';
                    ctx.textAlign = 'center';
                    ctx.fillText('BLOWN', slot.x, slot.y + 24);
                } else {
                    // Draw LED bulb glowing or not
                    const isGlowing = calculatedCurrent > 0 && isRunning && switchClosed;
                    ctx.strokeStyle = isGlowing ? '#6ee7b7' : 'rgba(255,255,255,0.4)';
                    ctx.fillStyle = isGlowing ? '#10b981' : 'transparent';
                    
                    ctx.beginPath();
                    ctx.arc(slot.x, slot.y, 11, 0, Math.PI*2);
                    ctx.fill(); ctx.stroke();
                    
                    // Tiny lead lines inside
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(slot.x - 4, slot.y - 3); ctx.lineTo(slot.x - 4, slot.y + 6);
                    ctx.moveTo(slot.x + 4, slot.y - 3); ctx.lineTo(slot.x + 4, slot.y + 6);
                    ctx.stroke();

                    // Glow halo rays
                    if (isGlowing) {
                        ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
                        ctx.beginPath();
                        ctx.arc(slot.x, slot.y, 22, 0, Math.PI*2);
                        ctx.fill();
                    }
                }
            }
        }

        // --- DRAW BLOWOUT PARTICLE SPARKS ---
        if (isBlownOut && sparks.length > 0) {
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.08; // gravity
                s.alpha -= 0.015;
                
                if (s.alpha <= 0) {
                    sparks.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = s.alpha;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2);
                    ctx.fillStyle = s.color;
                    ctx.fill();
                    ctx.restore();
                }
            }
        }

        animationFrameId = requestAnimationFrame(drawSandboxLoop);
    };

    drawSandboxLoop();
};

export const unmount = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    const canvas = document.getElementById('sandbox-canvas');
    if (canvas) {
        if (canvasClickHandler) {
            canvas.removeEventListener('click', canvasClickHandler);
        }
        if (canvas._resizeHandler) {
            window.removeEventListener('resize', canvas._resizeHandler);
        }
    }
};
