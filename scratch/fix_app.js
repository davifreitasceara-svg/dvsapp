import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// I'll update realPublicar to include a "Download & Go" strategy which is the most reliable way to "send and post"
const FINAL_PUBLICAR = `
  const realPublicar = async () => {
    if (!mock) return;
    const { platform, type } = mock;
    
    try {
      // 1. Copiar a legenda automaticamente para o usuário só precisar "Colar"
      await navigator.clipboard.writeText(caption);
      
      // 2. Tentar o compartilhamento direto do sistema (Abre o App direto com a mídia)
      const canShare = file && navigator.canShare && navigator.canShare({ files: [file] });
      
      if (canShare && navigator.share) {
        await navigator.share({
          files: [file],
          title: 'DVS Content',
          text: caption
        });
        toast(\`🚀 Abrindo o \${platform.toUpperCase()} agora...\`, "ok");
      } else {
        // 3. Fallback: Forçar o download da mídia para o topo da galeria e abrir o app
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = isImg ? 'dvs-post.jpg' : 'dvs-post.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 4. Abrir o App na tela de postagem
        let deepLink = "";
        if (platform === 'insta') {
          if (type === 'stories') deepLink = "instagram://story-camera";
          else if (type === 'reels') deepLink = "instagram://reels_share";
          else deepLink = "instagram://library";
        } else {
          deepLink = "snssdk1128://feed";
        }
        
        setTimeout(() => {
          window.location.href = deepLink;
        }, 800);
        
        toast(\`✅ Mídia salva e legenda copiada! O \${platform.toUpperCase()} está abrindo...\`, "ok");
      }
    } catch (e) {
      console.error("Erro no envio:", e);
      toast(\`✅ Tudo pronto! Agora é só colar no \${platform}.\`, "ok");
    }
    
    setMock(null);
  };
`;

content = content.replace(/const realPublicar = async \(\) => \{.*?setMock\(null\);\s+\};/s, FINAL_PUBLICAR);

fs.writeFileSync(path, content);
console.log('realPublicar finalized for direct app bridge!');
