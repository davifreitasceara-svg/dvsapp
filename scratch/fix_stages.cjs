const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// The problem: there is a `return (` at line ~1002 (for result stage) that has no conditional guard.
// After it, there is another `return (` for the home stage that is UNREACHABLE dead code.
// Fix: add `if (stage === "result" && result) {` before the first return, and close it before the home return.

// Step 1: Find the exact marker — the unconditional return before the mock check
const resultReturnMarker = '  return (\n    <>\n      {mock && (';
const resultReturnMarkerCRLF = '  return (\r\n    <>\r\n      {mock && (';

// Step 2: Find the home comment marker
const homeMarker = '  /* ── HOME ── */\n  return (';
const homeMarkerCRLF = '  /* ── HOME ── */\r\n  return (';

let fixed = false;

// Try CRLF first
if (content.includes(resultReturnMarkerCRLF) && content.includes(homeMarkerCRLF)) {
  content = content.replace(resultReturnMarkerCRLF, '  if (stage === "result" && result) {\r\n  return (\r\n    <>\r\n      {mock && (');
  content = content.replace(homeMarkerCRLF, '  }\r\n\r\n  /* ── HOME ── */\r\n  return (');
  fixed = true;
  console.log('Fixed with CRLF line endings');
} else if (content.includes(resultReturnMarker) && content.includes(homeMarker)) {
  content = content.replace(resultReturnMarker, '  if (stage === "result" && result) {\n  return (\n    <>\n      {mock && (');
  content = content.replace(homeMarker, '  }\n\n  /* ── HOME ── */\n  return (');
  fixed = true;
  console.log('Fixed with LF line endings');
} else {
  console.log('Markers not found. Checking what is at that area...');
  const lines = content.split('\n');
  for (let i = 998; i < 1015; i++) {
    console.log(`Line ${i+1}: ${JSON.stringify(lines[i])}`);
  }
}

if (fixed) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: App.jsx fixed! Home stage is now reachable.');
} else {
  console.log('FAILED: Could not apply fix.');
}
