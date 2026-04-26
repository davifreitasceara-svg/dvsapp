const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `        {!load && res && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ height: 1, background: D.b0 }} />
            {rend()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
              <button className="btn ghost sm" onClick={() => { toast("📄 Gerando PDF…", "info"); setTimeout(() => toast("✅ PDF gerado!", "ok"), 2000); }}>📄 PDF</button>
              <button className="btn ghost sm" onClick={() => { navigator.clipboard.writeText(JSON.stringify(res, null, 2)); toast("Copiado!", "ok"); }}>📋 Copiar</button>
              <button className="btn ghost sm" onClick={() => { setRes(null); gen(rtype); }}>↺ Refazer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};`;

// Use a regex that is whitespace-insensitive for the "broken" part
const regex = /\{!load && res && \(\s+<div style=\{\{ display: "flex", flexDirection: "column", gap: 13 \}\}>\s+<div style=\{\{ height: 1, background: D\.b0 \}\} \/>\s+\{rend\(\)\}\s+<div style=\{\{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 \}\}>\s+<\/div>\s+<\/div>\s+\);\s+\};/g;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('REGEX FOOTER FIX SUCCESS');
} else {
    console.log('Regex target not found');
}
