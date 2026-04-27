import React, { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./services/supabase";
import { generateVideo } from "./services/ffmpegService";
import html2canvas from "html2canvas";
const SI = ["Analisando imagem", "Melhorando qualidade", "Calibrando cores", "Gerando conteúdo IA", "Calculando viral score"];
const SV = ["Analisando v deo", "Identificando momentos", "Aplicando efeitos", "Gerando conteúdo IA", "Calculando viral score"];
const STEPS3 = {
  resumo: ["Lendo texto", "Extraindo t picos", "Criando resumo", "Organizando pontos"],
  mapa:   ["Processando", "Mapeando conceitos", "Estruturando ramos", "Gerando mapa"],
  slides: ["Analisando", "Dividindo sees", "Criando slides", "Design finalizado"],
  cards:  ["Lendo material", "Criando perguntas", "Elaborando respostas", "Formatando"],
  quiz:   ["Analisando texto", "Criando quest es", "Alternativas", "Finalizando"],
};


const D = {
  // Deep Navy Branding (Matches Logo)
  bg:    "#020B1A",
  bg2:   "#04132B",
  bg3:   "#072146",
  s0:    "#0A2E61",
  s1:    "#0E3C7D",
  s2:    "#134B9A",
  s3:    "#185BB7",
  b0:    "#0F2A52",
  b1:    "#1A3D73",
  b2:    "#255094",
  // Primary (Silver/Cyan accent)
  blue:  "#38BDF8",
  blue2: "#7DD3FC",
  blue3: "#BAE6FD",
  blueLo:"rgba(56,189,248,.12)",
  blueM: "rgba(56,189,248,.28)",
  // Accents
  cyan:  "#22D3EE", cyanLo:"rgba(34,211,238,.1)",
  mint:  "#34D399", mintLo:"rgba(52,211,153,.1)",
  rose:  "#FB7185", roseLo:"rgba(251,113,133,.1)",
  amber: "#FBBF24", amberLo:"rgba(251,191,36,.1)",
  // Text
  w1:    "#F8FAFC",
  w2:    "#CBD5E1",
  w3:    "#64748B",
  // Gradients
  gBlue: "linear-gradient(135deg,#0E3C7D 0%,#185BB7 100%)",
  gCyan: "linear-gradient(135deg,#0284C7 0%,#06B6D4 100%)",
  gMint: "linear-gradient(135deg,#059669 0%,#10B981 100%)",
  gRose: "linear-gradient(135deg,#E11D48 0%,#F43F5E 100%)",
  gAmber:"linear-gradient(135deg,#D97706 0%,#F59E0B 100%)",
  gDark: "linear-gradient(135deg,#04132B 0%,#020B1A 100%)",
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



/* 
   DESIGN SYSTEM  Navy / Black / White (Play Store)
 */


/* 
   GLOBAL CSS
 */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cinzel:wght@700;800&family=Sora:wght@700;800&display=swap');

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

/*  ANIMATIONS  */
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

/*  BUTTONS  */
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

/*  CARDS  */
.card  { background: ${D.s1}; border: 1px solid ${D.b0}; border-radius: 18px; overflow: hidden; }
.cardH { transition: border-color .2s, box-shadow .2s; }
.cardH:hover { border-color: ${D.blueM}; box-shadow: 0 6px 28px rgba(0,0,0,.38); }

/*  INPUTS  */
.inp {
  background: ${D.bg2}; border: 1.5px solid ${D.b0};
  border-radius: 12px; color: ${D.w1}; font-size: 14px;
  padding: 12px 15px; width: 100%; outline: none;
  transition: border .18s, box-shadow .18s;
  resize: none; line-height: 1.65;
}
.inp:focus  { border-color: ${D.blueM}; box-shadow: 0 0 0 3px ${D.blueLo}; }
.inp::placeholder { color: ${D.w3}; }

/*  TAGS  */
.tag   { display:inline-flex; align-items:center; gap:4px; border-radius:99px; padding:3px 9px; font-size:11px; font-weight:700; letter-spacing:.3px; }
.tblue { background:${D.blueLo}; color:${D.blue2}; border:1px solid ${D.blueM}; }
.tgrn  { background:${D.mintLo}; color:${D.mint}; border:1px solid rgba(16,185,129,.28); }
.trose { background:${D.roseLo}; color:${D.rose}; border:1px solid rgba(244,63,94,.28); }
.tamb  { background:${D.amberLo}; color:${D.amber}; border:1px solid rgba(245,158,11,.28); }
.tcyan { background:${D.cyanLo}; color:${D.cyan}; border:1px solid rgba(6,182,212,.28); }

/*  SECTION LABEL  */
.sec-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
  color: ${D.w3}; text-transform: uppercase; margin-bottom: 10px;
}

/*  FULLSCREEN PRES  */
.pres {
  position: fixed; inset: 0; z-index: 9900;
  background: #000;
  display: flex; flex-direction: column;
  animation: presA .28s ease both;
}

/*  NAV ITEM  */
.nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px;
  background: none; border: none; cursor: pointer;
  padding: 5px 0; position: relative;
  -webkit-tap-highlight-color: transparent;
}
`;

/* 
   HELPERS
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));
let _tid = 0;

async function callAI(user, sys = "") {
  try {
    const r = await fetch("/api/ai/v1beta/models/gemini-flash-latest:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys || "Voc    DVSCREATOR AI  assistente especialista em marketing digital e educao. Responda sempre em portugu s brasileiro de forma direta, criativa e precisa." }] },
        contents: [{ role: "user", parts: [{ text: user }] }]
      }),
    });
    if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAI] Error:", r.status, err); return ""; }
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch(e) { console.error("[callAI]", e); return ""; }
}

function pj(raw) {
  if (!raw) return null;
  try {
    const clean = raw.replace(/```json\n?|```\n?/g, "").trim();
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
    }
    return JSON.parse(clean);
  } catch (e) {
    console.error("pj parse error:", e, "\nRAW:", raw);
    return null;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callAIVision(b64, mediaType, prompt, sys) {
  try {
    const r = await fetch("/api/ai/v1beta/models/gemini-flash-latest:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys || "Voc    DVSCREATOR AI  especialista em marketing viral brasileiro. Responda em portugu s." }] },
        contents: [{ role: "user", parts: [
          { inlineData: { mimeType: mediaType, data: b64 } },
          { text: prompt }
        ]}]
      })
    });
    if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAIVision] Error:", r.status, err); return ""; }
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (e) { console.error("[callAIVision] Exception:", e); return ""; }
}

/* 
   PRIMITIVES
 */
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
        <span style={{ fontSize: 16 }}>{t.tp === "err" ? "" : t.tp === "ok" ? "" : t.tp === "warn" ? "" : ""}</span>
        <span style={{ fontSize: 13, flex: 1, lineHeight: 1.4, color: D.w1 }}>{t.msg}</span>
        <button onClick={() => del(t.id)} style={{ background: "none", border: "none", color: D.w3, fontSize: 18, lineHeight: 1, padding: 2 }}> </button>
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
          <span style={{ position: "absolute", fontSize: 22, pointerEvents: "none" }}></span>
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
                  <span style={{ color: (D?.mint || "#10b981"), fontWeight: 800 }}></span>
                ) : i === safeCur ? (
                  <Spin s={11} c={(D?.blue2 || "#3b82f6")} />
                ) : (
                  <span style={{ opacity: .35 }}></span>
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
      <span className="tag tgrn" style={{ fontSize: 11 }}>{score >= 80 ? " Viral!" : score >= 60 ? " Bom" : " Melhorar"}</span>
    </div>
  );
};

/* 
   SLIDE THEMES  8 premium dark themes
 */
const THEMES = [
  { id:"navy",   icon:"", name:"Navy",    bg:"linear-gradient(150deg,#020818 0%,#051230 55%,#010510 100%)", acc:"#3b82f6", acc2:"#1d4ed8", txt:"#f0f7ff", txt2:"rgba(224,240,255,.55)", nb:"rgba(59,130,246,.18)", nbr:"rgba(59,130,246,.4)",  d1:"rgba(29,78,216,.22)", d2:"rgba(59,130,246,.08)" },
  { id:"ocean",  icon:"", name:"Oceano",  bg:"linear-gradient(150deg,#010e1c 0%,#012040 55%,#01090f 100%)", acc:"#06b6d4", acc2:"#0891b2", txt:"#ecfeff", txt2:"rgba(207,250,254,.55)", nb:"rgba(6,182,212,.18)",  nbr:"rgba(6,182,212,.4)",   d1:"rgba(8,145,178,.22)", d2:"rgba(6,182,212,.07)" },
  { id:"cosmos", icon:"", name:"Cosmos",  bg:"linear-gradient(150deg,#07021c 0%,#140840 55%,#05010f 100%)", acc:"#a78bfa", acc2:"#7c3aed", txt:"#faf5ff", txt2:"rgba(245,240,255,.55)", nb:"rgba(167,139,250,.18)",nbr:"rgba(167,139,250,.4)", d1:"rgba(124,58,237,.22)",d2:"rgba(167,139,250,.07)" },
  { id:"forest", icon:"", name:"Floresta",bg:"linear-gradient(150deg,#020e08 0%,#052818 55%,#010a04 100%)", acc:"#10b981", acc2:"#059669", txt:"#ecfdf5", txt2:"rgba(209,250,229,.55)", nb:"rgba(16,185,129,.18)", nbr:"rgba(16,185,129,.4)",  d1:"rgba(5,150,105,.22)", d2:"rgba(16,185,129,.07)" },
  { id:"sunset", icon:"", name:"Sunset",  bg:"linear-gradient(150deg,#140600 0%,#301000 55%,#0e0200 100%)", acc:"#fb923c", acc2:"#c2410c", txt:"#fff7ed", txt2:"rgba(254,237,213,.55)", nb:"rgba(251,146,60,.18)", nbr:"rgba(251,146,60,.4)",  d1:"rgba(194,65,12,.22)", d2:"rgba(251,146,60,.07)" },
  { id:"royal",  icon:"", name:"Royal",   bg:"linear-gradient(150deg,#0a0118 0%,#1a0438 55%,#060010 100%)", acc:"#e879f9", acc2:"#a21caf", txt:"#fdf4ff", txt2:"rgba(250,232,255,.55)", nb:"rgba(232,121,249,.18)",nbr:"rgba(232,121,249,.4)", d1:"rgba(162,28,175,.22)",d2:"rgba(232,121,249,.07)" },
  { id:"gold",   icon:"", name:"Ouro",    bg:"linear-gradient(150deg,#100900 0%,#281800 55%,#080500 100%)", acc:"#fbbf24", acc2:"#b45309", txt:"#fffbeb", txt2:"rgba(254,243,199,.55)", nb:"rgba(251,191,36,.18)", nbr:"rgba(251,191,36,.4)",  d1:"rgba(180,83,9,.22)",  d2:"rgba(251,191,36,.07)" },
  { id:"arctic", icon:"", name:" rtico",  bg:"linear-gradient(150deg,#010c18 0%,#021e38 55%,#010810 100%)", acc:"#67e8f9", acc2:"#0e7490", txt:"#ecfeff", txt2:"rgba(207,250,254,.55)", nb:"rgba(103,232,249,.18)",nbr:"rgba(103,232,249,.4)", d1:"rgba(14,116,144,.22)",d2:"rgba(103,232,249,.07)" },
];

/* 
   SLIDE RENDERER
 */
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
      {sl.nota && <div style={{ padding: fs ? "8px 13px" : "4px 7px", background: "rgba(0,0,0,.32)", borderRadius: fs ? 9 : 5, fontSize: fs ? 12 : 6.5, color: th.txt2, borderLeft: `${fs ? 3 : 1.5}px solid ${th.acc}`, lineHeight: 1.4, flexShrink: 0 }}> {sl.nota}</div>}
    </div>

    {/* progress bar */}
    <div style={{ height: fs ? 4 : 2, background: "rgba(255,255,255,.07)", flexShrink: 0 }}>
      <div style={{ height: "100%", width: `${(sl.num / total) * 100}%`, background: th.acc, transition: "width .4s ease" }} />
    </div>
  </div>
);

/* 
   SLIDES COMPONENT
 */
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
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16 }}> {data.titulo}</div>
          <button className="btn primary sm" onClick={() => setPres(true)}> Apresentar</button>
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

        {/* slide  16:9 via padding-bottom trick */}
        <div style={{ width: "100%", position: "relative", paddingBottom: "56.25%", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 38px rgba(0,0,0,.65)" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Slide key={key} sl={sl} th={th} total={slides.length} dir={dir} fs={false} />
          </div>
        </div>

        {/* nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn ghost sm" style={{ flex: 1 }} onClick={() => go(cur - 1, "left")} disabled={cur === 0}> Anterior</button>
          <span style={{ fontSize: 13, color: D.w2, fontWeight: 700, whiteSpace: "nowrap" }}>{cur + 1} / {slides.length}</span>
          <button className="btn primary sm" style={{ flex: 1 }} onClick={() => go(cur + 1)} disabled={cur === slides.length - 1}>Pr ximo </button>
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
            <button className="btn dark" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", padding: 0, fontSize: 22 }} onClick={() => go(cur - 1, "left")} disabled={cur === 0}></button>
            <button className="btn dark" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", padding: 0, fontSize: 22 }} onClick={() => go(cur + 1)} disabled={cur === slides.length - 1}></button>
            <div style={{ position: "absolute", top: 14, right: 16, fontSize: 11, color: "rgba(255,255,255,.28)", letterSpacing: 1 }}>ESC para sair</div>
          </div>

          {/* toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", gap: 8, background: "rgba(0,0,0,.85)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,.07)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="btn dark sm" onClick={() => go(cur - 1, "left")} disabled={cur === 0}> Ant.</button>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>{cur + 1}/{slides.length}</span>
              <button className="btn dark sm" onClick={() => go(cur + 1)} disabled={cur === slides.length - 1}>Pr x. </button>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {slides.map((_, i) => <button key={i} onClick={() => go(i, i > cur ? "right" : "left")} style={{ width: i === cur ? 20 : 7, height: 7, borderRadius: 99, border: "none", background: i === cur ? th.acc : "rgba(255,255,255,.2)", cursor: "pointer", transition: "all .2s" }} />)}
            </div>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <button className="btn dark xs" onClick={() => setThIdx(t => (t + 1) % THEMES.length)}>{th.icon} Tema</button>
              <button className="btn danger sm" onClick={() => setPres(false)} style={{ fontWeight: 800 }}> Sair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* 
   MIND MAP
 */
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
                {(s.label || "").length > 11 ? s.label.slice(0, 11) + "" : s.label}
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
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17 }}> {data.topico}</div>
          <button className="btn mint sm" onClick={() => setPres(true)}> Apresentar</button>
        </div>
        {data.descricao && <div style={{ fontSize: 13, color: D.w2 }}>{data.descricao}</div>}
        <div style={{ width: "100%", overflowX: "auto", background: `linear-gradient(135deg,${D.bg2},${D.bg3})`, borderRadius: 18, padding: "12px 8px", border: `1px solid ${D.b0}` }}>
          <MapSVG />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {branches.map((b, i) => (
            <div key={i} className="card" style={{ padding: "10px 13px", display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: b.col, flexShrink: 0, marginTop: 4 }} />
              <div><div style={{ fontWeight: 700, fontSize: 12, color: b.col }}>{b.titulo}</div><div style={{ fontSize: 11, color: D.w3, marginTop: 3, lineHeight: 1.4 }}>{b.subs.map(s => s.label).join("   ")}</div></div>
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
            <div style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,.45)" }}> {data.topico}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)" }}>ESC para sair</span>
              <button className="btn danger sm" onClick={() => setPres(false)} style={{ fontWeight: 800 }}> Sair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* 
   MODO CRIADOR
 */

/* 
   PREVIEW MOCKUPS (IG / TIKTOK)
 */
const PreviewMockup = ({ platform, type, fileURL, isImg, fCSS, caption, music, onClose, onFinish }) => {
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
        <div style={{ display: "flex", gap: 5 }}> </div>
      </div>

      {/* header */}
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: isVertical ? "none" : "1px solid #262626" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 24 }}></button>
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
            
            {music && (
              <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, color: "#fff", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(45deg, #f09433, #bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}></div>
                <div style={{ display: "flex", flexDirection: "column", maxWidth: 180 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.titulo || music.nome}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.artista}</span>
                </div>
              </div>
            )}
            

            
            {/* overlays */}
            <div style={{ position: "absolute", right: 12, bottom: 120, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}></span><div style={{ fontSize: 11, fontWeight: 700 }}>1.2M</div></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}></span><div style={{ fontSize: 11, fontWeight: 700 }}>14k</div></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}></span></div>
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
                 <span>{music ? `${music.nome}  ${music.artista}` : " udio original de DVS"}</span>
              </div>
            </div>
          </div>
        ) : (
          /* INSTAGRAM FEED */
          <div style={{ background: "#000", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c)" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>DVS_EduCreator</span>
                {music && <span style={{ fontSize: 11, fontWeight: 500, color: "#aaa" }}>{music.nome}</span>}
              </div>
            </div>
            <div style={{ width: "100%", background: "#111", minHeight: 300, display: "flex", alignItems: "center" }}>
               {isImg ? <img src={fileURL} style={{ width: "100%", filter: fCSS }} /> : <video src={fileURL} autoPlay muted loop style={{ width: "100%" }} />}
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 16, fontSize: 24, marginBottom: 10 }}>
                <span></span> <span></span> <span></span> <span style={{ marginLeft: "auto" }}></span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>12,458 curtidas</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800, marginRight: 6 }}>DVS_EduCreator</span>
                {caption}
              </div>
              <div style={{ fontSize: 12, color: "#8e8e8e", marginTop: 8 }}>Ver todos os 342 coment rios</div>
              <div style={{ fontSize: 10, color: "#8e8e8e", marginTop: 4, textTransform: "uppercase" }}>H  2 minutos</div>
            </div>
          </div>
        )}
      </div>

      {/* footer bar */}
      <div style={{ height: 60, display: "flex", justifyContent: "space-around", alignItems: "center", background: "#000", borderTop: "1px solid #262626" }}>
        <span style={{ fontSize: 24 }}></span>
        <span style={{ fontSize: 24 }}></span>
        <span style={{ fontSize: 24 }}></span>
        <span style={{ fontSize: 24 }}></span>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff" }} />
      </div>
    </div>
  );
};


const Criador = ({ toast, session, plan }) => {
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
  const [vLoad, setVLoad] = useState(false); const SI = ["Lendo imagem...", "Extraindo cores...", "Analisando vibe...", "Buscando tend ncias...", "Gerando conteúdo..."]; const SV = ["Processando v deo...", "Mapeando frames...", "Captando clima...", "Buscando  udio viral...", "Gerando estrat gia..."]; const [rLoad, setRLoad] = useState(false);
  const fileId = "dvs-file-input";

  // MOCKUP STATE
  const [mock, setMock] = useState(null); // { platform, type }
  const [songsChanged, setSongsChanged] = useState(0);
  const [postId, setPostId] = useState(null);

  const ESTILOS = [
    { id: "viral", l: " Viral" }, { id: "pro", l: " Profissional" },
    { id: "aesthetic", l: " Aesthetic" }, { id: "vendas", l: " Vendas" },
    { id: "humor", l: " Humor" }, { id: "edu", l: " Educativo" },
  ];
  const FPRESET = {
    "Original":  { brightness: 100, contrast: 100, saturate: 100, sepia: 0,  hue: 0   },
    "Clarendon": { brightness: 112, contrast: 128, saturate: 135, sepia: 0,  hue: 0   },
    "Gingham":   { brightness: 105, contrast: 88,  saturate: 82,  sepia: 8,  hue: -5  },
    "Moon":      { brightness: 113, contrast: 118, saturate: 0,   sepia: 10, hue: 0   },
    "Lark":      { brightness: 118, contrast: 82,  saturate: 92,  sepia: 0,  hue: 0   },
    "Reyes":     { brightness: 112, contrast: 86,  saturate: 72,  sepia: 28, hue: 0   },
    "Juno":      { brightness: 108, contrast: 118, saturate: 155, sepia: 0,  hue: 5   },
    "Slumber":   { brightness: 104, contrast: 93,  saturate: 125, sepia: 12, hue: 0   },
    "Crema":     { brightness: 110, contrast: 88,  saturate: 78,  sepia: 22, hue: 6   },
    "Ludwig":    { brightness: 106, contrast: 110, saturate: 92,  sepia: 9,  hue: 0   },
    "Aden":      { brightness: 112, contrast: 86,  saturate: 72,  sepia: 18, hue: -12 },
    "Valencia":  { brightness: 110, contrast: 108, saturate: 90,  sepia: 24, hue: 5   },
    "Hudson":    { brightness: 118, contrast: 92,  saturate: 98,  sepia: 14, hue: -12 },
    "Nashville": { brightness: 112, contrast: 106, saturate: 118, sepia: 14, hue: 6   },
    "HDR":       { brightness: 106, contrast: 132, saturate: 122, sepia: 0,  hue: 0   },
    "V\u00edvido":    { brightness: 104, contrast: 108, saturate: 152, sepia: 0,  hue: 0   },
  };

  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(` "${f.name.slice(0, 24)}" carregado!`, "ok");
  }, [toast]);

  const openPicker = () => {
    const el = document.getElementById(fileId);
    if (el) { el.value = ""; el.click(); }
  };

  const startCreate = async () => {
    if (!file) { toast("Envie uma foto ou v deo primeiro! ", "warn"); return; }

    // Database usage check
    let currentUsage = 0;
        const limits = { free: 3, social: 5, student: 10, full: Infinity };
    const limit = limits[plan] || 3;

    if (plan !== "full") {
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase.from('profiles').select('posts_used, last_usage_reset').eq('id', session.id).single();
      
      if (profile) {
        if (profile.last_usage_reset !== today) {
           await supabase.from('profiles').update({ posts_used: 0, last_usage_reset: today }).eq('id', session.id);
           currentUsage = 0;
        } else {
           currentUsage = profile.posts_used;
        }
            }

      if (currentUsage >= limit) {
        toast(`Limite di rio de ${limit} posts atingido. Fa a upgrade para o plano superior! `, "error");
        return;
      }
    }

    setStage("proc"); setPct(0); setCur(0);
    const steps = isImg ? SI : SV;
    for (let i = 0; i < steps.length; i++) { setCur(i); await sleep(480 + Math.random() * 380); setPct(Math.round(((i + 1) / steps.length) * 88)); }

    const jsonTpl = `{
  "analiseVisual": "descrição detalhada do que aparece: pessoas, objetos, cenário, cores, clima, expressões",
  "vibeImagem": "sentimento transmitido (alegria, paz, agitação, romance, adrenalina, elegância, etc.)",
  "hook": "frase de impacto máx 10 palavras com emoji BASEADA EXATAMENTE no que está na foto/vídeo",
  "caption": "legenda de 2-3 frases que descreve e valoriza ESPECIFICAMENTE o conteúdo visual, em português brasileiro natural e estilo ${estilo}",
  "hashtags": ["10 hashtags específicos: mix de nicho e trending relacionados ao visual"],
  "filtro": "filtro que melhor combina com as cores da foto (Clarendon, Gingham, Moon, Lark, Juno, Reyes, Valencia, Hudson, Nashville, HDR ou Vívido)",
  "musicas": [
    {"tipo":"Combina perfeitamente","nome":"Música REAL famosa cuja vibe combina com o clima visual da foto","artista":"Artista real","vibe":"por que combina com este visual específico"},
    {"tipo":"Em Alta no TikTok","nome":"Música viral atual que combina com o sentimento desta imagem","artista":"Artista real","vibe":"relação com o visual e clima da foto"},
    {"tipo":"Alternativa","nome":"Terceira opção real adequada para o tema visual","artista":"Artista real","vibe":"por que esta também serve para este conteúdo"}
  ],
  "score": 85,
  "scoreMotivo": "análise do potencial viral baseada nas características visuais DESTA foto específica",
  "melhorias": ["dica concreta de melhoria baseada no que aparece nesta foto", "sugestão específica de edição ou composição"],
  "plataforma": "rede social mais adequada para este conteúdo visual",
  "horario": "melhor horário para este tipo de conteúdo",
  "cta": "chamada para ação específica para o tema desta foto"
}`;

    let raw = "";
    if (file && isImg) {
      try {
        const b64 = await fileToBase64(file);
        const mt = file.type?.startsWith("image") ? file.type : "image/jpeg";
        raw = await callAIVision(b64, mt,
          `Você é um especialista em marketing viral brasileiro. ANALISE ESTA IMAGEM COM ATENÇÃO.

