const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const newMockup = \`const PreviewMockup = ({ platform, type, fileURL, isImg, fCSS, caption, music, onClose, onFinish }) => {
  const [loading, setLoading] = useState(false);
  const handlePublish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    onFinish();
  };
  const isVertical = type === 'reels' || type === 'stories' || platform === 'tiktok';

  return (
    <div className="pres" style={{ background: "#000", zIndex: 10000, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", fontSize: 13, fontWeight: 700, color: "#fff" }}>
        <span>9:41</span>
        <div style={{ display: "flex", gap: 5 }}>📶 🔋</div>
      </div>

      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: isVertical ? "none" : "1px solid #262626" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 24 }}>✕</button>
          <span style={{ fontWeight: 800, fontSize: 16 }}>{platform === 'insta' ? 'Instagram' : 'TikTok'}</span>
        </div>
        <button className="btn primary sm" onClick={handlePublish} disabled={loading} style={{ borderRadius: 8, padding: "6px 16px" }}>
          {loading ? <Spin s={14} c="#fff" /> : "Publicar"}
        </button>
      </div>

      <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#000" }}>
        {isVertical ? (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#111" }}>
               {isImg ? <img src={fileURL} style={{ width: "100%", filter: fCSS }} /> : <video src={fileURL} autoPlay muted loop style={{ width: "100%" }} />}
            </div>
            
            {music && (
              <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, color: "#fff", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)", zIndex: 50 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(45deg, #f09433, #bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎵</div>
                <div style={{ display: "flex", flexDirection: "column", maxWidth: 180 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.titulo || music.nome}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.artista}</span>
                </div>
              </div>
            )}
            
            <div style={{ position: "absolute", right: 12, bottom: 120, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>❤️</span><div style={{ fontSize: 11, fontWeight: 700 }}>1.2M</div></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>💬</span><div style={{ fontSize: 11, fontWeight: 700 }}>14k</div></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>✈️</span></div>
               <div style={{ textAlign: "center" }}><span style={{ fontSize: 28 }}>...</span></div>
            </div>

            <div style={{ position: "absolute", left: 16, bottom: 40, right: 80 }}>
              <div style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c)", border: "1.5px solid #fff" }} />
                DVS_EduCreator
              </div>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {caption}
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                🎵 <span>{music ? \`\${music.titulo || music.nome} • \${music.artista}\` : "Áudio original"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#000", height: "100%", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c)" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>DVS_EduCreator</span>
                {music && <span style={{ fontSize: 11, fontWeight: 500, color: "#aaa" }}>{music.titulo || music.nome}</span>}
              </div>
            </div>
            <div style={{ width: "100%", background: "#111", minHeight: 300, display: "flex", alignItems: "center" }}>
               {isImg ? <img src={fileURL} style={{ width: "100%", filter: fCSS }} /> : <video src={fileURL} autoPlay muted loop style={{ width: "100%" }} />}
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 16, fontSize: 24, marginBottom: 10 }}>
                <span>❤️</span> <span>💬</span> <span>✈️</span> <span style={{ marginLeft: "auto" }}>🔖</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>12,458 curtidas</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800, marginRight: 6 }}>DVS_EduCreator</span>
                {caption}
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: 60, display: "flex", justifyContent: "space-around", alignItems: "center", background: "#000", borderTop: "1px solid #262626" }}>
        <span style={{ fontSize: 24 }}>🏠</span> <span style={{ fontSize: 24 }}>🔍</span> <span style={{ fontSize: 24 }}>➕</span> <span style={{ fontSize: 24 }}>🎞️</span>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff" }} />
      </div>
    </div>
  );
};\`;

const startMarker = 'const PreviewMockup =';
const endMarker = '/* ── HOME ── */';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newMockup + '\n\n\n' + content.substring(endIndex);
    fs.writeFileSync(path, content, 'utf8');
    console.log("PreviewMockup fixed!");
} else {
    console.log("NOT FOUND", startIndex, endIndex);
}
