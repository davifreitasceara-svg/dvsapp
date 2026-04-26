const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject guard at the start of startCreate
const oldStartCreate = `  const startCreate = async () => {
    if (!file) { toast("Envie uma foto ou vídeo primeiro! 📸", "warn"); return; }
    setStage("proc"); setPct(0); setCur(0);`;

const newStartCreate = `  const startCreate = async () => {
    if (!file) { toast("Envie uma foto ou vídeo primeiro! 📸", "warn"); return; }

    const today = new Date().toISOString().split('T')[0];
    let usage = JSON.parse(localStorage.getItem('dvs_usage') || '{"date":"","count":0}');
    if (usage.date !== today) usage = { date: today, count: 0 };
    
    if (usage.count >= 5) {
      toast("Você atingiu o limite gratuito de 5 posts/dia. Assine o Premium para uso ilimitado! 💎", "error");
      return;
    }

    setStage("proc"); setPct(0); setCur(0);`;

if (content.includes(oldStartCreate)) {
  content = content.replace(oldStartCreate, newStartCreate);
  console.log('✅ startCreate guard injected');
} else {
  // Try CRLF
  const oldCRLF = oldStartCreate.replace(/\n/g, '\r\n');
  if (content.includes(oldCRLF)) {
    content = content.replace(oldCRLF, newStartCreate);
    console.log('✅ startCreate guard injected (CRLF)');
  } else {
    console.log('❌ startCreate guard pattern not found');
  }
}

// 2. Inject usage increment at the end of startCreate
// It ends with:
//    setResult(p);
//    if (p.filtro) applyFilt(p.filtro);
//    setStage("result");
//  };
const oldEndCreate = `    setResult(p);
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
  };`;

const newEndCreate = `    setResult(p);
    if (p.filtro) applyFilt(p.filtro);
    setStage("result");
    
    // Increment usage
    usage.count += 1;
    localStorage.setItem('dvs_usage', JSON.stringify(usage));
  };`;

if (content.includes(oldEndCreate)) {
  content = content.replace(oldEndCreate, newEndCreate);
  console.log('✅ Usage increment injected');
} else {
  const oldEndCRLF = oldEndCreate.replace(/\n/g, '\r\n');
  if (content.includes(oldEndCRLF)) {
    content = content.replace(oldEndCRLF, newEndCreate);
    console.log('✅ Usage increment injected (CRLF)');
  } else {
    console.log('❌ Usage increment pattern not found');
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
