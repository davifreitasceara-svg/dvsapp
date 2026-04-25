const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const callAiRegex = /async function callAI\(user, sys = ""\) \{[\s\S]*?\n\}/;
const callAIVisionRegex = /async function callAIVision\(b64, mediaType, prompt, sys\) \{[\s\S]*?\n\}/;

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

content = content.replace(callAiRegex, callAiReplacement);
content = content.replace(callAIVisionRegex, callAIVisionReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log("Functions rewritten with Gemini 2.5 flash!");
