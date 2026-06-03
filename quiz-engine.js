/**
 * Nextron Quiz Arena — Gamification Engine
 * Pure logic module: no DOM, no side effects beyond localStorage.
 * Importable from quiz.js, quiz-analytics.js, quiz-leaderboard.js.
 */

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const XP_PER_CORRECT = { easy: 25, medium: 25, hard: 25, expert: 25 };
export const XP_COMPLETION   = 150;
export const XP_GOOD_SCORE   = 75;
export const XP_PERFECT      = 120;
export const XP_DAILY        = 75;
export const XP_STREAK_BONUS = { 3: 50, 7: 100, 14: 200, 30: 500 };

export const DIFFICULTIES = [
    { id: 'easy',   label: 'Easy',   icon: '🟢', color: '#10b981', multiplier: 1.0, time: 35, desc: 'Core definitions & basic properties' },
    { id: 'medium', label: 'Medium', icon: '🟡', color: '#f59e0b', multiplier: 1.5, time: 35, desc: 'Intermediate logic & schematic calculations' },
    { id: 'hard',   label: 'Hard',   icon: '🔴', color: '#ef4444', multiplier: 2.0, time: 35, desc: 'Advanced formulas & mathematical theorems' },
    { id: 'expert', label: 'Expert', icon: '🟣', color: '#8b5cf6', multiplier: 3.0, time: 45, desc: 'Derivation-level & multi-step analysis' },
];

export const TIMED_MODES = [
    { id: 'practice',  label: 'Practice Mode',       icon: '📖', totalSeconds: null,  desc: 'No time pressure — learn at your own pace' },
    { id: '5min',      label: '5 Min Challenge',      icon: '⚡', totalSeconds: 300,   desc: 'Complete as many as you can in 5 minutes' },
    { id: '10min',     label: '10 Min Challenge',     icon: '🏃', totalSeconds: 600,   desc: 'Balanced speed challenge' },
    { id: '20min',     label: '20 Min Challenge',     icon: '🎯', totalSeconds: 1200,  desc: 'Thorough timed assessment' },
];

export const BATTLE_MODES = [
    { id: 'normal',        label: 'Normal',          icon: '🎮', desc: 'Standard quiz experience' },
    { id: 'sudden-death',  label: 'Sudden Death',    icon: '💀', desc: 'One wrong answer ends the quiz' },
    { id: 'lightning',     label: 'Lightning Round', icon: '⚡', desc: '30 seconds per question — no exceptions' },
];

export const SUBJECT_RANK_TIERS = ['Beginner', 'Explorer', 'Practitioner', 'Expert', 'Master'];
export const SUBJECT_RANK_THRESHOLDS = [0, 55, 72, 88, 96]; // score % needed

export const CATEGORIES = {
    'pn-junction':     { label: 'PN Junction Diode',    icon: '🔬', color: '#06b6d4' },
    'transistor':      { label: 'BJT Transistors',       icon: '📡', color: '#8b5cf6' },
    'logic-gates':     { label: 'Digital Logic',         icon: '⚙️',  color: '#f59e0b' },
    'flip-flops':      { label: 'Flip-Flops',            icon: '🔁', color: '#10b981' },
    'signals':         { label: 'Signals & Systems',     icon: '〰️', color: '#3b82f6' },
    'networks':        { label: 'Network Theory',        icon: '🔌', color: '#ec4899' },
    'microcontrollers':{ label: 'Microprocessors',       icon: '💾', color: '#f97316' },
    'dsp':             { label: 'DSP',                   icon: '🎛️',  color: '#14b8a6' },
    'comms':           { label: 'Communications',        icon: '📶', color: '#a855f7' },
    'vlsi':            { label: 'VLSI Design',           icon: '🖥️',  color: '#0ea5e9' },
    'embedded':        { label: 'Embedded Systems',      icon: '🤖', color: '#22c55e' },
    'optical':         { label: 'Optical & Microwave',   icon: '💡', color: '#eab308' },
};

