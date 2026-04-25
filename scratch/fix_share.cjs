const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Rename PUBLICAR to COMPARTILHAR and redesign the box
const oldShareBox = /<div style={{ marginTop: 8, background: D\.s0, borderRadius: 16, padding: 16, border: `1px solid \${D\.b0}` }}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const newShareBox = `
        <div style={{ marginTop: 8, background: D.s0, borderRadius: 20, padding: 20, border: \`1px solid \${D.b0}\`, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.w3, textAlign: "center", marginBottom: 18, letterSpacing: 2 }}>COMPARTILHAR AGORA</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 15 }}>
            <button className="btn" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => setMock({ platform: 'insta', type: 'reels' })}>
              INSTAGRAM
            </button>
            <button className="btn" style={{ background: "#000", border: "2px solid #00f2ea", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => setMock({ platform: 'tiktok', type: 'feed' })}>
              TIKTOK
            </button>
            <button className="btn" style={{ background: "#25D366", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => { toast("Abrindo WhatsApp..."); window.open(\`https://wa.me/?text=\${encodeURIComponent(caption)}\`, '_blank'); }}>
              WHATSAPP
            </button>
            <button className="btn" style={{ background: D.bg3, border: \`1px solid \${D.blue}\`, color: D.blue2, height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={async () => {
              if(!isImg) { toast("Download de vídeo com filtros requer processamento pesado. Baixando original..."); window.open(fileURL, '_blank'); return; }
              toast("Preparando sua arte editada...");
              try {
                const el = document.getElementById('preview-to-export');
                if(!el) return;
                const canvas = await html2canvas(el, { useCORS: true, scale: 2 });
                const link = document.createElement('a');
                link.download = \`dvs-viral-\${Date.now()}.png\`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast("✅ Arte salva com sucesso!");
              } catch(e) { toast("Erro ao exportar: " + e.message); }
            }}>
              BAIXAR EDITADO
            </button>
          </div>
          
          <div style={{ fontSize: 10, color: D.w3, textAlign: "center", lineHeight: 1.4 }}>
            A arte será baixada com seu <b>filtro selecionado</b> e o <b>adesivo de música</b> aplicado.
          </div>
        </div>`;

// 2. Add id="preview-to-export" and Music Sticker to the main preview
const oldPreview = /<div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D\.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>[\s\S]*?<ScoreRing score={result\.score} \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const newPreview = `
        <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div id="preview-to-export" key="stable-preview-container" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {fileURL ? (
              <div style={{width: "100%", position: "relative"}}>
                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}
                
                {/* Overlay da Música no Mockup real (exportável) */}
                {result.musicas?.[0] && (
                  <div style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "10%",
                    background: "rgba(255,255,255,0.9)",
                    padding: "8px 12px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    maxWidth: "80%",
                    animation: "pulse 2s infinite"
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: \`linear-gradient(45deg, #f09433, #bc1888)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>🎵</div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{result.musicas[0].titulo}</div>
                      <div style={{ fontSize: 9, color: "#666" }}>{result.musicas[0].artista}</div>
                    </div>
                  </div>
                )}

                <div style={{ position: "absolute", top: 12, right: 12 }}><ScoreRing score={result.score} /></div>
              </div>
            ) : <div style={{ color: D.w3 }}>Sem prévia</div>}
          </div>
        </div>`;

// Apply changes
// Use simpler replacement if regex is too risky
content = content.replace(/PUBLICAR AGORA/g, 'COMPARTILHAR AGORA');
// I'll use a more surgical approach for the preview
const previewTarget = '<div key="stable-preview-container" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>';
content = content.replace(previewTarget, '<div id="preview-to-export" key="stable-preview-container" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>');

// Add the music sticker logic inside the preview
const stickerInsertPoint = '<div style={{ position: "absolute", top: 12, right: 12 }}><ScoreRing score={result.score} /></div>';
content = content.replace(stickerInsertPoint, \`
                {/* Overlay da Música no Mockup real (exportável) */}
                {result.musicas?.[0] && (
                  <div style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "10%",
                    background: "rgba(255,255,255,0.9)",
                    padding: "8px 12px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    maxWidth: "80%",
                    zIndex: 10
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: 'linear-gradient(45deg, #f09433, #bc1888)', display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>🎵</div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{result.musicas[0].titulo}</div>
                      <div style={{ fontSize: 9, color: "#666" }}>{result.musicas[0].artista}</div>
                    </div>
                  </div>
                )}
                \${stickerInsertPoint}\`);

fs.writeFileSync(path, content, 'utf8');
console.log("Share UI and Download logic applied!");
