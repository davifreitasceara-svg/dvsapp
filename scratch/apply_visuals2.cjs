const fs = require('fs');

const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update D Object
const oldDRegex = /const D = \{[\s\S]*?\};\n/m;
const newD = `const D = {
  // backgrounds (Navy Theme)
  bg:    "#031633",
  bg2:   "#051F45",
  bg3:   "#082959",
  // surfaces
  s0:    "#0A326B",
  s1:    "#0D3D82",
  s2:    "#114999",
  s3:    "#1656B3",
  // borders
  b0:    "#0E3875",
  b1:    "#154791",
  b2:    "#1D5BB3",
  // blues (primary branding)
  blue:  "#8BB4F5",
  blue2: "#A8CBFA",
  blue3: "#CBE0FC",
  blueLo:"rgba(139,180,245,.15)",
  blueM: "rgba(139,180,245,.3)",
  // accents
  cyan:  "#22D3EE",
  cyanLo:"rgba(34,211,238,.1)",
  mint:  "#34D399",
  mintLo:"rgba(52,211,153,.1)",
  rose:  "#FB7185",
  roseLo:"rgba(251,113,133,.1)",
  amber: "#FBBF24",
  amberLo:"rgba(251,191,36,.1)",
  // text
  w1:    "#F1F5F9",
  w2:    "#CBD5E1",
  w3:    "#94A3B8",
  // gradients
  gBlue: "linear-gradient(135deg,#0D3D82 0%,#1656B3 100%)",
  gCyan: "linear-gradient(135deg,#0284C7 0%,#06B6D4 100%)",
  gMint: "linear-gradient(135deg,#059669 0%,#10B981 100%)",
  gRose: "linear-gradient(135deg,#E11D48 0%,#F43F5E 100%)",
  gAmber:"linear-gradient(135deg,#D97706 0%,#F59E0B 100%)",
  gDark: "linear-gradient(135deg,#051F45 0%,#031633 100%)",
};\n`;

content = content.replace(oldDRegex, newD);

// 2. Update CSS to include Cinzel font for the logo
const cssRegex = /@import url\('https:\/\/fonts\.googleapis\.com\/css2.*?/;
content = content.replace(cssRegex, `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cinzel:wght@700;800&family=Sora:wght@700;800&display=swap');`);

// 3. Replace "DVS EduCreator" with "DVSCREATOR"
content = content.replace(/DVS EduCreator/g, "DVSCREATOR");

// 4. Update the Logo in AuthScreen
const newLogoSVG = `<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}>
              {/* Left bracket */}
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E6E8E6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              {/* Right bracket */}
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E6E8E6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              {/* Smartphone */}
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E6E8E6" />
              <rect x="38" y="22" width="24" height="52" rx="2" fill={D.bg} />
              <circle cx="50" cy="79" r="2.5" fill={D.bg} />
              <rect x="45" y="18" width="10" height="1.5" rx="0.75" fill={D.bg} />
              {/* Apps on screen */}
              <rect x="41" y="26" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="48" y="26" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="55" y="26" width="4" height="4" rx="1" fill="#E6E8E6" />
              
              <rect x="41" y="34" width="4" height="4" rx="1" fill="#E6E8E6" />
              <rect x="48" y="34" width="4" height="4" rx="1" fill="none" stroke="#E6E8E6" strokeWidth="1.2" />
              <rect x="55" y="34" width="4" height="4" rx="1" fill="#E6E8E6" />

              {/* Code lines on screen */}
              <path d="M 41 45 L 43.5 42.5 L 41 40 M 44.5 45 L 48 45 M 41 52 L 43.5 49.5 L 41 47 M 44 54 L 56 54 M 44 57 L 51 57" stroke="#E6E8E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>`;

const flexLogoRegex = /<div[\s\S]*?background: D\.gBlue[\s\S]*?>[\s\S]*?✨[\s\S]*?<\/div>/;
content = content.replace(flexLogoRegex, newLogoSVG);

// 5. Update fonts and headers for DVSCREATOR
const oldFont1 = \`fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26\`;
const newFont1 = \`fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 32\`;
content = content.split(oldFont1).join(newFont1);

const oldFont2 = \`fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-.3px"\`;
const newFont2 = \`fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 26, letterSpacing: "1px"\`;
content = content.split(oldFont2).join(newFont2);

const oldFont3 = \`fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 5\`;
const newFont3 = \`fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 28, marginBottom: 5, letterSpacing: "1px"\`;
content = content.split(oldFont3).join(newFont3);

const oldHeaderRegex = /Modo Criador 🔥/g;
content = content.replace(oldHeaderRegex, "DVSCREATOR");

fs.writeFileSync(path, content, 'utf8');
console.log("Visuals updated!");
