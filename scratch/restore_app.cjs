const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const homeStart = '/* ✨✨ HOME ✨✨ */\n  return (';
const brokenStart = '/* ✨✨ HOME ✨✨ */\n  return (\n          <img src="/src/assets/logo.png"';

const correctContent = `/* ✨✨ HOME ✨✨ */
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

      <input
        id={fileId}
        type="file"
        accept="image/*,video/*"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        onChange={handleFileChange}
      />

      <div className="fu">
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 5 }}>Modo Criador ✨</div>
        <div style={{ fontSize: 14, color: D.w2, lineHeight: 1.6 }}>Envie uma foto ou vídeo ✨ a IA analisa e cria sua postagem viral ✨</div>
      </div>

      <label htmlFor={fileId} className="fu d1" style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        padding: "32px 20px", borderRadius: 20, cursor: "pointer",
        border: \`2px dashed \${D.b1}\`,
        background: \`linear-gradient(135deg,\${D.s0},\${D.bg3})\`,
        transition: "border-color .18s, background .18s",
        WebkitTapHighlightColor: "transparent",
      }}>
        <div style={{ width: 68, height: 68, borderRadius: 18, overflow: 'hidden', border: \`1px solid \${D.blueM}\`, display: "flex", alignItems: "center", justifyContent: "center", animation: "float2 3.5s ease-in-out infinite", background: D.bg3 }}>
          <img src="/src/assets/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
        </div>`;

// Replace the broken part
content = content.replace(brokenStart, correctContent);

// Also remove the redundant camera buttons if they are still there (they are in the view_file output)
const camButtons = `<div className="fu d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <label htmlFor={fileId} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 12px", borderRadius: 12, border: \`1.5px solid \${D.blueM}\`, color: D.blue2, fontWeight: 700, fontSize: 13, cursor: "pointer", background: D.blueLo, WebkitTapHighlightColor: "transparent" }}>
          ✨ Galeria
        </label>
        <label htmlFor={fileId + "-cam"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 12px", borderRadius: 12, border: \`1.5px solid \${D.b1}\`, color: D.w1, fontWeight: 700, fontSize: 13, cursor: "pointer", background: D.s2, WebkitTapHighlightColor: "transparent" }}>
          ✨ C mera
        </label>
      </div>
      {/* input separado para c mera */}
      <input id={fileId + "-cam"} type="file" accept="image/*,video/*" capture="environment" style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} onChange={handleFileChange} />`;

if (content.includes(camButtons)) {
    content = content.replace(camButtons, '');
} else {
    // try fuzzy match for cam buttons due to encoding fix
    content = content.replace(/<div className="fu d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>[\s\S]*?id={fileId \+ "-cam"}[\s\S]*?\/>/, '');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx restored and camera removed correctly!');
