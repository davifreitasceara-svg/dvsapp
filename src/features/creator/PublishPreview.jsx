import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Music2, MapPin, Users, Send, Play, Pause, Volume2, Sliders } from 'lucide-react';

const D = {
  bg: "#0f172a", bg2: "#1e293b", s1: "#000000", s2: "#111111", s3: "#222222",
  w1: "#ffffff", w2: "#cbd5e1", w3: "#94a3b8", b0: "rgba(255,255,255,0.1)",
  blue: "#3b82f6", blue2: "#60a5fa", amber: "#f59e0b", rose: "#f43f5e"
};

const PublishPreview = ({ file, style, initialCaption, initialHashtags, session, onClose, onPublish, supabase, toast }) => {
  const [caption, setCaption] = useState(initialCaption || "");
  const [hashtags, setHashtags] = useState(initialHashtags || "");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [music, setMusic] = useState(null);
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
    setPublishing(true);
    try {
      // 1. Upload to storage
      const ext = file.name.split('.').pop();
      const path = `${session.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("post-media").upload(path, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);

      // 2. Insert post
      const { error: postError } = await supabase.from("posts").insert({
        user_id: session.id,
        content: {
          media_url: publicUrl,
          media_type: isVideo ? "video" : "image",
          caption: caption,
          hashtags: hashtags
        },
        style: style,
        location: location,
        tagged_users: taggedUsers.map(u => u.id),
        music_metadata: music ? {
          id: music.id,
          name: music.name,
          artist: music.artist,
          startTime: musicStartTime,
          volumeOriginal: volOriginal,
          volumeMusic: volMusic
        } : null,
        tags: hashtags.replace(/#/g, "").split(" ").filter(t => t)
      });

      if (postError) throw postError;

      toast("Publicado com sucesso!", "ok");
      onPublish();
    } catch (e) {
      toast("Erro ao publicar: " + e.message, "err");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: D.bg, zIndex: 10000, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${D.b0}`, position: "sticky", top: 0, background: D.bg, zIndex: 10 }}>
         <button onClick={onClose} style={{ background: "none", border: "none", color: D.w1, fontSize: 16 }}>Cancelar</button>
         <div style={{ fontWeight: 900, fontSize: 18 }}>Nova Publicação</div>
         <button onClick={handlePublish} disabled={publishing} style={{ background: D.blue, border: "none", color: "#fff", padding: "8px 20px", borderRadius: 100, fontWeight: 800 }}>
            {publishing ? "Postando..." : "Compartilhar"}
         </button>
      </header>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 24, maxWidth: 600, margin: "0 auto", width: "100%" }}>
        {/* PREVIEW SECTION */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#000", aspectRatio: "9/16", maxHeight: 400, border: `2px solid ${D.b0}` }}>
           {isVideo ? (
             <video ref={videoRef} src={previewUrl} loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
           ) : (
             <img src={previewUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
           )}
           <button onClick={togglePlay} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {musicPlaying ? <Pause size={48} color="#fff" /> : <Play size={48} color="#fff" />}
           </button>
        </div>

        {/* DETAILS SECTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: D.w3 }}>LEGENDA</label>
              <textarea 
                className="inp" 
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
                placeholder="Escreva algo inspirador..." 
                style={{ minHeight: 100, background: D.bg2, border: "none", borderRadius: 16, padding: 16 }}
              />
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: D.w3 }}>HASHTAGS</label>
              <input 
                className="inp" 
                value={hashtags} 
                onChange={e => setHashtags(e.target.value)} 
                placeholder="#criatividade #design..." 
                style={{ background: D.bg2, border: "none", borderRadius: 12, padding: 12 }}
              />
           </div>
        </div>

        {/* ADVANCED METADATA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12, background: D.bg2, padding: "12px 16px", borderRadius: 16 }}>
              <MapPin size={18} color={D.w3} />
              <input 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="Adicionar localização" 
                style={{ background: "none", border: "none", color: D.w1, flex: 1, fontSize: 14 }} 
              />
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: 10, background: D.bg2, padding: 16, borderRadius: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                 <Users size={18} color={D.w3} />
                 <input 
                   value={userQuery} 
                   onChange={e => handleSearchUsers(e.target.value)} 
                   placeholder="Marcar pessoas" 
                   style={{ background: "none", border: "none", color: D.w1, flex: 1, fontSize: 14 }} 
                 />
              </div>
              {searchResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                   {searchResults.map(u => (
                     <div key={u.id} onClick={() => tagUser(u)} style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, background: D.bg, borderRadius: 12, cursor: "pointer" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: D.s3, overflow: "hidden" }}>
                           {u.avatar_url && <img src={u.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{u.username}</div>
                     </div>
                   ))}
                </div>
              )}
              {taggedUsers.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                   {taggedUsers.map(u => (
                     <span key={u.id} style={{ fontSize: 12, background: D.blue, color: "#fff", padding: "4px 10px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6 }}>
                        @{u.username} <span onClick={() => setTaggedUsers(taggedUsers.filter(x => x.id !== u.id))} style={{ cursor: "pointer" }}>✕</span>
                     </span>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* AUDIO MIXING */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, background: D.bg2, padding: 20, borderRadius: 24 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Music2 size={20} color={D.blue} />
              <div style={{ fontWeight: 800 }}>Mixagem de Áudio</div>
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: D.w3 }}>
                 <span>ÁUDIO ORIGINAL</span>
                 <span>{Math.round(volOriginal * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={volOriginal} onChange={e => setVolOriginal(parseFloat(e.target.value))} style={{ accentColor: D.blue }} />
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: D.w3 }}>
                 <span>MÚSICA DE FUNDO</span>
                 <span>{Math.round(volMusic * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={volMusic} onChange={e => setVolMusic(parseFloat(e.target.value))} style={{ accentColor: D.amber }} />
           </div>

           <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, background: D.bg, padding: 12, borderRadius: 16 }}>
              <Sliders size={18} color={D.w3} />
              <div style={{ fontSize: 13, flex: 1 }}>Trecho da música</div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="0.5" 
                value={musicStartTime} 
                onChange={e => setMusicStartTime(parseFloat(e.target.value))} 
                style={{ width: 100 }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPreview;
