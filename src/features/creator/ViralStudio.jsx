import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import {
  Upload, Sparkles, Music2, FileText, Zap, Download,
  CheckCircle2, RotateCcw, TrendingUp, Share2, Copy,
  RefreshCw, Layers, Sun, Award, Sliders, ArrowUpCircle,
  ImagePlus, Scissors, Play, Pause, SkipForward, X
} from 'lucide-react';

// ─────────────── CONSTANTS ───────────────
const STORAGE_KEY = 'dvs-creator-projects';

const AI_STEPS = [
  { icon: Sun,        label: 'Melhorando Qualidade',    detail: 'Aumentando nitidez, ajustando brilho e contraste...' },
  { icon: Layers,     label: 'Calibrando Estilo',       detail: 'Calculando paleta de cores otimizada...' },
  { icon: Scissors,   label: 'Detectando Cortes',       detail: 'Identificando momentos de maior impacto...' },
  { icon: Music2,     label: 'Analisando Energia',      detail: 'Classificando clima emocional do conteúdo...' },
  { icon: TrendingUp, label: 'Sincronizando Tendências',detail: 'Cruzando com dados de viralização em tempo real...' },
  { icon: FileText,   label: 'Gerando Copy AI',         detail: 'Construindo hook de alto impacto com NLP...' },
  { icon: Award,      label: 'Score de Viralização',    detail: 'Calculando probabilidade de alcance orgânico...' },
];

const STYLES = [
  {
    id: 'profissional',
    label: 'Profissional',
    desc: 'Tom corporativo e limpo',
    filter: 'contrast(1.08) saturate(0.85) brightness(1.04)',
    canvasFilter: 'contrast(1.08) saturate(0.85) brightness(1.04)',
  },
  {
    id: 'aesthetic',
    label: 'Aesthetic',
    desc: 'Cores suaves e vintage',
    filter: 'saturate(1.25) contrast(0.92) brightness(1.08) sepia(0.12)',
    canvasFilter: 'saturate(1.25) contrast(0.92) brightness(1.08) sepia(0.12)',
  },
  {
    id: 'venda',
    label: 'Alto Impacto',
    desc: 'Vibrance e contraste para engajar',
    filter: 'contrast(1.22) saturate(1.45) brightness(1.08)',
    canvasFilter: 'contrast(1.22) saturate(1.45) brightness(1.08)',
  },
  {
    id: 'moderno',
    label: 'Moderno',
    desc: 'Équilibre escuro e futurista',
    filter: 'contrast(1.12) saturate(1.1) brightness(0.94) hue-rotate(-8deg)',
    canvasFilter: 'contrast(1.12) saturate(1.1) brightness(0.94) hue-rotate(-8deg)',
  },
  {
    id: 'cinema',
    label: 'Cinemático',
    desc: 'Tons quentes de filme',
    filter: 'sepia(0.3) contrast(1.15) saturate(1.2) brightness(0.96)',
    canvasFilter: 'sepia(0.3) contrast(1.15) saturate(1.2) brightness(0.96)',
  },
  {
    id: 'bw',
    label: 'P&B Editorial',
    desc: 'Preto e branco de alto contraste',
    filter: 'grayscale(1) contrast(1.3) brightness(1.05)',
    canvasFilter: 'grayscale(1) contrast(1.3) brightness(1.05)',
  },
];

const PLATFORMS = [
  { id: 'reels',   label: 'Reels',   ratio: '9:16', w: 1080, h: 1920 },
  { id: 'tiktok',  label: 'TikTok',  ratio: '9:16', w: 1080, h: 1920 },
  { id: 'shorts',  label: 'Shorts',  ratio: '9:16', w: 1080, h: 1920 },
  { id: 'feed',    label: 'Feed',    ratio: '1:1',  w: 1080, h: 1080 },
  { id: 'stories', label: 'Stories', ratio: '9:16', w: 1080, h: 1920 },
];

// Removendo MUSIC_TRACKS para usar iTunes API real.

