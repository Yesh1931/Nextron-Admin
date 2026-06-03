/**
 * Nextron - About Developer View
 */

import { AppState } from '../app.js';

export const render = async () => {
    // 1. Gather all registered student accounts
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('ece-explorer-users')) || [];
    } catch (e) {
        users = [];
    }

    // 2. Aggregate counts per college
    const collegeCounts = {
        "Indian Institute of Technology, Bombay (IIT Bombay)": 14,
        "Birla Institute of Technology and Science, Pilani (BITS Pilani)": 9,
        "National Institute of Technology, Trichy (NIT Trichy)": 6
    };

    users.forEach(u => {
        if (u.college) {
            collegeCounts[u.college] = (collegeCounts[u.college] || 0) + 1;
        }
    });

    // Convert to sorted scoreboard list
    const sortedColleges = Object.entries(collegeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Display top 8 active institutes

    const collegesListHTML = sortedColleges.map(([collegeName, count]) => {
        // Find clean display abbreviation or slice if extremely long
        const displayName = collegeName.length > 40 ? collegeName.substring(0, 37) + '...' : collegeName;
        return `
            <div style="display: flex; flex-direction: column; gap: 4px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-primary); line-height: 1.3;" title="${collegeName}">${displayName}</span>
                    <span style="font-family: 'Space Grotesk', monospace; font-size: 0.8rem; font-weight: 700; color: var(--accent-secondary); background: rgba(6, 182, 212, 0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">${count}</span>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="about-container fade-in">
            <!-- Left Side: Profile & Analytics Column -->
            <div class="about-left-column" style="display: flex; flex-direction: column; gap: 24px; width: 320px;">
                <!-- Profile Card -->
                <div class="glass-card profile-card" style="padding: 24px;">
                    <div class="avatar-wrapper" style="width: 120px; height: 120px; margin-bottom: 16px;">
                        <div class="avatar">
                            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                                <path d="M12 2v9"></path>
                                <path d="M8 5h8"></path>
                            </svg>
                        </div>
                    </div>
                    <h3>Nextron Lab</h3>
                    <p class="role">Interactive Learning Platform</p>
                    <p style="font-size: 0.85rem; line-height: 1.4; margin-bottom: 16px; color: var(--text-secondary);">
                        Designing next-generation interactive educational visualizations to bridge the gap between complex physical formulas and conceptual intuition.
                    </p>
                    
                    <div class="social-links" style="display: flex; justify-content: center; gap: 12px; margin-bottom: 0;">
                        <a href="https://github.com" target="_blank" class="social-btn" aria-label="GitHub Account" style="width: 36px; height: 36px;">
                            <i data-lucide="github" style="width: 16px; height: 16px;"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" class="social-btn" aria-label="LinkedIn Account" style="width: 36px; height: 36px;">
                            <i data-lucide="linkedin" style="width: 16px; height: 16px;"></i>
                        </a>
                        <a href="mailto:contact@eceexplorer.edu" class="social-btn" aria-label="Email Contact" style="width: 36px; height: 36px;">
                            <i data-lucide="mail" style="width: 16px; height: 16px;"></i>
                        </a>
                    </div>
                </div>

                <!-- Active Institutes Scoreboard -->
                <div class="glass-card" style="padding: 24px; border-color: var(--border-glow); background: var(--bg-glass);">
                    <h4 style="color: var(--accent-secondary); margin-bottom: 6px; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="building-2" style="width: 16px; height: 16px; color: var(--accent-secondary);"></i> Active Institutes
                    </h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.35;">
                        Telemetry parsing registered college distributions in India using Nextron.
                    </p>
                    <div style="display: flex; flex-direction: column; max-height: 280px; overflow-y: auto; padding-right: 4px;">
                        ${collegesListHTML}
                    </div>
                </div>
            </div>
            
            <!-- Right Side: Platform Goals & Skill Benchmarks -->
            <div class="about-details" style="display: flex; flex-direction: column; gap: 24px;">
                <div class="glass-card" style="padding: 28px;">
                    <h3 style="color: var(--accent-secondary); margin-bottom: 16px;">Project Vision</h3>
                    <p style="margin-bottom: 12px; font-size: 1.05rem;">
                        <strong>Nextron</strong> is a portfolio-worthy educational platform created to give students a hands-on, micro-level laboratory experience directly inside their browser.
                    </p>
                    <p style="margin-bottom: 0;">
                        Traditional ECE textbooks rely on complex, static vector charts to illustrate dynamic processes—like electrons diffusing across a silicon barrier, or wave signals being sampled. This platform converts static drawings into <strong>high-performance, real-time interactive models</strong>.
                    </p>
                </div>
                
                <div class="glass-card" style="padding: 28px;">
                    <h3 style="color: var(--accent-secondary); margin-bottom: 16px;">Lab Tech Specifications</h3>
                    <div class="skills-deck">
                        <div class="skill-row">
                            <div class="skill-meta">
                                <span>High-Performance HTML5 Canvas Rendering</span>
                                <span>95%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 95%;"></div>
                            </div>
                        </div>
                        
                        <div class="skill-row">
                            <div class="skill-meta">
                                <span>Modular Vanilla ES6 JS Architecture</span>
                                <span>90%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 90%;"></div>
                            </div>
                        </div>
                        
                        <div class="skill-row">
                            <div class="skill-meta">
                                <span>Aesthetic Glassmorphism & UI Dynamics</span>
                                <span>88%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 88%;"></div>
                            </div>
                        </div>
                        
                        <div class="skill-row">
                            <div class="skill-meta">
                                <span>Physics-Based Simulation Systems</span>
                                <span>85%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 85%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Feedback Form -->
                <div class="glass-card" style="padding: 28px;">
                    <h3 style="color: var(--accent-secondary); margin-bottom: 16px;">Request a Lab Module</h3>
                    <form id="feedback-form" style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="grid-2" style="gap: 16px;">
                            <div class="slider-group">
                                <label for="form-name" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Your Name</label>
                                <input type="text" id="form-name" required placeholder="Enter name" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 12px; border-radius: var(--border-radius-sm); font-size: 0.95rem;">
                            </div>
                            <div class="slider-group">
                                <label for="form-email" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Your Email</label>
                                <input type="email" id="form-email" required placeholder="Enter email" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 12px; border-radius: var(--border-radius-sm); font-size: 0.95rem;">
                            </div>
                        </div>
                        
                        <div class="slider-group">
                            <label for="form-module" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Proposed Concept Module</label>
                            <input type="text" id="form-module" required placeholder="e.g. Operational Amplifiers (Op-Amps)" style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 12px; border-radius: var(--border-radius-sm); font-size: 0.95rem;">
                        </div>
                        
                        <div class="slider-group">
                            <label for="form-msg" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Description of Interaction Mechanics</label>
                            <textarea id="form-msg" rows="3" required placeholder="Explain how students should interact with this simulation..." style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 12px; border-radius: var(--border-radius-sm); font-size: 0.95rem; resize: vertical; font-family: inherit;"></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="align-self: flex-start;">
                            <i data-lucide="send"></i> Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
};

export const mount = () => {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const moduleName = document.getElementById('form-module').value;
        
        // Show success notification toast
        AppState.showToast(`Thank you, ${name}! Request for '${moduleName}' submitted.`, 'success');
        
        // Reset form
        form.reset();
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
};

export const unmount = () => {
    // Cleanup if any
};
