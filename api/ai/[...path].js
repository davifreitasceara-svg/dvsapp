export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('[AI Proxy] GEMINI_API_KEY nao configurada!');
    return res.status(500).json({ error: 'GEMINI_API_KEY nao configurada no servidor.' });
  }

  // Extrai o path de múltiplas formas possíveis que o Vercel pode usar
  let pathSegments = req.query.path || req.query['...path'];
  
  // Se não encontrou via query, tenta extrair da URL diretamente
  if (!pathSegments) {
    const urlPath = req.url || '';
    const match = urlPath.match(/\/api\/ai\/(.*?)(\?|$)/);
    if (match && match[1]) {
      pathSegments = match[1].split('/');
    }
  }

  const pathStr = Array.isArray(pathSegments)
    ? pathSegments.join('/')
    : (typeof pathSegments === 'string' ? pathSegments : '');

  if (!pathStr) {
    console.error('[AI Proxy] Path nao encontrado. query:', JSON.stringify(req.query), 'url:', req.url);
    return res.status(400).json({ error: 'Nenhum path fornecido', query: req.query, url: req.url });
  }

  // Remove query string do pathStr se vier junto
  const cleanPath = pathStr.split('?')[0];
  const googleUrl = `https://generativelanguage.googleapis.com/${cleanPath}`;

  console.log('[AI Proxy] Encaminhando para:', googleUrl);

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
      console.error('[AI Proxy] Erro Google:', response.status, JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[AI Proxy] Erro:', error.message);
    return res.status(500).json({ error: 'Falha ao conectar: ' + error.message });
  }
}
