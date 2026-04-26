const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Revert the bad replacements
// Almost all ": ICONS.search}" should be ": """
content = content.replace(/: ICONS\.search}/g, ': ""}');

// Now fix the search button specifically
const searchBtnSearch = '{searching ? <Spin s={14} c="#fff" /> : ""}';
const searchBtnFix = '{searching ? <Spin s={14} c="#fff" /> : ICONS.search}';
content = content.replace(searchBtnSearch, searchBtnFix);

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx icons reverted and search button fixed specifically!');
