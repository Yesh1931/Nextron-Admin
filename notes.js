/**
 * Nextron — Notes Hub: Comprehensive Study Resources Center
 * ES Module view: render / mount / unmount
 * Route: #/notes
 *
 * Sections:
 *   1. Notes Dashboard — stats cards with animated counters
 *   2. Subject-Wise Notes — expandable cards with chapters, formulas, tips
 *   3. Formula Sheets — accordion panels grouped by subject
 *   4. Quick Revision Guides — condensed exam-prep mode
 *   5. Searchable Glossary — real-time filtering across all content
 */

import { AppState } from './app.js';
import { GLOSSARY } from './database.js';

// ─── NOTES DATA ───────────────────────────────────────────────────────────────
const NOTES_DATA = [
    {
        id: 'signals',
        title: 'Signals & Systems',
        icon: '📡',
        category: 'Signal Processing',
        color: '#06b6d4',
        route: '#/concept/signals',
        chapters: [
            {
                title: 'Signal Classification',
                content: 'Signals are classified as continuous-time (CT) or discrete-time (DT), periodic or aperiodic, deterministic or random, and energy or power signals. A CT signal x(t) is periodic if x(t) = x(t+T) for all t, where T is the fundamental period. Energy signals have finite total energy and zero average power, while power signals have finite average power and infinite total energy.'
            },
            {
                title: 'Fourier Series & Transform',
                content: 'Any periodic signal can be decomposed into a sum of sinusoidal harmonics using the Fourier Series. The Fourier Transform extends this to aperiodic signals, mapping time-domain signals to frequency-domain representations. The inverse transform reconstructs the original signal. Key properties include linearity, time-shifting, frequency-shifting, convolution, and Parseval\'s theorem.'
            },
            {
                title: 'Laplace Transform',
                content: 'The Laplace Transform converts differential equations into algebraic equations in the s-domain (s = σ + jω). It generalizes the Fourier Transform by including a convergence factor e^(-σt). The Region of Convergence (ROC) determines system stability — a causal LTI system is BIBO stable if all poles lie in the left half of the s-plane.'
            },
            {
                title: 'Convolution & LTI Systems',
                content: 'The output of a Linear Time-Invariant system is the convolution of the input with the system\'s impulse response: y(t) = x(t) * h(t). In the frequency domain, convolution becomes multiplication: Y(ω) = X(ω)·H(ω). This is the foundation of all filter design and signal processing.'
            },
            {
                title: 'Sampling Theorem',
                content: 'The Nyquist-Shannon sampling theorem states that a bandlimited signal with maximum frequency f_max can be perfectly reconstructed from its samples if the sampling rate f_s ≥ 2·f_max. Sampling below this rate causes aliasing — frequency components fold over and corrupt the signal irreversibly.'
            }
        ],
        formulas: [
            {
                expr: 'x(t) = \\sum_{n=-\\infty}^{\\infty} c_n \\cdot e^{j n \\omega_0 t}',
                desc: 'Exponential Fourier Series',
                variables: [
                    'x(t) = Time-domain continuous periodic signal',
                    'c_n = Complex Fourier coefficient representing amplitude & phase of the n-th harmonic',
                    '\\omega_0 = Fundamental angular frequency (2\\pi/T_0)',
                    'n = Harmonic index (integer from -\\infty to +\\infty)'
                ],
                explanation: 'Decomposes any periodic signal into a sum of harmonically related complex exponentials, showing the exact spectral components of the waveform.',
                example: {
                    inputs: 'c_0 = 1.5V, c_1 = c_{-1}^* = 0.5e^{-j\\pi/4}V, \\omega_0 = 100\\pi\\text{ rad/s}',
                    steps: 'x(t) = 1.5 + 0.5e^{j(100\\pi t - \\pi/4)} + 0.5e^{-j(100\\pi t - \\pi/4)} = 1.5 + \\cos(100\\pi t - \\pi/4)',
                    result: 'x(t) = 1.5 + \\cos(100\\pi t - \\frac{\\pi}{4})\\text{ V}'
                }
            },
            {
                expr: 'X(\\omega) = \\int_{-\\infty}^{\\infty} x(t) \\cdot e^{-j \\omega t} dt',
                desc: 'Continuous Fourier Transform (CTFT)',
                variables: [
                    'X(\\omega) = Frequency-domain continuous spectrum (spectral density)',
                    'x(t) = Continuous time-domain aperiodic signal',
                    '\\omega = Continuous angular frequency (rad/s)'
                ],
                explanation: 'Transforms a continuous time-domain aperiodic signal into its continuous frequency spectrum, outlining its spectral densities.',
                example: {
                    inputs: 'x(t) = e^{-3t} \\cdot u(t) \\quad \\text{(causal exponential pulse)}',
                    steps: 'X(\\omega) = \\int_{0}^{\\infty} e^{-3t} e^{-j\\omega t} dt = \\int_{0}^{\\infty} e^{-(3+j\\omega)t} dt = \\left[ \\frac{e^{-(3+j\\omega)t}}{-(3+j\\omega)} \\right]_0^{\\infty}',
                    result: 'X(\\omega) = \\frac{1}{3 + j\\omega}'
                }
            },
            {
                expr: 'X(s) = \\int_{0}^{\\infty} x(t) \\cdot e^{-s t} dt',
                desc: 'Unilateral Laplace Transform',
                variables: [
                    'X(s) = Complex s-domain transfer response representation',
                    'x(t) = Causal continuous-time signal (defined for t \\ge 0)',
                    's = Complex frequency variable s = \\sigma + j\\omega'
                ],
                explanation: 'Maps causal time signals to the s-plane, converting complex differential equations into solvable linear algebraic expressions.',
                example: {
                    inputs: 'x(t) = e^{-2t} \\cdot u(t)',
                    steps: 'X(s) = \\int_{0}^{\\infty} e^{-2t} e^{-st} dt = \\int_{0}^{\\infty} e^{-(s+2)t} dt = \\frac{1}{s+2} \\quad \\text{for } \\text{Re}(s) > -2',
                    result: 'X(s) = \\frac{1}{s + 2} \\quad (\\text{ROC}: \\text{Re}(s) > -2)'
                }
            },
            {
                expr: 'y(t) = x(t) * h(t) = \\int_{-\\infty}^{\\infty} x(\\tau) \\cdot h(t - \\tau) d\\tau',
                desc: 'Continuous-Time Convolution Integral',
                variables: [
                    'y(t) = Total output response of the system',
                    'x(t) = Time-domain input excitation signal',
                    'h(t) = System impulse response',
                    '\\tau = Dummy variable for time-shifting integration'
                ],
                explanation: 'Calculates the zero-state output of a linear time-invariant (LTI) system by integrating the input with the system impulse response.',
                example: {
                    inputs: 'x(t) = u(t), h(t) = e^{-t} \\cdot u(t)',
                    steps: 'y(t) = \\int_{0}^{t} 1 \\cdot e^{-(t-\\tau)} d\\tau = e^{-t} \\int_{0}^{t} e^{\\tau} d\\tau = e^{-t}(e^t - 1)',
                    result: 'y(t) = (1 - e^{-t}) \\cdot u(t)'
                }
            },
            {
                expr: 'f_s \\ge 2 \\cdot f_{\\text{max}}',
                desc: 'Nyquist Sampling Criterion',
                variables: [
                    'f_s = Sampling rate or sampling frequency (Hz)',
                    'f_{\\text{max}} = Highest frequency component contained in the analog signal (Hz)'
                ],
                explanation: 'Determines the minimum rate required to sample a bandlimited continuous signal so that it can be perfectly reconstructed without aliasing distortion.',
                example: {
                    inputs: 'f_{\\text{max}} = 20\\text{ kHz} \\quad \\text{(High-fidelity audio limit)}',
                    steps: 'f_{s,\\text{min}} = 2 \\times 20,000\\text{ Hz}',
                    result: 'f_s \\ge 40\\text{ kHz} \\quad (\\text{CD Standard is } 44.1\\text{ kHz})'
                }
            },
            {
                expr: 'E = \\int_{-\\infty}^{\\infty} |x(t)|^2 dt',
                desc: 'Continuous Signal Energy',
                variables: [
                    'E = Total signal energy (Joules)',
                    'x(t) = Continuous-time voltage or current signal'
                ],
                explanation: 'Measures the total physical energy dissipated across a 1-Ohm normalized resistor over infinite time.',
                example: {
                    inputs: 'x(t) = 5 \\cdot e^{-3t} \\cdot u(t)\\text{ V}',
                    steps: 'E = \\int_{0}^{\\infty} (5e^{-3t})^2 dt = 25 \\int_{0}^{\\infty} e^{-6t} dt = 25 \\left[ \\frac{e^{-6t}}{-6} \\right]_0^{\\infty} = \\frac{25}{6}',
                    result: 'E = 4.17\\text{ Joules}'
                }
            },
            {
                expr: 'P = \\lim_{T \\to \\infty} \\frac{1}{2T} \\int_{-T}^{T} |x(t)|^2 dt',
                desc: 'Continuous Signal Power',
                variables: [
                    'P = Average signal power (Watts)',
                    'x(t) = Infinite time-varying continuous signal'
                ],
                explanation: 'Computes the average rate of energy dissipation of power-type signals (e.g. periodic waves) over an infinite timeline.',
                example: {
                    inputs: 'x(t) = A \\cdot \\sin(\\omega_0 t) = 10 \\cdot \\sin(2\\pi t)\\text{ V}',
                    steps: 'P = \\frac{1}{T_0} \\int_{0}^{T_0} 100\\sin^2(2\\pi t) dt = \\frac{100}{1} \\int_{0}^{1} \\frac{1 - \\cos(4\\pi t)}{2} dt = 50',
                    result: 'P = 50\\text{ Watts} \\quad (\\text{or } V_{\\text{RMS}}^2 = (10/\\sqrt{2})^2 = 50\\text{W})'
                }
            }
        ],
        revision: [
            'Fourier Series: periodic signals → sum of harmonics (cₙ coefficients)',
            'Fourier Transform: aperiodic signals → continuous frequency spectrum',
            'Laplace: check ROC for stability — poles must be in left half-plane',
            'Convolution in time = multiplication in frequency (and vice versa)',
            'Nyquist rate = 2 × highest frequency component',
            'Parseval\'s theorem: energy in time domain = energy in frequency domain',
            'Common mistake: forgetting ROC when computing inverse Laplace'
        ]
    },
    {
        id: 'networks',
        title: 'Network Theory',
        icon: '🔌',
        category: 'Circuit Analysis',
        color: '#10b981',
        route: '#/concept/networks',
        chapters: [
            {
                title: 'KVL & KCL Fundamentals',
                content: 'Kirchhoff\'s Voltage Law (KVL): The algebraic sum of all voltages around any closed loop in a circuit equals zero. Kirchhoff\'s Current Law (KCL): The algebraic sum of all currents entering any node equals zero. These two laws form the basis for systematic circuit analysis methods like mesh and nodal analysis.'
            },
            {
                title: 'Thevenin & Norton Equivalents',
                content: 'Thevenin\'s theorem: Any linear two-terminal network can be replaced by an equivalent circuit with a single voltage source V_th in series with a resistance R_th. Norton\'s theorem: Same network can be replaced by a current source I_N in parallel with R_N. Conversion: V_th = I_N × R_N, and R_th = R_N.'
            },
            {
                title: 'Transient Analysis (RL, RC, RLC)',
                content: 'When a switch is toggled in circuits containing L or C, voltages/currents change exponentially toward new steady-state values. The time constant τ = RC (for RC circuits) or τ = L/R (for RL circuits). RLC circuits can be underdamped (oscillatory), critically damped, or overdamped depending on the damping ratio ζ = R/(2√(L/C)).'
            },
            {
                title: 'Maximum Power Transfer',
                content: 'Maximum power is delivered to the load when R_Load = R_Source (or Z_Load = Z_Source* for AC). The maximum power transferred is P_max = V_th²/(4R_th). This theorem is critical in impedance matching for communication systems and audio amplifiers.'
            },
            {
                title: 'AC Resonance & Filters',
                content: 'Series RLC resonance occurs at f_r = 1/(2π√LC) where impedance is minimum (purely resistive). Quality factor Q = ω₀L/R = 1/(ω₀CR) determines bandwidth selectivity. Higher Q means sharper frequency response. Bandwidth BW = f_r/Q.'
            }
        ],
        formulas: [
            {
                expr: 'R_{\\text{th}} = \\frac{V_{\\text{oc}}}{I_{\\text{sc}}}',
                desc: 'Thevenin Equivalent Resistance',
                variables: [
                    'R_{\\text{th}} = Thevenin equivalent internal source resistance (\\Omega)',
                    'V_{\\text{oc}} = Open-circuit terminal voltage (V)',
                    'I_{\\text{sc}} = Short-circuit terminal current (A)'
                ],
                explanation: 'Determines the equivalent internal resistance of any linear two-terminal active circuit grid as seen from the load terminals.',
                example: {
                    inputs: 'V_{\\text{oc}} = 12\\text{ V}, I_{\\text{sc}} = 3\\text{ A}',
                    steps: 'R_{\\text{th}} = \\frac{12\\text{ V}}{3\\text{ A}}',
                    result: 'R_{\\text{th}} = 4\\text{ }\\Omega'
                }
            },
            {
                expr: 'P_{\\text{max}} = \\frac{V_{\\text{th}}^2}{4 \\cdot R_{\\text{th}}}',
                desc: 'Maximum Power Transfer Theorem',
                variables: [
                    'P_{\\text{max}} = Maximum power delivered to the load resistor (Watts)',
                    'V_{\\text{th}} = Thevenin equivalent open-circuit voltage (V)',
                    'R_{\\text{th}} = Thevenin equivalent internal resistance (\\Omega)'
                ],
                explanation: 'States that maximum power is transferred from a source to a load when the load resistance equals the internal source resistance.',
                example: {
                    inputs: 'V_{\\text{th}} = 20\\text{ V}, R_{\\text{th}} = 10\\text{ }\\Omega \\quad (\\text{Load resistor } R_L = R_{\\text{th}} = 10\\Omega)',
                    steps: 'P_{\\text{max}} = \\frac{20^2}{4 \\times 10} = \\frac{400}{40}',
                    result: 'P_{\\text{max}} = 10\\text{ Watts}'
                }
            },
            {
                expr: 'f_r = \\frac{1}{2\\pi \\cdot \\sqrt{L \\cdot C}}',
                desc: 'Series RLC Resonant Frequency',
                variables: [
                    'f_r = Resonant frequency (Hz)',
                    'L = Circuit inductance (Henries)',
                    'C = Circuit capacitance (Farads)'
                ],
                explanation: 'The frequency at which capacitive reactance equals inductive reactance ($X_C = X_L$), causing total impedance to drop to its purely resistive minimum.',
                example: {
                    inputs: 'L = 10\\text{ mH} = 0.01\\text{ H}, C = 100\\text{ nF} = 10^{-7}\\text{ F}',
                    steps: 'LC = 10^{-9} \\implies \\sqrt{LC} = \\sqrt{10} \\times 10^{-5} \\approx 3.16 \\times 10^{-5} \\implies f_r = \\frac{1}{2\\pi \\times 3.16 \\times 10^{-5}}',
                    result: 'f_r = 5032.9\\text{ Hz} \\approx 5.03\\text{ kHz}'
                }
            },
            {
                expr: 'Q = \\frac{\\omega_r \\cdot L}{R} = \\frac{1}{\\omega_r \\cdot C \\cdot R}',
                desc: 'Quality Factor of RLC Network',
                variables: [
                    'Q = Quality factor (dimensionless selectivity rating)',
                    '\\omega_r = Resonant angular frequency (rad/s)',
                    'L = Inductance (H)',
                    'C = Capacitance (F)',
                    'R = Series circuit resistance (\\Omega)'
                ],
                explanation: 'Measures the damping, bandwidth selectivity, and voltage magnification factor of an RLC resonant circuit at resonance.',
                example: {
                    inputs: 'R = 10\\Omega, L = 5\\text{ mH}, C = 2\\mu\\text{F} \\implies \\omega_r = 1/\\sqrt{LC} = 10000\\text{ rad/s}',
                    steps: 'Q = \\frac{10000 \\times 0.005}{10} = \\frac{50}{10}',
                    result: 'Q = 5 \\quad (\\text{Voltage across L/C is magnified } 5\\times)'
                }
            },
            {
                expr: '\\tau_C = R \\cdot C \\quad \\text{and} \\quad \\tau_L = \\frac{L}{R}',
                desc: 'RC and RL Network Time Constants',
                variables: [
                    '\\tau = Time constant (seconds)',
                    'R = Circuit resistance (\\Omega)',
                    'C = Capacitance (F)',
                    'L = Inductance (H)'
                ],
                explanation: 'Represents the time required for a capacitor to charge to 63.2% of supply voltage, or for an inductor current to discharge to 36.8% of initial value.',
                example: {
                    inputs: 'R = 100\\text{ k}\\Omega = 10^5\\Omega, C = 10\\mu\\text{F} = 10^{-5}\\text{ F}',
                    steps: '\\tau = 10^5 \\times 10^{-5}',
                    result: '\\tau = 1.0\\text{ second}'
                }
            },
            {
                expr: 'v(t) = V_f + (V_i - V_f) \\cdot e^{-t/\\tau}',
                desc: 'First-Order Transient Step Response',
                variables: [
                    'v(t) = Instantaneous voltage at time t (V)',
                    'V_f = Final steady-state voltage limit (V)',
                    'V_i = Initial voltage at t = 0 (V)',
                    't = Elapsed time (seconds)',
                    '\\tau = Circuit time constant (seconds)'
                ],
                explanation: 'Calculates the transition voltage or current values in active first-order RC or RL networks during toggles or discharges.',
                example: {
                    inputs: 'V_i = 0\\text{V}, V_f = 10\\text{V}, \\tau = 2\\text{s}, t = 2\\text{s} \\quad (\\text{at } 1\\tau)',
                    steps: 'v(2) = 10 + (0 - 10)e^{-2/2} = 10(1 - e^{-1}) = 10(1 - 0.368)',
                    result: 'v(2) = 6.32\\text{ V} \\quad (\\text{Exactly } 63.2\\% \\text{ of charging})'
                }
            }
        ],
        revision: [
            'KVL: sum of voltage drops = sum of voltage rises around any loop',
            'KCL: current entering a node = current leaving the node',
            'Thevenin: find V_oc and I_sc, then R_th = V_oc/I_sc',
            'Norton is dual of Thevenin: I_N = V_th/R_th',
            'Time constant τ: after 5τ, transient is essentially complete (>99%)',
            'Resonance: impedance is purely resistive, current is maximum',
            'Common mistake: forgetting to include internal source resistance in R_th'
        ]
    },
    {
        id: 'pn-junction',
        title: 'PN Junction Diode',
        icon: '🔬',
        category: 'Semiconductors',
        color: '#f59e0b',
        route: '#/concept/diode',
        chapters: [
            {
                title: 'Semiconductor Basics',
                content: 'Silicon has 4 valence electrons. N-type: doped with pentavalent impurities (P, As) adding free electrons. P-type: doped with trivalent impurities (B, Ga) creating holes. At room temperature, intrinsic carrier concentration n_i ≈ 1.5×10¹⁰ /cm³ for Silicon.'
            },
            {
                title: 'Depletion Region Formation',
                content: 'When P and N materials are joined, diffusion of majority carriers creates a charge-depleted region with fixed ion cores. This establishes a built-in potential barrier V_bi ≈ 0.7V for Silicon (0.3V for Germanium). The electric field in the depletion region opposes further diffusion, reaching equilibrium.'
            },
            {
                title: 'Forward & Reverse Bias',
                content: 'Forward bias: External voltage opposes built-in potential, shrinking the depletion region and allowing exponential current flow (I = I_s·(e^(V/nV_T) - 1)). Reverse bias: External voltage aids built-in potential, widening depletion region — only tiny leakage current (I_s) flows from thermally generated minority carriers.'
            },
            {
                title: 'Breakdown Mechanisms',
                content: 'Zener breakdown (<5V): Intense electric field directly rips electrons from covalent bonds (tunneling). Avalanche breakdown (>5V): Accelerated carriers gain enough energy to ionize atoms through collisions, creating a chain reaction. Zener diodes exploit this for voltage regulation.'
            }
        ],
        formulas: [
            {
                expr: 'I = I_s \\cdot \\left( e^{\\frac{V}{\\eta \\cdot V_T}} - 1 \\right)',
                desc: 'Shockley Diode Current Equation',
                variables: [
                    'I = Instantaneous diode current (A)',
                    'I_s = Reverse saturation leakage current (typically 10^{-12}\\text{ A} to 10^{-9}\\text{ A})',
                    'V = Applied external bias voltage (V)',
                    '\\eta = Ideality factor (1 for Germanium/ideal, 2 for Silicon/low current)',
                    'V_T = Thermal voltage threshold (V)'
                ],
                explanation: 'Describes the classic exponential current increase under forward bias, and tiny leakage floor under reverse bias.',
                example: {
                    inputs: 'I_s = 10^{-12}\\text{ A}, V = 0.7\\text{ V}, \\eta = 1, V_T = 26\\text{ mV} = 0.026\\text{ V}',
                    steps: 'I = 10^{-12} \\times \\left( e^{\\frac{0.7}{0.026}} - 1 \\right) = 10^{-12} \\times \\left( 4.93 \\times 10^{11} \\right)',
                    result: 'I = 0.493\\text{ A} \\quad (\\text{or } 493\\text{ mA})'
                }
            },
            {
                expr: 'V_T = \\frac{k \\cdot T}{q}',
                desc: 'Thermal Voltage Threshold',
                variables: [
                    'V_T = Thermal voltage threshold (V)',
                    'k = Boltzmann\'s constant (1.38 \\times 10^{-23}\\text{ J/K})',
                    'T = Absolute temperature (Kelvin)',
                    'q = Charge of an electron (1.602 \\times 10^{-19}\\text{ Coulombs})'
                ],
                explanation: 'Represents the electrical potential equivalent of thermal energy at absolute temperature T, determining carrier excitation thresholds.',
                example: {
                    inputs: 'T = 300\\text{ K} \\quad (\\text{approx } 27^\\circ\\text{C room temperature})',
                    steps: 'V_T = \\frac{1.38 \\times 10^{-23} \\times 300}{1.602 \\times 10^{-19}} = \\frac{4.14 \\times 10^{-21}}{1.602 \\times 10^{-19}}',
                    result: 'V_T \\approx 0.0258\\text{ V} \\quad (\\text{Standardized to } 26\\text{ mV})'
                }
            },
            {
                expr: 'V_{\\text{bi}} = V_T \\cdot \\ln\\left( \\frac{N_A \\cdot N_D}{n_i^2} \\right)',
                desc: 'Built-in Junction Potential',
                variables: [
                    'V_{\\text{bi}} = Built-in depletion potential barrier (V)',
                    'V_T = Thermal voltage (approx 26mV at room temp)',
                    'N_A = Acceptor doping concentration (holes/cm^3)',
                    'N_D = Donor doping concentration (electrons/cm^3)',
                    'n_i = Intrinsic carrier concentration of pure Silicon (\\approx 1.5 \\times 10^{10}\\text{ /cm}^3)'
                ],
                explanation: 'Calculates the internal barrier potential formed at the junction in thermal equilibrium due to charge diffusion.',
                example: {
                    inputs: 'N_A = 10^{16}\\text{ /cm}^3, N_D = 10^{17}\\text{ /cm}^3, n_i = 1.5 \\times 10^{10}\\text{ /cm}^3, V_T = 26\\text{mV}',
                    steps: 'V_{\\text{bi}} = 0.026 \\times \\ln\\left( \\frac{10^{33}}{2.25 \\times 10^{20}} \\right) = 0.026 \\times \\ln(4.44 \\times 10^{12}) = 0.026 \\times 29.12',
                    result: 'V_{\\text{bi}} = 0.757\\text{ V}'
                }
            },
            {
                expr: 'W = \\sqrt{\\frac{2 \\cdot \\varepsilon_s \\cdot (V_{\\text{bi}} + V_R)}{q} \\cdot \\left( \\frac{1}{N_A} + \\frac{1}{N_D} \\right)}',
                desc: 'Depletion Layer Width',
                variables: [
                    'W = Depletion layer width (cm)',
                    '\\varepsilon_s = Silicon permittivity (\\approx 1.04 \\times 10^{-12}\\text{ F/cm})',
                    'V_{\\text{bi}} = Built-in potential barrier (V)',
                    'V_R = Applied external reverse bias voltage (V)',
                    'q = Electron charge (1.6 \\times 10^{-19}\\text{ C})',
                    'N_A, N_D = Doping concentrations (/cm^3)'
                ],
                explanation: 'Calculates how the insulating depletion layer expands under reverse bias, blocking current flow.',
                example: {
                    inputs: 'V_{\\text{bi}} = 0.7\\text{V}, V_R = 9.3\\text{V} \\implies V_{\\text{bi}}+V_R = 10\\text{V}, N_A = N_D = 10^{16}\\text{/cm}^3',
                    steps: 'W = \\sqrt{\\frac{2 \\times 1.04 \\times 10^{-12} \\times 10}{1.6 \\times 10^{-19}} \\times \\left( \\frac{2}{10^{16}} \\right)} = \\sqrt{\\frac{2.08 \\times 10^{-11}}{1.6 \\times 10^{-19}} \\times 2 \\times 10^{-16}} = \\sqrt{2.6 \\times 10^{-8}}',
                    result: 'W \\approx 1.61 \\times 10^{-4}\\text{ cm} \\quad (\\text{or } 1.61\\text{ }\\mu\\text{m})'
                }
            },
            {
                expr: 'n \\cdot p = n_i^2',
                desc: 'Mass-Action Doping Law',
                variables: [
                    'n = Free electron density in the lattice (/cm^3)',
                    'p = Hole density in the lattice (/cm^3)',
                    'n_i = Intrinsic carrier density (\\approx 1.5 \\times 10^{10}\\text{ /cm}^3 for Silicon)'
                ],
                explanation: 'Asserts that the product of free electrons and holes remains constant in thermal equilibrium, regardless of doping level.',
                example: {
                    inputs: 'n_i = 1.5 \\times 10^{10}\\text{ /cm}^3, N_D = 10^{16}\\text{ /cm}^3 \\implies n \\approx N_D = 10^{16}\\text{ electrons/cm}^3',
                    steps: 'p = \\frac{n_i^2}{n} = \\frac{2.25 \\times 10^{20}}{10^{16}}',
                    result: 'p = 22,500\\text{ holes/cm}^3'
                }
            }
        ],
        revision: [
            'Silicon barrier: 0.7V, Germanium: 0.3V',
            'Forward bias: depletion narrows → current flows exponentially',
            'Reverse bias: depletion widens → only leakage current I_s',
            'Zener (<5V): tunneling effect; Avalanche (>5V): impact ionization',
            'Ideality factor n: 1 for diffusion current, 2 for recombination',
            'Temperature increases → V_bi decreases (~2mV/°C for Si)',
            'Common mistake: mixing up Zener and Avalanche breakdown ranges'
        ]
    },
    {
        id: 'transistor',
        title: 'BJT Transistor',
        icon: '⚡',
        category: 'Active Devices',
        color: '#8b5cf6',
        route: '#/concept/transistor',
        chapters: [
            {
                title: 'BJT Structure & Operation',
                content: 'A Bipolar Junction Transistor has three doped regions: Emitter (heavily doped, injects carriers), Base (very thin, lightly doped), and Collector (moderately doped, collects carriers). NPN: electrons flow from emitter through base to collector. PNP: holes flow instead. The thin base ensures most injected carriers reach the collector.'
            },
            {
                title: 'Operating Regions',
                content: 'Cutoff: Both junctions reverse-biased → switch OFF (I_C ≈ 0). Active: BE forward-biased, BC reverse-biased → linear amplification (I_C = β·I_B). Saturation: Both junctions forward-biased → switch ON (V_CE_sat ≈ 0.2V). The transistor acts as a current-controlled current source in the active region.'
            },
            {
                title: 'Current Gain & Relationships',
                content: 'β (h_FE) = I_C/I_B: common-emitter current gain (typically 50-300). α (h_FB) = I_C/I_E: common-base current gain (close to 1, typically 0.95-0.99). Relationship: β = α/(1-α). The emitter current I_E = I_C + I_B.'
            },
            {
                title: 'Biasing & Amplifier Configurations',
                content: 'Voltage-divider bias provides stable Q-point against β variations. Three amplifier configs: Common-Emitter (voltage gain, most used), Common-Collector (unity voltage gain, impedance buffer), Common-Base (current gain ≈ 1, high-frequency applications). Each has distinct input/output impedance characteristics.'
            }
        ],
        formulas: [
            {
                expr: 'I_C = \\beta \\cdot I_B',
                desc: 'Collector Active Region Current',
                variables: [
                    'I_C = Collector current (A or mA)',
                    '\\beta = Common-emitter current gain factor (h_{FE}, typically 50 - 300)',
                    'I_B = Base control current (A or \\mu A)'
                ],
                explanation: 'Describes the current-controlled current amplification property of a Bipolar Junction Transistor (BJT) operating in the active region.',
                example: {
                    inputs: 'I_B = 40\\text{ }\\mu\\text{A} = 0.04\\text{ mA}, \\beta = 150',
                    steps: 'I_C = 150 \\times 0.04\\text{ mA}',
                    result: 'I_C = 6.0\\text{ mA}'
                }
            },
            {
                expr: 'I_E = I_C + I_B',
                desc: 'BJT Junction Currents (KCL)',
                variables: [
                    'I_E = Emitter current exiting the BJT (mA)',
                    'I_C = Collector current entering the BJT (mA)',
                    'I_B = Base current entering the BJT (mA)'
                ],
                explanation: 'Asserts Kirchhoff\'s Current Law (KCL) for the transistor shell, stating that all currents entering the nodes must exit through the emitter node.',
                example: {
                    inputs: 'I_C = 8.5\\text{ mA}, I_B = 50\\text{ }\\mu\\text{A} = 0.05\\text{ mA}',
                    steps: 'I_E = 8.5\\text{ mA} + 0.05\\text{ mA}',
                    result: 'I_E = 8.55\\text{ mA}'
                }
            },
            {
                expr: '\\beta = \\frac{\\alpha}{1 - \\alpha} \\quad \\text{and} \\quad \\alpha = \\frac{\\beta}{1 + \\beta}',
                desc: 'Current Gain Inter-relationships',
                variables: [
                    '\\beta = Common-emitter current gain (I_C/I_B)',
                    '\\alpha = Common-base current gain (I_C/I_E, typically 0.95 - 0.995)'
                ],
                explanation: 'Converts between the common-emitter current gain factor and common-base gains, modeling fractional collector sweep ratios.',
                example: {
                    inputs: '\\alpha = 0.99',
                    steps: '\\beta = \\frac{0.99}{1 - 0.99} = \\frac{0.99}{0.01}',
                    result: '\\beta = 99'
                }
            },
            {
                expr: 'A_v = -g_m \\cdot R_C',
                desc: 'Common-Emitter Voltage Gain',
                variables: [
                    'A_v = Voltage gain factor (negative sign represents a 180-degree phase inversion)',
                    'g_m = Transconductance gain of the BJT (Siemens, S)',
                    'R_C = Collector load resistance (\\Omega)'
                ],
                explanation: 'Calculates the small-signal voltage gain of a standard single-stage Common-Emitter (CE) amplifier.',
                example: {
                    inputs: 'g_m = 40\\text{ mS} = 0.04\\text{ S}, R_C = 2\\text{ k}\\Omega = 2000\\Omega',
                    steps: 'A_v = -0.04 \\times 2000',
                    result: 'A_v = -80 \\quad (\\text{Output voltage is magnified } 80\\times \\text{ and inverted})'
                }
            },
            {
                expr: 'g_m = \\frac{I_{CQ}}{V_T}',
                desc: 'Small-Signal Transconductance',
                variables: [
                    'g_m = Small-signal transconductance (A/V or Siemens)',
                    'I_{CQ} = DC Collector operating point bias current (A or mA)',
                    'V_T = Thermal voltage threshold (approx 26mV at 300K)'
                ],
                explanation: 'Determines the active incremental change in collector current in response to changes in base-emitter voltage.',
                example: {
                    inputs: 'I_{CQ} = 2.6\\text{ mA} = 0.0026\\text{ A}, V_T = 26\\text{ mV} = 0.026\\text{ V}',
                    steps: 'g_m = \\frac{0.0026\\text{ A}}{0.026\\text{ V}}',
                    result: 'g_m = 0.1\\text{ S} = 100\\text{ mS}'
                }
            },
            {
                expr: 'r_\\pi = \\frac{\\beta}{g_m} = \\frac{\\beta \\cdot V_T}{I_{CQ}}',
                desc: 'Small-Signal Base Input Resistance',
                variables: [
                    'r_\\pi = Incremental input resistance looking into the BJT base (\\Omega)',
                    '\\beta = Common-emitter active current gain factor',
                    'g_m = BJT transconductance (S)'
                ],
                explanation: 'Represents the AC input resistance of the transistor base terminal under active small-signal configurations.',
                example: {
                    inputs: '\\beta = 100, g_m = 40\\text{ mS} = 0.04\\text{ S}',
                    steps: 'r_\\pi = \\frac{100}{0.04}',
                    result: 'r_\\pi = 2500\\text{ }\\Omega = 2.5\\text{ k}\\Omega'
                }
            }
        ],
        revision: [
            'Three regions: Cutoff (OFF), Active (amplify), Saturation (ON)',
            'β = I_C/I_B (typically 50-300), α = I_C/I_E (close to 1)',
            'Active region: BE forward (0.7V), BC reverse biased',
            'CE amp: high voltage gain, inverted output',
            'CC amp (emitter follower): unity gain, impedance matching',
            'Voltage-divider bias: most stable against β variations',
            'Common mistake: assuming β is constant (it varies with temperature and I_C)'
        ]
    },
    {
        id: 'logic-gates',
        title: 'Digital Logic Gates',
        icon: '🖥️',
        category: 'Digital Core',
        color: '#ef4444',
        route: '#/concept/gates',
        chapters: [
            {
                title: 'Boolean Algebra Fundamentals',
                content: 'Boolean variables take values 0 or 1. Basic operations: AND (A·B), OR (A+B), NOT (A\'). De Morgan\'s laws: (A·B)\' = A\'+B\' and (A+B)\' = A\'·B\'. Key identities: A+A\'=1, A·A\'=0, A+0=A, A·1=A, A+1=1, A·0=0. These laws enable systematic simplification of logic expressions.'
            },
            {
                title: 'Logic Gate Types',
                content: 'Basic gates: AND, OR, NOT. Derived gates: NAND (NOT-AND), NOR (NOT-OR), XOR (exclusive-OR), XNOR (exclusive-NOR). NAND and NOR are universal gates — any Boolean function can be implemented using only NAND gates or only NOR gates. This makes them the backbone of integrated circuit design.'
            },
            {
                title: 'Karnaugh Map Minimization',
                content: 'K-maps provide a graphical method to simplify Boolean functions by grouping adjacent 1s (for SOP) or 0s (for POS). Groups must be powers of 2 (1, 2, 4, 8...). Larger groups yield simpler expressions. Don\'t-care conditions can be included in groups to achieve further simplification.'
            },
            {
                title: 'Combinational Circuit Design',
                content: 'Multiplexers (MUX): select one of many inputs. Decoders: convert n-bit binary to 2^n outputs. Encoders: reverse of decoders. Adders: Half-adder (2 inputs), Full-adder (3 inputs with carry-in). These building blocks combine to form ALUs, memory address decoders, and data routing networks.'
            }
        ],
        formulas: [
            {
                expr: '(A \\cdot B)\' = A\' + B\'',
                desc: 'De Morgan\'s First Law',
                variables: [
                    'A, B = Binary boolean logical variables (take values 0 or 1)',
                    '\\cdot = Logical AND operation',
                    '+ = Logical OR operation',
                    '\' = Logical NOT negation operation'
                ],
                explanation: 'Proves that the complement of a logical product (NAND) is equivalent to the sum of the complements (bubbled OR).',
                example: {
                    inputs: 'A = 0, B = 1',
                    steps: '(0 \\cdot 1)\' = (0)\' = 1 \\quad \\text{and} \\quad 0\' + 1\' = 1 + 0 = 1',
                    result: '1 \\equiv 1 \\quad (\\text{Identity verified})'
                }
            },
            {
                expr: '(A + B)\' = A\' \\cdot B\'',
                desc: 'De Morgan\'s Second Law',
                variables: [
                    'A, B = Binary logical inputs',
                    '+ = Logical OR',
                    '\\cdot = Logical AND',
                    '\' = Logical NOT negation'
                ],
                explanation: 'States that the complement of a logical sum (NOR) is equivalent to the product of the complements (bubbled AND).',
                example: {
                    inputs: 'A = 1, B = 1',
                    steps: '(1 + 1)\' = (1)\' = 0 \\quad \\text{and} \\quad 1\' \\cdot 1\' = 0 \\cdot 0 = 0',
                    result: '0 \\equiv 0'
                }
            },
            {
                expr: 'Y = A \\oplus B = A\' \\cdot B + A \\cdot B\'',
                desc: 'Exclusive-OR (XOR) Gate Expression',
                variables: [
                    'Y = XOR output channel',
                    'A, B = Binary inputs',
                    '\\oplus = XOR logical operator symbol'
                ],
                explanation: 'XOR outputs HIGH (1) if and only if the two inputs have differing complementary logical values.',
                example: {
                    inputs: 'A = 1, B = 0',
                    steps: 'Y = 1\' \\cdot 0 + 1 \\cdot 0\' = 0 \\cdot 0 + 1 \\cdot 1 = 0 + 1',
                    result: 'Y = 1'
                }
            },
            {
                expr: 'S = A \\oplus B \\oplus C_{\\text{in}}',
                desc: 'Full Adder Sum Logic',
                variables: [
                    'S = Sum output bit of the adder stage',
                    'A, B = Primary binary input bits',
                    'C_{\\text{in}} = Carry input bit from preceding stage'
                ],
                explanation: 'Computes the least significant bit of the arithmetic sum of three binary digits.',
                example: {
                    inputs: 'A = 1, B = 1, C_{\\text{in}} = 0',
                    steps: 'S = 1 \\oplus 1 \\oplus 0 = 0 \\oplus 0',
                    result: 'S = 0'
                }
            },
            {
                expr: 'C_{\\text{out}} = A \\cdot B + C_{\\text{in}} \\cdot (A \\oplus B)',
                desc: 'Full Adder Carry Out Logic',
                variables: [
                    'C_{\\text{out}} = Carry output bit generated to pass forward',
                    'A, B = Input bits',
                    'C_{\\text{in}} = Carry input bit'
                ],
                explanation: 'Determines if the arithmetic sum of three binary bits generates a carry overflow (i.e. if 2 or 3 inputs are HIGH).',
                example: {
                    inputs: 'A = 1, B = 1, C_{\\text{in}} = 0',
                    steps: 'C_{\\text{out}} = 1 \\cdot 1 + 0 \\cdot (1 \\oplus 1) = 1 + 0 \\cdot 0',
                    result: 'C_{\\text{out}} = 1'
                }
            },
            {
                expr: 'Y = \\sum_{i=0}^{2^n - 1} m_i \\cdot I_i',
                desc: 'Multiplexer (MUX) Output Logic',
                variables: [
                    'Y = MUX output line',
                    'I_i = Input data channel index',
                    'm_i = Minterm Boolean variable based on the selection lines',
                    'n = Number of selection control pins'
                ],
                explanation: 'Routes one of $2^n$ binary data inputs to a single output line based on active binary combinations of selection variables.',
                example: {
                    inputs: 'Selection: S_0 = 1, S_1 = 0 \\implies m_1 = S_1\' S_0 = 1 \\quad (\\text{Routes input } I_1)',
                    steps: 'Assuming input lines: I_0 = 0, I_1 = 1, I_2 = 0, I_3 = 0',
                    result: 'Y = I_1 = 1'
                }
            }
        ],
        revision: [
            'NAND and NOR are universal gates — can implement any function',
            'De Morgan\'s: break the bar, change the sign',
            'K-map: group adjacent 1s in powers of 2 for SOP minimization',
            'XOR: output 1 when inputs differ; XNOR: output 1 when inputs match',
            'Half adder: 2 inputs (A, B) → Sum, Carry',
            'Full adder: 3 inputs (A, B, C_in) → Sum, C_out',
            'Common mistake: incorrect grouping in K-maps (groups must wrap around edges)'
        ]
    },
    {
        id: 'flipflops',
        title: 'Sequential Flip-Flops',
        icon: '🔄',
        category: 'Digital Memory',
        color: '#d946ef',
        route: '#/concept/flipflops',
        chapters: [
            {
                title: 'Latches vs Flip-Flops',
                content: 'Latches are level-triggered: output changes whenever inputs change while the enable signal is active. Flip-flops are edge-triggered: output changes only on the rising (or falling) clock edge. Edge-triggering eliminates race conditions and provides predictable, synchronized operation essential for sequential circuits.'
            },
            {
                title: 'SR, JK, D, and T Flip-Flops',
                content: 'SR: Set-Reset, invalid state when S=R=1. JK: improved SR where J=K=1 toggles output. D (Data): captures input D on clock edge (Q=D). T (Toggle): toggles output when T=1 on clock edge. D flip-flops are most common in modern digital design due to their simplicity and predictability.'
            },
            {
                title: 'Counters & Shift Registers',
                content: 'Counters: chain of flip-flops counting clock pulses. Asynchronous (ripple): each FF triggered by previous, causing propagation delay. Synchronous: all FFs share the same clock, eliminating ripple. Shift registers: serial-in/parallel-out (SIPO), parallel-in/serial-out (PISO), used for data serialization and delay lines.'
            },
            {
                title: 'Timing & Metastability',
                content: 'Setup time (t_su): minimum time data must be stable BEFORE clock edge. Hold time (t_h): minimum time data must remain stable AFTER clock edge. Violating these causes metastability — output trapped in an undefined state between 0 and 1, potentially causing system failures in multi-clock-domain designs.'
            }
        ],
        formulas: [
            {
                expr: 'Q_{n+1} = D',
                desc: 'D Flip-Flop Characteristic Equation',
                variables: [
                    'Q_{n+1} = Next output state after active clock edge trigger',
                    'D = Data input logic value'
                ],
                explanation: 'A fundamental storage cell that captures and holds the state of input D at the clock transition edge.',
                example: {
                    inputs: 'Current state Q_n = 0, D = 1',
                    steps: 'Applying clock rising edge trigger: Q_{n+1} = D',
                    result: 'Q_{n+1} = 1'
                }
            },
            {
                expr: 'Q_{n+1} = T \\oplus Q_n = T \\cdot Q_n\' + T\' \\cdot Q_n',
                desc: 'T Flip-Flop Characteristic Equation',
                variables: [
                    'Q_{n+1} = Next output state',
                    'T = Toggle control input pin',
                    'Q_n = Active current state before clock pulse'
                ],
                explanation: 'Toggles output if input T is HIGH (1), and retains current state if T is LOW (0) on active clock edges.',
                example: {
                    inputs: 'Current state Q_n = 1, T = 1',
                    steps: 'Q_{n+1} = 1 \\oplus 1 = 1 \\cdot 1\' + 1\' \\cdot 1 = 0',
                    result: 'Q_{n+1} = 0 \\quad (\\text{State has toggled})'
                }
            },
            {
                expr: 'Q_{n+1} = J \\cdot Q_n\' + K\' \\cdot Q_n',
                desc: 'JK Flip-Flop Characteristic Equation',
                variables: [
                    'Q_{n+1} = Next state output',
                    'J = Set control pin input',
                    'K = Reset control pin input',
                    'Q_n = Active current state'
                ],
                explanation: 'Implements full state operations: Hold (0,0), Reset (0,1), Set (1,0), and Toggle (1,1) without invalid states.',
                example: {
                    inputs: 'Current state Q_n = 0, J = 1, K = 1',
                    steps: 'Q_{n+1} = 1 \\cdot 0\' + 1\' \\cdot 0 = 1 \\cdot 1 + 0 \\cdot 0',
                    result: 'Q_{n+1} = 1 \\quad (\\text{Toggled from 0 to 1})'
                }
            },
            {
                expr: 'N \\le 2^n',
                desc: 'Counter Capacity Limit',
                variables: [
                    'N = Maximum states cycle modulus (MOD number)',
                    'n = Total number of cascading edge-triggered flip-flops'
                ],
                explanation: 'Calculates the maximum count states available using a chain of $n$ synchronous or asynchronous flip-flops.',
                example: {
                    inputs: 'n = 4 \\quad (\\text{4 flip-flops chain})',
                    steps: 'N_{\\text{max}} = 2^4',
                    result: 'N_{\\text{max}} = 16 \\quad (\\text{MOD-16 binary ripple counter})'
                }
            },
            {
                expr: 'f_{\\text{out}} = \\frac{f_{\\text{clk}}}{N}',
                desc: 'Counter Output Frequency Division',
                variables: [
                    'f_{\\text{out}} = Resulting output pulse frequency of MSB (Hz)',
                    'f_{\\text{clk}} = Input clock frequency (Hz)',
                    'N = MOD modulus cycle states number of the counter network'
                ],
                explanation: 'Models how binary registers act as precise clock frequency dividers, reducing input clock rates by the counter modulus.',
                example: {
                    inputs: 'f_{\\text{clk}} = 16\\text{ MHz}, N = 16 \\quad (\\text{MOD-16 counter})',
                    steps: 'f_{\\text{out}} = \\frac{16\\text{ MHz}}{16}',
                    result: 'f_{\\text{out}} = 1.0\\text{ MHz}'
                }
            },
            {
                expr: 't_{\\text{total}} = n \\cdot t_{\\text{pd}}',
                desc: 'Ripple Counter Propagation Delay',
                variables: [
                    't_{\\text{total}} = Total propagation latency before stable count output (seconds)',
                    'n = Number of flip-flop divider stages',
                    't_{\\text{pd}} = Individual flip-flop clock-to-output propagation delay (seconds)'
                ],
                explanation: 'Calculates the cumulative propagation delay in asynchronous ripple counters where each stage clock triggers from the preceding stage output.',
                example: {
                    inputs: 'n = 4, t_{\\text{pd}} = 15\\text{ ns}',
                    steps: 't_{\\text{total}} = 4 \\times 15\\text{ ns}',
                    result: 't_{\\text{total}} = 60\\text{ ns}'
                }
            }
        ],
        revision: [
            'Latch = level-triggered; Flip-flop = edge-triggered',
            'SR: S=R=1 is forbidden; JK solves this with toggle behavior',
            'D flip-flop: simplest — output follows input on clock edge',
            'Setup time: data stable BEFORE edge; Hold time: data stable AFTER edge',
            'Synchronous counters are faster but use more logic',
            'Ring counter: n states with n flip-flops (one-hot encoding)',
            'Common mistake: confusing asynchronous preset/clear with normal inputs'
        ]
    },
    {
        id: 'microcontrollers',
        title: 'Microprocessors & Microcontrollers',
        icon: '💾',
        category: 'Processor Architecture',
        color: '#0ea5e9',
        route: '#/concept/microcontrollers',
        chapters: [
            {
                title: '8085 Architecture',
                content: 'The Intel 8085 is an 8-bit microprocessor with a 16-bit address bus (64KB addressable memory), 8-bit data bus, and 5 interrupt lines (TRAP, RST 7.5, 6.5, 5.5, INTR). Key registers: Accumulator (A), B, C, D, E, H, L pairs, Stack Pointer (SP), Program Counter (PC). The ALU performs arithmetic and logic operations, setting flags (S, Z, AC, P, CY).'
            },
            {
                title: 'Instruction Set & Addressing',
                content: 'Five addressing modes: Immediate (MVI A, 32H), Register (MOV A, B), Direct (LDA 2050H), Indirect (MOV A, M where M=[HL]), Implicit (CMA). Instructions grouped as: Data Transfer (MOV, MVI, LDA, STA), Arithmetic (ADD, SUB, INR, DCR), Logic (ANA, ORA, XRA, CMA), Branch (JMP, CALL, RET), and Machine Control (HLT, NOP).'
            },
            {
                title: 'Interrupts & Timing',
                content: 'Interrupts allow external devices to request CPU attention. TRAP is non-maskable (highest priority). RST 7.5, 6.5, 5.5 are maskable via SIM instruction. INTR requires external INTA cycle. Machine cycles: Opcode Fetch (4-6 T-states), Memory Read (3 T-states), Memory Write (3 T-states), I/O Read/Write (3 T-states).'
            },
            {
                title: 'Microcontroller vs Microprocessor',
                content: 'Microprocessor (8085): CPU only, needs external RAM, ROM, and I/O ports. Microcontroller (8051): CPU + RAM + ROM + I/O + Timers + Serial port on a single chip. Microcontrollers are used in embedded applications (washing machines, cars) where self-contained operation is needed. 8051 has 4KB ROM, 128 bytes RAM, 4 I/O ports, 2 timers.'
            }
        ],
        formulas: [
            {
                expr: '\\text{Address Space} = 2^n',
                desc: 'Memory Addressing Range',
                variables: [
                    '\\text{Address Space} = Total uniquely addressable memory locations (Bytes)',
                    'n = Total number of parallel address lines'
                ],
                explanation: 'Calculates the maximum addressable memory capacity of a CPU based on its physical address bus width.',
                example: {
                    inputs: 'n = 16 \\quad (\\text{8085 Address Bus Width})',
                    steps: '\\text{Space} = 2^{16} = 65,536\\text{ Bytes}',
                    result: '\\text{Memory Range} = 64\\text{ KB} \\quad (\\text{0000H - FFFFH})'
                }
            },
            {
                expr: 'T_{\\text{state}} = \\frac{1}{f_{\\text{clk}}}',
                desc: 'Machine Cycle Clock Period',
                variables: [
                    'T_{\\text{state}} = Time duration of a single T-state clock cycle (seconds)',
                    'f_{\\text{clk}} = Internal processor operating frequency (Hz)'
                ],
                explanation: 'Determines the baseline incremental clock duration timing step governing execution stages.',
                example: {
                    inputs: 'f_{\\text{clk}} = 3\\text{ MHz} = 3 \\times 10^6\\text{ Hz} \\quad (\\text{Typical 8085 speed})',
                    steps: 'T_{\\text{state}} = \\frac{1}{3 \\times 10^6}',
                    result: 'T_{\\text{state}} \\approx 333.3\\text{ nanoseconds}'
                }
            },
            {
                expr: 't_{\\text{exec}} = \\text{T-states} \\times T_{\\text{state}}',
                desc: 'Instruction Execution Duration',
                variables: [
                    't_{\\text{exec}} = Total execution delay for an instruction opcode (seconds)',
                    '\\text{T-states} = Count of states required for fetch, read, write cycles'
                ],
                explanation: 'Calculates the real-time execution duration of machine commands based on total state steps.',
                example: {
                    inputs: 'Instruction: MVI A, 32H (requires 7 T-states), T_{\\text{state}} = 333.3\\text{ ns}',
                    steps: 't_{\\text{exec}} = 7 \\times 333.3\\text{ ns}',
                    result: 't_{\\text{exec}} \\approx 2.33\\text{ }\\mu\\text{s}'
                }
            },
            {
                expr: '\\text{Physical Address} = \\text{Segment Base} \\times 10_{\\text{H}} + \\text{Offset}',
                desc: '8086 Segmented Memory Address',
                variables: [
                    '\\text{Physical Address} = Real 20-bit address output on bus lines (Hex)',
                    '\\text{Segment Base} = Start index stored in CS, DS, SS or ES segments (Hex)',
                    '\\text{Offset} = Instruction Pointer or register relative shift offset (Hex)'
                ],
                explanation: 'Calculates the physical memory address under 8086 segmented architectures to address up to 1MB memory space with 16-bit registers.',
                example: {
                    inputs: 'Segment: \\text{CS} = 2000_{\\text{H}}, Offset: \\text{IP} = 1050_{\\text{H}}',
                    steps: '\\text{Address} = 2000_{\\text{H}} \\times 10_{\\text{H}} + 1050_{\\text{H}} = 20000_{\\text{H}} + 1050_{\\text{H}}',
                    result: '\\text{Physical Address} = 21050_{\\text{H}}'
                }
            },
            {
                expr: '\\text{Baud Rate}_{8051} = \\frac{2^{\\text{SMOD}}}{32} \\cdot \\frac{f_{\\text{osc}}}{12 \\cdot (256 - \\text{TH1})}',
                desc: '8051 Microcontroller Baud Rate',
                variables: [
                    'f_{\\text{osc}} = Crystal oscillator frequency (Hz)',
                    '\\text{TH1} = Timer 1 auto-reload register value (Mode 2)',
                    '\\text{SMOD} = Baud rate doubler bit inside PCON register (0 or 1)'
                ],
                explanation: 'Computes serial UART communication baud rates on the 8051 using Timer 1 in Mode 2 (8-bit auto-reload).',
                example: {
                    inputs: 'f_{\\text{osc}} = 11.0592\\text{ MHz}, \\text{TH1} = 253 \\implies 256-\\text{TH1} = 3, \\text{SMOD} = 0',
                    steps: '\\text{Rate} = \\frac{1}{32} \\times \\frac{11.0592 \\times 10^6}{12 \\times 3} = \\frac{1}{32} \\times \\frac{11.0592 \\times 10^6}{36} = \\frac{307,200}{32}',
                    result: '\\text{Baud Rate} = 9600\\text{ bps}'
                }
            }
        ],
        revision: [
            '8085: 8-bit data bus, 16-bit address bus, 5 interrupt lines',
            'Register pairs: BC, DE, HL (16-bit operations)',
            'TRAP = highest priority, non-maskable interrupt',
            'Addressing modes: Immediate, Register, Direct, Indirect, Implicit',
            'Flags: Sign, Zero, Aux Carry, Parity, Carry',
            '8051 microcontroller: CPU + Memory + I/O on single chip',
            'Common mistake: confusing LDA (direct) with LDAX (indirect via register pair)'
        ]
    },
    {
        id: 'dsp',
        title: 'Digital Signal Processing',
        icon: '🎛️',
        category: 'Signal Processing',
        color: '#14b8a6',
        route: '#/concept/dsp',
        chapters: [
            {
                title: 'Z-Transform',
                content: 'The Z-Transform converts discrete-time sequences x[n] to the complex Z-domain: X(z) = Σ x[n]·z^(-n). It is the discrete-time analog of the Laplace Transform. The unit circle |z|=1 in the z-plane corresponds to the frequency axis. The ROC determines if the system is causal and stable.'
            },
            {
                title: 'DFT & FFT',
                content: 'The Discrete Fourier Transform (DFT) computes N frequency samples from N time samples: X[k] = Σ x[n]·W_N^(nk) where W_N = e^(-j2π/N). Direct computation requires O(N²) operations. The FFT (Fast Fourier Transform) exploits symmetry to reduce this to O(N·log₂N), making real-time spectral analysis feasible.'
            },
            {
                title: 'FIR & IIR Filters',
                content: 'FIR (Finite Impulse Response): output depends only on current and past inputs (no feedback). Always stable, linear phase possible. IIR (Infinite Impulse Response): output depends on past outputs too (recursive). More efficient (fewer coefficients) but can be unstable. IIR approximates analog filter responses (Butterworth, Chebyshev).'
            },
            {
                title: 'Digital Convolution & Correlation',
                content: 'Linear convolution: y[n] = Σ x[k]·h[n-k] computes system output. Circular convolution: uses modular arithmetic, equivalent to linear convolution when properly zero-padded. Correlation measures similarity between signals — autocorrelation detects periodicity, cross-correlation finds time delays between signals.'
            }
        ],
        formulas: [
            {
                expr: 'X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] \\cdot z^{-n}',
                desc: 'Bilateral Z-Transform',
                variables: [
                    'X(z) = Z-domain complex frequency representation',
                    'x[n] = Discrete-time input sequence indexed by integer n',
                    'z = Complex variable z = r \\cdot e^{j\\omega}'
                ],
                explanation: 'Converts a discrete-time sequence into its complex frequency-domain representation, acting as the discrete analog of the Laplace Transform.',
                example: {
                    inputs: 'x[n] = 0.5^n \\cdot u[n]',
                    steps: 'X(z) = \\sum_{n=0}^{\\infty} (0.5z^{-1})^n = \\frac{1}{1 - 0.5z^{-1}} \\quad \\text{for } |0.5z^{-1}| < 1',
                    result: 'X(z) = \\frac{z}{z - 0.5} \\quad (\\text{ROC}: |z| > 0.5)'
                }
            },
            {
                expr: 'X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j \\frac{2\\pi}{N} \\cdot n \\cdot k}',
                desc: 'Discrete Fourier Transform (DFT)',
                variables: [
                    'X[k] = Discrete frequency spectrum bin coefficients index',
                    'x[n] = Discrete time-domain input sequence of length N',
                    'N = Total number of sequence sample samples'
                ],
                explanation: 'Computes N evenly-spaced discrete frequency spectrum sample bins from N time-domain sequence samples.',
                example: {
                    inputs: 'x[n] = \\{1, 1\\} \\quad (N = 2)',
                    steps: 'X[k] = \\sum_{n=0}^{1} x[n]e^{-j\\pi n k} \\implies X[0] = 1+1 = 2, \\quad X[1] = 1 + 1e^{-j\\pi} = 1 - 1 = 0',
                    result: 'X[k] = \\{2, 0\\}'
                }
            },
            {
                expr: '\\text{FFT Complexity} = O(N \\cdot \\log_2 N)',
                desc: 'Fast Fourier Transform Advantage',
                variables: [
                    'N = Total data points sequence length (power of 2)',
                    'O = Asymptotic timing complexity bounds notation'
                ],
                explanation: 'Exposes the dramatic computational efficiency of FFT over direct DFT calculation (which scales at $O(N^2)$ operations).',
                example: {
                    inputs: 'N = 1024\\text{ sample points}',
                    steps: '\\text{DFT Operations} = 1024^2 \\approx 1.05 \\times 10^6 \\quad \\text{vs} \\quad \\text{FFT Operations} = 1024 \\times 10 = 10,240',
                    result: '\\text{Computation Speedup} \\approx 102\\text{ times faster}'
                }
            },
            {
                expr: 'H(z) = \\frac{\\sum_{k=0}^{M} b_k \\cdot z^{-k}}{1 + \\sum_{k=1}^{N} a_k \\cdot z^{-k}}',
                desc: 'IIR Filter Discrete System Function',
                variables: [
                    'H(z) = Z-domain transfer function response',
                    'b_k = Feedforward filter coefficient weights',
                    'a_k = Feedback recursive filter coefficient weights',
                    'M, N = Feedforward & feedback filter order depths'
                ],
                explanation: 'Represents an Infinite Impulse Response (IIR) filter transfer function containing feedback loops (poles and zeros).',
                example: {
                    inputs: 'b_0 = 0.2, a_1 = -0.8 \\quad (\\text{First-order low-pass filter})',
                    steps: 'H(z) = \\frac{0.2}{1 - 0.8z^{-1}} = \\frac{0.2z}{z - 0.8}',
                    result: 'H(z) = \\frac{0.2 \\cdot z}{z - 0.8} \\quad (\\text{Stable pole at } z = 0.8)'
                }
            },
            {
                expr: 'H(z) = \\sum_{k=0}^{M} b_k \\cdot z^{-k}',
                desc: 'FIR Filter Discrete System Function',
                variables: [
                    'H(z) = FIR filter transfer function',
                    'b_k = Filter coefficient weights (tap coefficients)'
                ],
                explanation: 'Models a Finite Impulse Response (FIR) filter transfer function, which depends only on past inputs and is always stable.',
                example: {
                    inputs: 'b = \\{0.5, 0.5\\} \\quad (\\text{2-tap moving average filter})',
                    steps: 'H(z) = 0.5 + 0.5z^{-1}',
                    result: 'H(z) = 0.5 + 0.5 \\cdot z^{-1}'
                }
            },
            {
                expr: 'y[n] = x[n] * h[n] = \\sum_{k=-\\infty}^{\\infty} x[k] \\cdot h[n - k]',
                desc: 'Discrete Linear Convolution Sum',
                variables: [
                    'y[n] = Resulting discrete-time output sequence response',
                    'x[n] = Discrete input sequence',
                    'h[n] = Discrete filter impulse response'
                ],
                explanation: 'Computes the output sequence of a discrete LTI system by sliding and multiplying overlapping discrete sequences.',
                example: {
                    inputs: 'x[n] = \\{1, 2\\}, h[n] = \\{1, 1\\}',
                    steps: 'y[0]=1\\times 1=1, \\quad y[1]=1\\times 1 + 2\\times 1 = 3, \\quad y[2]=2\\times 1=2',
                    result: 'y[n] = \\{1, 3, 2\\}'
                }
            }
        ],
        revision: [
            'Z-Transform: discrete-time equivalent of Laplace Transform',
            'Stability: all poles of H(z) must lie inside unit circle',
            'FFT: reduces DFT from O(N²) to O(N·log₂N)',
            'FIR: always stable, linear phase; IIR: more efficient but stability risk',
            'Windowing: Hamming, Hanning, Blackman for FIR design',
            'Bilinear transform: maps analog filters to digital (s-plane → z-plane)',
            'Common mistake: forgetting to zero-pad before circular convolution'
        ]
    },
    {
        id: 'comms',
        title: 'Communication Systems',
        icon: '📶',
        category: 'Telecommunications',
        color: '#f97316',
        route: '#/concept/comms',
        chapters: [
            {
                title: 'Analog Modulation (AM/FM)',
                content: 'Amplitude Modulation (AM): carrier amplitude varies with message signal. Modulation index m = A_m/A_c. DSB-SC, SSB, and VSB are bandwidth-efficient variants. Frequency Modulation (FM): carrier frequency varies with message. FM is more noise-resistant than AM but requires higher bandwidth (Carson\'s rule: BW ≈ 2(Δf + f_m)).'
            },
            {
                title: 'Digital Modulation Schemes',
                content: 'ASK: amplitude carries information. FSK: frequency carries information. PSK: phase carries information. QPSK: 2 bits/symbol using 4 phase states. QAM: combines amplitude and phase for higher spectral efficiency. 16-QAM carries 4 bits/symbol, 64-QAM carries 6 bits/symbol. Higher-order schemes need better SNR.'
            },
            {
                title: 'Sampling & Quantization',
                content: 'Analog-to-digital conversion: Sample (Nyquist rate), Quantize (map to discrete levels), Encode (binary representation). Quantization error is bounded by ±Δ/2 where Δ is the step size. For n-bit quantization: 2^n levels, SNR_q ≈ 6.02n + 1.76 dB. Companding (μ-law, A-law) improves dynamic range for voice signals.'
            },
            {
                title: 'Channel Capacity & Noise',
                content: 'Shannon\'s channel capacity: C = B·log₂(1 + SNR) bits/sec. This is the theoretical maximum error-free data rate. SNR (Signal-to-Noise Ratio) in dB: 10·log₁₀(P_signal/P_noise). White Gaussian noise has flat power spectral density across all frequencies.'
            }
        ],
        formulas: [
            {
                expr: 's(t) = A_c \\cdot [1 + m \\cdot m(t)] \\cdot \\cos(2\\pi \\cdot f_c \\cdot t)',
                desc: 'Amplitude Modulated (AM) Waveform',
                variables: [
                    's(t) = Modulated carrier wave output',
                    'A_c = Unmodulated carrier wave peak amplitude (V)',
                    'm = Modulation index envelope depth factor (0 \\le m \\le 1)',
                    'm(t) = Normalized input message signal',
                    'f_c = Carrier center high frequency (Hz)'
                ],
                explanation: 'Encodes low frequency message signals into the amplitude envelope of a high-frequency carrier wave.',
                example: {
                    inputs: 'A_c = 10\\text{V}, m = 0.5, m(t) = \\cos(2\\pi \\times 1000 t) \\quad (f_m = 1\\text{ kHz}), f_c = 100\\text{ kHz}',
                    steps: 's(t) = 10[1 + 0.5\\cos(2\\pi \\times 1000 t)]\\cos(2\\pi \\times 10^5 t)',
                    result: 's(t) = 10[1 + 0.5\\cos(2\\pi \\cdot 10^3 t)] \\cdot \\cos(2\\pi \\cdot 10^5 t)'
                }
            },
            {
                expr: 'B_{\\text{FM}} \\approx 2 \\cdot (\\Delta f + f_m)',
                desc: 'Carson\'s Bandwidth Rule (FM)',
                variables: [
                    'B_{\\text{FM}} = Practical total transmission bandwidth required (Hz)',
                    '\\Delta f = Peak carrier frequency deviation (Hz)',
                    'f_m = Highest frequency in the modulating message signal (Hz)'
                ],
                explanation: 'Calculates the transmission bandwidth required for Frequency Modulated (FM) signals based on frequency deviation.',
                example: {
                    inputs: '\\Delta f = 75\\text{ kHz}, f_m = 15\\text{ kHz} \\quad (\\text{FM Broadcast Standards})',
                    steps: 'B_{\\text{FM}} = 2 \\times (75 + 15)\\text{ kHz} = 2 \\times 90\\text{ kHz}',
                    result: 'B_{\\text{FM}} \\approx 180\\text{ kHz}'
                }
            },
            {
                expr: 'C = B \\cdot \\log_2(1 + \\text{SNR})',
                desc: 'Shannon-Hartley Channel Capacity Limit',
                variables: [
                    'C = Absolute maximum error-free transmission rate capacity (bits/sec)',
                    'B = Channel bandwidth (Hz)',
                    '\\text{SNR} = Signal-to-Noise linear power ratio (P_{\\text{signal}}/P_{\\text{noise}})'
                ],
                explanation: 'Specifies the maximum error-free data rate limit for a communication link under given white noise levels.',
                example: {
                    inputs: 'B = 3000\\text{ Hz} \\quad (\\text{Telephone band}), \\text{SNR} = 30\\text{ dB} = 1000\\text{ ratio}',
                    steps: 'C = 3000 \\times \\log_2(1 + 1000) \\approx 3000 \\times \\log_2(1001) \\approx 3000 \\times 9.967',
                    result: 'C \\approx 29,901\\text{ bps} \\quad (\\approx 30\\text{ kbps})'
                }
            },
            {
                expr: '\\text{SNR}_q \\approx 6.02 \\cdot n + 1.76 \\quad (\\text{dB})',
                desc: 'Quantization Signal-to-Noise Ratio (PCM)',
                variables: [
                    '\\text{SNR}_q = Peak signal-to-quantization noise ratio in decibels (dB)',
                    'n = D/A conversion word bit resolution (quantizer bits)'
                ],
                explanation: 'Calculates the signal quality rating of digital systems, showing that each additional bit improves signal-to-noise ratio by approximately 6 dB.',
                example: {
                    inputs: 'n = 8\\text{ bits} \\quad (\\text{Standard telephone PCM})',
                    steps: '\\text{SNR}_q = 6.02 \\times 8 + 1.76 = 48.16 + 1.76',
                    result: '\\text{SNR}_q \\approx 49.92\\text{ dB}'
                }
            },
            {
                expr: '\\text{BER}_{\\text{BPSK}} = Q\\left( \\sqrt{\\frac{2 \\cdot E_b}{N_0}} \\right)',
                desc: 'BPSK Bit Error Rate (BER)',
                variables: [
                    '\\text{BER} = Average bit error probability probability',
                    'E_b = Energy contained per bit (Joules)',
                    'N_0 = Noise power spectral density (W/Hz)',
                    'Q(x) = Gaussian tail integration function (Q-function)'
                ],
                explanation: 'Determines the theoretical error probability for Binary Phase Shift Keying (BPSK) digital transmissions over noisy channels.',
                example: {
                    inputs: 'E_b/N_0 = 4 \\implies \\sqrt{2 \\times 4} = \\sqrt{8} \\approx 2.83 \\implies Q(2.83)',
                    steps: '\\text{Referencing Q-table values for } x=2.83',
                    result: '\\text{BER} \\approx 2.3 \\times 10^{-3} \\quad (\\text{about 0.23\\% error rate})'
                }
            },
            {
                expr: 'f_s \\ge 2 \\cdot f_{\\text{max}}',
                desc: 'Nyquist Sampling rate limit',
                variables: [
                    'f_s = Sampling rate (samples/sec)',
                    'f_{\\text{max}} = Bandlimit spectrum boundary (Hz)'
                ],
                explanation: 'Re-iterates the Nyquist theorem inside communications context to ensure distortion-free demodulation steps.',
                example: {
                    inputs: 'f_{\\text{max}} = 3.4\\text{ kHz}',
                    steps: 'f_s = 2 \\times 3400',
                    result: 'f_s \\ge 6.8\\text{ kHz}'
                }
            }
        ],
        revision: [
            'AM: simple but inefficient; FM: better noise immunity, wider bandwidth',
            'Carson\'s rule: FM bandwidth ≈ 2(frequency deviation + message frequency)',
            'Shannon capacity sets the absolute maximum data rate for given SNR and bandwidth',
            'QPSK: 2 bits/symbol; 16-QAM: 4 bits/symbol; 64-QAM: 6 bits/symbol',
            'Quantization SNR improves by ~6 dB per additional bit',
            'Matched filter maximizes SNR at the receiver output',
            'Common mistake: confusing modulation index for AM (m) vs FM (β = Δf/f_m)'
        ]
    },
    {
        id: 'vlsi',
        title: 'VLSI Design',
        icon: '⚙️',
        category: 'Micro-electronics',
        color: '#a855f7',
        route: '#/concept/vlsi',
        chapters: [
            {
                title: 'CMOS Logic Design',
                content: 'CMOS uses complementary NMOS (pull-down) and PMOS (pull-up) networks. NMOS conducts when gate is HIGH; PMOS conducts when gate is LOW. CMOS inverter: near-zero static power dissipation since one transistor is always OFF. Dynamic power: P = α·C_L·V_DD²·f where α is switching activity factor.'
            },
            {
                title: 'Voltage Transfer Characteristics',
                content: 'The VTC curve plots V_out vs V_in. Key parameters: V_IL (max input LOW), V_IH (min input HIGH), V_OL (output LOW), V_OH (output HIGH). Noise margins: NM_L = V_IL - V_OL and NM_H = V_OH - V_IH. The transition region shows gain > 1, enabling regenerative signal restoration.'
            },
            {
                title: 'Timing & Layout',
                content: 'Propagation delay t_pd depends on load capacitance, transistor sizing, and supply voltage. Larger W/L ratio → faster switching but more area and power. Layout follows design rules specifying minimum feature sizes, spacing, and overlap. Stick diagrams provide quick topology visualization before full layout.'
            },
            {
                title: 'Scaling & Power',
                content: 'Moore\'s Law: transistor count doubles every ~2 years. Dennard scaling: reduce dimensions by κ, voltage by κ → power density stays constant. Below 45nm, leakage power becomes significant. Techniques: multi-threshold CMOS, power gating, dynamic voltage/frequency scaling (DVFS).'
            }
        ],
        formulas: [
            {
                expr: 'P_{\\text{dynamic}} = \\alpha \\cdot C_L \\cdot V_{\\text{DD}}^2 \\cdot f',
                desc: 'CMOS Dynamic Power Dissipation',
                variables: [
                    'P_{\\text{dynamic}} = Dynamic power dissipation due to gate switching (Watts)',
                    '\\alpha = Switching activity factor (0 to 1, typically 0.1)',
                    'C_L = Capacitive load of gate networks (Farads)',
                    'V_{\\text{DD}} = Logic supply voltage line (V)',
                    'f = System clock frequency (Hz)'
                ],
                explanation: 'Calculates the dynamic power consumed when charging and discharging load capacitances during logic state transitions.',
                example: {
                    inputs: '\\alpha = 0.1, C_L = 10\\text{ pF} = 10^{-11}\\text{ F}, V_{\\text{DD}} = 1.2\\text{ V}, f = 2\\text{ GHz} = 2 \\times 10^9\\text{ Hz}',
                    steps: 'P_{\\text{dynamic}} = 0.1 \\times 10^{-11} \\times 1.44 \\times 2 \\times 10^9 = 10^{-12} \\times 2.88 \\times 10^9',
                    result: 'P_{\\text{dynamic}} = 2.88\\text{ mWatts} \\quad (\\text{per gate})'
                }
            },
            {
                expr: 'P_{\\text{static}} = I_{\\text{leak}} \\cdot V_{\\text{DD}}',
                desc: 'CMOS Static Power Dissipation',
                variables: [
                    'P_{\\text{static}} = Static power dissipation (Watts)',
                    'I_{\\text{leak}} = Total leakage current due to subthreshold and gate leakage (A)'
                ],
                explanation: 'Models the continuous power loss when transistors are idle, which becomes significant in sub-45nm silicon nodes.',
                example: {
                    inputs: 'I_{\\text{leak}} = 5\\text{ }\\mu\\text{A} = 5 \\times 10^{-6}\\text{ A}, V_{\\text{DD}} = 1.0\\text{ V}',
                    steps: 'P_{\\text{static}} = 5 \\times 10^{-6} \\times 1.0',
                    result: 'P_{\\text{static}} = 5.0\\text{ }\\mu\\text{Watts}'
                }
            },
            {
                expr: '\\text{NM}_L = V_{IL} - V_{OL}',
                desc: 'Low Noise Margin Index',
                variables: [
                    '\\text{NM}_L = Low-level noise margin tolerance (V)',
                    'V_{IL} = Maximum input voltage recognized as a logic LOW (V)',
                    'V_{OL} = Maximum output voltage generated for a logic LOW (V)'
                ],
                explanation: 'Measures the noise immunity of a logic gate against external voltage fluctuations when in the logic LOW state.',
                example: {
                    inputs: 'V_{IL} = 0.45\\text{ V}, V_{OL} = 0.05\\text{ V}',
                    steps: '\\text{NM}_L = 0.45 - 0.05',
                    result: '\\text{NM}_L = 0.40\\text{ V} \\quad (\\text{Can tolerate up to 400mV of noise})'
                }
            },
            {
                expr: '\\text{NM}_H = V_{OH} - V_{IH}',
                desc: 'High Noise Margin Index',
                variables: [
                    '\\text{NM}_H = High-level noise margin tolerance (V)',
                    'V_{OH} = Minimum output voltage generated for a logic HIGH (V)',
                    'V_{IH} = Minimum input voltage recognized as a logic HIGH (V)'
                ],
                explanation: 'Measures the noise immunity of a logic gate against external voltage drops when in the logic HIGH state.',
                example: {
                    inputs: 'V_{OH} = 0.95\\text{ V}, V_{IH} = 0.65\\text{ V}',
                    steps: '\\text{NM}_H = 0.95 - 0.65',
                    result: '\\text{NM}_H = 0.30\\text{ V}'
                }
            },
            {
                expr: '\\tau_{Elmore} = \\sum_{i=1}^{M} R_{i0} \\cdot C_i',
                desc: 'Elmore RC Delay Model',
                variables: [
                    '\\tau = Interconnect/gate propagation delay estimate (seconds)',
                    'C_i = Nodal capacitance at node i (Farads)',
                    'R_{i0} = Total shared path resistance from supply to node i (\\Omega)'
                ],
                explanation: 'Provides a fast, accurate RC timing delay estimation for complex interconnect networks and tree networks.',
                example: {
                    inputs: 'Shared path: R = 50\\Omega, Node loads: C_1 = 100\\text{ fF}, C_2 = 200\\text{ fF}',
                    steps: '\\tau = 50 \\times 100 \\times 10^{-15} + 100 \\times 200 \\times 10^{-15} \\quad (\\text{cumulative node evaluation})',
                    result: '\\tau_{Elmore} \\approx 25\\text{ picoseconds}'
                }
            },
            {
                expr: 'I_D = \\frac{\\mu_n \\cdot C_{\\text{ox}}}{2} \\cdot \\frac{W}{L} \\cdot (V_{\\text{GS}} - V_t)^2',
                desc: 'MOSFET Saturation Drain Current',
                variables: [
                    'I_D = Saturation drain current (A)',
                    '\\mu_n = Electron mobility in the channel (cm^2/V\\cdot s)',
                    'C_{\\text{ox}} = Gate oxide capacitance per unit area (F/cm^2)',
                    'W, L = Transistor channel width and length (m or \\mu m)',
                    'V_{\\text{GS}} = Applied gate-to-source voltage bias (V)',
                    'V_t = MOSFET threshold voltage barrier (V)'
                ],
                explanation: 'Calculates the maximum saturation current of an NMOS transistor operating in its active saturation region ($V_{\\text{DS}} \\ge V_{\\text{GS}} - V_t$).',
                example: {
                    inputs: '\\mu_n C_{\\text{ox}} = 200\\text{ }\\mu\\text{A/V}^2, W/L = 10, V_{\\text{GS}} = 1.2\\text{V}, V_t = 0.4\\text{V}',
                    steps: 'I_D = \\frac{200 \\times 10^{-6}}{2} \\times 10 \\times (1.2 - 0.4)^2 = 10^{-4} \\times 10 \\times 0.64',
                    result: 'I_D = 0.64\\text{ mA}'
                }
            }
        ],
        revision: [
            'CMOS: NMOS pulls down (gate HIGH), PMOS pulls up (gate LOW)',
            'Static power in CMOS ≈ 0 (ideal) — dominant advantage over NMOS-only',
            'Dynamic power ∝ V_DD² × frequency × switching activity',
            'Noise margin: ability to tolerate signal degradation without error',
            'Stick diagrams → layout → fabrication mask generation',
            'Below 45nm: leakage power becomes comparable to dynamic power',
            'Common mistake: sizing PMOS same as NMOS (PMOS should be ~2-3× wider for equal drive strength)'
        ]
    },
    {
        id: 'embedded',
        title: 'Embedded Systems & IoT',
        icon: '🌐',
        category: 'Systems Integration',
        color: '#22c55e',
        route: '#/concept/embedded',
        chapters: [
            {
                title: 'Embedded System Architecture',
                content: 'An embedded system is a dedicated computing system designed for specific tasks within a larger system. Components: Microcontroller/SoC, memory (Flash ROM, SRAM), I/O peripherals (GPIO, ADC, DAC, UART, SPI, I2C), and power management. Design constraints: real-time performance, low power, small footprint, reliability.'
            },
            {
                title: 'RTOS Fundamentals',
                content: 'Real-Time Operating Systems manage task scheduling under strict timing constraints. Scheduling algorithms: Rate Monotonic (fixed priority, shorter period = higher priority), Earliest Deadline First (dynamic priority). Context switching enables multitasking. Priority inversion occurs when a low-priority task blocks a high-priority one — solved by priority inheritance.'
            },
            {
                title: 'IoT Communication Protocols',
                content: 'Short-range: Bluetooth (BLE for low power), Zigbee (mesh networking), WiFi (high throughput). Long-range: LoRa (kilometers range, low power), NB-IoT (cellular), Sigfox. Protocol stack: MQTT (lightweight publish-subscribe), CoAP (constrained RESTful), HTTP/HTTPS. Edge computing processes data locally to reduce latency and bandwidth.'
            },
            {
                title: 'Sensor Interfacing & Signal Conditioning',
                content: 'Sensors convert physical quantities to electrical signals: temperature (thermistor, RTD), pressure (piezoelectric), light (LDR, photodiode), motion (accelerometer, gyroscope). Signal conditioning: amplification (op-amp), filtering (anti-aliasing), level shifting, and ADC conversion. Resolution = V_ref/(2^n - 1) for an n-bit ADC.'
            }
        ],
        formulas: [
            {
                expr: '\\text{Resolution} = \\frac{V_{\\text{ref}}}{2^n - 1}',
                desc: 'ADC Step Size Resolution',
                variables: [
                    '\\text{Resolution} = Smallest voltage change detectable by the ADC (V/step)',
                    'V_{\\text{ref}} = Full-scale analog reference voltage line (V)',
                    'n = Bit depth resolution of the ADC converter'
                ],
                explanation: 'Calculates the analog step voltage equivalent to 1 LSB in digital outputs, defining the accuracy limits of digitization.',
                example: {
                    inputs: 'V_{\\text{ref}} = 3.3\\text{ V}, n = 12\\text{ bits} \\implies 2^{12}-1 = 4095\\text{ levels}',
                    steps: '\\text{Step} = \\frac{3.3\\text{ V}}{4095}',
                    result: '\\text{ADC Resolution} \\approx 0.806\\text{ mV/step}'
                }
            },
            {
                expr: '\\text{Baud Rate} = \\frac{f_{\\text{clk}}}{16 \\cdot \\text{Divisor}}',
                desc: 'UART Baud Rate Formula',
                variables: [
                    '\\text{Baud Rate} = Communication channel symbol speed (bits/sec, bps)',
                    'f_{\\text{clk}} = Microcontroller system clock frequency (Hz)',
                    '\\text{Divisor} = Baud rate generator reload register integer'
                ],
                explanation: 'Calculates the divisor value required to generate standard UART baud rates for asynchronous serial communication.',
                example: {
                    inputs: 'f_{\\text{clk}} = 16\\text{ MHz}, \\text{Desired Baud Rate} = 9600\\text{ bps}',
                    steps: '\\text{Divisor} = \\frac{16 \\times 10^6}{16 \\times 9600} = \\frac{10^6}{9600}',
                    result: '\\text{Divisor} \\approx 104 \\quad (\\text{Register reload value for 9600 baud})'
                }
            },
            {
                expr: '\\text{Duty Cycle} = \\frac{T_{\\text{on}}}{T_{\\text{total}}} \\times 100\\%',
                desc: 'PWM Duty Cycle',
                variables: [
                    '\\text{Duty Cycle} = Fractional active high power output percentage',
                    'T_{\\text{on}} = Time duration spent in the HIGH state (seconds)',
                    'T_{\\text{total}} = Full period duration of the PWM cycle (seconds)'
                ],
                explanation: 'Determines the average output voltage delivered by a Pulse Width Modulated (PWM) signal to control motors or LED brightness.',
                example: {
                    inputs: 'T_{\\text{on}} = 2\\text{ ms}, T_{\\text{total}} = 10\\text{ ms} \\quad (f = 100\\text{ Hz})',
                    steps: '\\text{Duty} = \\frac{2}{10} \\times 100\\%',
                    result: '\\text{Duty Cycle} = 20\\%'
                }
            },
            {
                expr: '\\text{FSPL (dB)} = 20 \\cdot \\log_{10}(d) + 20 \\cdot \\log_{10}(f) - 147.56',
                desc: 'Free-Space Path Loss (FSPL)',
                variables: [
                    'd = Transmission distance between antennas (meters)',
                    'f = Carrier wave signal frequency (Hz)'
                ],
                explanation: 'Calculates the signal attenuation of a wireless wave propagating through free space, which is critical for RF link budgeting.',
                example: {
                    inputs: 'd = 100\\text{ meters}, f = 2.4\\text{ GHz} = 2.4 \\times 10^9\\text{ Hz} \\quad (\\text{WiFi})',
                    steps: '\\text{Loss} = 20\\log_{10}(100) + 20\\log_{10}(2.4 \\times 10^9) - 147.56 = 40 + 187.6 - 147.56',
                    result: '\\text{FSPL} \\approx 80.04\\text{ dB}'
                }
            },
            {
                expr: '\\text{Battery Life} = \\frac{\\text{Capacity}_{\\text{mAh}}}{I_{\\text{avg}} \\cdot 1.2} \\quad (\\text{hours})',
                desc: 'Battery Runtime Estimation',
                variables: [
                    '\\text{Capacity}_{\\text{mAh}} = Total battery charge capacity rating (milliampere-hours)',
                    'I_{\\text{avg}} = Average current consumption of the IoT node (mA)',
                    '1.2 = Derating safety factor for battery chemical discharge curve degradation'
                ],
                explanation: 'Estimates the operating life of a battery-powered sensor node based on average active/sleep power consumption.',
                example: {
                    inputs: 'Capacity = 2000\\text{ mAh}, I_{\\text{avg}} = 2\\text{ mA} \\quad (\\text{Low-power sleep optimizations})',
                    steps: '\\text{Runtime} = \\frac{2000}{2 \\times 1.2} = \\frac{2000}{2.4}',
                    result: '\\text{Battery Life} \\approx 833.3\\text{ hours} \\quad (\\approx 34.7\\text{ days})'
                }
            }
        ],
        revision: [
            'Embedded = dedicated computing for specific application',
            'RTOS: deterministic timing, priority-based scheduling',
            'Priority inversion: solved by priority inheritance protocol',
            'I2C: 2 wires (SDA, SCL), multi-master; SPI: 4 wires, faster',
            'MQTT: lightweight pub-sub for IoT; CoAP: RESTful for constrained devices',
            'LoRa: long range (km), low power, low data rate',
            'Common mistake: not accounting for sensor warm-up time in ADC readings'
        ]
    },
    {
        id: 'optical',
        title: 'Optical & Microwave Engineering',
        icon: '🔭',
        category: 'High-Frequency Comms',
        color: '#ec4899',
        route: '#/concept/optical',
        chapters: [
            {
                title: 'Fiber Optic Communication',
                content: 'Optical fibers guide light through total internal reflection. Core (high refractive index n₁) surrounded by cladding (lower n₂). Types: Single-mode (small core ~9μm, long distance, low dispersion) and Multi-mode (large core ~50-62.5μm, short distance). Numerical Aperture NA = √(n₁² - n₂²) determines the light acceptance cone angle.'
            },
            {
                title: 'Optical Sources & Detectors',
                content: 'Sources: LED (incoherent, multi-mode fibers) and Laser Diodes (coherent, single-mode fibers, higher power and narrower linewidth). Detectors: PIN photodiode (fast, linear) and Avalanche Photodiode APD (internal gain, more sensitive). Responsivity R = I_ph/P_opt (A/W). Quantum efficiency η = (electrons generated)/(photons absorbed).'
            },
            {
                title: 'Waveguide Theory',
                content: 'Rectangular waveguides support TE (transverse electric) and TM (transverse magnetic) modes. Cutoff frequency f_c = c/(2a) for dominant mode TE₁₀. Below cutoff, waves are evanescent (attenuated). Microstrip lines on PCBs carry signals above 1 GHz. Characteristic impedance Z₀ depends on trace width, substrate thickness, and dielectric constant.'
            },
            {
                title: 'Radar & Antenna Fundamentals',
                content: 'Radar range equation: P_r = P_t·G²·λ²·σ / ((4π)³·R⁴). Antenna gain G = 4πA_e/λ². Directivity measures how focused the radiation pattern is. EIRP (Effective Isotropic Radiated Power) = P_t × G_t. Doppler radar measures target velocity from frequency shift: v = Δf·λ/2.'
            }
        ],
        formulas: [
            {
                expr: '\\text{NA} = \\sqrt{n_1^2 - n_2^2}',
                desc: 'Optical Fiber Numerical Aperture',
                variables: [
                    '\\text{NA} = Numerical aperture acceptance cone rating',
                    'n_1 = Refractive index of the optical fiber core glass',
                    'n_2 = Refractive index of the surrounding cladding glass (must satisfy n_2 < n_1)'
                ],
                explanation: 'Measures the light-gathering capability of an optical fiber and defines the maximum acceptance angle for total internal reflection.',
                example: {
                    inputs: 'n_1 = 1.50, n_2 = 1.46',
                    steps: '\\text{NA} = \\sqrt{1.50^2 - 1.46^2} = \\sqrt{2.25 - 2.1316} = \\sqrt{0.1184}',
                    result: '\\text{NA} \\approx 0.344 \\quad (\\text{Acceptance angle } \\theta = \\sin^{-1}(0.344) \\approx 20.1^\\circ)'
                }
            },
            {
                expr: '\\theta_c = \\sin^{-1}\\left( \\frac{n_2}{n_1} \\right)',
                desc: 'Critical Angle for Total Internal Reflection',
                variables: [
                    '\\theta_c = Critical angle threshold measured relative to normal interface boundary',
                    'n_1 = High refractive index core medium',
                    'n_2 = Low refractive index cladding medium'
                ],
                explanation: 'Defines the minimum angle of incidence at which light is entirely reflected back into the core rather than refracting out.',
                example: {
                    inputs: 'n_1 = 1.50, n_2 = 1.46',
                    steps: '\\theta_c = \\sin^{-1}(1.46 / 1.50) = \\sin^{-1}(0.9733)',
                    result: '\\theta_c \\approx 76.7^\\circ'
                }
            },
            {
                expr: 'f_c = \\frac{c}{2 \\cdot a}',
                desc: 'Dominant Waveguide Mode Cutoff Frequency',
                variables: [
                    'f_c = Cutoff frequency below which no waves can propagate (Hz)',
                    'c = Speed of light in vacuum (3 \\times 10^8\\text{ m/s})',
                    'a = Broad wall dimension width of the rectangular waveguide (meters)'
                ],
                explanation: 'Determines the minimum cutoff frequency for the dominant $TE_{10}$ mode in rectangular hollow metal waveguides.',
                example: {
                    inputs: 'a = 3.0\\text{ cm} = 0.03\\text{ meters}',
                    steps: 'f_c = \\frac{3 \\times 10^8}{2 \\times 0.03} = \\frac{3 \\times 10^8}{0.06}',
                    result: 'f_c = 5.0\\text{ GHz}'
                }
            },
            {
                expr: 'P_r = \\frac{P_t \\cdot G^2 \\cdot \\lambda^2 \\cdot \\sigma}{(4\\pi)^3 \\cdot R^4}',
                desc: 'Radar Range Equation',
                variables: [
                    'P_r = Echo back power received at radar (Watts)',
                    'P_t = Transmitter output power peak (W)',
                    'G = Radar antenna directional gain (ratio)',
                    '\\lambda = Radar electromagnetic wavelength (meters)',
                    '\\sigma = Radar target back-scattering cross-section (m^2)',
                    'R = Line-of-sight distance distance to target (meters)'
                ],
                explanation: 'Calculates the returned signal power for radar systems, illustrating the high signal attenuation over distance ($1/R^4$).',
                example: {
                    inputs: 'P_t = 100\\text{ kW}, G = 1000\\text{ (30 dB)}, \\lambda = 3\\text{ cm} = 0.03\\text{m}, \\sigma = 1\\text{ m}^2, R = 10\\text{ km} = 10^4\\text{m}',
                    steps: 'P_r = \\frac{10^5 \\times 10^6 \\times 0.0009 \\times 1}{1.984 \\times 10^3 \\times 10^{16}} = \\frac{9 \\times 10^7}{1.984 \\times 10^{19}}',
                    result: 'P_r \\approx 4.54 \\times 10^{-12}\\text{ Watts} \\quad (\\text{extremely weak picowatt signal})'
                }
            },
            {
                expr: 'G = \\frac{4\\pi \\cdot A_e}{\\lambda^2}',
                desc: 'Aperture Antenna Directivity Gain',
                variables: [
                    'G = Antenna directive gain power multiplier ratio',
                    'A_e = Effective antenna aperture collection area (m^2)',
                    '\\lambda = Operating wavelength of carrier wave (meters)'
                ],
                explanation: 'Relates the physical area of an aperture antenna (like a parabolic dish) to its directional power gain.',
                example: {
                    inputs: 'A_e = 0.5\\text{ m}^2 \\quad (\\text{approx 80cm dish}), \\lambda = 10\\text{ cm} = 0.1\\text{ meters} \\quad (\\text{3 GHz Microwave})',
                    steps: 'G = \\frac{4\\pi \\times 0.5}{0.1^2} = \\frac{2\\pi}{0.01}',
                    result: 'G \\approx 628.3 \\quad (\\text{or } 10\\log_{10}(628.3) \\approx 28\\text{ dBi})'
                }
            },
            {
                expr: 'v = \\frac{f_d \\cdot \\lambda}{2}',
                desc: 'Doppler Velocity Equation',
                variables: [
                    'v = Line-of-sight velocity of target relative to radar (m/s)',
                    'f_d = Doppler frequency shift measured at receiver (Hz)',
                    '\\lambda = Transmitted radar wavelength (meters)'
                ],
                explanation: 'Calculates target velocity based on the frequency shift of the reflected radar wave.',
                example: {
                    inputs: 'f_d = 800\\text{ Hz}, \\lambda = 3\\text{ cm} = 0.03\\text{ meters} \\quad (\\text{X-band radar})',
                    steps: 'v = \\frac{800 \\times 0.03}{2} = \\frac{24}{2}',
                    result: 'v = 12\\text{ m/s} \\quad (\\approx 43.2\\text{ km/h})'
                }
            }
        ],
        revision: [
            'Single-mode fiber: small core, low dispersion, long distance',
            'Multi-mode fiber: large core, shorter distance, cheaper',
            'NA determines the cone of light acceptance — higher NA = more light coupled',
            'Laser diode: coherent, narrow linewidth; LED: incoherent, broader spectrum',
            'Waveguide modes: TE₁₀ is dominant in rectangular waveguides',
            'Radar: power falls as 1/R⁴ (round-trip path loss)',
            'Common mistake: confusing critical angle direction (measured from normal, not surface)'
        ]
    }
];