PASSO 1 — ANALISE A IMAGEM:
- O que aparece na foto? (pessoas, objetos, local, natureza, comida, produto, etc.)
- Qual é a paleta de cores dominante? (cores quentes, frias, neutras, vibrantes)
- Qual é o clima/sentimento? (alegre, romântico, agitado, sereno, elegante, divertido, etc.)
- Qual é o contexto? (ao ar livre, interior, praia, cidade, academia, restaurante, etc.)

PASSO 2 — BASEADO APENAS NO QUE VIU NA IMAGEM:
- Escreva a legenda descrevendo ESTE conteúdo específico
- Escolha músicas que COMBINAM com a vibe visual desta foto (não genéricas)
- Sugira hashtags específicas para o que aparece na imagem

Tema adicional do usuário: "${topic || 'nenhum'}"
Estilo desejado: "${estilo}"

IMPORTANTE: A legenda e músicas devem ser 100% baseadas no que você VÊ nesta imagem.
Se for uma praia → música de verão/reggae. Se for academia → música de treino/rap. Se for comida → música animada/brasileira. Etc.

Retorne APENAS este JSON sem markdown:
${jsonTpl}`,
          "IMPORTANTE: Analise a imagem profundamente. Retorne APENAS JSON válido. Zero texto fora do JSON."
        );
      } catch (e) { console.error("Vision fallback:", e); }
    }
    if (!raw) {
      raw = await callAI(
        `Você é especialista em marketing viral brasileiro. Crie conteúdo de alto impacto para Instagram/TikTok.

