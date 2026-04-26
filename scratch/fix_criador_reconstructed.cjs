const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Define SI and SV constants at the top of Criador
const constants = `
  const SI = ["Lendo imagem...", "Extraindo cores...", "Analisando vibe...", "Buscando tendências...", "Gerando conteúdo..."];
  const SV = ["Processando vídeo...", "Mapeando frames...", "Captando clima...", "Buscando áudio viral...", "Gerando estratégia..."];
`;

content = content.replace('const Criador = ({ toast }) => {', 'const Criador = ({ toast }) => {' + constants);

// 2. Fix the return blocks and Fragment usage
// I'll replace the broken start of the return with a proper conditional for 'proc'
const procReturn = `
  if (stage === "proc") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(5, 7, 9, 0.95)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 24
      }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
           <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✨</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{(isImg ? SI : SV)[cur] || "Analisando..."}</div>
          <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600, letterSpacing: 1 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }
`;

// Clean up the previous bad injection
const badPartStart = '  if (stage === "home") {';
const badIndex = content.indexOf(badPartStart);

if (badIndex !== -1) {
    // I'll just rewrite the whole return section of Criador safely.
    // I'll find where Criador's return ( is.
    const criadorSearch = 'const Criador = ({ toast }) => {';
    const criadorIdx = content.indexOf(criadorSearch);
    const startRet = content.indexOf('return (', criadorIdx);
    // Find the end of the return (which is the start of the next component or the end of the file)
    const endRet = content.indexOf('/* ── HOME ── */', startRet);
    
    if (startRet !== -1 && endRet !== -1) {
        // I'll use the already defined homeStageReturn and ultraPremiumReturn (from previous turns) 
        // to reconstruct a perfect multi-stage return.
        
        const reconstructedReturn = `  if (stage === "proc") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(5, 7, 9, 0.95)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 24
      }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
           <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✨</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{(isImg ? SI : SV)[cur] || "Analisando..."}</div>
          <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600, letterSpacing: 1 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }

  if (stage === "home") {
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
  }

  return (
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

        content = content.substring(0, startRet) + reconstructedReturn + content.substring(endRet);
        fs.writeFileSync(path, content, 'utf8');
        console.log("CRITICAL RECONSTRUCTION SUCCESS!");
    } else {
        console.log("CRITICAL RECONSTRUCTION FAILED", startRet, endRet);
    }
}
