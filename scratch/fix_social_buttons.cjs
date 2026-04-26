const fs = require('fs');

const appPath = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
const backupPath = 'c:/Users/PC GAMER/Downloads/DVSEduCreator_1.jsx';

let app = fs.readFileSync(appPath, 'utf8');
const backup = fs.readFileSync(backupPath, 'utf8');

// The user wants the FULL NORMAL LOGIN (email/password, register, etc) but ONLY the Google button in the social area.

const backupStart = backup.indexOf('const AuthScreen = ({ onLogin }) => {');
const backupEnd = backup.indexOf('\n/* ═══════════════════════════════════════════════\n   PERFIL');

let originalAuthScreen = backup.slice(backupStart, backupEnd).trim();

// Remove Apple and Facebook buttons
// The buttons are:
// <SocialBtn icon={...} label="Apple" onClick={...} />
// <SocialBtn icon={...} label="Facebook" onClick={...} />

originalAuthScreen = originalAuthScreen.replace(
  /<SocialBtn[\s\S]*?label="Apple"[\s\S]*?\/>/g,
  ''
);

originalAuthScreen = originalAuthScreen.replace(
  /<SocialBtn[\s\S]*?label="Facebook"[\s\S]*?\/>/g,
  ''
);

// We replace the current AuthScreen in App.jsx
const appAuthStart = app.indexOf('const AuthScreen = ({ onLogin }) => {');
const appAuthEnd = app.indexOf('\nconst Perfil =');

if (appAuthStart !== -1 && appAuthEnd !== -1) {
  app = app.substring(0, appAuthStart) + originalAuthScreen + app.substring(appAuthEnd);
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('SUCCESS: Restored normal login with ONLY Google button');
} else {
  console.log('ERROR: Could not find AuthScreen boundaries in App.jsx');
}
