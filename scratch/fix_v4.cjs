const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove most sparkles (✨)
// We'll remove them from common strings and labels.
content = content.replace(/✨/g, '');

// 2. Add search icon to ICONS
const iconsEnd = '  phone:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>,\n};';
const iconsWithSearch = '  phone:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>,\n  search:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,\n};';
if (content.includes(iconsEnd)) {
    content = content.replace(iconsEnd, iconsWithSearch);
}

// 3. Update music search icon in SmartSoundPlayer
// Search button after ✨ removal might have empty space
content = content.replace(/: ""}/g, ': ICONS.search}');
content = content.replace(/: " "}/g, ': ICONS.search}');

// 4. Music limit (3 changes for free)
const criadorState = 'const [mock, setMock] = useState(null); // { platform, type }';
const criadorExtraState = 'const [mock, setMock] = useState(null); // { platform, type }\n  const [songsChanged, setSongsChanged] = useState(0);\n  const [postId, setPostId] = useState(null);';
if (content.includes(criadorState)) {
    content = content.replace(criadorState, criadorExtraState);
}

const smPlayerComp = '<SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} />';
const smPlayerCompNew = '<SmartSoundPlayer musicas={result?.musicas} toast={toast} plan={plan} songsChanged={songsChanged} setSongsChanged={setSongsChanged} />';
if (content.includes(smPlayerComp)) {
    content = content.replace(smPlayerComp, smPlayerCompNew);
}

const smPlayerDef = 'const SmartSoundPlayer = ({ musicas, toast, plan }) => {';
const smPlayerDefNew = 'const SmartSoundPlayer = ({ musicas, toast, plan, songsChanged, setSongsChanged }) => {';
if (content.includes(smPlayerDef)) {
    content = content.replace(smPlayerDef, smPlayerDefNew);
}

// Add limit check in playTrack
const playTrackStart = 'const playTrack = (t) => {';
const playTrackLimit = 'const playTrack = (t) => {\n    if (plan === "free" && songsChanged >= 3 && t !== track) {\n      toast("Limite de 3 trocas atingido no plano Gratuito!", "warn");\n      return;\n    }\n    if (t !== track) setSongsChanged(prev => prev + 1);';
if (content.includes(playTrackStart)) {
    content = content.replace(playTrackStart, playTrackLimit);
}

// 5. Save edits (update Supabase on share)
const insertPost = "await supabase.from('posts').insert([{ user_id: session.id, content: p }]);";
const insertPostSelect = "const { data: postData } = await supabase.from('posts').insert([{ user_id: session.id, content: p }]).select();\n    if (postData?.[0]) setPostId(postData[0].id);";
if (content.includes(insertPost)) {
    content = content.replace(insertPost, insertPostSelect);
}

const shareStart = 'const compartilharDireto = async () => {';
const shareUpdate = `const compartilharDireto = async () => {
    if (postId) {
      try { await supabase.from('posts').update({ content: { ...result, caption, filters } }).eq('id', postId); } catch(e) {}
    }`;
if (content.includes(shareStart)) {
    content = content.replace(shareStart, shareUpdate);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx updated with all v4 changes!');
