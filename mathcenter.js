/**
 * Nextron - Mathematical Visualization Center
 * High-fidelity visual dashboards, Canvas plotting engines, and dynamic calculator systems.
 */

import { AppState } from '../app.js';

export const render = async () => {
    return `
        <style>
            .math-center-layout {
                display: grid;
                grid-template-columns: 240px 1fr;
                gap: 20px;
                min-height: calc(100vh - 120px);
                font-family: var(--font-body);
                padding-bottom: 40px;
            }
            
            /* Sidebar navigation list */
            .math-sidebar {
                background: rgba(15, 23, 42, 0.45);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-md);
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                backdrop-filter: blur(8px);
                height: fit-content;
                transition: background 0.3s ease, border-color 0.3s ease;
            }
            .math-sidebar-title {
                font-size: 0.75rem;
                font-weight: 800;
                color: var(--accent-secondary);
                text-transform: uppercase;
                margin-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                padding-bottom: 8px;
                letter-spacing: 0.05em;
            }
            .math-nav-btn {
                background: transparent;
                border: 1px solid transparent;
                border-radius: var(--border-radius-sm);
                padding: 10px 14px;
                color: var(--text-muted);
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                text-align: left;
            }
            .math-nav-btn:hover {
                color: var(--text-primary);
                background: rgba(255, 255, 255, 0.05);
            }
            .math-nav-btn.active {
                color: #fff !important;
                background: linear-gradient(135deg, var(--accent-purple), var(--accent-secondary));
                box-shadow: 0 0 12px rgba(99, 102, 241, 0.35);
                border-color: transparent;
            }
            
            /* Workspace stage */
            .math-stage {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            /* Dual Visualizers Display layout */
            .visual-double-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            @media (max-width: 900px) {
                .math-center-layout { grid-template-columns: 1fr; }
                .visual-double-grid { grid-template-columns: 1fr; }
            }

            .canvas-container {
                background: #010409;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-md);
                padding: 12px;
                position: relative;
                box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
                transition: background 0.3s ease, box-shadow 0.3s ease;
            }
            .canvas-label-overlay {
                position: absolute;
                top: 20px; left: 20px;
                background: rgba(1, 4, 9, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.08);
                padding: 4px 10px;
                border-radius: 4px;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                font-weight: bold;
                color: var(--accent-secondary);
                z-index: 10;
                transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            .center-visual-canvas {
                width: 100%;
                height: 240px;
                display: block;
            }

            /* Sleek form control panels */
            .controls-card {
                background: rgba(15, 23, 42, 0.35);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-md);
                padding: 18px 20px;
                backdrop-filter: blur(8px);
                transition: background 0.3s ease, border-color 0.3s ease;
            }
            
            /* Educational Deck grids */
            .edu-deck-grid {
                display: grid;
                grid-template-columns: 1.2fr 0.8fr;
                gap: 20px;
            }
            @media (max-width: 900px) {
                .edu-deck-grid { grid-template-columns: 1fr; }
            }
            .edu-pane-card {
                background: rgba(15, 23, 42, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius-md);
                padding: 20px;
                backdrop-filter: blur(8px);
                transition: background 0.3s ease, border-color 0.3s ease;
            }
            .edu-pane-title {
                font-size: 0.9rem;
                font-weight: 800;
                color: var(--accent-purple);
                text-transform: uppercase;
                margin-bottom: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                padding-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            /* Custom styled numeric inputs and tags */
            .telemetry-tag {
                background: rgba(0, 0, 0, 0.35);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 6px 10px;
                font-family: var(--font-mono);
                font-size: 0.8rem;
                color: #fff;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.3s ease, color 0.3s ease;
            }

            /* ECE Formula Flashcard Calculator elements */
            .formula-flex-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
            }
            @media (max-width: 900px) {
                .formula-flex-grid { grid-template-columns: 1fr; }
            }
            .formula-card-pill {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: var(--border-radius-md);
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .formula-card-pill:hover, .formula-card-pill.active {
                background: rgba(99, 102, 241, 0.05);
                border-color: var(--accent-secondary);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
            }

            /* ==========================================
               PREMIUM LIGHT THEME VISUAL OVERRIDES
               ========================================== */
            html[data-theme="light"] .math-sidebar {
                background: var(--bg-glass);
                border-color: var(--border-color);
            }
            html[data-theme="light"] .math-sidebar-title {
                color: var(--accent-primary);
                border-bottom-color: var(--border-color);
            }
            html[data-theme="light"] .math-nav-btn {
                color: var(--text-secondary);
            }
            html[data-theme="light"] .math-nav-btn:hover {
                color: var(--text-primary);
                background: rgba(79, 70, 229, 0.06);
            }
            html[data-theme="light"] .math-nav-btn.active {
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2);
            }
            
            html[data-theme="light"] .canvas-container {
                background: #ffffff;
                border-color: var(--border-color);
                box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.04);
            }
            html[data-theme="light"] .canvas-label-overlay {
                background: rgba(255, 255, 255, 0.9);
                border-color: var(--border-color);
                color: var(--accent-primary);
            }

            html[data-theme="light"] .controls-card {
                background: var(--bg-glass);
                border-color: var(--border-color);
            }
            html[data-theme="light"] .edu-pane-card {
                background: var(--bg-glass);
                border-color: var(--border-color);
            }
            html[data-theme="light"] .edu-pane-title {
                color: var(--accent-primary);
                border-bottom-color: var(--border-color);
            }
            html[data-theme="light"] .telemetry-tag {
                background: rgba(15, 23, 42, 0.04);
                color: var(--text-primary);
                border-color: var(--border-color);
            }

            html[data-theme="light"] .formula-card-pill {
                background: rgba(0, 0, 0, 0.01);
                border-color: var(--border-color);
            }
            html[data-theme="light"] .formula-card-pill:hover,
            html[data-theme="light"] .formula-card-pill.active {
                background: rgba(79, 70, 229, 0.04);
                border-color: var(--accent-primary);
                box-shadow: 0 4px 15px rgba(79, 70, 229, 0.1);
            }

            /* Absolute form control overrides for light mode to override inline styles */
            html[data-theme="light"] select,
            html[data-theme="light"] input[type="number"],
            html[data-theme="light"] input[type="text"] {
                background: rgba(255, 255, 255, 0.95) !important;
                color: var(--text-primary) !important;
                border-color: var(--border-color) !important;
            }
            html[data-theme="light"] select option {
                background: #ffffff !important;
                color: var(--text-primary) !important;
            }
            html[data-theme="light"] .edu-pane-card div[style*="background:rgba(0,0,0,0.3)"],
            html[data-theme="light"] .edu-pane-card div[style*="background: rgba(0,0,0,0.3)"] {
                background: rgba(15, 23, 42, 0.03) !important;
                border-color: var(--border-color) !important;
                color: var(--text-secondary) !important;
            }
            html[data-theme="light"] #formula-deck-wrapper div[style*="background: rgba(0,0,0,0.3)"],
            html[data-theme="light"] #formula-deck-wrapper div[style*="background:rgba(0,0,0,0.3)"] {
                background: rgba(15, 23, 42, 0.03) !important;
                border-color: var(--border-color) !important;
            }
        </style>

        <div class="simulator-container fade-in">
            <!-- Header navigation back link -->
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    ECE Math Modeling Hub
                </span>
            </div>

            <div class="math-center-layout">
                <!-- 1. LEFT COLUMN SIDEBAR: MATH SWITCHING TABS -->
                <aside class="math-sidebar">
                    <div class="math-sidebar-title">Plotters & Basics</div>
                    <button class="math-nav-btn active" data-math-tab="plotter"><i data-lucide="line-chart"></i> Function Plotter</button>
                    <button class="math-nav-btn" data-math-tab="signals"><i data-lucide="activity"></i> Signals Generator</button>
                    
                    <div class="math-sidebar-title" style="margin-top: 12px;">Signals & DSP</div>
                    <button class="math-nav-btn" data-math-tab="fourier"><i data-lucide="bar-chart-3"></i> Fourier Series</button>
                    <button class="math-nav-btn" data-math-tab="sampling"><i data-lucide="scissors"></i> Sampling & Aliasing</button>
                    <button class="math-nav-btn" data-math-tab="convolution"><i data-lucide="refresh-cw"></i> Convolution Lab</button>
                    <button class="math-nav-btn" data-math-tab="filters"><i data-lucide="filter"></i> Filters Response</button>

                    <div class="math-sidebar-title" style="margin-top: 12px;">Poles & Phasors</div>
                    <button class="math-nav-btn" data-math-tab="complex"><i data-lucide="compass"></i> Complex Numbers</button>
                    <button class="math-nav-btn" data-math-tab="phasors"><i data-lucide="orbit"></i> Rotating Phasors</button>
                    <button class="math-nav-btn" data-math-tab="comms"><i data-lucide="radio"></i> Modulation AM/FM</button>
                    <button class="math-nav-btn" data-math-tab="transforms"><i data-lucide="database"></i> Transforms Hub</button>

                    <div class="math-sidebar-title" style="margin-top: 12px;">Matrix & Formulas</div>
                    <button class="math-nav-btn" data-math-tab="matrix"><i data-lucide="grid"></i> Coordinate Matrix</button>
                    <button class="math-nav-btn" data-math-tab="formulas"><i data-lucide="book-open"></i> Formula Explorer</button>
                </aside>

                <!-- 2. RIGHT COLUMN: WORKSPACE STAGE -->
                <main class="math-stage">
                    <!-- SECTION 1: FUNCTION PLOTTER -->
                    <div class="math-tab-content" id="math-tab-plotter">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Interactive Function Graphing Engine</h2>
                            <p>Plot multi-expression algebraic functions on Cartesian grids. Zoom and offset coordinate deformaties.</p>
                        </div>
                        
                        <div class="visual-double-grid" style="grid-template-columns: 1fr;">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">y = f(x) Grapher</div>
                                <canvas id="plotter-canvas" class="center-visual-canvas" style="height:320px;"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <div class="panel-section-title"><i data-lucide="settings"></i> Expression Settings</div>
                                <div class="slider-group">
                                    <span class="slider-name">Expression Preset</span>
                                    <select id="plotter-preset" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; cursor: pointer; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 4px;">
                                        <option value="sin">y = sin(x)</option>
                                        <option value="cos">y = cos(x)</option>
                                        <option value="x2">y = 0.1 * x²</option>
                                        <option value="decay">y = exp(-0.15 * x) * sin(x)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div class="panel-section-title"><i data-lucide="sliders"></i> Grid Navigation</div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Zoom Scale</span>
                                        <span class="slider-val" id="val-plot-zoom">1.0x</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-plot-zoom" min="0.5" max="3.0" step="0.1" value="1.0">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 2: SIGNAL VISUALIZATION LAB -->
                    <div class="math-tab-content" id="math-tab-signals" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Dynamic Signal Laboratory</h2>
                            <p>Generate baseline analog voltage signals and extract key telemetry metrics (Peak, RMS, Period) in real-time.</p>
                        </div>
                        
                        <div class="canvas-container">
                            <div class="canvas-label-overlay">Time Domain Signal Scope</div>
                            <canvas id="signals-canvas" class="center-visual-canvas" style="height:260px;"></canvas>
                        </div>

                        <div class="controls-card" style="margin-top: 16px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Amplitude (V)</span>
                                        <span class="slider-val" id="val-sig-amp">2.0 V</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-sig-amp" min="0.5" max="4.0" step="0.1" value="2.0">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Frequency (Hz)</span>
                                        <span class="slider-val" id="val-sig-freq">4 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-sig-freq" min="1" max="10" step="1" value="4">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Phase Shift (°)</span>
                                        <span class="slider-val" id="val-sig-phase">0°</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-sig-phase" min="-180" max="180" step="10" value="0">
                                </div>
                                <div class="slider-group">
                                    <span class="slider-name">Waveform Shape</span>
                                    <select id="select-sig-shape" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; cursor: pointer; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 4px;">
                                        <option value="sine">Sine Wave</option>
                                        <option value="square">Square Wave</option>
                                        <option value="triangle">Triangle Wave</option>
                                        <option value="sawtooth">Sawtooth Wave</option>
                                    </select>
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <div class="panel-section-title" style="margin-bottom:4px;"><i data-lucide="gauge"></i> Telemetry</div>
                                <div class="telemetry-tag">
                                    <span>Peak Voltage (Vp):</span>
                                    <span id="tel-sig-peak" style="color:var(--cyan);">2.00 V</span>
                                </div>
                                <div class="telemetry-tag">
                                    <span>RMS Voltage (Vrms):</span>
                                    <span id="tel-sig-rms" style="color:var(--green);">1.41 V</span>
                                </div>
                                <div class="telemetry-tag">
                                    <span>Signal Period (T):</span>
                                    <span id="tel-sig-period" style="color:var(--warning);">250 ms</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 3: FOURIER SERIES VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-fourier" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Fourier Waveform Synthesis Visualizer</h2>
                            <p>Observe how simple sinusoids combine to generate complex rectangular steps, highlighting overshoot ripples.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Individual Sine Harmonics</div>
                                <canvas id="fourier-indiv-canvas" class="center-visual-canvas"></canvas>
                            </div>
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Summed Resultant Wave</div>
                                <canvas id="fourier-sum-canvas" class="center-visual-canvas"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color:var(--accent-purple); font-weight:bold;">Harmonics count (N)</span>
                                    <span class="slider-val" id="val-four-n" style="color:var(--accent-purple); font-weight:bold;">4</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-four-n" min="1" max="15" step="1" value="4">
                            </div>
                            <div class="slider-group">
                                <span class="slider-name">Synthesis Target Shape</span>
                                <select id="select-four-shape" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; cursor: pointer; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 4px;">
                                    <option value="square">Square Wave</option>
                                    <option value="triangle">Triangle Wave</option>
                                    <option value="sawtooth">Sawtooth Wave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 4: SAMPLING AND ALIASING VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-sampling" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>DSP Sampling & Aliasing Simulator</h2>
                            <p>Visualize sampling stems ($f_s$). Observe folding frequencies and distortion spikes when the sampling rate violates Nyquist ($f_s < 2 f_{sig}$).</p>
                        </div>
                        
                        <div class="canvas-container">
                            <div class="canvas-label-overlay">Analog vs Sampled Signal</div>
                            <canvas id="sampling-canvas" class="center-visual-canvas" style="height:260px;"></canvas>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Signal Frequency (F)</span>
                                        <span class="slider-val" id="val-samp-sig">5 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-samp-sig" min="2" max="12" step="1" value="5">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Sampling Frequency (Fs)</span>
                                        <span class="slider-val" id="val-samp-rate">30 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-samp-rate" min="5" max="40" step="1" value="30">
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; justify-content:center; gap:8px;">
                                <div class="telemetry-tag" style="background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.05);">
                                    <span>Nyquist Limit (2F):</span>
                                    <span id="read-samp-nyquist" style="color:var(--cyan);">10 Hz</span>
                                </div>
                                <div id="alert-samp-alias" style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid rgba(16, 185, 129, 0.3); color:#6ee7b7; border-radius:4px; padding:8px 12px; font-size:0.75rem; text-align:center; font-weight:bold;">
                                    🟢 Nyquist Satisfied (Perfect Reconstruction)
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 5: CONVOLUTION VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-convolution" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Linear Time-Invariant (LTI) Convolution Lab</h2>
                            <p>Animate the sliding integration process $y(t) = x(t) * h(t)$ of two rectangular pulses.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Input Signal x(t) & Sliding h(t-τ)</div>
                                <canvas id="conv-sliding-canvas" class="center-visual-canvas"></canvas>
                            </div>
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Convolution Output y(t)</div>
                                <canvas id="conv-output-canvas" class="center-visual-canvas"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
                            <div class="slider-group" style="flex:1; max-width:320px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Sliding Time Index (t)</span>
                                    <span class="slider-val" id="val-conv-t">0.0</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-conv-t" min="-120" max="120" step="1" value="-120">
                            </div>
                            <div style="display:flex; gap:10px;">
                                <button class="btn btn-secondary" id="btn-conv-auto" style="padding:10px 16px;"><i data-lucide="play"></i> Auto Slide</button>
                                <button class="btn btn-secondary" id="btn-conv-reset" style="padding:10px 16px;"><i data-lucide="refresh-cw"></i> Reset</button>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 6: FILTER RESPONSE VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-filters" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Analog Filter Frequency Response Explorer</h2>
                            <p>Tweak filters, plot continuous Magnitude ($dB$) and Phase responses on logarithmic frequency grids.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Magnitude Response (Bode Gain)</div>
                                <canvas id="filter-mag-canvas" class="center-visual-canvas"></canvas>
                            </div>
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Phase Response (Bode Phase)</div>
                                <canvas id="filter-phase-canvas" class="center-visual-canvas"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Cutoff Freq (fc)</span>
                                        <span class="slider-val" id="val-filt-fc">500 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-filt-fc" min="100" max="2000" step="50" value="500">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Filter Order (N)</span>
                                        <span class="slider-val" id="val-filt-order">2</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-filt-order" min="1" max="4" step="1" value="2">
                                </div>
                            </div>
                            <div class="slider-group">
                                <span class="slider-name">Filter Response Mode</span>
                                <select id="select-filt-type" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; cursor: pointer; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 4px;">
                                    <option value="lp">Low-Pass Filter</option>
                                    <option value="hp">High-Pass Filter</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 7: COMPLEX NUMBER VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-complex" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Complex Argand Plane Visualizer</h2>
                            <p>Represent and transform imaginary vectors $x + j y$ dynamically. Observe angular properties and polar alignments.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Argand Coordinate Plane</div>
                                <canvas id="complex-grid-canvas" class="center-visual-canvas" style="height:280px;"></canvas>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:12px; justify-content:center;">
                                <div class="telemetry-tag">
                                    <span>Rectangular Form:</span>
                                    <span id="read-comp-rect" style="color:var(--accent-secondary); font-size:0.95rem;">3.00 + j4.00</span>
                                </div>
                                <div class="telemetry-tag">
                                    <span>Polar Form:</span>
                                    <span id="read-comp-polar" style="color:var(--cyan); font-size:0.95rem;">5.00 ∠ 53.1°</span>
                                </div>
                                <div class="telemetry-tag">
                                    <span>Euler Form:</span>
                                    <span id="read-comp-euler" style="color:var(--green); font-size:0.95rem;">5.00e^(j0.93)</span>
                                </div>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Real Part (Real axis)</span>
                                    <span class="slider-val" id="val-comp-real">3.0</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-comp-real" min="-8" max="8" step="0.2" value="3.0">
                            </div>
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Imaginary Part (Imag axis)</span>
                                    <span class="slider-val" id="val-comp-imag">4.0</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-comp-imag" min="-8" max="8" step="0.2" value="4.0">
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 8: PHASOR VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-phasors" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Rotating AC Phasors Analyzer</h2>
                            <p>Watch standard vector projections sweep time domain sinusoids. Synchronize rotating circular planes with time sweeps.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Rotating Vector Circle</div>
                                <canvas id="phasor-circle-canvas" class="center-visual-canvas"></canvas>
                            </div>
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Resulting Time Domain sine wave</div>
                                <canvas id="phasor-sine-canvas" class="center-visual-canvas"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Amplitude (A)</span>
                                    <span class="slider-val" id="val-phasor-amp">3.0 V</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-phasor-amp" min="1.0" max="4.0" step="0.1" value="3.0">
                            </div>
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Phasor Frequency (rad/s)</span>
                                    <span class="slider-val" id="val-phasor-freq">2 rad/s</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-phasor-freq" min="1" max="5" step="1" value="2">
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 9: COMMUNICATION SYSTEM MATH VISUALIZER -->
                    <div class="math-tab-content" id="math-tab-comms" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Communication Systems Math Visualizer (AM/FM)</h2>
                            <p>Synthesize Amplitude Modulated (AM) and Frequency Modulated (FM) waveforms, calculating dynamic envelope indices.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Time Domain Modulated Waveform</div>
                                <canvas id="comms-time-canvas" class="center-visual-canvas"></canvas>
                            </div>
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Sideband Frequency Spectrum (FFT)</div>
                                <canvas id="comms-freq-canvas" class="center-visual-canvas"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Carrier Frequency (fc)</span>
                                        <span class="slider-val" id="val-comm-fc">80 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-comm-fc" min="30" max="150" step="5" value="80">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Message Frequency (fm)</span>
                                        <span class="slider-val" id="val-comm-fm">8 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-comm-fm" min="2" max="15" step="1" value="8">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Modulation Index (m)</span>
                                        <span class="slider-val" id="val-comm-idx">0.6</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-comm-idx" min="0.1" max="1.5" step="0.1" value="0.6">
                                </div>
                                <div class="slider-group">
                                    <span class="slider-name">Modulation Scheme</span>
                                    <select id="select-comm-mode" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px; color: #fff; cursor: pointer; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 4px;">
                                        <option value="am">Amplitude Modulation (AM)</option>
                                        <option value="fm">Frequency Modulation (FM)</option>
                                    </select>
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; justify-content:center; gap:8px;">
                                <div class="telemetry-tag">
                                    <span>Lower Sideband (LSB):</span>
                                    <span id="read-comm-lsb" style="color:var(--accent-secondary);">72 Hz</span>
                                </div>
                                <div class="telemetry-tag">
                                    <span>Upper Sideband (USB):</span>
                                    <span id="read-comm-usb" style="color:var(--green);">88 Hz</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 10: TRANSFORM VISUALIZATION HUB -->
                    <div class="math-tab-content" id="math-tab-transforms" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Laplace s-Plane & Pole-Zero Mapping</h2>
                            <p>Visual mapping between the complex s-plane poles/zeros and their corresponding impulse decay curves.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Laplace s-Plane (σ + jω)</div>
                                <canvas id="laplace-splane-canvas" class="center-visual-canvas" style="height:260px;"></canvas>
                            </div>
                            <div class="canvas-container">
                                <div class="canvas-label-overlay">Time-Domain Transient Response h(t)</div>
                                <canvas id="laplace-time-canvas" class="center-visual-canvas" style="height:260px;"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Real Pole Coordinate (σ)</span>
                                    <span class="slider-val" id="val-laplace-sigma">-1.5</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-laplace-sigma" min="-4.0" max="1.0" step="0.1" value="-1.5">
                            </div>
                            <div class="slider-group">
                                <div class="slider-label-row">
                                    <span class="slider-name">Frequency Coordinate (ω)</span>
                                    <span class="slider-val" id="val-laplace-omega">3.0</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-laplace-omega" min="0.0" max="8.0" step="0.2" value="3.0">
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 11: MATRIX VISUALIZATION -->
                    <div class="math-tab-content" id="math-tab-matrix" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Linear Grid Transformation Visualizer</h2>
                            <p>Observe scaling, rotation, and deformaties on 2D linear grids when deforming coordinate sets through a 2x2 matrix.</p>
                        </div>
                        
                        <div class="visual-double-grid">
                            <div class="canvas-container" style="grid-column: span 2;">
                                <div class="canvas-label-overlay">Deformed Coordinate Plane</div>
                                <canvas id="matrix-canvas" class="center-visual-canvas" style="height:320px;"></canvas>
                            </div>
                        </div>

                        <div class="controls-card" style="margin-top:16px; display:grid; grid-template-columns: 1fr 1.2fr; gap:20px;">
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Scaling X (Sx)</span>
                                        <span class="slider-val" id="val-mat-sx">1.0</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-mat-sx" min="-2.0" max="2.0" step="0.1" value="1.0">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Scaling Y (Sy)</span>
                                        <span class="slider-val" id="val-mat-sy">1.0</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-mat-sy" min="-2.0" max="2.0" step="0.1" value="1.0">
                                </div>
                                <div class="slider-group" style="grid-column: span 2;">
                                    <div class="slider-label-row">
                                        <span class="slider-name">Rotation Angle (θ)</span>
                                        <span class="slider-val" id="val-mat-theta">0°</span>
                                    </div>
                                    <input type="range" class="slider-input" id="slider-mat-theta" min="-180" max="180" step="5" value="0">
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; justify-content:center; gap:8px;">
                                <div class="panel-section-title" style="margin-bottom:4px;"><i data-lucide="table"></i> Applied 2x2 Matrix</div>
                                <div style="background: rgba(0,0,0,0.3); border:1px solid var(--border-color); border-radius:6px; padding:12px; font-family:var(--font-mono); text-align:center; font-size:1rem; font-weight:bold; color:var(--green);">
                                    [ <span id="mat-a">1.00</span> , <span id="mat-b">0.00</span> ]<br>
                                    [ <span id="mat-c">0.00</span> , <span id="mat-d">1.00</span> ]
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 12: ENGINEERING FORMULA EXPLORER -->
                    <div class="math-tab-content" id="math-tab-formulas" style="display: none;">
                        <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
                            <h2>Interactive Engineering Formula Explorer</h2>
                            <p>Explore basic ECE flashcards with built-in numerical solvers, descriptions, and exam guides.</p>
                        </div>
                        
                        <div class="formula-flex-grid">
                            <div class="formula-card-pill active" data-formula-preset="ohms">
                                <h4 style="color:#fff; font-size:0.9rem; margin-bottom:4px;">Ohm's Law</h4>
                                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-secondary);">V = I · R</span>
                            </div>
                            <div class="formula-card-pill" data-formula-preset="rc">
                                <h4 style="color:#fff; font-size:0.9rem; margin-bottom:4px;">RC Time Constant</h4>
                                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--green);">τ = R · C</span>
                            </div>
                            <div class="formula-card-pill" data-formula-preset="shannon">
                                <h4 style="color:#fff; font-size:0.9rem; margin-bottom:4px;">Shannon Capacity</h4>
                                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--warning);">C = B · log₂(1 + SNR)</span>
                            </div>
                        </div>

                        <!-- Active Formula Calculator Dashboard -->
                        <div class="controls-card" style="margin-top: 20px;" id="formula-calculator-wrapper">
                            <!-- Injected dynamically by JS -->
                        </div>
                    </div>

                    <!-- COMMON EDUCATIONAL PANEL -->
                    <div class="edu-deck-grid" id="common-educational-deck">
                        <div class="edu-pane-card">
                            <div class="edu-pane-title"><i data-lucide="book-open"></i> Concept & Mathematics</div>
                            <div id="edu-deck-math">
                                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Loading visual mathematics overview...</p>
                            </div>
                        </div>
                        <div class="edu-pane-card">
                            <div class="edu-pane-title"><i data-lucide="award"></i> Real-world Applications & Exam Prep</div>
                            <div id="edu-deck-exams">
                                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Loading exam prep summaries...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
};

// Global Animation Frame ID tracking
let mathAnimId = null;
let mathResizeHandler = null;

export const mount = () => {
    // --- 1. SIDEBAR TAB SELECTION & SWITCHING ---
    const navButtons = document.querySelectorAll('.math-nav-btn');
    const tabContents = document.querySelectorAll('.math-tab-content');
    let activeTabName = 'plotter';

    const switchTab = (targetTab) => {
        activeTabName = targetTab;
        navButtons.forEach(btn => {
            if (btn.getAttribute('data-math-tab') === targetTab) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        tabContents.forEach(content => {
            if (content.getAttribute('id') === `math-tab-${targetTab}`) content.style.display = 'block';
            else content.style.display = 'none';
        });
        // Re-size canvases after the newly-shown tab is painted — tabs that were
        // display:none at init had clientWidth=0 so their canvases never got sized.
        requestAnimationFrame(() => initCanvasSizing());
        updateEducationalContent(targetTab);
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-math-tab');
            switchTab(target);
        });
    });

    // --- 2. EDUCATIONAL CONTENT REPOSITORY ---
    const eduMath = document.getElementById('edu-deck-math');
    const eduExams = document.getElementById('edu-deck-exams');

    const educationalData = {
        plotter: {
            math: `<h3>Plotting Functions</h3>
                   <p>A Cartesian coordinate system maps algebraic variables into visual curves. A graph of $y = f(x)$ displays the set of all coordinate pairs $(x, y)$ that satisfy the mathematical expression. Adjusting scaling factors stretches or dilates coordinates across grids.</p>
                   <br><strong>Key Parameters:</strong>
                   <ul>
                       <li><strong>Domain:</strong> The set of input values $x$ for which the function is defined.</li>
                       <li><strong>Range:</strong> The set of resulting output values $y$ produced by the function.</li>
                   </ul>`,
            exams: `<h4>Real-world Applications</h4>
                    <p>Functions are used by engineers to build baseline mathematical models of devices, analyze signal trends, and plot system limits before launching hardware.</p>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: Sketch the graph of $y = e^{-at} \\sin(\\omega t)$. What physical system does this dampening behavior represent?<br>
                        A: It represents a damped harmonic oscillator, such as an RLC network discharging.
                    </div>`
        },
        signals: {
            math: `<h3>Signal Waveforms</h3>
                   <p>Periodic waveforms represent basic voltage currents that alternate over time. A standard sinusoidal AC voltage is defined by:</p>
                   $$v(t) = V_p \\cdot \\sin(2\\pi f t + \\theta) + V_{\\text{offset}}$$
                   <p>Calculating <strong>Root Mean Square (RMS)</strong> is crucial because it represents the equivalent DC voltage that delivers the same thermal power dissipation across resistors.</p>`,
            exams: `<h4>Real-world Applications</h4>
                    <p>Standard signal generators are laboratory equipment utilized to benchmark amplifiers, verify frequency limits of chips, and test receiver responses.</p>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: Calculate the RMS voltage of a square wave with peak amplitude $V_p = 2\\text{V}$ and a $50\\%$ duty cycle.<br>
                        A: For a perfect symmetric square wave, $V_{\\text{RMS}} = V_p = 2.0\\text{V}$.
                    </div>`
        },
        fourier: {
            math: `<h3>Fourier Waveform Synthesis</h3>
                   <p>Fourier proven theorem shows that any periodic wave can be synthesized by summing infinite sinusoidal harmonics. A perfect square wave is represented by adding odd harmonics:</p>
                   $$y(t) = \\frac{4}{\\pi} \\cdot \\left[ \\frac{\\sin(\\omega t)}{1} + \\frac{\\sin(3\\omega t)}{3} + \\frac{\\sin(5\\omega t)}{5} + \\dots \\right]$$
                   <p>As N increases, the synthesized composite wave gets closer to a square step, but suffers from mathematical ripples at discontinuities, known as the **Gibbs Phenomenon** (~8.95% overshoot overshoot).</p>`,
            exams: `<h4>Real-world Applications</h4>
                    <p>Fourier math is the baseline of modern digital audio compression (MP3), JPEG image rendering, and high-speed DSL filter layouts.</p>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: What happens to the Gibbs overshoot ripple height at a step transition as the number of harmonics $N$ approaches infinity?<br>
                        A: The width of the ripples decreases, but the peak overshoot height stays constant at $\\sim 8.95\\%$.
                    </div>`
        },
        sampling: {
            math: `<h3>Nyquist Sampling Theorem</h3>
                   <p>To convert an analog signal to a digital format without losing information, the sampling rate ($f_s$) must be at least double the highest frequency component of the signal ($f_{sig}$):</p>
                   $$f_s \\ge 2 \\cdot f_{\\text{sig}}$$
                   <p>If Nyquist is violated ($f_s < 2 f_{sig}$), frequency overlap occurs. High frequencies "fold back" and masquerade as low frequencies, creating irreversible **aliasing distortion**.</p>`,
            exams: `<h4>Real-world Applications</h4>
                    <p>Modern audio CDs use $44.1\\text{kHz}$ sampling to preserve up to $20\\text{kHz}$ human hearing. High-speed ADCs in telecommunications use strict analog anti-aliasing filters before sampling.</p>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: An analog voice signal spans up to $4\\text{ kHz}$. What is the minimum sampling frequency required for distortion-free digitization?<br>
                        A: $f_{s,\\text{min}} = 2 \\times 4\\text{ kHz} = 8\\text{ kHz}$.
                    </div>`
        },
        convolution: {
            math: `<h3>Linear System Convolution</h3>
                   <p>Convolution describes how an LTI system reacts to input signals. Mathematically, the output $y(t)$ is the integral of the input signal $x(\\tau)$ multiplied by the shifted impulse response $h(t - \\tau)$:</p>
                   $$y(t) = \\int_{-\\infty}^{\\infty} x(\\tau) \\cdot h(t - \\tau) d\\tau$$
                   <p>The visual process consists of flipping $h(\\tau)$, sliding it across $x(\\tau)$, multiplying the overlapping curves, and calculating the area under the product in real-time.</p>`,
            exams: `<h4>Real-world Applications</h4>
                    <p>Convolution is utilized in image filtering kernels (blur/sharpen), reverberation acoustics simulators, and modeling electrical channels in transmission wires.</p>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: What is the resulting shape when convolving a rectangular pulse of duration $T$ with itself?<br>
                        A: A triangular pulse peaking at $t = T$ with a total duration of $2T$.
                    </div>`
        },
        filters: {
            math: `<h3>Analog Filter Frequency Response</h3>
                   <p>Filters alter frequencies using reactive components. The magnitude response plots filter gains vs frequency, while the phase response maps phase shifts. For a basic first-order low-pass filter:</p>
                   $$H(f) = \\frac{1}{1 + j \\cdot \\left(\\frac{f}{f_c}\\right)}$$
                   <p>The cutoff frequency ($f_c$) is where the signal magnitude drops by **-3 dB** ($1/\\sqrt{2}$ of peak gain).</p>`,
            exams: `<h4>Used to divide audio bands in speakers (crossovers), clean sensor noise, and isolate RF bands in smartphone antennas.</h4>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: What is the roll-off rate in $\\text{dB/decade}$ of a third-order ($N=3$) analog filter in the stopband?<br>
                        A: $\\text{Roll-off} = -20\\text{ dB/decade} \\times N = -60\\text{ dB/decade}$.
                    </div>`
        },
        complex: {
            math: `<h3>Complex Numbers & Coordinate Planes</h3>
                   <p>Complex numbers represent vectors on the 2D Argand Plane, where the horizontal axis maps Real numbers ($x$) and the vertical axis maps Imaginary numbers ($y$). Converts between formats:</p>
                   $$z = x + j y \\quad \\text{(Rectangular)}$$
                   $$z = R \\cdot e^{j\\theta} = R \\angle \\theta \\quad \\text{(Polar)}$$
                   <p>Where Magnitude $R = \\sqrt{x^2 + y^2}$ and Phase Angle $\\theta = \\text{atan2}(y, x)$.</p>`,
            exams: `<h4>Complex numbers represent AC electrical impedance ($Z = R + jX$), power factor vectors, and electromagnetic field equations in Maxwell guides.</h4>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: Convert the rectangular complex impedance $Z = 3 + j4\\ \\Omega$ into polar form.<br>
                        A: $R = \\sqrt{3^2 + 4^2} = 5$. Angle $= \\text{atan2}(4, 3) = 53.1^\\circ$. $Z = 5 \\angle 53.1^\\circ\\ \\Omega$.
                    </div>`
        },
        phasors: {
            math: `<h3>Sinusoidal AC Phasors</h3>
                   <p>A phasor is a complex number that represents the amplitude and phase of sinusoidal waveforms. As a vector rotates counter-clockwise inside circles at frequency $\omega$ rad/s, its projection on the vertical axis traces out a continuous sine wave:</p>
                   $$v(t) = \\text{Im}\\left\\{ V \\cdot e^{j(\\omega t + \\theta)} \\right\\}$$
                   <p>This maps AC circuits from dynamic differential calculus into basic static complex algebraic calculations.</p>`,
            exams: `<h4>Power engineers use phasor networks to monitor huge AC power lines, analyze power factor drops, and synchronize electric generators.</h4>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: A voltage phasor is $V = 10 \\angle 30^\\circ\\text{ V}$. Write the corresponding time-domain signal at $60\\text{ Hz}$.<br>
                        A: $v(t) = 10 \\sin(120\\pi t + 30^\\circ)\\text{ V}$.
                    </div>`
        },
        comms: {
            math: `<h3>AM & FM Modulation</h3>
                   <p>Modulation shifts baseband voice frequencies up to high RF bands for antenna transmission.
                   In <strong>Amplitude Modulation (AM)</strong>, carrier amplitude follows message signals:
                   $$s_{\\text{AM}}(t) = [ A_c + m(t) ] \\cdot \\cos(2\\pi f_c t)$$
                   In <strong>Frequency Modulation (FM)</strong>, carrier frequency shifts:
                   $$s_{\\text{FM}}(t) = A_c \\cdot \\cos\\left[ 2\\pi f_c t + \\beta \\cdot \\int_0^t m(\\tau) d\\tau \\right]$$</p>`,
            exams: `<h4>FM radio, aircraft navigation communication channels, and telemetry tracking transceivers rely on these modulation principles.</h4>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: An AM scheme uses a carrier $f_c = 100\\text{ kHz}$ modulated by $f_m = 5\\text{ kHz}$. List the spectral peak frequencies.<br>
                        A: Peaks appear at $f_c - f_m = 95\\text{ kHz}$, $f_c = 100\\text{ kHz}$, and $f_c + f_m = 105\\text{ kHz}$.
                    </div>`
        },
        transforms: {
            math: `<h3>s-Plane Pole-Zero Integrations</h3>
                   <p>The Laplace transform converts continuous-time signals into a complex frequency domain $s = \\sigma + j\\omega$. System responses are represented as ratios of polynomials. The roots of the denominator are **Poles** (marked 'X'), and the roots of the numerator are **Zeros** (marked 'O'):</p>
                   $$H(s) = \\frac{Y(s)}{X(s)}$$
                   <p>Poles in the **Left-Half-Plane (LHP)** yield decaying stable transients. Poles in the **Right-Half-Plane (RHP)** create growing unstable oscillations!</p>`,
            exams: `<h4>Laplace pole mappings are utilized to ensure flight-control systems are stable, analyze amplifier bandwidth limits, and configure robotics feedback filters.</h4>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: A system has complex poles at $s = -1 \\pm j3$. Describe the natural time-domain impulse response.<br>
                        A: It will be a damped sinusoid, decaying exponentially as $e^{-t} \\sin(3t)$.
                    </div>`
        },
        matrix: {
            math: `<h3>Coordinate Matrices</h3>
                   <p>Matrices deform 2D vectors and signal coordinate systems. Applying a $2 \\times 2$ transformation matrix deforms standard square Cartesian coordinates:</p>
                   $$\\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}$$
                   <p>Adjusting rotational and scaling matrices shows how coordinate points scale, shear, or rotate dynamically across Cartesian planes.</p>`,
            exams: `<h4>Vector matrix translations are fundamental in 3D graphics rendering, computer vision camera alignments, and MIMO telecommunication equations.</h4>
                    <br><h4>Exam Prep: Common Question</h4>
                    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:6px; font-size:0.8rem; font-family:monospace;">
                        Q: Write down the $2 \\times 2$ matrix that rotates coordinate systems by $90^\\circ$ counter-clockwise.<br>
                        A: $\\begin{bmatrix} \\cos(90^\\circ) & -\\sin(90^\\circ) \\\\ \\sin(90^\\circ) & \\cos(90^\\circ) \\end{bmatrix} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$.
                    </div>`
        },
        formulas: {
            math: `<h3>Interactive Engineering Formula Library</h3>
                   <p>Click any formula pill in the explorer above to load an interactive numerical calculator. Tweak parameters to solve critical values in telecommunications, networks, and semiconductor device equations.</p>`,
            exams: `<h4>Mastering these foundational formulas is key to securing top grades in college ECE midterms, qualifying exams, and interviews.</h4>
                    <br><h4>Exam Prep Tips</h4>
                    <p>Make sure to double check variable dimensions and constants (e.g. Boltzmann constant, electron charge) before submitting algebraic steps in tests!</p>`
        }
    };

    const updateEducationalContent = (tab) => {
        const item = educationalData[tab] || educationalData['plotter'];
        eduMath.innerHTML = item.math;
        eduExams.innerHTML = item.exams;
        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInElement) {
            window.renderMathInElement(document.getElementById('common-educational-deck'), {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    };

    updateEducationalContent('plotter');

    // --- 3. CANVAS CONTEXT DEFINITIONS & SCALES ---
    const plotterCanvas = document.getElementById('plotter-canvas');
    const signalsCanvas = document.getElementById('signals-canvas');
    const fourierIndivCanvas = document.getElementById('fourier-indiv-canvas');
    const fourierSumCanvas = document.getElementById('fourier-sum-canvas');
    const samplingCanvas = document.getElementById('sampling-canvas');
    const convSlidingCanvas = document.getElementById('conv-sliding-canvas');
    const convOutputCanvas = document.getElementById('conv-output-canvas');
    const filterMagCanvas = document.getElementById('filter-mag-canvas');
    const filterPhaseCanvas = document.getElementById('filter-phase-canvas');
    const complexGridCanvas = document.getElementById('complex-grid-canvas');
    const phasorCircleCanvas = document.getElementById('phasor-circle-canvas');
    const phasorSineCanvas = document.getElementById('phasor-sine-canvas');
    const commsTimeCanvas = document.getElementById('comms-time-canvas');
    const commsFreqCanvas = document.getElementById('comms-freq-canvas');
    const splaneCanvas = document.getElementById('laplace-splane-canvas');
    const transformTimeCanvas = document.getElementById('laplace-time-canvas');
    const matrixCanvas = document.getElementById('matrix-canvas');

    const getCtx = (canvas) => canvas ? canvas.getContext('2d') : null;

    const pCtx = getCtx(plotterCanvas);
    const sCtx = getCtx(signalsCanvas);
    const fiCtx = getCtx(fourierIndivCanvas);
    const fsCtx = getCtx(fourierSumCanvas);
    const sampCtx = getCtx(samplingCanvas);
    const cSlideCtx = getCtx(convSlidingCanvas);
    const cOutCtx = getCtx(convOutputCanvas);
    const fMagCtx = getCtx(filterMagCanvas);
    const fPhaseCtx = getCtx(filterPhaseCanvas);
    const compCtx = getCtx(complexGridCanvas);
    const phCircCtx = getCtx(phasorCircleCanvas);
    const phSineCtx = getCtx(phasorSineCanvas);
    const cTimeCtx = getCtx(commsTimeCanvas);
    const cFreqCtx = getCtx(commsFreqCanvas);
    const splCtx = getCtx(splaneCanvas);
    const trTimeCtx = getCtx(transformTimeCanvas);
    const matCtx = getCtx(matrixCanvas);

    // Initial canvas sizing
    const initCanvasSizing = () => {
        const setSize = (canvas, h) => {
            if (!canvas) return;
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = h;
        };
        setSize(plotterCanvas, 320);
        setSize(signalsCanvas, 260);
        setSize(fourierIndivCanvas, 240);
        setSize(fourierSumCanvas, 240);
        setSize(samplingCanvas, 260);
        setSize(convSlidingCanvas, 240);
        setSize(convOutputCanvas, 240);
        setSize(filterMagCanvas, 240);
        setSize(filterPhaseCanvas, 240);
        setSize(complexGridCanvas, 280);
        setSize(phasorCircleCanvas, 240);
        setSize(phasorSineCanvas, 240);
        setSize(commsTimeCanvas, 240);
        setSize(commsFreqCanvas, 240);
        setSize(splaneCanvas, 260);
        setSize(transformTimeCanvas, 260);
        setSize(matrixCanvas, 320);
    };
    initCanvasSizing();
    mathResizeHandler = initCanvasSizing;
    window.addEventListener('resize', mathResizeHandler);

    // --- 4. INDIVIDUAL LAB PARAMETER STATES ---

    // A. Plotter
    const selPlotPreset = document.getElementById('plotter-preset');
    const sPlotZoom = document.getElementById('slider-plot-zoom');
    const lblPlotZoom = document.getElementById('val-plot-zoom');

    let plotPreset = 'sin';
    let plotZoom = 1.0;

    selPlotPreset.addEventListener('change', (e) => { plotPreset = e.target.value; });
    sPlotZoom.addEventListener('input', (e) => {
        plotZoom = parseFloat(e.target.value);
        lblPlotZoom.textContent = `${plotZoom.toFixed(1)}x`;
    });

    // B. Signals Lab
    const sSigAmp = document.getElementById('slider-sig-amp');
    const sSigFreq = document.getElementById('slider-sig-freq');
    const sSigPhase = document.getElementById('slider-sig-phase');
    const selSigShape = document.getElementById('select-sig-shape');

    const lblSigAmp = document.getElementById('val-sig-amp');
    const lblSigFreq = document.getElementById('val-sig-freq');
    const lblSigPhase = document.getElementById('val-sig-phase');

    const telSigPeak = document.getElementById('tel-sig-peak');
    const telSigRms = document.getElementById('tel-sig-rms');
    const telSigPeriod = document.getElementById('tel-sig-period');

    let sigAmp = 2.0, sigFreq = 4, sigPhase = 0, sigShape = 'sine';

    function updateSignalsLab() {
        sigAmp = parseFloat(sSigAmp.value);
        sigFreq = parseInt(sSigFreq.value);
        sigPhase = parseInt(sSigPhase.value);
        sigShape = selSigShape.value;

        lblSigAmp.textContent = `${sigAmp.toFixed(1)} V`;
        lblSigFreq.textContent = `${sigFreq} Hz`;
        lblSigPhase.textContent = `${sigPhase}°`;

        telSigPeak.textContent = `${sigAmp.toFixed(2)} V`;
        let rms = sigAmp / Math.sqrt(2);
        if (sigShape === 'square') rms = sigAmp;
        else if (sigShape === 'triangle') rms = sigAmp / Math.sqrt(3);
        telSigRms.textContent = `${rms.toFixed(2)} V`;
        telSigPeriod.textContent = `${Math.round(1000 / sigFreq)} ms`;
    }
    [sSigAmp, sSigFreq, sSigPhase, selSigShape].forEach(el => el.addEventListener('input', updateSignalsLab));
    selSigShape.addEventListener('change', updateSignalsLab);

    // C. Fourier Series
    const sFourN = document.getElementById('slider-four-n');
    const selFourShape = document.getElementById('select-four-shape');
    const lblFourN = document.getElementById('val-four-n');

    let fourN = 4, fourShape = 'square';
    sFourN.addEventListener('input', (e) => {
        fourN = parseInt(e.target.value);
        lblFourN.textContent = fourN;
    });
    selFourShape.addEventListener('change', (e) => { fourShape = e.target.value; });

    // D. Sampling & Aliasing
    const sSampSig = document.getElementById('slider-samp-sig');
    const sSampRate = document.getElementById('slider-samp-rate');
    const lblSampSig = document.getElementById('val-samp-sig');
    const lblSampRate = document.getElementById('val-samp-rate');
    const readSampNyquist = document.getElementById('read-samp-nyquist');
    const alertSampAlias = document.getElementById('alert-samp-alias');

    let sampSig = 5, sampRate = 30;

    function updateSamplingParams() {
        sampSig = parseInt(sSampSig.value);
        sampRate = parseInt(sSampRate.value);

        lblSampSig.textContent = `${sampSig} Hz`;
        lblSampRate.textContent = `${sampRate} Hz`;
        readSampNyquist.textContent = `${sampSig * 2} Hz`;

        if (sampRate < sampSig * 2) {
            alertSampAlias.textContent = `🚨 ALIASING DETECTED (Fs < 2F)`;
            alertSampAlias.style.background = 'rgba(239, 68, 68, 0.15)';
            alertSampAlias.style.color = 'var(--error)';
            alertSampAlias.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        } else {
            alertSampAlias.textContent = `🟢 Nyquist Satisfied (Perfect Reconstruction)`;
            alertSampAlias.style.background = 'rgba(16, 185, 129, 0.12)';
            alertSampAlias.style.color = '#6ee7b7';
            alertSampAlias.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        }
    }
    sSampSig.addEventListener('input', updateSamplingParams);
    sSampRate.addEventListener('input', updateSamplingParams);

    // E. Convolution Lab
    const sConvT = document.getElementById('slider-conv-t');
    const lblConvT = document.getElementById('val-conv-t');
    const btnConvAuto = document.getElementById('btn-conv-auto');
    const btnConvReset = document.getElementById('btn-conv-reset');

    let convT = -120;
    let convAutoRunning = false;

    sConvT.addEventListener('input', (e) => {
        convT = parseInt(e.target.value);
        lblConvT.textContent = (convT / 20).toFixed(1);
    });

    btnConvReset.addEventListener('click', () => {
        convT = -120;
        sConvT.value = -120;
        lblConvT.textContent = "-6.0";
        if (convAutoRunning) {
            convAutoRunning = false;
            btnConvAuto.innerHTML = '<i data-lucide="play"></i> Auto Slide';
            if (window.lucide) window.lucide.createIcons();
        }
    });

    btnConvAuto.addEventListener('click', () => {
        convAutoRunning = !convAutoRunning;
        btnConvAuto.innerHTML = convAutoRunning 
            ? '<i data-lucide="pause"></i> Pause Slide'
            : '<i data-lucide="play"></i> Auto Slide';
        if (window.lucide) window.lucide.createIcons();
    });

    // F. Filter Response
    const sFiltFc = document.getElementById('slider-filt-fc');
    const sFiltOrder = document.getElementById('slider-filt-order');
    const selFiltType = document.getElementById('select-filt-type');

    const lblFiltFc = document.getElementById('val-filt-fc');
    const lblFiltOrder = document.getElementById('val-filt-order');

    let filtFc = 500, filtOrder = 2, filtType = 'lp';

    function updateFilterParams() {
        filtFc = parseInt(sFiltFc.value);
        filtOrder = parseInt(sFiltOrder.value);
        filtType = selFiltType.value;

        lblFiltFc.textContent = `${filtFc} Hz`;
        lblFiltOrder.textContent = filtOrder;
    }
    sFiltFc.addEventListener('input', updateFilterParams);
    sFiltOrder.addEventListener('input', updateFilterParams);
    selFiltType.addEventListener('change', updateFilterParams);

    // G. Complex Planes
    const sCompReal = document.getElementById('slider-comp-real');
    const sCompImag = document.getElementById('slider-comp-imag');
    
    const lblCompReal = document.getElementById('val-comp-real');
    const lblCompImag = document.getElementById('val-comp-imag');

    const readCompRect = document.getElementById('read-comp-rect');
    const readCompPolar = document.getElementById('read-comp-polar');
    const readCompEuler = document.getElementById('read-comp-euler');

    let compReal = 3.0, compImag = 4.0;

    function updateComplexParams() {
        compReal = parseFloat(sCompReal.value);
        compImag = parseFloat(sCompImag.value);

        lblCompReal.textContent = compReal.toFixed(1);
        lblCompImag.textContent = compImag.toFixed(1);

        const jSign = compImag >= 0 ? '+' : '-';
        readCompRect.textContent = `${compReal.toFixed(2)} ${jSign} j${Math.abs(compImag).toFixed(2)}`;

        const r = Math.sqrt(compReal * compReal + compImag * compImag);
        let thetaRad = Math.atan2(compImag, compReal);
        let thetaDeg = (thetaRad * 180) / Math.PI;

        readCompPolar.textContent = `${r.toFixed(2)} ∠ ${thetaDeg.toFixed(1)}°`;
        readCompEuler.textContent = `${r.toFixed(2)}e^(j${thetaRad.toFixed(2)})`;
    }
    sCompReal.addEventListener('input', updateComplexParams);
    sCompImag.addEventListener('input', updateComplexParams);

    // H. Phasor Lab
    const sPhasorAmp = document.getElementById('slider-phasor-amp');
    const sPhasorFreq = document.getElementById('slider-phasor-freq');
    const lblPhasorAmp = document.getElementById('val-phasor-amp');
    const lblPhasorFreq = document.getElementById('val-phasor-freq');

    let phasorAmp = 3.0, phasorFreq = 2;
    sPhasorAmp.addEventListener('input', (e) => {
        phasorAmp = parseFloat(e.target.value);
        lblPhasorAmp.textContent = `${phasorAmp.toFixed(1)} V`;
    });
    sPhasorFreq.addEventListener('input', (e) => {
        phasorFreq = parseInt(e.target.value);
        lblPhasorFreq.textContent = `${phasorFreq} rad/s`;
    });

    // I. Communication AM/FM System
    const sCommFc = document.getElementById('slider-comm-fc');
    const sCommFm = document.getElementById('slider-comm-fm');
    const sCommIdx = document.getElementById('slider-comm-idx');
    const selCommMode = document.getElementById('select-comm-mode');

    const lblCommFc = document.getElementById('val-comm-fc');
    const lblCommFm = document.getElementById('val-comm-fm');
    const lblCommIdx = document.getElementById('val-comm-idx');

    const readCommLsb = document.getElementById('read-comm-lsb');
    const readCommUsb = document.getElementById('read-comm-usb');

    let commFc = 80, commFm = 8, commIdx = 0.6, commMode = 'am';

    function updateCommsParams() {
        commFc = parseInt(sCommFc.value);
        commFm = parseInt(sCommFm.value);
        commIdx = parseFloat(sCommIdx.value);
        commMode = selCommMode.value;

        lblCommFc.textContent = `${commFc} Hz`;
        lblCommFm.textContent = `${commFm} Hz`;
        lblCommIdx.textContent = commIdx.toFixed(1);

        readCommLsb.textContent = `${commFc - commFm} Hz`;
        readCommUsb.textContent = `${commFc + commFm} Hz`;
    }
    sCommFc.addEventListener('input', updateCommsParams);
    sCommFm.addEventListener('input', updateCommsParams);
    sCommIdx.addEventListener('input', updateCommsParams);
    selCommMode.addEventListener('change', updateCommsParams);

    // J. Laplace Transforms s-Plane
    const sLapSigma = document.getElementById('slider-laplace-sigma');
    const sLapOmega = document.getElementById('slider-laplace-omega');
    const lblLapSigma = document.getElementById('val-laplace-sigma');
    const lblLapOmega = document.getElementById('val-laplace-omega');

    let lapSigma = -1.5, lapOmega = 3.0;
    sLapSigma.addEventListener('input', (e) => {
        lapSigma = parseFloat(e.target.value);
        lblLapSigma.textContent = lapSigma.toFixed(1);
    });
    sLapOmega.addEventListener('input', (e) => {
        lapOmega = parseFloat(e.target.value);
        lblLapOmega.textContent = lapOmega.toFixed(1);
    });

    // K. Matrix Transforms
    const sMatSx = document.getElementById('slider-mat-sx');
    const sMatSy = document.getElementById('slider-mat-sy');
    const sMatTheta = document.getElementById('slider-mat-theta');

    const lblMatSx = document.getElementById('val-mat-sx');
    const lblMatSy = document.getElementById('val-mat-sy');
    const lblMatTheta = document.getElementById('val-mat-theta');

    const cellA = document.getElementById('mat-a');
    const cellB = document.getElementById('mat-b');
    const cellC = document.getElementById('mat-c');
    const cellD = document.getElementById('mat-d');

    let matSx = 1.0, matSy = 1.0, matTheta = 0;

    function updateMatrixParams() {
        matSx = parseFloat(sMatSx.value);
        matSy = parseFloat(sMatSy.value);
        matTheta = parseInt(sMatTheta.value);

        lblMatSx.textContent = matSx.toFixed(1);
        lblMatSy.textContent = matSy.toFixed(1);
        lblMatTheta.textContent = `${matTheta}°`;

        const rad = (matTheta * Math.PI) / 180;
        const a = matSx * Math.cos(rad);
        const b = -matSy * Math.sin(rad);
        const c = matSx * Math.sin(rad);
        const d = matSy * Math.cos(rad);

        cellA.textContent = a.toFixed(2);
        cellB.textContent = b.toFixed(2);
        cellC.textContent = c.toFixed(2);
        cellD.textContent = d.toFixed(2);
    }
    sMatSx.addEventListener('input', updateMatrixParams);
    sMatSy.addEventListener('input', updateMatrixParams);
    sMatTheta.addEventListener('input', updateMatrixParams);

    // L. Formula Explorer Calculator Logic
    const formulaDeckWrapper = document.getElementById('formula-calculator-wrapper');
    const formulaPills = document.querySelectorAll('[data-formula-preset]');
    let activeFormula = 'ohms';

    const renderFormulaCalculator = (type) => {
        activeFormula = type;
        formulaPills.forEach(pill => {
            if (pill.getAttribute('data-formula-preset') === type) pill.classList.add('active');
            else pill.classList.remove('active');
        });

        if (type === 'ohms') {
            formulaDeckWrapper.innerHTML = `
                <div class="panel-section-title"><i data-lucide="calculator"></i> Ohm's Law Calculator</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:14px;">
                    <div class="slider-group">
                        <span class="slider-name">Circuit Current (I) - Amperes</span>
                        <input type="number" id="calc-ohms-i" value="0.02" step="0.005" style="width:100%; padding:8px; border-radius:4px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; font-family:monospace;">
                    </div>
                    <div class="slider-group">
                        <span class="slider-name">Load Resistance (R) - Ohms</span>
                        <input type="number" id="calc-ohms-r" value="250" step="10" style="width:100%; padding:8px; border-radius:4px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; font-family:monospace;">
                    </div>
                </div>
                <div class="telemetry-tag" style="font-size:1.1rem; justify-content:center; padding:12px;">
                    Resulting Source Voltage (V = I * R): &nbsp; <span id="calc-ohms-res" style="color:var(--green);">5.00 V</span>
                </div>
            `;

            const inputI = document.getElementById('calc-ohms-i');
            const inputR = document.getElementById('calc-ohms-r');
            const resVal = document.getElementById('calc-ohms-res');

            const recalc = () => {
                const iVal = parseFloat(inputI.value) || 0;
                const rVal = parseFloat(inputR.value) || 0;
                resVal.textContent = `${(iVal * rVal).toFixed(2)} V`;
            };
            inputI.addEventListener('input', recalc);
            inputR.addEventListener('input', recalc);
        } 
        else if (type === 'rc') {
            formulaDeckWrapper.innerHTML = `
                <div class="panel-section-title"><i data-lucide="calculator"></i> RC Time Constant Calculator</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:14px;">
                    <div class="slider-group">
                        <span class="slider-name">Resistor Value (R) - Ohms</span>
                        <input type="number" id="calc-rc-r" value="10000" step="1000" style="width:100%; padding:8px; border-radius:4px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; font-family:monospace;">
                    </div>
                    <div class="slider-group">
                        <span class="slider-name">Capacitor Value (C) - Farads</span>
                        <input type="number" id="calc-rc-c" value="0.0001" step="0.00005" style="width:100%; padding:8px; border-radius:4px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; font-family:monospace;">
                    </div>
                </div>
                <div class="telemetry-tag" style="font-size:1.1rem; justify-content:center; padding:12px;">
                    Resulting Time Constant (τ = R * C): &nbsp; <span id="calc-rc-res" style="color:var(--cyan);">1.00 seconds</span>
                </div>
            `;

            const inputR = document.getElementById('calc-rc-r');
            const inputC = document.getElementById('calc-rc-c');
            const resVal = document.getElementById('calc-rc-res');

            const recalc = () => {
                const rVal = parseFloat(inputR.value) || 0;
                const cVal = parseFloat(inputC.value) || 0;
                resVal.textContent = `${(rVal * cVal).toFixed(4)} seconds`;
            };
            inputR.addEventListener('input', recalc);
            inputC.addEventListener('input', recalc);
        }
        else if (type === 'shannon') {
            formulaDeckWrapper.innerHTML = `
                <div class="panel-section-title"><i data-lucide="calculator"></i> Shannon Channel Capacity Calculator</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:14px;">
                    <div class="slider-group">
                        <span class="slider-name">Channel Bandwidth (B) - Hz</span>
                        <input type="number" id="calc-shannon-b" value="20000" step="1000" style="width:100%; padding:8px; border-radius:4px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; font-family:monospace;">
                    </div>
                    <div class="slider-group">
                        <span class="slider-name">Signal-to-Noise Ratio (SNR) - absolute ratio</span>
                        <input type="number" id="calc-shannon-snr" value="15" step="1" style="width:100%; padding:8px; border-radius:4px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; font-family:monospace;">
                    </div>
                </div>
                <div class="telemetry-tag" style="font-size:1.1rem; justify-content:center; padding:12px;">
                    Shannon capacity limit (C = B * log2(1 + SNR)): &nbsp; <span id="calc-shannon-res" style="color:var(--warning);">80.0 kbps</span>
                </div>
            `;

            const inputB = document.getElementById('calc-shannon-b');
            const inputSNR = document.getElementById('calc-shannon-snr');
            const resVal = document.getElementById('calc-shannon-res');

            const recalc = () => {
                const bVal = parseFloat(inputB.value) || 0;
                const snrVal = parseFloat(inputSNR.value) || 0;
                const capacity = bVal * Math.log2(1 + snrVal);
                resVal.textContent = `${(capacity / 1000).toFixed(1)} kbps`;
            };
            inputB.addEventListener('input', recalc);
            inputSNR.addEventListener('input', recalc);
        }

        if (window.lucide) window.lucide.createIcons();
    };

    formulaPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const preset = e.currentTarget.getAttribute('data-formula-preset');
            renderFormulaCalculator(preset);
        });
    });

    renderFormulaCalculator('ohms');

    // Run updates to compute initial bounds
    updateSignalsLab();
    updateSamplingParams();
    updateFilterParams();
    updateComplexParams();
    updateCommsParams();
    updateMatrixParams();

    // --- 5. MASTER REAL-TIME RENDERING CYCLE ---
    let frameTick = 0;

    const renderLoop = () => {
        frameTick += 0.05;

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const gridColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.03)';
        const axisColor = isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.2)';

        // Render based on what tab is currently shown (highly performant!)
        if (activeTabName === 'plotter' && pCtx) {
            const w = plotterCanvas.width;
            const h = plotterCanvas.height;
            pCtx.clearRect(0, 0, w, h);

            // Grid Lines
            pCtx.strokeStyle = gridColor;
            pCtx.lineWidth = 1;
            const step = 20 * plotZoom;
            for (let x = 0; x < w; x += step) {
                pCtx.beginPath(); pCtx.moveTo(x, 0); pCtx.lineTo(x, h); pCtx.stroke();
            }
            for (let y = 0; y < h; y += step) {
                pCtx.beginPath(); pCtx.moveTo(0, y); pCtx.lineTo(w, y); pCtx.stroke();
            }

            // Axes
            pCtx.strokeStyle = axisColor;
            pCtx.lineWidth = 1.5;
            pCtx.beginPath(); pCtx.moveTo(0, h/2); pCtx.lineTo(w, h/2); pCtx.stroke();
            pCtx.beginPath(); pCtx.moveTo(w/2, 0); pCtx.lineTo(w/2, h); pCtx.stroke();

            // Plot curve
            pCtx.strokeStyle = isLight ? '#0891b2' : '#00d4ff';
            pCtx.lineWidth = 2.5;
            pCtx.beginPath();

            for (let px = 0; px < w; px++) {
                const xVal = (px - w / 2) / (20 * plotZoom);
                let yVal = 0;
                if (plotPreset === 'sin') yVal = Math.sin(xVal);
                else if (plotPreset === 'cos') yVal = Math.cos(xVal);
                else if (plotPreset === 'x2') yVal = 0.1 * xVal * xVal;
                else if (plotPreset === 'decay') yVal = Math.exp(-0.15 * Math.abs(xVal)) * Math.sin(xVal);

                const py = h / 2 - yVal * (50 * plotZoom);
                if (px === 0) pCtx.moveTo(px, py);
                else pCtx.lineTo(px, py);
            }
            pCtx.stroke();
        } 
        else if (activeTabName === 'signals' && sCtx) {
            const w = signalsCanvas.width;
            const h = signalsCanvas.height;
            sCtx.clearRect(0, 0, w, h);

            // Grid
            sCtx.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.08)' : 'rgba(16, 185, 129, 0.05)';
            sCtx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) { sCtx.beginPath(); sCtx.moveTo(x, 0); sCtx.lineTo(x, h); sCtx.stroke(); }
            for (let y = 0; y < h; y += 30) { sCtx.beginPath(); sCtx.moveTo(0, y); sCtx.lineTo(w, y); sCtx.stroke(); }

            const centerY = h / 2;
            sCtx.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.25)' : 'rgba(16, 185, 129, 0.25)';
            sCtx.lineWidth = 1;
            sCtx.beginPath(); sCtx.moveTo(0, centerY); sCtx.lineTo(w, centerY); sCtx.stroke();

            // Plot signals curve
            sCtx.strokeStyle = isLight ? '#059669' : '#10b981';
            sCtx.lineWidth = 2.5;
            sCtx.beginPath();

            const radPhase = (sigPhase * Math.PI) / 180;
            const scalingX = 0.00015;

            for (let x = 0; x < w; x++) {
                const time = (x - w / 2) * scalingX + frameTick * 0.05;
                const angle = 2 * Math.PI * sigFreq * time + radPhase;
                let val = 0;

                if (sigShape === 'sine') val = Math.sin(angle);
                else if (sigShape === 'square') val = Math.sin(angle) >= 0 ? 1 : -1;
                else if (sigShape === 'triangle') val = (2 / Math.PI) * Math.asin(Math.sin(angle));
                else if (sigShape === 'sawtooth') {
                    const scaledT = angle / (2 * Math.PI);
                    val = 2 * (scaledT - Math.floor(0.5 + scaledT));
                }

                const py = centerY - val * (sigAmp * 25);
                if (x === 0) sCtx.moveTo(x, py);
                else sCtx.lineTo(x, py);
            }
            sCtx.stroke();
        }
        else if (activeTabName === 'fourier' && fiCtx && fsCtx) {
            const w = fourierIndivCanvas.width;
            const h = fourierIndivCanvas.height;
            fiCtx.clearRect(0, 0, w, h);
            fsCtx.clearRect(0, 0, w, h);

            const centerY = h / 2;

            // Draw grids for both
            const drawGrid = (ctx) => {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                ctx.strokeStyle = axisColor;
                ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
            };
            drawGrid(fiCtx);
            drawGrid(fsCtx);

            // A. Plot individual harmonics
            const colors = isLight ? ['#059669', '#d97706', '#4f46e5', '#db2777'] : ['#10b981', '#f59e0b', '#6366f1', '#ec4899'];
            
            const getHarmonicVal = (shape, k, time) => {
                const angle = 2 * Math.PI * k * time;
                if (shape === 'square') {
                    if (k % 2 === 0) return 0;
                    return (4 / Math.PI) * (1 / k) * Math.sin(angle);
                } 
                else if (shape === 'triangle') {
                    if (k % 2 === 0) return 0;
                    const idx = (k - 1) / 2;
                    return (8 / (Math.PI * Math.PI)) * (Math.pow(-1, idx) / (k * k)) * Math.sin(angle);
                }
                else if (shape === 'sawtooth') {
                    return (2 / Math.PI) * (Math.pow(-1, k - 1) / k) * Math.sin(angle);
                }
                return 0;
            };

            // Limit plots to first 4 active harmonics
            let activeIdxs = [];
            for (let k = 1; k <= fourN; k++) {
                const dummyVal = getHarmonicVal(fourShape, k, 0.1);
                if (Math.abs(dummyVal) > 0.0001) activeIdxs.push(k);
            }

            activeIdxs.slice(0, 4).forEach((harmVal, cIdx) => {
                fiCtx.beginPath();
                fiCtx.strokeStyle = colors[cIdx % colors.length];
                fiCtx.lineWidth = 1.5;

                for (let x = 0; x < w; x++) {
                    const t = (x - w/2) * 0.0015 - frameTick * 0.01;
                    const val = getHarmonicVal(fourShape, harmVal, t);
                    const py = centerY - val * 70;
                    if (x === 0) fiCtx.moveTo(x, py);
                    else fiCtx.lineTo(x, py);
                }
                fiCtx.stroke();
            });

            // B. Plot Summed Resultant wave
            fsCtx.beginPath();
            fsCtx.strokeStyle = isLight ? '#0891b2' : '#06b6d4';
            fsCtx.lineWidth = 2.5;

            for (let x = 0; x < w; x++) {
                const t = (x - w/2) * 0.0015 - frameTick * 0.01;
                let sum = 0;
                for (let k = 1; k <= fourN; k++) {
                    sum += getHarmonicVal(fourShape, k, t);
                }
                const py = centerY - sum * 70;
                if (x === 0) fsCtx.moveTo(x, py);
                else fsCtx.lineTo(x, py);
            }
            fsCtx.stroke();
        }
        else if (activeTabName === 'sampling' && sampCtx) {
            const w = samplingCanvas.width;
            const h = samplingCanvas.height;
            sampCtx.clearRect(0, 0, w, h);

            // Grids
            sampCtx.strokeStyle = gridColor;
            sampCtx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) { sampCtx.beginPath(); sampCtx.moveTo(x, 0); sampCtx.lineTo(x, h); sampCtx.stroke(); }
            
            const centerY = h / 2;
            sampCtx.strokeStyle = axisColor;
            sampCtx.beginPath(); sampCtx.moveTo(0, centerY); sampCtx.lineTo(w, centerY); sampCtx.stroke();

            // A. Draw continuous original analog signal
            sampCtx.beginPath();
            sampCtx.strokeStyle = isLight ? 'rgba(8, 145, 178, 0.45)' : 'rgba(0, 212, 255, 0.35)';
            sampCtx.lineWidth = 1.5;

            for (let x = 0; x < w; x++) {
                const t = (x / w) * 2; // 2 seconds total width
                const py = centerY - Math.sin(2 * Math.PI * sampSig * t) * 60;
                if (x === 0) sampCtx.moveTo(x, py);
                else sampCtx.lineTo(x, py);
            }
            sampCtx.stroke();

            // B. Draw reconstructed reconstructed wave
            const apparentFreq = (sampRate < sampSig * 2) ? Math.abs(sampRate - sampSig) : sampSig;

            sampCtx.beginPath();
            sampCtx.strokeStyle = isLight ? '#dc2626' : '#ef4444';
            sampCtx.lineWidth = 2.5;

            for (let x = 0; x < w; x++) {
                const t = (x / w) * 2;
                const py = centerY - Math.sin(2 * Math.PI * apparentFreq * t) * 60;
                if (x === 0) sampCtx.moveTo(x, py);
                else sampCtx.lineTo(x, py);
            }
            sampCtx.stroke();

            // C. Draw Discrete Sampling Stems
            const totalSamples = Math.floor(2 * sampRate);
            sampCtx.fillStyle = isLight ? '#059669' : '#10b981';
            sampCtx.strokeStyle = isLight ? '#059669' : '#10b981';
            sampCtx.lineWidth = 1.5;

            for (let i = 0; i <= totalSamples; i++) {
                const t = i / sampRate;
                const sx = (t / 2) * w;
                if (sx > w) continue;

                const sy = centerY - Math.sin(2 * Math.PI * sampSig * t) * 60;

                // Stem line
                sampCtx.beginPath();
                sampCtx.moveTo(sx, centerY);
                sampCtx.lineTo(sx, sy);
                sampCtx.stroke();

                // Point dot
                sampCtx.beginPath();
                sampCtx.arc(sx, sy, 3, 0, Math.PI * 2);
                sampCtx.fill();
            }
        }
        else if (activeTabName === 'convolution' && cSlideCtx && cOutCtx) {
            const w = convSlidingCanvas.width;
            const h = convSlidingCanvas.height;
            cSlideCtx.clearRect(0, 0, w, h);
            cOutCtx.clearRect(0, 0, w, h);

            const centerY = h / 2;

            const drawGrid = (ctx) => {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                ctx.strokeStyle = axisColor;
                ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
            };
            drawGrid(cSlideCtx);
            drawGrid(cOutCtx);

            // Handle auto sliding
            if (convAutoRunning) {
                convT += 0.8;
                if (convT > 120) convT = -120;
                sConvT.value = Math.round(convT);
                lblConvT.textContent = (convT / 20).toFixed(1);
            }

            // A. Draw stationary rectangular signal x(τ) (centered at w/2, duration -20 to 20 pixels)
            const sxWidth = 40; 
            cSlideCtx.strokeStyle = isLight ? '#0891b2' : '#00d4ff';
            cSlideCtx.lineWidth = 2.5;
            cSlideCtx.strokeRect(w/2 - sxWidth/2, centerY - 60, sxWidth, 60);
            cSlideCtx.fillStyle = isLight ? 'rgba(8, 145, 178, 0.12)' : 'rgba(0, 212, 255, 0.08)';
            cSlideCtx.fillRect(w/2 - sxWidth/2, centerY - 60, sxWidth, 60);

            // B. Draw sliding rectangular impulse h(t - τ) (moves based on convT)
            const shWidth = 40;
            const slideX = w/2 + convT;
            cSlideCtx.strokeStyle = isLight ? '#059669' : '#10b981';
            cSlideCtx.lineWidth = 2.5;
            cSlideCtx.strokeRect(slideX - shWidth/2, centerY - 60, shWidth, 60);
            cSlideCtx.fillStyle = isLight ? 'rgba(5, 150, 105, 0.12)' : 'rgba(0, 255, 157, 0.08)';
            cSlideCtx.fillRect(slideX - shWidth/2, centerY - 60, shWidth, 60);

            // C. Highlight multiplication overlap
            const overlapStart = Math.max(w/2 - sxWidth/2, slideX - shWidth/2);
            const overlapEnd = Math.min(w/2 + sxWidth/2, slideX + shWidth/2);
            if (overlapStart < overlapEnd) {
                cSlideCtx.fillStyle = isLight ? '#d97706' : '#f59e0b';
                cSlideCtx.globalAlpha = 0.35;
                cSlideCtx.fillRect(overlapStart, centerY - 60, overlapEnd - overlapStart, 60);
                cSlideCtx.globalAlpha = 1.0;
            }

            // D. Draw resulting triangular convolution graph on bottom canvas
            cOutCtx.beginPath();
            cOutCtx.strokeStyle = isLight ? '#d97706' : '#f59e0b';
            cOutCtx.lineWidth = 3.0;

            for (let px = 0; px < w; px++) {
                const delta = px - w / 2;
                let val = 0;
                const dMin = -40, dMax = 40;
                if (delta >= dMin && delta <= dMax) {
                    val = 1 - Math.abs(delta) / 40;
                }
                const py = centerY - val * 70;
                if (px === 0) cOutCtx.moveTo(px, py);
                else cOutCtx.lineTo(px, py);
            }
            cOutCtx.stroke();

            // Pulsing dot at active slide position
            const activeY = centerY - (overlapStart < overlapEnd ? (overlapEnd - overlapStart) / 40 : 0) * 70;
            cOutCtx.beginPath();
            cOutCtx.arc(w/2 + convT, activeY, 5, 0, Math.PI * 2);
            cOutCtx.fillStyle = isLight ? '#0f172a' : '#fff';
            cOutCtx.fill();
        }
        else if (activeTabName === 'filters' && fMagCtx && fPhaseCtx) {
            const w = filterMagCanvas.width;
            const h = filterMagCanvas.height;
            fMagCtx.clearRect(0, 0, w, h);
            fPhaseCtx.clearRect(0, 0, w, h);

            const mOriginY = h - 30;
            const pOriginY = h / 2;

            const drawLogGrid = (ctx, isPhase) => {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                ctx.strokeStyle = axisColor;
                ctx.beginPath();
                const baselineY = isPhase ? pOriginY : mOriginY;
                ctx.moveTo(0, baselineY); ctx.lineTo(w, baselineY); ctx.stroke();
            };
            drawLogGrid(fMagCtx, false);
            drawLogGrid(fPhaseCtx, true);

            // A. Magnitude Response plotting (Bode Gain)
            fMagCtx.beginPath();
            fMagCtx.strokeStyle = isLight ? '#0891b2' : '#00d4ff';
            fMagCtx.lineWidth = 2.5;

            for (let x = 0; x < w; x++) {
                const freq = 10 * Math.pow(1000, x / w);
                let gainRatio = 1;
                if (filtType === 'lp') {
                    gainRatio = 1 / Math.pow(Math.sqrt(1 + Math.pow(freq / filtFc, 2)), filtOrder);
                } else {
                    gainRatio = Math.pow(freq / filtFc, filtOrder) / Math.pow(Math.sqrt(1 + Math.pow(freq / filtFc, 2)), filtOrder);
                }
                const gainDB = 20 * Math.log10(gainRatio);
                const py = mOriginY - (Math.max(-60, gainDB) / -60) * -150;
                if (x === 0) fMagCtx.moveTo(x, py);
                else fMagCtx.lineTo(x, py);
            }
            fMagCtx.stroke();

            // Cutoff vertical reference line
            const fcX = (Math.log10(filtFc / 10) / 3) * w;
            fMagCtx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.45)' : 'rgba(245, 158, 11, 0.35)';
            fMagCtx.lineWidth = 1.2;
            fMagCtx.setLineDash([4, 4]);
            fMagCtx.beginPath(); fMagCtx.moveTo(fcX, 0); fMagCtx.lineTo(fcX, h); fMagCtx.stroke();
            fMagCtx.setLineDash([]);

            // B. Phase Response plotting (Bode Phase)
            fPhaseCtx.beginPath();
            fPhaseCtx.strokeStyle = isLight ? '#8b5cf6' : '#d946ef';
            fPhaseCtx.lineWidth = 2.5;

            for (let x = 0; x < w; x++) {
                const freq = 10 * Math.pow(1000, x / w);
                let phaseDeg = 0;
                if (filtType === 'lp') {
                    phaseDeg = -filtOrder * (Math.atan(freq / filtFc) * 180) / Math.PI;
                } else {
                    phaseDeg = filtOrder * (90 - (Math.atan(freq / filtFc) * 180) / Math.PI);
                }
                const py = pOriginY - (phaseDeg / 180) * 80;
                if (x === 0) fPhaseCtx.moveTo(x, py);
                else fPhaseCtx.lineTo(x, py);
            }
            fPhaseCtx.stroke();
        }
        else if (activeTabName === 'complex' && compCtx) {
            const w = complexGridCanvas.width;
            const h = complexGridCanvas.height;
            compCtx.clearRect(0, 0, w, h);

            // Polar radial rings & grids
            const centerX = w / 2;
            const centerY = h / 2;
            const scale = 14;

            compCtx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255,255,255,0.03)';
            compCtx.lineWidth = 1;
            for (let r = 30; r < w/2; r += 30) {
                compCtx.beginPath();
                compCtx.arc(centerX, centerY, r, 0, Math.PI*2);
                compCtx.stroke();
            }
            compCtx.strokeStyle = axisColor;
            compCtx.beginPath(); compCtx.moveTo(0, centerY); compCtx.lineTo(w, centerY); compCtx.stroke();
            compCtx.beginPath(); compCtx.moveTo(centerX, 0); compCtx.lineTo(centerX, h); compCtx.stroke();

            // Vector drawing
            const vx = centerX + compReal * scale;
            const vy = centerY - compImag * scale;

            compCtx.save();
            compCtx.shadowBlur = 8;
            compCtx.shadowColor = isLight ? 'rgba(8, 145, 178, 0.3)' : 'rgba(6, 182, 212, 0.4)';
            compCtx.strokeStyle = isLight ? '#0891b2' : '#06b6d4';
            compCtx.lineWidth = 3.0;

            // Line
            compCtx.beginPath();
            compCtx.moveTo(centerX, centerY);
            compCtx.lineTo(vx, vy);
            compCtx.stroke();

            // Arrow head
            const angle = Math.atan2(-compImag, compReal);
            compCtx.fillStyle = isLight ? '#0891b2' : '#06b6d4';
            compCtx.beginPath();
            compCtx.moveTo(vx, vy);
            compCtx.lineTo(vx - 8*Math.cos(angle - 0.4), vy - 8*Math.sin(angle - 0.4));
            compCtx.lineTo(vx - 8*Math.cos(angle + 0.4), vy - 8*Math.sin(angle + 0.4));
            compCtx.closePath();
            compCtx.fill();
            compCtx.restore();

            // Point dot
            compCtx.beginPath();
            compCtx.arc(vx, vy, 4, 0, Math.PI*2);
            compCtx.fillStyle = isLight ? '#0f172a' : '#fff';
            compCtx.fill();
        }
        else if (activeTabName === 'phasors' && phCircCtx && phSineCtx) {
            const w = phasorCircleCanvas.width;
            const h = phasorCircleCanvas.height;
            phCircCtx.clearRect(0, 0, w, h);
            phSineCtx.clearRect(0, 0, w, h);

            const centerY = h / 2;
            const circleCenterX = w / 2;
            const radius = phasorAmp * 22;

            const drawBase = (ctx, xCenter) => {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                ctx.strokeStyle = axisColor;
                ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
                if (xCenter) {
                    ctx.beginPath(); ctx.moveTo(xCenter, 0); ctx.lineTo(xCenter, h); ctx.stroke();
                }
            };
            drawBase(phCircCtx, circleCenterX);
            drawBase(phSineCtx, null);

            // A. Rotating Phasor Circle
            phCircCtx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255,255,255,0.06)';
            phCircCtx.lineWidth = 1.2;
            phCircCtx.beginPath(); phCircCtx.arc(circleCenterX, centerY, radius, 0, Math.PI*2); phCircCtx.stroke();

            const rotationAngle = frameTick * phasorFreq;
            const vx = circleCenterX + radius * Math.cos(rotationAngle);
            const vy = centerY - radius * Math.sin(rotationAngle);

            phCircCtx.strokeStyle = isLight ? '#8b5cf6' : '#d946ef';
            phCircCtx.lineWidth = 2.5;
            phCircCtx.beginPath();
            phCircCtx.moveTo(circleCenterX, centerY);
            phCircCtx.lineTo(vx, vy);
            phCircCtx.stroke();

            phCircCtx.beginPath(); phCircCtx.arc(vx, vy, 4, 0, Math.PI*2); phCircCtx.fillStyle = isLight ? '#0f172a' : '#fff'; phCircCtx.fill();

            // B. Sinusoidal Time Domain Sweep
            phSineCtx.beginPath();
            phSineCtx.strokeStyle = isLight ? '#0891b2' : '#00d4ff';
            phSineCtx.lineWidth = 2.5;

            for (let x = 0; x < w; x++) {
                const t = (x / w) * 2 * Math.PI;
                const py = centerY - radius * Math.sin(-t + rotationAngle);
                if (x === 0) phSineCtx.moveTo(x, py);
                else phSineCtx.lineTo(x, py);
            }
            phSineCtx.stroke();

            // Active linking horizontal projection dot
            const linkedY = centerY - radius * Math.sin(rotationAngle);
            phSineCtx.beginPath();
            phSineCtx.arc(0, linkedY, 5, 0, Math.PI*2);
            phSineCtx.fillStyle = isLight ? '#0f172a' : '#fff';
            phSineCtx.fill();
        }
        else if (activeTabName === 'comms' && cTimeCtx && cFreqCtx) {
            const w = commsTimeCanvas.width;
            const h = commsTimeCanvas.height;
            cTimeCtx.clearRect(0, 0, w, h);
            cFreqCtx.clearRect(0, 0, w, h);

            const centerY = h / 2;

            const drawGrid = (ctx) => {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                ctx.strokeStyle = axisColor;
                ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
            };
            drawGrid(cTimeCtx);
            drawGrid(cFreqCtx);

            // A. Time Domain Modulation Waveform
            cTimeCtx.beginPath();
            cTimeCtx.strokeStyle = isLight ? '#0891b2' : '#00d4ff';
            cTimeCtx.lineWidth = 2.0;

            for (let px = 0; px < w; px++) {
                const t = (px / w) * 0.15 + frameTick * 0.002;
                let val = 0;

                if (commMode === 'am') {
                    const envelope = 1 + commIdx * Math.cos(2 * Math.PI * commFm * t);
                    val = envelope * Math.cos(2 * Math.PI * commFc * t);
                } else {
                    val = Math.cos(2 * Math.PI * commFc * t + commIdx * 10 * Math.sin(2 * Math.PI * commFm * t));
                }

                const py = centerY - val * 70;
                if (px === 0) cTimeCtx.moveTo(px, py);
                else cTimeCtx.lineTo(px, py);
            }
            cTimeCtx.stroke();

            // B. Frequency Domain sidebands
            const drawSpike = (xPos, height, label) => {
                cFreqCtx.save();
                cFreqCtx.shadowBlur = 6;
                cFreqCtx.shadowColor = isLight ? 'rgba(79, 70, 229, 0.3)' : 'rgba(6, 182, 212, 0.4)';
                cFreqCtx.strokeStyle = isLight ? '#4f46e5' : '#06b6d4';
                cFreqCtx.lineWidth = 2;
                
                cFreqCtx.beginPath();
                cFreqCtx.moveTo(xPos, centerY);
                cFreqCtx.lineTo(xPos, centerY - height);
                cFreqCtx.stroke();
                cFreqCtx.restore();

                cFreqCtx.fillStyle = isLight ? '#0f172a' : '#fff';
                cFreqCtx.font = 'bold 8px monospace';
                cFreqCtx.textAlign = 'center';
                cFreqCtx.fillText(label, xPos, centerY - height - 4);
            };

            const spacing = 45;
            const fcX = w / 2;
            
            drawSpike(fcX, 85, 'fc');
            if (commMode === 'am') {
                const sbHeight = 85 * (commIdx / 2);
                drawSpike(fcX - spacing, sbHeight, 'fc-fm');
                drawSpike(fcX + spacing, sbHeight, 'fc+fm');
            } else {
                drawSpike(fcX - spacing, 55, 'fc-fm');
                drawSpike(fcX + spacing, 55, 'fc+fm');
                drawSpike(fcX - 2 * spacing, 25, 'fc-2fm');
                drawSpike(fcX + 2 * spacing, 25, 'fc+2fm');
            }
        }
        else if (activeTabName === 'transforms' && splCtx && trTimeCtx) {
            const w = splCtx.canvas.width;
            const h = splCtx.canvas.height;
            splCtx.clearRect(0, 0, w, h);
            trTimeCtx.clearRect(0, 0, w, h);

            const centerY = h / 2;
            const splX = w / 2;

            const drawGrid = (ctx, xCenter) => {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                ctx.strokeStyle = axisColor;
                ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
                if (xCenter) {
                    ctx.beginPath(); ctx.moveTo(xCenter, 0); ctx.lineTo(xCenter, h); ctx.stroke();
                }
            };
            drawGrid(splCtx, splX);
            drawGrid(trTimeCtx, null);

            // A. Draw Pole-Zero s-Plane coordinate points (σ, ω)
            const mapX = splX + lapSigma * 40;
            const mapY = centerY - lapOmega * 15;

            const drawPole = (px, py) => {
                splCtx.strokeStyle = isLight ? '#dc2626' : 'var(--error)';
                splCtx.lineWidth = 2.5;
                splCtx.beginPath();
                splCtx.moveTo(px - 6, py - 6); splCtx.lineTo(px + 6, py + 6);
                splCtx.moveTo(px + 6, py - 6); splCtx.lineTo(px - 6, py + 6);
                splCtx.stroke();
            };
            drawPole(mapX, mapY);
            if (lapOmega > 0) {
                drawPole(mapX, centerY + (centerY - mapY));
            }

            // B. Draw corresponding transient time domain h(t) = exp(σ*t) * cos(ω*t)
            trTimeCtx.beginPath();
            trTimeCtx.strokeStyle = isLight ? '#059669' : 'var(--green)';
            trTimeCtx.lineWidth = 2.5;

            for (let x = 0; x < w; x++) {
                const t = (x / w) * 3;
                const decay = Math.exp(lapSigma * t);
                const oscillation = Math.cos(lapOmega * 2 * Math.PI * t);
                const val = decay * oscillation;

                const py = centerY - val * 70;
                if (x === 0) trTimeCtx.moveTo(x, py);
                else trTimeCtx.lineTo(x, py);
            }
            trTimeCtx.stroke();
        }
        else if (activeTabName === 'matrix' && matCtx) {
            const w = matrixCanvas.width;
            const h = matrixCanvas.height;
            matCtx.clearRect(0, 0, w, h);

            const centerX = w / 2;
            const centerY = h / 2;
            const scale = 40;

            matCtx.strokeStyle = gridColor;
            matCtx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) { matCtx.beginPath(); matCtx.moveTo(x, 0); matCtx.lineTo(x, h); matCtx.stroke(); }
            for (let y = 0; y < h; y += 30) { matCtx.beginPath(); matCtx.moveTo(0, y); matCtx.lineTo(w, y); matCtx.stroke(); }

            matCtx.strokeStyle = axisColor;
            matCtx.lineWidth = 1.2;
            matCtx.beginPath(); matCtx.moveTo(0, centerY); matCtx.lineTo(w, centerY); matCtx.stroke();
            matCtx.beginPath(); matCtx.moveTo(centerX, 0); matCtx.lineTo(centerX, h); matCtx.stroke();

            const rad = (matTheta * Math.PI) / 180;
            const a = matSx * Math.cos(rad);
            const b = -matSy * Math.sin(rad);
            const c = matSx * Math.sin(rad);
            const d = matSy * Math.cos(rad);

            const drawVector = (tx, ty, color) => {
                matCtx.save();
                matCtx.shadowBlur = 6;
                matCtx.shadowColor = color;
                matCtx.strokeStyle = color;
                matCtx.lineWidth = 3.0;

                const destX = centerX + tx * scale;
                const destY = centerY - ty * scale;

                matCtx.beginPath();
                matCtx.moveTo(centerX, centerY);
                matCtx.lineTo(destX, destY);
                matCtx.stroke();
                matCtx.restore();
            };

            drawVector(a, c, isLight ? '#d97706' : '#f59e0b');
            drawVector(b, d, isLight ? '#4f46e5' : '#6366f1');

            matCtx.fillStyle = isLight ? 'rgba(8, 145, 178, 0.12)' : 'rgba(0, 212, 255, 0.08)';
            matCtx.strokeStyle = isLight ? '#0891b2' : '#00d4ff';
            matCtx.lineWidth = 2.0;

            matCtx.beginPath();
            matCtx.moveTo(centerX, centerY);
            matCtx.lineTo(centerX + a * scale, centerY - c * scale);
            matCtx.lineTo(centerX + (a + b) * scale, centerY - (c + d) * scale);
            matCtx.lineTo(centerX + b * scale, centerY - d * scale);
            matCtx.closePath();
            matCtx.fill();
            matCtx.stroke();
        }

        mathAnimId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
};

export const unmount = () => {
    if (mathAnimId) {
        cancelAnimationFrame(mathAnimId);
        mathAnimId = null;
    }
    if (mathResizeHandler) {
        window.removeEventListener('resize', mathResizeHandler);
        mathResizeHandler = null;
    }
};
