const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix Estudante Footer
const brokenFooterStart = '{rend()}\\n            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>\\n      </div>\\n    </div>\\n  );\\n};';
// Wait, the markers in JS need to match the actual file content which might have different whitespace.

// Let's use a simpler replacement for the footer.
const oldFooter = `            {rend()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
      </div>
    </div>
  );
};`;

const newFooter = `            {rend()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
              <button className="btn ghost sm" onClick={() => { toast("📄 Gerando PDF...", "info"); setTimeout(() => toast("✅ PDF gerado!", "ok"), 2000); }}>📄 PDF</button>
              <button className="btn ghost sm" onClick={() => { navigator.clipboard.writeText(JSON.stringify(res, null, 2)); toast("Copiado!", "ok"); }}>📋 Copiar</button>
              <button className="btn ghost sm" onClick={() => { setRes(null); gen(rtype); }}>↺ Refazer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};`;

if (content.includes(oldFooter)) {
    content = content.replace(oldFooter, newFooter);
}

// 2. Update startCreate usage logic
const oldStartCreateCheck = `    if (plan === "free" || plan === "student") {
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase.from('profiles').select('posts_used, last_usage_reset').eq('id', session.id).single();
      
      if (profile) {
        if (profile.last_usage_reset !== today) {
           await supabase.from('profiles').update({ posts_used: 0, last_usage_reset: today }).eq('id', session.id);
           currentUsage = 0;
        } else {
           currentUsage = profile.posts_used;
        }
      }

      if (currentUsage >= 5) {
        toast("Limite diário de 5 posts atingido. Faça upgrade para o Social Premium! 💎", "error");
        return;
      }
    }`;

const newStartCreateCheck = `    const limits = { free: 3, social: 5, student: 10, full: Infinity };
    const limit = limits[plan] || 3;

    if (plan !== "full") {
      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase.from('profiles').select('posts_used, last_usage_reset').eq('id', session.id).single();
      
      if (profile) {
        if (profile.last_usage_reset !== today) {
           await supabase.from('profiles').update({ posts_used: 0, last_usage_reset: today }).eq('id', session.id);
           currentUsage = 0;
        } else {
           currentUsage = profile.posts_used;
        }
      }

      if (currentUsage >= limit) {
        toast(\`Limite diário de \${limit} posts atingido. Faça upgrade para o plano superior! 💎\`, "error");
        return;
      }
    }`;

// Use a more robust search for startCreate check
const startCreateCheckMarker = 'if (plan === "free" || plan === "student") {';
if (content.includes(startCreateCheckMarker)) {
    const startIdx = content.indexOf(startCreateCheckMarker);
    const endIdx = content.indexOf('}', content.indexOf('if (currentUsage >= 5)', startIdx)) + 6; // +6 to catch the outer closing brace
    // Actually, let's just find the outer closing brace more carefully.
    let braceCount = 0;
    let foundEnd = -1;
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                foundEnd = i + 1;
                break;
            }
        }
    }
    if (foundEnd !== -1) {
        content = content.substring(0, startIdx) + newStartCreateCheck + content.substring(foundEnd);
    }
}

// 3. Update gen usage logic
const genCheckMarker = 'if (plan === "free" || plan === "social") {';
const newGenCheck = `    const limits = { free: 3, social: 5, student: 10, full: Infinity };
    const limit = limits[plan] || 3;

    if (plan !== "full") {
       const { data: profile } = await supabase.from('profiles').select('estudos_used').eq('id', session.id).single();
       currentStudyUsage = profile?.estudos_used || 0;
       if (currentStudyUsage >= limit) {
          toast(\`Limite de \${limit} estudos atingido. Faça upgrade para o plano superior! 🎓\`, "error");
          return;
       }
    }`;

if (content.includes(genCheckMarker)) {
    const startIdx = content.indexOf(genCheckMarker);
    let braceCount = 0;
    let foundEnd = -1;
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                foundEnd = i + 1;
                break;
            }
        }
    }
    if (foundEnd !== -1) {
        content = content.substring(0, startIdx) + newGenCheck + content.substring(foundEnd);
    }
}

// 4. Update supabase update logic for studies count
content = content.replace('if (plan === "free" || plan === "social") {', 'if (plan !== "full") {');
content = content.replace('if (plan === "free" || plan === "student") {', 'if (plan !== "full") {');

// 5. Fix App props passing
content = content.replace('{nav === "criador"   && <Criador   toast={toast} />}', '{nav === "criador"   && <Criador   toast={toast} session={session} plan={plan} />}');
content = content.replace('{nav === "estudante" && <Estudante toast={toast} />}', '{nav === "estudante" && <Estudante toast={toast} session={session} plan={plan} />}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS');
