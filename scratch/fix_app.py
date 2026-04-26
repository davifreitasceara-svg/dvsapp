import sys
import re

file_path = r'c:\Users\PC GAMER\Desktop\vai que ne\src\App.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Restoration content
restored = '''                  <span style={{ fontSize: 30 }}>{rec ? "⏸" : "🎤"}</span>
                  {rec && <div style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</div>}
                </button>
              </div>
              {rec ? <div style={{ display: "flex", alignItems: "center", gap: 9, color: D.rose, fontSize: 13, fontWeight: 600 }}><WaveBar on col={D.rose} /> Gravando…</div> : <div style={{ fontSize: 13, color: D.w3 }}>Toque para {trans ? "continuar" : "iniciar"}</div>}
            </div>
            {trans && (
              <div className="card" style={{ padding: 15 }}>
                <div className="sec-label">Transcrição</div>
                <div style={{ fontSize: 14, lineHeight: 1.75 }}>{trans}</div>
                <div style={{ display: "flex", gap: 7, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="btn primary sm" onClick={() => { setTexto(trans); setTab("resumo"); setTimeout(() => gen("resumo"), 50); }}>🧠 Resumo</button>
                  <button className="btn ghost sm" onClick={() => { setTexto(trans); setTab("mapa"); setTimeout(() => gen("mapa"), 50); }}>🗺️ Mapa</button>
                  <button className="btn ghost sm" onClick={() => { setTexto(trans); setTab("slides"); setTimeout(() => gen("slides"), 50); }}>📊 Slides</button>
                  <button className="btn ghost sm" onClick={() => { setTexto(trans); setTab("cards"); setTimeout(() => gen("cards"), 50); }}>🃏 Cards</button>
                </div>
              </div>
            )}
            {trans && <button className="btn ghost xs" style={{ alignSelf: "flex-start" }} onClick={() => { setTrans(""); setTexto(""); }}>🗑️ Limpar</button>}
          </div>
        )}

        {tab !== "voz" && !load && (
          <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 21 }}>
              {tab === "resumo" ? "Resumo Inteligente 🧠" : tab === "mapa" ? "Mapa Mental 🗺️" : tab === "slides" ? "Gerador de Slides 📊" : tab === "cards" ? "Flashcards 🃏" : "Quiz Interativo ⚡"}
            </div>
            <textarea className="inp" value={wt} onChange={e => setTexto(e.target.value)} placeholder="Cole o texto da aula, artigo ou resumo aqui…" style={{ minHeight: 118 }} />
            <button className="btn primary lg" style={{ width: "100%", fontFamily: "'Sora',sans-serif" }} onClick={() => gen(tab)} disabled={!wt.trim()}>✨ Gerar com IA</button>
          </div>
        )}

        {load && <LoadScreen steps={STEPS3[ltab] || []} cur={cur} pct={pct} title={`Gerando ${tab === "mapa" ? "Mapa Mental" : tab === "slides" ? "Slides" : tab === "cards" ? "Flashcards" : tab === "quiz" ? "Quiz" : "Resumo"}…`} />}

        {!load && res && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ height: 1, background: D.b0 }} />
            {rend()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>'''

# Marker for replacement
start_marker = '<span style={{ fontSize: 30 }}>{rec ? "⏸" : "🎤"}</span>'
end_marker = '<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>'

if start_marker in content and end_marker in content:
    idx_start = content.find(start_marker)
    idx_end = content.find(end_marker)
    new_content = content[:idx_start] + restored + content[idx_end + len(end_marker):]
    
    # Update Planos
    pl_old = 'const PL = ['
    # We find the whole PL block
    pl_start_idx = new_content.find('const PL = [')
    pl_end_idx = new_content.find('];', pl_start_idx) + 2
    
    pl_new_content = '''  const PL = [
    { id: "free", name: "Gratuito", price: 0, col: D.w2, grad: D.gDark, badge: null, feats: ["3 posts/dia", "3 estudos/mês", "Marca d'água DVS", "IA básica"], miss: ["SmartSound AI", "Transcrição ilimitada", "Export HD"] },
    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: "⭐ MAIS POPULAR", link: "https://buy.stripe.com/test_dRm14m1KC9iLaHr6VF5sA04", feats: ["5 posts/dia", "5 estudos/mês", "Sem marca d'água", "SmartSound AI", "Export HD", "Score avançado"], miss: [] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: "🎓 MELHOR CUSTO", link: "https://buy.stripe.com/test_6oUdR874W52veXHeo75sA03", feats: ["10 posts/dia", "10 estudos/mês", "Transcrição avançada", "Mapas mentais", "Slides completos", "Flashcards & Quiz"], miss: [] },
    { id: "full", name: "Completo", price: 20, col: D.amber, grad: D.gAmber, badge: "👑 TUDO INCLUSO", link: "https://buy.stripe.com/test_5kQ6oG4WO9iLbLv93N5sA01", feats: ["Tudo Ilimitado", "IA prioritária", "Sem marcas d'água", "Exportação 4K", "Suporte 24/7"], miss: [] },
  ];'''
    
    if pl_start_idx != -1 and pl_end_idx != -1:
         new_content = new_content[:pl_start_idx] + pl_new_content + new_content[pl_end_idx:]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('MARKERS NOT FOUND')
    if start_marker not in content: print('START MISSING')
    if end_marker not in content: print('END MISSING')
