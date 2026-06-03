/**
 * Nextron Quiz Arena — Analytics Dashboard
 * Route: #/quiz-analytics
 */

import { AppState } from './app.js';
import { loadProfile, getLevelInfo, getAnalytics, getWeaknesses, CATEGORIES, ACHIEVEMENT_REGISTRY, SUBJECT_RANK_TIERS, xpThresholdForLevel } from './quiz-engine.js';

export const render = async () => `
    <style>
        .analytics-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 920px; margin: 0 auto; padding-bottom: 40px; }
        .analytics-card { background: rgba(13,20,36,0.6); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 20px; backdrop-filter: blur(8px); }
        .analytics-card h4 { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
        .stat-pill { background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 12px 16px; text-align: center; }
        .stat-pill .stat-val { font-size: 1.6rem; font-weight: 800; margin-bottom: 2px; }
        .stat-pill .stat-lbl { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; }
        .ach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
        .ach-card { border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 12px; text-align: center; transition: all 0.25s; }
        .ach-card.unlocked { border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.06); }
        .ach-card.locked { opacity: 0.4; filter: grayscale(1); }
        .ach-card .ach-icon { font-size: 1.8rem; margin-bottom: 6px; }
        .ach-card .ach-name { font-size: 0.72rem; font-weight: 700; }
        .rank-bar { height: 6px; border-radius: 99px; background: rgba(255,255,255,0.07); overflow: hidden; margin: 4px 0; }
        .rank-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent-purple), var(--accent-secondary)); }
        @media(max-width: 640px) { .analytics-layout { grid-template-columns: 1fr; } }
    </style>
    <div style="max-width:920px;margin:0 auto;padding-bottom:40px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
            <section class="section-title" style="margin:0;">
                <span class="concept-card-category" style="color:var(--accent-purple);font-size:0.9rem;font-weight:800;">Performance Center</span>
                <h2>Quiz Analytics Dashboard</h2>
                <p>Track your learning progress, achievements, and subject mastery.</p>
            </section>
            <div style="display:flex;gap:8px;">
                <a href="#/quiz" class="btn btn-secondary" style="padding:8px 16px;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Quiz Arena
                </a>
                <a href="#/leaderboard" class="btn btn-secondary" style="padding:8px 16px;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
                    <i data-lucide="trophy" style="width:14px;height:14px;"></i> Leaderboard
                </a>
            </div>
        </div>
        <div id="analytics-mount"></div>
    </div>
`;

export const mount = () => {
    buildAnalytics();
};

export const unmount = () => {};

