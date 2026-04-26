const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add icons for play and select
const iconsEnd = '  star:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,\n};';
const iconsWithMusicUX = '  star:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,\n  playFill: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>,\n  check:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,\n};';
if (content.includes(iconsEnd)) {
    content = content.replace(iconsEnd, iconsWithMusicUX);
}

// 2. Update search results list items
// We want a Play button AND a Select button.
const searchItemOld = `<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", background: track?.trackId===r.trackId?\`\${D.rose}14\`:D.bg2, border: \`1.5px solid \${track?.trackId===r.trackId?D.rose+"55":D.b0}\`, borderRadius: 11, cursor: "pointer", transition: "all .15s" }}
                    onClick={() => playTrack(r)}>`;

const searchItemNew = `<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", background: (selMusic?.trackId===r.trackId || track?.trackId===r.trackId)?\`\${D.rose}14\`:D.bg2, border: \`1.5px solid \${(selMusic?.trackId===r.trackId || track?.trackId===r.trackId)?D.rose+"55":D.b0}\`, borderRadius: 11, transition: "all .15s" }}>
                    <div style={{ position: "relative", width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, cursor: "pointer" }} onClick={() => playTrack(r)}>
                      {r.artworkUrl60 ? <img src={r.artworkUrl60} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: D.gBlue }} />}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        {track?.trackId === r.trackId && playing ? <Spin s={14} c="#fff" /> : ICONS.playFill}
                      </div>
                    </div>`;

content = content.replace(searchItemOld, searchItemNew);

// Adjust the inner part of search items (remove the old artwork and add Select button)
// This part is tricky because I need to find the right closing tag.
// I'll use a more surgical replacement for the search item body.

const searchBodyOld = `{r.artworkUrl60
                      ? <img src={r.artworkUrl60} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      : <div style={{ width: 40, height: 40, borderRadius: 8, background: D.gBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}></div>}`;

content = content.replace(searchBodyOld, '');

const searchButtonsOld = `<div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: D.w3 }}>{fmt(r.trackTimeMillis)}</span>
                      <button onClick={e => { e.stopPropagation(); addQueue(r); }} title="Adicionar   fila"
                        style={{ background: D.accLo||D.blueLo, border: \`1px solid \${D.blueM}\`, borderRadius: 6, padding: "3px 7px", fontSize: 11, color: D.blue2, cursor: "pointer" }}>+</button>
                    </div>`;

const searchButtonsNew = `<div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: D.w3 }}>{fmt(r.trackTimeMillis)}</span>
                      <button onClick={() => { playTrack(r); if(onSelect) onSelect(r); }} 
                        style={{ background: selMusic?.trackId === r.trackId ? D.gRose : D.blue, color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {selMusic?.trackId === r.trackId ? <>{ICONS.check} USANDO</> : "USAR"}
                      </button>
                    </div>`;

content = content.replace(searchButtonsOld, searchButtonsNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx music UX improved: Listen and Select buttons added!');
