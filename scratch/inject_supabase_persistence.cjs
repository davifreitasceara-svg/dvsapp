const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update startCreate usage check to use Supabase instead of localStorage
const oldStartCreateCheck = `    const today = new Date().toISOString().split('T')[0];
    let usage = JSON.parse(localStorage.getItem('dvs_usage') || '{"date":"","count":0}');
    if (usage.date !== today) usage = { date: today, count: 0 };
    
    if ((plan === "free" || plan === "student") && usage.count >= 5) {
      toast("Você atingiu o limite de 5 posts/dia do seu plano. Faça upgrade para o Social Premium ou Completo! 💎", "error");
      return;
    }`;

const newStartCreateCheck = `    // Database usage check
    let currentUsage = 0;
    if (plan === "free" || plan === "student") {
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase.from('profiles').select('posts_used, last_usage_reset').eq('id', session.id).single();
      
      if (profile) {
        if (profile.last_usage_reset !== today) {
           await supabase.from('profiles').update({ posts_used: 0, last_usage_reset: today }).eq('id', session.id);
           currentUsage = 0;
        } else {
           currentUsage = profile.posts_used;
        }
      }

      if (currentUsage >= 5) {
        toast("Limite diário de 5 posts atingido. Faça upgrade para o Social Premium! 💎", "error");
        return;
      }
    }`;

content = content.replace(oldStartCreateCheck, newStartCreateCheck);
content = content.replace(oldStartCreateCheck.replace(/\n/g, '\r\n'), newStartCreateCheck);

// 2. Update startCreate save logic
const oldStartCreateSave = `    setResult(p);
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
    
    // Increment usage
    usage.count += 1;
    localStorage.setItem('dvs_usage', JSON.stringify(usage));`;

const newStartCreateSave = `    setResult(p);
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
    
    // Save to Supabase
    await supabase.from('posts').insert([{ user_id: session.id, content: p }]);
    if (plan === "free" || plan === "student") {
      await supabase.from('profiles').update({ posts_used: currentUsage + 1 }).eq('id', session.id);
    }`;

content = content.replace(oldStartCreateSave, newStartCreateSave);
content = content.replace(oldStartCreateSave.replace(/\n/g, '\r\n'), newStartCreateSave);

// 3. Update gen usage check
const oldGenCheck = `    // Check student mode limits
    if (plan === "free" || plan === "social") {
      const month = new Date().toISOString().substring(0,7);
      let usage = JSON.parse(localStorage.getItem('dvs_estudos_usage') || '{"month":"","count":0}');
      if (usage.month !== month) usage = { month: month, count: 0 };
      if (usage.count >= 5) {
        toast("Limite de 5 estudos por mês atingido. Assine o Estudante Premium ou Completo! 🎓", "error");
        return;
      }
      usage.count += 1;
      localStorage.setItem('dvs_estudos_usage', JSON.stringify(usage));
    }`;

const newGenCheck = `    // Database studies check
    let currentStudyUsage = 0;
    if (plan === "free" || plan === "social") {
       const { data: profile } = await supabase.from('profiles').select('estudos_used').eq('id', session.id).single();
       currentStudyUsage = profile?.estudos_used || 0;
       if (currentStudyUsage >= 5) {
          toast("Limite de 5 estudos atingido. Assine o Estudante Premium! 🎓", "error");
          return;
       }
    }`;

content = content.replace(oldGenCheck, newGenCheck);
content = content.replace(oldGenCheck.replace(/\n/g, '\r\n'), newGenCheck);

// 4. Update gen save logic
const oldGenSave = `    if (parsed) { setRes(parsed); toast("Gerado com sucesso!", "ok"); }`;

const newGenSave = `    if (parsed) { 
      setRes(parsed); 
      toast("Gerado com sucesso!", "ok"); 
      // Save to Supabase
      await supabase.from('estudos').insert([{ user_id: session.id, type: type, content: parsed }]);
      if (plan === "free" || plan === "social") {
         await supabase.from('profiles').update({ estudos_used: currentStudyUsage + 1 }).eq('id', session.id);
      }
    }`;

content = content.replace(oldGenSave, newGenSave);
content = content.replace(oldGenSave.replace(/\n/g, '\r\n'), newGenSave);

fs.writeFileSync(path, content, 'utf8');
console.log('App.jsx updated with Supabase persistence logic');
