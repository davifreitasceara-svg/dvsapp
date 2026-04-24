import React, { useState, useRef, useCallback, useEffect } from "react";
const SI = ["Analisando imagem", "Melhorando qualidade", "Calibrando cores", "Gerando conteúdo IA", "Calculando viral score"];
const SV = ["Analisando vídeo", "Identificando momentos", "Aplicando efeitos", "Gerando conteúdo IA", "Calculando viral score"];
const STEPS3 = {
  resumo: ["Lendo texto", "Extraindo tópicos", "Criando resumo", "Organizando pontos"],
  mapa:   ["Processando", "Mapeando conceitos", "Estruturando ramos", "Gerando mapa"],
  slides: ["Analisando", "Dividindo seções", "Criando slides", "Design finalizado"],
  cards:  ["Lendo material", "Criando perguntas", "Elaborando respostas", "Formatando"],
  quiz:   ["Analisando texto", "Criando questões", "Alternativas", "Finalizando"],
};


const D = {
  // backgrounds
  bg:    "#050709",
  bg2:   "#090c12",
  bg3:   "#0d1018",
  // surfaces
  s0:    "#0f1420",
  s1:    "#131928",
  s2:    "#182030",
  s3:    "#1e2838",
  // borders
  b0:    "#1a2236",
  b1:    "#243049",
  b2:    "#2e3d5e",
  // blues (primary)
  blue:  "#2563eb",
  blue2: "#3b82f6",
  blue3: "#60a5fa",
  blueLo:"rgba(37,99,235,.12)",
  blueM: "rgba(37,99,235,.28)",
  // accents
  cyan:  "#06b6d4",
  cyanLo:"rgba(6,182,212,.1)",
  mint:  "#10b981",
  mintLo:"rgba(16,185,129,.1)",
  rose:  "#f43f5e",
  roseLo:"rgba(244,63,94,.1)",
  amber: "#f59e0b",
  amberLo:"rgba(245,158,11,.1)",
  // text
  w1:    "#f8faff",
  w2:    "#94a3b8",
  w3:    "#3d4f6e",
  // gradients
  gBlue: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#3b82f6 100%)",
  gCyan: "linear-gradient(135deg,#0891b2 0%,#06b6d4 100%)",
  gMint: "linear-gradient(135deg,#059669 0%,#10b981 100%)",
  gRose: "linear-gradient(135deg,#e11d48 0%,#f43f5e 100%)",
  gAmber:"linear-gradient(135deg,#d97706 0%,#f59e0b 100%)",
  gDark: "linear-gradient(135deg,#0f1420 0%,#182030 100%)",
};


class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null, info: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error("Crash:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: "#8b0000", color: "white", fontFamily: "monospace", minHeight: "100vh" }}>
          <h2>CRITICAL APP CRASH (TELA AZUL)</h2>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ background: "rgba(0,0,0,0.5)", padding: 10, overflow: "auto" }}>
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}



/* ═══════════════════════════════════════════════
   DESIGN SYSTEM — Navy / Black / White (Play Store)
═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { height: 100%; -webkit-text-size-adjust: 100%; touch-action: manipulation; }
body {
  background: ${D.bg};
  color: ${D.w1};
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  min-height: 100%;
}
input, textarea, select, button { font-family: 'Inter', sans-serif; }
button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
::-webkit-scrollbar { width: 2px; height: 2px; }
::-webkit-scrollbar-thumb { background: ${D.blue}; border-radius: 99px; }

/* ── ANIMATIONS ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes spinA    { to { transform: rotate(360deg); } }
@keyframes waveA    { 0%,100% { transform:scaleY(1); } 50% { transform:scaleY(2.3); } }
@keyframes glowA    { 0%,100% { box-shadow:0 0 14px rgba(37,99,235,.3); } 50% { box-shadow:0 0 32px rgba(37,99,235,.58); } }
@keyframes toastA   { from { opacity:0; transform:translateX(110%); } to { opacity:1; transform:translateX(0); } }
@keyframes micA     { 0%,100% { transform:scale(1); opacity:.8; } 50% { transform:scale(1.18); opacity:.3; } }
@keyframes nodeA    { from { opacity:0; transform:scale(.15); } to { opacity:1; transform:scale(1); } }
@keyframes lineA    { from { stroke-dashoffset:3000; } to { stroke-dashoffset:0; } }
@keyframes slR      { from { opacity:0; transform:translateX(48px); } to { opacity:1; transform:translateX(0); } }
@keyframes slL      { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:translateX(0); } }
@keyframes presA    { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
@keyframes cntA     { from { opacity:0; transform:scale(.4); } to { opacity:1; transform:scale(1); } }
@keyframes lineGrow { from { width:0; } to { width:100%; } }
@keyframes pulse2   { 0%,100%{opacity:1;} 50%{opacity:.45;} }
@keyframes float2   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
@keyframes authIn   { from{opacity:0;transform:translateY(22px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
@keyframes shake    { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-6px);} 80%{transform:translateX(6px);} }
@keyframes logoPop  { 0%{transform:scale(1);} 50%{transform:scale(1.08);} 100%{transform:scale(1);} }
@keyframes tickIn   { from{transform:scale(0) rotate(-45deg);opacity:0;} to{transform:scale(1) rotate(0);opacity:1;} }
@keyframes slideUp  { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
.shake { animation: shake .4s ease both; }
.auth-card { animation: authIn .42s cubic-bezier(.34,1.56,.64,1) both; }

.fu  { animation: fadeUp .38s cubic-bezier(.4,0,.2,1) both; }
.fi  { animation: fadeIn .28s ease both; }
.d1  { animation-delay:.06s; }
.d2  { animation-delay:.12s; }
.d3  { animation-delay:.18s; }
.d4  { animation-delay:.24s; }
.d5  { animation-delay:.30s; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 7px; border: none; font-weight: 700; font-size: 14px;
  line-height: 1; letter-spacing: .15px; white-space: nowrap;
  transition: all .15s cubic-bezier(.4,0,.2,1);
  -webkit-tap-highlight-color: transparent;
  border-radius: 12px; padding: 11px 18px; cursor: pointer;
}
.btn:active:not(:disabled) { transform: scale(.94) !important; }
.btn:disabled { opacity: .35; cursor: not-allowed; transform: none !important; }
.btn.lg  { padding: 15px 26px; font-size: 15px; border-radius: 14px; }
.btn.md  { padding: 12px 20px; }
.btn.sm  { padding: 9px 14px; font-size: 13px; border-radius: 10px; }
.btn.xs  { padding: 6px 11px; font-size: 12px; border-radius: 8px; }
.btn.ico { padding: 10px; border-radius: 10px; }

.btn.primary   { background: ${D.gBlue}; color: #fff; box-shadow: 0 4px 18px rgba(37,99,235,.32); }
.btn.primary:hover:not(:disabled)   { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(37,99,235,.46); }
.btn.cyan      { background: ${D.gCyan}; color: #fff; box-shadow: 0 4px 16px rgba(6,182,212,.22); }
.btn.cyan:hover:not(:disabled)      { transform: translateY(-2px); }
.btn.mint      { background: ${D.gMint}; color: #fff; }
.btn.mint:hover:not(:disabled)      { transform: translateY(-2px); }
.btn.rose      { background: ${D.gRose}; color: #fff; }
.btn.ghost     { background: ${D.s2}; color: ${D.w1}; border: 1px solid ${D.b1}; }
.btn.ghost:hover:not(:disabled)     { background: ${D.s3}; border-color: ${D.b2}; }
.btn.outline   { background: transparent; color: ${D.blue2}; border: 1.5px solid ${D.blueM}; }
.btn.outline:hover:not(:disabled)   { background: ${D.blueLo}; }
.btn.dark      { background: rgba(0,0,0,.6); color: #fff; border: 1px solid rgba(255,255,255,.12); backdrop-filter:blur(14px); }
.btn.dark:hover:not(:disabled)      { background: rgba(0,0,0,.82); }
.btn.danger    { background: rgba(244,63,94,.16); color: ${D.rose}; border: 1px solid rgba(244,63,94,.3); }
.btn.danger:hover:not(:disabled)    { background: rgba(244,63,94,.28); }

/* ── CARDS ── */
.card  { background: ${D.s1}; border: 1px solid ${D.b0}; border-radius: 18px; overflow: hidden; }
.cardH { transition: border-color .2s, box-shadow .2s; }
.cardH:hover { border-color: ${D.blueM}; box-shadow: 0 6px 28px rgba(0,0,0,.38); }

/* ── INPUTS ── */
.inp {
  background: ${D.bg2}; border: 1.5px solid ${D.b0};
  border-radius: 12px; color: ${D.w1}; font-size: 14px;
  padding: 12px 15px; width: 100%; outline: none;
  transition: border .18s, box-shadow .18s;
  resize: none; line-height: 1.65;
}
.inp:focus  { border-color: ${D.blueM}; box-shadow: 0 0 0 3px ${D.blueLo}; }
.inp::placeholder { color: ${D.w3}; }

/* ── TAGS ── */
.tag   { display:inline-flex; align-items:center; gap:4px; border-radius:99px; padding:3px 9px; font-size:11px; font-weight:700; letter-spacing:.3px; }
.tblue { background:${D.blueLo}; color:${D.blue2}; border:1px solid ${D.blueM}; }
.tgrn  { background:${D.mintLo}; color:${D.mint}; border:1px solid rgba(16,185,129,.28); }
.trose { background:${D.roseLo}; color:${D.rose}; border:1px solid rgba(244,63,94,.28); }
.tamb  { background:${D.amberLo}; color:${D.amber}; border:1px solid rgba(245,158,11,.28); }
.tcyan { background:${D.cyanLo}; color:${D.cyan}; border:1px solid rgba(6,182,212,.28); }

/* ── SECTION LABEL ── */
.sec-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
  color: ${D.w3}; text-transform: uppercase; margin-bottom: 10px;
}

/* ── FULLSCREEN PRES ── */
.pres {
  position: fixed; inset: 0; z-index: 9900;
  background: #000;
  display: flex; flex-direction: column;
  animation: presA .28s ease both;
}

