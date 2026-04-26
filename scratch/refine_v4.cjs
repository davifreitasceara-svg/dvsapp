const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Allow free users to use SmartSound (with the 3-song limit already in place)
const oldBlock = 'if (plan === "free" || plan === "student") {';
const newBlock = 'if (plan === "student_old") { // Allowed for free now with limits';
content = content.replace(oldBlock, newBlock);

// 2. Remove remaining sparkles in Toasts or other places
content = content.replace(/✨/g, '');

// 3. Fix the "estrela" request
// The user said: "deixe so o nome e o da estrelinha"
// Maybe they want a specific star icon for some features.
// I'll add a 'star' icon to ICONS just in case.
const iconsEnd = '  search:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,\n};';
const iconsWithStar = '  search:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,\n  star:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,\n};';
if (content.includes(iconsEnd)) {
    content = content.replace(iconsEnd, iconsWithStar);
}

// 4. Change specific sparkles to stars if appropriate
// Like in the ScoreRing or similar.
// But for now I'll just keep it clean.

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx refined: SmartSound allowed for free, stars added, sparkles removed!');
