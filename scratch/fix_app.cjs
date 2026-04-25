const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add sticker
content = content.replace(
  /(\{\s*\/\*\s*overlays\s*\*\/\s*\})/g,
  `{music && (
              <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, color: "#fff", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(45deg, #f09433, #bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎵</div>
                <div style={{ display: "flex", flexDirection: "column", maxWidth: 180 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.nome}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.artista}</span>
                </div>
              </div>
            )}
            
            $1`
);

// 2. Vertical Audio string
content = content.replace(
  /🎵 <span>Áudio original de DVS<\/span>/g,
  `🎵 <span>{music ? \`\${music.nome} • \${music.artista}\` : "Áudio original de DVS"}</span>`
);

// 3. Feed subtitle string
content = content.replace(
  /<div style={{ fontSize: 14, fontWeight: 700 }}>DVS_EduCreator<\/div>\s*<\/div>\s*<div style={{ width: "100%", background: "#111"/g,
  `<div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>DVS_EduCreator</span>
                {music && <span style={{ fontSize: 11, fontWeight: 500, color: "#aaa" }}>{music.nome}</span>}
              </div>
            </div>
            <div style={{ width: "100%", background: "#111"`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Done");
