const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const start = lines.findIndex(l => l.includes('const Estudante ='));
const end = lines.findIndex(l => l.includes('const Planos ='));

if (start !== -1 && end !== -1) {
    lines.splice(start, end - start);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log('Estudante component removed!');
} else {
    console.log('Could not find Estudante or Planos start points.');
    console.log('Start index:', start);
    console.log('End index:', end);
}
