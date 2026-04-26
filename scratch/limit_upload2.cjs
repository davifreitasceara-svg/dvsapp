const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(\`✅ "\${f.name.slice(0, 24)}" carregado!\`, "ok");
  }, [toast]);`;

const replacement = `  const handleFileChange = useCallback(async e => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Check limits before allowing upload
    const limits = { free: 3, social: 5, student: 10, full: Infinity };
    const limit = limits[plan] || 3;
    let currentUsage = 0;

    if (plan !== "full" && session?.id) {
      toast("Verificando limite...", "info");
      const today = new Date().toISOString().split('T')[0];
      try {
        const { data: profile } = await supabase.from('profiles').select('posts_used, last_usage_reset').eq('id', session.id).single();
        if (profile) {
          if (profile.last_usage_reset !== today) {
             currentUsage = 0;
          } else {
             currentUsage = profile.posts_used;
          }
        }
        if (currentUsage >= limit) {
          toast(\`Limite diário de \${limit} posts atingido. Faça upgrade para o plano superior! 💎\`, "error");
          e.target.value = null; // Clear the input
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setFile(f);
    setFileURL(URL.createObjectURL(f));
    setIsImg(f.type.startsWith("image"));
    toast(\`✅ "\${f.name.slice(0, 24)}" carregado!\`, "ok");
  }, [toast, plan, session]);`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: Added limit check to file upload');
} else {
  console.log('ERROR: target string not found in handleFileChange');
}