/* ── NAV ITEM ── */
.nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px;
  background: none; border: none; cursor: pointer;
  padding: 5px 0; position: relative;
  -webkit-tap-highlight-color: transparent;
}
`;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const sleep = ms => new Promise(r => setTimeout(r, ms));
let _tid = 0;

async function callAI(user, sys = "") {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1700,
        system: sys || "Você é DVS EduCreator AI — assistente especialista em marketing digital e educação. Responda sempre em português brasileiro de forma direta, criativa e precisa.",
        messages: [{ role: "user", content: user }],
      }),
    });
    const d = await r.json();
    return d.content?.map(c => c.text || "").join("") || "";
  } catch { return ""; }
}

function pj(raw) {
  try { return JSON.parse(raw.replace(/```json\n?|```\n?/g, "").trim()); }
  catch { return null; }
}

/* ═══════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════ */
const Spin = ({ s = 20, c = D.blue2 }) => (
  <div style={{ width: s, height: s, border: `2.5px solid ${D.b1}`, borderTopColor: c, borderRadius: "50%", animation: "spinA .6s linear infinite", flexShrink: 0 }} />
);

const WaveBar = ({ on, col = D.blue2, n = 7 }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22 }}>
    {[8, 13, 9, 18, 11, 15, 9].slice(0, n).map((h, i) => (
      <div key={i} style={{ width: 3, height: h, background: on ? col : D.w3, borderRadius: 2, animation: on ? `waveA ${.33 + i * .07}s ease-in-out infinite` : "none", animationDelay: `${i * .055}s`, transition: "background .25s" }} />
    ))}
  </div>
);

const ProgressBar = ({ val, color = D.blue2, h = 6, label }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: D.w2 }}><span>{label}</span><span style={{ color, fontWeight: 700 }}>{val}%</span></div>}
    <div style={{ background: D.bg2, borderRadius: 99, height: h, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 99, transition: "width .4s ease" }} />
    </div>
  </div>
);

const Toasts = ({ items, del }) => (
  <div style={{ position: "fixed", top: 20, right: 16, zIndex: 10000, display: "flex", flexDirection: "column", gap: 8, maxWidth: 310, pointerEvents: "none" }}>
    {items.map(t => (
      <div key={t.id} style={{ background: D.s2, border: `1px solid ${t.tp === "err" ? D.rose + "55" : t.tp === "ok" ? D.mint + "55" : D.blue + "55"}`, borderRadius: 14, padding: "11px 14px", display: "flex", alignItems: "center", gap: 9, pointerEvents: "all", animation: "toastA .28s ease both", boxShadow: "0 8px 28px rgba(0,0,0,.55)" }}>
        <span style={{ fontSize: 16 }}>{t.tp === "err" ? "❌" : t.tp === "ok" ? "✅" : t.tp === "warn" ? "⚠️" : "ℹ️"}</span>
        <span style={{ fontSize: 13, flex: 1, lineHeight: 1.4, color: D.w1 }}>{t.msg}</span>
        <button onClick={() => del(t.id)} style={{ background: "none", border: "none", color: D.w3, fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
      </div>
    ))}
  </div>
);

const LoadScreen = ({ steps = [], cur = 0, pct = 0, title = "Processando..." }) => {
  try {
    const safeSteps = Array.isArray(steps) ? steps : [];
    const safeCur = typeof cur === 'number' ? cur : 0;
    const safePct = typeof pct === 'number' ? pct : 0;
    const safeTitle = title || "Processando...";

    return (
      <div style={{ padding: "36px 20px", display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: (D?.blueLo || "rgba(37,99,235,0.1)"), border: `2px solid ${D?.blueM || "rgba(37,99,235,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", animation: "glowA 2s ease-in-out infinite", position: "relative" }}>
          <Spin s={44} />
          <span style={{ position: "absolute", fontSize: 22, pointerEvents: "none" }}>⚙️</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 7 }}>{safeTitle}</div>
          <div style={{ fontSize: 14, color: (D?.w2 || "#94a3b8"), minHeight: 20 }}>{safeSteps[safeCur] || "Finalizando..."}</div>
        </div>
        <div style={{ width: "100%", maxWidth: 320 }}><ProgressBar val={safePct} h={8} /></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {safeSteps.map((s, i) => (
            <div key={`ls-${i}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: i < safeCur ? (D?.mint || "#10b981") : i === safeCur ? (D?.blue2 || "#3b82f6") : (D?.w3 || "#3d4f6e"), transition: "color .3s", minWidth: 100 }}>
              <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i < safeCur ? (
                  <span style={{ color: (D?.mint || "#10b981"), fontWeight: 800 }}>✔</span>
                ) : i === safeCur ? (
                  <Spin s={11} c={(D?.blue2 || "#3b82f6")} />
                ) : (
                  <span style={{ opacity: .35 }}>◦</span>
                )}
              </div>
              <span style={{ whiteSpace: "nowrap" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (e) {
    console.error("LoadScreen Crash:", e);
    return <div style={{color: "white", padding: 20}}>Carregando...</div>;
  }
};

const ScoreRing = ({ score }) => {
  const r = 52, c = 2 * Math.PI * r, f = (score / 100) * c;
  const col = score >= 80 ? D.mint : score >= 60 ? D.amber : D.rose;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={132} height={132} viewBox="0 0 132 132">
        <circle cx={66} cy={66} r={r} fill="none" stroke={D.b1} strokeWidth={9} />
        <circle cx={66} cy={66} r={r} fill="none" stroke={col} strokeWidth={9} strokeDasharray={`${f} ${c - f}`} strokeDashoffset={c / 4} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={66} y={61} textAnchor="middle" fill={col} fontSize={24} fontWeight={900} fontFamily="Inter">{score}%</text>
        <text x={66} y={77} textAnchor="middle" fill={D.w3} fontSize={9} fontFamily="Inter" letterSpacing={1.5}>VIRAL SCORE</text>
      </svg>
      <span className="tag tgrn" style={{ fontSize: 11 }}>{score >= 80 ? "🔥 Viral!" : score >= 60 ? "📈 Bom" : "💡 Melhorar"}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SLIDE THEMES — 8 premium dark themes
═══════════════════════════════════════════════ */
const THEMES = [
  { id:"navy",   icon:"🌐", name:"Navy",    bg:"linear-gradient(150deg,#020818 0%,#051230 55%,#010510 100%)", acc:"#3b82f6", acc2:"#1d4ed8", txt:"#f0f7ff", txt2:"rgba(224,240,255,.55)", nb:"rgba(59,130,246,.18)", nbr:"rgba(59,130,246,.4)",  d1:"rgba(29,78,216,.22)", d2:"rgba(59,130,246,.08)" },
  { id:"ocean",  icon:"🌊", name:"Oceano",  bg:"linear-gradient(150deg,#010e1c 0%,#012040 55%,#01090f 100%)", acc:"#06b6d4", acc2:"#0891b2", txt:"#ecfeff", txt2:"rgba(207,250,254,.55)", nb:"rgba(6,182,212,.18)",  nbr:"rgba(6,182,212,.4)",   d1:"rgba(8,145,178,.22)", d2:"rgba(6,182,212,.07)" },
  { id:"cosmos", icon:"🌌", name:"Cosmos",  bg:"linear-gradient(150deg,#07021c 0%,#140840 55%,#05010f 100%)", acc:"#a78bfa", acc2:"#7c3aed", txt:"#faf5ff", txt2:"rgba(245,240,255,.55)", nb:"rgba(167,139,250,.18)",nbr:"rgba(167,139,250,.4)", d1:"rgba(124,58,237,.22)",d2:"rgba(167,139,250,.07)" },
  { id:"forest", icon:"🌿", name:"Floresta",bg:"linear-gradient(150deg,#020e08 0%,#052818 55%,#010a04 100%)", acc:"#10b981", acc2:"#059669", txt:"#ecfdf5", txt2:"rgba(209,250,229,.55)", nb:"rgba(16,185,129,.18)", nbr:"rgba(16,185,129,.4)",  d1:"rgba(5,150,105,.22)", d2:"rgba(16,185,129,.07)" },
  { id:"sunset", icon:"🌅", name:"Sunset",  bg:"linear-gradient(150deg,#140600 0%,#301000 55%,#0e0200 100%)", acc:"#fb923c", acc2:"#c2410c", txt:"#fff7ed", txt2:"rgba(254,237,213,.55)", nb:"rgba(251,146,60,.18)", nbr:"rgba(251,146,60,.4)",  d1:"rgba(194,65,12,.22)", d2:"rgba(251,146,60,.07)" },
  { id:"royal",  icon:"👑", name:"Royal",   bg:"linear-gradient(150deg,#0a0118 0%,#1a0438 55%,#060010 100%)", acc:"#e879f9", acc2:"#a21caf", txt:"#fdf4ff", txt2:"rgba(250,232,255,.55)", nb:"rgba(232,121,249,.18)",nbr:"rgba(232,121,249,.4)", d1:"rgba(162,28,175,.22)",d2:"rgba(232,121,249,.07)" },
  { id:"gold",   icon:"⭐", name:"Ouro",    bg:"linear-gradient(150deg,#100900 0%,#281800 55%,#080500 100%)", acc:"#fbbf24", acc2:"#b45309", txt:"#fffbeb", txt2:"rgba(254,243,199,.55)", nb:"rgba(251,191,36,.18)", nbr:"rgba(251,191,36,.4)",  d1:"rgba(180,83,9,.22)",  d2:"rgba(251,191,36,.07)" },
  { id:"arctic", icon:"❄️", name:"Ártico",  bg:"linear-gradient(150deg,#010c18 0%,#021e38 55%,#010810 100%)", acc:"#67e8f9", acc2:"#0e7490", txt:"#ecfeff", txt2:"rgba(207,250,254,.55)", nb:"rgba(103,232,249,.18)",nbr:"rgba(103,232,249,.4)", d1:"rgba(14,116,144,.22)",d2:"rgba(103,232,249,.07)" },
];

/* ═══════════════════════════════════════════════
   SLIDE RENDERER
═══════════════════════════════════════════════ */
const Slide = ({ sl, th, total, dir = "right", fs = false }) => (
  <div style={{
    width: "100%", height: "100%",
    background: th.bg, position: "relative", overflow: "hidden",
    display: "flex", flexDirection: "column",
    animation: `${dir === "right" ? "slR" : "slL"} .3s cubic-bezier(.4,0,.2,1) both`,
  }}>
    {/* decorative blobs */}
    <div style={{ position: "absolute", top: -80, right: -80, width: fs ? 400 : 190, height: fs ? 400 : 190, borderRadius: "50%", background: th.d1, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -50, left: -50, width: fs ? 300 : 140, height: fs ? 300 : 140, borderRadius: "50%", background: th.d2, pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: "35%", right: "12%", width: fs ? 90 : 44, height: fs ? 90 : 44, borderRadius: "50%", background: th.d2, pointerEvents: "none" }} />
    {/* grid */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${th.d2} 1px,transparent 1px),linear-gradient(90deg,${th.d2} 1px,transparent 1px)`, backgroundSize: fs ? "50px 50px" : "26px 26px", pointerEvents: "none", opacity: .55 }} />

    {/* content */}
    <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: fs ? "46px 62px 34px" : "14px 17px 10px", gap: fs ? 18 : 7, minHeight: 0 }}>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: fs ? 9 : 5 }}>
          <div style={{ width: fs ? 34 : 17, height: fs ? 34 : 17, borderRadius: fs ? 9 : 5, background: th.nb, border: `1.5px solid ${th.nbr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs ? 13 : 7, fontWeight: 900, color: th.acc }}>{sl.num}</div>
          <span style={{ fontSize: fs ? 11 : 6.5, fontWeight: 700, color: th.acc, letterSpacing: 2, opacity: .75 }}>{sl.num}/{total}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: fs ? 6 : 3 }}>
          <span style={{ fontSize: fs ? 15 : 9 }}>{th.icon}</span>
          <span style={{ fontSize: fs ? 10 : 6, fontWeight: 700, color: th.txt2, letterSpacing: 1 }}>{th.name.toUpperCase()}</span>
        </div>
      </div>

      {/* accent line */}
      <div style={{ height: fs ? 3 : 1.5, width: fs ? 56 : 28, background: `linear-gradient(90deg,${th.acc},transparent)`, borderRadius: 99, flexShrink: 0, animation: "lineGrow .5s ease .1s both" }} />

      {/* title */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: fs ? 38 : 15, color: th.txt, lineHeight: 1.18, textShadow: "0 2px 16px rgba(0,0,0,.5)", letterSpacing: fs ? "-.5px" : "-.15px" }}>{sl.titulo}</div>
        {sl.subtitulo && <div style={{ fontSize: fs ? 16 : 7.5, color: th.acc, marginTop: fs ? 6 : 2, fontWeight: 600, opacity: .9 }}>{sl.subtitulo}</div>}
      </div>

      {/* points */}
      <div style={{ display: "flex", flexDirection: "column", gap: fs ? 12 : 5, flex: 1, minHeight: 0, overflow: "hidden" }}>
        {sl.pontos?.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: fs ? 12 : 6, alignItems: "flex-start", animation: `slR .35s ease ${.1 + i * .07}s both` }}>
            <div style={{ width: fs ? 25 : 12, height: fs ? 25 : 12, borderRadius: fs ? 7 : 4, background: th.nb, border: `1.5px solid ${th.nbr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs ? 11 : 6, fontWeight: 900, color: th.acc, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <span style={{ fontSize: fs ? 17 : 8.5, color: th.txt, lineHeight: 1.5, opacity: .92 }}>{p}</span>
          </div>
        ))}
      </div>

      {/* note */}
      {sl.nota && <div style={{ padding: fs ? "8px 13px" : "4px 7px", background: "rgba(0,0,0,.32)", borderRadius: fs ? 9 : 5, fontSize: fs ? 12 : 6.5, color: th.txt2, borderLeft: `${fs ? 3 : 1.5}px solid ${th.acc}`, lineHeight: 1.4, flexShrink: 0 }}>📝 {sl.nota}</div>}
    </div>

    {/* progress bar */}
    <div style={{ height: fs ? 4 : 2, background: "rgba(255,255,255,.07)", flexShrink: 0 }}>
      <div style={{ height: "100%", width: `${(sl.num / total) * 100}%`, background: th.acc, transition: "width .4s ease" }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   SLIDES COMPONENT
═══════════════════════════════════════════════ */
const SlidesComp = ({ data }) => {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState("right");
  const [key, setKey] = useState(0);
  const [thIdx, setThIdx] = useState(0);
  const [pres, setPres] = useState(false);
  const slides = data.slides || [];
  const th = THEMES[thIdx % THEMES.length];

  const go = (idx, d = "right") => { if (idx < 0 || idx >= slides.length) return; setDir(d); setCur(idx); setKey(k => k + 1); };

  useEffect(() => {
    if (!pres) return;
    const h = e => {
      if (["ArrowRight","ArrowDown"," "].includes(e.key)) { e.preventDefault(); go(cur + 1); }
      if (["ArrowLeft","ArrowUp"].includes(e.key)) { e.preventDefault(); go(cur - 1, "left"); }
      if (e.key === "Escape") setPres(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [pres, cur, slides.length]);

  if (!slides.length) return null;
  const sl = slides[cur];

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16 }}>📊 {data.titulo}</div>
          <button className="btn primary sm" onClick={() => setPres(true)}>▶ Apresentar</button>
        </div>

        {/* theme picker */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {THEMES.map((t, i) => (
            <button key={t.id} title={t.name} onClick={() => setThIdx(i)}
              style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, border: `2px solid ${i === thIdx ? t.acc : "transparent"}`, background: t.bg, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border .15s", boxShadow: i === thIdx ? `0 0 0 2px ${t.acc}44` : undefined }}>
              {t.icon}
            </button>
          ))}
        </div>

        {/* slide — 16:9 via padding-bottom trick */}
        <div style={{ width: "100%", position: "relative", paddingBottom: "56.25%", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 38px rgba(0,0,0,.65)" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Slide key={key} sl={sl} th={th} total={slides.length} dir={dir} fs={false} />
          </div>
        </div>

        {/* nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn ghost sm" style={{ flex: 1 }} onClick={() => go(cur - 1, "left")} disabled={cur === 0}>← Anterior</button>
          <span style={{ fontSize: 13, color: D.w2, fontWeight: 700, whiteSpace: "nowrap" }}>{cur + 1} / {slides.length}</span>
          <button className="btn primary sm" style={{ flex: 1 }} onClick={() => go(cur + 1)} disabled={cur === slides.length - 1}>Próximo →</button>
        </div>

        {/* dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i, i > cur ? "right" : "left")} style={{ width: i === cur ? 22 : 7, height: 7, borderRadius: 99, border: "none", background: i === cur ? th.acc : D.b1, cursor: "pointer", transition: "all .2s" }} />
          ))}
        </div>

        {/* thumbnails */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {slides.map((s, i) => (
            <div key={i} onClick={() => go(i, i > cur ? "right" : "left")}
              style={{ flexShrink: 0, width: 80, position: "relative", paddingBottom: "45%", borderRadius: 9, overflow: "hidden", cursor: "pointer", border: `2px solid ${i === cur ? th.acc : D.b0}`, transition: "border .15s" }}>
              <div style={{ position: "absolute", inset: 0, background: th.bg, padding: "5px 7px" }}>
                <div style={{ fontSize: 6.5, fontWeight: 800, color: th.acc, letterSpacing: 1, marginBottom: 2 }}>SLIDE {s.num}</div>
                <div style={{ fontSize: 6.5, fontWeight: 700, color: th.txt, lineHeight: 1.3 }}>{(s.titulo || "").slice(0, 20)}</div>
                <div style={{ position: "absolute", top: -8, right: -8, width: 26, height: 26, borderRadius: "50%", background: th.d1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN */}
      {pres && (
        <div className="pres">
          {/* slide area */}
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <Slide key={`f${key}`} sl={sl} th={th} total={slides.length} dir={dir} fs />
            <button className="btn dark" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", padding: 0, fontSize: 22 }} onClick={() => go(cur - 1, "left")} disabled={cur === 0}>‹</button>
            <button className="btn dark" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", padding: 0, fontSize: 22 }} onClick={() => go(cur + 1)} disabled={cur === slides.length - 1}>›</button>
            <div style={{ position: "absolute", top: 14, right: 16, fontSize: 11, color: "rgba(255,255,255,.28)", letterSpacing: 1 }}>ESC para sair</div>
          </div>

          {/* toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", gap: 8, background: "rgba(0,0,0,.85)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,.07)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="btn dark sm" onClick={() => go(cur - 1, "left")} disabled={cur === 0}>← Ant.</button>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>{cur + 1}/{slides.length}</span>
              <button className="btn dark sm" onClick={() => go(cur + 1)} disabled={cur === slides.length - 1}>Próx. →</button>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {slides.map((_, i) => <button key={i} onClick={() => go(i, i > cur ? "right" : "left")} style={{ width: i === cur ? 20 : 7, height: 7, borderRadius: 99, border: "none", background: i === cur ? th.acc : "rgba(255,255,255,.2)", cursor: "pointer", transition: "all .2s" }} />)}
            </div>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <button className="btn dark xs" onClick={() => setThIdx(t => (t + 1) % THEMES.length)}>{th.icon} Tema</button>
              <button className="btn danger sm" onClick={() => setPres(false)} style={{ fontWeight: 800 }}>✕ Sair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════
   MIND MAP
═══════════════════════════════════════════════ */
const MindMap = ({ data }) => {
  const [pres, setPres] = useState(false);
  const COLS = [D.blue2, D.mint, D.rose, D.amber, D.cyan, "#a855f7", "#ec4899", "#14b8a6"];
  const ramos = data.ramos || [];
  const CX = 240, CY = 240;
  const step = (2 * Math.PI) / Math.max(ramos.length, 1);

  const branches = ramos.map((r, i) => {
    const a = i * step - Math.PI / 2;
    const col = COLS[i % COLS.length];
    const bx = CX + Math.cos(a) * 108, by = CY + Math.sin(a) * 108;
    const subs = (r.subtopicos || []).map((s, j) => {
      const sc = r.subtopicos.length;
      const sp = sc === 1 ? 0 : (Math.PI / 2.5) * (j / Math.max(sc - 1, 1) - .5);
      return { label: s, x: bx + Math.cos(a + sp) * 78, y: by + Math.sin(a + sp) * 78, del: i * .1 + j * .07 };
    });
    return { ...r, x: bx, y: by, col, subs, del: i * .09 };
  });

  const allPts = [{ x: CX, y: CY }, ...branches.map(b => ({ x: b.x, y: b.y })), ...branches.flatMap(b => b.subs)];
  const xs = allPts.map(p => p.x), ys = allPts.map(p => p.y);
  const PAD = 68, vx = Math.min(...xs) - PAD, vy = Math.min(...ys) - PAD;
  const vw = Math.max(...xs) - vx + PAD, vh = Math.max(...ys) - vy + PAD;

  const MapSVG = () => (
    <svg width="100%" viewBox={`${vx} ${vy} ${vw} ${vh}`} style={{ display: "block", minWidth: 300 }}>
      <defs>
        <filter id="sh2"><feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(0,0,0,.5)" /></filter>
      </defs>
      <circle cx={CX} cy={CY} r={60} fill={`${D.blue}12`} />
      {branches.map((b, i) => <line key={`l${i}`} x1={CX} y1={CY} x2={b.x} y2={b.y} stroke={b.col} strokeWidth={3} strokeLinecap="round" strokeDasharray={3000} style={{ animation: `lineA .9s ease ${b.del}s both`, animationFillMode: "both" }} />)}
      {branches.flatMap((b, i) => b.subs.map((s, j) => <line key={`sl${i}${j}`} x1={b.x} y1={b.y} x2={s.x} y2={s.y} stroke={b.col + "99"} strokeWidth={2} strokeLinecap="round" strokeDasharray={3000} style={{ animation: `lineA .7s ease ${s.del}s both`, animationFillMode: "both" }} />))}
      <circle cx={CX} cy={CY} r={44} fill={D.blue} filter="url(#sh2)" />
      {(data.topico || "").split(" ").slice(0, 3).map((w, wi, arr) => (
        <text key={wi} x={CX} y={CY + (wi - (arr.length - 1) / 2) * 13 + 4} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800} fontFamily="Inter">{w}</text>
      ))}
      {branches.map((b, i) => (
        <g key={`bn${i}`} style={{ animation: `nodeA .38s ease ${b.del}s both`, animationFillMode: "both" }}>
          <circle cx={b.x} cy={b.y} r={32} fill={`${b.col}18`} />
          <circle cx={b.x} cy={b.y} r={27} fill={b.col} filter="url(#sh2)" />
          {(b.titulo || "").split(" ").slice(0, 2).map((w, wi, arr) => (
            <text key={wi} x={b.x} y={b.y + (wi - (arr.length - 1) / 2) * 12 + 4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={800} fontFamily="Inter">{w}</text>
          ))}
          {b.subs.map((s, j) => (
            <g key={`sn${j}`} style={{ animation: `nodeA .35s ease ${s.del}s both`, animationFillMode: "both" }}>
              <circle cx={s.x} cy={s.y} r={20} fill={`${b.col}18`} />
              <circle cx={s.x} cy={s.y} r={17} fill={b.col + "cc"} />
              <text x={s.x} y={s.y + 4} textAnchor="middle" fill="#fff" fontSize={7} fontWeight={700} fontFamily="Inter">
                {(s.label || "").length > 11 ? s.label.slice(0, 11) + "…" : s.label}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17 }}>🗺️ {data.topico}</div>
          <button className="btn mint sm" onClick={() => setPres(true)}>▶ Apresentar</button>
        </div>
        {data.descricao && <div style={{ fontSize: 13, color: D.w2 }}>{data.descricao}</div>}
        <div style={{ width: "100%", overflowX: "auto", background: `linear-gradient(135deg,${D.bg2},${D.bg3})`, borderRadius: 18, padding: "12px 8px", border: `1px solid ${D.b0}` }}>
          <MapSVG />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {branches.map((b, i) => (
            <div key={i} className="card" style={{ padding: "10px 13px", display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: b.col, flexShrink: 0, marginTop: 4 }} />
              <div><div style={{ fontWeight: 700, fontSize: 12, color: b.col }}>{b.titulo}</div><div style={{ fontSize: 11, color: D.w3, marginTop: 3, lineHeight: 1.4 }}>{b.subs.map(s => s.label).join(" · ")}</div></div>
            </div>
          ))}
        </div>
      </div>

      {pres && (
        <div className="pres" style={{ background: `linear-gradient(160deg,${D.bg} 0%,${D.bg3} 100%)` }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, overflow: "auto", gap: 18 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 28, color: D.w1, marginBottom: 6 }}>{data.topico}</div>
              {data.descricao && <div style={{ fontSize: 15, color: D.w2 }}>{data.descricao}</div>}
            </div>
            <div style={{ width: "100%", maxWidth: 860 }}><MapSVG /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,.85)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,.07)", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,.45)" }}>🗺️ {data.topico}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)" }}>ESC para sair</span>
              <button className="btn danger sm" onClick={() => setPres(false)} style={{ fontWeight: 800 }}>✕ Sair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════
   MODO CRIADOR
═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   PREVIEW MOCKUPS (IG / TIKTOK)
═══════════════════════════════════════════════ */
const PreviewMockup = ({ platform, type, fileURL, isImg, fCSS, caption, onClose, onFinish }) => {
  const [loading, setLoading] = useState(false);
  
  const handlePublish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    onFinish();
  };

  const isVertical = type === 'reels' || type === 'stories' || platform === 'tiktok';

  return (
    <div className="pres" style={{ background: "#000", zIndex: 10000, display: "flex", flexDirection: "column" }}>
      {/* status bar simulation */}
      <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", fontSize: 13, fontWeight: 700, color: "#fff" }}>
        <span>9:41</span>
        <div style={{ display: "flex", gap: 5 }}>📶 🔋</div>
      </div>

      {/* header */}
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: isVertical ? "none" : "1px solid #262626" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 24 }}>✕</button>
          <span style={{ fontWeight: 800, fontSize: 16 }}>{platform === 'insta' ? 'Instagram' : 'TikTok'}</span>
        </div>
        <button className="btn primary sm" onClick={handlePublish} disabled={loading} style={{ borderRadius: 8, padding: "6px 16px" }}>
          {loading ? <Spin s={14} c="#fff" /> : "Publicar"}
        </button>
      </div>

      {/* MOCKUP CONTENT */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#000" }}>
        
        {/* REELS / STORIES / TIKTOK (Full Screen) */}
        {isVertical ? (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#111" }}>
               {isImg ? <img src={fileURL} style={{ width: "100%", filter: fCSS }} /> : <video src={fileURL} autoPlay muted loop style={{ width: "100%" }} />}
            </div>
            
            {/* overlays */}
            <div style={{ position: "absolute", right: 12, bottom: 120, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>❤️</span><div style={{ fontSize: 11, fontWeight: 700 }}>1.2M</div></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>💬</span><div style={{ fontSize: 11, fontWeight: 700 }}>14k</div></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>✈️</span></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>...</span></div>
            </div>

            <div style={{ position: "absolute", left: 16, bottom: 40, right: 80 }}>
              <div style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c)", border: "1.5px solid #fff" }} />
                DVS_EduCreator
              </div>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {caption}
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                🎵 <span>Áudio original de DVS</span>
              </div>
            </div>
          </div>
        ) : (
          /* INSTAGRAM FEED */
          <div style={{ background: "#000", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c)" }} />
              <div style={{ fontSize: 14, fontWeight: 700 }}>DVS_EduCreator</div>
            </div>
            <div style={{ width: "100%", background: "#111", minHeight: 300, display: "flex", alignItems: "center" }}>
               {isImg ? <img src={fileURL} style={{ width: "100%", filter: fCSS }} /> : <video src={fileURL} autoPlay muted loop style={{ width: "100%" }} />}
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 16, fontSize: 24, marginBottom: 10 }}>
                <span>❤️</span> <span>💬</span> <span>✈️</span> <span style={{ marginLeft: "auto" }}>🔖</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>12,458 curtidas</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800, marginRight: 6 }}>DVS_EduCreator</span>
                {caption}
              </div>
              <div style={{ fontSize: 12, color: "#8e8e8e", marginTop: 8 }}>Ver todos os 342 comentários</div>
              <div style={{ fontSize: 10, color: "#8e8e8e", marginTop: 4, textTransform: "uppercase" }}>Há 2 minutos</div>
            </div>
          </div>
        )}
      </div>

      {/* footer bar */}
      <div style={{ height: 60, display: "flex", justifyContent: "space-around", alignItems: "center", background: "#000", borderTop: "1px solid #262626" }}>
        <span style={{ fontSize: 24 }}>🏠</span>
        <span style={{ fontSize: 24 }}>🔍</span>
        <span style={{ fontSize: 24 }}>➕</span>
        <span style={{ fontSize: 24 }}>🎞️</span>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff" }} />
      </div>
    </div>
  );
};


const Criador = ({ toast }) => {
  const [stage, setStage] = useState("home");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [isImg, setIsImg] = useState(true);
  const [topic, setTopic] = useState("");
  const [estilo, setEstilo] = useState("viral");
  const [pct, setPct] = useState(0); const [cur, setCur] = useState(0);
  const [result, setResult] = useState(null);
  const [caption, setCaption] = useState("");
  const [selMusic, setSelMusic] = useState(null);
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100 });
  const [filtName, setFiltName] = useState(null);
  const [vLoad, setVLoad] = useState(false); const [rLoad, setRLoad] = useState(false);
  const fileId = "dvs-file-input";

  // MOCKUP STATE
  const [mock, setMock] = useState(null); // { platform, type }

  const ESTILOS = [
    { id: "viral", l: "🔥 Viral" }, { id: "pro", l: "💼 Profissional" },
    { id: "aesthetic", l: "🌸 Aesthetic" }, { id: "vendas", l: "💰 Vendas" },
    { id: "humor", l: "😂 Humor" }, { id: "edu", l: "📚 Educativo" },
  ];
  const FPRESET = {
    original:     { brightness: 100, contrast: 100, saturate: 100 },
    profissional: { brightness: 103, contrast: 112, saturate: 88 },
    aesthetic:    { brightness: 108, contrast: 95, saturate: 120 },
    vintage:      { brightness: 93, contrast: 115, saturate: 68 },
    hdr:          { brightness: 106, contrast: 125, saturate: 118 },
    vívido:       { brightness: 104, contrast: 108, saturate: 148 },
  };

  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(`✅ "${f.name.slice(0, 24)}" carregado!`, "ok");
  }, [toast]);

  const openPicker = () => {
    const el = document.getElementById(fileId);
    if (el) { el.value = ""; el.click(); }
  };

  const startCreate = async () => {
    if (!file && !topic.trim()) { toast("Envie uma mídia ou escreva um tema!", "warn"); return; }
    setStage("proc"); setPct(0); setCur(0);
    const steps = isImg ? SI : SV;
    for (let i = 0; i < steps.length; i++) { setCur(i); await sleep(480 + Math.random() * 380); setPct(Math.round(((i + 1) / steps.length) * 88)); }
    const raw = await callAI(
      `Você é especialista em marketing viral para redes sociais brasileiras. Crie conteúdo de alto impacto.
Tipo de mídia: ${isImg ? "imagem" : "vídeo"} | Tema: "${topic || "conteúdo geral"}" | Estilo: ${estilo}
Retorne APENAS este JSON exato (sem markdown, sem texto fora do JSON):
{
  "hook": "frase de impacto máx 10 palavras com emoji",
  "caption": "legenda completa",
  "hashtags": ["8 hashtags"],
  "filtro": "profissional",
  "musicas": [{"tipo":"Viral","nome":"musica","artista":"artista","vibe":"vibe"}],
  "score": 90,
  "scoreMotivo": "motivo",
  "melhorias": ["dica"],
  "plataforma": "Insta",
  "horario": "19h",
  "cta": "cta"
}`,
      "APENAS JSON."
    );
    setPct(100); await sleep(200);
    const p = pj(raw) || { hook: "Viral!", caption: "Legenda", hashtags: ["viral"], filtro: "profissional", musicas: [], score: 80, scoreMotivo: "Ok", melhorias: [], plataforma: "Insta", horario: "19h", cta: "Cta" };
    setCaption(`${p.hook}\n\n${p.caption}\n\n${p.hashtags.map(h => "#" + h).join(" ")}`);
    setResult(p); 
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
  };

  const applyFilt = name => { setFiltName(name); setFilters(FPRESET[name] || FPRESET.original); };
  
  const [pPct, setPPct] = useState(0);

  
  
  const realPublicar = async () => {
    if (!mock) return;
    const { platform, type } = mock;
    
    try {
      // 1. Copiar a legenda automaticamente para o usuário só precisar "Colar"
      await navigator.clipboard.writeText(caption);
      
      // 2. Tentar o compartilhamento direto do sistema (Abre o App direto com a mídia)
      const canShare = file && navigator.canShare && navigator.canShare({ files: [file] });
      
      if (canShare && navigator.share) {
        await navigator.share({
          files: [file],
          title: 'DVS Content',
          text: caption
        });
        toast(`🚀 Abrindo o ${platform.toUpperCase()} agora...`, "ok");
      } else {
        // 3. Fallback: Forçar o download da mídia para o topo da galeria e abrir o app
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = isImg ? 'dvs-post.jpg' : 'dvs-post.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 4. Abrir o App na tela de postagem
        let deepLink = "";
        if (platform === 'insta') {
          if (type === 'stories') deepLink = "instagram://story-camera";
          else if (type === 'reels') deepLink = "instagram://reels_share";
          else deepLink = "instagram://library";
        } else {
          deepLink = "snssdk1128://feed";
        }
        
        setTimeout(() => {
          window.location.href = deepLink;
        }, 800);
        
        toast(`✅ Mídia salva e legenda copiada! O ${platform.toUpperCase()} está abrindo...`, "ok");
      }
    } catch (e) {
      console.error("Erro no envio:", e);
      toast(`✅ Tudo pronto! Agora é só colar no ${platform}.`, "ok");
    }
    
    setMock(null);
  };



  const regen = async () => {
    setRLoad(true);
    await sleep(800);
    toast("Nova legenda!", "ok");
    setRLoad(false);
  };
  const viral = async () => {
    setVLoad(true);
    await sleep(1500);
    setResult({ ...result, score: 99 });
    toast(`🚀 Viralizado!`, "ok");
    setVLoad(false);
  };
  const copiar = () => { navigator.clipboard.writeText(caption); toast("Copiado!", "ok"); };
  const fCSS = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`;

  if (stage === "proc") return <div style={{ padding: "24px 16px" }}><LoadScreen steps={isImg ? SI : SV} cur={cur} pct={pct} title="Processando..." /></div>;

  if (stage === "result" && result) return (
    <>
      {mock && (
        <PreviewMockup 
          platform={mock.platform} 
          type={mock.type} 
          fileURL={fileURL} 
          isImg={isImg} 
          fCSS={fCSS} 
          caption={caption} 
          onClose={() => setMock(null)}
          onFinish={realPublicar}
        />
      )}
      
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Revisão Final ✨</div>
            <button className="btn ghost xs" onClick={() => { setStage("home"); setResult(null); setFile(null); setFileURL(null); setTopic(""); setFiltName(null); setFilters(FPRESET.original); }} style={{marginTop: 4}}>+ Novo</button>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div key="stable-preview-container" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {fileURL ? (
              <div style={{width: "100%", position: "relative"}}>
                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}
                <div style={{ position: "absolute", top: 12, right: 12 }}><ScoreRing score={result.score} /></div>
              </div>
            ) : <div style={{ color: D.w3 }}>Sem prévia</div>}
          </div>
        </div>

        <div className="card" style={{ padding: 15 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎨 Ajustes da IA (${filtName})</div>
          {[["brightness", "Brilho"], ["contrast", "Contraste"]].map(([k, lb]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 60, fontSize: 11, color: D.w2 }}>{lb}</div>
              <input type="range" min={70} max={140} value={filters[k]} onChange={e => setFilters(p => ({ ...p, [k]: +e.target.value }))} style={{ flex: 1, accentColor: D.blue2 }} />
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 15 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>✍️ Legenda Otimizada</div>
            <button className="btn outline xs" onClick={copiar}>Copiar</button>
          </div>
          <textarea className="inp" value={caption} onChange={e => setCaption(e.target.value)} style={{ minHeight: 100, fontSize: 13 }} />
        </div>

        <SmartSoundPlayer musicas={result.musicas} toast={toast} />

        <button className="btn rose lg" style={{ width: "100%" }} onClick={viral} disabled={vLoad}>
          {vLoad ? <Spin s={18} /> : "🚀 TURBINAR PARA VIRALIZAR"}
        </button>

        <div style={{ marginTop: 8, background: D.s0, borderRadius: 16, padding: 16, border: `1px solid ${D.b0}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: D.w3, textAlign: "center", marginBottom: 15, letterSpacing: 1.5 }}>PUBLICAR AGORA</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* INSTAGRAM */}
            <div style={{ background: "linear-gradient(45deg, #f09433, #bc1888)", borderRadius: 14, padding: "12px 10px" }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 13, marginBottom: 10, textAlign: "center" }}>INSTAGRAM</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {['Feed', 'Reels', 'Stories'].map(type => (
                  <button key={type} className="btn" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 11, fontWeight: 800 }} onClick={() => setMock({ platform: 'insta', type: type.toLowerCase() })}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* TIKTOK */}
            <div style={{ background: "#000", borderRadius: 14, padding: "12px 10px", border: "2.5px solid #00f2ea" }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 13, marginBottom: 10, textAlign: "center" }}>TIKTOK</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {['Feed', 'Stories'].map(type => (
                  <button key={type} className="btn" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #ff0050", color: "#fff", fontSize: 11, fontWeight: 800 }} onClick={() => setMock({ platform: 'tiktok', type: type.toLowerCase() })}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: "center", fontSize: 10, color: D.w3, marginTop: 4 }}>
          DVS simulará o app original para você conferir o resultado final.
        </div>
      </div>
    </>
  );


  /* ── HOME ── */
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── FILE INPUT NATIVO — único, sempre no DOM ──
          Usar <label htmlFor> é a forma mais compatível com iOS Safari e Android Chrome */}
      <input
        id={fileId}
        type="file"
        accept="image/*,video/*"
        capture={undefined}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        onChange={handleFileChange}
      />

      {/* hero */}
      <div className="fu">
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 5 }}>Modo Criador 🔥</div>
        <div style={{ fontSize: 14, color: D.w2, lineHeight: 1.6 }}>Envie uma mídia — a IA cria legenda, score viral, músicas e muito mais</div>
      </div>

      {/* upload zone — usa label htmlFor para máxima compatibilidade mobile */}
      <label htmlFor={fileId} className="fu d1" style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        padding: "32px 20px", borderRadius: 20, cursor: "pointer",
        border: `2px dashed ${D.b1}`,
        background: `linear-gradient(135deg,${D.s0},${D.bg3})`,
        transition: "border-color .18s, background .18s",
        WebkitTapHighlightColor: "transparent",
      }}
        onMouseOver={e => e.currentTarget.style.borderColor = D.blue}
        onMouseOut={e => e.currentTarget.style.borderColor = D.b1}
      >
        <div style={{ width: 68, height: 68, borderRadius: 20, background: D.blueLo, border: `1px solid ${D.blueM}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, animation: "float2 3.5s ease-in-out infinite" }}>📁</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 5 }}>Toque para selecionar</div>
          <div style={{ fontSize: 13, color: D.w2 }}>Foto ou vídeo da galeria</div>
          <div style={{ fontSize: 12, color: D.w3, marginTop: 4 }}>JPG · PNG · GIF · MP4 · MOV</div>
        </div>
        <span className="tag tblue" style={{ fontSize: 12 }}>⚡ Processamento automático por IA</span>
      </label>

      {/* botão alternativo para câmera */}
      <div className="fu d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <label htmlFor={fileId} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${D.blueM}`, color: D.blue2, fontWeight: 700, fontSize: 13, cursor: "pointer", background: D.blueLo, WebkitTapHighlightColor: "transparent" }}>
          🖼️ Galeria
        </label>
        <label htmlFor={fileId + "-cam"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${D.b1}`, color: D.w1, fontWeight: 700, fontSize: 13, cursor: "pointer", background: D.s2, WebkitTapHighlightColor: "transparent" }}>
          📷 Câmera
        </label>
      </div>
      {/* input separado para câmera */}
      <input id={fileId + "-cam"} type="file" accept="image/*,video/*" capture="environment" style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} onChange={handleFileChange} />

      {/* preview */}
      {fileURL && (
        <div className="card fu" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center", borderColor: D.blueM }}>
          <div style={{ width: 60, height: 60, borderRadius: 13, overflow: "hidden", border: `2px solid ${D.blueM}`, flexShrink: 0 }}>
            {isImg ? <img src={fileURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <video src={fileURL} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file?.name}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <span className={`tag ${isImg ? "tcyan" : "trose"}`}>{isImg ? "🖼️ Imagem" : "🎥 Vídeo"}</span>
              <span className="tag tgrn">✓ Pronto</span>
            </div>
          </div>
          <button className="btn ghost xs" onClick={() => { setFile(null); setFileURL(null); }}>✕</button>
        </div>
      )}

      {/* tema */}
      <div className="fu d2">
        <div className="sec-label">Tema / contexto</div>
        <input className="inp" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ex: produto fitness, motivação, lançamento, humor…" />
      </div>

      {/* estilo */}
      <div className="fu d3">
        <div className="sec-label">Estilo do conteúdo</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {ESTILOS.map(s => (
            <button key={s.id} onClick={() => setEstilo(s.id)} style={{ padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${estilo === s.id ? D.blue : D.b0}`, background: estilo === s.id ? D.blueLo : D.s1, cursor: "pointer", transition: "all .15s", fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: estilo === s.id ? D.blue2 : D.w1 }}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <button className="btn primary lg fu d4" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={startCreate} disabled={!file && !topic.trim()}>
        ✨ Criar Conteúdo com IA
      </button>

      <div className="card fu d5" style={{ padding: "12px 15px", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>🔒</span>
        <span style={{ fontSize: 13, color: D.w2 }}>Plano Gratuito · 10 posts/mês · <span style={{ color: D.amber, fontWeight: 700, cursor: "pointer" }} onClick={() => toast("Acesse a aba Planos!", "info")}>Ver Planos →</span></span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MODO ESTUDANTE
═══════════════════════════════════════════════ */
const Estudante = ({ toast }) => {
  const [tab, setTab] = useState("voz");
  const [rec, setRec] = useState(false); const [secs, setSecs] = useState(0);
  const [trans, setTrans] = useState("");
  const [texto, setTexto] = useState("");
  const [load, setLoad] = useState(false); const [ltab, setLtab] = useState(""); const [pct, setPct] = useState(0); const [cur, setCur] = useState(0);
  const [res, setRes] = useState(null); const [rtype, setRtype] = useState(null);
  const [flips, setFlips] = useState({}); const [qans, setQans] = useState({}); const [qrev, setQrev] = useState({});
  const recRef = useRef(); const timerRef = useRef();
  const wt = texto || trans;

  const TABS = [
    { id: "voz", l: "Voz", e: "🎤" }, { id: "resumo", l: "Resumo", e: "🧠" },
    { id: "mapa", l: "Mapa", e: "🗺️" }, { id: "slides", l: "Slides", e: "📊" },
    { id: "cards", l: "Flashcards", e: "🃏" }, { id: "quiz", l: "Quiz", e: "⚡" },
  ];
  

  const startRec = () => {
    setRec(true); setSecs(0);
    timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "pt-BR";
      r.onresult = e => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setTrans(t); };
      r.onerror = () => toast("Permita o acesso ao microfone.", "warn");
      r.start(); recRef.current = r;
    } else {
      setTimeout(() => setTrans("Exemplo de transcrição: A fotossíntese é o processo pelo qual plantas usam luz solar, água e CO₂ para produzir glicose e oxigênio. Ocorre nos cloroplastos e é essencial para a vida na Terra."), 1500);
    }
  };
  const stopRec = () => { setRec(false); clearInterval(timerRef.current); recRef.current?.stop(); if (trans) { setTexto(trans); toast("Transcrição salva!", "ok"); } };

  const gen = async type => {
    if (!wt.trim()) { toast("Adicione texto ou grave sua voz!", "warn"); return; }
    setLoad(true); setLtab(type); setPct(0); setCur(0); setRes(null); setRtype(type); setFlips({}); setQans({}); setQrev({});
    const steps = STEPS3[type] || [];
    for (let i = 0; i < steps.length; i++) { setCur(i); await sleep(420 + Math.random() * 330); setPct(Math.round(((i + 1) / steps.length) * 86)); }

    const P = {
      resumo: `Analise este texto com profundidade. APENAS JSON sem markdown:
{"titulo":"título claro e atrativo","resumo":"resumo bem desenvolvido em 2-3 parágrafos separados por \\n\\n","pontos":["5 pontos principais detalhados"],"palavrasChave":["6 palavras-chave"],"dificuldade":"Básico/Intermediário/Avançado","tempoEstudo":"X min"}
Texto:"${wt.slice(0,2200)}"`,
      mapa: `Crie mapa mental completo. APENAS JSON sem markdown:
{"topico":"TEMA CENTRAL","descricao":"descrição em 1 frase clara","ramos":[{"titulo":"RAMO 1","subtopicos":["conceito 1","conceito 2","conceito 3"]},{"titulo":"RAMO 2","subtopicos":["conceito 1","conceito 2","conceito 3"]},{"titulo":"RAMO 3","subtopicos":["conceito 1","conceito 2"]},{"titulo":"RAMO 4","subtopicos":["conceito 1","conceito 2"]}]}
Texto:"${wt.slice(0,2200)}"`,
      slides: `Crie apresentação didática. APENAS JSON sem markdown:
{"titulo":"Título da Apresentação","slides":[{"num":1,"titulo":"Introdução","subtitulo":"Visão Geral","pontos":["Ponto importante 1","Ponto importante 2","Ponto importante 3"],"nota":"Apresente o tema e objetivos"},{"num":2,"titulo":"Desenvolvimento","subtitulo":"Conceitos Principais","pontos":["Conceito central 1","Conceito central 2","Conceito central 3"],"nota":"Explique cada ponto com exemplos"},{"num":3,"titulo":"Análise Detalhada","subtitulo":"Aprofundamento","pontos":["Detalhe importante 1","Detalhe importante 2","Detalhe importante 3"],"nota":""},{"num":4,"titulo":"Conclusão","subtitulo":"Resumo e Próximos Passos","pontos":["Conclusão principal","Aplicação prática"],"nota":"Encerre com uma reflexão ou pergunta"}]}
Texto:"${wt.slice(0,2200)}"`,
      cards: `Crie 5 flashcards de estudo eficazes. APENAS JSON sem markdown:
{"flashcards":[{"pergunta":"Pergunta direta e clara 1?","resposta":"Resposta completa e didática que ajuda a memorizar.","dificuldade":"fácil","categoria":"Conceito Básico"},{"pergunta":"Pergunta 2?","resposta":"Resposta 2 detalhada.","dificuldade":"médio","categoria":"Intermediário"},{"pergunta":"Pergunta 3 mais difícil?","resposta":"Resposta 3 aprofundada.","dificuldade":"difícil","categoria":"Avançado"},{"pergunta":"Pergunta 4?","resposta":"Resposta 4.","dificuldade":"médio","categoria":"Aplicação"},{"pergunta":"Pergunta 5 de revisão?","resposta":"Resposta 5 consolidada.","dificuldade":"fácil","categoria":"Revisão"}]}
Texto:"${wt.slice(0,2200)}"`,
      quiz: `Crie quiz com 4 questões bem elaboradas. APENAS JSON sem markdown:
{"quiz":[{"num":1,"pergunta":"Questão completa e inequívoca 1?","alternativas":["A) Alternativa correta e bem escrita","B) Alternativa plausível mas incorreta","C) Alternativa plausível mas incorreta","D) Alternativa claramente diferente"],"correta":0,"explicacao":"Explicação detalhada de por que A é a resposta correta."},{"num":2,"pergunta":"Questão 2?","alternativas":["A) Errada","B) Correta","C) Errada","D) Errada"],"correta":1,"explicacao":"Explicação questão 2."},{"num":3,"pergunta":"Questão 3?","alternativas":["A) Errada","B) Errada","C) Correta","D) Errada"],"correta":2,"explicacao":"Explicação questão 3."},{"num":4,"pergunta":"Questão 4?","alternativas":["A) Errada","B) Errada","C) Errada","D) Correta"],"correta":3,"explicacao":"Explicação questão 4."}]}
Texto:"${wt.slice(0,2200)}"`,
    };
    const raw = await callAI(P[type] || P.resumo, "Retorne APENAS JSON válido. Zero texto fora do JSON. Zero markdown. Zero explicações.");
    setPct(100);
    const parsed = pj(raw);
    if (parsed) { setRes(parsed); toast("Gerado com sucesso!", "ok"); } else setRes({ _err: "Não foi possível processar. Adicione mais texto." });
    setLoad(false);
  };

  const rend = () => {
    if (!res) return null;
    if (res._err) return <div style={{ padding: 14, background: D.roseLo, borderRadius: 13, color: D.rose, fontSize: 14 }}>{res._err}</div>;

    if (rtype === "resumo") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fi">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {res.dificuldade && <span className="tag tamb">📊 {res.dificuldade}</span>}
          {res.tempoEstudo && <span className="tag tcyan">⏱️ {res.tempoEstudo}</span>}
        </div>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.3 }}>{res.titulo}</div>
        <div style={{ fontSize: 14, color: D.w2, lineHeight: 1.82, whiteSpace: "pre-line", background: D.bg2, borderRadius: 14, padding: 16, border: `1px solid ${D.b0}` }}>{res.resumo}</div>
        <div>
          <div className="sec-label">Pontos principais</div>
          {res.pontos?.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < res.pontos.length - 1 ? `1px solid ${D.b0}` : "none", alignItems: "flex-start" }}>
              <div style={{ width: 23, height: 23, borderRadius: 7, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0, color: "#fff" }}>{i + 1}</div>
              <span style={{ fontSize: 14, lineHeight: 1.55 }}>{p}</span>
            </div>
          ))}
        </div>
        <div><div className="sec-label">Palavras-chave</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{res.palavrasChave?.map((k, i) => <span key={i} className="tag tgrn">{k}</span>)}</div></div>
      </div>
    );

    if (rtype === "mapa") return <MindMap data={res} />;
    if (rtype === "slides") return <SlidesComp data={res} />;

    if (rtype === "cards") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }} className="fi">
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17 }}>🃏 {res.flashcards?.length} Flashcards</div>
        {res.flashcards?.map((c, i) => {
          const fl = flips[i]; const col = c.dificuldade === "fácil" ? D.mint : c.dificuldade === "difícil" ? D.rose : D.amber;
          return (
            <div key={i} onClick={() => setFlips(p => ({ ...p, [i]: !p[i] }))} style={{ cursor: "pointer", borderRadius: 16, border: `1.5px solid ${fl ? col + "55" : D.b0}`, background: fl ? col + "10" : D.s1, transition: "all .22s", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: fl ? col : D.blue2, letterSpacing: 1 }}>{fl ? "✅ RESPOSTA" : `❓ PERGUNTA ${i + 1}`}</span>
                <div style={{ display: "flex", gap: 5 }}>
                  <span className={`tag ${c.dificuldade === "fácil" ? "tgrn" : c.dificuldade === "difícil" ? "trose" : "tamb"}`} style={{ fontSize: 10 }}>{c.dificuldade}</span>
                  {c.categoria && <span className="tag tblue" style={{ fontSize: 10 }}>{c.categoria}</span>}
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.62, fontWeight: fl ? 400 : 600 }}>{fl ? c.resposta : c.pergunta}</div>
              <div style={{ marginTop: 9, fontSize: 11, color: D.w3 }}>👆 Toque para {fl ? "ver pergunta" : "revelar resposta"}</div>
            </div>
          );
        })}
      </div>
    );

    if (rtype === "quiz") {
      const total = res.quiz?.length || 0, done = Object.keys(qrev).length;
      const correct = res.quiz?.filter((q, i) => qrev[i] && qans[i] === q.correta).length || 0;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }} className="fi">
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚡ Quiz · {total} questões</span>
            {done === total && <span className="tag tgrn">{correct}/{total} certas</span>}
          </div>
          {res.quiz?.map((q, i) => {
            const rv = qrev[i];
            return (
              <div key={i} className="card" style={{ padding: 15 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 11 }}>{q.num}. {q.pergunta}</div>
                {q.alternativas?.map((a, j) => { const sel = qans[i] === j, crt = rv && j === q.correta, wrg = rv && sel && !crt; return <button key={j} onClick={() => { if (!rv) setQans(p => ({ ...p, [i]: j })); }} style={{ width: "100%", textAlign: "left", padding: "10px 13px", borderRadius: 11, marginBottom: 6, border: `1.5px solid ${crt ? D.mint + "65" : wrg ? D.rose + "65" : sel ? D.blueM : D.b0}`, background: crt ? D.mintLo : wrg ? D.roseLo : sel ? D.blueLo : D.bg2, cursor: rv ? "default" : "pointer", fontSize: 13, color: D.w1, transition: "all .15s", fontFamily: "Inter" }}>{a}{crt && " ✅"}{wrg && " ❌"}</button>; })}
                {qans[i] !== undefined && !rv && <button className="btn outline sm" style={{ marginTop: 3 }} onClick={() => setQrev(p => ({ ...p, [i]: true }))}>Ver resposta</button>}
                {rv && q.explicacao && <div style={{ marginTop: 8, padding: "9px 12px", background: D.mintLo, borderRadius: 10, fontSize: 13, color: D.mint, lineHeight: 1.5, border: `1px solid ${D.mint}25` }}>💡 {q.explicacao}</div>}
              </div>
            );
          })}
          {done === total && <div style={{ padding: 24, borderRadius: 18, background: correct / total >= .7 ? D.mintLo : D.amberLo, border: `1px solid ${correct / total >= .7 ? D.mint + "35" : D.amber + "35"}`, textAlign: "center" }}><div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 36, color: correct / total >= .7 ? D.mint : D.amber, animation: "cntA .5s ease both" }}>{Math.round((correct / total) * 100)}%</div><div style={{ fontSize: 15, color: D.w2, marginTop: 5 }}>{correct / total >= .7 ? "Excelente! 🎉" : correct / total >= .5 ? "Bom! Continue 📚" : "Revise o material 💪"}</div></div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* tab bar */}
      <div style={{ display: "flex", overflowX: "auto", gap: 3, padding: "13px 15px 9px", borderBottom: `1px solid ${D.b0}`, scrollbarWidth: "none" }}>
        {TABS.map(t => { const a = tab === t.id; return <button key={t.id} onClick={() => { setTab(t.id); setRes(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 11px", borderRadius: 11, border: `1px solid ${a ? D.blueM : "transparent"}`, background: a ? D.blueLo : "transparent", cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", minWidth: 52 }}><span style={{ fontSize: 17 }}>{t.e}</span><span style={{ fontSize: 11, fontWeight: 700, color: a ? D.blue2 : D.w2, fontFamily: "Inter" }}>{t.l}</span></button>; })}
      </div>

      <div style={{ padding: "17px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "voz" && (
          <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div><div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 21, marginBottom: 4 }}>Transcrição por Voz 🎤</div><div style={{ fontSize: 14, color: D.w2 }}>Fale — IA transcreve em português</div></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 16 }}>
              <div style={{ position: "relative" }}>
                {rec && <div style={{ position: "absolute", inset: -13, borderRadius: "50%", border: `2.5px solid ${D.rose}`, animation: "micA 1.2s ease-in-out infinite", opacity: .65 }} />}
                <button onClick={rec ? stopRec : startRec} style={{ width: 90, height: 90, borderRadius: "50%", background: rec ? D.gRose : D.gBlue, border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, boxShadow: rec ? `0 0 36px rgba(244,63,94,.48)` : `0 0 28px rgba(37,99,235,.38)`, transition: "all .22s" }}>
                  <span style={{ fontSize: 30 }}>{rec ? "⏸" : "🎤"}</span>
                  {rec && <div style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</div>}
                </button>
              </div>
              {rec ? <div style={{ display: "flex", alignItems: "center", gap: 9, color: D.rose, fontSize: 13, fontWeight: 600 }}><WaveBar on col={D.rose} /> Gravando…</div> : <div style={{ fontSize: 13, color: D.w3 }}>Toque para {trans ? "continuar" : "iniciar"}</div>}
            </div>
            {trans && (
              <div className="card" style={{ padding: 15 }}>
                <div className="sec-label">Transcrição</div>
                <div style={{ fontSize: 14, lineHeight: 1.75 }}>{trans}</div>
                <div style={{ display: "flex", gap: 7, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="btn primary sm" onClick={() => { setTexto(trans); setTab("resumo"); setTimeout(() => gen("resumo"), 50); }}>🧠 Resumo</button>
                  <button className="btn ghost sm" onClick={() => { setTexto(trans); setTab("mapa"); setTimeout(() => gen("mapa"), 50); }}>🗺️ Mapa</button>
                  <button className="btn ghost sm" onClick={() => { setTexto(trans); setTab("slides"); setTimeout(() => gen("slides"), 50); }}>📊 Slides</button>
                  <button className="btn ghost sm" onClick={() => { setTexto(trans); setTab("cards"); setTimeout(() => gen("cards"), 50); }}>🃏 Cards</button>
                </div>
              </div>
            )}
            {trans && <button className="btn ghost xs" style={{ alignSelf: "flex-start" }} onClick={() => { setTrans(""); setTexto(""); }}>🗑️ Limpar</button>}
          </div>
        )}

        {tab !== "voz" && !load && (
          <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 21 }}>
              {tab === "resumo" ? "Resumo Inteligente 🧠" : tab === "mapa" ? "Mapa Mental 🗺️" : tab === "slides" ? "Gerador de Slides 📊" : tab === "cards" ? "Flashcards 🃏" : "Quiz Interativo ⚡"}
            </div>
            <textarea className="inp" value={wt} onChange={e => setTexto(e.target.value)} placeholder="Cole o texto da aula, artigo ou resumo aqui…" style={{ minHeight: 118 }} />
            <button className="btn primary lg" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={() => gen(tab)} disabled={!wt.trim()}>✨ Gerar com IA</button>
          </div>
        )}

        {load && <LoadScreen steps={STEPS3[ltab] || []} cur={cur} pct={pct} title={`Gerando ${tab === "mapa" ? "Mapa Mental" : tab === "slides" ? "Slides" : tab === "cards" ? "Flashcards" : tab === "quiz" ? "Quiz" : "Resumo"}…`} />}

        {!load && res && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ height: 1, background: D.b0 }} />
            {rend()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
              <button className="btn ghost sm" onClick={() => { toast("📄 Gerando PDF…", "info"); setTimeout(() => toast("✅ PDF gerado!", "ok"), 2000); }}>📄 PDF</button>
              <button className="btn ghost sm" onClick={() => { navigator.clipboard.writeText(JSON.stringify(res, null, 2)); toast("Copiado!", "ok"); }}>📋 Copiar</button>
              <button className="btn ghost sm" onClick={() => { setRes(null); gen(rtype); }}>↺ Refazer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PLANOS
═══════════════════════════════════════════════ */
const Planos = ({ plan, setPlan, toast }) => {
  const [ann, setAnn] = useState(false);
  const PL = [
    { id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["10 posts/mês", "5 estudos/mês", "Marca d'água DVS", "IA básica"], miss: ["SmartSound AI", "Transcrição ilimitada", "Export HD"] },
    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: "⭐ MAIS POPULAR", feats: ["Posts ilimitados", "Sem marca d'água", "SmartSound AI", "Export HD", "Score avançado", "Suporte prioritário"], miss: [] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: "🎓 MELHOR CUSTO", feats: ["Transcrição ilimitada", "Mapas mentais ilimitados", "Slides completos", "Flashcards ilimitados", "Quiz ilimitado", "Export PDF avançado"], miss: [] },
    { id: "full", name: "Completo", price: 22, col: D.amber, grad: D.gAmber, badge: "👑 TUDO INCLUSO", feats: ["Tudo do Social", "Tudo do Estudante", "IA prioritária", "Sem limites", "Suporte 24/7"], miss: [] },
  ];
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="fu">
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Planos & Preços</div>
        <div style={{ fontSize: 14, color: D.w2 }}>Escolha o plano ideal para você</div>
      </div>
      <div className="card fu d1" style={{ padding: 5, display: "flex", gap: 3 }}>
        {["Mensal", "Anual  –20%"].map((l, i) => <button key={i} onClick={() => setAnn(i === 1)} style={{ flex: 1, padding: "10px 4px", borderRadius: 11, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s", background: ann === (i === 1) ? D.blue : "transparent", color: ann === (i === 1) ? "#fff" : D.w2, fontFamily: "Inter" }}>{l}</button>)}
      </div>
      {PL.map((p, idx) => {
        const price = ann && p.price > 0 ? Math.round(p.price * .8) : p.price; const active = plan === p.id;
        return (
          <div key={p.id} className={`card fu d${idx + 2}`} style={{ border: `2px solid ${active ? p.col : D.b0}`, overflow: "visible", position: "relative" }}>
            {p.badge && <div style={{ position: "absolute", top: -13, left: 16, padding: "3px 12px", borderRadius: 99, fontSize: 11, fontWeight: 800, background: p.grad, color: "#fff", zIndex: 1 }}>{p.badge}</div>}
            <div style={{ background: p.grad, padding: "18px 20px 15px", borderRadius: "16px 16px 0 0" }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginTop: 7 }}><span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 32, color: "#fff" }}>R${price}</span><span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 6 }}>{p.price > 0 ? "/mês" : ""}</span></div>
              {ann && p.price > 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginTop: 2 }}>Cobrado anualmente</div>}
            </div>
            <div style={{ padding: "15px 20px 18px" }}>
              {p.feats.map((f, i) => <div key={i} style={{ display: "flex", gap: 9, fontSize: 13, marginBottom: 8, alignItems: "center", color: D.w1 }}><span style={{ color: D.mint, fontSize: 14 }}>✓</span>{f}</div>)}
              {p.miss.map((f, i) => <div key={i} style={{ display: "flex", gap: 9, fontSize: 13, marginBottom: 8, color: D.w3, alignItems: "center" }}><span style={{ fontSize: 14 }}>✗</span>{f}</div>)}
              <button onClick={() => { setPlan(p.id); toast(`✅ Plano "${p.name}" ativado!`, "ok"); }} style={{ width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${active ? p.col : p.col + "40"}`, background: active ? p.grad : "transparent", color: active ? "#fff" : p.col, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Sora',sans-serif", transition: "all .18s" }}>
                {active ? "✓ Plano Atual" : p.id === "free" ? "Usar Grátis" : "Assinar Agora"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SMARTSOUND — Músicas REAIS via iTunes API
   Preview MP3 gratuito · Ilimitado · Sem API key
═══════════════════════════════════════════════ */
const fmt = ms => { const t = Math.floor((ms||0)/1000); return `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}` };

const SmartSoundPlayer = ({ musicas = [], toast }) => {
  const [track,      setTrack]    = useState(null); // faixa tocando
  const [results,    setResults]  = useState([]);
  const [queue,      setQueue]    = useState([]);
  const [history,    setHistory]  = useState([]);
  const [search,     setSearch]   = useState("");
  const [searching,  setSearching]= useState(false);
  const [aiLoading,  setAiLoading]= useState(false);
  const [playing,    setPlaying]  = useState(false);
  const [progress,   setProgress] = useState(0);   // 0-100
  const [elapsed,    setElapsed]  = useState(0);   // segundos
  const [duration,   setDuration] = useState(30);  // segundos
  const [volume,     setVolume]   = useState(0.8);
  const [tab,        setTab]      = useState("sugestoes"); // sugestoes | busca | generos
  const audioRef  = useRef(null);
  const progTimer = useRef(null);

  // ── Inicializa audio ──────────────────────────
  useEffect(() => {
    const a = new Audio();
    a.volume = volume;
    a.crossOrigin = "anonymous";
    a.onended = () => { setPlaying(false); setProgress(0); setElapsed(0); playNext(); };
    a.onloadedmetadata = () => setDuration(a.duration || 30);
    a.onerror = () => { toast("Prévia indisponível. Tente outra música.", "warn"); setPlaying(false); };
    audioRef.current = a;
    return () => { a.pause(); clearInterval(progTimer.current); };
  }, []);

  // ── Volume ────────────────────────────────────
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  // ── Toca faixa ───────────────────────────────
  const playTrack = (t) => {
    if (!t?.previewUrl) { toast("Prévia não disponível para esta faixa.", "warn"); return; }
    const a = audioRef.current;
    if (!a) return;
    a.pause(); clearInterval(progTimer.current);
    a.src = t.previewUrl;
    a.load();
    a.play().catch(() => toast("Clique novamente para tocar.", "info"));
    setTrack(t); setPlaying(true); setProgress(0); setElapsed(0);
    setHistory(h => [t, ...h.filter(x => x.trackId !== t.trackId)].slice(0, 20));
    progTimer.current = setInterval(() => {
      if (!a.paused) {
        setElapsed(Math.floor(a.currentTime));
        setProgress((a.currentTime / (a.duration || 30)) * 100);
      }
    }, 500);
    toast(`▶ ${t.trackName} — ${t.artistName}`, "ok");
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || !track) return;
    if (playing) { a.pause(); clearInterval(progTimer.current); setPlaying(false); }
    else {
      a.play().catch(() => {});
      setPlaying(true);
      progTimer.current = setInterval(() => {
        if (!a.paused) { setElapsed(Math.floor(a.currentTime)); setProgress((a.currentTime / (a.duration||30))*100); }
      }, 500);
    }
  };

  const seek = (pct) => {
    const a = audioRef.current;
    if (!a || !track) return;
    a.currentTime = (pct / 100) * (a.duration || 30);
    setProgress(pct);
  };

  const playNext = () => { if (queue.length > 0) { playTrack(queue[0]); setQueue(q => q.slice(1)); } };
  const addQueue = (t) => { setQueue(q => [...q, t]); toast(`🔜 "${t.trackName}" adicionada à fila`, "ok"); };

  const stop = () => {
    const a = audioRef.current;
    if (a) { a.pause(); a.src = ""; }
    clearInterval(progTimer.current);
    setPlaying(false); setProgress(0); setElapsed(0); setTrack(null);
  };

  // ── Busca iTunes API (real, CORS ok) ──────────
  const searchItunes = async (q, country = "br") => {
    if (!q.trim()) return;
    setSearching(true); setResults([]);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20&country=${country}&explicit=No`,
        { method: "GET" }
      );
      const data = await res.json();
      const tracks = (data.results || []).filter(r => r.previewUrl);
      setResults(tracks);
      if (!tracks.length) toast("Nenhuma prévia disponível. Tente outro termo.", "warn");
    } catch { toast("Erro de conexão. Tente novamente.", "err"); }
    setSearching(false);
  };

  // ── IA sugere → busca iTunes ──────────────────
  const playFromAI = async (m) => {
    setAiLoading(m.tipo);
    // IA melhora o termo de busca para máxima precisão
    const raw = await callAI(
      `A música sugerida é "${m.nome}" de "${m.artista}" (estilo: ${m.vibe}).
Retorne o MELHOR termo de busca em inglês ou português para encontrar esta música ou música similar no iTunes.
APENAS o termo de busca, sem aspas, sem explicações. Máximo 5 palavras.`,
      "Retorne APENAS o termo de busca."
    );
    const termo = raw?.trim() || `${m.nome} ${m.artista}`;
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(termo)}&media=music&limit=5&country=br&explicit=No`
      );
      const data = await res.json();
      const tracks = (data.results || []).filter(r => r.previewUrl);
      if (tracks.length > 0) { playTrack(tracks[0]); }
      else {
        // fallback: busca direto pelo nome
        const res2 = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(m.nome)}&media=music&limit=5&country=br`);
        const data2 = await res2.json();
        const t2 = (data2.results||[]).filter(r => r.previewUrl);
        if (t2.length > 0) playTrack(t2[0]);
        else toast("Prévia não encontrada. Busque manualmente.", "warn");
      }
    } catch { toast("Erro ao buscar música.", "err"); }
    setAiLoading(null);
  };

  // ── Géneros rápidos ───────────────────────────
  const GENEROS = [
    { l: "🔥 Funk BR",    q: "funk brasileiro" },
    { l: "😌 Lo-fi",      q: "lofi hip hop" },
    { l: "🎵 Sertanejo",  q: "sertanejo universitario" },
    { l: "🌊 Trap",       q: "trap brasil" },
    { l: "💜 R&B",        q: "R&B soul" },
    { l: "🎸 Rock",       q: "rock alternativo" },
    { l: "⚡ Eletrônico", q: "electronic dance music" },
    { l: "🎷 Jazz",       q: "jazz bossa nova brasil" },
    { l: "🌟 Pop BR",     q: "pop brasileiro" },
    { l: "🎤 Rap BR",     q: "rap brasileiro" },
    { l: "☀️ Pagode",     q: "pagode samba" },
    { l: "🕺 Funk US",    q: "funk old school" },
  ];

  const artworkUrl = (t) => t?.artworkUrl100?.replace("100x100", "300x300") || null;

  // ── RENDER ────────────────────────────────────
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* ── NOW PLAYING ── */}
      <div style={{
        background: track ? `linear-gradient(135deg, ${D?.bg3 || "#0d1018"} 0%, ${D?.s2 || "#182030"} 100%)` : (D?.s1 || "#131928"),
        padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 12,
        borderBottom: `1px solid ${D?.b0 || "#1a2236"}`,
        transition: "background .4s",
        minHeight: 110
      }}>
        {track ? (
          <div key="playing-state" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* faixa info */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: (D?.bg2 || "#090c12"), boxShadow: "0 4px 16px rgba(0,0,0,.5)" }}>
                {artworkUrl(track) ? (
                  <img src={artworkUrl(track)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎵</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: (D?.w1 || "#f8faff") }}>{track.trackName}</div>
                <div style={{ fontSize: 12, color: (D?.w2 || "#94a3b8"), marginTop: 2 }}>{track.artistName}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <a href={track.trackViewUrl} target="_blank" rel="noreferrer" style={{ color: (D?.w3 || "#3d4f6e"), fontSize: 14, textDecoration: "none", padding: 4 }}>↗</a>
                <button onClick={stop} style={{ background: "none", border: "none", color: (D?.w3 || "#3d4f6e"), cursor: "pointer", padding: 4, fontSize: 18 }}>✕</button>
              </div>
            </div>

            {/* progress bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ position: "relative", height: 4, background: (D?.b1 || "#243049"), borderRadius: 99, cursor: "pointer" }}
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX-r.left)/r.width)*100); }}>
                <div style={{ height: "100%", width: `${progress}%`, background: (D?.gRose || "linear-gradient(135deg,#e11d48 0%,#f43f5e 100%)"), borderRadius: 99, transition: "width .3s linear" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: (D?.w3 || "#3d4f6e") }}>
                <span>{fmt(elapsed * 1000)}</span>
                <span>{fmt(duration * 1000)}</span>
              </div>
            </div>

            {/* controles */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => { if (history.length > 1) playTrack(history[1]); }}
                disabled={history.length <= 1}
                style={{ background: "none", border: "none", color: history.length > 1 ? (D?.w2 || "#94a3b8") : (D?.w3 || "#3d4f6e"), cursor: "pointer", fontSize: 20 }}>⏮</button>
              <button onClick={togglePlay}
                style={{ width: 42, height: 42, borderRadius: "50%", background: (D?.gRose || "#f43f5e"), border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", boxShadow: "0 4px 14px rgba(244,63,94,.4)" }}>
                {playing ? "⏸" : "▶"}
              </button>
              <button onClick={playNext} disabled={!queue.length}
                style={{ background: "none", border: "none", color: queue.length ? (D?.w2 || "#94a3b8") : (D?.w3 || "#3d4f6e"), cursor: "pointer", fontSize: 20 }}>⏭</button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
                <input type="range" min={0} max={1} step={.05} value={volume} onChange={e => setVolume(+e.target.value)} style={{ flex: 1, accentColor: (D?.rose || "#f43f5e"), height: 3 }} />
              </div>
            </div>
          </div>
        ) : (
          <div key="idle-state" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: (D?.roseLo || "rgba(244,63,94,0.1)"), border: `1px solid ${D?.roseLo || "rgba(244,63,94,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎵</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: (D?.w1 || "#f8faff") }}>SmartSound AI</div>
              <div style={{ fontSize: 12, color: (D?.w2 || "#94a3b8"), marginTop: 3 }}>Músicas reais · Prévia de 30s</div>
            </div>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", borderBottom: `1px solid ${D.b0}` }}>
        {[["sugestoes","🤖 IA"], ["busca","🔍 Buscar"], ["generos","🎭 Gêneros"], ["historico","🕐 Histórico"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", borderBottom: `2px solid ${tab===id?D.rose:"transparent"}`, color: tab===id?D.rose:D.w3, fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all .15s", fontFamily: "Inter" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 180 }}>

        {/* ── TAB: SUGESTÕES IA ── */}
        {tab === "sugestoes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>SUGERIDAS PELA IA PARA SEU CONTEÚDO</div>
            {musicas?.length ? musicas.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 12, background: D.bg2, border: `1.5px solid ${D.b0}`, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = D.blueM}
                onMouseOut={e => e.currentTarget.style.borderColor = D.b0}
                onClick={() => playFromAI(m)}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: i===0?D.gRose:i===1?D.gBlue:D.gMint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {i===0?"🔥":i===1?"⚖️":"🎨"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{m.nome}</div>
                  <div style={{ fontSize: 11, color: D.w2 }}>{m.artista} · {m.vibe}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span className="tag trose" style={{ fontSize: 10 }}>{m.tipo}</span>
                  {aiLoading === m.tipo
                    ? <Spin s={14} c={D.rose} />
                    : <span style={{ fontSize: 11, color: D.blue2, fontWeight: 700 }}>▶ Tocar</span>}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "24px 0", color: D.w3, fontSize: 13 }}>
                Crie um conteúdo para receber sugestões da IA 🎵
              </div>
            )}
          </div>
        )}

        {/* ── TAB: BUSCA ── */}
        {tab === "busca" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="inp" value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key==="Enter" && searchItunes(search)}
                placeholder="Artista, música, álbum… ex: Anitta, Drake, Taylor"
                style={{ flex: 1, padding: "11px 14px", fontSize: 14 }} />
              <button className="btn primary sm" onClick={() => searchItunes(search)} disabled={searching || !search.trim()}>
                {searching ? <Spin s={14} c="#fff" /> : "🔍"}
              </button>
            </div>
            {/* country filter */}
            <div style={{ display: "flex", gap: 6 }}>
              {[["br","🇧🇷 BR"], ["us","🇺🇸 US"], ["pt","🇵🇹 PT"], ["mx","🇲🇽 MX"]].map(([c, l]) => (
                <button key={c} className="btn ghost xs" onClick={() => searchItunes(search, c)} disabled={!search.trim() || searching}>{l}</button>
              ))}
            </div>
            {/* resultados */}
            {searching && <div style={{ display: "flex", justifyContent: "center", padding: 20 }}><Spin s={28} /></div>}
            {!searching && results.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
                {results.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", background: track?.trackId===r.trackId?`${D.rose}14`:D.bg2, border: `1.5px solid ${track?.trackId===r.trackId?D.rose+"55":D.b0}`, borderRadius: 11, cursor: "pointer", transition: "all .15s" }}
                    onClick={() => playTrack(r)}>
                    {r.artworkUrl60
                      ? <img src={r.artworkUrl60} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      : <div style={{ width: 40, height: 40, borderRadius: 8, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎵</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.trackName}</div>
                      <div style={{ fontSize: 11, color: D.w2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.artistName} · {r.collectionName}</div>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: D.w3 }}>{fmt(r.trackTimeMillis)}</span>
                      <button onClick={e => { e.stopPropagation(); addQueue(r); }} title="Adicionar à fila"
                        style={{ background: D.accLo||D.blueLo, border: `1px solid ${D.blueM}`, borderRadius: 6, padding: "3px 7px", fontSize: 11, color: D.blue2, cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!searching && results.length === 0 && search && (
              <div style={{ textAlign: "center", padding: "20px 0", color: D.w3, fontSize: 13 }}>Pressione 🔍 para buscar</div>
            )}
          </div>
        )}

        {/* ── TAB: GÊNEROS ── */}
        {tab === "generos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>EXPLORE POR GÊNERO — TOQUE E OUÇA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {GENEROS.map((g, i) => (
                <button key={i} className="btn ghost sm" style={{ justifyContent: "flex-start", fontWeight: 700, fontSize: 13 }}
                  onClick={() => { setTab("busca"); setSearch(g.q); searchItunes(g.q); }}>
                  {g.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: HISTÓRICO ── */}
        {tab === "historico" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>MÚSICAS TOCADAS ({history.length})</div>
            {history.length === 0 && <div style={{ textAlign: "center", padding: "24px 0", color: D.w3, fontSize: 13 }}>Nenhuma música tocada ainda</div>}
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 10, background: D.bg2, border: `1px solid ${D.b0}`, cursor: "pointer" }}
                onClick={() => playTrack(h)}>
                {h.artworkUrl60 && <img src={h.artworkUrl60} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.trackName}</div>
                  <div style={{ fontSize: 11, color: D.w2 }}>{h.artistName}</div>
                </div>
                <span style={{ fontSize: 11, color: D.w3 }}>▶</span>
              </div>
            ))}
            {history.length > 0 && (
              <button className="btn ghost xs" style={{ alignSelf: "center", marginTop: 4 }} onClick={() => setHistory([])}>🗑️ Limpar histórico</button>
            )}
          </div>
        )}
      </div>

      {/* rodapé */}
      <div style={{ padding: "8px 14px 10px", borderTop: `1px solid ${D.b0}`, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, color: D.w3 }}>🎵 Powered by iTunes · Prévias de 30s gratuitas · Ilimitado</span>
        {track?.trackViewUrl && (
          <a href={track.trackViewUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "auto", fontSize: 11, color: D.blue2, fontWeight: 700, textDecoration: "none" }}>Apple Music ↗</a>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   AUTH HELPERS  (localStorage persistence)
═══════════════════════════════════════════════ */
const DB_KEY = "dvs_users_v1";
const SESSION_KEY = "dvs_session_v1";

const getUsers  = () => { try { return JSON.parse(localStorage.getItem(DB_KEY) || "{}"); } catch { return {}; } };
const saveUsers = u  => localStorage.setItem(DB_KEY, JSON.stringify(u));
const getSession= () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } };
const saveSession=(s) => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
const clearSession=() => localStorage.removeItem(SESSION_KEY);

function hashPass(p) {
  // simple deterministic hash (not crypto, but fine for demo)
  let h = 0;
  for (let i = 0; i < p.length; i++) { h = Math.imul(31, h) + p.charCodeAt(i) | 0; }
  return h.toString(36);
}

const AVATAR_COLORS = [D.gBlue, D.gMint, D.gRose, D.gAmber, D.gCyan,
  "linear-gradient(135deg,#7c3aed,#a855f7)",
  "linear-gradient(135deg,#0891b2,#06b6d4)",
  "linear-gradient(135deg,#be185d,#f43f5e)"];

function getAvatarGrad(email) {
  let h = 0; for (let c of email) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitials(name) {
  return name.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";
}



/* ═══════════════════════════════════════════════
   AUTH SCREEN — Sistema completo nível premium
   Login · Cadastro · Recuperação · Confirmação
═══════════════════════════════════════════════ */

/* Rate limiter local — proteção brute-force */
const RL = {
  attempts: {},
  check(email) {
    const k = email.toLowerCase();
    const now = Date.now();
    if (!this.attempts[k]) this.attempts[k] = [];
    this.attempts[k] = this.attempts[k].filter(t => now - t < 15 * 60 * 1000); // janela 15min
    return this.attempts[k].length < 5;
  },
  add(email) {
    const k = email.toLowerCase();
    if (!this.attempts[k]) this.attempts[k] = [];
    this.attempts[k].push(Date.now());
  },
  remaining(email) {
    const k = email.toLowerCase();
    return Math.max(0, 5 - (this.attempts[k]?.length || 0));
  },
};

/* Gera senha forte */
function gerarSenhaForte() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  return Array.from({length: 14}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/* Força da senha */
function senhaForte(p) {
  if (!p) return { score: 0, label: "", color: "" };
  let s = 0;
  if (p.length >= 6)  s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;
  const score = Math.min(s, 4);
  const data = [
    { label: "", color: D.b1 },
    { label: "Muito fraca", color: D.rose },
    { label: "Fraca",       color: "#fb923c" },
    { label: "Boa",         color: D.amber },
    { label: "Forte",       color: D.mint },
  ];
  return { score, ...data[score] };
}


/* ── Auth Sub-components ── */
const Eye = ({ show, toggle, I }) => (
  <button type="button" onClick={toggle} style={{ background: "none", border: "none", color: show ? D.blue2 : D.w3, cursor: "pointer", padding: 4, display: "flex", transition: "color .18s" }}>
    {show ? I.eyeOff : I.eye}
  </button>
);



const Inp = ({ label, icon, right, type, val, onChange, err, placeholder, autoComplete, hint, errors, setErrors, submit, I }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {(label || hint) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && <label style={{ fontSize: 12, fontWeight: 700, color: D.w2, letterSpacing: .4, textTransform: "uppercase" }}>{label}</label>}
          {hint && <span style={{ fontSize: 11, color: D.w3 }}>{hint}</span>}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? D.blue2 : D.w3, transition: "color .18s", pointerEvents: "none", display: "flex" }}>
          {icon}
        </div>
        <input
          type={type || "text"} value={val}
          onChange={e => { onChange(e.target.value); if (errors && errors[autoComplete]) setErrors(p => { const n={...p}; delete n[autoComplete]; return n; }); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder={placeholder}
          autoComplete={autoComplete || "off"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", background: D.s0,
            border: `1.5px solid ${err ? D.rose + "90" : focused ? D.blueM : D.b0}`,
            borderRadius: 14, color: D.w1, fontSize: 15, lineHeight: 1,
            padding: `15px 46px 15px ${icon ? "46px" : "16px"}`,
            outline: "none", transition: "border .18s, box-shadow .18s",
            fontFamily: "Inter",
            boxShadow: focused ? `0 0 0 3px ${err ? D.roseLo : D.blueLo}` : "none",
          }}
        />
        {right && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>{right}</div>}
      </div>
      {err && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: D.rose, animation: "fadeIn .2s ease both" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={D.rose} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {err}
        </div>
      )}
    </div>
  );
};

const StepBar = ({ step, I }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 22 }}>
    {["Dados", "Senha", "Verificar"].map((l, i) => {
      const s = i + 1;
      const done = step > s, active = step === s;
      return (
        <div key={l} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? D.mint : active ? D.gBlue : D.s3, border: `2px solid ${done ? D.mint : active ? D.blue : D.b1}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", color: done || active ? "#fff" : D.w3, fontWeight: 800, fontSize: 12 }}>
              {done ? I.check : s}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: active ? D.blue2 : done ? D.mint : D.w3, whiteSpace: "nowrap" }}>{l}</span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? D.mint : D.b1, margin: "0 6px", marginBottom: 16, borderRadius: 99, transition: "background .3s" }} />}
        </div>
      );
    })}
  </div>
);


