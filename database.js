/**
 * Nextron - Central Educational Database
 * Glossaries, Explanations, and Gamified Quiz Banks (Easy, Medium, Hard)
 */

export const GLOSSARY = {
    "pn-junction": {
        title: "PN Junction Diode",
        tag: "Semiconductor",
        desc: "The fundamental building block of solid-state electronics, formed by fusing P-type (positive hole carriers) and N-type (negative electron carriers) semiconductors.",
        terms: {
            "diffusion": "The flow of charge carriers due to a concentration gradient, moving from a region of higher concentration to a region of lower concentration.",
            "drift": "The motion of charge carriers caused by an electric field across the junction.",
            "depletion-region": "An insulating region at the junction depleted of mobile charge carriers, leaving behind fixed ion cores that set up a barrier potential (typically 0.7V for Silicon).",
            "forward-bias": "Applying positive voltage to the P-side and negative to the N-side, which shrinks the depletion region and allows exponential current to flow.",
            "reverse-bias": "Applying negative voltage to the P-side and positive to the N-side, which widens the depletion region, blocking major current flow (except a tiny leakage current)."
        }
    },
    "transistor": {
        title: "BJT Transistor (NPN)",
        tag: "Active Devices",
        desc: "A three-terminal active semiconductor device used to amplify electrical signals or act as a high-speed digital switch.",
        terms: {
            "emitter": "Highly doped layer that injects major charge carriers (electrons in NPN) into the base.",
            "base": "The extremely thin, lightly doped middle layer that controls the collector current flow. A small base current (IB) controls a much larger collector current (IC).",
            "collector": "Moderately doped layer designed to collect the injected carriers sweeping across the base.",
            "cutoff-mode": "Both BE and BC junctions are reverse-biased. The transistor acts as an open circuit (switch off).",
            "active-mode": "BE junction is forward-biased, BC junction is reverse-biased. The transistor operates in its linear amplification region, where IC = Beta * IB.",
            "saturation-mode": "Both BE and BC junctions are forward-biased. The transistor is fully turned on, acting as a closed switch."
        }
    },
    "logic-gates": {
        title: "Digital Logic Gates",
        tag: "Digital Core",
        desc: "The fundamental physical systems performing Boolean operations on binary inputs (0 and 1) to make computational decisions.",
        terms: {
            "boolean-logic": "A mathematical system where variables take on values of 0 (False) or 1 (True).",
            "truth-table": "A table showing all possible combinations of input signals and their corresponding output states.",
            "propagation-delay": "The time delay taken for the output of a gate to react to changes in its input signals.",
            "universal-gates": "NAND and NOR gates, because any Boolean function can be implemented using *only* NAND or *only* NOR gates."
        }
    },
    "flip-flops": {
        title: "Sequential Flip-Flops",
        tag: "Digital Memory",
        desc: "Bistable multivibrators capable of storing one bit of digital memory. Unlike logic gates, flip-flop outputs depend on *both* current inputs and past states.",
        terms: {
            "latch": "A level-triggered sequential element that changes state based on active input levels.",
            "flip-flop": "An edge-triggered storage cell that changes state only on the rising or falling transition of a CLOCK pulse.",
            "metastability": "An unstable state where the flip-flop output is trapped between 0 and 1, usually caused by violating setup/hold timing constraints.",
            "race-around-condition": "An undesirable behavior in a level-triggered JK flip-flop when J=1, K=1, and clock duration is longer than gate delays, causing the outputs to continuously toggle."
        }
    },
    "signals": {
        title: "AC Signals & Waveforms",
        tag: "Signal Processing",
        desc: "Time-varying electrical values carrying data and power across channels. Visualized and measured using virtual laboratory oscilloscopes.",
        terms: {
            "frequency": "The number of completed cycles per second, measured in Hertz (Hz).",
            "amplitude": "The peak strength or maximum value of the signal from the center ground voltage.",
            "phase": "The horizontal shift of a waveform relative to a fixed reference point, measured in degrees.",
            "fft": "Fast Fourier Transform—an algorithm that converts a time-domain wave into its frequency-domain components."
        }
    },
    "networks": {
        title: "Network Theory",
        tag: "Circuit Analysis",
        desc: "Study of electrical networks containing resistance, capacitance, inductance, and sources to simplify complex grids into solvable equivalent equations.",
        terms: {
            "thevenin-theorem": "States that any linear electrical network with voltage and resistance sources can be replaced by an equivalent single voltage source Vth in series with an equivalent resistor Rth.",
            "norton-theorem": "States that any active network can be simplified to an equivalent single current source In in parallel with a single resistor Rn.",
            "kvl": "Kirchhoff's Voltage Law: The directed sum of electrical potential differences (voltages) around any closed loop is zero.",
            "kcl": "Kirchhoff's Current Law: The total current entering a junction or node is exactly equal to the total current leaving that node.",
            "max-power-transfer": "States that maximum power is transferred from a source to a load when the load resistance equals the internal resistance of the source (RL = Rth)."
        }
    },
    "microcontrollers": {
        title: "Microprocessors & Microcontrollers",
        tag: "Processor Architecture",
        desc: "The study of computer hardware components executing programmatic assembly commands at the silicon core level.",
        terms: {
            "accumulator": "A primary CPU register that stores the intermediate arithmetic and logic results of calculations.",
            "program-counter": "A CPU register containing the memory address of the next machine instruction to be fetched and executed.",
            "data-bus": "A set of physical connections carrying data bytes between the CPU registers, memory units, and peripheral ports.",
            "address-bus": "A set of physical lines carrying binary memory addresses designated by the CPU to select target registers or RAM cells.",
            "alu": "Arithmetic Logic Unit—the digital subsystem within a CPU executing basic mathematical operations like ADD, SUB, and binary bitwise shifts."
        }
    },
    "dsp": {
        title: "Digital Signal Processing",
        tag: "Signal Processing",
        desc: "The algorithmic manipulation of digitized audio, visual, or sensor signals to extract, filter, or compress frequency characteristics.",
        terms: {
            "z-transform": "A mathematical operation mapping discrete-time sequences into the complex Z-plane, analogous to the Laplace transform for continuous signals.",
            "pole-zero-plot": "A graphical representation of the roots of the transfer function's numerator (zeros) and denominator (poles) on a unit circle diagram.",
            "fir-filter": "Finite Impulse Response filter—a digital filter whose impulse response settles to zero in finite time, offering stable phase guarantees.",
            "iir-filter": "Infinite Impulse Response filter—a recursive digital filter that feeds back outputs, yielding sharp transitions with lower computation costs.",
            "convolution": "A mathematical integration combining two signals to determine the output shape of a linear system under any input wave."
        }
    },
    "comms": {
        title: "Analog & Digital Communication",
        tag: "Telecommunications",
        desc: "The transmission of digitized or analog data across medium channels using electrical carrier frequency manipulations.",
        terms: {
            "modulation": "The process of varying one or more properties of a high-frequency carrier signal (amplitude, frequency, phase) with a data signal.",
            "constellation-diagram": "A graphical representation of a digital modulation scheme in the complex 2D plane, displaying amplitude and phase coordinates.",
            "qam": "Quadrature Amplitude Modulation—a scheme combining both amplitude and phase changes to transmit multiple bits per symbol.",
            "snr": "Signal-to-Noise Ratio—a measure comparing the level of a desired signal to the level of background channel interference noise.",
            "nyquist-rate": "The minimum sampling rate required to avoid distortion (aliasing), equal to twice the maximum frequency in the signal."
        }
    },
    "vlsi": {
        title: "VLSI Design",
        tag: "Micro-electronics",
        desc: "Very Large Scale Integration—the engineering science of packing millions of active silicon CMOS logic switches onto a single microprocessor chip.",
        terms: {
            "cmos": "Complementary Metal-Oxide-Semiconductor—a technology using symmetrical pairs of P-type and N-type MOSFET transistors for high-efficiency digital logic gates.",
            "vtc": "Voltage Transfer Characteristics—a curve graphing the output voltage against input voltage, showcasing noise margins and thresholds.",
            "noise-margin": "The limit of signal degradation that a circuit can tolerate before producing incorrect binary output values.",
            "channel-width": "The physical dimension (W) of a transistor gate determining its current drive capabilities and switching speeds.",
            "propagation-delay": "The transit time required for a voltage transition at the input to propagate and emerge at the output."
        }
    },
    "embedded": {
        title: "Embedded Systems & IoT",
        tag: "Systems Integration",
        desc: "The engineering field of connecting low-power smart microcontroller boards and edge sensors to regional internet databases.",
        terms: {
            "rtos": "Real-Time Operating System—an operating system designed to run multitasking programs under precise, strict timing constraints.",
            "path-loss": "The reduction in power density (attenuation) of an electromagnetic wave as it propagates through space from transmitter to receiver.",
            "gateway": "A physical router node that bridges local sensor transceivers (LoRa, Zigbee) to high-speed cloud databases.",
            "rssi": "Received Signal Strength Indicator—a measurement of the power level present in a received radio signal, expressed in decibels (dBm).",
            "edge-computing": "Processing sensor telemetry locally on the edge controller before sending curated results to the remote server, saving bandwidth."
        }
    },
    "optical": {
        title: "Optical & Microwave Engineering",
        tag: "High-Frequency Comms",
        desc: "The design of electromagnetic transmission structures operating at gigahertz and optical wavelengths.",
        terms: {
            "total-internal-reflection": "The physical phenomenon where light waves are entirely reflected inside a boundary when the incidence angle exceeds the critical angle.",
            "numerical-aperture": "A dimensionless number characterizing the range of angles over which an optical system can accept or emit light.",
            "waveguide": "A metallic hollow tube or dielectric fiber directing high-frequency waves along physical structures with low energy losses.",
            "doppler-shift": "The change in frequency of a wave in relation to an observer who is moving relative to the wave source.",
            "radar-cross-section": "A measure of how detectable an object is by radar, reflecting incoming electromagnetic energy back to the receiver antenna."
        }
    }
};

