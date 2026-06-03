/**
 * Nextron Quiz Arena — Gamified Learning Platform
 * All 15 phases integrated while preserving original functionality.
 */

import { AppState } from './app.js';
import { QUIZ_BANK, EXPERT_QUESTIONS } from './database.js';
import {
    loadProfile, saveProfile, getLevelInfo, processQuizCompletion,
    getDailyChallenge, markDailyChallengeComplete,
    DIFFICULTIES, TIMED_MODES, BATTLE_MODES, CATEGORIES, ACHIEVEMENT_REGISTRY,
    xpThresholdForLevel, updateWeaknesses, getWeaknesses,
} from './quiz-engine.js';
import { isFirebaseActive, db } from './firebase.js';

// ─── MODULE STATE ─────────────────────────────────────────────────────────────
let activeQuizKey       = null;
let currentQuestionIndex = 0;
let quizScore           = 0;
let quizQuestions       = [];
let quizTimerId         = null;
let quizSecondsRemaining = 35;
let activeLevel         = 'easy';
let activeTimedMode     = 'practice';
let activeBattleMode    = 'normal';
let sessionStartTime    = null;
let sessionTotalSeconds = null;
let sessionTimerId      = null;
let sessionSecondsLeft  = null;
let isDaily             = false;
let perQuestionResults  = []; // { question, selectedIdx, correctIdx, explanation, correct }
let sessionXpEarned     = 0;

// Merged quiz bank with expert questions
function getMergedBank() {
    const bank = {};
    for (const key in QUIZ_BANK) {
        bank[key] = {
            ...QUIZ_BANK[key],
            questions: [
                ...(QUIZ_BANK[key].questions || []),
                ...(EXPERT_QUESTIONS[key] || []),
            ],
        };
    }
    return bank;
}

let activeQuizBank = null;
export async function getQuizBank() {
    if (activeQuizBank) return activeQuizBank;
    if (isFirebaseActive) {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(db, "quizzes"));
            if (!snap.empty) {
                const bank = {};
                snap.forEach(doc => {
                    bank[doc.id] = doc.data();
                });
                activeQuizBank = bank;
                return activeQuizBank;
            }
        } catch (e) {
            console.error("Firestore quizzes loading failed: ", e);
        }
    }
    activeQuizBank = getMergedBank();
    return activeQuizBank;
}

// ─── RENDER ───────────────────────────────────────────────────────────────────
export const render = async () => `
    <div class="quiz-container fade-in" style="max-width: 860px; margin: 0 auto;">
        <div id="quiz-mount-point">
            <div class="quiz-welcome-view fade-in">
                <div id="quiz-selection-list"></div>
            </div>
        </div>
    </div>
`;

// ─── MOUNT ────────────────────────────────────────────────────────────────────
export const mount = () => {
    renderCourseSelection();
};

// ─── UNMOUNT ─────────────────────────────────────────────────────────────────
export const unmount = () => {
    clearInterval(quizTimerId);
    clearInterval(sessionTimerId);
};

