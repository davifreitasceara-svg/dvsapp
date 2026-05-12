import React, { useState, useEffect } from 'react';

// D is expected to be in scope in App.jsx

const Spin = ({ s = 20, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
  </svg>
);

const Feed = ({ toast, session, onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    // select posts com perfil do autor e conta de likes
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles!inner(full_name, avatar_url), post_likes(count), comments(count)")
      .order("created_at", { ascending: false })
      .limit(20);
      
    if (error) { toast("Erro ao carregar feed.", "err"); }
    else { setPosts(data); }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spin s={30} c={D?.blue} /></div>;

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22 }}>Explorar</div>
      {posts.map(p => (
        <PostCard key={p.id} post={p} session={session} toast={toast} onNavigate={onNavigate} />
      ))}
      {posts.length === 0 && <div style={{ textAlign: "center", padding: 40, color: D?.w3 }}>Nenhum post encontrado.</div>}
    </div>
  );
};

const PostCard = ({ post, session, toast, onNavigate }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.post_likes?.[0]?.count || 0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  useEffect(() => {
    if (!session?.id) return;
    // Check if liked
    supabase.from("post_likes").select("post_id").eq("post_id", post.id).eq("user_id", session.id).then(({ data }) => {
      if (data?.length) setLiked(true);
    });
    // Check if saved
    supabase.from("saved_posts").select("post_id").eq("post_id", post.id).eq("user_id", session.id).then(({ data }) => {
      if (data?.length) setSaved(true);
    });
  }, [post.id, session?.id]);

  const toggleLike = async () => {
    if (!session?.id) return toast("Faça login para curtir.", "warn");
    if (liked) {
      setLiked(false); setLikesCount(c => c - 1);
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", session.id);
    } else {
      setLiked(true); setLikesCount(c => c + 1);
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: session.id });
    }
  };

  const toggleSave = async () => {
    if (!session?.id) return toast("Faça login para salvar.", "warn");
    if (saved) {
      setSaved(false);
      await supabase.from("saved_posts").delete().eq("post_id", post.id).eq("user_id", session.id);
      toast("Removido dos salvos.");
    } else {
      setSaved(true);
      await supabase.from("saved_posts").insert({ post_id: post.id, user_id: session.id });
      toast("Salvo como inspiração!", "ok");
    }
  };

  return (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }} onClick={() => onNavigate("public_profile", post.user_id)}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: D?.s3, overflow: "hidden" }}>
          {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{post.profiles?.full_name || "Usuário"}</div>
          <div style={{ fontSize: 11, color: D?.w3 }}>{new Date(post.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      
      {/* Media Content (Mocked since we just store JSON in 'content') */}
      <div style={{ width: "100%", borderRadius: 12, background: D?.bg2, border: `1px solid ${D?.b0}`, padding: 16 }}>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: D?.w2 }}>
          {post.content?.caption || "Sem legenda"}
        </div>
        {post.content?.musicas?.[0] && (
           <div style={{ marginTop: 10, fontSize: 11, color: D?.blue2 }}>🎵 {post.content.musicas[0].nome}</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={toggleLike} style={{ background: "none", border: "none", color: liked ? D?.rose : D?.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            {liked ? "❤️" : "🤍"} {likesCount}
          </button>
          <button onClick={() => setShowComments(true)} style={{ background: "none", border: "none", color: D?.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            💬 {post.comments?.[0]?.count || 0}
          </button>
          <button style={{ background: "none", border: "none", color: D?.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            🔁
          </button>
        </div>
        <button onClick={toggleSave} style={{ background: "none", border: "none", color: saved ? D?.amber : D?.w3, fontSize: 18 }}>
          {saved ? "⭐" : "☆"}
        </button>
      </div>

      {showComments && <CommentsModal post={post} session={session} onClose={() => setShowComments(false)} />}
    </div>
  );
};

const CommentsModal = ({ post, session, onClose }) => {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "flex-end" }}>
       <div style={{ background: D?.bg, width: "100%", height: "70vh", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, display: "flex", flexDirection: "column" }}>
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Comentários</div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: D?.w3, fontSize: 20 }}>✕</button>
         </div>
         <div style={{ flex: 1, overflowY: "auto", color: D?.w2 }}>
            Em breve! A infraestrutura de comentários foi criada no banco.
         </div>
       </div>
    </div>
  );
};

const SavedPosts = ({ toast, session, onNavigate }) => {
  return <div style={{ padding: 20 }}>Aba de Salvos em breve!</div>;
};

const PublicProfile = ({ userId, onBack }) => {
  return <div style={{ padding: 20 }}>Perfil Público em breve! <button onClick={onBack}>Voltar</button></div>;
};
