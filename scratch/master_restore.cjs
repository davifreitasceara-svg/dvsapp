const fs = require('fs');

const appPath = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
const backupPath = 'c:/Users/PC GAMER/Downloads/DVSEduCreator_1.jsx';

// 1. Restore fresh
let app = fs.readFileSync(backupPath, 'utf8');

// 2. Fix Google Only (from my previous fix)
const appAuthStart = app.indexOf('const AuthScreen = ({ onLogin }) => {');
const appAuthEnd = app.indexOf('\\n/* ═══════════════════════════════════════════════\\n   PERFIL');
if (appAuthStart !== -1 && appAuthEnd !== -1) {
  let authBlock = app.slice(appAuthStart, appAuthEnd);
  // remove apple and facebook
  const appleBlock = `<SocialBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                label="Apple"
                onClick={() => { setErrors({ email: "Login com Apple em breve." }); }}
              />`;
  const facebookBlock = `<SocialBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                label="Facebook"
                onClick={() => { setErrors({ email: "Login com Facebook em breve." }); }}
              />`;
  authBlock = authBlock.replace(appleBlock, '').replace(facebookBlock, '');

  const googleOld = `onClick={() => { setErrors({ email: "Login com Google em breve." }); }}`;
  const googleNew = `onClick={async () => { setLoading(true); if (typeof supabase !== 'undefined') { const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); if (error) { setErrors({ email: "Erro: " + error.message }); setLoading(false); } } else { setErrors({ email: "Supabase não configurado." }); setLoading(false); } }}`;
  authBlock = authBlock.replace(googleOld, googleNew);

  app = app.substring(0, appAuthStart) + authBlock + app.substring(appAuthEnd);
  
  if (!app.includes('import { supabase }')) {
    app = app.replace('import { useState, useRef, useCallback, useEffect } from "react";', 'import { useState, useRef, useCallback, useEffect } from "react";\\nimport { supabase } from "./services/supabase";');
  }
}

// 3. Inject Overlays
const targetOverlay = `                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}`;
const replacementOverlay = `                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}
                {selMusic && (
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 12, backdropFilter: "blur(4px)" }}>
                    <span style={{ fontSize: 14 }}>🎵</span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{selMusic.title || selMusic.name || "Música selecionada"}</span>
                  </div>
                )}
                {caption && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)", padding: "40px 16px 16px 16px" }}>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, lineHeight: 1.4, margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.8)", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{caption}</p>
                  </div>
                )}`;
app = app.replace(targetOverlay, replacementOverlay);

// 4. Limit Upload
const targetUpload = `  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(\`✅ "\${f.name.slice(0, 24)}" carregado!\`, "ok");
  }, [toast]);`;
const repUpload = `  const handleFileChange = useCallback(async e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const limits = { free: 3, social: 5, student: 10, full: Infinity };
    const limit = limits[plan] || 3;
    let currentUsage = 0;
    if (plan !== "full" && session?.id) {
      toast("Verificando limite...", "info");
      const today = new Date().toISOString().split('T')[0];
      try {
        const { data: profile } = await supabase.from('profiles').select('posts_used, last_usage_reset').eq('id', session.id).single();
        if (profile) {
          if (profile.last_usage_reset !== today) { currentUsage = 0; } else { currentUsage = profile.posts_used; }
        }
        if (currentUsage >= limit) {
          toast(\`Limite diário de \${limit} posts atingido. Faça upgrade para o plano superior! 💎\`, "error");
          e.target.value = null; return;
        }
      } catch (err) {}
    }
    setFile(f); setFileURL(URL.createObjectURL(f)); setIsImg(f.type.startsWith("image"));
    toast(\`✅ "\${f.name.slice(0, 24)}" carregado!\`, "ok");
  }, [toast, plan, session]);`;
app = app.replace(targetUpload, repUpload);

// 5. Remove Estudante
app = app.replace(
  `{ id: "estudante", l: "Estudante", e: "📚" },`,
  ``
);
app = app.replace(
  `{nav === "estudante" && <Estudante toast={toast} session={session} plan={plan} />}`,
  ``
);
app = app.replace(`IA para criar conteúdo & estudar`, `IA para criar conteúdos incríveis`);
app = app.replace(`{["🔥 Conteúdo viral", "📚 Modo estudo", "🎵 Música real"].map`, `{["🔥 Conteúdo viral", "🎵 Música real", "🚀 Alto Engajamento"].map`);

