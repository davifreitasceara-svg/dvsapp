import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg = null;

export const loadFFmpeg = async (onProgress) => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }
  
  if (ffmpeg.loaded) return ffmpeg;
  
  ffmpeg.on('progress', ({ progress, time }) => {
    if (onProgress) onProgress(progress);
  });
  
  // In Vite, we can usually just load the default core.
  // The default load() tries to fetch from unpkg, which is fine,
  // but to avoid cross-origin issues with unpkg, we can try to use local if we installed @ffmpeg/core.
  // Using unpkg is simpler if we just call ffmpeg.load({ log: true })
  
  // Let's try loading from unpkg by default, which is what happens if we pass nothing,
  // but we can also pass the coreURL from the installed package.
  await ffmpeg.load({
    log: true
  });
  
  return ffmpeg;
};

export const generateVideo = async (imageBlob, audioUrl, filters, onProgress) => {
  try {
    const fm = await loadFFmpeg(onProgress);
    
    // Write image
    const imgData = new Uint8Array(await imageBlob.arrayBuffer());
    await fm.writeFile('input.png', imgData);
    
    // Write audio
    const audioData = await fetchAudioData(audioUrl);
    await fm.writeFile('audio.m4a', audioData);
    
    // Prepare filters
    let vf = 'loop=loop=1:size=1:start=0';
    if (filters) {
      const b = (filters.brightness - 100) / 100;
      const c = filters.contrast / 100;
      const s = filters.saturate / 100;
      vf = `format=yuv420p,eq=brightness=${b}:contrast=${c}:saturation=${s}`;
    }

    // Exec FFMPEG command
    await fm.exec([
      '-loop', '1',
      '-i', 'input.png',
      '-i', 'audio.m4a',
      '-vf', vf,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-b:a', '192k',
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
    
    // Write video
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    await fm.writeFile('input.mp4', videoData);
    
    // Write audio
    const audioData = await fetchAudioData(audioUrl);
    await fm.writeFile('audio.m4a', audioData);
    
    // Prepare filters
    let vf = 'format=yuv420p';
    if (filters) {
      const b = (filters.brightness - 100) / 100;
      const c = filters.contrast / 100;
      const s = filters.saturate / 100;
      vf = `eq=brightness=${b}:contrast=${c}:saturation=${s},format=yuv420p`;
    }

    // Exec FFMPEG command
    // -map 0:v:0 -> take video from first input
    // -map 1:a:0 -> take audio from second input
    await fm.exec([
      '-i', 'input.mp4',
      '-i', 'audio.m4a',
      '-vf', vf,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-b:a', '192k',
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
    
    // Write video
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    await fm.writeFile('input.mp4', videoData);
    
    // Prepare filters
    let vf = 'format=yuv420p';
    if (filters) {
      const b = (filters.brightness - 100) / 100;
      const c = filters.contrast / 100;
      const s = filters.saturate / 100;
      vf = `eq=brightness=${b}:contrast=${c}:saturation=${s},format=yuv420p`;
    }

    // Exec FFMPEG command
    await fm.exec([
      '-i', 'input.mp4',
      '-vf', vf,
      '-c:v', 'libx264',
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

async function fetchAudioData(url) {
  const proxies = [
    (u) => u, // Direct
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
  throw new Error("Não foi possível carregar o áudio. Verifique sua conexão.");
}

