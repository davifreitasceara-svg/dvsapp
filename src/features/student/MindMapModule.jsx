import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sparkles, Download, ZoomIn, ZoomOut, RefreshCw, Search, AlertCircle, Globe, Briefcase, Trash2, Play, X } from 'lucide-react';
import { findTopic, TOPIC_EXAMPLES } from '../../data/knowledgeBase';

// ─── THEME POR CATEGORIA ──────────────────────────────────────────────────────
const CATEGORY_THEMES = {
  história:   { color: '#c084fc', bg: '#faf5ff', nodeBg: '#7c3aed' },
  biologia:   { color: '#10b981', bg: '#f0fdf4', nodeBg: '#059669' },
  física:     { color: '#38bdf8', bg: '#f0f9ff', nodeBg: '#0284c7' },
  astronomia: { color: '#a78bfa', bg: '#f5f3ff', nodeBg: '#5b21b6' },
  química:    { color: '#f59e0b', bg: '#fffbeb', nodeBg: '#d97706' },
  geografia:  { color: '#06b6d4', bg: '#ecfeff', nodeBg: '#0891b2' },
  tecnologia: { color: '#7c3aed', bg: '#f5f3ff', nodeBg: '#6d28d9' },
  filosofia:  { color: '#f43f5e', bg: '#fff1f2', nodeBg: '#e11d48' },
  default:    { color: '#6366f1', bg: '#f0f0ff', nodeBg: '#4f46e5' },
};

const getTheme = (category) => CATEGORY_THEMES[category] || CATEGORY_THEMES.default;

// ─── SVG MIND MAP CANVAS ──────────────────────────────────────────────────────
const MindMapCanvas = ({ mapData, theme, zoom }) => {
  if (!mapData || !mapData.branches) return null;
  const { topic = 'Sem Tema', branches = [] } = mapData;
  const cx = 500, cy = 300;

  // Posições dos 4 ramos em X distribuído
  const branchPositions = [
    { x: 200, y: 120 },
    { x: 200, y: 460 },
    { x: 800, y: 120 },
    { x: 800, y: 460 },
  ];

  return (
    <svg width="100%" height="100%" viewBox="0 0 1000 600"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }}>

      {/* Grid de pontos */}
      <defs>
        <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={theme?.color || '#666'} fillOpacity="0.2" />
        </pattern>
      </defs>
      <rect width="1000" height="600" fill="url(#dots)" />

      {/* Linhas do centro para os ramos */}
      {branches.map((b, i) => {
        const bp = branchPositions[i];
        if (!bp) return null;
        return (
          <motion.path key={`cl-${i}`}
            d={`M ${cx} ${cy} Q ${(cx + bp.x) / 2} ${cy} ${bp.x} ${bp.y}`}
            stroke={theme?.color || '#666'} strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeDasharray="7 3"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }} />
        );
      })}

      {/* Linhas dos ramos para os filhos */}
      {branches.map((b, i) => {
        const bp = branchPositions[i];
        if (!bp || !b.children) return null;
        const childCount = b.children.length;
        return b.children.map((c, j) => {
          const spread = 70;
          const cy_child = bp.y + (j - (childCount - 1) / 2) * spread;
          const cx_child = i < 2 ? bp.x - 120 : bp.x + 120;
          return (
            <motion.line key={`bl-${i}-${j}`}
              x1={bp.x} y1={bp.y} x2={cx_child} y2={cy_child}
              stroke={theme?.color || '#666'} strokeWidth="1.5" strokeOpacity="0.35"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.1 + j * 0.05 }} />
          );
        });
      })}

      {/* Nós filhos */}
      {branches.map((b, i) => {
        const bp = branchPositions[i];
        if (!bp || !b.children) return null;
        const childCount = b.children.length;
        return b.children.map((c, j) => {
          const spread = 70;
          const cy_child = bp.y + (j - (childCount - 1) / 2) * spread;
          const cx_child = i < 2 ? bp.x - 120 : bp.x + 120;
          const maxChars = 26;
          const label = (c || '').length > maxChars ? c.slice(0, maxChars) + '…' : c;
          return (
            <motion.g key={`cn-${i}-${j}`}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45 + i * 0.08 + j * 0.06, type: 'spring', stiffness: 240 }}>
              <rect x={cx_child - 65} y={cy_child - 17} width={130} height={34} rx={9}
                fill="white" stroke={theme?.color || '#666'} strokeWidth="1.2" strokeOpacity="0.5"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))' }} />
              <text x={cx_child} y={cy_child + 5} textAnchor="middle" fontSize="9.5"
                fontWeight="600" fill="#374151" fontFamily="system-ui, sans-serif">{label}</text>
            </motion.g>
          );
        });
      })}

      {/* Nós de ramo */}
      {branches.map((b, i) => {
        const bp = branchPositions[i];
        if (!bp) return null;
        return (
          <motion.g key={`bn-${i}`}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 200 }}>
            <rect x={bp.x - 68} y={bp.y - 22} width={136} height={44} rx={14}
              fill={theme?.nodeBg || '#666'} style={{ filter: `drop-shadow(0 4px 14px ${theme?.color || '#666'}55)` }} />
            <text x={bp.x} y={bp.y + 7} textAnchor="middle" fontSize="12"
              fontWeight="800" fill="white" fontFamily="system-ui, sans-serif">{b.label}</text>
          </motion.g>
        );
      })}

      {/* Nó central */}
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 200 }}>
        <ellipse cx={cx} cy={cy} rx={95} ry={48} fill={theme?.nodeBg || '#666'}
          style={{ filter: `drop-shadow(0 6px 24px ${theme?.color || '#666'}80)` }} />
        <ellipse cx={cx} cy={cy} rx={99} ry={52} fill="none"
          stroke={theme?.color || '#666'} strokeWidth="2" strokeOpacity="0.3" />
        {topic && topic.split(' ').length <= 2 ? (
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="14" fontWeight="900"
            fill="white" fontFamily="system-ui, sans-serif">{topic}</text>
        ) : (
          <>
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="900"
              fill="white" fontFamily="system-ui, sans-serif">{(topic || '').split(' ').slice(0, 2).join(' ')}</text>
            <text x={cx} y={cy + 13} textAnchor="middle" fontSize="11" fontWeight="700"
              fill="rgba(255,255,255,0.85)" fontFamily="system-ui, sans-serif">{(topic || '').split(' ').slice(2).join(' ')}</text>
          </>
        )}
      </motion.g>
    </svg>
  );
};

