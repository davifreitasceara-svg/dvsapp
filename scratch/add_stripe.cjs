const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace PL array
const oldPL = `    { id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["10 posts/mês", "5 estudos/mês", "Marca d'água DVS", "IA básica"], miss: ["SmartSound AI", "Transcrição ilimitada", "Export HD"] },
    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: "⭐ MAIS POPULAR", feats: ["Posts ilimitados", "Sem marca d'água", "SmartSound AI", "Export HD", "Score avançado", "Suporte prioritário"], miss: [] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: "🎓 MELHOR CUSTO", feats: ["Transcrição ilimitada", "Mapas mentais ilimitados", "Slides completos", "Flashcards ilimitados", "Quiz ilimitado", "Export PDF avançado"], miss: [] },
    { id: "full", name: "Completo", price: 22, col: D.amber, grad: D.gAmber, badge: "👑 TUDO INCLUSO", feats: ["Tudo do Social", "Tudo do Estudante", "IA prioritária", "Sem limites", "Suporte 24/7"], miss: [] },`;

const newPL = `    { id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["10 posts/mês", "5 estudos/mês", "Marca d'água DVS", "IA básica"], miss: ["SmartSound AI", "Transcrição ilimitada", "Export HD"] },
    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: "⭐ MAIS POPULAR", link: "https://buy.stripe.com/test_social", feats: ["Posts ilimitados", "Sem marca d'água", "SmartSound AI", "Export HD", "Score avançado", "Suporte prioritário"], miss: [] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: "🎓 MELHOR CUSTO", link: "https://buy.stripe.com/test_student", feats: ["Transcrição ilimitada", "Mapas mentais ilimitados", "Slides completos", "Flashcards ilimitados", "Quiz ilimitado", "Export PDF avançado"], miss: [] },
    { id: "full", name: "Completo", price: 22, col: D.amber, grad: D.gAmber, badge: "👑 TUDO INCLUSO", link: "https://buy.stripe.com/test_full", feats: ["Tudo do Social", "Tudo do Estudante", "IA prioritária", "Sem limites", "Suporte 24/7"], miss: [] },`;

// 2. Replace button action
const oldBtn = `<button onClick={() => { setPlan(p.id); toast(\`✅ Plano "\${p.name}" ativado!\`, "ok"); }} style={{ width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12, border: \`1.5px solid \${active ? p.col : p.col + "40"}\`, background: active ? p.grad : "transparent", color: active ? "#fff" : p.col, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Sora',sans-serif", transition: "all .18s" }}>`;

const newBtn = `<button onClick={() => { 
                if (p.id === "free" || active) {
                  setPlan(p.id); 
                  if (!active) toast(\`✅ Plano "\${p.name}" ativado!\`, "ok"); 
                } else if (p.link) {
                  window.open(p.link, "_blank");
                }
              }} style={{ width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12, border: \`1.5px solid \${active ? p.col : p.col + "40"}\`, background: active ? p.grad : "transparent", color: active ? "#fff" : p.col, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Sora',sans-serif", transition: "all .18s" }}>`;

let changed = 0;

if (content.includes(oldPL)) {
  content = content.replace(oldPL, newPL);
  changed++;
} else if (content.includes(oldPL.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldPL.replace(/\n/g, '\r\n'), newPL);
  changed++;
} else {
  console.log("❌ PL not found");
}

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  changed++;
} else if (content.includes(oldBtn.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldBtn.replace(/\n/g, '\r\n'), newBtn);
  changed++;
} else {
  // Regex approach for button
  const btnRegex = /<button onClick=\{\(\) => \{ setPlan\(p\.id\); toast\(`✅ Plano "\$\{p\.name\}" ativado!`, "ok"\); \}\} style=\{\{ width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12, border: `1\.5px solid \$\{active \? p\.col : p\.col \+ "40"\}`, background: active \? p\.grad : "transparent", color: active \? "#fff" : p\.col, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Sora',sans-serif", transition: "all \.18s" \}\}>/;
  if (btnRegex.test(content)) {
    content = content.replace(btnRegex, newBtn);
    changed++;
  } else {
    console.log("❌ BTN not found");
  }
}

if (changed > 0) {
  fs.writeFileSync(path, content, 'utf8');
  console.log(`✅ Applied ${changed} changes.`);
}
