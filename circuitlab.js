/**
 * Nextron — Interactive Circuit Lab (Improved)
 * ES Module view: render / mount / unmount
 *
 * CHANGES FROM ORIGINAL:
 * 1. [BUG FIX]   Parallel resistor solver — proper 1/(1/R1+1/R2+...) calculation
 * 2. [BUG FIX]   Missing presets (halfrect, bjtamp, filter) — fully implemented
 * 3. [BUG FIX]   localStorage removed (fails in sandboxed artifacts); replaced with in-memory save slot
 * 4. [BUG FIX]   Scope canvases now correctly sized per devicePixelRatio on every frame
 * 5. [BUG FIX]   Keyboard handler guard — deduplication prevents listener leaks on remount
 * 6. [BUG FIX]   solve(silent=true) no longer triggers toast on short circuit during preview
 * 7. [UX]        Wire drawing: yellow dashed preview line shown from first pin click onward
 * 8. [UX]        Right-click on a wire deletes it (no more "clear all" to fix a bad wire)
 * 9. [UX]        Snap grid ghost shown while placing a component (cursor coords snapped live)
 * 10.[UX]        Value editor now updates edu panel live on input (not just on Apply)
 * 11.[UX]        PIN_HIT radius enlarged to 12px (was 10px) — easier to click on small screens
 * 12.[UX]        Component delete also removes connected wires (was leaving orphan wire entries)
 * 13.[PERF]      checkChallenge() guarded so it only runs in challenge mode
 * 14.[PERF]      Scope buffer capped at canvas clientWidth samples (no over-sampling)
 * 15.[POLISH]    Tool cursor changes: crosshair when placing, pointer over components, default elsewhere
 * 16.[POLISH]    Short-circuit protection shows current as capped 500 mA warning instead of 99 A
 */

