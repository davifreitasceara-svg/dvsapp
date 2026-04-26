const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const homeStageReturn = `  if (stage === "home") {
    return (
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        <input id={fileId} type="file" accept="image/*,video/*" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} onChange={handleFileChange} />
        <input id={fileId + "-cam"} type="file" accept="image/*,video/*" capture="environment" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} onChange={handleFileChange} />

        <div className="fu">
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, background: "linear-gradient(90deg, #fff, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>Viral Studio ✨</div>
          <div style={{ fontSize: 14, color: D.w2, lineHeight: 1.6 }}>O seu motor de viralização movido a IA. Envie uma mídia para começar.</div>
        </div>

        <label htmlFor={fileId} className="fu d1" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          padding: "48px 24px", borderRadius: 28, cursor: "pointer",
          border: \`2px dashed \${D.b1}\`,
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          transition: "all .2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = D.blue2; e.currentTarget.style.background = "rgba(37,99,235,0.05)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = D.b1; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
        >
          <div style={{ width: 84, height: 84, borderRadius: 24, background: D.blueLo, border: \`1px solid \${D.blueM}\`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, animation: "float2 4s ease-in-out infinite", boxShadow: "0 10px 30px rgba(37,99,235,0.2)" }}>📁</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 19, color: "#fff", marginBottom: 6 }}>Selecionar Mídia</div>
            <div style={{ fontSize: 13, color: D.w2 }}>Arraste ou toque para abrir a galeria</div>
          </div>
          <div className="tag tblue" style={{ padding: "6px 16px", fontSize: 12, borderRadius: 12 }}>REELS · TIKTOK · POSTS</div>
        </label>

        <div className="fu d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label htmlFor={fileId} className="btn ghost" style={{ height: 54, borderRadius: 16, border: \`1px solid \${D.b1}\`, background: "rgba(255,255,255,0.03)" }}>🖼️ Galeria</label>
          <label htmlFor={fileId + "-cam"} className="btn ghost" style={{ height: 54, borderRadius: 16, border: \`1px solid \${D.b1}\`, background: "rgba(255,255,255,0.03)" }}>📷 Câmera</label>
        </div>

        {fileURL && (
          <div className="card fu d3" style={{ padding: 14, display: "flex", gap: 14, alignItems: "center", borderColor: D.blueM, background: "rgba(37,99,235,0.05)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, overflow: "hidden", border: \`2px solid \${D.blueM}\`, flexShrink: 0 }}>
              {isImg ? <img src={fileURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <video src={fileURL} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 4 }}>Pronto para Viralizar!</div>
              <div style={{ fontSize: 12, color: D.w2 }}>{isImg ? "Imagem" : "Vídeo"} · {file?.name?.substring(0,20)}...</div>
            </div>
            <button className="btn ghost xs" onClick={() => { setFile(null); setFileURL(null); }} style={{ borderRadius: 10 }}>Remover</button>
          </div>
        )}

        <div className="fu d4">
          <div className="sec-label" style={{ color: D.blue3, letterSpacing: 2 }}>TEMA / CONTEXTO</div>
          <input className="inp" value={topic} onChange={e => setTopic(e.target.value)} placeholder="O que é esse post? (Ex: Treino, Dica de Cozinha...)" style={{ height: 54, background: "rgba(0,0,0,0.3)", borderRadius: 16 }} />
        </div>

        <div className="fu d5">
          <div className="sec-label" style={{ color: D.blue3, letterSpacing: 2 }}>ESTILO DO CONTEÚDO</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {ESTILOS.map(s => (
              <button key={s.id} onClick={() => setEstilo(s.id)} style={{ 
                height: 50, borderRadius: 14, border: \`1px solid \${estilo === s.id ? D.blue2 : D.b0}\`, 
                background: estilo === s.id ? D.blueLo : "rgba(255,255,255,0.02)", 
                color: estilo === s.id ? "#fff" : D.w2,
                fontWeight: 700, fontSize: 13, transition: "all .2s"
              }}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        <button className="btn primary lg fu d6" style={{ height: 60, borderRadius: 20, fontSize: 17, fontWeight: 900, marginTop: 10, boxShadow: "0 10px 30px rgba(37,99,235,0.3)" }} onClick={startCreate} disabled={!file && !topic.trim()}>
          ✨ CRIAR COM INTELIGÊNCIA ARTIFICIAL
        </button>
      </div>
    );
  }`;

const criadorHeader = 'const Criador = ({ toast }) => {';
const criadorIndex = content.indexOf(criadorHeader);
const startMarker = '  return (';
const startIndex = content.indexOf(startMarker, criadorIndex);

if (startIndex !== -1) {
    content = content.substring(0, startIndex) + homeStageReturn + '\n\n' + content.substring(startIndex);
    fs.writeFileSync(path, content, 'utf8');
    console.log("HOME STAGE RESTORED!");
} else {
    console.log("RECONSTRUCTION FAILED");
}
