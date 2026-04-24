import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const START_TOKEN = '{/* ── SOCIAL LOGIN ── */}';
const END_TOKEN = '{/* security note */}';

const startIdx = content.indexOf(START_TOKEN);
const endIdx = content.indexOf(END_TOKEN);

if (startIdx !== -1 && endIdx !== -1) {
    const nextDivIdx = content.indexOf('</div>', endIdx);
    const nextCloseIdx = content.indexOf(')}', nextDivIdx);
    
    if (nextCloseIdx !== -1) {
        const fullEndIdx = nextCloseIdx + 2;
        
        const NEW_BLOCK = '{/* ── SOCIAL LOGIN ── */}\n' +
            '        {(page === "login" || page === "register") && (\n' +
            '          <div className="fu d3" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>\n' +
            '            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>\n' +
            '              <div style={{ flex: 1, height: 1, background: D.b0 }} />\n' +
            '              <span style={{ fontSize: 11, fontWeight: 800, color: D.w3, whiteSpace: "nowrap", letterSpacing: 1 }}>OU CONTINUE COM</span>\n' +
            '              <div style={{ flex: 1, height: 1, background: D.b0 }} />\n' +
            '            </div>\n' +
            '            <GoogleLoginBtn onLogin={onLogin} setErrors={setErrors} D={D} />\n' +
            '            <div style={{ textAlign: "center", fontSize: 11, color: D.w3, marginTop: 4 }}>\n' +
            '              Ao continuar, você concorda com nossos Termos de Uso.\n' +
            '            </div>\n' +
            '          </div>\n' +
            '        )}';

        content = content.substring(0, startIdx) + NEW_BLOCK + content.substring(fullEndIdx);
        fs.writeFileSync(path, content);
        console.log('Social buttons replaced successfully!');
    }
}
