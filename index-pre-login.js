/**
 * Nextron - Pre-Login Interactive Landing Page View (Refactored & Bug-Free)
 * Route: #/ (for non-logged-in guest users)
 */

import { AppState } from '../app.js';

// Module-level state and animation variables
let sigAnim = null;
let isSigAnimActive = false;
let waveType = 'sine';
let t0 = 0;
let gateType = 'AND';
let inputA = 0;
let inputB = 0;
let landingResizeHandler = null;

/**
 * Helper to calculate waveform values for the Signal Simulator
 */
const getWaveVal = (t, type) => {
    const v = t % 1;
    if (type === 'sine') return Math.sin(2 * Math.PI * t);
    if (type === 'square') return v < 0.5 ? 1 : -1;
    if (type === 'triangle') return v < 0.5 ? 4 * v - 1 : 3 - 4 * v;
    if (type === 'sawtooth') return 2 * v - 1;
    return 0;
};

export const render = async () => {
    return `
        <style>
            .landing-container {
                /* Scoped Aesthetic CSS Variables mapping to ECE Design System */
                --bg: #080b12;
                --bg2: #0d1120;
                --bg3: #111827;
                --surface: rgba(255,255,255,0.04);
                --border: rgba(255,255,255,0.08);
                --border2: rgba(255,255,255,0.15);
                --text: #f0f4ff;
                --muted: #7a8aa8;
                --accent: #00e5c3;
                --accent2: #3d9fff;
                --accent3: #a855f7;
                --glow: rgba(0,229,195,0.15);
                --glow2: rgba(61,159,255,0.12);
                --danger: #ff5a5a;
                --warn: #ffa040;
                --green: #22c55e;

                padding-top: 40px;
                width: 100%;
                min-height: 100vh;
                background: var(--bg);
                color: var(--text);
                font-family: var(--font-body);
            }

            .landing-hero {
                position: relative;
                z-index: 1;
                min-height: 80vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 80px 24px 40px;
            }

            .landing-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.4rem 1rem;
                border-radius: 999px;
                border: 1px solid rgba(0, 229, 195, 0.3);
                background: rgba(0, 229, 195, 0.08);
                color: var(--accent);
                font-family: var(--font-mono);
                font-size: 0.75rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                margin-bottom: 1.5rem;
                animation: fadeUp 0.6s ease both;
            }

            .landing-badge::before {
                content: '';
                width: 6px; height: 6px;
                border-radius: 50%;
                background: var(--accent);
                box-shadow: 0 0 8px var(--accent);
                animation: pulse 2s ease infinite;
            }

            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

            .landing-hero h1 {
                font-family: var(--font-display);
                font-size: clamp(2.5rem, 6.2vw, 5.5rem);
                font-weight: 800;
                line-height: 1.05;
                letter-spacing: -0.04em;
                max-width: 900px;
                margin-bottom: 1.5rem;
                animation: fadeUp 0.7s 0.1s ease both;
            }

            .landing-hero h1 .line2 {
                background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .landing-hero-sub {
                font-size: 1.1rem;
                font-weight: 400;
                color: var(--muted);
                max-width: 560px;
                line-height: 1.7;
                margin-bottom: 2.5rem;
                animation: fadeUp 0.7s 0.2s ease both;
            }

            .landing-hero-cta {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 4rem;
                animation: fadeUp 0.7s 0.3s ease both;
            }

            .btn-xl {
                padding: 0.9rem 2rem;
                border-radius: 12px;
                font-family: var(--font-body);
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.25s;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .btn-xl.primary {
                background: var(--accent);
                color: #080b12;
                border: none;
                box-shadow: 0 0 30px rgba(0, 229, 195, 0.3);
            }
            .btn-xl.primary:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 4px 40px rgba(0, 229, 195, 0.4); }

            .btn-xl.ghost {
                background: transparent;
                color: var(--text);
                border: 1px solid var(--border2);
            }
            .btn-xl.ghost:hover { border-color: var(--accent2); color: var(--accent2); transform: translateY(-2px); }

            .landing-hero-stats {
                display: flex;
                gap: 3rem;
                justify-content: center;
                flex-wrap: wrap;
                animation: fadeUp 0.7s 0.4s ease both;
            }

            .landing-stat { text-align: center; }
            .landing-stat-val {
                font-family: var(--font-display);
                font-size: 2rem;
                font-weight: 800;
                color: var(--text);
            }
            .landing-stat-label {
                font-size: 0.8rem;
                color: var(--muted);
                font-weight: 500;
                margin-top: 0.2rem;
            }

            /* ─── DEMO SECTION ─── */
            .landing-section {
                position: relative;
                z-index: 1;
                padding: 5rem 24px;
                max-width: 1200px;
                margin: 0 auto;
            }

            .landing-section-header {
                text-align: center;
                margin-bottom: 3rem;
            }

            .landing-section-tag {
                font-family: var(--font-mono);
                font-size: 0.72rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--accent);
                margin-bottom: 0.75rem;
            }

            .landing-section-title {
                font-family: var(--font-display);
                font-size: clamp(1.8rem, 4vw, 2.8rem);
                font-weight: 800;
                letter-spacing: -0.03em;
            }

            .landing-section-sub {
                color: var(--muted);
                font-size: 1rem;
                margin-top: 0.75rem;
            }

            /* ─── DEMO PANEL ─── */
            .demo-container {
                background: var(--bg2);
                border: 1px solid var(--border);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 0 60px rgba(0,0,0,0.5);
            }

            .demo-tabs {
                display: flex;
                border-bottom: 1px solid var(--border);
                background: var(--bg);
                padding: 0 1.5rem;
                gap: 0.25rem;
            }

            .demo-tab {
                padding: 1rem 1.25rem;
                font-family: var(--font-mono);
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--muted);
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .demo-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
            .demo-tab:hover:not(.active) { color: var(--text); }

            .demo-body {
                display: none;
                padding: 2rem;
            }
            .demo-body.active { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

            @media (max-width: 768px) { .demo-body.active { grid-template-columns: 1fr; } }

            /* ─── SIGNAL DEMO ─── */
            .demo-controls {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .ctrl-group label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.8rem;
                font-weight: 600;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                color: var(--muted);
                margin-bottom: 0.6rem;
            }

            .ctrl-group label span {
                font-family: var(--font-mono);
                font-size: 0.85rem;
                color: var(--accent);
                text-transform: none;
                letter-spacing: 0;
            }

            input[type=range] {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                border-radius: 2px;
                background: var(--border);
                outline: none;
            }
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px; height: 16px;
                border-radius: 50%;
                background: var(--accent);
                cursor: pointer;
                box-shadow: 0 0 8px rgba(0,229,195,0.4);
                transition: transform 0.15s;
            }
            input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }

            .wave-select {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.5rem;
            }

            .wave-btn {
                padding: 0.5rem;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 8px;
                color: var(--muted);
                font-family: var(--font-mono);
                font-size: 0.72rem;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.08);
            }
            .wave-btn.active, .wave-btn:hover {
                background: rgba(0,229,195,0.1);
                border-color: var(--accent);
                color: var(--accent);
            }

            .demo-canvas-wrap {
                position: relative;
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 240px;
            }

            .demo-canvas-label {
                position: absolute;
                top: 0.75rem; left: 1rem;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--muted);
                letter-spacing: 0.08em;
                z-index: 5;
            }

            #sig-canvas { display: block; width: 100%; height: 240px; }

            /* ─── GATE DEMO ─── */
            .gate-demo-body.active { display: flex; flex-direction: column; gap: 1.5rem; }

            .gate-area {
                display: flex;
                gap: 2rem;
                align-items: center;
                flex-wrap: wrap;
            }

            .gate-inputs {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .gate-input-row {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .input-label {
                font-family: var(--font-mono);
                font-size: 0.85rem;
                font-weight: 500;
                color: var(--muted);
                width: 20px;
            }

            .toggle-btn {
                width: 48px; height: 26px;
                border-radius: 13px;
                background: var(--bg3);
                border: 1px solid var(--border2);
                cursor: pointer;
                position: relative;
                transition: background 0.2s;
            }
            .toggle-btn::after {
                content: '';
                position: absolute;
                width: 20px; height: 20px;
                border-radius: 50%;
                background: var(--muted);
                top: 2px; left: 2px;
                transition: all 0.2s;
            }
            .toggle-btn.on { background: rgba(0,229,195,0.2); border-color: var(--accent); }
            .toggle-btn.on::after { left: 24px; background: var(--accent); box-shadow: 0 0 8px rgba(0,229,195,0.5); }

            .bit-val {
                font-family: var(--font-mono);
                font-size: 1rem;
                font-weight: 500;
                color: var(--text);
                width: 16px;
            }

            .gate-symbol-wrap {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .gate-output-wrap {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .output-label {
                font-family: var(--font-mono);
                font-size: 0.8rem;
                color: var(--muted);
            }

            .output-light {
                width: 48px; height: 48px;
                border-radius: 50%;
                border: 2px solid var(--border2);
                background: var(--bg3);
                transition: all 0.3s;
                display: flex; align-items: center; justify-content: center;
                font-family: var(--font-mono);
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--muted);
            }
            .output-light.on {
                background: rgba(0,229,195,0.2);
                border-color: var(--accent);
                color: var(--accent);
                box-shadow: 0 0 20px rgba(0,229,195,0.4);
            }

            .gate-selector {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .gate-pick {
                padding: 0.4rem 0.9rem;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 8px;
                color: var(--muted);
                font-family: var(--font-mono);
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid rgba(255,255,255,0.08);
            }
            .gate-pick.active, .gate-pick:hover {
                background: rgba(61,159,255,0.1);
                border-color: var(--accent2);
                color: var(--accent2);
            }

            .truth-table {
                width: 100%;
                border-collapse: collapse;
                font-family: var(--font-mono);
                font-size: 0.82rem;
            }
            .truth-table th {
                padding: 0.5rem 1rem;
                background: var(--bg);
                color: var(--muted);
                font-weight: 500;
                text-align: center;
                border-bottom: 1px solid var(--border);
            }
            .truth-table td {
                padding: 0.4rem 1rem;
                text-align: center;
                color: var(--muted);
                border-bottom: 1px solid var(--border);
                transition: all 0.2s;
            }
            .truth-table tr.highlight td { background: rgba(0,229,195,0.06); color: var(--text); }
            .truth-table td.one { color: var(--accent); }
            .truth-table td.zero { color: var(--danger); opacity: 0.7; }

            /* ─── RC DEMO ─── */
            .rc-demo-body.active { display: flex; flex-direction: column; gap: 2rem; }

            .rc-params {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }

            .rc-canvas-wrap {
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: 12px;
                overflow: hidden;
                position: relative;
            }

            .rc-canvas-label {
                position: absolute;
                top: 0.75rem; left: 1rem;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--muted);
                z-index: 5;
            }

            #rc-canvas { display: block; width: 100%; height: 200px; }

            /* ─── FEATURES ─── */
            .landing-features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
            }

            .landing-feature-card {
                background: var(--bg2);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 2rem;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }
            .landing-feature-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--accent), var(--accent2));
                opacity: 0;
                transition: opacity 0.3s;
            }
            .landing-feature-card:hover { transform: translateY(-4px); border-color: var(--border2); }
            .landing-feature-card:hover::before { opacity: 1; }

            .landing-feature-icon {
                width: 48px; height: 48px;
                border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                font-size: 1.4rem;
                margin-bottom: 1.25rem;
            }

            .landing-feature-title {
                font-family: var(--font-display);
                font-size: 1.1rem;
                font-weight: 700;
                margin-bottom: 0.6rem;
                color: #fff;
            }

            .landing-feature-desc {
                font-size: 0.875rem;
                color: var(--muted);
                line-height: 1.6;
            }

            /* ─── FOOTER ─── */
            .landing-footer {
                position: relative;
                z-index: 1;
                padding: 3rem 2.5rem;
                border-top: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .landing-footer-copy {
                font-size: 0.8rem;
                color: var(--muted);
            }

            /* Scroll fade-in */
            .fade-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.7s ease, transform 0.7s ease;
            }
            .fade-up.visible { opacity: 1; transform: none; }
        </style>

        <div class="landing-container">
            <!-- HERO -->
            <section class="landing-hero">
                <div class="landing-badge">ECE Learning Platform · Beta</div>
                <h1>
                    Learn Electronics<br>
                    <span class="line2">the way circuits think</span>
                </h1>
                <p class="landing-hero-sub">Interactive simulators, visual concept walkthroughs, and a sandbox for every ECE topic — from signals to VLSI.</p>
                <div class="landing-hero-cta">
                    <button class="btn-xl primary" id="btn-hero-scroll">Try the Live Demo ↓</button>
                    <a href="#/login" class="btn-xl ghost">Explore Concepts →</a>
                </div>
                <div class="landing-hero-stats">
                    <div class="landing-stat"><div class="landing-stat-val">120+</div><div class="landing-stat-label">Concepts Covered</div></div>
                    <div class="landing-stat"><div class="landing-stat-val">8</div><div class="landing-stat-label">Interactive Labs</div></div>
                    <div class="landing-stat"><div class="landing-stat-val">∞</div><div class="landing-stat-label">Sandbox Freedom</div></div>
                </div>
            </section>

            <!-- LIVE DEMO SECTION -->
            <section id="demo" class="landing-section fade-up">
                <div class="landing-section-header">
                    <div class="landing-section-tag">// Try before you sign up</div>
                    <h2 class="landing-section-title">Interactive Demo</h2>
                    <p class="landing-section-sub">Play with real simulators — no account needed. Signal generator, logic gates, RC circuits.</p>
                </div>

                <div class="demo-container">
                    <div class="demo-tabs">
                        <button class="demo-tab active" data-tab="signal">Signal Generator</button>
                        <button class="demo-tab" data-tab="gate">Logic Gates</button>
                        <button class="demo-tab" data-tab="rc">RC Circuit</button>
                    </div>

                    <!-- SIGNAL TAB -->
                    <div id="tab-signal" class="demo-body active">
                        <div class="demo-controls">
                            <div class="ctrl-group">
                                <label>Waveform <span id="wave-name">Sine</span></label>
                                <div class="wave-select">
                                    <button class="wave-btn active" data-wave="sine">Sine</button>
                                    <button class="wave-btn" data-wave="square">Square</button>
                                    <button class="wave-btn" data-wave="triangle">Triangle</button>
                                    <button class="wave-btn" data-wave="sawtooth">Saw</button>
                                </div>
                            </div>
                            <div class="ctrl-group">
                                <label>Frequency <span id="freq-val">2.0 Hz</span></label>
                                <input type="range" id="freq" min="0.5" max="10" step="0.5" value="2">
                            </div>
                            <div class="ctrl-group">
                                <label>Amplitude <span id="amp-val">1.00</span></label>
                                <input type="range" id="amp" min="0.1" max="1" step="0.05" value="1">
                            </div>
                            <div class="ctrl-group">
                                <label>Phase <span id="phase-val">0°</span></label>
                                <input type="range" id="phase" min="0" max="360" step="5" value="0">
                            </div>
                        </div>
                        <div class="demo-canvas-wrap">
                            <div class="demo-canvas-label">OSCILLOSCOPE · LIVE</div>
                            <canvas id="sig-canvas"></canvas>
                        </div>
                    </div>

                    <!-- GATE TAB -->
                    <div id="tab-gate" class="demo-body gate-demo-body" style="display:none">
                        <div class="gate-selector">
                            <button class="gate-pick active" data-gate="AND">AND</button>
                            <button class="gate-pick" data-gate="OR">OR</button>
                            <button class="gate-pick" data-gate="NAND">NAND</button>
                            <button class="gate-pick" data-gate="NOR">NOR</button>
                            <button class="gate-pick" data-gate="XOR">XOR</button>
                            <button class="gate-pick" data-gate="XNOR">XNOR</button>
                            <button class="gate-pick" data-gate="NOT">NOT</button>
                        </div>
                        <div class="gate-area">
                            <div class="gate-inputs" id="gate-inputs">
                                <div class="gate-input-row">
                                    <span class="input-label">A</span>
                                    <button class="toggle-btn" id="togA"></button>
                                    <span class="bit-val" id="valA">0</span>
                                </div>
                                <div class="gate-input-row" id="inputB-row">
                                    <span class="input-label">B</span>
                                    <button class="toggle-btn" id="togB"></button>
                                    <span class="bit-val" id="valB">0</span>
                                </div>
                            </div>
                            <div class="gate-symbol-wrap">
                                <svg id="gate-svg" viewBox="0 0 140 80" width="140" height="80"></svg>
                            </div>
                            <div class="gate-output-wrap">
                                <span class="output-label">OUT</span>
                                <div class="output-light" id="output-light">0</div>
                            </div>
                        </div>
                        <div style="overflow:auto; width: 100%;">
                            <table class="truth-table" id="truth-table"></table>
                        </div>
                    </div>

                    <!-- RC TAB -->
                    <div id="tab-rc" class="demo-body rc-demo-body" style="display:none">
                        <div class="rc-params">
                            <div class="ctrl-group">
                                <label>Resistance R <span id="r-val">1.0 kΩ</span></label>
                                <input type="range" id="r-slider" min="0.1" max="10" step="0.1" value="1">
                            </div>
                            <div class="ctrl-group">
                                <label>Capacitance C <span id="c-val">100 µF</span></label>
                                <input type="range" id="c-slider" min="10" max="500" step="10" value="100">
                            </div>
                        </div>
                        <div style="padding:1rem; background:var(--bg3); border-radius:12px; border:1px solid var(--border)">
                            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-family:var(--font-mono); font-size:0.85rem;">
                                <div>
                                    <div style="color:var(--muted); font-size:0.72rem; margin-bottom:0.3rem;">TIME CONSTANT τ</div>
                                    <div style="font-size:1.4rem; font-weight:500; color:var(--accent)" id="tau-val">0.100 s</div>
                                </div>
                                <div>
                                    <div style="color:var(--muted); font-size:0.72rem; margin-bottom:0.3rem;">CUTOFF FREQ fc</div>
                                    <div style="font-size:1.4rem; font-weight:500; color:var(--accent2)" id="fc-val">1.59 Hz</div>
                                </div>
                                <div>
                                    <div style="color:var(--muted); font-size:0.72rem; margin-bottom:0.3rem;">EQUATION</div>
                                    <div style="font-size:0.95rem; font-weight:400; color:var(--text); margin-top:0.4rem">V(t) = V₀(1 − e<sup>−t/τ</sup>)</div>
                                </div>
                            </div>
                        </div>
                        <div class="rc-canvas-wrap">
                            <div class="rc-canvas-label">RC CHARGE / DISCHARGE CURVE</div>
                            <canvas id="rc-canvas"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <hr style="border: 0; height: 1px; background: var(--border); max-width: 1200px; margin: 0 auto;" />

            <!-- FEATURES -->
            <section class="landing-section fade-up">
                <div class="landing-section-header">
                    <div class="landing-section-tag">// What's inside</div>
                    <h2 class="landing-section-title">Everything ECE, Visualized</h2>
                </div>
                <div class="landing-features-grid">
                    <div class="landing-feature-card">
                        <div class="landing-feature-icon" style="background:rgba(0,229,195,0.1); color:var(--accent)">⚡</div>
                        <div class="landing-feature-title">Signals & Systems</div>
                        <p class="landing-feature-desc">Fourier transforms, convolution, sampling — visualize every operation as it happens. Build intuition, not just memorization.</p>
                    </div>
                    <div class="landing-feature-card">
                        <div class="landing-feature-icon" style="background:rgba(61,159,255,0.1); color:var(--accent2)">🔬</div>
                        <div class="landing-feature-title">Circuit Lab</div>
                        <p class="landing-feature-desc">Drag-and-drop circuit builder with real-time voltage and current probes. SPICE-style simulation right in the browser.</p>
                    </div>
                    <div class="landing-feature-card">
                        <div class="landing-feature-icon" style="background:rgba(168,85,247,0.1); color:var(--accent3)">📐</div>
                        <div class="landing-feature-title">Math Center</div>
                        <p class="landing-feature-desc">KaTeX-rendered derivations with step-by-step reveals. Laplace, Z-transforms, Fourier series — all walkable.</p>
                    </div>
                    <div class="landing-feature-card">
                        <div class="landing-feature-icon" style="background:rgba(34,197,94,0.1); color:var(--green)">🧠</div>
                        <div class="landing-feature-title">Quiz Arena</div>
                        <p class="landing-feature-desc">Adaptive questions per topic. Get instant feedback with concept links. Track mastery across all units.</p>
                    </div>
                    <div class="landing-feature-card">
                        <div class="landing-feature-icon" style="background:rgba(255,160,64,0.1); color:var(--warn)">📓</div>
                        <div class="landing-feature-title">Smart Notes Hub</div>
                        <p class="landing-feature-desc">Write notes with LaTeX support. Link concepts. Export as PDF. Your second brain for ECE.</p>
                    </div>
                    <div class="landing-feature-card">
                        <div class="landing-feature-icon" style="background:rgba(255,90,90,0.1); color:var(--danger)">🎓</div>
                        <div class="landing-feature-title">Study Hub</div>
                        <p class="landing-feature-desc">Curated learning paths by semester. Track progress, bookmark tricky topics, and prepare for exams systematically.</p>
                    </div>
                </div>
            </section>

            <footer class="landing-footer">
                <div class="logo" style="font-size:1.1rem; text-decoration:none; color:inherit; font-family:var(--font-heading); font-weight:800; display:flex; align-items:center; gap:0.5rem;">
                    <div class="logo-icon" style="width:24px;height:24px; background:linear-gradient(135deg, var(--accent), var(--accent2)); border-radius:6px; display:flex; align-items:center; justify-content:center;">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="#080b12" stroke-width="2.5" fill="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <span>Next<span style="color:var(--accent)">ron</span></span>
                </div>
                <div class="landing-footer-copy">© 2026 Nextron. Built for ECE learners.</div>
                <div style="display:flex;gap:1.5rem">
                    <a href="#/login" class="btn-ghost" style="font-size:0.8rem; text-decoration:none; padding: 0.5rem 1rem; border: 1px solid var(--border2); border-radius: 8px;">Log In</a>
                    <a href="#/login" class="btn-primary" style="font-size:0.8rem; text-decoration:none; padding: 0.5rem 1rem; background:var(--accent); color:#080b12; border-radius:8px; font-weight:700;">Sign Up Free</a>
                </div>
            </footer>
        </div>
    `;
};

