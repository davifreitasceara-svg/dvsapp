const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The Vite/Babel error is that the closing "}" of "if (stage === result) { return ... }"
// is being interpreted as a JSX closing brace inside JSX context.
// The REAL issue: multiple early returns inside a function component LOOK fine in JS
// but the component also has JSX at the top level (proc stage) that might be confusing the parser.
// 
// The cleanest fix: convert to a single return with ternary / conditional rendering.

// Find the result stage block
const resultBlockStart = '  if (stage === "result" && result) {\n  return (\n    <>';
const resultBlockEnd = '  );\n\n  }\n\n  /*  HOME  */';

const startIdx = content.indexOf(resultBlockStart);
const endIdx = content.indexOf(resultBlockEnd);

if (startIdx === -1 || endIdx === -1) {
  console.log(`startIdx=${startIdx}, endIdx=${endIdx}`);
  console.log('Cannot find markers, aborting.');
  process.exit(1);
}

// Extract the JSX content of the result return (what's between <> and </>)
// The return wraps everything in <> ... </>
// We want to extract everything between <> and the closing </> right before );
const returnContent = content.substring(startIdx + resultBlockStart.length, endIdx);
// returnContent now starts after "<>" and ends before "  );\n\n  }\n\n  /*  HOME  */"
// We need to trim the trailing newline and the closing </> 
// returnContent ends with: "\n    </>\n"
const trimmedContent = returnContent.replace(/\n    <\/>\n$/, '').replace(/^\n/, '');

// Now find the home return - starts right after the endIdx + endMarker
const homeStart = endIdx + resultBlockEnd.length;
// Get the HOME JSX (the main return statement)
// It starts with "\n  return (\n    <div ...>"
// We need to find the end of the Criador component (the final "};")
// The HOME stage is just the rest of the return

// Find the home return statement content
const homeReturnMarker = '\n  return (\n';
const homeReturnIdx = content.indexOf(homeReturnMarker, homeStart);
if (homeReturnIdx === -1) {
  console.log('Cannot find home return!');
  process.exit(1);
}

// Find the opening of the home div
const homeJSXStart = homeReturnIdx + homeReturnMarker.length;
// Find the closing ");\n}" of the function
const funcEnd = content.lastIndexOf('\n}');
const homeJSXBlock = content.substring(homeJSXStart, funcEnd - 2); // Get the inner JSX

// Now reconstruct the Criador component with a single return
const beforeResult = content.substring(0, startIdx);
const afterFunc = content.substring(funcEnd);

// Build a clean single-return version
const newReturn = `  if (stage === "proc") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(5, 7, 9, 0.95)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
           <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid " + D.blueLo, borderTopColor: D.blue2, animation: "spinA 1s linear infinite" }} />
           <div style={{ position: "absolute", inset: 15, borderRadius: "50%", border: "4px solid " + D.roseLo, borderBottomColor: D.rose, animation: "spinA 2s linear reverse infinite" }} />
           <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: 'hidden', padding: 30 }}>
               <img src="/src/assets/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
            </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>{(isImg ? SI : SV)[cur] || "Analisando..."}</div>
          <div style={{ width: 240, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: D.gBlue, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: D.w2, marginTop: 12, fontWeight: 600 }}>{pct}% CONCLUÍDO</div>
        </div>
      </div>
    );
  }

  if (stage === "result" && result) {
    return (
      <>
${trimmedContent}
      </>
    );
  }

  // HOME
  return (
${homeJSXBlock}
  );
`;

// Reconstruct - find where the old proc block starts
const procBlockStart = '  if (stage === "proc") {';
const procIdx = content.indexOf(procBlockStart);
if (procIdx === -1) {
  console.log('Cannot find proc block!');
  process.exit(1);
}

const newContent = content.substring(0, procIdx) + newReturn + afterFunc;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Criador component restructured with clean returns!');
