const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldPL = `    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: "⭐ MAIS POPULAR", link: "https://buy.stripe.com/test_14AfZgah87aDaHr0xh5sA00", feats: ["Posts ilimitados", "Sem marca d'água", "SmartSound AI", "Export HD", "Score avançado", "Suporte prioritário"], miss: [] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: "🎓 MELHOR CUSTO", link: "https://buy.stripe.com/test_14AfZgah87aDaHr0xh5sA00", feats: ["Transcrição ilimitada", "Mapas mentais ilimitados", "Slides completos", "Flashcards ilimitados", "Quiz ilimitado", "Export PDF avançado"], miss: [] },
    { id: "full", name: "Completo", price: 22, col: D.amber, grad: D.gAmber, badge: "👑 TUDO INCLUSO", link: "https://buy.stripe.com/test_14AfZgah87aDaHr0xh5sA00", feats: ["Tudo do Social", "Tudo do Estudante", "IA prioritária", "Sem limites", "Suporte 24/7"], miss: [] },`;

// The user wants distinct links and they specified "por assinatura" (subscriptions).
// I will place the specific link they gave in the Social Premium, and create placeholders for the others.
// Or if they wanted placeholder names for all:
const newPL = `    { id: "social", name: "Social Premium", price: 10, col: D.blue2, grad: D.gBlue, badge: "⭐ MAIS POPULAR", link: "https://buy.stripe.com/test_LINK_DO_SOCIAL", feats: ["Posts ilimitados", "Sem marca d'água", "SmartSound AI", "Export HD", "Score avançado", "Suporte prioritário"], miss: [] },
    { id: "student", name: "Estudante Premium", price: 15, col: D.mint, grad: D.gMint, badge: "🎓 MELHOR CUSTO", link: "https://buy.stripe.com/test_LINK_DO_ESTUDANTE", feats: ["Transcrição ilimitada", "Mapas mentais ilimitados", "Slides completos", "Flashcards ilimitados", "Quiz ilimitado", "Export PDF avançado"], miss: [] },
    { id: "full", name: "Completo", price: 22, col: D.amber, grad: D.gAmber, badge: "👑 TUDO INCLUSO", link: "https://buy.stripe.com/test_LINK_DO_COMPLETO", feats: ["Tudo do Social", "Tudo do Estudante", "IA prioritária", "Sem limites", "Suporte 24/7"], miss: [] },`;

if (content.includes(oldPL)) {
  content = content.replace(oldPL, newPL);
} else if (content.includes(oldPL.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldPL.replace(/\n/g, '\r\n'), newPL);
} else {
  // Regex fallback just in case
  content = content.replace(/https:\/\/buy\.stripe\.com\/test_14AfZgah87aDaHr0xh5sA00/g, 'https://buy.stripe.com/test_LINK_DO_PLANO');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Links separated');
