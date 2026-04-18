// Force vite hot module reload
import React, { useState } from 'react';
import { useMode } from '../hooks/useMode';
import ModeToggle from '../components/ModeToggle';
import TranscriptionModule from '../features/student/TranscriptionModule';
import MindMapModule from '../features/student/MindMapModule';
import SlidesModule from '../features/student/SlidesModule';
import SummariesModule from '../features/student/SummariesModule';
import ViralStudio from '../features/creator/ViralStudio';
import {
  Clock, FileText, Home, Layers, Layout, Mic,
  Share2, Target, Video, Menu, X, MoreHorizontal,
  Scissors, TrendingUp, Image, Globe, Camera, Search,
  ShoppingBag, Wand2, Sliders, Monitor,
  Eraser, ArrowUpCircle, Sparkles,
  Film, MessageSquare, PenTool,
  Plus, ChevronRight, Settings, Calendar, Disc, Play,
  MapPin, ArrowRight, Heart, Bell, Trash2
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

const STORAGE_KEY = 'dvs-creator-projects';
const loadProjects = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

// ─── Student placeholder ───
const PlaceholderModule = ({ title, onBack }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
    className="glass-card"
    style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
  >
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
      <Clock size={48} opacity={0.4} />
    </div>
    <h2>{title} em Desenvolvimento</h2>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>Este módulo estará disponível em breve.</p>
    <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-glass)' }} onClick={onBack}>
      Voltar ao Dashboard
    </button>
  </motion.div>
);

// ─── CapCut-style tool definitions ───
const CREATOR_TOOLS = [
  { Icon: Image,         label: 'Editor de Foto',   id: 'viral', badge: null },
  { Icon: Wand2,         label: 'Texto p/ Imagem',  id: 'viral', badge: 'PRO' },
  { Icon: Scissors,      label: 'AutoViral',         id: 'viral', badge: null },
  { Icon: Globe,         label: 'Tradutor AI',       id: 'viral', badge: 'PRO' },
  { Icon: Camera,        label: 'Camera',            id: 'viral', badge: null },
  { Icon: ShoppingBag,   label: 'Produto IA',        id: 'viral', badge: 'PRO' },
  { Icon: PenTool,       label: 'AI Poster',         id: 'viral', badge: 'PRO' },
  { Icon: Sparkles,      label: 'AI Effects',        id: 'viral', badge: 'PRO' },
  { Icon: Film,          label: 'AI Model',          id: 'viral', badge: null },
  { Icon: Sliders,       label: 'Retouch',           id: 'viral', badge: null },
  { Icon: MessageSquare, label: 'Legendas Auto',     id: 'viral', badge: null },
  { Icon: Monitor,       label: 'Teleprompter',      id: 'viral', badge: null },
  { Icon: Eraser,        label: 'Remov. Fundo',      id: 'viral', badge: 'FREE' },
  { Icon: ArrowUpCircle, label: 'Melhorar HD',       id: 'viral', badge: 'FREE' },
  { Icon: TrendingUp,    label: 'Tendências',        id: 'trends', badge: null },
];

const deleteProject = (id) => {
  const projects = JSON.parse(localStorage.getItem('dvs-creator-projects') || '[]');
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem('dvs-creator-projects', JSON.stringify(filtered));
  window.dispatchEvent(new Event('storage'));
};