// ─── MODULE STATE ─────────────────────────────────────────────────────────────
let activeTab = 'subjects';       // 'subjects' | 'formulas' | 'revision' | 'glossary'
let expandedSubject = null;
let searchQuery = '';
let animTimers = [];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getTotalChapters() {
    return NOTES_DATA.reduce((sum, s) => sum + s.chapters.length, 0);
}

function getTotalFormulas() {
    return NOTES_DATA.reduce((sum, s) => sum + s.formulas.length, 0);
}

function getSubjectProgress(id) {
    const quizId = id === 'flipflops' ? 'flip-flops' : (id === 'pn-junction' ? 'pn-junction' : id);
    const score = AppState.completedQuizzes?.[quizId];
    return score !== undefined ? Math.min(score, 100) : 0;
}

function highlightMatch(text, query) {
    if (!query || query.length < 2) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="nh-highlight">$1</mark>');
}

function createFormulaCardHtml(f) {
    const doubleEscapedExpr = f.expr.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
    return `
        <div class="formula-card glass-card">
            <div class="formula-card-header">
                <h4 class="formula-card-title">${f.desc}</h4>
                <button class="copy-formula-btn" data-formula="${doubleEscapedExpr}" title="Copy LaTeX Formula">
                    <i data-lucide="copy" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Copy LaTeX
                </button>
            </div>
            <div class="formula-display-container" data-formula-zoom="${doubleEscapedExpr}" title="Click to zoom formula">
                <span class="formula-latex">$$${f.expr}$$</span>
            </div>
            <div class="formula-details">
                <div class="formula-section">
                    <span class="formula-section-title"><i data-lucide="info" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Variable Definitions:</span>
                    <ul class="formula-variables-list">
                        ${f.variables.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
                <div class="formula-section">
                    <span class="formula-section-title"><i data-lucide="book-open" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Explanation:</span>
                    <p class="formula-explanation">${f.explanation}</p>
                </div>
                <div class="formula-section">
                    <span class="formula-section-title"><i data-lucide="calculator" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Example Calculation:</span>
                    <div class="formula-example">
                        <strong>Given:</strong> ${f.example.inputs}<br>
                        <strong>Steps:</strong> $${f.example.steps}$$<br>
                        <strong>Result:</strong> <span style="color: var(--accent-secondary); font-weight: 600;">$${f.example.result}$$</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ─── RENDER ───────────────────────────────────────────────────────────────────
export const render = async () => {
    const totalChapters = getTotalChapters();
    const totalFormulas = getTotalFormulas();
    const totalSubjects = NOTES_DATA.length;
    const totalRevision = NOTES_DATA.length;

    return `
<style>
/* ═══════════════════════════════════════════════════════════════════════════════
   NOTES HUB — SCOPED STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */
.nh-wrap {
    min-height: 100vh;
    padding: 32px 40px 80px;
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
}

/* ── Hero Header ── */
.nh-hero {
    text-align: center;
    margin-bottom: 40px;
    animation: nhFadeUp 0.6s ease both;
}
.nh-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 100px;
    padding: 6px 16px;
    font-family: 'DM Mono', monospace; font-size: 0.7rem;
    color: var(--accent-primary); letter-spacing: 0.08em;
    margin-bottom: 18px;
    text-transform: uppercase;
}
.nh-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent-primary);
    animation: nhBlink 1.5s ease-in-out infinite;
}
@keyframes nhBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

