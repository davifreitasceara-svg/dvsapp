const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const newShareBox = `
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
        </div>`;

content = content.replace(/PUBLICAR AGORA/g, 'COMPARTILHAR AGORA');
// More robust replace for the container
const oldText = 'DVS simulará o app original';
if (content.includes(oldText)) {
    // Replace the Instagram/TikTok cards logic if it's still there
    content = content.replace(/<div style={{ background: "linear-gradient\(45deg, #f09433, #bc1888\)"[\s\S]*?<\/div>\s*<\/div>/, "");
    content = content.replace(/<div style={{ background: "#000", borderRadius: 14, padding: "12px 10px", border: "2.5px solid #00f2ea" }}>[\s\S]*?<\/div>\s*<\/div>/, "");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Simple replace done!");