// ─── Creator Dashboard ───
const CreatorDashboard = ({ onNavigate, showSettings, onToggleSettings }) => {
  const [projects, setProjects] = useState(loadProjects());
  const [settings, setSettings] = useState({
    blur: 24,
    noise: 0.05,
    blobs: 0.15,
    speed: 20,
    theme: 'default'
  });

  // Mouse tracking for reactive shards
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 25;
    const moveY = (clientY - window.innerHeight / 2) / 25;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  // Listen for storage changes to refresh projects
  React.useEffect(() => {
    const handleSync = () => setProjects(loadProjects());
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteProject(id);
    setProjects(loadProjects()); // Immediate local update
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onMouseMove={handleMouseMove}
      className="creator-vibrant-ambient"
      style={{ 
        display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative',
        '--creator-blur': `${settings.blur}px`,
        '--creator-noise': settings.noise,
        '--creator-blob-op': settings.blobs,
        '--creator-speed': `${settings.speed}s`,
      }}
    >
      {/* Visual Customizer Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="glass-panel-creator"
            style={{ 
              position: 'fixed', top: '90px', right: '24px', width: '280px', 
              zIndex: 1000, padding: '24px', borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0, fontWeight: '900', color: '#111' }}>Visual Effects</h4>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setShowSettings(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.6 }}>BLUR INTENSITY</label>
                <input 
                  type="range" min="0" max="64" value={settings.blur} 
                  onChange={(e) => setSettings({...settings, blur: e.target.value})}
                  style={{ width: '100%', marginTop: '8px', accentColor: '#7c3aed' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.6 }}>NOISE GRAIN</label>
                <input 
                  type="range" min="0" max="0.2" step="0.01" value={settings.noise} 
                  onChange={(e) => setSettings({...settings, noise: e.target.value})}
                  style={{ width: '100%', marginTop: '8px', accentColor: '#7c3aed' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.6 }}>BLOBS OPACITY</label>
                <input 
                  type="range" min="0" max="0.5" step="0.01" value={settings.blobs} 
                  onChange={(e) => setSettings({...settings, blobs: e.target.value})}
                  style={{ width: '100%', marginTop: '8px', accentColor: '#7c3aed' }}
                />
              </div>
              <button 
                onClick={() => setSettings({ blur: 24, noise: 0.05, blobs: 0.15, speed: 20, theme: 'default' })}
                style={{ background: '#f4f4f5', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px' }}
              >
                Reset Default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reactive Background Shards */}
      <motion.div className="glass-shard" style={{ top: '20%', left: '10%', x: mouseX, y: mouseY, opacity: 0.3 }} />
      <motion.div className="glass-shard" style={{ top: '60%', right: '15%', x: mouseX, y: mouseY, opacity: 0.2, rotate: -30, scale: 0.7 }} />
      <motion.div className="glass-shard" style={{ bottom: '10%', left: '30%', x: mouseX, y: mouseY, opacity: 0.1, rotate: 15, scale: 0.5 }} />

      {/* Background Ambient Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="creator-ambient-blob" 
        style={{ top: '-100px', right: '-100px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)' }} 
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 0], y: [0, 100, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="creator-ambient-blob" 
        style={{ bottom: '10%', left: '-100px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)' }} 
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Promo Banner */}
        <motion.div 
          whileHover={{ scale: 0.98 }}
          onClick={() => onNavigate('viral')}
          className="creator-promo-banner glass-panel-creator" 
          style={{ background: 'linear-gradient(135deg, rgba(219, 252, 230, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)', marginTop: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="creator-promo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
              <Sparkles size={24} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: '1rem', fontWeight: '800', color: '#065f46' }}>Upgrade para o PRO ✨</p>
              <p style={{ fontSize: '0.85rem', color: '#065f46', opacity: 0.8 }}>Acesso ilimitado a todas as IAs</p>
            </div>
          </div>
          <ArrowRight size={20} color="#065f46" />
        </motion.div>

        {/* Hero Section */}
        <h2 className="creator-section-title vibrant-gradient-text">Minha Jornada Criativa</h2>
        
        <div className="creator-hero-scroll" style={{ paddingBottom: '40px' }}>
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }} 
            className="creator-card-large glass-panel-creator" 
            onClick={() => onNavigate('viral')}
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(124, 58, 237, 0.2)'
            }}
          >
             <div style={{ position: 'absolute', top: '20px', right: '20px' }} className="badge-live">Cinema AI</div>
             <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.15)', position: 'absolute', top: 10, left: 20 }}>VS</div>
             <Video size={52} color="#fff" strokeWidth={2.5} style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }} />
             <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: 1, letterSpacing: '-1px' }}>VIRAL<br/>STUDIO</p>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', marginTop: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>Cinema & Shorts Virais</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }} 
            className="creator-card-large glass-panel-creator" 
            onClick={() => onNavigate('templates')}
            style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)'
            }}
          >
             <div style={{ position: 'absolute', top: '20px', right: '20px' }} className="badge-live" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Editor</div>
             <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.15)', position: 'absolute', top: 10, left: 20 }}>TP</div>
             <Layout size={52} color="#fff" strokeWidth={2.5} style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }} />
             <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: 1, letterSpacing: '-1px' }}>PRO<br/>TEMPLATES</p>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', marginTop: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>Design que Engaja</p>
          </motion.div>
        </div>

        {/* Trending Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
          <h2 className="creator-section-title vibrant-gradient-text" style={{ padding: 0, margin: 0 }}>Ferramentas Populares</h2>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>Ver Todas</span>
        </div>
        
        <div style={{ padding: '20px 24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { label: 'Editor de Foto', color: '#fff', bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: <Image />, glow: 'icon-glow-blue' },
              { label: 'Remover Fundo', color: '#fff', bg: 'linear-gradient(135deg, #d946ef, #a21caf)', icon: <Eraser />, glow: 'icon-glow-purple' },
              { label: 'Upscale IA', color: '#fff', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: <ArrowUpCircle />, glow: 'icon-glow-orange' },
              { label: 'Prompt Maker', color: '#fff', bg: 'linear-gradient(135deg, #10b981, #059669)', icon: <Wand2 />, glow: 'icon-glow-green' },
            ].map((tool, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('viral')}
                className="glass-panel-creator"
                style={{ 
                  padding: '24px 20px', 
                  borderRadius: '28px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '14px', 
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
                }}
              >
                <div className={tool.glow} style={{ width: '52px', height: '52px', borderRadius: '18px', background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tool.color, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                  {React.cloneElement(tool.icon, { size: 26 })}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#000', letterSpacing: '-0.3px' }}>{tool.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div style={{ padding: '0 24px 120px' }}>
          <div className="glass-panel-creator" style={{ padding: '24px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000' }}>Projetos Recentes</h3>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="#000" />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', padding: '20px' }}>Você ainda não tem projetos.</p>
              ) : (
                projects.slice(0, 3).map((project, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div 
                      onClick={() => onNavigate('viral')}
                      style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#f4f4f5', overflow: 'hidden', cursor: 'pointer' }}
                    >
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Film size={24} />
                      </div>
                    </div>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onNavigate('viral')}>
                      <p style={{ fontWeight: '800', fontSize: '1rem', margin: 0 }}>{project.name || 'Projeto Sem Título'}</p>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>{project.date || 'Recém editado'}</p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDelete(e, project.id)}
                      style={{ background: '#fff1f2', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', cursor: 'pointer' }}
                    >
                      <Trash2 size={20} />
                    </motion.button>
                    <ChevronRight size={20} color="#ccc" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────── CREATOR TOPBAR ───────────────
const CreatorTopBar = ({ currentView, onToggleSettings }) => {
  const isDashboard = currentView === 'dashboard';
  
  return (
    <header className="glass-panel-creator" style={{ 
      borderBottom: '1px solid rgba(255,255,255,0.4)', 
      padding: '0 24px', 
      height: '74px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="icon-glow-green" 
          style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}
        >
          <Sparkles size={22} color="#fff" />
        </motion.div>
        <span className="shimmer-text" style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-1px' }}>DVS Creator</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isDashboard && <Sliders size={22} color="#7c3aed" style={{ cursor: 'pointer' }} onClick={onToggleSettings} />}
        <ModeToggle />
        <Bell size={22} color="#7c3aed" style={{ cursor: 'pointer' }} />
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#fff' }}>👤</div>
      </div>
    </header>
  );
};

// ─────────────── STUDENT BOTTOM NAV ───────────────
const StudentBottomNav = ({ currentView, setCurrentView }) => {
  const navItems = [
    { icon: <Home size={20} />, label: 'Início', id: 'dashboard' },
    { icon: <FileText size={20} />, label: 'Resumos', id: 'summaries' },
    { icon: <Layers size={20} />, label: 'Mapas', id: 'mindmaps' },
    { icon: <Layout size={20} />, label: 'Slides', id: 'slides' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: '#fff', border: '1px solid #ebebeb', borderRadius: '100px',
      display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '8px', zIndex: 100,
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
    }}>
      {navItems.map(item => {
        const active = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={{
              background: active ? '#f0f9ff' : 'transparent',
              border: 'none', padding: '10px 16px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              color: active ? '#0ea5e9' : '#666', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem'
            }}
          >
            {item.icon}
            {active && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
};

// ─────────────── STUDENT TOPBAR ───────────────
const StudentTopBar = ({ currentView }) => {
  const isDashboard = currentView === 'dashboard';
  const titles = {
    dashboard: 'EduCreator',
    summaries: 'Meus Resumos',
    mindmaps: 'Mapas Mentais',
    slides: 'Criador de Slides',
    study: 'Modo Estudo',
  };

  return (
    <header 
      style={{ 
        background: isDashboard ? 'transparent' : '#fff', 
        borderBottom: isDashboard ? 'none' : '1px solid #ebebeb', 
        padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        transition: 'background 0.3s',
        position: isDashboard ? 'absolute' : 'relative',
        top: 0, left: 0, right: 0, zIndex: 100
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isDashboard ? '#fff' : '#111' }}>
        {isDashboard && <Wand2 size={24} />}
        <span style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>{titles[currentView] || 'Módulo'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ModeToggle />
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isDashboard ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #a8edea, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: isDashboard ? '#fff' : '#111', border: isDashboard ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>👤</div>
      </div>
    </header>
  );
};

// ─────────────── STUDENT LAYOUT ───────────────
const StudentLayout = ({ currentView, setCurrentView, renderView }) => {
  const isDashboard = currentView === 'dashboard';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: isDashboard ? '#fff' : '#f8f9fa' }}>
      <StudentTopBar currentView={currentView} />
      <main className="cc-main-content" style={{ flex: 1, padding: isDashboard ? '0' : '24px', overflowY: 'auto', width: '100%', margin: '0', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
        <div style={{ height: '100px' }} /> {/* Espaçamento para o Bottom Nav */}
      </main>
      <StudentBottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

