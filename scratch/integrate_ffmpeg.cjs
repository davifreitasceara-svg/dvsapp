const fs = require('fs');

const filePath = 'src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Ensure import is there
if (!content.includes('import { generateVideo }')) {
  content = content.replace('import { createClient } from "@supabase/supabase-js";', 'import { createClient } from "@supabase/supabase-js";\nimport { generateVideo } from "./services/ffmpegService";');
}

// Replace compartilharRede
const shareLogicStart = 'const compartilharRede = async (rede) => {';
const shareLogicEnd = 'const compartilharDireto = async () => {';
const idxShare = content.indexOf(shareLogicStart);
const idxShareEnd = content.indexOf(shareLogicEnd);

if (idxShare !== -1 && idxShareEnd !== -1) {
  const newShare = `const compartilharRede = async (rede) => {
    if (postId) {
      try { await supabase.from("posts").update({ content: { ...result, caption, filters, music: selMusic } }).eq("id", postId); } catch(e) {}
    }

    toast("Preparando conteúdo...", "info");
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

    let fileToShare = blob ? new File([blob], "dvs-post.png", { type: "image/png" }) : null;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Se houver música selecionada, gerar vídeo
    const activeMusic = selMusic || result?.musicas?.[0];
    if (blob && activeMusic && activeMusic.previewUrl) {
      toast("Gerando vídeo com música... (Isso pode demorar alguns segundos)", "info");
      try {
        const videoBlob = await generateVideo(blob, activeMusic.previewUrl, (prog) => {
          // Progress could be handled here if we want to update state, but for now a toast is enough
        });
        fileToShare = new File([videoBlob], "dvs-video.mp4", { type: "video/mp4" });
        toast("Vídeo gerado!", "ok");
      } catch (err) {
        console.error("Video gen failed", err);
        toast("Falha ao gerar vídeo com música. Compartilhando imagem...", "err");
      }
    }

    let sharedViaNative = false;
    if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      try {
        toast("Selecione o " + rede + " no menu que vai abrir!", "ok");
        await navigator.share({ files: [fileToShare], title: "DVSCREATOR", text });
        sharedViaNative = true;
      } catch(err) {
        // Usuário cancelou ou falhou
      }
    }

    if (!sharedViaNative) {
      // Fallback: Baixa o arquivo para a galeria
      if (fileToShare) {
        const url = URL.createObjectURL(fileToShare);
        const link = document.createElement("a");
        link.download = fileToShare.name;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast("Arquivo salvo na galeria! Cole a legenda no " + rede + ".", "ok");
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
console.log('App.jsx integrated with FFmpeg!');
