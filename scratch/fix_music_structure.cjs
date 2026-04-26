const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Helper to get music info correctly from both structures
const musicLogicOld = `                    {(selMusic || result?.musicas?.[0]) && (
                      <div style={{ alignSelf: "flex-start", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎵</div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{(selMusic || result.musicas[0]).nome}</span>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{(selMusic || result.musicas[0]).artista}</span>
                        </div>
                      </div>
                    )}`;

const musicLogicNew = `                    {(() => {
                      const m = selMusic || result?.musicas?.[0];
                      if (!m) return null;
                      const mName = m.trackName || m.nome;
                      const mArtist = m.artistName || m.artista;
                      return (
                        <div style={{ alignSelf: "flex-start", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", padding: "8px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎵</div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{mName}</span>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{mArtist}</span>
                          </div>
                        </div>
                      );
                    })()}`;

content = content.replace(musicLogicOld, musicLogicNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx music structure compatibility fixed!');
