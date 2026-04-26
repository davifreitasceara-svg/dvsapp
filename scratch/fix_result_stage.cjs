const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file has a duplicated "if (stage === result)" block and broken JSX around lines 1150-1175
// We need to:
// 1. Remove the first broken block (1150-1173) which has corrupted JSX
// 2. Keep the second (1175+) which is the correct one

// Find both occurrences
const marker = 'if (stage === "result" && result) {';
const idx1 = content.indexOf(marker);
const idx2 = content.indexOf(marker, idx1 + 1);

if (idx1 !== -1 && idx2 !== -1) {
    // Remove from idx1 to just before idx2
    const before = content.substring(0, idx1);
    const after = content.substring(idx2);
    content = before + after;
    console.log('Duplicate if(result) block removed!');
} else {
    console.log(`Found at idx1=${idx1}, idx2=${idx2}`);
}

// Also fix the broken header section — lines around 1209 in new numbering
// The header area has fileURL mixed in wrongly after the Resetar button
// Find the broken part where fileURL appears inside the header buttons
const brokenMix = `              }} style={{ background: D.s3, color: D.w2, border: \`1.5px solid \${D.b1}\`, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}> Resetar</button>
            {fileURL ? (`;

const fixedMix = `              }} style={{ background: D.s3, color: D.w2, border: \`1.5px solid \${D.b1}\`, borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}> Resetar</button>
            </div>
          </div>
          <button className="btn ghost xs" onClick={() => { setStage("home"); setResult(null); setFile(null); setFileURL(null); setTopic(""); setFiltName(null); setFilters(FPRESET.Original); setSongsChanged(0); setPostId(null); setSelMusic(null); }}>+ Novo</button>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 300, background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div id="preview-to-export" style={{ width: "100%", borderRadius: 18, overflow: "hidden", position: "relative", background: D.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {fileURL ? (`;

if (content.includes(brokenMix)) {
    content = content.replace(brokenMix, fixedMix);
    console.log('Broken header mix fixed!');
} else {
    console.log('Broken mix not found — checking manually...');
    // Find the Resetar button and check what follows
    const resetIdx = content.indexOf('Resetar</button>');
    if (resetIdx !== -1) {
        console.log('Resetar button at index', resetIdx);
        console.log('Next 200 chars:', content.substring(resetIdx, resetIdx + 200));
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx result stage fixed!');