export const ACHIEVEMENT_REGISTRY = [
    { id: 'first_quiz',      name: 'First Steps',        icon: '🎓', desc: 'Complete your first quiz', secret: false },
    { id: 'quiz_5',          name: 'Quiz Enthusiast',    icon: '🗺️',  desc: 'Complete 5 quizzes',       secret: false },
    { id: 'quiz_10',         name: 'Quiz Explorer',      icon: '⚔️',  desc: 'Complete 10 quizzes',      secret: false },
    { id: 'quiz_25',         name: 'Quiz Veteran',       icon: '🏅', desc: 'Complete 25 quizzes',      secret: false },
    { id: 'quiz_50',         name: 'Quiz Legend',        icon: '🏆', desc: 'Complete 50 quizzes',      secret: false },
    { id: 'perfect_score',   name: 'Perfect Score',      icon: '💯', desc: '100% on any quiz',         secret: false },
    { id: 'perfect_3',       name: 'Perfectionist',      icon: '✨', desc: '3 perfect scores',         secret: true  },
    { id: 'fast_thinker',    name: 'Fast Thinker',       icon: '⚡', desc: 'Finish a quiz in under 90s',secret: false },
    { id: 'streak_3',        name: 'On a Roll',          icon: '🔥', desc: '3-day learning streak',    secret: false },
    { id: 'streak_7',        name: 'Week Warrior',       icon: '🗡️',  desc: '7-day learning streak',    secret: false },
    { id: 'streak_14',       name: 'Dedicated Scholar',  icon: '📚', desc: '14-day learning streak',   secret: true  },
    { id: 'streak_30',       name: 'Unstoppable',        icon: '🌟', desc: '30-day learning streak',   secret: true  },
    { id: 'expert_pass',     name: 'Expert Slayer',      icon: '🐉', desc: 'Pass Expert difficulty',   secret: false },
    { id: 'sudden_death_win',name: 'No Mercy',           icon: '💀', desc: 'Complete Sudden Death mode',secret: false },
    { id: 'daily_1',         name: 'Daily Grinder',      icon: '📅', desc: 'Complete a daily challenge',secret: false },
    { id: 'daily_7',         name: 'Daily Champion',     icon: '🎖️',  desc: '7 daily challenges done', secret: true  },
    { id: 'level_5',         name: 'Rising Engineer',    icon: '🚀', desc: 'Reach Level 5',            secret: false },
    { id: 'level_10',        name: 'Senior Engineer',    icon: '🌠', desc: 'Reach Level 10',           secret: true  },
    { id: 'all_subjects',    name: 'Renaissance Engineer', icon: '🎭', desc: 'Complete all 12 subjects',secret: true  },
    { id: 'signals_master',  name: 'Signals Master',     icon: '〰️', desc: '≥90% on Signals quiz',    secret: false },
    { id: 'dsp_master',      name: 'DSP Guru',           icon: '🎛️',  desc: '≥90% on DSP quiz',        secret: false },
    { id: 'diode_expert',    name: 'Diode Wizard',       icon: '🔬', desc: '≥90% on PN Junction quiz', secret: false },
    { id: 'comms_expert',    name: 'Comms Guru',         icon: '📶', desc: '≥90% on Comms quiz',      secret: false },
];

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────

const KEY_PROFILE     = 'ece-quiz-gamification';
const KEY_HISTORY     = 'ece-quiz-history';
const KEY_WEAKNESSES  = 'ece-quiz-weaknesses';
const KEY_DAILY       = 'ece-quiz-daily';
const KEY_LEADERBOARD = 'ece-leaderboard';

// ─── PROFILE ──────────────────────────────────────────────────────────────────

export function createDefaultProfile() {
    return {
        xp: 0, level: 1,
        streak: { current: 0, best: 0, lastActiveDate: null },
        achievements: [],
        perfectScores: 0,
        subjectRanks: {},
        totalQuizzes: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        dailyChallengesCompleted: 0,
    };
}

export function loadProfile() {
    try {
        const raw = localStorage.getItem(KEY_PROFILE);
        if (raw) return { ...createDefaultProfile(), ...JSON.parse(raw) };
    } catch(e) {}
    return createDefaultProfile();
}

export function saveProfile(profile) {
    localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
}

// ─── XP & LEVELLING ───────────────────────────────────────────────────────────

export function xpThresholdForLevel(level) {
    // Threshold(n) = floor(100 * n^1.6)
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level - 1, 1.6));
}

export function getLevelInfo(xp) {
    let level = 1;
    while (xpThresholdForLevel(level + 1) <= xp) level++;
    const currentThreshold = xpThresholdForLevel(level);
    const nextThreshold = xpThresholdForLevel(level + 1);
    const progress = nextThreshold > currentThreshold
        ? Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
        : 100;
    return { level, progress, xpInLevel: xp - currentThreshold, xpToNext: nextThreshold - xp };
}