.nh-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 12px;
}
.nh-title span {
    background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 50%, var(--accent-purple) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
}
.nh-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.6;
}

/* ── Stats Cards ── */
.nh-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 36px;
    animation: nhFadeUp 0.6s 0.1s ease both;
}
.nh-stat-card {
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 22px 20px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}
.nh-stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-secondary), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}
.nh-stat-card:hover { transform: translateY(-4px); border-color: var(--border-glow); }
.nh-stat-card:hover::before { opacity: 1; }
.nh-stat-icon {
    font-size: 1.6rem;
    margin-bottom: 10px;
    display: block;
}
.nh-stat-num {
    font-family: 'Space Grotesk', monospace;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
    color: var(--accent-secondary);
}
.nh-stat-num.purple { color: var(--accent-purple); }
.nh-stat-num.green { color: var(--success); }
.nh-stat-num.amber { color: var(--warning); }
.nh-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

/* ── Search Bar ── */
.nh-search-wrap {
    position: relative;
    max-width: 520px;
    margin: 0 auto 28px;
    animation: nhFadeUp 0.6s 0.15s ease both;
}
.nh-search-icon {
    position: absolute;
    left: 16px; top: 50%; transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
}
.nh-search {
    width: 100%;
    padding: 14px 16px 14px 44px;
    background: var(--bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    color: var(--text-primary);
    font-size: 0.95rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}
.nh-search::placeholder { color: var(--text-muted); }
.nh-search:focus {
    border-color: var(--accent-secondary);
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.12);
}

