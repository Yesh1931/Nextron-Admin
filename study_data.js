/**
 * Nextron - ECE Comprehensive Study Hub Database
 * Contains rich, exhaustive materials for all 17 core ECE undergraduate topics.
 * 
 * Formatting:
 *   - Formulas use standard LaTeX double-escaped format (e.g. \\frac, \\cdot) for KaTeX.
 *   - Includes solved numericals, conceptual diagrams, MCQs, and parameters.
 */

export const STUDY_DATA = {
    mosfets: {
        title: "MOSFETs (Metal-Oxide-Semiconductor Field-Effect Transistors)",
        icon: "cpu",
        category: "Active Devices",
        intro: "The Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET) is a four-terminal voltage-controlled device that forms the bedrock of modern digital logic circuits and analog micro-electronics. It operates by controlling the electric field across a thin gate oxide to modulate the conductivity of a semiconductor channel between source and drain terminals.",
        theory: "The core physics of MOSFETs revolves around the capacitive control of charge carriers. Applying a gate voltage induces a vertical electric field, leading to carrier accumulation, depletion, and ultimately inversion (channel formation). In an n-channel enhancement MOSFET, a positive gate-to-source voltage attracts electrons to the silicon-dioxide interface, creating a conducting channel through the p-type substrate. The threshold voltage ($V_t$) is the minimum bias required to achieve strong inversion.",
        working: "1. **Cutoff Region ($V_{GS} < V_t$):** The gate voltage is insufficient to invert the channel. The channel impedance is extremely high, and the drain current is virtually zero ($I_D \\approx 0$).\n2. **Linear/Triode Region ($V_{GS} \\ge V_t$ and $V_{DS} < V_{GS} - V_t$):** A continuous channel exists. The current increases almost linearly with the drain-to-source voltage ($V_{DS}$). The device behaves as a voltage-controlled resistor.\n3. **Saturation Region ($V_{GS} \\ge V_t$ and $V_{DS} \\ge V_{GS} - V_t$):** As $V_{DS}$ increases, the channel pinch-off occurs at the drain side. The current becomes independent of $V_{DS}$ and is solely controlled by $V_{GS}$.",
        diagram: `
      Gate Voltage (V_GS) ──┐
                            ▼
                    [ Gate (Metal/Poly) ]
                =========================  ◄ Oxide (SiO2)
  Source (n+) ───[ Induced n-channel ]─── Drain (n+)
  (0V reference)  [ Substrate (p-type) ]  (Positive V_DS)
                            ▲
                            └─── Bulk (0V)
        `,
        formulas: [
            { expr: "I_D = \\mu_n C_{ox} \\frac{W}{L} \\left[ (V_{GS} - V_t)V_{DS} - \\frac{V_{DS}^2}{2} \\right]", desc: "Drain Current in Linear/Triode Region ($V_{DS} < V_{GS} - V_t$)" },
            { expr: "I_D = \\frac{\\mu_n C_{ox}}{2} \\frac{W}{L} (V_{GS} - V_t)^2 (1 + \\lambda V_{DS})", desc: "Drain Current in Saturation Region ($V_{DS} \\ge V_{GS} - V_t$) with Channel Length Modulation" },
            { expr: "g_m = \\frac{\\partial I_D}{\\partial V_{GS}} = \\mu_n C_{ox} \\frac{W}{L} (V_{GS} - V_t) = \\sqrt{2 \\mu_n C_{ox} \\frac{W}{L} I_D}", desc: "MOSFET Transconductance ($g_m$)" }
        ],
        applications: [
            "Switching elements in CMOS digital logic gates (microprocessors, memory blocks).",
            "Switched-Mode Power Supplies (SMPS) and high-power motor speed controllers.",
            "Low-noise analog RF amplifiers in telecommunication transceivers."
        ],
        advantages: [
            "Extremely high input impedance (gate draws virtually zero DC current).",
            "Low static power dissipation when paired in CMOS logic gates.",
            "Fast switching times, ideal for high-speed digital processors."
        ],
        disadvantages: [
            "Highly susceptible to Electrostatic Discharge (ESD) damage due to oxide breakdown.",
            "Exhibits severe short-channel effects (e.g. DIBL) at nanoscale dimensions.",
            "Lower transconductance compared to BJT transistors."
        ],
        examQuestions: [
            { q: "What is Channel Length Modulation in MOSFETs, and how does it affect the saturation region output characteristics?", a: "In the saturation region, as $V_{DS}$ increases past $V_{GS}-V_t$, the pinch-off point moves towards the source. This shortens the effective channel length ($L_{eff} < L$), slightly increasing the drain current. It is modeled by the parameter $\\lambda$, resulting in a finite output resistance ($r_o$) rather than an ideal flat current." },
            { q: "Distinguish between enhancement-mode and depletion-mode MOSFETs.", a: "Enhancement-mode MOSFETs are normally OFF ($I_D=0$ at $V_{GS}=0$) and require an applied gate voltage to create a channel. Depletion-mode MOSFETs are normally ON ($I_D > 0$ at $V_{GS}=0$) because a physical channel is built-in during fabrication; applying a reverse gate bias depletes this channel to turn it OFF." }
        ],
        mcqs: [
            { q: "Which region of operation is a MOSFET in if $V_{GS} = 3\\text{ V}$, $V_t = 1\\text{ V}$, and $V_{DS} = 1.5\\text{ V}$?", opts: ["Cutoff Region", "Saturation Region", "Linear/Triode Region", "Breakdown Region"], correct: 2, exp: "Here, $V_{GS} > V_t$ (device is ON), and $V_{DS} = 1.5\\text{ V} < V_{GS} - V_t = 2\\text{ V}$. Therefore, it is in the Linear/Triode region." },
            { q: "The dynamic power consumption of a CMOS inverter is proportional to:", opts: ["V_DD", "V_DD^2", "W / L", "t_ox"], correct: 1, exp: "The dynamic power is given by P = C * V_DD^2 * f, hence proportional to the square of the supply voltage." }
        ],
        numericals: [
            { q: "An NMOS transistor has parameter $\\mu_n C_{ox} = 200\\ \\mu\\text{A/V}^2$, aspect ratio $W/L = 10$, $V_t = 0.5\\text{ V}$, and $\\lambda = 0.02\\text{ V}^{-1}$. Calculate the drain current $I_D$ at $V_{GS} = 1.5\\text{ V}$ and $V_{DS} = 2.0\\text{ V}$.", steps: [
                "Check operation region: $V_{GS} - V_t = 1.5 - 0.5 = 1.0\\text{ V}$. Since $V_{DS} = 2.0\\text{ V} \\ge 1.0\\text{ V}$, the device is in saturation.",
                "Apply formula: $I_D = \\frac{\\mu_n C_{ox}}{2} \\frac{W}{L} (V_{GS} - V_t)^2 (1 + \\lambda V_{DS})$",
                "Substitute: $I_D = \\frac{200 \\times 10^{-6}}{2} \\times 10 \\times (1.5 - 0.5)^2 \\times (1 + 0.02 \\times 2.0)$",
                "Simplify: $I_D = 10^{-4} \\times 10 \\times 1.0 \\times (1 + 0.04) = 10^{-3} \\times 1.04 = 1.04\\text{ mA}$"
            ], r: "1.04 mA" }
        ],
        simType: "mosfet"
    },
    opamps: {
        title: "Operational Amplifiers (Op-Amps)",
        icon: "triangle",
        category: "Analog Circuits",
        intro: "The Operational Amplifier (Op-Amp) is an integrated direct-coupled, high-gain differential voltage amplifier. By adding external resistors and capacitors, it can perform mathematical operations such as addition, subtraction, integration, and differentiation, making it the central building block of analog signal conditioning.",
        theory: "An ideal Op-Amp has infinite open-loop gain ($A_{OL} = \\infty$), infinite input impedance ($R_{in} = \\infty$), zero output impedance ($R_{out} = 0$), infinite bandwidth, and zero offset voltage. These ideal characteristics yield the two **Golden Rules of Op-Amps** when operating with negative feedback:\n1. The voltage difference between input terminals is zero ($v_+ = v_-$) due to virtual short-circuit.\n2. The input terminals draw zero current ($i_+ = i_- = 0$).",
        working: "1. **Inverting Amplifier:** The input signal is fed through a resistor to the inverting terminal ($-$). The non-inverting terminal ($+$) is grounded. The gain is negative and determined by the feedback ratio.\n2. **Non-Inverting Amplifier:** The input is fed directly to the non-inverting terminal. The feedback network is connected to the inverting terminal, yielding positive, stable gain.\n3. **Comparator (No Feedback):** The Op-Amp operates in open-loop. A tiny difference between terminals saturates the output to the positive or negative supply rail.",
        diagram: `
              Inverting Input (v-) ─────┐
                                        │  \\
                                        ├───\\ Output (v_out)
                                        │   /
              Non-Inverting (v+) ───────┘  /
                                           ▲
                                           │ (Negative Feedback Loop)
        `,
        formulas: [
            { expr: "v_{\\text{out}} = A_{OL}(v_+ - v_-)", desc: "Open-Loop Output Voltage Equation" },
            { expr: "A_v = \\frac{v_{\\text{out}}}{v_{\\text{in}}} = -\\frac{R_f}{R_{in}}", desc: "Inverting Amplifier Voltage Gain ($A_v$)" },
            { expr: "A_v = \\frac{v_{\\text{out}}}{v_{\\text{in}}} = 1 + \\frac{R_f}{R_1}", desc: "Non-Inverting Amplifier Voltage Gain ($A_v$)" }
        ],
        applications: [
            "Sensor signal pre-amplifiers and analog filters.",
            "Analog-to-Digital Converter (ADC) front-end buffers.",
            "Summing mixers, differentiators, and integration controllers."
        ],
        advantages: [
            "Gain can be precisely controlled using external passive resistors.",
            "High input impedance avoids loading delicate sensor outputs.",
            "Excellent rejection of common-mode noise (high CMRR)."
        ],
        disadvantages: [
            "Limited slew rate restricts high-frequency performance.",
            "Draws bias and offset currents in practical integrated circuits.",
            "Finite bandwidth limit governed by the Gain-Bandwidth Product (GBW)."
        ],
        examQuestions: [
            { q: "Derive the output voltage expression for an Op-Amp Inverting Differentiator circuit.", a: "For an inverting differentiator, a capacitor $C$ is at the input and a resistor $R$ is in feedback. The virtual ground makes $v_- = 0$. The input current is $i_{in} = C \\frac{dv_{in}}{dt}$. The feedback current is $i_f = -\\frac{v_{out}}{R}$. Since $i_{in} = i_f$, we get $v_{out} = -RC \\frac{dv_{in}}{dt}$." },
            { q: "What is Slew Rate, and how does it limit operational amplifier performance?", a: "Slew rate ($SR$) is the maximum rate of change of the output voltage, measured in $V/\\mu s$. If the input signal frequency or amplitude requires the output to change faster than the slew rate, the signal distorts into a triangular shape, limiting high-power bandwidth." }
        ],
        mcqs: [
            { q: "If an Op-Amp has a Gain-Bandwidth Product of 1 MHz and is configured for a gain of 100, what is its cutoff frequency?", opts: ["1 MHz", "100 kHz", "10 kHz", "100 Hz"], correct: 2, exp: "Cutoff Frequency = GBW / Gain = 1,000,000 / 100 = 10,000 Hz = 10 kHz." },
            { q: "Virtual ground concept in Op-Amps is a result of:", opts: ["Negative Feedback & High Open-loop Gain", "Positive Feedback", "Infinite Output Impedance", "Common-Mode Rejection"], correct: 0, exp: "High open loop gain forces (v+ - v-) = v_out/A_OL ≈ 0, and negative feedback stabilizes this virtual short." }
        ],
        numericals: [
            { q: "Design a non-inverting amplifier with a voltage gain of 11. If the input voltage is 0.5V and you use a feedback resistor $R_f = 100\\text{ k}\\Omega$, calculate the required resistor $R_1$ and output voltage.", steps: [
                "Identify gain equation: $A_v = 1 + \\frac{R_f}{R_1}$",
                "Substitute values: $11 = 1 + \\frac{100\\text{ k}\\Omega}{R_1} \\implies 10 = \\frac{100\\text{ k}\\Omega}{R_1}$",
                "Solve for $R_1$: $R_1 = 10\\text{ k}\\Omega$",
                "Calculate output voltage: $v_{out} = A_v \\cdot v_{in} = 11 \\times 0.5\\text{ V} = 5.5\\text{ V}$"
            ], r: "R1 = 10 kΩ, Vout = 5.5 V" }
        ],
        simType: "opamp"
    },
    amplifiers: {
        title: "Transistor Amplifiers",
        icon: "volume-2",
        category: "Analog Circuits",
        intro: "Transistor Amplifiers boost the amplitude of weak electrical signals by transferring power from a DC supply to an AC output wave under the control of an input terminal. They are categorized based on their transistor type (BJT, FET) and terminal configurations.",
        theory: "Amplifier analysis splits into DC bias analysis (to locate the stable Q-point on the load line) and AC small-signal analysis (modifying the circuit into linear hybrid-pi or r-e models). The key parameters governing an amplifier are its Voltage Gain ($A_v$), Current Gain ($A_i$), Input Resistance ($R_{in}$), and Output Resistance ($R_{out}$). Active biasing secures thermal stability, protecting the transistor from thermal runaway.",
        working: "1. **Common-Emitter (CE) Configuration:** The base is the input, collector is the output, and emitter is shared. It provides high voltage and current gain, introducing a 180° phase inversion.\n2. **Common-Collector (Emitter Follower):** Emitter is the output, base is input. It provides unity voltage gain ($A_v \\approx 1$), high current gain, and is used for impedance matching.\n3. **Common-Base:** Emitter is input, collector is output. High voltage gain, low input impedance, excellent high-frequency response.",
        diagram: `
              Collector Supply (V_CC) ──[ R_Collector ]──┐
                                                         ├─── Output (180° Phase Shift)
              Input (Base) ───[ Coupling Cap ]───( BJT )  │
                                                  │      ▼
                                              ( Emitter )──[ R_Emitter // Bypass Cap ]
        `,
        formulas: [
            { expr: "A_v = \\frac{v_{\\text{out}}}{v_{\\text{in}}} \\approx -\\frac{R_C \\parallel R_L}{r_e}", desc: "Common-Emitter Amplifier AC Voltage Gain (Unloaded Emitter)" },
            { expr: "r_e = \\frac{V_T}{I_E} \\approx \\frac{25\\text{ mV}}{I_E}", desc: "Dynamic Emitter Resistance ($r_e$)" },
            { expr: "R_{in} = R_1 \\parallel R_2 \\parallel (\\beta \\cdot r_e)", desc: "CE Input Impedance with Voltage Divider Bias" }
        ],
        applications: [
            "Audio pre-amplifiers in microphones and music instruments.",
            "Radio Frequency (RF) voltage amplifiers in radar receivers.",
            "Power stages driving loudspeaker voice coils."
        ],
        advantages: [
            "CE stage offers high power gain (simultaneous voltage and current boost).",
            "Simple, highly stable DC biasing configurations using resistors.",
            "Low fabrication cost using standard Silicon BJTs."
        ],
        disadvantages: [
            "Introduces non-linear harmonic distortion at large signal drives.",
            "Narrow frequency bandwidth due to parasitic junction capacitances.",
            "CE configuration exhibits high output impedance."
        ],
        examQuestions: [
            { q: "What is the purpose of the emitter bypass capacitor ($C_E$) in a CE amplifier?", a: "The emitter bypass capacitor provides a low-impedance AC ground path for signal currents, bypassing $R_E$. This eliminates AC negative feedback across $R_E$, maximizing the AC voltage gain of the amplifier stage while preserving DC bias stability." },
            { q: "Explain the frequency response of an RC-coupled amplifier, detailing low and high cutoff mechanisms.", a: "At low frequencies, voltage gain drops due to the high reactance of coupling and bypass capacitors ($X_C \\propto 1/f$). At high frequencies, gain drops due to internal transistor parasitic capacitances and Miller effect, which shunt high-frequency signals to ground." }
        ],
        mcqs: [
            { q: "Which BJT amplifier configuration is best suited for impedance matching?", opts: ["Common-Base", "Common-Emitter", "Common-Collector", "Differential Pair"], correct: 2, exp: "Common-Collector (Emitter Follower) features high input impedance and low output impedance, making it ideal as a buffer stage." },
            { q: "The phase shift between input and output voltages of a CE BJT amplifier is:", opts: ["0°", "90°", "180°", "270°"], correct: 2, exp: "An increasing base voltage drives more collector current, pulling the collector output down towards ground, creating a 180° inversion." }
        ],
        numericals: [
            { q: "A CE amplifier has collector bias resistor $R_C = 4.7\\text{ k}\\Omega$, emitter bias current $I_E = 1.0\\text{ mA}$, and current gain $\\beta = 100$. Find the dynamic emitter resistance $r_e$ and the unloaded voltage gain $A_v$.", steps: [
                "Calculate dynamic emitter resistance: $r_e = \\frac{25\\text{ mV}}{I_E} = \\frac{25\\text{ mV}}{1\\text{ mA}} = 25\\ \\Omega$.",
                "Apply voltage gain equation: $A_v = -\\frac{R_C}{r_e}$.",
                "Substitute values: $A_v = -\\frac{4700\\ \\Omega}{25\\ \\Omega} = -188$.",
                "Note: The negative sign represents 180° phase inversion."
            ], r: "re = 25 Ω, Av = -188" }
        ],
        simType: "amplifier"
    },
    oscillators: {
        title: "Feedback Oscillators",
        icon: "waveform",
        category: "Analog Circuits",
        intro: "An oscillator is an electronic circuit that converts DC power from a supply into a continuous, self-sustaining periodic AC waveform without requiring external AC inputs. They form the clock generators for digital chips and local carriers for wireless systems.",
        theory: "Oscillation requires positive feedback and is governed by the **Barkhausen Criterion**:\n1. The loop gain magnitude must be unity: $|A\\beta| = 1$.\n2. The total phase shift around the feedback loop must be zero or a multiple of 360°: $\\angle A\\beta = 0$. \nAn amplifier stage combined with a frequency-selective RC or LC feedback network ensures these conditions are met at exactly one target frequency.",
        working: "1. **Wien Bridge (RC):** Uses a lead-lag feedback bridge. At the resonant frequency, the feedback phase shift is 0° and attenuation is $1/3$, requiring an amplifier gain of $3$ to start oscillating.\n2. **Phase Shift (RC):** Employs three cascaded RC networks. Each provides 60° phase shift for a total of 180°, combined with a 180° inverting amplifier to yield 360° total phase loop.\n3. **Colpitts & Hartley (LC):** Uses tapped capacitors or inductors to form resonant tank circuits, producing high-purity high-frequency RF sine waves.",
        diagram: `
              ┌───────── Amplifier (Gain A) ────────┐
              │                                    │
              ▲                                    ▼
              └────── Feedback Network (Beta) ◄────┘
                     (Filters Phase & Frequency)
        `,
        formulas: [
            { expr: "f_0 = \\frac{1}{2\\pi R C}", desc: "Wien Bridge Resonant Frequency" },
            { expr: "f_0 = \\frac{1}{2\\pi \\sqrt{6} R C}", desc: "RC Phase Shift Resonant Frequency" },
            { expr: "f_0 = \\frac{1}{2\\pi \\sqrt{L C_{eq}}} \\quad \\text{where } C_{eq} = \\frac{C_1 C_2}{C_1 + C_2}", desc: "Colpitts Oscillator Frequency" }
        ],
        applications: [
            "Crystal clock sources for microcontrollers and high-speed computers.",
            "Local oscillators (LO) in superheterodyne AM/FM radio receivers.",
            "Function generators synthesizing testing waveforms."
        ],
        advantages: [
            "No input signal required; generates high-stability signals autonomously.",
            "LC/Crystal oscillators produce highly stable, low-noise sine waves.",
            "Wien bridge circuits allow wide frequency tuning using variable capacitors."
        ],
        disadvantages: [
            "Crystal oscillators are fixed at single fundamental frequencies.",
            "RC oscillators exhibit frequency drift over temperature changes.",
            "Hard to stabilize amplitude without automatic gain control (AGC) loops."
        ],
        examQuestions: [
            { q: "State Barkhausen's criteria for sustained oscillations.", a: "Barkhausen's criteria state that for sustained oscillations at a frequency $f_0$: (1) the loop gain magnitude must be equal to unity ($|A\\beta| = 1$), meaning losses in feedback are exactly compensated by amplifier gains; and (2) the total phase shift around the closed loop must be $0^\\circ$ or $360^\\circ$, ensuring feedback adds constructively." },
            { q: "Explain why the minimum gain required for an RC Phase Shift oscillator amplifier is 29.", a: "Each RC stage of a 3-section high-pass network shifts phase, totaling $180^\\circ$ at frequency $f_0 = 1/(2\\pi\\sqrt{6}RC)$. At this frequency, the feedback factor is $\\beta = 1/29$. For loop gain $A\\beta \\ge 1$, the amplifier must provide a minimum gain of $A = 29$ to sustain oscillations." }
        ],
        mcqs: [
            { q: "Which oscillator circuit uses a tapped inductor configuration in its tank circuit?", opts: ["Colpitts", "Wien Bridge", "Hartley", "Phase Shift"], correct: 2, exp: "Hartley oscillators use a tapped inductor (two inductors L1, L2 and one capacitor C); Colpitts uses tapped capacitors." },
            { q: "The frequency stability of which oscillator is highest?", opts: ["RC Phase Shift", "Wien Bridge", "Colpitts LC", "Quartz Crystal"], correct: 3, exp: "Quartz crystal oscillators have extremely high Quality Factors (Q > 10,000), offering stable resonance immune to thermal drifts." }
        ],
        numericals: [
            { q: "Design a Wien Bridge oscillator to generate a sine wave frequency of 1.59 kHz. If you select capacitors $C = 10\\text{ nF}$, calculate the required feedback resistors $R$ and the minimum non-inverting amplifier gain to start oscillations.", steps: [
                "Apply Wien Bridge frequency equation: $f_0 = \\frac{1}{2\\pi R C}$.",
                "Solve for $R$: $R = \\frac{1}{2\\pi \\cdot f_0 \\cdot C} = \\frac{1}{2\\pi \\cdot 1590 \\cdot 10^{-8}} = \\frac{1}{2\\pi \\cdot 1.59 \\times 10^{-5}} \\approx 10,000\\ \\Omega = 10\\text{ k}\\Omega$.",
                "Barkhausen gain condition: For Wien bridge, feedback factor $\\beta = 1/3$ at resonance. Loop gain $A\\beta = 1 \\implies A = 3$.",
                "Result: Resistors must be $10\\text{ k}\\Omega$, and the non-inverting amplifier gain must be at least $3$ ($R_f \\ge 2R_1$)."
            ], r: "R = 10 kΩ, Gain A = 3" }
        ],
        simType: "oscillator"
    },
    combinational: {
        title: "Combinational Logic Circuits",
        icon: "binary",
        category: "Digital Logic",
        intro: "Combinational logic circuits compute binary outputs based solely on the current state of their inputs. They have no internal memory, no feedback paths, and their logical behaviors are completely modeled by truth tables and Boolean expressions.",
        theory: "Combinational gates process inputs simultaneously, with delays governed by physical gate structures. Designing these circuits involves creating truth tables, simplifying logical networks using Karnaugh Maps (K-Maps) or Boolean algebra laws, and mapping logic gates. Core functional blocks include Adders, Subtractors, Decoders, Encoders, Multiplexers, and Demultiplexers.",
        working: "1. **Multiplexer (MUX):** Acts as a data selector. It channels one of many data inputs to a single output based on select control lines.\n2. **Decoder:** Converts an n-bit binary input into one active output out of $2^n$ options, used for memory addressing.\n3. **Full Adder:** Computes the arithmetic sum of three inputs (two bits plus a carry-in), producing a Sum ($S$) and Carry-out ($C_{out}$)."
        ,
        diagram: `
              Data Inputs (D0-D3) ────┐
                                      ├───[ 4-to-1 MUX ]─── Output (Y)
              Select Lines (S0, S1) ──┘
        `,
        formulas: [
            { expr: "S = A \\oplus B \\oplus C_{in}", desc: "Full Adder Sum Output Boolean Equation" },
            { expr: "C_{out} = A \\cdot B + B \\cdot C_{in} + A \\cdot C_{in}", desc: "Full Adder Carry-Out Output Boolean Equation" },
            { expr: "Y = \\sum_{i=0}^{2^n-1} D_i \\cdot m_i \\quad (m_i = \\text{minterm of select lines})", desc: "General Multiplexer Output Equation" }
        ],
        applications: [
            "Arithmetic Logic Units (ALU) performing additions inside microprocessors.",
            "Memory address decoders in RAM arrays.",
            "Display driver decoders (e.g. BCD to 7-Segment displays)."
        ],
        advantages: [
            "Outputs are computed instantly based on inputs, no clock synchronization needed.",
            "Very simple design flow using standardized K-Map reduction.",
            "Low gate latency compared to sequential architectures."
        ],
        disadvantages: [
            "No memory storage capabilities; inputs must be held to retain outputs.",
            "Can exhibit 'glitches' or hazard hazards due to mismatched gate delays.",
            "Complex routing grows rapidly as input bits increase."
        ],
        examQuestions: [
            { q: "Design a 4-to-1 Multiplexer using basic AND, OR, and NOT gates.", a: "A 4-to-1 MUX has data inputs $D_0, D_1, D_2, D_3$ and select lines $S_0, S_1$. The boolean output is $Y = \\bar{S_1}\\bar{S_0}D_0 + \\bar{S_1}S_0$ $D_1 + S_1\\bar{S_0}D_2 + S_1S_0D_3$. This is implemented using four 3-input AND gates, two NOT gates to invert select lines, and one 4-input OR gate at the output." },
            { q: "What are static logic hazards in combinational networks, and how are they eliminated?", a: "Hazards are transient unwanted glitches at the output caused by unequal propagation delays along different gate paths. They are eliminated by adding redundant 'hazard-covering' implicants directly into the minimized K-Map grouping." }
        ],
        mcqs: [
            { q: "How many select lines are required for a 32-to-1 multiplexer?", opts: ["3 select lines", "4 select lines", "5 select lines", "6 select lines"], correct: 2, exp: "Number of inputs = 2^(select lines). Since 32 = 2^5, it requires 5 select lines." },
            { q: "A half adder can be constructed using which gate combination?", opts: ["AND and OR", "XOR and AND", "NAND only", "XOR and OR"], correct: 1, exp: "Half Adder Sum = A ⊕ B (XOR gate), Carry = A · B (AND gate)." }
        ],
        numericals: [
            { q: "A combinational function is defined as $F(A,B,C) = \\sum m(1, 3, 5, 6)$. Minimize this function using a K-Map and write down the final minimized Sum-of-Products (SOP) expression.", steps: [
                "Set up a 3-variable K-Map with cells corresponding to minterms 0 to 7.",
                "Place '1' in cells 1 ($001$), 3 ($011$), 5 ($101$), and 6 ($110$).",
                "Group cells: Minterms (1,3) form a pair yielding $\\bar{A}C$. Minterms (1,5) form a pair yielding $\\bar{B}C$. Minterm (6) has no logical neighbors to group with, so it remains as $AB\\bar{C}$.",
                "Write minimized equation: $F = \\bar{A}C + \\bar{B}C + AB\\bar{C}$."
            ], r: "F = A'C + B'C + ABC'" }
        ],
        simType: "combinational"
    },
    sequential: {
        title: "Sequential Logic Circuits",
        icon: "database",
        category: "Digital Logic",
        intro: "Sequential logic circuits compute binary outputs based on both the current state of their inputs and their past state history. They incorporate internal feedback loops and memory elements synchronized to a central clock.",
        theory: "Unlike combinational circuits, sequential networks are governed by state memory. Memory is stored using Latches (level-sensitive) or Flip-Flops (edge-triggered). Designing sequential systems involves establishing State Diagrams, State Tables, Transition Equations, and mapping logic gates to inputs. Devices are classified as Synchronous (all elements share a common clock) or Asynchronous (ripple clocking).",
        working: "1. **Edge-Triggered D Flip-Flop:** Locks in the input $D$ at the active edge of the clock (rising or falling), holding it constant until the next trigger.\n2. **Synchronous Counters:** A series of flip-flops clock simultaneously. Combinational logic maps the outputs back to inputs, commanding a structured count sequence.\n3. **Registers:** A parallel group of flip-flops used to store multi-bit words."
        ,
        diagram: `
              Clock ──────────────┐
                                  ▼
              Inputs ────[ Combinational ]───[ Flip-Flops ]─── Outputs
                               ▲                  │
                               └──── Feedback ────┘
        `,
        formulas: [
            { expr: "Q_{next} = J\\bar{Q} + \\bar{K}Q", desc: "JK Flip-Flop Characteristic State Equation" },
            { expr: "Q_{next} = D", desc: "D Flip-Flop Characteristic State Equation" },
            { expr: "T_{\\text{min}} \\ge t_{pd} + t_{\\text{setup}} + t_{\\text{hold}}", desc: "Minimum Clock Period bound for Hazard-Free Timing" }
        ],
        applications: [
            "Processor register files, cache SRAM arrays.",
            "Program counters and hardware timers.",
            "State machine controllers managing digital system sequences."
        ],
        advantages: [
            "Provides storage; stores system history and schedules timed operations.",
            "Synchronous clocks eliminate timing hazards and glitches.",
            "Allows modular state machine partitioning."
        ],
        disadvantages: [
            "Subject to timing constraints (setup and hold times) which can cause metastability.",
            "Requires clock distribution networks, consuming significant power.",
            "Generally slower peak latency compared to direct combinational paths."
        ],
        examQuestions: [
            { q: "Design a 3-bit Synchronous Binary Up-Counter using T Flip-Flops.", a: "Let count states be $Q_2, Q_1, Q_0$. For an up-counter, the LSB $Q_0$ toggles on every clock edge, so $T_0 = 1$. The next bit $Q_1$ toggles when $Q_0 = 1$, so $T_1 = Q_0$. The MSB $Q_2$ toggles when both preceding bits are $1$, so $T_2 = Q_1 \\cdot Q_0$. We connect these toggle equations to three T Flip-Flops sharing a common clock." },
            { q: "What is metastability in digital registers, and how is it mitigated?", a: "Metastability occurs when a flip-flop's input changes within the setup or hold time window around the clock edge. The output enters an unstable intermediate voltage state, taking time to settle. It is mitigated by cascading synchronizer flip-flops in series." }
        ],
        mcqs: [
            { q: "A JK flip-flop toggles its output when J and K inputs are:", opts: ["J = 0, K = 0", "J = 0, K = 1", "J = 1, K = 0", "J = 1, K = 1"], correct: 3, exp: "When J = 1 and K = 1, the output toggles on the active clock edge (Q_next = Q')." },
            { q: "How many flip-flops are required to design a Modulo-12 counter?", opts: ["3 flip-flops", "4 flip-flops", "5 flip-flops", "6 flip-flops"], correct: 1, exp: "Number of states N = 12. A counter with n flip-flops can count up to 2^n. Since 2^3 < 12 <= 2^4, it requires 4 flip-flops (up to 16 states)." }
        ],
        numericals: [
            { q: "Analyze a JK Flip-Flop with current state $Q = 0$. Determine the next state $Q_{next}$ for three consecutive clock cycles if inputs are: (Cycle 1: $J=1, K=0$), (Cycle 2: $J=0, K=0$), (Cycle 3: $J=1, K=1$).", steps: [
                "Start state: $Q = 0$.",
                "Cycle 1 ($J=1, K=0$): This is the SET state. $Q_{next} = J\\bar{Q} + \\bar{K}Q = 1(1) + 1(0) = 1$. So state becomes $Q = 1$.",
                "Cycle 2 ($J=0, K=0$): This is the HOLD state. Output remains unchanged. $Q_{next} = 1$.",
                "Cycle 3 ($J=1, K=1$): This is the TOGGLE state. The output flips. Since $Q = 1$, $Q_{next} = 0$."
            ], r: "Cycle 1: 1, Cycle 2: 1, Cycle 3: 0" }
        ],
        simType: "sequential"
    },
    analogcomms: {
        title: "Analog Communication Systems",
        icon: "radio",
        category: "Telecommunications",
        intro: "Analog Communication systems transmit analog message signals (like voice or music) across long physical distances by modulating a high-frequency carrier wave. This allows signals to be efficiently transmitted via standard antennas.",
        theory: "Direct audio transmission is impractical because it requires massive antennas. Modulation shifts baseband frequencies up to higher bands. In **Amplitude Modulation (AM)**, the amplitude of a carrier wave is modified in proportion to the message. In **Frequency Modulation (FM)**, the carrier frequency is modified, offering superior noise immunity at the expense of wider bandwidth.",
        working: "1. **AM Generation:** A multiplier combines baseband messages with high-frequency carriers, creating sidebands centered around the carrier frequency.\n2. **FM Generation:** A Voltage-Controlled Oscillator (VCO) changes its output frequency based on the input message voltage.\n3. **Envelope Detector (AM Demodulation):** A diode rectifier followed by a low-pass filter tracks the peaks of the AM wave, reconstructing the baseband message.",
        diagram: `
              Baseband Message (Low Freq) ──┐
                                            ├───[ Modulator ]─── AM/FM Carrier Wave
              Carrier Local Oscillator ──────┘
        `,
        formulas: [
            { expr: "s_{\\text{AM}}(t) = A_c [ 1 + m \\cdot \\cos(2\\pi f_m t) ] \\cos(2\\pi f_c t)", desc: "Standard Amplitude Modulated Wave Equation" },
            { expr: "\\eta = \\frac{P_{\\text{sidebands}}}{P_{\\text{total}}} = \\frac{m^2}{2 + m^2}", desc: "AM Power Transmission Efficiency" },
            { expr: "B_{\\text{FM}} = 2(\\Delta f + f_m)", desc: "FM Bandwidth (Carson's Rule)" }
        ],
        applications: [
            "Commercial AM and FM broadcast radio channels.",
            "Aeronautical communications and VHF aviation voice systems.",
            "Analog television picture transmissions."
        ],
        advantages: [
            "AM receivers are cheap and simple to construct.",
            "FM offers excellent noise immunity and high signal-to-noise ratio.",
            "Low system latency compared to digital encoding stages."
        ],
        disadvantages: [
            "AM is highly sensitive to static noise and atmospheric interference.",
            "In AM, the carrier wave consumes 66% of the power, making it inefficient.",
            "FM requires a wider bandwidth than AM."
        ],
        examQuestions: [
            { q: "Explain the working of an envelope detector circuit used for AM demodulation.", a: "An envelope detector consists of a diode in series with a parallel RC low-pass filter. The diode rectifies the positive half-cycles of the AM wave. The capacitor charges to the peak voltage during positive cycles, and discharges slowly through the resistor during negative cycles. The RC time constant is chosen such that $1/f_c \\ll RC \\ll 1/f_m$, allowing the filter to track the message envelope." },
            { q: "What are the advantages of Superheterodyne receivers over Tuned Radio Frequency (TRF) receivers?", a: "Superheterodyne receivers down-convert the incoming RF signal to a fixed intermediate frequency (IF) using a local oscillator and mixer. This allows bandpass filtering and amplification at a single stable frequency, improving selectivity and sensitivity over TRF designs." }
        ],
        mcqs: [
            { q: "What is the maximum power efficiency of a standard AM system at 100% modulation (m=1)?", opts: ["16.7%", "33.3%", "50.0%", "66.7%"], correct: 1, exp: "Efficiency = m^2 / (2 + m^2). At m = 1, efficiency = 1 / 3 = 33.3%. The rest is wasted in the carrier." },
            { q: "Carson's rule states that the bandwidth of an FM wave is:", opts: ["2 * fm", "2 * Δf", "2 * (Δf + fm)", "Δf + 2 * fm"], correct: 2, exp: "Carson's rule covers 98% of the power of FM signals by defining BW = 2(Δf + fm)." }
        ],
        numericals: [
            { q: "A standard AM transmitter outputs a total power of 10 kW when modulated by a single sine wave with a modulation index of $m = 0.6$. Calculate the carrier power $P_c$ and the power contained in both sidebands.", steps: [
                "Identify AM power equation: $P_t = P_c \\left(1 + \\frac{m^2}{2}\\right)$",
                "Substitute values: $10\\text{ kW} = P_c \\left(1 + \\frac{0.6^2}{2}\\right) = P_c (1 + 0.18) = 1.18 \\cdot P_c$",
                "Solve for $P_c$: $P_c = \\frac{10\\text{ kW}}{1.18} \\approx 8.47\\text{ kW}$",
                "Calculate sideband power: $P_{\\text{sidebands}} = P_t - P_c = 10 - 8.47 = 1.53\\text{ kW}$."
            ], r: "Pc = 8.47 kW, Psidebands = 1.53 kW" }
        ],
        simType: "analogcomms"
    },
    digitalcomms: {
        title: "Digital Communication Systems",
        icon: "cpu",
        category: "Telecommunications",
        intro: "Digital Communication systems transmit formatted binary streams over physical channels. They convert continuous analog waves into discrete pulses, adding robust error correcting codes to protect data.",
        theory: "Digital communication involves Sampling, Quantization, and Source/Channel Coding. Converting analog signals to digital inevitably introduces **Quantization Noise**. Digital modulation maps binary symbols to high-frequency carriers: **BPSK** shifts carrier phase by 180°, **QPSK** shifts phases in four increments, and **QAM** modulates both amplitude and phase to maximize data rates.",
        working: "1. **Pulse Code Modulation (PCM):** An analog signal is sampled, quantized to the nearest digital step, and encoded as a binary word.\n2. **BPSK Modulator:** A balanced mixer multiplies the carrier wave with a bipolar binary stream ($+1$ or $-1$), shifting the output phase between 0° and 180°.\n3. **QAM Receiver:** Splts the signal into In-phase ($I$) and Quadrature ($Q$) components, comparing amplitudes against a constellation map to decode multi-bit symbols.",
        diagram: `
              Analog Input ───►[ Sampler ]───►[ Quantizer ]───►[ Encoder ]───► Digital Stream
                                                                           (e.g., 101101...)
        `,
        formulas: [
            { expr: "\\text{SQNR}_{\\text{dB}} \\approx 6.02 \\cdot n + 1.76\\text{ dB}", desc: "Signal-to-Quantization-Noise Ratio of a Sinusoid" },
            { expr: "P_e = Q\\left( \\sqrt{\\frac{2 E_b}{N_0}} \\right)", desc: "Bit Error Rate (BER) Probability of BPSK Modulation" },
            { expr: "C = B \\cdot \\log_2(1 + \\text{SNR})", desc: "Shannon-Hartley Maximum Channel Capacity Theorem" }
        ],
        applications: [
            "Cellular networks (4G LTE / 5G NR using QAM and OFDM).",
            "Satelite networks carrying digital television feeds.",
            "High-speed fiber-optic internet trunk lines."
        ],
        advantages: [
            "High noise immunity; digital regenerative repeaters eliminate noise buildup.",
            "Supports robust error-correcting codes (e.g. Hamming, Reed-Solomon).",
            "Allows secure digital encryption."
        ],
        disadvantages: [
            "Requires wide system bandwidth compared to simple analog transmission.",
            "Subject to severe Inter-Symbol Interference (ISI) caused by channel dispersion.",
            "Complex hardware required for clock synchronization."
        ],
        examQuestions: [
            { q: "What is Aliasing, and how is it prevented in digital sampling systems?", a: "Aliasing occurs when an analog signal is sampled below the Nyquist rate ($f_s < 2f_{max}$). High-frequency spectral components overlap into lower frequency bands, causing irreversible distortion. It is prevented by passing the analog signal through a sharp low-pass anti-aliasing filter before sampling." },
            { q: "Explain the concept of Eye Diagrams in digital communication links.", a: "An eye diagram is an oscilloscope display showing a digital signal swept repeatedly at the symbol rate. The vertical opening of the 'eye' represents noise immunity, the horizontal width indicates jitter tolerance, and closure of the eye shows severe Inter-Symbol Interference (ISI)." }
        ],
        mcqs: [
            { q: "How many bits per symbol are transmitted in a 64-QAM digital carrier modulation system?", opts: ["4 bits/symbol", "5 bits/symbol", "6 bits/symbol", "8 bits/symbol"], correct: 2, exp: "Number of symbols M = 64. Since M = 2^k, k = log2(64) = 6 bits per symbol." },
            { q: "The primary purpose of source coding in communication links is to:", opts: ["Increase transmit power", "Eliminate transmission noise", "Reduce redundant data and compress bandwidth", "Add parity checks"], correct: 2, exp: "Source coding (e.g. Huffman coding) compresses the signal, reducing redundancy to optimize bandwidth usage." }
        ],
        numericals: [
            { q: "A voice signal with a bandwidth of 3.4 kHz is sampled at a rate 20% above the Nyquist rate and digitized using an 8-bit PCM encoder. Calculate the minimum sampling frequency and the resulting digital transmission bit rate.", steps: [
                "Calculate Nyquist Rate: $f_{\\text{Nyquist}} = 2 \\times f_{max} = 2 \\times 3.4\\text{ kHz} = 6.8\\text{ kHz}$.",
                "Calculate actual sampling rate (20% above Nyquist): $f_s = 1.20 \\times 6.8\\text{ kHz} = 8.16\\text{ kHz}$.",
                "Identify bit rate formula: $\\text{Bit Rate} = n \\cdot f_s$, where $n = 8\\text{ bits/sample}$.",
                "Calculate final bit rate: $\\text{Bit Rate} = 8 \\times 8.16\\text{ kHz} = 65.28\\text{ kbps}$."
            ], r: "Fs = 8.16 kHz, Bit Rate = 65.28 kbps" }
        ],
        simType: "digitalcomms"
    },
    dsp: {
        title: "DSP Fundamentals",
        icon: "waves",
        category: "Signal Processing",
        intro: "Digital Signal Processing (DSP) mathematical algorithms process digitized signals to filter noise, compress files, analyze spectrums, and enhance system performance using specialized micro-chips.",
        theory: "DSP operates on discrete sequences $x[n]$. Systems are classified by their linearity, time-invariance, and causality. LTI systems are analyzed using **Linear Convolution** in the time domain, and **Z-Transforms** in the frequency domain. Discrete-Time Fourier Transforms (DTFT) map sequences to continuous spectrums, while the **Discrete Fourier Transform (DFT)** creates a discrete frequency map.",
        working: "1. **Linear Convolution:** Slides an impulse response $h[n]$ across an input sequence $x[n]$, multiplying overlapping samples to calculate system outputs.\n2. **Fast Fourier Transform (FFT):** A highly optimized algorithm that reduces DFT computational complexity from $O(N^2)$ to $O(N\\log_2 N)$ by recursively decomposing arrays.\n3. **FIR Filter:** Computes outputs by summing a finite window of weighted previous input samples, ensuring linear phase responses.",
        diagram: `
              x[n] ───►[ Multiply Coefficients (b0, b1...) ]───►[ Summing Node ]───► y[n]
                         ▲                      │
                         └──── Delay Elements ──┘
        `,
        formulas: [
            { expr: "y[n] = x[n] * h[n] = \\sum_{k=-\\infty}^{\\infty} x[k] \\cdot h[n - k]", desc: "Discrete LTI System Linear Convolution" },
            { expr: "X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] \\cdot z^{-n}", desc: "Bilateral Z-Transform Definition" },
            { expr: "X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j \\frac{2\\pi}{N} k n}", desc: "Discrete Fourier Transform (DFT) Equation" }
        ],
        applications: [
            "Digital audio equalization, compression (MP3), and synthesis.",
            "Radar, sonar, and seismic signal filtering systems.",
            "Biomedical ECG signal filtering and noise cancellation."
        ],
        advantages: [
            "Highly stable; does not suffer from thermal component drift.",
            "Filters can be dynamically updated by altering software coefficients.",
            "Allows perfect linear phase filters (impossible with analog components)."
        ],
        disadvantages: [
            "Subject to quantization errors and round-off noise.",
            "Consumes significant power at high sampling rates.",
            "Introduces digital latency due to ADC/DAC conversion and computation."
        ],
        examQuestions: [
            { q: "What is the Region of Convergence (ROC) in Z-Transforms, and how does it relate to stability?", a: "The ROC is the set of values in the z-plane for which the Z-transform summation converges. For a causal LTI system, the system is stable if and only if all poles of the transfer function $H(z)$ lie inside the unit circle, meaning the ROC includes the unit circle $|z| = 1$." },
            { q: "Compare Finite Impulse Response (FIR) and Infinite Impulse Response (IIR) digital filters.", a: "FIR filters have finite duration impulse responses, are always stable, can have exact linear phase, but require more coefficients (higher computing power). IIR filters have feedback loops, can achieve sharp roll-offs with few coefficients, but can become unstable and introduce non-linear phase distortion." }
        ],
        mcqs: [
            { q: "What is the computational complexity of calculating an N-point DFT directly vs using an FFT?", opts: ["O(N) vs O(log N)", "O(N^2) vs O(N log N)", "O(N log N) vs O(N)", "O(N^3) vs O(N^2)"], correct: 1, exp: "Direct DFT requires N^2 complex multiplications, whereas FFT reduces this to (N/2)log2(N), transforming processing speeds." },
            { q: "If a system is defined by y[n] = 3 * x[n] + 5, is it linear?", opts: ["Yes, it is linear", "No, it is non-linear", "Linear only for positive inputs", "Linear only if stable"], correct: 1, exp: "The system is non-linear because it does not satisfy the superposition principle. A zero input x[n]=0 yields a non-zero output y[n]=5." }
        ],
        numericals: [
            { q: "Perform the linear convolution of input sequence $x[n] = \\{1, 2, 1\\}$ and impulse response $h[n] = \\{1, -1\\}$. Write down the resulting output sequence $y[n]$.", steps: [
                "Determine length of output sequence: $L_y = L_x + L_h - 1 = 3 + 2 - 1 = 4$.",
                "Apply convolution sum: $y[n] = \\sum x[k]h[n-k]$ or use tabular method.",
                "Calculate terms: \n- $y[0] = x[0]h[0] = 1 \\times 1 = 1$\n- $y[1] = x[1]h[0] + x[0]h[1] = 2(1) + 1(-1) = 1$\n- $y[2] = x[2]h[0] + x[1]h[1] = 1(1) + 2(-1) = -1$\n- $y[3] = x[3]h[0] + x[2]h[1] = 0 + 1(-1) = -1$.",
                "Assemble result sequence: $y[n] = \\{1, 1, -1, -1\\}$."
            ], r: "y[n] = {1, 1, -1, -1}" }
        ],
        simType: "dsp"
    },
    networktheorems: {
        title: "Network Theorems",
        icon: "git-branch",
        category: "Circuit Analysis",
        intro: "Network Theorems provide systematic methods to analyze complex linear electrical networks, simplifying grids of passive components into easy-to-solve equivalent circuits.",
        theory: "Circuits are modeled using linear algebraic equations derived from Kirchhoff's Laws (KVL/KCL). **Thevenin's Theorem** simplifies any two-port linear network into a single voltage source in series with an impedance. **Superposition** allows linear networks with multiple sources to be solved by summing the individual responses of each source acting alone, with inactive sources replaced by their internal impedances (short circuit for voltage, open circuit for current).",
        working: "1. **Finding Thevenin Voltage ($V_{th}$):** Disconnect the load resistor and measure the open-circuit voltage across the terminals.\n2. **Finding Thevenin Resistance ($R_{th}$):** Turn off all independent sources and calculate the equivalent resistance looking into the load terminals.\n3. **Maximum Power Transfer:** Connect a load resistor equal to $R_{th}$ to maximize the power delivered to the load.",
        diagram: `
              Complex Linear Grid  ───►  [ Thevenin Equivalent ]
              (Resistors, Capacitors,    Series Resistor R_th
               multiple sources)         Voltage Source V_th ──► Load Resistor
        `,
        formulas: [
            { expr: "V_{\\text{th}} = V_{\\text{oc}} \\quad \\text{and} \\quad R_{\\text{th}} = \\frac{V_{\\text{oc}}}{I_{\\text{sc}}}", desc: "Thevenin Equivalent Parameters" },
            { expr: "P_{\\text{max}} = \\frac{V_{\\text{th}}^2}{4 R_{\\text{th}}} \\quad (\\text{when } R_L = R_{\\text{th}})", desc: "Maximum Power Transfer Theorem" },
            { expr: "I = \\sum_{i=1}^{M} I_i \\quad (\\text{individual source responses})", desc: "Superposition Current Theorem" }
        ],
        applications: [
            "Simplifying large electrical grids to analyze local loads.",
            "Matching antenna impedances to maximize RF power transfer.",
            "Biasing stages of transistor amplifiers."
        ],
        advantages: [
            "Reduces complex networks to a simple two-component equivalent circuit.",
            "Speeds up the analysis of circuits with variable loads.",
            "Superposition simplifies multi-source circuits without requiring large matrix math."
        ],
        disadvantages: [
            "Only applicable to linear circuits; cannot solve non-linear diode/transistor networks.",
            "Does not calculate power directly; power is non-linear and cannot be calculated using superposition.",
            "Requires active independent sources to be deactivated correctly."
        ],
        examQuestions: [
            { q: "State Thevenin's Theorem and detail the procedure to calculate $R_{th}$ when independent and dependent sources are present.", a: "Thevenin's Theorem states that any linear active bilateral network can be replaced by an equivalent circuit containing a single voltage source $V_{th}$ in series with an equivalent resistance $R_{th}$. When dependent sources are present, you cannot simply deactivate them. Instead, you turn off independent sources, apply a test source $v_x$ (usually 1V) at the terminals, and calculate $R_{th} = v_x / i_x$, where $i_x$ is the current drawn from the test source." },
            { q: "Prove that the maximum power transfer occurs when $R_L = R_{th}$.", a: "Power delivered to load is $P_L = I^2 R_L = \\left(\\frac{V_{th}}{R_{th} + R_L}\\right)^2 R_L$. To find maximum power, differentiate $P_L$ with respect to $R_L$ and set to zero: $\\frac{dP_L}{dR_L} = V_{th}^2 \\frac{(R_{th} + R_L)^2 - 2R_L(R_{th} + R_L)}{(R_{th} + R_L)^4} = 0$. This simplifies to $R_{th} + R_L - 2R_L = 0 \\implies R_L = R_{th}$." }
        ],
        mcqs: [
            { q: "When applying Superposition, a perfect independent current source is deactivated by replacing it with a:", opts: ["Short Circuit", "Open Circuit", "Resistor equal to load", "1V Voltage Source"], correct: 1, exp: "An ideal current source has infinite internal resistance, so it is replaced with an open circuit. Voltage sources have zero resistance and are replaced with a short circuit." },
            { q: "Under maximum power transfer conditions, what is the power efficiency of the system?", opts: ["100%", "75%", "50%", "25%"], correct: 2, exp: "Since R_Load = R_Source, half the voltage drops across the source resistance. Therefore, exactly 50% of the total power is lost as heat inside the source, yielding 50% efficiency." }
        ],
        numericals: [
            { q: "A circuit contains a 12V DC source connected in series with a resistor network. The open-circuit voltage across terminals A-B is measured as 8V. When terminals A-B are shorted, a current of 2A flows. Determine the Thevenin equivalent circuit and calculate the maximum power that can be delivered to a load connected across A-B.", steps: [
                "Find Thevenin voltage: $V_{th} = V_{oc} = 8\\text{ V}$.",
                "Calculate Thevenin resistance using short-circuit current: $R_{th} = \\frac{V_{oc}}{I_{sc}} = \\frac{8\\text{ V}}{2\\text{ A}} = 4\\ \\Omega$.",
                "Identify maximum power formula: $P_{max} = \\frac{V_{th}^2}{4 R_{th}}$.",
                "Substitute values: $P_{max} = \\frac{8^2}{4 \\times 4} = \\frac{64}{16} = 4\\text{ Watts}$."
            ], r: "Vth = 8V, Rth = 4Ω, Pmax = 4W" }
        ],
        simType: "networktheorems"
    },
    arm: {
        title: "ARM Architecture",
        icon: "cpu",
        category: "Processor Architecture",
        intro: "ARM (Advanced RISC Machine) is a high-performance RISC processor architecture that dominates modern mobile phones, embedded systems, and supercomputers due to its low power consumption and high processing efficiency.",
        theory: "ARM operates on Reduced Instruction Set Computer (RISC) principles. Key features include a large, uniform register file, a load-store architecture (data processing operations act only on registers, not directly on memory), simple addressing modes, and a barrel shifter that can shift operands before they reach the ALU. It supports 32-bit ARM instructions and 16-bit compressed Thumb instructions to optimize memory density.",
        working: "1. **Pipelining:** Instructions are processed in stages (Fetch, Decode, Execute), allowing multiple instructions to be processed simultaneously.\n2. **Load-Store Execution:** To add two numbers in RAM, the CPU first loads the values into registers using `LDR` instructions, performs the `ADD` in the ALU, and writes the result back to RAM using `STR`.\n3. **Conditional Execution:** Most ARM instructions can be executed conditionally based on status flags, reducing the need for branch instructions.",
        diagram: `
              Instruction Fetch ──►[ Pipeline Stage 1 ]
                                      │
              Instruction Decode ──►[ Pipeline Stage 2 ]
                                      │
              ALU/Execute ─────────►[ Pipeline Stage 3 ] ◄── Barrel Shifter Input
        `,
        formulas: [
            { expr: "\\text{CPI} = \\frac{\\text{Clock Cycles}}{\\text{Instructions Executed}}", desc: "Processor Cycles Per Instruction (CPI) Metric" },
            { expr: "\\text{MIPS} = \\frac{f_{\\text{clk}}}{\\text{CPI} \\cdot 10^6}", desc: "Processor Millions of Instructions Per Second (MIPS)" }
        ],
        applications: [
            "Smartphones and tablet application processors (Apple Silicon, Qualcomm Snapdragon).",
            "Microcontrollers for IoT devices (ARM Cortex-M series).",
            "Low-power automotive control units."
        ],
        advantages: [
            "High performance-per-watt efficiency, ideal for battery-powered devices.",
            "Load-store architecture simplifies compiler design and execution.",
            "Thumb mode optimizes code size in memory-constrained systems."
        ],
        disadvantages: [
            "RISC instructions require more lines of code than CISC (x86) to perform the same task.",
            "Requires careful pipeline hazard management in hardware.",
            "Assembly programming is more complex due to the load-store model."
        ],
        examQuestions: [
            { q: "Detail the register structure of ARM in User Mode.", a: "In User Mode, ARM has 16 visible 32-bit registers (R0 to R15). R0-R12 are general-purpose registers. R13 is the Stack Pointer (SP). R14 is the Link Register (LR), which stores return addresses for subroutines. R15 is the Program Counter (PC). It also includes the Current Program Status Register (CPSR) to store condition flags." },
            { q: "Explain the role of the Barrel Shifter in the ARM data path.", a: "The barrel shifter is an inline hardware block in the silicon data path. Before an operand enters the ALU, the barrel shifter can shift or rotate it by a specified number of bits in a single clock cycle. This allows operations like multiplication by powers of two to be executed inline with standard instructions." }
        ],
        mcqs: [
            { q: "Which ARM register functions as the Link Register (LR) in assembly subroutines?", opts: ["R12", "R13", "R14", "R15"], correct: 2, exp: "R14 is the Link Register (LR), R13 is the Stack Pointer (SP), and R15 is the Program Counter (PC)." },
            { q: "ARM's load-store architecture means that:", opts: ["Memory can be directly modified by ALU operations", "ALU operations can only act on register inputs", "Register inputs are loaded automatically from flash ROM", "Input/output ports are mapped to fixed memory locations"], correct: 1, exp: "In RISC, data processing operations cannot access memory directly. Data must be loaded into registers first, processed, and then stored back." }
        ],
        numericals: [
            { q: "An ARM processor operates at a clock frequency of 2.0 GHz. If a benchmark program containing 5 million instructions executes in 5 milliseconds, calculate the average Cycles Per Instruction (CPI) and the processor performance in MIPS.", steps: [
                "Calculate total clock cycles: $\\text{Cycles} = f \\cdot \\text{Time} = 2.0 \\times 10^9\\text{ Hz} \\times 5 \\times 10^{-3}\\text{ s} = 10^7\\text{ cycles}$.",
                "Apply CPI formula: $\\text{CPI} = \\frac{\\text{Clock Cycles}}{\\text{Instructions}} = \\frac{10^7}{5 \\times 10^6} = 2.0$ cycles/instruction.",
                "Calculate MIPS performance: $\\text{MIPS} = \\frac{f_{\\text{clk}}}{\\text{CPI} \\cdot 10^6} = \\frac{2.0 \\times 10^9}{2.0 \\times 10^6} = 1000\\text{ MIPS}$."
            ], r: "CPI = 2.0, Performance = 1000 MIPS" }
        ],
        simType: "arm"
    },
    rtos: {
        title: "RTOS Fundamentals",
        icon: "clock",
        category: "Processor Architecture",
        intro: "A Real-Time Operating System (RTOS) is a specialized operating system designed to run embedded software under strict timing constraints, ensuring critical tasks are executed deterministically.",
        theory: "Unlike standard operating systems (like Windows or macOS) which prioritize average throughput, an RTOS prioritizes **predictability and determinism**. The kernel uses preemptive priority scheduling to immediately switch execution to the highest priority task when triggered. Key concepts include Context Switching, Task States (Running, Ready, Blocked), Semaphores/Mutexes for resource management, and Inter-Task Communication queues.",
        working: "1. **Preemptive Scheduling:** When a high-priority task is unblocked, the scheduler saves the CPU registers of the current task (context switch) and starts executing the high-priority task.\n2. **Rate Monotonic Scheduling (RMS):** A fixed-priority scheduling algorithm where tasks with shorter execution periods are assigned higher priorities.\n3. **Mutex Lock:** A task locks a shared hardware resource (like a UART port) using a Mutex, preventing other tasks from accessing it until released.",
        diagram: `
              Task 1 (Ready) ──────┐
                                   ├───►[ RTOS Scheduler ]───► Executes Task 2 (Highest Priority)
              Task 2 (Running) ────┘
        `,
        formulas: [
            { expr: "U = \\sum_{i=1}^{M} \\frac{C_i}{T_i}", desc: "CPU Processor Utilization Factor ($U$)" },
            { expr: "U \\le M(2^{1/M} - 1)", desc: "Rate Monotonic Scheduling (RMS) Schedulability Bound" }
        ],
        applications: [
            "Automotive engine control units and anti-lock braking systems.",
            "Industrial automation, robotics controllers, and smart SCADA nodes.",
            "Medical pacemakers, ventilators, and drug delivery pumps."
        ],
        advantages: [
            "Guarantees deterministic task execution, meeting critical deadlines.",
            "Saves development time by modularizing complex software into tasks.",
            "Improves system reliability with built-in watchdog timers and memory protection."
        ],
        disadvantages: [
            "Introduces CPU overhead due to frequent context switches.",
            "Increases code size and memory footprint in small microcontrollers.",
            "Prone to complex bugs like deadlocks and priority inversions."
        ],
        examQuestions: [
            { q: "What is Priority Inversion in RTOS, and how is it resolved?", a: "Priority inversion occurs when a low-priority task holds a shared resource needed by a high-priority task, and a medium-priority task preempts the low-priority task. This indirectly delays the high-priority task. It is resolved using **Priority Inheritance**, where the task holding the resource temporarily inherits the priority of the high-priority task waiting for it." },
            { q: "State the Rate Monotonic Scheduling (RMS) schedulability criteria.", a: "RMS is a fixed-priority algorithm where priority is inversely proportional to the task period. A set of $M$ independent periodic tasks is guaranteed to be schedulable if the total CPU utilization $U = \\sum C_i/T_i$ is less than or equal to the Liu and Layland bound: $U \\le M(2^{1/M} - 1)$. As $M \\to \\infty$, the utilization limit converges to $\\ln(2) \\approx 69.3\\%$." }
        ],
        mcqs: [
            { q: "Which task state represents a task waiting for a semaphore or timer delay?", opts: ["Running State", "Ready State", "Blocked State", "Suspended State"], correct: 2, exp: "Tasks waiting for external events or resource unlocks enter the Blocked state, allowing the scheduler to run ready tasks." },
            { q: "Hard real-time systems differ from soft real-time systems because:", opts: ["They run at higher clock speeds", "Missing a deadline is considered a catastrophic system failure", "They do not support preemptive scheduling", "They use larger memory spaces"], correct: 1, exp: "In hard real-time systems (e.g. pacemakers, airbags), missing a single deadline constitutes system failure. Soft systems tolerate occasional misses." }
        ],
        numericals: [
            { q: "A system runs two periodic RTOS tasks: Task 1 has execution time $C_1 = 1\\text{ ms}$ and period $T_1 = 4\\text{ ms}$; Task 2 has execution time $C_2 = 2\\text{ ms}$ and period $T_2 = 5\\text{ ms}$. Calculate the CPU utilization factor $U$, and verify if the task set is guaranteed to be schedulable under Rate Monotonic Scheduling.", steps: [
                "Calculate individual utilizations: $U_1 = \\frac{C_1}{T_1} = \\frac{1}{4} = 0.25$; $U_2 = \\frac{C_2}{T_2} = \\frac{2}{5} = 0.40$.",
                "Calculate total utilization: $U = U_1 + U_2 = 0.25 + 0.40 = 0.65$ (or $65\\%$).",
                "Identify RMS bound for $M = 2$ tasks: $U_{bound} = 2(2^{1/2} - 1) = 2(\\sqrt{2} - 1) \\approx 2(1.414 - 1) = 0.828$ (or $82.8\\%$).",
                "Evaluate schedulability: Since $U = 0.65 \\le U_{bound} = 0.828$, the task set is guaranteed to be schedulable under RMS."
            ], r: "U = 0.65, Schedulable: YES" }
        ],
        simType: "rtos"
    },
    vlsi: {
        title: "CMOS and VLSI Design",
        icon: "layout",
        category: "Micro-electronics",
        intro: "Very Large Scale Integration (VLSI) enables billions of microscopic silicon transistors to be integrated onto a single microchip. CMOS technology utilizes complementary pairs of PMOS and NMOS transistors to build high-density, low-power digital circuits.",
        theory: "A static CMOS gate combines a Pull-Up Network (PUN) of PMOS transistors with a Pull-Down Network (PDN) of NMOS transistors. The PUN connects the output to $V_{DD}$ when inputs are low, and the PDN pulls the output to $GND$ when inputs are high, preventing DC current from flowing from $V_{DD}$ to ground. Silicon layouts are governed by Lambda-based design rules to prevent manufacturing defects during lithography.",
        working: "1. **CMOS Inverter:** A single PMOS (top) and NMOS (bottom) share a gate input. If the input is $0\\text{ V}$, the NMOS is OFF and PMOS is ON, pulling the output to $V_{DD}$. If input is $V_{DD}$, the NMOS is ON and PMOS is OFF, pulling output to $0\\text{ V}$.\n2. **Voltage Transfer Characteristics (VTC):** A plot of $V_{out}$ vs $V_{in}$ outlines noise margins and the switching threshold ($V_{sp}$).\n3. **Fabrication Lithography:** Circuit schematics are translated into physical layouts, which are then etched into silicon wafers using optical masks.",
        diagram: `
                    Power Supply (V_DD)
                            │
                    [ Pull-Up (PMOS) ]
                            │
             Input ─────────┼───────── Output (Y)
                            │
                   [ Pull-Down (NMOS) ]
                            │
                       Ground (GND)
        `,
        formulas: [
            { expr: "V_{\\text{sp}} \\approx \\frac{V_{DD} + V_{tp} + V_{tn}\\sqrt{r}}{1 + \\sqrt{r}} \\quad \\text{where } r = \\frac{\\mu_n W_n L_p}{\\mu_p W_p L_n}", desc: "CMOS Inverter Switching Threshold Potential ($V_{sp}$)" },
            { expr: "t_{\\text{pd}} \\approx 0.69 \\cdot R_{\\text{eq}} \\cdot C_L", desc: "CMOS Logic Gate Propagation Delay Estimator" },
            { expr: "P_{\\text{dynamic}} = \\alpha \\cdot C_L \\cdot V_{DD}^2 \\cdot f", desc: "Dynamic CMOS Logic Power Consumption" }
        ],
        applications: [
            "Fabricating microprocessors, RAM, and graphics cards.",
            "Designing System-on-Chip (SoC) architectures for smartphones.",
            "Application-Specific Integrated Circuits (ASICs) for cryptographic processing."
        ],
        advantages: [
            "Extremely low static power consumption (idle gates consume near-zero power).",
            "High packaging density on silicon.",
            "High noise margins ($NM_L$ and $NM_H$) protect signals from voltage ripples."
        ],
        disadvantages: [
            "High initial Mask and fabrication startup costs (NRE).",
            "Prone to latch-up (parasitic thyristor firing) if not isolated.",
            "Leakage currents become significant in sub-7nm silicon nodes."
        ],
        examQuestions: [
            { q: "What is Latch-up in CMOS integrated circuits, and how is it prevented?", a: "Latch-up is the creation of low-impedance paths between $V_{DD}$ and $GND$ due to parasitic PNP and NPN transistors forming a silicon thyristor. If triggered by noise, it causes short circuits. It is prevented by adding highly doped guard rings around transistors and increasing the spacing between NMOS and PMOS devices." },
            { q: "Why must the PMOS transistor width be larger than the NMOS transistor width in a symmetric CMOS inverter?", a: "In silicon, electron mobility (NMOS) is approximately 2 to 3 times higher than hole mobility (PMOS). To achieve equal drive currents and symmetric switching delays ($t_{pLH} = t_{pHL}$), the PMOS transistor must be made wider ($W_p \\approx 2.5 \\cdot W_n$) to compensate for the lower mobility." }
        ],
        mcqs: [
            { q: "In a static CMOS logic gate, NMOS transistors are always placed in which network?", opts: ["Pull-Up Network", "Pull-Down Network", "Feedback Loop Network", "Pass-Gate Array"], correct: 1, exp: "NMOS transistors pass strong zeros and are placed in the Pull-Down Network. PMOS transistors pass strong ones and form the Pull-Up Network." },
            { q: "Lambda (λ) based layout design rules are used to:", opts: ["Calculate gate delay", "Ensure scalable physical masks across different fabrication nodes", "Define doping concentrations", "Minimize static leakage current"], correct: 1, exp: "Lambda rules define layout dimensions in terms of a scalable parameter λ, allowing physical designs to easily scale as fabrication technologies advance." }
        ],
        numericals: [
            { q: "A CMOS inverter driving a load capacitance of $C_L = 50\\text{ fF}$ operates at a supply voltage $V_{DD} = 1.0\\text{ V}$ and a clock frequency $f = 1.0\\text{ GHz}$. If the logic gate switching activity factor is $\\alpha = 0.1$, calculate the dynamic power consumption of the logic gate.", steps: [
                "Identify dynamic power equation: $P_{\\text{dynamic}} = \\alpha \\cdot C_L \\cdot V_{DD}^2 \\cdot f$.",
                "Substitute values: $\\alpha = 0.1$, $C_L = 50 \\times 10^{-15}\\text{ F}$, $V_{DD} = 1.0\\text{ V}$, $f = 1.0 \\times 10^9\\text{ Hz}$.",
                "Multiply terms: $P = 0.1 \\times (50 \\times 10^{-15}) \\times 1.0^2 \\times 10^9$.",
                "Simplify: $P = 5 \\times 10^{-15} \\times 10^9 = 5 \\times 10^{-6}\\text{ Watts} = 5\\ \\mu\\text{W}$."
            ], r: "P_dynamic = 5.0 µW" }
        ],
        simType: "vlsi"
    },
    maths: {
        title: "Engineering Mathematics for ECE",
        icon: "calculator",
        category: "Academic Core",
        intro: "Engineering Mathematics provides the foundational analytical tools for modeling physical systems, processing signals, and solving electromagnetic vector fields.",
        theory: "Electronic engineering models physical variables (such as voltage, current, and wave vectors) using linear differential equations, complex vector spaces, and matrix algebra. Key mathematical domains include **Linear Algebra** (matrix decompositions, Eigenvalues), **Differential Equations** (modeling circuit transients), **Complex Variables** (phasor transforms, residue theorem), and **Probability & Random Processes** (modeling channel noise).",
        working: "1. **Eigenvalue Decomposition:** Determines the natural resonant modes and stable states of complex circuit networks.\n2. **Linear Systems Analysis:** Transforms differential equations into algebraic equations using Laplace or Fourier techniques.\n3. **Random Variable Mapping:** Models thermal noise using Gaussian distributions to calculate bit error rates.",
        diagram: `
              Differential Equations  ──►[ Integral Transforms ]──► Linear Algebra
              (Time Domain)               (s / z Domains)         (Solved algebraic vectors)
        `,
        formulas: [
            { expr: "\\det(A - \\lambda I) = 0", desc: "Characteristic Equation for Eigenvalue Determination" },
            { expr: "f_X(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}", desc: "Gaussian (Normal) Probability Density Function modeling thermal channel noise" },
            { expr: "e^{j \\theta} = \\cos\\theta + j \\sin\\theta", desc: "Euler's Formula transforming vector coordinate spaces" }
        ],
        applications: [
            "Calculating resonant modes of RLC filters and antenna arrays.",
            "Analyzing thermal and quantization noise distributions.",
            "Solving multi-variable state equations in robotics control systems."
        ],
        advantages: [
            "Allows precise, quantitative analysis of physical systems.",
            "Transforms complex calculus into solvable algebraic steps.",
            "Forms the foundation of all DSP and modern communications algorithms."
        ],
        disadvantages: [
            "Ideal models can oversimplify non-linear physical systems.",
            "Analytical solutions are difficult to calculate for high-order networks.",
            "Requires floating-point processors for numerical computation."
        ],
        examQuestions: [
            { q: "Find the Eigenvalues of the 2x2 system matrix $A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}$. Describe what they represent in a resonant circuit.", a: "Set up the characteristic equation: $\\det(A - \\lambda I) = \\det\\begin{bmatrix} 2-\\lambda & 1 \\\\ 1 & 2-\\lambda \\end{bmatrix} = (2-\\lambda)^2 - 1 = 0$. This simplifies to $\\lambda^2 - 4\\lambda + 3 = 0$, yielding $\\lambda_1 = 1, \\lambda_2 = 3$. In a resonant circuit, these represent the natural frequencies of oscillation." },
            { q: "Explain the physical significance of the Central Limit Theorem in communication engineering.", a: "The Central Limit Theorem states that the sum of a large number of independent and identically distributed random variables approaches a Gaussian distribution, regardless of their original distribution. This explains why thermal noise in electronic circuits is modeled as White Gaussian Noise (AWGN)." }
        ],
        mcqs: [
            { q: "Which mathematical transform is best suited for analyzing discrete-time LTI systems?", opts: ["Fourier Series", "Laplace Transform", "Z-Transform", "Hankel Transform"], correct: 2, exp: "The Z-transform is the discrete-time equivalent of the Laplace transform, ideal for difference equations." },
            { q: "If two events A and B are statistically independent, their joint probability P(A ∩ B) is:", opts: ["P(A) + P(B)", "P(A) * P(B)", "P(A) / P(B)", "P(A | B)"], correct: 1, exp: "For independent events, the probability of both occurring is the product of their individual probabilities." }
        ],
        numericals: [
            { q: "A linear RLC circuit is modeled by the differential equation $\\frac{d^2 y(t)}{dt^2} + 3 \\frac{dy(t)}{dt} + 2 y(t) = x(t)$. Solve for the transfer function $H(s) = \\frac{Y(s)}{X(s)}$ in the s-domain, assuming zero initial conditions.", steps: [
                "Apply the Laplace Transform to both sides, utilizing the derivative property: $\\mathcal{L}\\{\\frac{d^n y}{dt^n}\\} = s^n Y(s)$.",
                "Transform terms: $s^2 Y(s) + 3s Y(s) + 2 Y(s) = X(s)$.",
                "Factor out $Y(s)$: $Y(s)(s^2 + 3s + 2) = X(s)$.",
                "Solve for the ratio: $H(s) = \\frac{Y(s)}{X(s)} = \\frac{1}{s^2 + 3s + 2}$."
            ], r: "H(s) = 1 / (s^2 + 3s + 2)" }
        ],
        simType: "maths"
    },
    handbook: {
        title: "Formula Handbook",
        icon: "book-open",
        category: "Cheat Sheets",
        intro: "The Formula Handbook serves as a rapid cheat sheet, providing quick access to essential mathematical formulas and equations used in modern electronics engineering.",
        theory: "This handbook acts as an interactive calculator, allowing students to select equations and solve numerical values instantly. Topics cover semiconductors, network theorems, and signal processing.",
        working: "1. **Equation Selection:** Select the target formula pill in the explorer panel.\n2. **Parameter Input:** Enter values for variables (e.g. resistance, capacitance, frequency).\n3. **Instant Computation:** The engine computes the result instantly, displaying step-by-step solved formulas.",
        diagram: `
              Select Formula ──►[ Input Variables ] ──►[ Instant Numerical Result ]
        `,
        formulas: [
            { expr: "f_{\\text{cutoff}} = \\frac{1}{2\\pi R C}", desc: "First-Order RC Filter Cutoff Frequency" },
            { expr: "R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}", desc: "Parallel Resistor Equivalence Equation" },
            { expr: "\\lambda = \\frac{c}{f}", desc: "Electromagnetic Wave-Length Equation" }
        ],
        applications: [
            "Quick reference sheet during lab experiments.",
            "Exam preparation and formula memorization.",
            "Rapid hardware prototype parameter estimation."
        ],
        advantages: [
            "Consolidates formulas from multiple ECE subjects into a single view.",
            "Provides interactive calculators to verify homework answers.",
            "High-contrast KaTeX formula cards enhance readability."
        ],
        disadvantages: [
            "Does not replace deep theoretical study.",
            "Limited to analytical standard formulas.",
            "Requires active user parameters to solve values."
        ],
        examQuestions: [
            { q: "What is the relationship between wavelength, frequency, and wave propagation speed?", a: "Wavelength ($\\lambda$) is inversely proportional to frequency ($f$), related by propagation speed ($v$): $\\lambda = v/f$. For electromagnetic waves in a vacuum, $v = c \\approx 3 \\times 10^8\\text{ m/s}$." }
        ],
        mcqs: [
            { q: "If you double the frequency of an EM wave in a vacuum, its wavelength will:", opts: ["Double", "Halve", "Quadruple", "Remain Constant"], correct: 1, exp: "Since wavelength is inversely proportional to frequency, doubling the frequency halves the wavelength." }
        ],
        numericals: [
            { q: "Calculate the cutoff frequency of a low-pass RC filter containing a $10\\text{ k}\\Omega$ resistor and a $100\\text{ nF}$ capacitor.", steps: [
                "Apply formula: $f_c = \\frac{1}{2\\pi R C}$.",
                "Substitute values: $R = 10^4\\ \\Omega$, $C = 100 \\times 10^{-9}\\text{ F} = 10^{-7}\\text{ F}$.",
                "Calculate product: $RC = 10^{-3}$ seconds.",
                "Calculate frequency: $f_c = \\frac{1}{2\\pi \\cdot 10^{-3}} = \\frac{1000}{2\\pi} \\approx 159.15\\text{ Hz}$."
            ], r: "fc = 159.15 Hz" }
        ],
        simType: "handbook"
    },
    interview: {
        title: "Interview Preparation",
        icon: "briefcase",
        category: "Career Prep",
        intro: "Interview Preparation provides curated technical questions, conceptual answers, and industrial flashcards to help ECE graduates secure engineering roles in semiconductor and hardware companies.",
        theory: "Technical interviews test core fundamentals rather than rote memorization. Questions focus on transistor physics, digital logic, signal processing, and embedded systems architecture. Developing structured, step-by-step problem-solving methods is key to passing these technical rounds.",
        working: "1. **Flashcard Review:** Read through the curated questions grouped by ECE subject.\n2. **Concept Mastery:** Study model answers explaining the underlying engineering principles.\n3. **Practice Problems:** Solve technical problems to prepare for whiteboarding sessions.",
        diagram: `
              Read Question ──►[ Formulate Solution ] ──►[ Study Model Answer & Diagrams ]
        `,
        formulas: [
            { expr: "\\text{Margin} = T_{\\text{clock}} - (t_{pd} + t_{\\text{setup}} + t_{\\text{skew}})", desc: "Setup Time Slack Margin Equation for Sequential Paths" }
        ],
        applications: [
            "Preparing for campus placement drives and job interviews.",
            "Reviewing core ECE concepts before industrial exams.",
            "Practicing coding and design questions for embedded software roles."
        ],
        advantages: [
            "Consolidates common interview questions into a single resource.",
            "Provides clear model answers with visual diagrams.",
            "Includes solved numerical problems for coding rounds."
        ],
        disadvantages: [
            "Cannot replace comprehensive textbook study.",
            "Does not cover behavioral or HR interview rounds.",
            "Questions must be updated periodically to match industrial trends."
        ],
        examQuestions: [
            { q: "What is setup time and hold time in sequential digital systems?", a: "Setup time is the minimum time before the clock edge during which data must remain stable. Hold time is the minimum time after the clock edge during which data must remain stable. Violating these timing windows causes metastability." }
        ],
        mcqs: [
            { q: "In a digital design, setup time violations are typically fixed by:", opts: ["Increasing the clock frequency", "Decreasing the clock frequency", "Reducing the supply voltage", "Adding more registers"], correct: 1, exp: "Decreasing the clock frequency increases the clock period, giving data more time to propagate and settle before the next clock edge." }
        ],
        numericals: [
            { q: "A sequential path has a clock period of $10\\text{ ns}$. The flip-flop propagation delay is $2\\text{ ns}$, combinational path delay is $6\\text{ ns}$, and setup time is $1\\text{ ns}$. Calculate the setup time slack margin.", steps: [
                "Identify setup slack equation: $\\text{Slack} = T_{\\text{clock}} - (t_{pd} + t_{\\text{comb}} + t_{\\text{setup}})$.",
                "Substitute values: $T_{\\text{clock}} = 10\\text{ ns}$, $t_{pd} = 2\\text{ ns}$, $t_{comb} = 6\\text{ ns}$, $t_{setup} = 1\\text{ ns}$.",
                "Calculate: $\\text{Slack} = 10 - (2 + 6 + 1) = 10 - 9 = 1\\text{ ns}$.",
                "Result: A positive slack of $1\\text{ ns}$ means the path meets the setup timing constraint."
            ], r: "Slack = 1.0 ns (MET)" }
        ],
        simType: "interview"
    },
    projects: {
        title: "Mini Projects & Lab Manuals",
        icon: "flask",
        category: "Practical Lab",
        intro: "Mini Projects & Lab Manuals provide step-by-step schematics, Bill of Materials, and firmware source code blocks for building real-world microcontroller projects, helping students bridge the gap between classroom theory and practical engineering.",
        theory: "Building practical systems involves working within real-world engineering constraints: power efficiency, component tolerances, and processor limitations. Projects cover sensor interfacing, wireless data transmission, and closed-loop control algorithms.",
        working: "1. **Schematic Design:** Review circuit schematics to understand how components are wired together.\n2. **Component Sourcing:** Review the Bill of Materials to source the necessary components.\n3. **Firmware Compilation:** Load the provided code blocks onto your microcontroller to bring the project to life.",
        diagram: `
              Assemble Hardware ──►[ Compile Firmware ] ──►[ Deploy & Test Real-World System ]
        `,
        formulas: [
            { expr: "V_{\\text{out}} = V_{\\text{in}} \\cdot \\left( 1 + \\frac{R_f}{R_1} \\right)", desc: "Amplifier Gain Equation for Sensor Interfacing" }
        ],
        applications: [
            "Developing capstone and semester mini projects.",
            "Building hardware prototypes in electronics clubs.",
            "Gaining practical experience for resume building."
        ],
        advantages: [
            "Provides fully tested hardware schematics and code blocks.",
            "Teaches practical troubleshooting and debugging skills.",
            "Covers popular microcontrollers like Arduino and ESP32."
        ],
        disadvantages: [
            "Requires physical components to build projects.",
            "Prone to assembly and wiring errors during breadboarding.",
            "Requires basic tools like a soldering iron and multimeter."
        ],
        examQuestions: [
            { q: "How do you interface an analog temperature sensor with a 10-bit ADC microcontroller?", a: "Connect the sensor's analog output to an ADC input pin. The microcontroller samples the voltage, converting it to a digital value between 0 and 1023. This value is mapped back to temperature using the sensor's calibration formula: $T = V_{out} / \\text{scale factor}$." }
        ],
        mcqs: [
            { q: "Which serial protocol is best suited for connecting multiple sensors over short distances using only two wires?", opts: ["SPI", "UART", "I2C", "RS232"], correct: 2, exp: "I2C (Inter-Integrated Circuit) uses only two wires (SDA and SCL) to support multiple master and slave devices on the same bus." }
        ],
        numericals: [
            { q: "A microcontroller with a 5V supply and a 10-bit ADC reads an analog voltage from a sensor. If the ADC output value is 512, calculate the input voltage.", steps: [
                "Identify ADC voltage equation: $V_{in} = \\frac{\\text{ADC Output}}{2^n - 1} \\cdot V_{ref}$.",
                "Substitute values: $\\text{ADC Output} = 512$, $n = 10\\text{ bits}$, $V_{ref} = 5\\text{ V}$.",
                "Calculate denominator: $2^{10} - 1 = 1023$.",
                "Solve: $V_{in} = \\frac{512}{1023} \\cdot 5 = 0.5005 \\cdot 5 \\approx 2.502\\text{ V}$."
            ], r: "Vin = 2.50 V" }
        ],
        simType: "projects"
    }
};
