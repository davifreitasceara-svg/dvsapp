const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const newShareBox = \`
        <div style={{ marginTop: 12, background: D.s0, borderRadius: 20, padding: 20, border: '1px solid ' + D.b0, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.w3, textAlign: "center", marginBottom: 18, letterSpacing: 2 }}>COMPARTILHAR AGORA</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 15 }}>
            <button className="btn" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => setMock({ platform: 'insta', type: 'reels' })}>
              INSTAGRAM
            </button>
            <button className="btn" style={{ background: "#000", border: "2px solid #00f2ea", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => setMock({ platform: 'tiktok', type: 'feed' })}>
              TIKTOK
            </button>
            <button className="btn" style={{ background: "#25D366", color: "#fff", height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={() => { toast("Abrindo WhatsApp..."); window.open('https://wa.me/?text=' + encodeURIComponent(caption), '_blank'); }}>
              WHATSAPP
            </button>
            <button className="btn" style={{ background: D.bg3, border: '1px solid ' + D.blue, color: D.blue2, height: 50, borderRadius: 14, fontSize: 12, fontWeight: 900 }} onClick={async () => {
              if(!isImg) { toast("Download de vídeo com filtros requer processamento pesado. Baixando original..."); window.open(fileURL, '_blank'); return; }
              toast("Preparando sua arte editada...");
              try {
                const el = document.getElementById('preview-to-export');
                if(!el) return;
                const canvas = await html2canvas(el, { useCORS: true, scale: 2 });
                const link = document.createElement('a');
                link.download = 'dvs-viral-' + Date.now() + '.png';
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
        </div>\`;

// Replace from line 1073 to 1100 approximately
// Use a very simple string search
const oldAnchor = 'PUBLICAR AGORA';
const startMarker = '<div style={{ marginTop: 8, background: D.s0';

const index = content.indexOf(oldAnchor);
if (index !== -1) {
    const sectionStart = content.lastIndexOf('<div', index);
    const sectionEnd = content.indexOf('</div>', content.indexOf('TIKTOK', index)) + 6;
    // Actually find the end of that specific </div> chain
    const endAnchor = 'DVS simulará o app original';
    const finalEnd = content.lastIndexOf('<div', content.indexOf(endAnchor)) - 1;

    content = content.substring(0, sectionStart) + newShareBox + content.substring(finalEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log("FINAL ATTEMPT SUCCESS!");
} else {
    console.log("NOT FOUND");
}