export function awardXp(profile, amount) {
    const before = getLevelInfo(profile.xp);
    profile.xp += Math.max(0, amount);
    const after = getLevelInfo(profile.xp);
    profile.level = after.level;
    const leveledUp = after.level > before.level;
    return { leveledUp, newLevel: after.level, xpAwarded: amount };
}

// ─── STREAK ───────────────────────────────────────────────────────────────────

export function updateStreak(profile) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const last = profile.streak.lastActiveDate;
    let bonusXp = 0;

    if (last === today) return { maintained: true, bonusXp: 0 }; // already counted today

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === yesterday) {
        profile.streak.current++;
    } else if (last !== today) {
        profile.streak.current = 1; // reset
    }

    profile.streak.lastActiveDate = today;
    if (profile.streak.current > profile.streak.best) profile.streak.best = profile.streak.current;

    // Check milestone bonuses
    const milestones = [3, 7, 14, 30];
    for (const m of milestones) {
        if (profile.streak.current === m) bonusXp += XP_STREAK_BONUS[m] || 0;
    }
    return { maintained: false, bonusXp, streak: profile.streak.current };
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

export function checkAchievements(profile, quizResult) {
    const unlocked = [];
    const earned = new Set(profile.achievements);

    const tryUnlock = (id) => {
        if (!earned.has(id)) { earned.add(id); unlocked.push(id); }
    };

    // Quiz count
    if (profile.totalQuizzes >= 1)  tryUnlock('first_quiz');
    if (profile.totalQuizzes >= 5)  tryUnlock('quiz_5');
    if (profile.totalQuizzes >= 10) tryUnlock('quiz_10');
    if (profile.totalQuizzes >= 25) tryUnlock('quiz_25');
    if (profile.totalQuizzes >= 50) tryUnlock('quiz_50');

    // Perfect score
    if (quizResult && quizResult.scorePercent === 100) {
        tryUnlock('perfect_score');
        if (profile.perfectScores >= 3) tryUnlock('perfect_3');
    }

    // Speed
    if (quizResult && quizResult.durationSeconds <= 90 && quizResult.totalQ >= 3) {
        tryUnlock('fast_thinker');
    }

    // Streak
    const streak = profile.streak.current;
    if (streak >= 3)  tryUnlock('streak_3');
    if (streak >= 7)  tryUnlock('streak_7');
    if (streak >= 14) tryUnlock('streak_14');
    if (streak >= 30) tryUnlock('streak_30');

    // Expert / battle
    if (quizResult && quizResult.difficulty === 'expert' && quizResult.scorePercent >= 60) {
        tryUnlock('expert_pass');
    }
    if (quizResult && quizResult.battleMode === 'sudden-death' && quizResult.completed) {
        tryUnlock('sudden_death_win');
    }

    // Daily
    if (profile.dailyChallengesCompleted >= 1) tryUnlock('daily_1');
    if (profile.dailyChallengesCompleted >= 7) tryUnlock('daily_7');

    // Level
    if (profile.level >= 5)  tryUnlock('level_5');
    if (profile.level >= 10) tryUnlock('level_10');

    // Subject mastery
    if (quizResult && quizResult.scorePercent >= 90) {
        if (quizResult.quizKey === 'signals')     tryUnlock('signals_master');
        if (quizResult.quizKey === 'dsp')         tryUnlock('dsp_master');
        if (quizResult.quizKey === 'pn-junction') tryUnlock('diode_expert');
        if (quizResult.quizKey === 'comms')       tryUnlock('comms_expert');
    }

    // All subjects — check completedQuizzes from AppState via passed param
    if (quizResult && quizResult.completedKeys && quizResult.completedKeys.length >= 12) {
        tryUnlock('all_subjects');
    }

    profile.achievements = [...earned];
    return unlocked; // array of newly unlocked IDs
}

// ─── SUBJECT RANKS ────────────────────────────────────────────────────────────

export function updateSubjectRank(profile, subjectKey, scorePercent) {
    let rankIdx = 0;
    for (let i = SUBJECT_RANK_THRESHOLDS.length - 1; i >= 0; i--) {
        if (scorePercent >= SUBJECT_RANK_THRESHOLDS[i]) { rankIdx = i; break; }
    }
    const rank = SUBJECT_RANK_TIERS[rankIdx];
    const prevRank = profile.subjectRanks[subjectKey];
    const promoted = !prevRank || SUBJECT_RANK_TIERS.indexOf(rank) > SUBJECT_RANK_TIERS.indexOf(prevRank);
    profile.subjectRanks[subjectKey] = rank;
    return { rank, promoted, prevRank };
}

