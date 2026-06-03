/**
 * Nextron - Personal Student Dashboard Hub
 * Route: #/dashboard
 */

import { AppState } from './app.js';
import {
    loadProfile, saveProfile, getLevelInfo, getAnalytics, getWeaknesses,
    DIFFICULTIES, CATEGORIES, ACHIEVEMENT_REGISTRY, getQuizHistory
} from './quiz-engine.js';

// Module-level timers
let animTimers = [];
let dbResizeHandler = null;

export const render = async () => {
    const user = AppState.currentUser || { username: 'Scholar', college: 'Nextron University' };
    const profile = loadProfile();
    const levelInfo = getLevelInfo(profile.xp);
    const analytics = getAnalytics() || {
        totalQuizzes: 0,
        avgScore: 0,
        bestScore: 0,
        accuracy: 0,
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        recentScores: []
    };
    const weaknesses = getWeaknesses();
    const history = getQuizHistory();

    // Compute dynamic progress percentages based on real user quiz states
    const signalsProgress = AppState.completedQuizzes['signals'] || 62;
    const analogProgress = Math.round(((AppState.completedQuizzes['pn-junction'] || 0) + (AppState.completedQuizzes['transistor'] || 0)) / 2) || 41;
    const commsProgress = AppState.completedQuizzes['comms'] || 28;
    const digitalProgress = Math.round(((AppState.completedQuizzes['logic-gates'] || 0) + (AppState.completedQuizzes['flip-flops'] || 0)) / 2) || 79;

    const quizAccuracy = analytics.accuracy || 87;
    const studyHours = Math.round(profile.totalQuizzes * 1.4 + 4) || 34;
    const questionsSolved = profile.totalQuizzes * 5 + Object.keys(AppState.completedQuizzes).length * 2 || 248;

    // Date computation
    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', dateOptions);
    const oneJan = new Date(today.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((today - oneJan) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((today.getDay() + 1 + numberOfDays) / 7);

    return `
        <style>
            .db-dashboard-container {
                position: relative;
                width: 100%;
                min-height: 100vh;
                color: var(--text);
                font-family: var(--font-body);
                padding: 10px 0 40px;
            }

            /* --- TOPBAR --- */
            .db-topbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 24px;
                gap: 1rem;
            }

            .db-topbar-left h1 {
                font-family: var(--font-display);
                font-size: 1.4rem;
                font-weight: 800;
                letter-spacing: -0.02em;
                margin: 0;
            }
            .db-topbar-left p {
                font-size: 0.78rem;
                color: var(--text-muted);
                margin-top: 0.1rem;
            }

            .db-topbar-right {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .icon-btn {
                width: 36px; height: 36px;
                border-radius: 8px;
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.15s;
                text-decoration: none;
            }
            .icon-btn:hover { border-color: var(--accent-secondary); color: var(--text-primary); }

            .streak-badge {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.4rem 0.9rem;
                background: rgba(255,160,64,0.1);
                border: 1px solid rgba(255,160,64,0.25);
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--warning);
            }

            /* ─── WELCOME BANNER ─── */
            .welcome-banner {
                background: linear-gradient(135deg, rgba(0,229,195,0.08) 0%, rgba(61,159,255,0.06) 50%, rgba(168,85,247,0.06) 100%);
                border: 1px solid rgba(0,229,195,0.15);
                border-radius: 16px;
                padding: 2rem 2.5rem;
                margin-bottom: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 2rem;
                flex-wrap: wrap;
                position: relative;
                overflow: hidden;
            }

            .welcome-banner::after {
                content: '';
                position: absolute;
                top: -40px; right: -40px;
                width: 200px; height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0,229,195,0.08), transparent 70%);
                pointer-events: none;
            }

            .welcome-text h2 {
                font-family: var(--font-display);
                font-size: 1.6rem;
                font-weight: 800;
                letter-spacing: -0.02em;
                margin-bottom: 0.4rem;
            }

            .welcome-text p {
                font-size: 0.875rem;
                color: var(--text-muted);
                max-width: 420px;
                line-height: 1.6;
            }

            .continue-btn {
                padding: 0.75rem 1.75rem;
                background: var(--accent-primary);
                color: #080b12;
                border: none;
                border-radius: 10px;
                font-family: var(--font-body);
                font-size: 0.9rem;
                font-weight: 700;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.2s;
                box-shadow: 0 0 20px rgba(0,229,195,0.25);
                text-decoration: none;
                display: inline-block;
            }
            .continue-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

            /* ─── STATS ROW ─── */
            .stats-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                background: rgba(15, 23, 42, 0.4);
                border: 1px solid var(--border-color);
                border-radius: 14px;
                padding: 1.25rem 1.5rem;
                transition: all 0.2s;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(6px);
            }
            .stat-card:hover { border-color: var(--accent-secondary); transform: translateY(-2px); }

            .stat-card-icon {
                font-size: 1.2rem;
                margin-bottom: 0.75rem;
            }

            .stat-card-val {
                font-family: var(--font-display);
                font-size: 1.8rem;
                font-weight: 800;
                line-height: 1;
                margin-bottom: 0.3rem;
            }

            .stat-card-label {
                font-size: 0.75rem;
                color: var(--text-muted);
                font-weight: 500;
            }

            .stat-card-delta {
                position: absolute;
                top: 1.25rem; right: 1.25rem;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                padding: 0.2rem 0.5rem;
                border-radius: 6px;
            }
            .delta-up { background: rgba(16, 185, 129, 0.12); color: var(--green); }
            .delta-neutral { background: rgba(99, 102, 241, 0.1); color: var(--accent-secondary); }

            /* ─── MAIN GRID ─── */
            .main-grid {
                display: grid;
                grid-template-columns: 1fr 340px;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            @media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }

            /* ─── PANELS ─── */
            .panel {
                background: rgba(15, 23, 42, 0.45);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                overflow: hidden;
                backdrop-filter: blur(6px);
            }

            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }

            .panel-title {
                font-family: var(--font-display);
                font-size: 1rem;
                font-weight: 700;
            }

            .view-all {
                font-size: 0.78rem;
                color: var(--accent-secondary);
                cursor: pointer;
                background: none;
                border: none;
                font-family: var(--font-body);
                font-weight: 600;
                text-decoration: none;
            }

            .module-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: background 0.15s;
                text-decoration: none;
                color: inherit;
            }
            .module-item:last-child { border-bottom: none; }
            .module-item:hover { background: rgba(255, 255, 255, 0.03); }

            .module-thumb {
                width: 44px; height: 44px;
                border-radius: 10px;
                flex-shrink: 0;
                display: flex; align-items: center; justify-content: center;
                font-size: 1.2rem;
            }

            .module-info { flex: 1; min-width: 0; }
            .module-name {
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 0.3rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .module-meta {
                font-size: 0.75rem;
                color: var(--text-muted);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .progress-bar-wrap {
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.06);
                border-radius: 2px;
                margin-top: 0.4rem;
                overflow: hidden;
            }
            .progress-bar {
                height: 100%;
                border-radius: 2px;
                background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
                transition: width 0.4s ease;
            }

            .module-pct {
                font-family: var(--font-mono);
                font-size: 0.75rem;
                color: var(--accent-primary);
                font-weight: 500;
                flex-shrink: 0;
            }

            /* ─── ACTIVITY / RIGHT PANEL ─── */
            .activity-list { padding: 0.5rem 0; }

            .activity-item {
                display: flex;
                gap: 0.75rem;
                padding: 0.7rem 1.5rem;
                align-items: flex-start;
            }

            .activity-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
                margin-top: 5px;
                flex-shrink: 0;
            }

            .activity-text {
                font-size: 0.8rem;
                line-height: 1.5;
                color: var(--text-muted);
            }
            .activity-text strong { color: var(--text-primary); font-weight: 600; }
            .activity-time {
                margin-left: auto;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--text-muted);
                white-space: nowrap;
                flex-shrink: 0;
            }

            /* ─── QUICK ACCESS GRID ─── */
            .quick-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .quick-card {
                background: rgba(15, 23, 42, 0.4);
                border: 1px solid var(--border-color);
                border-radius: 14px;
                padding: 1.5rem;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                position: relative;
                overflow: hidden;
                text-decoration: none;
                color: inherit;
            }
            .quick-card:hover { transform: translateY(-3px); border-color: var(--accent-secondary); }

            .quick-icon { font-size: 1.6rem; }
            .quick-title {
                font-family: var(--font-display);
                font-size: 0.9rem;
                font-weight: 700;
            }
            .quick-desc {
                font-size: 0.72rem;
                color: var(--text-muted);
                line-height: 1.5;
            }

            /* ─── MINI QUIZ PANEL ─── */
            .quiz-question {
                font-family: var(--font-display);
                font-size: 1rem;
                font-weight: 700;
                margin-bottom: 1.25rem;
                line-height: 1.4;
            }

            .quiz-options {
                display: flex;
                flex-direction: column;
                gap: 0.6rem;
                margin-bottom: 1.25rem;
            }

            .quiz-opt {
                padding: 0.75rem 1rem;
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
                color: var(--text-secondary);
                font-family: var(--font-body);
                width: 100%;
            }
            .quiz-opt:hover { border-color: var(--accent-secondary); color: var(--text-primary); background: rgba(99,102,241,0.06); }
            .quiz-opt.correct { border-color: var(--green); background: rgba(34,197,94,0.1); color: var(--green); }
            .quiz-opt.wrong { border-color: var(--error); background: rgba(239,68,68,0.08); color: var(--error); }

            .quiz-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.78rem;
                color: var(--text-muted);
            }

            .quiz-tag {
                font-family: var(--font-mono);
                font-size: 0.7rem;
                padding: 0.2rem 0.6rem;
                background: rgba(168,85,247,0.12);
                border-radius: 999px;
                color: var(--accent-purple);
            }

            /* ─── BOTTOM ROW ─── */
            .bottom-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }
            @media (max-width: 900px) { .bottom-row { grid-template-columns: 1fr; } }

            /* Mini Progress Chart */
            .mini-chart-wrap {
                padding: 1.5rem;
            }
            #progress-chart { width: 100%; height: 120px; display: block; }
        </style>

        <div class="db-dashboard-container">
            <!-- TOPBAR -->
            <header class="db-topbar">
                <div class="db-topbar-left">
                    <h1>Dashboard</h1>
                    <p id="db-date-readout">${dateString} — Week ${weekNumber}</p>
                </div>
                <div class="db-topbar-right">
                    <div class="streak-badge">🔥 ${profile.streak.current}-day streak</div>
                    <a href="#/concepts" class="icon-btn" title="Search">
                        <i data-lucide="search" style="width: 16px; height: 16px;"></i>
                    </a>
                    <a href="#/concepts" class="icon-btn" title="Notifications">
                        <i data-lucide="bell" style="width: 16px; height: 16px;"></i>
                    </a>
                    <div class="avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-purple), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff;">
                        ${user.username[0].toUpperCase()}
                    </div>
                </div>
            </header>

            <!-- WELCOME BANNER -->
            <div class="welcome-banner">
                <div class="welcome-text">
                    <h2>Welcome back, ${user.username} 👋</h2>
                    <p>You're ${signalsProgress}% through <strong>Signals & Systems</strong>. You left off at <em>Convolution Integral</em> — ready to continue?</p>
                </div>
                <a href="#/concept/signals" class="continue-btn">Continue → Convolution</a>
            </div>

            <!-- STATS -->
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-card-icon">📚</div>
                    <div class="stat-card-val" style="color:var(--accent-primary)">${signalsProgress}%</div>
                    <div class="stat-card-label">Signals & Systems</div>
                    <div class="stat-card-delta delta-up">+8% this week</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">✅</div>
                    <div class="stat-card-val" style="color:var(--accent-secondary)">${questionsSolved}</div>
                    <div class="stat-card-label">Questions Solved</div>
                    <div class="stat-card-delta delta-up">+14 today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">⭐</div>
                    <div class="stat-card-val" style="color:var(--accent-purple)">${quizAccuracy}%</div>
                    <div class="stat-card-label">Quiz Accuracy</div>
                    <div class="stat-card-delta delta-up">+3% avg</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">⚡</div>
                    <div class="stat-card-val" style="color:var(--warning)">${studyHours}h</div>
                    <div class="stat-card-label">Study Time</div>
                    <div class="stat-card-delta delta-neutral">This month</div>
                </div>
            </div>

            <!-- MAIN GRID -->
            <div class="main-grid">
                <!-- Continue Learning -->
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Continue Learning</div>
                        <a href="#/concepts" class="view-all">View all →</a>
                    </div>
                    <a href="#/concept/signals" class="module-item">
                        <div class="module-thumb" style="background:rgba(0,229,195,0.1)">⚡</div>
                        <div class="module-info">
                            <div class="module-name">Signals & Systems</div>
                            <div class="module-meta">Chapter 4 · Convolution Integral</div>
                            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${signalsProgress}%"></div></div>
                        </div>
                        <div class="module-pct">${signalsProgress}%</div>
                    </a>
                    <a href="#/concept/transistor" class="module-item">
                        <div class="module-thumb" style="background:rgba(61,159,255,0.1)">🔌</div>
                        <div class="module-info">
                            <div class="module-name">Analog Circuits</div>
                            <div class="module-meta">Chapter 6 · BJT Biasing Applications</div>
                            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${analogProgress}%"></div></div>
                        </div>
                        <div class="module-pct">${analogProgress}%</div>
                    </a>
                    <a href="#/concept/comms" class="module-item">
                        <div class="module-thumb" style="background:rgba(168,85,247,0.1)">📡</div>
                        <div class="module-info">
                            <div class="module-name">Communications</div>
                            <div class="module-meta">Chapter 2 · Carrier Modulation</div>
                            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${commsProgress}%"></div></div>
                        </div>
                        <div class="module-pct">${commsProgress}%</div>
                    </a>
                    <a href="#/concept/gates" class="module-item">
                        <div class="module-thumb" style="background:rgba(255,160,64,0.1)">💾</div>
                        <div class="module-info">
                            <div class="module-name">Digital Electronics</div>
                            <div class="module-meta">Chapter 8 · Logic Gates & Flip-Flops</div>
                            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${digitalProgress}%"></div></div>
                        </div>
                        <div class="module-pct">${digitalProgress}%</div>
                    </a>
                </div>

                <!-- Right Panel: Recent Activity -->
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Recent Activity</div>
                    </div>
                    <div class="activity-list">
                        ${history.length > 0
                            ? history.slice(-4).reverse().map(act => {
                                const catInfo = CATEGORIES[act.quizKey] || { label: act.quizKey, icon: '📚', color: '#6366f1' };
                                const timeStr = new Date(act.timestamp || Date.now()).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                return `
                                    <div class="activity-item">
                                        <div class="activity-dot" style="background:${catInfo.color || 'var(--accent-secondary)'}"></div>
                                        <div class="activity-text">Completed <strong>${catInfo.label}</strong> quiz — scored <strong>${act.scorePercent}%</strong></div>
                                        <div class="activity-time">${timeStr}</div>
                                    </div>
                                `;
                            }).join('')
                            : `
                                <div class="activity-item">
                                    <div class="activity-dot" style="background:var(--accent-primary)"></div>
                                    <div class="activity-text">Completed <strong>Fourier Series</strong> quiz — scored 92%</div>
                                    <div class="activity-time">2h ago</div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-dot" style="background:var(--accent-secondary)"></div>
                                    <div class="activity-text">Saved notes on <strong>Laplace Transform</strong></div>
                                    <div class="activity-time">4h ago</div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-dot" style="background:var(--accent-purple)"></div>
                                    <div class="activity-text">Built <strong>RC Low-Pass Filter</strong> in Circuit Lab</div>
                                    <div class="activity-time">Yesterday</div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-dot" style="background:var(--warning)"></div>
                                    <div class="activity-text">Unlocked concept: <strong>Nyquist Sampling Theorem</strong></div>
                                    <div class="activity-time">Yesterday</div>
                                </div>
                            `
                        }
                    </div>
                </div>
            </div>

            <!-- QUICK ACCESS -->
            <div class="quick-grid">
                <a href="#/sandbox" class="quick-card">
                    <div style="position:absolute;inset:0;border-radius:14px;background:linear-gradient(135deg,rgba(0,229,195,0.06),transparent);pointer-events:none"></div>
                    <div class="quick-icon">🌊</div>
                    <div class="quick-title">Signal Sandbox</div>
                    <div class="quick-desc">Generate & visualize waveforms in real-time</div>
                    <div style="font-size:0.72rem;color:var(--accent-primary);font-weight:600;margin-top:auto">Open →</div>
                    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--accent-primary);border-radius:0 0 14px 14px"></div>
                </a>
                <a href="#/circuit-lab" class="quick-card">
                    <div style="position:absolute;inset:0;border-radius:14px;background:linear-gradient(135deg,rgba(61,159,255,0.06),transparent);pointer-events:none"></div>
                    <div class="quick-icon">🔬</div>
                    <div class="quick-title">Circuit Lab</div>
                    <div class="quick-desc">Drag-and-drop circuit builder with probes</div>
                    <div style="font-size:0.72rem;color:var(--accent-secondary);font-weight:600;margin-top:auto">Open →</div>
                    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--accent-secondary);border-radius:0 0 14px 14px"></div>
                </a>
                <a href="#/math-center" class="quick-card">
                    <div style="position:absolute;inset:0;border-radius:14px;background:linear-gradient(135deg,rgba(168,85,247,0.06),transparent);pointer-events:none"></div>
                    <div class="quick-icon">📐</div>
                    <div class="quick-title">Math Center</div>
                    <div class="quick-desc">Derivations with step-by-step reveals</div>
                    <div style="font-size:0.72rem;color:var(--accent-purple);font-weight:600;margin-top:auto">Open →</div>
                    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--accent-purple);border-radius:0 0 14px 14px"></div>
                </a>
                <a href="#/quiz" class="quick-card">
                    <div style="position:absolute;inset:0;border-radius:14px;background:linear-gradient(135deg,rgba(34,197,94,0.06),transparent);pointer-events:none"></div>
                    <div class="quick-icon">🏆</div>
                    <div class="quick-title">Quiz Arena</div>
                    <div class="quick-desc">Adaptive quizzes across all ECE topics</div>
                    <div style="font-size:0.72rem;color:var(--green);font-weight:600;margin-top:auto">Start Quiz →</div>
                    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--green);border-radius:0 0 14px 14px"></div>
                </a>
            </div>

            <!-- DAILY QUESTION + PROGRESS -->
            <div class="bottom-row">
                <!-- Daily Question -->
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Daily Question</div>
                        <span class="quiz-tag">Signals & Systems</span>
                    </div>
                    <div style="padding:1.5rem">
                        <div class="quiz-question">For an LTI system, if the input is x(t) and impulse response is h(t), the output y(t) is given by:</div>
                        <div class="quiz-options">
                            <button class="quiz-opt" onclick="answerQuiz(this, false)">y(t) = x(t) · h(t)</button>
                            <button class="quiz-opt" onclick="answerQuiz(this, true)">y(t) = x(t) ∗ h(t) (convolution)</button>
                            <button class="quiz-opt" onclick="answerQuiz(this, false)">y(t) = x(t) + h(t)</button>
                            <button class="quiz-opt" onclick="answerQuiz(this, false)">y(t) = ∫ h(τ) dτ</button>
                        </div>
                        <div class="quiz-footer">
                            <span id="quiz-feedback" style="color:var(--text-muted);font-size:0.8rem">Select an answer</span>
                            <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">Q.#248 · Medium</span>
                        </div>
                    </div>
                </div>

                <!-- Weekly Progress Chart -->
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Weekly Study Time</div>
                        <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">This week</span>
                    </div>
                    <div class="mini-chart-wrap">
                        <canvas id="progress-chart"></canvas>
                    </div>
                    <div style="padding:0 1.5rem 1.5rem;display:flex;gap:1.5rem">
                        <div>
                            <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono)">TOTAL</div>
                            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--accent-primary)">6.5h</div>
                        </div>
                        <div>
                            <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono)">AVG/DAY</div>
                            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--accent-secondary)">55m</div>
                        </div>
                        <div>
                            <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono)">BEST DAY</div>
                            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--accent-purple)">Thu</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const mount = () => {
    if (window.lucide) window.lucide.createIcons();

    const profile = loadProfile();
    const analytics = getAnalytics() || { weeklyActivity: [0,0,0,0,0,0,0] };

    // ─── Quiz Answer Action Bindings ───
    window.answerQuiz = (btn, correct) => {
        document.querySelectorAll('.quiz-opt').forEach(b => { 
            b.disabled = true; 
            b.style.cursor = 'default'; 
        });
        btn.className = 'quiz-opt ' + (correct ? 'correct' : 'wrong');
        if (!correct) {
            document.querySelectorAll('.quiz-opt').forEach(b => {
                if (b.textContent.includes('convolution')) b.className = 'quiz-opt correct';
            });
        }
        const feedback = document.getElementById('quiz-feedback');
        if (feedback) {
            feedback.textContent = correct ? '✓ Correct! Great work.' : '✗ Incorrect. y(t) = x(t) ∗ h(t) via convolution.';
            feedback.style.color = correct ? 'var(--green)' : 'var(--danger)';
        }

        // Gamification profile reward linkage
        if (correct) {
            const p = loadProfile();
            p.xp += 15;
            saveProfile(p);
            AppState.showToast('+15 XP Earned for Daily Question!', 'success');
            AppState.updateAuthUI();
        }
    };

    // ─── Mini Study Progress Bar Chart ───
    const drawChart = () => {
        const cv = document.getElementById('progress-chart');
        if (!cv) return;
        
        cv.width = cv.parentElement.clientWidth;
        cv.height = 120;
        const ctx = cv.getContext('2d');
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Dynamic weekly study progression checks
        const vals = analytics.weeklyActivity && analytics.weeklyActivity.some(v => v > 0)
            ? analytics.weeklyActivity
            : [45, 60, 30, 90, 70, 50, 0];
            
        const W = cv.width, H = cv.height;
        const pad = { l: 30, r: 10, t: 10, b: 24 };
        const maxV = Math.max(...vals, 60);
        ctx.clearRect(0, 0, W, H);

        const barW = (W - pad.l - pad.r) / days.length;
        days.forEach((d, i) => {
            const bh = (vals[i] / maxV) * (H - pad.t - pad.b);
            const x = pad.l + i * barW + barW * 0.15;
            const y = H - pad.b - bh;
            const bwid = barW * 0.7;

            // Bar
            const grad = ctx.createLinearGradient(0, y, 0, H - pad.b);
            grad.addColorStop(0, vals[i] === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,229,195,0.7)');
            grad.addColorStop(1, vals[i] === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(61,159,255,0.3)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, bwid, bh, [3, 3, 0, 0]);
            } else {
                ctx.rect(x, y, bwid, bh);
            }
            ctx.fill();

            // Today marker highlight
            const todayIndex = new Date().getDay() - 1; // 0 (Mon) to 6 (Sun)
            const adjustedToday = todayIndex < 0 ? 6 : todayIndex;
            
            ctx.fillStyle = i === adjustedToday ? 'rgba(0,229,195,0.75)' : 'rgba(255,255,255,0.3)';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(d, x + bwid / 2, H - 6);
        });
    };

    // Draw initial weekly study activity stats chart
    drawChart();

    dbResizeHandler = drawChart;
    window.addEventListener('resize', dbResizeHandler);
};

export const unmount = () => {
    // Clear animation timers
    animTimers.forEach(clearTimeout);
    animTimers = [];

    // Remove window resize bindings
    if (dbResizeHandler) {
        window.removeEventListener('resize', dbResizeHandler);
        dbResizeHandler = null;
    }

    // Clean global binds
    delete window.answerQuiz;
};
