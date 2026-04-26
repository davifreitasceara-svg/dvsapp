const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Planos description for Free plan
const freePlanOld = '{ id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["3 posts por dia", "3 estudos por dia", "Marca d\'água DVS", "IA básica", "Transcrição simples"], miss: ["SmartSound AI", "Mapas Mentais", "Slides IA", "Export HD", "Sem marca d\'água"] }';
const freePlanNew = '{ id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["3 posts por dia", "3 trocas de música", "Marca d\'água DVS", "IA básica", "Transcrição simples"], miss: ["Mapas Mentais", "Slides IA", "Export HD", "Sem marca d\'água"] }';
content = content.replace(freePlanOld, freePlanNew);

// 2. Reset songsChanged on "+ Novo" button
const novoBtnOld = 'setStage("home"); setResult(null); setFile(null); setFileURL(null); setTopic(""); setFiltName(null); setFilters(FPRESET.Original);';
const novoBtnNew = 'setStage("home"); setResult(null); setFile(null); setFileURL(null); setTopic(""); setFiltName(null); setFilters(FPRESET.Original); setSongsChanged(0); setPostId(null); setSelMusic(null);';
content = content.replace(novoBtnOld, novoBtnNew);

// 3. Add usage indicator in SmartSoundPlayer
const smPlayerLabelOld = '<div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>SUGERIDAS PELA IA PARA SEU CONTE DO</div>';
const smPlayerLabelNew = `<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.w3, letterSpacing: .8 }}>SUGERIDAS PELA IA</div>
              {plan === "free" && <span style={{ fontSize: 10, fontWeight: 800, color: D.rose }}>{songsChanged}/3 trocas</span>}
            </div>`;
content = content.replace(smPlayerLabelOld, smPlayerLabelNew);

// Also for search tab
const smSearchLabelOld = '<div style={{ display: "flex", gap: 8 }}>';
const smSearchLabelNew = `{plan === "free" && <div style={{ fontSize: 10, fontWeight: 800, color: D.rose, marginBottom: 6, textAlign: "right" }}>{songsChanged}/3 trocas de música utilizadas</div>}
            <div style={{ display: "flex", gap: 8 }}>`;
content = content.replace(smSearchLabelOld, smSearchLabelNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx refined: Free music limit UX improved!');
