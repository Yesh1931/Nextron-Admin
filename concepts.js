import { isFirebaseActive, db } from '../firebase-config.js';

let activeCurriculum = null;

export const getCurriculumData = async () => {
    if (activeCurriculum) return activeCurriculum;
    
    if (isFirebaseActive) {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(db, "concepts"));
            if (!snap.empty) {
                const list = [];
                snap.forEach(doc => list.push(doc.data()));
                activeCurriculum = list.sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
                return activeCurriculum;
            }
        } catch (e) {
            console.error("Firestore concepts loading failed: ", e);
        }
    }
    
    activeCurriculum = CURRICULUM_DATA;
    return activeCurriculum;
};

export const isSubjectLocked = (id) => {
    // sandbox is always unlocked
    if (id === "sandbox") return false;

    // Scholar test user has complete and unrestricted access to all chapters
    const AppState = window.AppState;
    if (AppState && AppState.currentUser && AppState.currentUser.username.toLowerCase() === "scholar") {
        return false;
    }

    const sequence = [
        "signals",
        "networks",
        "pn-junction",
        "transistor",
        "logic-gates",
        "flipflops",
        "microcontrollers",
        "dsp",
        "comms",
        "vlsi",
        "embedded",
        "optical"
    ];

    const index = sequence.indexOf(id);
    if (index <= 0) return false; // First subject is always unlocked

    const prevId = sequence[index - 1];
    
    // Check if the previous one itself is locked (recursive check)
    if (isSubjectLocked(prevId)) return true;

    // Check previous one's score
    const scoreId = prevId === "flipflops" ? "flip-flops" : prevId;
    const score = AppState ? AppState.completedQuizzes[scoreId] : undefined;
    
    return score === undefined || score < 80;
};

