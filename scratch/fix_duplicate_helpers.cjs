const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove the FIRST occurrence of the old auth helpers block (around line 1943-1951)
// These are the ones WITHOUT DB_KEY (added by previous session)
const oldHelpers = `const DB_KEY = "dvs_users_v1";
const SESSION_KEY = "dvs_session_v1";`;

// Find all occurrences
const idx1 = content.indexOf(oldHelpers);
const idx2 = content.indexOf(oldHelpers, idx1 + 1);

console.log('First occurrence at index:', idx1);
console.log('Second occurrence at index:', idx2);

if (idx2 === -1) {
  console.log('Only one occurrence found - no duplicate to remove');
  process.exit(0);
}

// Remove from the FIRST occurrence up to "function hashPass" (first block)
// The first block ends just before "const AVATAR_COLORS"
const endOfFirstBlock = content.indexOf('\nconst AVATAR_COLORS', idx1);
const startOfFirstBlock = content.lastIndexOf('\n/* ═══════════════════════════════════════════════\n   AUTH HELPERS', idx1);

console.log('Start of first block:', startOfFirstBlock);
console.log('End of first block (AVATAR_COLORS):', endOfFirstBlock);

if (startOfFirstBlock !== -1 && endOfFirstBlock !== -1) {
  // Remove the first duplicate block
  content = content.slice(0, startOfFirstBlock) + content.slice(endOfFirstBlock);
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: Removed duplicate auth helpers block');
} else {
  console.log('ERROR: Could not find block boundaries');
  console.log('startOfFirstBlock:', startOfFirstBlock, 'endOfFirstBlock:', endOfFirstBlock);
}