export const QUIZ_BANK = {
    "pn-junction": {
        title: "PN Junction Diode Quiz",
        questions: [
            // Easy
            {
                question: "What is the typical barrier potential of a Silicon diode at room temperature (25°C)?",
                options: ["0.3 Volts", "1.1 Volts", "0.7 Volts", "5.0 Volts"],
                correctIndex: 2,
                explanation: "Silicon diodes have a typical barrier potential of 0.7V. Germanium diodes require about 0.3V.",
                difficulty: "easy"
            },
            {
                question: "What happens to the width of the depletion region under reverse bias?",
                options: ["It shrinks to zero", "It widens", "It remains the same", "It disappears"],
                correctIndex: 1,
                explanation: "Under reverse bias, charge carriers are pulled away from the junction, widening the depletion region.",
                difficulty: "easy"
            },
            {
                question: "In a PN junction, what are the majority charge carriers inside P-type silicon?",
                options: ["Electrons", "Holes", "Protons", "Neutrons"],
                correctIndex: 1,
                explanation: "P-type silicon is doped with trivalent impurities, resulting in holes as majority carriers.",
                difficulty: "easy"
            },
            {
                question: "In a PN junction, what are the majority charge carriers inside N-type silicon?",
                options: ["Electrons", "Holes", "Neutrons", "Ions"],
                correctIndex: 0,
                explanation: "N-type silicon is doped with pentavalent impurities, yielding excess free electrons.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "Which mechanism causes majority current flow under Forward Bias?",
                options: ["Thermal breakdown", "Hole-electron diffusion overcoming the barrier", "Avalanche ionization", "Minority carrier drift"],
                correctIndex: 1,
                explanation: "Under forward bias, the barrier is shrunken, allowing majority holes and electrons to cross via diffusion.",
                difficulty: "medium"
            },
            {
                question: "What is the primary cause of a tiny leakage current under reverse bias?",
                options: ["Superconductivity", "Thermal generation of minority charge carriers", "Poor wire contacts", "Gold doping particles"],
                correctIndex: 1,
                explanation: "Reverse saturation current is caused by thermally generated minority carriers swept across the junction.",
                difficulty: "medium"
            },
            {
                question: "What type of impurity is added to pure Silicon to create P-type semiconductor material?",
                options: ["Pentavalent (e.g. Phosphorus)", "Trivalent (e.g. Boron)", "Tetravalent (e.g. Carbon)", "Hexavalent"],
                correctIndex: 1,
                explanation: "Trivalent elements like Boron, Indium or Gallium accept electrons, creating holes (P-type).",
                difficulty: "medium"
            },
            // Hard
            {
                question: "Which diode mathematical equation governs the exponential I-V characteristics?",
                options: ["Ohm's Law: I = V/R", "Shockley Diode Equation: I = Is * (e^(qV/nKT) - 1)", "Kirchhoff's Loop Current Equation", "Maxwell's wave equations"],
                correctIndex: 1,
                explanation: "The Shockley diode equation defines the exponential increase in current under forward bias.",
                difficulty: "hard"
            },
            {
                question: "What is the Zener Breakdown mechanism in highly doped PN junctions under reverse bias?",
                options: ["Thermally generated carrier multiplication", "Direct quantum tunneling of electrons across the narrow depletion region", "Physical melting of silicon contacts", "Depletion width expanding to infinity"],
                correctIndex: 1,
                explanation: "Zener breakdown occurs in highly doped narrow junctions, where the high electric field enables direct quantum tunneling.",
                difficulty: "hard"
            },
            {
                question: "How does the barrier potential of a silicon diode change with temperature?",
                options: ["Increases by 2mV/°C", "Decreases by approximately 2mV/°C", "Remains constant", "Doubles every 10°C"],
                correctIndex: 1,
                explanation: "The junction barrier potential decreases by approximately -2.0 mV/°C due to thermally increased carrier energy.",
                difficulty: "hard"
            }
        ]
    },
    "transistor": {
        title: "BJT Transistor Quiz",
        questions: [
            // Easy
            {
                question: "What are the three terminals of a Bipolar Junction Transistor (BJT)?",
                options: ["Anode, Cathode, Gate", "Source, Drain, Gate", "Emitter, Base, Collector", "Positive, Negative, Neutral"],
                correctIndex: 2,
                explanation: "BJTs have Emitter, Base, and Collector terminals.",
                difficulty: "easy"
            },
            {
                question: "For a BJT to operate as a closed switch (fully turned ON), in which mode must it be biased?",
                options: ["Cutoff Mode", "Active Mode", "Saturation Mode", "Reverse Active Mode"],
                correctIndex: 2,
                explanation: "In Saturation mode, both junctions are forward-biased, acting as a closed switch with minimum resistance.",
                difficulty: "easy"
            },
            {
                question: "For a BJT to act as an open switch (fully turned OFF), in which mode must it be biased?",
                options: ["Active Mode", "Saturation Mode", "Cutoff Mode", "Amplification Mode"],
                correctIndex: 2,
                explanation: "In Cutoff mode, both junctions are reverse-biased, blocking current flow.",
                difficulty: "easy"
            },
            {
                question: "What parameter Beta (β) represents in a BJT configuration?",
                options: ["Voltage attenuation", "Common-emitter current gain (IC / IB)", "Reverse leakage current", "Doping ratio"],
                correctIndex: 1,
                explanation: "Beta (hFE) is the ratio of collector current to controlling base current: IC = β * IB.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "For an NPN transistor to operate in its 'Active Mode' (linear amplification), how must its junctions be biased?",
                options: ["BE Forward, BC Reverse", "BE Reverse, BC Forward", "Both Forward-Biased", "Both Reverse-Biased"],
                correctIndex: 0,
                explanation: "Active Mode requires the Base-Emitter junction forward-biased and the Base-Collector junction reverse-biased.",
                difficulty: "medium"
            },
            {
                question: "Why is the Base layer in a BJT designed to be extremely thin and lightly doped?",
                options: ["To increase heat capacity", "To minimize electron-hole recombination in the base", "To block all electrons", "To lower silicon cost"],
                correctIndex: 1,
                explanation: "A thin, lightly doped base ensures majority carriers sweep straight from emitter to collector without recombining.",
                difficulty: "medium"
            },
            {
                question: "Which terminal has the highest doping concentration in a BJT?",
                options: ["Base", "Collector", "Emitter", "Substrate"],
                correctIndex: 2,
                explanation: "The Emitter is highly doped to inject massive amounts of charge carriers into the base.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What is the Early Effect (Base-Width Modulation) in BJTs?",
                options: ["Base melting due to high heat", "The decrease in effective base width as collector reverse-bias voltage increases", "Thermal breakdown of base current", "Carrier recombination dropping to zero"],
                correctIndex: 1,
                explanation: "Increasing reverse bias on the collector junction widens its depletion region, narrowing the base channel and increasing collector current.",
                difficulty: "hard"
            },
            {
                question: "What is the relationship between alpha (α) and beta (β) current gains in a BJT?",
                options: ["α = β * (β + 1)", "β = α / (1 - α)", "α = β / (1 - β)", "β = α / (1 + α)"],
                correctIndex: 1,
                explanation: "Beta is given by β = α / (1 - α), showing how a common-base gain near 1 yields a massive common-emitter gain.",
                difficulty: "hard"
            },
            {
                question: "In active mode, how does the collector current (IC) relate mathematically to the emitter current (IE)?",
                options: ["IC = IE", "IC = alpha * IE", "IC = beta * IE", "IC = IE / beta"],
                correctIndex: 1,
                explanation: "The collector current is a fraction alpha of the emitter current: IC = α * IE, where α typically ranges from 0.95 to 0.99.",
                difficulty: "hard"
            }
        ]
    },
    "logic-gates": {
        title: "Digital Logic Gates Quiz",
        questions: [
            // Easy
            {
                question: "Which logic gate outputs a '1' only if both input terminals are at logic '1'?",
                options: ["OR", "AND", "XOR", "NOT"],
                correctIndex: 1,
                explanation: "An AND gate requires all inputs to be true (1) to output true (1).",
                difficulty: "easy"
            },
            {
                question: "Which gate performs a logical inversion (0 to 1, and 1 to 0)?",
                options: ["AND", "OR", "NOT", "NAND"],
                correctIndex: 2,
                explanation: "The NOT gate is a simple inverter.",
                difficulty: "easy"
            },
            {
                question: "What are the universal digital logic gates?",
                options: ["AND & OR", "NAND & NOR", "XOR & XNOR", "AND & NOT"],
                correctIndex: 1,
                explanation: "NAND and NOR gates are universal because any Boolean function can be implemented using *only* NAND or *only* NOR gates.",
                difficulty: "easy"
            },
            {
                question: "What is the output of an OR gate when inputs are A = 0 and B = 1?",
                options: ["0", "1", "High-Impedance", "Undefined"],
                correctIndex: 1,
                explanation: "An OR gate outputs 1 if at least one of its inputs is 1.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "An XOR gate with inputs A and B will output a logic '1' under which condition?",
                options: ["When A = 1 and B = 1", "When A = 0 and B = 0", "Only when A and B have different logic states", "Only when A = 0"],
                correctIndex: 2,
                explanation: "XOR (Exclusive OR) outputs a 1 if and only if the inputs are different (e.g. 0,1 or 1,0).",
                difficulty: "medium"
            },
            {
                question: "If you connect both input terminals of a NAND gate together, what basic gate function does it perform?",
                options: ["An OR gate", "A NOT gate (Inverter)", "An AND gate", "A Buffer"],
                correctIndex: 1,
                explanation: "Tying NAND inputs together performs NOT-AND on identical values: NAND(0,0)=1 and NAND(1,1)=0. This is inverter behavior.",
                difficulty: "medium"
            },
            {
                question: "According to De Morgan's Laws, the complement of the product of variables (A * B)' is equivalent to what?",
                options: ["A' * B'", "A' + B'", "A + B", "(A + B)'"],
                correctIndex: 1,
                explanation: "De Morgan's theorem states: (A · B)' = A' + B' (NAND is equivalent to an OR with inverted inputs).",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What is the propagation delay of a digital logic gate?",
                options: ["The time it takes for inputs to drop to zero", "The time delay taken for the output of a gate to react to changes in its input signals", "The power consumed by the gate during switching", "The voltage drop across internal resistors"],
                correctIndex: 1,
                explanation: "Propagation delay is the transit interval between the input transition reaching 50% and the output transition reaching 50%.",
                difficulty: "hard"
            },
            {
                question: "How many 2-input NAND gates are required to implement a single 2-input XOR gate?",
                options: ["3 NAND gates", "4 NAND gates", "5 NAND gates", "6 NAND gates"],
                correctIndex: 1,
                explanation: "Implementing XOR using only NAND gates requires exactly 4 NAND gates connected in a symmetric feedback structure.",
                difficulty: "hard"
            },
            {
                question: "What does a Boolean expression Y = A'B + AB' represent?",
                options: ["AND gate", "OR gate", "XOR gate", "XNOR gate"],
                correctIndex: 2,
                explanation: "This is the classic sum-of-products Boolean logic definition for an Exclusive OR (XOR) gate.",
                difficulty: "hard"
            }
        ]
    },
    "flip-flops": {
        title: "Sequential Flip-Flops Quiz",
        questions: [
            // Easy
            {
                question: "What is the primary difference between a 'Latch' and a 'Flip-Flop'?",
                options: ["Latches store only 0, while Flip-Flops store only 1", "Latches are level-triggered; Flip-Flops are edge-triggered", "Latches use transistors; Flip-Flops use diodes", "Latches do not need power"],
                correctIndex: 1,
                explanation: "Latches are level-triggered (update continuously with active levels), whereas flip-flops are edge-triggered by clocks.",
                difficulty: "easy"
            },
            {
                question: "How many stable states does a sequential flip-flop contain?",
                options: ["One stable state", "Two stable states (Bistable)", "Four states", "Infinite states"],
                correctIndex: 1,
                explanation: "Flip-flops are bistable multivibrators, holding either a logic 0 or logic 1 state.",
                difficulty: "easy"
            },
            {
                question: "How many bits of digital memory can a single flip-flop store?",
                options: ["1 bit", "8 bits (1 byte)", "16 bits", "Zero bits"],
                correctIndex: 0,
                explanation: "A single flip-flop stores exactly 1 binary bit (0 or 1).",
                difficulty: "easy"
            },
            {
                question: "What is the output state Q in a D Flip-Flop after a clock trigger?",
                options: ["Always Q = 1", "Always Q = 0", "Q equals the input state D", "Q is inverted"],
                correctIndex: 2,
                explanation: "A D (Data) flip-flop captures and copies the D input directly to the output on the active clock edge.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "In a basic SR Latch, what input state is considered 'invalid' or 'forbidden'?",
                options: ["S = 0, R = 0", "S = 1, R = 0", "S = 0, R = 1", "S = 1, R = 1"],
                correctIndex: 3,
                explanation: "Setting S=1, R=1 in a NOR-gate latch forces both outputs to 0 (violating complement rules), causing race conditions upon release.",
                difficulty: "medium"
            },
            {
                question: "How does a JK Flip-Flop solve the forbidden state of the SR Latch?",
                options: ["It burns out", "It toggles the output state (Q = Q-bar)", "It shuts down the clock", "It outputs a sine wave"],
                correctIndex: 1,
                explanation: "When J=1 and K=1, the JK flip-flop toggles its output to the opposite state on each clock pulse.",
                difficulty: "medium"
            },
            {
                question: "What does the T in a 'T Flip-Flop' stand for?",
                options: ["Time", "Toggle", "Threshold", "Transistor"],
                correctIndex: 1,
                explanation: "The T flip-flop acts as a Toggle flip-flop. It toggles its output state whenever the T input is high on a clock trigger.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What is 'Metastability' in sequential flip-flops?",
                options: ["Complete circuit melt-down", "An unstable state where the output is trapped between 0 and 1, caused by violating setup/hold timing", "Oscillating between 0 and 1 at GHz frequencies", "Zero power consumption"],
                correctIndex: 1,
                explanation: "Metastability happens if inputs change too close to clock edges, violating setup or hold times and leaving the latch trapped between logic states.",
                difficulty: "hard"
            },
            {
                question: "What is the 'Race-Around Condition' in level-triggered JK flip-flops?",
                options: ["Heat dissipation issues", "The output continuously toggles during a long clock pulse when J=1, K=1 and propagation delay is too short", "Clock frequency dropping to zero", "Power supply voltage drops"],
                correctIndex: 1,
                explanation: "If the clock pulse duration is longer than the internal gate delays when J=K=1, the outputs toggle repeatedly, leading to unstable final states.",
                difficulty: "hard"
            },
            {
                question: "What represents the 'Setup Time' parameter of a Flip-Flop?",
                options: ["The clock pulse duration", "The minimum duration the data must be stable *before* the active clock edge", "The time it takes to power on the chip", "The propagation delay of the output"],
                correctIndex: 1,
                explanation: "Setup time is the minimum required interval for input data to remain stable before the clock edge arrives to ensure reliable capturing.",
                difficulty: "hard"
            }
        ]
    },
    "signals": {
        title: "AC Signals & Oscilloscope Quiz",
        questions: [
            // Easy
            {
                question: "If a sine wave completes 50 full oscillation cycles in 1 second, what is its frequency?",
                options: ["5 Hertz", "50 Hertz", "500 Hertz", "2 Hertz"],
                correctIndex: 1,
                explanation: "Frequency is defined as cycles per second (Hertz). So, 50 cycles in 1s is 50 Hz.",
                difficulty: "easy"
            },
            {
                question: "What does the vertical axis (Y-axis) represent on a standard Oscilloscope display?",
                options: ["Time", "Phase", "Voltage (Amplitude)", "Frequency"],
                correctIndex: 2,
                explanation: "The vertical axis represents signal voltage amplitude, while the horizontal axis (X-axis) represents time.",
                difficulty: "easy"
            },
            {
                question: "What control on an Oscilloscope adjusts the size of the waveform along the vertical axis?",
                options: ["Time/Div", "Trigger Level", "Volts/Div (Amplitude Gain)", "Horizontal Position"],
                correctIndex: 2,
                explanation: "Volts/Div adjusts the vertical scale amplification, changing how many volts each grid division represents.",
                difficulty: "easy"
            },
            {
                question: "Which wave shape consists of a single pure frequency component without any harmonics?",
                options: ["Square Wave", "Sine Wave", "Triangle Wave", "Sawtooth Wave"],
                correctIndex: 1,
                explanation: "A pure sine wave consists exclusively of its fundamental frequency, with zero harmonic content.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "If a wave has a period (T) of 2 milliseconds, what is its frequency?",
                options: ["50 Hz", "500 Hz", "200 Hz", "1000 Hz"],
                correctIndex: 1,
                explanation: "Frequency and period are related by f = 1/T. So, 1 / 0.002 seconds = 500 Hertz.",
                difficulty: "medium"
            },
            {
                question: "What does the FFT (Fast Fourier Transform) representation of a pure sine wave look like?",
                options: ["A square pulse series", "A single sharp vertical peak at its fundamental frequency", "A wide Gaussian curve", "A flat line"],
                correctIndex: 1,
                explanation: "The FFT converts signals to the frequency domain. A pure sine wave is mapped to a single sharp peak at its frequency.",
                difficulty: "medium"
            },
            {
                question: "What does the Peak-to-Peak voltage (Vpp) of a sine wave represent?",
                options: ["The voltage from ground to peak", "The voltage difference between the positive peak and negative peak", "The average voltage value", "The RMS voltage"],
                correctIndex: 1,
                explanation: "Vpp is the total voltage sweep: Vpp = 2 * Vpeak (for symmetrical waveforms).",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What mathematical harmonic series describes a perfect symmetric Square Wave?",
                options: ["Sum of all even harmonics decaying as 1/n", "Sum of all odd harmonics decaying as 1/n", "Sum of odd harmonics decaying as 1/(n^2)", "Only fundamental and 2nd harmonic"],
                correctIndex: 1,
                explanation: "A square wave is represented by: $$f(t) = \\\\frac{4}{\\\\pi} \\\\sum_{n=1,3,5,\\\\dots}^{\\\\infty} \\\\frac{\\\\sin(2\\\\pi \\\\cdot n \\\\cdot f_0 \\\\cdot t)}{n}$$",
                difficulty: "hard"
            },
            {
                question: "What is the relationship between the peak voltage (Vp) and the Root Mean Square (VRMS) voltage of a pure sine wave?",
                options: ["VRMS = Vp * 2", "VRMS = Vp / sqrt(2)", "VRMS = Vp * sqrt(3)", "VRMS = Vp * 0.5"],
                correctIndex: 1,
                explanation: "For sinusoids, the RMS voltage is given by: $$V_{\\\\text{RMS}} = \\\\frac{V_p}{\\\\sqrt{2}} \\\\approx 0.707 \\\\cdot V_p$$",
                difficulty: "hard"
            },
            {
                question: "What is the purpose of the 'Trigger' control on a laboratory Oscilloscope?",
                options: ["To turn on the device", "To synchronize the horizontal sweep with a specific point on the input signal to stabilize the display", "To increase carrier frequency", "To convert waves to digital bits"],
                correctIndex: 1,
                explanation: "The trigger stabilizes repeating waveforms on screen by starting the horizontal sweep only when the signal crosses a designated voltage threshold.",
                difficulty: "hard"
            }
        ]
    },
    "networks": {
        title: "Network Theory Quiz",
        questions: [
            // Easy
            {
                question: "According to the Maximum Power Transfer Theorem, when is maximum power delivered from a source to a load resistor (RL)?",
                options: ["When RL is zero", "When RL is exactly equal to the Thevenin equivalent resistance (Rth) of the source", "When RL is infinite", "When RL is equal to 0.7 * Vin"],
                correctIndex: 1,
                explanation: "Maximum power is transferred when load resistance matches source internal resistance (RL = Rth).",
                difficulty: "easy"
            },
            {
                question: "What does Kirchhoff's Voltage Law (KVL) assert about any closed loop in an electrical circuit?",
                options: ["The product of currents is zero", "The sum of voltages in any closed loop is zero", "Current entering a node is zero", "Power is constant"],
                correctIndex: 1,
                explanation: "KVL is based on conservation of energy; the directed sum of potential differences around any closed loop must equal zero.",
                difficulty: "easy"
            },
            {
                question: "What does Kirchhoff's Current Law (KCL) assert about any junction node in an electrical circuit?",
                options: ["Voltage sum is zero", "The total current entering a node equals the total current leaving it", "Current is proportional to frequency", "Resistance drops to zero"],
                correctIndex: 1,
                explanation: "KCL is based on conservation of charge; no charge can accumulate at a node, so entering current equals leaving current.",
                difficulty: "easy"
            },
            {
                question: "What is Ohm's Law formula?",
                options: ["P = V * I", "V = I * R", "R = V * I", "I = V^2 / R"],
                correctIndex: 1,
                explanation: "Ohm's Law states that voltage is proportional to current multiplied by resistance ($V = I \\\\cdot R$).",
                difficulty: "easy"
            },
            // Medium
            {
                question: "If a linear circuit has an open-circuit voltage Voc = 12V and short-circuit current Isc = 3A, what is its Thevenin equivalent resistance Rth?",
                options: ["36 Ohms", "4 Ohms", "15 Ohms", "0.25 Ohms"],
                correctIndex: 1,
                explanation: "Thevenin resistance is calculated as: $R_{\\\\text{th}} = \\\\frac{V_{\\\\text{oc}}}{I_{\\\\text{sc}}} = \\\\frac{12\\\\text{V}}{3\\\\text{A}} = 4\\\\text{ }\\\\Omega$.",
                difficulty: "medium"
            },
            {
                question: "What is the equivalent resistance of two 100 Ohm resistors connected in parallel?",
                options: ["200 Ohms", "50 Ohms", "100 Ohms", "25 Ohms"],
                correctIndex: 1,
                explanation: "For parallel resistors, $\\\\frac{1}{R_{\\\\text{eq}}} = \\\\frac{1}{R_1} + \\\\frac{1}{R_2}$. For identical resistors, $R_{\\\\text{eq}} = \\\\frac{R}{2} = 50\\\\text{ }\\\\Omega$.",
                difficulty: "medium"
            },
            {
                question: "According to Norton's Theorem, an active linear circuit is represented by what equivalent system?",
                options: ["A voltage source in series with a resistor", "A current source in parallel with a resistor", "A capacitor in parallel with an inductor", "A single diode and voltage source"],
                correctIndex: 1,
                explanation: "Norton's equivalent circuit consists of a single current source (In) in parallel with an equivalent resistor (Rn).",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What is the maximum power transfer efficiency under matched load conditions (RL = Rth)?",
                options: ["100%", "50%", "75%", "25%"],
                correctIndex: 1,
                explanation: "At maximum power transfer, half the power is dissipated in the source's internal resistance, giving exactly 50% efficiency.",
                difficulty: "hard"
            },
            {
                question: "In transient analysis, what is the time constant (τ) of an RC network?",
                options: ["τ = R / C", "τ = R * C", "τ = C / R", "τ = sqrt(R * C)"],
                correctIndex: 1,
                explanation: "The time constant of a series RC network is the product of resistance and capacitance (τ = R * C), representing the time to charge to ~63.2%.",
                difficulty: "hard"
            },
            {
                question: "What is the resonant frequency (fr) of a series RLC bandpass circuit?",
                options: ["fr = 2π * sqrt(LC)", "fr = 1 / (2π * sqrt(LC))", "fr = L / C", "fr = 1 / (RC)"],
                correctIndex: 1,
                explanation: "Resonance occurs when inductive and capacitive reactances cancel out: fr = 1 / (2π * sqrt(L * C)).",
                difficulty: "hard"
            }
        ]
    },
    "microcontrollers": {
        title: "Microprocessors Quiz",
        questions: [
            // Easy
            {
                question: "Which CPU register holds the memory address of the next instruction to be fetched and executed?",
                options: ["Accumulator (A)", "Instruction Register (IR)", "Program Counter (PC)", "Stack Pointer (SP)"],
                correctIndex: 2,
                explanation: "The Program Counter (PC) stores the memory address of the next sequential command to execute.",
                difficulty: "easy"
            },
            {
                question: "What is the primary role of the Arithmetic Logic Unit (ALU)?",
                options: ["To store code", "To generate clock pulses", "To execute digital additions, subtractions, and binary shifts", "To interface RAM chips"],
                correctIndex: 2,
                explanation: "The ALU is the digital calculator executing math (ADD, SUB) and logic (AND, OR, SHIFT) operations.",
                difficulty: "easy"
            },
            {
                question: "How does a CPU transfer data bytes to external memory RAM cells?",
                options: ["Through the Address Bus", "Through the Data Bus", "Through the Cache", "Through the Clock Line"],
                correctIndex: 1,
                explanation: "The Data Bus is the bidirectional pathway carrying actual data bytes between CPU registers and memory.",
                difficulty: "easy"
            },
            {
                question: "What is the size of the address space that can be directly addressed by an 8-bit address bus?",
                options: ["256 bytes", "64 kilobytes", "1024 bytes", "16 megabytes"],
                correctIndex: 0,
                explanation: "An 8-bit bus can select 2^8 = 256 unique memory address locations.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "Which register is the primary workspace accumulator in 8085-like CPU cores?",
                options: ["Register B", "Accumulator A", "Program Status Word", "Instruction Decoder"],
                correctIndex: 1,
                explanation: "Accumulator A is the central register storing intermediate math and logic outcomes.",
                difficulty: "medium"
            },
            {
                question: "What happens during a CPU 'Instruction Fetch' machine cycle?",
                options: ["Data is written to RAM", "The instruction opcode is fetched from memory at the address stored in the PC", "The ALU is reset", "An interrupt is triggered"],
                correctIndex: 1,
                explanation: "The fetch cycle loads the byte opcode from memory pointed by the PC into the Instruction Register.",
                difficulty: "medium"
            },
            {
                question: "What does the Carry Flag (C) indicate in microprocessors?",
                options: ["An operation resulted in absolute zero", "An addition exceeded the maximum register bit capacity (overflow/carry)", "The clock stopped", "An interrupt was requested"],
                correctIndex: 1,
                explanation: "The carry flag is set to 1 if an arithmetic addition exceeds the register capacity (e.g. >255 in 8-bit).",
                difficulty: "medium"
            },
            // Hard
            {
                question: "How is a segmented Physical Address calculated in the 8086 microprocessor?",
                options: ["Segment Base + Offset", "Segment Base * 10H + Offset", "Segment Base * Offset", "Segment Base / Offset"],
                correctIndex: 1,
                explanation: "8086 combines a 16-bit segment register shifted left by 4 bits (multiplied by 0x10) with a 16-bit offset to get a 20-bit physical address.",
                difficulty: "hard"
            },
            {
                question: "What is the purpose of an Interrupt Service Routine (ISR)?",
                options: ["To shut down the CPU", "A specialized function executed automatically when an external hardware interrupt is triggered", "To divide clock speeds", "To clear the accumulator"],
                correctIndex: 1,
                explanation: "An ISR is a handler function that suspends normal execution to process high-priority asynchronous hardware interrupts.",
                difficulty: "hard"
            },
            {
                question: "What does direct memory access (DMA) achieve in embedded controller architectures?",
                options: ["Speeds up ALU additions", "Allows peripheral devices to transfer data directly to/from memory without CPU intervention", "Reduces clock noise", "Increases transistor count"],
                correctIndex: 1,
                explanation: "DMA bypasses the CPU entirely for block transfers, freeing the processor and achieving massive speed boosts.",
                difficulty: "hard"
            }
        ]
    },
    "dsp": {
        title: "Digital Signal Processing Quiz",
        questions: [
            // Easy
            {
                question: "What makes a digital filter classified as a 'Finite Impulse Response' (FIR) filter?",
                options: ["Infinite feedback loops", "Its impulse response settles to exactly zero in finite time steps", "It lacks delay elements", "It is built with analog op-amps"],
                correctIndex: 1,
                explanation: "FIR filters do not employ feedback loops; their response is finite because it is solely based on feedforward delay sum.",
                difficulty: "easy"
            },
            {
                question: "What makes an 'Infinite Impulse Response' (IIR) filter recursive?",
                options: ["It lacks zeros", "It feeds past output values back into the filter equations (feedback)", "It has no delays", "It operates at 0 Hz"],
                correctIndex: 1,
                explanation: "IIR filters employ feedback loops, feeding back past outputs to achieve sharp responses recursively.",
                difficulty: "easy"
            },
            {
                question: "Where must all poles of a stable discrete transfer function lie in the Z-plane?",
                options: ["Outside the Unit Circle", "Exactly on the Unit Circle", "Inside the Unit Circle (|z| < 1)", "At the origin only"],
                correctIndex: 2,
                explanation: "For stability, all poles must lie strictly *inside* the unit circle (|z| < 1) to prevent exponential output growth.",
                difficulty: "easy"
            },
            {
                question: "In DSP, what represents the roots of the transfer function's numerator?",
                options: ["Poles", "Zeros", "Conjugates", "Nyquist Limits"],
                correctIndex: 1,
                explanation: "Zeros are the roots of the numerator polynomial, where the transfer function magnitude drops to zero.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "What is the consequence of placing a Pole (X) outside the complex Unit Circle (|z| > 1)?",
                options: ["Excellent filter stability", "System becomes unstable, causing exponential output growth", "Flat frequency response", "Zeros are canceled"],
                correctIndex: 1,
                explanation: "Poles outside the unit circle yield growing geometric impulse sequences, creating unstable oscillations.",
                difficulty: "medium"
            },
            {
                question: "Which operation combines two discrete signals to determine the output shape of a linear system?",
                options: ["Fast Fourier Transform", "Convolution", "Modulation Indexing", "Phase Cancellation"],
                correctIndex: 1,
                explanation: "Convolution slides an impulse response over an input signal, representing the classic output of an LTI system.",
                difficulty: "medium"
            },
            {
                question: "What filter is created by placing a Zero directly on the Z-plane Unit Circle (|z| = 1)?",
                options: ["All-pass filter", "Notch filter (magnitude drops to absolute zero at that angle)", "Infinite peak resonator", "Integrator"],
                correctIndex: 1,
                explanation: "A zero on the unit circle creates a notch filter, completely attenuating frequencies at that specific angular frequency.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "How does a Pole (X) close to the unit circle boundary (|z| ≈ 0.98) affect the frequency response magnitude?",
                options: ["It has no effect", "It creates an extremely sharp, narrow resonant bandpass peak at that angle", "It drops the response to zero", "It makes the phase response perfectly linear"],
                correctIndex: 1,
                explanation: "Poles close to the unit circle push the magnitude response up, creating highly selective sharp resonant peaks.",
                difficulty: "hard"
            },
            {
                question: "What mathematical transform converts a discrete-time sequence into the complex Z-plane representation?",
                options: ["Continuous Fourier Transform", "Discrete Z-Transform: X(z) = sum( x[n] * z^-n )", "Laplace Transform", "DFT Matrix Multiply"],
                correctIndex: 1,
                explanation: "The Z-transform is the discrete-time equivalent of the Laplace transform, mapping signals to complex variable z.",
                difficulty: "hard"
            },
            {
                question: "What is the mathematical condition for a digital filter to have a 'Linear Phase' response?",
                options: ["All poles must be at the origin", "Its impulse response must be perfectly symmetrical or anti-symmetrical", "The gain must be constant", "It must be an IIR notch filter"],
                correctIndex: 1,
                explanation: "Symmetrical or anti-symmetrical FIR coefficients guarantee constant group delay, yielding linear phase response.",
                difficulty: "hard"
            }
        ]
    },
    "comms": {
        title: "Communication Systems Quiz",
        questions: [
            // Easy
            {
                question: "What does a Constellation Diagram display?",
                options: ["Transistor layouts", "The amplitude and phase coordinates of a digital modulation scheme in the 2D plane", "Fiber optic paths", "Noise frequency peaks"],
                correctIndex: 1,
                explanation: "Constellation diagrams plot digital symbols on 2D IQ axes to show amplitude and phase configurations.",
                difficulty: "easy"
            },
            {
                question: "According to the Nyquist Theorem, what is the minimum sampling rate to avoid aliasing?",
                options: ["Equal to the average frequency", "At least double the maximum frequency in the signal", "Exactly 1000 Hz", "Ten times the phase"],
                correctIndex: 1,
                explanation: "Sampling rate must be at least twice the highest frequency component (fs >= 2*fmax) to prevent overlap distortion.",
                difficulty: "easy"
            },
            {
                question: "Which digital modulation scheme combines both Amplitude and Phase variations?",
                options: ["Amplitude Shift Keying (ASK)", "Frequency Shift Keying (FSK)", "Quadrature Amplitude Modulation (QAM)", "BPSK"],
                correctIndex: 2,
                explanation: "QAM modulates both carrier amplitude and phase simultaneously, maximizing spectral transmission rates.",
                difficulty: "easy"
            },
            {
                question: "What does SNR stand for in telecommunication systems?",
                options: ["Symbol Noise Ratio", "Signal-to-Noise Ratio", "System Network Router", "Sinusoidal Resonance"],
                correctIndex: 1,
                explanation: "SNR measures the ratio of desired signal power to background noise interference (expressed in decibels).",
                difficulty: "easy"
            },
            // Medium
            {
                question: "What happens in Amplitude Modulation (AM) when the modulation index (m) exceeds 1.0?",
                options: ["The signal travels faster", "Envelope distortion (overmodulation) occurs, preventing simple envelope detection", "No current flows", "The frequency doubles"],
                correctIndex: 1,
                explanation: "If m > 1.0, the envelope crosses the zero axis, leading to phase reversals and distorted envelope demodulation.",
                difficulty: "medium"
            },
            {
                question: "How many distinct symbol coordinates are plotted in a QPSK constellation?",
                options: ["2 points", "4 points", "8 points", "16 points"],
                correctIndex: 1,
                explanation: "QPSK (Quadrature Phase Shift Keying) has exactly 4 constellation points, transmitting 2 bits per symbol.",
                difficulty: "medium"
            },
            {
                question: "What effect does increasing white Gaussian noise have on a constellation diagram?",
                options: ["It increases carrier amplitude", "It scatters the symbol coordinates in circular clouds around their theoretical coordinates", "It shifts points to the origin", "It turns the dots into straight lines"],
                correctIndex: 1,
                explanation: "Channel noise adds random variations to symbol phase and amplitude, scattering points into clouds.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What is Shannon's Channel Capacity theorem formula?",
                options: ["C = B * log2(1 + SNR)", "C = B * (1 + SNR)", "C = log10(B * SNR)", "C = 2 * B"],
                correctIndex: 0,
                explanation: "Shannon's limit: $C = B \\\\cdot \\\\log_2(1 + \\\\text{SNR})$ defines the absolute maximum error-free data rate over a noisy channel.",
                difficulty: "hard"
            },
            {
                question: "What characterizes a Chirp Spread Spectrum (CSS) modulation?",
                options: ["Highly sensitive to noise", "Employs linear frequency-swept pulses (chirps) to spread signal power across wide bandwidths", "Uses single amplitude levels only", "Operates exclusively in fiber optics"],
                correctIndex: 1,
                explanation: "CSS spreads signals using chirps, offering incredible robustness against interference and fading (used in LoRa).",
                difficulty: "hard"
            },
            {
                question: "What represents the 'In-Phase' (I) and 'Quadrature' (Q) components mathematically?",
                options: ["I = cosine wave component, Q = sine wave component", "I = frequency, Q = amplitude", "I = digital bits, Q = analog wave", "I = noise level, Q = signal voltage"],
                correctIndex: 0,
                explanation: "QAM splits carrier waves into orthogonal cosine (In-phase, I) and sine (Quadrature, Q) waves.",
                difficulty: "hard"
            }
        ]
    },
    "vlsi": {
        title: "VLSI Design Quiz",
        questions: [
            // Easy
            {
                question: "What does CMOS stand for in microelectronics?",
                options: ["Central Memory Operating System", "Complementary Metal-Oxide-Semiconductor", "Capacitive Metal-Oxide Silicon", "Channel Modulation Operating System"],
                correctIndex: 1,
                explanation: "CMOS stands for Complementary Metal-Oxide-Semiconductor, combining PMOS and NMOS transistors.",
                difficulty: "easy"
            },
            {
                question: "Why does standard CMOS logic consume almost zero power when in a static, idle state?",
                options: ["It is disconnected", "Either the PMOS pull-up or NMOS pull-down network is always turned OFF, blocking direct current pathways", "It operates at 0 Volts", "It uses batteries only"],
                correctIndex: 1,
                explanation: "Complementary networks ensure one block is always OFF when inputs are stable, preventing direct DC leakage.",
                difficulty: "easy"
            },
            {
                question: "Which transistor type is used as a pull-up network connected to VDD in standard CMOS?",
                options: ["NMOS", "PMOS", "BJT", "Diode"],
                correctIndex: 1,
                explanation: "PMOS transistors conduct logic high (VDD) efficiently, serving as the pull-up network.",
                difficulty: "easy"
            },
            {
                question: "Which transistor type is used as a pull-down network connected to Ground in standard CMOS?",
                options: ["NMOS", "PMOS", "BJT", "Zener"],
                correctIndex: 0,
                explanation: "NMOS transistors conduct logic low (Ground) efficiently, serving as the pull-down network.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "In CMOS Inverter Voltage Transfer Characteristics (VTC) curves, what represents noise immunity limits?",
                options: ["Propagation delay", "Substrate depth", "The high and low Noise Margins (NMH and NML)", "Current saturation limits"],
                correctIndex: 2,
                explanation: "Noise margins define the maximum input noise voltages tolerated before digital logic states corrupt.",
                difficulty: "medium"
            },
            {
                question: "How does increasing the channel width (W) of a MOSFET affect its current capability?",
                options: ["Increases drain current capability and speeds up capacitance charging", "Increases resistance and slows switching", "Reduces current to zero", "Increases threshold voltage"],
                correctIndex: 0,
                explanation: "Increasing transistor width increases conducting cross-section, reducing resistance and boosting current capability.",
                difficulty: "medium"
            },
            {
                question: "Why must the PMOS channel width (Wp) be sized larger (approx 2.5x) than the NMOS width (Wn) for symmetric switching?",
                options: ["Because holes in silicon have lower mobility than electrons", "Because PMOS has higher resistance naturally", "To prevent thermal breakdown", "To save silicon space"],
                correctIndex: 0,
                explanation: "Hole mobility is about 2.5x slower than electron mobility in silicon. Sizing Wp larger balances pull-up and pull-down gains.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What constitutes the 'Noise Margin High' (NMH) mathematically in a CMOS VTC?",
                options: ["NMH = VOH - VIH", "NMH = VIH - VIL", "NMH = VOH - VOL", "NMH = Vth - Vin"],
                correctIndex: 0,
                explanation: "NMH is the difference between output high voltage and the minimum input high voltage: NMH = VOH - VIH.",
                difficulty: "hard"
            },
            {
                question: "What is the primary cause of 'Dynamic Power Dissipation' in CMOS switching gates?",
                options: ["Static reverse-bias junction leakage currents", "Charging and discharging of parasitic load capacitances and short-circuit current during switching transitions", "Resistance heating of the silicon well", "Sub-threshold currents"],
                correctIndex: 1,
                explanation: "Dynamic power is given by P = C * VDD^2 * f, caused by charging/discharging parasitic node capacitances during switching.",
                difficulty: "hard"
            },
            {
                question: "What represents the 'Elmore Delay' in complex RC VLSI interconnect trees?",
                options: ["Doping profile depth", "The sum of resistances multiplied by downstream capacitances at each node", "The light speed limit", "Carrier drift velocities"],
                correctIndex: 1,
                explanation: "Elmore delay calculates propagation delays in RC routing trees by summing node resistances multiplied by their downstream loads.",
                difficulty: "hard"
            }
        ]
    },
    "embedded": {
        title: "Embedded Systems Quiz",
        questions: [
            // Easy
            {
                question: "What is the defining characteristic of a Real-Time Operating System (RTOS)?",
                options: ["Supports web browsers", "Guarantees software tasks complete within deterministic, strict timing constraints", "Requires multi-core GHz chips", "Cloud backups hourly"],
                correctIndex: 1,
                explanation: "RTOS ensures deterministic scheduling. Task executions are guaranteed to meet deadlines.",
                difficulty: "easy"
            },
            {
                question: "What does Free Space Path Loss (FSPL) calculate?",
                options: ["Battery drain", "The signal attenuation of a radio wave due to propagation distance and frequency", "Leakage in copper wires", "Router packet drops"],
                correctIndex: 1,
                explanation: "FSPL calculates electromagnetic wave divergence attenuation across a clear line-of-sight path.",
                difficulty: "easy"
            },
            {
                question: "What does RSSI represent in wireless systems?",
                options: ["Received Signal Strength Indicator (dBm)", "Real-time Status Index", "Resistor Socket Schematic", "Receiver Sync Index"],
                correctIndex: 0,
                explanation: "RSSI measures the power level of a received RF signal, typically in negative decibels (dBm).",
                difficulty: "easy"
            },
            {
                question: "Which wireless protocol is best suited for long-range, low-power smart edge sensors?",
                options: ["High-speed Wi-Fi", "LoRaWAN", "Bluetooth Classic", "Ethernet"],
                correctIndex: 1,
                explanation: "LoRaWAN is designed for low-power, sub-GHz, long-range telemetry links.",
                difficulty: "easy"
            },
            // Medium
            {
                question: "How does doubling the operating frequency (f) affect the Free Space Path Loss (FSPL) in decibels?",
                options: ["Decreases FSPL by 6 dB", "Increases FSPL by 6 dB", "Keeps FSPL constant", "FSPL doubles"],
                correctIndex: 1,
                explanation: "Path loss is proportional to frequency squared. Doubling frequency increases FSPL by 20*log10(2) ≈ 6 dB.",
                difficulty: "medium"
            },
            {
                question: "What is a 'Gateway' node's primary role in IoT sensor networks?",
                options: ["To compute complex FFTs", "To bridge local low-power sensor transceivers (LoRa, Zigbee) to high-speed cloud databases", "To charge edge nodes wirelessly", "To act as a voltage regulator"],
                correctIndex: 1,
                explanation: "Gateways aggregate local sensor node packets and forward them over TCP/IP internet connections to cloud servers.",
                difficulty: "medium"
            },
            {
                question: "What constitutes the 'Link Budget' of a wireless RF design?",
                options: ["The financial cost of transceivers", "The sum of transmitter power, antenna gains, minus path losses and cable losses", "The battery capacity", "The number of sub-channels"],
                correctIndex: 1,
                explanation: "Link budget accounts for all gains and losses from transmitter to receiver: Prx = Ptx + Gtx + Grx - Losses.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "How does Chirp Spread Spectrum (CSS) modulation enable LoRa to decode signals below the noise floor?",
                options: ["By boosting transmitter power to megawatts", "By spreading narrow data over wide frequencies with processing gain, enabling correlators to extract chirps from thermal noise", "By cooling transceivers", "By blocking noise waves"],
                correctIndex: 1,
                explanation: "Chirp spread spectrum uses frequency sweeps. Correlation filters recover chirps mathematically even when buried under noise.",
                difficulty: "hard"
            },
            {
                question: "What is a 'Priority Inversion' issue in real-time RTOS scheduling?",
                options: ["Low battery power", "A high-priority task is blocked waiting for a low-priority task to release a shared resource, which is pre-empted by a medium task", "Clock frequency shifts", "Register overflow"],
                correctIndex: 1,
                explanation: "Priority inversion occurs when medium tasks block low tasks holding semaphores, indirectly blocking high-priority tasks.",
                difficulty: "hard"
            },
            {
                question: "How does the 'Priority Inheritance Protocol' resolve Priority Inversion in an RTOS?",
                options: ["By shutting down medium tasks", "By temporarily boosting the low-priority task's priority to match the high-priority task's level while holding the shared lock", "By ignoring interrupts", "By resetting the CPU"],
                correctIndex: 1,
                explanation: "It elevates the semaphore-holding task's priority so it completes rapidly without medium-priority pre-emption.",
                difficulty: "hard"
            }
        ]
    },
    "optical": {
        title: "Optical & Microwave Quiz",
        questions: [
            // Easy
            {
                question: "Under what conditions does Total Internal Reflection (TIR) occur in optical fibers?",
                options: ["Lower to higher index travel", "Travel from denser core (n1) to less dense cladding (n2) and incidence angle exceeds critical angle (θc)", "Laser is switched off", "Indices are identical"],
                correctIndex: 1,
                explanation: "TIR requires light to travel towards a lower index cladding, hitting the boundary above the critical angle.",
                difficulty: "easy"
            },
            {
                question: "What does the Numerical Aperture (NA) of a fiber optic represent?",
                options: ["Number of channels", "Core diameter", "A measure of the fiber's light-gathering ability, defining its acceptance cone", "Heat dissipation"],
                correctIndex: 2,
                explanation: "NA is a dimensionless parameter defining the range of acceptance angles for light launched into the core.",
                difficulty: "easy"
            },
            {
                question: "What represents the Doppler Shift concept?",
                options: ["Voltage attenuation", "The change in frequency of a wave relative to an observer moving relative to the wave source", "Silicon layout rules", "Refractive indices merging"],
                correctIndex: 1,
                explanation: "The Doppler shift is the change in frequency when a wave source and observer are in relative motion.",
                difficulty: "easy"
            },
            {
                question: "If a vehicle approaches a radar speed trap, what is the frequency shift of the reflected wave?",
                options: ["Frequency decreases", "Frequency increases (positive shift)", "Frequency is zero", "Frequency is unchanged"],
                correctIndex: 1,
                explanation: "Approaching targets compress electromagnetic wavefronts, increasing returned frequency (positive Doppler shift).",
                difficulty: "easy"
            },
            // Medium
            {
                question: "What is the mathematical definition of the Critical Angle (θc) at a core-cladding interface?",
                options: ["θc = sin(n1 / n2)", "θc = arcsin(n2 / n1)", "θc = n1 / n2", "θc = sqrt(n1^2 - n2^2)"],
                correctIndex: 1,
                explanation: "The critical angle is given by Snell's Law: θc = arcsin(n2 / n1), where n1 is core index and n2 is cladding index.",
                difficulty: "medium"
            },
            {
                question: "What is a 'Waveguide' in high-frequency engineering?",
                options: ["A voltage regulator", "A metallic hollow tube or dielectric fiber directing high-frequency waves with low energy losses", "A silicon transistor substrate", "An antenna mast"],
                correctIndex: 1,
                explanation: "Waveguides confine and guide electromagnetic waves physically, bypassing high losses of standard coaxial cables.",
                difficulty: "medium"
            },
            {
                question: "What is the formula for the Numerical Aperture (NA) of a step-index fiber?",
                options: ["NA = n1 + n2", "NA = sqrt(n1^2 - n2^2)", "NA = n2 / n1", "NA = arcsin(n2 / n1)"],
                correctIndex: 1,
                explanation: "NA is defined mathematically from refractive indices: $\\\\text{NA} = \\\\sqrt{n_1^2 - n_2^2}$.",
                difficulty: "medium"
            },
            // Hard
            {
                question: "What represents the Doppler Radar frequency shift formula (fd)?",
                options: ["fd = 2 * v * ft / c", "fd = v * ft * c", "fd = ft / v", "fd = c * v^2"],
                correctIndex: 0,
                explanation: "Doppler shift: $f_d = \\\\frac{2 \\\\cdot v \\\\cdot f_t}{c}$, accounting for two-way wave propagation from dish to target and back.",
                difficulty: "hard"
            },
            {
                question: "What represents the 'Cutoff Frequency' of a rectangular metallic waveguide?",
                options: ["The maximum frequency handled", "The frequency below which electromagnetic propagation modes cannot exist inside the waveguide", "The resonant frequency", "The laser launching angle"],
                correctIndex: 1,
                explanation: "Waveguides act as high-pass filters. Below the cutoff frequency, waves decay exponentially and cannot propagate.",
                difficulty: "hard"
            },
            {
                question: "What is the Radar Cross Section (RCS) of a target?",
                options: ["The physical cross-sectional area of a target", "A measure of how detectable an object is by radar, reflecting incoming energy back to the receiver", "The antenna array spacing", "The Doppler frequency shift"],
                correctIndex: 1,
                explanation: "RCS represents the equivalent area that reflects electromagnetic waves back to the radar antenna (depends on geometry, material, size).",
                difficulty: "hard"
            }
        ]
    }
};

