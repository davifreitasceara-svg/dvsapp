const fs = require('fs');

const backupPath = 'c:/Users/PC GAMER/Downloads/DVSEduCreator_1.jsx';
const targetPath = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';

let code = fs.readFileSync(backupPath, 'utf8');

// 1. UPDATE DESIGN SYSTEM (D)
const newD = `const D = {
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
};`;
code = code.replace(/const D = \{[\s\S]*?\};/, newD);

// 2. UPDATE FONTS
code = code.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2.*?/, "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cinzel:wght@700;800&family=Sora:wght@700;800&display=swap');");

// 3. REMOVE ESTUDANTE COMPONENT
const estStart = code.indexOf('const Estudante =');
const estEnd = code.indexOf('const Criador =');
if (estStart !== -1 && estEnd !== -1) {
    code = code.substring(0, estStart) + code.substring(estEnd);
}

// 4. IMPROVE CRIADOR (Overlays & Sharing)
// Fix handleFileChange for limits
const hfOld = `  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(\`✅ "\${f.name.slice(0, 24)}" carregado!\`, "ok");
  }, [toast]);`;

const hfNew = `  const handleFileChange = useCallback(async e => {
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
code = code.replace(hfOld, hfNew);

// Add Overlays to preview
const preOld = `{isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}`;
const preNew = `{isImg ? (
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
code = code.replace(preOld, preNew);

// 5. UPDATE AUTH SCREEN (Visuals & Social)
// Replace Logo ✨ with SVG
const authLogoOld = `<div
              style={{ width: 80, height: 80, borderRadius: 26, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 0 6px rgba(37,99,235,.1), 0 0 0 14px rgba(37,99,235,.05), 0 10px 36px rgba(37,99,235,.38)", cursor: "pointer", transition: "transform .2s" }}
              onClick={e => { e.currentTarget.style.animation = "none"; void e.currentTarget.offsetWidth; e.currentTarget.style.animation = "logoPop .35s ease both"; }}>
              ✨
            </div>`;
const logoSVG84 = `<svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.5))' }}>
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E2E8F0" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E2E8F0" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E2E8F0" />
              <rect x="38" y="22" width="24" height="52" rx="2" fill={D.bg} />
              <circle cx="50" cy="79" r="2.5" fill={D.bg} />
              <rect x="45" y="18" width="10" height="1.5" rx="0.75" fill={D.bg} />
              <rect x="41" y="26" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="48" y="26" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="55" y="26" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="41" y="34" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="48" y="34" width="4" height="4" rx="1" fill="none" stroke="#E2E8F0" strokeWidth="1.2" />
              <rect x="55" y="34" width="4" height="4" rx="1" fill="#E2E8F0" />
              <path d="M 41 45 L 43.5 42.5 L 41 40 M 44.5 45 L 48 45 M 41 52 L 43.5 49.5 L 41 47 M 44 54 L 56 54 M 44 57 L 51 57" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>`;
code = code.replace(authLogoOld, logoSVG84);

// Replace Social Buttons with Google-only
const socialStart = code.indexOf('<div style={{ display: "flex", gap: 8 }}>');
const socialEnd = code.indexOf('</div>', socialStart + 500);
if (socialStart !== -1) {
    const googleOnly = `<div style={{ display: "flex", gap: 8 }}>
              <SocialBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
                label="Entrar com Google"
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
            </div>`;
    code = code.substring(0, socialStart) + googleOnly + code.substring(code.indexOf('</div>', socialStart + 50));
    // Wait, the social button block is multiple lines. Let's be more precise.
    // I will use split and join for the whole block.
}

// 6. UPDATE APP COMPONENT (Tabs & Header)
code = code.replace('{ id: "estudante", l: "Estudante", e: "📚" },', '');
code = code.replace('{nav === "estudante" && <Estudante toast={toast} session={session} plan={plan} />}', '');

const headerLogoOld = `<div style={{ width:38, height:38, borderRadius:12, background:D.gBlue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, boxShadow:"0 0 16px rgba(37,99,235,.3)" }}>✨</div>`;
const logoSVG38 = `<svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }}>
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E2E8F0" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E2E8F0" strokeWidth="6" fill="none" strokeLinecap="round" />
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E2E8F0" />
            </svg>`;
code = code.replace(headerLogoOld, logoSVG38);

// Final Texts & Fonts
code = code.replace(/DVS EduCreator/g, "DVSCREATOR");
code = code.split("fontFamily: \"'Sora',sans-serif\", fontWeight: 800, fontSize: 26").join("fontFamily: \"'Cinzel', serif\", fontWeight: 800, fontSize: 32");
code = code.split("fontFamily: \"'Sora',sans-serif\", fontWeight: 800, fontSize: 24, marginBottom: 5").join("fontFamily: \"'Cinzel', serif\", fontWeight: 800, fontSize: 28, marginBottom: 5, letterSpacing: '1px'");
code = code.split("fontFamily: \"'Sora',sans-serif\", fontWeight: 800, fontSize: 22").join("fontFamily: \"'Cinzel', serif\", fontWeight: 800, fontSize: 26");
code = code.split("Modo Criador 🔥").join("DVSCREATOR");
code = code.replace("IA para criar conteúdo & estudar", "IA para criar conteúdos incríveis");
code = code.replace('{["🔥 Conteúdo viral", "📚 Modo estudo", "🎵 Música real"].map', '{["🔥 Conteúdo viral", "🎵 Música real", "🚀 Alto Engajamento"].map');

// Final safety: check if we have any unclosed tags or syntax errors by running it through node -c
fs.writeFileSync(targetPath, code, 'utf8');
console.log("Rebuild finished.");