// ─── QUIZ HISTORY & ANALYTICS ─────────────────────────────────────────────────

export function logQuizHistory(entry) {
    try {
        const raw = localStorage.getItem(KEY_HISTORY);
        const history = raw ? JSON.parse(raw) : [];
        history.push({ ...entry, timestamp: Date.now() });
        // Keep last 200 entries
        if (history.length > 200) history.splice(0, history.length - 200);
        localStorage.setItem(KEY_HISTORY, JSON.stringify(history));
    } catch(e) {}
}

export function getQuizHistory() {
    try {
        const raw = localStorage.getItem(KEY_HISTORY);
        return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
}

export function getAnalytics() {
    const history = getQuizHistory();
    if (!history.length) return null;

    const totalQuizzes = history.length;
    const totalCorrect = history.reduce((s, e) => s + (e.correct || 0), 0);
    const totalQuestions = history.reduce((s, e) => s + (e.totalQ || 0), 0);
    const scores = history.map(e => e.scorePercent || 0);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = Math.max(...scores, 0);
    const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Per-subject averages
    const subjectMap = {};
    history.forEach(e => {
        if (!e.quizKey) return;
        if (!subjectMap[e.quizKey]) subjectMap[e.quizKey] = { total: 0, count: 0 };
        subjectMap[e.quizKey].total += e.scorePercent || 0;
        subjectMap[e.quizKey].count++;
    });
    const subjectAverages = {};
    for (const k in subjectMap) {
        subjectAverages[k] = Math.round(subjectMap[k].total / subjectMap[k].count);
    }

    // Weekly activity: last 7 days quiz counts
    const now = Date.now();
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const dayStart = now - (6 - i) * 86400000;
        const dayEnd = dayStart + 86400000;
        return history.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
    });

    // Recent trend: last 20 scores
    const recentScores = history.slice(-20).map(e => e.scorePercent || 0);

    return { totalQuizzes, totalCorrect, totalQuestions, avgScore, bestScore, accuracy, subjectAverages, weeklyActivity, recentScores };
}

// ─── WEAKNESS TRACKING ────────────────────────────────────────────────────────

export function updateWeaknesses(quizKey, wrongTopics) {
    try {
        const raw = localStorage.getItem(KEY_WEAKNESSES);
        const data = raw ? JSON.parse(raw) : {};
        wrongTopics.forEach(topic => {
            const key = `${quizKey}:${topic}`;
            data[key] = (data[key] || 0) + 1;
        });
        localStorage.setItem(KEY_WEAKNESSES, JSON.stringify(data));
    } catch(e) {}
}

export function getWeaknesses() {
    try {
        const raw = localStorage.getItem(KEY_WEAKNESSES);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([key, count]) => {
                const [quizKey] = key.split(':');
                return { quizKey, count, label: CATEGORIES[quizKey]?.label || quizKey };
            });
    } catch(e) { return []; }
}

// ─── DAILY CHALLENGE ─────────────────────────────────────────────────────────

export function getDailyChallenge(quizBank) {
    const today = new Date().toISOString().slice(0, 10);
    try {
        const raw = localStorage.getItem(KEY_DAILY);
        const saved = raw ? JSON.parse(raw) : null;
        if (saved && saved.date === today) return saved;
    } catch(e) {}

    // Deterministic seed from date
    const seed = parseInt(today.replace(/-/g, ''), 10);
    const keys = Object.keys(quizBank);
    const subjectKey = keys[seed % keys.length];
    const allQ = quizBank[subjectKey]?.questions || [];

    // Pick 5 questions deterministically
    const shuffled = [...allQ].sort((a, b) => {
        const ha = simpleHash(JSON.stringify(a) + seed);
        const hb = simpleHash(JSON.stringify(b) + seed);
        return ha - hb;
    }).slice(0, 5);

    const challenge = { date: today, quizKey: subjectKey, questions: shuffled, completed: false };
    localStorage.setItem(KEY_DAILY, JSON.stringify(challenge));
    return challenge;
}

export function markDailyChallengeComplete() {
    try {
        const raw = localStorage.getItem(KEY_DAILY);
        if (!raw) return;
        const data = JSON.parse(raw);
        data.completed = true;
        localStorage.setItem(KEY_DAILY, JSON.stringify(data));
    } catch(e) {}
}

