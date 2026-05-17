import { FFmpeg } from '@ffmpeg/ffmpeg';
import coreURL from '@ffmpeg/core/dist/umd/ffmpeg-core.js?url';
import wasmURL from '@ffmpeg/core/dist/umd/ffmpeg-core.wasm?url';

let ffmpeg = null;

export const loadFFmpeg = async (onProgress) => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }
  
  if (ffmpeg.loaded) return ffmpeg;
  
  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(progress);
  });
  
  await ffmpeg.load({
    coreURL,
    wasmURL,
  });
  
  return ffmpeg;
};

const getFilterString = (filters) => {
  if (!filters) return 'format=yuv420p';
  
  const b = (filters.brightness - 100) / 100;
  const c = filters.contrast / 100;
  const s = filters.saturate / 100;
  const h = filters.hue || 0;
  const sepia = (filters.sepia || 0) / 100;

  // EQ: brightness, contrast, saturation
  let vf = `eq=brightness=${b}:contrast=${c}:saturation=${s}`;
  
  // Hue
  if (h !== 0) vf += `,hue=h=${h}`;
  
  // Sepia (approximation using colorchannelmixer)
  if (sepia > 0) {
    const r = 1 - (0.607 * sepia);
    const g = 1 - (0.231 * sepia);
    const bl = 1 - (0.869 * sepia);
    vf += `,colorchannelmixer=${r}:.769:.189:0:.349:${g}:.168:0:.272:.534:${bl}`;
  }

  return `${vf},format=yuv420p`;
};

export const generateVideo = async (imageBlob, audioUrl, filters, onProgress) => {
  const fm = await loadFFmpeg(onProgress);
  // Cleanup any stale temp files
  await cleanupFiles(fm, ['input.png', 'audio.mp3', 'out.mp4']);
  
  try {
    const imgData = new Uint8Array(await imageBlob.arrayBuffer());
    await fm.writeFile('input.png', imgData);
    
    const audioData = await fetchAudioData(audioUrl);
    await fm.writeFile('audio.mp3', audioData);
    
    const vf = getFilterString(filters);

    await fm.exec([
      '-loop', '1',
      '-i', 'input.png',
      '-i', 'audio.mp3',
      // scale to even dimensions (required by libx264)
      '-vf', `${vf},scale=trunc(iw/2)*2:trunc(ih/2)*2`,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-t', '15',
      'out.mp4'
    ]);
    
    const data = await fm.readFile('out.mp4');
    const result = new Blob([data.buffer], { type: 'video/mp4' });
    await cleanupFiles(fm, ['input.png', 'audio.mp3', 'out.mp4']);
    return result;
  } catch (error) {
    console.error("FFmpeg Image-to-Video Error:", error);
    await cleanupFiles(fm, ['input.png', 'audio.mp3', 'out.mp4']);
    throw error;
  }
};

export const mixAudioWithVideo = async (videoFile, audioUrl, filters, onProgress) => {
  const fm = await loadFFmpeg(onProgress);
  await cleanupFiles(fm, ['input.mp4', 'audio.mp3', 'out.mp4']);
  
  try {
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    await fm.writeFile('input.mp4', videoData);
    
    const audioData = await fetchAudioData(audioUrl);
    await fm.writeFile('audio.mp3', audioData);
    
    const vf = getFilterString(filters);

    await fm.exec([
      '-i', 'input.mp4',
      '-i', 'audio.mp3',
      '-vf', `${vf},scale=trunc(iw/2)*2:trunc(ih/2)*2`,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-map', '0:v:0',
      '-map', '1:a:0',
      '-shortest',
      'out.mp4'
    ]);
    
    const data = await fm.readFile('out.mp4');
    const result = new Blob([data.buffer], { type: 'video/mp4' });
    await cleanupFiles(fm, ['input.mp4', 'audio.mp3', 'out.mp4']);
    return result;
  } catch (error) {
    console.error("FFmpeg Video-Audio Mix Error:", error);
    await cleanupFiles(fm, ['input.mp4', 'audio.mp3', 'out.mp4']);
    throw error;
  }
};

export const processVideo = async (videoFile, filters, onProgress) => {
  const fm = await loadFFmpeg(onProgress);
  await cleanupFiles(fm, ['input.mp4', 'out.mp4']);
  
  try {
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    await fm.writeFile('input.mp4', videoData);
    
    const vf = getFilterString(filters);

    await fm.exec([
      '-i', 'input.mp4',
      '-vf', `${vf},scale=trunc(iw/2)*2:trunc(ih/2)*2`,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-c:a', 'copy',
      'out.mp4'
    ]);
    
    const data = await fm.readFile('out.mp4');
    const result = new Blob([data.buffer], { type: 'video/mp4' });
    await cleanupFiles(fm, ['input.mp4', 'out.mp4']);
    return result;
  } catch (error) {
    console.error("FFmpeg Video Process Error:", error);
    await cleanupFiles(fm, ['input.mp4', 'out.mp4']);
    throw error;
  }
};

export async function fetchWithProxy(url) {
  const isSupabaseUrl = url.includes('supabase.co/storage');

  // Supabase public storage — try direct first (no CORS issues)
  if (isSupabaseUrl) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        if (buffer.byteLength > 100) return new Uint8Array(buffer);
      }
    } catch (e) {
      console.warn('Direct Supabase fetch failed, trying proxy:', e.message);
    }
  }

  const proxies = [
    (u) => u,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
    (u) => `https://cors-anywhere.herokuapp.com/${u}`,
  ];

  for (const proxyFn of proxies) {
    try {
      const res = await fetch(proxyFn(url));
      if (!res.ok) throw new Error("HTTP " + res.status);
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 100) throw new Error("Empty buffer");
      const arr = new Uint8Array(buffer);
      // Verifica se o proxy retornou uma página HTML (começando com '<')
      if (arr[0] === 0x3C) throw new Error("O servidor proxy bloqueou o download do áudio.");
      return arr;
    } catch (e) {
      console.warn(`Proxy failed for ${url}:`, e.message);
    }
  }
  throw new Error("Não foi possível carregar o arquivo de áudio.");
}

async function fetchAudioData(url) {
  return fetchWithProxy(url);
}

async function cleanupFiles(fm, files) {
  for (const f of files) {
    try { await fm.deleteFile(f); } catch(_) {}
  }
}