function buildAnalytics() {
    const el = document.getElementById('analytics-mount');
    if (!el) return;

    const profile = loadProfile();
    const levelInfo = getLevelInfo(profile.xp);
    const analytics = getAnalytics();
    const weaknesses = getWeaknesses();
    const earned = new Set(profile.achievements || []);

    if (!analytics) {
        el.innerHTML = `
            <div class="glass-card" style="padding:48px;text-align:center;">
                <div style="font-size:3rem;margin-bottom:16px;">📊</div>
                <h3>No data yet</h3>
                <p style="color:var(--text-muted);">Complete your first quiz to see analytics here.</p>
                <a href="#/quiz" class="btn btn-primary" style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;">
                    <i data-lucide="zap"></i> Start First Quiz
                </a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    // ── Overview Stats ──
    const statsRow = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">
            <div class="stat-pill"><div class="stat-val" style="color:var(--accent-secondary);">${analytics.totalQuizzes}</div><div class="stat-lbl">Total Quizzes</div></div>
            <div class="stat-pill"><div class="stat-val" style="color:var(--success);">${analytics.avgScore}%</div><div class="stat-lbl">Avg Score</div></div>
            <div class="stat-pill"><div class="stat-val" style="color:var(--warning);">${analytics.bestScore}%</div><div class="stat-lbl">Best Score</div></div>
            <div class="stat-pill"><div class="stat-val" style="color:var(--accent-purple);">${analytics.accuracy}%</div><div class="stat-lbl">Accuracy</div></div>
            <div class="stat-pill"><div class="stat-val" style="color:var(--error);">🔥${profile.streak.current}</div><div class="stat-lbl">Current Streak</div></div>
            <div class="stat-pill"><div class="stat-val" style="color:var(--accent-secondary);">Lvl ${levelInfo.level}</div><div class="stat-lbl">Current Level</div></div>
        </div>
    `;

    // ── XP Progress ──
    const xpCard = `
        <div class="analytics-card" style="grid-column:1/-1;margin-bottom:4px;">
            <h4>XP & Level Progress</h4>
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;flex-wrap:wrap;">
                <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--accent-purple),var(--accent-secondary));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.3rem;color:#fff;flex-shrink:0;">${levelInfo.level}</div>
                <div style="flex:1;min-width:200px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span style="font-size:0.8rem;font-weight:600;">Level ${levelInfo.level}</span>
                        <span style="font-size:0.8rem;color:var(--text-muted);">${profile.xp} / ${profile.xp + levelInfo.xpToNext} XP</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.07);border-radius:99px;height:10px;overflow:hidden;">
                        <div style="width:${levelInfo.progress}%;height:100%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-secondary));border-radius:99px;transition:width 1s ease;"></div>
                    </div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px;">${levelInfo.xpToNext} XP until Level ${levelInfo.level + 1}</div>
                </div>
            </div>
            <!-- Level milestones row -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${[1,2,3,4,5,6,7,8,9,10].map(l => {
                    const thresh = xpThresholdForLevel(l);
                    const reached = profile.xp >= thresh;
                    return `<div style="font-size:0.7rem;padding:4px 10px;border-radius:99px;border:1px solid ${reached ? 'var(--accent-secondary)' : 'var(--border-color)'};background:${reached ? 'rgba(99,102,241,0.12)' : 'transparent'};color:${reached ? 'var(--accent-secondary)' : 'var(--text-muted)'};">Lvl ${l}: ${thresh}XP</div>`;
                }).join('')}
            </div>
        </div>
    `;

    // ── Subject Performance Canvas ──
    const subjectCard = `
        <div class="analytics-card">
            <h4>Subject Performance</h4>
            <canvas id="canvas-subject-perf" height="240" style="width:100%;"></canvas>
        </div>
    `;

    // ── Weekly Activity Heatmap ──
    const weeklyCard = `
        <div class="analytics-card">
            <h4>Weekly Activity (Last 7 Days)</h4>
            <canvas id="canvas-weekly" height="80" style="width:100%;"></canvas>
        </div>
    `;

    // ── Score Trend ──
    const trendCard = `
        <div class="analytics-card">
            <h4>Recent Score Trend</h4>
            <canvas id="canvas-trend" height="120" style="width:100%;"></canvas>
        </div>
    `;

    // ── Subject Ranks ──
    const ranks = Object.entries(profile.subjectRanks || {});
    const rankCard = `
        <div class="analytics-card">
            <h4>Subject Rankings</h4>
            ${ranks.length === 0
                ? '<p style="color:var(--text-muted);font-size:0.85rem;">Complete quizzes to earn subject ranks.</p>'
                : ranks.map(([key, rank]) => {
                    const rankIdx = SUBJECT_RANK_TIERS.indexOf(rank);
                    const pct = Math.round(((rankIdx + 1) / SUBJECT_RANK_TIERS.length) * 100);
                    const cat = CATEGORIES[key] || {};
                    return `<div style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                            <span style="font-size:0.82rem;font-weight:600;">${cat.icon || '📚'} ${cat.label || key}</span>
                            <span style="font-size:0.72rem;color:var(--accent-purple);font-weight:700;">${rank}</span>
                        </div>
                        <div class="rank-bar"><div class="rank-fill" style="width:${pct}%;"></div></div>
                    </div>`;
                }).join('')
            }
        </div>
    `;

    // ── Weak Areas ──
    const weakCard = `
        <div class="analytics-card">
            <h4>Weak Areas — Focus Here</h4>
            ${weaknesses.length === 0
                ? '<p style="color:var(--text-muted);font-size:0.85rem;">No weak areas yet. Keep quizzing!</p>'
                : weaknesses.map(w => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-color);">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span>${CATEGORIES[w.quizKey]?.icon || '📚'}</span>
                            <span style="font-size:0.85rem;font-weight:600;">${w.label}</span>
                        </div>
                        <span style="background:rgba(239,68,68,0.12);color:var(--error);padding:2px 8px;border-radius:99px;font-size:0.72rem;font-weight:700;">×${w.count} misses</span>
                    </div>`).join('')
            }
            ${weaknesses.length > 0 ? `<a href="#/quiz" class="btn btn-primary" style="margin-top:12px;width:100%;justify-content:center;font-size:0.85rem;">Practice Weak Areas</a>` : ''}
        </div>
    `;

    // ── Achievements Gallery ──
    const achCard = `
        <div class="analytics-card" style="grid-column:1/-1;">
            <h4>Achievements (${earned.size} / ${ACHIEVEMENT_REGISTRY.length} Unlocked)</h4>
            <div class="ach-grid">
                ${ACHIEVEMENT_REGISTRY.map(ach => {
                    const unlocked = earned.has(ach.id);
                    if (ach.secret && !unlocked) {
                        return `<div class="ach-card locked" title="Secret Achievement">
                            <div class="ach-icon">🔒</div>
                            <div class="ach-name">Secret</div>
                        </div>`;
                    }
                    return `<div class="ach-card ${unlocked ? 'unlocked' : 'locked'}" title="${ach.desc}">
                        <div class="ach-icon">${ach.icon}</div>
                        <div class="ach-name">${ach.name}</div>
                        <div style="font-size:0.65rem;color:var(--text-muted);margin-top:2px;">${ach.desc}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;

    el.innerHTML = statsRow + `<div class="analytics-layout">${xpCard}${subjectCard}${weeklyCard}${trendCard}${rankCard}${weakCard}${achCard}</div>`;
    if (window.lucide) window.lucide.createIcons();

    // Render canvases after DOM paint
    requestAnimationFrame(() => {
        drawSubjectChart(analytics.subjectAverages);
        drawWeeklyChart(analytics.weeklyActivity);
        drawTrendChart(analytics.recentScores);
    });
}

function drawSubjectChart(subjectAverages) {
    const canvas = document.getElementById('canvas-subject-perf');
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const entries = Object.entries(subjectAverages);
    if (!entries.length) return;

    const barH = Math.min(22, (h - 10) / entries.length - 4);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#0f172a' : '#94a3b8';

    ctx.clearRect(0, 0, w, h);
    entries.forEach(([key, avg], i) => {
        const y = i * (barH + 6) + 4;
        const label = CATEGORIES[key]?.label || key;
        const barW = Math.max(2, ((avg / 100) * (w - 110)));

        ctx.fillStyle = textColor;
        ctx.font = `500 10px system-ui`;
        ctx.textAlign = 'left';
        ctx.fillText(label.slice(0, 16), 0, y + barH / 2 + 4);

        // Bar bg
        ctx.fillStyle = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(100, y, w - 110, barH);

        // Bar fill
        const gradient = ctx.createLinearGradient(100, 0, 100 + barW, 0);
        const color = avg >= 80 ? '#10b981' : avg >= 60 ? '#f59e0b' : '#ef4444';
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '88');
        ctx.fillStyle = gradient;
        ctx.fillRect(100, y, barW, barH);

        ctx.fillStyle = textColor;
        ctx.textAlign = 'right';
        ctx.fillText(`${avg}%`, w, y + barH / 2 + 4);
        ctx.textAlign = 'left';
    });
}

function drawWeeklyChart(weeklyActivity) {
    const canvas = document.getElementById('canvas-weekly');
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVal = Math.max(...weeklyActivity, 1);
    const cellW = w / 7;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    ctx.clearRect(0, 0, w, h);
    weeklyActivity.forEach((count, i) => {
        const intensity = count / maxVal;
        const hue = 142; // green
        ctx.fillStyle = intensity === 0
            ? (isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.05)')
            : `hsla(${hue}, 71%, ${30 + intensity * 30}%, ${0.3 + intensity * 0.7})`;
        const x = i * cellW + 4;
        const boxH = h - 24;
        ctx.beginPath();
        ctx.roundRect?.(x, 0, cellW - 8, boxH, 4) || ctx.fillRect(x, 0, cellW - 8, boxH);
        ctx.fill();

        ctx.fillStyle = isLight ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.4)';
        ctx.font = '9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(days[i], x + (cellW - 8) / 2, h - 4);
        if (count > 0) {
            ctx.fillStyle = isLight ? '#0f172a' : '#fff';
            ctx.fillText(count, x + (cellW - 8) / 2, boxH / 2 + 4);
        }
    });
}

function drawTrendChart(recentScores) {
    const canvas = document.getElementById('canvas-trend');
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    if (recentScores.length < 2) return;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = isLight ? 'rgba(15,23,42,0.07)' : 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    [25, 50, 75].forEach(pct => {
        const y = h - 20 - (pct / 100) * (h - 30);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    });

    // 80% pass line
    const passY = h - 20 - (0.8 * (h - 30));
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isLight ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.3)';
    ctx.beginPath(); ctx.moveTo(0, passY); ctx.lineTo(w, passY); ctx.stroke();
    ctx.setLineDash([]);

    // Score line
    const stepX = (w - 20) / (recentScores.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = isLight ? '#6366f1' : '#818cf8';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    recentScores.forEach((score, i) => {
        const x = 10 + i * stepX;
        const y = h - 20 - (score / 100) * (h - 30);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    recentScores.forEach((score, i) => {
        const x = 10 + i * stepX;
        const y = h - 20 - (score / 100) * (h - 30);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
        ctx.fill();
    });

    // Axis labels
    ctx.fillStyle = isLight ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.3)';
    ctx.font = '8px system-ui';
    ctx.textAlign = 'right';
    ['100', '75', '50', '25'].forEach((label, i) => {
        const y = h - 20 - ([100, 75, 50, 25][i] / 100) * (h - 30);
        ctx.fillText(`${label}%`, 18, y + 3);
    });
}
