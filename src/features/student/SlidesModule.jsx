import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Share2, Sparkles, ChevronRight, ChevronLeft,
  Cpu, BookOpen, Briefcase, Heart, Leaf, Users, FlaskConical,
  Globe, Search, AlertCircle, Play, X, Trash2
} from 'lucide-react';
import { findTopic, TOPIC_EXAMPLES } from '../../data/knowledgeBase';

// ─── THEMES ───────────────────────────────────────────────────────────────────
const CATEGORY_THEMES = {
  história:    { gradient: 'linear-gradient(135deg, #3c1053, #1a0533, #2d1b69)', accent: '#c084fc', icon: Users },
  biologia:    { gradient: 'linear-gradient(135deg, #093028, #237a57, #0f5132)', accent: '#10b981', icon: Leaf },
  física:      { gradient: 'linear-gradient(135deg, #0d0d2b, #1a1a4a, #003366)', accent: '#38bdf8', icon: FlaskConical },
  astronomia:  { gradient: 'linear-gradient(135deg, #0a0a1a, #1a0a2e, #0f0c29)', accent: '#a78bfa', icon: Globe },
  química:     { gradient: 'linear-gradient(135deg, #1a0f00, #3d1f00, #1a3a1a)', accent: '#f59e0b', icon: FlaskConical },
  geografia:   { gradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', accent: '#06b6d4', icon: Globe },
  tecnologia:  { gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', accent: '#7c3aed', icon: Cpu },
  filosofia:   { gradient: 'linear-gradient(135deg, #1a0533, #2d1b69, #1a2a4a)', accent: '#f43f5e', icon: BookOpen },
  matemática:  { gradient: 'linear-gradient(135deg, #0f172a, #1e3a5f, #0f2744)', accent: '#f472b6', icon: Globe },
  literatura:  { gradient: 'linear-gradient(135deg, #1c0a00, #3b1a00, #1a0f00)', accent: '#fb923c', icon: BookOpen },
  default:     { gradient: 'linear-gradient(135deg, #1e1e2e, #2d2d4e)', accent: '#6366f1', icon: Globe },
};
const getTheme = (cat) => CATEGORY_THEMES[cat] || CATEGORY_THEMES.default;

// ─── ANIMATED BACKGROUND ──────────────────────────────────────────────────────
const AnimatedBackground = ({ accent, gradient }) => {
  // Gera posições estáticas para as partículas (não mudam no re-render)
  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
    }))
  ).current;

  const orbs = useRef([
    { x: 75, y: 15, size: 320, duration: 12, delay: 0 },
    { x: 10, y: 70, size: 260, duration: 16, delay: 3 },
    { x: 55, y: 85, size: 190, duration: 10, delay: 1.5 },
    { x: 90, y: 50, size: 140, duration: 14, delay: 2 },
  ]).current;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Base gradient */}
      <div style={{ position: 'absolute', inset: 0, background: gradient }} />

      {/* Animated orbs */}
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${orb.x}%`, top: `${orb.y}%`,
          width: orb.size, height: orb.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}35 0%, ${accent}08 60%, transparent 80%)`,
          transform: 'translate(-50%, -50%)',
          animation: `orbFloat${i % 3} ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
          filter: `blur(${i === 0 ? 20 : i === 1 ? 16 : 12}px)`,
        }} />
      ))}

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(${accent}12 1px, transparent 1px),
          linear-gradient(90deg, ${accent}12 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridPulse 6s ease-in-out infinite',
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${accent}30 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
        backgroundPosition: '15px 15px',
        opacity: 0.6,
      }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: accent,
          opacity: 0.25,
          animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          boxShadow: `0 0 ${p.size * 3}px ${accent}`,
        }} />
      ))}

      {/* Diagonal light sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, transparent 30%, ${accent}06 50%, transparent 70%)`,
        animation: 'lightSweep 8s linear infinite',
        backgroundSize: '200% 200%',
      }} />

      {/* Corner vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
        opacity: 0.8,
        animation: 'lineGlow 3s ease-in-out infinite',
        boxShadow: `0 0 20px ${accent}`,
      }} />

      {/* Geometric shapes */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} xmlns="http://www.w3.org/2000/svg">
        <circle cx="85%" cy="20%" r="80" stroke={accent} strokeWidth="1" fill="none"
          style={{ animation: 'rotateSvg 20s linear infinite', transformOrigin: '85% 20%' }} />
        <circle cx="85%" cy="20%" r="120" stroke={accent} strokeWidth="0.5" fill="none"
          style={{ animation: 'rotateSvg 30s linear infinite reverse', transformOrigin: '85% 20%' }} />
        <polygon points="10%,75% 18%,60% 26%,75%" stroke={accent} strokeWidth="1" fill="none"
          style={{ animation: 'rotateSvg 15s linear infinite', transformOrigin: '18% 68%' }} />
        <rect x="45%" y="5%" width="60" height="60" rx="8" stroke={accent} strokeWidth="0.8" fill="none"
          style={{ animation: 'rotateSvg 25s linear infinite', transformOrigin: '48% 8%' }} />
      </svg>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes orbFloat0 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.2) translateY(-20px); opacity: 1; }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
          33% { transform: translate(-50%, -50%) scale(0.9) translateX(15px); opacity: 0.8; }
          66% { transform: translate(-50%, -50%) scale(1.2) translateX(-10px); opacity: 0.6; }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.3) translateY(15px); opacity: 0.9; }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          25% { transform: translate(8px, -12px); opacity: 0.4; }
          50% { transform: translate(-6px, -20px); opacity: 0.25; }
          75% { transform: translate(10px, -8px); opacity: 0.35; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes lightSweep {
          0% { background-position: -100% -100%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes lineGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes rotateSvg {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

// ─── SLIDE RENDERERS ──────────────────────────────────────────────────────────
const SlideRenderer = ({ slide, accent }) => {
  if (slide.type === 'intro') return (
    <div style={{ textAlign: 'center', padding: '50px 60px', width: '100%', position: 'relative', zIndex: 2 }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${accent}25`, border: `1px solid ${accent}60`, padding: '8px 20px', borderRadius: '100px', marginBottom: '28px', backdropFilter: 'blur(16px)' }}>
          <span style={{ color: accent, fontSize: '0.78rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>{slide.subtitle}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: '900', color: 'white', lineHeight: 1.1, textShadow: `0 4px 30px rgba(0,0,0,0.7), 0 0 60px ${accent}20`, marginBottom: '28px', letterSpacing: '-1px' }}>{slide.title}</h1>
        <div style={{ height: '3px', width: '80px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, margin: '0 auto 28px', borderRadius: '2px', boxShadow: `0 0 20px ${accent}` }} />
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.8, fontWeight: '400', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{slide.intro}</p>
      </motion.div>
    </div>
  );

  if (slide.type === 'bullets') return (
    <div style={{ width: '100%', height: '100%', padding: '44px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p style={{ color: accent, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', marginBottom: '6px', textShadow: `0 0 20px ${accent}` }}>{slide.subtitle}</p>
        <h2 style={{ fontSize: '2.1rem', fontWeight: '900', color: 'white', lineHeight: 1.15, marginBottom: '8px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>{slide.title}</h2>
      </motion.div>
      <div style={{ height: '1px', background: `linear-gradient(90deg, ${accent}, ${accent}40, transparent)`, marginBottom: '24px', boxShadow: `0 0 10px ${accent}40` }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slide.bullets.map((item, idx) => (
          <motion.div key={idx} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + idx * 0.1 }}
            style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', padding: '13px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `4px solid ${accent}`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)` }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `linear-gradient(135deg, ${accent}, ${accent}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '0.75rem', flexShrink: 0, boxShadow: `0 0 10px ${accent}60` }}>{idx + 1}</div>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'conclusion') return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', background: 'linear-gradient(0deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.75) 55%, transparent 100%)', padding: '80px 60px 52px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '36px', background: accent, borderRadius: '2px', boxShadow: `0 0 24px ${accent}, 0 0 8px ${accent}` }} />
          <span style={{ color: accent, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', textShadow: `0 0 10px ${accent}` }}>{slide.title}</span>
        </div>
        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.4rem)', color: 'rgba(255,255,255,0.92)', lineHeight: 1.75, fontWeight: '400', maxWidth: '800px', marginBottom: '36px', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>{slide.conclusion}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accent}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: `0 0 20px ${accent}60` }}>
            <Sparkles size={18} />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '700', fontSize: '0.88rem', margin: 0 }}>DVS IA — Base de Conhecimento Escolar</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>{slide.subtitle}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return null;
};

// ─── MAIN MODULE ──────────────────────────────────────────────────────────────
const SlidesModule = () => {
  const [topic, setTopic] = useState(() => localStorage.getItem('dvs_slide_topic') || '');
  const [slides, setSlides] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dvs_slide_data')) || null; } catch { return null; }
  });
  const [generating, setGenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dvs_slide_theme')) || null; } catch { return null; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dvs_slides_history')) || []; } catch { return []; }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (!slides) return;
      
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (key === 'arrowright' || key === 'd') {
        setCurrentSlide(prev => {
          if (prev < slides.length - 1) return prev + 1;
          if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides]);

  const handleGenerate = (customTopic) => {
    const t = (customTopic || topic).trim();
    if (!t) return;
    setGenerating(true);
    setSlides(null);
    setNotFound(false);
    setCurrentSlide(0);
    setTimeout(() => {
      const data = findTopic(t);
      if (!data) { setNotFound(true); setGenerating(false); return; }
      const theme = getTheme(data.category);
      const newSlides = [
        { type: 'intro',      ...data.slides[0] },
        { type: 'bullets',    ...data.slides[1] },
        { type: 'conclusion', ...data.slides[2] }
      ];
      setActiveTheme(theme);
      setSlides(newSlides);
      
      const newHistoryItem = { id: Date.now(), topic: t, slides: newSlides, theme: theme };
      const updatedHistory = [newHistoryItem, ...history.filter(h => h.topic.toLowerCase() !== t.toLowerCase())];
      setHistory(updatedHistory);
      localStorage.setItem('dvs_slides_history', JSON.stringify(updatedHistory));

      localStorage.setItem('dvs_slide_topic', t);
      localStorage.setItem('dvs_slide_theme', JSON.stringify(theme));
      localStorage.setItem('dvs_slide_data', JSON.stringify(newSlides));
      
      setGenerating(false);
    }, 1600);
  };

  const loadHistoryItem = (item) => {
    setTopic(item.topic);
    setSlides(item.slides);
    setActiveTheme(item.theme);
    setCurrentSlide(0);
    localStorage.setItem('dvs_slide_topic', item.topic);
    localStorage.setItem('dvs_slide_theme', JSON.stringify(item.theme));
    localStorage.setItem('dvs_slide_data', JSON.stringify(item.slides));
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('dvs_slides_history', JSON.stringify(updatedHistory));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (slideRef.current?.requestFullscreen) {
        slideRef.current.requestFullscreen();
      } else if (slideRef.current?.webkitRequestFullscreen) {
        slideRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleSlideClick = (e) => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) return;
    const rect = slideRef.current.getBoundingClientRect();
    const isLeft = e.clientX < rect.left + rect.width / 3;
    if (isLeft) {
      setCurrentSlide(Math.max(0, currentSlide - 1));
    } else {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  };

  const current = slides?.[currentSlide];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>

      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111' }}>Slides com IA</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>Digite o tema escolar e a IA gera uma apresentação com conteúdo real e preciso.</p>
      </div>

      {/* Input */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Search size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input value={topic} onChange={e => { setTopic(e.target.value); setNotFound(false); }}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="Ex: Revolução Industrial, Fotossíntese, Leis de Newton..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1e293b', background: 'transparent', fontWeight: '500' }} />
        <button onClick={() => handleGenerate()} disabled={!topic.trim() || generating}
          style={{ background: topic.trim() ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#e2e8f0', color: topic.trim() ? 'white' : '#94a3b8', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: topic.trim() ? 'pointer' : 'not-allowed', transition: '0.2s', fontSize: '0.9rem', boxShadow: topic.trim() ? '0 4px 14px rgba(124,58,237,0.35)' : 'none', whiteSpace: 'nowrap' }}>
          <Sparkles size={16} /> Gerar Slides
        </button>
      </div>

      {/* Not Found */}
      {notFound && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '18px 22px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontWeight: '800', color: '#92400e', marginBottom: '6px' }}>Tema não encontrado na base de conhecimento</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {TOPIC_EXAMPLES.slice(0, 8).map(ex => (
                <button key={ex} onClick={() => { setTopic(ex); handleGenerate(ex); }}
                  style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Histórico Local */}
      {!generating && !slides && history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '10px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} color="#94a3b8" /> Apresentações Salvas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {history.map(item => (
              <div key={item.id} onClick={() => loadHistoryItem(item)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.theme?.gradient || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1e293b', margin: 0 }}>{item.topic}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>3 Slides Prontos</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                  style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Generating */}
      <AnimatePresence>
        {generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
            <div style={{ position: 'relative', width: '72px', height: '72px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #e0e0e0', borderTopColor: '#7c3aed', animation: 'spin 0.9s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#0ea5e9', animation: 'spin 0.6s linear infinite reverse' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: '800', color: '#111', fontSize: '1.1rem', marginBottom: '6px' }}>Buscando na base de conhecimento...</p>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>Estruturando slides com dados reais e precisos</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slides View */}
      {slides && !generating && activeTheme && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', minHeight: 0 }}>

          {/* Thumbnails */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontWeight: '800', fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>3 Slides</h4>
            {slides.map((s, i) => {
              const labels = ['Introdução', 'Desenvolvimento', 'Conclusão'];
              const isActive = currentSlide === i;
              return (
                <div key={i} onClick={() => setCurrentSlide(i)}
                  style={{ padding: '8px', border: isActive ? `2px solid ${activeTheme.accent}` : '1px solid #e2e8f0', borderRadius: '10px', background: isActive ? `${activeTheme.accent}10` : '#fff', cursor: 'pointer', transition: 'all 0.2s', transform: isActive ? 'scale(1.02)' : 'scale(1)' }}>
                  <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '700' }}>#{i + 1} · {labels[i]}</div>
                  {/* Mini thumbnail with live background */}
                  <div style={{ height: '55px', borderRadius: '7px', background: activeTheme.gradient, position: 'relative', overflow: 'hidden' }}>
                    {/* mini orb */}
                    <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '50px', height: '50px', borderRadius: '50%', background: `radial-gradient(circle, ${activeTheme.accent}50, transparent)`, filter: 'blur(8px)' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${activeTheme.accent}15 1px, transparent 1px), linear-gradient(90deg, ${activeTheme.accent}15 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />
                    <div style={{ position: 'absolute', inset: 0, padding: '6px', display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ borderLeft: `3px solid ${activeTheme.accent}`, paddingLeft: '5px', width: '100%' }}>
                        <b style={{ color: 'white', fontSize: '0.48rem', display: 'block', lineHeight: 1.4, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{s.title}</b>
                      </div>
                    </div>
                    {/* top accent bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: activeTheme.accent, opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
            <button onClick={() => { setSlides(null); setTopic(''); setNotFound(false); localStorage.removeItem('dvs_slide_data'); }}
              style={{ background: 'none', border: '1px dashed #e2e8f0', color: '#94a3b8', borderRadius: '10px', padding: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', marginTop: '4px', textAlign: 'center' }}>
              + Novo tema
            </button>
          </div>

          {/* Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: 0 }}>
            <div onClick={handleSlideClick} id="slide-capture-node" ref={slideRef} style={{ flex: 1, borderRadius: '22px', position: 'relative', overflow: 'hidden', boxShadow: `0 25px 70px -10px rgba(0,0,0,0.6), 0 0 0 1px ${activeTheme.accent}20`, minHeight: 0, cursor: 'pointer' }}>

              {/* ── ANIMATED BACKGROUND ── */}
              <AnimatePresence mode="wait">
                <motion.div key={`bg-${currentSlide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <AnimatedBackground accent={activeTheme.accent} gradient={activeTheme.gradient} />
                </motion.div>
              </AnimatePresence>

              {/* Slide content */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={`c-${currentSlide}`}
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SlideRenderer slide={current} accent={activeTheme.accent} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom badge */}
              <div style={{ position: 'absolute', bottom: '18px', left: '20px', zIndex: 10, padding: '5px 14px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', borderRadius: '100px', color: 'white', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '7px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeTheme.accent, boxShadow: `0 0 10px ${activeTheme.accent}` }} />
                DVS IA Pro · Slide {currentSlide + 1} de {slides.length}
              </div>

              {/* Slide number overlay top-right */}
              <div style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 10, padding: '5px 14px', background: `${activeTheme.accent}25`, backdropFilter: 'blur(12px)', borderRadius: '100px', color: activeTheme.accent, fontSize: '0.7rem', fontWeight: '800', border: `1px solid ${activeTheme.accent}40`, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {['Intro', 'Pontos', 'Conclusão'][currentSlide]}
              </div>

              {/* Sair Fullscreen Button */}
              {isFullscreen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar passar slide
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                  }}
                  style={{
                    position: 'absolute', top: '18px', left: '20px', zIndex: 20,
                    background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(10px)'
                  }}
                >
                  <X size={15} /> Sair
                </button>
              )}
            </div>

            {/* Toolbar */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '7px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '700', color: '#64748b', fontSize: '0.8rem' }}>
                <Share2 size={14} /> Compartilhar
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '7px', borderRadius: '50%', cursor: currentSlide === 0 ? 'not-allowed' : 'pointer', opacity: currentSlide === 0 ? 0.3 : 1 }}>
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontWeight: '800', color: '#1e293b', minWidth: '56px', textAlign: 'center', fontSize: '0.88rem' }}>
                  {currentSlide + 1} <span style={{ color: '#94a3b8' }}>/ {slides.length}</span>
                </span>
                <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '7px', borderRadius: '50%', cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: currentSlide === slides.length - 1 ? 0.3 : 1 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
              <button onClick={toggleFullscreen} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <Play size={15} /> Apresentar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!slides && !generating && !notFound && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#fff', border: '1px dashed #e2e8f0', borderRadius: '20px', textAlign: 'center', padding: '50px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={32} style={{ color: '#d1d5db' }} />
          </div>
          <div>
            <h3 style={{ fontWeight: '800', color: '#374151', fontSize: '1.15rem', marginBottom: '8px' }}>Digite um tema escolar acima</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '380px', lineHeight: 1.6 }}>A IA busca na base de conhecimento e gera 3 slides com informações reais, datas e fatos verificados.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
            {TOPIC_EXAMPLES.slice(0, 6).map(ex => (
              <button key={ex} onClick={() => { setTopic(ex); handleGenerate(ex); }}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SlidesModule;
