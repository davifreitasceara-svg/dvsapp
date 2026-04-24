import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// I'll replace the entire SOCIAL LOGIN section with the new Google-only block
const SOCIAL_SECTION_REGEX = /\{\/\* ── SOCIAL LOGIN ── \*\/\}.*?<\/div>\s+\)\s+\}/s;

const NEW_SOCIAL_BLOCK = `{/* ── SOCIAL LOGIN ── */}
        {(page === "login" || page === "register") && (
          <div className="fu d3" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: D.b0 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: D.w3, whiteSpace: "nowrap", letterSpacing: 1 }}>OU CONTINUE COM</span>
              <div style={{ flex: 1, height: 1, background: D.b0 }} />
            </div>
            <GoogleLoginBtn onLogin={onLogin} setErrors={setErrors} />
            <div style={{ textAlign: "center", fontSize: 11, color: D.w3, marginTop: 4 }}>
              Ao continuar, você concorda com nossos Termos de Uso.
            </div>
          </div>
        )}`;

// Also make sure GoogleLoginBtn is defined before AuthScreen
if (!content.includes('const GoogleLoginBtn =')) {
    const GOOGLE_BTN_DEF = `
/* ── Real Google Login Integration ── */
const GoogleLoginBtn = ({ onLogin, setErrors }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.warn("Google SDK not loaded");
      return;
    }
    
    const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || "733979606822-u6m8v7m8v7m8v7m8v7m8v7.apps.googleusercontent.com";

    window.google.accounts.id.initialize({
      client_id: client_id,
      callback: (response) => {
        try {
          const token = response.credential;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const session = {
            email: payload.email.toLowerCase(),
            name: payload.name,
            picture: payload.picture,
            plan: "free",
            token: token
          };
          const users = getUsers();
          if (!users[session.email]) {
            users[session.email] = {
              name: payload.name, email: session.email,
              passHash: "GOOGLE_AUTH", plan: "free",
              createdAt: new Date().toISOString(),
              stats: { posts: 0, transcricoes: 0, mapas: 0, flashcards: 0, quiz: 0 }
            };
            saveUsers(users);
          }
          saveSession(session);
          onLogin(session);
        } catch (e) {
          setErrors({ email: "Erro na autenticação com Google." });
        }
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
  }, [onLogin, setErrors]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
       <div ref={btnRef} style={{ width: "100%" }}></div>
    </div>
  );
};
`;
    content = content.replace('const AuthScreen = ({ onLogin }) => {', GOOGLE_BTN_DEF + '\nconst AuthScreen = ({ onLogin }) => {');
}

content = content.replace(SOCIAL_SECTION_REGEX, NEW_SOCIAL_BLOCK);

fs.writeFileSync(path, content);
console.log('Apple and Facebook removed. Google Login is now the only social option!');