// Comprehensive Curriculum Database for B.Tech ECE
const CURRICULUM_DATA = [
    // Semester 1
    {
        id: "signals",
        semester: 1,
        isSim: true,
        route: "#/concept/signals",
        icon: "activity",
        category: "Signal Processing",
        title: "AC Signal Generator & wave basics",
        desc: "Learn fundamental time-varying electrical waves: Amplitude, Frequency, Phase parameters, and deploy dual-channel Oscilloscopes.",
        statusId: "signals",
        details: {
            syllabus: [
                "Time-varying waveforms: amplitude, peak-to-peak, frequency, phase, and offsets",
                "Root Mean Square (RMS) and average voltage calculations",
                "Signal representations in time and frequency domains (Fast Fourier Transform)",
                "Oscilloscope controls: Volts/Div, Time/Div, Triggering modes, and cursors",
                "Dual-channel comparison, phase shift, and Lissajous patterns"
            ],
            formulas: [
                "Standard Sinusoid: $v(t) = V_p \\cdot \\sin(2\\pi f t + \\theta) + V_{\\text{offset}}$",
                "Peak-to-Peak Voltage: $V_{pp} = 2 \\cdot V_p$",
                "RMS Voltage (Sine Wave): $V_{rms} = \\frac{V_p}{\\sqrt{2}} \\approx 0.707 \\cdot V_p$",
                "Signal Period: $T = \\frac{1}{f}$"
            ],
            notes: "Signals are the lifeblood of communication and electronic systems. Visualizing them in the time domain using an oscilloscope reveals their amplitude and phase relationships, while the frequency domain (FFT) isolates individual harmonic peaks. Channel synchronization is established by triggering, which matches the sweep rate to the signal frequency."
        }
    },
    {
        id: "sandbox",
        semester: 1,
        isSim: true,
        route: "#/sandbox",
        icon: "flask-conical",
        category: "Electrical Networks",
        title: "Basic Circuit & Networks Lab",
        desc: "Construct series loops, analyze Ohm's Law drops, and experiment with switches, resistors, and LED fuses in the active sandbox.",
        statusId: "sandbox",
        details: {
            syllabus: [
                "Ohm's Law verification (V = I · R)",
                "Kirchhoff's Current Law (KCL) in parallel nodes",
                "Kirchhoff's Voltage Law (KVL) in closed series loops",
                "Series vs Parallel equivalent resistance",
                "Practical load current limits & component protection (LED tolerances)"
            ],
            formulas: [
                "Ohm's Law: $V = I \\cdot R$",
                "Series Resistance: $R_{eq} = R_1 + R_2 + R_3$",
                "Parallel Resistance: $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$",
                "Power Dissipation: $P = I^2 \\cdot R = V \\cdot I$"
            ],
            notes: "A simple series loop consists of a voltage source, closed switch, current-limiting resistor, and active load (such as a diode or LED). Diodes exhibit a 0.7V threshold drop, whereas green LEDs require approximately 2.0V forward bias and must be protected by a series resistance to prevent overload currents (>45mA) from blowing their fuse."
        }
    },

    // Semester 2
    {
        id: "networks",
        semester: 2,
        isSim: true,
        route: "#/concept/networks",
        icon: "git-branch",
        category: "Circuit Analysis",
        title: "Network Theory & Circuit Synthesis",
        desc: "Deconstruct complicated electrical networks using Loop/Nodal analysis, Thevenin/Norton equivalence, and resonance behaviors.",
        statusId: "networks",
        details: {
            syllabus: ["KVL and KCL Node/Mesh matrix equations", "Superposition, Thevenin's, Norton's, and Maximum Power Transfer theorems", "Transient analysis of RL, RC, and RLC networks", "Two-Port network parameters (Z, Y, ABCD, h)", "AC resonance (Q-factor and bandwidth)"],
            formulas: [
                "Thevenin Resistance: $R_{th} = \\frac{V_{oc}}{I_{sc}}$",
                "Max Power Transfer: $R_L = R_{th} \\implies P_{max} = \\frac{V_{th}^2}{4R_{th}}$",
                "RLC Resonant Frequency: $f_r = \\frac{1}{2\\pi \\sqrt{LC}}$",
                "Quality Factor: $Q = \\frac{\\omega_r L}{R} = \\frac{1}{\\omega_r C R}$"
            ],
            notes: "Network theory allows engineers to simplify any linear complex grid of resistors, capacitors, and inductors into a single voltage source and series impedance."
        }
    },
    {
        id: "pn-junction",
        semester: 2,
        isSim: true,
        route: "#/concept/diode",
        icon: "zap",
        category: "Semiconductors",
        title: "PN Junction Diode Lab",
        desc: "Observe charge carrier flow (electrons & holes), depletion width narrowing/widening under bias, and plot Silicon I-V breakdown curves.",
        statusId: "pn-junction",
        details: {
            syllabus: [
                "Intrinsic and extrinsic semiconductor physics (P-type and N-type doping)",
                "Charge carrier diffusion, drift currents, and recombination mechanics",
                "Depletion region formation and the built-in barrier potential",
                "Forward and reverse bias electrical characteristics (Shockley Diode Equation)",
                "Breakdown mechanisms: Zener vs. Avalanche breakdown, temperature dependencies"
            ],
            formulas: [
                "Barrier Potential: $V_D = V_T \\cdot \\ln\\left(\\frac{N_A \\cdot N_D}{n_i^2}\\right)$",
                "Shockley Diode Current: $I = I_S \\cdot \\left( e^{\\frac{V_f}{\\eta V_T}} - 1 \\right)$",
                "Thermal Voltage: $V_T = \\frac{k_B T}{q} \\approx 25.85\\text{ mV at } 300\\text{ K}$",
                "Depletion Width: $W = \\sqrt{\\frac{2\\epsilon}{q} \\left( \\frac{1}{N_A} + \\frac{1}{N_D} \\right) V_{\\text{bi}}}$"
            ],
            notes: "The PN junction diode acts as an electronic one-way valve. Under forward bias ($>0.7\\text{ V}$ for Silicon), the depletion region collapses, allowing massive majority carrier recombination and exponential current. Under reverse bias, the barrier widens, blocking current until Zener or Avalanche breakdown is triggered."
        }
    },
 
    // Semester 3
    {
        id: "transistor",
        semester: 3,
        isSim: true,
        route: "#/concept/transistor",
        icon: "cpu",
        category: "Active Devices",
        title: "BJT NPN Transistor Lab",
        desc: "Direct emitter base collector carrier streams, command current gains (Beta), and graph operating modes on dynamic load lines.",
        statusId: "transistor",
        details: {
            syllabus: [
                "Bipolar Junction Transistor physical layers (Emitter, Base, Collector)",
                "Majority/minority carrier transport and base recombination processes",
                "Input and output characteristics in Common-Emitter (CE) configuration",
                "Operating modes: Cutoff, Active linear amplification, and Saturation switching",
                "DC operating point (Q-point), load lines, and current gain (Beta) dependencies"
            ],
            formulas: [
                "Collector Current (Active): $I_C = \\beta \\cdot I_B$",
                "Emitter Current: $I_E = I_B + I_C = (\\beta + 1)I_B$",
                "Common-Emitter DC Voltage Loop: $V_{CE} = V_{CC} - I_C \\cdot R_C$",
                "Transistor Current Gain Alpha: $\\alpha = \\frac{\\beta}{\\beta + 1}$"
            ],
            notes: "A BJT controls a large collector current using a small base current. In the linear active mode, the collector current is proportional to the base current, making the transistor a voltage-controlled current source for analog amplification. In cutoff and saturation, the BJT operates as an ideal electronic switch for digital applications."
        }
    },
    {
        id: "logic-gates",
        semester: 3,
        isSim: true,
        route: "#/concept/gates",
        icon: "binary",
        category: "Digital Logic",
        title: "Digital Logic Gates Lab",
        desc: "Toggle input switches, watch glowing digital states propagate through AND/OR/NOT schematics, and map live highlighted truth tables.",
        statusId: "logic-gates",
        details: {
            syllabus: [
                "Binary states (High/Low, Logical 1/0) and Boolean algebra",
                "Fundamental logic gates: NOT, AND, OR",
                "Universal logic gates: NAND, NOR (implementing all logic functions)",
                "Exclusive logic gates: XOR, XNOR (comparators, adders)",
                "Truth table mappings, logic level thresholds, and gate propagation delays"
            ],
            formulas: [
                "NOT Gate (Inverter): $Y = \\bar{A}$",
                "AND Gate Boolean: $Y = A \\cdot B$",
                "OR Gate Boolean: $Y = A + B$",
                "NAND Gate (De Morgan): $Y = \\overline{A \\cdot B} = \\bar{A} + \\bar{B}$",
                "XOR Gate (Exclusive OR): $Y = A \\oplus B = A\\bar{B} + \\bar{A}B$"
            ],
            notes: "Logic gates form the foundational components of all digital processors. They compute binary outputs based on voltage thresholds (typically $>2.0\\text{ V}$ for logic High and $<0.8\\text{ V}$ for logic Low in standard TTL circuits). Using NAND or NOR universal gates, any complex digital circuit or computer core can be synthesized."
        }
    },
 
    // Semester 4
    {
        id: "flipflops",
        semester: 4,
        isSim: true,
        route: "#/concept/flipflops",
        icon: "database",
        category: "Digital Memory",
        title: "Sequential Flip-Flops Lab",
        desc: "Analyze SR Latch and JK Flip-Flop feedback loops, trigger clocks manually, and explore JK high-level race-around toggling instability.",
        statusId: "flip-flops",
        details: {
            syllabus: [
                "Combinational vs. sequential logic (memory feedback loops)",
                "SR Latch: cross-coupled NOR/NAND gates and the invalid state",
                "D Flip-Flop: edge-triggered data locking and propagation",
                "JK Flip-Flop: resolving the invalid state and the toggle mode",
                "Race-around condition, clock synchronization, setup/hold times"
            ],
            formulas: [
                "SR Latch Next State: $Q_{next} = S + \\bar{R}Q$ (with $S \\cdot R = 0$)",
                "D Flip-Flop Next State: $Q_{next} = D$",
                "JK Flip-Flop Next State: $Q_{next} = J\\bar{Q} + \\bar{K}Q$",
                "JK Toggle State (when J=K=1): $Q_{next} = \\bar{Q}$"
            ],
            notes: "Sequential logic introduces the concept of time and history. Unlike combinational gates, flip-flops use internal feedback loops to store a single bit of binary memory. The JK flip-flop eliminates the invalid SR state by toggling the output when both J and K are high. High clock frequencies can trigger a 'race-around' toggle condition if the pulse width exceeds the propagation delay."
        }
    },
    {
        id: "microcontrollers",
        semester: 4,
        isSim: true,
        route: "#/concept/microcontrollers",
        icon: "terminal",
        category: "Processor Architecture",
        title: "Microprocessors & Microcontrollers",
        desc: "Understand high-speed architecture, instruction execution, register maps, and write assembly programming for Intel 8086 & 85.",
        statusId: "microcontrollers",
        details: {
            syllabus: ["8085 and 8086 Microprocessor internal register architectures", "Instruction sets, addressing modes, and Assembly Language Programming", "8051 Microcontroller architecture, ports, and internal timers", "Interrupt vectors and peripheral interfacing (8255 PPI, ADC, DAC)", "Embedded C programming fundamentals"],
            formulas: [
                "Memory Address (8086 Segmented): $\\text{Physical Address} = \\text{Segment Base} \\times 10\\text{H} + \\text{Offset}$",
                "Baud Rate Generation (8051): $\\text{Baud Rate} = \\frac{\\text{Timer 1 Overflow Rate}}{32}$"
            ],
            notes: "Microcontrollers bridge the gap between software code and physical sensors. Programming microcontrollers is central to consumer products, smart robotics, and hardware controllers."
        }
    },
 
    // Semester 5
    {
        id: "dsp",
        semester: 5,
        isSim: true,
        route: "#/concept/dsp",
        icon: "waves",
        category: "Signal Processing",
        title: "Digital Signal Processing (DSP)",
        desc: "Process digitized signals using Discrete Fourier Transforms (DFT), Z-Transforms, Convolution matrices, and design FIR/IIR filtering channels.",
        statusId: "dsp",
        details: {
            syllabus: ["Discrete-Time Signals & Systems linear convolution", "Z-Transform and region of convergence (ROC)", "Discrete Fourier Transform (DFT) & Fast Fourier Transform (FFT) Decimation", "Infinite Impulse Response (IIR) filter design (Butterworth & Chebyshev)", "Finite Impulse Response (FIR) filter design using windows"],
            formulas: [
                "Linear Convolution: $y[n] = \\sum_{k=-\\infty}^{\\infty} x[k] \\cdot h[n-k]$",
                "Z-Transform: $X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] \\cdot z^{-n}$",
                "DFT Equation: $X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j \\frac{2\\pi}{N} k n}$"
            ],
            notes: "DSP allows us to filter static, compress speech files, analyze biomedical ECG readings, and isolate radio frequencies purely mathematically using micro-chips."
        }
    },
    {
        id: "comms",
        semester: 5,
        isSim: true,
        route: "#/concept/comms",
        icon: "radio",
        category: "Telecommunications",
        title: "Analog & Digital Communication",
        desc: "Learn modulation math: Amplitude & Frequency Modulation, sampling rate calculations, Nyquist bounds, and QPSK digital maps.",
        statusId: "comms",
        details: {
            syllabus: ["Amplitude Modulation (AM, DSB-SC, SSB) & Frequency Modulation (FM)", "Sampling theorem, Nyquist rate, and Quantization noise in PCM", "Digital carrier modulation (ASK, FSK, PSK, QAM)", "Information Theory: Entropy and Shannon Channel Capacity limit", "Error control codes (Hamming codes, Cyclic codes)"],
            formulas: [
                "Nyquist Sampling Rate: $f_s \\ge 2 \\cdot f_{max}$",
                "Shannon Capacity Limit: $C = B \\cdot \\log_2(1 + \\text{SNR})$ (bits/sec)",
                "FM Bandwidth (Carson's Rule): $B_W = 2(\\Delta f + f_m)$",
                "AM Modulation Index: $m = \\frac{A_m}{A_c}$"
            ],
            notes: "Communications engineering dictates how data is compressed, modulated, and pushed through noisy air channels to enable wireless 4G/5G mobile phone networks."
        }
    },
 
    // Semester 6
    {
        id: "vlsi",
        semester: 6,
        isSim: true,
        route: "#/concept/vlsi",
        icon: "layout",
        category: "Micro-electronics",
        title: "VLSI Design & CMOS Architectures",
        desc: "Synthesize microscopic transistor layouts: CMOS logic, propagation delay calculations, and silicon chip floorplanning layout rules.",
        statusId: "vlsi",
        details: {
            syllabus: ["MOS Transistor theory (long & short channel behaviors)", "CMOS Inverter DC transfer characteristics & noise margins", "Combinational & sequential CMOS logic circuit layout design", "Verilog/VHDL Hardware Description Language modeling", "ASIC & FPGA silicon design flows, floorplanning, and routing rules"],
            formulas: [
                "CMOS Inverter Threshold: $V_{th} \\approx \\frac{V_{DD}}{2}$ (when $(W/L)_p \\approx 2.5(W/L)_n$)",
                "Elmore Delay: $\\tau_D = \\sum R_i \\cdot C_i$",
                "MOS Drain Current (Saturation): $I_D = \\frac{\\mu_n C_{ox}}{2} \\cdot \\frac{W}{L} \\cdot (V_{GS} - V_t)^2$"
            ],
            notes: "Very Large Scale Integration (VLSI) enables engineers to place billions of microscopic silicon transistors onto a single fingernail-sized microprocessor chip."
        }
    },
    {
        id: "embedded",
        semester: 6,
        isSim: true,
        route: "#/concept/embedded",
        icon: "rss",
        category: "Systems Integration",
        title: "Embedded Systems & IoT Networks",
        desc: "Deploy edge controllers, program real-time operating systems (RTOS), and configure smart sensor node networks.",
        statusId: "embedded",
        details: {
            syllabus: ["Real-Time Operating System (RTOS) task scheduling, semaphores, and queues", "IoT architecture layers: Sensors, Gateways, Cloud storage", "Wireless node network protocols: ZigBee, LoRaWAN, BLE, Wi-Fi", "Low-power micro-controllers, sleep modes, and energy harvesting", "Edge computing data collection and cyber-physical security"],
            formulas: [
                "Sensor Quantization Resolution: $V_{LSB} = \\frac{V_{Ref}}{2^{\\text{Bits}}}$",
                "Free Space Path Loss: $\\text{FSPL (dB)} = 20 \\cdot \\log_{10}(d) + 20 \\cdot \\log_{10}(f) + 32.44$"
            ],
            notes: "Embedded IoT links physical infrastructure to cloud databases, enabling smart power grids, connected medical sensors, and automated factories."
        }
    },
 
    // Semester 7
    {
        id: "optical",
        semester: 7,
        isSim: true,
        route: "#/concept/optical",
        icon: "globe",
        category: "High-Frequency Comms",
        title: "Optical & Microwave Engineering",
        desc: "Master high-frequency wave structures: wave-guides, fiber optic attenuation, lasers, and antenna array propagation math.",
        statusId: "optical",
        details: {
            syllabus: ["Fiber Optic Waveguides: Total Internal Reflection and numerical aperture", "Signal degradation: Attenuation losses, Chromatic dispersion", "Microwave passive components: E/H-plane Tees, Directional couplers", "Radar range equations and Doppler frequency shifts", "Antenna parameters: Gain, directivity, radiation patterns, and array arrays"],
            formulas: [
                "Numerical Aperture: $\\text{NA} = \\sqrt{n_1^2 - n_2^2}$",
                "Microwave Waveguide Cutoff: $f_c = \\frac{c}{2a}$ ($\\text{TE}_{10}$ mode)",
                "Radar Range Equation: $R_{max} = \\left[ \\frac{P_t G^2 \\lambda^2 \\sigma}{(4\\pi)^3 S_{min}} \\right]^{1/4}$",
                "Fiber Attenuation (dB): $\\alpha = \\frac{10}{L} \\cdot \\log_{10}\\left(\\frac{P_{in}}{P_{out}}\\right)$"
            ],
            notes: "Microwave and Optical systems handle the global backbone of high-bandwidth internet trunk lines, satellite transponders, and local radar networks."
        }
    }
];

