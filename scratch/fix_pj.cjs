const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldPj = `function pj(raw) {
  try { return JSON.parse(raw.replace(/\`\`\`json\\n?|\`\`\`\\n?/g, "").trim()); }
  catch { return null; }
}`;

const newPj = `function pj(raw) {
  if (!raw) return null;
  try {
    const clean = raw.replace(/\`\`\`json\\n?|\`\`\`\\n?/g, "").trim();
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
    }
    return JSON.parse(clean);
  } catch (e) {
    console.error("pj parse error:", e, "\\nRAW:", raw);
    return null;
  }
}`;

// Use regex to find and replace the pj function since line endings might differ
const pjRegex = /function pj\(raw\) \{[\s\S]*?catch[\s\S]*?return null;\s*\}/;

if (pjRegex.test(content)) {
  content = content.replace(pjRegex, newPj);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ pj function replaced successfully');
} else {
  console.log('❌ pj function not found');
}