/* ── Tab Navigation ── */
.nh-tabs {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    animation: nhFadeUp 0.6s 0.2s ease both;
}
.nh-tab {
    padding: 10px 22px;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    background: var(--bg-glass);
    backdrop-filter: blur(6px);
    color: var(--text-secondary);
    font-family: var(--font-heading);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    display: flex; align-items: center; gap: 8px;
}
.nh-tab:hover {
    border-color: rgba(6, 182, 212, 0.3);
    color: var(--text-primary);
    background: rgba(6, 182, 212, 0.06);
}
.nh-tab.active {
    border-color: var(--accent-secondary);
    color: var(--accent-secondary);
    background: rgba(6, 182, 212, 0.1);
    box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
}
.nh-tab-icon { font-size: 1rem; }

/* ── Tab Content ── */
.nh-tab-content { display: none; animation: nhFadeIn 0.35s ease; }
.nh-tab-content.active { display: block; }
@keyframes nhFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ── Subject Cards Grid ── */
.nh-subjects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
}
.nh-subject-card {
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.35s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.nh-subject-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--card-accent, var(--accent-secondary));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s;
}
.nh-subject-card:hover { transform: translateY(-5px); border-color: rgba(6,182,212,0.3); }
.nh-subject-card:hover::before { transform: scaleX(1); }
.nh-subject-card.expanded { border-color: var(--card-accent, var(--accent-secondary)); }
.nh-subject-card.expanded::before { transform: scaleX(1); }

