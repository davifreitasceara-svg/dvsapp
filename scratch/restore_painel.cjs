const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const metricsBlock = `
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="card" style={{ padding: 12, background: \`linear-gradient(135deg,\${D.s1}, \${D.bg2})\` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: D.w3, textTransform: "uppercase", marginBottom: 4 }}>📈 SCORE VIRAL</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: D.blue2 }}>{result?.score}%</div>
            <div style={{ fontSize: 9, color: D.w2, marginTop: 4, lineHeight: 1.3 }}>{result?.scoreMotivo}</div>
          </div>
          <div className="card" style={{ padding: 12, background: \`linear-gradient(135deg,\${D.s1}, \${D.bg2})\` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: D.w3, textTransform: "uppercase", marginBottom: 4 }}>⏰ MELHOR HORÁRIO</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: D.amber }}>{result?.horario || "19:00"}</div>
            <div style={{ fontSize: 9, color: D.w2, marginTop: 4, lineHeight: 1.3 }}>Pico de engajamento para seu nicho.</div>
          </div>
        </div>

        <div className="card" style={{ padding: 15, border: \`1px solid \${D.amber}40\`, background: \`linear-gradient(to bottom, \${D.s1}, \${D.bg})\` }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>💡</span> Dicas de Ouro
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result?.melhorias?.map((m, i) => (
              <div key={i} style={{ fontSize: 12, color: D.w2, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: D.amber }}>•</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
`;

const target = '        <div className="card" style={{ padding: 15 }}>\n          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎨 Filtros Instagram';

content = content.replace(target, metricsBlock + '\n' + target);

fs.writeFileSync(path, content, 'utf8');
console.log("Painel Restored!");
