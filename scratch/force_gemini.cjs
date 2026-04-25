const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const replacementFunctions = `async function callAI(user, sys = "") {
  try {
    const r = await fetch("/api/ai/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys || "Você é DVS EduCreator AI — assistente especialista em marketing digital e educação. Responda sempre em português brasileiro de forma direta, criativa e precisa." }] },
        contents: [{ role: "user", parts: [{ text: user }] }]
      }),
    });
    if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAI] Error:", r.status, err); return ""; }
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch(e) { console.error("[callAI]", e); return ""; }
}

function pj(raw) {
  try { return JSON.parse(raw.replace(/\`\`\`json\\n?|\`\`\`\\n?/g, "").trim()); }
  catch { return null; }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callAIVision(b64, mediaType, prompt, sys) {
  try {
    const r = await fetch("/api/ai/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys || "Você é DVS EduCreator AI — especialista em marketing viral brasileiro. Responda em português." }] },
        contents: [{ role: "user", parts: [
          { inlineData: { mimeType: mediaType, data: b64 } },
          { text: prompt }
        ]}]
      })
    });
    if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAIVision] Error:", r.status, err); return ""; }
    const d = await r.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (e) { console.error("[callAIVision] Exception:", e); return ""; }
}`;

// We will find "async function callAI(user, sys = "") {" and "/* ═══════════════════════════════════════════════\n   PRIMITIVES"
const startIndex = content.indexOf('async function callAI(user, sys = "") {');
const endIndex = content.indexOf('/* ═══════════════════════════════════════════════\n   PRIMITIVES');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + replacementFunctions + '\n\n' + content.slice(endIndex);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Functions replaced successfully.");
} else {
  console.log("Could not find boundaries.");
}
