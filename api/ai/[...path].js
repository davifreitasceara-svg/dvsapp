export default async function handler(req, res) {
  // CORS headers - permite acesso do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('[AI Proxy] GEMINI_API_KEY não está configurada nas variáveis de ambiente da Vercel!');
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
  }

  // Extrai o path da URL, ex: /api/ai/v1beta/models/... -> v1beta/models/...
  const { path } = req.query;
  const pathStr = Array.isArray(path) ? path.join('/') : (path || '');

  if (!pathStr) {
    return res.status(400).json({ error: 'Nenhum path fornecido' });
  }

  const googleUrl = `https://generativelanguage.googleapis.com/${pathStr}`;

  try {
    const body = req.method !== 'GET' && req.method !== 'HEAD' 
      ? JSON.stringify(req.body) 
      : undefined;

    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[AI Proxy] Erro do Google:', response.status, data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[AI Proxy] Erro inesperado:', error.message);
    return res.status(500).json({ error: 'Falha ao conectar com Google Gemini: ' + error.message });
  }
}

