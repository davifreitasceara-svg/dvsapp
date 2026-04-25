const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/model:\s*"claude-sonnet-4-20250514"/g, 'model: "claude-3-5-sonnet-20241022"');

content = content.replace(
  /if \(\!r\.ok\) \{ console\.error\("\[callAIVision\]", r\.status\); return ""; \}/g,
  'if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAIVision] Error:", r.status, err); return ""; }'
);

content = content.replace(
  /const d = await r\.json\(\);\n\s*return d\.content\?\.map\(c => c\.text \|\| ""\)\.join\(""\) \|\| "";\n\s*\} catch \{ return ""; \}/g,
  `const d = await r.json();
    return d.content?.map(c => c.text || "").join("") || "";
  } catch(e) { console.error("[callAI]", e); return ""; }`
);

// We must also fix Vite config to pass the header 'anthropic-dangerous-direct-browser-access'
const vitePath = 'c:/Users/PC GAMER/Desktop/vai que ne/vite.config.js';
let viteContent = fs.readFileSync(vitePath, 'utf8');
if (!viteContent.includes('anthropic-dangerous-direct-browser-access')) {
  viteContent = viteContent.replace(
    /'anthropic-version': '2023-06-01',/g,
    `'anthropic-version': '2023-06-01',\n            'anthropic-dangerous-direct-browser-access': 'true',`
  );
  fs.writeFileSync(vitePath, viteContent, 'utf8');
}

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed model names and logs");