export const mount = () => {
    let activeTab = 'signal';

    // ─── Lifecycle Tab Switcher (Unified addEventListener) ───
    const tabs = document.querySelectorAll('.demo-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');

            document.querySelectorAll('.demo-body').forEach(b => {
                b.style.display = 'none';
                b.classList.remove('active');
            });

            const name = e.currentTarget.getAttribute('data-tab');
            activeTab = name;
            const tb = document.getElementById('tab-' + name);
            if (tb) {
                tb.style.display = 'grid';
                tb.classList.add('active');
            }

            // Stop/Start Oscilloscope render loops based on active tab visibility
            if (name === 'signal') {
                startSigLoop();
            } else {
                stopSigLoop();
            }

            if (name === 'rc') {
                drawRC();
            }
        });
    });

    // ─── Hero Smooth Scroll ───
    const scrollBtn = document.getElementById('btn-hero-scroll');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const demoSec = document.getElementById('demo');
            if (demoSec) demoSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ─── Signal Generator Demo Event Bindings ───
    const waveBtns = document.querySelectorAll('.wave-btn');
    waveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            waveBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            waveType = e.currentTarget.getAttribute('data-wave');
            const waveNameEl = document.getElementById('wave-name');
            if (waveNameEl) waveNameEl.textContent = e.currentTarget.textContent;
        });
    });

    const sliders = ['freq', 'amp', 'phase'];
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        if (slider) {
            slider.addEventListener('input', () => {
                const valEl = document.getElementById(`${id}-val`);
                const val = parseFloat(slider.value);
                if (valEl) {
                    if (id === 'freq') valEl.textContent = val.toFixed(1) + ' Hz';
                    else if (id === 'amp') valEl.textContent = val.toFixed(2);
                    else if (id === 'phase') valEl.textContent = slider.value + '°';
                }
            });
        }
    });

    // Oscilloscope Animation frame loops with strict gate checkers
    const drawSig = () => {
        if (!isSigAnimActive) return;

        const cv = document.getElementById('sig-canvas');
        if (!cv) {
            isSigAnimActive = false;
            return;
        }

        cv.width = cv.parentElement.clientWidth;
        cv.height = 240;
        const ctx = cv.getContext('2d');

        const freqSlider = document.getElementById('freq');
        const ampSlider = document.getElementById('amp');
        const phaseSlider = document.getElementById('phase');
        if (!freqSlider || !ampSlider || !phaseSlider) {
            isSigAnimActive = false;
            return;
        }

        const freq = parseFloat(freqSlider.value);
        const amp = parseFloat(ampSlider.value);
        const phase = parseFloat(phaseSlider.value) * Math.PI / 180;
        const W = cv.width, H = cv.height;
        ctx.clearRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = H / 2 + (i - 2) * H * 0.22;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        for (let i = 0; i < 8; i++) {
            const x = i * W / 8;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        // Center horizontal line
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
        ctx.setLineDash([]);

        // Plot Waveform
        ctx.beginPath();
        ctx.strokeStyle = '#00e5c3';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(0,229,195,0.4)';
        ctx.shadowBlur = 6;
        for (let px = 0; px < W; px++) {
            const tVal = (px / W) * 3 * freq + t0 + phase / (2 * Math.PI);
            const y = H / 2 - amp * (H * 0.38) * getWaveVal(tVal, waveType);
            if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        t0 += 0.008 * freq;

        sigAnim = requestAnimationFrame(drawSig);
    };

    const startSigLoop = () => {
        if (!isSigAnimActive) {
            isSigAnimActive = true;
            drawSig();
        }
    };

    const stopSigLoop = () => {
        isSigAnimActive = false;
        if (sigAnim) {
            cancelAnimationFrame(sigAnim);
            sigAnim = null;
        }
    };

    // Auto start Oscilloscope loop on mount
    startSigLoop();

    // ─── Logic Gates Demo Scoped Logic ───
    const gateLogic = {
        AND: (a, b) => a && b,
        OR: (a, b) => a || b,
        NAND: (a, b) => !(a && b),
        NOR: (a, b) => !(a || b),
        XOR: (a, b) => a ^ b,
        XNOR: (a, b) => !(a ^ b),
        NOT: (a, _) => !a
    };

    const gatePaths = {
        AND: `<path d="M30 15 L55 15 Q85 15 85 40 Q85 65 55 65 L30 65 Z" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
              <line x1="15" y1="27" x2="30" y2="27" stroke="#3d9fff" stroke-width="2"/>
              <line x1="15" y1="53" x2="30" y2="53" stroke="#3d9fff" stroke-width="2"/>
              <line x1="85" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`,
        OR: `<path d="M30 15 Q45 15 70 40 Q45 65 30 65 Q45 40 30 15" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
             <path d="M30 15 L55 15 Q80 15 90 40 Q80 65 55 65 L30 65" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
             <line x1="15" y1="27" x2="38" y2="27" stroke="#3d9fff" stroke-width="2"/>
             <line x1="15" y1="53" x2="38" y2="53" stroke="#3d9fff" stroke-width="2"/>
             <line x1="90" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`,
        NAND: `<path d="M30 15 L55 15 Q85 15 85 40 Q85 65 55 65 L30 65 Z" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
               <circle cx="89" cy="40" r="5" fill="none" stroke="#3d9fff" stroke-width="2"/>
               <line x1="15" y1="27" x2="30" y2="27" stroke="#3d9fff" stroke-width="2"/>
               <line x1="15" y1="53" x2="30" y2="53" stroke="#3d9fff" stroke-width="2"/>
               <line x1="94" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`,
        NOR: `<path d="M30 15 Q45 15 70 40 Q45 65 30 65 Q45 40 30 15" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
              <path d="M30 15 L55 15 Q80 15 90 40 Q80 65 55 65 L30 65" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
              <circle cx="94" cy="40" r="5" fill="none" stroke="#3d9fff" stroke-width="2"/>
              <line x1="15" y1="27" x2="38" y2="27" stroke="#3d9fff" stroke-width="2"/>
              <line x1="15" y1="53" x2="38" y2="53" stroke="#3d9fff" stroke-width="2"/>
              <line x1="99" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`,
        XOR: `<path d="M26 15 Q40 15 70 40 Q40 65 26 65 Q40 40 26 15" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
              <path d="M30 15 L55 15 Q80 15 90 40 Q80 65 55 65 L30 65" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
              <path d="M22 15 Q36 40 22 65" fill="none" stroke="#3d9fff" stroke-width="2"/>
              <line x1="15" y1="27" x2="38" y2="27" stroke="#3d9fff" stroke-width="2"/>
              <line x1="15" y1="53" x2="38" y2="53" stroke="#3d9fff" stroke-width="2"/>
              <line x1="90" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`,
        XNOR: `<path d="M26 15 Q40 15 70 40 Q40 65 26 65 Q40 40 26 15" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
               <path d="M30 15 L55 15 Q80 15 90 40 Q80 65 55 65 L30 65" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
               <path d="M22 15 Q36 40 22 65" fill="none" stroke="#3d9fff" stroke-width="2"/>
               <circle cx="94" cy="40" r="5" fill="none" stroke="#3d9fff" stroke-width="2"/>
               <line x1="15" y1="27" x2="38" y2="27" stroke="#3d9fff" stroke-width="2"/>
               <line x1="15" y1="53" x2="38" y2="53" stroke="#3d9fff" stroke-width="2"/>
               <line x1="99" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`,
        NOT: `<polygon points="30,20 80,40 30,60" fill="none" stroke="#3d9fff" stroke-width="2.5"/>
              <circle cx="84" cy="40" r="5" fill="none" stroke="#3d9fff" stroke-width="2"/>
              <line x1="15" y1="40" x2="30" y2="40" stroke="#3d9fff" stroke-width="2"/>
              <line x1="89" y1="40" x2="120" y2="40" stroke="#00e5c3" stroke-width="2"/>`
    };

    const buildTruthTable = () => {
        const tbl = document.getElementById('truth-table');
        if (!tbl) return;
        const isNot = gateType === 'NOT';
        let html = `<tr><th>A</th>${isNot ? '' : '<th>B</th>'}<th>OUT</th></tr>`;
        const combos = isNot ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
        combos.forEach(c => {
            const out = gateLogic[gateType](c[0], c[1] ?? 0) ? 1 : 0;
            const hi = c[0] === inputA && (isNot || c[1] === inputB);
            html += `<tr class="${hi ? 'highlight' : ''}">
              <td class="${c[0] ? 'one' : 'zero'}">${c[0]}</td>
              ${isNot ? '' : '<td class="' + (c[1] ? 'one' : 'zero') + '">' + c[1] + '</td>'}
              <td class="${out ? 'one' : 'zero'}">${out}</td></tr>`;
        });
        tbl.innerHTML = html;
    };

    const updateGate = () => {
        const a = inputA, b = inputB;
        const togA = document.getElementById('togA');
        const togB = document.getElementById('togB');
        const valA = document.getElementById('valA');
        const valB = document.getElementById('valB');
        const light = document.getElementById('output-light');
        const svg = document.getElementById('gate-svg');

        if (togA) togA.className = 'toggle-btn' + (a ? ' on' : '');
        if (togB) togB.className = 'toggle-btn' + (b ? ' on' : '');
        if (valA) valA.textContent = a;
        if (valB) valB.textContent = b;

        const out = gateLogic[gateType](a, b) ? 1 : 0;
        if (light) {
            light.textContent = out;
            light.className = 'output-light' + (out ? ' on' : '');
        }
        if (svg) svg.innerHTML = gatePaths[gateType] || '';
        buildTruthTable();
    };

    const gatePicks = document.querySelectorAll('.gate-pick');
    gatePicks.forEach(btn => {
        btn.addEventListener('click', (e) => {
            gatePicks.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            gateType = e.currentTarget.getAttribute('data-gate');
            const inputBRow = document.getElementById('inputB-row');
            if (inputBRow) inputBRow.style.display = gateType === 'NOT' ? 'none' : '';
            updateGate();
        });
    });

    const togA = document.getElementById('togA');
    if (togA) {
        togA.addEventListener('click', () => {
            inputA = 1 - inputA;
            updateGate();
        });
    }

    const togB = document.getElementById('togB');
    if (togB) {
        togB.addEventListener('click', () => {
            inputB = 1 - inputB;
            updateGate();
        });
    }

    // Run first draw
    updateGate();

    // ─── RC Circuit Demo Logic ───
    const drawRC = () => {
        const cv = document.getElementById('rc-canvas');
        if (!cv) return;
        cv.width = cv.parentElement.clientWidth;
        cv.height = 200;
        const ctx = cv.getContext('2d');

        const rSlider = document.getElementById('r-slider');
        const cSlider = document.getElementById('c-slider');
        if (!rSlider || !cSlider) return;

        const R = parseFloat(rSlider.value) * 1000;
        const C = parseFloat(cSlider.value) * 1e-6;
        const tau = R * C;
        const fc = 1 / (2 * Math.PI * tau);

        const tauVal = document.getElementById('tau-val');
        const fcVal = document.getElementById('fc-val');
        const rVal = document.getElementById('r-val');
        const cVal = document.getElementById('c-val');

        if (tauVal) tauVal.textContent = tau.toFixed(3) + ' s';
        if (fcVal) fcVal.textContent = fc.toFixed(2) + ' Hz';
        if (rVal) rVal.textContent = (R / 1000).toFixed(1) + ' kΩ';
        if (cVal) cVal.textContent = (C * 1e6).toFixed(0) + ' µF';

        const W = cv.width, H = cv.height;
        ctx.clearRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * H;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Charge curve
        ctx.beginPath();
        ctx.strokeStyle = '#3d9fff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(61,159,255,0.4)';
        ctx.shadowBlur = 6;
        const tMax = 5 * tau;
        for (let px = 0; px < W; px++) {
            const tVal = (px / W) * tMax;
            const v = 1 - Math.exp(-tVal / tau);
            const y = H - v * (H * 0.85) - H * 0.07;
            if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Discharge curve
        ctx.beginPath();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        for (let px = 0; px < W; px++) {
            const tVal = (px / W) * tMax;
            const v = Math.exp(-tVal / tau);
            const y = H - v * (H * 0.85) - H * 0.07;
            if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // tau marker
        const tauX = (tau / tMax) * W;
        if (tauX < W) {
            ctx.strokeStyle = 'rgba(255,160,64,0.6)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(tauX, 0); ctx.lineTo(tauX, H); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(255,160,64,0.8)';
            ctx.font = '11px DM Mono, monospace';
            ctx.fillText('τ', tauX + 4, 16);
        }

        // Reference labels
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '10px DM Mono, monospace';
        ctx.fillText('1.0', 4, H * 0.1);
        ctx.fillText('0.63', 4, H * 0.45);
        ctx.fillText('0', 4, H - 8);
    };

    const rSliderEl = document.getElementById('r-slider');
    const cSliderEl = document.getElementById('c-slider');
    if (rSliderEl) rSliderEl.addEventListener('input', drawRC);
    if (cSliderEl) cSliderEl.addEventListener('input', drawRC);

    drawRC();

    // ─── Resizes (Window bounds check) ───
    const handleLandingResize = () => {
        const sigCanvas = document.getElementById('sig-canvas');
        const rcCanvas = document.getElementById('rc-canvas');
        if (sigCanvas) { sigCanvas.width = sigCanvas.parentElement.clientWidth; }
        if (rcCanvas) {
            rcCanvas.width = rcCanvas.parentElement.clientWidth;
            drawRC();
        }
    };
    landingResizeHandler = handleLandingResize;
    window.addEventListener('resize', landingResizeHandler);

    // ─── Reveals ───
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
};

export const unmount = () => {
    // Stop any active animation loop
    isSigAnimActive = false;
    if (sigAnim) {
        cancelAnimationFrame(sigAnim);
        sigAnim = null;
    }

    if (landingResizeHandler) {
        window.removeEventListener('resize', landingResizeHandler);
        landingResizeHandler = null;
    }
};
