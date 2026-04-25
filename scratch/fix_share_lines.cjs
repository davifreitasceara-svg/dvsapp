const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const newShareBox = `
        <div style={{ marginTop: 8, background: D.s0, borderRadius: 20, padding: 20, border: \`1px solid \${D.b0}\`, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.w3, textAlign: "center", marginBottom: 18, letterSpacing: 2 }}>COMPARTILHAR AGORA</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 15 }}>
            <button className="btn" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => setMock({ platform: 'insta', type: 'reels' })}>
              INSTAGRAM
            </button>
            <button className="btn" style={{ background: "#000", border: "2px solid #00f2ea", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => setMock({ platform: 'tiktok', type: 'feed' })}>
              TIKTOK
            </button>
            <button className="btn" style={{ background: "#25D366", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => { toast("Abrindo WhatsApp..."); window.open(\`https://wa.me/?text=\${encodeURIComponent(caption)}\`, '_blank'); }}>
              WHATSAPP
            </button>
            <button className="btn" style={{ background: D.bg3, border: \`1px solid \${D.blue}\`, color: D.blue2, height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={async () => {
              if(!isImg) { toast("Download de vídeo com filtros requer processamento pesado. Baixando original..."); window.open(fileURL, '_blank'); return; }
              toast("Preparando sua arte editada...");
              try {
                const el = document.getElementById('preview-to-export');
                if(!el) return;
                const canvas = await html2canvas(el, { useCORS: true, scale: 2 });
                const link = document.createElement('a');
                link.download = \`dvs-viral-\${Date.now()}.png\`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast("✅ Arte salva com sucesso!");
              } catch(e) { toast("Erro ao exportar: " + e.message); }
            }}>
              BAIXAR EDITADO
            </button>
          </div>
          
          <div style={{ fontSize: 10, color: D.w3, textAlign: "center", lineHeight: 1.4 }}>
            A arte será baixada com seu <b>filtro selecionado</b> e o <b>adesivo de música</b> aplicado.
          </div>
        </div>`;

// Replace from line 1073 to 1100 approximately
const lines = content.split(/\r?\n/);
const startIndex = lines.findIndex(l => l.includes('PUBLICAR AGORA') || l.includes('marginTop: 8, background: D.s0'));
const endIndex = lines.findIndex(l => l.includes('DVS simulará o app original'));

if (startIndex !== -1 && endIndex !== -1) {
    const before = lines.slice(0, startIndex).join('\n');
    const after = lines.slice(endIndex).join('\n');
    content = before + newShareBox + '\n        ' + after;
    fs.writeFileSync(path, content, 'utf8');
    console.log("SUCCESS: Share UI updated via line index!");
} else {
    console.log("FAILED: Could not find indices", startIndex, endIndex);
}
