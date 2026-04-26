const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. CLEANUP BROKEN CODE
content = content.replace(/const realPublicar = async \(\) => {[\s\S]*?\/\/ 1\. Copiar a legenda automaticamente para o usuário só precisar "Colar"\s+/, "");

// 2. FIX API
content = content.replace(/gemini-2\.5-flash/g, "gemini-1.5-flash-latest");
content = content.replace(/\/v1beta\//g, "/v1/"); // Switch to v1 as I saw 404 in v1beta earlier? Wait, no, v1 gave 400.
// Let's use v1beta and make sure it's correct.
content = content.replace(/\/v1\//g, "/v1beta/");

// 3. REMOVE MUSIC STICKER OVER PHOTO
content = content.replace(/\{\/\* Música Overlay Editável \*\/\}\s+\{result\?\.musicas\?\.\[0\] && \([\s\S]*?\n\s+\)\}/, "");

// 4. UPDATE PROMPTS
content = content.replace(/A legenda e o hook DEVEM ser sobre o que está NA IMAGEM\./g, 'A legenda deve ser curta e impactante no estilo: Legenda! #viral #brasil.');

// 5. INJECT LOADING STATE INTO Criador
content = content.replace('const [vLoad, setVLoad] = useState(false);', 'const [vLoad, setVLoad] = useState(false); const SI = ["Lendo imagem...", "Extraindo cores...", "Analisando vibe...", "Buscando tendências...", "Gerando conteúdo..."]; const SV = ["Processando vídeo...", "Mapeando frames...", "Captando clima...", "Buscando áudio viral...", "Gerando estratégia..."];');

// Inject stage === "proc" check at the start of return
const procReturn = `  if (stage === "proc") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(5, 7, 9, 0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
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
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }
`;

const returnIndex = content.indexOf('  return (', content.indexOf('const Criador = ({ toast }) => {'));
if (returnIndex !== -1) {
    content = content.substring(0, returnIndex) + procReturn + '\n' + content.substring(returnIndex);
}

fs.writeFileSync(path, content, 'utf8');
console.log("ULTIMATE FIX APPLIED TO CLEAN RESTORED FILE!");
