import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music2, MapPin, Users, Send, Play, Pause, Volume2, Sliders, Eye, EyeOff, Check, Sparkles } from 'lucide-react';
import { generateVideo, mixAudioWithVideo, processVideo } from '../../services/ffmpegService';

const D = {
  bg: "#020B1A", bg2: "#04132B", bg3: "#072146", 
  s1: "#0E3C7D", s2: "#134B9A", s3: "#185BB7",
  w1: "#F8FAFC", w2: "#CBD5E1", w3: "#64748B", b0: "rgba(255,255,255,0.08)",
  b1: "rgba(255,255,255,0.12)",
  blue: "#38BDF8", blue2: "#7DD3FC", amber: "#FBBF24", rose: "#FB7185",
  gBlue: "linear-gradient(135deg,#0E3C7D 0%,#185BB7 100%)",
  gCyan: "linear-gradient(135deg,#0284C7 0%,#06B6D4 100%)",
};

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
  "P&B":       { brightness: 105, contrast: 130, saturate: 0,   sepia: 0,  hue: 0   },
  "V\u00edvido":    { brightness: 104, contrast: 108, saturate: 152, sepia: 0,  hue: 0   },
  "Cyber":     { brightness: 110, contrast: 120, saturate: 160, sepia: 0,  hue: 160 },
};