// 6. APPLY VISUALS (SAFELY)
const oldDRegex = /const D = \{[\s\S]*?\};\n/m;
const newD = `const D = {
  bg:    "#031633",
  bg2:   "#051F45",
  bg3:   "#082959",
  s0:    "#0A326B",
  s1:    "#0D3D82",
  s2:    "#114999",
  s3:    "#1656B3",
  b0:    "#0E3875",
  b1:    "#154791",
  b2:    "#1D5BB3",
  blue:  "#8BB4F5",
  blue2: "#A8CBFA",
  blue3: "#CBE0FC",
  blueLo:"rgba(139,180,245,.15)",
  blueM: "rgba(139,180,245,.3)",
  cyan:  "#22D3EE", cyanLo:"rgba(34,211,238,.1)",
  mint:  "#34D399", mintLo:"rgba(52,211,153,.1)",
  rose:  "#FB7185", roseLo:"rgba(251,113,133,.1)",
  amber: "#FBBF24", amberLo:"rgba(251,191,36,.1)",
  w1:    "#F1F5F9",
  w2:    "#CBD5E1",
  w3:    "#94A3B8",
  gBlue: "linear-gradient(135deg,#0D3D82 0%,#1656B3 100%)",
  gCyan: "linear-gradient(135deg,#0284C7 0%,#06B6D4 100%)",
  gMint: "linear-gradient(135deg,#059669 0%,#10B981 100%)",
  gRose: "linear-gradient(135deg,#E11D48 0%,#F43F5E 100%)",
  gAmber:"linear-gradient(135deg,#D97706 0%,#F59E0B 100%)",
  gDark: "linear-gradient(135deg,#051F45 0%,#031633 100%)",
};\n`;
app = app.replace(oldDRegex, newD);

const cssRegex = /@import url\('https:\/\/fonts\.googleapis\.com\/css2.*?/;
app = app.replace(cssRegex, `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cinzel:wght@700;800&family=Sora:wght@700;800&display=swap');`);

app = app.replace(/DVS EduCreator/g, "DVSCREATOR");

// Replace Logos safely! We know exactly where they are:
// In AuthScreen header:
app = app.replace(
  `<div style={{ width: 80, height: 80, borderRadius: 26, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 0 6px rgba(37,99,235,.1), 0 0 0 14px rgba(37,99,235,.05), 0 10px 36px rgba(37,99,235,.38)" }}>
              ✨
            </div>`,
  `<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}>
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E6E8E6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E6E8E6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E6E8E6" />
              <rect x="38" y="22" width="24" height="52" rx="2" fill={D.bg} />
              <circle cx="50" cy="79" r="2.5" fill={D.bg} />
              <rect x="45" y="18" width="10" height="1.5" rx="0.75" fill={D.bg} />
              <rect x="41" y="26" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="48" y="26" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="55" y="26" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="41" y="34" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="48" y="34" width="4" height="4" rx="1" fill="none" stroke="#E6E8E6" strokeWidth="1.2" />
              <rect x="55" y="34" width="4" height="4" rx="1" fill="#E6E8E6" />
              <path d="M 41 45 L 43.5 42.5 L 41 40 M 44.5 45 L 48 45 M 41 52 L 43.5 49.5 L 41 47 M 44 54 L 56 54 M 44 57 L 51 57" stroke="#E6E8E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>`
);

// In App Header:
app = app.replace(
  `<div style={{ width:38, height:38, borderRadius:12, background:D.gBlue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, boxShadow:"0 0 16px rgba(37,99,235,.3)" }}>✨</div>`,
  `<svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }}>
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E6E8E6" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E6E8E6" strokeWidth="6" fill="none" strokeLinecap="round" />
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E6E8E6" />
              <rect x="38" y="22" width="24" height="52" rx="2" fill={D.bg} />
            </svg>`
);

app = app.split('fontFamily:"\'Sora\',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"-.2px"').join('fontFamily:"\'Cinzel\', serif", fontWeight:800, fontSize:20, letterSpacing:"1px"');
app = app.split('fontFamily: "\'Sora\',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 5').join('fontFamily: "\'Cinzel\', serif", fontWeight: 800, fontSize: 28, marginBottom: 5, letterSpacing: "1px"');
app = app.split('fontFamily: "\'Sora\',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px"').join('fontFamily: "\'Cinzel\', serif", fontWeight: 800, fontSize: 32, letterSpacing: "1px"');
app = app.split('fontFamily: "\'Sora\',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-.3px"').join('fontFamily: "\'Cinzel\', serif", fontWeight: 800, fontSize: 26, letterSpacing: "1px"');
app = app.split('Modo Criador 🔥').join('DVSCREATOR');

fs.writeFileSync(appPath, app, 'utf8');
console.log("Master restore completed successfully.");
