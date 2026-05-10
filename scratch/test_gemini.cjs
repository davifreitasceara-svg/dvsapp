const GEMINI_KEY = "AIzaSyB4hs1jOQ9kbwy2cTmN6M8w0tQjEF7Y3jc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

async function test() {
  const r = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "teste" }] }]
    }),
  });
  const data = await r.json();
  console.log("Status:", r.status);
  console.log(JSON.stringify(data, null, 2));
}

test();
