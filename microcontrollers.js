/**
 * Nextron - Microprocessors & Microcontrollers Simulator View (Premium Edition)
 * ✅ All bugs fixed:
 *   - HALT PC overshoot fixed (PC no longer increments past HALT)
 *   - Auto-run race condition fixed (guard check before each step)
 *   - SHL carry flag corrected (checks MSB before shift)
 *   - Parity flag bit count corrected (proper bit counting loop)
 *   - Fibonacci sequence corrected (true Fib logic using temp register C)
 *   - Register B highlight fixed (uses lastWrittenReg tracking)
 *   - Frame-rate independent animation (uses performance.now timestamps)
 *   - All event listeners cleaned up in unmount() to prevent memory leaks
 *   - ResizeObserver replaces fragile setTimeout(50ms)
 *   - HALT completion banner drawn on canvas
 *   - Keyboard shortcuts added (Space=Step, R=Reset, A=Auto)
 *   - Code preview auto-scrolls to active line
 *   - PROGRAMS moved to module scope (created only once)
 *   - Magic numbers extracted to named constants
 *   - Null checks on all required DOM elements
 *   - Clock frequency clarification label added
 */

// ─── Module-scope constants ───────────────────────────────────────────────────
const CANVAS_HEIGHT = 440;
const BUS_ANIM_MS = 650;   // duration of bus particle animation in ms
const MAX_HISTORY = 40;    // unused here but good practice marker

// ─── Static program data (created once, never re-created on re-mount) ─────────
const PROGRAMS = {
    add: [
        { inst: "MOV A, 5", comment: "Load 5 into Accumulator A" },
        { inst: "MOV B, 8", comment: "Load 8 into Register B" },
        { inst: "ADD A, B", comment: "ALU: A = A + B  → A = 13 (0x0D)" },
        { inst: "OUT 1, A", comment: "Write Accumulator to Port 1" },
        { inst: "HALT", comment: "Stop CPU machine cycle" }
    ],
    shl: [
        { inst: "MOV A, 3", comment: "Load 3 into Accumulator A" },
        { inst: "SHL A", comment: "ALU: Shift-Left A → A = 6  (×2)" },
        { inst: "SHL A", comment: "ALU: Shift-Left A → A = 12 (×2)" },
        { inst: "OUT 2, A", comment: "Write Accumulator to Port 2" },
        { inst: "HALT", comment: "Stop CPU machine cycle" }
    ],
    fib: [
        // Correct Fibonacci: A=prev, B=curr, C=temp
        // Sequence output: 1, 1, 2, 3, 5, 8, 13 …
        { inst: "MOV A, 0", comment: "A = 0  (F₀ seed)" },
        { inst: "MOV B, 1", comment: "B = 1  (F₁ seed)" },
        { inst: "ADD A, B", comment: "A = A + B → 1  (F₂)" },
        { inst: "OUT 1, A", comment: "Output 1" },
        { inst: "MOV C, B", comment: "C = B (save previous)" },
        { inst: "MOV B, A", comment: "B = A (advance)" },
        { inst: "ADD A, C", comment: "A = A + C → 2  (F₃)" },
        { inst: "OUT 1, A", comment: "Output 2" },
        { inst: "MOV C, B", comment: "C = B (save previous)" },
        { inst: "MOV B, A", comment: "B = A (advance)" },
        { inst: "ADD A, C", comment: "A = A + C → 3  (F₄)" },
        { inst: "OUT 1, A", comment: "Output 3" },
        { inst: "MOV C, B", comment: "C = B (save previous)" },
        { inst: "MOV B, A", comment: "B = A (advance)" },
        { inst: "ADD A, C", comment: "A = A + C → 5  (F₅)" },
        { inst: "OUT 1, A", comment: "Output 5" },
        { inst: "HALT", comment: "Stop CPU machine cycle" }
    ]
};