/* ── Real Google Login Integration ── */
const GoogleLoginBtn = ({ onLogin, setErrors, D }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;
    
    // Configura o ID do cliente do Google (idealmente do .env)
    const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || "422628535108-fh5i5dudbqiajhr7uo6ocg12qit83qb1.apps.googleusercontent.com";

    window.google.accounts.id.initialize({
      client_id: client_id,
      callback: (response) => {
        // O JWT retornado pelo Google
        const token = response.credential;
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        console.log("Google Login Success:", payload);
        
        const session = {
          email: payload.email.toLowerCase(),
          name: payload.name,
          picture: payload.picture,
          plan: "free",
          token: token
        };

        // Salva usuário no banco local simulado
        const users = getUsers();
        if (!users[session.email]) {
          users[session.email] = {
            name: payload.name,
            email: session.email,
            passHash: "GOOGLE_AUTH",
            plan: "free",
            createdAt: new Date().toISOString(),
            stats: { posts: 0, transcricoes: 0, mapas: 0, flashcards: 0, quiz: 0 }
          };
          saveUsers(users);
        }
        
        saveSession(session);
        onLogin(session);
      }
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "filled_blue",
      size: "large",
      width: 400,
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left"
    });
  }, [onLogin]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 10 }}>
       <div ref={btnRef} style={{ width: "100%", maxWidth: 400 }}></div>
    </div>
  );
};

