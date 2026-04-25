const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const newShareBox = `
        <div style={{ marginTop: 12, background: D.s0, borderRadius: 20, padding: 20, border: '1px solid ' + D.b0, boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.w3, textAlign: "center", marginBottom: 20, letterSpacing: 2 }}>COMPARTILHAR AGORA</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 15 }}>
            <button className="btn" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", height: 50, borderRadius: 14, fontSize: 11, fontWeight: 900 }} onClick={() => setMock({ platform: 'insta', type: 'reels' })}>
              INSTAGRAM
            </button>
            <button className="btn" style={{ background: "#000", border: "2px solid #00f2ea", color: "#fff", height: 50, borderRadius: 14, fontSize: 11, fontWeight: 900 }} onClick={() => setMock({ platform: 'tiktok', type: 'feed' })}>
              TIKTOK
            </button>
            <button className="btn" style={{ background: "#25D366", color: "#fff", height: 50, borderRadius: 14, fontSize: 11, fontWeight: 900 }} onClick={() => { toast("📱 Abrindo WhatsApp..."); window.open('https://wa.me/?text=' + encodeURIComponent(caption), '_blank'); }}>
              WHATSAPP
            </button>
            <button className="btn" style={{ background: D.bg3, border: '1px solid ' + D.blue, color: D.blue2, height: 50, borderRadius: 14, fontSize: 11, fontWeight: 900 }} onClick={async () => {
              if(!isImg) { toast("📥 Baixando vídeo original..."); window.open(fileURL, '_blank'); return; }
              toast("✨ Gerando sua arte editada...");
              try {
                const el = document.getElementById('preview-to-export');
                if(!el) return;
                const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
                const link = document.createElement('a');
                link.download = 'dvs-viral-' + Date.now() + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast("✅ Salvo na galeria!");
              } catch(e) { toast("Erro: " + e.message); }
            }}>
              SALVAR EDITADO
            </button>
          </div>
        </div>`;

const startMarker = '<button className="btn rose lg" style={{ width: "100%" }} onClick={viral} disabled={vLoad}>\n          {vLoad ? <Spin s={18} /> : "🚀 TURBINAR PARA VIRALIZAR"}\n        </button>';
const endMarker = 'DVS simulará o app original';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const finalStart = startIndex + startMarker.length;
    const finalEnd = content.lastIndexOf('<div', endIndex);
    content = content.substring(0, finalStart) + newShareBox + '\n        ' + content.substring(finalEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log("CLEANUP SUCCESS!");
} else {
    console.log("CLEANUP FAILED", startIndex, endIndex);
}
