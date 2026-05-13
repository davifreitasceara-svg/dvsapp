import React, { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./services/supabase";
import PublishPreview from "./features/creator/PublishPreview";
import { generateVideo, mixAudioWithVideo } from "./services/ffmpegService";
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
const XAI_KEY = import.meta.env.VITE_XAI_API_KEY || "";
const XAI_URL = "https://api.x.ai/v1/chat/completions";

async function callAI(user, sys = "") {
  if (!XAI_KEY) { console.error("[callAI] VITE_XAI_API_KEY nao configurada!"); return ""; }
  try {
    const r = await fetch(XAI_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: sys || "Você é o DVSCREATOR AI, assistente especialista em marketing digital e educação. Responda sempre em português brasileiro de forma direta, criativa e precisa." },
          { role: "user", content: user }
        ],
        stream: false
      }),
    });
    if (!r.ok) { 
      const err = await r.json().catch(()=>({})); 
      console.error("[callAI] Error:", r.status, err); 
      return ""; 
    }
    const d = await r.json();
    return d.choices?.[0]?.message?.content || "";
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
  if (!XAI_KEY) { console.error("[callAIVision] VITE_XAI_API_KEY nao configurada!"); return ""; }
  try {
    const r = await fetch(XAI_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_KEY}`
      },
      body: JSON.stringify({
        model: "grok-vision-beta",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: (sys ? sys + "\n\n" : "") + prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${b64}`
                }
              }
            ]
          }
        ],
        stream: false
      })
    });
    if (!r.ok) { 
      const err = await r.json().catch(()=>({})); 
      console.error("[callAIVision] Error:", r.status, err); 
      return ""; 
    }
    const d = await r.json();
    return d.choices?.[0]?.message?.content || "";
  } catch (e) { console.error("[callAIVision] Exception:", e); return ""; }
}

/* 
   PRIMITIVES
 */