const AI_ENHANCEMENTS = [
  { id: 'hd', label: 'Resolução HD/4K', icon: ArrowUpCircle, desc: 'Upscaling suave baseado na nuvem' },
  { id: 'color', label: 'Grade de Cores Pro', icon: Sparkles, desc: 'Balanço perfeito de branco e saturação' },
  { id: 'noise', label: 'Redução de Ruído', icon: Sliders, desc: 'Remove grânulos visuais indesejados' },
  { id: 'fps', label: 'Interpolação 60FPS', icon: Zap, desc: 'Frame blending para suavidade extra' },
];

const CAPTION_TEMPLATES = {
  profissional: {
    hook: 'Você está perdendo dinheiro por não saber isso.',
    body: '73% dos profissionais cometem esse erro todos os dias.\n\nDepois de 5 anos estudando o mercado, aprendi 3 coisas que ninguém te conta:\n\n1. Consistência bate talento\n2. O posicionamento vale mais que o produto\n3. Quem não aparece, não vende\n\nSalva esse conteúdo antes de fechar.',
    cta: '💬 Qual desses você já aplica? Comenta abaixo.',
    hashtags: '#marketing #empreendedorismo #negócios #sucesso #dicas #produtividade #br',
  },
  aesthetic: {
    hook: 'Às vezes você precisa parar para se encontrar.',
    body: 'A vida não é sobre ter tudo perfeito.\nÉ sobre encontrar beleza nas imperfeições.\n\nEste momento que parece irrelevante agora,\nserá exatamente o que você vai querer de volta um dia.\n\nPresença é o maior luxo que existe.',
    cta: '✨ Salva aqui se isso tocou você.',
    hashtags: '#aesthetic #lifestyle #mindset #inspiration #contentcreator #brasil #fyp',
  },
  venda: {
    hook: '⚠️ ÚLTIMO DIA. Não deixe pra amanhã.',
    body: 'Você ainda está esperando o momento certo?\n\nO momento certo É AGORA.\n\n✅ Resultado comprovado por +2.000 clientes\n✅ Suporte exclusivo incluso\n✅ Garantia de 30 dias\n✅ Acesso imediato após a compra\n\nVaga por tempo limitado. Depois disso, o preço dobra.',
    cta: '👇 Link na BIO. Clica agora antes de fechar.',
    hashtags: '#venda #promocao #oferta #produto #ecommerce #empreender #lucro #oportunidade',
  },
  moderno: {
    hook: 'O futuro pertence a quem se prepara hoje.',
    body: 'O mercado mudou.\nNão tem mais espaço para quem só observa.\n\nEnquanto você hesita,\nalguém está construindo o que você sonha.\n\nA diferença entre onde você está\ne onde quer chegar?\nUma decisão.',
    cta: '⚡ Segue pra mais conteúdo que transforma.',
    hashtags: '#tendência #inovação #tecnologia #futuro #viral #trending #growth',
  },
  cinema: {
    hook: 'Tem cenas que ficam registradas pra sempre.',
    body: 'Não porque eram perfeitas.\nMas porque eram autênticas.\n\nA câmera não capta o momento.\nEla capta a emoção.\n\nO que você quer que as pessoas sintam\nquando te veem?',
    cta: '🎬 Marca alguém que precisa ver isso.',
    hashtags: '#cinema #fotografia #arte #criativo #lifestyle #aesthetic #brasil',
  },
  bw: {
    hook: 'Às vezes o preto e branco diz mais que qualquer cor.',
    body: 'Quando você retira o ruído visual,\no que sobra é o que importa de verdade.\n\nO olhar.\nA postura.\nA história.\n\nSimplicidade é sofisticação.',
    cta: '🤍 Deixa um ❤️ se você concorda.',
    hashtags: '#blackandwhite #editorial #fotografia #arte #moda #brasil #aesthetic',
  },
};

// ─────────────── STORAGE UTILS ───────────────
const loadProjects = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

