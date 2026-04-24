export async function callAI(user, sys = "") {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1700,
        system: sys || "Você é DVS EduCreator AI — assistente especialista em marketing digital e educação. Responda sempre em português brasileiro de forma direta, criativa e precisa.",
        messages: [{ role: "user", content: user }],
      }),
    });
    const d = await r.json();
    return d.content?.map(c => c.text || "").join("") || "";
  } catch { return ""; }
}