Tipo de mídia: ${isImg ? "foto" : "vídeo"}
Tema/contexto do criador: "${topic || "conteúdo geral"}"
Estilo desejado: ${estilo}

INSTRUÇÕES PARA AS MÚSICAS:
- Escolha músicas REAIS e CONHECIDAS no Brasil (não invente)
- As músicas devem combinar com o TEMA e ESTILO do conteúdo
- Ex: tema fitness → rap/funk agitado. Tema viagem → música animada. Tema romântico → música suave.
- Prefira músicas que estão em alta no TikTok/Reels Brasil em 2024-2025

INSTRUÇÕES PARA A LEGENDA:
- Escreva como um criador de conteúdo brasileiro autêntico
- Primeira linha: hook impactante com emoji
- Corpo: descreva o conteúdo de forma cativante
- Final: hashtags específicas para o nicho

Retorne APENAS este JSON sem markdown:
${jsonTpl}`,
        "APENAS JSON válido. Zero markdown."
      );
    }
    setPct(100); await sleep(200);
    const ALL_MUSIC = [
      { tipo: "Viral", nome: "Mtg Quero Te Encontrar", artista: "DJ Luan Gomes", vibe: "Animada" },
      { tipo: "Em Alta", nome: "Diz A  Qual   o Plano", artista: "Mc IG", vibe: "Urbana" },
      { tipo: "Recomendada", nome: "Casca de Bala", artista: "Thullio Milion rio", vibe: "Sertanejo" },
      { tipo: "Viral", nome: "Perna Bamba", artista: "Parangol ", vibe: "Dan a" },
      { tipo: "Em Alta", nome: "Macetando", artista: "Ivete Sangalo", vibe: "Festa" },
      { tipo: "Recomendada", nome: "Let's Go 4", artista: "Mc IG", vibe: "Trap" },
      { tipo: "Viral", nome: "Voando pro Par ", artista: "Joelma", vibe: "Cl ssico" },
      { tipo: "Em Alta", nome: "Lapada Dela", artista: "Menos   Mais", vibe: "Pagode" },
      { tipo: "Recomendada", nome: "Chico", artista: "Lu sa Sonza", vibe: "Rom ntica" },
      { tipo: "Viral", nome: "Toca o Trompete", artista: "Felipe Amorim", vibe: "Eletr nica" }
    ];
    // Randomize
    const fallbackMusicas = ALL_MUSIC.sort(() => 0.5 - Math.random()).slice(0, 3);
    const p = pj(raw) || { hook: " Uau!", caption: "Confira esse conteúdo incr vel que preparamos para você!", hashtags: ["viral","brasil"], filtro: "Clarendon", musicas: fallbackMusicas, score: 80, scoreMotivo: "Ok", melhorias: [], plataforma: "Insta", horario: "19h", cta: "Comenta!" };
    if (!p.musicas || !Array.isArray(p.musicas) || p.musicas.length === 0) p.musicas = fallbackMusicas;

    setCaption(`${p.hook}\n\n${p.caption}\n\n${p.hashtags.map(h => "#" + h).join(" ")}`);
    setResult(p);
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
    
    // Save to Supabase
    const { data: postData } = await supabase.from('posts').insert([{ user_id: session.id, content: p }]).select();
    if (postData?.[0]) setPostId(postData[0].id);
    if (plan !== "full") {
      await supabase.from('profiles').update({ posts_used: currentUsage + 1 }).eq('id', session.id);
    }
  };

  const applyFilt = name => {
    const key = Object.keys(FPRESET).find(k => k.toLowerCase() === (name || "").toLowerCase()) || "Original";
    setFiltName(key); setFilters(FPRESET[key] || FPRESET["Original"]);
  };
  
  const [pPct, setPPct] = useState(0);

  
  
    const compartilharRede = async (rede) => {
    if (postId) {
      try { await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId); } catch(e) {}
    }

    toast("Preparando conteúdo...", "info");
    const text = caption;
    try { await navigator.clipboard.writeText(text); } catch(e) {}

    let blob = null;
    let dataUrl = null;
    if (isImg) {
      try {
        const el = document.getElementById("preview-to-export");
        if (el) {
          const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
          dataUrl = canvas.toDataURL("image/png");
          blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        }
      } catch(e) {}
    }

    let fileToShare = blob ? new File([blob], "dvs-post.png", { type: "image/png" }) : null;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Se houver música selecionada, gerar vídeo
    const activeMusic = selMusic || result?.musicas?.[0];
    if (blob && activeMusic && activeMusic.previewUrl) {
      toast("Gerando vídeo com música... (Isso pode demorar alguns segundos)", "info");
      try {
        const videoBlob = await generateVideo(blob, activeMusic.previewUrl, (prog) => {
          // Progress could be handled here if we want to update state, but for now a toast is enough
        });
        fileToShare = new File([videoBlob], "dvs-video.mp4", { type: "video/mp4" });
        toast("Vídeo gerado!", "ok");
      } catch (err) {
        console.error("Video gen failed", err);
        toast("Falha ao gerar vídeo com música. Compartilhando imagem...", "err");
      }
    }

    let shareAttempted = false;
    let sharedSuccessfully = false;

    if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      shareAttempted = true;
      try {
        toast("Selecione o " + rede + " no menu que vai abrir!", "ok");
        await navigator.share({ files: [fileToShare], title: "DVSCREATOR", text });
        sharedSuccessfully = true;
      } catch(err) {
        // Usuário cancelou ou o navegador bloqueou
        console.warn("Share cancelled or failed", err);
        return; // Aborta o processo, não tenta abrir a rede social forçadamente
      }
    }

    if (!shareAttempted) {
      // Fallback para computadores ou navegadores que não suportam Web Share de arquivos
      if (fileToShare) {
        const url = URL.createObjectURL(fileToShare);
        const link = document.createElement("a");
        link.download = fileToShare.name;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast("Arquivo salvo! Cole a legenda no " + rede + ".", "ok");
      }

      setTimeout(() => {
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        const safeDeepLink = (schema, fallback) => {
          if (!isMobileDevice) {
            window.open(fallback, "_blank");
            return;
          }
          const start = Date.now();
          setTimeout(() => {
            if (Date.now() - start < 1500) {
              window.open(fallback, "_blank");
            }
          }, 1000);
          
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            window.location.href = schema;
          } else {
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = schema;
            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 1500);
          }
        };

        if (rede === 'instagram') safeDeepLink("instagram://camera", "https://www.instagram.com/");
        else if (rede === 'tiktok') safeDeepLink("snssdk1233://", "https://www.tiktok.com/upload");
        else if (rede === 'facebook') window.open("https://www.facebook.com/", "_blank");
        else if (rede === 'telegram') window.open("https://t.me/share/url?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent(text), "_blank");
      }, 1500);
    }
  };

  const compartilharDireto = async () => {
    if (postId) {
      try { await supabase.from('posts').update({ content: { ...result, caption, filters } }).eq('id', postId); } catch(e) {}
    }
    if (!isImg) {
      // Fallback para v deo (n o tem como processar filtro no browser f cil)
      if (navigator.share) {
        try {
          await navigator.share({ title: 'DVSCREATOR', text: caption, url: fileURL });
          return;
        } catch(e) {}
      }
      toast("Compartilhamento nativo n o disponível. Use os bot es abaixo.");
      return;
    }

    toast(" Preparando m dia editada...");
    try {
      const el = document.getElementById('preview-to-export');
      if (!el) return;
      const canvas = await html2canvas(el, { useCORS: true, scale: (plan === "social" || plan === "full") ? 3 : 1, backgroundColor: D.bg2 });
      
      canvas.toBlob(async (blob) => {
        const fileToShare = new File([blob], 'dvs-viral.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          try {
            await navigator.share({
              files: [fileToShare],
              title: 'DVSCREATOR',
              text: caption
            });
            toast(" Enviado com sucesso!");
          } catch (err) {
            if (err.name !== 'AbortError') toast("Erro ao compartilhar: " + err.message);
          }
        } else {
          // Fallback: Download
          const link = document.createElement('a');
          link.download = 'dvs-viral.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          toast(" Seu navegador n o suporta envio direto. Imagem salva!");
        }
      }, 'image/png');
    } catch (e) {
      toast("Erro ao gerar arte: " + e.message);
    }
  };
  const fCSS = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) sepia(${filters.sepia || 0}%) hue-rotate(${filters.hue || 0}deg)`;

  const copiar = () => { navigator.clipboard.writeText(caption); toast("Copiado!"); };

  const viral = async () => {
    setVLoad(true);
    try {
      const prompt = `Melhore esta legenda para torn -la viral no Instagram/TikTok. Use ganchos (hooks) poderosos, emojis estrat gicos e hashtags de alta performance.\n\nLegenda original: ${caption}`;
      const res = await callAI(prompt);
      if (res) setCaption(res.replace(/^"|"$/g, ''));
      toast(" Legenda turbinada com sucesso!");
    } catch (e) { toast("Erro ao turbinar."); }
    setVLoad(false);
  };

  if (stage === "proc") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(5, 7, 9, 0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
           <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 30 }}>
               <img src="/logo.png" style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="Logo" />
           </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{(isImg ? SI : SV)[cur] || "Analisando..."}</div>
          <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }

  if (stage === "result" && result) {
    const REDES = [
      { id: "instagram", label: "Instagram",  grad: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fd1d1d", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
      { id: "tiktok",    label: "TikTok",      grad: "linear-gradient(135deg,#010101,#69C9D0)",        color: "#69C9D0", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.46-.71-.49-1.32-1.12-1.78-1.87V15.5c-.01 1.1-.31 2.22-.89 3.17-.6 1-1.49 1.84-2.52 2.4-1.04.57-2.22.86-3.41.87-1.19-.01-2.37-.3-3.41-.88-1.03-.57-1.92-1.41-2.52-2.4-.58-.95-.88-2.07-.89-3.17.01-1.1.31-2.22.89-3.17.6-1 1.49-1.84 2.52-2.4 1.04-.57 2.22-.86 3.41-.87 1.19.01 2.37.3 3.41.88.52.29.98.66 1.37 1.1V.02z"/></svg> },
      { id: "facebook",  label: "Facebook",    grad: "linear-gradient(135deg,#1877F2,#42a5f5)",        color: "#1877F2", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
      { id: "telegram",  label: "Telegram",    grad: "linear-gradient(135deg,#0088cc,#2CA5E0)",        color: "#2CA5E0", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0C5.353 0 0 5.353 0 11.944c0 6.59 5.353 11.944 11.944 11.944 6.59 0 11.944-5.353 11.944-11.944C23.888 5.353 18.535 0 11.944 0zm5.666 8.314c-.167 1.76-1.042 7.037-1.481 9.404-.186.993-.556 1.325-.91 1.358-.778.073-1.368-.511-2.122-1.006-1.18-.778-1.844-1.261-2.986-2.012-1.32-.871-.464-1.35.288-2.13.197-.204 3.614-3.313 3.681-3.593.008-.035.016-.167-.061-.235s-.19-.044-.273-.026c-.116.026-1.966 1.25-5.545 3.666-.523.36-.997.536-1.423.527-.47-.01-1.374-.265-2.046-.484-.824-.27-1.481-.413-1.423-.872.03-.238.358-.481.986-.73 3.864-1.68 6.438-2.783 7.725-3.308 3.67-1.493 4.433-1.752 4.93-1.762.109-.002.352.025.508.152s.207.311.228.435c.022.125.026.362.013.473z"/></svg> },
    ];
    return (
      <>
        {mock && (
          <PreviewMockup
            platform={mock.platform}
            type={mock.type}
            fileURL={fileURL}
            isImg={isImg}
            fCSS={fCSS}
            caption={caption}
            music={selMusic || result?.musicas?.[0]}
            onClose={() => setMock(null)}
            onFinish={() => { toast("Publicado com sucesso!"); setMock(null); }}
          />
        )}
        <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Revisão Final</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn sm" onClick={async () => {
                  if (postId) {
                    await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId);
                    toast("Salvo!", "ok");
                  }
                }} style={{ background: D.gMint, color: "#fff", border: "none", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}>Salvar</button>
                <button className="btn sm" onClick={() => {
                  setCaption(result.hook + "\n\n" + result.caption + "\n\n" + result.hashtags.map(function(h) { return "#" + h; }).join(" "));
                  setFilters(FPRESET.Original);
                  setFiltName("Original");
                  setSelMusic(null);
                  toast("Edições removidas!", "info");
                }} style={{ background: D.s3, color: D.w2, border: "1.5px solid " + D.b1, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}>Resetar</button>
              </div>
            </div>
            <button className="btn ghost xs" onClick={() => {
              setStage("home"); setResult(null); setFile(null); setFileURL(null);
              setTopic(""); setFiltName(null); setFilters(FPRESET.Original);
              setSongsChanged(0); setPostId(null); setSelMusic(null);
            }}>+ Novo</button>
          </div>

          {/* Preview */}
          <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div id="preview-to-export" style={{ width: "100%", borderRadius: 18, overflow: "hidden", position: "relative", background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {fileURL ? (
                <div style={{ width: "100%", position: "relative" }}>
                  {isImg ? (
                    <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                  ) : (
                    <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "6px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6 }}>
                        <img src="/logo.png" style={{ width: 14, height: 14, objectFit: "contain" }} alt="" />
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>DVSCREATOR</div>
                      </div>
                      <ScoreRing score={result?.score} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(selMusic || result?.musicas?.[0]) && (function() {
                        const m = selMusic || result.musicas[0];
                        const mName = m.trackName || m.nome || "";
                        const mArtist = m.artistName || m.artista || "";
                        return (
                          <div style={{ alignSelf: "flex-start", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎵</div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{mName}</span>
                              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{mArtist}</span>
                            </div>
                          </div>
                        );
                      })()}
                      <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "12px 16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", maxWidth: "85%" }}>
                        <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.4, fontWeight: 500, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {caption.split("\n")[0]}...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : <div style={{ color: D.w3 }}>Sem prévia</div>}
            </div>
          </div>

          {/* Filtros */}
          <div className="card" style={{ padding: 15 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Filtros <span style={{ color: D.blue2 }}>{filtName || "Original"}</span></div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none", marginBottom: 14 }}>
              {Object.keys(FPRESET).map(function(name) {
                const f = FPRESET[name];
                const css = "brightness(" + f.brightness + "%) contrast(" + f.contrast + "%) saturate(" + f.saturate + "%) sepia(" + (f.sepia||0) + "%) hue-rotate(" + (f.hue||0) + "deg)";
                const active = filtName === name;
                return (
                  <div key={name} onClick={() => applyFilt(name)} style={{ flexShrink: 0, cursor: "pointer", textAlign: "center", width: 66 }}>
                    <div style={{ width: 66, height: 66, borderRadius: 12, overflow: "hidden", border: "2.5px solid " + (active ? D.blue2 : D.b0), transition: "border .15s", marginBottom: 4, background: D.bg2 }}>
                      {fileURL && isImg ? <img src={fileURL} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: css }} /> : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1d4ed8,#06b6d4)", filter: css }} />}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? D.blue2 : D.w3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                  </div>
                );
              })}
            </div>
            {[["brightness","Brilho",50,160],["contrast","Contraste",50,160],["saturate","Saturação",0,200]].map(function(item) {
              const k = item[0], lb = item[1], mn = item[2], mx = item[3];
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 68, fontSize: 11, color: D.w2 }}>{lb}</div>
                  <input type="range" min={mn} max={mx} value={filters?.[k] || 100} onChange={function(e) { setFilters(function(p) { return Object.assign({}, p, { [k]: +e.target.value }); }); }} style={{ flex: 1, accentColor: D.blue2 }} />
                  <div style={{ width: 32, fontSize: 11, color: D.w3, textAlign: "right" }}>{filters?.[k] || 100}%</div>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="card" style={{ padding: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Legenda Otimizada</div>
              <button className="btn outline xs" onClick={copiar}>Copiar</button>
            </div>
            <textarea className="inp" value={caption} onChange={function(e) { setCaption(e.target.value); }} style={{ minHeight: 100, fontSize: 13 }} />
          </div>

          {/* SmartSound */}
          <SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} songsChanged={songsChanged} setSongsChanged={setSongsChanged} onSelect={setSelMusic} />

          {/* Turbinar */}
          <button className="btn rose lg" style={{ width: "100%" }} onClick={viral} disabled={vLoad}>
            {vLoad ? <Spin s={18} /> : "TURBINAR PARA VIRALIZAR"}
          </button>

          {/* Compartilhar */}
          <div style={{ background: D.s0, borderRadius: 20, padding: 20, border: "1px solid " + D.b1 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: D.blue2, textAlign: "center", marginBottom: 16, letterSpacing: 2 }}>COMPARTILHAR NAS REDES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {REDES.map(function(net) {
                return (
                  <button key={net.id}
                    onClick={function() { compartilharRede(net.id); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", background: net.grad, color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px " + net.color + "40", transition: "transform .15s" }}
                  >
                    <span style={{ fontSize: 18 }}>{net.icon}</span>
                    <span>{net.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <button className="btn ghost xs" onClick={function() { setMock({ platform: "insta", type: "reels" }); }} style={{ fontSize: 10 }}>👁️ Preview</button>
              <button className="btn ghost xs" onClick={function() { navigator.clipboard.writeText(caption); toast("Copiado!", "ok"); }} style={{ fontSize: 10 }}>📋 Copiar</button>
              <button className="btn ghost xs" onClick={compartilharDireto} style={{ fontSize: 10 }}>📤 Nativo</button>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 10, color: D.w3, marginTop: 4 }}>
            DVS — crie, edite e compartilhe seu conteúdo viral.
          </div>
        </div>
      </>
    );
  }

  // HOME
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

      <input
        id={fileId}
        type="file"
        accept="image/*,video/*"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        onChange={handleFileChange}
      />

      <div className="fu">
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 5 }}>Modo Criador </div>
        <div style={{ fontSize: 14, color: D.w2, lineHeight: 1.6 }}>Envie uma foto ou vídeo  a IA analisa e cria sua postagem viral </div>
      </div>

      <label htmlFor={fileId} className="fu d1" style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        padding: "32px 20px", borderRadius: 20, cursor: "pointer",
        border: `2px dashed ${D.b1}`,
        background: `linear-gradient(135deg,${D.s0},${D.bg3})`,
        transition: "border-color .18s, background .18s",
        WebkitTapHighlightColor: "transparent",
      }}>
                <div style={{ width: 68, height: 68, borderRadius: 18, overflow: 'hidden', border: `1px solid ${D.blueM}`, display: "flex", alignItems: "center", justifyContent: "center", animation: "float2 3.5s ease-in-out infinite", background: D.bg3 }}>
          <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 5 }}>Envie sua foto ou vídeo</div>
          <div style={{ fontSize: 13, color: D.w2 }}>Foto ou vídeo da galeria</div>
          <div style={{ fontSize: 12, color: D.w3, marginTop: 4 }}>JPG • PNG • GIF • MP4 • MOV</div>
        </div>
        <span className="tag tblue" style={{ fontSize: 12 }}> IA analisa o conteúdo visual automaticamente</span>
      </label>

      {/* preview */}
      {fileURL && (
        <div className="card fu" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center", borderColor: D.blueM }}>
          <div style={{ width: 60, height: 60, borderRadius: 13, overflow: "hidden", border: `2px solid ${D.blueM}`, flexShrink: 0 }}>
            {isImg ? <img src={fileURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <video src={fileURL} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file?.name}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <span className={`tag ${isImg ? "tcyan" : "trose"}`}>{isImg ? " Imagem" : " V deo"}</span>
              <span className="tag tgrn"> Pronto</span>
            </div>
          </div>
          <button className="btn ghost xs" onClick={() => { setFile(null); setFileURL(null); }}></button>
        </div>
      )}



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

      <button className="btn primary lg fu d4" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={startCreate} disabled={!file}>
         Criar Conte do com IA
      </button>

      <div className="card fu d5" style={{ padding: "12px 15px", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}></span>
        <span style={{ fontSize: 13, color: D.w2 }}>
          {plan === "free" ? "Plano Gratuito   3 posts/dia" : 
           plan === "social" ? "Social Premium   5 posts/dia" :
           plan === "student" ? "Estudante Premium   10 posts/dia" :
           "Plano Completo   Ilimitado"}   <span style={{ color: D.amber, fontWeight: 700, cursor: "pointer" }} onClick={() => toast("Acesse a aba Planos!", "info")}>{plan === "full" ? "Gerenciar" : "Upgrade"} </span>
        </span>
      </div>
    </div>
  );
};

const Planos = ({ plan, setPlan, toast }) => {
  const [ann, setAnn] = useState(false);
    const PL = [
    { id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["3 posts por dia", "3 trocas de música", "Marca d'água DVS", "IA básica", "Transcrição simples"], miss: ["Mapas Mentais", "Slides IA", "Export HD", "Sem marca d'água"] },
    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: " MAIS POPULAR", link: "https://buy.stripe.com/test_dRm14m1KC9iLaHr6VF5sA04", feats: ["5 posts por dia", "5 estudos por dia", "Sem marca d'água", "SmartSound AI (músicas)", "Exportação HD", "Score Viral Avançado", "Legendas Otimizadas"], miss: ["Slides IA", "Mapas Mentais", "Quiz IA"] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: " MELHOR CUSTO", link: "https://buy.stripe.com/test_6oUdR874W52veXHeo75sA03", feats: ["10 posts por dia", "10 estudos por dia", "Tudo do Social Premium", "Mapas Mentais IA", "Slides Profissionais", "Flashcards & Quiz", "Transcrição Avançada"], miss: ["Uso Ilimitado"] },
    { id: "full", name: "Plano Completo", price: 20, col: D.amber, grad: D.gAmber, badge: " TUDO INCLUSO", link: "https://buy.stripe.com/test_5kQ6oG4WO9iLbLv93N5sA01", feats: ["Tudo Ilimitado", "IA Prioritária", "Sem marcas d'água", "Exportação 4K", "Suporte VIP 24/7", "Novas funções antecipadas"], miss: [] },
  ];
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="fu">
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 4 }}>Planos & Preços</div>
        <div style={{ fontSize: 14, color: D.w2 }}>Escolha o plano ideal para você</div>
      </div>
      <div className="card fu d1" style={{ padding: 5, display: "flex", gap: 3, justifyContent: "center" }}>
        <button style={{ flex: 1, padding: "10px 4px", borderRadius: 11, border: "none", fontWeight: 700, fontSize: 13, background: D.blue, color: "#fff", fontFamily: "Inter" }}>Mensal</button>
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
              {p.feats.map((f, i) => <div key={i} style={{ display: "flex", gap: 9, fontSize: 13, marginBottom: 8, alignItems: "center", color: D.w1 }}><span style={{ color: D.mint, fontSize: 14 }}></span>{f}</div>)}
              {p.miss.map((f, i) => <div key={i} style={{ display: "flex", gap: 9, fontSize: 13, marginBottom: 8, color: D.w3, alignItems: "center" }}><span style={{ fontSize: 14 }}></span>{f}</div>)}
              <button onClick={() => { 
                if (p.id === "free" || active) {
                  setPlan(p.id); 
                  if (!active) toast(` Plano "${p.name}" ativado!`, "ok"); 
                } else if (p.link) {
                  window.open(p.link, "_blank");
                }
              }} style={{ width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${active ? p.col : p.col + "40"}`, background: active ? p.grad : "transparent", color: active ? "#fff" : p.col, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Sora',sans-serif", transition: "all .18s" }}>
                {active ? " Plano Atual" : p.id === "free" ? "Usar Grátis" : "Assinar Agora"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SmartSoundPlayer = ({ musicas = [], toast, plan, songsChanged, setSongsChanged, onSelect }) => {
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

  //  Inicializa audio 
  useEffect(() => {
    const a = new Audio();
    a.volume = volume;
    a.crossOrigin = "anonymous";
    a.onended = () => { setPlaying(false); setProgress(0); setElapsed(0); playNext(); };
    a.onloadedmetadata = () => setDuration(a.duration || 30);
    a.onerror = () => { toast("Pr via indisponível. Tente outra música.", "warn"); setPlaying(false); };
    audioRef.current = a;
    return () => { a.pause(); clearInterval(progTimer.current); };
  }, []);

  //  Volume 
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  //  Toca faixa 
  const playTrack = (t) => {
    if (plan === "free" && songsChanged >= 3 && t !== track) {
      toast("Limite de 3 trocas atingido no plano Gratuito!", "warn");
      return;
    }
    if (t !== track) setSongsChanged(prev => prev + 1);
    if (plan === "student_old") { // Allowed for free now with limits
      toast("O SmartSound AI   um recurso do Social Premium e Completo! ?", "warn");
      return;
    }
    if (!t?.previewUrl) { toast("Pr via n o disponível para esta faixa.", "warn"); return; }
    const a = audioRef.current;
    if (!a) return;
    a.pause(); clearInterval(progTimer.current);
    a.src = t.previewUrl;
    a.load();
    a.play().catch(() => toast("Clique novamente para tocar.", "info"));
    setTrack(t); setPlaying(true); setProgress(0); setElapsed(0);
    setHistory(h => [t, ...h.filter(x => x.trackId !== t.trackId)].slice(0, 20));
    if (onSelect) onSelect(t);
    progTimer.current = setInterval(() => {
      if (!a.paused) {
        setElapsed(Math.floor(a.currentTime));
        setProgress((a.currentTime / (a.duration || 30)) * 100);
      }
    }, 500);
    toast(` ${t.trackName}  ${t.artistName}`, "ok");
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
  const addQueue = (t) => { setQueue(q => [...q, t]); toast(` "${t.trackName}" adicionada   fila`, "ok"); };

  const stop = () => {
    const a = audioRef.current;
    if (a) { a.pause(); a.src = ""; }
    clearInterval(progTimer.current);
    setPlaying(false); setProgress(0); setElapsed(0); setTrack(null);
  };

  //  Busca iTunes API (real, CORS ok) 
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

  //  IA sugere  busca iTunes 
  const playFromAI = async (m) => {
    setAiLoading(m.tipo);
    // IA melhora o termo de busca para m xima precisão
    const raw = await callAI(
      `A música sugerida   "${m.nome}" de "${m.artista}" (estilo: ${m.vibe}).
Retorne o MELHOR termo de busca em ingl s ou portugu s para encontrar esta música ou música similar no iTunes.
APENAS o termo de busca, sem aspas, sem explicaes. M ximo 5 palavras.`,
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
        else toast("Pr via n o encontrada. Busque manualmente.", "warn");
      }
    } catch { toast("Erro ao buscar música.", "err"); }
    setAiLoading(null);
  };

  //  G neros r pidos 
  const GENEROS = [
    { l: " Funk BR",    q: "funk brasileiro" },
    { l: " Lo-fi",      q: "lofi hip hop" },
    { l: " Sertanejo",  q: "sertanejo universitario" },
    { l: " Trap",       q: "trap brasil" },
    { l: " R&B",        q: "R&B soul" },
    { l: " Rock",       q: "rock alternativo" },
    { l: " Eletr nico", q: "electronic dance music" },
    { l: " Jazz",       q: "jazz bossa nova brasil" },
    { l: " Pop BR",     q: "pop brasileiro" },
    { l: " Rap BR",     q: "rap brasileiro" },
    { l: " Pagode",     q: "pagode samba" },
    { l: " Funk US",    q: "funk old school" },
  ];

  const artworkUrl = (t) => t?.artworkUrl100?.replace("100x100", "300x300") || null;

  //  RENDER 
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/*  NOW PLAYING  */}
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
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}></div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: (D?.w1 || "#f8faff") }}>{track.trackName}</div>
                <div style={{ fontSize: 12, color: (D?.w2 || "#94a3b8"), marginTop: 2 }}>{track.artistName}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <a href={track.trackViewUrl} target="_blank" rel="noreferrer" style={{ color: (D?.w3 || "#3d4f6e"), fontSize: 14, textDecoration: "none", padding: 4 }}></a>
                <button onClick={stop} style={{ background: "none", border: "none", color: (D?.w3 || "#3d4f6e"), cursor: "pointer", padding: 4, fontSize: 18 }}></button>
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
                style={{ background: "none", border: "none", color: history.length > 1 ? (D?.w2 || "#94a3b8") : (D?.w3 || "#3d4f6e"), cursor: "pointer", fontSize: 20 }}></button>
              <button onClick={togglePlay}
                style={{ width: 42, height: 42, borderRadius: "50%", background: (D?.gRose || "#f43f5e"), border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", boxShadow: "0 4px 14px rgba(244,63,94,.4)" }}>
                {playing ? "" : ""}
              </button>
              <button onClick={playNext} disabled={!queue.length}
                style={{ background: "none", border: "none", color: queue.length ? (D?.w2 || "#94a3b8") : (D?.w3 || "#3d4f6e"), cursor: "pointer", fontSize: 20 }}></button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
                <input type="range" min={0} max={1} step={.05} value={volume} onChange={e => setVolume(+e.target.value)} style={{ flex: 1, accentColor: (D?.rose || "#f43f5e"), height: 3 }} />
              </div>
            </div>
          </div>
        ) : (
          <div key="idle-state" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: (D?.roseLo || "rgba(244,63,94,0.1)"), border: `1px solid ${D?.roseLo || "rgba(244,63,94,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: (D?.w1 || "#f8faff") }}>SmartSound AI</div>
              <div style={{ fontSize: 12, color: (D?.w2 || "#94a3b8"), marginTop: 3 }}>músicas reais   Pr via de 30s</div>
            </div>
          </div>
        )}
      </div>

      {/*  TABS  */}
      <div style={{ display: "flex", borderBottom: `1px solid ${D.b0}` }}>
        {[["sugestoes"," IA"], ["busca"," Buscar"], ["generos"," G neros"], ["historico"," Hist rico"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", borderBottom: `2px solid ${tab===id?D.rose:"transparent"}`, color: tab===id?D.rose:D.w3, fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all .15s", fontFamily: "Inter" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 180 }}>

        {/*  TAB: SUGEST ES IA  */}
        {tab === "sugestoes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>SUGERIDAS PELA IA</div>
              {plan === "free" && <span style={{ fontSize: 10, fontWeight: 800, color: D.rose }}>{songsChanged}/3 trocas</span>}
            </div>
            {musicas?.length ? musicas.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 12, background: D.bg2, border: `1.5px solid ${D.b0}`, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = D.blueM}
                onMouseOut={e => e.currentTarget.style.borderColor = D.b0}
                onClick={() => playFromAI(m)}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: i===0?D.gRose:i===1?D.gBlue:D.gMint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {i===0?"":i===1?"":""}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{m.nome}</div>
                  <div style={{ fontSize: 11, color: D.w2 }}>{m.artista}   {m.vibe}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span className="tag trose" style={{ fontSize: 10 }}>{m.tipo}</span>
                  {aiLoading === m.tipo
                    ? <Spin s={14} c={D.rose} />
                    : <span style={{ fontSize: 11, color: D.blue2, fontWeight: 700 }}> Tocar</span>}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "24px 0", color: D.w3, fontSize: 13 }}>
                Crie um conteúdo para receber sugest es da IA 
              </div>
            )}
          </div>
        )}

        {/*  TAB: BUSCA  */}
        {tab === "busca" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {plan === "free" && <div style={{ fontSize: 10, fontWeight: 800, color: D.rose, marginBottom: 6, textAlign: "right" }}>{songsChanged}/3 trocas de música utilizadas</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <input className="inp" value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key==="Enter" && searchItunes(search)}
                placeholder="Artista, música, álbum ex: Anitta, Drake, Taylor"
                style={{ flex: 1, padding: "11px 14px", fontSize: 14 }} />
              <button className="btn primary sm" onClick={() => searchItunes(search)} disabled={searching || !search.trim()}>
                {searching ? <Spin s={14} c="#fff" /> : ICONS.search}
              </button>
            </div>
            {/* country filter */}
            <div style={{ display: "flex", gap: 6 }}>
              {[["br","? BR"], ["us","? US"], ["pt","? PT"], ["mx","? MX"]].map(([c, l]) => (
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
                      : <div style={{ width: 40, height: 40, borderRadius: 8, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}></div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.trackName}</div>
                      <div style={{ fontSize: 11, color: D.w2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.artistName}   {r.collectionName}</div>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: D.w3 }}>{fmt(r.trackTimeMillis)}</span>
                      <button onClick={e => { e.stopPropagation(); addQueue(r); }} title="Adicionar   fila"
                        style={{ background: D.accLo||D.blueLo, border: `1px solid ${D.blueM}`, borderRadius: 6, padding: "3px 7px", fontSize: 11, color: D.blue2, cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!searching && results.length === 0 && search && (
              <div style={{ textAlign: "center", padding: "20px 0", color: D.w3, fontSize: 13 }}>Pressione  para buscar</div>
            )}
          </div>
        )}

        {/*  TAB: G NEROS  */}
        {tab === "generos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>EXPLORE POR G NERO  TOQUE E OU A</div>
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

        {/*  TAB: HIST RICO  */}
        {tab === "historico" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>músicaS TOCADAS ({history.length})</div>
            {history.length === 0 && <div style={{ textAlign: "center", padding: "24px 0", color: D.w3, fontSize: 13 }}>Nenhuma música tocada ainda</div>}
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 10, background: D.bg2, border: `1px solid ${D.b0}`, cursor: "pointer" }}
                onClick={() => playTrack(h)}>
                {h.artworkUrl60 && <img src={h.artworkUrl60} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.trackName}</div>
                  <div style={{ fontSize: 11, color: D.w2 }}>{h.artistName}</div>
                </div>
                <span style={{ fontSize: 11, color: D.w3 }}></span>
              </div>
            ))}
            {history.length > 0 && (
              <button className="btn ghost xs" style={{ alignSelf: "center", marginTop: 4 }} onClick={() => setHistory([])}> Limpar hist rico</button>
            )}
          </div>
        )}
      </div>

      {/* rodap  */}
      <div style={{ padding: "8px 14px 10px", borderTop: `1px solid ${D.b0}`, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, color: D.w3 }}> Powered by iTunes   Pr vias de 30s gratuitas   Ilimitado</span>
        {track?.trackViewUrl && (
          <a href={track.trackViewUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "auto", fontSize: 11, color: D.blue2, fontWeight: 700, textDecoration: "none" }}>Apple Music </a>
        )}
      </div>
    </div>
  );
};

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

