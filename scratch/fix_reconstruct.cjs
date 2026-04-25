const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const correctReturn = `  return (
    <>
      {mock && (
        <PreviewMockup 
          platform={mock.platform} 
          type={mock.type} 
          fileURL={fileURL} 
          isImg={isImg} 
          fCSS={fCSS} 
          caption={caption} 
          music={result?.musicas?.[0]}
          onClose={() => setMock(null)}
          onFinish={() => { toast("Publicado com sucesso!"); setMock(null); }}
        />
      )}
      
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Revisão Final ✨</div>
            <button className="btn ghost xs" onClick={() => { setStage("home"); setResult(null); setFile(null); setFileURL(null); setTopic(""); setFiltName(null); setFilters(FPRESET.Original); }} style={{marginTop: 4}}>+ Novo</button>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div id="preview-to-export" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {fileURL ? (
              <div style={{width: "100%", position: "relative"}}>
                {isImg ? (
                  <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                ) : (
                  <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                )}
                
                {/* Música Overlay Editável */}
                {result?.musicas?.[0] && (
                  <div style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "10%",
                    background: "rgba(255,255,255,0.92)",
                    padding: "8px 12px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    maxWidth: "80%",
                    zIndex: 10
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(45deg, #f09433, #bc1888)', display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>🎵</div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>{result?.musicas?.[0]?.titulo}</div>
                      <div style={{ fontSize: 9, color: "#666" }}>{result?.musicas?.[0]?.artista}</div>
                    </div>
                  </div>
                )}

                <div style={{ position: "absolute", top: 12, right: 12 }}><ScoreRing score={result?.score} /></div>
              </div>
            ) : <div style={{ color: D.w3 }}>Sem prévia</div>}
          </div>
        </div>`;

const startMarker = '  return (';
const endMarker = '<div className="card" style={{ padding: 15 }}>';

const startIndex = content.indexOf(startMarker, 900); // Start looking after the functions
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + correctReturn + '\n\n        ' + content.substring(endIndex);
    fs.writeFileSync(path, content, 'utf8');
    console.log("RECONSTRUCTION SUCCESS!");
} else {
    console.log("RECONSTRUCTION FAILED", startIndex, endIndex);
}
