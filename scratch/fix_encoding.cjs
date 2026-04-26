const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use string-based replacement for simplicity and to avoid regex quantifier issues with ??
function fix(str, from, to) {
    return str.split(from).join(to);
}

content = fix(content, 'dom??nio', 'domínio');
content = fix(content, 'usu??rio', 'usuário');
content = fix(content, 'in??cio', 'início');
content = fix(content, 'm??s', 'mês');
content = fix(content, 'voc??', 'você');
content = fix(content, 'conex??o', 'conexão');
content = fix(content, 'redefini??o', 'redefinição');
content = fix(content, 'verificac??o', 'verificação');
content = fix(content, 'expirac??o', 'expiração');
content = fix(content, 'descric??o', 'descrição');
content = fix(content, '??lbum', 'álbum');
content = fix(content, 'm??sica', 'música');
content = fix(content, 'pr??via', 'prévia');
content = fix(content, 'dispon??vel', 'disponível');
content = fix(content, 'indispon??vel', 'indisponível');
content = fix(content, 'ac??o', 'ação');
content = fix(content, 'irrevers??vel', 'irreversível');
content = fix(content, 'notificac??es', 'notificações');
content = fix(content, 'sess??es', 'sessões');
content = fix(content, 'precis??o', 'precisão');
content = fix(content, 'espec??fico', 'específico');
content = fix(content, 'inv??lido', 'inválido');
content = fix(content, 'seguran??a', 'segurança');
content = fix(content, 'm??ximo', 'máximo');
content = fix(content, 'antiga??', 'antiga');
content = fix(content, 'explica??es', 'explicações');
content = fix(content, 'se??es', 'seções');
content = fix(content, 'possu??', 'possui');
content = fix(content, 'interrogac??o', 'interrogação');
content = fix(content, '✨?', '✨');
content = fix(content, '??', ' '); // Catch all for remaining ??

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx encoding fixed with string replacement!');