// ─── EXPERT DIFFICULTY QUESTIONS ─────────────────────────────────────────────
export const EXPERT_QUESTIONS = {
    'pn-junction': [
        { question: "Built-in potential Vbi for Si PN junction at 300K with NA=10¹⁶/cm³, ND=10¹⁵/cm³ (ni≈1.5×10¹⁰) is approximately:", options: ["0.32 V", "0.64 V", "0.12 V", "1.12 V"], correctIndex: 1, explanation: "Vbi=(kT/q)×ln(NA×ND/ni²)=0.026×ln(10³¹/2.25×10²⁰)≈0.026×24.6≈0.64V.", difficulty: "expert", category: "pn-junction" },
        { question: "In the Shockley equation I=Is(e^(V/nVT)−1), ideality factor n between 1–2 physically represents:", options: ["Ohmic contact resistance", "SRH recombination in the depletion region", "Avalanche multiplication", "Thermal noise"], correctIndex: 1, explanation: "n=1: ideal diffusion. n=2: dominant Shockley-Read-Hall recombination within depletion region adds a second current component.", difficulty: "expert", category: "pn-junction" },
        { question: "Zener diode Vz=5.6V, Iz=20mA, rz=8Ω. Load current increases by 15mA (constant supply). Zener current:", options: ["Decreases by 15mA", "Increases by 15mA", "Unchanged", "Decreases by 120mA"], correctIndex: 0, explanation: "KCL: Iz=Isupply−Iload. Isupply fixed, ΔIz=−ΔIload=−15mA. Zener absorbs fluctuations, maintaining voltage regulation.", difficulty: "expert", category: "pn-junction" },
    ],
    'transistor': [
        { question: "CE BJT: β=100, VCC=12V, RC=2kΩ, RB=470kΩ, VBE=0.7V. Find VCE:", options: ["7.2 V", "4.75 V", "10.55 V", "0.2 V"], correctIndex: 0, explanation: "IB=(12−0.7)/470k≈24µA. IC=β×IB=2.4mA. VCE=VCC−IC×RC=12−4.8=7.2V.", difficulty: "expert", category: "transistor" },
        { question: "Small-signal mid-band voltage gain of a CE stage with RC load:", options: ["−gm×RC", "RC/RE", "VCC/IC", "+gm×RC"], correctIndex: 0, explanation: "Av=−gm×RC=−β×RC/rπ. Minus sign = 180° phase inversion. gm=IC/VT is the core transconductance parameter.", difficulty: "expert", category: "transistor" },
        { question: "High-frequency gain in CE BJT is primarily limited by:", options: ["Miller multiplication of Cbc", "Base resistance rbb'", "Supply voltage headroom", "Load mismatch"], correctIndex: 0, explanation: "Miller effect: Cbc appears as Cbc×(1+|Av|) at the input, severely lowering the -3dB frequency of the amplifier.", difficulty: "expert", category: "transistor" },
    ],
    'logic-gates': [
        { question: "F = AB'C + ABC + AB'C' + ABC' simplified with K-map:", options: ["F = A", "F = AB", "F = A+B", "F = AC+B'"], correctIndex: 0, explanation: "Minterms 4,5,6,7 all have A=1. Single prime implicant covers all four: F=A.", difficulty: "expert", category: "logic-gates" },
        { question: "CMOS NAND gate: tpLH=2ns, tpHL=1ns. Average propagation delay tpd:", options: ["1.5 ns", "3 ns", "2 ns", "1 ns"], correctIndex: 0, explanation: "tpd=(tpLH+tpHL)/2=(2+1)/2=1.5ns.", difficulty: "expert", category: "logic-gates" },
        { question: "Optimized CMOS full adder using transmission-gate logic requires how many transistors?", options: ["28", "32", "48", "16"], correctIndex: 0, explanation: "Transmission-gate CMOS full adder: 28 transistors vs 48 in standard gate-level implementation — 42% area saving.", difficulty: "expert", category: "logic-gates" },
    ],
    'flip-flops': [
        { question: "D flip-flop: tsu=3ns, th=1ns, tCQ=5ns, tcomb=7ns. Maximum clock frequency:", options: ["66.7 MHz", "100 MHz", "50 MHz", "83.3 MHz"], correctIndex: 0, explanation: "Tmin=tCQ+tcomb+tsu=5+7+3=15ns. fmax=1/15ns≈66.7MHz.", difficulty: "expert", category: "flip-flops" },
        { question: "4-bit ripple counter with 20ns-delay JK flip-flops. Maximum counting frequency:", options: ["12.5 MHz", "50 MHz", "25 MHz", "6.25 MHz"], correctIndex: 0, explanation: "Delays stack: 4×20ns=80ns total. fmax=1/80ns=12.5MHz.", difficulty: "expert", category: "flip-flops" },
        { question: "Key timing difference: synchronous vs asynchronous reset in D flip-flop:", options: ["Async resets immediately; sync resets only at next clock edge", "Async needs setup time", "Sync is faster", "Async requires AND gate on D"], correctIndex: 0, explanation: "Async reset overrides the clock instantly. Sync reset takes effect at the next active clock edge — cleaner timing analysis but one-cycle latency.", difficulty: "expert", category: "flip-flops" },
    ],
    'signals': [
        { question: "x(t)=cos(2π×50t)+cos(2π×150t) sampled at 200Hz. The 150Hz component aliases to:", options: ["50 Hz", "150 Hz", "75 Hz", "100 Hz"], correctIndex: 0, explanation: "|fs−fsignal|=|200−150|=50Hz. The 150Hz tone folds to 50Hz, aliasing with the original 50Hz component.", difficulty: "expert", category: "signals" },
        { question: "Laplace transform of f(t)=t·e^(−at)·u(t):", options: ["1/(s+a)²", "a/(s+a)²", "1/(s+a)", "s/(s+a)²"], correctIndex: 0, explanation: "L{e^(−at)}=1/(s+a). Multiply by t ↔ −d/ds: L{t·e^(−at)}=1/(s+a)².", difficulty: "expert", category: "signals" },
        { question: "LTI system h(t)=e^(−2t)u(t). Its −3dB bandwidth in Hz:", options: ["0.318 Hz", "2 Hz", "1 Hz", "0.159 Hz"], correctIndex: 0, explanation: "H(jω)=1/(jω+2). At −3dB: ω²+4=8 → ω=2 rad/s → f=2/(2π)≈0.318Hz.", difficulty: "expert", category: "signals" },
    ],
    'networks': [
        { question: "Series RLC: R=10Ω, L=0.1H, C=100µF. Quality factor Q at resonance:", options: ["3.16", "10", "1", "0.316"], correctIndex: 0, explanation: "ω₀=1/√(LC)=316rad/s. Q=ω₀L/R=316×0.1/10=3.16.", difficulty: "expert", category: "networks" },
        { question: "Two 10Ω resistors in parallel, series with 5Ω (sources zeroed). Thevenin resistance:", options: ["10 Ω", "5 Ω", "15 Ω", "20 Ω"], correctIndex: 0, explanation: "10Ω||10Ω=5Ω. Series with 5Ω: Rth=10Ω.", difficulty: "expert", category: "networks" },
        { question: "Maximum power transfer from source to load occurs when:", options: ["RL = Rth", "RL = 0", "RL → ∞", "RL = 2×Rth"], correctIndex: 0, explanation: "Maximum Power Transfer Theorem: Pmax when RL=Rth. Half the open-circuit voltage appears across RL at this condition.", difficulty: "expert", category: "networks" },
    ],
    'microcontrollers': [
        { question: "'MOV A,B' on 8085 requires:", options: ["1 machine cycle, 4 T-states", "2 machine cycles, 7 T-states", "3 machine cycles, 10 T-states", "1 machine cycle, 6 T-states"], correctIndex: 0, explanation: "Register-to-register MOV: opcode fetch only (1 machine cycle = 4 T-states). No memory access.", difficulty: "expert", category: "microcontrollers" },
        { question: "8051 at 11.0592MHz, Timer1 mode 2, TH1=0xFD, SMOD=0. Baud rate:", options: ["9600 bps", "4800 bps", "19200 bps", "1200 bps"], correctIndex: 0, explanation: "Machine cycle=12 clocks. T1 overflow=(256−0xFD)=3 → rate=11.0592M/36=307.2kHz. Baud=307200/32=9600bps.", difficulty: "expert", category: "microcontrollers" },
        { question: "PUSH PSW on 8085 saves to stack:", options: ["Accumulator (8b) + Flag register (8b) = 16-bit PSW", "Program Counter", "All register pairs", "Stack pointer"], correctIndex: 0, explanation: "PSW=Accumulator+Flags (16-bit). PUSH PSW preserves processor state before subroutine calls.", difficulty: "expert", category: "microcontrollers" },
    ],
    'dsp': [
        { question: "IIR filter poles at z=0.9·e^(±jπ/4). Stability and response:", options: ["Stable (|z|<1); resonant peaks near π/4 rad/sample", "Unstable", "Marginally stable", "All-pass"], correctIndex: 0, explanation: "|z|=0.9<1 → stable. Angle π/4 rad/sample → resonant frequency peaks at that digital frequency.", difficulty: "expert", category: "dsp" },
        { question: "z-transform of x[n]=(0.5)^n·u[n]−(0.5)^(n−1)·u[n−1]:", options: ["(1−z⁻¹)/(1−0.5z⁻¹)", "(z−0.5)/z", "1/(1−0.5z⁻¹)", "z⁻¹/(1−0.5z⁻¹)"], correctIndex: 0, explanation: "X(z)=1/(1−0.5z⁻¹)−z⁻¹/(1−0.5z⁻¹)=(1−z⁻¹)/(1−0.5z⁻¹). Differencing of decaying exponential.", difficulty: "expert", category: "dsp" },
        { question: "FFT block convolution (N=128) vs direct 64-tap FIR — multiplications per output sample:", options: ["~64 direct vs ~7–10 FFT-based", "Same: 64 each", "FFT needs 128 per sample", "FFT needs 512 per sample"], correctIndex: 0, explanation: "Direct: 64 MACs/sample. FFT-block: ≈1.5×log2(N)≈10.5 mults/sample equivalent. FFT offers 6–9× reduction for long filters.", difficulty: "expert", category: "dsp" },
    ],
    'comms': [
        { question: "Shannon capacity: B=4kHz, SNR=31. Maximum error-free data rate:", options: ["20 kbps", "40 kbps", "10 kbps", "80 kbps"], correctIndex: 0, explanation: "C=B·log2(1+SNR)=4000·log2(32)=4000×5=20,000bps=20kbps.", difficulty: "expert", category: "comms" },
        { question: "BPSK BER = Q(√(2·Eb/No)) at Eb/No=8dB (≈6.31 linear):", options: ["~1.9×10⁻³", "~10⁻⁸", "~0.5", "~1×10⁻²"], correctIndex: 0, explanation: "√(2×6.31)≈3.55. Q(3.55)≈1.9×10⁻³ for BPSK at 8dB Eb/No.", difficulty: "expert", category: "comms" },
        { question: "AM (DSB-LC), modulation index m=0.5, carrier power Pc=100W. Total sideband power:", options: ["12.5 W", "25 W", "50 W", "6.25 W"], correctIndex: 0, explanation: "Total sideband power = Pc×m²/2 = 100×0.25/2 = 12.5W. (Each sideband = 6.25W; total both sidebands = 12.5W.)", difficulty: "expert", category: "comms" },
    ],
    'vlsi': [
        { question: "CMOS ring oscillator: 7 inverter stages, tpd=200ps each. Oscillation frequency:", options: ["357 MHz", "714 MHz", "100 MHz", "200 MHz"], correctIndex: 0, explanation: "f=1/(2·N·tpd)=1/(2×7×200ps)=1/2800ps≈357MHz.", difficulty: "expert", category: "vlsi" },
        { question: "CMOS inverter PMOS W/L=2, NMOS W/L=1, k'n=k'p. This achieves:", options: ["Symmetric switching (Vth_sw=VDD/2) by equalizing drive currents", "Asymmetric — favors pull-up", "Asymmetric — favors pull-down", "No effect on switching threshold"], correctIndex: 0, explanation: "Since µp≈µn/2, PMOS needs 2× the width to match NMOS drive. With equal k', WP/LP=2×WN/LN equalizes currents → symmetric VTC at VDD/2.", difficulty: "expert", category: "vlsi" },
        { question: "DRC (Design Rule Check) verifies what, and rules are based on:", options: ["Physical layout obeys lithography/etch tolerances; based on λ (min feature size)", "Functional logic correctness", "Power limits", "Clock skew"], correctIndex: 0, explanation: "DRC checks polygon widths, spacings, overlaps against process rules derived from minimum printable feature size λ.", difficulty: "expert", category: "vlsi" },
    ],
    'embedded': [
        { question: "Rate Monotonic RTOS: T1(10ms,3ms), T2(25ms,8ms). Schedulable?", options: ["Yes — U=0.62 < RM bound 0.828", "No — U>100%", "No — U>RM bound 0.5", "Only with EDF"], correctIndex: 0, explanation: "U=3/10+8/25=0.62. RM bound n=2: 2(√2−1)≈0.828. 0.62<0.828 → schedulable.", difficulty: "expert", category: "embedded" },
        { question: "SPI CPOL=1,CPHA=1 vs CPOL=0,CPHA=0:", options: ["Clock idles HIGH, capture on falling (vs LOW, capture on rising)", "Only baud rate differs", "Data lines inverted", "No difference"], correctIndex: 0, explanation: "CPOL=0,CPHA=0=Mode0 (idle LOW, rising edge capture). CPOL=1,CPHA=1=Mode3 (idle HIGH, falling edge capture).", difficulty: "expert", category: "embedded" },
        { question: "I²C ACK/NACK bit purpose:", options: ["Receiver pulls SDA LOW (ACK) to confirm receipt; NACK (HIGH) signals error or end", "Transmitter confirms delivery", "ACK resets clock", "NACK triggers retransmit"], correctIndex: 0, explanation: "After 8 data bits, receiver drives SDA LOW for ACK or releases SDA HIGH for NACK. Master generates the 9th clock pulse for this bit.", difficulty: "expert", category: "embedded" },
    ],
    'optical': [
        { question: "Single-mode fiber NA=0.12, n1=1.48. Cladding index n2:", options: ["1.475", "1.46", "1.40", "1.50"], correctIndex: 0, explanation: "NA=√(n1²−n2²). n2²=1.48²−0.12²=2.1904−0.0144=2.176. n2=√2.176≈1.475.", difficulty: "expert", category: "optical" },
        { question: "Rectangular waveguide a=2.28cm. Cutoff frequency of TE10 mode:", options: ["6.56 GHz", "3.28 GHz", "13.1 GHz", "2.45 GHz"], correctIndex: 0, explanation: "fc(TE10)=c/(2a)=3×10¹⁰/(2×0.0228)=3×10¹⁰/0.0456≈6.58GHz≈6.56GHz.", difficulty: "expert", category: "optical" },
        { question: "Multimode fiber, modal dispersion Δτ=2ns/km, link=5km. Dispersion-limited bandwidth:", options: ["44 MHz", "500 MHz", "1 GHz", "200 MHz"], correctIndex: 0, explanation: "Total broadening=2×5=10ns. BW≈0.44/10ns=44MHz.", difficulty: "expert", category: "optical" },
    ],
};