function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

export function getLeaderboard() {
    try {
        const raw = localStorage.getItem(KEY_LEADERBOARD);
        return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
}

export function updateLeaderboard(username, college, profile, quizResult) {
    try {
        const board = getLeaderboard();
        const idx = board.findIndex(e => e.username === username);
        const entry = {
            username: username || 'Anonymous',
            college: college || '—',
            xp: profile.xp,
            level: profile.level,
            totalQuizzes: profile.totalQuizzes,
            bestStreak: profile.streak.best,
            bestScore: quizResult ? Math.max((idx >= 0 ? board[idx].bestScore || 0 : 0), quizResult.scorePercent) : (idx >= 0 ? board[idx].bestScore || 0 : 0),
            updatedAt: Date.now(),
        };
        if (idx >= 0) board[idx] = entry;
        else board.push(entry);
        localStorage.setItem(KEY_LEADERBOARD, JSON.stringify(board));
    } catch(e) {}
}

// ─── FULL QUIZ COMPLETION PIPELINE ────────────────────────────────────────────

/**
 * Call once when a quiz ends. Returns all gamification results.
 * @param {object} params
 */
export function processQuizCompletion({
    quizKey, difficulty, battleMode, timedMode,
    correct, totalQ, durationSeconds,
    isDaily, completedKeys,
    username, college,
}) {
    const profile = loadProfile();
    const scorePercent = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;

    // 1. Streak
    const streakResult = updateStreak(profile);

    // 2. XP calculation
    let xpBreakdown = [];
    const diffMeta = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0];
    const mult = diffMeta.multiplier;

    const xpCorrect = Math.round(correct * XP_PER_CORRECT[difficulty || 'easy'] * mult);
    xpBreakdown.push({ label: `Correct answers (×${mult})`, xp: xpCorrect });

    const xpCompletion = Math.round(XP_COMPLETION * mult);
    xpBreakdown.push({ label: 'Quiz completion', xp: xpCompletion });

    let xpPerfect = 0;
    if (scorePercent === 100) {
        xpPerfect = Math.round(XP_PERFECT * mult);
        xpBreakdown.push({ label: 'Perfect score bonus', xp: xpPerfect });
        profile.perfectScores = (profile.perfectScores || 0) + 1;
    }

    let xpGoodScore = 0;
    if (scorePercent >= 80 && scorePercent < 100) {
        xpGoodScore = Math.round(XP_GOOD_SCORE * mult);
        xpBreakdown.push({ label: 'Good score bonus (≥80%)', xp: xpGoodScore });
    }

    let xpStreak = streakResult.bonusXp;
    if (xpStreak > 0) xpBreakdown.push({ label: `Streak milestone (${profile.streak.current} days)`, xp: xpStreak });

    let xpDaily = 0;
    if (isDaily) {
        xpDaily = XP_DAILY;
        xpBreakdown.push({ label: 'Daily challenge bonus', xp: xpDaily });
        profile.dailyChallengesCompleted = (profile.dailyChallengesCompleted || 0) + 1;
        markDailyChallengeComplete();
    }

    const totalXp = xpCorrect + xpCompletion + xpPerfect + xpGoodScore + xpStreak + xpDaily;
    const xpResult = awardXp(profile, totalXp);

    // 3. Stats
    profile.totalQuizzes++;
    profile.totalCorrect = (profile.totalCorrect || 0) + correct;
    profile.totalQuestions = (profile.totalQuestions || 0) + totalQ;

    // 4. Subject rank
    const rankResult = updateSubjectRank(profile, quizKey, scorePercent);

    // 5. Achievements
    const quizResult = { quizKey, difficulty, battleMode, scorePercent, totalQ, durationSeconds, completed: true, completedKeys };
    const newAchievements = checkAchievements(profile, quizResult);

    // 6. History
    logQuizHistory({ quizKey, difficulty, battleMode, timedMode, correct, totalQ, scorePercent, durationSeconds });

    // 7. Weaknesses — handled externally by quiz.js (needs per-question data)

    // 8. Leaderboard
    if (username) updateLeaderboard(username, college, profile, { scorePercent });

    // 9. Save
    saveProfile(profile);

    return {
        scorePercent, xpBreakdown, totalXp,
        leveledUp: xpResult.leveledUp, newLevel: xpResult.newLevel,
        newAchievements,
        rankResult,
        streakResult,
        profile,
    };
}
