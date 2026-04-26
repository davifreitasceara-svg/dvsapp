const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let app = fs.readFileSync(path, 'utf8');

// 1. Add supabase import
if (!app.includes('import { supabase } from')) {
  app = app.replace(
    /import { useState, useRef, useCallback, useEffect } from "react";/,
    `import { useState, useRef, useCallback, useEffect } from "react";\nimport { supabase } from "./services/supabase";`
  );
}

// 2. Replace AuthScreen completely
const authScreenStart = app.indexOf('const AuthScreen = ({ onLogin }) => {');
const authScreenEnd = app.indexOf('\nconst Perfil =');

if (authScreenStart !== -1 && authScreenEnd !== -1) {
  const newAuthScreen = `const AuthScreen = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      alert("Erro ao fazer login: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: D.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", overflowY: "auto" }}>
      <style>{CSS}</style>
      
      {/* BG ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, left: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", bottom: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", top: "40%", right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 68%)" }} />
      </div>

      <div id="auth-card" className="auth-card" style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        
        {/* LOGO */}
        <div className="fu" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
            <div
              style={{ width: 80, height: 80, borderRadius: 26, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 0 6px rgba(37,99,235,.1), 0 0 0 14px rgba(37,99,235,.05), 0 10px 36px rgba(37,99,235,.38)" }}>
              ✨
            </div>
            {/* verified badge */}
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: D.gMint, border: \`2px solid \${D.bg}\`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
          </div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", lineHeight: 1.2 }}>DVS EduCreator</div>
          <div style={{ fontSize: 13, color: D.w2, marginTop: 5 }}>IA para criar conteúdo & estudar</div>
          
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            {["🔥 Conteúdo viral", "📚 Modo estudo", "🎵 Música real"].map((f, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: D.w3, background: D.s2, border: \`1px solid \${D.b0}\`, borderRadius: 99, padding: "4px 10px" }}>{f}</span>
            ))}
          </div>
        </div>

        {/* CARD */}
        <div className="card fu d2" style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 24, textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Acesso Exclusivo</div>
            <div style={{ fontSize: 13, color: D.w2, lineHeight: 1.5 }}>Faça login com sua conta Google para continuar criando conteúdos incríveis.</div>
          </div>

          <button
            onClick={handleGoogleLogin} disabled={loading}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: D.s0, border: \`1.5px solid \${D.b1}\`, color: D.w1, fontWeight: 700, fontSize: 14, fontFamily: "'Inter',sans-serif", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all .2s" }}
            onMouseOver={e => { if (!loading) { e.currentTarget.style.borderColor = D.b2; e.currentTarget.style.background = D.s2; } }}
            onMouseOut={e => { e.currentTarget.style.borderColor = D.b1; e.currentTarget.style.background = D.s0; }}
          >
            {loading ? <Spin s={18} c={D.blue2} /> : (
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            )}
            {loading ? "Conectando..." : "Continuar com Google"}
          </button>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: D.w3 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Acesso seguro com criptografia</span>
          </div>
        </div>

      </div>
    </div>
  );
};`;
  app = app.substring(0, authScreenStart) + newAuthScreen + app.substring(authScreenEnd);
}

// 3. Restore Supabase logic in App
// Replace App state init to use Supabase instead of localStorage
const appCompStart = app.indexOf('export default function App() {');
if (appCompStart !== -1) {
  const localAppStart = `export default function App() {
  const [session, setSession] = useState(() => getSession());
  const [nav, setNav]         = useState("criador");
  const [plan, setPlan]       = useState(() => {
    const s = getSession();
    if (!s) return "free";
    try { return getUsers()[s.email]?.plan || "free"; } catch { return "free"; }
  });
  const [toasts, setToasts] = useState([]);`;
  
  const supAppStart = `export default function App() {
  const [session, setSession] = useState(null);
  const [nav, setNav]         = useState("criador");
  const [plan, setPlan]       = useState("free");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [toasts, setToasts] = useState([]);`;
  
  app = app.replace(localAppStart, supAppStart);

  // Replace localStorage useEffect with Supabase useEffect
  const localEffect = `  useEffect(() => {
    // Load session from localStorage
    const sess = getSession();
    if (sess) {
      setSession(sess);
      try { const u = getUsers()[sess.email]; if (u?.plan) setPlan(u.plan); } catch {}
    }
    setLoadingAuth(false);
  }, []);`;
  
  const localEffectBackup = `  useEffect(() => {
    // nothing to do on mount if using useState init, but just in case
  }, []);`; // In case there's another useEffect
  
  const supEffect = `  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      if (sess?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', sess.user.id).single();
        const userData = {
          id: sess.user.id,
          email: sess.user.email,
          name: sess.user.user_metadata?.full_name || sess.user.email.split('@')[0],
          plan: profile?.plan || 'free'
        };
        setSession(userData);
        setPlan(userData.plan);
      } else {
        setSession(null);
        setPlan('free');
      }
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);`;
  
  if (app.includes(localEffect)) {
    app = app.replace(localEffect, supEffect);
  } else {
    // If not found, insert after toasts
    app = app.replace('  const [toasts, setToasts] = useState([]);\n', '  const [toasts, setToasts] = useState([]);\n\n' + supEffect + '\n');
  }

  // Handle Logout
  const localLogout = `  const handleLogout = useCallback(() => {
    clearSession(); setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);`;
  
  const supLogout = `  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);`;
  
  app = app.replace(localLogout, supLogout);

  // Handle SetPlan
  const localSetPlan = `  const handleSetPlan = useCallback((p) => {
    setPlan(p);
    if (session?.email) {
      const users = getUsers(); if (users[session.email]) { users[session.email].plan = p; saveUsers(users); }
      const newSess = { ...session, plan: p }; saveSession(newSess); setSession(newSess);
    }
  }, [session]);`;
  
  const supSetPlan = `  const handleSetPlan = useCallback(async (p) => {
    setPlan(p);
    if (session?.id) {
      await supabase.from('profiles').update({ plan: p }).eq('id', session.id);
      setSession(s => ({ ...s, plan: p }));
    }
  }, [session]);`;
  
  app = app.replace(localSetPlan, supSetPlan);

  // loadingAuth check
  const authGateLocal = `  /* ── not logged in → show auth ── */
  if (!session) return (`;
  
  const authGateSup = `  /* ── not logged in → show auth ── */
  if (loadingAuth) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: D.bg }}><Spin s={40} c={D.blue} /></div>;

  if (!session) return (`;
  
  if (!app.includes('if (loadingAuth) return')) {
    app = app.replace(authGateLocal, authGateSup);
  }
}

fs.writeFileSync(path, app, 'utf8');
console.log('SUCCESS');