/*  fmt: ms  m:ss  */
const fmt = (ms) => {
  if (!ms || isNaN(ms)) return "0:00";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/*  Field: reutiliz vel  */
const Field = ({ label, icon, type = "text", value, onChange, placeholder, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: D.w2 }}>{icon} {label}</label>
    <input
      className="inp"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ fontSize: 14 }}
    />
    {hint && <div style={{ fontSize: 11, color: D.w3 }}>{hint}</div>}
  </div>
);

/* 
   AUTH HELPERS  (localStorage persistence)
 */
const DB_KEY = "dvs_users_v1";
const SESSION_KEY = "dvs_session_v1";

const getUsers  = () => { try { return JSON.parse(localStorage.getItem(DB_KEY) || "{}"); } catch { return {}; } };
const saveUsers = u  => localStorage.setItem(DB_KEY, JSON.stringify(u));
const getSession= () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } };
const saveSession=(s) => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
const clearSession=() => localStorage.removeItem(SESSION_KEY);

function hashPass(p) {
  let h = 0;
  for (let i = 0; i < p.length; i++) { h = Math.imul(31, h) + p.charCodeAt(i) | 0; }
  return h.toString(36);
}

/* Rate limiter local  proteo brute-force */
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

/* For a da senha */
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

/*    */
const ICONS = {
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

/*  Input component  */
const AuthInput = ({ label, icon, right, type, val, onChange, err, placeholder, autoComplete, hint, onSubmit, errors, setErrors }) => {
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
          onKeyDown={e => e.key === "Enter" && onSubmit && onSubmit()}
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

/*  Eye button  */
const AuthEye = ({ show, toggle }) => (
  <button type="button" onClick={toggle} style={{ background: "none", border: "none", color: show ? D.blue2 : D.w3, cursor: "pointer", padding: 4, display: "flex", transition: "color .18s" }}>
    {show ? ICONS.eyeOff : ICONS.eye}
  </button>
);

/*  Social btn  */
const AuthSocialBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, padding: "12px 8px", borderRadius: 13, border: `1.5px solid ${D.b1}`, background: D.s0, color: D.w1, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .18s", fontFamily: "Inter" }}
    onMouseOver={e => { e.currentTarget.style.borderColor = D.b2; e.currentTarget.style.background = D.s2; }}
    onMouseOut={e => { e.currentTarget.style.borderColor = D.b1; e.currentTarget.style.background = D.s0; }}>
    {icon}{label}
  </button>
);

/*  Step bar  */
const AuthStepBar = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 22 }}>
    {["Dados", "Senha", "Verificar"].map((l, i) => {
      const s = i + 1;
      const done = step > s, active = step === s;
      return (
        <div key={l} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? D.mint : active ? D.gBlue : D.s3, border: `2px solid ${done ? D.mint : active ? D.blue : D.b1}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", color: done || active ? "#fff" : D.w3, fontWeight: 800, fontSize: 12 }}>
              {done ? ICONS.check : s}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: active ? D.blue2 : done ? D.mint : D.w3, whiteSpace: "nowrap" }}>{l}</span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? D.mint : D.b1, margin: "0 6px", marginBottom: 16, borderRadius: 99, transition: "background .3s" }} />}
        </div>
      );
    })}
  </div>
);

const AuthScreen = ({ onLogin }) => {
  /*  state  */
  const [page, setPage] = useState("login"); // login | register | forgot | reset | verify
  const [step, setStep] = useState(1);       // register steps 1-3

  // form fields
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [pass,       setPass]       = useState("");
  const [pass2,      setPass2]      = useState("");
  const [code,       setCode]       = useState("");      // verificao email
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

  /*  lockout timer  */
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

  /*  IA tip  email  */
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
    }, 400); // Reduzido de 1400ms para 400ms
    return () => clearTimeout(t);
  }, [email, page]);

  /*  IA tip  nome  */
  useEffect(() => {
    if (!name.trim() || name.trim().length < 3 || page !== "register") return;
    const t = setTimeout(async () => {
      setAiLoad(true);
      const raw = await callAI(
        `Novo usuário chamado "${name.trim().split(" ")[0]}". Crie mensagem motivacional e calorosa de boas-vindas para o DVSCREATOR (app de conteúdo com IA). 1 emoji, 1 frase.`,
        "Apenas 1 frase motivacional personalizada."
      );
      if (raw?.trim()) setAiTip(raw.trim());
      setAiLoad(false);
    }, 500); // Reduzido de 1600ms para 500ms
    return () => clearTimeout(t);
  }, [name, page]);

  /*  gera código de verificao  */
  const makeCode = () => {
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(c);
    return c;
  };

  /*  validate  */
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
        if (pass !== pass2) e.pass2 = "As senhas n o coincidem";
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

  /*  submit  */
  const submit = async () => {
    if (!validate() || loading || locked) return;
    setLoading(true);

    /*  LOGIN  */
    if (page === "login") {
      setLoadMsg("Autenticando... ");
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password: pass,
        });

        if (error) {
          setErrors({ pass: "E-mail ou senha incorretos." });
          setLoading(false); setLoadMsg(""); return;
        }

        const sessionData = { 
          id: data.user.id, 
          email: data.user.email, 
          name: data.user.user_metadata?.full_name || data.user.email 
        };
        saveSession(sessionData);
        onLogin(sessionData);
      } catch (e) {
        setErrors({ pass: "Erro ao conectar ao servidor." });
        setLoading(false); setLoadMsg("");
      }
      return;
    }

    /*  REGISTER  */
    if (page === "register") {
      if (step === 1) {
        setStep(2); setLoading(false); return;
      }
      if (step === 2) {
        const c = makeCode();
        setVerifyEmail(email);
        setStep(3); setLoading(false); return;
      }
      if (step === 3) {
        setLoadMsg("Criando conta... ");
        try {
          const { data, error } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: pass,
            options: {
              data: { full_name: name.trim() }
            }
          });

          if (error) {
            setErrors({ code: error.message });
            setLoading(false); setLoadMsg(""); return;
          }

          if (data.user) {
            const sess = { 
                id: data.user.id, 
                email: data.user.email, 
                name: name.trim() 
            };
            saveSession(sess);
            onLogin(sess);
          } else {
            setSuccessMsg("Verifique seu e-mail para confirmar a conta.");
            setLoading(false);
          }
        } catch (e) {
          setErrors({ code: "Erro ao criar conta." });
          setLoading(false); setLoadMsg("");
        }
        return;
      }
    }

    /*  FORGOT  */
    if (page === "forgot") {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase());
        if (error) {
          setErrors({ email: error.message });
        } else {
          setSuccessMsg("E-mail de recuperação enviado!");
        }
      } catch (e) {
        setErrors({ email: "Erro ao enviar e-mail." });
      }
      setLoading(false); return;
    }

    /*  RESET  */
    if (page === "reset") {
       try {
         const { error } = await supabase.auth.updateUser({ password: newPass });
         if (error) {
           setErrors({ newPass: error.message });
         } else {
           setSuccessMsg("Senha redefinida!");
           setPage("login");
         }
       } catch (e) {
         setErrors({ newPass: "Erro ao redefinir senha." });
       }
       setLoading(false); return;
    }

    setLoading(false); setLoadMsg("");
  };

  /*  Gerar senha sugerida  */
  const sugerirSenha = () => {
    const s = gerarSenhaForte();
    setPass(s); setPass2(s);
    setShowPass(true); setShowPass2(true);
  };

  /*  Config por page  */
  const pageConfig = {
    login:    { title: "Bem-vindo de volta 👋", sub: "Entre na sua conta DVS" },
    register: {
      title: step === 1 ? "Criar conta " : step === 2 ? "Escolha sua senha " : "Verificar e-mail ",
      sub:   step === 1 ? "Preencha seus dados" : step === 2 ? "Crie uma senha forte e segura" : "Digite o código enviado",
    },
    forgot: { title: "Recuperar senha ", sub: "Enviaremos um código de recuperao" },
    reset:  { title: "Redefinir senha ", sub: "C digo enviado para " + email },
  };
  const cfg = pageConfig[page] || pageConfig.login;


  /*  RENDER  */
  return (
    <div style={{ minHeight: "100vh", background: D.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", overflowY: "auto" }}>

      {/* BG ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, left: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", bottom: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", top: "40%", right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 68%)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>

        {/*  LOGO  */}
        <div className="fu" style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
            <div style={{ width: 84, height: 84, borderRadius: 24, overflow: 'hidden', boxShadow: '0px 8px 24px rgba(0,0,0,0.5)', border: `2px solid ${D.b1}` }}>
              <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="DVS Logo" />
            </div>
            {/* verified badge */}
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: D.gMint, border: `2px solid ${D.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}></div>
          </div>
          
          {/* feature pills */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {["🔥 Conteúdo viral", "📚 Modo estudo", " música real"].map((f, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: D.w3, background: D.s2, border: `1px solid ${D.b0}`, borderRadius: 99, padding: "4px 10px" }}>{f}</span>
            ))}
          </div>
        </div>

        {/*  TABS login/register  */}
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

        {/*  CARD  */}
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

          {/* step bar  register */}
          {page === "register" && <AuthStepBar step={step} />}

          {/*  IA TIP  */}
          {(aiTip || aiLoad) && (
            <div style={{ padding: "10px 14px", background: D.blueLo, borderRadius: 12, fontSize: 13, color: D.blue3, border: `1px solid ${D.blueM}`, display: "flex", gap: 8, alignItems: "center", lineHeight: 1.5, animation: "fadeIn .3s ease both" }}>
              {aiLoad ? <Spin s={14} c={D.blue2} /> : <div style={{ color: D.blue2 }}>{ICONS.wand}</div>}
              <span style={{ flex: 1 }}>{aiLoad ? "IA personalizando" : aiTip}</span>
            </div>
          )}

          {/*  LOCKOUT  */}
          {locked && (
            <div style={{ padding: "12px 14px", background: D.roseLo, borderRadius: 12, fontSize: 13, color: D.rose, border: `1px solid ${D.rose}35`, display: "flex", gap: 8, alignItems: "center" }}>
               Muitas tentativas. Aguarde {lockTimer}s antes de tentar novamente.
            </div>
          )}

          {/*  SUCCESS MSG  */}
          {successMsg && (
            <div style={{ padding: "12px 14px", background: D.mintLo, borderRadius: 12, fontSize: 13, color: D.mint, border: `1px solid ${D.mint}35`, display: "flex", gap: 8, alignItems: "center", animation: "fadeIn .3s both" }}>
              <div style={{ color: D.mint }}>{ICONS.check}</div> {successMsg}
            </div>
          )}

          {/*  FORMS  */}

          {/* LOGIN */}
          {page === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <AuthInput label="E-mail" icon={ICONS.mail} type="email" val={email} onChange={setEmail} err={errors.email} placeholder="seu@email.com" autoComplete="email" onSubmit={submit} errors={errors} setErrors={setErrors} />
              <AuthInput label="Sua senha" icon={ICONS.lock} type={showPass ? "text" : "password"} val={pass} onChange={setPass} err={errors.pass} placeholder="••••••••" autoComplete="current-password" onSubmit={submit} errors={errors} setErrors={setErrors}
                right={<AuthEye show={showPass} toggle={() => setShowPass(v=>!v)} />}
                hint={<span onClick={() => setPage("forgot")} style={{ cursor: "pointer", color: D.blue2, fontWeight: 700 }}>Esqueceu?</span>} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}>
                <div onClick={() => setRemember(!remember)} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${remember ? D.blue : D.b1}`, background: remember ? D.gBlue : D.s0, cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  {remember && ICONS.check}
                </div>
                <span onClick={() => setRemember(!remember)} style={{ fontSize: 13, color: D.w2, cursor: "pointer", userSelect: "none" }}>Lembrar de mim</span>
              </div>
            </div>
          )}

          {/* REGISTER */}
          {page === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {step === 1 && (
                <>
                  <AuthInput label="Nome completo" icon={ICONS.user} val={name} onChange={setName} err={errors.name} placeholder="Como quer ser chamado?" autoComplete="name" onSubmit={submit} errors={errors} setErrors={setErrors} />
                  <AuthInput label="E-mail profissional" icon={ICONS.mail} type="email" val={email} onChange={setEmail} err={errors.email} placeholder="seu@email.com" autoComplete="email" onSubmit={submit} errors={errors} setErrors={setErrors} />
                </>
              )}
              {step === 2 && (
                <>
                  <AuthInput label="Senha segura" icon={ICONS.lock} type={showPass ? "text" : "password"} val={pass} onChange={setPass} err={errors.pass} placeholder="Mínimo 6 caracteres" autoComplete="new-password" onSubmit={submit} errors={errors} setErrors={setErrors}
                    right={<AuthEye show={showPass} toggle={() => setShowPass(v=>!v)} />}
                    hint={<span onClick={sugerirSenha} style={{ cursor: "pointer", color: D.blue2, fontWeight: 700 }}>Sugerir </span>} />
                  <AuthInput label="Confirmar senha" icon={ICONS.lock} type={showPass2 ? "text" : "password"} val={pass2} onChange={setPass2} err={errors.pass2} placeholder="Repita a senha" autoComplete="new-password" onSubmit={submit} errors={errors} setErrors={setErrors}
                    right={<AuthEye show={showPass2} toggle={() => setShowPass2(v=>!v)} />} />
                  
                  {pass.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, animation: "fadeIn .2s both" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4].map(i => { const ps = senhaForte(pass); return <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= ps.score ? ps.color : D.b1, transition: "background .25s" }} />; })}
                      </div>
                      <div style={{ fontSize: 12, color: senhaForte(pass).color, fontWeight: 700 }}>Senha {senhaForte(pass).label}</div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 4 }}>
                    <div onClick={() => { setTermsOk(!termsOk); if (errors.terms) setErrors(p=>{const n={...p};delete n.terms;return n;}); }}
                      style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${errors.terms ? D.rose : termsOk ? D.blue : D.b1}`, background: termsOk ? D.gBlue : D.s0, cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      {termsOk && ICONS.check}
                    </div>
                    <div style={{ fontSize: 12, color: D.w2, lineHeight: 1.5 }}>
                      Li e aceito os <span style={{ color: D.blue2, fontWeight: 700 }}>Termos de Uso</span> e a <span style={{ color: D.blue2, fontWeight: 700 }}>Política de Privacidade</span> do DVSCREATOR
                    </div>
                  </div>
                  {errors.terms && <div style={{ fontSize: 12, color: D.rose, marginTop: -4 }}> {errors.terms}</div>}
                </>
              )}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ padding: "12px 14px", background: D.blueLo, borderRadius: 12, fontSize: 13, color: D.blue3, border: `1px solid ${D.blueM}`, lineHeight: 1.5, textAlign: "center" }}>
                    Enviamos um código de 6 dígitos para:<br/>
                    <strong style={{ color: D.blue3 }}>{verifyEmail}</strong>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: D.w2, letterSpacing: .4, textTransform: "uppercase" }}>Código de verificação</label>
                    <input
                      type="text" maxLength={6} value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0,6)); if(errors.code) setErrors(p=>{const n={...p};delete n.code;return n;}); }}
                      placeholder="000000"
                      style={{ letterSpacing: "0.35em", textAlign: "center", fontSize: 24, fontWeight: 800, background: D.s0, border: `1.5px solid ${errors.code ? D.rose+"90" : D.b0}`, borderRadius: 14, color: D.w1, padding: "16px 20px", outline: "none", width: "100%", fontFamily: "Inter", transition: "border .18s, box-shadow .18s" }}
                      onFocus={e => { e.target.style.borderColor = D.blueM; e.target.style.boxShadow = `0 0 0 3px ${D.blueLo}`; }}
                      onBlur={e => { e.target.style.borderColor = errors.code ? D.rose+"90" : D.b0; e.target.style.boxShadow = "none"; }}
                    />
                    {errors.code && <div style={{ fontSize: 12, color: D.rose, display: "flex", gap: 5 }}> {errors.code}</div>}
                  </div>
                  <div style={{ padding: "9px 12px", background: D.amberLo, borderRadius: 10, fontSize: 12, color: D.amber, border: `1px solid ${D.amber}30`, lineHeight: 1.5, display: "flex", gap: 7, alignItems: "center" }}>
                    {ICONS.key} <span>Código de demo: <strong onClick={() => setCode(generatedCode)} style={{ cursor: "pointer", textDecoration: "underline" }}>{generatedCode}</strong> (clique para preencher)</span>
                  </div>
                  <button className="btn ghost sm" style={{ alignSelf: "center", fontSize: 13 }} onClick={() => { const c = makeCode(); setGeneratedCode(c); toast?.("Novo código gerado!","ok"); }}>
                    {ICONS.refresh} Reenviar código
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FORGOT */}
          {page === "forgot" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "12px 14px", background: D.s0, borderRadius: 12, fontSize: 13, color: D.w2, border: `1px solid ${D.b0}`, lineHeight: 1.6 }}>
                Informe o e-mail da sua conta e enviaremos um código para redefinir sua senha com segurança.
              </div>
              <AuthInput label="E-mail cadastrado" icon={ICONS.mail} type="email" val={email} onChange={setEmail} err={errors.email} placeholder="seu@email.com" autoComplete="email" onSubmit={submit} errors={errors} setErrors={setErrors} />
            </div>
          )}

          {/* RESET */}
          {page === "reset" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "12px 14px", background: D.blueLo, borderRadius: 12, fontSize: 13, color: D.blue3, border: `1px solid ${D.blueM}`, lineHeight: 1.5 }}>
                 Um código foi enviado para <strong>{email}</strong>
              </div>
              <AuthInput label="Código de recuperação" icon={ICONS.key} val={resetCode} onChange={setResetCode} err={errors.resetCode} placeholder="000000" autoComplete="one-time-code" onSubmit={submit} errors={errors} setErrors={setErrors} />
              <div style={{ fontSize: 12, color: D.amber, cursor: "pointer", textDecoration: "underline" }} onClick={() => setResetCode(generatedCode)}>
                Preencher código de demo: {generatedCode}
              </div>
              <AuthInput label="Nova senha" icon={ICONS.lock} type={showNPass ? "text" : "password"} val={newPass} onChange={setNewPass} err={errors.newPass} placeholder="Mínimo 6 caracteres" autoComplete="new-password" onSubmit={submit} errors={errors} setErrors={setErrors}
                right={<AuthEye show={showNPass} toggle={() => setShowNPass(v=>!v)} />} />
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

          {/*  SUBMIT BUTTON  */}
          <button
            onClick={submit} disabled={loading || locked}
            style={{ width: "100%", padding: "15px 0", borderRadius: 14, background: D.gBlue, border: "none", color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'Sora',sans-serif", cursor: loading || locked ? "not-allowed" : "pointer", opacity: locked ? .5 : 1, transition: "all .18s", boxShadow: "0 4px 20px rgba(37,99,235,.32)", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}
            onMouseOver={e => { if (!loading && !locked) e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,.45)"; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,.32)"; }}>
            {loading
              ? <><Spin s={18} c="#fff" /><span>{loadMsg || "Processando"}</span></>
              : <><span>{page === "login" ? "Entrar na conta" : page === "forgot" ? "Enviar código" : page === "reset" ? "Redefinir senha" : step === 1 ? "Continuar" : step === 2 ? "Criar conta" : "Verificar e-mail"}</span>{ICONS.arrow}</>}
          </button>

          {/* back  register step 2/3 */}
          {page === "register" && step > 1 && (
            <button onClick={() => { setStep(s => s - 1); setErrors({}); }} style={{ background: "none", border: "none", color: D.w2, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", padding: "4px 0", fontFamily: "Inter" }}>
               Voltar
            </button>
          )}
        </div>

        {/*  SOCIAL LOGIN  */}
        {(page === "login" || page === "register") && (
          <div className="fu d3" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: D.b0 }} />
              <span style={{ fontSize: 12, color: D.w3, whiteSpace: "nowrap" }}>ou entre com</span>
              <div style={{ flex: 1, height: 1, background: D.b0 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <AuthSocialBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
                label="Google"
                onClick={async () => {
                  setLoading(true);
                  if (typeof supabase !== 'undefined') {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo: window.location.origin }
                    });
                    if (error) { setErrors({ email: "Erro: " + error.message }); setLoading(false); }
                  } else {
                    setErrors({ email: "Supabase não configurado." });
                    setLoading(false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Perfil = ({ session, plan, postsUsed, onLogout, onUpdateSession, toast, onResetData }) => {
  const [subpage, setSubpage] = useState("main");
  const [editName,  setEditName]  = useState(session?.name || "");
  const [editBio,   setEditBio]   = useState(session?.bio || "");
  const [editPhone, setEditPhone] = useState(session?.phone || "");
  const [saving,    setSaving]    = useState(false);

  const pN  = { free: "Gratuito", social: "Social Premium", student: "Estudante Premium", full: "Plano Completo" };
  const pBg = { free: D.gDark, social: D.gBlue, student: D.gMint, full: D.gAmber };
  const pLimits = {
    free:    { posts: 3 },
    social:  { posts: 5 },
    student: { posts: 10 },
    full:    { posts: Infinity },
  };
  const lim = pLimits[plan] || pLimits.free;
  
  const stats = [
    { l: "Posts Criados", v: postsUsed || 0, c: D.blue2, e: "📸" },
    { l: "Uso Diário", v: `${postsUsed || 0}/${lim.posts === Infinity ? '∞' : lim.posts}`, c: D.mint, e: "⚡" },
    { l: "Plano", v: pN[plan], c: D.amber, e: "💎" },
  ];

  const saveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
        if (session?.id) {
            await supabase.from('profiles').update({ full_name: editName }).eq('id', session.id);
        }
        const newSession = { ...session, name: editName.trim(), bio: editBio, phone: editPhone };
        saveSession(newSession); onUpdateSession(newSession);
        toast(" Perfil atualizado!", "ok"); setSubpage("main");
    } catch(e) {
        toast("Erro ao salvar perfil", "error");
    }
    setSaving(false);
  };

  const avatarGrad = getAvatarGrad(session?.email || "user@dvs.com");
  const initials   = getInitials(session?.name || "User");

  if (subpage === "edit") return (
    <div className="fi" style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <button className="btn ghost xs" onClick={() => setSubpage("main")} style={{ padding: 8 }}>⬅️</button>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Editar Perfil</div>
      </div>
      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Nome completo" icon="" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Seu nome" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: D.w2 }}>Bio</label>
          <textarea className="inp" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Conte um pouco sobre você..." style={{ minHeight: 80, fontSize: 14 }} />
        </div>
        <Field label="Telefone" icon="" type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+55 (11) 99999-9999" />
      </div>
      <button className="btn primary lg" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={saveProfile} disabled={saving}>
        {saving ? <Spin s={18} c="#fff" /> : "Salvar alterações"}
      </button>
    </div>
  );

  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(180deg,${D.s2} 0%,${D.bg} 100%)`, padding: "28px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "'Sora',sans-serif", border: `3px solid ${D.b2}` }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>{session?.name}</div>
            <div style={{ fontSize: 13, color: D.w2 }}>{session?.email}</div>
          </div>
          <button className="btn ghost xs" onClick={() => setSubpage("edit")}>Editar</button>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px", background: pBg[plan] || D.gDark, borderRadius: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: "#fff" }}>{pN[plan]}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>
              {plan === "free" ? `${postsUsed || 0}/3 posts diários` : "Acesso Premium"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "4px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {stats.map((s, i) => (
            <div key={i} className="card" style={{ padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 19, marginBottom: 4 }}>{s.e}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 20, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 10, color: D.w3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          {[
            { e:"✏️", l:"Editar perfil", d:"Nome, bio e telefone", fn:()=>setSubpage("edit") },
            { e:"🧹", l:"Reiniciar conta", d:"Apagar posts e zerar uso", fn:onResetData, danger:true },
            { e:"🚪", l:"Sair da conta", d:"", fn:onLogout, danger:true },
          ].map(({ e, l, d, fn, danger }, i, arr) => (
            <button key={i} className="btn ghost" onClick={fn}
              style={{ width:"100%", justifyContent:"flex-start", padding:"14px 16px", borderRadius:0, gap:13, border: "none", borderBottom: i < arr.length-1 ? `1px solid ${D.b0}` : "none", background: danger ? "rgba(244,63,94,0.05)" : "transparent" }}>
              <div style={{ width:40, height:40, borderRadius:12, background: danger ? D.roseLo : D.s3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{e}</div>
              <div style={{ flex:1, textAlign:"left" }}>
                <div style={{ fontWeight:700, fontSize:14, color: danger ? D.rose : D.w1 }}>{l}</div>
                {d && <div style={{ fontSize:12, color:D.w3 }}>{d}</div>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [nav, setNav]         = useState("criador");
  const [plan, setPlan]       = useState("free");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [postsUsed, setPostsUsed] = useState(0);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return;
    try {
        const { data } = await supabase.from('profiles').select('posts_used, plan').eq('id', userId).single();
        if (data) {
          setPostsUsed(data.posts_used || 0);
          if (data.plan) setPlan(data.plan);
        }
    } catch(e) {}
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        const sess = { id: s.user.id, email: s.user.email, name: s.user.user_metadata?.full_name || s.user.email };
        setSession(sess);
        fetchProfile(s.user.id);
      } else {
        const sess = getSession();
        if (sess) {
          setSession(sess);
          if (sess.id) fetchProfile(sess.id);
        }
      }
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        const sess = { id: s.user.id, email: s.user.email, name: s.user.user_metadata?.full_name || s.user.email };
        setSession(sess);
        fetchProfile(s.user.id);
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, tp = "info") => {
    const id = ++_tid;
    setToasts(p => [...p.slice(-2), { id, msg, tp }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  const del = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  const handleLogin = useCallback(sess => {
    setSession(sess);
    setNav("criador");
    if (sess.id) fetchProfile(sess.id);
  }, [fetchProfile]);

  const handleLogout = useCallback(() => {
    supabase.auth.signOut();
    clearSession(); setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);

  const handleUpdateSession = useCallback(newSess => setSession(newSess), []);

  const handleSetPlan = useCallback((p) => {
    setPlan(p);
    if (session?.id) {
        supabase.from('profiles').update({ plan: p }).eq('id', session.id);
    }
  }, [session]);

  const pCols = { free: D.w3, social: D.blue2, student: D.mint, full: D.amber };
  const pLbls = { free: "Gratuito", social: "Social Premium", student: "Estudante Premium", full: "Plano Completo" };

  const NAV = [
    { id: "criador",   l: "Criador",   e: "📸" },
    { id: "planos",    l: "Planos",    e: "💳" },
    { id: "perfil",    l: "Perfil",    e: "👤" },
  ];

  if (loadingAuth) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: D.bg }}><Spin s={40} c={D.blue} /></div>;

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
          <header style={{ position:"sticky", top:0, zIndex:400, background:`${D.bg}f2`, backdropFilter:"blur(20px)", borderBottom:`1px solid ${D.b0}`, padding:"12px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, overflow: 'hidden', flexShrink:0, boxShadow:"0 0 16px rgba(37,99,235,.3)" }}>
              <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="DVS Logo" />
            </div>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"-.2px", lineHeight:1.2 }}>DVSCREATOR</div>
              <div style={{ fontSize:10, color:D.w3 }}>Olá, {session.name.split(" ")[0]}! </div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:pCols[plan], animation:"pulse2 2s ease-in-out infinite" }}/>
                  <span style={{ fontSize:12, fontWeight:700, color:pCols[plan] }}>{pLbls[plan]}</span>
                </div>
            </div>
          </header>

          <main style={{ flex:1, overflowY:"auto", paddingBottom:72 }}>
            {nav === "criador"   && <Criador   toast={toast} session={session} plan={plan} />}
            {nav === "planos"    && <Planos    plan={plan} setPlan={handleSetPlan} toast={toast} />}
            {nav === "perfil"    && <Perfil    session={session} plan={plan} postsUsed={postsUsed} onLogout={handleLogout} onUpdateSession={handleUpdateSession} toast={toast} onResetData={async () => {
                if (!confirm("Deseja realmente apagar todos os posts e reiniciar seu uso diário?")) return;
                toast("Reiniciando...", "info");
                try {
                  await supabase.from('posts').delete().eq('user_id', session.id);
                  await supabase.from('profiles').update({ posts_used: 0 }).eq('id', session.id);
                  setPostsUsed(0);
                  toast("Conta reiniciada!", "ok");
                } catch(e) {
                  toast("Erro ao reiniciar", "error");
                }
              }} />}
          </main>

          <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:500, zIndex:300, background:`${D.s1}f8`, backdropFilter:"blur(24px)", borderTop:`1px solid ${D.b0}`, padding:"7px 4px 16px", display:"flex" }}>
            {NAV.map(item => {
              const active = nav === item.id;
              return (
                <button key={item.id} className="nav-item" onClick={() => setNav(item.id)}>
                  {active && <div style={{ position:"absolute", top:-7, left:"50%", transform:"translateX(-50%)", width:24, height:3, background:D.gBlue, borderRadius:99 }}/>}
                  <div style={{ width:40, height:40, borderRadius:13, background:active?D.blueLo:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .18s" }}>
                    <span style={{ fontSize:20 }}>{item.e}</span>
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