// Dynamic badges showing if quiz completed
const getStatusHTML = (id) => {
    if (!id) return '';
    const AppState = window.AppState;
    const score = AppState ? AppState.completedQuizzes[id] : undefined;
    if (score !== undefined) {
        return `
            <div class="concept-card-status">
                <span class="status-indicator completed"></span>
                <span>Completed (${score}%)</span>
            </div>
        `;
    }
    return `
        <div class="concept-card-status">
            <span class="status-indicator"></span>
            <span>Unexplored</span>
        </div>
    `;
};

export const render = async () => {
    return `
        <div class="concepts-directory-container fade-in">
            <!-- Semester Selector Section Header -->
            <section class="section-title" style="margin-top: 20px; margin-bottom: 24px;">
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.9rem; font-weight: 800;">
                    B.Tech ECE Academic Roadmap
                </span>
                <h2>Syllabus & Visual Laboratories</h2>
                <p>Filter core electronics chapters by your academic semester. Launch visual simulation laboratories or open curated study guides containing essential formulas.</p>
            </section>

            <!-- Interactive Semester Tab Bar -->
            <div class="explanation-tabs" style="margin-bottom: 32px; justify-content: center; width: 100%; display: flex; flex-wrap: wrap; gap: 8px;">
                <button class="tab-btn active" data-semester-tab="all">All Semesters</button>
                <button class="tab-btn" data-semester-tab="1">Sem 1</button>
                <button class="tab-btn" data-semester-tab="2">Sem 2</button>
                <button class="tab-btn" data-semester-tab="3">Sem 3</button>
                <button class="tab-btn" data-semester-tab="4">Sem 4</button>
                <button class="tab-btn" data-semester-tab="5">Sem 5</button>
                <button class="tab-btn" data-semester-tab="6">Sem 6</button>
                <button class="tab-btn" data-semester-tab="7">Sem 7</button>
            </div>
            
            <!-- Cards Directory -->
            <div class="concepts-grid" id="curriculum-grid-mount">
                <!-- Injected dynamically in mount() -->
            </div>
            
            <!-- Frosted Glass Modal Overlay for Theoretical Topics -->
            <div id="theory-modal" class="flex-center" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); z-index: 1000; padding: 20px; backdrop-filter: blur(8px);">
                <div class="glass-card fade-in" style="width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; border-color: var(--border-glow); padding: 32px; position: relative;">
                    <button id="btn-close-modal" style="position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: 1px solid var(--border-color); font-weight: bold; cursor: pointer;">✕</button>
                    
                    <span class="concept-card-category" id="modal-category" style="color: var(--accent-secondary);">CATEGORY</span>
                    <h2 id="modal-title" style="margin-top: 8px; margin-bottom: 16px;">Core Subject Title</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 20px; text-align: left;">
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 8px; font-weight: 700;">Syllabus Benchmarks</h4>
                            <ul id="modal-syllabus-list" style="list-style-type: square; padding-left: 20px; font-size: 0.95rem; color: var(--text-secondary);">
                                <!-- Items -->
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--warning); margin-bottom: 8px; font-weight: 700;">Essential Mathematics & Equations</h4>
                            <div id="modal-formulas-box" style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-color); padding: 16px; border-radius: 6px; font-family: 'Space Grotesk', monospace; font-size: 0.9rem; color: #fff; line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
                                <!-- Formulas -->
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--accent-purple); margin-bottom: 8px; font-weight: 700;">Academic Review Notes</h4>
                            <p id="modal-notes" style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 0;"></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Sandbox CTA -->
            <section class="glass-card onboard-banner" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.05)); margin-top: 40px;">
                <div class="onboard-text">
                    <h3>Looking for an open-ended lab workspace?</h3>
                    <p>Open the Circuit Sandbox to design, layout, and wire electrical networks using sources, resistors, switches, diodes, and glowing components.</p>
                </div>
                <a href="#/sandbox" class="btn btn-primary" style="background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary));">
                    <i data-lucide="flask-conical"></i> Open Circuit Sandbox
                </a>
            </section>
        </div>
    `;
};

