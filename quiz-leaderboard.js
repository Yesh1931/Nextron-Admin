/**
 * Nextron Quiz Arena — Leaderboard
 * Route: #/leaderboard
 */

import { getLeaderboard, loadProfile, getLevelInfo } from './quiz-engine.js';
import { AppState } from './app.js';

export const render = async () => `
    <style>
        .lb-table { width: 100%; border-collapse: collapse; }
        .lb-table th { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border-color); }
        .lb-table td { padding: 12px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.88rem; vertical-align: middle; }
        .lb-table tr:hover td { background: rgba(255,255,255,0.02); }
        .lb-table tr.is-me td { background: rgba(99,102,241,0.07); }
        .lb-rank { font-weight: 800; font-size: 1rem; width: 36px; text-align: center; }
        .lb-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; color: #fff; flex-shrink: 0; }
        .lb-tabs { display: flex; gap: 6px; margin-bottom: 18px; flex-wrap: wrap; }
        .lb-tab { padding: 8px 18px; border-radius: 99px; border: 1px solid var(--border-color); background: transparent; color: var(--text-muted); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .lb-tab.active { border-color: var(--accent-secondary); background: rgba(99,102,241,0.12); color: var(--accent-secondary); }
        .podium { display: flex; justify-content: center; align-items: flex-end; gap: 12px; margin-bottom: 28px; }
        .podium-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .podium-block { border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
    </style>
    <div style="max-width: 860px; margin: 0 auto; padding-bottom: 40px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
            <section class="section-title" style="margin:0;">
                <span class="concept-card-category" style="color:var(--warning);font-size:0.9rem;font-weight:800;">Hall of Fame</span>
                <h2>🏆 Leaderboard</h2>
                <p>Top Nextron scholars ranked by XP, scores, and learning dedication.</p>
            </section>
            <div style="display:flex; gap:8px;">
                <a href="#/quiz" class="btn btn-secondary" style="padding:8px 16px;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Quiz Arena
                </a>
                <a href="#/quiz-analytics" class="btn btn-secondary" style="padding:8px 16px;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="bar-chart-2" style="width:14px;height:14px;"></i> My Analytics
                </a>
            </div>
        </div>
        <div id="lb-mount"></div>
    </div>
`;

export const mount = () => {
    buildLeaderboard('xp');
};

export const unmount = () => {};

const SORT_MODES = [
    { id: 'xp',       label: '⭐ Highest XP',       field: 'xp',           desc: true },
    { id: 'score',    label: '🎯 Top Scores',         field: 'bestScore',    desc: true },
    { id: 'quizzes',  label: '📚 Most Quizzes',       field: 'totalQuizzes', desc: true },
    { id: 'streak',   label: '🔥 Longest Streak',     field: 'bestStreak',   desc: true },
];

const AVATAR_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#ec4899','#14b8a6'];

