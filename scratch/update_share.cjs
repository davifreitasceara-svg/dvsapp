const fs = require('fs');

const filePath = 'src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldShare = `  const compartilharRede = async (rede) => {
    // Save edits first
    if (postId) {
      try { await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId); } catch(e) {}
    }

    // Generate image blob
    toast("Preparando para " + rede + "...", "info");
    let blob = null;
    if (isImg) {
      try {
        const el = document.getElementById("preview-to-export");
        if (el) {
          const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
          blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        }
      } catch(e) {}
    }

    const text = caption;
    const file = blob ? new File([blob], "dvs-viral.png", { type: "image/png" }) : null;

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
    if (rede === "instagram" || rede === "tiktok") {
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "DVSCREATOR", text });
          toast("Aberto para compartilhar!", "ok");
        } catch(err) {
          if (err.name !== "AbortError") {
            // Fallback: just open instagram
            if (rede === "instagram") window.open("https://www.instagram.com/", "_blank");
            else window.open("https://www.tiktok.com/upload", "_blank");
          }
        }
      } else {
        // No file support — copy caption + open app
        navigator.clipboard.writeText(text).catch(() => {});
        toast("Legenda copiada! Abra o " + rede + " e cole.", "ok");
        if (rede === "instagram") window.open("https://www.instagram.com/", "_blank");
        else window.open("https://www.tiktok.com/", "_blank");
      }
      return;
    }

    // WhatsApp, Facebook, Twitter, Telegram — open URL
    if (urls[rede]) {
      // Also try to share file via native if available
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && (rede === "whatsapp")) {
        try {
          await navigator.share({ files: [file], title: "DVSCREATOR", text });
          toast("Compartilhado!", "ok");
          return;
        } catch(err) {}
      }
      window.open(urls[rede], "_blank");
      toast("Abrindo " + rede + "...", "ok");
    }
  };`;

const newShare = `  const compartilharRede = async (rede) => {
    // Save edits first
    if (postId) {
      try { await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId); } catch(e) {}
    }

    toast("Preparando para " + rede + "...", "info");
    
    // Copiar legenda automaticamente
    const text = caption;
    try { await navigator.clipboard.writeText(text); } catch(e) {}
    
    let blob = null;
    if (isImg) {
      try {
        const el = document.getElementById("preview-to-export");
        if (el) {
          const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
          blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        }
      } catch(e) {}
    }

    const file = blob ? new File([blob], "dvs-viral.png", { type: "image/png" }) : null;
    const encoded = encodeURIComponent(text);
    
    // Fallback URLs
    const urls = {
      whatsapp:  \`https://api.whatsapp.com/send?text=\${encoded}\`,
      facebook:  \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(window.location.href)}&quote=\${encoded}\`,
      twitter:   \`https://twitter.com/intent/tweet?text=\${encoded}\`,
      telegram:  \`https://t.me/share/url?url=\${encodeURIComponent(window.location.href)}&text=\${encoded}\`,
    };

    // Compartilhamento com arquivo (Mobile)
    // O Web Share API abre o menu do sistema onde o usuario escolhe Instagram/TikTok.
    // É a única forma de enviar arquivos para outros apps via Web.
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        toast("Legenda copiada! Escolha o " + rede + " no menu.", "ok");
        await navigator.share({ files: [file], title: "DVSCREATOR", text });
        return;
      } catch(err) {
        // Se o usuário cancelar, apenas segue para os fallbacks abaixo
      }
    }

    // Se chegou aqui: ou é Desktop (sem suporte a share file), ou o usuário cancelou o share nativo.
    toast("Legenda copiada! Abrindo " + rede + "...", "ok");
    
    // Deep links para tentar abrir o App direto no Mobile, ou Fallback web no Desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (rede === 'instagram') {
      if (isMobile) window.open("instagram://camera", "_blank"); // Abre a câmera/story do app
      else window.open("https://www.instagram.com/", "_blank");
    } 
    else if (rede === 'tiktok') {
      if (isMobile) window.open("snssdk1233://", "_blank"); // Tenta abrir o app do TikTok
      else window.open("https://www.tiktok.com/upload", "_blank");
    }
    else if (urls[rede]) {
      window.open(urls[rede], "_blank");
    }
  };`;

// Because the indentation might be slightly different or there are template literal differences,
// let's use a robust replace
const markerStart = 'const compartilharRede = async (rede) => {';
const markerEnd = 'const compartilharDireto = async () => {';

const idxStart = content.indexOf(markerStart);
const idxEnd = content.indexOf(markerEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const before = content.substring(0, idxStart);
  const after = content.substring(idxEnd);
  const newContent = before + newShare + '\n\n  ' + after;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('compartilharRede updated!');
} else {
  console.log('Markers not found!');
}
