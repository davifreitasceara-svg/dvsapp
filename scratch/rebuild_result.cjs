const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find proc block start
const procStart = content.indexOf('  if (stage === "proc") {');
// Find the HOME return start  
const homeMarker = '  // HOME\n  return (';
const homeStart = content.indexOf(homeMarker);

if (procStart === -1 || homeStart === -1) {
  console.log('Cannot find markers!', {procStart, homeStart});
  process.exit(1);
}

// Get everything before proc and the HOME+beyond
const beforeProc = content.substring(0, procStart);
const homeAndBeyond = content.substring(homeStart + homeMarker.length);

// Build the new result section
const newSection = `  if (stage === "proc") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(5, 7, 9, 0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
           <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 30 }}>
               <img src="/src/assets/logo.png" style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="Logo" />
           </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{(isImg ? SI : SV)[cur] || "Analisando..."}</div>
          <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }

  if (stage === "result" && result) {
    const REDES = [
      { id: "instagram", label: "Instagram",  grad: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fd1d1d", icon: "📸" },
      { id: "tiktok",    label: "TikTok",      grad: "linear-gradient(135deg,#010101,#69C9D0)",        color: "#69C9D0", icon: "🎵" },
      { id: "whatsapp",  label: "WhatsApp",    grad: "linear-gradient(135deg,#128C7E,#25D366)",        color: "#25D366", icon: "💬" },
      { id: "facebook",  label: "Facebook",    grad: "linear-gradient(135deg,#1877F2,#42a5f5)",        color: "#1877F2", icon: "📘" },
      { id: "twitter",   label: "Twitter/X",   grad: "linear-gradient(135deg,#000,#1DA1F2)",           color: "#1DA1F2", icon: "🐦" },
      { id: "telegram",  label: "Telegram",    grad: "linear-gradient(135deg,#0088cc,#2CA5E0)",        color: "#2CA5E0", icon: "✈️" },
    ];
    return (
      <>
        {mock && (
          <PreviewMockup
            platform={mock.platform}
            type={mock.type}
            fileURL={fileURL}
            isImg={isImg}
            fCSS={fCSS}
            caption={caption}
            music={selMusic || result?.musicas?.[0]}
            onClose={() => setMock(null)}
            onFinish={() => { toast("Publicado com sucesso!"); setMock(null); }}
          />
        )}
        <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20 }}>Revisão Final</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn sm" onClick={async () => {
                  if (postId) {
                    await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId);
                    toast("Salvo!", "ok");
                  }
                }} style={{ background: D.gMint, color: "#fff", border: "none", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}>Salvar</button>
                <button className="btn sm" onClick={() => {
                  setCaption(result.hook + "\\n\\n" + result.caption + "\\n\\n" + result.hashtags.map(function(h) { return "#" + h; }).join(" "));
                  setFilters(FPRESET.Original);
                  setFiltName("Original");
                  setSelMusic(null);
                  toast("Edições removidas!", "info");
                }} style={{ background: D.s3, color: D.w2, border: "1.5px solid " + D.b1, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}>Resetar</button>
              </div>
            </div>
            <button className="btn ghost xs" onClick={() => {
              setStage("home"); setResult(null); setFile(null); setFileURL(null);
              setTopic(""); setFiltName(null); setFilters(FPRESET.Original);
              setSongsChanged(0); setPostId(null); setSelMusic(null);
            }}>+ Novo</button>
          </div>

          {/* Preview */}
          <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div id="preview-to-export" style={{ width: "100%", borderRadius: 18, overflow: "hidden", position: "relative", background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {fileURL ? (
                <div style={{ width: "100%", position: "relative" }}>
                  {isImg ? (
                    <img src={fileURL} alt="" style={{ width: "100%", height: "auto", display: "block", filter: fCSS }} />
                  ) : (
                    <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "6px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6 }}>
                        <img src="/src/assets/logo.png" style={{ width: 14, height: 14, objectFit: "contain" }} alt="" />
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>DVSCREATOR</div>
                      </div>
                      <ScoreRing score={result?.score} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(selMusic || result?.musicas?.[0]) && (function() {
                        const m = selMusic || result.musicas[0];
                        const mName = m.trackName || m.nome || "";
                        const mArtist = m.artistName || m.artista || "";
                        return (
                          <div style={{ alignSelf: "flex-start", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎵</div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{mName}</span>
                              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{mArtist}</span>
                            </div>
                          </div>
                        );
                      })()}
                      <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "12px 16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", maxWidth: "85%" }}>
                        <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.4, fontWeight: 500, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {caption.split("\\n")[0]}...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : <div style={{ color: D.w3 }}>Sem prévia</div>}
            </div>
          </div>

          {/* Filtros */}
          <div className="card" style={{ padding: 15 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Filtros <span style={{ color: D.blue2 }}>{filtName || "Original"}</span></div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none", marginBottom: 14 }}>
              {Object.keys(FPRESET).map(function(name) {
                const f = FPRESET[name];
                const css = "brightness(" + f.brightness + "%) contrast(" + f.contrast + "%) saturate(" + f.saturate + "%) sepia(" + (f.sepia||0) + "%) hue-rotate(" + (f.hue||0) + "deg)";
                const active = filtName === name;
                return (
                  <div key={name} onClick={() => applyFilt(name)} style={{ flexShrink: 0, cursor: "pointer", textAlign: "center", width: 66 }}>
                    <div style={{ width: 66, height: 66, borderRadius: 12, overflow: "hidden", border: "2.5px solid " + (active ? D.blue2 : D.b0), transition: "border .15s", marginBottom: 4, background: D.bg2 }}>
                      {fileURL && isImg ? <img src={fileURL} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: css }} /> : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1d4ed8,#06b6d4)", filter: css }} />}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? D.blue2 : D.w3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                  </div>
                );
              })}
            </div>
            {[["brightness","Brilho",50,160],["contrast","Contraste",50,160],["saturate","Saturação",0,200]].map(function(item) {
              const k = item[0], lb = item[1], mn = item[2], mx = item[3];
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 68, fontSize: 11, color: D.w2 }}>{lb}</div>
                  <input type="range" min={mn} max={mx} value={filters?.[k] || 100} onChange={function(e) { setFilters(function(p) { return Object.assign({}, p, { [k]: +e.target.value }); }); }} style={{ flex: 1, accentColor: D.blue2 }} />
                  <div style={{ width: 32, fontSize: 11, color: D.w3, textAlign: "right" }}>{filters?.[k] || 100}%</div>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="card" style={{ padding: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Legenda Otimizada</div>
              <button className="btn outline xs" onClick={copiar}>Copiar</button>
            </div>
            <textarea className="inp" value={caption} onChange={function(e) { setCaption(e.target.value); }} style={{ minHeight: 100, fontSize: 13 }} />
          </div>

          {/* SmartSound */}
          <SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} songsChanged={songsChanged} setSongsChanged={setSongsChanged} onSelect={setSelMusic} />

          {/* Turbinar */}
          <button className="btn rose lg" style={{ width: "100%" }} onClick={viral} disabled={vLoad}>
            {vLoad ? <Spin s={18} /> : "TURBINAR PARA VIRALIZAR"}
          </button>

          {/* Compartilhar */}
          <div style={{ background: D.s0, borderRadius: 20, padding: 20, border: "1px solid " + D.b1 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: D.blue2, textAlign: "center", marginBottom: 16, letterSpacing: 2 }}>COMPARTILHAR NAS REDES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {REDES.map(function(net) {
                return (
                  <button key={net.id}
                    onClick={function() { compartilharRede(net.id); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", background: net.grad, color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px " + net.color + "40", transition: "transform .15s" }}
                  >
                    <span style={{ fontSize: 18 }}>{net.icon}</span>
                    <span>{net.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <button className="btn ghost xs" onClick={function() { setMock({ platform: "insta", type: "reels" }); }} style={{ fontSize: 10 }}>👁️ Preview</button>
              <button className="btn ghost xs" onClick={function() { navigator.clipboard.writeText(caption); toast("Copiado!", "ok"); }} style={{ fontSize: 10 }}>📋 Copiar</button>
              <button className="btn ghost xs" onClick={compartilharDireto} style={{ fontSize: 10 }}>📤 Nativo</button>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 10, color: D.w3, marginTop: 4 }}>
            DVS — crie, edite e compartilhe seu conteúdo viral.
          </div>
        </div>
      </>
    );
  }

  // HOME
  return (`;

// Reconstruct
const newContent = beforeProc + newSection + homeAndBeyond;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Criador fully rebuilt! Lines:', newContent.split('\n').length);