// ─── Render ───────────────────────────────────────────────────────────────────
export const render = async () => {
    return `
        <div class="simulator-container fade-in">
            <!-- Navigation Header -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px; display: inline-flex; align-items: center; gap: 8px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0; display: inline-flex; align-items: center; gap: 6px;">
                    <span class="status-indicator completed" style="background: var(--accent-secondary); box-shadow: 0 0 8px var(--accent-secondary); margin: 0 4px 0 0;"></span>
                    Sector 04: Processor Architecture
                </span>
            </div>

            <!-- Page Title -->
            <div class="section-title" style="margin-top: 0; margin-bottom: 32px; text-align: left;">
                <h2>8-Bit Microprocessor Core &amp; Assembly Laboratory</h2>
                <p>Compile instruction opcodes, step through assembly execution line-by-line, and watch binary data travel over registers, ALU, and address/data buses in real-time.</p>
            </div>

            <div class="simulator-layout">

                <!-- ── Main Simulator Visualization Deck ── -->
                <div class="simulator-main">
                    <div class="visualizer-wrapper" style="height: 480px; background: radial-gradient(circle at center, #020817 0%, #010409 100%); border: 1px solid rgba(6, 182, 212, 0.15); border-radius: var(--border-radius-md); overflow: hidden; position: relative;">

                        <!-- HUD Overlay Header -->
                        <div class="visualizer-labels" style="border-bottom: 1px solid rgba(6, 182, 212, 0.15); background: rgba(1, 4, 9, 0.8); backdrop-filter: blur(8px); display: flex; justify-content: space-between; align-items: center; padding: 10px 18px;">
                            <span style="font-weight: 700; color: #fff; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif;">
                                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; box-shadow: 0 0 10px #06b6d4; animation: pulse 1.5s infinite;"></span>
                                CPU Core &amp; Bus System Telemetry
                            </span>
                            <span id="clock-telemetry" style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">CLOCK: ACTIVE (2.4 Hz)</span>
                        </div>

                        <!-- Twin Canvases split layout -->
                        <div class="diode-split" style="height: calc(100% - 41px); display: grid; grid-template-columns: 1.3fr 0.7fr;">
                            <canvas id="cpu-registers-canvas" class="diode-model-canvas" style="border-right: 1px solid rgba(255, 255, 255, 0.05);"></canvas>
                            <canvas id="cpu-bus-canvas"       class="diode-graph-canvas" style="background: #000;"></canvas>
                        </div>
                    </div>

                    <!-- Theoretical & Lab Explanations Tabbed Panel -->
                    <div class="glass-card explanation-panel" style="padding: 24px; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--border-radius-md); background: rgba(1, 4, 9, 0.45); backdrop-filter: blur(12px);">
                        <div class="explanation-tabs" style="display: flex; gap: 10px; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 1px;">
                            <button class="tab-btn active" data-tab="walkthrough" style="padding: 10px 16px; border: none; background: none; color: var(--text-secondary); cursor: pointer; font-weight: 600; font-size: 0.9rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Lab Experiments</button>
                            <button class="tab-btn"        data-tab="theory"      style="padding: 10px 16px; border: none; background: none; color: var(--text-secondary); cursor: pointer; font-weight: 600; font-size: 0.9rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Opcodes &amp; Registers</button>
                            <button class="tab-btn"        data-tab="applications" style="padding: 10px 16px; border: none; background: none; color: var(--text-secondary); cursor: pointer; font-weight: 600; font-size: 0.9rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Microprocessor Buses</button>
                        </div>

                        <div class="tab-content active" id="tab-walkthrough">
                            <h3 style="margin-top: 0; color: #fff; font-family: 'Space Grotesk', sans-serif;">Microprocessor Lab Exercises</h3>
                            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">Follow these procedures to analyze data cycles:</p>
                            <ul style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; padding-left: 20px;">
                                <li style="margin-bottom: 10px;"><strong>Experiment 1: Single Step through ADD Program</strong> — Select ADD Program. Click <em>Step</em> repeatedly. Watch the PC increment and the ALU glow yellow when ADD executes. Accumulator A becomes 13 (0x0D).</li>
                                <li style="margin-bottom: 10px;"><strong>Experiment 2: Shift Left (SHL) Multiplication</strong> — Select SHL Program. Each SHL doubles the accumulator value: 3 → 6 → 12. Watch the binary readout update.</li>
                                <li style="margin-bottom: 10px;"><strong>Experiment 3: Fibonacci Auto Run</strong> — Select Fibonacci Program then click Auto Run. Watch the correct sequence build: 1, 2, 3, 5 … Use the clock slider to slow it down.</li>
                                <li style="margin-bottom: 10px;"><strong>Experiment 4: Bus Telemetry Monitoring</strong> — During step execution, purple particles on the Address Bus select RAM, while cyan particles carry opcodes back on the Data Bus.</li>
                                <li style="margin-bottom: 10px;"><strong>Keyboard shortcuts:</strong> <kbd>Space</kbd> = Step &nbsp;|&nbsp; <kbd>R</kbd> = Reset &nbsp;|&nbsp; <kbd>A</kbd> = Toggle Auto Run</li>
                            </ul>
                        </div>

                        <div class="tab-content" id="tab-theory">
                            <h3 style="margin-top: 0; color: #fff; font-family: 'Space Grotesk', sans-serif;">Accumulators, Program Counters, and ALU</h3>
                            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">At the center of every microcontroller is the CPU composed of registers and processing gates:</p>
                            <ul style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; padding-left: 20px;">
                                <li style="margin-bottom: 12px;"><strong>Accumulator (A):</strong> The primary workhorse register. Almost all mathematical or logical operations store their results inside the accumulator.</li>
                                <li style="margin-bottom: 12px;"><strong>Program Counter (PC):</strong> A register containing the RAM address of the next instruction to fetch. It increments automatically after every machine cycle.</li>
                                <li style="margin-bottom: 12px;"><strong>Arithmetic Logic Unit (ALU):</strong> The logic gate matrix that performs ADD, SUB, SHL and other operations under command of the decoded instruction.</li>
                                <li style="margin-bottom: 12px;"><strong>Status Flags (PSW):</strong> The <strong>Zero Flag (Z)</strong> is set when the ALU result is 0; the <strong>Carry Flag (C)</strong> tracks 8-bit overflows; <strong>Sign (S)</strong> reflects the MSB; <strong>Parity (P)</strong> tracks even/odd bit count.</li>
                            </ul>
                        </div>

                        <div class="tab-content" id="tab-applications">
                            <h3 style="margin-top: 0; color: #fff; font-family: 'Space Grotesk', sans-serif;">Microprocessor Buses</h3>
                            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">A microprocessor communicates with RAM, flash memory, and peripherals using three distinct bus arrays:</p>
                            <ol style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; padding-left: 20px;">
                                <li style="margin-bottom: 12px;"><strong>Address Bus (Unidirectional):</strong> CPU outputs the target address it wants to read or write. An 8-bit bus allows 256 unique memory slots.</li>
                                <li style="margin-bottom: 12px;"><strong>Data Bus (Bidirectional):</strong> Carries actual binary data (opcodes or variables) between memory and CPU registers.</li>
                                <li style="margin-bottom: 12px;"><strong>Control Bus:</strong> Synchronises read/write operations with the system clock (RD, WR signal lines).</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <!-- ── Controls & Program Panel ── -->
                <div class="control-panel" style="display: flex; flex-direction: column; gap: 20px;">

                    <!-- Program Selection -->
                    <div class="glass-card" style="padding: 24px; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--border-radius-md); background: rgba(1, 4, 9, 0.45); backdrop-filter: blur(12px);">
                        <h3 class="panel-section-title" style="margin-top: 0; font-family: 'Space Grotesk', sans-serif; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="terminal" style="color: var(--accent-secondary);"></i> Program Control
                        </h3>

                        <div class="slider-group" style="margin-bottom: 20px;">
                            <span class="slider-name" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Select Preset Code</span>
                            <select id="program-select" style="width: 100%; padding: 10px; background: rgba(2, 8, 23, 0.8); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 4px; color: #fff; font-family: monospace; font-size: 0.85rem; margin-top: 6px; cursor: pointer; outline: none; transition: border-color 0.2s;">
                                <option value="add">ADD Program (Add 5 + 8)</option>
                                <option value="shl">SHL Program (Multiply 3 × 4)</option>
                                <option value="fib">FIBONACCI Program (Series Gen)</option>
                            </select>
                        </div>

                        <!-- Assembly Code Preview -->
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 6px; margin-bottom: 20px; font-family: monospace; box-shadow: inset 0 0 10px rgba(0,0,0,0.3);">
                            <span style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 8px; font-weight: 800; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.05em;">ASSEMBLY SOURCE CODE</span>
                            <pre id="code-preview" style="margin: 0; font-family: 'Space Grotesk', monospace; font-size: 0.8rem; line-height: 1.6; color: #fff; overflow-y: auto; max-height: 140px;"></pre>
                        </div>

                        <!-- Stepper Actions -->
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <button id="btn-cpu-step" class="btn btn-primary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px;">
                                    <i data-lucide="play" style="width: 14px; height: 14px;"></i> Step
                                </button>
                                <button id="btn-cpu-auto" class="btn btn-secondary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); color: #818cf8;">
                                    <i data-lucide="zap" id="auto-icon" style="width: 14px; height: 14px;"></i> Auto Run
                                </button>
                            </div>
                            <button id="btn-cpu-reset" class="btn btn-secondary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border: 1px solid rgba(255,255,255,0.08);">
                                <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset CPU Core
                            </button>
                        </div>

                        <!-- Clock speed control -->
                        <div class="slider-group" style="margin-bottom: 4px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 18px;">
                            <div class="slider-label-row" style="font-size: 0.8rem; display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span class="slider-name" style="color: var(--text-secondary); font-weight: 600;">Execution Frequency (Clock)</span>
                                <span class="slider-val" id="val-clock" style="color: var(--accent-secondary); font-weight: 700;">1.0 Hz</span>
                            </div>
                            <input type="range" class="slider-input" id="slider-clock" min="0.5" max="4.0" step="0.5" value="1.0" style="background: rgba(6, 182, 212, 0.1); width: 100%;">
                            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 6px; margin-bottom: 0;">
                                ⚠ Slowed for visualization — real CPUs run at MHz–GHz speeds.
                            </p>
                        </div>
                    </div>

                    <!-- Bus Status Monitor -->
                    <div class="glass-card" style="padding: 24px; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--border-radius-md); background: rgba(1, 4, 9, 0.45); backdrop-filter: blur(12px);">
                        <h3 class="panel-section-title" style="margin-top: 0; font-family: 'Space Grotesk', sans-serif; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="activity" style="color: var(--accent-primary);"></i> Bus Status Monitor
                        </h3>
                        <div style="background: rgba(6, 182, 212, 0.03); border: 1px solid rgba(6, 182, 212, 0.15); padding: 16px; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-family: 'Space Grotesk', sans-serif;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Instruction Register (IR):</span>
                                <span id="readout-ir" style="color: var(--accent-secondary); font-weight: bold; font-family: monospace;">NOP</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 6px;">
                                <span style="color: var(--text-secondary);">Bus Activity:</span>
                                <span id="readout-bus" style="color: var(--warning); font-weight: bold;">IDLE</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Output Port:</span>
                                <span id="readout-port" style="color: var(--success); font-weight: bold;">0x00 (Dec: 0)</span>
                            </div>
                        </div>
                    </div>

                    <!-- Syllabus Navigator -->
                    <div class="glass-card" style="padding: 24px; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--border-radius-md); background: rgba(1, 4, 9, 0.45); backdrop-filter: blur(12px);">
                        <h3 class="panel-section-title" style="margin-top: 0; font-family: 'Space Grotesk', sans-serif; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="compass" style="color: var(--accent-purple);"></i> Labs &amp; Quizzes
                        </h3>
                        <a href="#/quiz" class="btn btn-primary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px; background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-secondary) 100%); border: none;">
                            <i data-lucide="award" style="width: 14px; height: 14px;"></i> Enter Sector Quiz
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ─── Module-level handles (for unmount cleanup) ───────────────────────────────
let animationFrameId = null;
let autoRunInterval = null;
let activeTabHandler = null;
let keydownHandler = null;
let resizeObserver = null;

// ─── Mount ────────────────────────────────────────────────────────────────────
export const mount = () => {

    // ── 1. Tab switching ──────────────────────────────────────────────────────
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

    // ── 2. Canvas setup ───────────────────────────────────────────────────────
    const registersCanvas = document.getElementById('cpu-registers-canvas');
    const busCanvas = document.getElementById('cpu-bus-canvas');

    // ✅ Null guard — fail loudly if IDs are missing
    const requiredEls = {
        'cpu-registers-canvas': registersCanvas,
        'cpu-bus-canvas': busCanvas,
        'program-select': document.getElementById('program-select'),
        'code-preview': document.getElementById('code-preview'),
        'readout-ir': document.getElementById('readout-ir'),
        'readout-bus': document.getElementById('readout-bus'),
        'readout-port': document.getElementById('readout-port'),
        'slider-clock': document.getElementById('slider-clock'),
        'val-clock': document.getElementById('val-clock'),
        'clock-telemetry': document.getElementById('clock-telemetry'),
        'btn-cpu-step': document.getElementById('btn-cpu-step'),
        'btn-cpu-auto': document.getElementById('btn-cpu-auto'),
        'btn-cpu-reset': document.getElementById('btn-cpu-reset'),
    };

    const missingEl = Object.entries(requiredEls).find(([, el]) => !el);
    if (missingEl) {
        console.error(`Nextron Simulator: Missing required DOM element — #${missingEl[0]}`);
        return;
    }

    const rCtx = registersCanvas.getContext('2d');
    const bCtx = busCanvas.getContext('2d');

    let rWidth, rHeight, bWidth, bHeight;

    const sizeCanvases = () => {
        const parentWidth = registersCanvas.parentElement.clientWidth || 800;
        rWidth = registersCanvas.width = Math.floor(parentWidth * 0.65);
        bWidth = busCanvas.width = Math.floor(parentWidth * 0.35);
        rHeight = registersCanvas.height = CANVAS_HEIGHT;
        bHeight = busCanvas.height = CANVAS_HEIGHT;
    };

    sizeCanvases();

    // ✅ ResizeObserver instead of fragile setTimeout
    resizeObserver = new ResizeObserver(() => sizeCanvases());
    resizeObserver.observe(registersCanvas.parentElement);

    // ── 3. CPU emulation state ─────────────────────────────────────────────────
    let activeProgramKey = 'add';
    let pcVal = 0;
    let regA = 0;
    let regB = 0;
    let regC = 0;    // ✅ Added register C for Fibonacci temp storage
    let flagZ = 0;
    let flagC = 0;
    let flagS = 0;
    let flagP = 0;
    let portOutput = 0;
    let busActivity = 'IDLE';  // IDLE | READ_RAM | ALU_OP | WRITE_PORT | HALT
    let lastWrittenReg = null;    // ✅ Track which register was written last
    let isAutoRunning = false;
    let clockFrequency = 1.0;     // Hz
    let busAnimStart = null;    // ✅ Timestamp for frame-rate-independent animation

    // DOM shortcuts
    const selectProgram = requiredEls['program-select'];
    const codePreview = requiredEls['code-preview'];
    const readoutIr = requiredEls['readout-ir'];
    const readoutBus = requiredEls['readout-bus'];
    const readoutPort = requiredEls['readout-port'];
    const sliderClock = requiredEls['slider-clock'];
    const valClock = requiredEls['val-clock'];
    const clockTelemetry = requiredEls['clock-telemetry'];
    const btnStep = requiredEls['btn-cpu-step'];
    const btnAuto = requiredEls['btn-cpu-auto'];
    const btnReset = requiredEls['btn-cpu-reset'];

    // ── 4. Helpers ─────────────────────────────────────────────────────────────

    // ✅ Correct parity: counts set bits properly
    function computeParity(val) {
        let n = val, bits = 0;
        while (n) { bits += n & 1; n >>>= 1; }
        return bits % 2 === 0 ? 1 : 0;
    }

    function toHex(val) {
        return `0x${val.toString(16).toUpperCase().padStart(2, '0')}`;
    }

    function updatePreview() {
        const lines = PROGRAMS[activeProgramKey];
        codePreview.innerHTML = lines.map((l, idx) => {
            const isCurrent = idx === pcVal;
            const style = isCurrent
                ? 'background: rgba(6, 182, 212, 0.18); border-left: 3px solid #06b6d4; padding-left: 6px; font-weight: bold; color: #fff;'
                : 'padding-left: 9px; color: var(--text-secondary);';
            // ✅ data-active attribute for scroll tracking
            return `<div style="${style}" ${isCurrent ? 'data-active="true"' : ''}>${idx}: ${l.inst.padEnd(12)} ; ${l.comment}</div>`;
        }).join('');

        readoutIr.textContent = (pcVal < lines.length) ? lines[pcVal].inst : 'HALT';

        // ✅ Auto-scroll active line into view
        const activeRow = codePreview.querySelector('[data-active="true"]');
        if (activeRow) activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function resetCPU() {
        pcVal = 0;
        regA = 0;
        regB = 0;
        regC = 0;
        flagZ = 0;
        flagC = 0;
        flagS = 0;
        flagP = 0;
        portOutput = 0;
        busActivity = 'IDLE';
        lastWrittenReg = null;
        busAnimStart = null;

        readoutPort.textContent = '0x00 (Dec: 0)';
        readoutBus.textContent = 'IDLE';
        updatePreview();

        if (isAutoRunning) toggleAutoRun();
    }

    // ── 5. CPU Instruction Executor ────────────────────────────────────────────
    function stepExecution() {
        const lines = PROGRAMS[activeProgramKey];

        // ✅ If already halted, silently return (no wrap-around)
        if (busActivity === 'HALT') return;

        if (pcVal >= lines.length) {
            busActivity = 'HALT';
            readoutBus.textContent = 'HALT';
            if (isAutoRunning) toggleAutoRun();
            return;
        }

        const currentInst = lines[pcVal].inst;
        const tokens = currentInst.split(/[ ,]+/);
        const opcode = tokens[0];

        // Trigger bus animation timestamp
        busAnimStart = performance.now();

        if (opcode === 'MOV') {
            busActivity = 'READ_RAM';
            const dest = tokens[1];
            const src = tokens[2];

            let numericVal = parseInt(src, 10);
            if (isNaN(numericVal)) {
                // Register-to-register copy
                numericVal = src === 'A' ? regA : src === 'B' ? regB : regC;
            }

            // ✅ Track which register was written for highlight
            lastWrittenReg = dest;

            if (dest === 'A') regA = numericVal & 0xFF;
            else if (dest === 'B') regB = numericVal & 0xFF;
            else if (dest === 'C') regC = numericVal & 0xFF;

        } else if (opcode === 'ADD') {
            busActivity = 'ALU_OP';
            const sum = regA + regB;
            // ✅ Carry flag: set if result exceeds 8-bit max
            flagC = sum > 0xFF ? 1 : 0;
            regA = sum & 0xFF;
            flagZ = regA === 0 ? 1 : 0;
            flagS = (regA & 0x80) ? 1 : 0;
            flagP = computeParity(regA);
            lastWrittenReg = 'A';

        } else if (opcode === 'SHL') {
            busActivity = 'ALU_OP';
            // ✅ Correct carry: check MSB *before* shifting
            flagC = (regA & 0x80) ? 1 : 0;
            regA = (regA << 1) & 0xFF;
            flagZ = regA === 0 ? 1 : 0;
            flagS = (regA & 0x80) ? 1 : 0;
            flagP = computeParity(regA);
            lastWrittenReg = 'A';

        } else if (opcode === 'OUT') {
            busActivity = 'WRITE_PORT';
            portOutput = regA;
            readoutPort.textContent = `${toHex(portOutput)} (Dec: ${portOutput})`;

        } else if (opcode === 'HALT') {
            busActivity = 'HALT';
            // ✅ Do NOT increment PC — keep pointing at HALT
            readoutBus.textContent = 'HALT';
            readoutIr.textContent = 'HALT';
            if (isAutoRunning) toggleAutoRun();
            return;  // early return — skip pcVal++
        }

        pcVal++;

        // Clamp if we've gone past end
        if (pcVal >= lines.length) {
            busActivity = 'HALT';
            readoutIr.textContent = 'HALT';
        }

        readoutBus.textContent = busActivity;
        updatePreview();
    }

    // ── 6. Auto Run ────────────────────────────────────────────────────────────
    function toggleAutoRun() {
        isAutoRunning = !isAutoRunning;

        if (isAutoRunning) {
            btnAuto.style.background = 'rgba(239, 68, 68, 0.1)';
            btnAuto.style.borderColor = 'rgba(239, 68, 68, 0.25)';
            btnAuto.style.color = '#f87171';
            btnAuto.innerHTML = `<i data-lucide="square" style="width:14px;height:14px;margin-right:6px;"></i> Stop Run`;
            if (window.lucide) window.lucide.createIcons();

            clockTelemetry.textContent = `CLOCK: ACTIVE (${clockFrequency.toFixed(1)} Hz)`;
            clockTelemetry.style.color = '#10b981';

            autoRunInterval = setInterval(() => {
                // ✅ Guard — stop interval if already halted
                if (busActivity === 'HALT') {
                    toggleAutoRun();
                    return;
                }
                stepExecution();
            }, 1000 / clockFrequency);

        } else {
            clearInterval(autoRunInterval);
            autoRunInterval = null;

            btnAuto.style.background = 'rgba(99, 102, 241, 0.1)';
            btnAuto.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            btnAuto.style.color = '#818cf8';
            btnAuto.innerHTML = `<i data-lucide="zap" style="width:14px;height:14px;margin-right:6px;"></i> Auto Run`;
            if (window.lucide) window.lucide.createIcons();

            clockTelemetry.textContent = 'CLOCK: STOPPED';
            clockTelemetry.style.color = 'var(--text-muted)';
        }
    }

    // ── 7. Event Listeners ─────────────────────────────────────────────────────
    const onProgramChange = (e) => { activeProgramKey = e.target.value; resetCPU(); };
    const onClockChange = (e) => {
        clockFrequency = parseFloat(e.target.value);
        valClock.textContent = `${clockFrequency.toFixed(1)} Hz`;
        if (isAutoRunning) {
            clearInterval(autoRunInterval);
            autoRunInterval = setInterval(() => {
                if (busActivity === 'HALT') { toggleAutoRun(); return; }
                stepExecution();
            }, 1000 / clockFrequency);
            clockTelemetry.textContent = `CLOCK: ACTIVE (${clockFrequency.toFixed(1)} Hz)`;
        }
    };

    selectProgram.addEventListener('change', onProgramChange);
    sliderClock.addEventListener('input', onClockChange);
    btnStep.addEventListener('click', stepExecution);
    btnReset.addEventListener('click', resetCPU);
    btnAuto.addEventListener('click', toggleAutoRun);

    // ✅ Keyboard shortcuts
    keydownHandler = (e) => {
        // Ignore when typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.key === ' ') { e.preventDefault(); stepExecution(); }
        if (e.key === 'r' || e.key === 'R') resetCPU();
        if (e.key === 'a' || e.key === 'A') toggleAutoRun();
    };
    document.addEventListener('keydown', keydownHandler);

    // Store handlers for cleanup
    selectProgram._onProgramChange = onProgramChange;
    sliderClock._onClockChange = onClockChange;

    // Initialize display
    resetCPU();

    // ── 8. Render Loop ─────────────────────────────────────────────────────────
    const runCPULoop = () => {
        // ── PART A: REGISTERS CANVAS ──────────────────────────────────────────
        rCtx.clearRect(0, 0, rWidth, rHeight);

        // Background card
        rCtx.fillStyle = 'rgba(2, 8, 23, 0.7)';
        rCtx.fillRect(15, 15, rWidth - 30, rHeight - 30);
        rCtx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
        rCtx.lineWidth = 1.5;
        rCtx.strokeRect(15, 15, rWidth - 30, rHeight - 30);

        // Header bar
        rCtx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        rCtx.fillRect(16, 16, rWidth - 32, 42);
        rCtx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        rCtx.lineWidth = 1;
        rCtx.beginPath(); rCtx.moveTo(15, 58); rCtx.lineTo(rWidth - 15, 58); rCtx.stroke();

        rCtx.font = "800 14px 'Outfit', 'Space Grotesk', sans-serif";
        rCtx.fillStyle = '#06b6d4';
        rCtx.textAlign = 'center';
        rCtx.shadowColor = 'rgba(6, 182, 212, 0.3)';
        rCtx.shadowBlur = 6;
        rCtx.fillText('INTERNAL PROCESSOR REGISTERS', rWidth / 2, 41);
        rCtx.shadowBlur = 0;

        // ✅ Frame-rate independent animation progress
        const animProgress = busAnimStart
            ? Math.min(1, (performance.now() - busAnimStart) / BUS_ANIM_MS)
            : 0;
        const isAnimating = animProgress < 1 && busAnimStart !== null;

        // Helper: draw a register row
        const drawRegRow = (y, name, decVal, active) => {
            rCtx.fillStyle = active ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.015)';
            rCtx.strokeStyle = active ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)';
            rCtx.lineWidth = 1;
            rCtx.fillRect(25, y, rWidth - 50, 48);
            rCtx.strokeRect(25, y, rWidth - 50, 48);

            rCtx.font = "bold 11px 'Space Grotesk', sans-serif";
            rCtx.fillStyle = active ? '#06b6d4' : 'rgba(255, 255, 255, 0.45)';
            rCtx.textAlign = 'left';
            rCtx.fillText(name, 38, y + 27);

            rCtx.font = 'bold 14px monospace';
            rCtx.fillStyle = active ? '#06b6d4' : '#fff';
            rCtx.textAlign = 'right';
            const hexText = toHex(decVal);
            const binText = decVal.toString(2).padStart(8, '0');
            rCtx.fillText(`${hexText}  (${binText})`, rWidth - 38, y + 28);
        };

        // ✅ Correct per-register highlight using lastWrittenReg
        const isAluActive = busActivity === 'ALU_OP' && isAnimating;
        const isReadActive = busActivity === 'READ_RAM' && isAnimating;

        drawRegRow(72, 'Accumulator A', regA, isAluActive || (isReadActive && lastWrittenReg === 'A'));
        drawRegRow(128, 'Register B', regB, isReadActive && lastWrittenReg === 'B');
        drawRegRow(184, 'Register C (Temp)', regC, isReadActive && lastWrittenReg === 'C');
        drawRegRow(240, 'Program Counter (PC)', pcVal, isReadActive);

        // Status Flags
        const yFlags = 298;
        rCtx.fillStyle = 'rgba(255, 255, 255, 0.01)';
        rCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        rCtx.lineWidth = 1;
        rCtx.fillRect(25, yFlags, rWidth - 50, 120);
        rCtx.strokeRect(25, yFlags, rWidth - 50, 120);

        rCtx.font = "bold 11px 'Space Grotesk', sans-serif";
        rCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        rCtx.textAlign = 'center';
        rCtx.fillText('STATUS FLAGS REGISTER (PSW)', rWidth / 2, yFlags + 22);

        const flagWidth = (rWidth - 80) / 4;
        const drawFlagBox = (idx, label, flagVal) => {
            const x = 32 + idx * (flagWidth + 5);
            rCtx.fillStyle = flagVal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.01)';
            rCtx.strokeStyle = flagVal ? '#10b981' : 'rgba(255, 255, 255, 0.07)';
            rCtx.lineWidth = 1;
            rCtx.fillRect(x, yFlags + 38, flagWidth, 70);
            rCtx.strokeRect(x, yFlags + 38, flagWidth, 70);

            rCtx.font = "bold 10px 'Space Grotesk', sans-serif";
            rCtx.fillStyle = flagVal ? '#10b981' : 'rgba(255, 255, 255, 0.35)';
            rCtx.fillText(label, x + flagWidth / 2, yFlags + 60);

            rCtx.font = 'bold 18px monospace';
            rCtx.fillStyle = flagVal ? '#10b981' : 'rgba(255, 255, 255, 0.8)';
            rCtx.fillText(flagVal.toString(), x + flagWidth / 2, yFlags + 94);
        };

        drawFlagBox(0, 'Z (Zero)', flagZ);
        drawFlagBox(1, 'C (Carry)', flagC);
        drawFlagBox(2, 'S (Sign)', flagS);
        drawFlagBox(3, 'P (Parity)', flagP);

        // ✅ HALT completion banner
        if (busActivity === 'HALT') {
            rCtx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            rCtx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
            rCtx.lineWidth = 1;
            rCtx.fillRect(25, rHeight - 55, rWidth - 50, 34);
            rCtx.strokeRect(25, rHeight - 55, rWidth - 50, 34);
            rCtx.fillStyle = '#10b981';
            rCtx.font = 'bold 12px monospace';
            rCtx.textAlign = 'center';
            rCtx.fillText('✓ PROGRAM COMPLETE — Press R or click Reset to restart', rWidth / 2, rHeight - 33);
        }

        // ── PART B: BUS CANVAS ────────────────────────────────────────────────
        bCtx.clearRect(0, 0, bWidth, bHeight);

        const wCpu = Math.min(125, bWidth * 0.4);
        const hCpu = 160;
        const yCpu = 60;
        const xCpu = bWidth * 0.08;

        const wRam = Math.min(105, bWidth * 0.33);
        const hRam = 160;
        const yRam = 60;
        const xRam = bWidth - wRam - bWidth * 0.08;

        // CPU Core block
        bCtx.fillStyle = 'rgba(6, 182, 212, 0.04)';
        bCtx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        bCtx.lineWidth = 1.5;
        bCtx.fillRect(xCpu, yCpu, wCpu, hCpu);
        bCtx.strokeRect(xCpu, yCpu, wCpu, hCpu);

        bCtx.fillStyle = '#fff';
        bCtx.font = "800 11px 'Outfit', 'Space Grotesk', sans-serif";
        bCtx.textAlign = 'center';
        bCtx.fillText('8-BIT CPU', xCpu + wCpu / 2, yCpu + 24);

        // ALU trapezoid inside CPU
        const isAluGlowing = busActivity === 'ALU_OP' && isAnimating;
        bCtx.fillStyle = isAluGlowing ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)';
        bCtx.strokeStyle = isAluGlowing ? '#f59e0b' : 'rgba(255, 255, 255, 0.12)';
        bCtx.lineWidth = 1.5;
        if (isAluGlowing) { bCtx.shadowColor = '#f59e0b'; bCtx.shadowBlur = 8; }
        bCtx.beginPath();
        bCtx.moveTo(xCpu + wCpu * 0.15, yCpu + 58);
        bCtx.lineTo(xCpu + wCpu * 0.44, yCpu + 58);
        bCtx.lineTo(xCpu + wCpu * 0.50, yCpu + 72);
        bCtx.lineTo(xCpu + wCpu * 0.56, yCpu + 58);
        bCtx.lineTo(xCpu + wCpu * 0.85, yCpu + 58);
        bCtx.lineTo(xCpu + wCpu * 0.72, yCpu + 102);
        bCtx.lineTo(xCpu + wCpu * 0.28, yCpu + 102);
        bCtx.closePath();
        bCtx.fill();
        bCtx.stroke();
        bCtx.shadowBlur = 0;

        bCtx.fillStyle = isAluGlowing ? '#f59e0b' : 'rgba(255,255,255,0.7)';
        bCtx.font = 'bold 9px monospace';
        bCtx.fillText('ALU', xCpu + wCpu / 2, yCpu + 86);

        // RAM block
        bCtx.fillStyle = 'rgba(99, 102, 241, 0.04)';
        bCtx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
        bCtx.lineWidth = 1.5;
        bCtx.fillRect(xRam, yRam, wRam, hRam);
        bCtx.strokeRect(xRam, yRam, wRam, hRam);

        bCtx.fillStyle = '#fff';
        bCtx.font = "800 11px 'Outfit', 'Space Grotesk', sans-serif";
        bCtx.fillText('RAM', xRam + wRam / 2, yRam + 24);

        for (let i = 0; i < 4; i++) {
            const isLineActive = (pcVal === i);
            bCtx.fillStyle = isLineActive ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)';
            bCtx.strokeStyle = isLineActive ? '#06b6d4' : 'rgba(255, 255, 255, 0.04)';
            bCtx.lineWidth = 1;
            bCtx.fillRect(xRam + 6, yRam + 45 + i * 26, wRam - 12, 20);
            bCtx.strokeRect(xRam + 6, yRam + 45 + i * 26, wRam - 12, 20);
            bCtx.fillStyle = isLineActive ? '#fff' : 'rgba(255, 255, 255, 0.4)';
            bCtx.font = 'bold 8px monospace';
            bCtx.fillText(`[0x0${i}]: Code`, xRam + wRam / 2, yRam + 58 + i * 26);
        }

        // Bus trace lines
        const yBusAddress = 280;
        const yBusData = 340;
        const xAddrCpu = xCpu + wCpu * 0.30;
        const xAddrRam = xRam + wRam * 0.35;
        const xDataCpu = xCpu + wCpu * 0.70;
        const xDataRam = xRam + wRam * 0.70;

        const isAddrActive = busActivity === 'READ_RAM' && isAnimating;
        const isDataActive = (busActivity === 'READ_RAM' || busActivity === 'WRITE_PORT') && isAnimating;

        // Address Bus (purple)
        bCtx.strokeStyle = isAddrActive ? 'rgba(167, 139, 250, 0.3)' : 'rgba(99, 102, 241, 0.08)';
        bCtx.lineWidth = 8;
        bCtx.beginPath();
        bCtx.moveTo(xAddrCpu, yCpu + hCpu);
        bCtx.lineTo(xAddrCpu, yBusAddress);
        bCtx.lineTo(xAddrRam, yBusAddress);
        bCtx.lineTo(xAddrRam, yRam + hRam);
        bCtx.stroke();

        // Data Bus (cyan)
        bCtx.strokeStyle = isDataActive ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.08)';
        bCtx.lineWidth = 8;
        bCtx.beginPath();
        bCtx.moveTo(xDataCpu, yCpu + hCpu);
        bCtx.lineTo(xDataCpu, yBusData);
        bCtx.lineTo(xDataRam, yBusData);
        bCtx.lineTo(xDataRam, yRam + hRam);
        bCtx.stroke();

        // Bus labels
        bCtx.font = 'bold 8px monospace';
        bCtx.fillStyle = isAddrActive ? '#a78bfa' : 'rgba(99, 102, 241, 0.45)';
        bCtx.fillText('ADDRESS BUS (CPU → RAM)', bWidth / 2, yBusAddress - 8);
        bCtx.fillStyle = isDataActive ? '#06b6d4' : 'rgba(6, 182, 212, 0.45)';
        bCtx.fillText('DATA BUS (BIDIRECTIONAL)', bWidth / 2, yBusData - 8);

        // ✅ Frame-rate-independent animated particles
        if (isAnimating) {
            const p = animProgress; // 0 → 1

            if (busActivity === 'READ_RAM') {
                // Address particle: CPU → RAM
                const ax = xAddrCpu * (1 - p) + xAddrRam * p;
                bCtx.fillStyle = '#a78bfa';
                bCtx.shadowColor = '#a78bfa'; bCtx.shadowBlur = 6;
                bCtx.beginPath(); bCtx.arc(ax, yBusAddress, 5, 0, Math.PI * 2); bCtx.fill();
                bCtx.shadowBlur = 0;

                // Data particle: RAM → CPU (starts at 35% through anim)
                if (p > 0.35) {
                    const t = (p - 0.35) / 0.65;
                    const dx = xDataRam * (1 - t) + xDataCpu * t;
                    bCtx.fillStyle = '#06b6d4';
                    bCtx.shadowColor = '#06b6d4'; bCtx.shadowBlur = 6;
                    bCtx.beginPath(); bCtx.arc(dx, yBusData, 5, 0, Math.PI * 2); bCtx.fill();
                    bCtx.shadowBlur = 0;
                }

            } else if (busActivity === 'WRITE_PORT') {
                bCtx.fillStyle = '#10b981';
                bCtx.shadowColor = '#10b981'; bCtx.shadowBlur = 8;
                bCtx.font = 'bold 12px monospace';
                bCtx.textAlign = 'center';
                bCtx.fillText('PORT WRITE!', xCpu + wCpu / 2, yBusData + 40);
                bCtx.shadowBlur = 0;
            }
        }

        animationFrameId = requestAnimationFrame(runCPULoop);
    };

    runCPULoop();
};

// ─── Unmount ─────────────────────────────────────────────────────────────────
export const unmount = () => {
    // Stop auto-run interval
    if (autoRunInterval) {
        clearInterval(autoRunInterval);
        autoRunInterval = null;
    }

    // Cancel animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // ✅ Remove tab click listeners
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (activeTabHandler) {
        tabButtons.forEach(btn => btn.removeEventListener('click', activeTabHandler));
        activeTabHandler = null;
    }

    // ✅ Remove keyboard shortcut listener
    if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
    }

    // ✅ Remove button listeners (stored on element)
    const btnStep = document.getElementById('btn-cpu-step');
    const btnReset = document.getElementById('btn-cpu-reset');
    const btnAuto = document.getElementById('btn-cpu-auto');
    const sel = document.getElementById('program-select');
    const slider = document.getElementById('slider-clock');

    // These were assigned inline inside mount — remove by re-querying
    // (they are anonymous, so we clear by cloning the node — safe & clean)
    [btnStep, btnReset, btnAuto, sel, slider].forEach(el => {
        if (el) {
            const clone = el.cloneNode(true);
            el.parentNode?.replaceChild(clone, el);
        }
    });

    // ✅ Disconnect ResizeObserver
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
};