import fs from 'fs';

const content = fs.readFileSync('src/App.jsx', 'utf8');
let open = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') open++;
  if (content[i] === '}') open--;
}

console.log('Balance:', open);
if (open !== 0) {
  console.log('UNBALANCED BRACKETS!');
} else {
  console.log('Brackets are balanced.');
}