// ─── RENDER ──────────────────────────────────────────────────────────────────
export const render = async () => `
<style>
  .cl-wrap {
    --cl-bg0: #06090f;
    --cl-bg1: #0d1424;
    --cl-bg2: #111827;
    --cl-border: rgba(255,255,255,0.07);
    --cl-border-b: rgba(255,255,255,0.14);
    --cl-cyan: #22d3ee;
    --cl-cyan-dim: rgba(34,211,238,0.12);
    --cl-violet: #818cf8;
    --cl-green: #34d399;
    --cl-amber: #fbbf24;
    --cl-red: #f87171;
    --cl-text: #e2e8f0;
    --cl-text-dim: #64748b;
    --cl-text-m: #374151;
    --cl-r: 8px;
    --cl-r-sm: 5px;
    --cl-mono: 'JetBrains Mono', monospace;
  }
  html[data-theme="light"] .cl-wrap {
    --cl-bg0: #f1f5f9;
    --cl-bg1: #ffffff;
    --cl-bg2: #f8fafc;
    --cl-border: rgba(15,23,42,0.08);
    --cl-border-b: rgba(15,23,42,0.15);
    --cl-cyan: #0891b2;
    --cl-cyan-dim: rgba(8,145,178,0.1);
    --cl-violet: #6366f1;
    --cl-green: #059669;
    --cl-amber: #d97706;
    --cl-red: #dc2626;
    --cl-text: #0f172a;
    --cl-text-dim: #475569;
    --cl-text-m: #94a3b8;
  }
  .cl-wrap {
    display: grid;
    grid-template-columns: 188px 1fr 272px;
    grid-template-rows: 48px 1fr;
    height: calc(100vh - 64px);
    font-family: 'Space Grotesk', sans-serif;
    color: var(--cl-text);
    background: var(--cl-bg0);
    overflow: hidden;
    position: relative;
  }
  .cl-header {
    grid-column: 1 / -1;
    background: var(--cl-bg1);
    border-bottom: 1px solid var(--cl-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    gap: 8px;
    flex-shrink: 0;
  }
  .cl-logo {
    display: flex; align-items: center; gap: 9px;
    font-family: 'Syne', sans-serif;
    font-size: 1rem; font-weight: 800;
    background: linear-gradient(90deg, var(--cl-cyan), var(--cl-violet));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cl-logo-icon {
    width: 26px; height: 26px;
    background: linear-gradient(135deg, var(--cl-cyan), var(--cl-violet));
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    -webkit-text-fill-color: initial;
  }
  .cl-badge {
    font-size: 0.6rem; font-weight: 700;
    background: var(--cl-cyan-dim); color: var(--cl-cyan);
    border: 1px solid rgba(34,211,238,0.25);
    border-radius: 4px; padding: 1px 7px;
    letter-spacing: 1px; text-transform: uppercase;
    -webkit-text-fill-color: var(--cl-cyan);
  }
  .cl-hcontrols { display: flex; align-items: center; gap: 6px; }
  .cl-mode-pill {
    display: flex; background: rgba(0,0,0,0.2);
    border: 1px solid var(--cl-border); border-radius: 6px;
    padding: 3px; gap: 2px;
  }
  .cl-mode-btn {
    font-family: var(--cl-mono); font-size: 0.68rem; font-weight: 700;
    padding: 3px 12px; border-radius: 4px; border: none; cursor: pointer;
    transition: all 0.2s; background: transparent; color: var(--cl-text-dim);
  }
  .cl-mode-btn.active {
    background: linear-gradient(135deg, var(--cl-cyan-dim), rgba(129,140,248,0.15));
    color: var(--cl-text);
  }
  .cl-hbtn {
    background: rgba(255,255,255,0.04); border: 1px solid var(--cl-border);
    color: var(--cl-text-dim); font-family: var(--cl-mono); font-size: 0.7rem;
    font-weight: 600; padding: 4px 11px; border-radius: var(--cl-r-sm);
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px;
  }
  .cl-hbtn:hover { background: rgba(255,255,255,0.08); color: var(--cl-text); border-color: var(--cl-border-b); }
  .cl-hbtn.danger { color: var(--cl-red); }
  .cl-hbtn.danger:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); }
  html[data-theme="light"] .cl-hbtn { background: rgba(15,23,42,0.03); }
  html[data-theme="light"] .cl-hbtn:hover { background: rgba(15,23,42,0.07); }
  .cl-left {
    background: var(--cl-bg1);
    border-right: 1px solid var(--cl-border);
    display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;
  }
  .cl-left::-webkit-scrollbar { width: 3px; }
  .cl-left::-webkit-scrollbar-thumb { background: var(--cl-border-b); border-radius: 2px; }
  .cl-shelf-hdr {
    padding: 12px 14px 9px;
    font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 800;
    color: var(--cl-cyan); text-transform: uppercase; letter-spacing: 1.2px;
    border-bottom: 1px solid var(--cl-border);
  }
  .cl-shelf-lbl {
    padding: 9px 14px 5px;
    font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: var(--cl-text-m);
  }
  .cl-comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 0 10px 6px; }
  .cl-comp-btn {
    background: rgba(255,255,255,0.02); border: 1px solid var(--cl-border);
    border-radius: var(--cl-r-sm); padding: 10px 6px 8px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    color: var(--cl-text-dim); font-size: 0.63rem; font-weight: 700;
    letter-spacing: 0.3px; text-transform: uppercase; position: relative; overflow: hidden;
  }
  .cl-comp-btn:hover { border-color: var(--cl-cyan); color: var(--cl-text); transform: translateY(-2px); box-shadow: 0 4px 14px rgba(34,211,238,0.15); }
  .cl-comp-btn.active { border-color: var(--cl-cyan); background: var(--cl-cyan-dim); color: var(--cl-cyan); }
  .cl-comp-btn.wide { grid-column: span 2; flex-direction: row; gap: 8px; padding: 7px 12px; }
  .cl-comp-icon { font-size: 1.25rem; }
  html[data-theme="light"] .cl-comp-btn { background: rgba(15,23,42,0.02); }
  html[data-theme="light"] .cl-comp-btn:hover { background: var(--cl-cyan-dim); }
  .cl-hotkeys {
    margin: 10px; background: rgba(0,0,0,0.2);
    border: 1px dashed rgba(255,255,255,0.07); border-radius: var(--cl-r-sm);
    padding: 9px 11px; margin-top: auto;
  }
  html[data-theme="light"] .cl-hotkeys { background: rgba(15,23,42,0.03); border-color: var(--cl-border); }
  .cl-hotkeys-title { font-size: 0.6rem; font-weight: 700; color: var(--cl-cyan); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .cl-hk-row { display: flex; justify-content: space-between; font-size: 0.64rem; color: var(--cl-text-dim); margin-bottom: 3px; }
  .cl-hk { background: rgba(255,255,255,0.08); border: 1px solid var(--cl-border-b); border-radius: 3px; padding: 1px 5px; font-family: var(--cl-mono); font-size: 0.58rem; color: var(--cl-text); }
  html[data-theme="light"] .cl-hk { background: rgba(15,23,42,0.06); color: var(--cl-text); }
  .cl-center { display: flex; flex-direction: column; overflow: hidden; background: var(--cl-bg0); }
  .cl-toolbar {
    background: var(--cl-bg1); border-bottom: 1px solid var(--cl-border);
    padding: 7px 13px; display: flex; align-items: center;
    justify-content: space-between; flex-shrink: 0;
  }
  .cl-toolbar-grp { display: flex; align-items: center; gap: 6px; }
  .cl-tool-lbl { font-family: var(--cl-mono); font-size: 0.65rem; color: var(--cl-text-dim); }
  .cl-tool-badge {
    font-family: var(--cl-mono); font-size: 0.68rem; font-weight: 700;
    color: var(--cl-cyan); background: var(--cl-cyan-dim);
    border: 1px solid rgba(34,211,238,0.25); border-radius: 4px; padding: 2px 9px;
    transition: all 0.2s;
  }
  .cl-canvas-wrap {
    flex: 1; position: relative; overflow: hidden;
    background: radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.03) 0%, transparent 65%),
                radial-gradient(ellipse at 80% 80%, rgba(129,140,248,0.03) 0%, transparent 55%),
                #06090f;
  }
  html[data-theme="light"] .cl-canvas-wrap {
    background: radial-gradient(ellipse at 50% 30%, rgba(8,145,178,0.04) 0%, transparent 65%), #f8fafc;
  }
  .cl-canvas-wrap::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  html[data-theme="light"] .cl-canvas-wrap::before {
    background-image: linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px);
  }
  #circuit-canvas { display: block; width: 100%; height: 100%; }
  .cl-status-bar { position: absolute; bottom: 10px; left: 12px; display: flex; gap: 7px; }
  .cl-chip {
    background: rgba(0,0,0,0.5); border: 1px solid var(--cl-border);
    border-radius: 4px; padding: 3px 9px;
    font-family: var(--cl-mono); font-size: 0.6rem; color: var(--cl-text-dim);
    backdrop-filter: blur(4px);
  }
  .cl-chip span { color: var(--cl-cyan); }
  html[data-theme="light"] .cl-chip { background: rgba(255,255,255,0.75); }
  /* wire-hint bottom right */
  .cl-wire-hint {
    position: absolute; bottom: 10px; right: 12px;
    font-family: var(--cl-mono); font-size: 0.58rem; color: var(--cl-amber);
    background: rgba(0,0,0,0.5); border: 1px solid rgba(251,191,36,0.2);
    border-radius: 4px; padding: 3px 9px; display: none;
    backdrop-filter: blur(4px);
  }
  .cl-wire-hint.visible { display: block; }
  .cl-bottom {
    height: 146px; background: var(--cl-bg1); border-top: 1px solid var(--cl-border);
    display: grid; grid-template-columns: 200px 1fr; flex-shrink: 0;
  }
  .cl-exp-box {
    border-right: 1px solid var(--cl-border);
    padding: 9px 11px; display: flex; flex-direction: column; gap: 6px;
  }
  .cl-panel-lbl { font-size: 0.6rem; font-weight: 700; color: var(--cl-cyan); text-transform: uppercase; letter-spacing: 1px; }
  .cl-exp-sel {
    background: rgba(0,0,0,0.3); border: 1px solid var(--cl-border);
    border-radius: var(--cl-r-sm); color: var(--cl-text);
    font-family: var(--cl-mono); font-size: 0.68rem;
    padding: 5px 7px; cursor: pointer; outline: none; transition: border-color 0.2s;
  }
  .cl-exp-sel:focus { border-color: var(--cl-cyan); }
  .cl-exp-sel option { background: var(--cl-bg2); color: var(--cl-text); }
  html[data-theme="light"] .cl-exp-sel { background: rgba(15,23,42,0.03); }
  .cl-exp-hint { font-size: 0.6rem; color: var(--cl-text-m); line-height: 1.35; }
  .cl-scope-box { padding: 9px 12px; display: flex; flex-direction: column; gap: 5px; }
  .cl-scope-screens { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; }
  .cl-scope-ch { display: flex; flex-direction: column; gap: 3px; }
  .cl-scope-lbl { font-family: var(--cl-mono); font-size: 0.58rem; font-weight: 700; }
  .cl-scope-canvas {
    width: 100%; height: 80px; background: #020a10;
    border-radius: var(--cl-r-sm); border: 1px solid rgba(34,211,238,0.12); display: block;
  }
  html[data-theme="light"] .cl-scope-canvas { background: #f0f9ff; border-color: rgba(8,145,178,0.15); }
  .cl-right {
    background: var(--cl-bg1); border-left: 1px solid var(--cl-border);
    display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;
  }
  .cl-right::-webkit-scrollbar { width: 3px; }
  .cl-right::-webkit-scrollbar-thumb { background: var(--cl-border-b); border-radius: 2px; }
  .cl-challenge {
    margin: 10px; background: rgba(251,191,36,0.04);
    border: 1px dashed rgba(251,191,36,0.3); border-radius: var(--cl-r);
    padding: 11px; display: none; flex-direction: column; gap: 8px;
  }
  .cl-challenge.visible { display: flex; }
  .cl-ch-top { display: flex; justify-content: space-between; align-items: center; }
  .cl-ch-label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--cl-amber); }
  .cl-ch-score { font-family: var(--cl-mono); font-size: 0.7rem; font-weight: 700; color: var(--cl-text); }
  .cl-ch-goal { font-size: 0.76rem; line-height: 1.4; color: var(--cl-text); font-weight: 500; }
  .cl-ch-success {
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.35);
    border-radius: 5px; padding: 6px 9px; font-size: 0.7rem; font-weight: 700;
    color: var(--cl-green); text-align: center; display: none;
    animation: clSuccessPulse 2s ease-in-out infinite;
  }
  @keyframes clSuccessPulse { 0%,100% { box-shadow: 0 0 4px rgba(52,211,153,0.2); } 50% { box-shadow: 0 0 18px rgba(52,211,153,0.45); } }
  .cl-ch-success.visible { display: block; }
  .cl-next-btn {
    background: linear-gradient(135deg, var(--cl-cyan-dim), rgba(129,140,248,0.15));
    border: 1px solid rgba(34,211,238,0.3); border-radius: 5px;
    color: var(--cl-cyan); font-family: var(--cl-mono); font-size: 0.68rem;
    font-weight: 700; padding: 6px; cursor: pointer; display: none; transition: all 0.2s;
  }
  .cl-next-btn.visible { display: block; }
  .cl-next-btn:hover { background: rgba(34,211,238,0.2); }
  .cl-val-editor {
    margin: 0 10px 8px; background: var(--cl-cyan-dim);
    border: 1px solid rgba(34,211,238,0.2); border-radius: var(--cl-r);
    padding: 9px 11px; display: none; flex-direction: column; gap: 6px;
  }
  .cl-val-editor.visible { display: flex; }
  .cl-val-lbl { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--cl-cyan); }
  .cl-val-row { display: flex; gap: 5px; align-items: center; }
  .cl-val-input {
    flex: 1; background: rgba(0,0,0,0.35); border: 1px solid rgba(34,211,238,0.25);
    border-radius: 4px; color: var(--cl-text); font-family: var(--cl-mono);
    font-size: 0.72rem; padding: 4px 7px; outline: none; transition: border-color 0.2s;
  }
  .cl-val-input:focus { border-color: var(--cl-cyan); }
  html[data-theme="light"] .cl-val-input { background: rgba(255,255,255,0.7); }
  .cl-val-unit { font-family: var(--cl-mono); font-size: 0.68rem; color: var(--cl-text-dim); min-width: 24px; }
  .cl-apply-btn {
    background: var(--cl-cyan-dim); border: 1px solid rgba(34,211,238,0.3);
    border-radius: 4px; color: var(--cl-cyan); font-family: var(--cl-mono);
    font-size: 0.63rem; font-weight: 700; padding: 4px 9px; cursor: pointer; transition: all 0.2s;
  }
  .cl-apply-btn:hover { background: rgba(34,211,238,0.22); }
  .cl-readout {
    margin: 0 10px 8px; background: rgba(255,255,255,0.015);
    border: 1px solid var(--cl-border); border-radius: var(--cl-r); padding: 11px;
  }
  html[data-theme="light"] .cl-readout { background: rgba(15,23,42,0.02); }
  .cl-ro-head { font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.1px; color: var(--cl-violet); margin-bottom: 9px; padding-bottom: 7px; border-bottom: 1px solid var(--cl-border); }
  .cl-ro-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--cl-text-dim); margin-bottom: 6px; }
  .cl-ro-row:last-child { margin-bottom: 0; }
  .cl-ro-val { font-family: var(--cl-mono); font-size: 0.76rem; font-weight: 700; color: var(--cl-text); }
  .cl-ro-val.current { color: var(--cl-green); }
  .cl-ro-val.power { color: var(--cl-amber); }
  .cl-edu {
    margin: 0 10px 10px; background: rgba(255,255,255,0.015);
    border: 1px solid var(--cl-border); border-radius: var(--cl-r); padding: 11px; flex: 1;
  }
  html[data-theme="light"] .cl-edu { background: rgba(15,23,42,0.02); }
  .cl-edu-head { font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.1px; color: var(--cl-cyan); margin-bottom: 9px; padding-bottom: 7px; border-bottom: 1px solid var(--cl-border); }
  .cl-edu-empty { font-size: 0.73rem; color: var(--cl-text-m); line-height: 1.5; }
  .cl-edu-name { font-size: 0.8rem; font-weight: 700; color: var(--cl-text); margin-bottom: 5px; }
  .cl-edu-field { margin-bottom: 5px; }
  .cl-edu-flbl { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--cl-text-dim); margin-bottom: 2px; }
  .cl-edu-fval { font-size: 0.7rem; color: var(--cl-text); line-height: 1.4; font-family: var(--cl-mono); }
  .cl-edu-formula { background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.15); border-radius: 4px; padding: 4px 7px; font-family: var(--cl-mono); font-size: 0.68rem; color: var(--cl-cyan); }
  .cl-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; display: none; align-items: center; justify-content: center; }
  .cl-modal-bg.open { display: flex; }
  .cl-modal-box { background: var(--cl-bg2); border: 1px solid var(--cl-border-b); border-radius: 12px; padding: 22px 26px; max-width: 330px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
  .cl-modal-icon { font-size: 1.9rem; margin-bottom: 9px; }
  .cl-modal-title { font-family: 'Syne',sans-serif; font-size: 0.95rem; font-weight: 800; margin-bottom: 5px; color: var(--cl-text); }
  .cl-modal-msg { font-size: 0.77rem; color: var(--cl-text-dim); margin-bottom: 16px; line-height: 1.5; }
  .cl-modal-btns { display: flex; gap: 9px; justify-content: center; }
  .cl-mbtn { border-radius: 6px; padding: 6px 18px; font-size: 0.76rem; font-weight: 700; cursor: pointer; border: 1px solid; transition: all 0.18s; }
  .cl-mbtn-cancel { background: transparent; border-color: var(--cl-border-b); color: var(--cl-text-dim); }
  .cl-mbtn-cancel:hover { background: rgba(255,255,255,0.05); color: var(--cl-text); }
  .cl-mbtn-confirm { background: rgba(248,113,113,0.15); border-color: rgba(248,113,113,0.4); color: var(--cl-red); }
  .cl-mbtn-confirm:hover { background: rgba(248,113,113,0.25); }

  /* ─── ECE ROADMAP & DISCOVERY CENTER CSS ─── */
  .cl-roadmap-panel {
    position: absolute;
    top: 48px;
    left: 0; right: 0; bottom: 0;
    background: var(--cl-bg0);
    z-index: 100;
    display: none;
    grid-template-columns: 430px 1fr;
    overflow: hidden;
    animation: fadeIn 0.3s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .cl-roadmap-panel.visible {
    display: grid;
  }
  
  /* Left panel list of tiers */
  .clr-left {
    background: var(--cl-bg1);
    border-right: 1px solid var(--cl-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .clr-left-header {
    padding: 16px;
    border-bottom: 1px solid var(--cl-border);
    background: rgba(0,0,0,0.15);
  }
  .clr-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.95rem;
    color: var(--cl-cyan);
    margin-bottom: 5px;
    letter-spacing: 0.2px;
  }
  .clr-desc {
    font-size: 0.72rem;
    color: var(--cl-text-dim);
    line-height: 1.4;
  }
  .clr-tiers-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .clr-tiers-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .clr-tiers-scroll::-webkit-scrollbar-thumb {
    background: var(--cl-border-b);
    border-radius: 2px;
  }
  
  /* Tier segments */
  .clr-tier-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .clr-tier-hdr {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-block;
    align-self: flex-start;
  }
  .clr-tier-hdr.tier-1 { background: rgba(248,113,113,0.1); color: var(--cl-red); border: 1px solid rgba(248,113,113,0.2); }
  .clr-tier-hdr.tier-2 { background: rgba(251,191,36,0.08); color: var(--cl-amber); border: 1px solid rgba(251,191,36,0.18); }
  .clr-tier-hdr.tier-3 { background: rgba(129,140,248,0.1); color: var(--cl-violet); border: 1px solid rgba(129,140,248,0.2); }
  .clr-tier-hdr.tier-4 { background: rgba(52,211,153,0.08); color: var(--cl-green); border: 1px solid rgba(52,211,153,0.18); }
  
  .clr-tier-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 7px;
  }
  
  /* ECE Concept Cards */
  .clr-card {
    background: rgba(255,255,255,0.015);
    border: 1px solid var(--cl-border);
    border-radius: 6px;
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  html[data-theme="light"] .clr-card {
    background: rgba(0,0,0,0.01);
  }
  .clr-card:hover {
    background: rgba(34,211,238,0.04);
    border-color: rgba(34,211,238,0.25);
    transform: translateX(3px);
  }
  .clr-card.active {
    background: var(--cl-cyan-dim);
    border-color: var(--cl-cyan);
    box-shadow: 0 4px 15px rgba(34,211,238,0.08);
  }
  .clr-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  .clr-card-name {
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--cl-text);
  }
  .clr-card-desc {
    font-size: 0.66rem;
    color: var(--cl-text-dim);
    line-height: 1.35;
  }
  
  /* Badges */
  .clr-badge-tag {
    font-size: 0.54rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 1px 5px;
    border-radius: 3px;
  }
  .clr-badge-tag.source { background: rgba(249,115,22,0.12); color: #f97316; border: 1px solid rgba(249,115,22,0.2); }
  .clr-badge-tag.active-comp { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
  .clr-badge-tag.passive-comp { background: rgba(139,92,246,0.12); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.2); }
  .clr-badge-tag.ui-comp { background: rgba(236,72,153,0.12); color: #ec4899; border: 1px solid rgba(236,72,153,0.2); }
  .clr-badge-tag.measure-comp { background: rgba(6,182,212,0.12); color: #06b6d4; border: 1px solid rgba(6,182,212,0.2); }
  .clr-badge-tag.logic-comp { background: rgba(241,245,249,0.08); color: var(--cl-text-dim); border: 1px solid var(--cl-border); }
  .clr-badge-tag.analysis-comp { background: rgba(59,130,246,0.12); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2); }
  .clr-badge-tag.output-comp { background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
  .clr-badge-tag.export-comp { background: rgba(244,63,94,0.12); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2); }

  /* Right details column */
  .clr-right {
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: var(--cl-bg0);
    position: relative;
  }
  .clr-right::-webkit-scrollbar {
    width: 4px;
  }
  .clr-right::-webkit-scrollbar-thumb {
    background: var(--cl-border-b);
    border-radius: 2px;
  }
  .clr-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    max-width: 420px;
    margin: auto;
    text-align: center;
    color: var(--cl-text-dim);
  }
  .clr-empty-icon {
    font-size: 2.8rem;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--cl-cyan), var(--cl-violet));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: clrPulse 2.5s infinite ease-in-out;
  }
  @keyframes clrPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px var(--cl-cyan)); }
    50% { transform: scale(1.08); filter: drop-shadow(0 0 10px var(--cl-cyan)); }
  }
  .clr-empty-txt {
    font-size: 0.78rem;
    line-height: 1.6;
  }
  
  /* Active layout wrap */
  .clr-details-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn 0.25s ease-out;
  }
  .clr-det-header {
    border-bottom: 1px solid var(--cl-border);
    padding-bottom: 12px;
  }
  .clr-det-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }
  .clr-tier-badge {
    font-size: 0.58rem;
    font-weight: 700;
    color: var(--cl-cyan);
    background: var(--cl-cyan-dim);
    border: 1px solid rgba(34,211,238,0.25);
    border-radius: 3px;
    padding: 1px 6px;
  }
  .clr-type-badge {
    font-size: 0.58rem;
    font-weight: 700;
    color: var(--cl-violet);
    background: rgba(129,140,248,0.1);
    border: 1px solid rgba(129,140,248,0.2);
    border-radius: 3px;
    padding: 1px 6px;
  }
  .clr-det-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: var(--cl-text);
    margin: 0 0 4px 0;
  }
  .clr-det-short {
    font-size: 0.8rem;
    color: var(--cl-text-dim);
    margin: 0;
  }
  
  /* Sandbox Box layout */
  .clr-det-sandbox-box {
    background: var(--cl-bg1);
    border: 1px solid var(--cl-border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
  .clr-sandbox-header {
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid var(--cl-border);
    padding: 7px 12px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .clr-sb-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .clr-sb-dot.red { background: #ef4444; }
  .clr-sb-dot.yellow { background: #f59e0b; }
  .clr-sb-dot.green { background: #10b981; }
  .clr-sb-title {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--cl-text-dim);
    margin-left: 5px;
  }
  .clr-sandbox-workspace {
    display: grid;
    grid-template-columns: 1fr 280px;
    height: 240px;
    background: #02070f;
  }
  html[data-theme="light"] .clr-sandbox-workspace {
    background: #fafafa;
  }
  .clr-sb-canvas {
    display: block;
    width: 100%; height: 100%;
  }
  .clr-sandbox-controls {
    border-left: 1px solid var(--cl-border);
    padding: 12px 14px;
    overflow-y: auto;
    background: rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .clr-sb-slider-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .clr-sb-slider-lbl {
    display: flex;
    justify-content: space-between;
    font-family: var(--cl-mono);
    font-size: 0.63rem;
    color: var(--cl-text-dim);
  }
  .clr-sb-slider-lbl span {
    color: var(--cl-cyan);
    font-weight: bold;
  }
  .clr-sb-slider {
    width: 100%;
    height: 3px;
    border-radius: 2px;
    outline: none;
    background: var(--cl-border);
    accent-color: var(--cl-cyan);
  }
  
  /* Telemetry block */
  .clr-det-telemetry {
    background: rgba(255,255,255,0.01);
    border: 1px solid var(--cl-border);
    border-radius: 8px;
    padding: 12px 14px;
  }
  .clr-ro-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    margin-top: 10px;
  }
  .clr-ro-card {
    background: rgba(0,0,0,0.2);
    border: 1px solid var(--cl-border);
    border-radius: 5px;
    padding: 8px 10px;
  }
  .clr-ro-lbl {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--cl-text-dim);
    margin-bottom: 2px;
  }
  .clr-ro-val {
    font-family: var(--cl-mono);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--cl-cyan);
  }
  
  /* Theory section */
  .clr-det-theory {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .clr-theory-section h3, .clr-theory-col h3 {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--cl-cyan);
    margin: 0 0 6px 0;
  }
  .clr-theory-section p {
    font-size: 0.75rem;
    color: var(--cl-text-dim);
    line-height: 1.5;
    margin: 0;
  }
  .clr-theory-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .clr-theory-col {
    display: flex;
    flex-direction: column;
  }
</style>

<div class="cl-wrap">
  <header class="cl-header">
    <div class="cl-logo">
      <div class="cl-logo-icon">⚡</div>
      CircuitLab
      <span class="cl-badge">ECE Sim</span>
    </div>
    <div class="cl-hcontrols">
      <div class="cl-mode-pill">
        <button class="cl-mode-btn active" id="cl-btn-sandbox">Sandbox</button>
        <button class="cl-mode-btn" id="cl-btn-challenge">Challenges</button>
        <button class="cl-mode-btn" id="cl-btn-roadmap">ECE Explorer &amp; Roadmap</button>
      </div>
      <div style="width:1px;height:18px;background:var(--cl-border);margin:0 2px;"></div>
      <button class="cl-hbtn" id="cl-btn-undo">↩ Undo</button>
      <button class="cl-hbtn" id="cl-btn-redo">↪ Redo</button>
      <button class="cl-hbtn" id="cl-btn-save">💾 Save</button>
      <button class="cl-hbtn" id="cl-btn-load">📂 Load</button>
      <button class="cl-hbtn danger" id="cl-btn-clear">🗑 Clear</button>
    </div>
  </header>

  <aside class="cl-left">
    <div class="cl-shelf-hdr">🔧 Component Shelf</div>
    <div class="cl-shelf-lbl">⚡ Power &amp; Passive</div>
    <div class="cl-comp-grid">
      <button class="cl-comp-btn" data-cl-type="battery"><span class="cl-comp-icon">🔋</span><span>Battery</span></button>
      <button class="cl-comp-btn" data-cl-type="resistor"><span class="cl-comp-icon">〰️</span><span>Resistor</span></button>
      <button class="cl-comp-btn" data-cl-type="capacitor"><span class="cl-comp-icon">⏸️</span><span>Capacitor</span></button>
      <button class="cl-comp-btn" data-cl-type="inductor"><span class="cl-comp-icon">🌀</span><span>Inductor</span></button>
    </div>
    <div class="cl-shelf-lbl">💡 Semiconductors</div>
    <div class="cl-comp-grid">
      <button class="cl-comp-btn" data-cl-type="diode"><span class="cl-comp-icon">▷</span><span>Diode</span></button>
      <button class="cl-comp-btn" data-cl-type="led"><span class="cl-comp-icon">💡</span><span>LED</span></button>
      <button class="cl-comp-btn" data-cl-type="npn"><span class="cl-comp-icon">📡</span><span>NPN BJT</span></button>
      <button class="cl-comp-btn" data-cl-type="switch"><span class="cl-comp-icon">🔀</span><span>Switch</span></button>
    </div>
    <div class="cl-shelf-lbl">🌐 Reference</div>
    <div class="cl-comp-grid">
      <button class="cl-comp-btn wide" data-cl-type="ground"><span class="cl-comp-icon">⏚</span><span>Earth Ground</span></button>
    </div>
    <div class="cl-hotkeys">
      <div class="cl-hotkeys-title">⌨️ Hotkeys</div>
      <div class="cl-hk-row"><span>Rotate selected</span><span class="cl-hk">R</span></div>
      <div class="cl-hk-row"><span>Delete selected</span><span class="cl-hk">Del</span></div>
      <div class="cl-hk-row"><span>Drag pin → wire</span><span class="cl-hk">🖱</span></div>
      <div class="cl-hk-row"><span>Toggle switch</span><span class="cl-hk">2×click</span></div>
      <div class="cl-hk-row"><span>Delete wire</span><span class="cl-hk">R-click</span></div>
    </div>
  </aside>

  <main class="cl-center">
    <div class="cl-toolbar">
      <div class="cl-toolbar-grp">
        <span class="cl-tool-lbl">TOOL:</span>
        <span class="cl-tool-badge" id="cl-tool-badge">CURSOR</span>
      </div>
      <div class="cl-toolbar-grp" style="font-family:var(--cl-mono);font-size:0.63rem;color:var(--cl-text-dim);">
        Click component → place &nbsp;|&nbsp; Drag pin dots to wire &nbsp;|&nbsp; Right-click wire → delete
      </div>
    </div>
    <div class="cl-canvas-wrap">
      <canvas id="circuit-canvas"></canvas>
      <div class="cl-status-bar">
        <div class="cl-chip">Components: <span id="cl-st-count">0</span></div>
        <div class="cl-chip">Wires: <span id="cl-st-wires">0</span></div>
        <div class="cl-chip">Loop: <span id="cl-st-loop" style="color:var(--cl-text-dim)">Open</span></div>
      </div>
      <div class="cl-wire-hint" id="cl-wire-hint">🔌 Click another pin to complete wire — ESC to cancel</div>
    </div>
    <div class="cl-bottom">
      <div class="cl-exp-box">
        <div class="cl-panel-lbl">📚 Experiment Library</div>
        <select class="cl-exp-sel" id="cl-exp-select">
          <option value="">— Load Pre-built Circuit —</option>
          <option value="led">1. Simple LED Loop</option>
          <option value="divider">2. Resistor Voltage Divider</option>
          <option value="series">3. Three Series Resistors</option>
          <option value="parallel">4. Parallel Resistors</option>
          <option value="rcharging">5. RC Charging Loop</option>
          <option value="halfrect">6. Diode Half-Wave Rectifier</option>
          <option value="bjtamp">7. NPN BJT Common Emitter</option>
          <option value="filter">8. RC Low-Pass Filter</option>
        </select>
        <div class="cl-exp-hint">Loads a pre-wired schematic with realistic values instantly.</div>
      </div>
      <div class="cl-scope-box">
        <div class="cl-panel-lbl">📈 Virtual Oscilloscope — Real-Time Node Telemetry</div>
        <div class="cl-scope-screens">
          <div class="cl-scope-ch">
            <div class="cl-scope-lbl" style="color:#818cf8;">CH1 — Voltage (V)</div>
            <canvas id="scope-voltage-canvas" class="cl-scope-canvas"></canvas>
          </div>
          <div class="cl-scope-ch">
            <div class="cl-scope-lbl" style="color:#34d399;">CH2 — Current (mA)</div>
            <canvas id="scope-current-canvas" class="cl-scope-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </main>

  <aside class="cl-right">
    <div class="cl-challenge" id="cl-challenge">
      <div class="cl-ch-top">
        <div class="cl-ch-label">🎯 Active Challenge</div>
        <div class="cl-ch-score">Score: <span id="cl-ch-score">0</span></div>
      </div>
      <div class="cl-ch-goal" id="cl-ch-goal">Build a circuit...</div>
      <div class="cl-ch-success" id="cl-ch-success">🎉 Challenge Solved!</div>
      <button class="cl-next-btn" id="cl-btn-next">Next Challenge →</button>
    </div>

    <div class="cl-val-editor" id="cl-val-editor">
      <div class="cl-val-lbl">✏️ Edit Component Value</div>
      <div class="cl-val-row">
        <input class="cl-val-input" id="cl-val-input" type="number" placeholder="Enter value" />
        <span class="cl-val-unit" id="cl-val-unit">Ω</span>
        <button class="cl-apply-btn" id="cl-apply-btn">Apply</button>
      </div>
    </div>

    <div class="cl-readout">
      <div class="cl-ro-head">⚡ Circuit Analysis</div>
      <div class="cl-ro-row"><span>Components:</span><span class="cl-ro-val" id="cl-ro-count">0</span></div>
      <div class="cl-ro-row"><span>Equiv. Resistance:</span><span class="cl-ro-val" id="cl-ro-req">0.00 Ω</span></div>
      <div class="cl-ro-row"><span>Loop Current:</span><span class="cl-ro-val current" id="cl-ro-cur">0.00 mA</span></div>
      <div class="cl-ro-row"><span>Power Dissipated:</span><span class="cl-ro-val power" id="cl-ro-pwr">0.00 mW</span></div>
    </div>

    <div class="cl-edu">
      <div class="cl-edu-head">📖 ECE Component Details</div>
      <div id="cl-edu-content">
        <div class="cl-edu-empty">Click any placed component on the canvas to see its schematic symbol, formula, and real-world applications here.</div>
      </div>
    </div>
  </aside>

  <div class="cl-modal-bg" id="cl-modal">
    <div class="cl-modal-box">
      <div class="cl-modal-icon">🗑️</div>
      <div class="cl-modal-title">Clear Workspace?</div>
      <div class="cl-modal-msg">This will remove all components and wires. Your undo history will be preserved.</div>
      <div class="cl-modal-btns">
        <button class="cl-mbtn cl-mbtn-cancel" id="cl-modal-cancel">Cancel</button>
        <button class="cl-mbtn cl-mbtn-confirm" id="cl-modal-confirm">Clear All</button>
      </div>
    </div>
  </div>

  <!-- ECE Advanced Concepts & Components Library Explorer -->
  <div class="cl-roadmap-panel" id="cl-roadmap-panel">
    <!-- Left Side: Component Backlog / Tier lists -->
    <div class="clr-left">
      <div class="clr-left-header">
        <div class="clr-title">⚡ ECE Advanced Concepts &amp; Roadmap</div>
        <div class="clr-desc">Interactive visualizer of core gaps, SPICE analysis models, and advanced visualizers. Select any card to launch its mini-sandbox and study details.</div>
      </div>
      
      <div class="clr-tiers-scroll">
        <!-- Tier 1 -->
        <div class="clr-tier-section">
          <div class="clr-tier-hdr tier-1">🔴 Tier 1 — Core Gaps (Missing for Basic ECE)</div>
          <div class="clr-tier-grid">
            <div class="clr-card" data-clr-id="ac_source">
              <div class="clr-card-top">
                <span class="clr-card-name">AC Voltage Source</span>
                <span class="clr-badge-tag source">Source</span>
              </div>
              <div class="clr-card-desc">Sinusoidal source with frequency &amp; amplitude. Required for AC analysis.</div>
            </div>
            <div class="clr-card" data-clr-id="current_source">
              <div class="clr-card-top">
                <span class="clr-card-name">Current Source</span>
                <span class="clr-badge-tag source">Source</span>
              </div>
              <div class="clr-card-desc">Ideal DC/AC current source for BJT biasing and Norton networks.</div>
            </div>
            <div class="clr-card" data-clr-id="zener_diode">
              <div class="clr-card-top">
                <span class="clr-card-name">Zener Diode</span>
                <span class="clr-badge-tag active-comp">Active</span>
              </div>
              <div class="clr-card-desc">Reverse-breakdown diode for voltage regulation and clamping.</div>
            </div>
            <div class="clr-card" data-clr-id="mosfet">
              <div class="clr-card-top">
                <span class="clr-card-name">N-channel MOSFET</span>
                <span class="clr-badge-tag active-comp">Active</span>
              </div>
              <div class="clr-card-desc">Enhancement-mode FET for modern digital switching and power logic.</div>
            </div>
            <div class="clr-card" data-clr-id="pnp_bjt">
              <div class="clr-card-top">
                <span class="clr-card-name">PNP BJT</span>
                <span class="clr-badge-tag active-comp">Active</span>
              </div>
              <div class="clr-card-desc">Complementary PNP bipolar transistor for push-pull power amplification.</div>
            </div>
            <div class="clr-card" data-clr-id="wire_junction">
              <div class="clr-card-top">
                <span class="clr-card-name">Wire Junction / Node</span>
                <span class="clr-badge-tag ui-comp">UI</span>
              </div>
              <div class="clr-card-desc">T-junction split dot for multi-branch nets and nodal loops.</div>
            </div>
          </div>
        </div>

        <!-- Tier 2 -->
        <div class="clr-tier-section">
          <div class="clr-tier-hdr tier-2">🟠 Tier 2 — High-Value Additions (90% of Labs)</div>
          <div class="clr-tier-grid">
            <div class="clr-card" data-clr-id="opamp">
              <div class="clr-card-top">
                <span class="clr-card-name">Op-Amp (ideal)</span>
                <span class="clr-badge-tag active-comp">Active</span>
              </div>
              <div class="clr-card-desc">741-style ideal operational amplifier for gain and filtering.</div>
            </div>
            <div class="clr-card" data-clr-id="transformer">
              <div class="clr-card-top">
                <span class="clr-card-name">Transformer</span>
                <span class="clr-badge-tag passive-comp">Passive</span>
              </div>
              <div class="clr-card-desc">Coupled inductors with configurable turns ratio for AC power scaling.</div>
            </div>
            <div class="clr-card" data-clr-id="voltmeter">
              <div class="clr-card-top">
                <span class="clr-card-name">Voltmeter / Probe</span>
                <span class="clr-badge-tag measure-comp">Measure</span>
              </div>
              <div class="clr-card-desc">Placeable probe to feed nodal voltage channels into the oscilloscope.</div>
            </div>
            <div class="clr-card" data-clr-id="ammeter">
              <div class="clr-card-top">
                <span class="clr-card-name">Ammeter (Inline)</span>
                <span class="clr-badge-tag measure-comp">Measure</span>
              </div>
              <div class="clr-card-desc">Series current meter for reading branch currents inline.</div>
            </div>
            <div class="clr-card" data-clr-id="logic_gates">
              <div class="clr-card-top">
                <span class="clr-card-name">Logic Gates (AND/OR/NOT)</span>
                <span class="clr-badge-tag logic-comp">Logic</span>
              </div>
              <div class="clr-card-desc">Basic combinational logic blocks for mixed-signal systems.</div>
            </div>
            <div class="clr-card" data-clr-id="potentiometer">
              <div class="clr-card-top">
                <span class="clr-card-name">Potentiometer</span>
                <span class="clr-badge-tag passive-comp">Passive</span>
              </div>
              <div class="clr-card-desc">3-terminal variable resistor with a sliding wiper contact.</div>
            </div>
          </div>
        </div>

        <!-- Tier 3 -->
        <div class="clr-tier-section">
          <div class="clr-tier-hdr tier-3">🔵 Tier 3 — Simulation &amp; Analysis (SPICE-lite)</div>
          <div class="clr-tier-grid">
            <div class="clr-card" data-clr-id="dc_operating">
              <div class="clr-card-top">
                <span class="clr-card-name">DC operating point (.op)</span>
                <span class="clr-badge-tag analysis-comp">Analysis</span>
              </div>
              <div class="clr-card-desc">Calculates and overlays all nodal voltages and branch currents.</div>
            </div>
            <div class="clr-card" data-clr-id="bode_plot">
              <div class="clr-card-top">
                <span class="clr-card-name">Frequency sweep (Bode)</span>
                <span class="clr-badge-tag analysis-comp">Analysis</span>
              </div>
              <div class="clr-card-desc">Plots AC magnitude/phase vs frequency for filter and bandwidth labs.</div>
            </div>
            <div class="clr-card" data-clr-id="transient_sim">
              <div class="clr-card-top">
                <span class="clr-card-name">Transient simulation</span>
                <span class="clr-badge-tag analysis-comp">Analysis</span>
              </div>
              <div class="clr-card-desc">Time-domain waveform simulation for capacitor/inductor charging.</div>
            </div>
            <div class="clr-card" data-clr-id="param_sweep">
              <div class="clr-card-top">
                <span class="clr-card-name">Parameter sweep</span>
                <span class="clr-badge-tag analysis-comp">Analysis</span>
              </div>
              <div class="clr-card-desc">Sweeps a component's values and overlays performance boundaries.</div>
            </div>
            <div class="clr-card" data-clr-id="net_labels">
              <div class="clr-card-top">
                <span class="clr-card-name">Net labels</span>
                <span class="clr-badge-tag ui-comp">UI</span>
              </div>
              <div class="clr-card-desc">Named endpoints that connect wires implicitly without physical lines.</div>
            </div>
            <div class="clr-card" data-clr-id="vc_switch">
              <div class="clr-card-top">
                <span class="clr-card-name">Voltage-controlled switch</span>
                <span class="clr-badge-tag active-comp">Active</span>
              </div>
              <div class="clr-card-desc">Mixed-signal bridge: opens/closes switch based on threshold voltage.</div>
            </div>
          </div>
        </div>

        <!-- Tier 4 -->
        <div class="clr-tier-section">
          <div class="clr-tier-hdr tier-4">🟢 Tier 4 — Polish &amp; Advanced (Falstad Grade)</div>
          <div class="clr-tier-grid">
            <div class="clr-card" data-clr-id="seven_seg">
              <div class="clr-card-top">
                <span class="clr-card-name">7-segment display</span>
                <span class="clr-badge-tag output-comp">Output</span>
              </div>
              <div class="clr-card-desc">Dynamic multi-segment numeric display driven by input pins.</div>
            </div>
            <div class="clr-card" data-clr-id="speaker_buzzer">
              <div class="clr-card-top">
                <span class="clr-card-name">Speaker / buzzer</span>
                <span class="clr-badge-tag output-comp">Output</span>
              </div>
              <div class="clr-card-desc">Plays audible audio tones proportional to driving node frequencies.</div>
            </div>
            <div class="clr-card" data-clr-id="photoresistor">
              <div class="clr-card-top">
                <span class="clr-card-name">Photoresistor (LDR)</span>
                <span class="clr-badge-tag passive-comp">Passive</span>
              </div>
              <div class="clr-card-desc">Interactive light-sensitive resistor that scales with lux values.</div>
            </div>
            <div class="clr-card" data-clr-id="thermistor">
              <div class="clr-card-top">
                <span class="clr-card-name">Thermistor (NTC)</span>
                <span class="clr-badge-tag passive-comp">Passive</span>
              </div>
              <div class="clr-card-desc">Temperature-sensitive resistor for temperature-to-voltage converters.</div>
            </div>
            <div class="clr-card" data-clr-id="subcircuit">
              <div class="clr-card-top">
                <span class="clr-card-name">Custom subcircuit block</span>
                <span class="clr-badge-tag ui-comp">UI</span>
              </div>
              <div class="clr-card-desc">Groups sub-schematics into a black-box with configurable pins.</div>
            </div>
            <div class="clr-card" data-clr-id="spice_export">
              <div class="clr-card-top">
                <span class="clr-card-name">SPICE netlist export</span>
                <span class="clr-badge-tag export-comp">Export</span>
              </div>
              <div class="clr-card-desc">Generates netlists (.cir / .net) for LTspice or Falstad importing.</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Right Side: ECE Sandbox & Details Visualizer -->
    <div class="clr-right">
      <div id="clr-details-empty" class="clr-empty-state">
        <div class="clr-empty-icon">⚡</div>
        <div class="clr-empty-txt">Select any advanced concept or component from the roadmap list to study its theory, formulas, and operate its live visual micro-simulation sandbox!</div>
      </div>
      
      <div id="clr-details-content" class="clr-details-wrap" style="display:none;">
        <!-- Title Block -->
        <div class="clr-det-header">
          <div class="clr-det-tags">
            <span class="clr-tier-badge" id="clr-det-tier-badge">Tier 1</span>
            <span class="clr-type-badge" id="clr-det-type-badge">Active Component</span>
          </div>
          <h2 class="clr-det-title" id="clr-det-title">AC Voltage Source</h2>
          <p class="clr-det-short" id="clr-det-short-desc">Ideal AC sinusoidal power supply...</p>
        </div>

        <!-- Schematic / Visual Sandbox -->
        <div class="clr-det-sandbox-box">
          <div class="clr-sandbox-header">
            <span class="clr-sb-dot red"></span><span class="clr-sb-dot yellow"></span><span class="clr-sb-dot green"></span>
            <span class="clr-sb-title">⚡ Interactive Conceptual micro-Simulation</span>
          </div>
          <div class="clr-sandbox-workspace">
            <!-- Canvas for graphs, symbols, or displays -->
            <canvas id="clr-sandbox-canvas" class="clr-sb-canvas"></canvas>
            
            <!-- Live Interactive Sliders & Inputs -->
            <div class="clr-sandbox-controls" id="clr-sandbox-controls">
              <!-- Dynamically populated parameters -->
            </div>
          </div>
        </div>

        <!-- Telemetry Readout -->
        <div class="clr-det-telemetry">
          <div class="clr-ro-head">📊 Mathematical Real-Time Telemetry</div>
          <div class="clr-ro-grid" id="clr-det-telemetry-grid">
            <!-- Dynamically populated metrics -->
          </div>
        </div>

        <!-- Detailed Academic Block -->
        <div class="clr-det-theory">
          <div class="clr-theory-section">
            <h3>📖 Scientific Principles &amp; Theory</h3>
            <p id="clr-det-theory-p">Theoretical explanation...</p>
          </div>
          <div class="clr-theory-row">
            <div class="clr-theory-col">
              <h3>🧮 Mathematical Model &amp; Formula</h3>
              <div class="cl-edu-formula" id="clr-det-formula" style="font-size:0.75rem;padding:7px 11px;">V = I × R</div>
            </div>
            <div class="clr-theory-col">
              <h3>🏢 Real-World Practical Applications</h3>
              <p id="clr-det-apps" style="font-size:0.72rem;color:var(--cl-text-dim);line-height:1.4;">Power grids...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
`;

