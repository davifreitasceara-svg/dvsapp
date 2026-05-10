const GEMINI_KEY = 'AIzaSyB4hs1jOQ9kbwy2cTmN6M8w0tQjEF7Y3jc';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`;

async function test() {
  const r = await fetch(GEMINI_URL);
  console.log("Status:", r.status);
  const data = await r.json();
  console.log("Models:", data.models.map(m => m.name));
}

test();
