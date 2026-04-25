const https = require('https');

const apiKey = 'AIzaSyBAjPiPzXe3vIdCrxpze_QdjPw944XrsZ4';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const data = JSON.stringify({
  contents: [{ role: "user", parts: [{ text: "Oi, você está funcionando? Responda 'SIM' se sim." }] }]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(url, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    console.log("RESPONSE:", body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
