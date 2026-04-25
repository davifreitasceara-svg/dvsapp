export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  // No Vercel Edge, url.pathname será algo como /api/ai/v1beta/models/...
  const path = url.pathname.replace('/api/ai/', '');
  
  if (!path) {
    return new Response(JSON.stringify({ error: 'No path provided' }), { status: 400 });
  }

  const googleUrl = `https://generativelanguage.googleapis.com/${path}${url.search}`;

  try {
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    return response;
  } catch (error) {
    console.error('[Vercel Edge Proxy Error]', error);
    return new Response(JSON.stringify({ error: 'Failed to proxy request to Google Gemini' }), { status: 500 });
  }
}