let activeTabHandler = null;
let cardClickHandler = null;

export const mount = () => {
    let activeFilter = 'all';

    const gridMount = document.getElementById('curriculum-grid-mount');
    const modal = document.getElementById('theory-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    // Dynamically draw cards
    async function renderGrid() {
        if (!gridMount) return;

        const curriculumData = await getCurriculumData();

        const filtered = activeFilter === 'all' 
            ? curriculumData 
            : curriculumData.filter(item => item.semester === parseInt(activeFilter));

        let html = '';

        filtered.forEach(item => {
            const locked = isSubjectLocked(item.id);
            let statusHTML = '';
            let actionButtonHTML = '';
            
            if (locked) {
                statusHTML = `
                    <div class="concept-card-status" style="color: var(--error); font-size: 0.8rem; font-weight: bold;">
                        <i data-lucide="lock" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i> Locked (Syllabus Gate)
                    </div>
                `;
                actionButtonHTML = `<div class="btn btn-secondary disabled" style="padding: 6px 14px; font-size: 0.8rem; margin-top: auto; border-radius: var(--border-radius-sm); opacity: 0.5; cursor: not-allowed; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="lock" style="width: 13px; height: 13px;"></i> Locked</div>`;
            } else {
                statusHTML = item.isSim ? getStatusHTML(item.statusId) : '';
                
                if (item.isSim && item.details) {
                    actionButtonHTML = `
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary btn-study-guide" data-topic-id="${item.id}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); cursor: pointer;"><i data-lucide="book-open" style="width: 12px; height: 12px;"></i> Guide</button>
                            <button class="btn btn-primary btn-launch-lab" data-topic-id="${item.id}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: var(--border-radius-sm); background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary)); border: none; cursor: pointer; color: white;"><i data-lucide="flask-conical" style="width: 12px; height: 12px;"></i> Lab</button>
                        </div>
                    `;
                } else if (item.isSim) {
                    actionButtonHTML = `<div class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem; margin-top: auto; border-radius: var(--border-radius-sm);"><i data-lucide="flask-conical" style="width: 13px; height: 13px;"></i> Launch Lab</div>`;
                } else {
                    actionButtonHTML = `<div class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; margin-top: auto; border-radius: var(--border-radius-sm);"><i data-lucide="book-open" style="width: 13px; height: 13px;"></i> Study Guide</div>`;
                }
            }
            
            const badgeSemesterText = `Semester ${item.semester}`;
            const cardOpacity = locked ? 'opacity: 0.65; filter: grayscale(30%); border-color: rgba(239, 68, 68, 0.15);' : '';

            html += `
                <div class="glass-card concept-card fade-in" data-topic-id="${item.id}" style="padding: 24px; min-height: 270px; display: flex; flex-direction: column; ${cardOpacity}">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <span class="concept-card-category" style="${locked ? 'color: var(--text-muted);' : ''}">${item.category}</span>
                        <span style="font-size: 0.75rem; background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); padding: 2px 8px; border-radius: 12px; font-weight: 700; border: 1px solid rgba(99,102,241,0.2);">${badgeSemesterText}</span>
                    </div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 8px; ${locked ? 'color: var(--text-secondary);' : ''}">${item.title}</h3>
                    <p style="font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px; flex-grow: 1; ${locked ? 'color: var(--text-muted);' : ''}">${item.desc}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 14px; margin-top: auto;">
                        ${statusHTML || `<span style="font-size: 0.8rem; color: var(--text-muted);">Self Study</span>`}
                        ${actionButtonHTML}
                    </div>
                </div>
            `;
        });

        gridMount.innerHTML = html;
        if (window.lucide) window.lucide.createIcons();

        // Attach clicks
        const cards = gridMount.querySelectorAll('.concept-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const topicId = e.currentTarget.getAttribute('data-topic-id');
                
                // Intercept clicks on locked subjects
                if (isSubjectLocked(topicId)) {
                    e.preventDefault();
                    e.stopPropagation();
                    const AppState = window.AppState;
                    if (AppState) {
                        AppState.showToast("Access Denied: Complete the previous concept's quiz with 80% or higher to unlock!", "error");
                    }
                    return;
                }

                const guideBtn = e.target.closest('.btn-study-guide');
                const labBtn = e.target.closest('.btn-launch-lab');

                if (guideBtn) {
                    e.stopPropagation();
                    openTheoryModal(topicId);
                } else if (labBtn) {
                    e.stopPropagation();
                    const item = curriculumData.find(i => i.id === topicId);
                    window.location.hash = item.route;
                } else {
                    handleCardClick(topicId);
                }
            });
        });
    }

    // Handles clicking on a topic card
    async function handleCardClick(topicId) {
        const curriculumData = await getCurriculumData();
        const item = curriculumData.find(i => i.id === topicId);
        if (!item) return;

        if (item.isSim) {
            // Re-route directly
            window.location.hash = item.route;
        } else {
            openTheoryModal(topicId);
        }
    }

    // Open theoretical study modal drawer
    async function openTheoryModal(topicId) {
        const curriculumData = await getCurriculumData();
        const item = curriculumData.find(i => i.id === topicId);
        if (!item || !item.details) return;

        const mCat = document.getElementById('modal-category');
        const mTitle = document.getElementById('modal-title');
        const mSyllabus = document.getElementById('modal-syllabus-list');
        const mFormulas = document.getElementById('modal-formulas-box');
        const mNotes = document.getElementById('modal-notes');

        mCat.textContent = item.category.toUpperCase();
        mTitle.textContent = item.title;
        
        // Populate Syllabus
        mSyllabus.innerHTML = item.details.syllabus.map(s => `<li>${s}</li>`).join('');
        
        // Populate Formulas
        mFormulas.innerHTML = item.details.formulas.map(f => `<div style="padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.05);">${f}</div>`).join('');
        
        // Populate Notes
        mNotes.innerHTML = item.details.notes;

        // Fade in modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // block page scrolling

        // Dynamically trigger KaTeX rendering for math equations inside the modal
        if (window.renderMathInElement) {
            window.renderMathInElement(modal, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }

    // Close Modal triggers
    btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Tab Switch triggers
    const tabButtons = document.querySelectorAll('[data-semester-tab]');
    activeTabHandler = (e) => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeFilter = e.currentTarget.getAttribute('data-semester-tab');
        renderGrid();
    };
    tabButtons.forEach(btn => btn.addEventListener('click', activeTabHandler));

    // Initial render
    renderGrid();
};

export const unmount = () => {
    const tabButtons = document.querySelectorAll('[data-semester-tab]');
    if (activeTabHandler) {
        tabButtons.forEach(btn => btn.removeEventListener('click', activeTabHandler));
    }
    
    // Clear page scroll lock on exit
    document.body.style.overflow = '';
};
