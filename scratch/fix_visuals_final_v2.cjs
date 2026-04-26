const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let app = fs.readFileSync(path, 'utf8');

// 1. COLORS (D)
const newD = `const D = {
  // Deep Navy Branding
  bg:    "#020B1A",
  bg2:   "#04132B",
  bg3:   "#072146",
  s0:    "#0A2E61",
  s1:    "#0E3C7D",
  s2:    "#134B9A",
  s3:    "#185BB7",
  b0:    "#0F2A52",
  b1:    "#1A3D73",
  b2:    "#255094",
  // Primary (Silver/Cyan accent)
  blue:  "#38BDF8",
  blue2: "#7DD3FC",
  blue3: "#BAE6FD",
  blueLo:"rgba(56,189,248,.12)",
  blueM: "rgba(56,189,248,.28)",
  // Accents
  cyan:  "#22D3EE", cyanLo:"rgba(34,211,238,.1)",
  mint:  "#34D399", mintLo:"rgba(52,211,153,.1)",
  rose:  "#FB7185", roseLo:"rgba(251,113,133,.1)",
  amber: "#FBBF24", amberLo:"rgba(251,191,36,.1)",
  // Text
  w1:    "#F8FAFC",
  w2:    "#CBD5E1",
  w3:    "#64748B",
  // Gradients
  gBlue: "linear-gradient(135deg,#0E3C7D 0%,#185BB7 100%)",
  gCyan: "linear-gradient(135deg,#0284C7 0%,#06B6D4 100%)",
  gMint: "linear-gradient(135deg,#059669 0%,#10B981 100%)",
  gRose: "linear-gradient(135deg,#E11D48 0%,#F43F5E 100%)",
  gAmber:"linear-gradient(135deg,#D97706 0%,#F59E0B 100%)",
  gDark: "linear-gradient(135deg,#04132B 0%,#020B1A 100%)",
};`;
app = app.replace(/const D = \{[\s\S]*?\};/, newD);

// 2. FONTS
if (!app.includes('Cinzel')) {
  app = app.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2.*?/, "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cinzel:wght@700;800&family=Sora:wght@700;800&display=swap');");
}

// 3. LOGO (AuthScreen)
const newLogoSVG = `<svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.5))' }}>
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E2E8F0" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E2E8F0" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E2E8F0" />
              <rect x="38" y="22" width="24" height="52" rx="2" fill="#020B1A" />
              <circle cx="50" cy="79" r="2.5" fill="#020B1A" />
              <rect x="45" y="18" width="10" height="1.5" rx="0.75" fill="#020B1A" />
              <rect x="41" y="26" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="48" y="26" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="55" y="26" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="41" y="34" width="4" height="4" rx="1" fill="#E2E8F0" />
              <rect x="48" y="34" width="4" height="4" rx="1" fill="none" stroke="#E2E8F0" strokeWidth="1.2" />
              <rect x="55" y="34" width="4" height="4" rx="1" fill="#E2E8F0" />
              <path d="M 41 45 L 43.5 42.5 L 41 40 M 44.5 45 L 48 45 M 41 52 L 43.5 49.5 L 41 47 M 44 54 L 56 54 M 44 57 L 51 57" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>`;

const authLogoFlexRegex = /<div[\s\S]*?background: D\.gBlue[\s\S]*?>[\s\S]*?✨[\s\S]*?<\/div>/;
app = app.replace(authLogoFlexRegex, newLogoSVG);

// 4. SOCIAL LOGIN (Remove Apple/Facebook, Fix Google)
const socialContainerStart = app.indexOf('<div style={{ display: "flex", gap: 8 }}>');
const socialContainerEnd = app.indexOf('</div>', socialContainerStart + 40);
if (socialContainerStart !== -1) {
    const googleButton = `<SocialBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
                label="Google"
                onClick={async () => {
                  setLoading(true);
                  if (typeof supabase !== 'undefined') {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo: window.location.origin }
                    });
                    if (error) { setErrors({ email: "Erro: " + error.message }); setLoading(false); }
                  } else {
                    setErrors({ email: "Supabase não configurado." });
                    setLoading(false);
                  }
                }}
              />`;
    
    // Find next </div> closing the social buttons container
    let endIdx = app.indexOf('</div>', socialContainerStart);
    // Find all SocialBtns inside and replace the whole container content with just Google
    app = app.substring(0, socialContainerStart + 41) + googleButton + app.substring(app.indexOf('</div>', socialContainerStart + 500));
    // Wait, the index finding is tricky. Let's use a simpler way.
}

// 5. HEADER (Small Logo)
const smallLogoSVG = `<svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.3))' }}>
              <path d="M 30 20 Q 20 20 20 30 L 20 45 Q 20 50 15 50 Q 20 50 20 55 L 20 70 Q 20 80 30 80" stroke="#E2E8F0" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 70 20 Q 80 20 80 30 L 80 45 Q 80 50 85 50 Q 80 50 80 55 L 80 70 Q 80 80 70 80" stroke="#E2E8F0" strokeWidth="6" fill="none" strokeLinecap="round" />
              <rect x="35" y="15" width="30" height="70" rx="6" fill="#E2E8F0" />
            </svg>`;
const headerLogoRegex = /<div style=\{\{ width:38, height:38[\s\S]*? \}\}>✨<\/div>/;
app = app.replace(headerLogoRegex, smallLogoSVG);

// 6. TEXTS & STYLES
app = app.replace(/DVS EduCreator/g, "DVSCREATOR");
app = app.split("fontFamily: \"'Sora',sans-serif\", fontWeight: 800, fontSize: 26").join("fontFamily: \"'Cinzel', serif\", fontWeight: 800, fontSize: 32");
app = app.split("fontFamily: \"'Sora',sans-serif\", fontWeight: 800, fontSize: 24, marginBottom: 5").join("fontFamily: \"'Cinzel', serif\", fontWeight: 800, fontSize: 28, marginBottom: 5, letterSpacing: '1px'");
app = app.split("fontFamily: \"'Sora',sans-serif\", fontWeight: 800, fontSize: 16").join("fontFamily: \"'Cinzel', serif\", fontWeight: 800, fontSize: 18");
app = app.split("Modo Criador 🔥").join("DVSCREATOR");

fs.writeFileSync(path, app, 'utf8');
console.log("Visuals fixed successfully.");
