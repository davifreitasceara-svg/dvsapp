const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const componentsCode = `
// ==================== SOCIAL NETWORK COMPONENTS ====================
const Spin = ({ s = 20, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="spin" style={{ animation: "spin 1s linear infinite" }}>
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
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles!inner(full_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(20);
      
    if (error) { toast("Erro ao carregar feed.", "err"); }
    else { setPosts(data || []); }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spin s={30} c={D.blue} /></div>;

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22 }}>Explorar Criadores</div>
      {posts.map(p => (
        <PostCard key={p.id} post={p} session={session} toast={toast} onNavigate={onNavigate} />
      ))}
      {posts.length === 0 && <div style={{ textAlign: "center", padding: 40, color: D.w3 }}>Nenhum post no feed ainda.</div>}
    </div>
  );
};

const PostCard = ({ post, session, toast, onNavigate }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  
  const toggleLike = async () => {
    if (!session?.id) return toast("Faça login para curtir.", "warn");
    setLiked(!liked);
    setLikesCount(c => liked ? c - 1 : c + 1);
    toast(liked ? "Curtida removida" : "Post curtido!");
  };

  const toggleSave = async () => {
    if (!session?.id) return toast("Faça login para salvar.", "warn");
    setSaved(!saved);
    toast(saved ? "Removido dos salvos." : "Salvo como inspiração!", "ok");
  };

  return (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: D.s3, overflow: "hidden" }}>
          {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{post.profiles?.full_name || "Criador Anônimo"}</div>
          <div style={{ fontSize: 11, color: D.w3 }}>{new Date(post.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      
      <div style={{ width: "100%", borderRadius: 12, background: D.bg2, border: \`1px solid \${D.b0}\`, padding: 16 }}>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: D.w2, whiteSpace: "pre-wrap" }}>
          {post.content?.caption || "Post visualizado."}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={toggleLike} style={{ background: "none", border: "none", color: liked ? D.rose : D.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            {liked ? "❤️" : "🤍"} {likesCount}
          </button>
          <button style={{ background: "none", border: "none", color: D.w3, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700 }}>
            💬 0
          </button>
        </div>
        <button onClick={toggleSave} style={{ background: "none", border: "none", color: saved ? D.amber : D.w3, fontSize: 18 }}>
          {saved ? "⭐" : "☆"}
        </button>
      </div>
    </div>
  );
};

const SavedPosts = ({ toast, session, onNavigate }) => {
  return <div style={{ padding: 20, textAlign: "center", color: D.w3 }}>Nenhum post salvo ainda. Em breve!</div>;
};
// ===================================================================
`;

// Insert components before AppWrapper
if (!content.includes('const Feed =')) {
  content = content.replace('export default function AppWrapper() {', componentsCode + '\\nexport default function AppWrapper() {');
}

// Update NAV array
content = content.replace(
  /const NAV = \[\s*\{\s*id:\s*"criador".*?\},\s*\{\s*id:\s*"planos".*?\},\s*\{\s*id:\s*"perfil".*?\}\s*,?\s*\];/g,
  \`const NAV = [
    { id: "feed",      l: "Feed",      e: "🌐" },
    { id: "criador",   l: "Criador",   e: "📸" },
    { id: "salvos",    l: "Salvos",    e: "⭐" },
    { id: "planos",    l: "Planos",    e: "💳" },
    { id: "perfil",    l: "Perfil",    e: "👤" },
  ];\`
);

// Update main rendering
const oldMain = \`          <main style={{ flex:1, overflowY:"auto", paddingBottom:72 }}>
            {nav === "criador"   && <Criador   toast={toast} session={session} plan={plan} setPostsUsed={setPostsUsed} songsChanged={songsChanged} setSongsChanged={setSongsChanged} />}
            {nav === "planos"    && <Planos    plan={plan} setPlan={handleSetPlan} toast={toast} />}
            {nav === "perfil"    && <Perfil    session={session} plan={plan} postsUsed={postsUsed} songsChanged={songsChanged} onLogout={handleLogout} onUpdateSession={handleUpdateSession} toast={toast} />}
          </main>\`;

const newMain = \`          <main style={{ flex:1, overflowY:"auto", paddingBottom:72 }}>
            {nav === "feed"      && <Feed      toast={toast} session={session} onNavigate={setNav} />}
            {nav === "criador"   && <Criador   toast={toast} session={session} plan={plan} setPostsUsed={setPostsUsed} songsChanged={songsChanged} setSongsChanged={setSongsChanged} />}
            {nav === "salvos"    && <SavedPosts toast={toast} session={session} onNavigate={setNav} />}
            {nav === "planos"    && <Planos    plan={plan} setPlan={handleSetPlan} toast={toast} />}
            {nav === "perfil"    && <Perfil    session={session} plan={plan} postsUsed={postsUsed} songsChanged={songsChanged} onLogout={handleLogout} onUpdateSession={handleUpdateSession} toast={toast} />}
          </main>\`;

if (content.includes(oldMain)) {
  content = content.replace(oldMain, newMain);
} else {
  // Try regex if exact string mismatch
  content = content.replace(
    /<main style=\{\{\s*flex:\s*1,\s*overflowY:\s*"auto",\s*paddingBottom:\s*72\s*\}\}>[\s\S]*?<\/main>/g,
    newMain
  );
}

fs.writeFileSync(appPath, content);
console.log("App.jsx updated with social network base.");