// ─────────────── CREATOR BOTTOM NAV ───────────────
const CreatorBottomNav = ({ currentView, setCurrentView }) => {
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', id: 'dashboard' },
    { icon: <Play size={20} />, label: 'Viral', id: 'viral' },
    { icon: <Sparkles size={20} />, label: 'Trend', id: 'trends' },
    { icon: <Layout size={20} />, label: 'Templates', id: 'templates' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: '#fff', border: '1px solid #e8e8e8', borderRadius: '100px',
      display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '8px', zIndex: 100,
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
    }}>
      {navItems.map(item => {
        const active = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={{
              background: active ? '#f5f3ff' : 'transparent',
              border: 'none', padding: '10px 16px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              color: active ? '#7c3aed' : '#666', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem'
            }}
          >
            {item.icon}
            {active && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
};

// ─────────────── CREATOR LAYOUT ───────────────
const CreatorLayout = ({ currentView, setCurrentView }) => {
  const [showSettings, setShowSettings] = useState(false);

  const renderCreatorView = () => {
    switch (currentView) {
      case 'dashboard':
        return <CreatorDashboard onNavigate={setCurrentView} onToggleSettings={() => setShowSettings(!showSettings)} showSettings={showSettings} />;
      case 'viral':
        return <ViralStudio />;
      default:
        return <CreatorDashboard onNavigate={setCurrentView} onToggleSettings={() => setShowSettings(!showSettings)} showSettings={showSettings} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff', position: 'relative' }}>
      <CreatorTopBar currentView={currentView} onToggleSettings={() => setShowSettings(!showSettings)} />

      <main className="cc-main-content" style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        maxWidth: currentView === 'dashboard' ? '860px' : '1400px',
        width: '100%',
        margin: '0 auto',
        position: 'relative'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {renderCreatorView()}
          </motion.div>
        </AnimatePresence>
        <div style={{ height: '100px' }} /> {/* Espaçamento para o Bottom Nav */}
      </main>
      <CreatorBottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

// ─────────────── ROOT LAYOUT ───────────────
const MainLayout = () => {
  const { mode } = useMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  // Reset to dashboard when switching modes
  const prevMode = React.useRef(mode);
  React.useEffect(() => {
    if (prevMode.current !== mode) {
      setCurrentView('dashboard');
      prevMode.current = mode;
    }
  }, [mode]);

  // Sync body background to prevent "dark blue" void if components crash
  React.useEffect(() => {
    if (mode === 'student') {
      document.body.style.background = currentView === 'dashboard' ? '#fff' : '#f8f9fa';
      document.body.style.color = '#111';
    } else {
      document.body.style.background = '#f2f2f2';
      document.body.style.color = '#111';
    }
    // Clean up or ensure it stays synced
    return () => {
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, [mode, currentView]);

  // Student view renderer
  const renderStudentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', width: '100%', background: '#fff' }}>
            
            {/* Hero Section V2 (Estilo Klarna) */}
            <div className="hero-v2 hero-dark-blue">
              <div className="hero-v2-overlay" />
              
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Brand Circle Logo */}
                <div className="hero-v2-logo">
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Sparkles size={24} />
                  </div>
                </div>

                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.9, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Evolua seu Estudo</span>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px', maxWidth: '300px' }}>Onde a IA Cria por Você</h1>
                
                <button 
                  className="glass-pill" 
                  onClick={() => setCurrentView('summaries')}
                  style={{ padding: '12px 32px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '1rem', fontWeight: '700', borderRadius: '100px', cursor: 'pointer' }}
                >
                  Começar Agora
                </button>

                {/* Pagination Dots */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '40px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ width: i === 1 ? '12px' : '6px', height: '6px', borderRadius: '3px', background: i === 1 ? '#fff' : 'rgba(255,255,255,0.4)', transition: '0.3s' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Search Bar */}
            <div className="search-modern">
              <Search size={22} color="#aaa" />
              <input type="text" placeholder="O que você quer aprender hoje?" />
              <Camera size={22} color="#aaa" style={{ cursor: 'pointer' }} />
            </div>

            {/* Featured Modules (Featured Stores Style) */}
            <div style={{ padding: '8px 24px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111' }}>Destaques</h3>
                <span 
                  onClick={() => setCurrentView('summaries')}
                  style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7c3aed', cursor: 'pointer' }}
                >
                  Ver tudo
                </span>
              </div>
            </div>

            <div className="featured-scroll-container">
              <div className="featured-item" onClick={() => setCurrentView('summaries')}>
                <div className="icon-circle" style={{ background: '#f0f9ff' }}>
                  <FileText size={24} color="#38bdf8" />
                </div>
                <span className="label">Resumos</span>
                <span className="badge">Auto-Geração</span>
              </div>

              <div className="featured-item" onClick={() => setCurrentView('mindmaps')}>
                <div className="icon-circle" style={{ background: '#f5f3ff' }}>
                  <Layers size={24} color="#a855f7" />
                </div>
                <span className="label">Mapas</span>
                <span className="badge">Visual-AI</span>
              </div>

              <div className="featured-item" onClick={() => setCurrentView('slides')}>
                <div className="icon-circle" style={{ background: '#ecfdf5' }}>
                  <Layout size={24} color="#10b981" />
                </div>
                <span className="label">Slides</span>
                <span className="badge">Prompt 2 Presentation</span>
              </div>
            </div>

            {/* Explore Grid */}
            <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
               <div 
                 onClick={() => setCurrentView('summaries')}
                 style={{ padding: '20px', borderRadius: '24px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
               >
                  <Globe size={20} color="#3b82f6" />
                  <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>Explorar<br/>Matérias</span>
               </div>
               <div 
                 onClick={() => setCurrentView('summaries')}
                 style={{ padding: '20px', borderRadius: '24px', background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
               >
                  <Wand2 size={20} color="#d946ef" />
                  <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>Tutor IA<br/>Pro</span>
               </div>
            </div>
          </motion.div>
        );
      case 'mindmaps':
        return <MindMapModule />;
      case 'slides':
        return <SlidesModule />;
      case 'summaries':
        return <SummariesModule />;
      default:
        return (
          <PlaceholderModule
            title={currentView}
            onBack={() => setCurrentView('dashboard')}
          />
        );
    }
  };

  if (mode === 'creator') {
    return (
      <div className="layout-container">
        <CreatorLayout
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
    );
  }

  return (
    <div className="layout-container">
      <StudentLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        renderView={renderStudentView}
      />
    </div>
  );
};

export default MainLayout;
