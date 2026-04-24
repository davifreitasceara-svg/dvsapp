import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// The issue is that I added 'D' to the props list, which shadows the global 'D' constant.
// Since 'D' is global, we don't need to pass it as a prop.

// Update Eye definition
content = content.replace(
  'const Eye = ({ show, toggle, I, D }) => (',
  'const Eye = ({ show, toggle, I }) => ('
);

// Update SocialBtn definition
content = content.replace(
  'const SocialBtn = ({ icon, label, onClick, D }) => (',
  'const SocialBtn = ({ icon, label, onClick }) => ('
);

// Update Inp definition
content = content.replace(
  'const Inp = ({ label, icon, right, type, val, onChange, err, placeholder, autoComplete, hint, D, errors, setErrors, submit }) => {',
  'const Inp = ({ label, icon, right, type, val, onChange, err, placeholder, autoComplete, hint, errors, setErrors, submit, I }) => {'
);
// Wait, I should check if I used I inside Inp. Yes, I did in my previous write.
// Actually, I'll just make a clean replacement of the sub-components block.

const CLEAN_COMPONENTS = `
/* ── Auth Sub-components ── */
const Eye = ({ show, toggle, I }) => (
  <button type="button" onClick={toggle} style={{ background: "none", border: "none", color: show ? D.blue2 : D.w3, cursor: "pointer", padding: 4, display: "flex", transition: "color .18s" }}>
    {show ? I.eyeOff : I.eye}
  </button>
);

const SocialBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, padding: "12px 8px", borderRadius: 13, border: \`1.5px solid \${D.b1}\`, background: D.s0, color: D.w1, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .18s", fontFamily: "Inter" }}
    onMouseOver={e => { e.currentTarget.style.borderColor = D.b2; e.currentTarget.style.background = D.s2; }}
    onMouseOut={e => { e.currentTarget.style.borderColor = D.b1; e.currentTarget.style.background = D.s0; }}>
    {icon}{label}
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
            border: \`1.5px solid \${err ? D.rose + "90" : focused ? D.blueM : D.b0}\`,
            borderRadius: 14, color: D.w1, fontSize: 15, lineHeight: 1,
            padding: \`15px 46px 15px \${icon ? "46px" : "16px"}\`,
            outline: "none", transition: "border .18s, box-shadow .18s",
            fontFamily: "Inter",
            boxShadow: focused ? \`0 0 0 3px \${err ? D.roseLo : D.blueLo}\` : "none",
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
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? D.mint : active ? D.gBlue : D.s3, border: \`2px solid \${done ? D.mint : active ? D.blue : D.b1}\`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", color: done || active ? "#fff" : D.w3, fontWeight: 800, fontSize: 12 }}>
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
`;

// Replace the block
const START_MARKER = '/* ── Auth Sub-components ── */';
const END_MARKER = 'const AuthScreen = ({ onLogin }) => {';
const startIdx = content.indexOf(START_MARKER);
const endIdx = content.indexOf(END_MARKER);

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + CLEAN_COMPONENTS + '\n' + content.substring(endIdx);
}

// Also need to CLEAN UP the calls (remove D={D})
content = content.replace(/D=\{D\}/g, '');

fs.writeFileSync(path, content);
console.log('Shadowed D prop removed, global D will be used!');
