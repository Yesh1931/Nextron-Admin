/**
 * Nextron - Basic Signals, Virtual Oscilloscope & Fourier Synthesis View
 */

export const render = async () => {
    return `
        <style>
            .ch1-btn.active {
                background: linear-gradient(135deg, #10b981, #059669) !important;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.4) !important;
                border-color: transparent !important;
                color: #fff !important;
            }
            .ch2-btn.active {
                background: linear-gradient(135deg, #f59e0b, #d97706) !important;
                box-shadow: 0 0 10px rgba(245, 158, 11, 0.4) !important;
                border-color: transparent !important;
                color: #fff !important;
            }
            /* Custom glowing slider thumbs matching channel color */
            .slider-ch1::-webkit-slider-thumb {
                background: #10b981 !important;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.8) !important;
            }
            .slider-ch2::-webkit-slider-thumb {
                background: #f59e0b !important;
                box-shadow: 0 0 10px rgba(245, 158, 11, 0.8) !important;
            }
            
            .lab-selector-tabs {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 8px;
            }
            .lab-tab-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 8px 16px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                border-radius: var(--border-radius-sm);
                transition: all 0.3s ease;
            }
            .lab-tab-btn:hover {
                color: var(--text-normal);
                background: rgba(255, 255, 255, 0.05);
            }
            .lab-tab-btn.active {
                color: #fff;
                background: linear-gradient(135deg, var(--accent-purple), var(--accent-secondary));
                box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
            }

            /* Styling for scrollbar track in control-panel */
            .control-panel::-webkit-scrollbar {
                width: 6px;
            }
            .control-panel::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 4px;
            }
            .control-panel::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.12);
                border-radius: 4px;
            }
            .control-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.25);
            }
        </style>

        <div class="simulator-container fade-in">
            <!-- Back navigation header -->
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <a href="#/concepts" class="btn btn-secondary" style="padding: 8px 16px;">
                    <i data-lucide="arrow-left"></i> Back to Syllabus
                </a>
                <span class="concept-card-category" style="color: var(--accent-secondary); font-size: 0.95rem; font-weight: bold; margin-bottom: 0;">
                    Sector 05: Signal Processing
                </span>
            </div>
            
            <!-- Top Lab switching tabs -->
            <div class="lab-selector-tabs">
                <button class="lab-tab-btn active" id="btn-select-scope">Lab 1: Dual-Channel Oscilloscope</button>
                <button class="lab-tab-btn" id="btn-select-fourier">Lab 2: Fourier Waveform Synthesis</button>
            </div>

            <!-- LAB 1: OSCILLOSCOPE & FFT -->
            <div id="scope-lab-section">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>Virtual Signals Generator & Oscilloscope Laboratory</h2>
                    <p>Synthesize electrical waveforms, enable multi-channel comparisons, and convert signals from the time domain to the FFT frequency spectrum.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 480px; padding: 12px; background: #010409;">
                            <div class="signals-visual-grid" style="height: 100%;">
                                <!-- Time Domain Screen -->
                                <div style="position: relative; height: 100%;">
                                    <div class="visualizer-labels" style="background: rgba(1, 4, 9, 0.85); border-color: rgba(16, 185, 129, 0.3);">
                                        <span class="status-indicator completed" style="background: #10b981; box-shadow: 0 0 8px #10b981;"></span> TIME DOMAIN (OSCILLOSCOPE)
                                    </div>
                                    <canvas id="oscilloscope-canvas" class="visualizer-canvas oscilloscope-canvas" style="border-radius: var(--border-radius-sm); border: 1px solid rgba(16, 185, 129, 0.15);"></canvas>
                                </div>
                                
                                <!-- Frequency Domain Screen -->
                                <div style="position: relative; height: 100%;">
                                    <div class="visualizer-labels" style="background: rgba(1, 4, 9, 0.85); border-color: rgba(99, 102, 241, 0.3);">
                                        <span class="status-indicator completed" style="background: #6366f1; box-shadow: 0 0 8px #6366f1;"></span> FREQUENCY SPECTRUM (FFT ANALYZER)
                                    </div>
                                    <canvas id="fft-canvas" class="visualizer-canvas oscilloscope-canvas" style="border-radius: var(--border-radius-sm); border: 1px solid rgba(99, 102, 241, 0.15);"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card explanation-panel">
                            <div class="explanation-tabs">
                                <button class="tab-btn active" data-tab="scope-walkthrough">Lab Experiments</button>
                                <button class="tab-btn" data-tab="scope-theory">Fourier Mathematics</button>
                                <button class="tab-btn" data-tab="scope-observations"><i data-lucide="edit-3" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Observation Log</button>
                            </div>
                            
                            <div class="tab-content active" id="tab-scope-walkthrough">
                                <h3>Oscilloscope Laboratory Exercises</h3>
                                <p>Follow these procedures to analyze time and frequency characteristics:</p>
                                <ul>
                                    <li><strong>Experiment 1: Waveforms and FFT Cursors</strong> - Select **Sine Wave**. Drag the **Frequency** slider up to 150Hz. Notice how the waves bunch together in the top Time Domain window. Look at the lower **FFT window**—the single purple peak moves right, showing that a high frequency sine wave is mapped to a single frequency spike.</li>
                                    <li><strong>Experiment 2: Compare Dual Signals</strong> - Toggle **Enable Channel 2 (CH2)** to **On**. Adjust the Phase of CH2 to 180°. Notice the secondary yellow wave is completely out of phase. Adding these two signals together would result in perfect destructive cancellation!</li>
                                    <li><strong>Experiment 3: Square Wave Harmonic Spectra</strong> - Select the **Square Wave**. Observe that the FFT window no longer contains a single peak. Instead, it displays a series of decaying peaks at **odd harmonics** ($f_0$, $3f_0$, $5f_0$, $7f_0$). This shows that a perfect square wave is built by summing infinite high-frequency sine waves!</li>
                                </ul>
                            </div>
                            
                            <div class="tab-content" id="tab-scope-theory">
                                <h3>Fourier Analysis & Trigonometry</h3>
                                <p>Every time-varying electrical signal can be analyzed in two distinct domains:</p>
                                <ol>
                                    <li><strong>Time Domain:</strong> Displays signal amplitude over time, $f(t)$. Visualized on standard laboratory oscilloscopes.</li>
                                    <li><strong>Frequency Domain:</strong> Displays the energy contained in each constituent frequency wave channel. Visualized using a **Fourier Transform**.</li>
                                </ol>
                                <p><strong>Fourier Theorem:</strong> Joseph Fourier proved that any periodic wave can be reconstructed by adding together sinusoids of different amplitudes and frequencies. For example, a **Square Wave** is represented mathematically by:</p>
                                $$f(t) = \\frac{4}{\\pi} \\sum_{n=1,3,5,\\dots}^{\\infty} \\frac{\\sin(2\\pi \\cdot n \\cdot f_0 \\cdot t)}{n}$$
                            </div>

                            <div class="tab-content" id="tab-scope-observations">
                                <h3 style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                    <span>Oscilloscope Lab Notes</span>
                                    <button class="btn btn-secondary" id="btn-scope-log-capture" style="padding:6px 12px; font-size:0.75rem; display:flex; align-items:center; gap:6px; border-color:var(--accent-secondary); color:var(--accent-secondary);">
                                        <i data-lucide="camera" style="width:12px;height:12px;"></i> Capture Current State
                                    </button>
                                </h3>
                                <p style="font-size:0.85rem; margin-bottom:12px; color:var(--text-secondary);">
                                    Freeze the screen first to capture exact amplitudes and frequencies, then click <strong>Capture Current State</strong> to save your observation parameters!
                                </p>
                                
                                <div style="max-height: 250px; overflow-y: auto; margin-bottom: 16px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.2);">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;" id="scope-observations-table">
                                        <thead>
                                            <tr style="border-bottom: 1px solid var(--border-color); background: rgba(255,255,255,0.03); text-align: left;">
                                                <th style="padding: 8px 10px; color: var(--accent-purple);">Timestamp</th>
                                                <th style="padding: 8px 10px; color: #10b981;">Channel 1 (CH1)</th>
                                                <th style="padding: 8px 10px; color: #f59e0b;">Channel 2 (CH2)</th>
                                                <th style="padding: 8px 10px; color: var(--text-normal);">Observations / Comments</th>
                                                <th style="padding: 8px 10px; text-align: center; color: var(--danger);">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="scope-observations-body">
                                            <tr id="scope-no-observations-row">
                                                <td colspan="5" style="padding: 24px; text-align: center; color: var(--text-muted); font-style: italic;">
                                                    No observations captured yet. Press "Freeze Screen" above, adjust sliders, and click "Capture Current State" to record a log entry!
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn btn-secondary" id="btn-scope-clear-observations" style="flex: 1; padding: 8px 12px; font-size: 0.8rem;">
                                        <i data-lucide="trash-2" style="width:14px;height:14px;margin-right:4px;display:inline-block;vertical-align:middle;"></i> Clear All Logs
                                    </button>
                                    <button class="btn btn-primary" id="btn-scope-export-observations" style="flex: 1; padding: 8px 12px; font-size: 0.8rem;">
                                        <i data-lucide="download" style="width:14px;height:14px;margin-right:4px;display:inline-block;vertical-align:middle;"></i> Export Lab Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel" style="display: flex; flex-direction: column; gap: 16px; padding-bottom: 40px;">
                        <!-- Channel 1 Controls Card -->
                        <div class="glass-card" style="padding: 18px 20px; border: 1px solid rgba(16, 185, 129, 0.12); transition: border-color 0.3s ease;">
                            <h3 class="panel-section-title" style="color: #10b981; border-bottom: 1px solid rgba(16, 185, 129, 0.15); padding-bottom: 8px; margin-bottom: 12px; font-size: 1.05rem;"><i data-lucide="activity"></i> Channel 1 (CH1 - Green)</h3>
                            
                            <div class="slider-group" style="margin-bottom: 14px;">
                                <span class="slider-name" style="font-size: 0.8rem; font-weight: 600;">Waveform Shape</span>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 4px;">
                                    <button class="toggle-btn ch1-btn active" data-shape-ch1="sine" style="font-size: 0.75rem; padding: 6px 10px;">Sine</button>
                                    <button class="toggle-btn ch1-btn" data-shape-ch1="square" style="font-size: 0.75rem; padding: 6px 10px;">Square</button>
                                    <button class="toggle-btn ch1-btn" data-shape-ch1="triangle" style="font-size: 0.75rem; padding: 6px 10px;">Triangle</button>
                                    <button class="toggle-btn ch1-btn" data-shape-ch1="sawtooth" style="font-size: 0.75rem; padding: 6px 10px;">Sawtooth</button>
                                </div>
                            </div>
                            
                            <div class="slider-group" style="margin-bottom: 14px;">
                                <div class="slider-label-row" style="font-size: 0.8rem;">
                                    <span class="slider-name">Amplitude (Vp)</span>
                                    <span class="slider-val" id="val-amp-ch1" style="color: #10b981;">2.0 V</span>
                                </div>
                                <input type="range" class="slider-input slider-ch1" id="slider-amp-ch1" min="0.5" max="4.0" step="0.1" value="2.0" style="background: rgba(16, 185, 129, 0.1);">
                            </div>
                            
                            <div class="slider-group" style="margin-bottom: 14px;">
                                <div class="slider-label-row" style="font-size: 0.8rem;">
                                    <span class="slider-name">Frequency (Hz)</span>
                                    <span class="slider-val" id="val-freq-ch1" style="color: #10b981;">60 Hz</span>
                                </div>
                                <input type="range" class="slider-input slider-ch1" id="slider-freq-ch1" min="10" max="200" step="5" value="60" style="background: rgba(16, 185, 129, 0.1);">
                            </div>
                            
                            <div class="slider-group">
                                <div class="slider-label-row" style="font-size: 0.8rem;">
                                    <span class="slider-name">Phase Shift (°)</span>
                                    <span class="slider-val" id="val-phase-ch1" style="color: #10b981;">0°</span>
                                </div>
                                <input type="range" class="slider-input slider-ch1" id="slider-phase-ch1" min="-180" max="180" step="10" value="0" style="background: rgba(16, 185, 129, 0.1);">
                            </div>
                        </div>
                        
                        <!-- Channel 2 Enable Card -->
                        <div class="glass-card" style="padding: 18px 20px; border: 1px solid rgba(245, 158, 11, 0.12); transition: border-color 0.3s ease;">
                            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(245, 158, 11, 0.15); padding-bottom: 8px; margin-bottom: 12px;">
                                <h3 class="panel-section-title" style="color: #f59e0b; border-bottom: none; padding-bottom: 0; margin-bottom: 0; display: flex; align-items: center; gap: 6px; font-size: 1.05rem;">
                                    <i data-lucide="activity"></i> Channel 2 (CH2 - Yellow)
                                </h3>
                                <button class="toggle-btn ch2-btn" id="btn-toggle-ch2" style="max-width: 50px; padding: 4px 8px; font-size: 0.7rem; border-radius: var(--border-radius-sm);">OFF</button>
                            </div>
                            
                            <div id="ch2-controls-wrapper" style="display: none; flex-direction: column; gap: 14px;">
                                <div class="slider-group">
                                    <span class="slider-name" style="font-size: 0.8rem; font-weight: 600;">Waveform Shape</span>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 4px;">
                                        <button class="toggle-btn ch2-btn active" data-shape-ch2="sine" style="font-size: 0.75rem; padding: 6px 10px;">Sine</button>
                                        <button class="toggle-btn ch2-btn" data-shape-ch2="square" style="font-size: 0.75rem; padding: 6px 10px;">Square</button>
                                        <button class="toggle-btn ch2-btn" data-shape-ch2="triangle" style="font-size: 0.75rem; padding: 6px 10px;">Triangle</button>
                                        <button class="toggle-btn ch2-btn" data-shape-ch2="sawtooth" style="font-size: 0.75rem; padding: 6px 10px;">Sawtooth</button>
                                    </div>
                                </div>
                                
                                <div class="slider-group">
                                    <div class="slider-label-row" style="font-size: 0.8rem;">
                                        <span class="slider-name">Amplitude (Vp)</span>
                                        <span class="slider-val" id="val-amp-ch2" style="color: #f59e0b;">1.5 V</span>
                                    </div>
                                    <input type="range" class="slider-input slider-ch2" id="slider-amp-ch2" min="0.5" max="4.0" step="0.1" value="1.5" style="background: rgba(245, 158, 11, 0.1);">
                                </div>
                                
                                <div class="slider-group">
                                    <div class="slider-label-row" style="font-size: 0.8rem;">
                                        <span class="slider-name">Frequency (Hz)</span>
                                        <span class="slider-val" id="val-freq-ch2" style="color: #f59e0b;">60 Hz</span>
                                    </div>
                                    <input type="range" class="slider-input slider-ch2" id="slider-freq-ch2" min="10" max="200" step="5" value="60" style="background: rgba(245, 158, 11, 0.1);">
                                </div>
                                
                                <div class="slider-group">
                                    <div class="slider-label-row" style="font-size: 0.8rem;">
                                        <span class="slider-name">Phase Shift (°)</span>
                                        <span class="slider-val" id="val-phase-ch2" style="color: #f59e0b;">90°</span>
                                    </div>
                                    <input type="range" class="slider-input slider-ch2" id="slider-phase-ch2" min="-180" max="180" step="10" value="90" style="background: rgba(245, 158, 11, 0.1);">
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 18px 20px; border: 1px solid rgba(255, 255, 255, 0.05);">
                            <h3 class="panel-section-title" style="font-size: 1.05rem; padding-bottom: 8px; margin-bottom: 12px;"><i data-lucide="compass"></i> Laboratory Actions</h3>
                            <button id="btn-signals-pause" class="btn btn-secondary" style="width: 100%; margin-bottom: 10px; padding: 10px; font-size: 0.85rem; border-color: rgba(245, 158, 11, 0.4); color: #f59e0b; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i data-lucide="pause" style="width:14px;height:14px;"></i> <span>Freeze Screen</span>
                            </button>
                            <button id="btn-signals-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 10px; padding: 10px; font-size: 0.85rem;">
                                <i data-lucide="refresh-cw"></i> Reset Channels
                            </button>
                            <a href="#/quiz" class="btn btn-primary" style="width: 100%; padding: 10px; font-size: 0.85rem;">
                                <i data-lucide="award"></i> Enter Sector Quiz
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LAB 2: FOURIER WAVEFORM SYNTHESIS -->
            <div id="fourier-lab-section" style="display: none;">
                <div class="section-title" style="margin-top: 0; margin-bottom: 24px; text-align: left;">
                    <h2>Fourier Waveform Synthesis Laboratory</h2>
                    <p>Assemble harmonics one by one. Observe how simple sinusoids combine to generate complex rectangular shapes, illustrating the iconic <strong>Gibbs Phenomenon</strong> ripples.</p>
                </div>
                
                <div class="simulator-layout">
                    <div class="simulator-main">
                        <div class="visualizer-wrapper" style="height: 480px; padding: 12px; background: #010409;">
                            <div class="signals-visual-grid" style="height: 100%;">
                                <!-- Constituents Screen -->
                                <div style="position: relative; height: 100%;">
                                    <div class="visualizer-labels" style="background: rgba(1, 4, 9, 0.85); border-color: rgba(99, 102, 241, 0.3);">
                                        <span class="status-indicator completed" style="background: #6366f1;"></span> CONSTITUENT HARMONICS (FIRST 4 SINES)
                                    </div>
                                    <canvas id="fourier-harmonics-canvas" class="visualizer-canvas oscilloscope-canvas" style="border-radius: var(--border-radius-sm); border: 1px solid rgba(99, 102, 241, 0.15);"></canvas>
                                </div>
                                
                                <!-- Composite Screen -->
                                <div style="position: relative; height: 100%;">
                                    <div class="visualizer-labels" style="background: rgba(1, 4, 9, 0.85); border-color: rgba(6, 182, 212, 0.3);">
                                        <span class="status-indicator completed" style="background: #06b6d4;"></span> SYNTHESIZED COMPOSITE WAVEFORM
                                    </div>
                                    <canvas id="fourier-composite-canvas" class="visualizer-canvas oscilloscope-canvas" style="border-radius: var(--border-radius-sm); border: 1px solid rgba(6, 182, 212, 0.15);"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card explanation-panel">
                            <div class="explanation-tabs">
                                <button class="tab-btn active" data-tab="fourier-walkthrough">Synthesis Steps</button>
                                <button class="tab-btn" data-tab="fourier-gibbs">Gibbs Phenomenon</button>
                                <button class="tab-btn" data-tab="fourier-observations"><i data-lucide="edit-3" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Observation Log</button>
                            </div>
                            
                            <div class="tab-content active" id="tab-fourier-walkthrough">
                                <h3>Fourier Synthesis Experiments</h3>
                                <p>Recreate waveforms using sinusoidal increments:</p>
                                <ul>
                                    <li><strong>Experiment 1: Square Wave Harmonics</strong> - Select **Square Wave**. Set **Harmonics Count (N)** to 1. Notice the composite is a simple large sine. Increase N to 3. Notice the corners begin to flatten. Drag N to 25. The composite is now a clean rectangular wave, built solely of 25 sines!</li>
                                    <li><strong>Experiment 2: Triangle Harmonic Smoothness</strong> - Select **Triangle Wave**. Note that the harmonic coefficients decay as $\\frac{1}{n^2}$. Since high frequencies decay so quickly, a triangle wave looks extremely clean with only $N=3$ harmonics!</li>
                                    <li><strong>Experiment 3: Gibb's Peak Ripples</strong> - Switch back to **Square Wave** and set N to 25. Note the sharp edges of the square transition have distinct pulsating orange circles at the corners. This represents mathematical overshoot ripple!</li>
                                </ul>
                            </div>
                            
                            <div class="tab-content" id="tab-fourier-gibbs">
                                <h3>The Gibbs Phenomenon</h3>
                                <p>Named after Willard Gibbs, this describes the mathematical overshoot that occurs when trying to reconstruct a discontinuous waveform (like a square step) using a finite sum of continuous sinusoidal harmonics.</p>
                                <ul>
                                    <li><strong>Discontinuity Limit:</strong> No matter how many harmonics ($N$) you add (even as $N \\to \\infty$), the overshoot peak at the sharp transition edge does not disappear.</li>
                                    <li><strong>Overshoot height:</strong> The peak overshoot settles at approximately <strong>8.95%</strong> of the step height.</li>
                                    <li>As $N$ increases, the ripples bunch together closer to the transition line, but the peak height remains constant!</li>
                                </ul>
                            </div>

                            <div class="tab-content" id="tab-fourier-observations">
                                <h3 style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                    <span>Fourier Synthesis Notes</span>
                                    <button class="btn btn-secondary" id="btn-fourier-log-capture" style="padding:6px 12px; font-size:0.75rem; display:flex; align-items:center; gap:6px; border-color:var(--accent-secondary); color:var(--accent-secondary);">
                                        <i data-lucide="camera" style="width:12px;height:12px;"></i> Capture Current State
                                    </button>
                                </h3>
                                <p style="font-size:0.85rem; margin-bottom:12px; color:var(--text-secondary);">
                                    Freeze the screen first, synthesize custom waves, and log them here. Analyze Gibbs phenomenon ripple values and harmonic additions.
                                </p>
                                
                                <div style="max-height: 250px; overflow-y: auto; margin-bottom: 16px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.2);">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;" id="fourier-observations-table">
                                        <thead>
                                            <tr style="border-bottom: 1px solid var(--border-color); background: rgba(255,255,255,0.03); text-align: left;">
                                                <th style="padding: 8px 10px; color: var(--accent-purple);">Timestamp</th>
                                                <th style="padding: 8px 10px; color: var(--accent-secondary);">Target Shape</th>
                                                <th style="padding: 8px 10px; color: #10b981;">Harmonics (N)</th>
                                                <th style="padding: 8px 10px; color: #06b6d4;">Fundamental (f0)</th>
                                                <th style="padding: 8px 10px; color: var(--text-normal);">Overshoot / Observations</th>
                                                <th style="padding: 8px 10px; text-align: center; color: var(--danger);">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="fourier-observations-body">
                                            <tr id="fourier-no-observations-row">
                                                <td colspan="6" style="padding: 24px; text-align: center; color: var(--text-muted); font-style: italic;">
                                                    No observations captured yet. Press "Freeze Screen" above, adjust sliders, and click "Capture Current State" to record a log entry!
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn btn-secondary" id="btn-fourier-clear-observations" style="flex: 1; padding: 8px 12px; font-size: 0.8rem;">
                                        <i data-lucide="trash-2" style="width:14px;height:14px;margin-right:4px;display:inline-block;vertical-align:middle;"></i> Clear All Logs
                                    </button>
                                    <button class="btn btn-primary" id="btn-fourier-export-observations" style="flex: 1; padding: 8px 12px; font-size: 0.8rem;">
                                        <i data-lucide="download" style="width:14px;height:14px;margin-right:4px;display:inline-block;vertical-align:middle;"></i> Export Lab Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-panel">
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="sliders"></i> Synthesis Controls</h3>
                            
                            <!-- Target Shape -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <span class="slider-name" style="font-size: 0.85rem; font-weight: 600;">Target Waveform</span>
                                <div style="display: flex; gap: 8px; margin-top: 6px;">
                                    <button class="toggle-btn active" id="btn-fourier-shape-square" style="flex: 1; padding: 8px;">Square</button>
                                    <button class="toggle-btn" id="btn-fourier-shape-triangle" style="flex: 1; padding: 8px;">Triangle</button>
                                    <button class="toggle-btn" id="btn-fourier-shape-sawtooth" style="flex: 1; padding: 8px;">Sawtooth</button>
                                </div>
                            </div>
                            
                            <!-- Harmonics Slider -->
                            <div class="slider-group" style="margin-bottom: 20px;">
                                <div class="slider-label-row">
                                    <span class="slider-name" style="color: var(--accent-purple); font-weight: bold;">Harmonics Count (N)</span>
                                    <span class="slider-val" id="val-fourier-n" style="color: var(--accent-purple); font-weight: bold;">7</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-fourier-n" min="1" max="25" step="1" value="7" style="background: rgba(99, 102, 241, 0.15);">
                            </div>
                            
                            <!-- Fundamental Freq -->
                            <div class="slider-group" style="margin-bottom: 24px;">
                                <div class="slider-label-row">
                                    <span class="slider-name">Fundamental Freq (f0)</span>
                                    <span class="slider-val" id="val-fourier-f0">4 Hz</span>
                                </div>
                                <input type="range" class="slider-input" id="slider-fourier-f0" min="1" max="10" step="1" value="4">
                            </div>
                            
                            <h3 class="panel-section-title" style="margin-top: 20px;"><i data-lucide="gauge"></i> Ripple Telemetry</h3>
                            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--border-radius-sm);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Harmonic Terms Summed:</span>
                                    <span id="read-fourier-terms" style="color: #fff; font-weight: bold;">4 terms</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary);">Gibbs Ripple Height:</span>
                                    <span id="read-fourier-overshoot" style="color: var(--warning); font-weight: bold;">~8.95% Peak</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card" style="padding: 24px;">
                            <h3 class="panel-section-title"><i data-lucide="compass"></i> Laboratory Actions</h3>
                            <button id="btn-fourier-pause" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px; border-color: rgba(245, 158, 11, 0.4); color: #f59e0b; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i data-lucide="pause" style="width:14px;height:14px;"></i> <span>Freeze Screen</span>
                            </button>
                            <button id="btn-fourier-reset" class="btn btn-secondary" style="width: 100%; margin-bottom: 12px;">
                                <i data-lucide="refresh-cw"></i> Reset Synthesis
                            </button>
                            <a href="#/quiz" class="btn btn-primary" style="width: 100%;">
                                <i data-lucide="award"></i> Enter Sector Quiz
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Canvas animation loops
let animationFrameId = null;
let activeTabHandlers = [];
let activeShapeCh1Handler = null;
let activeShapeCh2Handler = null;
let isAnimationPaused = false;

export const mount = () => {
    // Top selector tabs
    const btnSelectScope = document.getElementById('btn-select-scope');
    const btnSelectFourier = document.getElementById('btn-select-fourier');
    
    const scopeSection = document.getElementById('scope-lab-section');
    const fourierSection = document.getElementById('fourier-lab-section');
    
    let activeLab = 'scope'; // scope or fourier

    const handleLabSwitch = (lab) => {
        activeLab = lab;
        if (lab === 'scope') {
            btnSelectScope.classList.add('active');
            btnSelectFourier.classList.remove('active');
            scopeSection.style.display = 'block';
            fourierSection.style.display = 'none';
        } else {
            btnSelectFourier.classList.add('active');
            btnSelectScope.classList.remove('active');
            scopeSection.style.display = 'none';
            fourierSection.style.display = 'block';
        }
        triggerResize();
    };

    btnSelectScope.addEventListener('click', () => handleLabSwitch('scope'));
    btnSelectFourier.addEventListener('click', () => handleLabSwitch('fourier'));

    // Sub tabs
    const initSubTabs = (tabContainerId) => {
        const parent = document.getElementById(tabContainerId);
        if (!parent) return;
        const tabButtons = parent.querySelectorAll('.tab-btn');
        const tabContents = parent.querySelectorAll('.tab-content');
        
        const handler = (e) => {
            const targetTab = e.currentTarget.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            e.currentTarget.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        };
        tabButtons.forEach(btn => btn.addEventListener('click', handler));
        activeTabHandlers.push({ buttons: tabButtons, handler });
    };

    initSubTabs('scope-lab-section');
    initSubTabs('fourier-lab-section');

    // 1. LAB 1: Dual Scope Initialization
    const oCanvas = document.getElementById('oscilloscope-canvas');
    const fCanvas = document.getElementById('fft-canvas');
    const oCtx = oCanvas.getContext('2d');
    const fCtx = fCanvas.getContext('2d');
    
    let oWidth = oCanvas.width = oCanvas.parentElement.clientWidth;
    let oHeight = oCanvas.height = 220;
    let fWidth = fCanvas.width = fCanvas.parentElement.clientWidth;
    let fHeight = fCanvas.height = 180;

    // 2. LAB 2: Fourier Synthesis Canvas Initialization
    const hCanvas = document.getElementById('fourier-harmonics-canvas');
    const cCanvas = document.getElementById('fourier-composite-canvas');
    const hCtx = hCanvas.getContext('2d');
    const cCtx = cCanvas.getContext('2d');

    let hWidth = hCanvas.width = hCanvas.parentElement.clientWidth;
    let cWidth = cCanvas.width = cCanvas.parentElement.clientWidth;
    let hHeight = hCanvas.height = 220;
    let cHeight = cCanvas.height = 220;

    const handleResize = () => {
        if (activeLab === 'scope') {
            const width = oCanvas.parentElement.clientWidth;
            oWidth = oCanvas.width = width;
            fWidth = fCanvas.width = width;
            oHeight = oCanvas.height = 220;
            fHeight = fCanvas.height = 180;
        } else {
            const width = hCanvas.parentElement.clientWidth;
            hWidth = hCanvas.width = width;
            cWidth = cCanvas.width = width;
            hHeight = hCanvas.height = 220;
            cHeight = cCanvas.height = 220;
        }
    };
    window.addEventListener('resize', handleResize);
    oCanvas._resizeHandler = handleResize;

    const triggerResize = () => {
        setTimeout(handleResize, 50);
    };

    // LAB 1 Param state
    let ch1 = { shape: 'sine', amp: 2.0, freq: 60, phase: 0 };
    let ch2 = { enabled: false, shape: 'sine', amp: 1.5, freq: 60, phase: 90 };

    const sliderAmpCh1 = document.getElementById('slider-amp-ch1');
    const sliderFreqCh1 = document.getElementById('slider-freq-ch1');
    const sliderPhaseCh1 = document.getElementById('slider-phase-ch1');
    
    const valAmpCh1 = document.getElementById('val-amp-ch1');
    const valFreqCh1 = document.getElementById('val-freq-ch1');
    const valPhaseCh1 = document.getElementById('val-phase-ch1');

    const shapeCh1Buttons = document.querySelectorAll('[data-shape-ch1]');
    activeShapeCh1Handler = (e) => {
        shapeCh1Buttons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        ch1.shape = e.currentTarget.getAttribute('data-shape-ch1');
    };
    shapeCh1Buttons.forEach(btn => btn.addEventListener('click', activeShapeCh1Handler));

    function updateCH1() {
        ch1.amp = parseFloat(sliderAmpCh1.value);
        ch1.freq = parseInt(sliderFreqCh1.value);
        ch1.phase = parseInt(sliderPhaseCh1.value);
        valAmpCh1.textContent = `${ch1.amp.toFixed(1)} V`;
        valFreqCh1.textContent = `${ch1.freq} Hz`;
        valPhaseCh1.textContent = `${ch1.phase}°`;
    }
    sliderAmpCh1.addEventListener('input', updateCH1);
    sliderFreqCh1.addEventListener('input', updateCH1);
    sliderPhaseCh1.addEventListener('input', updateCH1);

    const btnToggleCh2 = document.getElementById('btn-toggle-ch2');
    const ch2Wrapper = document.getElementById('ch2-controls-wrapper');
    
    btnToggleCh2.addEventListener('click', () => {
        ch2.enabled = !ch2.enabled;
        if (ch2.enabled) {
            btnToggleCh2.classList.add('active');
            btnToggleCh2.textContent = 'ON';
            ch2Wrapper.style.display = 'flex';
        } else {
            btnToggleCh2.classList.remove('active');
            btnToggleCh2.textContent = 'OFF';
            ch2Wrapper.style.display = 'none';
        }
    });

    const sliderAmpCh2 = document.getElementById('slider-amp-ch2');
    const sliderFreqCh2 = document.getElementById('slider-freq-ch2');
    const sliderPhaseCh2 = document.getElementById('slider-phase-ch2');
    
    const valAmpCh2 = document.getElementById('val-amp-ch2');
    const valFreqCh2 = document.getElementById('val-freq-ch2');
    const valPhaseCh2 = document.getElementById('val-phase-ch2');

    const shapeCh2Buttons = document.querySelectorAll('[data-shape-ch2]');
    activeShapeCh2Handler = (e) => {
        shapeCh2Buttons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        ch2.shape = e.currentTarget.getAttribute('data-shape-ch2');
    };
    shapeCh2Buttons.forEach(btn => btn.addEventListener('click', activeShapeCh2Handler));

    function updateCH2() {
        ch2.amp = parseFloat(sliderAmpCh2.value);
        ch2.freq = parseInt(sliderFreqCh2.value);
        ch2.phase = parseInt(sliderPhaseCh2.value);
        valAmpCh2.textContent = `${ch2.amp.toFixed(1)} V`;
        valFreqCh2.textContent = `${ch2.freq} Hz`;
        valPhaseCh2.textContent = `${ch2.phase}°`;
    }
    sliderAmpCh2.addEventListener('input', updateCH2);
    sliderFreqCh2.addEventListener('input', updateCH2);
    sliderPhaseCh2.addEventListener('input', updateCH2);

    document.getElementById('btn-signals-reset').addEventListener('click', () => {
        sliderAmpCh1.value = 2.0;
        sliderFreqCh1.value = 60;
        sliderPhaseCh1.value = 0;
        sliderAmpCh2.value = 1.5;
        sliderFreqCh2.value = 60;
        sliderPhaseCh2.value = 90;
        ch2.enabled = false;
        btnToggleCh2.classList.remove('active');
        btnToggleCh2.textContent = 'OFF';
        ch2Wrapper.style.display = 'none';
        
        ch1.shape = 'sine';
        shapeCh1Buttons.forEach(btn => {
            if (btn.getAttribute('data-shape-ch1') === 'sine') btn.classList.add('active');
            else btn.classList.remove('active');
        });
        ch2.shape = 'sine';
        shapeCh2Buttons.forEach(btn => {
            if (btn.getAttribute('data-shape-ch2') === 'sine') btn.classList.add('active');
            else btn.classList.remove('active');
        });
        updateCH1();
        updateCH2();
        if (isAnimationPaused) togglePause();
    });

    updateCH1();
    updateCH2();

    // LAB 2 Param state (Fourier)
    let fourier = { shape: 'square', n: 7, f0: 4 };

    const btnFsq = document.getElementById('btn-fourier-shape-square');
    const btnFtri = document.getElementById('btn-fourier-shape-triangle');
    const btnFsaw = document.getElementById('btn-fourier-shape-sawtooth');

    const sFourN = document.getElementById('slider-fourier-n');
    const sFourF0 = document.getElementById('slider-fourier-f0');

    const vFourN = document.getElementById('val-fourier-n');
    const vFourF0 = document.getElementById('val-fourier-f0');

    const rFourTerms = document.getElementById('read-fourier-terms');
    const rFourOvershoot = document.getElementById('read-fourier-overshoot');

    const handleFourierShape = (shape) => {
        fourier.shape = shape;
        const btns = [btnFsq, btnFtri, btnFsaw];
        btns.forEach(btn => btn.classList.remove('active'));
        if (shape === 'square') {
            btnFsq.classList.add('active');
            rFourOvershoot.textContent = "~8.95% Peak Overshoot";
        } else if (shape === 'triangle') {
            btnFtri.classList.add('active');
            rFourOvershoot.textContent = "negligible (<0.1%)";
        } else {
            btnFsaw.classList.add('active');
            rFourOvershoot.textContent = "~17.8% Peak Overshoot";
        }
        updateFourier();
    };

    btnFsq.addEventListener('click', () => handleFourierShape('square'));
    btnFtri.addEventListener('click', () => handleFourierShape('triangle'));
    btnFsaw.addEventListener('click', () => handleFourierShape('sawtooth'));

    const updateFourier = () => {
        fourier.n = parseInt(sFourN.value);
        fourier.f0 = parseInt(sFourF0.value);

        vFourN.textContent = fourier.n;
        vFourF0.textContent = `${fourier.f0} Hz`;

        // Calculate mapped summed terms
        let terms = fourier.n;
        if (fourier.shape === 'square' || fourier.shape === 'triangle') {
            terms = Math.ceil(fourier.n / 2);
        }
        rFourTerms.textContent = `${terms} term${terms > 1 ? 's' : ''}`;
    };

    sFourN.addEventListener('input', updateFourier);
    sFourF0.addEventListener('input', updateFourier);

    document.getElementById('btn-fourier-reset').addEventListener('click', () => {
        sFourN.value = 7;
        sFourF0.value = 4;
        handleFourierShape('square');
        if (isAnimationPaused) togglePause();
    });

    // Wire up screen freezing toggle logic
    const btnSignalsPause = document.getElementById('btn-signals-pause');
    const btnFourierPause = document.getElementById('btn-fourier-pause');

    const togglePause = () => {
        isAnimationPaused = !isAnimationPaused;
        
        const btnStateUpdate = (btn) => {
            if (!btn) return;
            const textSpan = btn.querySelector('span');
            const icon = btn.querySelector('i');
            if (isAnimationPaused) {
                if (textSpan) textSpan.textContent = "Resume Sweep";
                btn.style.borderColor = "var(--success)";
                btn.style.color = "var(--success)";
                if (icon) {
                    icon.setAttribute('data-lucide', 'play');
                }
            } else {
                if (textSpan) textSpan.textContent = "Freeze Screen";
                btn.style.borderColor = "rgba(245, 158, 11, 0.4)";
                btn.style.color = "#f59e0b";
                if (icon) {
                    icon.setAttribute('data-lucide', 'pause');
                }
            }
        };

        btnStateUpdate(btnSignalsPause);
        btnStateUpdate(btnFourierPause);
        
        if (window.lucide) window.lucide.createIcons();
    };

    if (btnSignalsPause) btnSignalsPause.addEventListener('click', togglePause);
    if (btnFourierPause) btnFourierPause.addEventListener('click', togglePause);

    updateFourier();

    // --- OBSERVATION NOTEBOOK PERSISTENCE AND LOGIC ---
    let scopeObservations = [];
    let fourierObservations = [];

    try {
        const storedScope = localStorage.getItem('ece_scope_observations');
        if (storedScope) scopeObservations = JSON.parse(storedScope);
        
        const storedFourier = localStorage.getItem('ece_fourier_observations');
        if (storedFourier) fourierObservations = JSON.parse(storedFourier);
    } catch (e) {
        console.error("Error loading observations:", e);
    }

    const scopeObsBody = document.getElementById('scope-observations-body');
    const fourierObsBody = document.getElementById('fourier-observations-body');

    const renderScopeObservations = () => {
        if (!scopeObsBody) return;
        scopeObsBody.innerHTML = '';
        if (scopeObservations.length === 0) {
            scopeObsBody.innerHTML = `
                <tr id="scope-no-observations-row">
                    <td colspan="5" style="padding: 24px; text-align: center; color: var(--text-muted); font-style: italic;">
                        No observations captured yet. Press "Freeze Screen" above, adjust sliders, and click "Capture Current State" to record a entry!
                    </td>
                </tr>
            `;
            return;
        }

        scopeObservations.forEach((obs, idx) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 8px 10px; color: var(--accent-purple); font-weight: bold; font-family: monospace;">#${idx + 1}<br><span style="font-size:0.7rem; color:var(--text-muted);">${obs.time}</span></td>
                <td style="padding: 8px 10px; color: #10b981; font-family: monospace; font-size:0.75rem; text-transform: capitalize; line-height: 1.3;">
                    <strong>${obs.ch1Shape}</strong><br>
                    ${obs.ch1Amp}V, ${obs.ch1Freq}Hz, ${obs.ch1Phase}°
                </td>
                <td style="padding: 8px 10px; color: #f59e0b; font-family: monospace; font-size:0.75rem; text-transform: capitalize; line-height: 1.3;">
                    ${obs.ch2Enabled ? `<strong>${obs.ch2Shape}</strong><br>${obs.ch2Amp}V, ${obs.ch2Freq}Hz, ${obs.ch2Phase}°` : '<span style="color:var(--text-muted);">Disabled</span>'}
                </td>
                <td style="padding: 8px 10px;">
                    <input type="text" class="obs-note-input" data-index="${idx}" value="${obs.note || ''}" placeholder="Type observations (e.g. frozen wave peak = 2V)..." style="width: 100%; padding: 6px 10px; font-size: 0.75rem; border: 1px solid var(--border-color); border-radius: 4px; background: rgba(0,0,0,0.3); color: #fff;" />
                </td>
                <td style="padding: 8px 10px; text-align: center;">
                    <button class="btn-delete-obs" data-index="${idx}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                </td>
            `;
            scopeObsBody.appendChild(tr);
        });

        if (window.lucide) window.lucide.createIcons();
    };

    const renderFourierObservations = () => {
        if (!fourierObsBody) return;
        fourierObsBody.innerHTML = '';
        if (fourierObservations.length === 0) {
            fourierObsBody.innerHTML = `
                <tr id="fourier-no-observations-row">
                    <td colspan="6" style="padding: 24px; text-align: center; color: var(--text-muted); font-style: italic;">
                        No observations captured yet. Press "Freeze Screen" above, adjust sliders, and click "Capture Current State" to record a entry!
                    </td>
                </tr>
            `;
            return;
        }

        fourierObservations.forEach((obs, idx) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 8px 10px; color: var(--accent-purple); font-weight: bold; font-family: monospace;">#${idx + 1}<br><span style="font-size:0.7rem; color:var(--text-muted);">${obs.time}</span></td>
                <td style="padding: 8px 10px; color: var(--accent-secondary); font-family: monospace; font-size:0.75rem; font-weight: bold; text-transform: capitalize;">
                    ${obs.shape} Wave
                </td>
                <td style="padding: 8px 10px; color: #10b981; font-family: monospace; font-size:0.75rem;">
                    N = ${obs.n} (${obs.terms} terms)
                </td>
                <td style="padding: 8px 10px; color: #06b6d4; font-family: monospace; font-size:0.75rem;">
                    ${obs.f0} Hz
                </td>
                <td style="padding: 8px 10px;">
                    <input type="text" class="fourier-note-input" data-index="${idx}" value="${obs.note || ''}" placeholder="Type ripple or term observation..." style="width: 100%; padding: 6px 10px; font-size: 0.75rem; border: 1px solid var(--border-color); border-radius: 4px; background: rgba(0,0,0,0.3); color: #fff;" />
                </td>
                <td style="padding: 8px 10px; text-align: center;">
                    <button class="btn-delete-fourier-obs" data-index="${idx}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                </td>
            `;
            fourierObsBody.appendChild(tr);
        });

        if (window.lucide) window.lucide.createIcons();
    };

    // Helper to get formatted timestamp
    const getFormattedTime = () => {
        const d = new Date();
        return d.toTimeString().split(' ')[0];
    };

    // Mount listeners and dynamic handlers
    const btnScopeCapture = document.getElementById('btn-scope-log-capture');
    const btnScopeClear = document.getElementById('btn-scope-clear-observations');
    const btnScopeExport = document.getElementById('btn-scope-export-observations');

    if (btnScopeCapture) {
        btnScopeCapture.addEventListener('click', () => {
            const newObs = {
                time: getFormattedTime(),
                ch1Shape: ch1.shape,
                ch1Amp: ch1.amp.toFixed(1),
                ch1Freq: ch1.freq,
                ch1Phase: ch1.phase,
                ch2Enabled: ch2.enabled,
                ch2Shape: ch2.shape,
                ch2Amp: ch2.amp.toFixed(1),
                ch2Freq: ch2.freq,
                ch2Phase: ch2.phase,
                note: ''
            };
            scopeObservations.push(newObs);
            localStorage.setItem('ece_scope_observations', JSON.stringify(scopeObservations));
            renderScopeObservations();
            
            // Subtle visual feedback glow
            btnScopeCapture.style.boxShadow = '0 0 15px var(--accent-secondary)';
            setTimeout(() => { btnScopeCapture.style.boxShadow = 'none'; }, 300);
        });
    }

    if (btnScopeClear) {
        btnScopeClear.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all logged observations for the oscilloscope?")) {
                scopeObservations = [];
                localStorage.removeItem('ece_scope_observations');
                renderScopeObservations();
            }
        });
    }

    if (btnScopeExport) {
        btnScopeExport.addEventListener('click', () => {
            if (scopeObservations.length === 0) {
                alert("No observations to export! Add a few logs first.");
                return;
            }
            
            let txt = `============================================================\n`;
            txt += `ECE CONCEPT EXPLORER - SIGNAL LABS REPORT (OSCILLOSCOPE)\n`;
            txt += `Generated: ${new Date().toLocaleString()}\n`;
            txt += `============================================================\n\n`;
            
            scopeObservations.forEach((obs, idx) => {
                txt += `Log #${idx + 1} [Captured at ${obs.time}]:\n`;
                txt += `  - Channel 1 (Green):  Shape: ${obs.ch1Shape.toUpperCase()}, Amplitude: ${obs.ch1Amp} V, Frequency: ${obs.ch1Freq} Hz, Phase: ${obs.ch1Phase}°\n`;
                if (obs.ch2Enabled) {
                    txt += `  - Channel 2 (Yellow): Shape: ${obs.ch2Shape.toUpperCase()}, Amplitude: ${obs.ch2Amp} V, Frequency: ${obs.ch2Freq} Hz, Phase: ${obs.ch2Phase}°\n`;
                } else {
                    txt += `  - Channel 2 (Yellow): Disabled\n`;
                }
                txt += `  - Observations / Notes: ${obs.note || 'No notes entered.'}\n`;
                txt += `------------------------------------------------------------\n`;
            });
            
            const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ECE_Scope_Lab_Observations.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Fourier events
    const btnFourierCapture = document.getElementById('btn-fourier-log-capture');
    const btnFourierClear = document.getElementById('btn-fourier-clear-observations');
    const btnFourierExport = document.getElementById('btn-fourier-export-observations');

    if (btnFourierCapture) {
        btnFourierCapture.addEventListener('click', () => {
            let terms = fourier.n;
            if (fourier.shape === 'square' || fourier.shape === 'triangle') {
                terms = Math.ceil(fourier.n / 2);
            }
            let overshootText = "~8.95% Peak";
            if (fourier.shape === 'triangle') overshootText = "negligible (<0.1%)";
            else if (fourier.shape === 'sawtooth') overshootText = "~17.8% Peak";

            const newObs = {
                time: getFormattedTime(),
                shape: fourier.shape,
                n: fourier.n,
                terms: terms,
                f0: fourier.f0,
                overshoot: overshootText,
                note: ''
            };
            fourierObservations.push(newObs);
            localStorage.setItem('ece_fourier_observations', JSON.stringify(fourierObservations));
            renderFourierObservations();
            
            // Subtle visual feedback glow
            btnFourierCapture.style.boxShadow = '0 0 15px var(--accent-secondary)';
            setTimeout(() => { btnFourierCapture.style.boxShadow = 'none'; }, 300);
        });
    }

    if (btnFourierClear) {
        btnFourierClear.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all logged observations for the Fourier synthesis?")) {
                fourierObservations = [];
                localStorage.removeItem('ece_fourier_observations');
                renderFourierObservations();
            }
        });
    }

    if (btnFourierExport) {
        btnFourierExport.addEventListener('click', () => {
            if (fourierObservations.length === 0) {
                alert("No observations to export! Add a few logs first.");
                return;
            }
            
            let txt = `============================================================\n`;
            txt += `ECE CONCEPT EXPLORER - SIGNAL LABS REPORT (FOURIER SYNTHESIS)\n`;
            txt += `Generated: ${new Date().toLocaleString()}\n`;
            txt += `============================================================\n\n`;
            
            fourierObservations.forEach((obs, idx) => {
                txt += `Log #${idx + 1} [Captured at ${obs.time}]:\n`;
                txt += `  - Target Waveform: ${obs.shape.toUpperCase()} Wave\n`;
                txt += `  - Harmonics Count (N): ${obs.n} (${obs.terms} active terms)\n`;
                txt += `  - Fundamental Frequency (f0): ${obs.f0} Hz\n`;
                txt += `  - Calculated Gibbs Ripple Overshoot: ${obs.overshoot}\n`;
                txt += `  - Observations / Notes: ${obs.note || 'No notes entered.'}\n`;
                txt += `------------------------------------------------------------\n`;
            });
            
            const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ECE_Fourier_Lab_Observations.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Delegation listeners for tables
    if (scopeObsBody) {
        scopeObsBody.addEventListener('input', (e) => {
            if (e.target.classList.contains('obs-note-input')) {
                const idx = parseInt(e.target.getAttribute('data-index'));
                scopeObservations[idx].note = e.target.value;
                localStorage.setItem('ece_scope_observations', JSON.stringify(scopeObservations));
            }
        });
        scopeObsBody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.btn-delete-obs');
            if (deleteBtn) {
                const idx = parseInt(deleteBtn.getAttribute('data-index'));
                scopeObservations.splice(idx, 1);
                localStorage.setItem('ece_scope_observations', JSON.stringify(scopeObservations));
                renderScopeObservations();
            }
        });
    }

    if (fourierObsBody) {
        fourierObsBody.addEventListener('input', (e) => {
            if (e.target.classList.contains('fourier-note-input')) {
                const idx = parseInt(e.target.getAttribute('data-index'));
                fourierObservations[idx].note = e.target.value;
                localStorage.setItem('ece_fourier_observations', JSON.stringify(fourierObservations));
            }
        });
        fourierObsBody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.btn-delete-fourier-obs');
            if (deleteBtn) {
                const idx = parseInt(deleteBtn.getAttribute('data-index'));
                fourierObservations.splice(idx, 1);
                localStorage.setItem('ece_fourier_observations', JSON.stringify(fourierObservations));
                renderFourierObservations();
            }
        });
    }

    // Initial render of saved lists
    renderScopeObservations();
    renderFourierObservations();

    // Wave equation value evaluation
    function evaluateWaveValue(shape, amp, freq, phaseDeg, time) {
        const freqRad = 2 * Math.PI * freq;
        const phaseRad = (phaseDeg * Math.PI) / 180;
        const tVal = time * freqRad + phaseRad;
        
        switch (shape) {
            case 'sine': return amp * Math.sin(tVal);
            case 'square': return amp * (Math.sin(tVal) >= 0 ? 1 : -1);
            case 'triangle': return amp * (2 / Math.PI) * Math.asin(Math.sin(tVal));
            case 'sawtooth':
                const scaledT = tVal / (2 * Math.PI);
                return amp * 2 * (scaledT - Math.floor(0.5 + scaledT));
            default: return 0;
        }
    }

    // Dynamic Fourier wave solver
    function getFourierHarmonicTerm(shape, index, f0, time) {
        // index is 1-indexed harmonic number (e.g. n = 1, 2, 3...)
        const freq = index * f0;
        const angle = 2 * Math.PI * freq * time;
        
        if (shape === 'square') {
            if (index % 2 === 0) return 0; // only odd
            return (4 / Math.PI) * (1 / index) * Math.sin(angle);
        } 
        else if (shape === 'triangle') {
            if (index % 2 === 0) return 0; // only odd
            const k = (index - 1) / 2;
            const coeff = (8 / (Math.PI * Math.PI)) * (Math.pow(-1, k) / (index * index));
            return coeff * Math.sin(angle);
        } 
        else if (shape === 'sawtooth') {
            // Sawtooth sums all terms
            const coeff = (2 / Math.PI) * (Math.pow(-1, index - 1) / index);
            return coeff * Math.sin(angle);
        }
        return 0;
    }

    // 3. MASTER RUN LOOP
    let tick = 0;

    const runMasterLoop = () => {
        if (activeLab === 'scope') {
            // --- DRAW LAB 1: OSCILLOSCOPE ---
            oCtx.clearRect(0, 0, oWidth, oHeight);
            
            // Grid
            oCtx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
            oCtx.lineWidth = 1;
            const oSpacing = 25;
            for (let x = 0; x < oWidth; x += oSpacing) {
                oCtx.beginPath(); oCtx.moveTo(x, 0); oCtx.lineTo(x, oHeight); oCtx.stroke();
            }
            for (let y = 0; y < oHeight; y += oSpacing) {
                oCtx.beginPath(); oCtx.moveTo(0, y); oCtx.lineTo(oWidth, y); oCtx.stroke();
            }
            
            // Dotted center lines
            oCtx.strokeStyle = 'rgba(16, 185, 129, 0.22)';
            oCtx.lineWidth = 1.2;
            oCtx.setLineDash([4, 4]);
            oCtx.beginPath(); oCtx.moveTo(0, oHeight/2); oCtx.lineTo(oWidth, oHeight/2); oCtx.stroke();
            oCtx.beginPath(); oCtx.moveTo(oWidth/2, 0); oCtx.lineTo(oWidth/2, oHeight); oCtx.stroke();
            oCtx.restore();

            const scopeOriginY = oHeight / 2;
            const timeScale = 0.00015;

            // Plot CH1
            oCtx.beginPath();
            oCtx.strokeStyle = '#10b981';
            oCtx.lineWidth = 2.5;
            for (let x = 0; x < oWidth; x++) {
                const evaluationTime = (x - oWidth / 2) * timeScale + tick * 0.06;
                const pixelAmp = ch1.amp * 22;
                const waveVal = evaluateWaveValue(ch1.shape, pixelAmp, ch1.freq, ch1.phase, evaluationTime);
                const plotY = scopeOriginY - waveVal;
                if (x === 0) oCtx.moveTo(x, plotY);
                else oCtx.lineTo(x, plotY);
            }
            oCtx.stroke();

            // Plot CH2
            if (ch2.enabled) {
                oCtx.beginPath();
                oCtx.strokeStyle = '#f59e0b';
                oCtx.lineWidth = 2.0;
                for (let x = 0; x < oWidth; x++) {
                    const evaluationTime = (x - oWidth / 2) * timeScale + tick * 0.06;
                    const pixelAmp = ch2.amp * 22;
                    const waveVal = evaluateWaveValue(ch2.shape, pixelAmp, ch2.freq, ch2.phase, evaluationTime);
                    const plotY = scopeOriginY - waveVal;
                    if (x === 0) oCtx.moveTo(x, plotY);
                    else oCtx.lineTo(x, plotY);
                }
                oCtx.stroke();
            }

            // --- DRAW LAB 1: FFT ANALYZER ---
            fCtx.clearRect(0, 0, fWidth, fHeight);
            
            // FFT Grid
            fCtx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
            fCtx.lineWidth = 1;
            for (let x = 0; x < fWidth; x += 40) {
                fCtx.beginPath(); fCtx.moveTo(x, 0); fCtx.lineTo(x, fHeight); fCtx.stroke();
            }
            for (let y = 0; y < fHeight; y += 30) {
                fCtx.beginPath(); fCtx.moveTo(0, y); fCtx.lineTo(fWidth, y); fCtx.stroke();
            }
            
            const fOriginY = fHeight - 20;
            fCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            fCtx.lineWidth = 1.2;
            fCtx.beginPath(); fCtx.moveTo(10, fOriginY); fCtx.lineTo(fWidth - 10, fOriginY); fCtx.stroke();
            
            fCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            fCtx.font = '600 9px var(--font-heading)';
            fCtx.textAlign = 'right';
            fCtx.fillText('Frequency (kHz)', fWidth - 12, fOriginY + 14);

            const drawFFTPeaks = (chData, color) => {
                const freqScaleX = (fWidth - 60) / 250;
                const peakScaleY = 28;
                fCtx.fillStyle = color;
                fCtx.strokeStyle = color;
                fCtx.lineWidth = 1.5;

                // continuous baseline noise
                fCtx.beginPath();
                fCtx.moveTo(20, fOriginY);
                for (let x = 20; x < fWidth - 20; x++) {
                    const noise = Math.sin(x * 0.5 + tick * 3) * 1.0;
                    fCtx.lineTo(x, fOriginY - Math.abs(noise));
                }
                fCtx.stroke();

                const drawSpike = (freq, amplitude, idx) => {
                    const peakX = 35 + freq * freqScaleX;
                    if (peakX > fWidth - 10) return;
                    const peakHeight = amplitude * chData.amp * peakScaleY;
                    const peakTopY = fOriginY - peakHeight;

                    fCtx.save();
                    fCtx.shadowBlur = 8;
                    fCtx.shadowColor = color;
                    fCtx.beginPath();
                    fCtx.moveTo(peakX, fOriginY);
                    fCtx.lineTo(peakX - 3, fOriginY);
                    fCtx.lineTo(peakX, peakTopY);
                    fCtx.lineTo(peakX + 3, fOriginY);
                    fCtx.closePath();
                    fCtx.fill();
                    fCtx.restore();

                    if (idx) {
                        fCtx.fillStyle = 'rgba(255,255,255,0.7)';
                        fCtx.font = 'bold 8px monospace';
                        fCtx.textAlign = 'center';
                        fCtx.fillText(idx, peakX, peakTopY - 4);
                    }
                };

                const f0 = chData.freq;
                if (chData.shape === 'sine') {
                    drawSpike(f0, 1.2, 'f0');
                } else if (chData.shape === 'square') {
                    drawSpike(f0, 1.2, 'f0');
                    drawSpike(3*f0, 1.2/3, '3f0');
                    drawSpike(5*f0, 1.2/5, '5f0');
                    drawSpike(7*f0, 1.2/7, '7f0');
                } else if (chData.shape === 'triangle') {
                    drawSpike(f0, 1.2, 'f0');
                    drawSpike(3*f0, 1.2/9, '3f0');
                    drawSpike(5*f0, 1.2/25, '5f0');
                } else {
                    drawSpike(f0, 1.2, 'f0');
                    drawSpike(2*f0, 1.2/2, '2f0');
                    drawSpike(3*f0, 1.2/3, '3f0');
                    drawSpike(4*f0, 1.2/4, '4f0');
                }
            };

            drawFFTPeaks(ch1, 'rgba(99, 102, 241, 0.8)');
            if (ch2.enabled) {
                drawFFTPeaks(ch2, 'rgba(245, 158, 11, 0.7)');
            }

        } else if (activeLab === 'fourier') {
            // --- DRAW LAB 2: CONSTITUENTS (First 4 active sines) ---
            hCtx.clearRect(0, 0, hWidth, hHeight);
            
            // Grid
            hCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            hCtx.lineWidth = 1;
            for (let x = 0; x < hWidth; x += 30) {
                hCtx.beginPath(); hCtx.moveTo(x, 0); hCtx.lineTo(x, hHeight); hCtx.stroke();
            }
            for (let y = 0; y < hHeight; y += 30) {
                hCtx.beginPath(); hCtx.moveTo(0, y); hCtx.lineTo(hWidth, y); hCtx.stroke();
            }

            const hOriginY = hHeight / 2;
            hCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            hCtx.lineWidth = 1;
            hCtx.beginPath(); hCtx.moveTo(0, hOriginY); hCtx.lineTo(hWidth, hOriginY); hCtx.stroke();

            // Find first few active harmonics indexes
            const activeHarmonicIndices = [];
            let checkIdx = 1;
            while (activeHarmonicIndices.length < 4 && checkIdx <= fourier.n) {
                const termVal = getFourierHarmonicTerm(fourier.shape, checkIdx, fourier.f0, 0);
                if (Math.abs(termVal) > 0.0001 || ((fourier.shape === 'square' || fourier.shape === 'triangle') && checkIdx % 2 !== 0) || (fourier.shape === 'sawtooth')) {
                    activeHarmonicIndices.push(checkIdx);
                }
                checkIdx++;
            }

            // Colors for individual harmonics
            const hColors = ['#10b981', '#f59e0b', '#6366f1', '#ec4899'];
            const fSpeed = 0.01;

            activeHarmonicIndices.forEach((harmIndex, cIdx) => {
                hCtx.beginPath();
                hCtx.strokeStyle = hColors[cIdx % hColors.length];
                hCtx.lineWidth = 1.5;

                for (let x = 0; x < hWidth; x++) {
                    const t = (x - hWidth/2) * 0.0012 - tick * fSpeed;
                    const val = getFourierHarmonicTerm(fourier.shape, harmIndex, fourier.f0, t);
                    // Scaling for view
                    const py = hOriginY - val * 75;
                    if (x === 0) hCtx.moveTo(x, py);
                    else hCtx.lineTo(x, py);
                }
                hCtx.stroke();
            });

            // Write labels for active sines
            hCtx.font = 'bold 9px monospace';
            activeHarmonicIndices.forEach((harmIndex, cIdx) => {
                hCtx.fillStyle = hColors[cIdx % hColors.length];
                hCtx.fillText(`n=${harmIndex} component`, 15, 20 + cIdx * 14);
            });

            // --- DRAW LAB 2: COMPOSITE WAVEFORM ---
            cCtx.clearRect(0, 0, cWidth, cHeight);
            
            // Grid
            cCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            cCtx.lineWidth = 1;
            for (let x = 0; x < cWidth; x += 30) {
                cCtx.beginPath(); cCtx.moveTo(x, 0); cCtx.lineTo(x, cHeight); cCtx.stroke();
            }
            for (let y = 0; y < cHeight; y += 30) {
                cCtx.beginPath(); cCtx.moveTo(0, y); cCtx.lineTo(cWidth, y); cCtx.stroke();
            }

            const cOriginY = cHeight / 2;
            cCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            cCtx.lineWidth = 1;
            cCtx.beginPath(); cCtx.moveTo(0, cOriginY); cCtx.lineTo(cWidth, cOriginY); cCtx.stroke();

            // Calculate composite sum
            cCtx.beginPath();
            cCtx.strokeStyle = '#06b6d4';
            cCtx.lineWidth = 3.0;

            const transitionIndicesX = []; // to mark Gibbs overshoots!

            for (let x = 0; x < cWidth; x++) {
                const t = (x - cWidth/2) * 0.0012 - tick * fSpeed;
                
                let sum = 0;
                for (let k = 1; k <= fourier.n; k++) {
                    sum += getFourierHarmonicTerm(fourier.shape, k, fourier.f0, t);
                }

                // Detect sharp rise/fall for Gibbs marker positions (based on fundamental cycle transition)
                // For a square wave fundamental at f0, transition occurs at t = integer / (2 * f0)
                const fundamentalPhase = (t * 2 * Math.PI * fourier.f0) % (2 * Math.PI);
                const isNearRise = Math.abs(fundamentalPhase) < 0.04 || Math.abs(fundamentalPhase - Math.PI) < 0.04 || Math.abs(fundamentalPhase - 2*Math.PI) < 0.04;
                
                if (isNearRise && x > 20 && x < cWidth - 20) {
                    if (transitionIndicesX.length === 0 || x - transitionIndicesX[transitionIndicesX.length - 1] > 20) {
                        transitionIndicesX.push({ x, y: cOriginY - sum * 75, val: sum });
                    }
                }

                const py = cOriginY - sum * 75;
                if (x === 0) cCtx.moveTo(x, py);
                else cCtx.lineTo(x, py);
            }
            cCtx.stroke();

            // If shape is square or sawtooth and harmonics N > 3, draw Gibbs overshoot pulsating rings at transitions!
            if ((fourier.shape === 'square' || fourier.shape === 'sawtooth') && fourier.n > 3) {
                transitionIndicesX.forEach(pt => {
                    // Draw pulsating ring on the crests of the ripples (slightly offset from exact rise point)
                    const rippleOffset = fourier.shape === 'square' ? (fourier.shape === 'square' ? 10 : 8) : 5;
                    
                    const drawRing = (rx, ry) => {
                        cCtx.beginPath();
                        cCtx.arc(rx, ry, 6 + Math.sin(tick * 0.5) * 2, 0, Math.PI * 2);
                        cCtx.strokeStyle = '#f59e0b'; // Amber warning color
                        cCtx.lineWidth = 1.5;
                        cCtx.stroke();

                        cCtx.beginPath();
                        cCtx.arc(rx, ry, 2, 0, Math.PI * 2);
                        cCtx.fillStyle = '#fff';
                        cCtx.fill();
                    };

                    // Draw overshoot at top crest or bottom trough
                    if (pt.val > 0.1) {
                        drawRing(pt.x + rippleOffset, pt.y - 8);
                    } else if (pt.val < -0.1) {
                        drawRing(pt.x + rippleOffset, pt.y + 8);
                    }
                });

                // Write text label for Gibbs ripples
                cCtx.fillStyle = '#f59e0b';
                cCtx.font = 'bold 8px monospace';
                cCtx.fillText('⚠️ Gibbs overshoot peaks', 15, 20);
            }
        }

        if (!isAnimationPaused) {
            tick += 0.08;
        }
        animationFrameId = requestAnimationFrame(runMasterLoop);
    };

    runMasterLoop();
};

export const unmount = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    const oCanvas = document.getElementById('oscilloscope-canvas');
    if (oCanvas && oCanvas._resizeHandler) {
        window.removeEventListener('resize', oCanvas._resizeHandler);
    }

    activeTabHandlers.forEach(item => {
        item.buttons.forEach(btn => btn.removeEventListener('click', item.handler));
    });
    activeTabHandlers = [];

    if (activeShapeCh1Handler) {
        document.querySelectorAll('[data-shape-ch1]').forEach(btn => btn.removeEventListener('click', activeShapeCh1Handler));
    }
    if (activeShapeCh2Handler) {
        document.querySelectorAll('[data-shape-ch2]').forEach(btn => btn.removeEventListener('click', activeShapeCh2Handler));
    }
};