const DvsSpin = ({ s = 20, c = D.blue2 }) => (
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
          <DvsSpin s={44} />
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
                  <DvsSpin s={11} c={(D?.blue2 || "#3b82f6")} />
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
          {loading ? <DvsSpin s={14} c="#fff" /> : "Publicar"}
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


const Criador = ({ toast, session, plan, setPostsUsed, songsChanged, setSongsChanged, onNavigate }) => {
  const [stage, setStage] = useState("home"); // home | proc | result | publish
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
  const [postId, setPostId] = useState(null);
  const [sharing, setSharing] = useState(false);
  
  const loadingSteps = ["Analisando m dia...", "Mapeando tend ncias...", "Aplicando estrat gia viral...", "Mixando SmartSound...", "Finalizando edi o..."];
  const [loadStep, setLoadStep] = useState(0);
  
  useEffect(() => {
    if (stage === "proc") {
      const t = setInterval(() => setLoadStep(s => (s + 1) % loadingSteps.length), 2200);
      return () => clearInterval(t);
    }
  }, [stage]);

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
    const limits = { free: 3, social: 5, student: 10, full: Infinity };
    const limit = limits[plan] || 3;

    if (plan !== "full") {
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase.from('profiles').select('posts_used, music_swaps_used, last_usage_reset').eq('id', session.id).single();
      
      if (profile) {
        if (profile.last_usage_reset !== today) {
           await supabase.from('profiles').update({ posts_used: 0, music_swaps_used: 0, last_usage_reset: today }).eq('id', session.id);
           setPostsUsed(0);
           setSongsChanged(0);
           // Re-fetch current limits for the rest of the function
        } else {
           if (profile.posts_used >= limit) {
             toast(`Limite diário de ${limit} posts atingido. Faça upgrade para o plano superior! 🚀`, "error");
             return;
           }
        }
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
        const visionPrompt = plan === "free" 
          ? "Você é um especialista em marketing. Analise esta imagem de forma direta e crie uma legenda viral simples."
          : plan === "social"
          ? "Você é um especialista em marketing viral. Analise esta imagem com foco em engajamento e sugira músicas que estão em alta no momento."
          : "Você é um estrategista de conteúdo viral de elite. Faça uma análise PROFUNDA desta imagem (IA Vision Profissional), identifique gatilhos psicológicos, tendências de nicho e crie uma estratégia completa de postagem.";

        raw = await callAIVision(b64, mt,
          `${visionPrompt}
          
PASSO 1 — ANALISE A IMAGEM:
- O que aparece na foto? (pessoas, objetos, local, natureza, comida, produto, etc.)
- Qual é a paleta de cores dominante? (cores quentes, frias, neutras, vibrantes)
- Qual é o clima/sentimento? (alegre, romântico, agitado, sereno, elegante, divertido, etc.)
- Qual é o contexto? (ao ar livre, interior, praia, cidade, academia, restaurante, etc.)

PASSO 2 — BASEADO NO QUE VIU NA IMAGEM:
- Escreva a legenda descrevendo ESTE conteúdo específico
- Escolha músicas que COMBINAM com a vibe visual desta foto
- Sugira hashtags específicas para o que aparece na imagem

Tema adicional do usuário: "${topic || 'nenhum'}"
Estilo desejado: "${estilo}"

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
      const { data: profile } = await supabase.from('profiles').select('posts_used').eq('id', session.id).single();
      const newUsage = (profile?.posts_used || 0) + 1;
      await supabase.from('profiles').update({ posts_used: newUsage }).eq('id', session.id);
      setPostsUsed(newUsage);
    }
  };

  const applyFilt = name => {
    const key = Object.keys(FPRESET).find(k => k.toLowerCase() === (name || "").toLowerCase()) || "Original";
    setFiltName(key); setFilters(FPRESET[key] || FPRESET["Original"]);
  };
  
  const [pPct, setPPct] = useState(0);

  
  
    const compartilharRede = async (rede) => {
    if (sharing) return;
    setSharing(true);
    if (postId) {
      try { await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId); } catch(e) {}
    }

    toast("🚀 Preparando vídeo viral...", "info");
    const text = caption;
    try { 
      await navigator.clipboard.writeText(text); 
      toast("📝 Legenda copiada! Cole no " + rede.toUpperCase(), "ok");
    } catch(e) {
      console.warn("Clipboard failed", e);
    }

    let blob = null;
    if (isImg) {
      try {
        const el = document.getElementById("preview-to-export");
        if (el) {
          const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
          blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        }
      } catch(e) { console.error("Canvas failed", e); }
    }

    // Se não for imagem ou o canvas falhou, tenta usar o arquivo original se existir
    let fileToShare = blob 
      ? new File([blob], "EduCreator-Post.png", { type: "image/png" }) 
      : (file ? new File([file], file.name, { type: file.type }) : null);

    const activeMusic = selMusic || result?.musicas?.[0];
    if (activeMusic && activeMusic.previewUrl) {
      toast("🎵 Mixando áudio viral...", "info");
      try {
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 25000) // Aumentado timeout para vídeos
        );
        
        let videoBlob;
        if (isImg && blob) {
          videoBlob = await Promise.race([
            generateVideo(blob, activeMusic.previewUrl, filters),
            timeout
          ]);
        } else if (!isImg && file) {
          videoBlob = await Promise.race([
            mixAudioWithVideo(file, activeMusic.previewUrl, filters),
            timeout
          ]);
        }

        if (videoBlob) {
          fileToShare = new File([videoBlob], "EduCreator-Viral.mp4", { type: "video/mp4" });
          toast("✅ Vídeo pronto!", "ok");
        }
      } catch (err) {
        console.warn("Video generation timed out or failed", err);
        toast("⚠️ Erro no processamento. Enviando original...", "warn");
      }
    }

    if (!fileToShare) {
      toast("❌ Erro: Nenhum arquivo para compartilhar.", "error");
      setSharing(false);
      return;
    }

    let shareAttempted = false;
    if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      shareAttempted = true;
      try {
        await navigator.share({ 
          files: [fileToShare], 
          title: "EduCreator Viral", 
          text: text 
        });
      } catch(err) {
        if (err.name !== 'AbortError') toast("Falha no compartilhamento nativo.", "error");
        return;
      }
    }

    if (!shareAttempted) {
      toast("Seu navegador não permite o compartilhamento direto de arquivos.", "warn");
    }
    setSharing(false);
  };

  const compartilharDireto = async () => {
    if (postId) {
      try { await supabase.from('posts').update({ content: { ...result, caption, filters } }).eq('id', postId); } catch(e) {}
    }

    const m = selMusic || result?.musicas?.[0];
    
    if (m?.previewUrl) {
      toast("🚀 Gerando vídeo com música...");
      try {
        const el = document.getElementById('preview-to-export');
        if (!el) return;
        const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
        
        canvas.toBlob(async (blob) => {
          try {
            const videoBlob = await generateVideo(blob, m.previewUrl, (p) => {
               // Optional: update toast or progress bar
            });
            const fileToShare = new File([videoBlob], 'dvs-viral.mp4', { type: 'video/mp4' });
            
            if (navigator.share) {
              await navigator.share({
                files: [fileToShare],
                title: 'EduCreator',
                text: caption
              });
              toast("🔥 Compartilhado com sucesso!");
            } else {
               toast("Seu navegador não suporta compartilhamento de vídeo.");
            }
          } catch (err) {
            toast("Erro ao gerar vídeo: " + err.message);
          }
        }, 'image/png');
        return;
      } catch (e) {
        toast("Erro: " + e.message);
        return;
      }
    }

    // Caso não tenha música, compartilha imagem/vídeo original
    if (navigator.share) {
      try {
        const el = document.getElementById('preview-to-export');
        if (el && isImg) {
           const canvas = await html2canvas(el, { useCORS: true, scale: 2 });
           canvas.toBlob(async (blob) => {
             const fileToShare = new File([blob], 'dvs-viral.png', { type: 'image/png' });
             await navigator.share({ files: [fileToShare], title: 'EduCreator', text: caption });
           });
        } else {
           await navigator.share({ title: 'EduCreator', text: caption, url: fileURL });
        }
        toast("Enviado!");
      } catch(e) {
        if (e.name !== 'AbortError') toast("Use os botões de rede social abaixo.");
      }
    } else {
      toast("Compartilhamento nativo indisponível.");
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
      <div style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <div style={{ position: "relative", width: 100, height: 100, marginBottom: 40 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: `linear-gradient(135deg, ${D.blue}, ${D.mint})`, opacity: 0.2, animation: "pulse 2s infinite" }} />
           <div style={{ position: "absolute", inset: 10, borderRadius: 20, background: D.s2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: `0 0 30px ${D.blueLo}` }}>
             🤖
           </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{loadingSteps[loadStep]}</div>
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
              setPostId(null); setSelMusic(null);
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
                    <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                  )}
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
                      {fileURL ? (
                        isImg ? (
                          <img src={fileURL} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: css }} />
                        ) : (
                          <video src={fileURL} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: css }} />
                        )
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1d4ed8,#06b6d4)", filter: css }} />
                      )}
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
          <SmartSoundPlayer session={session} musicas={result?.musicas} toast={toast} plan={plan} songsChanged={songsChanged} setSongsChanged={setSongsChanged} onSelect={setSelMusic} />

          {/* Turbinar */}

          <div style={{ background: D.s0, borderRadius: 24, padding: "24px 20px", border: "1px solid " + D.b1, textAlign: "center" }}>
              <button 
                onClick={() => compartilharRede("Geral")}
                disabled={sharing}
                style={{ 
                  width: "100%", 
                  padding: "16px 0", 
                  background: sharing ? D.s3 : D.gBlue, 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 16, 
                  fontWeight: 800, 
                  fontSize: 16, 
                  fontFamily: "'Sora', sans-serif",
                  cursor: sharing ? "wait" : "pointer", 
                  boxShadow: sharing ? "none" : "0 10px 25px rgba(37, 99, 235, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transition: "transform 0.2s"
                }}
              >
                <span>{sharing ? <DvsSpin s={20} c="#fff" /> : "📤"}</span>
                <span>{sharing ? "GERANDO VÍDEO..." : "COMPARTILHAR AGORA"}</span>
              </button>
              
              <button 
                onClick={() => setStage("publish")}
                style={{ 
                  width: "100%", marginTop: 12, padding: "16px 0", 
                  background: "linear-gradient(135deg, #7c3aed, #d946ef)", 
                  color: "#fff", border: "none", borderRadius: 16, 
                  fontWeight: 800, fontSize: 16, fontFamily: "'Sora', sans-serif",
                  cursor: "pointer", boxShadow: "0 10px 25px rgba(124, 58, 237, 0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12
                }}
              >
                <span>🚀</span>
                <span>PUBLICAR NO FEED</span>
              </button>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 15 }}>
              <button onClick={() => setMock({ platform: "insta", type: "reels" })} style={{ background: "none", border: "none", color: D.blue2, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>👁️ Ver Preview</button>
              <div style={{ width: 1, height: 12, background: D.b1 }}></div>
              <button onClick={() => { navigator.clipboard.writeText(caption); toast("Legenda Copiada!", "ok"); }} style={{ background: "none", border: "none", color: D.w3, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📋 Copiar Texto</button>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 10, color: D.w3, marginTop: 4 }}>
            DVS — crie, edite e compartilhe seu conteúdo viral.
          </div>
        </div>
      </>
    );
  }

  if (stage === "publish") {
    return (
        <PublishPreview 
          file={file} 
          style={estilo} 
          initialCaption={caption} 
          initialHashtags="" 
          session={session} 
          onClose={() => setStage("result")} 
          onPublish={() => { onNavigate("perfil"); setStage("home"); setFile(null); setFileURL(null); setPostsUsed(p => p + 1); }} 
          supabase={supabase} 
          toast={toast} 
        />
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
                <div style={{ 
          width: 72, height: 72, borderRadius: 20, overflow: 'hidden', 
          border: `1.5px solid ${D.blueM}`, 
          display: "flex", alignItems: "center", justifyContent: "center", 
          animation: "float2 3.5s ease-in-out infinite", 
          background: "rgba(255,255,255,0.05)",
          boxShadow: `0 0 20px ${D.blueLo}`
        }}>
          <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
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
           plan === "social" ? "Criador   5 posts/dia" :
           plan === "student" ? "Pro   10 posts/dia" :
           "Ilimitado"}   <span style={{ color: D.amber, fontWeight: 700, cursor: "pointer" }} onClick={() => toast("Acesse a aba Planos!", "info")}>{plan === "full" ? "Gerenciar" : "Upgrade"} </span>
        </span>
      </div>
  );
};

const Planos = ({ plan, setPlan, toast }) => {
  const [ann, setAnn] = useState(false);
    const PL = [
      { id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["3 posts por dia", "3 trocas de música", "IA Vision Básica", "Legendas Sugeridas", "Score Viral"], miss: ["Análise Profunda", "Músicas Ilimitadas", "Export HD", "Sem marca d'água"] },
      { id: "social", name: "Criador", price: 10, col: D.blue2, grad: D.gBlue, badge: " MAIS POPULAR", link: "https://buy.stripe.com/test_dRm14m1KC9iLaHr6VF5sA04", feats: ["5 posts por dia", "10 trocas de música", "SmartSound AI (músicas)", "Exportação HD", "Score Viral Avançado", "Legendas Otimizadas"], miss: ["IA Vision Pro", "Trocas Ilimitadas"] },
      { id: "student", name: "Pro", price: 15, col: D.mint, grad: D.gMint, badge: " MELHOR CUSTO", link: "https://buy.stripe.com/test_6oUdR874W52veXHeo75sA03", feats: ["10 posts por dia", "Trocas Ilimitadas", "Tudo do Criador", "IA Vision Profissional", "Filtros Exclusivos", "Sugestão de Trends", "Análise de Retenção"], miss: ["Uso Ilimitado"] },
      { id: "full", name: "Ilimitado", price: 20, col: D.amber, grad: D.gAmber, badge: " TUDO INCLUSO", link: "https://buy.stripe.com/test_5kQ6oG4WO9iLbLv93N5sA01", feats: ["Tudo Ilimitado", "IA Prioritária", "Exportação 4K", "Suporte VIP 24/7", "Novas funções antecipadas"], miss: [] },
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
                {active ? " Plano Atual" : p.id === "free" ? "Usar Grátis" : "Assine Já"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SmartSoundPlayer = ({ session, musicas = [], toast, plan, songsChanged, setSongsChanged, onSelect }) => {
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
    const limits = { free: 3, social: 10, student: Infinity, full: Infinity };
    const limit = limits[plan] || 3;

    if (plan !== "full" && songsChanged >= limit && t !== track) {
      toast(`Limite de ${limit} trocas atingido no plano ${plan === 'free' ? 'Gratuito' : plan === 'social' ? 'Social' : 'Avançado'}!`, "warn");
      return;
    }
    if (t !== track) {
      setSongsChanged(prev => prev + 1);
      // Persist to database
      supabase.rpc('increment_music_usage', { user_id_param: session.id, limit_param: limit }).then(({ data, error }) => {
        if (error) console.error("Error incrementing music usage:", error);
      });
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
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20&country=${country}&explicit=No`;
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
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(termo)}&media=music&limit=5&country=br&explicit=No`;
      const res = await fetch(itunesUrl);
      const data = await res.json();
      const tracks = (data.results || []).filter(r => r.previewUrl);
      if (tracks.length > 0) { playTrack(tracks[0]); }
      else {
        // fallback: busca direto pelo nome
        const itunesUrl2 = `https://itunes.apple.com/search?term=${encodeURIComponent(m.nome)}&media=music&limit=5&country=br`;
        const res2 = await fetch(itunesUrl2);
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
                    ? <DvsSpin s={14} c={D.rose} />
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
                {searching ? <DvsSpin s={14} c="#fff" /> : ICONS.search}
              </button>
            </div>
            {/* country filter */}
            <div style={{ display: "flex", gap: 6 }}>
              {[["br","? BR"], ["us","? US"], ["pt","? PT"], ["mx","? MX"]].map(([c, l]) => (
                <button key={c} className="btn ghost xs" onClick={() => searchItunes(search, c)} disabled={!search.trim() || searching}>{l}</button>
              ))}
            </div>
            {/* resultados */}
            {searching && <div style={{ display: "flex", justifyContent: "center", padding: 20 }}><DvsSpin s={28} /></div>}
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
/* Força da senha */
function senhaForte(p) {
  if (!p) return { score: 0, label: "", color: "" };
  let s = 0;
  if (p.length >= 8) s++; // Mínimo 8
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; // Maiúsculas e minúsculas
  if (/[0-9]/.test(p)) s++; // Números
  if (/[^a-zA-Z0-9]/.test(p)) s++; // Símbolos
  
  const score = Math.min(s, 4);
  const data = [
    { label: "Muito fraca", color: D.rose },
    { label: "Fraca",       color: "#fb923c" },
    { label: "Média",       color: D.amber },
    { label: "Boa",         color: "#84cc16" },
    { label: "Confiável",   color: D.mint },
  ];
  return { score, label: data[score].label, color: data[score].color };
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

const AuthScreen = ({ onLogin, onResetMode }) => {
  const [page, setPage] = useState("login"); // login | register | forgot | verify | reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [verifyType, setVerifyType] = useState("signup"); // signup | recovery

  const handleGoogleLogin = async () => {
    setLoading(true); setError(""); setSuccess("");
    // Ensure we use the current port for redirect
    const origin = window.location.origin;
    console.log("Iniciando login Google com redirect para:", origin);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    if (error) { setError("Erro ao conectar: " + error.message); setLoading(false); }
  };

  const handleEmailAuth = async () => {
    setError(""); setSuccess("");
    
    if (page === "reset") {
      if (pass.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({ password: pass });
      if (error) { setError("Erro ao atualizar senha: " + error.message); setLoading(false); }
      else {
        setSuccess("Senha atualizada com sucesso!");
        if (onResetMode) onResetMode(false);
        onLogin({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name || data.user.email });
      }
      return;
    }

    if (page === "verify") {
      if (otp.length < 6) { setError("Digite o código de 6 dígitos."); return; }
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email, token: otp, type: verifyType
      });
      if (error) { setError("Código inválido ou expirado."); setLoading(false); }
      else {
        if (verifyType === "recovery") {
          if (onResetMode) onResetMode(true);
          setPage("reset");
          setSuccess("Código confirmado! Defina sua nova senha.");
          setPass(""); 
          setLoading(false);
        } else {
          onLogin({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name || data.user.email });
        }
      }
      return;
    }

    if (page === "forgot") {
      if (!email) { setError("Informe seu e-mail."); return; }
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) setError("Erro: " + error.message);
      else {
        setSuccess("Código de recuperação enviado!");
        setVerifyType("recovery");
        setPage("verify");
      }
      setLoading(false);
      return;
    }

    if (!email || !pass) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    
    if (page === "register") {
      if (!name) { setError("Informe seu nome."); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({
        email, password: pass,
        options: { data: { full_name: name } }
      });
      if (error) setError("Erro: " + error.message);
      else {
        setSuccess("Código de confirmação enviado para " + email);
        setVerifyType("signup");
        setPage("verify");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setVerifyType("signup");
          setPage("verify");
          setSuccess("Sua conta ainda não foi confirmada. Digite o código enviado.");
        } else {
          setError("E-mail ou senha incorretos.");
        }
      }
      else onLogin({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name || data.user.email });
    }
    setLoading(false);
  };

  const btnGrad = "linear-gradient(90deg, #64b5f6 0%, #2196f3 50%, #1976d2 100%)";
  const inputBg = "rgba(255, 255, 255, 0.05)";

  return (
    <div style={{ minHeight: "100vh", background: "#02050a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px", position: "relative", overflow: "hidden", fontFamily: "'Sora', sans-serif" }}>

      <style>{`
        @keyframes floatGlow {
          0% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          33% { transform: translate(2%, 3%) scale(1.1); opacity: 0.35; }
          66% { transform: translate(-1%, 2%) scale(0.95); opacity: 0.2; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
        }
        @keyframes floatGlow2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(-3%, -5%) scale(1.2); opacity: 0.15; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        }
      `}</style>

      {/* Floxly Top Glow - Animated */}
      <div style={{ position: "absolute", top: "-15%", left: "15%", width: "70%", height: "40%", background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", animation: "floatGlow 15s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "floatGlow2 20s ease-in-out infinite" }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* LOGO SECTION - TRANSPARENT STYLE */}
        <div style={{ textAlign: "center", marginBottom: 60, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
           <div style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <img src="/logo.png" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
           </div>
           <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.8px" }}>EduCreator</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: "-1px" }}>
              {page === "login" ? "Hi There!" : page === "register" ? "Create an Account" : page === "verify" ? "Verify Code" : page === "reset" ? "Reset Password" : "Forgot Password"}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              {page === "verify" ? "Please enter the 6-digit code sent to your email." : "Please enter required details."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Social Button - Google Only */}
            {(page === "login" || page === "register") && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button 
                  onClick={handleGoogleLogin} 
                  style={{ height: 52, borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", color: "#fff", fontWeight: 600, fontSize: 14 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
              </div>
            )}

            {(page === "login" || page === "register") && (
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Or</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "14px", background: "rgba(244,63,94,0.1)", borderRadius: 16, color: "#fb7185", fontSize: 13, textAlign: "center", border: "1px solid rgba(244,63,94,0.2)" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ padding: "14px", background: "rgba(16,185,129,0.1)", borderRadius: 16, color: "#34d399", fontSize: 13, textAlign: "center", border: "1px solid rgba(16,185,129,0.2)" }}>
                  {success}
                </div>
              )}

              {page === "verify" ? (
                <div style={{ background: inputBg, borderRadius: 20, padding: "4px" }}>
                  <input 
                    type="number" value={otp} onChange={e => setOtp(e.target.value)} 
                    placeholder="Enter Code"
                    style={{ width: "100%", height: 56, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "0 20px", fontSize: 16, fontWeight: 500 }}
                  />
                </div>
              ) : (
                <>
                  {page === "register" && (
                    <div style={{ background: inputBg, borderRadius: 20, padding: "4px" }}>
                      <input 
                        type="text" value={name} onChange={e => setName(e.target.value)} 
                        placeholder="Full Name"
                        style={{ width: "100%", height: 56, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "0 20px", fontSize: 16, fontWeight: 500 }}
                      />
                    </div>
                  )}
                  <div style={{ background: inputBg, borderRadius: 20, padding: "4px" }}>
                    <input 
                      type="email" value={email} onChange={setEmail ? (e => setEmail(e.target.value)) : undefined} 
                      placeholder="Email address"
                      style={{ width: "100%", height: 56, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "0 20px", fontSize: 16, fontWeight: 500 }}
                    />
                  </div>
                  {page !== "forgot" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ background: inputBg, borderRadius: 20, padding: "4px", display: "flex", alignItems: "center" }}>
                        <input 
                          type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} 
                          placeholder={page === "reset" ? "New Password" : "Password"}
                          style={{ flex: 1, height: 56, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "0 20px", fontSize: 16, fontWeight: 500 }}
                        />
                        <button onClick={() => setShowPass(!showPass)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", padding: "0 15px", cursor: "pointer" }}>
                          {showPass ? "Hide" : "Show"}
                        </button>
                      </div>
                      {page === "login" && (
                        <span 
                          onClick={() => setPage("forgot")} 
                          style={{ alignSelf: "flex-end", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 700 }}
                        >
                          Forgot Password?
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <button 
              onClick={handleEmailAuth} 
              disabled={loading}
              style={{ width: "100%", height: 60, borderRadius: 20, background: btnGrad, border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "wait" : "pointer", boxShadow: "0 10px 20px rgba(33, 150, 243, 0.3)", transition: "all 0.2s" }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {loading ? <DvsSpin s={20} c="#fff" /> : (page === "login" ? "Log In" : page === "register" ? "Continue" : page === "verify" ? "Verify Code" : page === "reset" ? "Save Password" : "Send Code")}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 10 }}>
             <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
               <span>{page === "login" ? "Create an account? " : page === "register" ? "Have an account? " : ""}</span>
               <span 
                 onClick={() => setPage(page === "login" ? "register" : "login")} 
                 style={{ color: "#fff", fontWeight: 700, cursor: "pointer" }}
               >
                 {page === "login" ? "Sign Up" : "Log In"}
               </span>
             </p>
          </div>
        </div>

        <div style={{ marginTop: "auto", paddingBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
             <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span> | <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>

      </div>
    </div>
  );
};



const Perfil = ({ session, plan, postsUsed, songsChanged, onLogout, onUpdateSession, toast, onResetData }) => {
  const [subpage, setSubpage] = useState("main");
  const [editName,  setEditName]  = useState(session?.name || "");
  const [editBio,   setEditBio]   = useState(session?.bio || "");
  const [editPhone, setEditPhone] = useState(session?.phone || "");
  const [editAvatar, setEditAvatar] = useState(session?.avatar_url || "");
  const [editInstagram, setEditInstagram] = useState(session?.instagram_url || "");
  const [editTiktok, setEditTiktok] = useState(session?.tiktok_url || "");
  const [editRelationship, setEditRelationship] = useState(session?.relationship_status || "");
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sync states when entering edit mode
  useEffect(() => {
    if (subpage === "edit") {
      setEditName(session?.name || "");
      setEditBio(session?.bio || "");
      setEditPhone(session?.phone || "");
      setEditAvatar(session?.avatar_url || "");
      setEditInstagram(session?.instagram_url || "");
      setEditTiktok(session?.tiktok_url || "");
      setEditRelationship(session?.relationship_status || "");
    }
  }, [subpage, session]);

  const pN  = { free: "Gratuito", social: "Criador", student: "Pro", full: "Ilimitado" };
  const pBg = { free: D.gDark, social: D.gBlue, student: D.gMint, full: D.gAmber };
  const pLimits = {
    free:    { posts: 3 },
    social:  { posts: 5 },
    student: { posts: 10 },
    full:    { posts: Infinity },
  };
  const lim = pLimits[plan] || pLimits.free;
  
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [viewPost, setViewPost] = useState(null);

  const stats = [
    { l: "Posts Criados", v: postsUsed || 0, c: D.blue2, e: "📸" },
    { l: "Trocas Músicas", v: songsChanged || 0, c: D.mint, e: "🎵" },
    { l: "Plano", v: pN[plan], c: D.amber, e: "💎" },
  ];

  useEffect(() => {
    if (session?.id && subpage === "main") {
      loadMyPosts();
    }
  }, [session?.id, subpage]);

  const loadMyPosts = async () => {
    setLoadingPosts(true);
    const { data } = await supabase
      .from("posts")
      .select("*, profiles!inner(full_name, avatar_url)")
      .eq("user_id", session.id)
      .order("created_at", { ascending: false });
    if (data) setMyPosts(data);
    setLoadingPosts(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast("A imagem deve ter no máximo 2MB", "warn"); return; }
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setEditAvatar(data.publicUrl);
      toast("Foto carregada! Salve para confirmar.", "ok");

    } catch (e) {
      toast("Erro no upload: " + e.message, "error");
    }
    setUploading(false);
  };

  const saveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
        if (session?.id) {
            const { error } = await supabase.from("profiles").update({ 
              full_name: editName.trim(), 
              bio: editBio, 
              phone: editPhone, 
              avatar_url: editAvatar,
              instagram_url: editInstagram,
              tiktok_url: editTiktok,
              relationship_status: editRelationship
            }).eq("id", session.id);
            
            if (error) throw error;

            await supabase.auth.updateUser({
              data: { full_name: editName.trim(), avatar_url: editAvatar }
            });
        }
        const newSession = { ...session, name: editName.trim(), bio: editBio, phone: editPhone, avatar_url: editAvatar, instagram_url: editInstagram, tiktok_url: editTiktok, relationship_status: editRelationship };
        saveSession(newSession); onUpdateSession(newSession);
        toast(" Perfil atualizado!", "ok"); setSubpage("main");
    } catch(e) {
        toast("Erro ao salvar perfil: " + e.message, "error");
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

      <div style={{ alignSelf: "center", position: "relative", marginBottom: 10 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: avatarGrad, border: `3px solid ${D.b2}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {editAvatar ? (
            <img src={editAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>{initials}</span>
          )}
        </div>
        <label style={{ position: "absolute", bottom: 0, right: 0, width: 34, height: 34, borderRadius: "50%", background: D.blue2, border: `2px solid ${D.bg}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          <span>{uploading ? <DvsSpin s={14} c="#fff" /> : "📷"}</span>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
        </label>
      </div>

      <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Nome completo" icon="" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Seu nome" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: D.w2 }}>Bio</label>
          <textarea className="inp" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Conte um pouco sobre você..." style={{ minHeight: 80, fontSize: 14 }} />
        </div>
        <Field label="Telefone" icon="" type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+55 (11) 99999-9999" />
        <Field label="Instagram" icon="📸" value={editInstagram} onChange={e => setEditInstagram(e.target.value)} placeholder="@seu_insta" />
        <Field label="TikTok" icon="🎵" value={editTiktok} onChange={e => setEditTiktok(e.target.value)} placeholder="@seu_tiktok" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: D.w2 }}>Estado Civil / Relacionamento</label>
          <select className="inp" value={editRelationship} onChange={e => setEditRelationship(e.target.value)} style={{ fontSize: 14 }}>
            <option value="">Prefiro não dizer</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Namorando">Namorando</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Noivo(a)">Noivo(a)</option>
            <option value="Em um relacionamento sério">Em um relacionamento sério</option>
            <option value="Morando junto">Morando junto</option>
            <option value="Relacionamento aberto">Relacionamento aberto</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
          </select>
        </div>
      </div>
      <button className="btn primary lg" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={saveProfile} disabled={saving}>
        {saving ? <DvsSpin s={18} c="#fff" /> : "Salvar alterações"}
      </button>
    </div>
  );

  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(180deg,${D.s2} 0%,${D.bg} 100%)`, padding: "28px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: avatarGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "'Sora',sans-serif", border: `3px solid ${D.b2}`, overflow: "hidden" }}>
            {session?.avatar_url ? <img src={session.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>{session?.name}</div>
            <div style={{ fontSize: 13, color: D.w2 }}>{session?.email}</div>
            {session?.bio && (
              <div style={{ fontSize: 13, color: D.w3, marginTop: 4, lineHeight: 1.4, maxWidth: 280 }}>{session.bio}</div>
            )}
            {session?.phone && (
              <div style={{ fontSize: 12, color: D.blue2, marginTop: 4, fontWeight: 600 }}>📞 {session.phone}</div>
            )}
            {session?.relationship_status && (
              <div style={{ fontSize: 12, color: D.rose, marginTop: 4, fontWeight: 600 }}>❤️ {session.relationship_status}</div>
            )}
          </div>
          <button className="btn ghost xs" onClick={() => setSubpage("edit")} style={{ alignSelf: "flex-start" }}>Editar</button>
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

        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18 }}>Minhas Publicações</div>
            <div style={{ fontSize: 12, color: D.w3 }}>{myPosts.length} posts</div>
          </div>

          {loadingPosts ? (
            <div style={{ textAlign: "center", padding: 20 }}><DvsSpin s={24} c={D.blue} /></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
              {myPosts.map(p => (
                <div key={p.id} style={{ aspectRatio: "1/1", background: D.bg2, overflow: "hidden", cursor: "pointer", position: "relative" }} onClick={() => setViewPost(p)}>
                  {p.content?.media_url ? (
                    p.content.media_type === "image" ? (
                      <img src={p.content.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", position: "relative" }}>
                        <video src={p.content.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", top: 4, right: 4, fontSize: 10 }}>🎥</div>
                      </div>
                    )
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, padding: 4, textAlign: "center", color: D.w3 }}>
                      {p.content?.caption?.substring(0, 30)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!loadingPosts && myPosts.length === 0 && (
            <div className="card" style={{ padding: 30, textAlign: "center", color: D.w3, fontSize: 13 }}>
               Você ainda não fez nenhuma publicação no feed.
            </div>
          )}
        </div>
      </div>

      {viewPost && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 10000, overflowY: "auto", padding: "40px 16px" }} onClick={() => setViewPost(null)}>
          <div style={{ maxWidth: 500, margin: "0 auto" }} onClick={e => e.stopPropagation()}>
            <PostCard post={viewPost} session={session} toast={toast} onNavigate={() => {}} />
            <button className="btn primary sm" style={{ width: "100%", marginTop: 12 }} onClick={() => setViewPost(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};




// ==================== ADVANCED SOCIAL COMPONENTS ====================

const CommentsModal = ({ post, session, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("*, profiles!inner(full_name, avatar_url, username)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    if (data) setComments(data);
    setLoading(false);
  };

  const submitComment = async () => {
    if (!text.trim() || !session?.id) return;
    const { data, error } = await supabase.from("comments").insert({
      post_id: post.id,
      user_id: session.id,
      content: text
    }).select("*, profiles!inner(full_name, avatar_url, username)").single();
    if (!error && data) {
      setComments([...comments, data]);
      setText("");
      onCommentAdded();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "flex-end", backdropFilter: "blur(4px)" }}>
       <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="card" style={{ background: D.bg, width: "100%", height: "75vh", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, display: "flex", flexDirection: "column", boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Comentários</div>
            <button onClick={onClose} style={{ background: D.bg2, border: "none", color: D.w3, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
         </div>
         
         <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, paddingBottom: 20 }}>
            {loading ? <div style={{ padding: 40, textAlign: "center" }}><DvsSpin s={24} c={D.blue} /></div> : (
              comments.length > 0 ? comments.map(c => (
                <div key={c.id} style={{ display: "flex", gap: 12 }}>
                  <div 
                    onClick={() => { onClose(); onNavigate("public_profile", c.user_id); }}
                    style={{ width: 36, height: 36, borderRadius: 12, background: D.s3, overflow: "hidden", flexShrink: 0, cursor: "pointer" }}
                  >
                     {c.profiles?.avatar_url && <img src={c.profiles.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ background: D.bg2, padding: "10px 14px", borderRadius: 16, flex: 1 }}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div 
                          onClick={() => { onClose(); onNavigate("public_profile", c.user_id); }}
                          style={{ fontWeight: 800, fontSize: 13, cursor: "pointer" }}
                        >
                          {c.profiles?.full_name || "Usuário"} <span style={{ fontWeight: 400, color: D.w3, marginLeft: 4 }}>@{c.profiles?.username || "anon"}</span>
                        </div>
                        <div style={{ fontSize: 10, color: D.w3 }}>{new Date(c.created_at).toLocaleDateString()}</div>
                     </div>
                     <div style={{ fontSize: 14, color: D.w1, lineHeight: 1.4 }}>{c.content}</div>
                  </div>
                </div>
              )) : <div style={{ color: D.w3, fontSize: 14, textAlign: "center", padding: 40 }}>Ainda não há comentários. Seja o primeiro! 💬</div>
            )}
         </div>

         <div style={{ display: "flex", gap: 10, marginTop: 16, background: D.bg2, padding: 8, borderRadius: 20 }}>
            <input 
              className="inp" 
              placeholder="Adicionar um comentário..." 
              value={text} 
              onChange={e => setText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && submitComment()}
              style={{ flex: 1, border: "none", background: "transparent" }}
            />
            <button className="btn primary sm" onClick={submitComment} disabled={!text.trim()} style={{ borderRadius: 14 }}>Enviar</button>
         </div>
       </motion.div>
    </div>
  );
};

const PostCard = ({ post, session, toast, onNavigate }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.post_likes?.[0]?.count || 0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments?.[0]?.count || 0);
  
  useEffect(() => {
    if (!session?.id) return;
    supabase.from("post_likes").select("post_id").eq("post_id", post.id).eq("user_id", session.id).then(({ data }) => {
      if (data?.length) setLiked(true);
    });
    supabase.from("saved_posts").select("post_id").eq("post_id", post.id).eq("user_id", session.id).then(({ data }) => {
      if (data?.length) setSaved(true);
    });
  }, [post.id, session?.id]);

  const toggleLike = async () => {
    if (!session?.id) return toast("Faça login para curtir.", "warn");
    if (liked) {
      setLiked(false); setLikesCount(c => Math.max(0, c - 1));
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", session.id);
    } else {
      setLiked(true); setLikesCount(c => c + 1);
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: session.id });
    }
  };

  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (showFolderPicker && session?.id) {
       supabase.from("collections").select("*").eq("user_id", session.id).then(({ data }) => {
         if (data) setCollections(data);
       });
    }
  }, [showFolderPicker, session?.id]);

  const toggleSave = async (folderId = null) => {
    if (!session?.id) return toast("Faça login para salvar.", "warn");
    
    if (saved && !folderId) {
      setSaved(false);
      await supabase.from("saved_posts").delete().eq("post_id", post.id).eq("user_id", session.id);
      toast("Removido dos salvos.");
    } else {
      setSaved(true);
      await supabase.from("saved_posts").upsert({ post_id: post.id, user_id: session.id });
      
      if (folderId) {
         await supabase.from("collection_items").upsert({ collection_id: folderId, post_id: post.id });
         toast("Salvo na pasta!", "ok");
      } else {
         toast("Salvo como inspiração!", "ok");
      }
    }
    setShowFolderPicker(false);
  };

  return (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }} onClick={() => onNavigate("public_profile", post.user_id)}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: D.s3, overflow: "hidden" }}>
          {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{post.profiles?.full_name || "Criador Anônimo"}</div>
          <div style={{ fontSize: 11, color: D.w3 }}>{new Date(post.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      
      <div style={{ width: "100%", borderRadius: 12, background: D.bg2, border: `1px solid ${D.b0}`, overflow: "hidden" }}>
        {post.content?.media_url && (
          <div style={{ width: "100%", background: "#000", display: "flex", justifyContent: "center" }}>
            {post.content.media_type === "image" ? (
              <img src={post.content.media_url} style={{ maxWidth: "100%", maxHeight: 500, objectFit: "contain" }} />
            ) : (
              <video src={post.content.media_url} controls style={{ maxWidth: "100%", maxHeight: 500 }} />
            )}
          </div>
        )}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: D.w2, whiteSpace: "pre-wrap" }}>
            {post.content?.caption || "Post visualizado."}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={toggleLike} style={{ background: "none", border: "none", color: liked ? D.rose : D.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            {liked ? "❤️" : "🤍"} {likesCount}
          </button>
          <button onClick={() => setShowComments(true)} style={{ background: "none", border: "none", color: D.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            💬 {commentsCount}
          </button>
          <button style={{ background: "none", border: "none", color: D.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            🚀
          </button>
        </div>
        <button onClick={() => setShowFolderPicker(true)} style={{ background: "none", border: "none", color: saved ? D.amber : D.w3, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          {saved ? "⭐" : "☆"}
        </button>
      </div>

      {showFolderPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
           <div className="card" style={{ background: D.bg, width: "100%", maxWidth: 350, padding: 24, borderRadius: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Salvar em...</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 300, overflowY: "auto" }}>
                 <button onClick={() => toggleSave()} style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${D.b0}`, background: D.bg2, color: D.w1, textAlign: "left", fontWeight: 700 }}>
                    ⭐ Geral (Sem pasta)
                 </button>
                 {collections.map(c => (
                   <button key={c.id} onClick={() => toggleSave(c.id)} style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${D.b0}`, background: D.bg2, color: D.w1, textAlign: "left", fontWeight: 700 }}>
                      📂 {c.name}
                   </button>
                 ))}
                 {collections.length === 0 && <div style={{ fontSize: 12, color: D.w3, textAlign: "center", padding: 10 }}>Você ainda não tem pastas. Vá em "Inspirar" para criar.</div>}
              </div>
              <button className="btn outline" onClick={() => setShowFolderPicker(false)}>Cancelar</button>
           </div>
        </div>
      )}

      {showComments && (
        <CommentsModal 
          post={post} 
          session={session} 
          onClose={() => setShowComments(false)} 
          onCommentAdded={() => setCommentsCount(c => c + 1)} 
        />
      )}
    </div>
  );
};



const Discover = ({ toast, session, onNavigate }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "Todos", icon: "🌈" },
    { id: "urban", label: "Urbano", icon: "🏙️" },
    { id: "portrait", label: "Retratos", icon: "👤" },
    { id: "vintage", label: "Vintage", icon: "🎞️" },
    { id: "nature", label: "Natureza", icon: "🌿" },
    { id: "preset", label: "Presets", icon: "🎨" }
  ];

  useEffect(() => {
    loadRecommendations();
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      searchSocial();
    } else {
      setResults([]);
    }
  }, [query, filter]);

  const loadRecommendations = async () => {
    setLoading(true);
    // Filter only users who have a full name and username (indicating they set up their profile)
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .not("full_name", "is", null)
      .not("username", "is", null)
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setRecommendations(data);
    setLoading(false);
  };

  const searchSocial = async () => {
    setLoading(true);
    let q = supabase.from("posts").select("*, profiles!inner(full_name, avatar_url, username)");
    
    if (query.startsWith("#")) {
       q = q.contains("tags", [query.substring(1)]);
    } else if (query.startsWith("@")) {
       q = q.ilike("profiles.username", `%${query.substring(1)}%`);
    } else {
       q = q.or(`caption.ilike.%${query}%, style.ilike.%${query}%, category.ilike.%${query}%`);
    }

    if (filter !== "all") {
       q = q.eq("category", filter);
    }

    const { data } = await q.limit(20);
    if (data) setResults(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
         <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: "-1px" }}>Descobrir</div>
         <div style={{ position: "relative" }}>
            <input 
              className="inp" 
              placeholder="Pesquise por @usuário, #hashtag, estilo..." 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              style={{ width: "100%", paddingLeft: 44, borderRadius: 20, height: 50, fontSize: 14 }}
            />
            <span style={{ position: "absolute", left: 16, top: 15, fontSize: 18 }}>🔍</span>
         </div>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
         {categories.map(c => (
           <button 
             key={c.id} 
             onClick={() => setFilter(c.id)}
             style={{ 
               flexShrink: 0, padding: "10px 20px", borderRadius: 100, border: "none", 
               background: filter === c.id ? D.blue : D.bg2, 
               color: filter === c.id ? "#fff" : D.w2,
               fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
               transition: "all 0.2s"
             }}
           >
             <span>{c.icon}</span> {c.label}
           </button>
         ))}
      </div>

      {query.trim().length > 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
           <div style={{ fontWeight: 800, fontSize: 16 }}>Resultados para "{query}"</div>
           {loading ? <div style={{ padding: 40, textAlign: "center" }}><DvsSpin s={24} c={D.blue} /></div> : (
             results.length > 0 ? (
               results.map(p => <PostCard key={p.id} post={p} session={session} toast={toast} onNavigate={onNavigate} />)
             ) : <div style={{ textAlign: "center", padding: 40, color: D.w3 }}>Nenhum resultado encontrado. 😕</div>
           )}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             <div style={{ fontWeight: 800, fontSize: 16 }}>Criadores Recomendados</div>
             <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
                {recommendations.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => onNavigate("public_profile", r.id)}
                    style={{ flexShrink: 0, width: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}
                  >
                     <div style={{ width: 70, height: 70, borderRadius: 24, background: D.s3, overflow: "hidden", border: `3px solid ${D.b2}` }}>
                        {r.avatar_url ? <img src={r.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>}
                     </div>
                     <div style={{ fontSize: 12, fontWeight: 800, textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.full_name}</div>
                     <div style={{ fontSize: 10, color: D.w3 }}>@{r.username || "criador"}</div>
                  </div>
                ))}
             </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             <div style={{ fontWeight: 800, fontSize: 16 }}>Tendências em {filter === "all" ? "Geral" : categories.find(c => c.id === filter).label}</div>
             {/* Feed of trending posts */}
             <div style={{ textAlign: "center", padding: 40, color: D.w3, fontSize: 13, background: D.bg2, borderRadius: 20 }}>
                Explore os estilos que estão bombando hoje! 🚀
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const PublicProfile = ({ userId, session, onBack, onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [viewPost, setViewPost] = useState(null);

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (pData) setProfile(pData);
    
    // Stats
    const { count: fCount } = await supabase.from("follows").select("*", { count: 'exact', head: true }).eq("following_id", userId);
    setFollowersCount(fCount || 0);

    if (session?.id) {
       const { data: fData } = await supabase.from("follows").select("*").eq("follower_id", session.id).eq("following_id", userId);
       setIsFollowing(fData && fData.length > 0);
    }

    // Posts
    const { data: ptData } = await supabase
      .from("posts")
      .select("*, profiles!inner(full_name, avatar_url, username)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (ptData) setPosts(ptData);

    // Collections
    const { data: colData } = await supabase.from("collections").select("*").eq("user_id", userId).eq("is_public", true);
    if (colData) setCollections(colData);
    
    setLoading(false);
  };

  const toggleFollow = async () => {
    if (!session?.id) return;
    if (isFollowing) {
      setIsFollowing(false); setFollowersCount(c => Math.max(0, c - 1));
      await supabase.from("follows").delete().eq("follower_id", session.id).eq("following_id", userId);
    } else {
      setIsFollowing(true); setFollowersCount(c => c + 1);
      await supabase.from("follows").insert({ follower_id: session.id, following_id: userId });
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><DvsSpin s={30} c={D.blue} /></div>;
  if (!profile) return <div style={{ padding: 40, textAlign: "center", color: D.w3 }}>Perfil não encontrado. <button className="btn outline" onClick={onBack}>Voltar</button></div>;

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 20 }}>
      <button className="btn ghost sm" onClick={onBack} style={{ alignSelf: "flex-start" }}>⬅️ Voltar</button>
      
      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 90, height: 90, borderRadius: 30, background: D.s3, overflow: "hidden", border: `4px solid ${D.b2}` }}>
             {profile.avatar_url ? <img src={profile.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👤</div>}
          </div>
          <div style={{ position: "absolute", bottom: -5, right: -5, width: 28, height: 28, borderRadius: 10, background: D.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div>
        </div>
        
        <div>
           <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>{profile.full_name}</div>
           <div style={{ fontSize: 14, color: D.w3, fontWeight: 600 }}>@{profile.username || "criador"}</div>
           <div style={{ fontSize: 13, color: D.blue2, fontWeight: 700, marginTop: 4 }}>{profile.professional_role || "EduCreator Artist"}</div>
           {profile.relationship_status && (
              <div style={{ fontSize: 12, color: D.rose, marginTop: 4, fontWeight: 600 }}>❤️ {profile.relationship_status}</div>
           )}
        </div>

        <div style={{ display: "flex", gap: 30 }}>
           <div><div style={{ fontWeight: 900, fontSize: 18 }}>{followersCount}</div><div style={{ fontSize: 11, color: D.w3, fontWeight: 700 }}>Seguidores</div></div>
           <div><div style={{ fontWeight: 900, fontSize: 18 }}>{posts.length}</div><div style={{ fontSize: 11, color: D.w3, fontWeight: 700 }}>Posts</div></div>
        </div>

        {profile.bio && <div style={{ fontSize: 14, color: D.w2, maxWidth: 300, lineHeight: 1.5 }}>{profile.bio}</div>}
        
        <div style={{ display: "flex", gap: 12 }}>
           {profile.instagram_url && <button onClick={() => window.open(`https://instagram.com/${profile.instagram_url.replace("@","")}`, "_blank")} style={{ background: D.bg2, border: "none", width: 40, height: 40, borderRadius: 12, fontSize: 18 }}>📸</button>}
           {profile.tiktok_url && <button onClick={() => window.open(`https://tiktok.com/@${profile.tiktok_url.replace("@","")}`, "_blank")} style={{ background: D.bg2, border: "none", width: 40, height: 40, borderRadius: 12, fontSize: 18 }}>🎵</button>}
           <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast("Link do perfil copiado!"); }} style={{ background: D.bg2, border: "none", width: 40, height: 40, borderRadius: 12, fontSize: 18 }}>🔗</button>
        </div>

        {session?.id !== userId && (
          <button 
            onClick={toggleFollow} 
            className={`btn ${isFollowing ? "outline" : "primary"}`} 
            style={{ width: "100%", height: 48, borderRadius: 16 }}>
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${D.b0}` }}>
         {["posts", "reels", "coleções"].map(t => (
           <button 
             key={t} 
             onClick={() => setTab(t)}
             style={{ flex: 1, padding: "12px 0", background: "none", border: "none", borderBottom: tab === t ? `3px solid ${D.blue}` : "none", color: tab === t ? D.w1 : D.w3, fontWeight: 800, fontSize: 13, textTransform: "capitalize" }}
           >
             {t}
           </button>
         ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: tab === "coleções" ? "1fr 1fr" : "1fr 1fr 1fr", gap: 6 }}>
        {tab === "posts" && posts.map(p => (
           <div key={p.id} onClick={() => setViewPost(p)} style={{ aspectRatio: "1/1", background: D.bg2, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
              {p.content?.media_url ? (
                p.content.media_type === "image" ? <img src={p.content.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <video src={p.content.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : <div style={{ padding: 10, fontSize: 10, color: D.w3 }}>{p.content?.caption}</div>}
           </div>
        ))}
        {tab === "reels" && posts.filter(p => p.content?.media_type === "video").map(p => (
           <div key={p.id} style={{ aspectRatio: "9/16", background: D.bg2, borderRadius: 12, overflow: "hidden" }}>
              <video src={p.content.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
           </div>
        ))}
        {tab === "coleções" && collections.map(c => (
           <div key={c.id} style={{ background: D.bg2, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ aspectRatio: "1/1", background: D.s3, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📁</div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{c.name}</div>
           </div>
        ))}
      </div>

      {viewPost && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 10000, overflowY: "auto", padding: "40px 16px" }} onClick={() => setViewPost(null)}>
          <div style={{ maxWidth: 500, margin: "0 auto" }} onClick={e => e.stopPropagation()}>
            <PostCard post={viewPost} session={session} toast={() => {}} onNavigate={() => {}} />
            <button className="btn primary sm" style={{ width: "100%", marginTop: 12 }} onClick={() => setViewPost(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const SavedPosts = ({ toast, session, onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all"); // all | folders
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    if (session?.id) {
      loadSaved();
      loadCollections();
    }
  }, [session?.id, selectedFolder]);

  const loadSaved = async () => {
    setLoading(true);
    let q = supabase.from("saved_posts").select("post_id, posts(*, profiles!inner(full_name, avatar_url, username))");
    
    if (selectedFolder) {
       // Filter by collection
       const { data: ci } = await supabase.from("collection_items").select("post_id").eq("collection_id", selectedFolder.id);
       const ids = ci?.map(i => i.post_id) || [];
       q = q.in("post_id", ids);
    }

    const { data } = await q.eq("user_id", session.id).order("created_at", { ascending: false });
    if (data) setPosts(data.map(d => d.posts) || []);
    setLoading(false);
  };

  const loadCollections = async () => {
    const { data } = await supabase.from("collections").select("*").eq("user_id", session.id);
    if (data) setCollections(data);
  };

  const createFolder = async () => {
    const name = prompt("Nome da nova pasta:");
    if (!name) return;
    const { data, error } = await supabase.from("collections").insert({ name, user_id: session.id }).select().single();
    if (data) setCollections([...collections, data]);
  };

  if (loading && posts.length === 0) return <div style={{ padding: 40, textAlign: "center" }}><DvsSpin s={30} c={D.amber} /></div>;

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 24 }}>Inspirações</div>
         <button className="btn ghost sm" onClick={createFolder} style={{ fontSize: 24 }}>📁+</button>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
         <button onClick={() => { setSelectedFolder(null); setView("all"); }} style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 12, border: "none", background: !selectedFolder ? D.amber : D.bg2, color: !selectedFolder ? "#fff" : D.w2, fontWeight: 700, fontSize: 13 }}>Tudo</button>
         {collections.map(c => (
           <button 
             key={c.id} 
             onClick={() => { setSelectedFolder(c); setView("folders"); }}
             style={{ 
               flexShrink: 0, padding: "8px 16px", borderRadius: 12, border: "none", 
               background: selectedFolder?.id === c.id ? D.amber : D.bg2, 
               color: selectedFolder?.id === c.id ? "#fff" : D.w2,
               fontWeight: 700, fontSize: 13 
             }}
           >
             {c.name}
           </button>
         ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {selectedFolder && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: D.bg2, padding: "12px 16px", borderRadius: 16 }}>
             <div style={{ fontWeight: 800, fontSize: 15 }}>📂 {selectedFolder.name}</div>
             <button className="btn ghost xs" onClick={() => setSelectedFolder(null)} style={{ color: D.rose }}>Fechar</button>
          </div>
        )}
        
        {posts.map(p => (
          <PostCard key={p.id} post={p} session={session} toast={toast} onNavigate={onNavigate} />
        ))}
        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: D.w3, background: D.bg2, borderRadius: 24, display: "flex", flexDirection: "column", gap: 10 }}>
             <div style={{ fontSize: 40 }}>⭐</div>
             <div>Sua galeria está vazia. Comece a explorar e salvar referências!</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================================================================

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
function App() {
  const [session, setSession] = useState(null);
  const [nav, setNav]         = useState("feed");
  const [publicUserId, setPublicUserId] = useState(null);

  const handleNavigate = useCallback((n, id = null) => {
    setPublicUserId(id);
    setNav(n);
  }, []);

  const [plan, setPlan]       = useState("free");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [postsUsed, setPostsUsed] = useState(0);
  const [songsChanged, setSongsChanged] = useState(0);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return;
    try {
        const { data } = await supabase.from('profiles').select('posts_used, music_swaps_used, plan, full_name, bio, phone, avatar_url, instagram_url, tiktok_url, youtube_url, relationship_status').eq('id', userId).single();
        if (data) {
          setPostsUsed(data.posts_used || 0);
          setSongsChanged(data.music_swaps_used || 0);
          if (data.plan) setPlan(data.plan);
          
          setSession(prev => ({
            ...prev,
            name: data.full_name || prev?.name,
            bio: data.bio || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
            instagram_url: data.instagram_url || "",
            tiktok_url: data.tiktok_url || "",
            youtube_url: data.youtube_url || "",
            relationship_status: data.relationship_status || ""
          }));
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
  const pLbls = { free: "Gratuito", social: "Criador", student: "Pro", full: "Ilimitado" };

  const NAV = [
    { id: "feed",      l: "Descobrir", e: "🌐" },
    { id: "criador",   l: "Criador",   e: "📸" },
    { id: "salvos",    l: "Inspirar",  e: "⭐" },
    { id: "planos",    l: "Planos",    e: "💳" },
    { id: "perfil",    l: "Perfil",    e: "👤" },
  ];

  const [isResetting, setIsResetting] = useState(false);

  if (loadingAuth) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: D.bg }}><DvsSpin s={40} c={D.blue} /></div>;

  if (!session || isResetting) return (
    <>
      <style>{CSS}</style>
      <AuthScreen onLogin={handleLogin} onResetMode={setIsResetting} />
      <Toasts items={toasts} del={del} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: D.bg, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <header style={{ position:"sticky", top:0, zIndex:400, background:`${D.bg}f2`, backdropFilter:"blur(20px)", borderBottom:`1px solid ${D.b0}`, padding:"12px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, overflow: 'hidden', flexShrink:0, boxShadow:"0 0 16px rgba(37,99,235,.3)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)" }}>
              <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="DVS Logo" />
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
            {nav === "feed"      && <Discover   toast={toast} session={session} onNavigate={handleNavigate} />}
            {nav === "criador"   && <Criador   toast={toast} session={session} plan={plan} setPostsUsed={setPostsUsed} songsChanged={songsChanged} setSongsChanged={setSongsChanged} onNavigate={handleNavigate} />}
            {nav === "salvos"    && <SavedPosts toast={toast} session={session} onNavigate={handleNavigate} />}
            {nav === "planos"    && <Planos    plan={plan} setPlan={handleSetPlan} toast={toast} />}
            {nav === "perfil"    && <Perfil    session={session} plan={plan} postsUsed={postsUsed} songsChanged={songsChanged} onLogout={handleLogout} onUpdateSession={handleUpdateSession} toast={toast} onNavigate={handleNavigate} />}
            {nav === "public_profile" && <PublicProfile userId={publicUserId} session={session} onBack={() => handleNavigate("feed")} onNavigate={handleNavigate} />}
          </main>

          <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:500, zIndex:300, background:`${D.s1}f8`, backdropFilter:"blur(24px)", borderTop:`1px solid ${D.b0}`, padding:"7px 4px 16px", display:"flex" }}>
            {NAV.map(item => {
              const active = nav === item.id;
              return (
                <button key={item.id} className="nav-item" onClick={() => setNav(item.id)}>
                  {active && <div style={{ position:"absolute", top:-7, left:"50%", transform:"translateX(-50%)", width:24, height:3, background:D.gBlue, borderRadius:99 }}/>}
                  <div style={{ width:40, height:40, borderRadius:13, background:active?D.blueLo:"transparent", display:"flex", alignItems:"center", justifyContent: "center", transition:"background .18s" }}>
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
