const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Global replacement for result access
content = content.replace(/result\.musicas/g, "result?.musicas");
content = content.replace(/result\.score/g, "result?.score");

// Fix the specific lines in the overlay
content = content.replace(/result\?.musicas\[0\]\.titulo/g, "result?.musicas?.[0]?.titulo");
content = content.replace(/result\?.musicas\[0\]\.artista/g, "result?.musicas?.[0]?.artista");

// Fix fCSS just in case
content = content.replace(/filters\.brightness/g, "filters?.brightness");
content = content.replace(/filters\.contrast/g, "filters?.contrast");
content = content.replace(/filters\.saturate/g, "filters?.saturate");

fs.writeFileSync(path, content, 'utf8');
console.log("Global null checks applied!");
