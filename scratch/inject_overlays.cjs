const fs = require('fs');

const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}`;

const overlay = `                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}
                
                {/* Overlay da Música */}
                {selMusic && (
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 12, backdropFilter: "blur(4px)" }}>
                    <span style={{ fontSize: 14 }}>🎵</span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{selMusic.title || selMusic.name || "Música selecionada"}</span>
                  </div>
                )}

                {/* Overlay da Legenda */}
                {caption && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)", padding: "40px 16px 16px 16px" }}>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, lineHeight: 1.4, margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.8)", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                      {caption}
                    </p>
                  </div>
                )}`;

if (content.includes(target)) {
  content = content.replace(target, overlay);
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: Overlays injected');
} else {
  console.log('ERROR: Target string not found');
}
