const fs = require('fs');

const filePath = 'src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const redesMarkerStart = 'const REDES = [';
const redesMarkerEnd = '];';
const idxRedes = content.indexOf(redesMarkerStart);
const idxRedesEnd = content.indexOf(redesMarkerEnd, idxRedes);

if (idxRedes !== -1 && idxRedesEnd !== -1) {
  const newRedes = `const REDES = [
      { id: "instagram", label: "Instagram",  grad: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fd1d1d", icon: "📸" },
      { id: "tiktok",    label: "TikTok",      grad: "linear-gradient(135deg,#010101,#69C9D0)",        color: "#69C9D0", icon: "🎵" },
      { id: "facebook",  label: "Facebook",    grad: "linear-gradient(135deg,#1877F2,#42a5f5)",        color: "#1877F2", icon: "📘" },
      { id: "telegram",  label: "Telegram",    grad: "linear-gradient(135deg,#0088cc,#2CA5E0)",        color: "#2CA5E0", icon: "✈️" },
    ];`;
  
  content = content.substring(0, idxRedes) + newRedes + content.substring(idxRedesEnd + 2);
}

const shareLogicStart = 'const compartilharRede = async (rede) => {';
const shareLogicEnd = 'const compartilharDireto = async () => {';
const idxShare = content.indexOf(shareLogicStart);
const idxShareEnd = content.indexOf(shareLogicEnd);

if (idxShare !== -1 && idxShareEnd !== -1) {
  const newShare = `const compartilharRede = async (rede) => {
    if (postId) {
      try { await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId); } catch(e) {}
    }

    toast("Processando imagem...", "info");
    const text = caption;
    try { await navigator.clipboard.writeText(text); } catch(e) {}

    let blob = null;
    let dataUrl = null;
    if (isImg) {
      try {
        const el = document.getElementById("preview-to-export");
        if (el) {
          const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
          dataUrl = canvas.toDataURL("image/png");
          blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        }
      } catch(e) {}
    }

    const file = blob ? new File([blob], "dvs-post.png", { type: "image/png" }) : null;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Na Web, compartilhar arquivos DIRETAMENTE para um app específico não é suportado por segurança.
    // O Web Share API (navigator.share) é a única ponte, e ele abre o menu do sistema.
    // Se falhar ou for desktop, nós baixamos a imagem para a galeria e abrimos o app.
    
    let sharedViaNative = false;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        toast("Selecione o " + rede + " no menu que vai abrir!", "ok");
        await navigator.share({ files: [file], title: "DVSCREATOR", text });
        sharedViaNative = true;
      } catch(err) {
        // Usuário cancelou ou falhou
      }
    }

    if (!sharedViaNative) {
      // Fallback: Baixa a imagem para a galeria do usuário para que ele possa postar manualmente
      if (dataUrl) {
        const link = document.createElement("a");
        link.download = "dvs-post-" + rede + ".png";
        link.href = dataUrl;
        link.click();
        toast("Imagem salva na galeria! Cole a legenda no " + rede + ".", "ok");
      }

      setTimeout(() => {
        if (rede === 'instagram') {
          if (isMobile) window.open("instagram://camera", "_blank");
          else window.open("https://www.instagram.com/", "_blank");
        } else if (rede === 'tiktok') {
          if (isMobile) window.open("snssdk1233://", "_blank");
          else window.open("https://www.tiktok.com/upload", "_blank");
        } else if (rede === 'facebook') {
          window.open("https://www.facebook.com/", "_blank");
        } else if (rede === 'telegram') {
          window.open("https://t.me/share/url?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent(text), "_blank");
        }
      }, 1000);
    }
  };

  `;
  
  content = content.substring(0, idxShare) + newShare + content.substring(idxShareEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Share logic updated and specific networks removed.');