// ─── COURSE SELECTION ────────────────────────────────────────────────────────
// ─── COURSE SELECTION ────────────────────────────────────────────────────────
async function renderCourseSelection() {
    const list = document.getElementById('quiz-selection-list');
    if (!list) return;

    const bank = await getQuizBank();
    const profile = loadProfile();
    const levelInfo = getLevelInfo(profile.xp);
    const daily = getDailyChallenge(bank);
    const weaknesses = getWeaknesses();
    const streak = profile.streak;
    const todayKey = new Date().toISOString().slice(0, 10);

    // ── Header / HUD ──
    let headerHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-top:20px; margin-bottom:8px; flex-wrap:wrap; gap:16px;">
            <section class="section-title" style="margin:0; flex:1; min-width:260px;">
                <span class="concept-card-category" style="color:var(--accent-purple); font-size:0.9rem; font-weight:800;">Academic Assessment</span>
                <h2>Nextron Quiz Arena</h2>
                <p>Test your knowledge, earn XP, unlock achievements, and climb the leaderboard.</p>
            </section>
            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                <a href="#/quiz-analytics" class="btn btn-secondary" style="padding:8px 14px; font-size:0.82rem; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="bar-chart-2" style="width:14px;height:14px;"></i> Analytics
                </a>
                <a href="#/leaderboard" class="btn btn-secondary" style="padding:8px 14px; font-size:0.82rem; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="trophy" style="width:14px;height:14px;"></i> Leaderboard
                </a>
                <button id="btn-dev-unlock" class="btn btn-primary" style="background:linear-gradient(135deg,var(--success),var(--accent-secondary));border:none;padding:8px 14px;border-radius:var(--border-radius-sm);font-size:0.82rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="unlock" style="width:14px;height:14px;"></i> Dev Unlock
                </button>
                <button id="btn-reset-progress" class="btn btn-secondary" style="border:1px solid rgba(239,68,68,0.25);color:var(--error);background:rgba(239,68,68,0.05);padding:8px 14px;border-radius:var(--border-radius-sm);font-size:0.82rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Reset
                </button>
            </div>
        </div>

        <!-- XP / Level / Streak HUD -->
        <div class="glass-card" style="padding:16px 20px; margin-bottom:20px; display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:200px;">
                <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent-purple),var(--accent-secondary));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#fff;flex-shrink:0;">
                    ${levelInfo.level}
                </div>
                <div style="flex:1;">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;font-weight:600;">LEVEL ${levelInfo.level} — ${profile.xp} XP</div>
                    <div style="background:rgba(255,255,255,0.07);border-radius:99px;height:7px;overflow:hidden;">
                        <div style="width:${levelInfo.progress}%;height:100%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-secondary));border-radius:99px;transition:width 0.5s ease;"></div>
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:3px;">${levelInfo.xpToNext} XP to Level ${levelInfo.level + 1}</div>
                </div>
            </div>
            <div style="display:flex; gap:16px; flex-wrap:wrap;">
                <div style="text-align:center;">
                    <div style="font-size:1.4rem;">🔥</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">Streak</div>
                    <div style="font-weight:800;font-size:1rem;color:var(--warning);">${streak.current} days</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.4rem;">🏆</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">Best</div>
                    <div style="font-weight:800;font-size:1rem;">${streak.best} days</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.4rem;">🎯</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">Quizzes</div>
                    <div style="font-weight:800;font-size:1rem;">${profile.totalQuizzes}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.4rem;">🏅</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">Badges</div>
                    <div style="font-weight:800;font-size:1rem;">${profile.achievements.length}</div>
                </div>
            </div>
        </div>

        <!-- Daily Challenge Card -->
        <div class="glass-card" id="daily-challenge-card" data-daily-key="${daily.quizKey}" style="padding:18px 22px; margin-bottom:24px; border-color:rgba(251,191,36,0.35); background:linear-gradient(135deg,rgba(251,191,36,0.07),rgba(245,158,11,0.04)); cursor:pointer; position:relative; overflow:hidden;">
            <div style="position:absolute;top:-10px;right:-10px;font-size:4rem;opacity:0.08;">⭐</div>
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="font-size:2rem;">📅</div>
                <div style="flex:1;">
                    <div style="font-size:0.7rem;font-weight:800;color:var(--warning);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;">Daily Challenge</div>
                    <div style="font-weight:700;font-size:1rem;">${CATEGORIES[daily.quizKey]?.label || daily.quizKey} — ${daily.questions.length} Questions</div>
                    <div style="font-size:0.8rem;color:var(--text-muted);">Bonus +${75} XP ${daily.completed ? '✅ Completed today!' : '• Resets at midnight'}</div>
                </div>
                ${daily.completed
                    ? `<div style="background:rgba(16,185,129,0.15);color:var(--success);padding:6px 12px;border-radius:99px;font-size:0.8rem;font-weight:700;">Done ✓</div>`
                    : `<div style="background:rgba(251,191,36,0.15);color:var(--warning);padding:6px 12px;border-radius:99px;font-size:0.8rem;font-weight:700;">Start →</div>`
                }
            </div>
        </div>

        ${weaknesses.length > 0 ? `
        <!-- Weak Areas Recommendations -->
        <div class="glass-card" style="padding:16px 20px; margin-bottom:20px; border-color:rgba(239,68,68,0.2);">
            <div style="font-size:0.72rem;font-weight:800;color:var(--error);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">📌 Recommended for You — Weak Areas</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${weaknesses.map(w => `
                    <button class="quiz-weak-btn" data-key="${w.quizKey}" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:var(--text-primary);padding:6px 12px;border-radius:99px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;">
                        ${CATEGORIES[w.quizKey]?.icon || '📚'} ${w.label} <span style="color:var(--error);font-weight:700;">×${w.count}</span>
                    </button>
                `).join('')}
            </div>
        </div>` : ''}

        <!-- Subject list header -->
        <div style="font-size:0.72rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">All Subjects</div>
    `;

    // ── Subject Cards ──
    let cardsHtml = '';
    for (const key in bank) {
        const course = bank[key];
        const record = AppState.completedQuizzes[key];
        const rank = profile.subjectRanks?.[key];
        const cat = CATEGORIES[key] || {};
        const recordHTML = record !== undefined
            ? `<span style="color:var(--success);font-weight:bold;font-size:0.82rem;display:flex;align-items:center;gap:4px;"><i data-lucide="check-circle" style="width:13px;height:13px;"></i> ${record}%</span>`
            : `<span style="color:var(--text-muted);font-size:0.82rem;">Not started</span>`;
        const rankBadge = rank ? `<span style="background:rgba(139,92,246,0.12);color:var(--accent-purple);border:1px solid rgba(139,92,246,0.25);padding:2px 8px;border-radius:99px;font-size:0.7rem;font-weight:700;margin-left:6px;">${rank}</span>` : '';
        const qCount = course.questions.length;
        cardsHtml += `
            <div class="glass-card concept-card" style="flex-direction:row;justify-content:space-between;align-items:center;padding:18px 22px;cursor:pointer;border-left:3px solid ${cat.color || 'var(--accent-secondary)'};" data-course-key="${key}">
                <div style="display:flex;align-items:center;gap:16px;">
                    <div style="font-size:1.8rem;width:44px;text-align:center;">${cat.icon || '📚'}</div>
                    <div>
                        <div style="display:flex;align-items:center;gap:4px;margin-bottom:3px;">
                            <h3 style="margin-bottom:0;font-size:1.05rem;">${course.title}</h3>
                            ${rankBadge}
                        </div>
                        <p style="margin-bottom:0;font-size:0.82rem;color:var(--text-muted);">${qCount} Questions • Easy / Medium / Hard / Expert</p>
                    </div>
                </div>
                <div style="text-align:right;">
                    ${recordHTML}
                </div>
            </div>
        `;
    }

    list.innerHTML = headerHtml + `<div style="display:flex;flex-direction:column;gap:12px;">${cardsHtml}</div>`;
    if (window.lucide) window.lucide.createIcons();

    // Bind cards
    document.querySelectorAll('[data-course-key]').forEach(card => {
        card.addEventListener('click', e => {
            startQuiz(e.currentTarget.getAttribute('data-course-key'), false);
        });
    });

    // Bind daily
    document.getElementById('daily-challenge-card')?.addEventListener('click', () => {
        if (!daily.completed) startDailyChallenge(daily);
        else AppState.showToast?.('Daily challenge already completed today!', 'info');
    });

    // Bind weak area recommendations
    document.querySelectorAll('.quiz-weak-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            startQuiz(e.currentTarget.getAttribute('data-key'), false);
        });
    });

    // Bind dev / reset
    document.getElementById('btn-dev-unlock')?.addEventListener('click', async () => {
        if (confirm('Activate developer test mode? Instantly completes all quizzes.')) {
            const allKeys = Object.keys(await getQuizBank());
            AppState.completedQuizzes = {};
            allKeys.forEach(k => { AppState.completedQuizzes[k] = 100; });
            localStorage.setItem('ece-student-quizzes', JSON.stringify(AppState.completedQuizzes));
            AppState.showToast?.('Developer mode: all sectors unlocked!', 'success');
            renderCourseSelection();
        }
    });
    document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
        if (confirm('Reset ALL quiz progress?')) {
            AppState.completedQuizzes = {};
            localStorage.removeItem('ece-student-quizzes');
            AppState.showToast?.('Progress reset.', 'info');
            renderCourseSelection();
        }
    });
}

// ─── DAILY CHALLENGE LAUNCHER ────────────────────────────────────────────────
function startDailyChallenge(daily) {
    isDaily = true;
    activeQuizKey = daily.quizKey;
    activeLevel = 'mixed';
    activeBattleMode = 'normal';
    activeTimedMode = '10min';
    quizQuestions = daily.questions;
    currentQuestionIndex = 0;
    quizScore = 0;
    perQuestionResults = [];
    sessionXpEarned = 0;
    sessionStartTime = Date.now();
    sessionTotalSeconds = 600;
    sessionSecondsLeft = 600;
    renderActiveQuestion();
}

// ─── START QUIZ (lobby) ───────────────────────────────────────────────────────
async function startQuiz(key, dailyMode) {
    isDaily = !!dailyMode;
    activeQuizKey = key;
    const bank = await getQuizBank();
    const course = bank[key];
    const mountPoint = document.getElementById('quiz-mount-point');
    if (!mountPoint) return;

    mountPoint.innerHTML = `
        <div class="quiz-welcome-view fade-in">
            <div style="margin-bottom:20px;">
                <button class="btn btn-secondary" id="btn-back-to-selection" style="padding:8px 16px;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="arrow-left"></i> Back to Arena
                </button>
            </div>

            <section class="section-title" style="margin-bottom:28px;">
                <span class="concept-card-category" style="color:var(--accent-secondary);font-size:0.9rem;font-weight:800;">
                    ${CATEGORIES[key]?.icon || '📚'} ${course.title}
                </span>
                <h2>Configure Your Quiz</h2>
                <p>Select difficulty, time mode, and battle style. Higher difficulty = more XP.</p>
            </section>

            <!-- Difficulty -->
            <div style="margin-bottom:24px;">
                <div style="font-size:0.72rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">1. Select Difficulty</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;" id="difficulty-grid">
                    ${DIFFICULTIES.map(d => {
                        const count = bank[key].questions.filter(q => q.difficulty === d.id).length;
                        return `
                        <div class="quiz-config-card ${d.id === 'easy' ? 'selected' : ''}" data-difficulty="${d.id}"
                             style="padding:16px;border-radius:var(--border-radius-sm);border:2px solid ${d.id === 'easy' ? d.color : 'var(--border-color)'};background:${d.id === 'easy' ? `${d.color}18` : 'rgba(255,255,255,0.03)'};cursor:pointer;transition:all 0.2s;">
                            <div style="font-size:1.4rem;margin-bottom:6px;">${d.icon}</div>
                            <div style="font-weight:700;font-size:0.95rem;margin-bottom:2px;">${d.label}</div>
                            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${d.desc}</div>
                            <div style="display:flex;justify-content:space-between;font-size:0.72rem;">
                                <span style="color:${d.color};font-weight:600;">×${d.multiplier} XP</span>
                                <span style="color:var(--text-muted);">${count} Qs</span>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <!-- Timed Mode -->
            <div style="margin-bottom:24px;">
                <div style="font-size:0.72rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">2. Select Time Mode</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;" id="timed-mode-grid">
                    ${TIMED_MODES.map((m, i) => `
                        <button class="quiz-pill-btn ${i === 0 ? 'active' : ''}" data-timed="${m.id}"
                                style="padding:8px 16px;border-radius:99px;border:1px solid ${i === 0 ? 'var(--accent-secondary)' : 'var(--border-color)'};background:${i === 0 ? 'rgba(99,102,241,0.12)' : 'transparent'};color:${i === 0 ? 'var(--accent-secondary)' : 'var(--text-muted)'};font-size:0.82rem;font-weight:600;cursor:pointer;transition:all 0.2s;">
                            ${m.icon} ${m.label}
                        </button>`).join('')}
                </div>
            </div>

            <!-- Battle Mode -->
            <div style="margin-bottom:28px;">
                <div style="font-size:0.72rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;">3. Battle Mode</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;" id="battle-mode-grid">
                    ${BATTLE_MODES.map((m, i) => `
                        <button class="quiz-pill-btn ${i === 0 ? 'active' : ''}" data-battle="${m.id}"
                                style="padding:8px 16px;border-radius:99px;border:1px solid ${i === 0 ? 'var(--accent-secondary)' : 'var(--border-color)'};background:${i === 0 ? 'rgba(99,102,241,0.12)' : 'transparent'};color:${i === 0 ? 'var(--accent-secondary)' : 'var(--text-muted)'};font-size:0.82rem;font-weight:600;cursor:pointer;transition:all 0.2s;">
                            ${m.icon} ${m.label}
                            <span style="font-size:0.68rem;opacity:0.7;margin-left:4px;">${m.desc}</span>
                        </button>`).join('')}
                </div>
            </div>

            <button id="btn-start-quiz" class="btn btn-primary" style="width:100%;padding:14px;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;">
                <i data-lucide="zap"></i> Start Quiz
            </button>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Back
    document.getElementById('btn-back-to-selection').addEventListener('click', () => window.appRouter.handleRouting());

    // Difficulty selection
    let selectedDifficulty = 'easy';
    document.querySelectorAll('[data-difficulty]').forEach(card => {
        card.addEventListener('click', e => {
            selectedDifficulty = e.currentTarget.getAttribute('data-difficulty');
            document.querySelectorAll('[data-difficulty]').forEach(c => {
                const d = DIFFICULTIES.find(d => d.id === c.getAttribute('data-difficulty'));
                c.style.borderColor = c === e.currentTarget ? d.color : 'var(--border-color)';
                c.style.background = c === e.currentTarget ? `${d.color}18` : 'rgba(255,255,255,0.03)';
            });
        });
    });

    // Timed mode
    let selectedTimed = 'practice';
    document.querySelectorAll('[data-timed]').forEach(btn => {
        btn.addEventListener('click', e => {
            selectedTimed = e.currentTarget.getAttribute('data-timed');
            document.querySelectorAll('[data-timed]').forEach(b => {
                const active = b === e.currentTarget;
                b.style.borderColor = active ? 'var(--accent-secondary)' : 'var(--border-color)';
                b.style.background = active ? 'rgba(99,102,241,0.12)' : 'transparent';
                b.style.color = active ? 'var(--accent-secondary)' : 'var(--text-muted)';
            });
        });
    });

    // Battle mode
    let selectedBattle = 'normal';
    document.querySelectorAll('[data-battle]').forEach(btn => {
        btn.addEventListener('click', e => {
            selectedBattle = e.currentTarget.getAttribute('data-battle');
            document.querySelectorAll('[data-battle]').forEach(b => {
                const active = b === e.currentTarget;
                b.style.borderColor = active ? 'var(--accent-secondary)' : 'var(--border-color)';
                b.style.background = active ? 'rgba(99,102,241,0.12)' : 'transparent';
                b.style.color = active ? 'var(--accent-secondary)' : 'var(--text-muted)';
            });
        });
    });

    document.getElementById('btn-start-quiz').addEventListener('click', () => {
        loadQuizQuestions(selectedDifficulty, selectedTimed, selectedBattle);
    });
}

// ─── LOAD QUESTIONS ───────────────────────────────────────────────────────────
async function loadQuizQuestions(level, timedMode, battleMode) {
    activeLevel = level;
    activeTimedMode = timedMode;
    activeBattleMode = battleMode;
    currentQuestionIndex = 0;
    quizScore = 0;
    perQuestionResults = [];
    sessionXpEarned = 0;
    sessionStartTime = Date.now();

    const bank = await getQuizBank();
    const allQuestions = bank[activeQuizKey].questions;
    let filtered = allQuestions.filter(q => q.difficulty === level);
    if (filtered.length === 0) filtered = allQuestions.slice(0, 5);

    // Shuffle
    quizQuestions = filtered.sort(() => Math.random() - 0.5);

    // Session timer
    const timedMeta = TIMED_MODES.find(m => m.id === timedMode);
    sessionTotalSeconds = timedMeta?.totalSeconds || null;
    sessionSecondsLeft = sessionTotalSeconds;

    renderActiveQuestion();
}

// ─── RENDER ACTIVE QUESTION ───────────────────────────────────────────────────
function renderActiveQuestion() {
    clearInterval(quizTimerId);
    const perQSeconds = activeBattleMode === 'lightning' ? 30 : 35;
    quizSecondsRemaining = perQSeconds;

    const mountPoint = document.getElementById('quiz-mount-point');
    if (!mountPoint) return;

    const q = quizQuestions[currentQuestionIndex];
    const totalQ = quizQuestions.length;
    const progressPercent = ((currentQuestionIndex) / totalQ) * 100;
    const profile = loadProfile();
    const levelInfo = getLevelInfo(profile.xp);
    const diffMeta = DIFFICULTIES.find(d => d.id === activeLevel) || DIFFICULTIES[0];
    const battleMeta = BATTLE_MODES.find(m => m.id === activeBattleMode) || BATTLE_MODES[0];

    mountPoint.innerHTML = `
        <!-- Sticky XP / Streak mini-HUD -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:rgba(0,0,0,0.3);border-radius:var(--border-radius-sm);margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;">
                    🔥 <span style="font-weight:700;color:var(--warning);">${profile.streak.current}d</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;">
                    ⭐ <span style="font-weight:700;color:var(--accent-secondary);">Lvl ${levelInfo.level}</span>
                    <span style="color:var(--text-muted);font-size:0.72rem;">${profile.xp} XP</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;">
                    <span style="background:${diffMeta.color}22;color:${diffMeta.color};padding:2px 8px;border-radius:99px;font-size:0.7rem;font-weight:700;">${diffMeta.icon} ${diffMeta.label}</span>
                </div>
                ${activeBattleMode !== 'normal' ? `<span style="background:rgba(239,68,68,0.12);color:var(--error);padding:2px 8px;border-radius:99px;font-size:0.7rem;font-weight:700;">${battleMeta.icon} ${battleMeta.label}</span>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                ${sessionXpEarned > 0 ? `<span style="color:var(--success);font-size:0.8rem;font-weight:700;">+${sessionXpEarned} XP this session</span>` : ''}
                ${sessionTotalSeconds ? `<div id="session-timer-display" style="font-family:monospace;font-weight:700;color:var(--accent-secondary);font-size:0.9rem;">⏱ --:--</div>` : ''}
            </div>
        </div>

        <div class="glass-card quiz-card fade-in" style="padding:28px;">
            <!-- Progress -->
            <div class="quiz-header">
                <span class="quiz-meta">Question ${currentQuestionIndex + 1} of ${totalQ}</span>
                <div class="quiz-timer" id="quiz-timer-box">
                    <i data-lucide="timer"></i> <span id="timer-sec">${perQSeconds}</span>s
                </div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width:${progressPercent}%;"></div>
            </div>

            <!-- Question -->
            <div class="question-text">${q.question}</div>

            <!-- Options -->
            <div class="answers-grid" id="options-container">
                ${q.options.map((opt, idx) => `
                    <button class="answer-option" data-option-idx="${idx}">
                        <div class="option-badge">${String.fromCharCode(65 + idx)}</div>
                        <span>${opt}</span>
                    </button>
                `).join('')}
            </div>

            <!-- Feedback -->
            <div class="quiz-feedback-box" id="feedback-drawer">
                <div class="feedback-title" id="feedback-hdr"></div>
                <p class="feedback-desc" id="feedback-txt"></p>
            </div>

            <!-- XP chip popup placeholder -->
            <div id="xp-chip" style="display:none;position:absolute;top:50%;right:28px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:6px 14px;border-radius:99px;font-weight:700;font-size:0.85rem;animation:xpFloat 1.2s ease forwards;">+0 XP</div>

            <!-- Footer -->
            <div class="quiz-footer">
                <button class="btn btn-primary" id="btn-next-question" style="display:none;">
                    Next Question <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Per-question timer
    const timerSec = document.getElementById('timer-sec');
    const timerBox = document.getElementById('quiz-timer-box');
    quizTimerId = setInterval(() => {
        quizSecondsRemaining--;
        timerSec.textContent = quizSecondsRemaining;
        if (quizSecondsRemaining <= 10) {
            timerBox.style.color = 'var(--error)';
            timerBox.style.background = 'rgba(239,68,68,0.1)';
        }
        if (quizSecondsRemaining <= 0) {
            clearInterval(quizTimerId);
            selectAnswer(-1, q.correctIndex, q.explanation + ' (Time expired!)');
        }
    }, 1000);

    // Session timer
    if (sessionTotalSeconds) {
        clearInterval(sessionTimerId);
        sessionTimerId = setInterval(() => {
            sessionSecondsLeft--;
            const el = document.getElementById('session-timer-display');
            if (el) {
                const m = Math.floor(sessionSecondsLeft / 60).toString().padStart(2, '0');
                const s = (sessionSecondsLeft % 60).toString().padStart(2, '0');
                el.textContent = `⏱ ${m}:${s}`;
                if (sessionSecondsLeft <= 60) el.style.color = 'var(--warning)';
                if (sessionSecondsLeft <= 30) el.style.color = 'var(--error)';
            }
            if (sessionSecondsLeft <= 0) {
                clearInterval(sessionTimerId);
                clearInterval(quizTimerId);
                AppState.showToast?.('Time is up! Auto-submitting...', 'warning');
                concludeQuiz();
            }
        }, 1000);
    }

    // Answer selection
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = parseInt(e.currentTarget.getAttribute('data-option-idx'));
            selectAnswer(idx, q.correctIndex, q.explanation);
        });
    });

    // Next
    document.getElementById('btn-next-question').addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQ) renderActiveQuestion();
        else concludeQuiz();
    });
}

// ─── SELECT ANSWER ────────────────────────────────────────────────────────────
function selectAnswer(selectedIdx, correctIdx, explanation) {
    clearInterval(quizTimerId);

    const optionsContainer = document.getElementById('options-container');
    const feedbackDrawer = document.getElementById('feedback-drawer');
    const feedbackHdr = document.getElementById('feedback-hdr');
    const feedbackTxt = document.getElementById('feedback-txt');
    const btnNext = document.getElementById('btn-next-question');

    optionsContainer.querySelectorAll('.answer-option').forEach((btn, idx) => {
        btn.classList.add('disabled');
        if (idx === correctIdx) btn.classList.add('correct');
        if (idx === selectedIdx && selectedIdx !== correctIdx) btn.classList.add('incorrect');
    });

    const isCorrect = selectedIdx === correctIdx;
    if (isCorrect) {
        quizScore++;
        feedbackHdr.className = 'feedback-title correct-text';
        feedbackHdr.innerHTML = '<i data-lucide="check-circle-2"></i> Correct Answer!';
        // XP chip animation
        const diffMeta = DIFFICULTIES.find(d => d.id === activeLevel) || DIFFICULTIES[0];
        const xpVal = Math.round(25 * diffMeta.multiplier);
        sessionXpEarned += xpVal;
        showXpChip(`+${xpVal} XP`);
    } else {
        feedbackHdr.className = 'feedback-title incorrect-text';
        feedbackHdr.innerHTML = selectedIdx === -1
            ? '<i data-lucide="alert-triangle"></i> Time Expired!'
            : '<i data-lucide="alert-triangle"></i> Incorrect Answer!';
        // Track weakness
        const q = quizQuestions[currentQuestionIndex];
        if (q) updateWeaknesses(activeQuizKey, [q.category || activeQuizKey]);
    }

    // Record result
    perQuestionResults.push({
        question: quizQuestions[currentQuestionIndex]?.question,
        options: quizQuestions[currentQuestionIndex]?.options,
        selectedIdx,
        correctIdx,
        explanation,
        correct: isCorrect,
    });

    feedbackTxt.innerHTML = explanation;
    feedbackDrawer.style.display = 'block';

    if (window.renderMathInElement) {
        window.renderMathInElement(feedbackTxt, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }

    if (window.lucide) window.lucide.createIcons();

    // Sudden Death: wrong = instant end
    if (activeBattleMode === 'sudden-death' && !isCorrect && selectedIdx !== -1) {
        btnNext.style.display = 'none';
        AppState.showToast?.('💀 Sudden Death — one mistake ends it!', 'error');
        setTimeout(() => concludeQuiz(), 1800);
        return;
    }

    btnNext.style.display = 'inline-flex';
}

function showXpChip(text) {
    const chip = document.getElementById('xp-chip');
    if (!chip) return;
    chip.textContent = text;
    chip.style.display = 'block';
    chip.style.opacity = '1';
    chip.style.transform = 'translateY(0)';
    setTimeout(() => {
        chip.style.transition = 'opacity 0.8s, transform 0.8s';
        chip.style.opacity = '0';
        chip.style.transform = 'translateY(-30px)';
        setTimeout(() => { chip.style.display = 'none'; }, 800);
    }, 700);
}

// ─── CONCLUDE QUIZ ────────────────────────────────────────────────────────────
async function concludeQuiz() {
    clearInterval(quizTimerId);
    clearInterval(sessionTimerId);

    const mountPoint = document.getElementById('quiz-mount-point');
    if (!mountPoint) return;

    const totalQ = quizQuestions.length;
    const finalScorePercent = totalQ > 0 ? Math.round((quizScore / totalQ) * 100) : 0;
    const passed = finalScorePercent >= 80;
    const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);

    // Save high score
    const currentHigh = AppState.completedQuizzes[activeQuizKey];
    if (currentHigh === undefined || finalScorePercent > currentHigh) {
        AppState.completedQuizzes[activeQuizKey] = finalScorePercent;
        localStorage.setItem('ece-student-quizzes', JSON.stringify(AppState.completedQuizzes));
    }

    // Process gamification
    const completedKeys = Object.keys(AppState.completedQuizzes);
    const result = processQuizCompletion({
        quizKey: activeQuizKey,
        difficulty: activeLevel,
        battleMode: activeBattleMode,
        timedMode: activeTimedMode,
        correct: quizScore,
        totalQ,
        durationSeconds,
        isDaily,
        completedKeys,
        username: AppState.currentUser?.username,
        college: AppState.currentUser?.college,
    });

    // Update AppState profile reference
    AppState.gamificationProfile = result.profile;

    const bank = await getQuizBank();
    const courseTitle = bank[activeQuizKey]?.title || activeQuizKey;
    const diffMeta = DIFFICULTIES.find(d => d.id === activeLevel) || DIFFICULTIES[0];

    // Save to Firestore if active
    if (isFirebaseActive) {
        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const attemptUserEmail = AppState.currentUser?.email || "guest@nextron.edu";
            const attemptUserName = AppState.currentUser?.username || "Guest";

            await addDoc(collection(db, "quizAttempts"), {
                userEmail: attemptUserEmail,
                quizKey: activeQuizKey,
                score: finalScorePercent,
                timestamp: new Date().toISOString(),
                durationSeconds: durationSeconds
            });

            await addDoc(collection(db, "activityLogs"), {
                action: "Quiz Attempt",
                user: attemptUserEmail,
                timestamp: new Date().toISOString(),
                details: `${attemptUserName} scored ${finalScorePercent}% in ${courseTitle} (Difficulty: ${activeLevel})`
            });
        } catch (e) {
            console.error("Failed to save quiz attempt / log to Firestore:", e);
        }
    }

    // Score ring SVG
    const angle = (finalScorePercent / 100) * 283;
    const ringColor = finalScorePercent >= 80 ? '#10b981' : finalScorePercent >= 50 ? '#f59e0b' : '#ef4444';

    // XP breakdown table
    const xpTableRows = result.xpBreakdown.map(r =>
        `<tr><td style="color:var(--text-muted);font-size:0.82rem;padding:3px 0;">${r.label}</td><td style="text-align:right;font-weight:700;color:var(--success);font-size:0.82rem;">+${r.xp} XP</td></tr>`
    ).join('');

    // New achievements HTML
    const newAchievementsHtml = result.newAchievements.length > 0
        ? `<div style="margin-top:20px;">
            <div style="font-size:0.72rem;font-weight:800;color:var(--warning);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">🏆 New Achievements Unlocked!</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                ${result.newAchievements.map(id => {
                    const ach = ACHIEVEMENT_REGISTRY.find(a => a.id === id);
                    if (!ach) return '';
                    return `<div class="achievement-unlock-card" style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:var(--border-radius-sm);padding:10px 14px;display:flex;align-items:center;gap:8px;animation:achievementPop 0.5s ease;">
                        <span style="font-size:1.6rem;">${ach.icon}</span>
                        <div><div style="font-weight:700;font-size:0.85rem;">${ach.name}</div><div style="font-size:0.72rem;color:var(--text-muted);">${ach.desc}</div></div>
                    </div>`;
                }).join('')}
            </div>
           </div>` : '';

    // Level up
    const levelUpHtml = result.leveledUp
        ? `<div class="glass-card" style="padding:14px 20px;margin-top:16px;border-color:rgba(139,92,246,0.4);background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.05));text-align:center;">
            <div style="font-size:1.8rem;margin-bottom:4px;">🚀</div>
            <div style="font-weight:800;font-size:1.1rem;color:var(--accent-purple);">Level Up! You are now Level ${result.newLevel}</div>
           </div>` : '';

    // Rank badge
    const rankHtml = result.rankResult?.promoted
        ? `<div style="margin-top:12px;padding:10px 16px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.25);border-radius:var(--border-radius-sm);font-size:0.85rem;">
            📈 Subject Rank Updated: <strong style="color:var(--accent-purple);">${result.rankResult.prevRank || 'New'} → ${result.rankResult.rank}</strong> in ${CATEGORIES[activeQuizKey]?.label || activeQuizKey}
           </div>` : '';

    const certSection = passed ? `
        <div class="glass-card" style="padding:18px;border-color:var(--border-glow);margin-top:20px;">
            <h3 style="color:var(--accent-secondary);margin-bottom:10px;font-size:1rem;display:flex;align-items:center;gap:6px;"><i data-lucide="award"></i> Claim Certificate</h3>
            <div style="display:flex;gap:10px;margin-bottom:8px;">
                <input type="text" id="cert-student-name" placeholder="Enter your full name" style="background:var(--bg-tertiary);border:1px solid var(--border-color);padding:10px;border-radius:var(--border-radius-sm);font-size:0.9rem;flex-grow:1;color:var(--text-primary);">
                <button class="btn btn-primary" id="btn-cert-generate">Generate PDF</button>
            </div>
        </div>` : '';

    mountPoint.innerHTML = `
        <div class="glass-card fade-in" style="padding:32px;text-align:center;" id="quiz-conclusion-box">

            <!-- Score Ring -->
            <div style="position:relative;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
                <svg width="120" height="120" style="transform:rotate(-90deg);">
                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="10"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="${ringColor}" stroke-width="10"
                            stroke-dasharray="${angle} ${283 - angle}" stroke-linecap="round"
                            style="transition:stroke-dasharray 1s ease;"/>
                </svg>
                <div style="position:absolute;text-align:center;">
                    <div style="font-size:1.6rem;font-weight:800;color:${ringColor};">${finalScorePercent}%</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);">${quizScore}/${totalQ}</div>
                </div>
            </div>

            <h2 style="margin-bottom:6px;color:${passed ? 'var(--success)' : 'var(--error)'};">
                ${passed ? '🎉 Mastery Secured!' : '📖 Keep Practicing!'}
            </h2>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:20px;">
                ${courseTitle} • ${diffMeta.label} • ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s
            </p>

            <!-- XP Breakdown -->
            <div class="glass-card" style="padding:16px;text-align:left;margin-bottom:12px;">
                <div style="font-size:0.72rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">XP Earned — +${result.totalXp} XP Total</div>
                <table style="width:100%;">${xpTableRows}</table>
            </div>

            ${rankHtml}
            ${levelUpHtml}
            ${newAchievementsHtml}
            ${certSection}

            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:24px;">
                <button class="btn btn-secondary" id="btn-quiz-review">
                    <i data-lucide="book-open"></i> Review Answers
                </button>
                <button class="btn btn-primary" id="btn-quiz-retry">
                    <i data-lucide="rotate-ccw"></i> Try Again
                </button>
                <a href="#/quiz-analytics" class="btn btn-outline">
                    <i data-lucide="bar-chart-2"></i> Analytics
                </a>
                <a href="#/concepts" class="btn btn-outline">
                    <i data-lucide="cpu"></i> Syllabus
                </a>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btn-quiz-retry')?.addEventListener('click', () => startQuiz(activeQuizKey, false));
    document.getElementById('btn-quiz-review')?.addEventListener('click', renderReviewMode);
    document.getElementById('btn-cert-generate')?.addEventListener('click', () => {
        const name = document.getElementById('cert-student-name')?.value.trim() || 'Honored ECE Scholar';
        renderPrintableCertificate(name, finalScorePercent);
    });
}

// ─── REVIEW MODE ─────────────────────────────────────────────────────────────
function renderReviewMode() {
    const mountPoint = document.getElementById('quiz-mount-point');
    if (!mountPoint) return;

    const bank = activeQuizBank || getMergedBank();
    const reviewCards = perQuestionResults.map((r, i) => {
        const isCorrect = r.correct;
        return `
            <div class="glass-card" style="padding:20px;border-left:4px solid ${isCorrect ? 'var(--success)' : 'var(--error)'};">
                <div style="font-size:0.72rem;font-weight:800;color:${isCorrect ? 'var(--success)' : 'var(--error)'};text-transform:uppercase;margin-bottom:6px;">
                    ${isCorrect ? '✅ Correct' : '❌ Incorrect'} — Question ${i + 1}
                </div>
                <div style="font-weight:600;margin-bottom:12px;">${r.question}</div>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
                    ${(r.options || []).map((opt, idx) => {
                        let bg = 'rgba(255,255,255,0.03)';
                        let border = 'var(--border-color)';
                        let label = '';
                        if (idx === r.correctIdx) { bg = 'rgba(16,185,129,0.1)'; border = 'rgba(16,185,129,0.4)'; label = ' ✓ Correct'; }
                        if (idx === r.selectedIdx && idx !== r.correctIdx) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.4)'; label = ' ✗ Your Answer'; }
                        return `<div style="padding:8px 12px;border-radius:var(--border-radius-sm);border:1px solid ${border};background:${bg};font-size:0.85rem;">
                            <strong>${String.fromCharCode(65+idx)}.</strong> ${opt}${label ? `<strong style="margin-left:6px;">${label}</strong>` : ''}
                        </div>`;
                    }).join('')}
                </div>
                <div style="padding:10px 14px;background:rgba(99,102,241,0.07);border-radius:var(--border-radius-sm);font-size:0.82rem;color:var(--text-secondary);">
                    💡 ${r.explanation}
                </div>
                ${!isCorrect ? `<div style="margin-top:8px;">
                    <a href="#/concepts" style="font-size:0.78rem;color:var(--accent-secondary);text-decoration:none;">📖 Study this topic in Concepts →</a>
                </div>` : ''}
            </div>
        `;
    }).join('');

    mountPoint.innerHTML = `
        <div class="fade-in">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                <button class="btn btn-secondary" id="btn-review-back" style="padding:8px 16px;">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <h3 style="margin:0;">Answer Review — ${bank[activeQuizKey]?.title}</h3>
            </div>
            <div style="display:flex;flex-direction:column;gap:14px;">
                ${reviewCards}
            </div>
            <div style="display:flex;gap:10px;margin-top:24px;justify-content:center;">
                <button class="btn btn-primary" id="btn-review-retry">
                    <i data-lucide="rotate-ccw"></i> Try Again
                </button>
                <button class="btn btn-secondary" id="btn-review-home">
                    <i data-lucide="home"></i> Quiz Arena
                </button>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    
    if (window.renderMathInElement) {
        window.renderMathInElement(mountPoint, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
    document.getElementById('btn-review-back')?.addEventListener('click', concludeQuiz);
    document.getElementById('btn-review-retry')?.addEventListener('click', () => startQuiz(activeQuizKey, false));
    document.getElementById('btn-review-home')?.addEventListener('click', () => window.appRouter.handleRouting());
}

// ─── CERTIFICATE ─────────────────────────────────────────────────────────────
function renderPrintableCertificate(name, score) {
    const mountPoint = document.getElementById('quiz-mount-point');
    if (!mountPoint) return;

    const bank = activeQuizBank || getMergedBank();
    const courseTitle = bank[activeQuizKey].title.replace('Quiz', 'Module');
    const currentDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    mountPoint.innerHTML = `
        <div class="certificate-preview-card fade-in">
            <h2>Your Achievement Certificate</h2>
            <p>Press the Print button to save as PDF.</p>
            <div class="certificate-frame" id="printable-cert-area">
                <div class="cert-title">CERTIFICATE OF MASTERY</div>
                <div class="cert-sub">Electronics &amp; Communication Engineering</div>
                <p style="margin-bottom:12px;font-size:0.9rem;font-style:italic;color:var(--text-muted);">This document honors</p>
                <div class="cert-name">${name}</div>
                <p class="cert-body">
                    for demonstrating outstanding engineering understanding in successfully completing
                    <br><strong style="color:var(--accent-secondary);font-size:1.1rem;display:inline-block;margin-top:6px;">${courseTitle}</strong>
                    <br><span style="font-size:0.9rem;margin-top:4px;display:inline-block;">Final Score: ${score}%</span>
                </p>
                <div class="cert-footer-row">
                    <div class="cert-signature">
                        <div class="cert-sig-line">Nextron</div>
                        <div class="cert-sig-label">AUTHORIZED SPONSOR</div>
                    </div>
                    <div class="cert-signature">
                        <div class="cert-sig-line" style="font-size:0.85rem;">${currentDate}</div>
                        <div class="cert-sig-label">DATE VERIFIED</div>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
                <button class="btn btn-primary" id="btn-cert-print"><i data-lucide="printer"></i> Print / Save PDF</button>
                <button class="btn btn-secondary" id="btn-quiz-exit"><i data-lucide="home"></i> Exit Arena</button>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    document.getElementById('btn-cert-print')?.addEventListener('click', () => window.print());
    document.getElementById('btn-quiz-exit')?.addEventListener('click', () => { window.location.hash = '#/'; });
}
