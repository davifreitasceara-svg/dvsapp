import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

export const loadFFmpeg = async (onProgress) => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }
  
  if (ffmpeg.loaded) return ffmpeg;
  
  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(progress);
  });
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
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
  try {
    const fm = await loadFFmpeg(onProgress);
    
    const imgData = new Uint8Array(await imageBlob.arrayBuffer());
    await fm.writeFile('input.png', imgData);
    
    const audioData = await fetchAudioData(audioUrl);
    await fm.writeFile('audio.m4a', audioData);
    
    const vf = getFilterString(filters);

    await fm.exec([
      '-loop', '1',
      '-i', 'input.png',
      '-i', 'audio.m4a',
      '-vf', vf,
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
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error("FFmpeg Image-to-Video Error:", error);
    throw error;
  }
};

export const mixAudioWithVideo = async (videoFile, audioUrl, filters, onProgress) => {
  try {
    const fm = await loadFFmpeg(onProgress);
    
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    await fm.writeFile('input.mp4', videoData);
    
    const audioData = await fetchAudioData(audioUrl);
    await fm.writeFile('audio.m4a', audioData);
    
    const vf = getFilterString(filters);

    await fm.exec([
      '-i', 'input.mp4',
      '-i', 'audio.m4a',
      '-vf', vf,
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
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error("FFmpeg Video-Audio Mix Error:", error);
    throw error;
  }
};

export const processVideo = async (videoFile, filters, onProgress) => {
  try {
    const fm = await loadFFmpeg(onProgress);
    
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    await fm.writeFile('input.mp4', videoData);
    
    const vf = getFilterString(filters);

    await fm.exec([
      '-i', 'input.mp4',
      '-vf', vf,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-c:a', 'copy',
      'out.mp4'
    ]);
    
    const data = await fm.readFile('out.mp4');
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error("FFmpeg Video Process Error:", error);
    throw error;
  }
};

export async function fetchWithProxy(url) {
  const proxies = [
    (u) => u,
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];

  for (const proxyFn of proxies) {
    try {
      const res = await fetch(proxyFn(url));
      if (!res.ok) throw new Error("HTTP " + res.status);
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 100) throw new Error("Empty buffer");
      return new Uint8Array(buffer);
    } catch (e) {
      console.warn(`Proxy failed for ${url}:`, e.message);
    }
  }
  throw new Error("Não foi possível carregar o arquivo.");
}

async function fetchAudioData(url) {
  return fetchWithProxy(url);
}

