const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const shareLogic = `
  const compartilharDireto = async () => {
    if (!isImg) {
      // Fallback para vídeo (não tem como processar filtro no browser fácil)
      if (navigator.share) {
        try {
          await navigator.share({ title: 'DVS EduCreator', text: caption, url: fileURL });
          return;
        } catch(e) {}
      }
      toast("Compartilhamento nativo não disponível. Use os botões abaixo.");
      return;
    }

    toast("✨ Preparando mídia editada...");
    try {
      const el = document.getElementById('preview-to-export');
      if (!el) return;
      const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
      
      canvas.toBlob(async (blob) => {
        const fileToShare = new File([blob], 'dvs-viral.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          try {
            await navigator.share({
              files: [fileToShare],
              title: 'DVS EduCreator',
              text: caption
            });
            toast("✅ Enviado com sucesso!");
          } catch (err) {
            if (err.name !== 'AbortError') toast("Erro ao compartilhar: " + err.message);
          }
        } else {
          // Fallback: Download
          const link = document.createElement('a');
          link.download = 'dvs-viral.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          toast("📱 Seu navegador não suporta envio direto. Imagem salva!");
        }
      }, 'image/png');
    } catch (e) {
      toast("Erro ao gerar arte: " + e.message);
    }
  };`;

// Insert the function before the return
content = content.replace('const fCSS =', shareLogic + '\n  const fCSS =');

// Replace the share box with a simpler "Share Everything" button + fallback grid
const newShareUI = `
        <div style={{ marginTop: 12, background: D.s0, borderRadius: 24, padding: 24, border: '2px solid ' + D.blue, boxShadow: "0 15px 45px rgba(0,0,0,0.4)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.blue2, textAlign: "center", marginBottom: 20, letterSpacing: 2 }}>LANÇAR NAS REDES</div>
          
          <button className="btn" style={{ width: "100%", height: 60, background: D.gBlue, color: "#fff", borderRadius: 16, fontSize: 16, fontWeight: 900, marginBottom: 16, boxShadow: "0 8px 20px rgba(37,99,235,0.3)" }} onClick={compartilharDireto}>
             🚀 COMPARTILHAR AGORA
          </button>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <button className="btn outline sm" style={{ fontSize: 10 }} onClick={() => setMock({ platform: 'insta', type: 'reels' })}>PREVIEW</button>
            <button className="btn outline sm" style={{ fontSize: 10 }} onClick={() => { navigator.clipboard.writeText(caption); toast("Copiado!"); }}>COPIAR</button>
            <button className="btn outline sm" style={{ fontSize: 10 }} onClick={async () => {
               const el = document.getElementById('preview-to-export');
               if(el) {
                 const c = await html2canvas(el, {useCORS:true, scale:2});
                 const l = document.createElement('a'); l.download='dvs.png'; l.href=c.toDataURL(); l.click();
               }
            }}>BAIXAR</button>
          </div>
        </div>`;

// Replace the old share box
const startSearch = 'COMPARTILHAR AGORA';
const index = content.indexOf(startSearch);
if (index !== -1) {
    const sectionStart = content.lastIndexOf('<div', index);
    const sectionEnd = content.indexOf('</div>', content.indexOf('SALVAR EDITADO', index)) + 6;
    content = content.substring(0, sectionStart) + newShareUI + content.substring(sectionEnd);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Direct Share implementation done!");
