const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

function findAll(str) {
    let indices = [];
    let idx = content.indexOf(str);
    while (idx !== -1) {
        indices.push(idx);
        idx = content.indexOf(str, idx + 1);
    }
    return indices;
}

console.log('Criador indices:', findAll('const Criador ='));
console.log('Estudante indices:', findAll('const Estudante ='));
console.log('Planos indices:', findAll('const Planos ='));
