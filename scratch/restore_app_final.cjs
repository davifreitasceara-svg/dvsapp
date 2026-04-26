const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the home return start
const homeMarker = '/* ✨✨ HOME ✨✨ */';
const parts = content.split(homeMarker);

if (parts.length > 1) {
    const rest = parts[1];
    // Find the end of the return statement or a known point after the broken part
    // The broken part ends at </label> (line 1220 in the view_file)
    const endMarker = '</label>';
    const subParts = rest.split(endMarker);
    
    if (subParts.length > 1) {
        const correctHome = `
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

        parts[1] = correctHome + subParts.slice(1).join(endMarker);
        content = parts.join(homeMarker);
        
        // Remove camera buttons again just in case
        content = content.replace(/<div className="fu d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>[\s\S]*?id={fileId \+ "-cam"}[\s\S]*?\/>/, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('App.jsx fixed successfully!');
    } else {
        console.log('Could not find label end marker.');
    }
} else {
    console.log('Could not find home marker.');
}
