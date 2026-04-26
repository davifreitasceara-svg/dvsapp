const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the entire "LANÇAR NAS REDES" block with a proper social sharing panel
const oldShareBlock = `        <div style={{ marginTop: 12, background: D.s0, borderRadius: 24, padding: 24, border: '2px solid ' + D.blue, boxShadow: "0 15px 45px rgba(0,0,0,0.4)" }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.blue2, textAlign: "center", marginBottom: 20, letterSpacing: 2 }}>LAN AR NAS REDES</div>
          
          <button className="btn" style={{ width: "100%", height: 60, background: D.gBlue, color: "#fff", borderRadius: 16, fontSize: 16, fontWeight: 900, marginBottom: 16, boxShadow: "0 8px 20px rgba(37,99,235,0.3)" }} onClick={compartilharDireto}>
              COMPARTILHAR AGORA
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

const newShareBlock = `        <div style={{ background: D.s0, borderRadius: 20, padding: 20, border: \`1px solid \${D.b1}\` }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: D.blue2, textAlign: "center", marginBottom: 16, letterSpacing: 2 }}>COMPARTILHAR NAS REDES</div>
          
          {/* Main Share Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { id: "instagram", label: "Instagram", color: "#E1306C", grad: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", icon: "📸" },
              { id: "tiktok",    label: "TikTok",    color: "#010101", grad: "linear-gradient(135deg,#010101,#69C9D0)", icon: "🎵" },
              { id: "whatsapp", label: "WhatsApp",  color: "#25D366", grad: "linear-gradient(135deg,#128C7E,#25D366)", icon: "💬" },
              { id: "facebook", label: "Facebook",  color: "#1877F2", grad: "linear-gradient(135deg,#1877F2,#42a5f5)", icon: "📘" },
              { id: "twitter",  label: "Twitter/X",  color: "#1DA1F2", grad: "linear-gradient(135deg,#000,#1DA1F2)", icon: "🐦" },
              { id: "telegram", label: "Telegram",  color: "#2CA5E0", grad: "linear-gradient(135deg,#0088cc,#2CA5E0)", icon: "✈️" },
            ].map(net => (
              <button key={net.id}
                onClick={() => compartilharRede(net.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
                  background: net.grad, color: "#fff", border: "none", borderRadius: 14,
                  fontWeight: 800, fontSize: 14, cursor: "pointer",
                  boxShadow: \`0 4px 16px \${net.color}40\`,
                  transition: "transform .15s, box-shadow .15s",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = \`0 8px 24px \${net.color}55\`; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = \`0 4px 16px \${net.color}40\`; }}
              >
                <span style={{ fontSize: 20 }}>{net.icon}</span>
                <span style={{ fontSize: 13 }}>{net.label}</span>
              </button>
            ))}
          </div>

          {/* Utility row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <button className="btn ghost xs" onClick={() => setMock({ platform: 'insta', type: 'reels' })} style={{ fontSize: 10 }}>👁️ Preview</button>
            <button className="btn ghost xs" onClick={() => { navigator.clipboard.writeText(caption); toast("Legenda copiada!", "ok"); }} style={{ fontSize: 10 }}>📋 Copiar</button>
            <button className="btn ghost xs" onClick={compartilharDireto} style={{ fontSize: 10 }}>📤 Nativo</button>
          </div>
        </div>`;

if (content.includes(oldShareBlock)) {
    content = content.replace(oldShareBlock, newShareBlock);
    console.log('Share block replaced!');
} else {
    console.log('Share block NOT found — trying fuzzy match...');
    // Try partial
    const partialOld = 'LAN AR NAS REDES';
    const idx = content.indexOf(partialOld);
    if (idx !== -1) {
        console.log('Partial found at index', idx);
    }
}

// 2. Add compartilharRede function before compartilharDireto
const compartilharDiretoFn = 'const compartilharDireto = async () => {';
const compartilharRedeFn = `const compartilharRede = async (rede) => {
    // Save edits first
    if (postId) {
      try { await supabase.from('posts').update({ content: { ...result, caption, filters, music: selMusic } }).eq('id', postId); } catch(e) {}
    }

    // Generate image blob
    toast("Preparando para " + rede + "...", "info");
    let blob = null;
    if (isImg) {
      try {
        const el = document.getElementById('preview-to-export');
        if (el) {
          const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
          blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        }
      } catch(e) {}
    }

    const text = caption;
    const file = blob ? new File([blob], 'dvs-viral.png', { type: 'image/png' }) : null;

    // Redirect URLs for each social network
    const encoded = encodeURIComponent(text);
    const urls = {
      instagram: null, // Instagram doesn't support URL sharing, use native share
      tiktok:    null, // Same
      whatsapp:  \`https://api.whatsapp.com/send?text=\${encoded}\`,
      facebook:  \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(window.location.href)}&quote=\${encoded}\`,
      twitter:   \`https://twitter.com/intent/tweet?text=\${encoded}\`,
      telegram:  \`https://t.me/share/url?url=\${encodeURIComponent(window.location.href)}&text=\${encoded}\`,
    };

    // Instagram and TikTok — use native share with file if available
    if (rede === 'instagram' || rede === 'tiktok') {
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'DVSCREATOR', text });
          toast("Aberto para compartilhar!", "ok");
        } catch(err) {
          if (err.name !== 'AbortError') {
            // Fallback: just open instagram
            if (rede === 'instagram') window.open('https://www.instagram.com/', '_blank');
            else window.open('https://www.tiktok.com/upload', '_blank');
          }
        }
      } else {
        // No file support — copy caption + open app
        navigator.clipboard.writeText(text).catch(() => {});
        toast("Legenda copiada! Abra o " + rede + " e cole.", "ok");
        if (rede === 'instagram') window.open('https://www.instagram.com/', '_blank');
        else window.open('https://www.tiktok.com/', '_blank');
      }
      return;
    }

    // WhatsApp, Facebook, Twitter, Telegram — open URL
    if (urls[rede]) {
      // Also try to share file via native if available
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && (rede === 'whatsapp')) {
        try {
          await navigator.share({ files: [file], title: 'DVSCREATOR', text });
          toast("Compartilhado!", "ok");
          return;
        } catch(err) {}
      }
      window.open(urls[rede], '_blank');
      toast("Abrindo " + rede + "...", "ok");
    }
  };

  `;

if (content.includes(compartilharDiretoFn)) {
    content = content.replace(compartilharDiretoFn, compartilharRedeFn + compartilharDiretoFn);
    console.log('compartilharRede function added!');
} else {
    console.log('compartilharDireto function NOT found!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
