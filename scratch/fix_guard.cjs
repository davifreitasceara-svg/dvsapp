const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the startCreate guard - require only file
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('startCreate = async'));
if (idx !== -1) {
  const guardLine = lines[idx + 1];
  console.log('Current guard line:', JSON.stringify(guardLine));
  if (guardLine && (guardLine.includes('!file') || guardLine.includes('topic.trim'))) {
    lines[idx + 1] = '    if (!file) { toast("Envie uma foto ou v\u00eddeo primeiro! \uD83D\uDCF8", "warn"); return; }\r';
    content = lines.join('\n');
    fs.writeFileSync(path, content, 'utf8');
    console.log('✅ startCreate guard fixed');
  } else {
    console.log('Guard line not as expected:', guardLine);
  }
} else {
  console.log('startCreate not found');
}