.nh-card-header {
    display: flex; align-items: flex-start; gap: 14px;
    margin-bottom: 12px;
}
.nh-card-emoji { font-size: 2rem; line-height: 1; flex-shrink: 0; }
.nh-card-info { flex: 1; }
.nh-card-title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-primary);
    margin-bottom: 4px;
}
.nh-card-category {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    padding: 2px 8px;
    border-radius: 100px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--card-accent, var(--accent-secondary));
    background: rgba(6,182,212,0.08);
    border: 1px solid rgba(6,182,212,0.15);
}
.nh-card-meta {
    display: flex; gap: 16px;
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-bottom: 12px;
}
.nh-card-meta span { display: flex; align-items: center; gap: 4px; }

.nh-card-progress {
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
}
html[data-theme="light"] .nh-card-progress { background: rgba(0,0,0,0.06); }
.nh-card-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--card-accent, var(--accent-secondary));
    transition: width 1s ease;
}
.nh-card-expand-icon {
    position: absolute;
    top: 16px; right: 16px;
    color: var(--text-muted);
    transition: transform 0.3s;
    font-size: 0.85rem;
}
.nh-subject-card.expanded .nh-card-expand-icon { transform: rotate(180deg); }

/* ── Expanded Detail Panel ── */
.nh-detail-panel {
    display: none;
    grid-column: 1 / -1;
    background: var(--bg-glass);
    backdrop-filter: blur(14px);
    border: 1px solid var(--border-glow);
    border-radius: 16px;
    padding: 28px;
    animation: nhSlideDown 0.35s ease;
}
.nh-detail-panel.visible { display: block; }
@keyframes nhSlideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 3000px; } }

