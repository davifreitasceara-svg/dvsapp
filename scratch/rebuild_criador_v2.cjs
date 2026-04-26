const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// The new clean Criador component
const cleanCriador = `const Criador = ({ toast }) => {
  const [stage, setStage] = useState("home");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [isImg, setIsImg] = useState(true);
  const [topic, setTopic] = useState("");
  const [estilo, setEstilo] = useState("viral");
  const [pct, setPct] = useState(0); const [cur, setCur] = useState(0);
  const [result, setResult] = useState(null);
  const [caption, setCaption] = useState("");
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100 });
  const [filtName, setFiltName] = useState(null);
  const [vLoad, setVLoad] = useState(false);
  const fileId = "dvs-file-input";
  const [mock, setMock] = useState(null);

  const SI = ["Lendo imagem...", "Extraindo cores...", "Analisando vibe...", "Buscando tendências...", "Gerando conteúdo..."];
  const SV = ["Processando vídeo...", "Mapeando frames...", "Captando clima...", "Buscando áudio viral...", "Gerando estratégia..."];

  const ESTILOS = [
    { id: "viral", l: "🔥 Viral" }, { id: "pro", l: "💼 Profissional" },
    { id: "aesthetic", l: "🌸 Aesthetic" }, { id: "vendas", l: "💰 Vendas" },
    { id: "humor", l: "😂 Humor" }, { id: "edu", l: "📚 Educativo" },
  ];
  
  const FPRESET = {
    "Original":  { brightness: 100, contrast: 100, saturate: 100, sepia: 0,  hue: 0   },
    "Clarendon": { brightness: 112, contrast: 128, saturate: 135, sepia: 0,  hue: 0   },
    "Gingham":   { brightness: 105, contrast: 88,  saturate: 82,  sepia: 8,  hue: -5  },
    "Moon":      { brightness: 113, contrast: 118, saturate: 0,   sepia: 10, hue: 0   },
    "Lark":      { brightness: 118, contrast: 82,  saturate: 92,  sepia: 0,  hue: 0   },
    "Reyes":     { brightness: 112, contrast: 86,  saturate: 72,  sepia: 28, hue: 0   },
    "Juno":      { brightness: 108, contrast: 118, saturate: 155, sepia: 0,  hue: 5   },
    "Slumber":   { brightness: 104, contrast: 93,  saturate: 125, sepia: 12, hue: 0   },
    "Crema":     { brightness: 110, contrast: 88,  saturate: 78,  sepia: 22, hue: 6   },
    "Ludwig":    { brightness: 106, contrast: 110, saturate: 92,  sepia: 9,  hue: 0   },
    "Aden":      { brightness: 112, contrast: 86,  saturate: 72,  sepia: 18, hue: -12 },
    "Valencia":  { brightness: 110, contrast: 108, saturate: 90,  sepia: 24, hue: 5   },
    "Hudson":    { brightness: 118, contrast: 92,  saturate: 98,  sepia: 14, hue: -12 },
    "Nashville": { brightness: 112, contrast: 106, saturate: 118, sepia: 14, hue: 6   },
    "HDR":       { brightness: 106, contrast: 132, saturate: 122, sepia: 0,  hue: 0   },
    "Vívido":    { brightness: 104, contrast: 108, saturate: 152, sepia: 0,  hue: 0   },
  };

  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(\`✅ "\${f.name.slice(0, 24)}" carregado!\`, "ok");
  }, [toast]);

  const startCreate = async () => {
    if (!file && !topic.trim()) { toast("Envie uma mídia ou escreva um tema!", "warn"); return; }
    setStage("proc"); setPct(0); setCur(0);
    const steps = isImg ? SI : SV;
    for (let i = 0; i < steps.length; i++) { setCur(i); await sleep(480 + Math.random() * 380); setPct(Math.round(((i + 1) / steps.length) * 88)); }

    const jsonTpl = \`{
  "hook": "frase de impacto máx 10 palavras com emoji BASEADA no conteúdo visual",
  "caption": "legenda completa e relevante ao que aparece na imagem/vídeo",
  "hashtags": ["8 hashtags relacionados ao conteúdo"],
  "filtro": "Clarendon",
  "musicas": [{"tipo":"Em Alta","nome":"Nome Real","artista":"Artista","vibe":"vibe"}],
  "score": 90, "scoreMotivo": "motivo", "melhorias": ["dica"], "plataforma": "Insta", "horario": "19h"
}\`;

    let raw = "";
    if (file && isImg) {
      const b64 = await fileToBase64(file);
      raw = await callAIVision(b64, file.type, 
        \`Sua principal tarefa é descrever o que está na foto e criar uma legenda curta (estilo Legenda! #viral #brasil) totalmente baseada no conteúdo visual da imagem. Tema extra: "\${topic}" | Estilo: \${estilo}. Retorne APENAS JSON:\\n\${jsonTpl}\`, 
        "Retorne APENAS JSON."
      );
    } else {
      raw = await callAI(\`Crie conteúdo viral para redes sociais. Tema: "\${topic}". Estilo: \${estilo}. Retorne APENAS JSON:\\n\${jsonTpl}\`);
    }

    setPct(100); await sleep(200);
    const ALL_MUSIC = [{ tipo: "Viral", nome: "Mtg Quero Te Encontrar", artista: "DJ Luan Gomes", vibe: "Animada" }, { tipo: "Em Alta", nome: "Diz Aí Qual é o Plano", artista: "Mc IG", vibe: "Urbana" }];
    const fallbackMusicas = ALL_MUSIC.sort(() => 0.5 - Math.random()).slice(0, 3);
    const p = pj(raw) || { hook: "Legenda!", caption: "", hashtags: ["viral","brasil"], filtro: "Clarendon", musicas: fallbackMusicas, score: 80, scoreMotivo: "Ok", melhorias: [], plataforma: "Insta", horario: "19h" };
    
    setCaption(\`\${p.hook}\\n\\n\${p.caption}\\n\\n\${p.hashtags.map(h => "#" + h).join(" ")}\`);
    setResult(p);
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
  };

  const applyFilt = name => {
    const key = Object.keys(FPRESET).find(k => k.toLowerCase() === (name || "").toLowerCase()) || "Original";
    setFiltName(key); setFilters(FPRESET[key] || FPRESET["Original"]);
  };

  const compartilharDireto = async () => {
    if (!isImg) {
       if (navigator.share) { try { await navigator.share({ title: 'DVS EduCreator', text: caption, url: fileURL }); return; } catch(e) {} }
       toast("Compartilhamento nativo não disponível."); return;
    }
    toast("✨ Preparando mídia editada...");
    try {
      const el = document.getElementById('preview-to-export');
      if (!el) return;
      const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: D.bg2 });
      canvas.toBlob(async (blob) => {
        const fileToShare = new File([blob], 'dvs-viral.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
          try { await navigator.share({ files: [fileToShare], title: 'DVS EduCreator', text: caption }); toast("✅ Enviado!"); } catch (err) { if (err.name !== 'AbortError') toast("Erro: " + err.message); }
        } else {
          const link = document.createElement('a'); link.download = 'dvs-viral.png'; link.href = canvas.toDataURL('image/png'); link.click();
          toast("📱 Imagem salva na galeria!");
        }
      }, 'image/png');
    } catch (e) { toast("Erro ao gerar: " + e.message); }
  };

  const viral = async () => {
    setVLoad(true);
    try {
      const res = await callAI(\`Melhore esta legenda para torná-la viral. Estilo: Legenda! #viral #brasil. Legenda: \${caption}\`);
      if (res) setCaption(res.replace(/^"|"$/g, ''));
      toast("🚀 Turbinado!");
    } catch (e) {}
    setVLoad(false);
  };

  const fCSS = \`brightness(\${filters?.brightness}%) contrast(\${filters?.contrast}%) saturate(\${filters?.saturate}%) sepia(\${filters.sepia || 0}%) hue-rotate(\${filters.hue || 0}deg)\`;
  const copiar = () => { navigator.clipboard.writeText(caption); toast("Copiado!"); };

  if (stage === "proc") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(5, 7, 9, 0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
           <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✨</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{(isImg ? SI : SV)[cur] || "Analisando..."}</div>
          <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }

  if (stage === "home") {
    return (
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        <input id={fileId} type="file" accept="image/*,video/*" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} onChange={handleFileChange} />
        <input id={fileId + "-cam"} type="file" accept="image/*,video/*" capture="environment" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} onChange={handleFileChange} />
        <div className="fu">
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, background: "linear-gradient(90deg, #fff, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>Viral Studio ✨</div>
          <div style={{ fontSize: 14, color: D.w2 }}>O seu motor de viralização movido a IA. Envie uma mídia para começar.</div>
        </div>
        <label htmlFor={fileId} className="fu d1" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "48px 24px", borderRadius: 28, cursor: "pointer", border: \`2px dashed \${D.b1}\`, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 84, height: 84, borderRadius: 24, background: D.blueLo, border: \`1px solid \${D.blueM}\`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, animation: "float2 4s ease-in-out infinite" }}>📁</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 19, color: "#fff", marginBottom: 6 }}>Selecionar Mídia</div>
            <div style={{ fontSize: 13, color: D.w2 }}>Arraste ou toque para abrir a galeria</div>
          </div>
        </label>
        <div className="fu d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label htmlFor={fileId} className="btn ghost" style={{ height: 54, borderRadius: 16 }}>🖼️ Galeria</label>
          <label htmlFor={fileId + "-cam"} className="btn ghost" style={{ height: 54, borderRadius: 16 }}>📷 Câmera</label>
        </div>
        <div className="fu d4">
          <div className="sec-label">TEMA / CONTEXTO</div>
          <input className="inp" value={topic} onChange={e => setTopic(e.target.value)} placeholder="O que é esse post?" style={{ height: 54, background: "rgba(0,0,0,0.3)", borderRadius: 16 }} />
        </div>
        <button className="btn primary lg fu d6" style={{ height: 60, borderRadius: 20, fontSize: 17, fontWeight: 900 }} onClick={startCreate} disabled={!file && !topic.trim()}>
          ✨ CRIAR COM INTELIGÊNCIA ARTIFICIAL
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
      {mock && <PreviewMockup platform={mock.platform} type={mock.type} fileURL={fileURL} isImg={isImg} fCSS={fCSS} caption={caption} music={result?.musicas?.[0]} onClose={() => setMock(null)} onFinish={() => { toast("Publicado!"); setMock(null); }} />}
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff" }}>Viral Studio ✨</div>
        <button className="btn ghost xs" onClick={() => setStage("home")}>+ Novo</button>
      </div>
      <div className="card fu d1" style={{ padding: 0, overflow: "hidden", position: "relative", minHeight: 400, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(20px)", borderRadius: 24 }}>
        <div id="preview-to-export" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {fileURL ? (isImg ? <img src={fileURL} style={{ width: "100%", filter: fCSS }} /> : <video src={fileURL} autoPlay muted loop playsInline style={{ width: "100%" }} />) : "Carregando..."}
        </div>
        <div style={{ position: "absolute", top: 16, right: 16 }}><ScoreRing score={result?.score} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card fu d2" style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: D.blue2 }}>🚀 ALCANCE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{result?.score > 85 ? "ALTO" : "MÉDIO"}</div>
        </div>
        <div className="card fu d2" style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: D.amber }}>⏰ HORÁRIO</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{result?.horario || "19:30"}</div>
        </div>
      </div>
      <div className="card fu d5" style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>✍️ LEGENDA ESTRATÉGICA</div>
        <textarea className="inp" value={caption} onChange={e => setCaption(e.target.value)} style={{ minHeight: 120, fontSize: 14 }} />
        <button className="btn ghost xs" onClick={copiar} style={{ marginTop: 10 }}>Copiar Texto</button>
      </div>
      <SmartSoundPlayer musicas={result?.musicas} toast={toast} />
      <button className="btn lg" onClick={viral} disabled={vLoad} style={{ width: "100%", background: D.gBlue, color: "#fff", height: 56, borderRadius: 18, fontSize: 16, fontWeight: 900 }}>
        {vLoad ? <Spin s={20} /> : "🚀 TURBINAR LEGENDA"}
      </button>
      <button className="btn" style={{ width: "100%", height: 64, background: D.blue, color: "#fff", borderRadius: 20, fontSize: 17, fontWeight: 900, marginTop: 10 }} onClick={compartilharDireto}>
         🚀 COMPARTILHAR AGORA
      </button>
    </div>
  );
};`;

// Find where Criador starts and the next logical block (likely the next component)
const criadorStart = content.indexOf('const Criador = ({ toast }) => {');
const nextBlock = content.indexOf('/* ── HOME ── */', criadorStart); // This is at line ~1274 currently

if (criadorStart !== -1 && nextBlock !== -1) {
    content = content.substring(0, criadorStart) + cleanCriador + '\n\n' + content.substring(nextBlock);
    fs.writeFileSync(path, content, 'utf8');
    console.log("CRIADOR COMPONENT RE-BUILT FROM SCRATCH SUCCESSFULLY!");
} else {
    console.log("REBUILD FAILED", criadorStart, nextBlock);
}
