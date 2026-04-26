const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update AuthScreen submit logic
const oldSubmit = `  const submit = async () => {
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
        setErrors({ pass: \`E-mail ou senha incorretos.\${rem > 0 ? \` \${rem} tentativa(s) restante(s).\` : ""}\` });
        // shake the card
        const card = document.getElementById("auth-card");
        if (card) { card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); }
        setLoading(false); setLoadMsg(""); return;
      }
      if (remember) saveSession({ ...{}, rememberMe: true });
      setLoadMsg(\`Bem-vindo de volta, \${user.name.split(" ")[0]}! 🎉\`); await sleep(500);
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
    }`;

const newSubmit = `  const submit = async () => {
    if (!validate() || loading || locked) return;
    setLoading(true);

    /* ── LOGIN ── */
    if (page === "login") {
      setLoadMsg("Autenticando...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: pass,
      });

      if (error) {
        setErrors({ pass: "E-mail ou senha incorretos." });
        setLoading(false); setLoadMsg(""); return;
      }

      setLoadMsg("Carregando perfil...");
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      
      const sessionData = { 
        id: data.user.id,
        email: data.user.email, 
        name: data.user.user_metadata?.full_name || data.user.email.split('@')[0], 
        plan: profile?.plan || "free" 
      };
      onLogin(sessionData);
      return;
    }

    /* ── REGISTER ── */
    if (page === "register") {
      if (step === 1) {
        setStep(2); setLoading(false); return;
      }
      if (step === 2) {
        setLoadMsg("Criando conta...");
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: pass,
          options: {
            data: { full_name: name.trim() }
          }
        });

        if (error) {
          setErrors({ email: error.message });
          setLoading(false); setLoadMsg(""); return;
        }

        if (data?.user?.identities?.length === 0) {
           setErrors({ email: "Este e-mail já está em uso." });
           setLoading(false); setLoadMsg(""); return;
        }

        setLoadMsg("Conta criada! Redirecionando...");
        const sessionData = { 
          id: data.user.id,
          email: data.user.email, 
          name: name.trim(), 
          plan: "free" 
        };
        onLogin(sessionData);
        return;
      }
    }`;

content = content.replace(oldSubmit, newSubmit);
content = content.replace(oldSubmit.replace(/\n/g, '\r\n'), newSubmit);

// 2. Update App component logic for session and plan
const oldAppInit = `  const [session, setSession] = useState(() => getSession());
  const [nav, setNav]         = useState("criador");
  const [plan, setPlan]       = useState(() => {
    const s = getSession();
    if (!s) return "free";
    try { return getUsers()[s.email]?.plan || "free"; } catch { return "free"; }
  });`;

const newAppInit = `  const [session, setSession] = useState(null);
  const [nav, setNav]         = useState("criador");
  const [plan, setPlan]       = useState("free");
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
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

content = content.replace(oldAppInit, newAppInit);
content = content.replace(oldAppInit.replace(/\n/g, '\r\n'), newAppInit);

// 3. Update handleSetPlan to save to Supabase
const oldSetPlan = `  const handleSetPlan = useCallback((p) => {
    setPlan(p);
    if (session?.email) {
      const users = getUsers(); if (users[session.email]) { users[session.email].plan = p; saveUsers(users); }
      const newSess = { ...session, plan: p }; saveSession(newSess); setSession(newSess);
    }
  }, [session]);`;

const newSetPlan = `  const handleSetPlan = useCallback(async (p) => {
    setPlan(p);
    if (session?.id) {
      await supabase.from('profiles').update({ plan: p }).eq('id', session.id);
      setSession(s => ({ ...s, plan: p }));
    }
  }, [session]);`;

content = content.replace(oldSetPlan, newSetPlan);
content = content.replace(oldSetPlan.replace(/\n/g, '\r\n'), newSetPlan);

// 4. Update handleLogout
const oldLogout = `  const handleLogout = useCallback(() => {
    clearSession(); setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);`;

const newLogout = `  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null); setPlan("free"); setNav("criador");
    toast("Você saiu da conta.", "info");
  }, [toast]);`;

content = content.replace(oldLogout, newLogout);
content = content.replace(oldLogout.replace(/\n/g, '\r\n'), newLogout);

// 5. Add loading check in main render
const oldNotLoggedIn = `  if (!session) return (
    <>
      <style>{CSS}</style>
      <AuthScreen onLogin={handleLogin} />
      <Toasts items={toasts} del={del} />
    </>
  );`;

const newNotLoggedIn = `  if (loadingAuth) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: D.bg }}><Spin s={40} c={D.blue} /></div>;

  if (!session) return (
    <>
      <style>{CSS}</style>
      <AuthScreen onLogin={handleLogin} />
      <Toasts items={toasts} del={del} />
    </>
  );`;

content = content.replace(oldNotLoggedIn, newNotLoggedIn);
content = content.replace(oldNotLoggedIn.replace(/\n/g, '\r\n'), newNotLoggedIn);

fs.writeFileSync(path, content, 'utf8');
console.log('App.jsx updated with Supabase Auth logic');
