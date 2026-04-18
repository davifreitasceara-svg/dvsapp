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
  Plus, ChevronRight, Settings, Calendar, Disc, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// ─── Creator Dashboard ───
const CreatorDashboard = ({ onNavigate }) => {
  const projects = loadProjects();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Tool Grid */}
      <section>
        <div className="cc-tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '4px' }}>
          {CREATOR_TOOLS.map((tool, i) => {
            const Icon = tool.Icon;
            return (
              <button key={i} className="cc-tool-card" onClick={() => onNavigate(tool.id)}>
                <div style={{ position: 'relative' }}>
                  <div className="cc-icon">
                    <Icon size={22} color="#1a1a1a" strokeWidth={1.6} />
                  </div>
                  {tool.badge && (
                    <span
                      className={tool.badge === 'FREE' ? 'cc-badge-free' : 'cc-badge-pro'}
                      style={{ position: 'absolute', top: -5, right: -5 }}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <span className="cc-label">{tool.label}</span>
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb', marginTop: '8px' }}>
          Pressione e arraste para reordenar
        </p>
      </section>

      {/* New Project Banner */}
      <button className="cc-new-project-banner" onClick={() => onNavigate('viral')}>
        <div className="cc-new-project-icon" style={{ fontSize: '1.6rem', fontWeight: '800', lineHeight: 1 }}>+</div>
        <span className="cc-new-project-text">Novo Projeto</span>
      </button>

      {/* Projects Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111' }}>
            Projetos {projects.length > 0 && <span style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: '500' }}>({projects.length})</span>}
          </h3>
          <button style={{ background: 'none', border: '1px solid #e0e0e0', borderRadius: '100px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', cursor: 'pointer' }}>
            ☁️ Space
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ebebeb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {projects.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Film size={22} color="#ccc" />
              </div>
              <p style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: '600' }}>Nenhum projeto salvo ainda</p>
              <p style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '4px' }}>Crie seu primeiro projeto no Viral Studio</p>
            </div>
          ) : (
            projects.map((project, i) => (
              <React.Fragment key={project.id}>
                <div className="cc-project-item" onClick={() => onNavigate('viral')}>
                  {project.thumb
                    ? <img src={project.thumb} alt="thumb" className="cc-project-thumb" />
                    : <div className="cc-project-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
                        <Film size={20} color="#ccc" />
                      </div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '700', fontSize: '0.88rem', color: '#111', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.name || project.id}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#999' }}>{project.date}</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#ccc' }}>{project.size}</span>
                      {project.maxed && <span style={{ fontSize: '0.65rem', background: '#fef9c3', color: '#b45309', padding: '1px 6px', borderRadius: '100px', fontWeight: '700' }}>VIRAL</span>}
                      {project.score && <span style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: '700' }}>{project.score}% score</span>}
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '8px', flexShrink: 0 }}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                {i < projects.length - 1 && <div style={{ height: '1px', background: '#f6f6f6', marginLeft: '92px' }} />}
              </React.Fragment>
            ))
          )}
        </div>
      </section>
    </motion.div>
  );
};

// ─────────────── CREATOR TOPBAR ───────────────
const CreatorTopBar = ({ currentView }) => {
  const titles = {
    dashboard: 'Home do Criador',
    viral: 'Viral Studio PRO',
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#111' }}>{titles[currentView] || 'Módulo'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ModeToggle />
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a8edea, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>👤</div>
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
  const renderCreatorView = () => {
    switch (currentView) {
      case 'dashboard':
        return <CreatorDashboard onNavigate={setCurrentView} />;
      case 'viral':
        return <ViralStudio />;
      default:
        return <CreatorDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f2f2f2' }}>
      <CreatorTopBar currentView={currentView} />

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
            <div className="hero-v2" style={{ backgroundImage: `url('/src/assets/hero-v2.png')` }}>
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
                
                <button className="glass-pill" style={{ padding: '12px 32px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '1rem', fontWeight: '700', borderRadius: '100px', cursor: 'pointer' }}>
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
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7c3aed', cursor: 'pointer' }}>Ver tudo</span>
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
               <div style={{ padding: '20px', borderRadius: '24px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Globe size={20} color="#3b82f6" />
                  <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>Explorar<br/>Matérias</span>
               </div>
               <div style={{ padding: '20px', borderRadius: '24px', background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Wand2 size={20} color="#d946ef" />
                  <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>Tutor IA<br/>Pro</span>
               </div>
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