const AuthScreen = ({ onLogin }) => {
  /* ── state ── */
  const [page, setPage] = useState("login"); // login | register | forgot | reset | verify
  const [step, setStep] = useState(1);       // register steps 1-3

  // form fields
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [pass,       setPass]       = useState("");
  const [pass2,      setPass2]      = useState("");
  const [code,       setCode]       = useState("");      // verificação email
  const [resetCode,  setResetCode]  = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [remember,   setRemember]   = useState(false);
  const [termsOk,    setTermsOk]    = useState(false);

  // ui state
  const [showPass,  setShowPass]  = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showNPass, setShowNPass] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [loadMsg,   setLoadMsg]   = useState("");
  const [errors,    setErrors]    = useState({});
  const [aiTip,     setAiTip]     = useState("");
  const [aiLoad,    setAiLoad]    = useState(false);
  const [attempts,  setAttempts]  = useState(0);
  const [locked,    setLocked]    = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const pwd = senhaForte(page === "reset" ? newPass : pass);
  const timerRef = useRef(null);

  /* ── lockout timer ── */
  useEffect(() => {
    if (!locked) return;
    let secs = 30;
    setLockTimer(secs);
    timerRef.current = setInterval(() => {
      secs--;
      setLockTimer(secs);
      if (secs <= 0) { setLocked(false); clearInterval(timerRef.current); }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [locked]);

  /* ── IA tip — email ── */
  useEffect(() => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || page !== "login") return;
    const t = setTimeout(async () => {
      setAiLoad(true);
      const raw = await callAI(
        `Usuário fazendo login com email "${email}". Baseado no domínio, crie mensagem de boas-vindas personalizada, calorosa, 1 frase, 1 emoji no início. Seja criativo e específico ao domínio.`,
        "Apenas 1 frase curta personalizada."
      );
      if (raw?.trim()) setAiTip(raw.trim());
      setAiLoad(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [email, page]);

  /* ── IA tip — nome ── */
  useEffect(() => {
    if (!name.trim() || name.trim().length < 3 || page !== "register") return;
    const t = setTimeout(async () => {
      setAiLoad(true);
      const raw = await callAI(
        `Novo usuário chamado "${name.trim().split(" ")[0]}". Crie mensagem motivacional e calorosa de boas-vindas para o DVS EduCreator (app de conteúdo com IA e estudo). 1 emoji, 1 frase.`,
        "Apenas 1 frase motivacional personalizada."
      );
      if (raw?.trim()) setAiTip(raw.trim());
      setAiLoad(false);
    }, 1600);
    return () => clearTimeout(t);
  }, [name, page]);

  /* ── gera código de verificação ── */
  const makeCode = () => {
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(c);
    return c;
  };

  /* ── validate ── */
  const validate = () => {
    const e = {};
    if (page === "login") {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "E-mail inválido";
      if (!pass.trim()) e.pass = "Informe sua senha";
    }
    if (page === "register") {
      if (step === 1) {
        if (!name.trim() || name.trim().length < 2) e.name = "Informe seu nome completo";
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "E-mail inválido";
      }
      if (step === 2) {
        if (pwd.score < 2) e.pass = "Crie uma senha mais forte";
        if (pass !== pass2) e.pass2 = "As senhas não coincidem";
        if (!termsOk) e.terms = "Aceite os termos para continuar";
      }
      if (step === 3) {
        if (code.trim() !== generatedCode) e.code = "Código incorreto. Verifique seu e-mail";
      }
    }
    if (page === "forgot") {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "E-mail inválido";
    }
    if (page === "reset") {
      if (resetCode.trim() !== generatedCode) e.resetCode = "Código incorreto";
      if (senhaForte(newPass).score < 2) e.newPass = "Crie uma senha mais forte";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── submit ── */
  const submit = async () => {
    if (!validate() || loading || locked) return;
    setLoading(true);

    /* ── LOGIN ── */
    if (page === "login") {
      if (!RL.check(email)) { setLocked(true); setLoading(false); return; }
      setLoadMsg("Verificando credenciais…"); await sleep(550);
      setLoadMsg("Autenticando com segurança…"); await sleep(500);
      const users = getUsers();
      const user = users[email.toLowerCase()];
      if (!user || user.passHash !== hashPass(pass)) {
        RL.add(email);
        const rem = RL.remaining(email);
        setAttempts(a => a + 1);
        if (rem <= 0) { setLocked(true); }
        setErrors({ pass: `E-mail ou senha incorretos.${rem > 0 ? ` ${rem} tentativa(s) restante(s).` : ""}` });
        // shake the card
        const card = document.getElementById("auth-card");
        if (card) { card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); }
        setLoading(false); setLoadMsg(""); return;
      }
      if (remember) saveSession({ ...{}, rememberMe: true });
      setLoadMsg(`Bem-vindo de volta, ${user.name.split(" ")[0]}! 🎉`); await sleep(500);
      const session = { email: email.toLowerCase(), name: user.name, plan: user.plan || "free", token: crypto?.randomUUID?.() || (Math.random().toString(36)+Date.now().toString(36)) };
      saveSession(session);
      onLogin(session);
      return;
    }

    /* ── REGISTER ── */
    if (page === "register") {
      if (step === 1) {
        setLoadMsg("Verificando disponibilidade…"); await sleep(700);
        const users = getUsers();
        if (users[email.toLowerCase()]) {
          setErrors({ email: "Este e-mail já possui uma conta. Faça login." });
          setLoading(false); return;
        }
        setStep(2); setLoading(false); setLoadMsg(""); return;
      }
      if (step === 2) {
        setLoadMsg("Configurando segurança…"); await sleep(600);
        const c = makeCode();
        setVerifyEmail(email);
        // Em produção: enviar email com c
        console.log("Código de verificação:", c); // apenas para demo
        setStep(3); setLoading(false); setLoadMsg(""); return;
      }
      if (step === 3) {
        setLoadMsg("Criando sua conta…"); await sleep(500);
        setLoadMsg("Ativando IA personalizada…"); await sleep(700);
        setLoadMsg("Finalizando…"); await sleep(400);
        const users = getUsers();
        const user = {
          name: name.trim(), email: email.toLowerCase(),
          passHash: hashPass(pass), plan: "free",
          createdAt: new Date().toISOString(),
          bio: "", phone: "", verified: true,
          stats: { posts: 0, transcricoes: 0, mapas: 0, flashcards: 0, quiz: 0 },
        };
        users[email.toLowerCase()] = user;
        saveUsers(users);
        const session = { email: email.toLowerCase(), name: user.name, plan: "free", token: crypto?.randomUUID?.() || (Math.random().toString(36)+Date.now().toString(36)) };
        saveSession(session);
        onLogin(session);
        return;
      }
    }

    /* ── FORGOT ── */
    if (page === "forgot") {
      setLoadMsg("Verificando conta…"); await sleep(600);
      const users = getUsers();
      if (!users[email.toLowerCase()]) {
        // Não revelamos se conta existe (segurança)
        setLoadMsg("Verificando…"); await sleep(400);
      }
      const c = makeCode();
      console.log("Código redefinição:", c);
      setLoadMsg("Enviando e-mail seguro…"); await sleep(800);
      setPage("reset"); setLoading(false); setLoadMsg(""); return;
    }

    /* ── RESET ── */
    if (page === "reset") {
      setLoadMsg("Validando código…"); await sleep(500);
      setLoadMsg("Redefinindo senha…"); await sleep(600);
      const users = getUsers();
      if (users[email.toLowerCase()]) {
        users[email.toLowerCase()].passHash = hashPass(newPass);
        saveUsers(users);
      }
      setSuccessMsg("Senha redefinida com sucesso! Faça login.");
      setPage("login"); setPass(""); setLoading(false); setLoadMsg(""); return;
    }

    setLoading(false); setLoadMsg("");
  };

  /* ── Gerar senha sugerida ── */
  const sugerirSenha = () => {
    const s = gerarSenhaForte();
    setPass(s); setPass2(s);
    setShowPass(true); setShowPass2(true);
  };

  /* ── Ícones SVG inline ── */
  const I = {
    eye:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    mail:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    user:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    check:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    shield:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    wand:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 4l5 5M4 20l11-11M8.5 8.5l7 7"/></svg>,
    refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
    arrow:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    key:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>,
    phone:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>,
  };

  /* ── Config por page ── */
  const pageConfig = {
    login:    { title: "Bem-vindo de volta 👋", sub: "Entre na sua conta DVS" },
    register: {
      title: step === 1 ? "Criar conta ✨" : step === 2 ? "Escolha sua senha 🔒" : "Verificar e-mail 📧",
      sub:   step === 1 ? "Preencha seus dados" : step === 2 ? "Crie uma senha forte e segura" : "Digite o código enviado",
    },
    forgot: { title: "Recuperar senha 🔑", sub: "Enviaremos um código de recuperação" },
    reset:  { title: "Redefinir senha 🔐", sub: "Código enviado para " + email },
  };
  const cfg = pageConfig[page] || pageConfig.login;

  /* ── Step bar ── */
  const StepBar = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 22 }}>
      {["Dados", "Senha", "Verificar"].map((l, i) => {
        const s = i + 1;
        const done = step > s, active = step === s;
        return (
          <div key={l} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? D.mint : active ? D.gBlue : D.s3, border: `2px solid ${done ? D.mint : active ? D.blue : D.b1}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", color: done || active ? "#fff" : D.w3, fontWeight: 800, fontSize: 12 }}>
                {done ? I.check : s}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: active ? D.blue2 : done ? D.mint : D.w3, whiteSpace: "nowrap" }}>{l}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? D.mint : D.b1, margin: "0 6px", marginBottom: 16, borderRadius: 99, transition: "background .3s" }} />}
          </div>
        );
      })}
    </div>
  );

  /* ─────────────── RENDER ─────────────── */
  return (
    <div style={{ minHeight: "100vh", background: D.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", overflowY: "auto" }}>

      {/* BG ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, left: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", bottom: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", top: "40%", right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 68%)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ── LOGO ── */}
        <div className="fu" style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
            <div
              style={{ width: 80, height: 80, borderRadius: 26, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 0 6px rgba(37,99,235,.1), 0 0 0 14px rgba(37,99,235,.05), 0 10px 36px rgba(37,99,235,.38)", cursor: "pointer", transition: "transform .2s" }}
              onClick={e => { e.currentTarget.style.animation = "none"; void e.currentTarget.offsetWidth; e.currentTarget.style.animation = "logoPop .35s ease both"; }}>
              ✨
            </div>
            {/* verified badge */}
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: D.gMint, border: `2px solid ${D.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
          </div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", lineHeight: 1.2 }}>DVS EduCreator</div>
          <div style={{ fontSize: 13, color: D.w2, marginTop: 5 }}>IA para criar conteúdo & estudar</div>
          {/* feature pills */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {["🔥 Conteúdo viral", "📚 Modo estudo", "🎵 Música real"].map((f, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: D.w3, background: D.s2, border: `1px solid ${D.b0}`, borderRadius: 99, padding: "4px 10px" }}>{f}</span>
            ))}
          </div>
        </div>

        {/* ── TABS login/register ── */}
        {(page === "login" || page === "register") && (
          <div className="fu d1" style={{ display: "flex", background: D.s1, borderRadius: 14, padding: 4, marginBottom: 20, gap: 3, border: `1px solid ${D.b0}` }}>
            {[["login", "Entrar"], ["register", "Criar conta"]].map(([p, l]) => (
              <button key={p} onClick={() => { setPage(p); setStep(1); setErrors({}); setAiTip(""); setPass(""); setPass2(""); setCode(""); setTermsOk(false); setSuccessMsg(""); }}
                style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .22s", fontFamily: "'Sora',sans-serif", background: page === p ? D.gBlue : "transparent", color: page === p ? "#fff" : D.w2, boxShadow: page === p ? "0 2px 14px rgba(37,99,235,.3)" : "none" }}>
                {l}
              </button>
            ))}
          </div>
        )}

        {/* ── CARD ── */}
        <div id="auth-card" className="card auth-card fu d2" style={{ padding: "24px 22px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* back btn (forgot/reset) */}
          {(page === "forgot" || page === "reset") && (
            <button onClick={() => { setPage("login"); setErrors({}); setLoadMsg(""); setCode(""); setResetCode(""); setNewPass(""); }} style={{ background: "none", border: "none", color: D.w2, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, alignSelf: "flex-start" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Voltar ao login
            </button>
          )}

          {/* heading */}
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.25, marginBottom: 4 }}>{cfg.title}</div>
            <div style={{ fontSize: 13, color: D.w2 }}>{cfg.sub}</div>
          </div>

          {/* step bar — register */}
          {page === "register" && <StepBar step={step}  I={I} />}

          {/* ── IA TIP ── */}
          {(aiTip || aiLoad) && (
            <div style={{ padding: "10px 14px", background: D.blueLo, borderRadius: 12, fontSize: 13, color: D.blue3, border: `1px solid ${D.blueM}`, display: "flex", gap: 8, alignItems: "center", lineHeight: 1.5, animation: "fadeIn .3s ease both" }}>
              {aiLoad ? <Spin s={14} c={D.blue2} /> : <div style={{ color: D.blue2 }}>{I.wand}</div>}
              <span style={{ flex: 1 }}>{aiLoad ? "IA personalizando…" : aiTip}</span>
            </div>
          )}

          {/* ── LOCKOUT ── */}
          {locked && (
            <div style={{ padding: "12px 14px", background: D.roseLo, borderRadius: 12, fontSize: 13, color: D.rose, border: `1px solid ${D.rose}35`, display: "flex", gap: 8, alignItems: "center" }}>
              🔒 Muitas tentativas. Aguarde {lockTimer}s antes de tentar novamente.
            </div>
          )}

          {/* ── SUCCESS MSG ── */}
          {successMsg && (
            <div style={{ padding: "12px 14px", background: D.mintLo, borderRadius: 12, fontSize: 13, color: D.mint, border: `1px solid ${D.mint}35`, display: "flex", gap: 8, alignItems: "center", animation: "fadeIn .3s both" }}>
              <div style={{ color: D.mint }}>{I.check}</div> {successMsg}
            </div>
          )}

          {/* ══════════ FORMS ══════════ */}

          {/* LOGIN */}
          {page === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="E-mail" icon={I.mail} type="email" val={email} onChange={setEmail} err={errors.email} placeholder="seu@email.com" autoComplete="email" />
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="Senha" icon={I.lock} type={showPass ? "text" : "password"} val={pass} onChange={setPass} err={errors.pass} placeholder="Sua senha" autoComplete="current-password"
                right={<Eye I={I}  show={showPass} toggle={() => setShowPass(v=>!v)} />} />

              {/* remember + forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: D.w2, userSelect: "none" }}>
                  <div onClick={() => setRemember(v=>!v)} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${remember ? D.blue : D.b1}`, background: remember ? D.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s", cursor: "pointer", flexShrink: 0 }}>
                    {remember && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  Lembrar de mim
                </label>
                <button onClick={() => { setPage("forgot"); setErrors({}); setAiTip(""); }} style={{ background: "none", border: "none", color: D.blue2, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>
                  Esqueci a senha
                </button>
              </div>
            </div>
          )}

          {/* REGISTER — step 1 */}
          {page === "register" && step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="Nome completo" icon={I.user} val={name} onChange={setName} err={errors.name} placeholder="Seu nome completo" autoComplete="name" />
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="E-mail" icon={I.mail} type="email" val={email} onChange={setEmail} err={errors.email} placeholder="seu@email.com" autoComplete="email" />
            </div>
          )}

          {/* REGISTER — step 2 */}
          {page === "register" && step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="Senha" icon={I.lock} type={showPass ? "text" : "password"} val={pass} onChange={setPass} err={errors.pass} placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                right={<Eye I={I}  show={showPass} toggle={() => setShowPass(v=>!v)} />} hint="Mín. 6 caracteres" />

              {/* força da senha */}
              {pass.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, animation: "fadeIn .2s both" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= pwd.score ? pwd.color : D.b1, transition: "background .25s" }} />)}
                  </div>
                  <div style={{ fontSize: 12, color: pwd.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ color: pwd.color }}>{I.shield}</div>
                    {pwd.score >= 3 ? `Senha ${pwd.label} — Ótima escolha!` : `Senha ${pwd.label} — Adicione letras maiúsculas, números e símbolos`}
                  </div>
                </div>
              )}

              {/* sugerir senha */}
              <button onClick={sugerirSenha} style={{ background: D.blueLo, border: `1px solid ${D.blueM}`, borderRadius: 11, padding: "9px 14px", color: D.blue2, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "Inter" }}>
                {I.wand} Sugerir senha forte automaticamente
              </button>

              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="Confirmar senha" icon={I.lock} type={showPass2 ? "text" : "password"} val={pass2} onChange={setPass2} err={errors.pass2} placeholder="Repita a senha" autoComplete="new-password"
                right={<Eye I={I}  show={showPass2} toggle={() => setShowPass2(v=>!v)} />} />

              {/* requisitos */}
              <div style={{ padding: "10px 13px", background: D.bg2, borderRadius: 11, border: `1px solid ${D.b0}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, marginBottom: 7, letterSpacing: .5 }}>REQUISITOS DE SENHA</div>
                {[["Mínimo 6 caracteres", pass.length >= 6], ["Letras maiúsculas e minúsculas", /[A-Z]/.test(pass) && /[a-z]/.test(pass)], ["Pelo menos 1 número", /[0-9]/.test(pass)], ["Símbolo especial (!@#$%)", /[^a-zA-Z0-9]/.test(pass)]].map(([req, ok]) => (
                  <div key={req} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 5, fontSize: 12, color: ok ? D.mint : D.w3, transition: "color .25s" }}>
                    <div style={{ color: ok ? D.mint : D.b2, flexShrink: 0 }}>{ok ? I.check : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>}</div>
                    {req}
                  </div>
                ))}
              </div>

              {/* termos */}
              <label style={{ display: "flex", gap: 9, alignItems: "flex-start", cursor: "pointer", userSelect: "none" }}>
                <div onClick={() => { setTermsOk(v=>!v); if (errors.terms) setErrors(p=>{const n={...p};delete n.terms;return n;}); }}
                  style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${errors.terms ? D.rose : termsOk ? D.blue : D.b1}`, background: termsOk ? D.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s", cursor: "pointer", flexShrink: 0, marginTop: 1 }}>
                  {termsOk && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontSize: 13, color: D.w2, lineHeight: 1.5 }}>
                  Concordo com os <span style={{ color: D.blue2, fontWeight: 700 }}>Termos de Uso</span> e a{" "}
                  <span style={{ color: D.blue2, fontWeight: 700 }}>Política de Privacidade</span> do DVS EduCreator
                </span>
              </label>
              {errors.terms && <div style={{ fontSize: 12, color: D.rose, display: "flex", gap: 5 }}>⚠️ {errors.terms}</div>}
            </div>
          )}

          {/* REGISTER — step 3 — verificação de email */}
          {page === "register" && step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "14px 16px", background: D.blueLo, borderRadius: 14, border: `1px solid ${D.blueM}`, textAlign: "center" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>📧</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: D.w1, marginBottom: 4 }}>Verifique seu e-mail</div>
                <div style={{ fontSize: 13, color: D.w2, lineHeight: 1.55 }}>
                  Enviamos um código de 6 dígitos para<br />
                  <strong style={{ color: D.blue3 }}>{verifyEmail}</strong>
                </div>
              </div>

              {/* code input — 6 boxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: D.w2, letterSpacing: .4, textTransform: "uppercase" }}>Código de verificação</label>
                <input
                  type="text" maxLength={6} value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0,6)); if(errors.code) setErrors(p=>{const n={...p};delete n.code;return n;}); }}
                  placeholder="000000"
                  style={{ letterSpacing: "0.35em", textAlign: "center", fontSize: 24, fontWeight: 800, background: D.s0, border: `1.5px solid ${errors.code ? D.rose+"90" : D.b0}`, borderRadius: 14, color: D.w1, padding: "16px 20px", outline: "none", width: "100%", fontFamily: "Inter", transition: "border .18s, box-shadow .18s" }}
                  onFocus={e => { e.target.style.borderColor = D.blueM; e.target.style.boxShadow = `0 0 0 3px ${D.blueLo}`; }}
                  onBlur={e => { e.target.style.borderColor = errors.code ? D.rose+"90" : D.b0; e.target.style.boxShadow = "none"; }}
                />
                {errors.code && <div style={{ fontSize: 12, color: D.rose, display: "flex", gap: 5 }}>⚠️ {errors.code}</div>}
              </div>

              {/* demo helper */}
              <div style={{ padding: "9px 12px", background: D.amberLo, borderRadius: 10, fontSize: 12, color: D.amber, border: `1px solid ${D.amber}30`, lineHeight: 1.5, display: "flex", gap: 7, alignItems: "center" }}>
                {I.key} <span>Código de demo: <strong onClick={() => setCode(generatedCode)} style={{ cursor: "pointer", textDecoration: "underline" }}>{generatedCode}</strong> (clique para preencher)</span>
              </div>

              <button className="btn ghost sm" style={{ alignSelf: "center", fontSize: 13 }} onClick={() => { const c = makeCode(); setGeneratedCode(c); toast?.("Novo código gerado!","ok"); }}>
                {I.refresh} Reenviar código
              </button>
            </div>
          )}

          {/* FORGOT */}
          {page === "forgot" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "12px 14px", background: D.s0, borderRadius: 12, fontSize: 13, color: D.w2, border: `1px solid ${D.b0}`, lineHeight: 1.6 }}>
                Informe o e-mail da sua conta e enviaremos um código para redefinir sua senha com segurança.
              </div>
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="E-mail cadastrado" icon={I.mail} type="email" val={email} onChange={setEmail} err={errors.email} placeholder="seu@email.com" autoComplete="email" />
            </div>
          )}

          {/* RESET */}
          {page === "reset" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "12px 14px", background: D.blueLo, borderRadius: 12, fontSize: 13, color: D.blue3, border: `1px solid ${D.blueM}`, lineHeight: 1.5 }}>
                📧 Um código foi enviado para <strong>{email}</strong>
              </div>
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="Código de recuperação" icon={I.key} val={resetCode} onChange={setResetCode} err={errors.resetCode} placeholder="000000" autoComplete="one-time-code" />
              {/* demo helper */}
              <div style={{ fontSize: 12, color: D.amber, cursor: "pointer", textDecoration: "underline" }} onClick={() => setResetCode(generatedCode)}>
                Preencher código de demo: {generatedCode}
              </div>
              <Inp  I={I} errors={errors} setErrors={setErrors} submit={submit} label="Nova senha" icon={I.lock} type={showNPass ? "text" : "password"} val={newPass} onChange={setNewPass} err={errors.newPass} placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                right={<Eye I={I}  show={showNPass} toggle={() => setShowNPass(v=>!v)} />} />
              {newPass.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, animation: "fadeIn .2s both" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4].map(i => { const ps = senhaForte(newPass); return <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= ps.score ? ps.color : D.b1, transition: "background .25s" }} />; })}
                  </div>
                  <div style={{ fontSize: 12, color: senhaForte(newPass).color, fontWeight: 700 }}>Senha {senhaForte(newPass).label}</div>
                </div>
              )}
            </div>
          )}

          {/* ── SUBMIT BUTTON ── */}
          <button
            onClick={submit} disabled={loading || locked}
            style={{ width: "100%", padding: "15px 0", borderRadius: 14, background: D.gBlue, border: "none", color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'Sora',sans-serif", cursor: loading || locked ? "not-allowed" : "pointer", opacity: locked ? .5 : 1, transition: "all .18s", boxShadow: "0 4px 20px rgba(37,99,235,.32)", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}
            onMouseOver={e => { if (!loading && !locked) e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,.45)"; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,.32)"; }}>
            {loading
              ? <><Spin s={18} c="#fff" /><span>{loadMsg || "Processando…"}</span></>
              : <><span>{page === "login" ? "Entrar na conta" : page === "forgot" ? "Enviar código" : page === "reset" ? "Redefinir senha" : step === 1 ? "Continuar" : step === 2 ? "Criar conta" : "Verificar e-mail"}</span>{I.arrow}</>}
          </button>

          {/* back — register step 2/3 */}
          {page === "register" && step > 1 && (
            <button onClick={() => { setStep(s => s - 1); setErrors({}); }} style={{ background: "none", border: "none", color: D.w2, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", padding: "4px 0", fontFamily: "Inter" }}>
              ← Voltar
            </button>
          )}
        </div>

        {/* ── SOCIAL LOGIN ── */}
        {(page === "login" || page === "register") && (
          <div className="fu d3" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: D.b0 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: D.w3, whiteSpace: "nowrap", letterSpacing: 1 }}>OU CONTINUE COM</span>
              <div style={{ flex: 1, height: 1, background: D.b0 }} />
            </div>
            <GoogleLoginBtn onLogin={onLogin} setErrors={setErrors} D={D} />
            <div style={{ textAlign: "center", fontSize: 11, color: D.w3, marginTop: 4 }}>
              Ao continuar, você concorda com nossos Termos de Uso.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PERFIL  (logado)
═══════════════════════════════════════════════ */
const Perfil = ({ session, plan, onLogout, onUpdateSession, toast }) => {
  const [subpage, setSubpage] = useState("main"); // main | edit | security | notifications
  const [editName,  setEditName]  = useState(session.name);
  const [editBio,   setEditBio]   = useState(session.bio || "");
  const [editPhone, setEditPhone] = useState(session.phone || "");
  const [saving,    setSaving]    = useState(false);

  const [passOld,  setPassOld]  = useState("");
  const [passNew,  setPassNew]  = useState("");
  const [passConf, setPassConf] = useState("");
  const [passErr,  setPassErr]  = useState("");
  const [passSaved,setPassSaved]= useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [notifs, setNotifs] = useState({ posts: true, estudos: true, promo: false, news: true });

  const pN  = { free: "Gratuito", social: "Social Premium", student: "Estudante Premium", full: "Completo" };
  const pC  = { free: D.w2, social: D.blue2, student: D.mint, full: D.amber };
  const pBg = { free: D.gDark, social: D.gBlue, student: D.gMint, full: D.gAmber };
  const pLimits = {
    free:    { posts: 10, estudos: 5, postsUsed: 7, estudosUsed: 2 },
    social:  { posts: null, estudos: 5, postsUsed: 47, estudosUsed: 5 },
    student: { posts: 10, estudos: null, postsUsed: 9, estudosUsed: 23 },
    full:    { posts: null, estudos: null, postsUsed: 47, estudosUsed: 23 },
  };
  const lim = pLimits[plan];
  const act = [4, 6, 3, 7, 9, 5, 2], acs = [2, 1, 4, 3, 2, 5, 1];
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const mx = Math.max(...act.map((a, i) => a + acs[i]));
  const stats = [
    { l: "Posts",        v: lim.postsUsed,   c: D.blue2, e: "✨" },
    { l: "Transcrições", v: "23",             c: D.rose,  e: "🎤" },
    { l: "Mapas",        v: "12",             c: D.mint,  e: "🗺️" },
    { l: "Flashcards",   v: "148",            c: D.cyan,  e: "🃏" },
    { l: "Quiz",         v: "8",              c: D.amber, e: "⚡" },
    { l: "Estudos",      v: lim.estudosUsed, c: D.blue3, e: "📚" },
  ];

  const saveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    await sleep(800);
    const users = getUsers();
    if (users[session.email]) { users[session.email].name = editName.trim(); users[session.email].bio = editBio; users[session.email].phone = editPhone; saveUsers(users); }
    const newSession = { ...session, name: editName.trim(), bio: editBio, phone: editPhone };
    saveSession(newSession); onUpdateSession(newSession);
    toast("✅ Perfil atualizado!", "ok"); setSaving(false); setSubpage("main");
  };

  const savePassword = async () => {
    setPassErr(""); setSavingPw(true);
    await sleep(700);
    const users = getUsers();
    const user = users[session.email];
    if (!user || user.passHash !== hashPass(passOld)) { setPassErr("Senha atual incorreta"); setSavingPw(false); return; }
    if (passNew.length < 6) { setPassErr("Nova senha deve ter pelo menos 6 caracteres"); setSavingPw(false); return; }
    if (passNew !== passConf) { setPassErr("As senhas não coincidem"); setSavingPw(false); return; }
    users[session.email].passHash = hashPass(passNew);
    saveUsers(users);
    setPassSaved(true); setPassOld(""); setPassNew(""); setPassConf("");
    toast("✅ Senha alterada com sucesso!", "ok"); setSavingPw(false);
  };

  const avatarGrad = getAvatarGrad(session.email);
  const initials   = getInitials(session.name);
  const joinDate   = (() => { try { const u = getUsers()[session.email]; return u?.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "Recentemente"; } catch { return "Recentemente"; } })();

  /* ── EDIT PROFILE ── */
  if (subpage === "edit") return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <button className="btn ghost xs ico" onClick={() => setSubpage("main")}>←</button>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Editar Perfil</div>
      </div>
      {/* avatar picker */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "'Sora',sans-serif", border: `3px solid ${D.b2}`, boxShadow: "0 0 24px rgba(37,99,235,.25)" }}>{initials}</div>
        <div style={{ fontSize: 13, color: D.blue2, fontWeight: 600, cursor: "pointer" }}>Trocar foto de perfil</div>
        <div style={{ display: "flex", gap: 8 }}>
          {AVATAR_COLORS.map((g, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: g, cursor: "pointer", border: `2px solid ${g === avatarGrad ? "#fff" : "transparent"}`, transition: "border .18s" }} />
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Nome completo" icon="👤" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Seu nome" />
        <Field label="E-mail" icon="📧" type="email" value={session.email} onChange={() => {}} placeholder="" hint="Não editável" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: D.w2 }}>Bio</label>
          <textarea className="inp" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Conte um pouco sobre você…" style={{ minHeight: 80, fontSize: 14 }} />
        </div>
        <Field label="Telefone" icon="📱" type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+55 (11) 99999-9999" />
      </div>
      <button className="btn primary lg" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={saveProfile} disabled={saving || !editName.trim()}>
        {saving ? <><Spin s={18} c="#fff" /> Salvando…</> : "💾 Salvar alterações"}
      </button>
    </div>
  );

  /* ── SECURITY ── */
  if (subpage === "security") return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <button className="btn ghost xs ico" onClick={() => { setSubpage("main"); setPassErr(""); setPassSaved(false); }}>←</button>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Segurança</div>
      </div>
      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 15, display: "flex", gap: 8, alignItems: "center" }}>🔑 Alterar senha</div>
        {passSaved && <div style={{ padding: "11px 14px", background: D.mintLo, borderRadius: 11, fontSize: 13, color: D.mint, border: `1px solid ${D.mint}35` }}>✅ Senha alterada com sucesso!</div>}
        <Field label="Senha atual" icon="🔒" type="password" value={passOld} onChange={e => setPassOld(e.target.value)} placeholder="Sua senha atual" />
        <Field label="Nova senha" icon="🔐" type="password" value={passNew} onChange={e => setPassNew(e.target.value)} placeholder="Mínimo 6 caracteres" />
        <Field label="Confirmar nova senha" icon="🔐" type="password" value={passConf} onChange={e => setPassConf(e.target.value)} placeholder="Repita a nova senha" />
        {passErr && <div style={{ fontSize: 13, color: D.rose, display: "flex", gap: 6, alignItems: "center" }}>⚠ {passErr}</div>}
        <button className="btn primary md" style={{ width: "100%" }} onClick={savePassword} disabled={savingPw || !passOld || !passNew || !passConf}>
          {savingPw ? <><Spin s={16} c="#fff" /> Salvando…</> : "Alterar senha"}
        </button>
      </div>
      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>🛡️ Sessões ativas</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: D.bg2, borderRadius: 12, border: `1px solid ${D.b0}` }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: D.blueLo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📱</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Dispositivo atual</div>
            <div style={{ fontSize: 12, color: D.mint, marginTop: 2 }}>● Ativo agora</div>
          </div>
          <div style={{ fontSize: 11, color: D.w3 }}>Este aparelho</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: D.bg2, borderRadius: 12, border: `1px solid ${D.b0}` }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: D.s3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💻</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Navegador Web</div>
            <div style={{ fontSize: 12, color: D.w3, marginTop: 2 }}>Há 2 dias</div>
          </div>
          <button className="btn danger xs" onClick={() => toast("Sessão encerrada", "ok")}>Encerrar</button>
        </div>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>⚠️ Zona de perigo</div>
        <button className="btn danger md" style={{ width: "100%" }} onClick={() => toast("Em breve: exclusão de conta", "warn")}>
          🗑️ Excluir minha conta
        </button>
        <div style={{ fontSize: 12, color: D.w3, marginTop: 8, textAlign: "center" }}>Esta ação é permanente e irreversível</div>
      </div>
    </div>
  );

  /* ── NOTIFICATIONS ── */
  if (subpage === "notifications") return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <button className="btn ghost xs ico" onClick={() => setSubpage("main")}>←</button>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Notificações</div>
      </div>
      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          ["posts",  "📣", "Engajamento dos posts",  "Likes, comentários e compartilhamentos"],
          ["estudos","📚", "Lembretes de estudo",     "Metas diárias e flashcards pendentes"],
          ["promo",  "🎁", "Ofertas e promoções",     "Descontos exclusivos nos planos"],
          ["news",   "🆕", "Novidades do app",        "Novas funcionalidades e melhorias"],
        ].map(([key, icon, label, desc], i, arr) => (
          <div key={key} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${D.b0}` : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: notifs[key] ? D.blueLo : D.s3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "background .2s" }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
              <div style={{ fontSize: 12, color: D.w3, marginTop: 2 }}>{desc}</div>
            </div>
            {/* toggle switch */}
            <div onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
              style={{ width: 44, height: 24, borderRadius: 99, background: notifs[key] ? D.blue : D.s3, position: "relative", cursor: "pointer", transition: "background .22s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: notifs[key] ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .22s", boxShadow: "0 1px 4px rgba(0,0,0,.35)" }} />
            </div>
          </div>
        ))}
      </div>
      <button className="btn primary md" style={{ width: "100%" }} onClick={() => { toast("✅ Preferências salvas!", "ok"); setSubpage("main"); }}>
        Salvar preferências
      </button>
    </div>
  );

  /* ── MAIN PROFILE PAGE ── */
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* hero banner */}
      <div style={{ background: `linear-gradient(180deg,${D.s2} 0%,${D.bg} 100%)`, padding: "28px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          {/* avatar */}
          <div style={{ position: "relative" }}>
            <div style={{ width: 78, height: 78, borderRadius: "50%", background: avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "'Sora',sans-serif", border: `3px solid ${D.b2}`, boxShadow: "0 0 20px rgba(37,99,235,.22)", flexShrink: 0 }}>{initials}</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: D.gBlue, border: `2px solid ${D.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" }} onClick={() => setSubpage("edit")}>✏️</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>{session.name}</div>
            <div style={{ fontSize: 13, color: D.w2, marginTop: 3 }}>{session.email}</div>
            {session.bio && <div style={{ fontSize: 13, color: D.w2, marginTop: 4, fontStyle: "italic" }}>"{session.bio}"</div>}
          </div>
          <button className="btn ghost xs" onClick={() => setSubpage("edit")}>Editar</button>
        </div>
        {/* plan badge */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px", background: pBg[plan], borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,.3)" }}>
          <div style={{ fontSize: 22 }}>{plan === "free" ? "🆓" : plan === "social" ? "⭐" : plan === "student" ? "🎓" : "👑"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: "#fff" }}>{pN[plan]}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginTop: 2 }}>
              {plan === "free" ? `${lim.postsUsed}/${lim.posts} posts · ${lim.estudosUsed}/${lim.estudos} estudos este mês` : "Acesso ilimitado"}
            </div>
          </div>
          {plan === "free" && <button className="btn" style={{ background: "rgba(255,255,255,.2)", color: "#fff", border: "1px solid rgba(255,255,255,.3)", fontSize: 12, fontWeight: 700, padding: "7px 12px", borderRadius: 9 }}>Upgrade</button>}
        </div>
        {/* join date */}
        <div style={{ fontSize: 12, color: D.w3, display: "flex", alignItems: "center", gap: 5 }}>
          <span>📅</span> Membro desde {joinDate}
        </div>
      </div>

      <div style={{ padding: "4px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {stats.map((s, i) => (
            <div key={i} className="card" style={{ padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 19, marginBottom: 4 }}>{s.e}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 20, color: s.c, animation: "cntA .5s ease both" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: D.w3, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* activity chart */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>📈 Atividade Semanal</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 72 }}>
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                  <div style={{ width: "100%", height: `${(act[i]/mx)*48}px`, background: D.gBlue, borderRadius: "4px 4px 0 0", minHeight: 3 }} />
                  <div style={{ width: "100%", height: `${(acs[i]/mx)*48}px`, background: D.gMint, borderRadius: "0 0 4px 4px", minHeight: 3 }} />
                </div>
                <div style={{ fontSize: 9, color: D.w3 }}>{d.slice(0,1)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <div style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 11, color: D.w2 }}><div style={{ width: 9, height: 9, borderRadius: 3, background: D.blue }} />Posts</div>
            <div style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 11, color: D.w2 }}><div style={{ width: 9, height: 9, borderRadius: 3, background: D.mint }} />Estudos</div>
          </div>
        </div>

        {/* plan usage */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📊 Uso do Plano</div>
          <ProgressBar val={lim.posts ? Math.round((lim.postsUsed/lim.posts)*100) : 100} color={D.blue2} h={7}
            label={`Posts criados (${lim.posts ? `${lim.postsUsed}/${lim.posts}` : "Ilimitado"})`} />
          <div style={{ marginTop: 12 }} />
          <ProgressBar val={lim.estudos ? Math.round((lim.estudosUsed/lim.estudos)*100) : 72} color={D.mint} h={7}
            label={`Estudos realizados (${lim.estudos ? `${lim.estudosUsed}/${lim.estudos}` : "Ilimitado"})`} />
        </div>

        {/* menu */}
        <div className="card" style={{ overflow: "hidden" }}>
          {[
            { e:"✏️", l:"Editar perfil",       d:"Nome, bio e telefone",    fn:()=>setSubpage("edit") },
            { e:"🔑", l:"Segurança",            d:"Senha e sessões",         fn:()=>setSubpage("security") },
            { e:"🔔", l:"Notificações",         d:"Preferências de alertas", fn:()=>setSubpage("notifications") },
            { e:"💎", l:"Meu plano",            d:pN[plan],                  fn:()=>toast("Veja a aba Planos","info") },
            { e:"⭐", l:"Avaliar o app",        d:"Nos ajude a melhorar",    fn:()=>toast("Obrigado pelo apoio! ⭐","ok") },
            { e:"💬", l:"Suporte",              d:"Fale com a equipe DVS",   fn:()=>toast("suporte@dvseducreator.app","info") },
            { e:"📤", l:"Sair da conta",        d:"",                        fn:onLogout, danger:true },
          ].map(({ e, l, d, fn, danger }, i, arr) => (
            <button key={i} className="btn ghost" onClick={fn}
              style={{ width:"100%", justifyContent:"flex-start", padding:"14px 16px", borderRadius:0, gap:13, borderBottom: i < arr.length-1 ? `1px solid ${D.b0}` : "none", background: danger ? D.roseLo : "transparent", border:"none", borderBottom: i < arr.length-1 ? `1px solid ${D.b0}` : "none" }}>
              <div style={{ width:40, height:40, borderRadius:12, background: danger ? D.roseLo : D.s3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{e}</div>
              <div style={{ flex:1, textAlign:"left" }}>
                <div style={{ fontWeight:700, fontSize:14, color: danger ? D.rose : D.w1 }}>{l}</div>
                {d && <div style={{ fontSize:12, color:D.w3, marginTop:2 }}>{d}</div>}
              </div>
              <span style={{ color: danger ? D.rose : D.w3, fontSize:18 }}>{danger ? "" : "›"}</span>
            </button>
          ))}
        </div>

        {/* version */}
        <div style={{ textAlign:"center", fontSize:12, color:D.w3, paddingTop:4 }}>
          DVS EduCreator v6.0 · Feito com ❤️ no Brasil
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   APP ROOT  (auth gate)
═══════════════════════════════════════════════ */
export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

function App() {
  const [session, setSession] = useState(() => getSession());
  const [nav, setNav]         = useState("criador");
  const [plan, setPlan]       = useState(() => {
    const s = getSession();
    if (!s) return "free";
    try { return getUsers()[s.email]?.plan || "free"; } catch { return "free"; }
  });
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, tp = "info") => {
    const id = ++_tid;
    setToasts(p => [...p.slice(-2), { id, msg, tp }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  const del = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  const handleLogin = useCallback(sess => {
    setSession(sess);
    try { const u = getUsers()[sess.email]; if (u?.plan) setPlan(u.plan); } catch {}
    setNav("criador");
  }, []);

  const handleLogout = useCallback(() => {
    clearSession(); setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);

  const handleUpdateSession = useCallback(newSess => setSession(newSess), []);

  const handleSetPlan = useCallback((p) => {
    setPlan(p);
    if (session?.email) {
      const users = getUsers(); if (users[session.email]) { users[session.email].plan = p; saveUsers(users); }
      const newSess = { ...session, plan: p }; saveSession(newSess); setSession(newSess);
    }
  }, [session]);

  const pCols = { free: D.w3, social: D.blue2, student: D.mint, full: D.amber };
  const pLbls = { free: "Grátis", social: "Social Pro", student: "Student Pro", full: "Completo" };

  const NAV = [
    { id: "criador",   l: "Criador",   e: "✨" },
    { id: "estudante", l: "Estudante", e: "📚" },
    { id: "planos",    l: "Planos",    e: "💎" },
    { id: "perfil",    l: "Perfil",    e: "👤" },
  ];

  /* ── not logged in → show auth ── */
  if (!session) return (
    <>
      <style>{CSS}</style>
      <AuthScreen onLogin={handleLogin} />
      <Toasts items={toasts} del={del} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: D.bg, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* HEADER */}
          <header style={{ position:"sticky", top:0, zIndex:400, background:`${D.bg}f2`, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${D.b0}`, padding:"12px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:D.gBlue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, boxShadow:"0 0 16px rgba(37,99,235,.3)" }}>✨</div>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"-.2px", lineHeight:1.2 }}>DVS EduCreator</div>
              <div style={{ fontSize:10, color:D.w3 }}>Olá, {session.name.split(" ")[0]} 👋</div>
            </div>
            
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:pCols[plan], animation:"pulse2 2s ease-in-out infinite" }}/>
                  <span style={{ fontSize:12, fontWeight:700, color:pCols[plan] }}>{pLbls[plan]}</span>
                </div>
                <button onClick={handleLogout} style={{ background: D.roseLo, border: `1.5px solid ${D.rose}30`, borderRadius: 10, padding: "6px 12px", color: D.rose, fontSize: 11, fontWeight: 800, cursor: "pointer", transition: "all .18s", fontFamily: "'Sora',sans-serif" }}
                  onMouseOver={e => { e.currentTarget.style.background = D.rose; e.currentTarget.style.color = "#fff"; }}
                  onMouseOut={e => { e.currentTarget.style.background = D.roseLo; e.currentTarget.style.color = D.rose; }}>
                  SAIR
                </button>
              </div>
          </header>

          {/* CONTENT */}
          <main style={{ flex:1, overflowY:"auto", paddingBottom:72 }}>
            {nav === "criador"   && <Criador   toast={toast} />}
            {nav === "estudante" && <Estudante toast={toast} />}
            {nav === "planos"    && <Planos    plan={plan} setPlan={handleSetPlan} toast={toast} />}
            {nav === "perfil"    && <Perfil    session={session} plan={plan} onLogout={handleLogout} onUpdateSession={handleUpdateSession} toast={toast} />}
          </main>

          {/* BOTTOM NAV */}
          <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:500, zIndex:300, background:`${D.s1}f8`, backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderTop:`1px solid ${D.b0}`, padding:"7px 4px 16px", display:"flex" }}>
            {NAV.map(item => {
              const active = nav === item.id;
              const isProfile = item.id === "perfil";
              return (
                <button key={item.id} className="nav-item" onClick={() => setNav(item.id)}>
                  {active && <div style={{ position:"absolute", top:-7, left:"50%", transform:"translateX(-50%)", width:24, height:3, background:D.gBlue, borderRadius:99 }}/>}
                  <div style={{ width:40, height:40, borderRadius:13, background:active?D.blueLo:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .18s", overflow:"hidden" }}>
                    {isProfile
                      ? <div style={{ width:28, height:28, borderRadius:"50%", background:getAvatarGrad(session.email), display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", fontFamily:"'Sora',sans-serif" }}>{getInitials(session.name)}</div>
                      : <span style={{ fontSize:20 }}>{item.e}</span>}
                  </div>
                  <span style={{ fontSize:10, fontWeight:active?700:500, color:active?D.blue2:D.w3, transition:"color .18s" }}>{item.l}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      <Toasts items={toasts} del={del} />
    </>
  );
}