// ─── MAIN MODULE ──────────────────────────────────────────────────────────────
const MindMapModule = () => {
  const [topic, setTopic] = useState(() => localStorage.getItem('dvs_mindmap_topic') || '');
  const [mapData, setMapData] = useState(() => {
    try { 
      const stored = JSON.parse(localStorage.getItem('dvs_mindmap_data'));
      if (stored && stored.branches) return stored;
    } catch (e) {}
    return null;
  });
  const [generating, setGenerating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => {
    try { 
      const stored = JSON.parse(localStorage.getItem('dvs_mindmap_theme'));
      if (stored) return stored;
    } catch (e) {}
    return CATEGORY_THEMES.default;
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dvs_mindmap_history')) || []; } catch { return []; }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);

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
    if (mapData && !activeTheme) {
      setActiveTheme(getTheme(mapData.category));
    }
  }, [mapData, activeTheme]);

  const handleGenerate = (customTopic) => {
    const t = (customTopic || topic).trim();
    if (!t) return;
    setGenerating(true);
    setMapData(null);
    setNotFound(false);
    setZoom(1);

    setTimeout(() => {
      const data = findTopic(t);
      if (!data) {
        setNotFound(true);
        setGenerating(false);
        return;
      }
      const newMapData = {
        topic: t.charAt(0).toUpperCase() + t.slice(1).trim(),
        branches: data.mindMap.branches,
        category: data.category,
      };
      const theme = getTheme(data.category);
      setActiveTheme(theme);
      setMapData(newMapData);

      const newHistoryItem = { id: Date.now(), topic: t, mapData: newMapData, theme: theme };
      const updatedHistory = [newHistoryItem, ...history.filter(h => h.topic.toLowerCase() !== t.toLowerCase())];
      setHistory(updatedHistory);
      
      localStorage.setItem('dvs_mindmap_history', JSON.stringify(updatedHistory));
      localStorage.setItem('dvs_mindmap_topic', t);
      localStorage.setItem('dvs_mindmap_theme', JSON.stringify(theme));
      localStorage.setItem('dvs_mindmap_data', JSON.stringify(newMapData));

      setGenerating(false);
    }, 1500);
  };

  const loadHistoryItem = (item) => {
    setTopic(item.topic);
    setMapData(item.mapData);
    setActiveTheme(item.theme);
    setZoom(1);
    localStorage.setItem('dvs_mindmap_topic', item.topic);
    localStorage.setItem('dvs_mindmap_theme', JSON.stringify(item.theme));
    localStorage.setItem('dvs_mindmap_data', JSON.stringify(item.mapData));
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('dvs_mindmap_history', JSON.stringify(updatedHistory));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mapRef.current?.requestFullscreen) {
        mapRef.current.requestFullscreen();
      } else if (mapRef.current?.webkitRequestFullscreen) {
        mapRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleExport = async () => {
    if (!mapData || !mapRef.current) return;
    try {
      const el = mapRef.current;
      const animatedNodes = el.querySelectorAll('*');
      animatedNodes.forEach(n => {
        if (n.style.filter) n.style.filter = 'none';
      });

      const rect = el.getBoundingClientRect();
      const canvas = await html2canvas(el, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: activeTheme?.bg || '#ffffff',
        width: rect.width,
        height: rect.height,
        windowWidth: rect.width,
        windowHeight: rect.height
      });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `MapaMental_${mapData.topic.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>

      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111' }}>Mapa Mental com IA</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>Digite o tema escolar e a IA gera um mapa mental com informações reais e precisas.</p>
      </div>

      {/* Input */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Search size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <input
          value={topic}
          onChange={e => { setTopic(e.target.value); setNotFound(false); }}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="Ex: Fotossíntese, Revolução Francesa, Leis de Newton, Sistema Solar..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1e293b', background: 'transparent', fontWeight: '500' }}
        />
        <button onClick={() => handleGenerate()} disabled={!topic.trim() || generating}
          style={{ background: topic.trim() ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#e2e8f0', color: topic.trim() ? 'white' : '#94a3b8', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: topic.trim() ? 'pointer' : 'not-allowed', transition: '0.2s', fontSize: '0.9rem', boxShadow: topic.trim() ? '0 4px 14px rgba(124,58,237,0.35)' : 'none', whiteSpace: 'nowrap' }}>
          <Layers size={16} /> Gerar Mapa
        </button>
      </div>

      {/* Not Found */}
      {notFound && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '18px 22px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontWeight: '800', color: '#92400e', marginBottom: '6px' }}>Tema não encontrado na base de conhecimento</p>
            <p style={{ color: '#78350f', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '8px' }}>Tente um dos temas disponíveis:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TOPIC_EXAMPLES.map(ex => (
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
      {!generating && !mapData && history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '10px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} color="#94a3b8" /> Mapas Mentais Salvos
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {history.map(item => (
              <div key={item.id} onClick={() => loadHistoryItem(item)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.theme?.bg || '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.theme?.nodeBg || '#666' }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1e293b', margin: 0 }}>{item.topic || 'Sem Tema'}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Mapa Mental IA</span>
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
              <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#10b981', animation: 'spin 0.6s linear infinite reverse' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: '800', color: '#111', fontSize: '1.1rem', marginBottom: '6px' }}>Construindo o mapa mental...</p>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>Carregando dados reais e conectando os nós temáticos</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      {mapData && !generating && activeTheme && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
          {(!mapData.branches || mapData.branches.length === 0) ? (
            <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
              <p style={{ color: '#666' }}>Ocorreu um erro ao carregar os dados deste mapa. Tente gerar um novo.</p>
              <button onClick={() => { setMapData(null); localStorage.removeItem('dvs_mindmap_data'); }} style={{ marginTop: '12px', padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Limpar e Recomeçar</button>
            </div>
          ) : (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Toolbar */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTheme?.color || '#333' }} />
                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1e293b' }}>{mapData?.topic}</span>
                <span style={{ background: `${activeTheme?.color || '#333'}15`, color: activeTheme?.color || '#333', padding: '2px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800' }}>
                  {(mapData?.category || 'Geral').charAt(0).toUpperCase() + (mapData?.category || 'Geral').slice(1)}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  {mapData?.branches?.length || 0} ramos · {mapData?.branches?.reduce((a, b) => a + (b.children?.length || 0), 0) || 0} nós
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => setZoom(z => Math.min(z + 0.15, 1.8))}
                  style={{ padding: '6px 10px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <ZoomIn size={15} />
                </button>
                <span style={{ fontWeight: '700', color: '#94a3b8', fontSize: '0.78rem', minWidth: '38px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
                  style={{ padding: '6px 10px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <ZoomOut size={15} />
                </button>
                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />
                <button onClick={() => { handleGenerate(topic); }}
                  style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>
                  <RefreshCw size={13} /> Refazer
                </button>
                <button onClick={toggleFullscreen} style={{ padding: '6px 12px', border: 'none', background: '#1e293b', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700', color: 'white' }}>
                  <Play size={13} /> Apresentar
                </button>
                <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }} />
                <button onClick={handleExport} style={{ padding: '6px 10px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }} title="Baixar Imagem">
                  <Download size={15} />
                </button>
              </div>
            </div>
            {/* Canvas */}
            <div ref={mapRef} style={{ flex: 1, background: activeTheme?.bg || '#fff', position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
              {mapData && activeTheme && <MindMapCanvas mapData={mapData} theme={activeTheme} zoom={zoom} />}
              
              {/* Sair Fullscreen Button */}
              {isFullscreen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
          </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => { setMapData(null); setTopic(''); setNotFound(false); localStorage.removeItem('dvs_mindmap_data'); }}
              style={{ background: 'none', border: '1px dashed #e2e8f0', color: '#94a3b8', borderRadius: '10px', padding: '7px 18px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
              + Novo mapa
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600' }}>
              <Sparkles size={12} />
              Dados da Base de Conhecimento Escolar DVS IA
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!mapData && !generating && !notFound && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#fff', border: '1px dashed #e2e8f0', borderRadius: '20px', textAlign: 'center', padding: '50px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={32} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h3 style={{ fontWeight: '800', color: '#374151', fontSize: '1.15rem', marginBottom: '8px' }}>Digite um tema escolar acima</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '400px', lineHeight: 1.6 }}>
              A IA consulta a base de conhecimento e gera um mapa mental com <strong>dados reais</strong> — datas, nomes, fórmulas e fatos verificados.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
            {TOPIC_EXAMPLES.slice(0, 7).map(ex => (
              <button key={ex} onClick={() => { setTopic(ex); handleGenerate(ex); }}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </motion.div>
  );
};

export default MindMapModule;