.nh-detail-tabs {
    display: flex; gap: 4px; margin-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
}
.nh-dtab {
    padding: 7px 16px;
    border-radius: 8px;
    font-family: var(--font-heading);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: none;
}
.nh-dtab:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
.nh-dtab.active { color: var(--accent-secondary); background: rgba(6,182,212,0.1); }

.nh-detail-section { display: none; }
.nh-detail-section.active { display: block; animation: nhFadeIn 0.25s ease; }

/* Chapter items */
.nh-chapter {
    margin-bottom: 16px;
    padding: 16px;
    background: rgba(0,0,0,0.15);
    border-radius: 12px;
    border-left: 3px solid var(--accent-secondary);
}
html[data-theme="light"] .nh-chapter { background: rgba(0,0,0,0.03); }
.nh-chapter-title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--accent-secondary);
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
}
.nh-chapter-title::before {
    content: '📖';
    font-size: 0.9rem;
}
.nh-chapter-content {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.7;
}

/* Formula items */
.nh-formula-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px;
    background: rgba(0,0,0,0.12);
    border-radius: 10px;
    margin-bottom: 8px;
    border: 1px solid rgba(6,182,212,0.08);
    transition: border-color 0.2s;
}
html[data-theme="light"] .nh-formula-item { background: rgba(0,0,0,0.03); }
.nh-formula-item:hover { border-color: rgba(6,182,212,0.25); }
.nh-formula-expr {
    font-family: 'DM Mono', 'JetBrains Mono', monospace;
    font-size: 0.88rem;
    color: var(--accent-secondary);
    font-weight: 600;
    white-space: nowrap;
    min-width: 220px;
}
.nh-formula-desc {
    font-size: 0.82rem;
    color: var(--text-muted);
}