function buildLeaderboard(activeSort) {
    const el = document.getElementById('lb-mount');
    if (!el) return;

    const currentUser = AppState.currentUser?.username;
    let board = getLeaderboard();

    // Inject current user if not present and has data
    const profile = loadProfile();
    if (currentUser && profile.totalQuizzes > 0) {
        const exists = board.some(e => e.username === currentUser);
        if (!exists) {
            board.push({
                username: currentUser,
                college: AppState.currentUser?.college || '—',
                xp: profile.xp,
                level: profile.level,
                totalQuizzes: profile.totalQuizzes,
                bestStreak: profile.streak.best,
                bestScore: 0,
                updatedAt: Date.now(),
            });
        }
    }

    if (!board.length) {
        el.innerHTML = `
            <div class="glass-card" style="padding:48px;text-align:center;">
                <div style="font-size:3rem;margin-bottom:16px;">🏆</div>
                <h3>No entries yet</h3>
                <p style="color:var(--text-muted);">Complete a quiz to appear on the leaderboard.</p>
                <a href="#/quiz" class="btn btn-primary" style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;">
                    <i data-lucide="zap"></i> Start a Quiz
                </a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    const mode = SORT_MODES.find(m => m.id === activeSort) || SORT_MODES[0];
    const sorted = [...board].sort((a, b) => mode.desc ? (b[mode.field] || 0) - (a[mode.field] || 0) : (a[mode.field] || 0) - (b[mode.field] || 0));

    // ── Tabs ──
    const tabsHtml = `
        <div class="lb-tabs">
            ${SORT_MODES.map(m => `<button class="lb-tab ${m.id === activeSort ? 'active' : ''}" data-sort="${m.id}">${m.label}</button>`).join('')}
        </div>
    `;

    // ── Podium (top 3) ──
    const podiumColors = ['#f59e0b', '#94a3b8', '#b45309'];
    const podiumEmojis = ['🥇', '🥈', '🥉'];
    const podiumHeights = [90, 70, 55];

    let podiumHtml = '';
    if (sorted.length >= 1) {
        const ordered = [sorted[1], sorted[0], sorted[2]].filter(Boolean); // 2nd, 1st, 3rd
        const orderedPositions = sorted.length >= 3 ? [1, 0, 2] : sorted.length === 2 ? [1, 0] : [0];

        podiumHtml = `<div class="podium">`;
        ordered.forEach((entry, displayIdx) => {
            const realPos = orderedPositions[displayIdx];
            if (!entry) return;
            const h = podiumHeights[realPos] || 55;
            const color = podiumColors[realPos] || '#6366f1';
            const emoji = podiumEmojis[realPos] || '🎖️';
            const initials = (entry.username || '?').slice(0, 2).toUpperCase();
            const avatarColor = AVATAR_COLORS[sorted.indexOf(entry) % AVATAR_COLORS.length];
            const isMe = entry.username === currentUser;
            podiumHtml += `
                <div class="podium-col">
                    <div class="lb-avatar" style="background:${avatarColor};${isMe ? 'outline:2px solid var(--accent-secondary);' : ''}">${initials}</div>
                    <div style="font-size:0.8rem;font-weight:700;max-width:80px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${entry.username}${isMe ? ' 👈' : ''}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);">${entry[mode.field] || 0} ${activeSort === 'xp' ? 'XP' : activeSort === 'score' ? '%' : activeSort === 'streak' ? 'days' : ''}</div>
                    <div class="podium-block" style="width:80px;height:${h}px;background:${color}22;border-top:3px solid ${color};">${emoji}</div>
                </div>
            `;
        });
        podiumHtml += `</div>`;
    }

    // ── Table ──
    const rankEmojis = { 0: '🥇', 1: '🥈', 2: '🥉' };
    const tableRows = sorted.map((entry, i) => {
        const isMe = entry.username === currentUser;
        const initials = (entry.username || '?').slice(0, 2).toUpperCase();
        const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const levelInfo = getLevelInfo(entry.xp || 0);
        let mainVal = '';
        if (activeSort === 'xp') mainVal = `${entry.xp || 0} XP`;
        else if (activeSort === 'score') mainVal = `${entry.bestScore || 0}%`;
        else if (activeSort === 'quizzes') mainVal = `${entry.totalQuizzes || 0} quizzes`;
        else mainVal = `${entry.bestStreak || 0} days`;

        return `
            <tr class="${isMe ? 'is-me' : ''}">
                <td class="lb-rank">${rankEmojis[i] || `#${i + 1}`}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div class="lb-avatar" style="background:${avatarColor};${isMe ? 'outline:2px solid var(--accent-secondary);' : ''}">${initials}</div>
                        <div>
                            <div style="font-weight:700;font-size:0.88rem;">${entry.username}${isMe ? ' <span style="color:var(--accent-secondary);font-size:0.72rem;">(You)</span>' : ''}</div>
                            <div style="font-size:0.72rem;color:var(--text-muted);">${entry.college || '—'}</div>
                        </div>
                    </div>
                </td>
                <td><span style="background:rgba(99,102,241,0.1);color:var(--accent-purple);padding:2px 8px;border-radius:99px;font-size:0.72rem;font-weight:700;">Lvl ${levelInfo.level}</span></td>
                <td style="font-weight:700;color:var(--warning);">🔥${entry.bestStreak || 0}</td>
                <td style="font-weight:700;color:var(--success);">📚${entry.totalQuizzes || 0}</td>
                <td style="font-weight:800;color:var(--accent-secondary);">${mainVal}</td>
            </tr>
        `;
    }).join('');

    el.innerHTML = `
        ${tabsHtml}
        ${sorted.length >= 2 ? podiumHtml : ''}
        <div class="glass-card" style="padding:0;overflow:hidden;">
            <table class="lb-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Scholar</th>
                        <th>Level</th>
                        <th>Streak</th>
                        <th>Quizzes</th>
                        <th>${mode.label}</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <p style="text-align:center;color:var(--text-muted);font-size:0.75rem;margin-top:16px;">
            Leaderboard is local to your device. 🔒 Multi-device sync coming soon.
        </p>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Tab switching
    document.querySelectorAll('.lb-tab').forEach(tab => {
        tab.addEventListener('click', e => {
            buildLeaderboard(e.currentTarget.getAttribute('data-sort'));
        });
    });
}
