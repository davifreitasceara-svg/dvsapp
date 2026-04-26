const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The problematic section starts around line 1227
const targetPart = `        <div style={{ width: 68, height: 68, borderRadius: 18, overflow: 'hidden', border: \`1px solid \${D.blueM}\`, display: "flex", alignItems: "center", justifyContent: "center", animation: "float2 3.5s ease-in-out infinite", background: D.bg3 }}>
          <img src="/src/assets/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
        </div>


      

      {/* preview */}`;

const fixedPart = `        <div style={{ width: 68, height: 68, borderRadius: 18, overflow: 'hidden', border: \`1px solid \${D.blueM}\`, display: "flex", alignItems: "center", justifyContent: "center", animation: "float2 3.5s ease-in-out infinite", background: D.bg3 }}>
          <img src="/src/assets/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 5 }}>Envie sua foto ou vídeo</div>
          <div style={{ fontSize: 13, color: D.w2 }}>Foto ou vídeo da galeria</div>
          <div style={{ fontSize: 12, color: D.w3, marginTop: 4 }}>JPG • PNG • GIF • MP4 • MOV</div>
        </div>
        <span className="tag tblue" style={{ fontSize: 12 }}>✨ IA analisa o conteúdo visual automaticamente</span>
      </label>

      {/* preview */}`;

if (content.includes(targetPart)) {
    content = content.replace(targetPart, fixedPart);
    console.log('Unclosed label fixed!');
} else {
    // Fuzzy match for targetPart
    const fuzzyTarget = /<div style={{ width: 68, height: 68, borderRadius: 18, overflow: 'hidden', border: `1px solid \${D.blueM}`, display: "flex", alignItems: "center", justifyContent: "center", animation: "float2 3.5s ease-in-out infinite", background: D.bg3 }}>[\s\S]*?<\/div>[\s\S]*?{\/\* preview \*\/}/;
    if (fuzzyTarget.test(content)) {
        content = content.replace(fuzzyTarget, fixedPart);
        console.log('Unclosed label fixed with fuzzy match!');
    } else {
        console.log('Could not find target part for label fix.');
    }
}

fs.writeFileSync(filePath, content, 'utf8');