/* Revision items */
.nh-revision-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.5;
}
html[data-theme="light"] .nh-revision-item { border-color: rgba(0,0,0,0.04); }
.nh-revision-item:last-child { border-bottom: none; }
.nh-revision-bullet {
    width: 20px; height: 20px;
    border-radius: 6px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
    font-size: 0.65rem; color: var(--success); font-weight: bold;
}

/* Glossary terms */
.nh-glossary-term {
    padding: 14px 16px;
    background: rgba(0,0,0,0.12);
    border-radius: 10px;
    margin-bottom: 8px;
    border-left: 3px solid var(--accent-primary);
}
html[data-theme="light"] .nh-glossary-term { background: rgba(0,0,0,0.03); }
.nh-glossary-name {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.88rem;
    color: var(--accent-primary);
    margin-bottom: 4px;
    text-transform: capitalize;
}
.nh-glossary-def {
    font-size: 0.84rem;
    color: var(--text-secondary);
    line-height: 1.6;
}

/* ── Formula Sheets Tab ── */
.nh-formula-group {
    margin-bottom: 20px;
}
.nh-formula-group-header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px;
    background: var(--bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s;
    margin-bottom: 2px;
}
.nh-formula-group-header:hover {
    border-color: rgba(6,182,212,0.3);
    background: rgba(6,182,212,0.04);
}
.nh-formula-group-header.open {
    border-color: var(--accent-secondary);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 0;
}
.nh-fg-emoji { font-size: 1.3rem; }
.nh-fg-title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text-primary);
    flex: 1;
}
.nh-fg-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--accent-secondary);
    background: rgba(6,182,212,0.1);
    padding: 3px 9px;
    border-radius: 100px;
}
.nh-fg-arrow {
    color: var(--text-muted);
    transition: transform 0.3s;
    font-size: 0.8rem;
}
.nh-formula-group-header.open .nh-fg-arrow { transform: rotate(180deg); }

.nh-formula-group-body {
    display: none;
    padding: 16px 18px;
    background: rgba(0,0,0,0.08);
    border: 1px solid var(--border-color);
    border-top: none;
    border-radius: 0 0 12px 12px;
}
html[data-theme="light"] .nh-formula-group-body { background: rgba(0,0,0,0.02); }
.nh-formula-group-body.open { display: block; animation: nhFadeIn 0.3s ease; }

/* ── Revision Tab ── */
.nh-revision-card {
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 22px;
    margin-bottom: 16px;
    transition: border-color 0.3s;
}
.nh-revision-card:hover { border-color: var(--border-glow); }
.nh-revision-card-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
}
.nh-rc-emoji { font-size: 1.4rem; }
.nh-rc-title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-primary);
    flex: 1;
}
.nh-rc-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    padding: 3px 10px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* ── Glossary Tab ── */
.nh-glossary-group {
    margin-bottom: 24px;
}
.nh-glossary-group-title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text-primary);
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
}
.nh-glossary-group-title::before {
    content: '';
    width: 24px; height: 2px;
    background: var(--accent-secondary);
    display: block;
}

/* ── Search highlight ── */
.nh-highlight {
    background: rgba(6,182,212,0.25);
    color: var(--accent-secondary);
    padding: 0 2px;
    border-radius: 3px;
}

/* ── No results ── */
.nh-no-results {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
}
.nh-no-results-icon { font-size: 3rem; margin-bottom: 16px; display: block; }
.nh-no-results h3 {
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

/* ── Animations ── */
@keyframes nhFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
}
.nh-reveal {
    opacity: 0; transform: translateY(20px);
    transition: all 0.5s ease;
}
.nh-reveal.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 900px) {
    .nh-wrap { padding: 24px 20px 60px; }
    .nh-stats { grid-template-columns: repeat(2, 1fr); }
    .nh-subjects-grid { grid-template-columns: repeat(2, 1fr); }
    .nh-formula-expr { min-width: 140px; font-size: 0.8rem; }
}
@media (max-width: 600px) {
    .nh-wrap { padding: 16px 14px 50px; }
    .nh-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .nh-subjects-grid { grid-template-columns: 1fr; }
    .nh-tabs { gap: 4px; }
    .nh-tab { padding: 8px 14px; font-size: 0.78rem; }
    .nh-card-meta { flex-wrap: wrap; gap: 8px; }
    .nh-formula-item { flex-direction: column; align-items: flex-start; gap: 6px; }
    .nh-formula-expr { min-width: unset; }
    .nh-detail-tabs { flex-wrap: wrap; }
}

/* ── Light mode overrides ── */
html[data-theme="light"] .nh-stat-card { background: rgba(255,255,255,0.7); }
html[data-theme="light"] .nh-subject-card { background: rgba(255,255,255,0.7); }
html[data-theme="light"] .nh-formula-group-header { background: rgba(255,255,255,0.7); }
html[data-theme="light"] .nh-revision-card { background: rgba(255,255,255,0.7); }
html[data-theme="light"] .nh-search { background: rgba(255,255,255,0.8); }
html[data-theme="light"] .nh-tab { background: rgba(255,255,255,0.6); }
html[data-theme="light"] .nh-detail-panel { background: rgba(255,255,255,0.8); }
</style>

