const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. startCreate - Update the block from localStorage
// Currently it blocks if usage.count >= 5. Now it should only block if plan == free or student.
const oldStartCreateBlock = `    if (usage.count >= 5) {
      toast("Você atingiu o limite gratuito de 5 posts/dia. Assine o Premium para uso ilimitado! 💎", "error");
      return;
    }`;

const newStartCreateBlock = `    if ((plan === "free" || plan === "student") && usage.count >= 5) {
      toast("Você atingiu o limite de 5 posts/dia do seu plano. Faça upgrade para o Social Premium ou Completo! 💎", "error");
      return;
    }`;
content = content.replace(oldStartCreateBlock, newStartCreateBlock);
content = content.replace(oldStartCreateBlock.replace(/\n/g, '\r\n'), newStartCreateBlock);

// 2. gen - Add student mode limit at the start
const oldGen = `  const gen = async type => {
    if (!wt.trim()) { toast("Adicione texto ou grave sua voz!", "warn"); return; }
    setLoad(true); setLtab(type); setPct(0); setCur(0); setRes(null); setRtype(type); setFlips({}); setQans({}); setQrev({});`;

const newGen = `  const gen = async type => {
    if (!wt.trim()) { toast("Adicione texto ou grave sua voz!", "warn"); return; }
    
    // Check student mode limits
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
    }

    setLoad(true); setLtab(type); setPct(0); setCur(0); setRes(null); setRtype(type); setFlips({}); setQans({}); setQrev({});`;
content = content.replace(oldGen, newGen);
content = content.replace(oldGen.replace(/\n/g, '\r\n'), newGen);


// 3. SmartSound AI limit
// Change <SmartSoundPlayer musicas={result?.musicas} toast={toast} /> to pass plan={plan}
content = content.replace('<SmartSoundPlayer musicas={result?.musicas} toast={toast} />', '<SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} />');

// Now update SmartSoundPlayer definition:
const oldSS = `const SmartSoundPlayer = ({ musicas = [], toast }) => {`;
const newSS = `const SmartSoundPlayer = ({ musicas = [], toast, plan }) => {`;
content = content.replace(oldSS, newSS);

// And block playback inside playTrack
const oldPlayTrack = `  const playTrack = (t) => {
    if (!t?.previewUrl) { toast("Prévia não disponível para esta faixa.", "warn"); return; }`;

const newPlayTrack = `  const playTrack = (t) => {
    if (plan === "free" || plan === "student") {
      toast("O SmartSound AI é um recurso do Social Premium e Completo! 🎵💎", "warn");
      return;
    }
    if (!t?.previewUrl) { toast("Prévia não disponível para esta faixa.", "warn"); return; }`;
content = content.replace(oldPlayTrack, newPlayTrack);
content = content.replace(oldPlayTrack.replace(/\n/g, '\r\n'), newPlayTrack);

// 4. Export HD
// Find `scale: 2` and replace with `scale: (plan === "social" || plan === "full") ? 3 : 1`
content = content.replace(/scale: 2/g, 'scale: (plan === "social" || plan === "full") ? 3 : 1');

// Save changes
fs.writeFileSync(path, content, 'utf8');
console.log("Applied plan limits successfully!");
