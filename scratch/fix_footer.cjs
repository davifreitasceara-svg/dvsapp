const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `        {!load && res && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ height: 1, background: D.b0 }} />
            {rend()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
      </div>
    </div>
  );
};`;

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

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('FINAL FOOTER FIX SUCCESS');
} else {
    console.log('Target not found for footer fix');
    // Try a more flexible match
    const flexibleTarget = `        {!load && res && (\r\n          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>\r\n            <div style={{ height: 1, background: D.b0 }} />\r\n            {rend()}\r\n            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>\r\n      </div>\r\n    </div>\r\n  );\r\n};`;
    if (content.includes(flexibleTarget)) {
        content = content.replace(flexibleTarget, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('FINAL FOOTER FIX SUCCESS (flexible)');
    }
}