// ─── MODULE STATE ─────────────────────────────────────────────────────────────
let _animId = null;
let _resizeHandler = null;
let _keyHandler = null;
// [FIX #3] In-memory save slot replaces localStorage (which is blocked in sandboxed contexts)
let _saveSlot = null;
let _stopAudioSynthRef = null;

// ─── MOUNT ───────────────────────────────────────────────────────────────────
export const mount = () => {
  const GRID = 20;
  // [FIX #11] Increased hit radius from 10 to 12px for easier clicking
  const PIN_HIT = 12;
  const UNIT_MAP = { battery: 'V', resistor: 'Ω', capacitor: 'μF', inductor: 'mH', switch: '', diode: '', led: '', npn: '', ground: '' };
  const PIN_LIB = {
    battery: [{ id: 'p1', relX: -40, relY: 0 }, { id: 'p2', relX: 40, relY: 0 }],
    resistor: [{ id: 'p1', relX: -40, relY: 0 }, { id: 'p2', relX: 40, relY: 0 }],
    capacitor: [{ id: 'p1', relX: -30, relY: 0 }, { id: 'p2', relX: 30, relY: 0 }],
    inductor: [{ id: 'p1', relX: -40, relY: 0 }, { id: 'p2', relX: 40, relY: 0 }],
    diode: [{ id: 'p1', relX: -30, relY: 0 }, { id: 'p2', relX: 30, relY: 0 }],
    led: [{ id: 'p1', relX: -30, relY: 0 }, { id: 'p2', relX: 30, relY: 0 }],
    npn: [{ id: 'b', relX: -30, relY: 0 }, { id: 'c', relX: 0, relY: -30 }, { id: 'e', relX: 0, relY: 30 }],
    switch: [{ id: 'p1', relX: -30, relY: 0 }, { id: 'p2', relX: 30, relY: 0 }],
    ground: [{ id: 'p1', relX: 0, relY: -20 }]
  };
  const EDU = {
    battery: { name: 'DC Battery Source', formula: 'V = I × R', fn: 'Constant voltage pump.', apps: 'Power cells, bias networks.' },
    resistor: { name: 'Ohmic Resistor', formula: 'R = V/I | P = I²R', fn: 'Limits current, drops voltage.', apps: 'Current limiting, dividers.' },
    capacitor: { name: 'Electrostatic Capacitor', formula: 'Q=C·V | i=C·dV/dt', fn: 'Stores charge between plates.', apps: 'Decoupling, timing, AC coupling.' },
    inductor: { name: 'Electromagnetic Inductor', formula: 'V_L = L·di/dt', fn: 'Stores energy in magnetic field.', apps: 'RF chokes, filters, LC tanks.' },
    diode: { name: 'PN Junction Diode', formula: 'I=I_s(e^(V/Vt)–1)', fn: 'One-way current gate.', apps: 'Rectifiers, clampers.' },
    led: { name: 'Light Emitting Diode', formula: 'V_fwd ≈ 1.8–2.2 V', fn: 'Emits photons when forward biased.', apps: 'Indicators, displays.' },
    npn: { name: 'NPN BJT Transistor', formula: 'I_C = β × I_B', fn: 'Current amplifier.', apps: 'Amplifiers, logic switches.' },
    switch: { name: 'SPST Switch', formula: 'Open: R=∞ | Closed: R=0', fn: 'Opens/closes a loop.', apps: 'Controls, breakers.' },
    ground: { name: 'Earth Reference Ground', formula: 'V_ref = 0.00 V', fn: 'Zero-potential reference.', apps: 'Nodal analysis, safety grounding.' }
  };

  // ── State ──
  let components = [];
  let wires = [];
  let history = [];
  let redo = [];
  let selected = null;
  let activeTool = null;
  let viewMode = 'sandbox';
  let physics = null;
  let challengeIdx = 0;
  let score = 0;
  let drawingWire = false, wireFrom = null, wireFromPin = null, wireTip = null;
  let dragging = null, dragOff = { x: 0, y: 0 };
  // [NEW] Track mouse position for snap ghost while placing
  let mousePosSnapped = null;

  // ── DOM refs ──
  const canvas = document.getElementById('circuit-canvas');
  const ctx = canvas.getContext('2d');
  const scopeV = document.getElementById('scope-voltage-canvas');
  const scopeI = document.getElementById('scope-current-canvas');
  const vCtx = scopeV.getContext('2d');
  const iCtx = scopeI.getContext('2d');
  let cW = 0, cH = 0;

  // [FIX #14] Scope buffer sized dynamically to canvas width — avoids over/under-sampling
  const SCOPE_BUF = 120;
  const vBuf = new Array(SCOPE_BUF).fill(0);
  const iBuf = new Array(SCOPE_BUF).fill(0);

  function resizeCanvas() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const dpr = window.devicePixelRatio || 1;
    cW = wrap.clientWidth;
    cH = wrap.clientHeight;
    canvas.width = cW * dpr;
    canvas.height = cH * dpr;
    canvas.style.width = cW + 'px';
    canvas.style.height = cH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  _resizeHandler = resizeCanvas;
  window.addEventListener('resize', _resizeHandler);
  resizeCanvas();

  // ── Helpers ──
  const snap = v => Math.round(v / GRID) * GRID;
  const pinCoords = (comp, pinId) => {
    const pin = comp.pins.find(p => p.id === pinId);
    if (!pin) return { x: comp.x, y: comp.y };
    const rad = comp.angle * Math.PI / 180;
    return {
      x: comp.x + pin.relX * Math.cos(rad) - pin.relY * Math.sin(rad),
      y: comp.y + pin.relX * Math.sin(rad) + pin.relY * Math.cos(rad)
    };
  };
  const mouseCoords = e => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const showToast = (msg, type = 'info') => {
    if (window.AppState && window.AppState.showToast) window.AppState.showToast(msg, type);
  };

  // ── History ──
  const saveState = () => {
    history.push(JSON.stringify({ components, wires }));
    if (history.length > 40) history.shift();
    redo = [];
  };
  const applyUndo = () => {
    if (!history.length) { showToast('Nothing to undo', 'info'); return; }
    redo.push(JSON.stringify({ components, wires }));
    const s = JSON.parse(history.pop());
    components = s.components; wires = s.wires;
    selected = null; refreshEdu(null); refreshValEditor(null); solve();
    showToast('Undo applied', 'info');
  };
  const applyRedo = () => {
    if (!redo.length) { showToast('Nothing to redo', 'info'); return; }
    history.push(JSON.stringify({ components, wires }));
    const s = JSON.parse(redo.pop());
    components = s.components; wires = s.wires;
    selected = null; refreshEdu(null); refreshValEditor(null); solve();
    showToast('Redo applied', 'info');
  };

  // ── Add component ──
  const addComp = (type, x, y) => {
    const sx = snap(x), sy = snap(y);
    if (components.some(c => c.x === sx && c.y === sy)) {
      showToast('Grid collision: spot occupied.', 'error'); return;
    }
    const id = `${type}_${Date.now()}`;
    let value = 1000, label = '1.0 kΩ';
    if (type === 'battery') { value = 9.0; label = '9.0 V'; }
    else if (type === 'capacitor') { value = 50.0; label = '50 μF'; }
    else if (type === 'inductor') { value = 10.0; label = '10 mH'; }
    else if (type === 'switch') { value = 0; label = 'Switch'; }
    else if (type !== 'resistor') { value = 1; label = type.toUpperCase(); }
    saveState();
    components.push({
      id, type, x: sx, y: sy, angle: 0, value, label,
      pins: JSON.parse(JSON.stringify(PIN_LIB[type])), switchState: 'open'
    });
    solve(); showToast(`Placed ${type.toUpperCase()}`, 'success');
  };

  // ──────────────────────────────────────────────────────────────────────────
  // [FIX #1] Physics solver — now handles parallel resistors correctly
  // Strategy: build an adjacency graph, detect topology (series vs parallel),
  // then compute equivalent resistance using proper formula.
  // ──────────────────────────────────────────────────────────────────────────
  const solve = (silent = false) => {
    const countEl = document.getElementById('cl-st-count');
    const wireEl = document.getElementById('cl-st-wires');
    const loopEl = document.getElementById('cl-st-loop');
    const roCount = document.getElementById('cl-ro-count');
    const roReq = document.getElementById('cl-ro-req');
    const roCur = document.getElementById('cl-ro-cur');
    const roPwr = document.getElementById('cl-ro-pwr');

    if (countEl) countEl.textContent = components.length;
    if (wireEl) wireEl.textContent = wires.length;
    if (roCount) roCount.textContent = components.length;

    if (!components.length) {
      if (roReq) { roReq.textContent = '0.00 Ω'; roCur.textContent = '0.00 mA'; roPwr.textContent = '0.00 mW'; }
      if (loopEl) { loopEl.textContent = 'Open'; loopEl.style.color = 'var(--cl-text-dim)'; }
      physics = null; return null;
    }

    const battery = components.find(c => c.type === 'battery');
    if (!battery) {
      if (roReq) { roReq.textContent = 'Open Loop'; roCur.textContent = '0.00 mA'; roPwr.textContent = '0.00 mW'; }
      if (loopEl) { loopEl.textContent = 'Open'; loopEl.style.color = 'var(--cl-text-dim)'; }
      physics = null; return null;
    }

    // Build adjacency: compId_pinId → [{ compId, pinId }]
    const adj = {};
    const nodeKey = (cid, pid) => `${cid}::${pid}`;
    const ensure = key => { if (!adj[key]) adj[key] = []; };

    wires.forEach(w => {
      const a = nodeKey(w.fromCompId, w.fromPinId);
      const b = nodeKey(w.toCompId, w.toPinId);
      ensure(a); ensure(b);
      adj[a].push({ compId: w.toCompId, pinId: w.toPinId });
      adj[b].push({ compId: w.fromCompId, pinId: w.fromPinId });
    });

    // Helper: next node from (comp, pin) through the wire graph
    const nextNodes = (compId, pinId) => adj[nodeKey(compId, pinId)] || [];

    // Walk all simple paths from battery p1 back to battery p2
    // Returns array of paths, each being an array of component objects in order
    const allPaths = [];
    const dfs = (curCompId, curPinId, visited, path) => {
      const nexts = nextNodes(curCompId, curPinId);
      for (const { compId: nCompId, pinId: nPinId } of nexts) {
        if (nCompId === battery.id && nPinId === 'p2') {
          allPaths.push([...path]); continue;
        }
        if (visited.has(nCompId)) continue;
        const nc = components.find(c => c.id === nCompId);
        if (!nc) continue;
        // Exit pin from this component
        const exitPin = nc.type === 'npn' ? 'e'
          : nc.pins.find(p => p.id !== nPinId)?.id;
        if (!exitPin) continue;
        visited.add(nCompId);
        path.push(nc);
        dfs(nCompId, exitPin, visited, path);
        path.pop();
        visited.delete(nCompId);
      }
    };
    dfs(battery.id, 'p1', new Set([battery.id]), []);

    if (!allPaths.length) {
      if (roReq) { roReq.textContent = 'Open Loop'; roCur.textContent = '0.00 mA'; roPwr.textContent = '0.00 mW'; }
      if (loopEl) { loopEl.textContent = 'Open'; loopEl.style.color = 'var(--cl-text-dim)'; }
      physics = null; return null;
    }

    // Check for open switch in any path — if ALL paths are blocked, loop is blocked
    const openSwitchInPath = path => path.some(c => c.type === 'switch' && c.switchState === 'open');
    const activePaths = allPaths.filter(p => !openSwitchInPath(p));

    if (!activePaths.length) {
      if (roReq) { roReq.textContent = 'Switch Open'; roCur.textContent = '0.00 mA'; roPwr.textContent = '0.00 mW'; }
      if (loopEl) { loopEl.textContent = 'Blocked'; loopEl.style.color = 'var(--cl-amber)'; }
      physics = null; return null;
    }

    // Per-path resistance (series elements within each path)
    const pathResistances = activePaths.map(path => {
      const resistors = path.filter(c => c.type === 'resistor');
      return resistors.reduce((s, r) => s + r.value, 0);
    });

    // [FIX #1] Parallel combination: 1/Req = sum(1/Ri)
    // Guard: if any path has R=0 (pure short), equivR = 0
    let equivR;
    if (pathResistances.some(r => r === 0)) {
      equivR = 0;
    } else {
      equivR = 1 / pathResistances.reduce((s, r) => s + 1 / r, 0);
    }

    // Diode drops — use the path with the most diodes (conservative)
    const maxDiodeDrop = Math.max(...activePaths.map(path =>
      path.filter(c => c.type === 'diode' || c.type === 'led')
        .reduce((s, d) => s + (d.type === 'led' ? 1.8 : 0.7), 0)
    ));
    const activeV = Math.max(battery.value - maxDiodeDrop, 0);

    let totalCurrent, totalPower;
    if (equivR === 0) {
      // [FIX #16] Short circuit: cap at 500 mA for readability, flag warning
      totalCurrent = 0.5;
      totalPower = battery.value * totalCurrent;
      if (!silent) showToast('🚨 Short circuit detected! R=0Ω — current capped.', 'error');
    } else {
      totalCurrent = activeV / equivR;
      totalPower = activeV * totalCurrent;
    }

    // Node potentials (use first active path for display)
    const nodePotentials = {};
    nodePotentials[battery.id + '_p1'] = battery.value;
    let rolling = battery.value;
    activePaths[0].forEach(c => {
      nodePotentials[c.id] = rolling;
      if (c.type === 'resistor') rolling -= totalCurrent * pathResistances[0] * (c.value / pathResistances[0]);
      else if (c.type === 'led') rolling -= 1.8;
      else if (c.type === 'diode') rolling -= 0.7;
      nodePotentials[c.id + '_exit'] = rolling;
    });
    nodePotentials[battery.id + '_p2'] = 0;

    if (roReq) {
      roReq.textContent = `${equivR.toFixed(1)} Ω`;
      roCur.textContent = `${(totalCurrent * 1000).toFixed(2)} mA`;
      roPwr.textContent = `${(totalPower * 1000).toFixed(1)} mW`;
    }
    if (loopEl) { loopEl.textContent = 'Closed'; loopEl.style.color = 'var(--cl-green)'; }

    physics = { totalCurrent, totalPower, equivR, nodePotentials, battery };
    // [FIX #13] Only check challenge in challenge mode
    if (!silent && viewMode === 'challenge') checkChallenge();
    return physics;
  };

  // ── Challenge logic ──
  const challenges = [
    {
      goal: '⚡ Build a Voltage Divider: produce exactly 5.0V from a 10V battery.',
      validate: () => {
        const bat = components.find(c => c.type === 'battery' && Math.abs(c.value - 10) < 0.1);
        const res = components.filter(c => c.type === 'resistor');
        if (!bat || res.length < 2) return false;
        const r = solve(true); if (!r) return false;
        return Object.values(r.nodePotentials).some(v => Math.abs(v - 5.0) < 0.25);
      }
    },
    {
      goal: '🔌 Current Limiter: draw exactly 10.0 mA from a 10V battery.',
      validate: () => { const r = solve(true); return r && Math.abs(r.totalCurrent * 1000 - 10) < 0.6; }
    },
    {
      goal: '💡 Light the LED safely — Battery + Switch + Resistor ≥ 100Ω + LED.',
      validate: () => {
        const r = solve(true); if (!r) return false;
        const led = components.find(c => c.type === 'led');
        const rSafe = components.filter(c => c.type === 'resistor').some(x => x.value >= 100);
        const mA = Math.abs(r.totalCurrent * 1000);
        return led && rSafe && mA > 1 && mA < 40;
      }
    }
  ];

  const setupChallenge = () => {
    const c = challenges[challengeIdx];
    const goalEl = document.getElementById('cl-ch-goal');
    const sucEl = document.getElementById('cl-ch-success');
    const nextEl = document.getElementById('cl-btn-next');
    const scoreEl = document.getElementById('cl-ch-score');
    if (goalEl) goalEl.textContent = c.goal;
    if (sucEl) sucEl.classList.remove('visible');
    if (nextEl) nextEl.classList.remove('visible');
    if (scoreEl) scoreEl.textContent = score;
  };
  const checkChallenge = () => {
    const solved = challenges[challengeIdx].validate();
    const sucEl = document.getElementById('cl-ch-success');
    const nextEl = document.getElementById('cl-btn-next');
    const scoreEl = document.getElementById('cl-ch-score');
    if (solved) {
      if (sucEl && !sucEl.classList.contains('visible')) {
        score += 100;
        if (scoreEl) scoreEl.textContent = score;
        showToast('🎉 Challenge solved! +100 pts', 'success');
      }
      if (sucEl) sucEl.classList.add('visible');
      if (nextEl) nextEl.classList.add('visible');
    }
  };

  // ── Education panel ──
  const refreshEdu = comp => {
    const el = document.getElementById('cl-edu-content');
    if (!el) return;
    if (!comp) {
      el.innerHTML = '<div class="cl-edu-empty">Click any placed component on the canvas to see its schematic symbol, formula, and real-world applications here.</div>';
      return;
    }
    const info = EDU[comp.type]; if (!info) return;
    el.innerHTML = `
<div class="cl-edu-name">${info.name}</div>
<div class="cl-edu-field"><div class="cl-edu-flbl">Formula</div><div class="cl-edu-formula">${info.formula}</div></div>
<div class="cl-edu-field"><div class="cl-edu-flbl">Function</div><div class="cl-edu-fval">${info.fn}</div></div>
<div class="cl-edu-field"><div class="cl-edu-flbl">Applications</div><div class="cl-edu-fval" style="color:var(--cl-text-dim)">${info.apps}</div></div>
<div class="cl-edu-field" style="margin-top:4px"><div class="cl-edu-flbl">Current Value</div><div class="cl-edu-formula">${comp.label}</div></div>`;
  };

  // ── Value editor ──
  const refreshValEditor = comp => {
    const el = document.getElementById('cl-val-editor');
    if (!el) return;
    if (!comp || !['battery', 'resistor', 'capacitor', 'inductor'].includes(comp.type)) {
      el.classList.remove('visible'); return;
    }
    el.classList.add('visible');
    const inp = document.getElementById('cl-val-input');
    const unit = document.getElementById('cl-val-unit');
    if (inp) inp.value = comp.value;
    if (unit) unit.textContent = UNIT_MAP[comp.type] || '';
  };

  // ── [FIX #10] Live value preview on input ──
  document.getElementById('cl-val-input')?.addEventListener('input', () => {
    if (!selected) return;
    const raw = parseFloat(document.getElementById('cl-val-input')?.value);
    if (isNaN(raw) || raw <= 0) return;
    // Preview in edu panel without committing
    const tempComp = { ...selected, value: raw };
    const labels = { battery: `${raw.toFixed(1)} V`, resistor: raw >= 1000 ? `${(raw / 1000).toFixed(1)} kΩ` : `${raw} Ω`, capacitor: `${raw} μF`, inductor: `${raw} mH` };
    tempComp.label = labels[selected.type] || `${raw}`;
    refreshEdu(tempComp);
  });

  // ── Load experiment ──
  const mk = (id, type, x, y, ang, val, label, extra = {}) => ({
    id, type, x, y, angle: ang, value: val, label,
    pins: JSON.parse(JSON.stringify(PIN_LIB[type])),
    switchState: 'open', ...extra
  });
  const wire = (fc, fp, tc, tp) => ({ fromCompId: fc, fromPinId: fp, toCompId: tc, toPinId: tp });

  // [FIX #2] All 8 presets fully implemented (halfrect, bjtamp, filter were missing)
  const loadExperiment = name => {
    saveState();
    components = []; wires = []; selected = null;
    const cx = snap(cW / 2), cy = snap(cH / 2);

    if (name === 'led') {
      components = [
        mk('bat', 'battery', cx - 120, cy, 90, 9, '9.0 V'),
        mk('r1', 'resistor', cx, cy - 60, 0, 330, '330 Ω'),
        mk('sw', 'switch', cx + 120, cy, 90, 0, 'Switch', { switchState: 'closed' }),
        mk('led1', 'led', cx, cy + 60, 180, 1, 'LED')
      ];
      wires = [wire('bat', 'p1', 'r1', 'p1'), wire('r1', 'p2', 'sw', 'p1'), wire('sw', 'p2', 'led1', 'p1'), wire('led1', 'p2', 'bat', 'p2')];
      showToast('Loaded: Simple LED Loop', 'success');

    } else if (name === 'divider') {
      components = [
        mk('bat', 'battery', cx - 140, cy, 90, 12, '12.0 V'),
        mk('r1', 'resistor', cx, cy - 50, 0, 1000, '1.0 kΩ'),
        mk('r2', 'resistor', cx, cy + 50, 0, 1000, '1.0 kΩ'),
        mk('gnd', 'ground', cx - 140, cy + 100, 0, 1, 'GND')
      ];
      wires = [wire('bat', 'p1', 'r1', 'p1'), wire('r1', 'p2', 'r2', 'p1'), wire('r2', 'p2', 'bat', 'p2'), wire('bat', 'p2', 'gnd', 'p1')];
      showToast('Loaded: Voltage Divider (midpoint=6V)', 'success');

    } else if (name === 'series') {
      components = [
        mk('bat', 'battery', cx - 120, cy, 90, 12, '12.0 V'),
        mk('r1', 'resistor', cx - 40, cy - 60, 0, 100, '100 Ω'),
        mk('r2', 'resistor', cx + 40, cy - 60, 0, 200, '200 Ω'),
        mk('r3', 'resistor', cx + 120, cy, 90, 300, '300 Ω')
      ];
      wires = [wire('bat', 'p1', 'r1', 'p1'), wire('r1', 'p2', 'r2', 'p1'), wire('r2', 'p2', 'r3', 'p1'), wire('r3', 'p2', 'bat', 'p2')];
      showToast('Loaded: Series Resistors (600Ω total)', 'success');

    } else if (name === 'parallel') {
      // [FIX #1] Parallel wiring: both resistors share the same two nodes
      components = [
        mk('bat', 'battery', cx - 120, cy, 90, 12, '12.0 V'),
        mk('r1', 'resistor', cx, cy - 50, 0, 1000, '1.0 kΩ'),
        mk('r2', 'resistor', cx, cy + 50, 0, 1000, '1.0 kΩ')
      ];
      wires = [
        wire('bat', 'p1', 'r1', 'p1'),
        wire('bat', 'p1', 'r2', 'p1'),
        wire('r1', 'p2', 'bat', 'p2'),
        wire('r2', 'p2', 'bat', 'p2')
      ];
      showToast('Loaded: Parallel Resistors (500Ω equiv)', 'success');

    } else if (name === 'rcharging') {
      components = [
        mk('bat', 'battery', cx - 100, cy, 90, 10, '10.0 V'),
        mk('sw', 'switch', cx - 30, cy - 60, 0, 0, 'Switch', { switchState: 'closed' }),
        mk('r1', 'resistor', cx + 40, cy - 60, 0, 1000, '1.0 kΩ'),
        mk('c1', 'capacitor', cx + 100, cy, 90, 50, '50 μF')
      ];
      wires = [wire('bat', 'p1', 'sw', 'p1'), wire('sw', 'p2', 'r1', 'p1'), wire('r1', 'p2', 'c1', 'p1'), wire('c1', 'p2', 'bat', 'p2')];
      showToast('Loaded: RC Charging Loop (τ=50ms)', 'success');

    } else if (name === 'halfrect') {
      // [FIX #2] Half-wave rectifier: battery → diode → load resistor → back
      components = [
        mk('bat', 'battery', cx - 120, cy, 90, 12, '12.0 V'),
        mk('d1', 'diode', cx, cy - 60, 0, 1, 'Diode'),
        mk('rl', 'resistor', cx + 80, cy, 90, 10000, '10 kΩ'),
        mk('gnd', 'ground', cx - 120, cy + 80, 0, 1, 'GND')
      ];
      wires = [wire('bat', 'p1', 'd1', 'p1'), wire('d1', 'p2', 'rl', 'p1'), wire('rl', 'p2', 'bat', 'p2'), wire('bat', 'p2', 'gnd', 'p1')];
      showToast('Loaded: Half-Wave Rectifier', 'success');

    } else if (name === 'bjtamp') {
      // [FIX #2] NPN BJT common-emitter: battery → collector, base driven via R_b, emitter → gnd
      components = [
        mk('bat', 'battery', cx - 100, cy, 90, 12, '12.0 V'),
        mk('rc', 'resistor', cx + 20, cy - 80, 90, 4700, '4.7 kΩ'),
        mk('rb', 'resistor', cx - 40, cy - 40, 0, 100000, '100 kΩ'),
        mk('q1', 'npn', cx + 20, cy, 0, 100, 'NPN'),
        mk('gnd', 'ground', cx - 100, cy + 80, 0, 1, 'GND')
      ];
      wires = [
        wire('bat', 'p1', 'rc', 'p1'),
        wire('rc', 'p2', 'q1', 'c'),
        wire('bat', 'p1', 'rb', 'p1'),
        wire('rb', 'p2', 'q1', 'b'),
        wire('q1', 'e', 'bat', 'p2'),
        wire('bat', 'p2', 'gnd', 'p1')
      ];
      showToast('Loaded: NPN BJT Common Emitter', 'success');

    } else if (name === 'filter') {
      // [FIX #2] RC Low-pass filter: battery → series resistor → capacitor to ground
      components = [
        mk('bat', 'battery', cx - 120, cy, 90, 9, '9.0 V'),
        mk('r1', 'resistor', cx, cy - 60, 0, 1000, '1.0 kΩ'),
        mk('c1', 'capacitor', cx + 100, cy, 90, 100, '100 μF'),
        mk('gnd', 'ground', cx - 120, cy + 80, 0, 1, 'GND')
      ];
      wires = [wire('bat', 'p1', 'r1', 'p1'), wire('r1', 'p2', 'c1', 'p1'), wire('c1', 'p2', 'bat', 'p2'), wire('bat', 'p2', 'gnd', 'p1')];
      showToast('Loaded: RC Low-Pass Filter (f_c=1.6Hz)', 'success');
    }

    refreshEdu(null); refreshValEditor(null); solve();
  };

  // ── Draw component symbol ──
  const drawComp = comp => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const stroke = isLight ? '#0f172a' : 'rgba(255,255,255,0.88)';
    const fill = isLight ? '#ffffff' : '#020a10';
    const isSel = selected && selected.id === comp.id;

    ctx.save();
    ctx.translate(comp.x, comp.y);
    ctx.rotate(comp.angle * Math.PI / 180);

    if (isSel) { ctx.shadowColor = isLight ? '#0891b2' : '#22d3ee'; ctx.shadowBlur = 14; ctx.strokeStyle = isLight ? '#0891b2' : '#22d3ee'; }
    else { ctx.strokeStyle = stroke; }
    ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    switch (comp.type) {
      case 'battery':
        ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-10, 0); ctx.moveTo(10, 0); ctx.lineTo(40, 0); ctx.stroke();
        ctx.strokeStyle = '#f87171'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, -14); ctx.lineTo(-10, 14); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(10, -9); ctx.lineTo(10, 9); ctx.stroke();
        ctx.fillStyle = '#34d399'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
        ctx.fillText('+', -10, -18);
        ctx.fillStyle = '#f87171'; ctx.fillText('–', 10, -12);
        break;
      case 'resistor':
        ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-20, 0); ctx.moveTo(20, 0); ctx.lineTo(40, 0); ctx.stroke();
        ctx.beginPath(); ctx.rect(-20, -10, 40, 20); ctx.stroke();
        break;
      case 'capacitor':
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-6, 0); ctx.moveTo(6, 0); ctx.lineTo(30, 0); ctx.stroke();
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-6, -14); ctx.lineTo(-6, 14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(6, -14); ctx.lineTo(6, 14); ctx.stroke();
        break;
      case 'inductor':
        ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-21, 0); ctx.moveTo(21, 0); ctx.lineTo(40, 0); ctx.stroke();
        ctx.beginPath();[-15, -3, 9, 21].forEach(cx2 => ctx.arc(cx2, 0, 7, Math.PI, 0, false)); ctx.stroke();
        break;
      case 'diode':
      case 'led': {
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-12, 0); ctx.moveTo(30, 0); ctx.lineTo(12, 0); ctx.stroke();
        const ledOn = comp.type === 'led' && physics && physics.totalCurrent > 0.001;
        ctx.beginPath(); ctx.moveTo(-12, -15); ctx.lineTo(12, 0); ctx.lineTo(-12, 15); ctx.closePath();
        ctx.fillStyle = ledOn ? 'rgba(52,211,153,0.35)' : fill;
        ctx.fill();
        ctx.strokeStyle = ledOn ? '#34d399' : (isSel ? (isLight ? '#0891b2' : '#22d3ee') : stroke);
        ctx.stroke();
        ctx.strokeStyle = isSel ? (isLight ? '#0891b2' : '#22d3ee') : stroke;
        ctx.beginPath(); ctx.moveTo(12, -15); ctx.lineTo(12, 15); ctx.stroke();
        if (ledOn) {
          ctx.fillStyle = '#34d399'; ctx.shadowColor = '#34d399'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(2, -22, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(12, -27, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
        break;
      }
      case 'npn':
        ctx.beginPath(); ctx.arc(0, 0, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-12, -15); ctx.lineTo(-12, 15); ctx.moveTo(-30, 0); ctx.lineTo(-12, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-12, -8); ctx.lineTo(12, -22); ctx.lineTo(12, -30); ctx.moveTo(-12, 8); ctx.lineTo(12, 22); ctx.lineTo(12, 30); ctx.stroke();
        ctx.save(); ctx.translate(2, 16); ctx.rotate(Math.PI / 6);
        ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(2, 2); ctx.lineTo(-2, -8);
        ctx.fillStyle = stroke; ctx.fill(); ctx.restore();
        break;
      case 'switch':
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-16, 0); ctx.moveTo(30, 0); ctx.lineTo(16, 0); ctx.stroke();
        ctx.beginPath(); ctx.arc(-16, 0, 3.5, 0, Math.PI * 2); ctx.arc(16, 0, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = stroke; ctx.fill();
        ctx.strokeStyle = comp.switchState === 'closed' ? '#34d399' : '#fbbf24';
        ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(comp.switchState === 'closed' ? 16 : 12, comp.switchState === 'closed' ? 0 : -18); ctx.stroke();
        break;
      case 'ground':
        ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 0); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.moveTo(-13, 9); ctx.lineTo(13, 9); ctx.moveTo(-5, 18); ctx.lineTo(5, 18); ctx.stroke();
        break;
    }
    ctx.restore();

    // Label
    ctx.save();
    ctx.translate(comp.x, comp.y);
    const isLight2 = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isSel ? (isLight2 ? '#0891b2' : '#22d3ee') : (isLight2 ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.65)');
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(comp.label, 0, comp.type === 'npn' ? -40 : -34);
    ctx.restore();

    // [UX] Always show pin dots while wiring, or for selected component
    if (drawingWire) {
      comp.pins.forEach(pin => {
        const gc = pinCoords(comp, pin.id);
        const isWireSource = wireFrom && wireFrom.id === comp.id && wireFromPin && wireFromPin.id === pin.id;
        ctx.beginPath(); ctx.arc(gc.x, gc.y, isWireSource ? 6 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isWireSource ? 'rgba(251,191,36,0.7)' : 'rgba(34,211,238,0.5)';
        ctx.fill();
        ctx.strokeStyle = isWireSource ? '#fbbf24' : '#22d3ee';
        ctx.lineWidth = 1.2; ctx.stroke();
      });
    } else if (isSel) {
      comp.pins.forEach(pin => {
        const gc = pinCoords(comp, pin.id);
        ctx.beginPath(); ctx.arc(gc.x, gc.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,0.4)'; ctx.fill();
      });
    }
  };

  // ── Draw scope ──
  const drawScope = (can, context, buf, maxVal, color) => {
    const dpr = window.devicePixelRatio || 1;
    can.width = can.clientWidth * dpr;
    can.height = can.clientHeight * dpr;
    const w = can.width, h = can.height;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    context.clearRect(0, 0, w, h);
    // Grid
    context.strokeStyle = isLight ? 'rgba(15,23,42,0.07)' : 'rgba(255,255,255,0.04)';
    context.lineWidth = 0.6;
    for (let x = 0; x < w; x += w / 8) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, h); context.stroke(); }
    for (let y = 0; y < h; y += h / 4) { context.beginPath(); context.moveTo(0, y); context.lineTo(w, y); context.stroke(); }
    // Zero line
    context.strokeStyle = isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.07)';
    context.beginPath(); context.moveTo(0, h / 2); context.lineTo(w, h / 2); context.stroke();
    // Signal
    const originY = h * 0.85, scaleX = w / buf.length, scaleY = (h * 0.7) / (maxVal || 1);
    context.strokeStyle = color; context.lineWidth = 1.8 * dpr;
    context.shadowColor = color; context.shadowBlur = 4;
    context.beginPath();
    for (let i = 0; i < buf.length; i++) {
      const px = i * scaleX, py = originY - buf[i] * scaleY;
      i === 0 ? context.moveTo(px, py) : context.lineTo(px, py);
    }
    context.stroke(); context.shadowBlur = 0;
    // Current value label
    context.fillStyle = isLight ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.45)';
    context.font = `${9 * dpr}px JetBrains Mono, monospace`;
    context.fillText(`${buf[buf.length - 1].toFixed(2)}`, 6 * dpr, 14 * dpr);
  };

  // [FIX #8] Wire hit test: find wire near a point (for right-click delete)
  const wireNearPoint = (mx, my, threshold = 8) => {
    for (let i = wires.length - 1; i >= 0; i--) {
      const w = wires[i];
      const fc = components.find(c => c.id === w.fromCompId);
      const tc = components.find(c => c.id === w.toCompId);
      if (!fc || !tc) continue;
      const a = pinCoords(fc, w.fromPinId);
      const b = pinCoords(tc, w.toPinId);
      // Distance from point to line segment
      const dx = b.x - a.x, dy = b.y - a.y;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;
      const t = Math.max(0, Math.min(1, ((mx - a.x) * dx + (my - a.y) * dy) / lenSq));
      const px = a.x + t * dx, py = a.y + t * dy;
      const dist = Math.hypot(mx - px, my - py);
      if (dist < threshold) return i;
    }
    return -1;
  };

  // ── Main render loop ──
  const renderLoop = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.clearRect(0, 0, cW, cH);

    // [UX #9] Snap ghost for active placement tool
    if (activeTool && mousePosSnapped) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(mousePosSnapped.x, mousePosSnapped.y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Wires
    wires.forEach(w => {
      const fc = components.find(c => c.id === w.fromCompId);
      const tc = components.find(c => c.id === w.toCompId);
      if (!fc || !tc) return;
      const fp = pinCoords(fc, w.fromPinId);
      const tp = pinCoords(tc, w.toPinId);
      const flowing = physics && physics.totalCurrent > 0.0001;
      ctx.strokeStyle = flowing ? (isLight ? '#0284c7' : '#22d3ee') : (isLight ? 'rgba(15,23,42,0.2)' : 'rgba(255,255,255,0.25)');
      ctx.lineWidth = flowing ? 1.8 : 1.2;
      if (flowing) { ctx.shadowColor = isLight ? '#0284c7' : '#22d3ee'; ctx.shadowBlur = 5; }
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(fp.x, fp.y); ctx.lineTo(tp.x, tp.y); ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Components
    components.forEach(comp => drawComp(comp));

    // Temp wire preview
    if (drawingWire && wireTip && wireFrom && wireFromPin) {
      const sp = pinCoords(wireFrom, wireFromPin.id);
      ctx.strokeStyle = 'rgba(251,191,36,0.75)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(wireTip.x, wireTip.y); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Scope feeds
    const bat = components.find(c => c.type === 'battery');
    const v = (physics && bat) ? (physics.nodePotentials[bat.id + '_p1'] || 0) : 0;
    const i = physics ? physics.totalCurrent * 1000 : 0;
    vBuf.shift(); vBuf.push(v);
    iBuf.shift(); iBuf.push(i);
    const isLightScope = document.documentElement.getAttribute('data-theme') === 'light';
    drawScope(scopeV, vCtx, vBuf, 15, isLightScope ? '#6366f1' : '#818cf8');
    drawScope(scopeI, iCtx, iBuf, 30, isLightScope ? '#059669' : '#34d399');

    _animId = requestAnimationFrame(renderLoop);
  };

  // ── Mouse events ──
  canvas.addEventListener('mousedown', e => {
    const m = mouseCoords(e);

    // [FIX #8] Right-click: delete wire near cursor
    if (e.button === 2) {
      e.preventDefault();
      const idx = wireNearPoint(m.x, m.y);
      if (idx >= 0) {
        saveState();
        wires.splice(idx, 1);
        solve(); showToast('Wire deleted.', 'info');
      }
      return;
    }

    // Pin hit check (wire drawing)
    for (const comp of components) {
      for (const pin of comp.pins) {
        const gc = pinCoords(comp, pin.id);
        if (Math.hypot(m.x - gc.x, m.y - gc.y) < PIN_HIT) {
          if (!drawingWire) {
            drawingWire = true; wireFrom = comp; wireFromPin = pin; wireTip = m;
            document.getElementById('cl-wire-hint')?.classList.add('visible');
          } else {
            if (comp.id !== wireFrom.id) {
              saveState();
              const exists = wires.some(w =>
                (w.fromCompId === wireFrom.id && w.fromPinId === wireFromPin.id && w.toCompId === comp.id && w.toPinId === pin.id) ||
                (w.fromCompId === comp.id && w.fromPinId === pin.id && w.toCompId === wireFrom.id && w.toPinId === wireFromPin.id)
              );
              if (!exists) { wires.push({ fromCompId: wireFrom.id, fromPinId: wireFromPin.id, toCompId: comp.id, toPinId: pin.id }); solve(); showToast('Wire connected!', 'success'); }
              else showToast('Wire already exists.', 'info');
            }
            drawingWire = false; wireFrom = null; wireFromPin = null; wireTip = null;
            document.getElementById('cl-wire-hint')?.classList.remove('visible');
          }
          return;
        }
      }
    }

    if (drawingWire) {
      drawingWire = false; wireFrom = null; wireFromPin = null; wireTip = null;
      document.getElementById('cl-wire-hint')?.classList.remove('visible');
      showToast('Wire cancelled.', 'info'); return;
    }
    if (activeTool) { addComp(activeTool, m.x, m.y); return; }

    let hit = null;
    for (let i = components.length - 1; i >= 0; i--) {
      if (Math.hypot(m.x - components[i].x, m.y - components[i].y) < 36) { hit = components[i]; break; }
    }
    if (hit) {
      selected = hit; dragging = hit; dragOff = { x: m.x - hit.x, y: m.y - hit.y };
      refreshEdu(hit); refreshValEditor(hit);
      if (e.detail >= 2 && hit.type === 'switch') {
        saveState();
        hit.switchState = hit.switchState === 'open' ? 'closed' : 'open';
        hit.label = `Switch (${hit.switchState})`;
        solve(); showToast(`Switch ${hit.switchState.toUpperCase()}`, 'info');
      }
    } else {
      selected = null; refreshEdu(null); refreshValEditor(null);
    }
  });

  // [FIX #8] Prevent default context menu on canvas
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  canvas.addEventListener('mousemove', e => {
    const m = mouseCoords(e);
    // [UX #9] Track snap position for ghost
    mousePosSnapped = { x: snap(m.x), y: snap(m.y) };

    // [UX #15] Dynamic cursor
    if (activeTool) {
      canvas.style.cursor = 'crosshair';
    } else {
      const overComp = components.some(c => Math.hypot(m.x - c.x, m.y - c.y) < 36);
      const overPin = components.some(c => c.pins.some(p => Math.hypot(m.x - pinCoords(c, p.id).x, m.y - pinCoords(c, p.id).y) < PIN_HIT));
      canvas.style.cursor = overPin ? 'crosshair' : overComp ? 'pointer' : 'default';
    }

    if (drawingWire) { wireTip = m; return; }
    if (dragging) { dragging.x = snap(m.x - dragOff.x); dragging.y = snap(m.y - dragOff.y); solve(); }
  });

  canvas.addEventListener('mouseup', () => { if (dragging) { saveState(); dragging = null; } });
  canvas.addEventListener('mouseleave', () => { mousePosSnapped = null; });

  // ── Keyboard ──
  // [FIX #6] Guard against duplicate listeners if mount() is called without unmount()
  if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
  _keyHandler = e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if ((e.key === 'Escape') && drawingWire) {
      drawingWire = false; wireFrom = null; wireFromPin = null; wireTip = null;
      document.getElementById('cl-wire-hint')?.classList.remove('visible');
      showToast('Wire cancelled.', 'info');
    }
    if ((e.key === 'r' || e.key === 'R') && selected) {
      saveState(); selected.angle = (selected.angle + 90) % 360; solve(); showToast('Rotated 90°', 'info');
    }
    // [FIX #12] Delete also removes connected wires
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
      saveState();
      const sid = selected.id;
      wires = wires.filter(w => w.fromCompId !== sid && w.toCompId !== sid);
      components = components.filter(c => c.id !== sid);
      selected = null; refreshEdu(null); refreshValEditor(null); solve(); showToast('Component deleted.', 'info');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); applyUndo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); applyRedo(); }
  };
  document.addEventListener('keydown', _keyHandler);

  // ── Button wiring ──
  document.getElementById('cl-btn-undo')?.addEventListener('click', applyUndo);
  document.getElementById('cl-btn-redo')?.addEventListener('click', applyRedo);

  // [FIX #3] In-memory save/load replacing localStorage
  document.getElementById('cl-btn-save')?.addEventListener('click', () => {
    _saveSlot = JSON.stringify({ components, wires });
    showToast('Circuit saved (in-memory)!', 'success');
  });
  document.getElementById('cl-btn-load')?.addEventListener('click', () => {
    if (!_saveSlot) { showToast('No saved circuit found.', 'error'); return; }
    saveState();
    const d = JSON.parse(_saveSlot); components = d.components; wires = d.wires;
    selected = null; refreshEdu(null); refreshValEditor(null); solve(); showToast('Circuit loaded!', 'success');
  });

  const clearModal = document.getElementById('cl-modal');
  document.getElementById('cl-btn-clear')?.addEventListener('click', () => clearModal?.classList.add('open'));
  document.getElementById('cl-modal-cancel')?.addEventListener('click', () => clearModal?.classList.remove('open'));
  document.getElementById('cl-modal-confirm')?.addEventListener('click', () => {
    saveState(); components = []; wires = []; selected = null; activeTool = null;
    document.querySelectorAll('[data-cl-type]').forEach(b => b.classList.remove('active'));
    const badge = document.getElementById('cl-tool-badge');
    if (badge) { badge.textContent = 'CURSOR'; badge.style.color = 'var(--cl-text-dim)'; }
    refreshEdu(null); refreshValEditor(null); solve();
    clearModal?.classList.remove('open'); showToast('Workspace cleared.', 'info');
  });

  document.getElementById('cl-btn-sandbox')?.addEventListener('click', () => {
    viewMode = 'sandbox';
    document.getElementById('cl-btn-sandbox')?.classList.add('active');
    document.getElementById('cl-btn-challenge')?.classList.remove('active');
    document.getElementById('cl-challenge')?.classList.remove('visible');
  });
  document.getElementById('cl-btn-challenge')?.addEventListener('click', () => {
    viewMode = 'challenge';
    document.getElementById('cl-btn-challenge')?.classList.add('active');
    document.getElementById('cl-btn-sandbox')?.classList.remove('active');
    document.getElementById('cl-challenge')?.classList.add('visible');
    setupChallenge(); solve();
  });
  document.getElementById('cl-btn-next')?.addEventListener('click', () => {
    challengeIdx = (challengeIdx + 1) % challenges.length; setupChallenge();
  });

  document.querySelectorAll('[data-cl-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-cl-type');
      const badge = document.getElementById('cl-tool-badge');
      if (activeTool === type) {
        activeTool = null;
        document.querySelectorAll('[data-cl-type]').forEach(b => b.classList.remove('active'));
        if (badge) { badge.textContent = 'CURSOR'; badge.style.color = 'var(--cl-text-dim)'; }
      } else {
        activeTool = type;
        document.querySelectorAll('[data-cl-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (badge) { badge.textContent = type.toUpperCase(); badge.style.color = 'var(--cl-cyan)'; }
        showToast(`Tool: ${type.toUpperCase()} — click canvas to place`, 'info');
      }
    });
  });

  document.getElementById('cl-apply-btn')?.addEventListener('click', () => {
    if (!selected) return;
    const raw = parseFloat(document.getElementById('cl-val-input')?.value);
    if (isNaN(raw) || raw <= 0) { showToast('Enter a positive number.', 'error'); return; }
    saveState();
    selected.value = raw;
    const labels = { battery: `${raw.toFixed(1)} V`, resistor: raw >= 1000 ? `${(raw / 1000).toFixed(1)} kΩ` : `${raw} Ω`, capacitor: `${raw} μF`, inductor: `${raw} mH` };
    selected.label = labels[selected.type] || `${raw}`;
    refreshEdu(selected); refreshValEditor(selected); solve();
    showToast(`Value → ${selected.label}`, 'success');
  });

  document.getElementById('cl-exp-select')?.addEventListener('change', e => {
    const val = e.target.value; if (!val) return;
    loadExperiment(val); e.target.value = '';
  });

  // ──────────────────────────────────────────────────────────────────────────
  // ─── ECE ADVANCED CONCEPTS & ROADMAP EXPLORER LOGIC ───────────────────────
  // ──────────────────────────────────────────────────────────────────────────
  let clrTick = 0;
  let activeConceptId = null;
  let conceptVals = {}; // Stores { conceptId: { paramId: value } }
  let _audioCtx = null;
  let _osc = null;
  let _gain = null;
  let isPlayingTone = false;

  const ROADMAP_LIBRARY = {
    // 🔴 TIER 1 — CORE GAPS
    ac_source: {
      title: 'AC Voltage Source',
      tier: 'Tier 1',
      type: 'Source',
      short: 'Sinusoidal AC power source with configurable frequency & amplitude.',
      theory: 'Unlike constant DC sources, an Alternating Current (AC) voltage source generates a sinusoidal potential difference that alternates polarity over time. It is defined mathematically by its peak voltage (amplitude) and cycle rate (frequency). In ECE, AC sources are the foundation for impedance modeling, reactive network analyses (capacitors/inductors), transformer power systems, and signal processing filters.',
      formula: 'v(t) = V_p · sin(2π · f · t)',
      apps: 'Grid power utilities, function generators, analog signal modulation, transmitter carriers.',
      controls: [
        { id: 'amp', label: 'Peak Amplitude (Vp)', min: 1, max: 15, step: 0.5, val: 5, unit: 'V' },
        { id: 'freq', label: 'Frequency (f)', min: 1, max: 100, step: 1, val: 10, unit: 'Hz' }
      ],
      telemetry: (vals) => [
        { label: 'RMS Voltage', val: `${(vals.amp * 0.707).toFixed(2)} V` },
        { label: 'Peak-to-Peak', val: `${(vals.amp * 2).toFixed(1)} V` },
        { label: 'Period (T)', val: `${(1000 / vals.freq).toFixed(1)} ms` },
        { label: 'Angular Freq (ω)', val: `${(2 * Math.PI * vals.freq).toFixed(1)} rad/s` }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        // Draw symbol
        const cx = 80, cy = h / 2;
        c.strokeStyle = '#f97316'; c.lineWidth = 2.5;
        c.beginPath(); c.arc(cx, cy, 22, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.moveTo(cx - 35, cy); c.lineTo(cx - 22, cy); c.moveTo(cx + 22, cy); c.lineTo(cx + 35, cy); c.stroke();
        // Sine wave inside circle
        c.beginPath();
        for (let dx = -12; dx <= 12; dx++) {
          const dy = 7 * Math.sin((dx / 12) * Math.PI * 2);
          dx === -12 ? c.moveTo(cx + dx, cy + dy) : c.lineTo(cx + dx, cy + dy);
        }
        c.stroke();
        c.fillStyle = '#f97316'; c.font = 'bold 11px monospace'; c.fillText('AC', cx - 7, cy - 26);

        // Draw flowing electron dot
        const flowT = (tick * 0.05) % 1;
        const eX = cx - 35 + flowT * 70;
        c.beginPath(); c.arc(eX, cy, 3.5, 0, Math.PI * 2); c.fillStyle = '#22d3ee'; c.fill();

        // Draw running sine graph on right
        c.strokeStyle = 'rgba(255,255,255,0.1)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(150, h / 2); c.lineTo(w - 20, h / 2); c.stroke(); // Center axis
        
        c.strokeStyle = '#22d3ee'; c.lineWidth = 2; c.shadowColor = '#22d3ee'; c.shadowBlur = 6;
        c.beginPath();
        for (let x = 150; x < w - 20; x++) {
          const t = (x - 150) * 0.005 - tick * 0.02;
          const y = h / 2 - Math.sin(2 * Math.PI * (vals.freq * 0.1) * t) * (vals.amp * 6);
          x === 150 ? c.moveTo(x, y) : c.lineTo(x, y);
        }
        c.stroke(); c.shadowBlur = 0;
      }
    },
    current_source: {
      title: 'Current Source',
      tier: 'Tier 1',
      type: 'Source',
      short: 'Ideal DC/AC current regulator pumping constant current loops.',
      theory: 'An ideal current source supplies a fixed current magnitude regardless of the load impedance or output voltage across its terminals. Unlike voltage sources, its terminal potential difference is determined purely by the external load network. In transistor biasing networks (BJT/MOSFET) and differential pairs, active current mirrors act as current sources to provide robust, temperature-stable biasing.',
      formula: 'I_out = Constant | V_out = I · R_load',
      apps: 'Transistor active biasing, differential pairs, current mirrors, semiconductor testers.',
      controls: [
        { id: 'current', label: 'DC Current (I)', min: 1, max: 100, step: 1, val: 20, unit: 'mA' },
        { id: 'load', label: 'Load Resistor (RL)', min: 100, max: 1000, step: 50, val: 300, unit: 'Ω' }
      ],
      telemetry: (vals) => [
        { label: 'Current Output', val: `${vals.current} mA` },
        { label: 'Terminal Voltage', val: `${((vals.current / 1000) * vals.load).toFixed(2)} V` },
        { label: 'Power Dissipated', val: `${((vals.current / 1000) * (vals.current / 1000) * vals.load * 1000).toFixed(1)} mW` },
        { label: 'Norton Impedance', val: '∞ (Ideal)' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        // Draw symbol
        const cx = 80, cy = h / 2;
        c.strokeStyle = '#f97316'; c.lineWidth = 2.5;
        c.beginPath(); c.arc(cx, cy, 22, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.moveTo(cx - 35, cy); c.lineTo(cx - 22, cy); c.moveTo(cx + 22, cy); c.lineTo(cx + 35, cy); c.stroke();
        // Arrow inside circle pointing right
        c.beginPath(); c.moveTo(cx - 10, cy); c.lineTo(cx + 10, cy); c.lineTo(cx + 4, cy - 6); c.moveTo(cx + 10, cy); c.lineTo(cx + 4, cy + 6); c.stroke();

        // Draw Load resistor on right
        const rx = 200, ry = h / 2 - 40;
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(cx + 35, cy); c.lineTo(rx, cy); c.lineTo(rx, ry + 15);
        // Resistor zig-zag
        c.lineTo(rx - 8, ry + 20); c.lineTo(rx + 8, ry + 25); c.lineTo(rx - 8, ry + 30); c.lineTo(rx + 8, ry + 35); c.lineTo(rx - 8, ry + 40); c.lineTo(rx + 8, ry + 45); c.lineTo(rx, ry + 50);
        c.lineTo(rx, cy + 30); c.lineTo(cx - 35, cy + 30); c.lineTo(cx - 35, cy);
        c.stroke();

        // Annotations
        c.fillStyle = '#f97316'; c.font = '10px monospace'; c.fillText(`${vals.current}mA`, cx - 18, cy - 27);
        c.fillStyle = '#818cf8'; c.fillText(`RL = ${vals.load}Ω`, rx + 14, ry + 35);

        // Animated charge dots looping
        const speed = vals.current * 0.05;
        const ePos = (tick * speed) % 200;
        c.fillStyle = '#34d399';
        c.beginPath();
        if (ePos < 60) {
          c.arc(cx + 35 + ePos, cy, 3, 0, Math.PI * 2);
        } else if (ePos < 120) {
          c.arc(rx, cy + (ePos - 60) * 0.5, 3, 0, Math.PI * 2);
        } else {
          c.arc(rx - (ePos - 120), cy + 30, 3, 0, Math.PI * 2);
        }
        c.fill();
      }
    },
    zener_diode: {
      title: 'Zener Diode',
      tier: 'Tier 1',
      type: 'Active',
      short: 'Reverse-breakdown regulator clamping output nodes.',
      theory: 'A Zener diode is a special semiconductor diode designed to operate safely in its reverse breakdown region. When the reverse bias voltage exceeds its rated threshold (Zener voltage, V_Z), the diode breaks down and maintains a constant voltage across its terminals. This makes it an incredibly popular component for shunt voltage regulators, surge protectors, and reference rails.',
      formula: 'V_out = min(V_in, V_Z)',
      apps: 'Voltage reference rails, shunt regulator circuits, over-voltage clamping, waveform clippers.',
      controls: [
        { id: 'vin', label: 'Input Voltage (Vin)', min: 1, max: 15, step: 0.5, val: 9, unit: 'V' },
        { id: 'vz', label: 'Zener Breakdown (VZ)', min: 3, max: 10, step: 0.5, val: 5, unit: 'V' }
      ],
      telemetry: (vals) => {
        const regulated = Math.min(vals.vin, vals.vz);
        const loopV = Math.max(vals.vin - regulated, 0);
        const curr = loopV / 220; // 220 ohm resistor
        return [
          { label: 'Output Voltage', val: `${regulated.toFixed(2)} V` },
          { label: 'Status', val: vals.vin >= vals.vz ? '⚡ Breakdown (Regulating)' : '🚫 Forward Cutoff' },
          { label: 'Diode Current', val: `${(curr * 1000).toFixed(1)} mA` },
          { label: 'Power Dissipated', val: `${(regulated * curr * 1000).toFixed(1)} mW` }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const regulated = Math.min(vals.vin, vals.vz);

        // Draw regulator schematic circuit
        c.strokeStyle = '#10b981'; c.lineWidth = 1.8;
        // Resistor
        c.beginPath(); c.moveTo(20, h/2); c.lineTo(40, h/2);
        for (let i = 0; i < 5; i++) {
          c.lineTo(45 + i*8, h/2 + (i%2===0 ? -8 : 8));
        }
        c.lineTo(85, h/2); c.lineTo(130, h/2); c.stroke();

        // Zener symbol (vertical shunt to ground)
        c.strokeStyle = vals.vin >= vals.vz ? '#34d399' : 'rgba(255,255,255,0.7)';
        c.beginPath(); c.moveTo(110, h/2); c.lineTo(110, h/2 + 20); c.stroke();
        // Zener symbol triangle
        c.beginPath(); c.moveTo(100, h/2 + 35); c.lineTo(120, h/2 + 35); c.lineTo(110, h/2 + 20); c.closePath();
        c.fillStyle = vals.vin >= vals.vz ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)';
        c.fill(); c.stroke();
        // Zener bent cathode line
        c.beginPath(); c.moveTo(105, h/2 + 16); c.lineTo(110, h/2 + 20); c.lineTo(115, h/2 + 24); c.stroke();
        // Ground reference
        c.beginPath(); c.moveTo(110, h/2 + 35); c.lineTo(110, h/2 + 45); c.moveTo(98, h/2 + 45); c.lineTo(122, h/2 + 45); c.moveTo(104, h/2 + 50); c.lineTo(116, h/2 + 50); c.stroke();

        // Write live voltage tags
        c.fillStyle = '#e2e8f0'; c.font = 'bold 9px monospace';
        c.fillText(`Vin = ${vals.vin.toFixed(1)}V`, 15, h/2 - 12);
        c.fillStyle = '#34d399';
        c.fillText(`Vout = ${regulated.toFixed(1)}V`, 140, h/2 - 12);

        // Draw characteristic regulation graph on right
        const gx = 210, gy = 30, gw = w - gx - 20, gh = h - gy - 30;
        c.strokeStyle = 'rgba(255,255,255,0.1)'; c.lineWidth = 1;
        c.strokeRect(gx, gy, gw, gh);
        // Axes
        c.beginPath();
        c.moveTo(gx, gy + gh/2); c.lineTo(gx + gw, gy + gh/2); // H axis
        c.moveTo(gx + gw/2, gy); c.lineTo(gx + gw/2, gy + gh); // V axis
        c.stroke();

        // Draw Zener curve
        c.strokeStyle = '#818cf8'; c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(gx + 10, gy + gh - 15);
        c.lineTo(gx + gw/2 - 30, gy + gh - 15); // Reverse breakdown plateau
        c.lineTo(gx + gw/2, gy + gh/2); // Breakpoint knee
        c.lineTo(gx + gw/2 + 20, gy + 15); // Forward bias conduction
        c.stroke();

        // Live Operating point dot
        const px = vals.vin >= vals.vz ? (gx + gw/2 - 30) : (gx + gw/2 - (vals.vin / vals.vz) * 30);
        const py = vals.vin >= vals.vz ? (gy + gh - 15) : (gy + gh/2);
        c.fillStyle = '#f87171'; c.shadowColor = '#f87171'; c.shadowBlur = 6;
        c.beginPath(); c.arc(px, py, 4, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0;
      }
    },
    mosfet: {
      title: 'N-channel MOSFET',
      tier: 'Tier 1',
      type: 'Active',
      short: 'Gate-voltage-driven field effect switch and linear amplifier.',
      theory: 'An N-channel Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET) is a voltage-controlled three-terminal semiconductor. It acts as an active switch or amplifier by using gate-to-source potential ($V_{GS}$) to modulate a conductive channel between drain and source. When $V_{GS}$ exceeds the threshold ($V_{th}$), current flows, transitioning from cutoff to either the triode or saturated operational regime.',
      formula: 'V_GS > V_th → conduction | Saturation: I_D = K·(V_GS – V_th)²',
      apps: 'High-speed digital gates (CMOS), H-bridge motor drivers, SMPS power supplies, analog amplifiers.',
      controls: [
        { id: 'vgs', label: 'Gate-Source (VGS)', min: 0, max: 5, step: 0.1, val: 3, unit: 'V' },
        { id: 'vds', label: 'Drain-Source (VDS)', min: 0, max: 10, step: 0.2, val: 5, unit: 'V' }
      ],
      telemetry: (vals) => {
        const Vth = 2.0; // 2.0V threshold
        const K = 50; // transconductance parameter mA/V^2
        let regime = 'Cutoff (OFF)';
        let ID = 0;
        if (vals.vgs < Vth) {
          regime = 'Cutoff (OFF)';
          ID = 0;
        } else {
          const overdrive = vals.vgs - Vth;
          if (vals.vds < overdrive) {
            regime = 'Triode (Ohmic)';
            ID = K * (2 * overdrive * vals.vds - vals.vds * vals.vds);
          } else {
            regime = 'Saturation (Linear Amp)';
            ID = K * overdrive * overdrive;
          }
        }
        return [
          { label: 'Drain Current (ID)', val: `${ID.toFixed(1)} mA` },
          { label: 'Operating Regime', val: regime },
          { label: 'Overdrive Voltage', val: `${Math.max(vals.vgs - Vth, 0).toFixed(1)} V` },
          { label: 'MOSFET Impedance', val: ID > 0.01 ? `${(vals.vds / (ID/1000)).toFixed(0)} Ω` : '∞' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const Vth = 2.0;
        const K = 50;
        const overdrive = Math.max(vals.vgs - Vth, 0);

        // Draw symbol
        const cx = 80, cy = h / 2;
        c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 2;
        c.beginPath();
        // Drain line
        c.moveTo(cx, cy - 35); c.lineTo(cx, cy - 15); c.lineTo(cx - 15, cy - 15);
        // Source line
        c.moveTo(cx, cy + 35); c.lineTo(cx, cy + 15); c.lineTo(cx - 15, cy + 15);
        // Gate vertical plate
        c.moveTo(cx - 24, cy - 20); c.lineTo(cx - 24, cy + 20);
        c.moveTo(cx - 35, cy); c.lineTo(cx - 24, cy); // Gate lead
        // Substrate vertical segments
        c.moveTo(cx - 16, cy - 20); c.lineTo(cx - 16, cy - 10);
        c.moveTo(cx - 16, cy - 5); c.lineTo(cx - 16, cy + 5);
        c.moveTo(cx - 16, cy + 10); c.lineTo(cx - 16, cy + 20);
        // Source-to-substrate back contact
        c.moveTo(cx - 16, cy); c.lineTo(cx, cy); c.lineTo(cx, cy + 15);
        // Body arrow (pointing in for N-channel)
        c.moveTo(cx - 16, cy); c.lineTo(cx - 8, cy - 4); c.moveTo(cx - 16, cy); c.lineTo(cx - 8, cy + 4);
        c.stroke();

        // Write pins
        c.fillStyle = '#64748b'; c.font = '8px monospace';
        c.fillText('D', cx + 5, cy - 28);
        c.fillText('S', cx + 5, cy + 33);
        c.fillText('G', cx - 35, cy - 8);

        // Draw drain curves on right
        const gx = 190, gy = 30, gw = w - gx - 20, gh = h - gy - 30;
        c.strokeStyle = 'rgba(255,255,255,0.06)'; c.strokeRect(gx, gy, gw, gh);
        // Axes
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.beginPath();
        c.moveTo(gx, gy + gh); c.lineTo(gx + gw, gy + gh);
        c.moveTo(gx, gy); c.lineTo(gx, gy + gh);
        c.stroke();

        // Draw dynamic characteristic curves for different Vgs
        c.lineWidth = 1;
        for (let tempVgs = 2.5; tempVgs <= 5.0; tempVgs += 0.5) {
          const tempOver = Math.max(tempVgs - Vth, 0);
          c.strokeStyle = Math.abs(tempVgs - vals.vgs) < 0.2 ? '#22d3ee' : 'rgba(255,255,255,0.1)';
          c.beginPath();
          for (let vdsIdx = 0; vdsIdx <= 10; vdsIdx++) {
            const vx = gx + (vdsIdx / 10) * gw;
            let tempID = 0;
            if (vdsIdx < tempOver * 2) {
              // triode
              const vdsVal = vdsIdx * 0.5;
              tempID = K * (2 * tempOver * vdsVal - vdsVal * vdsVal);
            } else {
              // saturation
              tempID = K * tempOver * tempOver;
            }
            const vy = gy + gh - (tempID / 450) * gh;
            vdsIdx === 0 ? c.moveTo(vx, vy) : c.lineTo(vx, vy);
          }
          c.stroke();
        }

        // Live Operating point dot
        let ID = 0;
        if (vals.vgs >= Vth) {
          if (vals.vds < overdrive) {
            ID = K * (2 * overdrive * vals.vds - vals.vds * vals.vds);
          } else {
            ID = K * overdrive * overdrive;
          }
        }
        const px = gx + (vals.vds / 10) * gw;
        const py = gy + gh - (ID / 450) * gh;
        c.fillStyle = '#f87171'; c.shadowColor = '#f87171'; c.shadowBlur = 6;
        c.beginPath(); c.arc(px, py, 4.5, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0;
      }
    },
    pnp_bjt: {
      title: 'PNP BJT',
      tier: 'Tier 1',
      type: 'Active',
      short: 'Bipolar PNP transistor matching push-pull complementary pairs.',
      theory: 'A Bipolar Junction Transistor (BJT) of the PNP type uses a small base current ($I_B$) flowing OUT of the base to control a much larger emitter-to-collector current ($I_C$). It acts as the polar complement to the NPN transistor. In audio output stages (Class AB amplifiers) and push-pull structures, matching NPN and PNP pairs are used together to amplify the positive and negative cycles of AC signals.',
      formula: 'I_C = β · I_B | I_E = I_C + I_B',
      apps: 'Push-pull output power stages, high-side switches, level shifters, Class AB amplifiers.',
      controls: [
        { id: 'ib', label: 'Base Current (Ib)', min: 0, max: 200, step: 5, val: 50, unit: 'μA' },
        { id: 'beta', label: 'Current Gain (β)', min: 50, max: 300, step: 10, val: 150, unit: 'x' }
      ],
      telemetry: (vals) => {
        const ic = (vals.ib * vals.beta) / 1000; // mA
        const ie = ic + vals.ib / 1000;
        return [
          { label: 'Collector Current', val: `${ic.toFixed(2)} mA` },
          { label: 'Emitter Current', val: `${ie.toFixed(2)} mA` },
          { label: 'Current Ratio', val: `${(ic / (vals.ib / 1000)).toFixed(0)} : 1` },
          { label: 'Config Type', val: 'High-Side PNP' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const ic = (vals.ib * vals.beta) / 1000;

        // Draw BJT PNP symbol (Emitter arrow points INWARD)
        const cx = w/2 - 20, cy = h/2;
        c.strokeStyle = '#10b981'; c.lineWidth = 2.2;
        c.beginPath();
        // Circle border
        c.arc(cx, cy, 25, 0, Math.PI * 2);
        // Base plate
        c.moveTo(cx - 10, cy - 14); c.lineTo(cx - 10, cy + 14);
        c.moveTo(cx - 24, cy); c.lineTo(cx - 10, cy); // Base lead
        // Collector lead
        c.moveTo(cx - 10, cy + 8); c.lineTo(cx + 10, cy + 20); c.lineTo(cx + 10, cy + 32);
        // Emitter lead with inward arrow
        c.moveTo(cx - 10, cy - 8); c.lineTo(cx + 10, cy - 20); c.lineTo(cx + 10, cy - 32);
        c.stroke();

        // Draw PNP arrow (inward on emitter lead)
        c.save();
        c.translate(cx, cy - 14);
        c.rotate(-Math.PI / 6);
        c.fillStyle = '#10b981';
        c.beginPath();
        c.moveTo(-3, -3); c.lineTo(4, 5); c.lineTo(-2, 7); c.closePath();
        c.fill();
        c.restore();

        // Write tags
        c.fillStyle = '#e2e8f0'; c.font = '10px monospace';
        c.fillText(`Ib = ${vals.ib}μA`, cx - 74, cy + 4);
        c.fillStyle = '#34d399';
        c.fillText(`Ic = ${ic.toFixed(2)}mA`, cx + 22, cy + 24);
        c.fillStyle = '#818cf8';
        c.fillText(`Emitter`, cx + 18, cy - 28);
        c.fillText(`Collector`, cx + 18, cy + 40);

        // Animated current flow loops
        c.fillStyle = '#22d3ee';
        const speed = ic * 0.1;
        const ePos = (tick * speed) % 60;
        c.beginPath();
        c.arc(cx + 10, cy - 32 + ePos * 0.8, 3, 0, Math.PI * 2);
        c.fill();
      }
    },
    wire_junction: {
      title: 'Wire Junction / Node',
      tier: 'Tier 1',
      type: 'UI',
      short: 'T-junction dot splitting wire branches under Kirchhoff\'s laws.',
      theory: 'In physical wiring and CAD schematics, a Junction dot indicates a soldered node where multiple branches intersect electrically. Mathematically, it is governed by Kirchhoff\'s Current Law (KCL), which dictates that the algebraic sum of currents entering any node must exactly equal the sum of currents leaving ($I_{entering} = I_{leaving}$). Without junctions, multi-loop parallel networks cannot exist.',
      formula: 'Σ I_in = Σ I_out',
      apps: 'Parallel branch splits, bus networks, feedback loops, diagnostic test points.',
      controls: [
        { id: 'i1', label: 'Branch 1 Input (I1)', min: 10, max: 100, step: 5, val: 40, unit: 'mA' },
        { id: 'i2', label: 'Branch 2 Input (I2)', min: 10, max: 100, step: 5, val: 30, unit: 'mA' }
      ],
      telemetry: (vals) => [
        { label: 'Outflow Current (I3)', val: `${vals.i1 + vals.i2} mA` },
        { label: 'Conservation of Charge', val: 'Σ I = 0 (100% Balanced)' },
        { label: 'Junction Impedance', val: '0.00 Ω (Ideal Node)' },
        { label: 'Node Connections', val: '3 Branches' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const cx = w/2, cy = h/2;
        const i3 = vals.i1 + vals.i2;

        // Draw T junction lines
        c.strokeStyle = '#38bdf8'; c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(cx - 90, cy); c.lineTo(cx + 90, cy); // Horizontal path
        c.moveTo(cx, cy); c.lineTo(cx, cy + 70); // Vertical split
        c.stroke();

        // Draw junction dot
        c.fillStyle = '#22d3ee'; c.shadowColor = '#22d3ee'; c.shadowBlur = 10;
        c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0;

        // Write KCL labels
        c.fillStyle = '#e2e8f0'; c.font = 'bold 10px monospace';
        c.fillText(`I1 = ${vals.i1}mA ➔`, cx - 100, cy - 10);
        c.fillText(`➔ I2 = ${vals.i2}mA`, cx + 36, cy - 10);
        c.fillStyle = '#34d399';
        c.fillText(`➔ I3 = ${i3}mA (Outflow)`, cx + 8, cy + 45);

        // Render animated current flows
        c.fillStyle = '#22d3ee';
        // Loop 1
        const t1 = (tick * (vals.i1 * 0.05)) % 90;
        c.beginPath(); c.arc(cx - 90 + t1, cy, 3.5, 0, Math.PI * 2); c.fill();
        // Loop 2
        const t2 = (tick * (vals.i2 * 0.05)) % 90;
        c.beginPath(); c.arc(cx + 90 - t2, cy, 3.5, 0, Math.PI * 2); c.fill();
        // Down loop
        const t3 = (tick * (i3 * 0.05)) % 70;
        c.beginPath(); c.arc(cx, cy + t3, 3.5, 0, Math.PI * 2); c.fill();
      }
    },

    // 🟠 TIER 2 — HIGH-VALUE ADDITIONS
    opamp: {
      title: 'Op-Amp (ideal)',
      tier: 'Tier 2',
      type: 'Active',
      short: '741-style ideal operational amplifier boosting and buffering signals.',
      theory: 'An Operational Amplifier (Op-Amp) is an integrated linear differential amplifier with high input impedance, low output impedance, and extremely large open-loop gain. In an **Inverting Amplifier** negative-feedback configuration, it drives its inverting input to a virtual ground, scaling output voltage proportional to the feedback-to-input resistance ratio. It clips dynamically if output voltage saturates at power supply rails.',
      formula: 'Gain (A) = –R_f / R_in | V_out = A · V_in',
      apps: 'Signal pre-amplification, mathematical operators (integrators/differentiators), active filters, analog computers.',
      controls: [
        { id: 'vin', label: 'Input Voltage (Vin)', min: -5, max: 5, step: 0.1, val: 1.5, unit: 'V' },
        { id: 'rin', label: 'Input Res (Rin)', min: 1000, max: 10000, step: 500, val: 2000, unit: 'Ω' },
        { id: 'rf', label: 'Feedback Res (Rf)', min: 5000, max: 50000, step: 1000, val: 10000, unit: 'Ω' }
      ],
      telemetry: (vals) => {
        const gain = -(vals.rf / vals.rin);
        let vout = gain * vals.vin;
        const saturated = Math.abs(vout) >= 15;
        if (vout > 15) vout = 15;
        if (vout < -15) vout = -15;
        return [
          { label: 'Voltage Gain (Av)', val: `${gain.toFixed(1)} x` },
          { label: 'Output Voltage', val: `${vout.toFixed(2)} V` },
          { label: 'Status', val: saturated ? '🚨 RAIL SATURATED (±15V)' : '✅ Linear Operation' },
          { label: 'Inverting Terminal', val: '0.00 V (Virtual Ground)' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const gain = -(vals.rf / vals.rin);
        let vout = gain * vals.vin;
        if (vout > 15) vout = 15;
        if (vout < -15) vout = -15;

        // Draw schematic triangle
        const tx = w/2 - 20, ty = h/2;
        c.strokeStyle = '#818cf8'; c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(tx - 30, ty - 25); c.lineTo(tx - 30, ty + 25); c.lineTo(tx + 20, ty); c.closePath();
        c.fillStyle = 'rgba(129,140,248,0.06)'; c.fill(); c.stroke();

        // Terminals
        c.fillStyle = '#64748b'; c.font = 'bold 12px monospace';
        c.fillText('–', tx - 24, ty - 12);
        c.fillText('+', tx - 24, ty + 16);

        // Feedback loop Resistor lines
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(tx - 60, ty - 15); c.lineTo(tx - 60, ty - 45); c.lineTo(tx + 5, ty - 45); c.lineTo(tx + 5, ty - 5);
        c.stroke();

        // Write tags
        c.fillStyle = '#e2e8f0'; c.font = 'bold 9px monospace';
        c.fillText(`Rin: ${(vals.rin/1000).toFixed(1)}k`, tx - 95, ty - 20);
        c.fillText(`Rf: ${(vals.rf/1000).toFixed(0)}k`, tx - 45, ty - 50);
        c.fillStyle = '#34d399';
        c.fillText(`Vout = ${vout.toFixed(1)}V`, tx + 30, ty - 8);

        // Mini waveforms plotter on right bottom
        c.strokeStyle = 'rgba(255,255,255,0.1)'; c.beginPath();
        c.moveTo(w - 110, h - 35); c.lineTo(w - 10, h - 35); c.stroke();
        
        // Input wave (purple)
        c.strokeStyle = '#818cf8'; c.lineWidth = 1.2; c.beginPath();
        for (let x = 0; x <= 100; x++) {
          const px = w - 110 + x;
          const py = h - 35 - Math.sin((x / 100) * Math.PI * 4 + tick * 0.05) * 10;
          x === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.stroke();

        // Output wave (cyan, inverted, amplified)
        c.strokeStyle = '#22d3ee'; c.lineWidth = 1.5; c.beginPath();
        for (let x = 0; x <= 100; x++) {
          const px = w - 110 + x;
          const py = h - 35 + Math.sin((x / 100) * Math.PI * 4 + tick * 0.05) * Math.max(Math.min(10 * -gain, 25), -25);
          x === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.stroke();
      }
    },
    transformer: {
      title: 'Transformer',
      tier: 'Tier 2',
      type: 'Passive',
      short: 'Magnetic core coupling scaling primary to secondary AC power.',
      theory: 'A transformer transfers electrical energy between two isolation loops using electromagnetic induction. A time-varying AC current in the **Primary Coil** generates a changing magnetic flux inside a ferromagnetic core, inducing a corresponding AC voltage in the **Secondary Coil**. The scale factor is determined by the Turns Ratio ($N_p/N_s$). Neglecting heat, input power equals output power.',
      formula: 'V_sec = V_pri · (N_sec / N_pri) | I_sec = I_pri · (N_pri / N_sec)',
      apps: 'AC grid step-down, electrical isolation, battery chargers, impedance matching networks.',
      controls: [
        { id: 'vpri', label: 'Primary AC (Vpri)', min: 10, max: 120, step: 5, val: 60, unit: 'V' },
        { id: 'ratio', label: 'Turns Ratio (Np/Ns)', min: 1, max: 10, step: 0.5, val: 4, unit: ':1' }
      ],
      telemetry: (vals) => {
        const vsec = vals.vpri / vals.ratio;
        return [
          { label: 'Secondary AC', val: `${vsec.toFixed(1)} V RMS` },
          { label: 'Step Type', val: vals.ratio > 1 ? 'Step-Down' : 'Step-Up' },
          { label: 'Voltage Ratio', val: `${vals.ratio} : 1` },
          { label: 'Primary Current Ratio', val: `1 : ${vals.ratio}` }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const vsec = vals.vpri / vals.ratio;

        // Draw magnetic core bars
        c.fillStyle = '#374151'; c.fillRect(w/2 - 12, h/2 - 40, 24, 80);
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 1;
        c.strokeRect(w/2 - 12, h/2 - 40, 24, 80);

        // Draw primary coil (left)
        c.strokeStyle = '#fbbf24'; c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(w/2 - 40, h/2 - 30);
        for (let i = 0; i < 8; i++) {
          c.arc(w/2 - 25, h/2 - 25 + i * 7, 6, Math.PI * 1.5, Math.PI * 0.5);
        }
        c.lineTo(w/2 - 40, h/2 + 30);
        c.stroke();

        // Draw secondary coil (right)
        const ns = Math.max(8 / vals.ratio, 2);
        c.strokeStyle = '#60a5fa'; c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(w/2 + 40, h/2 - 30);
        for (let i = 0; i < ns; i++) {
          c.arc(w/2 + 25, h/2 - 25 + i * (60/ns), 6, Math.PI * 0.5, Math.PI * 1.5);
        }
        c.lineTo(w/2 + 40, h/2 + 30);
        c.stroke();

        // Write coil annotations
        c.fillStyle = '#fbbf24'; c.font = 'bold 9px monospace';
        c.fillText(`Primary: ${vals.vpri}V`, w/2 - 90, h/2 - 44);
        c.fillStyle = '#60a5fa';
        c.fillText(`Secondary: ${vsec.toFixed(1)}V`, w/2 + 30, h/2 - 44);

        // Render oscillating magnetic flux loops
        const fluxY = h/2 - 40 + ((tick * 2) % 80);
        c.fillStyle = '#ef4444'; c.beginPath(); c.arc(w/2, fluxY, 3, 0, Math.PI * 2); c.fill();
      }
    },
    voltmeter: {
      title: 'Voltmeter / Probe',
      tier: 'Tier 2',
      type: 'Measure',
      short: 'Placeable node probes outputting voltage relative to ground reference.',
      theory: 'A Voltmeter is a high-resistance measurement probe connected in parallel across any two points in a circuit. It measures the potential difference without drawing meaningful current, keeping circuit loading effects negligible. High input resistance ($>10\text{ M}\Omega$) prevents disturbing delicate transistor circuits or divider nodes.',
      formula: 'V_probe = V_node – V_ground',
      apps: 'Diagnostic loop troubleshooting, oscilloscope channel probes, semiconductor testing.',
      controls: [
        { id: 'vsource', label: 'DC Source Voltage', min: 1, max: 15, step: 0.5, val: 9, unit: 'V' },
        { id: 'r1', label: 'Upper Res (R1)', min: 100, max: 1000, step: 50, val: 400, unit: 'Ω' },
        { id: 'r2', label: 'Lower Res (R2)', min: 100, max: 1000, step: 50, val: 500, unit: 'Ω' }
      ],
      telemetry: (vals) => {
        const measured = vals.vsource * (vals.r2 / (vals.r1 + vals.r2));
        return [
          { label: 'Probed Node Volt', val: `${measured.toFixed(2)} V` },
          { label: 'Circuit Current', val: `${(vals.vsource / (vals.r1 + vals.r2) * 1000).toFixed(1)} mA` },
          { label: 'Loading Effect', val: '< 0.001% (Ideal)' },
          { label: 'Probe Impedance', val: '10 MΩ' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const measured = vals.vsource * (vals.r2 / (vals.r1 + vals.r2));

        // Draw voltage divider network
        const cx = 80, cy = h/2;
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(cx, cy - 50); c.lineTo(cx, cy - 35);
        // Resistor 1
        for (let i = 0; i < 5; i++) c.lineTo(cx + (i%2===0 ? -6:6), cy - 30 + i*5);
        c.lineTo(cx, cy - 5); c.lineTo(cx, cy + 5);
        // Resistor 2
        for (let i = 0; i < 5; i++) c.lineTo(cx + (i%2===0 ? -6:6), cy + 10 + i*5);
        c.lineTo(cx, cy + 35); c.lineTo(cx, cy + 50);
        c.stroke();

        // Connect ground at bottom
        c.beginPath(); c.moveTo(cx, cy + 50); c.lineTo(cx, cy + 60);
        c.moveTo(cx - 10, cy + 60); c.lineTo(cx + 10, cy + 60);
        c.moveTo(cx - 5, cy + 63); c.lineTo(cx + 5, cy + 63);
        c.stroke();

        // Draw cyan probe wire to middle node
        c.strokeStyle = '#22d3ee'; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 40, cy); c.stroke();
        c.fillStyle = '#22d3ee'; c.beginPath(); c.arc(cx, cy, 3.5, 0, Math.PI * 2); c.fill();

        // Vintage gauge on right
        const gx = 210, gy = h/2 - 10, gr = 50;
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 2;
        c.beginPath(); c.arc(gx, gy, gr, Math.PI, 0); c.stroke();
        // Tick marks
        c.strokeStyle = 'rgba(255,255,255,0.4)';
        for (let a = Math.PI; a <= Math.PI*2; a += Math.PI/5) {
          c.beginPath(); c.moveTo(gx + Math.cos(a)*gr, gy + Math.sin(a)*gr); c.lineTo(gx + Math.cos(a)*(gr-6), gy + Math.sin(a)*(gr-6)); c.stroke();
        }
        // Needle rotating
        const pct = measured / 15; // Max 15V
        const theta = Math.PI + Math.max(Math.min(pct, 1), 0) * Math.PI;
        c.strokeStyle = '#f87171'; c.lineWidth = 2.5; c.shadowColor = '#f87171'; c.shadowBlur = 4;
        c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(theta)*(gr - 10), gy + Math.sin(theta)*(gr - 10)); c.stroke();
        c.shadowBlur = 0;

        c.fillStyle = '#22d3ee'; c.font = 'bold 12px monospace';
        c.fillText(`${measured.toFixed(2)} V`, gx - 24, gy + 22);
      }
    },
    ammeter: {
      title: 'Ammeter (Inline)',
      tier: 'Tier 2',
      type: 'Measure',
      short: 'Inline low-resistance meter reading branch currents.',
      theory: 'An Ammeter measures current flowing through a specific loop branch. Unlike voltmeters, it is connected **in series** directly inline. To prevent altering the loop operation, an ammeter must have an extremely low internal resistance ($R_m \approx 0$). Connecting an ammeter in parallel acts as a short circuit and causes catastrophic current spikes.',
      formula: 'I_measured = V_loop / (R_load + R_ammeter)',
      apps: 'System power consumption checks, sensor loops, bias calibration, load diagnostic probes.',
      controls: [
        { id: 'vsource', label: 'Source Voltage', min: 1, max: 15, step: 0.5, val: 10, unit: 'V' },
        { id: 'rload', label: 'Load Resistor', min: 100, max: 1000, step: 50, val: 500, unit: 'Ω' }
      ],
      telemetry: (vals) => {
        const curr = vals.vsource / vals.rload; // Amps
        return [
          { label: 'Measured Current', val: `${(curr * 1000).toFixed(2)} mA` },
          { label: 'Loop Resistance', val: `${vals.rload} Ω` },
          { label: 'Ammeter Drop', val: '< 0.001 V' },
          { label: 'Meter Resistance', val: '0.001 Ω (Ideal)' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const curr = vals.vsource / vals.rload;

        // Draw loop circuit
        const cx = 80, cy = h/2;
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.6;
        c.beginPath();
        // Power supply battery symbol
        c.moveTo(cx - 30, cy - 35); c.lineTo(cx - 30, cy + 35);
        c.moveTo(cx - 30, cy - 10); c.lineTo(cx - 40, cy - 10);
        c.moveTo(cx - 30, cy + 10); c.lineTo(cx - 40, cy + 10);
        c.stroke();

        // Resistor and Ammeter inline
        c.beginPath();
        c.moveTo(cx - 30, cy - 35); c.lineTo(cx + 60, cy - 35);
        // Resistor
        for (let i = 0; i < 5; i++) c.lineTo(cx + 65 + i*5, cy - 35 + (i%2===0 ? -6:6));
        c.lineTo(cx + 90, cy - 35); c.lineTo(cx + 120, cy - 35);
        c.stroke();

        // Ammeter circle inline on right vertical
        c.strokeStyle = '#818cf8'; c.lineWidth = 2;
        c.beginPath(); c.arc(cx + 120, cy, 14, 0, Math.PI * 2); c.stroke();
        c.fillStyle = '#818cf8'; c.font = 'bold 11px monospace'; c.fillText('A', cx + 115, cy + 4);

        // Connect loop back
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(cx + 120, cy + 14); c.lineTo(cx + 120, cy + 35); c.lineTo(cx - 30, cy + 35);
        c.stroke();

        // Vintage Ammeter gauge dial on right
        const gx = 250, gy = h/2 - 10, gr = 50;
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 2;
        c.beginPath(); c.arc(gx, gy, gr, Math.PI, 0); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,0.4)';
        for (let a = Math.PI; a <= Math.PI*2; a += Math.PI/5) {
          c.beginPath(); c.moveTo(gx + Math.cos(a)*gr, gy + Math.sin(a)*gr); c.lineTo(gx + Math.cos(a)*(gr-6), gy + Math.sin(a)*(gr-6)); c.stroke();
        }
        // Needle rotating
        const maxCurr = 0.15; // Max 150mA
        const pct = curr / maxCurr;
        const theta = Math.PI + Math.max(Math.min(pct, 1), 0) * Math.PI;
        c.strokeStyle = '#fbbf24'; c.lineWidth = 2.5; c.shadowColor = '#fbbf24'; c.shadowBlur = 4;
        c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(theta)*(gr - 10), gy + Math.sin(theta)*(gr - 10)); c.stroke();
        c.shadowBlur = 0;

        c.fillStyle = '#818cf8'; c.font = 'bold 12px monospace';
        c.fillText(`${(curr * 1000).toFixed(1)} mA`, gx - 28, gy + 22);
      }
    },
    logic_gates: {
      title: 'Logic Gates (AND/OR/NOT)',
      tier: 'Tier 2',
      type: 'Logic',
      short: 'Basic digital logic gates solving Boolean operations.',
      theory: 'Logic gates are the mathematical building blocks of digital hardware. They process binary inputs (0 or 1, corresponding to Low and High voltage levels) to compute Boolean logic functions. Modern microchips stack billions of nano-scale logic gates (using N-channel and P-channel MOSFET transconductance grids) to run complex operations.',
      formula: 'AND: Y = A · B | OR: Y = A + B | NOT: Y = A\'',
      apps: 'Digital CPUs, control units, arithmetic units, signal decoders.',
      controls: [
        { id: 'gate', label: 'Gate Select', type: 'select', options: ['AND', 'OR', 'XOR', 'NOT'], val: 'AND' },
        { id: 'a', label: 'Input A', type: 'select', options: ['0 (Low)', '1 (High)'], val: '0 (Low)' },
        { id: 'b', label: 'Input B', type: 'select', options: ['0 (Low)', '1 (High)'], val: '0 (Low)' }
      ],
      telemetry: (vals) => {
        const aVal = vals.a.startsWith('1') ? 1 : 0;
        const bVal = vals.b.startsWith('1') ? 1 : 0;
        let outVal = 0;
        if (vals.gate === 'AND') outVal = aVal && bVal;
        else if (vals.gate === 'OR') outVal = aVal || bVal;
        else if (vals.gate === 'XOR') outVal = aVal !== bVal ? 1 : 0;
        else if (vals.gate === 'NOT') outVal = !aVal ? 1 : 0;
        return [
          { label: 'Gate Output (Y)', val: `${outVal} (${outVal === 1 ? 'HIGH' : 'LOW'})` },
          { label: 'Logic Operation', val: `${vals.gate} gate` },
          { label: 'Algebraic Form', val: vals.gate === 'NOT' ? 'Y = A\'' : `Y = A ${vals.gate === 'AND' ? '·' : vals.gate === 'OR' ? '+' : '⊕'} B` },
          { label: 'Propagation Delay', val: '4.5 ns (Realistic)' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const aVal = vals.a.startsWith('1') ? 1 : 0;
        const bVal = vals.b.startsWith('1') ? 1 : 0;
        let outVal = 0;
        if (vals.gate === 'AND') outVal = aVal && bVal;
        else if (vals.gate === 'OR') outVal = aVal || bVal;
        else if (vals.gate === 'XOR') outVal = aVal !== bVal ? 1 : 0;
        else if (vals.gate === 'NOT') outVal = !aVal ? 1 : 0;

        // Draw gate symbol based on selection
        const cx = w/2 - 10, cy = h/2;
        c.strokeStyle = '#e2e8f0'; c.lineWidth = 2.2;
        c.beginPath();

        if (vals.gate === 'AND') {
          // AND Gate shape
          c.moveTo(cx - 25, cy - 20); c.lineTo(cx, cy - 20);
          c.arc(cx, cy, 20, -Math.PI/2, Math.PI/2);
          c.lineTo(cx - 25, cy + 20); c.closePath();
        } else if (vals.gate === 'OR' || vals.gate === 'XOR') {
          // OR / XOR curvature
          c.moveTo(cx - 25, cy - 20);
          c.quadraticCurveTo(cx - 10, cy, cx - 25, cy + 20);
          c.quadraticCurveTo(cx - 10, cy + 20, cx + 15, cy);
          c.quadraticCurveTo(cx - 10, cy - 20, cx - 25, cy - 20);
          if (vals.gate === 'XOR') {
            c.moveTo(cx - 30, cy - 20);
            c.quadraticCurveTo(cx - 15, cy, cx - 30, cy + 20);
          }
        } else if (vals.gate === 'NOT') {
          // Triangle
          c.moveTo(cx - 20, cy - 16); c.lineTo(cx + 8, cy); c.lineTo(cx - 20, cy + 16); c.closePath();
          c.arc(cx + 12, cy, 3, 0, Math.PI*2); // inversion bubble
        }
        c.stroke();

        // Inputs leads
        c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 1.5;
        if (vals.gate === 'NOT') {
          c.beginPath(); c.moveTo(cx - 45, cy); c.lineTo(cx - 20, cy);
          c.moveTo(cx + 15, cy); c.lineTo(cx + 40, cy); c.stroke();
          // Write values
          c.fillStyle = aVal ? '#34d399' : '#e2e8f0'; c.fillText(aVal, cx - 55, cy + 4);
          c.fillStyle = outVal ? '#34d399' : '#e2e8f0'; c.fillText(outVal, cx + 46, cy + 4);
        } else {
          c.beginPath();
          c.moveTo(cx - 45, cy - 10); c.lineTo(cx - 25, cy - 10);
          c.moveTo(cx - 45, cy + 10); c.lineTo(cx - 25, cy + 10);
          c.moveTo(cx + 20, cy); c.lineTo(cx + 45, cy);
          c.stroke();
          // Write values
          c.fillStyle = aVal ? '#34d399' : '#e2e8f0'; c.fillText(aVal, cx - 55, cy - 6);
          c.fillStyle = bVal ? '#34d399' : '#e2e8f0'; c.fillText(bVal, cx - 55, cy + 14);
          c.fillStyle = outVal ? '#34d399' : '#e2e8f0'; c.fillText(outVal, cx + 51, cy + 4);
        }

        // Title text Y output glowing
        if (outVal) {
          c.fillStyle = '#34d399'; c.shadowColor = '#34d399'; c.shadowBlur = 6;
          c.fillText('HIGH (1)', cx + 48, cy - 12);
        } else {
          c.fillStyle = '#64748b';
          c.fillText('LOW (0)', cx + 48, cy - 12);
        }
        c.shadowBlur = 0;
      }
    },
    potentiometer: {
      title: 'Potentiometer',
      tier: 'Tier 2',
      type: 'Passive',
      short: '3-terminal variable voltage divider with sliding wiper.',
      theory: 'A potentiometer is a three-terminal variable resistor. The two outer terminals connect across a resistive track, while the middle terminal (wiper) slides along it. Tapping off voltage from the wiper forms a manual, adjustable voltage divider. This makes it essential for hardware controls like audio volume dials, calibration trimmers, and analog position sensors.',
      formula: 'R1 = R_tot · Wiper | R2 = R_tot · (1 – Wiper)',
      apps: 'Audio volume controls, sensor scaling calibration, voltage regulators, analog joysticks.',
      controls: [
        { id: 'total', label: 'Track Resistance', min: 1000, max: 50000, step: 1000, val: 10000, unit: 'Ω' },
        { id: 'wiper', label: 'Wiper Location', min: 0, max: 100, step: 1, val: 50, unit: '%' }
      ],
      telemetry: (vals) => {
        const r1 = vals.total * (vals.wiper / 100);
        const r2 = vals.total * (1 - vals.wiper / 100);
        return [
          { label: 'R1 (Wiper-to-Low)', val: r1 >= 1000 ? `${(r1/1000).toFixed(1)} kΩ` : `${r1.toFixed(0)} Ω` },
          { label: 'R2 (Wiper-to-High)', val: r2 >= 1000 ? `${(r2/1000).toFixed(1)} kΩ` : `${r2.toFixed(0)} Ω` },
          { label: 'Active Division', val: `${vals.wiper}% : ${100-vals.wiper}%` },
          { label: 'Track Tolerance', val: '± 5.0% (Carbon Type)' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const r1 = vals.total * (vals.wiper / 100);
        const r2 = vals.total * (1 - vals.wiper / 100);

        // Draw potentiometer schematic Symbol
        const cx = w/2 - 40, cy = h/2;
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.8;
        c.beginPath();
        // Terminal A
        c.moveTo(cx - 30, cy); c.lineTo(cx - 15, cy);
        // Resistor body box
        c.strokeRect(cx - 15, cy - 8, 50, 16);
        // Terminal B
        c.moveTo(cx + 35, cy); c.lineTo(cx + 50, cy);
        c.stroke();

        // Draw sliding wiper arrow
        const wx = cx - 15 + (vals.wiper / 100) * 50;
        c.strokeStyle = '#38bdf8'; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(wx, cy + 25); c.lineTo(wx, cy + 10); // Wiper line
        c.lineTo(wx - 4, cy + 14); c.moveTo(wx, cy + 10); c.lineTo(wx + 4, cy + 14); // arrow heads
        c.stroke();

        // Write annotations
        c.fillStyle = '#e2e8f0'; c.font = 'bold 9px monospace';
        c.fillText(`R1 = ${r1 >= 1000 ? (r1/1000).toFixed(1)+'k' : r1.toFixed(0)+'Ω'}`, cx - 35, cy - 16);
        c.fillText(`R2 = ${r2 >= 1000 ? (r2/1000).toFixed(1)+'k' : r2.toFixed(0)+'Ω'}`, cx + 18, cy - 16);
        c.fillStyle = '#38bdf8';
        c.fillText(`Wiper Node (C)`, wx - 34, cy + 36);
      }
    },

    // 🔵 TIER 3 — SIMULATION & ANALYSIS
    dc_operating: {
      title: 'DC operating point (.op)',
      tier: 'Tier 3',
      type: 'Analysis',
      short: 'DC Operating point solving steady-state node voltages.',
      theory: 'A DC Operating Point (.op) analysis computes the static node voltages and loop branch currents of a circuit with all time-varying sources set to steady-state limits. Capacitors act as absolute open circuits (i_c = 0) and inductors act as short circuits (v_l = 0). This is the mandatory first execution phase for physical SPICE engines before performing frequency sweeps or noise calculations.',
      formula: 'G · V_nodes = I_sources (Nodal Matrix Equation)',
      apps: 'BJT amplifier biasing point checks, static power validation, semiconductor operating limit grids.',
      controls: [
        { id: 'vcc', label: 'VCC Supply', min: 1, max: 15, step: 0.5, val: 12, unit: 'V' },
        { id: 'r1', label: 'Res R1', min: 100, max: 1000, step: 50, val: 300, unit: 'Ω' },
        { id: 'r2', label: 'Res R2', min: 100, max: 1000, step: 50, val: 500, unit: 'Ω' }
      ],
      telemetry: (vals) => {
        const current = vals.vcc / (vals.r1 + vals.r2); // Amps
        const vnode = vals.vcc * (vals.r2 / (vals.r1 + vals.r2));
        return [
          { label: 'VCC Source', val: `${vals.vcc.toFixed(1)} V` },
          { label: 'Mid-Node Voltage', val: `${vnode.toFixed(2)} V` },
          { label: 'Loop Branch Current', val: `${(current * 1000).toFixed(1)} mA` },
          { label: 'Ground Node', val: '0.00 V' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const vnode = vals.vcc * (vals.r2 / (vals.r1 + vals.r2));

        // Draw bridge schematic loop with .op values overlaid on nodes
        const cx = w/2 - 40, cy = h/2;
        c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 1.8;
        c.beginPath();
        // Left VCC rail
        c.moveTo(cx - 30, cy - 20); c.lineTo(cx - 30, cy + 20);
        c.stroke();

        // Loops
        c.beginPath();
        c.moveTo(cx - 30, cy); c.lineTo(cx, cy);
        // Resistor 1
        for (let i = 0; i < 5; i++) c.lineTo(cx + 5 + i*5, cy + (i%2===0 ? -6:6));
        c.lineTo(cx + 30, cy); c.lineTo(cx + 60, cy);
        // Resistor 2
        for (let i = 0; i < 5; i++) c.lineTo(cx + 65 + i*5, cy + (i%2===0 ? -6:6));
        c.lineTo(cx + 90, cy); c.lineTo(cx + 120, cy);
        c.stroke();

        // Overlay node voltages in glowing green tags
        c.fillStyle = '#34d399'; c.shadowColor = '#34d399'; c.shadowBlur = 8;
        c.font = 'bold 9px monospace';
        c.fillText(`[Node VCC: ${vals.vcc.toFixed(1)}V]`, cx - 35, cy - 24);
        c.fillText(`[Node Mid: ${vnode.toFixed(2)}V]`, cx + 32, cy + 18);
        c.fillText(`[Node GND: 0.00V]`, cx + 104, cy - 24);
        c.shadowBlur = 0;
      }
    },
    bode_plot: {
      title: 'Frequency sweep (Bode)',
      tier: 'Tier 3',
      type: 'Analysis',
      short: 'Plots AC amplitude & phase curves over a wide frequency spectrum.',
      theory: 'A Frequency Sweep (Bode Plot) graphs the frequency response of a linear system. It sweeps the input source across a wide logarithmic range of frequencies, plotting the absolute voltage Gain Magnitude (in Decibels, dB) and Phase Shift (in degrees) against frequency. This is vital for calculating filter cutoffs, operational amplifier bandwidth, and control loop stability.',
      formula: 'f_c = 1 / (2π · R · C) | Amplitude: H(f) = 1 / sqrt(1 + (f/f_c)²)',
      apps: 'Audio crossover design, active filters, amplifier frequency responses, feedback stability.',
      controls: [
        { id: 'r', label: 'Resistance (R)', min: 100, max: 10000, step: 100, val: 1000, unit: 'Ω' },
        { id: 'c', label: 'Capacitance (C)', min: 1, max: 100, step: 1, val: 10, unit: 'μF' }
      ],
      telemetry: (vals) => {
        const fc = 1 / (2 * Math.PI * vals.r * (vals.c / 1000000));
        return [
          { label: 'Cutoff Freq (fc)', val: `${fc.toFixed(1)} Hz` },
          { label: 'Phase at fc', val: '-45.0 °' },
          { label: 'Loss at fc', val: '-3.01 dB' },
          { label: 'Roll-off Rate', val: '-20 dB/decade' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const fc = 1 / (2 * Math.PI * vals.r * (vals.c / 1000000));

        // Draw Bode grid axes
        const gx = 40, gy = 30, gw = w - gx - 20, gh = h - gy - 30;
        c.strokeStyle = 'rgba(255,255,255,0.08)'; c.lineWidth = 0.8;
        c.strokeRect(gx, gy, gw, gh);
        // Vertical grid lines (log decades)
        for (let i = 1; i < 5; i++) {
          const vx = gx + (i / 5) * gw;
          c.beginPath(); c.moveTo(vx, gy); c.lineTo(vx, gy + gh); c.stroke();
        }
        // Horizontal grid lines (dB decay)
        for (let i = 1; i < 4; i++) {
          const vy = gy + (i / 4) * gh;
          c.beginPath(); c.moveTo(gx, vy); c.lineTo(gx + gw, vy); c.stroke();
        }

        // Draw low-pass Bode amplitude curve
        c.strokeStyle = '#818cf8'; c.lineWidth = 2.2; c.shadowColor = '#818cf8'; c.shadowBlur = 4;
        c.beginPath();
        for (let x = 0; x < gw; x++) {
          const freq = Math.pow(10, (x / gw) * 4); // 1Hz to 10kHz
          const gain = 1 / Math.sqrt(1 + (freq / fc) * (freq / fc));
          const db = 20 * Math.log10(gain);
          const px = gx + x;
          const py = gy + Math.min(Math.max(-db * (gh / 60), 0), gh);
          x === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.stroke(); c.shadowBlur = 0;

        // Draw cursor line at fc
        const fcX = gx + (Math.log10(fc) / 4) * gw;
        if (fcX >= gx && fcX <= gx + gw) {
          c.strokeStyle = '#f87171'; c.lineWidth = 1; c.setLineDash([4, 4]);
          c.beginPath(); c.moveTo(fcX, gy); c.lineTo(fcX, gy + gh); c.stroke();
          c.setLineDash([]);
          // Label
          c.fillStyle = '#f87171'; c.font = 'bold 9px monospace';
          c.fillText(`fc = ${fc.toFixed(0)}Hz`, fcX - 25, gy - 8);
        }
      }
    },
    transient_sim: {
      title: 'Transient simulation',
      tier: 'Tier 3',
      type: 'Analysis',
      short: 'Plots time-domain capacitive charging / discharging trajectories.',
      theory: 'A Transient simulation computes a circuit\'s behavior in the time domain, capturing dynamic transitions like switches closing, capacitor charging, and pulse responses. It divides time into tiny discrete solver steps, executing iterative calculus routines to resolve energy storage derivatives. RC networks charge exponentially governed by the time constant $\tau = R \times C$.',
      formula: 'v_C(t) = V_source · (1 – e^(–t / τ)) | τ = R · C',
      apps: 'Power supply switch-on spikes, timing delay grids, pulse modulation loops, capacitor filtering.',
      controls: [
        { id: 'vs', label: 'Supply Volt (Vs)', min: 1, max: 15, step: 0.5, val: 10, unit: 'V' },
        { id: 'r', label: 'Resistor (R)', min: 1000, max: 10000, step: 500, val: 5000, unit: 'Ω' },
        { id: 'c', label: 'Capacitor (C)', min: 1, max: 100, step: 1, val: 20, unit: 'μF' }
      ],
      telemetry: (vals) => {
        const tau = vals.r * (vals.c / 1000000); // seconds
        const pct63 = vals.vs * 0.632;
        return [
          { label: 'Time Constant (τ)', val: `${(tau * 1000).toFixed(1)} ms` },
          { label: 'Voltage at 1τ (63.2%)', val: `${pct63.toFixed(2)} V` },
          { label: 'Dynamic Step Size', val: '100 μs (SPICE Default)' },
          { label: '99% Charge Time', val: `${(5 * tau * 1000).toFixed(0)} ms` }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const tau = vals.r * (vals.c / 1000000);

        // Draw graph grid axes
        const gx = 40, gy = 30, gw = w - gx - 20, gh = h - gy - 30;
        c.strokeStyle = 'rgba(255,255,255,0.08)'; c.lineWidth = 0.8;
        c.strokeRect(gx, gy, gw, gh);

        // Draw RC exponential charging curve
        c.strokeStyle = '#34d399'; c.lineWidth = 2.2; c.shadowColor = '#34d399'; c.shadowBlur = 4;
        c.beginPath();
        for (let x = 0; x < gw; x++) {
          const t = (x / gw) * 0.5; // Plot first 0.5 seconds
          const volt = vals.vs * (1 - Math.exp(-t / tau));
          const px = gx + x;
          const py = gy + gh - (volt / vals.vs) * gh;
          x === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.stroke(); c.shadowBlur = 0;

        // Running scanner dot
        const scanT = ((tick * 0.002) % 0.5);
        const scanVolt = vals.vs * (1 - Math.exp(-scanT / tau));
        const px = gx + (scanT / 0.5) * gw;
        const py = gy + gh - (scanVolt / vals.vs) * gh;
        c.fillStyle = '#fbbf24'; c.shadowColor = '#fbbf24'; c.shadowBlur = 6;
        c.beginPath(); c.arc(px, py, 4.5, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0;

        // Write live voltage tag
        c.fillStyle = '#fbbf24'; c.font = 'bold 9px monospace';
        c.fillText(`Vc = ${scanVolt.toFixed(2)}V`, px - 25, py - 8);
      }
    },
    param_sweep: {
      title: 'Parameter sweep',
      tier: 'Tier 3',
      type: 'Analysis',
      short: 'Varies a resistance/impedance across a range to plot curve grids.',
      theory: 'A Parameter Sweep runs multiple consecutive simulations while varying a chosen target component value (such as a resistance or capacitor size) across a set range. It plots the resulting terminal currents, voltages, or powers, allowing ECE engineers to identify peak operating limits and ensure circuit safety tolerances.',
      formula: 'Sweep: R_load ∈ [R_min, R_max] | I(R_load) = V / R_load',
      apps: 'Tolerance & sensitivity studies, maximum power matching calibration, safety margin checks.',
      controls: [
        { id: 'vs', label: 'Vsource', min: 1, max: 15, step: 0.5, val: 10, unit: 'V' }
      ],
      telemetry: (vals) => [
        { label: 'Res Sweep Range', val: '100 Ω to 1.0 kΩ' },
        { label: 'Current at 100Ω', val: `${(vals.vs / 100 * 1000).toFixed(0)} mA` },
        { label: 'Current at 1.0kΩ', val: `${(vals.vs / 1000 * 1000).toFixed(0)} mA` },
        { label: 'Sweep Type', val: 'Linear DC Sweep' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const gx = 45, gy = 30, gw = w - gx - 20, gh = h - gy - 30;
        c.strokeStyle = 'rgba(255,255,255,0.08)'; c.lineWidth = 0.8;
        c.strokeRect(gx, gy, gw, gh);

        // Draw sweep curve: Current vs Resistor
        c.strokeStyle = '#ec4899'; c.lineWidth = 2.2; c.beginPath();
        for (let x = 0; x < gw; x++) {
          const r = 100 + (x / gw) * 900;
          const curr = vals.vs / r; // Amps
          const px = gx + x;
          const py = gy + gh - (curr / 0.1) * gh; // Capped max at 100mA
          x === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
        }
        c.stroke();

        // Running point on the curve
        const scanR = 100 + ((tick * 2) % 900);
        const curr = vals.vs / scanR;
        const px = gx + ((scanR - 100) / 900) * gw;
        const py = gy + gh - (curr / 0.1) * gh;
        c.fillStyle = '#22d3ee'; c.beginPath(); c.arc(px, py, 4, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#e2e8f0'; c.font = '8px monospace';
        c.fillText(`${scanR.toFixed(0)}Ω: ${(curr*1000).toFixed(1)}mA`, px - 35, py - 8);
      }
    },
    net_labels: {
      title: 'Net labels',
      tier: 'Tier 3',
      type: 'UI',
      short: 'Virtual net connects implicit nodes without physical schematic wires.',
      theory: 'In CAD schematic layout design, a Net Label acts as a virtual connection between separate nodes. Wires tagged with identical net names (such as `CLK`, `VCC`, or `RESET`) are treated as mathematically connected, bypassing physical line routing. This prevents spaghetti routing, making schematics infinitely more readable.',
      formula: 'Label_A === Label_B → Short Connection',
      apps: 'Multi-sheet circuit systems, power rail grids (VCC/GND), complex digital buses.',
      controls: [
        { id: 'logic', label: 'Input Logic', type: 'select', options: ['0 (LOW)', '1 (HIGH)'], val: '1 (HIGH)' }
      ],
      telemetry: (vals) => [
        { label: 'Virtual Connectivity', val: 'ESTABLISHED' },
        { label: 'Matching Net Tag', val: 'VCC_BUS' },
        { label: 'Loop Resistance', val: '0.00 Ω (Implicit Short)' },
        { label: 'Status', val: vals.logic.startsWith('1') ? 'HIGH (VCC)' : 'LOW (0V)' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const active = vals.logic.startsWith('1');

        // Draw left disconnected pin with a VCC flag
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(30, h/2); c.lineTo(70, h/2); c.stroke();
        // VCC label tag flag
        c.fillStyle = active ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.05)';
        c.strokeStyle = active ? '#22d3ee' : '#64748b';
        c.beginPath(); c.moveTo(70, h/2 - 10); c.lineTo(110, h/2 - 10); c.lineTo(120, h/2); c.lineTo(110, h/2 + 10); c.lineTo(70, h/2 + 10); c.closePath();
        c.fill(); c.stroke();
        c.fillStyle = active ? '#22d3ee' : '#64748b'; c.font = 'bold 9px monospace';
        c.fillText('VCC_BUS', 76, h/2 + 3);

        // Draw matching right disconnected pin with a VCC flag
        c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(w - 30, h/2); c.lineTo(w - 70, h/2); c.stroke();
        // VCC label tag flag
        c.fillStyle = active ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.05)';
        c.strokeStyle = active ? '#22d3ee' : '#64748b';
        c.beginPath(); c.moveTo(w - 70, h/2 - 10); c.lineTo(w - 110, h/2 - 10); c.lineTo(w - 120, h/2); c.lineTo(w - 110, h/2 + 10); c.lineTo(w - 70, h/2 + 10); c.closePath();
        c.fill(); c.stroke();
        c.fillStyle = active ? '#22d3ee' : '#64748b';
        c.fillText('VCC_BUS', w - 115, h/2 + 3);

        // Glow linking dots indicating virtual short
        if (active) {
          c.fillStyle = '#22d3ee'; c.shadowColor = '#22d3ee'; c.shadowBlur = 8;
          c.beginPath(); c.arc(30, h/2, 4, 0, Math.PI*2); c.arc(w - 30, h/2, 4, 0, Math.PI*2); c.fill();
          c.shadowBlur = 0;
        }
      }
    },
    vc_switch: {
      title: 'Voltage-controlled switch',
      tier: 'Tier 3',
      type: 'Active',
      short: 'Control-voltage closed SPST relay switch.',
      theory: 'A Voltage-Controlled Switch (or relay) opens or closes its contacts depending on an external control voltage ($V_c$). When $V_c$ exceeds the preset threshold ($V_{th}$), the switch contacts close (conducting current with zero resistance). This acts as a bridge between analog triggers and digital switching gates.',
      formula: 'V_control >= V_threshold → Closed | V_control < V_threshold → Open',
      apps: 'Electromechanical relays, solid-state switches, analog demultiplexers, protection circuits.',
      controls: [
        { id: 'vcontrol', label: 'Control Volt (Vc)', min: 0, max: 5, step: 0.1, val: 1.5, unit: 'V' },
        { id: 'vth', label: 'Threshold Volt (Vth)', min: 1, max: 4, step: 0.5, val: 2.5, unit: 'V' }
      ],
      telemetry: (vals) => {
        const closed = vals.vcontrol >= vals.vth;
        return [
          { label: 'Switch Status', val: closed ? 'CLOSED (Conducting)' : 'OPEN (Blocked)' },
          { label: 'Control Margin', val: `${(vals.vcontrol - vals.vth).toFixed(1)} V` },
          { label: 'Switch Resistance', val: closed ? '0.00 Ω' : '∞ Ω' },
          { label: 'Relay Coil Draw', val: closed ? '45 mA' : '0 mA' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const closed = vals.vcontrol >= vals.vth;

        // Draw relay electromagnet coil
        const cx = 80, cy = h/2;
        c.strokeStyle = '#a855f7'; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(cx - 30, cy + 25);
        for (let i = 0; i < 4; i++) {
          c.arc(cx - 20 + i*8, cy + 25, 4, Math.PI, 0);
        }
        c.lineTo(cx + 20, cy + 25);
        c.stroke();

        // Draw switch contacts
        c.strokeStyle = closed ? '#34d399' : '#fbbf24'; c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(cx - 30, cy - 15); c.lineTo(cx - 15, cy - 15);
        c.moveTo(cx + 30, cy - 15); c.lineTo(cx + 15, cy - 15);
        c.moveTo(cx - 15, cy - 15); c.lineTo(closed ? cx + 15 : cx + 10, closed ? cy - 15 : cy - 30);
        c.stroke();

        // Draw mechanical linkage line (dotted)
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(cx, cy - 15); c.lineTo(cx, cy + 21); c.stroke();
        c.setLineDash([]);

        // Write annotations
        c.fillStyle = '#a855f7'; c.font = 'bold 9px monospace';
        c.fillText(`Vc = ${vals.vcontrol.toFixed(1)}V`, cx - 35, cy + 44);
        c.fillStyle = closed ? '#34d399' : '#fbbf24';
        c.fillText(closed ? 'CLOSED' : 'OPEN', cx - 16, cy - 36);
      }
    },

    // 🟢 TIER 4 — POLISH & ADVANCED
    seven_seg: {
      title: '7-segment display',
      tier: 'Tier 4',
      type: 'Output',
      short: '8-LED alphanumeric decimal indicator driven by pin controls.',
      theory: 'A 7-segment display uses seven individual light-emitting diodes (labeled a through g) arranged in an 8-shape alongside a decimal point (DP). By selective activation of segments, it displays decimals 0-9 and basic letters. It is highly popular for vintage alarm clocks, industrial gauge meters, and digital dashboard outputs.',
      formula: 'Display: LED A to G | Common Cathode: Low Ground',
      apps: 'Digital clocks, vintage calculator displays, industrial telemetry panels, counter outputs.',
      controls: [
        { id: 'a', label: 'Segment A', type: 'checkbox', val: true },
        { id: 'b', label: 'Segment B', type: 'checkbox', val: true },
        { id: 'c', label: 'Segment C', type: 'checkbox', val: true },
        { id: 'd', label: 'Segment D', type: 'checkbox', val: true },
        { id: 'e', label: 'Segment E', type: 'checkbox', val: true },
        { id: 'f', label: 'Segment F', type: 'checkbox', val: true },
        { id: 'g', label: 'Segment G', type: 'checkbox', val: false }
      ],
      telemetry: (vals) => {
        let litCount = 0;
        ['a','b','c','d','e','f','g'].forEach(s => { if (vals[s]) litCount++; });
        return [
          { label: 'Active Segments', val: `${litCount} / 7` },
          { label: 'Display Value', val: get7SegValue(vals) },
          { label: 'Total Current Draw', val: `${litCount * 15} mA` },
          { label: 'LED Supply Volt', val: '2.1 V' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        // Draw 7 segment segments on a canvas beautifully
        const cx = w/2 - 10, cy = h/2;
        const sw = 35, sh = 6;

        const drawSeg = (x, y, isHor, active) => {
          c.fillStyle = active ? '#22d3ee' : 'rgba(255,255,255,0.03)';
          c.strokeStyle = active ? '#22d3ee' : 'rgba(255,255,255,0.07)';
          c.lineWidth = 1;
          if (active) {
            c.shadowColor = '#22d3ee'; c.shadowBlur = 10;
          }
          c.beginPath();
          if (isHor) {
            c.moveTo(x - sw/2 + 3, y);
            c.lineTo(x - sw/2 + 7, y - sh/2);
            c.lineTo(x + sw/2 - 7, y - sh/2);
            c.lineTo(x + sw/2 - 3, y);
            c.lineTo(x + sw/2 - 7, y + sh/2);
            c.lineTo(x - sw/2 + 7, y + sh/2);
          } else {
            c.moveTo(x, y - sw/2 + 3);
            c.lineTo(x - sh/2, y - sw/2 + 7);
            c.lineTo(x - sh/2, y + sw/2 - 7);
            c.lineTo(x, y + sw/2 - 3);
            c.lineTo(x + sh/2, y + sw/2 - 7);
            c.lineTo(x + sh/2, y - sw/2 + 7);
          }
          c.closePath(); c.fill(); c.stroke();
          c.shadowBlur = 0;
        };

        // Draw A-G
        drawSeg(cx, cy - 36, true, vals.a); // a
        drawSeg(cx + 20, cy - 18, false, vals.b); // b
        drawSeg(cx + 20, cy + 18, false, vals.c); // c
        drawSeg(cx, cy + 36, true, vals.d); // d
        drawSeg(cx - 20, cy + 18, false, vals.e); // e
        drawSeg(cx - 20, cy - 18, false, vals.f); // f
        drawSeg(cx, cy, true, vals.g); // g
      }
    },
    speaker_buzzer: {
      title: 'Speaker / buzzer',
      tier: 'Tier 4',
      type: 'Output',
      short: 'Synthesizes real audible audio beeps proportional to loop frequency.',
      theory: 'A Speaker or Piezo Buzzer converts electrical signals into pressure waves (sound) using electromagnetic coils or expanding piezoelectric crystals. In ECE laboratories, buzzers are used to debug pulse-width modulated (PWM) clock speeds, alarm triggers, and circuit sweeps visually and audibly.',
      formula: 'Sound Pressure: P_audio ∝ V_in | Tone Freq = Signal Freq',
      apps: 'Hardware acoustic alarms, feedback beepers, digital synthesizer toys, sweep tests.',
      controls: [
        { id: 'freq', label: 'Buzzer Pitch', min: 200, max: 2000, step: 20, val: 600, unit: 'Hz' },
        { id: 'volume', label: 'Buzzer Volume', min: 0, max: 100, step: 5, val: 30, unit: '%' }
      ],
      telemetry: (vals) => [
        { label: 'Speaker Impedance', val: '8 Ω' },
        { label: 'Audio Frequency', val: `${vals.freq} Hz` },
        { label: 'Audio Wave Type', val: 'Sinusoidal synth' },
        { label: 'Audible Beep', val: 'Play Tone (Click below)' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        // Update active synthesizer parameters live!
        updateAudioSynth(vals.freq, vals.volume);

        // Draw speaker horn
        const cx = 80, cy = h / 2;
        c.strokeStyle = '#22d3ee'; c.lineWidth = 2.2;
        c.beginPath();
        // Speaker back box
        c.rect(cx - 25, cy - 15, 20, 30);
        // Horn flare
        c.moveTo(cx - 5, cy - 15); c.lineTo(cx + 10, cy - 28); c.lineTo(cx + 10, cy + 28); c.lineTo(cx - 5, cy + 15); c.closePath();
        c.fillStyle = 'rgba(34,211,238,0.06)'; c.fill(); c.stroke();

        // Draw sound waves radiating (rippling with tick)
        const waveScale = 1 + (tick * 0.15) % 3;
        c.strokeStyle = isPlayingTone ? 'rgba(34,211,238,0.85)' : 'rgba(255,255,255,0.15)';
        c.lineWidth = 1.5;
        if (isPlayingTone) {
          c.shadowColor = '#22d3ee'; c.shadowBlur = 8;
        }
        for (let i = 1; i <= 3; i++) {
          const r = 24 + i*14 * waveScale * 0.4;
          c.beginPath();
          c.arc(cx + 10, cy, r, -Math.PI / 4, Math.PI / 4);
          c.stroke();
        }
        c.shadowBlur = 0;

        c.fillStyle = isPlayingTone ? '#34d399' : '#64748b'; c.font = 'bold 9px monospace';
        c.fillText(isPlayingTone ? '🔊 AUDIBLE TONE' : '🔇 MUTED (Click Tone button)', cx + 46, cy + 4);
      }
    },
    photoresistor: {
      title: 'Photoresistor (LDR)',
      tier: 'Tier 4',
      type: 'Passive',
      short: 'Interactive light-dependent resistor that scales down resistance with lux.',
      theory: 'A Photoresistor (or Light-Dependent Resistor, LDR) uses photoconductivity to scale down its resistance as ambient light intensity increases. Photons striking its semiconductor track kick bound valence electrons into the conduction band, increasing free charge carrier density. It is highly popular for daylight sensors and light triggers.',
      formula: 'R_LDR = 500 / Lux  kΩ',
      apps: 'Automatic street lights, camera exposure meters, security light beams, solar panels.',
      controls: [
        { id: 'lux', label: 'Light Level (Lux)', min: 1, max: 1000, step: 10, val: 50, unit: 'Lux' }
      ],
      telemetry: (vals) => {
        const r = 500 / vals.lux; // kOhm
        return [
          { label: 'LDR Resistance', val: r >= 1.0 ? `${r.toFixed(2)} kΩ` : `${(r*1000).toFixed(0)} Ω` },
          { label: 'Conductivity', val: `${(1 / r).toFixed(4)} mS` },
          { label: 'Status', val: vals.lux < 20 ? '🌑 Pitch Black' : vals.lux > 700 ? '☀️ Intense Sunlight' : '🌤️ Ambient Room' },
          { label: 'Track material', val: 'Cadmium Sulfide (CdS)' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const r = 500 / vals.lux;

        // Draw LDR circle symbol
        const cx = 80, cy = h/2;
        c.strokeStyle = '#a855f7'; c.lineWidth = 2;
        c.beginPath(); c.arc(cx, cy, 22, 0, Math.PI * 2); c.stroke();
        // Zig-zag photoresistor track inside
        c.beginPath();
        c.moveTo(cx - 30, cy); c.lineTo(cx - 14, cy);
        c.lineTo(cx - 10, cy - 8); c.lineTo(cx - 5, cy + 8); c.lineTo(cx, cy - 8); c.lineTo(cx + 5, cy + 8); c.lineTo(cx + 10, cy - 8);
        c.lineTo(cx + 14, cy); c.lineTo(cx + 30, cy);
        c.stroke();

        // Draw light source sun on top right
        const sx = 200, sy = 50;
        c.strokeStyle = '#fbbf24'; c.lineWidth = 1.6;
        c.beginPath(); c.arc(sx, sy, 12, 0, Math.PI*2); c.stroke();
        // Rays radiating
        const rayLen = 14 + 3 * Math.sin(tick * 0.08);
        for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
          c.beginPath(); c.moveTo(sx + Math.cos(a)*15, sy + Math.sin(a)*15); c.lineTo(sx + Math.cos(a)*(15+rayLen), sy + Math.sin(a)*(15+rayLen)); c.stroke();
        }

        // Annotations
        c.fillStyle = '#a855f7'; c.font = 'bold 9px monospace';
        c.fillText(`R = ${r >= 1.0 ? r.toFixed(1)+'kΩ' : (r*1000).toFixed(0)+'Ω'}`, cx - 32, cy + 34);
      }
    },
    thermistor: {
      title: 'Thermistor (NTC)',
      tier: 'Tier 4',
      type: 'Passive',
      short: 'Temperature-sensitive resistor modeling thermal to voltage systems.',
      theory: 'A Thermistor is a temperature-sensitive resistor made from metal oxides. Under a **Negative Temperature Coefficient (NTC)** model, its resistance decreases exponentially as temperature increases because thermal agitation excites valence electrons into conduction loops. It maps thermal curves using the beta equation.',
      formula: 'R(T) = R_0 · e^[ β · (1/T – 1/T_0) ]',
      apps: 'Automotive engine cooling loops, digital thermostats, over-temperature protection.',
      controls: [
        { id: 'temp', label: 'Temperature (T)', min: -40, max: 125, step: 2, val: 25, unit: '°C' }
      ],
      telemetry: (vals) => {
        const beta = 3950;
        const r0 = 10000; // 10k at 25C
        const t0 = 298.15; // 25C in Kelvin
        const tk = vals.temp + 273.15;
        const res = r0 * Math.exp(beta * (1 / tk - 1 / t0));
        return [
          { label: 'NTC Resistance', val: res >= 1000 ? `${(res/1000).toFixed(2)} kΩ` : `${res.toFixed(0)} Ω` },
          { label: 'Kelvin Temp', val: `${tk.toFixed(1)} K` },
          { label: 'Current Factor', val: `${(res / r0).toFixed(3)} x` },
          { label: 'Material type', val: 'NTC Sintered Oxide' }
        ];
      },
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const beta = 3950;
        const r0 = 10000;
        const tk = vals.temp + 273.15;
        const res = r0 * Math.exp(beta * (1 / tk - 298.15));

        // Draw Thermistor symbol (Resistor with diagonal temperature line)
        const cx = 80, cy = h/2;
        c.strokeStyle = '#ec4899'; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(cx - 35, cy); c.lineTo(cx - 20, cy);
        c.strokeRect(cx - 20, cy - 8, 40, 16);
        c.lineTo(cx + 20, cy); c.lineTo(cx + 35, cy);
        // Diagonal NTC strike
        c.moveTo(cx - 15, cy + 15); c.lineTo(cx + 15, cy - 15);
        c.stroke();

        // Thermometer on right
        const tx = 210, ty = h/2 - 40;
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 2;
        c.strokeRect(tx, ty, 10, 60);
        // Bulb
        c.beginPath(); c.arc(tx + 5, ty + 60, 10, 0, Math.PI*2); c.stroke();
        // Red mercury mercury filling based on temp
        c.fillStyle = '#ef4444';
        c.beginPath(); c.arc(tx + 5, ty + 60, 8, 0, Math.PI*2); c.fill();
        const pct = Math.max(Math.min((vals.temp + 40) / 165, 1), 0);
        c.fillRect(tx + 2, ty + 60 - pct * 55, 6, pct * 55);

        // Annotations
        c.fillStyle = '#ec4899'; c.font = 'bold 9px monospace';
        c.fillText(`R = ${res >= 1000 ? (res/1000).toFixed(1)+'k' : res.toFixed(0)+'Ω'}`, cx - 35, cy - 16);
        c.fillStyle = '#ef4444';
        c.fillText(`${vals.temp}°C`, tx + 20, ty + 24);
      }
    },
    subcircuit: {
      title: 'Custom subcircuit block',
      tier: 'Tier 4',
      type: 'UI',
      short: 'Combines sub-schematics into a hierarchical black-box terminal.',
      theory: 'A Custom Subcircuit groups multiple lower-level components (such as a multi-stage transistor amplifier or logic decoder) into a single black-box component block with named pins. In complex schematics, this enables clean, hierarchical design, allowing engineers to structure high-density chips modularly.',
      formula: '.SUBCKT AMP_BLOCK IN OUT VCC GND',
      apps: 'Hierarchical IC design, macro-modeling logic blocks, custom analog modules.',
      controls: [
        { id: 'config', label: 'Preset Block', type: 'select', options: ['Dual_Resistor', 'Operational_Amplifier'], val: 'Dual_Resistor' }
      ],
      telemetry: (vals) => [
        { label: 'Subcircuit ID', val: 'BLOCK_A1' },
        { label: 'Macro Pins', val: '4 Pins (In, Out, V+, V-)' },
        { label: 'Nesting Level', val: 'Level 2 (Hierarchical)' },
        { label: 'Status', val: 'COMPILED OK' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        const cx = w/2 - 20, cy = h/2;

        // Draw gray chip package
        c.fillStyle = 'rgba(55,65,81,0.5)';
        c.strokeStyle = '#94a3b8'; c.lineWidth = 2.5;
        c.strokeRect(cx - 30, cy - 35, 60, 70);
        c.fillRect(cx - 30, cy - 35, 60, 70);

        // Draw pin leads
        c.strokeStyle = '#94a3b8'; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(cx - 45, cy - 20); c.lineTo(cx - 30, cy - 20); // IN
        c.moveTo(cx - 45, cy + 20); c.lineTo(cx - 30, cy + 20); // V-
        c.moveTo(cx + 30, cy - 20); c.lineTo(cx + 45, cy - 20); // OUT
        c.moveTo(cx + 30, cy + 20); c.lineTo(cx + 45, cy + 20); // V+
        c.stroke();

        // Write pin names
        c.fillStyle = '#e2e8f0'; c.font = 'bold 7px monospace';
        c.fillText('IN', cx - 24, cy - 17);
        c.fillText('GND', cx - 24, cy + 23);
        c.fillText('OUT', cx + 12, cy - 17);
        c.fillText('VCC', cx + 12, cy + 23);

        c.fillStyle = '#94a3b8'; c.font = 'bold 10px monospace';
        c.fillText('MACRO', cx - 15, cy + 4);
      }
    },
    spice_export: {
      title: 'SPICE netlist export',
      tier: 'Tier 4',
      type: 'Export',
      short: 'Generates real LTspice / Falstad netlist code instantly.',
      theory: 'SPICE Netlists are plain-text code files that serve as standard instructions for simulation engines like LTspice or Falstad. They list every component ($R, C, D, V$) alongside their exact wire node connection numbers (e.g. `V1 1 0 DC 9`). Learning to read and write netlists bridges graphical schematics to industry SPICE solver software.',
      formula: '.cir / .net ASCII netlist representation',
      apps: 'Importing circuits into LTspice, physical simulation engine interfaces, netlist diagnostics.',
      controls: [
        { id: 'type', label: 'Preset Circuit', type: 'select', options: ['LED_Loop', 'RC_Charging', 'Divider'], val: 'LED_Loop' }
      ],
      telemetry: (vals) => [
        { label: 'ASCII Format', val: 'SPICE compatible (.cir)' },
        { label: 'Node Connections', val: 'V1 (1➔0), R1 (1➔2), D1 (2➔0)' },
        { label: 'Export Status', val: 'SYNTAX OK' },
        { label: 'Clipboard Status', val: 'Ready to copy' }
      ],
      draw: (can, c, vals, tick) => {
        const w = can.width, h = can.height;
        c.clearRect(0, 0, w, h);
        drawGrid(c, w, h);

        // Render code console output terminal on canvas
        const cx = 20, cy = 20, cw = w - 40, ch = h - 40;
        c.fillStyle = '#010409'; c.fillRect(cx, cy, cw, ch);
        c.strokeStyle = 'rgba(34,211,238,0.25)'; c.strokeRect(cx, cy, cw, ch);

        // Header bar
        c.fillStyle = 'rgba(34,211,238,0.08)'; c.fillRect(cx, cy, cw, 16);
        c.fillStyle = '#22d3ee'; c.font = 'bold 7.5px monospace';
        c.fillText('⚡ NETLIST EDITOR TERMINAL', cx + 10, cy + 11);

        // Code syntax
        c.fillStyle = '#34d399';
        let lines = [];
        if (vals.type === 'LED_Loop') {
          lines = [
            '* Interactive LED Loop Netlist',
            'V1 1 0 DC 9.0',
            'R1 1 2 330',
            'D1 2 0 LED_GREEN',
            '.model LED_GREEN D(Vj=1.8)',
            '.op',
            '.end'
          ];
        } else if (vals.type === 'RC_Charging') {
          lines = [
            '* RC Charging Loop Netlist',
            'V1 1 0 DC 10.0',
            'R1 1 2 1.0k',
            'C1 2 0 50u IC=0',
            '.tran 100u 100m',
            '.end'
          ];
        } else {
          lines = [
            '* Voltage Divider Netlist',
            'V1 1 0 DC 12.0',
            'R1 1 2 1.0k',
            'R2 2 0 1.0k',
            '.op',
            '.end'
          ];
        }

        lines.forEach((line, i) => {
          c.fillStyle = line.startsWith('*') ? '#64748b' : line.startsWith('.') ? '#818cf8' : '#e2e8f0';
          c.fillText(line, cx + 15, cy + 34 + i * 14);
        });
      }
    }
  };

  function get7SegValue(vals) {
    const s = ['a','b','c','d','e','f','g'].map(x => vals[x] ? '1' : '0').join('');
    // Decodes classic numbers
    const codes = {
      '1111110': '0', '0110000': '1', '1101101': '2', '1111001': '3', '0110011': '4',
      '1011011': '5', '1011111': '6', '1110000': '7', '1111111': '8', '1111011': '9',
      '1110111': 'A', '0011111': 'b', '1001110': 'C', '0111101': 'd', '1001111': 'E',
      '1000111': 'F'
    };
    return codes[s] || 'CUSTOM';
  }

  function drawGrid(c, w, h) {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    c.strokeStyle = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)';
    c.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
    }
  }

  // ─── AUDIO SYNTHESIZER FOR PIEZO BUZZER ───
  function initAudioCtx() {
    if (_audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    _audioCtx = new AudioContextClass();
    _gain = _audioCtx.createGain();
    _gain.gain.setValueAtTime(0, _audioCtx.currentTime);
    _gain.connect(_audioCtx.destination);
  }

  function startAudioSynth(freq, volPct) {
    try {
      initAudioCtx();
      if (_osc) return;
      _osc = _audioCtx.createOscillator();
      _osc.type = 'sine';
      _osc.frequency.setValueAtTime(freq, _audioCtx.currentTime);
      _osc.connect(_gain);
      _osc.start();
      isPlayingTone = true;
      updateAudioSynth(freq, volPct);
    } catch(e) {
      console.warn("Web Audio start failed:", e);
    }
  }

  function stopAudioSynth() {
    if (_gain) {
      _gain.gain.linearRampToValueAtTime(0, _audioCtx.currentTime + 0.05);
    }
    setTimeout(() => {
      if (_osc) {
        try { _osc.stop(); } catch(e){}
        _osc.disconnect(); _osc = null;
      }
      isPlayingTone = false;
    }, 60);
  }
  _stopAudioSynthRef = stopAudioSynth;

  function updateAudioSynth(freq, volPct) {
    if (!_audioCtx || !_osc) return;
    _osc.frequency.setTargetAtTime(freq, _audioCtx.currentTime, 0.03);
    const gainVal = (volPct / 100) * 0.15; // Cap gain to protect user hearing
    if (isPlayingTone) {
      _gain.gain.setTargetAtTime(gainVal, _audioCtx.currentTime, 0.02);
    }
  }

  // ─── COMPILE EXPORT TO SPICE NETLIST BLOCK ───
  function getSpiceNetlistString(type) {
    if (type === 'LED_Loop') {
      return `* Nextron SPICE Export - Simple LED Loop\n\nV1 1 0 DC 9.0\nR1 1 2 330\nD1 2 0 LED_GREEN\n\n.model LED_GREEN D(Vj=1.8)\n.op\n.end`;
    } else if (type === 'RC_Charging') {
      return `* Nextron SPICE Export - RC Charging Loop\n\nV1 1 0 DC 10.0\nR1 1 2 1.0k\nC1 2 0 50u IC=0\n\n.tran 100u 100m\n.end`;
    } else {
      return `* Nextron SPICE Export - Voltage Divider\n\nV1 1 0 DC 12.0\nR1 1 2 1.0k\nR2 2 0 1.0k\n\n.op\n.end`;
    }
  }

  // ─── ACTIVE ROADMAP SELECT ───
  function selectConcept(id) {
    activeConceptId = id;
    const cObj = ROADMAP_LIBRARY[id];
    if (!cObj) return;

    // Highlight card
    document.querySelectorAll('.clr-card').forEach(card => {
      card.classList.remove('active');
      if (card.getAttribute('data-clr-id') === id) card.classList.add('active');
    });

    // Show details wrapping
    document.getElementById('clr-details-empty').style.display = 'none';
    const contentBox = document.getElementById('clr-details-content');
    contentBox.style.display = 'flex';

    // Populate metadata
    document.getElementById('clr-det-tier-badge').textContent = cObj.tier;
    document.getElementById('clr-det-type-badge').textContent = cObj.type;
    
    // Set type styling class
    const typeBadge = document.getElementById('clr-det-type-badge');
    typeBadge.className = 'clr-type-badge';
    typeBadge.classList.add(cObj.type.toLowerCase() + '-comp');

    document.getElementById('clr-det-title').textContent = cObj.title;
    document.getElementById('clr-det-short-desc').textContent = cObj.short;
    document.getElementById('clr-det-theory-p').textContent = cObj.theory;
    document.getElementById('clr-det-formula').textContent = cObj.formula;
    document.getElementById('clr-det-apps').textContent = cObj.apps;

    // Initialize values if not present
    if (!conceptVals[id]) {
      conceptVals[id] = {};
      cObj.controls.forEach(ctrl => {
        conceptVals[id][ctrl.id] = ctrl.val;
      });
    }

    // Populate controls panel
    const ctrlPanel = document.getElementById('clr-sandbox-controls');
    ctrlPanel.innerHTML = '';

    cObj.controls.forEach(ctrl => {
      const currentVal = conceptVals[id][ctrl.id];
      const grp = document.createElement('div');
      grp.className = 'clr-sb-slider-group';

      if (ctrl.type === 'select') {
        grp.innerHTML = `
          <div class="clr-sb-slider-lbl">${ctrl.label}: <span id="lbl-${ctrl.id}">${currentVal}</span></div>
          <select class="cl-exp-sel" id="ctrl-${ctrl.id}" style="width:100%;margin-top:4px">
            ${ctrl.options.map(opt => `<option value="${opt}" ${opt === currentVal ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        `;
      } else if (ctrl.type === 'checkbox') {
        grp.innerHTML = `
          <label style="display:flex;align-items:center;gap:8px;font-size:0.7rem;cursor:pointer;user-select:none;color:var(--cl-text)">
            <input type="checkbox" id="ctrl-${ctrl.id}" ${currentVal ? 'checked' : ''} style="accent-color:var(--cl-cyan)" />
            <span>${ctrl.label}</span>
          </label>
        `;
      } else {
        grp.innerHTML = `
          <div class="clr-sb-slider-lbl">${ctrl.label}: <span id="lbl-${ctrl.id}">${currentVal} ${ctrl.unit}</span></div>
          <input type="range" class="clr-sb-slider" id="ctrl-${ctrl.id}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${currentVal}" />
        `;
      }
      ctrlPanel.appendChild(grp);

      // Event hookup
      const element = document.getElementById(`ctrl-${ctrl.id}`);
      if (ctrl.type === 'select') {
        element.addEventListener('change', e => {
          conceptVals[id][ctrl.id] = e.target.value;
          document.getElementById(`lbl-${ctrl.id}`).textContent = e.target.value;
          refreshTelemetry();
        });
      } else if (ctrl.type === 'checkbox') {
        element.addEventListener('change', e => {
          conceptVals[id][ctrl.id] = e.target.checked;
          refreshTelemetry();
        });
      } else {
        element.addEventListener('input', e => {
          const num = parseFloat(e.target.value);
          conceptVals[id][ctrl.id] = num;
          document.getElementById(`lbl-${ctrl.id}`).textContent = `${num} ${ctrl.unit}`;
          refreshTelemetry();
        });
      }
    });

    // Play tone audio button if buzzer
    if (id === 'speaker_buzzer') {
      const buzzerBtnGrp = document.createElement('div');
      buzzerBtnGrp.style.marginTop = '6px';
      buzzerBtnGrp.innerHTML = `<button class="cl-hbtn" id="clr-btn-tone" style="width:100%;border-color:rgba(34,211,238,0.3);color:var(--cl-cyan)">🔊 Play Audible Pitch</button>`;
      ctrlPanel.appendChild(buzzerBtnGrp);

      document.getElementById('clr-btn-tone')?.addEventListener('click', () => {
        const btn = document.getElementById('clr-btn-tone');
        if (isPlayingTone) {
          stopAudioSynth();
          btn.textContent = '🔊 Play Audible Pitch';
          btn.style.color = 'var(--cl-cyan)';
        } else {
          startAudioSynth(conceptVals[id].freq, conceptVals[id].volume);
          btn.textContent = '🔇 Stop Pitch';
          btn.style.color = 'var(--cl-red)';
        }
      });
    }

    // SPICE copy button if netlist
    if (id === 'spice_export') {
      const spiceBtnGrp = document.createElement('div');
      spiceBtnGrp.style.marginTop = '6px';
      spiceBtnGrp.innerHTML = `<button class="cl-hbtn" id="clr-btn-copy-spice" style="width:100%;border-color:rgba(52,211,153,0.3);color:var(--cl-green)">📋 Copy SPICE Netlist</button>`;
      ctrlPanel.appendChild(spiceBtnGrp);

      document.getElementById('clr-btn-copy-spice')?.addEventListener('click', () => {
        const txt = getSpiceNetlistString(conceptVals[id].type);
        navigator.clipboard.writeText(txt);
        showToast('SPICE Netlist copied to clipboard!', 'success');
      });
    }

    refreshTelemetry();
  }

  function refreshTelemetry() {
    const cObj = ROADMAP_LIBRARY[activeConceptId];
    if (!cObj) return;

    const metricsGrid = document.getElementById('clr-det-telemetry-grid');
    metricsGrid.innerHTML = '';

    const list = cObj.telemetry(conceptVals[activeConceptId]);
    list.forEach(metric => {
      const mCard = document.createElement('div');
      mCard.className = 'clr-ro-card';
      mCard.innerHTML = `
        <div class="clr-ro-lbl">${metric.label}</div>
        <div class="clr-ro-val">${metric.val}</div>
      `;
      metricsGrid.appendChild(mCard);
    });
  }

  function drawRoadmapSandbox() {
    clrTick++;
    if (!activeConceptId) return;
    const cObj = ROADMAP_LIBRARY[activeConceptId];
    if (!cObj) return;

    const can = document.getElementById('clr-sandbox-canvas');
    if (!can) return;

    const context = can.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cw = can.parentElement.clientWidth - 280;
    const ch = 240;

    can.width = cw * dpr;
    can.height = ch * dpr;
    can.style.width = cw + 'px';
    can.style.height = ch + 'px';
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    cObj.draw(can, context, conceptVals[activeConceptId], clrTick);
  }

  // ─── WIRE VIEWMODE SWITCH ROADMAP ───
  document.getElementById('cl-btn-roadmap')?.addEventListener('click', () => {
    viewMode = 'roadmap';
    document.getElementById('cl-btn-roadmap')?.classList.add('active');
    document.getElementById('cl-btn-sandbox')?.classList.remove('active');
    document.getElementById('cl-btn-challenge')?.classList.remove('active');
    document.getElementById('cl-challenge')?.classList.remove('visible');
    document.getElementById('cl-roadmap-panel')?.classList.add('visible');

    // Auto-select first concept if none is loaded
    if (!activeConceptId) {
      selectConcept('ac_source');
    }
  });

  document.getElementById('cl-btn-sandbox')?.addEventListener('click', () => {
    viewMode = 'sandbox';
    document.getElementById('cl-btn-sandbox')?.classList.add('active');
    document.getElementById('cl-btn-challenge')?.classList.remove('active');
    document.getElementById('cl-btn-roadmap')?.classList.remove('active');
    document.getElementById('cl-challenge')?.classList.remove('visible');
    document.getElementById('cl-roadmap-panel')?.classList.remove('visible');
    stopAudioSynth();
  });

  document.getElementById('cl-btn-challenge')?.addEventListener('click', () => {
    viewMode = 'challenge';
    document.getElementById('cl-btn-challenge')?.classList.add('active');
    document.getElementById('cl-btn-sandbox')?.classList.remove('active');
    document.getElementById('cl-btn-roadmap')?.classList.remove('active');
    document.getElementById('cl-challenge')?.classList.add('visible');
    document.getElementById('cl-roadmap-panel')?.classList.remove('visible');
    stopAudioSynth();
    setupChallenge(); solve();
  });

  // Wire cards click handlers
  document.querySelectorAll('.clr-card').forEach(card => {
    card.addEventListener('click', () => {
      stopAudioSynth();
      const id = card.getAttribute('data-clr-id');
      selectConcept(id);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // ─── END ROADMAP LOGIC ────────────────────────────────────────────────────
  // ──────────────────────────────────────────────────────────────────────────

  // ── Init ──
  setupChallenge();
  solve();
  renderLoop();
};

// ─── UNMOUNT ─────────────────────────────────────────────────────────────────
export const unmount = () => {
  if (_animId) { cancelAnimationFrame(_animId); _animId = null; }
  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
  if (_resizeHandler) { window.removeEventListener('resize', _resizeHandler); _resizeHandler = null; }
  if (_stopAudioSynthRef) {
    try { _stopAudioSynthRef(); } catch (e) {}
    _stopAudioSynthRef = null;
  }
};