const saveProject = (proj) => {
  try {
    const projects = loadProjects();
    const updated = [proj, ...projects.filter(p => p.id !== proj.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};

const createThumbnail = (file) => new Promise((resolve) => {
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.onload = () => {
    const size = 160;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const min = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - min) / 2;
    const sy = (img.naturalHeight - min) / 2;
    ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
    resolve(canvas.toDataURL('image/jpeg', 0.7));
  };
  img.src = URL.createObjectURL(file);
});

// ─────────────── CANVAS DOWNLOAD ───────────────
const downloadImageWithFilter = async (file, filterStr, filename, ratioStr = '9:16') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const [rw, rh] = ratioStr.split(':').map(Number);
      const targetAspect = rw / rh;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      
      let finalW = img.naturalWidth;
      let finalH = img.naturalHeight;
      
      if (imgAspect > targetAspect) {
        finalW = finalH * targetAspect;
      } else {
        finalH = finalW / targetAspect;
      }
      
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d');
      ctx.filter = filterStr;
      
      const srcX = (img.naturalWidth - finalW) / 2;
      const srcY = (img.naturalHeight - finalH) / 2;
      
      ctx.drawImage(img, srcX, srcY, finalW, finalH, 0, 0, finalW, finalH);
      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/jpeg', 0.95);
    };
    img.onerror = reject;
    img.src = url;
  });
};

// ─────────────── RHYTHM BARS ───────────────
const RhythmBars = ({ active, color = '#8b5cf6', size = 'sm' }) => {
  const h = size === 'sm' ? 20 : 28;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: `${h}px` }}>
      {[1,2,3,4,5,6].map((i) => (
        <div key={i} style={{
          width: size === 'sm' ? '3px' : '4px',
          height: '100%',
          background: color,
          borderRadius: '2px',
          transformOrigin: 'bottom',
          animation: active
            ? `rhythm-pulse ${0.4 + i * 0.1}s ${i * 0.06}s ease-in-out infinite alternate`
            : 'none',
          transform: active ? 'scaleY(1)' : 'scaleY(0.2)',
          opacity: active ? 1 : 0.3,
          transition: 'transform 0.3s, opacity 0.3s',
        }} />
      ))}
    </div>
  );
};

// ─────────────── VIRAL SCORE ───────────────
const ViralScore = ({ score }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  
  // Dynamic Aura Color
  const color = score >= 90 ? '#f59e0b' : score >= 75 ? '#7c3aed' : '#3b82f6';
  const glowClass = score >= 90 ? 'icon-glow-orange' : score >= 75 ? 'icon-glow-purple' : 'icon-glow-blue';
  const label = score >= 90 ? 'ALTO IMPACTO' : score >= 70 ? 'VIRAL READY' : 'OTIMIZANDO';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
        {/* Pulsing Aura */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ 
            position: 'absolute', inset: '-5px', borderRadius: '50%', 
            background: color, filter: 'blur(15px)', zIndex: 0 
          }}
        />
        
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.3s ease, stroke 0.4s' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <span className="shimmer-text" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111', lineHeight: 1 }}>{score}%</span>
        </div>
      </div>
      <div>
        <p style={{ fontWeight: '900', fontSize: '1rem', color: '#111', marginBottom: '4px', letterSpacing: '-0.3px' }}>{label}</p>
        <p style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', lineHeight: 1.4 }}>
          {score >= 90
            ? 'Conteúdo impecável. A probabilidade de viralização orgânica é máxima.'
            : score >= 70
              ? 'Ótimo potencial. Combine com uma música "Hot" para explodir.'
              : 'Estamos refinando os metadados para aumentar o alcance.'}
        </p>
      </div>
    </div>
  );
};

