const fs = require('fs');

const appPath = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
const backupPath = 'c:/Users/PC GAMER/Downloads/DVSEduCreator_1.jsx';

let app = fs.readFileSync(appPath, 'utf8');
const backup = fs.readFileSync(backupPath, 'utf8');

// Extract the original AuthScreen + helpers from backup (lines 1520-2240)
// We need: DB_KEY, SESSION_KEY, getUsers, saveUsers, getSession, saveSession, clearSession,
//          hashPass, RL, gerarSenhaForte, senhaForte, and the full AuthScreen component

const backupHelpers = `/* ═══════════════════════════════════════════════
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
  let h = 0;
  for (let i = 0; i < p.length; i++) { h = Math.imul(31, h) + p.charCodeAt(i) | 0; }
  return h.toString(36);
}`;

// Extract from backup the RL + makeCode + AuthScreen block
const backupStart = backup.indexOf('/* Rate limiter local');
const backupEnd = backup.indexOf('\n/* ═══════════════════════════════════════════════\n   PERFIL');
const originalAuthBlock = backup.slice(backupStart, backupEnd).trim();

// What we want to replace in App.jsx:
// From the current RL block to end of AuthScreen (line 1999-2179)
const replaceStart = app.indexOf('/* ── fmt: ms → m:ss ── */');
const replaceEnd = app.indexOf('\n\nconst Perfil');

if (replaceStart === -1) {
  console.log('ERROR: Could not find fmt marker');
  process.exit(1);
}
if (replaceEnd === -1) {
  console.log('ERROR: Could not find Perfil marker');
  process.exit(1);
}

const newBlock = `/* ── fmt: ms → m:ss ── */
const fmt = (ms) => {
  if (!ms || isNaN(ms)) return "0:00";
  const s = Math.floor(ms / 1000);
  return \`\${Math.floor(s / 60)}:\${String(s % 60).padStart(2, "0")}\`;
};

/* ── Field: reutilizável ── */
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

${backupHelpers}

${originalAuthBlock}`;

app = app.slice(0, replaceStart) + newBlock + app.slice(replaceEnd);

// Also fix the App function to use localStorage instead of Supabase auth
// Replace the useEffect that uses supabase.auth.onAuthStateChange
const supabaseAuthEffect = `  useEffect(() => {
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

const localStorageInit = `  useEffect(() => {
    // Load session from localStorage
    const sess = getSession();
    if (sess) {
      setSession(sess);
      try { const u = getUsers()[sess.email]; if (u?.plan) setPlan(u.plan); } catch {}
    }
    setLoadingAuth(false);
  }, []);`;

app = app.replace(supabaseAuthEffect, localStorageInit);

// Fix the App state init — session starts null (not from Supabase listener)
// Fix handleLogout to use clearSession instead of supabase.auth.signOut
app = app.replace(
  `  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);`,
  `  const handleLogout = useCallback(() => {
    clearSession(); setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);`
);

// Fix handleSetPlan to use localStorage instead of Supabase
app = app.replace(
  `  const handleSetPlan = useCallback(async (p) => {
    setPlan(p);
    if (session?.id) {
      await supabase.from('profiles').update({ plan: p }).eq('id', session.id);
      setSession(s => ({ ...s, plan: p }));
    }
  }, [session]);`,
  `  const handleSetPlan = useCallback((p) => {
    setPlan(p);
    if (session?.email) {
      const users = getUsers(); if (users[session.email]) { users[session.email].plan = p; saveUsers(users); }
      const newSess = { ...session, plan: p }; saveSession(newSess); setSession(newSess);
    }
  }, [session]);`
);

fs.writeFileSync(appPath, app, 'utf8');
console.log('SUCCESS: AuthScreen original restaurado!');
console.log('Helpers localStorage: OK');
console.log('handleLogout: localStorage');
console.log('handleSetPlan: localStorage');