<div class="nh-wrap">
    <!-- HERO -->
    <div class="nh-hero">
        <div class="nh-badge">
            <span class="nh-badge-dot"></span>
            Study Resources Center
        </div>
        <h1 class="nh-title">Your <span>Notes Hub</span></h1>
        <p class="nh-subtitle">
            Access comprehensive study notes, formula sheets, revision guides, and a searchable glossary — all curated for ECE students.
        </p>
    </div>

    <!-- STATS CARDS -->
    <div class="nh-stats">
        <div class="nh-stat-card">
            <span class="nh-stat-icon">📚</span>
            <div class="nh-stat-num" data-target="${totalSubjects}">0</div>
            <div class="nh-stat-label">Subjects Available</div>
        </div>
        <div class="nh-stat-card">
            <span class="nh-stat-icon">📝</span>
            <div class="nh-stat-num green" data-target="${totalChapters}">0</div>
            <div class="nh-stat-label">Total Notes</div>
        </div>
        <div class="nh-stat-card">
            <span class="nh-stat-icon">📐</span>
            <div class="nh-stat-num amber" data-target="${totalFormulas}">0</div>
            <div class="nh-stat-label">Formula Sheets</div>
        </div>
        <div class="nh-stat-card">
            <span class="nh-stat-icon">🔁</span>
            <div class="nh-stat-num purple" data-target="${totalRevision}">0</div>
            <div class="nh-stat-label">Revision Guides</div>
        </div>
    </div>

    <!-- PREMIUM STUDY HUB CTA BANNER -->
    <div class="glass-card nh-reveal" style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 16px; padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 32px 0; flex-wrap: wrap; text-align: left;">
        <div style="flex: 1; min-width: 280px;">
            <div class="nh-badge" style="background: rgba(167, 139, 250, 0.12); border-color: rgba(167, 139, 250, 0.25); color: var(--accent-purple); margin-bottom: 8px;">
                <i data-lucide="sparkles" style="width:11px;height:11px;margin-right:4px;display:inline-block;vertical-align:middle;"></i> Premium Integration
            </div>
            <h3 style="margin: 0 0 6px 0; color: #fff; font-family: var(--font-heading); font-weight: 800; font-size: 1.25rem;">B.Tech Interactive ECE Study Hub</h3>
            <p style="margin: 0; color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">Access 17 comprehensive engineering modules featuring step-by-step solved numericals, university exam questions, interactive MCQs, and 17 customized calculators & simulators.</p>
        </div>
        <a href="#/study-hub" class="btn btn-primary" style="background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-secondary) 100%); border: none; padding: 12px 24px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; color: #fff; text-decoration: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
            <i data-lucide="graduation-cap" style="width:16px;height:16px;"></i> Open Study Hub
        </a>
    </div>

    <!-- SEARCH BAR -->
    <div class="nh-search-wrap">
        <i data-lucide="search" class="nh-search-icon" style="width:18px;height:18px;"></i>
        <input type="text" id="nh-search-input" class="nh-search"
               placeholder="Search notes, formulas, terms across all subjects..."
               autocomplete="off">
    </div>

    <!-- TAB NAVIGATION -->
    <div class="nh-tabs">
        <button class="nh-tab active" data-tab="subjects">
            <span class="nh-tab-icon">📚</span> Subject Notes
        </button>
        <button class="nh-tab" data-tab="formulas">
            <span class="nh-tab-icon">📐</span> Formula Sheets
        </button>
        <button class="nh-tab" data-tab="revision">
            <span class="nh-tab-icon">🔁</span> Quick Revision
        </button>
        <button class="nh-tab" data-tab="glossary">
            <span class="nh-tab-icon">📖</span> Glossary
        </button>
    </div>

    <!-- SEARCH RESULTS OVERLAY -->
    <div id="nh-search-results" class="nh-tab-content"></div>

    <!-- TAB 1: SUBJECT NOTES -->
    <div id="nh-tab-subjects" class="nh-tab-content active">
        <div class="nh-subjects-grid" id="nh-subjects-grid">
            ${NOTES_DATA.map((s, i) => {
                const progress = getSubjectProgress(s.id);
                return `
                <div class="nh-subject-card nh-reveal" data-subject-idx="${i}" 
                     style="--card-accent: ${s.color}; animation-delay: ${i * 0.05}s;">
                    <span class="nh-card-expand-icon">▼</span>
                    <div class="nh-card-header">
                        <span class="nh-card-emoji">${s.icon}</span>
                        <div class="nh-card-info">
                            <div class="nh-card-title">${s.title}</div>
                            <span class="nh-card-category" style="color:${s.color}; background:${s.color}15; border-color:${s.color}30;">${s.category}</span>
                        </div>
                    </div>
                    <div class="nh-card-meta">
                        <span><i data-lucide="file-text" style="width:13px;height:13px;"></i> ${s.chapters.length} chapters</span>
                        <span><i data-lucide="calculator" style="width:13px;height:13px;"></i> ${s.formulas.length} formulas</span>
                    </div>
                    <div class="nh-card-progress">
                        <div class="nh-card-progress-fill" style="width:${progress}%; background:${s.color};"></div>
                    </div>
                </div>`;
            }).join('')}
        </div>
        <div id="nh-detail-panel" class="nh-detail-panel"></div>
    </div>

    <!-- TAB 2: FORMULA SHEETS -->
    <div id="nh-tab-formulas" class="nh-tab-content">
        ${NOTES_DATA.map((s, i) => `
            <div class="nh-formula-group nh-reveal" style="animation-delay: ${i * 0.04}s;">
                <div class="nh-formula-group-header" data-fg-idx="${i}">
                    <span class="nh-fg-emoji">${s.icon}</span>
                    <span class="nh-fg-title">${s.title}</span>
                    <span class="nh-fg-count">${s.formulas.length} formulas</span>
                    <span class="nh-fg-arrow">▼</span>
                </div>
                <div class="nh-formula-group-body" data-fg-body="${i}">
                    ${s.formulas.map(f => createFormulaCardHtml(f)).join('')}
                </div>
            </div>
        `).join('')}
    </div>

    <!-- TAB 3: QUICK REVISION -->
    <div id="nh-tab-revision" class="nh-tab-content">
        ${NOTES_DATA.map((s, i) => `
            <div class="nh-revision-card nh-reveal" style="animation-delay: ${i * 0.04}s;">
                <div class="nh-revision-card-header">
                    <span class="nh-rc-emoji">${s.icon}</span>
                    <span class="nh-rc-title">${s.title}</span>
                    <span class="nh-rc-tag" style="color:${s.color}; background:${s.color}12; border: 1px solid ${s.color}30;">${s.category}</span>
                </div>
                ${s.revision.map(r => `
                    <div class="nh-revision-item">
                        <span class="nh-revision-bullet">✓</span>
                        <span>${r}</span>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>

    <!-- TAB 4: GLOSSARY -->
    <div id="nh-tab-glossary" class="nh-tab-content">
        ${Object.entries(GLOSSARY).map(([key, data]) => `
            <div class="nh-glossary-group nh-reveal">
                <div class="nh-glossary-group-title">${data.title}</div>
                ${Object.entries(data.terms).map(([term, def]) => `
                    <div class="nh-glossary-term">
                        <div class="nh-glossary-name">${term.replace(/-/g, ' ')}</div>
                        <div class="nh-glossary-def">${def}</div>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
</div>
`;
};

// ─── MOUNT ────────────────────────────────────────────────────────────────────
export const mount = () => {
    // Reset state
    activeTab = 'subjects';
    expandedSubject = null;
    searchQuery = '';
    animTimers = [];

    // 1. Animate stat counters
    document.querySelectorAll('.nh-stat-num[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
        }, 30);
        animTimers.push(timer);
    });

    // 2. Reveal animations (IntersectionObserver)
    const reveals = document.querySelectorAll('.nh-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    // 3. Tab switching
    document.querySelectorAll('.nh-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            activeTab = tabName;

            // Update tab active state
            document.querySelectorAll('.nh-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show correct content
            document.querySelectorAll('.nh-tab-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`nh-tab-${tabName}`);
            if (target) target.classList.add('active');

            // Hide search results
            const sr = document.getElementById('nh-search-results');
            if (sr) sr.classList.remove('active');

            // Re-trigger reveal for newly visible elements
            const newReveals = target?.querySelectorAll('.nh-reveal:not(.visible)');
            newReveals?.forEach(el => observer.observe(el));
        });
    });

    // 4. Subject card click → expand detail panel
    document.querySelectorAll('.nh-subject-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.subjectIdx);
            const panel = document.getElementById('nh-detail-panel');
            if (!panel) return;

            // Toggle
            if (expandedSubject === idx) {
                expandedSubject = null;
                panel.classList.remove('visible');
                panel.innerHTML = '';
                card.classList.remove('expanded');
                return;
            }

            // Collapse previously expanded
            document.querySelectorAll('.nh-subject-card.expanded').forEach(c => c.classList.remove('expanded'));
            expandedSubject = idx;
            card.classList.add('expanded');

            const s = NOTES_DATA[idx];

            // Get glossary terms for this subject
            const glossaryData = GLOSSARY[s.id] || GLOSSARY[s.id.replace('-', '')] || {};
            const terms = glossaryData.terms || {};

            panel.innerHTML = `
                <div class="nh-detail-tabs">
                    <button class="nh-dtab active" data-dtab="chapters">📖 Chapters</button>
                    <button class="nh-dtab" data-dtab="formulas">📐 Formulas</button>
                    <button class="nh-dtab" data-dtab="tips">🔁 Revision Tips</button>
                    ${Object.keys(terms).length > 0 ? '<button class="nh-dtab" data-dtab="defs">📘 Definitions</button>' : ''}
                </div>
                <div class="nh-detail-section active" data-dsection="chapters">
                    ${s.chapters.map(ch => `
                        <div class="nh-chapter" style="border-left-color: ${s.color};">
                            <div class="nh-chapter-title" style="color: ${s.color};">${ch.title}</div>
                            <div class="nh-chapter-content">${ch.content}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="nh-detail-section" data-dsection="formulas">
                    ${s.formulas.map(f => createFormulaCardHtml(f)).join('')}
                </div>
                <div class="nh-detail-section" data-dsection="tips">
                    ${s.revision.map(r => `
                        <div class="nh-revision-item">
                            <span class="nh-revision-bullet">✓</span>
                            <span>${r}</span>
                        </div>
                    `).join('')}
                </div>
                ${Object.keys(terms).length > 0 ? `
                <div class="nh-detail-section" data-dsection="defs">
                    ${Object.entries(terms).map(([term, def]) => `
                        <div class="nh-glossary-term" style="border-left-color: ${s.color};">
                            <div class="nh-glossary-name" style="color: ${s.color};">${term.replace(/-/g, ' ')}</div>
                            <div class="nh-glossary-def">${def}</div>
                        </div>
                    `).join('')}
                </div>` : ''}
            `;

            panel.classList.add('visible');
            
            // Instantly render KaTeX formulas and Lucide icons in the dynamically created details panel
            if (window.renderMathInElement) {
                window.renderMathInElement(panel, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }

            // Position panel after the card's row
            const grid = document.getElementById('nh-subjects-grid');
            if (grid) {
                grid.after(panel);
            }

            // Scroll panel into view
            setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

            // Detail tab switching
            panel.querySelectorAll('.nh-dtab').forEach(dtab => {
                dtab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const sec = dtab.dataset.dtab;
                    panel.querySelectorAll('.nh-dtab').forEach(t => t.classList.remove('active'));
                    dtab.classList.add('active');
                    panel.querySelectorAll('.nh-detail-section').forEach(s => s.classList.remove('active'));
                    const targetSec = panel.querySelector(`[data-dsection="${sec}"]`);
                    if (targetSec) targetSec.classList.add('active');
                });
            });
        });
    });

    // 5. Formula group accordion
    document.querySelectorAll('.nh-formula-group-header').forEach(header => {
        header.addEventListener('click', () => {
            const idx = header.dataset.fgIdx;
            const body = document.querySelector(`[data-fg-body="${idx}"]`);
            const isOpen = header.classList.contains('open');

            // Close all
            document.querySelectorAll('.nh-formula-group-header').forEach(h => h.classList.remove('open'));
            document.querySelectorAll('.nh-formula-group-body').forEach(b => b.classList.remove('open'));

            if (!isOpen && body) {
                header.classList.add('open');
                body.classList.add('open');
            }
        });
    });

    // 6. Search functionality
    const searchInput = document.getElementById('nh-search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = searchInput.value.trim();
                performSearch(searchQuery);
            }, 250);
        });
    }

    // Re-create Lucide icons
    if (window.lucide) window.lucide.createIcons();
};

// ─── SEARCH ENGINE ────────────────────────────────────────────────────────────
function performSearch(query) {
    const resultsContainer = document.getElementById('nh-search-results');
    if (!resultsContainer) return;

    if (!query || query.length < 2) {
        resultsContainer.classList.remove('active');
        // Show active tab content
        const activeContent = document.getElementById(`nh-tab-${activeTab}`);
        if (activeContent) activeContent.classList.add('active');
        return;
    }

    const q = query.toLowerCase();
    let results = [];

    // Search through notes data
    NOTES_DATA.forEach(subject => {
        // Search chapters
        subject.chapters.forEach(ch => {
            if (ch.title.toLowerCase().includes(q) || ch.content.toLowerCase().includes(q)) {
                results.push({
                    type: 'chapter',
                    subject: subject.title,
                    icon: subject.icon,
                    color: subject.color,
                    title: ch.title,
                    content: ch.content
                });
            }
        });

        // Search formulas
        subject.formulas.forEach(f => {
            if (f.expr.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)) {
                results.push({
                    type: 'formula',
                    subject: subject.title,
                    icon: subject.icon,
                    color: subject.color,
                    title: f.expr,
                    content: f.desc
                });
            }
        });

        // Search revision tips
        subject.revision.forEach(r => {
            if (r.toLowerCase().includes(q)) {
                results.push({
                    type: 'revision',
                    subject: subject.title,
                    icon: subject.icon,
                    color: subject.color,
                    title: 'Revision Tip',
                    content: r
                });
            }
        });
    });

    // Search glossary
    Object.entries(GLOSSARY).forEach(([key, data]) => {
        Object.entries(data.terms).forEach(([term, def]) => {
            const termName = term.replace(/-/g, ' ');
            if (termName.toLowerCase().includes(q) || def.toLowerCase().includes(q)) {
                results.push({
                    type: 'glossary',
                    subject: data.title,
                    icon: '📖',
                    color: '#6366f1',
                    title: termName,
                    content: def
                });
            }
        });
    });

    // Hide all tab content and show search results
    document.querySelectorAll('.nh-tab-content').forEach(c => c.classList.remove('active'));

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="nh-no-results">
                <span class="nh-no-results-icon">🔍</span>
                <h3>No results found</h3>
                <p>Try a different search term or browse subjects directly.</p>
            </div>
        `;
    } else {
        const typeIcons = { chapter: '📝', formula: '📐', revision: '🔁', glossary: '📖' };
        resultsContainer.innerHTML = `
            <div style="margin-bottom: 16px; font-family: var(--font-heading); font-size: 0.85rem; color: var(--text-muted);">
                Found <span style="color: var(--accent-secondary); font-weight: 700;">${results.length}</span> results for "<span style="color: var(--text-primary);">${query}</span>"
            </div>
            ${results.slice(0, 30).map(r => `
                <div class="nh-chapter" style="border-left-color: ${r.color}; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="font-size: 1rem;">${r.icon}</span>
                        <span style="font-family: 'DM Mono', monospace; font-size: 0.65rem; color: ${r.color}; background: ${r.color}12; border: 1px solid ${r.color}30; padding: 2px 8px; border-radius: 100px; text-transform: uppercase;">${r.subject}</span>
                        <span style="font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 100px;">${typeIcons[r.type] || ''} ${r.type}</span>
                    </div>
                    <div class="nh-chapter-title" style="color: ${r.color}; font-size: 0.88rem;">${highlightMatch(r.title, query)}</div>
                    <div class="nh-chapter-content" style="font-size: 0.84rem;">${highlightMatch(r.content.substring(0, 250) + (r.content.length > 250 ? '...' : ''), query)}</div>
                </div>
            `).join('')}
            ${results.length > 30 ? `<div style="text-align: center; color: var(--text-muted); font-size: 0.82rem; padding: 16px;">Showing 30 of ${results.length} results. Refine your search for more specific results.</div>` : ''}
        `;
    }

    resultsContainer.classList.add('active');
}

// ─── UNMOUNT ──────────────────────────────────────────────────────────────────
export const unmount = () => {
    // Clear animation timers
    animTimers.forEach(t => clearInterval(t));
    animTimers = [];
    expandedSubject = null;
    searchQuery = '';
};
