export default async function handler(req, res) {
  // Proxies /api/ai/v1beta/models/... to Google
  const targetUrl = req.url.replace('/api/ai/', '');
  const googleUrl = `https://generativelanguage.googleapis.com/${targetUrl}`;

  try {
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Vercel Proxy Error]', error);
    res.status(500).json({ error: 'Failed to proxy request to Google Gemini' });
  }
}
