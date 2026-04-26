const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update SmartSoundPlayer to support onSelect
content = content.replace('const SmartSoundPlayer = ({ musicas, toast, plan, songsChanged, setSongsChanged }) => {', 
                          'const SmartSoundPlayer = ({ musicas, toast, plan, songsChanged, setSongsChanged, onSelect }) => {');

// 2. Call onSelect in playTrack
// Note: songsChanged check is already there. I'll add onSelect(t)
const playTrackOld = 'setHistory(h => [t, ...h.filter(x => x.trackId !== t.trackId)].slice(0, 20));';
const playTrackNew = 'setHistory(h => [t, ...h.filter(x => x.trackId !== t.trackId)].slice(0, 20));\n    if (onSelect) onSelect(t);';
content = content.replace(playTrackOld, playTrackNew);

// 3. Pass onSelect to SmartSoundPlayer in Criador
content = content.replace('<SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} songsChanged={songsChanged} setSongsChanged={setSongsChanged} />', 
                          '<SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} songsChanged={songsChanged} setSongsChanged={setSongsChanged} onSelect={setSelMusic} />');

// 4. Use selMusic in Criador render (Mockup and Overlays)
// For Mockup
content = content.replace('music={result?.musicas?.[0]}', 'music={selMusic || result?.musicas?.[0]}');

// For Export Overlay
const musicOverlayOld = '{result?.musicas?.[0] && (';
const musicOverlayNew = '{(selMusic || result?.musicas?.[0]) && (';
content = content.replace(musicOverlayOld, musicOverlayNew);

const musicNameOld = '{result.musicas[0].nome}';
const musicNameNew = '{(selMusic || result.musicas[0]).nome}';
content = content.replace(musicNameOld, musicNameNew);

const musicArtistOld = '{result.musicas[0].artista}';
const musicArtistNew = '{(selMusic || result.musicas[0]).artista}';
content = content.replace(musicArtistOld, musicArtistNew);

// 5. Add Save/Remove buttons in Criador result screen
const resultTitleRow = 'Revis o Final </div>';
const resultButtons = `Revisão Final </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn sm" onClick={async () => {
                if (postId) {
                  await supabase.from('posts').update({ content: { ...result, caption, filters, music: selMusic } }).eq('id', postId);
                  toast("Alterações salvas no banco!", "ok");
                }
              }} style={{ background: D.gMint, color: "#fff", border: "none", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}> Salvar</button>
              <button className="btn sm" onClick={() => {
                setCaption(\`\${result.hook}\\n\\n\${result.caption}\\n\\n\${result.hashtags.map(h => "#" + h).join(" ")}\`);
                setFilters(FPRESET.Original);
                setFiltName("Original");
                setSelMusic(null);
                toast("Edições removidas!", "info");
              }} style={{ background: D.s3, color: D.w2, border: \`1.5px solid \${D.b1}\`, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}> Resetar</button>
            </div>`;
content = content.replace(resultTitleRow, resultButtons);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx updated with v5 changes: Music sync and Save/Reset buttons!');
