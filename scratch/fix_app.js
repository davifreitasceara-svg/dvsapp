import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update Inp calls
content = content.replace(/<Inp /g, '<Inp D={D} I={I} errors={errors} setErrors={setErrors} submit={submit} ');

// Update Eye calls
content = content.replace(/<Eye /g, '<Eye I={I} D={D} ');

// Update SocialBtn calls (if any)
content = content.replace(/<SocialBtn /g, '<SocialBtn D={D} ');

fs.writeFileSync(path, content);
console.log('AuthScreen components updated with proper props!');
