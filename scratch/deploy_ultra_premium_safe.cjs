const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const ultraPremiumReturn = `  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
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
      
      {/* HEADER PREMIUM */}
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, background: "linear-gradient(90deg, #fff, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Viral Studio ✨</div>
          <button className="btn ghost xs" onClick={() => { setStage("home"); setResult(null); setFile(null); setFileURL(null); setTopic(""); setFiltName(null); setFilters(FPRESET.Original); }} style={{ marginTop: 6, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>+ Novo Projeto</button>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: D.blue2, letterSpacing: 1.5, marginBottom: 4 }}>ESTADO</div>
          <span className="tag tgrn" style={{ padding: "4px 12px", fontSize: 10 }}>✓ ANALISADO</span>
        </div>
      </div>

      {/* PREVIEW CONTAINER GLASSMORPHIC */}
      <div className="card fu d1" style={{ 
        padding: 0, overflow: "hidden", position: "relative", minHeight: 400, 
        background: "rgba(15, 23, 42, 0.6)", 
        backdropFilter: "blur(20px)", 
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        display: "flex", alignItems: "center", justifyContent: "center" 
      }}>
        <div id="preview-to-export" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {fileURL ? (
            <div style={{ width: "100%", position: "relative" }}>
              {isImg ? (
                <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
              ) : (
                <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
              )}
              
              {/* Música Overlay PREMIUM */}
              {result?.musicas?.[0] && (
                <div style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  padding: "10px 16px",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  maxWidth: "90%",
                  zIndex: 10,
                  border: "1px solid rgba(255,255,255,0.3)"
                }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 12, 
                    background: 'linear-gradient(45deg, #f09433, #e1306c, #833ab4)', 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    color: "#fff", fontSize: 20, animation: "spinA 8s linear infinite" 
                  }}>🎵</div>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", whiteSpace: "nowrap" }}>{result?.musicas?.[0]?.titulo}</div>
                    <div style={{ fontSize: 10, color: "#666", fontWeight: 600 }}>{result?.musicas?.[0]?.artista}</div>
                  </div>
                </div>
              )}

              <div style={{ position: "absolute", top: 16, right: 16, animation: "glowA 2s infinite" }}>
                <ScoreRing score={result?.score} />
              </div>
            </div>
          ) : <div style={{ color: D.w3, fontSize: 14, fontWeight: 600 }}>Carregando prévia...</div>}
        </div>
      </div>

      {/* MÉTRICAS DE IMPACTO GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card fu d2" style={{ 
          padding: 16, 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20 
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: D.blue2, textTransform: "uppercase", marginBottom: 6, letterSpacing: 1 }}>🚀 Alcance Estimado</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{result?.score > 85 ? "ALTO" : "MÉDIO"}</div>
          <div style={{ fontSize: 10, color: D.w2, marginTop: 4, lineHeight: 1.4 }}>{result?.scoreMotivo}</div>
        </div>
        <div className="card fu d2" style={{ 
          padding: 16, 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20 
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: D.amber, textTransform: "uppercase", marginBottom: 6, letterSpacing: 1 }}>⏰ Postagem Ideal</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{result?.horario || "19:30"}</div>
          <div style={{ fontSize: 10, color: D.w2, marginTop: 4 }}>Melhor janela para engajamento.</div>
        </div>
      </div>

      {/* DICAS E INSIGHTS */}
      <div className="card fu d3" style={{ 
        padding: 20, 
        background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
        border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: 24 
      }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8, color: D.amber }}>
          <span style={{ fontSize: 18 }}>💡</span> ESTRATÉGIA VIRAL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result?.melhorias?.map((m, i) => (
            <div key={i} style={{ fontSize: 13, color: D.w1, display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: D.amber, marginTop: 6, flexShrink: 0 }} />
              <span style={{ lineHeight: 1.4 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EDITOR DE FILTROS */}
      <div className="card fu d4" style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <span>🎨 FILTRO INSTAGRAM</span>
          <span style={{ color: D.blue2 }}>{filtName || "Original"}</span>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none", marginBottom: 16 }}>
          {Object.keys(FPRESET).map(name => {
            const f = FPRESET[name];
            const css = \`brightness(\${f.brightness}%) contrast(\${f.contrast}%) saturate(\${f.saturate}%) sepia(\${f.sepia||0}%) hue-rotate(\${f.hue||0}deg)\`;
            const active = filtName === name;
            return (
              <div key={name} onClick={() => applyFilt(name)} style={{ flexShrink: 0, cursor: "pointer", textAlign: "center", width: 72 }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, overflow: "hidden", border: \`3px solid \${active ? D.blue2 : "rgba(255,255,255,0.1)"}\`, transition: "all .2s", marginBottom: 6, transform: active ? "scale(1.05)" : "none" }}>
                  {fileURL && isImg
                    ? <img src={fileURL} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: css }} />
                    : <div style={{ width: "100%", height: "100%", background: \`linear-gradient(135deg, #1e3a8a, #1e40af)\`, filter: css }} />}
                </div>
                <div style={{ fontSize: 11, fontWeight: active ? 800 : 500, color: active ? D.blue2 : D.w3 }}>{name}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["brightness","Brilho",50,160],["contrast","Contraste",50,160],["saturate","Saturação",0,200]].map(([k,lb,mn,mx]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 80, fontSize: 12, color: D.w2, fontWeight: 600 }}>{lb}</div>
              <input type="range" min={mn} max={mx} value={filters?.[k]??100} onChange={e => setFilters(p => ({ ...p, [k]: +e.target.value }))} style={{ flex: 1, accentColor: D.blue2, height: 4 }} />
              <div style={{ width: 40, fontSize: 11, color: D.w3, textAlign: "right", fontWeight: 700 }}>{filters?.[k]??100}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* LEGENDA E COMPARTILHAMENTO */}
      <div className="card fu d5" style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>✍️ LEGENDA ESTRATÉGICA</div>
          <button className="btn ghost xs" onClick={copiar} style={{ borderRadius: 8 }}>Copiar Texto</button>
        </div>
        <textarea className="inp" value={caption} onChange={e => setCaption(e.target.value)} style={{ minHeight: 120, fontSize: 14, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }} />
      </div>

      <SmartSoundPlayer musicas={result?.musicas} toast={toast} />

      <button className="btn lg" onClick={viral} disabled={vLoad} style={{ 
        width: "100%", background: "linear-gradient(90deg, #e11d48, #f43f5e)", 
        color: "#fff", height: 56, borderRadius: 18, fontSize: 16, fontWeight: 900,
        boxShadow: "0 10px 30px rgba(225, 29, 72, 0.3)", animation: "glowA 3s infinite"
      }}>
        {vLoad ? <Spin s={20} /> : "🚀 TURBINAR ENGAJAMENTO"}
      </button>

      {/* LANÇAMENTO DIRETO PREMIUM */}
      <div style={{ 
        marginTop: 10, background: "rgba(37, 99, 235, 0.05)", 
        borderRadius: 28, padding: 26, 
        border: '2px solid ' + D.blue2, 
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: D.blue2, opacity: 0.1, filter: "blur(40px)" }} />
        <div style={{ fontSize: 12, fontWeight: 900, color: D.blue2, textAlign: "center", marginBottom: 20, letterSpacing: 3 }}>LANÇAMENTO DIRETO</div>
        
        <button className="btn" style={{ 
          width: "100%", height: 64, background: D.gBlue, 
          color: "#fff", borderRadius: 20, fontSize: 17, 
          fontWeight: 900, marginBottom: 18, 
          boxShadow: "0 12px 30px rgba(37,99,235,0.4)",
          transform: "translateY(0)", transition: "transform .2s"
        }} onClick={compartilharDireto}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
           🚀 COMPARTILHAR AGORA
        </button>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <button className="btn outline sm" style={{ fontSize: 11, borderRadius: 12, borderColor: "rgba(255,255,255,0.1)", color: D.w2 }} onClick={() => setMock({ platform: 'insta', type: 'reels' })}>PREVIEW</button>
          <button className="btn outline sm" style={{ fontSize: 11, borderRadius: 12, borderColor: "rgba(255,255,255,0.1)", color: D.w2 }} onClick={() => { navigator.clipboard.writeText(caption); toast("Copiado!"); }}>COPIAR</button>
          <button className="btn outline sm" style={{ fontSize: 11, borderRadius: 12, borderColor: "rgba(255,255,255,0.1)", color: D.w2 }} onClick={async () => {
             const el = document.getElementById('preview-to-export');
             if(el) {
               const c = await html2canvas(el, {useCORS:true, scale:2, backgroundColor: D.bg});
               const l = document.createElement('a'); l.download='dvs-viral.png'; l.href=c.toDataURL(); l.click();
             }
          }}>BAIXAR</button>
        </div>
      </div>
      
      <div style={{ textAlign: "center", fontSize: 11, color: D.w3, paddingBottom: 20 }}>
        Análise gerada em tempo real pelo motor DVS Gemini 2.5 Flash.
      </div>
    </div>
  );`;

// FIND THE CRIADOR START
const criadorHeader = 'const Criador = ({ toast }) => {';
const criadorIndex = content.indexOf(criadorHeader);

if (criadorIndex === -1) {
    console.log("CRIADOR NOT FOUND");
    process.exit(1);
}

// FIND THE RETURN START AFTER THE HEADER
const startMarker = '  return (';
const startIndex = content.indexOf(startMarker, criadorIndex);

// FIND THE HOME MARKER
const endMarker = '  /* ── HOME ── */';
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + ultraPremiumReturn + '\n\n' + content.substring(endIndex);
    fs.writeFileSync(path, content, 'utf8');
    console.log("ULTRA PREMIUM DEPLOYED SAFELY!");
} else {
    console.log("RECONSTRUCTION FAILED", startIndex, endIndex);
}
