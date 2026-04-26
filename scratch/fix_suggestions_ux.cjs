const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update IA Suggestions List Item
const sugItemOld = `<div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 12, background: D.bg2, border: \`1.5px solid \${D.b0}\`, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = D.blueM}
                onMouseOut={e => e.currentTarget.style.borderColor = D.b0}
                onClick={() => playFromAI(m)}>`;

const sugItemNew = `<div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 12, background: (selMusic?.nome===m.nome || selMusic?.trackName===m.nome)?\`\${D.rose}14\`:D.bg2, border: \`1.5px solid \${(selMusic?.nome===m.nome || selMusic?.trackName===m.nome)?D.rose+"55":D.b0}\`, transition: "all .15s" }}>`;
content = content.replace(sugItemOld, sugItemNew);

const sugIconOld = `<div style={{ width: 38, height: 38, borderRadius: 10, background: i===0?D.gRose:i===1?D.gBlue:D.gMint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {i===0?"":i===1?"":""}
                </div>`;

const sugIconNew = `<div style={{ width: 38, height: 38, borderRadius: 10, background: i===0?D.gRose:i===1?D.gBlue:D.gMint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, cursor: "pointer" }} onClick={() => playFromAI(m)}>
                  {aiLoading === m.tipo ? <Spin s={14} c="#fff" /> : ICONS.playFill}
                </div>`;
content = content.replace(sugIconOld, sugIconNew);

const sugButtonsOld = `<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span className="tag trose" style={{ fontSize: 10 }}>{m.tipo}</span>
                  {aiLoading === m.tipo
                    ? <Spin s={14} c={D.rose} \/>
                    : <span style={{ fontSize: 11, color: D.blue2, fontWeight: 700 }}> Tocar<\/span>}
                </div>`;

const sugButtonsNew = `<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span className="tag trose" style={{ fontSize: 9 }}>{m.tipo}</span>
                  <button onClick={() => playFromAI(m)} 
                    style={{ background: (selMusic?.nome===m.nome || selMusic?.trackName===m.nome) ? D.gRose : D.blue, color: "#fff", border: "none", borderRadius: 8, padding: "5px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                    {(selMusic?.nome===m.nome || selMusic?.trackName===m.nome) ? <>{ICONS.check} USANDO</> : "USAR"}
                  </button>
                </div>`;

content = content.replace(sugButtonsOld, sugButtonsNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx suggestions UX improved!');
