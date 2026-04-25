const fs = require('fs');

// 1. UPDATE .ENV
const envPath = 'c:/Users/PC GAMER/Desktop/vai que ne/.env';
let envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('GEMINI_API_KEY')) {
  envContent += '\n# Google Gemini API Key\nGEMINI_API_KEY=AIzaSyBAjPiPzXe3vIdCrxpze_QdjPw944XrsZ4\n';
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log("Updated .env");
}

// 2. UPDATE VITE.CONFIG.JS
const vitePath = 'c:/Users/PC GAMER/Desktop/vai que ne/vite.config.js';
let viteContent = fs.readFileSync(vitePath, 'utf8');
viteContent = viteContent.replace(
  /target:\s*'https:\/\/api\.anthropic\.com'/g,
  `target: 'https://generativelanguage.googleapis.com'`
);
viteContent = viteContent.replace(
  /'x-api-key':\s*env\.ANTHROPIC_API_KEY\s*\|\|\s*'',/g,
  `'x-goog-api-key': env.GEMINI_API_KEY || '',`
);
viteContent = viteContent.replace(
  /'anthropic-version':\s*'2023-06-01',/g,
  ``
);
viteContent = viteContent.replace(
  /'anthropic-dangerous-direct-browser-access':\s*'true',?/g,
  ``
);
fs.writeFileSync(vitePath, viteContent, 'utf8');
console.log("Updated vite.config.js");

// 3. UPDATE APP.JSX
const appPath = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// Replace callAI
const callAiTarget = `async function callAI(user, sys = "") {
  try {
    const r = await fetch("/api/ai/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1700,
        system: sys || "Você é DVS EduCreator AI — assistente especialista em marketing digital e educação. Responda sempre em português brasileiro de forma direta, criativa e precisa.",
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAI] Error:", r.status, err); return ""; }
    const d = await r.json();
    return d.content?.map(c => c.text || "").join("") || "";
  } catch(e) { console.error("[callAI]", e); return ""; }
}`;

const callAiReplacement = `async function callAI(user, sys = "") {
  try {
    const r = await fetch("/api/ai/v1beta/models/gemini-2.5-flash:generateContent", {
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
}`;

appContent = appContent.replace(callAiTarget, callAiReplacement);

// Replace callAIVision
const callAIVisionTarget = `async function callAIVision(b64, mediaType, prompt, sys) {
  try {
    const r = await fetch("/api/ai/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1700,
        system: sys || "Você é DVS EduCreator AI — especialista em marketing viral brasileiro. Responda em português.",
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: b64 } },
          { type: "text", text: prompt }
        ]}]
      })
    });
    if (!r.ok) { const err = await r.json().catch(()=>({})); console.error("[callAIVision] Error:", r.status, err); return ""; }
    const d = await r.json();
    return d.content?.map(c => c.text || "").join("") || "";
  } catch (e) { console.error("[callAIVision] Exception:", e); return ""; }
}`;

const callAIVisionReplacement = `async function callAIVision(b64, mediaType, prompt, sys) {
  try {
    const r = await fetch("/api/ai/v1beta/models/gemini-2.5-flash:generateContent", {
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

appContent = appContent.replace(callAIVisionTarget, callAIVisionReplacement);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log("Updated App.jsx");
