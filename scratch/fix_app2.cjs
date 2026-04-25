const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `    const fallbackMusicas = [
      { tipo: "Viral", nome: "Mtg Quero Te Encontrar", artista: "DJ Luan Gomes", vibe: "Animada" },
      { tipo: "Em Alta", nome: "Diz Aí Qual é o Plano", artista: "Mc IG", vibe: "Urbana" },
      { tipo: "Recomendada", nome: "Casca de Bala", artista: "Thullio Milionário", vibe: "Sertanejo" }
    ];`;

const replacement = `    const ALL_MUSIC = [
      { tipo: "Viral", nome: "Mtg Quero Te Encontrar", artista: "DJ Luan Gomes", vibe: "Animada" },
      { tipo: "Em Alta", nome: "Diz Aí Qual é o Plano", artista: "Mc IG", vibe: "Urbana" },
      { tipo: "Recomendada", nome: "Casca de Bala", artista: "Thullio Milionário", vibe: "Sertanejo" },
      { tipo: "Viral", nome: "Perna Bamba", artista: "Parangolé", vibe: "Dança" },
      { tipo: "Em Alta", nome: "Macetando", artista: "Ivete Sangalo", vibe: "Festa" },
      { tipo: "Recomendada", nome: "Let's Go 4", artista: "Mc IG", vibe: "Trap" },
      { tipo: "Viral", nome: "Voando pro Pará", artista: "Joelma", vibe: "Clássico" },
      { tipo: "Em Alta", nome: "Lapada Dela", artista: "Menos é Mais", vibe: "Pagode" },
      { tipo: "Recomendada", nome: "Chico", artista: "Luísa Sonza", vibe: "Romântica" },
      { tipo: "Viral", nome: "Toca o Trompete", artista: "Felipe Amorim", vibe: "Eletrônica" }
    ];
    // Randomize
    const fallbackMusicas = ALL_MUSIC.sort(() => 0.5 - Math.random()).slice(0, 3);`;

content = content.replace(targetStr, replacement);
fs.writeFileSync(path, content, 'utf8');
console.log("Randomizer injected.");
