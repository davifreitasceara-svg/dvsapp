const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = /<div style={{ marginTop: 12, background: D\.s0, borderRadius: 20, padding: 20, border: '1px solid ' \+ D\.b0, boxShadow: "0 10px 40px rgba\(0,0,0,0\.3\)" }}>\s*<div style={{ marginTop: 12, background: D\.s0, borderRadius: 24, padding: 24, border: '2px solid ' \+ D\.blue, boxShadow: "0 15px 45px rgba\(0,0,0,0\.4\)" }}>/;

const replacement = `        <div style={{ marginTop: 12, background: D.s0, borderRadius: 24, padding: 24, border: '2px solid ' + D.blue, boxShadow: "0 15px 45px rgba(0,0,0,0.4)" }}>`;

content = content.replace(target, replacement);
// Remove one extra </div> at the end of the block
content = content.replace(/<\/div>\s*<\/div>\s*<div style={{ textAlign: "center", fontSize: 10/, "</div>\n        <div style={{ textAlign: \"center\", fontSize: 10");

fs.writeFileSync(path, content, 'utf8');
console.log("UI Cleaned!");
