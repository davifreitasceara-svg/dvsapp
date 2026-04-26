const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. SWITCH BACK TO v1beta (required for systemInstruction) and use gemini-2.0-flash-exp
content = content.replace(/\/v1\//g, "/v1beta/");
content = content.replace(/gemini-1\.5-flash/g, "gemini-1.5-flash-latest");

// 2. ADD LOADING OVERLAY WHILE PROCESSING
// We need to inject the loading overlay into the Criador component
const loadingOverlay = `
      {/* LOADING OVERLAY PREMIUM */}
      {load && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(5, 7, 9, 0.95)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 24, animation: "fadeIn .3s ease both"
        }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
             <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
             <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
             <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✨</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{SI[cur] || "Analisando..."}</div>
            <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
            </div>
            <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600, letterSpacing: 1 }}>{pct}% CONCLUÍDO</div>
          </div>
        </div>
      )}
`;

// Find where the Criador return starts
const criadorHeader = 'const Criador = ({ toast }) => {';
const criadorIndex = content.indexOf(criadorHeader);
const startMarker = '  return (';
const startIndex = content.indexOf(startMarker, criadorIndex);

if (startIndex !== -1) {
    content = content.substring(0, startIndex + startMarker.length) + loadingOverlay + content.substring(startIndex + startMarker.length);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Loading Animation and API Fix Deployed!");
} else {
    console.log("FAILED TO INJECT LOADING");
}