const PublishPreview = ({ postId, file, style, initialCaption, initialHashtags, session, onClose, onPublish, supabase, toast, filters: initialFilters, music: initialMusic }) => {
  const [stage, setStage] = useState("edit"); // edit | processing
  const [procLabel, setProcLabel] = useState("");
  const [procProgress, setProcProgress] = useState(0);

  const [caption, setCaption] = useState(initialCaption || "");
  const [hashtags, setHashtags] = useState(initialHashtags || "");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [filtName, setFiltName] = useState("Original");
  
  const [music, setMusic] = useState(initialMusic || null);
  const [filters, setFilters] = useState(initialFilters || FPRESET.Original);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicStartTime, setMusicStartTime] = useState(0);
  const [volOriginal, setVolOriginal] = useState(0.8);
  const [volMusic, setVolMusic] = useState(0.5);
  
  const [publishing, setPublishing] = useState(false);
  const audioRef = useRef(new Audio());
  const videoRef = useRef(null);
  const previewUrl = useRef(URL.createObjectURL(file)).current;

  const isVideo = file.type.startsWith('video/');

  useEffect(() => {
    audioRef.current.volume = volMusic;
  }, [volMusic]);

  useEffect(() => {
    if (music?.previewUrl) {
      audioRef.current.src = music.previewUrl;
      audioRef.current.currentTime = musicStartTime;
    }
  }, [music]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const togglePlay = () => {
    if (musicPlaying) {
      audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    } else {
      audioRef.current.play();
      if (videoRef.current) videoRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  const applyFilt = name => {
    setFiltName(name);
    setFilters(FPRESET[name]);
  };

  const handleSearchUsers = async (q) => {
    setUserQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const { data } = await supabase.from("profiles").select("id, full_name, username, avatar_url").ilike("username", `%${q}%`).limit(5);
    if (data) setSearchResults(data);
  };

  const tagUser = (user) => {
    if (!taggedUsers.find(u => u.id === user.id)) {
      setTaggedUsers([...taggedUsers, user]);
    }
    setUserQuery("");
    setSearchResults([]);
  };

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    try {
      // 1. Process media (Apply filters and music)
      let fileToUpload = file;
      
      if (isVideo || music) {
        setStage("processing");
        setProcLabel("⚙️ Preparando estúdio de renderização...");
        setProcProgress(5);

        try {
          const onFfmpegProgress = (p) => {
            setProcProgress(10 + Math.round(p * 85));
            if (p > 0.1) setProcLabel("🎬 Renderizando vídeo premium...");
            if (p > 0.5) setProcLabel("🎨 Aplicando filtros cinematográficos...");
            if (p > 0.8) setProcLabel("🔊 Sincronizando áudio e efeitos...");
          };

          const processedBlob = await Promise.race([
            (async () => {
              if (isVideo) {
                if (music) return await mixAudioWithVideo(file, music.previewUrl, filters, onFfmpegProgress);
                return await processVideo(file, filters, onFfmpegProgress);
              } else {
                return await generateVideo(file, music.previewUrl, filters, onFfmpegProgress);
              }
            })(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 60000))
          ]);

          if (processedBlob) {
            fileToUpload = new File([processedBlob], isVideo || music ? "viral_content.mp4" : "premium_photo.jpg", { 
              type: isVideo || music ? "video/mp4" : "image/jpeg" 
            });
          }
        } catch (err) {
          console.error("Media processing failed:", err);
          toast("⚠️ Processamento excedeu o tempo. Usando original.", "warn");
          fileToUpload = file;
        } finally {
          setStage("edit");
        }
      } else {
        toast("✨ Aplicando filtros...", "info");
        fileToUpload = await renderFilteredImage();
      }

      // 2. Upload to storage (Manual Fetch Bypass to avoid Header Limit Issues)
      console.log(`📤 Iniciando upload manual (Bypass SDK)...`);
      
      const cleanExt = isVideo || music ? "mp4" : "jpg";
      const cleanType = isVideo || music ? "video/mp4" : "image/jpeg";
      const fileName = `${Date.now()}.${cleanExt}`;
      const path = `${session.id}/${fileName}`;
      const cleanBlob = fileToUpload.slice(0, fileToUpload.size, cleanType);
      
      // FORÇAR REFRESH DA SESSÃO
      const { data: refreshData } = await supabase.auth.refreshSession();
      const currentSession = refreshData?.session || (await supabase.auth.getSession()).data.session;
      const token = currentSession?.access_token;

      if (!token) throw new Error("Sessão expirada. Por favor, faça login novamente.");
      console.log(`🔑 Token size: ${token.length} chars`);

      const storageUrl = `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/post-media/${path}?apikey=${import.meta.env.VITE_SUPABASE_ANON_KEY}`;

      const response = await fetch(storageUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: cleanBlob
      });

      if (!response.ok) {
        if (response.status === 431) {
          console.warn("⚠️ Token persistente (431). Limpando COOKIES e Metadados...");
          document.cookie.split(";").forEach(c => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
          await supabase.auth.updateUser({ data: { full_name: session.name, avatar_url: null, bio: null } });
          await supabase.auth.signOut();
          localStorage.clear();
          throw new Error("LIMPEZA PROFUNDA: O seu navegador estava enviando dados demais. Limpamos os cookies e o seu perfil. POR FAVOR, FECHE O NAVEGADOR E ABRA NOVAMENTE. Se não funcionar, tente uma ABA ANÔNIMA.");
        }
        const errJson = await response.json().catch(() => ({ message: "Erro desconhecido no servidor" }));
        console.error("Manual upload error:", errJson);
        throw new Error(`Falha no upload (${response.status}): ${errJson.message || errJson.error || "Erro de rede"}`);
      }

      console.log("✅ Upload manual concluído com sucesso!");
      
      const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);

      // 3. Upsert post
      toast("📝 Finalizando publicação...", "info");
      const postData = {
        user_id: session.id,
        content: {
          media_url: publicUrl,
          media_type: fileToUpload.type.startsWith("video") ? "video" : "image",
          caption: caption,
          hashtags: hashtags,
          filters: filters,
          is_public: isPublic,
          music: music // ensure music is in content too
        },
        style: style,
        location: location,
        tagged_users: taggedUsers.map(u => u.id),
        music_metadata: music ? {
          id: music.id,
          name: music.name,
          artist: music.artist,
          previewUrl: music.previewUrl,
          startTime: musicStartTime,
          volumeOriginal: volOriginal,
          volumeMusic: volMusic
        } : null,
        tags: hashtags.replace(/#/g, "").split(/\s+/).filter(t => t)
      };

      let postError;
      if (postId) {
        const res = await supabase.from("posts").update(postData).eq("id", postId);
        postError = res.error;
      } else {
        const res = await supabase.from("posts").insert([postData]);
        postError = res.error;
      }

      if (postError) throw postError;

      toast("Publicado com sucesso!", "ok");
      onPublish();
    } catch (e) {
      toast("Erro ao publicar: " + e.message, "err");
    } finally {
      setPublishing(false);
    }
  };

  const renderFilteredImage = async () => {
    return new Promise((resolve, reject) => {
      if (isVideo) return resolve(file); // No filter rendering for videos yet
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) sepia(${filters.sepia || 0}%) hue-rotate(${filters.hue || 0}deg)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => resolve(new File([blob], "edicao_premium.jpg", { type: "image/jpeg" })), "image/jpeg", 0.95);
      };
      img.onerror = reject;
    });
  };

  const fCSS = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) sepia(${filters.sepia || 0}%) hue-rotate(${filters.hue || 0}deg)`;

  return (
    <div style={{ position: "fixed", inset: 0, background: D.bg, zIndex: 10000, overflowY: "auto", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${D.b0}`, position: "sticky", top: 0, background: `${D.bg}e6`, backdropFilter: "blur(16px)", zIndex: 100 }}>
         <button onClick={onClose} style={{ background: "none", border: "none", color: D.w2, fontSize: 15, fontWeight: 600 }}>Cancelar</button>
         <div style={{ fontWeight: 900, fontSize: 17, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px" }}>Publicar no App</div>
         <button onClick={handlePublish} disabled={publishing} style={{ background: D.gBlue, border: "none", color: "#fff", padding: "10px 24px", borderRadius: 14, fontWeight: 800, fontSize: 14, boxShadow: "0 8px 20px rgba(37,99,235,0.3)" }}>
            {publishing ? "Postando..." : "Salvar no App"}
         </button>
      </header>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 32, maxWidth: 600, margin: "0 auto", width: "100%", animation: "fadeIn 0.4s ease" }}>
        
        {/* PREVIEW SECTION */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
           <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#000", width: 140, height: 210, border: `2px solid ${D.b0}`, flexShrink: 0, boxShadow: "0 12px 30px rgba(0,0,0,0.4)" }}>
              {isVideo ? (
                <video ref={videoRef} src={previewUrl} loop muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: fCSS }} />
              ) : (
                <img src={previewUrl} style={{ width: "100%", height: "100%", objectFit: "cover", filter: fCSS }} />
              )}
              <button onClick={togglePlay} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 {musicPlaying ? <Pause size={32} color="#fff" /> : <Play size={32} color="#fff" />}
              </button>
           </div>
           
           <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea 
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
                placeholder="Escreva uma legenda incrível..." 
                style={{ width: "100%", height: 160, background: "transparent", border: "none", color: D.w1, fontSize: 15, lineHeight: 1.6, outline: "none", resize: "none" }}
              />
              <div style={{ height: 1, background: D.b0 }} />
              <input 
                value={hashtags} 
                onChange={e => setHashtags(e.target.value)} 
                placeholder="#hashtags #tendencias" 
                style={{ background: "none", border: "none", color: D.blue2, fontSize: 14, fontWeight: 600, outline: "none" }}
              />
           </div>
        </div>

        {/* FILTER SELECTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 8, color: D.w2, fontSize: 13, fontWeight: 700 }}>
              <Sparkles size={16} /> FILTROS
           </div>
           <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
              {Object.keys(FPRESET).map(name => {
                const active = filtName === name;
                return (
                  <div key={name} onClick={() => applyFilt(name)} style={{ flexShrink: 0, cursor: "pointer", textAlign: "center", width: 70 }}>
                    <div style={{ width: 70, height: 70, borderRadius: 16, overflow: "hidden", border: `2.5px solid ${active ? D.blue : "transparent"}`, transition: "all 0.2s", marginBottom: 6, position: "relative" }}>
                       {active && <div style={{ position: "absolute", top: 4, right: 4, background: D.blue, borderRadius: "50%", padding: 2, zIndex: 1 }}><Check size={10} color="#fff" /></div>}
                       {isVideo ? (
                         <video src={previewUrl} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${FPRESET[name].brightness}%) contrast(${FPRESET[name].contrast}%) saturate(${FPRESET[name].saturate}%)` }} />
                       ) : (
                         <img src={previewUrl} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${FPRESET[name].brightness}%) contrast(${FPRESET[name].contrast}%) saturate(${FPRESET[name].saturate}%)` }} />
                       )}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? D.blue : D.w3 }}>{name}</div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* PRIVACY & SETTINGS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
           <div style={{ background: D.bg2, borderRadius: 20, overflow: "hidden", border: `1px solid ${D.b0}` }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${D.b0}` }}>
                 <MapPin size={20} color={D.w3} />
                 <input 
                   value={location} 
                   onChange={e => setLocation(e.target.value)} 
                   placeholder="Adicionar localização" 
                   style={{ background: "none", border: "none", color: D.w1, flex: 1, fontSize: 15, outline: "none" }} 
                 />
              </div>

              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${D.b0}` }}>
                 <Users size={20} color={D.w3} />
                 <div style={{ flex: 1 }}>
                    <input 
                      value={userQuery} 
                      onChange={e => handleSearchUsers(e.target.value)} 
                      placeholder="Marcar pessoas" 
                      style={{ background: "none", border: "none", color: D.w1, width: "100%", fontSize: 15, outline: "none" }} 
                    />
                    {taggedUsers.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                         {taggedUsers.map(u => (
                           <span key={u.id} style={{ fontSize: 11, background: D.s2, color: D.blue2, padding: "4px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>
                              @{u.username} <X size={12} onClick={() => setTaggedUsers(taggedUsers.filter(x => x.id !== u.id))} style={{ cursor: "pointer" }} />
                           </span>
                         ))}
                      </div>
                    )}
                 </div>
              </div>

              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {isPublic ? <Eye size={20} color={D.blue} /> : <EyeOff size={20} color={D.rose} />}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                       <span style={{ fontSize: 15, fontWeight: 700, color: D.w1 }}>Visibilidade</span>
                       <span style={{ fontSize: 12, color: D.w3 }}>{isPublic ? "Qualquer pessoa pode ver" : "Apenas você pode ver"}</span>
                    </div>
                 </div>
                 <div 
                   onClick={() => setIsPublic(!isPublic)}
                   style={{ width: 48, height: 26, borderRadius: 100, background: isPublic ? D.blue : D.s3, position: "relative", cursor: "pointer", transition: "background 0.3s" }}
                 >
                    <div style={{ position: "absolute", top: 3, left: isPublic ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                 </div>
              </div>
           </div>
        </div>

        {/* AUDIO MIXING */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, background: D.bg2, padding: "24px 20px", borderRadius: 28, border: `1px solid ${D.b0}` }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: D.s1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <Music2 size={20} color={D.blue} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                 <div style={{ fontWeight: 800, fontSize: 15 }}>Ajustes de Áudio</div>
                 <div style={{ fontSize: 12, color: D.w3 }}>Controle o balanço do som</div>
              </div>
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: D.w2 }}>
                    <span>ÁUDIO ORIGINAL</span>
                    <span>{Math.round(volOriginal * 100)}%</span>
                 </div>
                 <input type="range" min="0" max="1" step="0.01" value={volOriginal} onChange={e => setVolOriginal(parseFloat(e.target.value))} style={{ accentColor: D.blue }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: D.w2 }}>
                    <span>MÚSICA DE FUNDO</span>
                    <span>{Math.round(volMusic * 100)}%</span>
                 </div>
                 <input type="range" min="0" max="1" step="0.01" value={volMusic} onChange={e => setVolMusic(parseFloat(e.target.value))} style={{ accentColor: D.blue }} />
              </div>
           </div>
        </div>

        {/* COMPARTILHAMENTO EXTERNO */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, background: "linear-gradient(135deg, #1e1b4b, #312e81)", padding: "24px 20px", borderRadius: 28, border: `1px solid ${D.blue}` }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                 <div style={{ fontWeight: 900, fontSize: 16, color: "#fff" }}>Compartilhar Agora 🚀</div>
                 <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Publique nas suas redes sociais</div>
              </div>
           </div>
           
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              {[
                { name: "Instagram", icon: "📸", color: "#E1306C" },
                { name: "TikTok", icon: "🎵", color: "#000000" },
                { name: "WhatsApp", icon: "💬", color: "#25D366" },
                { name: "Facebook", icon: "📘", color: "#1877F2" },
                { name: "Threads", icon: "🧵", color: "#000000" },
                { name: "X", icon: "✖️", color: "#000000" }
              ].map(network => (
                <button 
                  key={network.name}
                  onClick={async () => {
                    toast(`Renderizando imagem para ${network.name}...`, "info");
                    try { await navigator.clipboard.writeText(caption); } catch(e) {}
                    
                    try {
                      const fileToShare = await renderFilteredImage();
                      
                      if (navigator.share && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
                        await navigator.share({
                          title: 'Edição Premium',
                          text: caption,
                          files: [fileToShare]
                        });
                      } else {
                        // Fallback download if Web Share API is not supported
                        const url = URL.createObjectURL(fileToShare);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "edicao_premium.jpg";
                        a.click();
                        toast(`Pronto! Baixamos a foto. Abra o ${network.name} e cole a legenda.`, "ok");
                      }
                    } catch(e) {
                       toast("Erro ao renderizar imagem.", "err");
                    }
                  }}
                  style={{ background: "#fff", color: "#000", border: "none", borderRadius: 16, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "transform 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span style={{ fontSize: 18 }}>{network.icon}</span> {network.name}
                </button>
              ))}
           </div>
        </div>
      </div>
      
      {/* Search Users Dropdown */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: 400, background: D.bg2, borderRadius: 24, padding: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: `1px solid ${D.b0}`, zIndex: 10001 }}
          >
             <div style={{ padding: "8px 12px", fontWeight: 800, fontSize: 13, color: D.w3 }}>SUGESTÕES</div>
             {searchResults.map(u => (
               <div key={u.id} onClick={() => tagUser(u)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = D.s1} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: D.s3, overflow: "hidden" }}>
                     {u.avatar_url ? <img src={u.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{u.username}</div>
                    <div style={{ fontSize: 12, color: D.w3 }}>{u.full_name}</div>
                  </div>
               </div>
             ))}
             <button onClick={() => setSearchResults([])} style={{ width: "100%", marginTop: 8, padding: 12, background: "transparent", border: "none", color: D.rose, fontWeight: 700, fontSize: 13 }}>Fechar</button>
          </motion.div>
        )}
      </AnimatePresence>
      {stage === "processing" && (
        <div style={{ position: "fixed", inset: 0, background: D.bg, zIndex: 20000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
           <div style={{ position: "relative", marginBottom: 32 }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", border: `4px solid ${D.b1}`, borderTopColor: D.blue, animation: "spin 1s linear infinite" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🚀</div>
           </div>
           <h2 style={{ fontWeight: 900, fontSize: 22, marginBottom: 8, color: D.w1 }}>{procLabel}</h2>
           <p style={{ color: D.w3, fontSize: 14, marginBottom: 32, maxWidth: 300 }}>Isso pode levar alguns segundos dependendo da velocidade do seu dispositivo.</p>
           
           <div style={{ width: "100%", maxWidth: 300, height: 8, background: D.b1, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${procProgress}%`, height: "100%", background: D.gBlue, transition: "width 0.3s ease" }} />
           </div>
           <div style={{ marginTop: 12, fontSize: 12, fontWeight: 800, color: D.blue }}>{procProgress}% COMPLETO</div>
        </div>
      )}
    </div>
  );
};

export default PublishPreview;