// ─────────────── UPLOAD ZONE ───────────────
const UploadZone = ({ onFileAccepted }) => {
  const onDrop = useCallback((files) => {
    if (files[0]) onFileAccepted(files[0]);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '40px 0', minHeight: '80vh', justifyContent: 'center' }}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="icon-glow-purple"
          style={{
            width: '80px', height: '80px', borderRadius: '24px',
            background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4)',
          }}
        >
          <Scissors size={38} color="white" strokeWidth={2.5} />
        </motion.div>
        <h2 className="shimmer-text" style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1.5px' }}>
          Viral Studio
        </h2>
        <p style={{ color: '#666', fontSize: '1rem', fontWeight: '600', opacity: 0.8 }}>
          Envie sua mídia. A IA edita, adiciona música e viraliza seu conteúdo.
        </p>
      </div>

      <div {...getRootProps()} className="glass-panel-creator" style={{
        width: '100%', maxWidth: '580px', minHeight: '280px',
        border: `2px dashed ${isDragActive ? '#7c3aed' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '32px',
        background: isDragActive ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255,255,255,0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '20px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDragActive ? '0 30px 60px rgba(124, 58, 237, 0.15)' : '0 10px 30px rgba(0,0,0,0.03)',
      }}>
        <input {...getInputProps()} />
        <motion.div 
          animate={isDragActive ? { scale: 1.2, rotate: 180 } : {}}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: isDragActive ? '#7c3aed' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          }}
        >
          <Upload size={28} color={isDragActive ? 'white' : '#7c3aed'} />
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: '800', color: '#111', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
            {isDragActive ? 'Solte para Iniciar o Scan' : 'Arraste ou clique para enviar'}
          </p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '6px', fontWeight: '600' }}>
            MP4, MOV, JPG, PNG — Alta Qualidade
          </p>
        </div>
        <button style={{
          padding: '12px 32px', borderRadius: '100px',
          background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
          color: 'white', border: 'none', fontWeight: '800',
          fontSize: '0.9rem', cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
        }}>
          Selecionar Arquivo
        </button>
      </div>

      {/* Modern Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '580px', width: '100%' }}>
        {[
          { icon: <Sliders size={18} />, text: 'Edição Studio' },
          { icon: <Music2 size={18} />, text: 'Sync Musical' },
          { icon: <FileText size={18} />, text: 'Legenda IA' },
          { icon: <TrendingUp size={18} />, text: 'Score Viral' },
          { icon: <Sparkles size={18} />, text: 'Efeitos Pro' },
          { icon: <Download size={18} />, text: 'Export 4K' },
        ].map((f, i) => (
          <div key={i} className="glass-panel-creator" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            borderRadius: '16px', padding: '14px',
            fontSize: '0.8rem', fontWeight: '800', color: '#333',
            border: '1px solid rgba(255,255,255,0.6)'
          }}>
            <span style={{ color: '#7c3aed', filter: 'drop-shadow(0 0 5px rgba(124,58,237,0.3))' }}>{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────── PROCESSING ───────────────
const ProcessingScreen = ({ file, onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const isVideo = file.type.startsWith('video/');
  const previewUrl = useRef(URL.createObjectURL(file)).current;

  useEffect(() => {
    const total = 5000;
    const stepTime = total / AI_STEPS.length;
    let s = 0;
    const si = setInterval(() => { s++; setStep(s); if (s >= AI_STEPS.length) clearInterval(si); }, stepTime);
    const pi = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(pi); return 100; } return p + 0.8; }), total / 125);
    const done = setTimeout(onComplete, total + 800);
    return () => { clearInterval(si); clearInterval(pi); clearTimeout(done); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '40px 0', minHeight: '80vh', justifyContent: 'center' }}
    >
      {/* Immersive Scan Preview */}
      <div className="glass-panel-creator" style={{ 
        position: 'relative', width: '280px', height: '380px', borderRadius: '32px', 
        overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
        border: '4px solid rgba(255,255,255,0.5)'
      }}>
        {isVideo
          ? <video src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted autoPlay loop />
          : <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        }
        
        {/* Holographic Scan Line */}
        <motion.div
          animate={{ top: ['0%', '100%'], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ 
            position: 'absolute', left: 0, right: 0, height: '60px', 
            background: 'linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.4), transparent)', 
            borderBottom: '2px solid #7c3aed',
            boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
            top: 0, zIndex: 10
          }}
        />
        
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(124, 58, 237, 0.1)', mixBlendMode: 'overlay' }} />
      </div>

      {/* High-Tech Progress Info */}
      <div style={{ textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ fontWeight: '900', fontSize: '1.4rem', color: '#111', marginBottom: '8px', letterSpacing: '-0.5px' }}
          >
            {step < AI_STEPS.length ? AI_STEPS[step].label : 'Mídia Sincronizada!'}
          </motion.p>
        </AnimatePresence>
        <motion.p key={`detail-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontSize: '0.9rem', color: '#666', fontWeight: '600' }}
        >
          {step < AI_STEPS.length ? AI_STEPS[step].detail : 'Iniciando estúdio criativo...'}
        </motion.p>
      </div>

      {/* Premium Progress Bar */}
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', fontWeight: '800' }}>
          <span style={{ color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Processing</span>
          <span className="shimmer-text" style={{ fontSize: '1.1rem' }}>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="glass-panel-creator" style={{ height: '10px', borderRadius: '100px', padding: '2px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progress}%` }} style={{
            height: '100%', borderRadius: '100px',
            background: 'linear-gradient(90deg, #7c3aed, #d946ef, #2563eb)',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)'
          }} transition={{ ease: 'linear' }} />
        </div>
      </div>

      {/* Steps Visualization */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '450px' }}>
        {AI_STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <motion.div key={i} animate={{ scale: active ? 1.15 : 1, opacity: active || done ? 1 : 0.4 }} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '58px',
            }}>
              <div className="glass-panel-creator" style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: done ? '#7c3aed' : active ? '#fff' : 'rgba(255,255,255,0.4)',
                border: active ? '2px solid #7c3aed' : '1px solid rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: '0.3s',
                boxShadow: active ? '0 10px 20px rgba(124, 58, 237, 0.2)' : 'none'
              }}>
                {done
                  ? <CheckCircle2 size={20} color="white" />
                  : <Icon size={18} color={active ? '#7c3aed' : '#94a3b8'} />
                }
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ─────────────── STUDIO ───────────────
const StudioView = ({ file, onReset, onSave }) => {
  const [style, setStyle] = useState('moderno');
  const [platform, setPlatform] = useState('reels');
  const [music, setMusic] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryTracks, setLibraryTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const audioRef = useRef(null);
  const [score, setScore] = useState(70);
  const [templateStyle, setTemplateStyle] = useState('moderno');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [hook, setHook] = useState('');
  const [maxed, setMaxed] = useState(false);
  const [isMaxing, setIsMaxing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [enhancements, setEnhancements] = useState(['hd', 'color']);
  const isVideo = file.type.startsWith('video/');
  const previewUrl = useRef(URL.createObjectURL(file)).current;

  const SCORE_MAP = { profissional: 68, aesthetic: 74, venda: 82, moderno: 71, cinema: 76, bw: 65 };

  const toggleEnhancement = (id) => {
    setEnhancements(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const applyStyle = useCallback((styleId, boosted = false) => {
    const t = CAPTION_TEMPLATES[styleId] || CAPTION_TEMPLATES.moderno;
    setHook(t.hook);
    setCaption(t.body);
    setHashtags(t.hashtags + (boosted ? ' #fyp #viral #foryoupage #trending #explorepage' : ''));
    const base = SCORE_MAP[styleId] ?? 70;
    setScore(boosted ? Math.min(98, base + 22) : base);
  }, []);

  useEffect(() => { applyStyle('moderno'); }, []);

  // Inicializar o elemento de áudio e buscar Top Hits
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;

    fetch('https://itunes.apple.com/search?term=tiktok+hits+2024&entity=song&limit=50')
      .then(r => r.json())
      .then(data => {
        const tracks = data.results.map((r, i) => ({
          id: r.trackId.toString(),
          name: r.trackName,
          artist: r.artistName,
          bpm: 100 + (r.trackId % 30),
          previewUrl: r.previewUrl,
          category: i < 15 ? 'Em Alta Global' : i < 35 ? 'Para Você' : 'Recomendadas'
        }));
        setLibraryTracks(tracks);
        if (tracks.length > 0) setMusic(tracks[0].id);
      }).catch(e => console.error('Erro na API iTunes', e));

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Busca do iTunes API em tempo real
  useEffect(() => {
    if (searchQuery.trim().length <= 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=200`);
        const data = await res.json();
        setSearchResults(data.results.map(r => ({
          id: r.trackId.toString(),
          name: r.trackName,
          artist: r.artistName,
          bpm: 100 + (r.trackId % 30),
          previewUrl: r.previewUrl,
          category: 'Resultados da Busca'
        })));
      } catch (e) { console.error('iTunes search failed:', e); }
      finally { setIsSearching(false); }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allTracks = searchQuery.trim().length > 2 ? searchResults : libraryTracks;
  const currentMusic = [...libraryTracks, ...searchResults].find(t => t.id === music);
  const getCategories = () => [...new Set(allTracks.map(t => t.category))];

  // Controlar o playback
  useEffect(() => {
    if (!audioRef.current || !currentMusic?.previewUrl) return;
    
    if (musicPlaying) {
      if (audioRef.current.src !== currentMusic.previewUrl) {
        audioRef.current.src = currentMusic.previewUrl;
      }
      audioRef.current.play().catch(e => console.error('Play evitado:', e));
    } else {
      audioRef.current.pause();
    }
  }, [music, musicPlaying, currentMusic]);

  const handleStyleChange = (id) => {
    setStyle(id);
    setTemplateStyle(id);
    applyStyle(id, maxed);
  };

  const handleMaximize = () => {
    setIsMaxing(true);
    setTimeout(() => {
      setStyle('venda');
      setTemplateStyle('venda');
      setMusic('pedro');
      setMusicPlaying(true);
      if (isVideo) setEnhancements(['hd', 'noise', 'color', 'fps']);
      else setEnhancements(['hd', 'noise', 'color']);
      applyStyle('venda', true);
      setMaxed(true);
      setIsMaxing(false);
      onSave({ style: 'venda', score: 98, music: 'pedro', maxed: true });
    }, 2400);
  };

  const currentStyleData = STYLES.find(s => s.id === style);
  const currentPlatformData = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
  
  let finalFilter = currentStyleData?.canvasFilter || '';
  if (finalFilter === 'none') finalFilter = '';
  if (enhancements.includes('color')) finalFilter += ' saturate(1.35) hue-rotate(2deg) contrast(1.05)';
  if (enhancements.includes('hd')) finalFilter += ' contrast(1.15) brightness(1.05)';
  if (enhancements.includes('noise')) finalFilter += ' blur(0.3px)';
  if (enhancements.includes('fps') && isVideo) finalFilter += ' drop-shadow(0 0 2px rgba(255,255,255,0.1))'; // Trick
  if (!finalFilter.trim()) finalFilter = 'none';

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (isVideo) {
        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = `dvs-viral-${platform}-${Date.now()}.${file.name.split('.').pop()}`;
        a.click();
      } else {
        await downloadImageWithFilter(
          file,
          finalFilter,
          `dvs-${style}-${platform}-${Date.now()}.jpg`,
          currentPlatformData.ratio
        );
      }
      onSave({ style, score, music, maxed });
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${hook}\n\n${caption}\n\n${hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      className="viral-studio-grid"
      style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', position: 'relative' }}
    >
      {/* ───── LEFT PANEL: VIDEO PREVIEW ───── */}
      <div className="viral-left-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

        {/* Topbar: Unified Search & Action */}
        <div className="glass-panel-creator" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderRadius: '24px' }}>
          <div>
            <h3 style={{ fontWeight: '900', fontSize: '1.2rem', color: '#111', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scissors size={20} className="shimmer-text" /> 
              {file.name.length > 25 ? file.name.substring(0, 25) + '...' : file.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', opacity: 0.7 }}>
              {(file.size / 1024 / 1024).toFixed(1)} MB · {isVideo ? 'Vídeo Studio' : 'Imagem Studio'}
            </p>
          </div>
          <button onClick={onReset} className="glass-panel-creator" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '100px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '800', color: '#333' }}>
            <RotateCcw size={14} /> Novo Projeto
          </button>
        </div>

        {/* Premium Preview Wrapper */}
        <div className="glass-panel-creator" style={{ 
          borderRadius: '32px', overflow: 'hidden', position: 'relative', background: '#000', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
          aspectRatio: currentPlatformData.ratio.replace(':', '/'),
          maxHeight: '520px', width: '100%',
          border: '4px solid rgba(255,255,255,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          {isVideo
            ? <video src={previewUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: finalFilter, transition: 'filter 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            : <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: finalFilter, transition: 'filter 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          }

          {/* Immersive Overlay: Caption & Badges */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '32px',
          }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <p style={{ fontWeight: '900', fontSize: '1.2rem', color: 'white', lineHeight: 1.3, marginBottom: '12px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {hook}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {hashtags.split(' ').slice(0, 5).map(h => (
                  <span key={h} className="shimmer-text" style={{ fontSize: '0.75rem', background: 'rgba(124, 58, 237, 0.3)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontWeight: '800', color: 'white' }}>{h}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Music Status */}
          {musicPlaying && currentMusic && (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', borderRadius: '100px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <RhythmBars active color="#7c3aed" size="sm" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: '#ccc', fontWeight: '700', textTransform: 'uppercase' }}>Now Syncing</span>
                <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: '900' }}>{currentMusic.name}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Style selection: Journey Grid Style */}
        <div className="glass-panel-creator" style={{ padding: '24px', borderRadius: '28px' }}>
          <h2 className="vibrant-gradient-text" style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px', letterSpacing: '-0.5px' }}>💎 Estilo Editorial IA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {STYLES.map(s => (
              <motion.button 
                key={s.id} 
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleStyleChange(s.id)} 
                style={{
                  padding: '12px', borderRadius: '18px', border: `2px solid ${style === s.id ? '#7c3aed' : 'rgba(0,0,0,0.05)'}`,
                  background: style === s.id ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', textAlign: 'left', transition: '0.2s',
                  boxShadow: style === s.id ? '0 10px 20px rgba(124, 58, 237, 0.1)' : 'none'
                }}
              >
                <div style={{ width: '100%', height: '50px', borderRadius: '12px', background: '#000', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #7c3aed, #2563eb)`, filter: s.filter, opacity: 0.8 }} />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#111' }}>{s.label}</p>
                <p style={{ fontSize: '0.65rem', color: '#666', fontWeight: '600', marginTop: '2px' }}>{s.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tool Sections: Platform & Export */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
          <div className="glass-panel-creator" style={{ padding: '20px', borderRadius: '24px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>📱 Destinos de Publicação</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)} style={{
                  padding: '10px 18px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  background: platform === p.id ? '#7c3aed' : 'rgba(0,0,0,0.05)',
                  color: platform === p.id ? 'white' : '#111',
                  fontSize: '0.8rem', fontWeight: '800', transition: '0.2s',
                }}>
                  {p.label} <span style={{ opacity: 0.6, fontSize: '0.6rem' }}>{p.ratio}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-panel-creator" style={{ padding: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <button onClick={handleDownload} disabled={downloading} className="icon-glow-blue" style={{
              width: '100%', padding: '14px', borderRadius: '16px', border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              color: 'white', fontWeight: '900', fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
            }}>
              {downloading ? <RotateCcw className="animate-spin" size={20} /> : <><Download size={20} /> Exportar HD</>}
            </button>
          </div>
        </div>
      </div>

      {/* ───── RIGHT PANEL: AI COMMANDS ───── */}
      <div className="viral-right-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Viral Intelligence */}
        <div className="glass-panel-creator" style={{ padding: '24px', borderRadius: '32px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase', marginBottom: '20px' }}>IA Intelligence</p>
          <ViralScore score={score} />
          
          <div style={{ marginTop: '24px' }}>
            {!maxed ? (
              <motion.button onClick={handleMaximize} disabled={isMaxing}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', padding: '18px', borderRadius: '20px', border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                  color: 'white', fontSize: '1.1rem', fontWeight: '900', cursor: isMaxing ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  boxShadow: '0 15px 35px rgba(124, 58, 237, 0.4)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {isMaxing ? <><RotateCcw className="animate-spin" size={22} /> Sincronizando...</> : <><Zap size={22} /> Maximizar Viral</>}
              </motion.button>
            ) : (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{
                padding: '20px', borderRadius: '20px',
                background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '2px solid #fdba74',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}>
                <Award size={28} color="#ea580c" />
                <div>
                  <p style={{ fontWeight: '900', color: '#9a3412', fontSize: '1rem' }}>Sincronização Elite</p>
                  <p style={{ color: '#c2410c', fontSize: '0.8rem', fontWeight: '600' }}>Score: 98% · Viral Ready</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* AI Caption: Glassy Multi-Row */}
        <div className="glass-panel-creator" style={{ padding: '24px', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>Copy & Legend</p>
            <button onClick={handleCopy} style={{
              background: 'rgba(124, 58, 237, 0.1)', border: 'none',
              padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
              fontSize: '0.75rem', fontWeight: '900', color: '#7c3aed'
            }}>
              {copied ? 'Copiado!' : 'Copiar Tudo'}
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#7c3aed', marginBottom: '6px', textTransform: 'uppercase' }}>Hook Viral</p>
            <input value={hook} onChange={e => setHook(e.target.value)} style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              fontSize: '1rem', fontWeight: '900', color: '#111'
            }} />
          </div>

          <textarea value={caption} onChange={e => setCaption(e.target.value)} style={{
            width: '100%', minHeight: '120px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px',
            padding: '16px', color: '#333', fontSize: '0.9rem', fontWeight: '600', lineHeight: 1.6, resize: 'none', outline: 'none'
          }} />
          
          <textarea value={hashtags} onChange={e => setHashtags(e.target.value)} style={{
            width: '100%', minHeight: '60px', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.1)', borderRadius: '16px',
            padding: '12px', color: '#7c3aed', fontSize: '0.85rem', fontWeight: '800', lineHeight: 1.5, resize: 'none', outline: 'none'
          }} />
        </div>

        {/* Enhancements Grid */}
        <div className="glass-panel-creator" style={{ padding: '24px', borderRadius: '32px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>Melhorias AI Studio</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {AI_ENHANCEMENTS.map(enh => {
              const Icon = enh.icon;
              const active = enhancements.includes(enh.id);
              if (enh.id === 'fps' && !isVideo) return null;
              return (
                <button key={enh.id} onClick={() => toggleEnhancement(enh.id)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px',
                  background: active ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255,255,255,0.4)',
                  border: `2px solid ${active ? '#22c55e' : 'rgba(0,0,0,0.05)'}`,
                  borderRadius: '16px', cursor: 'pointer', transition: '0.2s'
                }}>
                  <Icon size={20} color={active ? '#22c55e' : '#94a3b8'} strokeWidth={2.5} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: active ? '#166534' : '#64748b' }}>{enh.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────── ROOT ───────────────
const ViralStudio = () => {
  const [stage, setStage] = useState('upload');
  const [file, setFile] = useState(null);

  // Mouse tracking for reactive shards
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 35;
    const moveY = (clientY - window.innerHeight / 2) / 35;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setStage('processing');
  }, []);

  const handleComplete = useCallback(() => setStage('studio'), []);
  const handleReset = useCallback(() => { setFile(null); setStage('upload'); }, []);

  const handleSave = useCallback(async (meta) => {
    if (!file) return;
    const thumb = file.type.startsWith('image/')
      ? await createThumbnail(file)
      : null;
    saveProject({
      id: Date.now(),
      name: file.name,
      date: new Date().toLocaleString('pt-BR'),
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      thumb,
      ...meta,
    });
  }, [file]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="creator-vibrant-ambient" 
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', padding: '0' }}
    >
      {/* Immersive Background Shards */}
      <motion.div className="glass-shard" style={{ top: '10%', left: '5%', x: mouseX, y: mouseY, opacity: 0.15, rotate: 15, scale: 1.8 }} />
      <motion.div className="glass-shard" style={{ bottom: '15%', right: '5%', x: mouseX, y: mouseY, opacity: 0.1, rotate: -30, scale: 2.2 }} />
      <motion.div className="glass-shard" style={{ top: '40%', right: '40%', x: mouseX, y: mouseY, opacity: 0.05, rotate: 45, scale: 0.8 }} />
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '24px' }}>
        <AnimatePresence mode="wait">
          {stage === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <UploadZone onFileAccepted={handleFile} />
            </motion.div>
          )}
          {stage === 'processing' && file && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingScreen file={file} onComplete={handleComplete} />
            </motion.div>
          )}
          {stage === 'studio' && file && (
            <motion.div key="studio" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}>
              <StudioView file={file} onReset={handleReset} onSave={handleSave} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViralStudio;
