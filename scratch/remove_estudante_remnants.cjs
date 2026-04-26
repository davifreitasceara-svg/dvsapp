const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the subtitle reference
const oldSub = `IA para criar conteúdo & estudar`;
const newSub = `IA para criar conteúdos incríveis`;

if (content.includes(oldSub)) {
  content = content.replace(oldSub, newSub);
  console.log("SUCCESS: Replaced subtitle");
} else {
  console.log("ERROR: Subtitle not found");
}

// 2. Remove the "Modo estudo" badge
// It looks like this: {["🔥 Conteúdo viral", "📚 Modo estudo", "🎵 Música real"].map...
const oldBadges = `{["🔥 Conteúdo viral", "📚 Modo estudo", "🎵 Música real"].map((f, i) => (`;
const newBadges = `{["🔥 Conteúdo viral", "🎵 Música real", "🚀 Alto Engajamento"].map((f, i) => (`;

if (content.includes(oldBadges)) {
  content = content.replace(oldBadges, newBadges);
  console.log("SUCCESS: Replaced badges");
} else {
  console.log("ERROR: Badges not found");
}

fs.writeFileSync(path, content, 'utf8');
