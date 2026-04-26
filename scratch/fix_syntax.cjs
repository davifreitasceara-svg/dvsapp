const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The corrupted block:
const corruptedBlock = `    } else setRes({ _err: "Não foi possível processar. Adicione mais texto." });
    setLoad(false);
  };`;

// We need to find this block where it doesn't belong (inside the return)
// Line 1464 ends with ...transcreve em português</div></div>
// Line 1468 starts with const rend = () => {

const targetLine = '<div><div style={{ fontFamily: "\'Sora\',sans-serif", fontWeight: 800, fontSize: 21, marginBottom: 4 }}>Transcrição por Voz 🎤</div><div style={{ fontSize: 14, color: D.w2 }}>Fale — IA transcreve em português</div></div>';

const brokenPattern = targetLine + '\n    } else setRes({ _err: "Não foi possível processar. Adicione mais texto." });\n    setLoad(false);\n  };';

if (content.includes(brokenPattern)) {
    content = content.replace(brokenPattern, targetLine);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('CORRUPTION FIX SUCCESS');
} else {
    // Try with different line endings
    const brokenPatternLF = targetLine + '\r\n    } else setRes({ _err: "Não foi possível processar. Adicione mais texto." });\r\n    setLoad(false);\r\n  };';
    if (content.includes(brokenPatternLF)) {
        content = content.replace(brokenPatternLF, targetLine);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('CORRUPTION FIX SUCCESS (CRLF)');
    } else {
        console.log('Broken pattern not found exactly. Checking for partial match...');
        const lines = content.split(/\r?\n/);
        const newLines = [];
        let skip = false;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Transcrição por Voz 🎤') && lines[i+1]?.includes('} else setRes({ _err:')) {
                console.log(`Found corruption at line ${i+1}`);
                newLines.push(lines[i]);
                i += 3; // skip the 3 broken lines
                continue;
            }
            newLines.push(lines[i]);
        }
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log('CORRUPTION FIX SUCCESS (fallback)');
    }
}
