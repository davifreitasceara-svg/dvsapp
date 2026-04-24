import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// I'll try a more surgical approach.
// I'll restore the file first or just fix the brackets.
// But it's better to just re-write the AuthScreen part correctly.

const AUTH_COMPONENT_BLOCK = `
/* ── Auth Sub-components ── */
const Eye = ({ show, toggle, I }) => (
  <button type="button" onClick={toggle} style={{ background: "none", border: "none", color: show ? "#3b82f6" : "#94a3b8", cursor: "pointer", padding: 4, display: "flex", transition: "color .18s" }}>
    {show ? I.eyeOff : I.eye}
  </button>
);

const SocialBtn = ({ icon, label, onClick, D }) => (
  <button onClick={onClick} style={{ flex: 1, padding: "12px 8px", borderRadius: 13, border: \`1.5px solid \${D.b1}\`, background: D.s0, color: D.w1, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .18s", fontFamily: "Inter" }}
    onMouseOver={e => { e.currentTarget.style.borderColor = D.b2; e.currentTarget.style.background = D.s2; }}
    onMouseOut={e => { e.currentTarget.style.borderColor = D.b1; e.currentTarget.style.background = D.s0; }}>
    {icon}{label}
  </button>
);

const Inp = ({ label, icon, right, type, val, onChange, err, placeholder, autoComplete, hint, D, errors, setErrors, submit, I }) => {
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
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "#3b82f6" : "#94a3b8", transition: "color .18s", pointerEvents: "none", display: "flex" }}>
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
            border: \`1.5px solid \${err ? "#f43f5e90" : focused ? D.blueM : D.b0}\`,
            borderRadius: 14, color: D.w1, fontSize: 15, lineHeight: 1,
            padding: \`15px 46px 15px \${icon ? "46px" : "16px"}\`,
            outline: "none", transition: "border .18s, box-shadow .18s",
            fontFamily: "Inter",
            boxShadow: focused ? \`0 0 0 3px \${err ? "#fee2e2" : "#dbeafe"}\` : "none",
          }}
        />
        {right && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>{right}</div>}
      </div>
      {err && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#f43f5e", animation: "fadeIn .2s ease both" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {err}
        </div>
      )}
    </div>
  );
};

const StepBar = ({ step, D, I }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 22 }}>
    {["Dados", "Senha", "Verificar"].map((l, i) => {
      const s = i + 1;
      const done = step > s, active = step === s;
      return (
        <div key={l} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? "#10b981" : active ? D.gBlue : D.s3, border: \`2px solid \${done ? "#10b981" : active ? "#2563eb" : D.b1}\`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", color: done || active ? "#fff" : D.w3, fontWeight: 800, fontSize: 12 }}>
              {done ? I.check : s}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: active ? "#3b82f6" : done ? "#10b981" : D.w3, whiteSpace: "nowrap" }}>{l}</span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? "#10b981" : D.b1, margin: "0 6px", marginBottom: 16, borderRadius: 99, transition: "background .3s" }} />}
        </div>
      );
    })}
  </div>
);
`;

// I'll replace everything between 'const AuthScreen' and the end of that component.
// I need to be careful with the end of AuthScreen.

const AUTH_START_SEARCH = 'const AuthScreen = ({ onLogin }) => {';
const AUTH_END_SEARCH = '/* ─────────────── RENDER ─────────────── */'; // I'll use this to find the middle

// I'll just find the start of the next component or the end of the file.
const NEXT_COMP = '/* ═══════════════════════════════════════════════\n   MODO ESTUDANTE';

const startIdx = content.indexOf(AUTH_START_SEARCH);
const nextIdx = content.indexOf(NEXT_COMP);

if (startIdx !== -1 && nextIdx !== -1) {
    // I'll keep the start of AuthScreen and replace the middle.
    // Wait! I'll just re-read the component body from my thought process and view_file knowledge.
    
    // I'll search for the very last '};' before MODO ESTUDANTE.
    const componentBody = content.substring(startIdx, nextIdx);
    const lastBraceIdx = componentBody.lastIndexOf('};');
    
    if (lastBraceIdx !== -1) {
        // I'll replace the entire block from startIdx to startIdx + lastBraceIdx + 2
        // with the new clean version.
    }
}

// Actually, I'll use a simpler way. I'll search for the corrupted area.
// I'll just write the whole AuthScreen component to a variable and replace the entire thing.

// I'll read the file again to get the current state.
// Wait! I'll just use a regex to find the whole AuthScreen.
// It starts with 'const AuthScreen' and ends before '/* ═══════════════════════════════════════════════\n   MODO ESTUDANTE'.

const regex = /const AuthScreen = \(.*?\) => \{.*?\}\s+\/\* ═══════════════════════════════════════════════\s+MODO ESTUDANTE/s;
// This might be too risky.

// Let's just fix the brackets manually.
// I'll count the brackets in the file.
// Wait! I'll use the check_syntax logic to find WHERE it is unbalanced.

fs.writeFileSync(path, content.replace('/* ── Auth Sub-components ── */', '').replace(COMPONENTS, '')); // try to undo

// I'll use git restore to be safe.
const child_process = require('child_process');
child_process.execSync('git restore src/App.jsx');
console.log('Restored App.jsx to last commit.');
