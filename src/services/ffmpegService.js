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

export const generateVideo = async (imageBlob, audioUrl, onProgress) => {
  try {
    const fm = await loadFFmpeg(onProgress);
    
    // Write image
    const imgData = new Uint8Array(await imageBlob.arrayBuffer());
    await fm.writeFile('image.png', imgData);
    
    // Write audio
    let audioData;
    try {
      // Using a proxy to avoid CORS issues if iTunes blocks it, or try direct fetch first
      const audioRes = await fetch(audioUrl);
      if (!audioRes.ok) throw new Error("Failed response");
      audioData = new Uint8Array(await audioRes.arrayBuffer());
    } catch (e) {
      console.warn("Direct fetch failed, trying with CORS proxy...", e);
      // Fallback to a CORS proxy just in case iTunes preview blocks it
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(audioUrl);
      const audioRes2 = await fetch(proxyUrl);
      audioData = new Uint8Array(await audioRes2.arrayBuffer());
    }
    await fm.writeFile('audio.m4a', audioData);
    
    // Exec FFMPEG command
    // -loop 1: loop the single image
    // -i image.png: input image
    // -i audio.m4a: input audio
    // -c:v libx264: use h264 codec
    // -tune stillimage: optimize for still image
    // -c:a aac: encode audio to aac
    // -b:a 192k: audio bitrate
    // -pix_fmt yuv420p: standard pixel format for social media compatibility
    // -shortest: end video when the shortest input (audio) ends
    // -t 15: maximum duration 15 seconds to make processing fast
    await fm.exec([
      '-loop', '1',
      '-i', 'image.png',
      '-i', 'audio.m4a',
      '-c:v', 'libx264',
      '-tune', 'stillimage',
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
    console.error("FFmpeg Generation Error:", error);
    throw error;
  }
};
