import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Save, Hash, Medal, Settings, X, Edit2, User, ChevronDown, ChevronUp, AlertCircle, History, CheckCircle2, Lock, Unlock, Trophy, Trash2, Crown, Clock, Play, Pause, AlertTriangle, Volume2, VolumeX } from 'lucide-react';

// --- SOUND MANAGER & TTS ---
const SoundFX = {
  ctx: null,
  init: () => {
    if (!SoundFX.ctx) {
      SoundFX.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playTone: (freq, type, duration, delay = 0) => {
    if (!SoundFX.ctx) SoundFX.init();
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, SoundFX.ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.1, SoundFX.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, SoundFX.ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(SoundFX.ctx.currentTime + delay);
    osc.stop(SoundFX.ctx.currentTime + delay + duration);
  },
  playStart: () => {
    SoundFX.playTone(440, 'sine', 0.1, 0);
    SoundFX.playTone(554, 'sine', 0.1, 0.1);
    SoundFX.playTone(659, 'sine', 0.4, 0.2);
  },
  playSuccess: () => {
    SoundFX.playTone(880, 'sine', 0.1, 0);
    SoundFX.playTone(1108, 'sine', 0.2, 0.1);
  },
  playAttention: () => {
    SoundFX.playTone(600, 'sine', 0.15, 0);
    SoundFX.playTone(600, 'sine', 0.15, 0.25);
    SoundFX.playTone(600, 'sine', 0.15, 0.5);
  },
  playWarning: () => {
    SoundFX.playTone(800, 'square', 0.05, 0);
    SoundFX.playTone(600, 'square', 0.05, 0.1);
  },
  playAlarm: () => {
    SoundFX.playTone(150, 'sawtooth', 1.5, 0);
  },
  playWinner: () => {
    [523, 659, 784, 1046, 784, 1046].forEach((freq, i) => {
      SoundFX.playTone(freq, 'triangle', 0.2, i * 0.15);
    });
  },
  speak: (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }
};

// --- UTILS & HOOKS ---

const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

// --- COMPONENTES UI ---

const Button = ({ onClick, disabled, children, variant = 'primary', className = "" }) => {
  const baseStyle = "px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-80 relative z-10";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:bg-slate-800",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-red-900/30 shadow-lg",
    success: "bg-green-600 hover:bg-green-500 text-white shadow-emerald-900/50 shadow-lg",
    gold: "bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-white shadow-amber-900/50 shadow-lg border border-amber-300/20",
    icon: "p-2 bg-transparent hover:bg-white/10 text-slate-300 rounded-full shadow-none"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, type = "text", className = "", ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-500 relative z-10 ${className}`}
    {...props}
  />
);

// --- VISTAS AUXILIARES (Avatar Silueta Mejorado) ---

const PlayerAvatar = ({ name, position }) => {
  const isHorizontal = position === 'left' || position === 'right';
  
  const rotationClass = 
    position === 'top' ? 'rotate-180' :
    position === 'left' ? 'rotate-90' :
    position === 'right' ? '-rotate-90' :
    'rotate-0';

  // Posicionamiento relativo al borde de la mesa
  const positionClass = 
    position === 'top' ? '-top-8 left-1/2 -translate-x-1/2' :
    position === 'bottom' ? '-bottom-8 left-1/2 -translate-x-1/2' :
    position === 'left' ? '-left-8 top-1/2 -translate-y-1/2' :
    '-right-8 top-1/2 -translate-y-1/2';

  const nameTagClass = 
    position === 'top' ? 'mb-2 order-first' : 
    position === 'bottom' ? 'mt-2' :
    position === 'left' ? 'mt-2' :
    position === 'right' ? 'mt-2' : '';

  return (
    <div className={`flex flex-col items-center justify-center pointer-events-none absolute ${positionClass} z-30`}> 
      
      {/* Silueta */}
      <div className={`w-16 h-16 rounded-full bg-slate-800 border-[3px] ${isHorizontal ? 'border-amber-500' : 'border-emerald-500'} shadow-xl flex items-center justify-center overflow-hidden ${rotationClass}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-10 h-10 ${isHorizontal ? 'text-amber-100/80' : 'text-emerald-100/80'}`}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>

      {/* Nombre */}
      <span className={`text-[10px] font-bold text-white bg-black/80 px-3 py-1 rounded-full backdrop-blur-md whitespace-nowrap max-w-[100px] truncate border border-white/10 shadow-lg ${nameTagClass}`}>
        {name || 'Jugador'}
      </span>
    </div>
  );
};

// --- CRONÓMETRO INTELIGENTE ---
const CountdownTimer = ({ secondsRemaining, isRunning, onToggle, soundEnabled }) => {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgent = secondsRemaining > 0 && secondsRemaining <= 300; 
  const isCritical = secondsRemaining > 0 && secondsRemaining <= 10; 
  const isExpired = secondsRemaining === 0;

  return (
    <>
      {isCritical && isRunning && (
        <div className="fixed inset-0 z-[100] bg-red-600/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
           <AlertTriangle className="text-white w-24 h-24 animate-bounce mb-4" />
           <h2 className="text-white text-4xl font-black uppercase tracking-widest mb-4">¡Tiempo por terminar!</h2>
           <div className="text-[15rem] font-black text-white leading-none tabular-nums animate-pulse">
             {secondsRemaining}
           </div>
           <p className="text-white/80 text-xl mt-8 font-bold">Cierren la mano actual</p>
        </div>
      )}

      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl font-mono font-bold text-4xl shadow-2xl border-2 transition-all relative z-20 ${
        isExpired ? 'bg-slate-800 border-slate-600 text-slate-500' : 
        isUrgent ? 'bg-amber-900/80 border-amber-500 text-amber-400 animate-pulse' : 
        'bg-slate-800 border-emerald-500/50 text-emerald-400'
      }`}>
        <Clock size={28} className={isRunning ? 'animate-spin-slow' : ''} />
        <span className="tabular-nums tracking-wider">{formatTime(secondsRemaining)}</span>
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        <button 
          onClick={onToggle}
          className={`p-2 rounded-full transition-colors ${isRunning ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'}`}
        >
          {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>
    </>
  );
};

const TableCard = ({ match, round, scores, onScoreChange, onToggleStatus }) => {
  const isCompleted = match.isCompleted;
  const score1 = scores[match.id]?.team1Score ?? '';
  const score2 = scores[match.id]?.team2Score ?? '';

  return (
    // AÑADIDO px-14 PARA CREAR ESPACIO DE SEGURIDAD LATERAL
    <div className="relative group animate-in zoom-in-95 duration-300 w-full max-w-md mx-auto my-8 px-14 py-8">
      {/* Mesa Base */}
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-slate-700 aspect-square relative z-10">
        
        {/* -- JUGADORES -- */}
        <PlayerAvatar name={match.team1.player1} position="top" />
        <PlayerAvatar name={match.team1.player2} position="bottom" />
        <PlayerAvatar name={match.team2.player1} position="left" />
        <PlayerAvatar name={match.team2.player2} position="right" />

        {/* Paño Verde */}
        <div className={`absolute inset-8 rounded-xl shadow-inner border-4 ${isCompleted ? 'bg-emerald-900 border-emerald-700 grayscale' : 'bg-emerald-700 border-amber-800'} transition-all duration-500 overflow-hidden z-0`}>
            
            {/* Textura */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-40 pointer-events-none rounded-lg z-0"></div>
            
            {/* LOGO MARCA DE AGUA (ESQUINA INFERIOR DERECHA) */}
            <div className="absolute bottom-3 right-3 z-0 opacity-25 pointer-events-none">
               <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain mix-blend-overlay transform rotate-0" />
            </div>

            {/* Info Mesa */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex flex-col items-center opacity-40">
                <div className="text-4xl font-black text-black/40 uppercase tracking-widest">Mesa</div>
                <div className="text-6xl font-black text-black/40">{match.table}</div>
            </div>

            {/* Inputs de Puntuación */}
            <div className="absolute inset-0 flex flex-col justify-between py-14 px-10 z-10">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider drop-shadow-md bg-black/30 px-2 py-0.5 rounded border border-white/10">Pareja 1 (N/S)</span>
                    <input type="text" inputMode="numeric" disabled={isCompleted} className={`w-16 text-center rounded-lg py-0.5 text-2xl font-black text-white placeholder:text-white/20 transition-all shadow-lg border-2 ${isCompleted ? 'bg-transparent border-none' : 'bg-black/40 border-emerald-400/50 focus:bg-black/60 focus:border-emerald-400 focus:outline-none'}`} placeholder="0" value={score1} onChange={(e) => onScoreChange(match.id, 'team1Score', e.target.value)} />
                </div>
                {/* Líneas Guía */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-white/10"></div>
                
                <div className="flex flex-col items-center gap-1">
                     <input type="text" inputMode="numeric" disabled={isCompleted} className={`w-16 text-center rounded-lg py-0.5 text-2xl font-black text-white placeholder:text-white/20 transition-all shadow-lg border-2 ${isCompleted ? 'bg-transparent border-none' : 'bg-black/40 border-amber-500/50 focus:bg-black/60 focus:border-amber-500 focus:outline-none'}`} placeholder="0" value={score2} onChange={(e) => onScoreChange(match.id, 'team2Score', e.target.value)} />
                    <span className="text-[9px] font-bold text-amber-100 uppercase tracking-wider drop-shadow-md bg-black/30 px-2 py-0.5 rounded border border-white/10">Pareja 2 (E/O)</span>
                </div>
            </div>

            {isCompleted && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30 flex items-center justify-center rounded-lg">
                   <Lock className="text-white/50 w-12 h-12" />
                </div>
            )}
        </div>
      </div>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center">
        <button onClick={() => onToggleStatus(match.id)} disabled={!isCompleted && (score1 === '' || score2 === '')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs shadow-xl transition-all active:scale-95 transform hover:-translate-y-1 ${isCompleted ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-500' : (score1 !== '' && score2 !== '') ? 'bg-emerald-500 text-white hover:bg-emerald-400 border border-emerald-300 ring-4 ring-emerald-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}>
          {isCompleted ? <><Unlock size={14} /> CORREGIR</> : <><CheckCircle2 size={16} /> CONFIRMAR RESULTADO</>}
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTES MODALES ---
const SettingsModal = ({ isOpen, onClose, teams, setTeams }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center"><h3 className="font-bold text-white text-lg flex items-center gap-2"><Edit2 size={18} className="text-emerald-400"/> Corregir Nombres</h3><button onClick={onClose} className="text-slate-400 hover:text-white p-2"><X size={24} /></button></div>
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {teams.map((team, idx) => (
            <div key={team.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700"><div className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">Pareja #{idx + 1}</div><div className="grid grid-cols-2 gap-2"><Input value={team.player1} onChange={(e) => { const newTeams = [...teams]; newTeams[idx].player1 = e.target.value; setTeams(newTeams); }} placeholder="Jugador 1" /><Input value={team.player2} onChange={(e) => { const newTeams = [...teams]; newTeams[idx].player2 = e.target.value; setTeams(newTeams); }} placeholder="Jugador 2" /></div></div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-800/50"><Button onClick={onClose} className="w-full">Listo</Button></div>
      </div>
    </div>
  );
};

// --- SIDEBAR (TABLA GENERAL) ---
const ScoreSidebar = ({ teams, onUpdateHistory, round }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.roundsWon - a.roundsWon;
  });

  return (
    <div className="bg-slate-900/95 backdrop-blur border-l border-slate-800 h-full flex flex-col shadow-2xl w-full sm:w-96 max-w-[90vw]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Medal size={18} className="text-emerald-400" /> Tabla General
          </h3>
          <p className="text-xs text-slate-500 mt-1">Ronda actual: {round}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 relative z-10">
        {sortedTeams.map((team, idx) => (
          <div key={team.id} className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <div 
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${idx < 3 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  {idx + 1}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-slate-200 truncate">
                    {team.player1} / {team.player2}
                  </span>
                  <span className="text-[10px] text-slate-500">Pareja #{team.id + 1}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-emerald-400">{team.totalPoints}</span>
                {expandedTeam === team.id ? <ChevronUp size={16} className="text-slate-500"/> : <ChevronDown size={16} className="text-slate-500"/>}
              </div>
            </div>
            {expandedTeam === team.id && (
              <div className="bg-slate-950/50 p-3 border-t border-slate-700 space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <History size={12} /> Historial (Editable)
                </div>
                {team.history.map((points, roundIdx) => (
                  <div key={roundIdx} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">R {roundIdx + 1}</span>
                    <input
                      type="number"
                      className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-right text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                      value={points}
                      onChange={(e) => onUpdateHistory(team.id, roundIdx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PANTALLA DE REGISTRO ---
const SetupView = ({ teams, setTeams, config, setConfig, onStart, showToast }) => {
  const handleTableCountChange = (val) => {
    const count = Math.max(1, parseInt(val) || 1);
    setConfig(prev => ({ ...prev, totalTables: count }));
    const newTeamCount = count * 2;
    const currentTeams = [...teams];
    if (newTeamCount > currentTeams.length) {
      const added = Array(newTeamCount - currentTeams.length).fill(null).map((_, i) => ({
        id: currentTeams.length + i, player1: '', player2: '', totalPoints: 0, roundsWon: 0, history: []
      }));
      setTeams([...currentTeams, ...added]);
    } else {
      setTeams(currentTeams.slice(0, newTeamCount));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20 relative z-10">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-black text-white tracking-tight">Configuración del Torneo</h2>
        <p className="text-slate-400">Define las reglas y registra a los participantes.</p>
      </div>
      <div className="bg-slate-800/90 backdrop-blur p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><Settings size={20}/> Reglas de Juego</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mesas</label><input type="number" min="1" max="50" value={config.totalTables} onChange={(e) => handleTableCountChange(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-white text-center" /></div>
          <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rondas</label><input type="number" min="1" max="20" value={config.totalRounds} onChange={(e) => setConfig(prev => ({ ...prev, totalRounds: Math.max(1, parseInt(e.target.value) || 1) }))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-white text-center" /></div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tiempo (Min : Seg)</label>
            <div className="flex gap-2">
              <input type="number" min="0" max="120" placeholder="Min" value={config.timerMinutes || 0} onChange={(e) => setConfig(prev => ({ ...prev, timerMinutes: Math.max(0, parseInt(e.target.value) || 0) }))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-2 py-3 text-xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
              <span className="text-2xl font-bold text-slate-600 self-center">:</span>
              <input type="number" min="0" max="59" placeholder="Seg" value={config.timerSeconds || 0} onChange={(e) => setConfig(prev => ({ ...prev, timerSeconds: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) }))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-2 py-3 text-xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
            </div>
            <span className="text-[10px] text-slate-500 block text-center mt-1">0:00 = Sin límite</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 px-2"><User size={20}/> Registro ({teams.length} Parejas)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <div key={team.id} className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 flex flex-col gap-3 relative group focus-within:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-2"><div className="w-6 h-6 flex items-center justify-center bg-emerald-900/50 text-emerald-400 rounded text-xs font-bold border border-emerald-700/30">#{index + 1}</div><span className="text-slate-400 text-xs font-bold uppercase">Mesa {Math.floor(index/2) + 1}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={team.player1} onChange={(e) => { const t = [...teams]; t[index].player1 = e.target.value; setTeams(t); }} onBlur={() => { if (team.player1.trim()) { const msg = `¡Éxitos, ${team.player1}!`; showToast(msg); SoundFX.speak(msg); } }} placeholder="Jugador 1" className="text-sm" />
                <Input value={team.player2} onChange={(e) => { const t = [...teams]; t[index].player2 = e.target.value; setTeams(t); }} onBlur={() => { if (team.player2.trim()) { const msg = `¡Éxitos, ${team.player2}!`; showToast(msg); SoundFX.speak(msg); } }} placeholder="Jugador 2" className="text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur border-t border-slate-800 z-30 flex justify-center">
        <Button onClick={onStart} className="w-full max-w-md py-4 text-lg shadow-xl shadow-emerald-900/40"><RotateCw size={20} /> Comenzar Torneo</Button>
      </div>
    </div>
  );
};

// --- PANTALLA ACTIVA ---
const ActiveRoundView = ({ round, matches, scores, onScoreChange, onToggleStatus, onFinishRound, timerState, onToggleTimer, soundEnabled }) => {
  const allCompleted = matches.every(m => m.isCompleted);
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-32 relative z-10">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left relative z-20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2"><span className="bg-emerald-600 text-white text-sm px-2 py-1 rounded font-mono">Ronda {round}</span><span className="hidden sm:inline">En Juego</span></h2>
        </div>
        <div className="flex items-center gap-4">
          {timerState && <CountdownTimer secondsRemaining={timerState.secondsRemaining} isRunning={timerState.isRunning} onToggle={onToggleTimer} soundEnabled={soundEnabled} />}
        </div>
      </div>
      {/* AUMENTADO EL GAP PARA EVITAR SOLAPAMIENTO */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-12 gap-y-24 justify-items-center pt-4">
        {matches.map((match) => (
          <TableCard key={match.id} match={match} round={round} scores={scores} onScoreChange={onScoreChange} onToggleStatus={onToggleStatus} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-40 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <Button onClick={onFinishRound} disabled={!allCompleted} variant={allCompleted ? "success" : "primary"} className="w-full max-w-lg py-4 text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          {allCompleted ? (<span className="flex items-center gap-2"><RotateCw size={22} /> ¡CERRAR RONDA {round}!</span>) : (<span className="flex items-center gap-2 text-slate-400"><Lock size={20} /> Faltan Mesas por Confirmar</span>)}
        </Button>
      </div>
    </div>
  );
};

// --- PANTALLA RANKING ---
const RankingView = ({ round, teams, onNextRound, totalRounds }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.roundsWon - a.roundsWon;
  });
  
  const isFinalRound = round >= totalRounds;
  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-32 max-w-4xl mx-auto relative z-10">
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-full mb-4"><Trophy className="text-emerald-400" size={40} /></div>
        <h2 className="text-3xl font-bold text-white mb-2">{isFinalRound ? "Resultados Finales" : `Resultados Ronda ${round}`}</h2>
        <p className="text-slate-400">{isFinalRound ? "Torneo completado." : "Clasificación actualizada."}</p>
      </div>
      <div className="bg-slate-800/90 backdrop-blur rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 gap-2 p-4 bg-slate-900/80 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-700">
          <div className="col-span-2 text-center">#</div>
          <div className="col-span-6">Pareja</div>
          <div className="col-span-2 text-center">PG</div>
          <div className="col-span-2 text-center">PTS</div>
        </div>
        <div className="divide-y divide-slate-700/50">
          {sortedTeams.map((team, idx) => (
            <div key={team.id} className={`grid grid-cols-12 gap-2 p-4 items-center transition-colors ${idx < 2 ? 'bg-emerald-900/10' : 'hover:bg-slate-700/30'}`}>
              <div className="col-span-2 flex justify-center font-bold text-slate-500 text-lg">#{idx + 1}</div>
              <div className="col-span-6 flex flex-col"><span className="font-bold text-slate-200 text-base">{team.player1} & {team.player2}</span>{idx < 2 && !isFinalRound && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide mt-0.5">Mesa 1</span>}</div>
              <div className="col-span-2 text-center font-bold text-amber-400 text-lg">{team.roundsWon}</div>
              <div className="col-span-2 text-center font-black text-emerald-400 text-lg">{team.totalPoints}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-40 flex justify-center">
        {isFinalRound ? (
           <Button onClick={onNextRound} variant="gold" className="w-full max-w-lg py-4 text-lg shadow-xl animate-pulse"><Crown size={24} /> Ver Ganadores</Button>
        ) : (
           <Button onClick={onNextRound} className="w-full max-w-lg py-4 text-lg shadow-emerald-900/50 shadow-lg">Comenzar Ronda {round + 1} <RotateCw size={20} /></Button>
        )}
      </div>
    </div>
  );
};

const WinnerView = ({ teams, onReset }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.roundsWon - a.roundsWon;
  });
  
  useEffect(() => {
    SoundFX.playWinner();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 p-4 animate-in zoom-in-90 duration-700 relative z-10">
      <div className="space-y-2 z-10">
        <div className="inline-flex p-4 bg-yellow-500/20 rounded-full mb-4 ring-4 ring-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.4)]"><Trophy className="text-yellow-400" size={64} /></div>
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight">¡CAMPEONES!</h1>
      </div>
      <div className="w-full max-w-md space-y-4 z-10">
        <div className="bg-gradient-to-r from-yellow-900/80 to-yellow-600/20 border border-yellow-500/50 p-6 rounded-2xl shadow-2xl transform scale-105 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 text-yellow-500/10"><Crown size={120}/></div>
           <div className="flex items-center justify-between relative">
             <div className="text-left"><span className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-1 block">1er Lugar</span><div className="text-2xl font-black text-white">{sortedTeams[0].player1} & {sortedTeams[0].player2}</div></div>
             <div className="text-right"><div className="text-4xl font-black text-yellow-400">{sortedTeams[0].totalPoints} pts</div><div className="text-sm font-bold text-yellow-200/60">{sortedTeams[0].roundsWon} Ganadas</div></div>
           </div>
        </div>
        {sortedTeams.slice(1, 3).map((team, idx) => (
            <div key={idx} className="bg-slate-800/80 border border-slate-600 p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4"><div className="bg-slate-700 text-slate-300 font-bold w-8 h-8 rounded-full flex items-center justify-center">{idx + 2}</div><div className="text-left font-bold text-slate-200 text-lg">{team.player1} & {team.player2}</div></div>
                <div className="text-right"><span className="font-bold text-white">{team.totalPoints} pts</span> <span className="text-xs text-slate-400">({team.roundsWon} PG)</span></div>
            </div>
        ))}
      </div>
      <div className="pt-12 z-10"><Button onClick={onReset} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-8 py-4 text-lg shadow-xl"><RotateCw className="mr-2" size={20}/> Iniciar Nuevo Torneo</Button></div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function DominoTournamentApp() {
  const [step, setStep] = useStickyState('setup', 'domino_step');
  const [config, setConfig] = useStickyState({ totalTables: 5, totalRounds: 5, timerMinutes: 0, timerSeconds: 0 }, 'domino_config_v2');
  const [teams, setTeams] = useStickyState(Array(10).fill('').map((_, i) => ({ id: i, player1: '', player2: '', totalPoints: 0, roundsWon: 0, history: [] })), 'domino_teams');
  const [round, setRound] = useStickyState(1, 'domino_round');
  const [currentMatches, setCurrentMatches] = useStickyState([], 'domino_matches');
  const [scores, setScores] = useStickyState({}, 'domino_scores');
  const [soundEnabled, setSoundEnabled] = useStickyState(true, 'domino_sound_enabled');
  
  const [timerState, setTimerState] = useStickyState({ secondsRemaining: 0, isRunning: false }, 'domino_timer_v3');

  const [toast, setToast] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false); 

  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
  const showToast = (msg) => setToast(msg);
  
  const sortTeamsByScore = (teamList) => [...teamList].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.roundsWon - a.roundsWon;
  });

  useEffect(() => {
    let interval = null;
    if (timerState.isRunning && timerState.secondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          const nextSecs = Math.max(0, prev.secondsRemaining - 1);
          
          if (soundEnabled) {
            if (nextSecs === 300) SoundFX.playAttention(); 
            if (nextSecs === 10) SoundFX.playWarning();
            if (nextSecs > 0 && nextSecs <= 5) SoundFX.playTone(600, 'square', 0.05);
            if (nextSecs === 0) SoundFX.playAlarm();
          }
          
          if (nextSecs === 0) return { ...prev, secondsRemaining: 0, isRunning: false };
          return { ...prev, secondsRemaining: nextSecs };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.secondsRemaining, soundEnabled]);

  const toggleTimer = () => setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  const toggleSound = () => {
    if (SoundFX.ctx && SoundFX.ctx.state === 'suspended') SoundFX.ctx.resume();
    setSoundEnabled(!soundEnabled);
  };

  const getTotalSeconds = () => (config.timerMinutes || 0) * 60 + (config.timerSeconds || 0);

  const startTournament = () => {
    SoundFX.playStart();
    const initializedTeams = teams.map((t, i) => ({ ...t, player1: t.player1.trim() || `Jugador A${i+1}`, player2: t.player2.trim() || `Jugador B${i+1}`, totalPoints: 0, roundsWon: 0, history: [] }));
    setTeams(initializedTeams);
    setRound(1);
    
    const totalSecs = getTotalSeconds();
    if (totalSecs > 0) {
      setTimerState({ secondsRemaining: totalSecs, isRunning: false }); 
    } else {
      setTimerState(null);
    }

    const sortedTeams = sortTeamsByScore(initializedTeams);
    generateMatches(sortedTeams, 1);
    setStep('active');
    showToast(`¡Torneo de ${config.totalRounds} rondas iniciado!`);
  };

  const resetTournament = () => {
    if (confirm("⚠️ ¿Borrar todo y empezar de cero?")) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  const generateMatches = (rankedTeams, currentRoundNumber) => {
    const matches = [];
    for (let i = 0; i < rankedTeams.length - 1; i += 2) {
      matches.push({ id: `R${currentRoundNumber}-M${(i/2)+1}`, table: (i / 2) + 1, team1: rankedTeams[i], team2: rankedTeams[i + 1], isCompleted: false });
    }
    setCurrentMatches(matches);
    setScores({});
  };

  const handleScoreChange = (matchId, teamKey, value) => {
    if (value && !/^\d*$/.test(value)) return;
    setScores(prev => ({ ...prev, [matchId]: { ...prev[matchId], [teamKey]: value } }));
  };

  const toggleMatchStatus = (matchId) => {
    const match = currentMatches.find(m => m.id === matchId);
    const matchScores = scores[matchId];
    if (!match.isCompleted) {
      if (!matchScores || matchScores.team1Score === undefined || matchScores.team1Score === '' || matchScores.team2Score === undefined || matchScores.team2Score === '') {
        showToast("⚠️ Ingresa ambos puntajes antes de confirmar.");
        return;
      }
      if (soundEnabled) SoundFX.playSuccess();
    }
    setCurrentMatches(prev => prev.map(m => m.id === matchId ? { ...m, isCompleted: !m.isCompleted } : m));
  };

  const finishRound = () => {
    if (!currentMatches.every(m => m.isCompleted)) { showToast("⚠️ Faltan mesas por confirmar."); return; }
    const updatedTeams = teams.map(team => {
      let roundScore = 0;
      let wonRound = false;
      const match = currentMatches.find(m => m.team1.id === team.id || m.team2.id === team.id);
      
      if (match) {
        const s = scores[match.id];
        const s1 = Number(s.team1Score);
        const s2 = Number(s.team2Score);
        
        if (match.team1.id === team.id) {
            roundScore = s1;
            if (s1 > s2) wonRound = true;
        } else {
            roundScore = s2;
            if (s2 > s1) wonRound = true;
        }
      }
      const newHistory = [...team.history, roundScore];
      return { 
          ...team, 
          history: newHistory, 
          totalPoints: newHistory.reduce((a, b) => a + b, 0),
          roundsWon: team.roundsWon + (wonRound ? 1 : 0)
      };
    });
    setTeams(updatedTeams);
    setTimerState(prev => prev ? { ...prev, isRunning: false } : null); 
    setStep('ranking');
  };

  const nextRound = () => {
    if (round >= config.totalRounds) {
      setStep('winner');
    } else {
      const nextR = round + 1;
      setRound(nextR);
      
      const totalSecs = getTotalSeconds();
      if (totalSecs > 0) {
         setTimerState({ secondsRemaining: totalSecs, isRunning: false });
      }
      
      const sortedTeams = sortTeamsByScore(teams);
      generateMatches(sortedTeams, nextR);
      setStep('active');
    }
  };

  const updateHistoryScore = (teamId, roundIdx, newVal) => {
    const value = parseInt(newVal) || 0;
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id !== teamId) return team;
      const newHistory = [...team.history];
      newHistory[roundIdx] = value;
      const newTotal = newHistory.reduce((a, b) => a + b, 0);
      return { ...team, history: newHistory, totalPoints: newTotal };
    }));
  };

  const SettingsModal = ({ isOpen, onClose, teams, setTeams }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center"><h3 className="font-bold text-white text-lg flex items-center gap-2"><Edit2 size={18} className="text-emerald-400"/> Corregir Nombres</h3><button onClick={onClose} className="text-slate-400 hover:text-white p-2"><X size={24} /></button></div>
          <div className="overflow-y-auto p-4 space-y-4 flex-1">
            {teams.map((team, idx) => (
              <div key={team.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700"><div className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">Pareja #{idx + 1}</div><div className="grid grid-cols-2 gap-2"><Input value={team.player1} onChange={(e) => { const newTeams = [...teams]; newTeams[idx].player1 = e.target.value; setTeams(newTeams); }} placeholder="Jugador 1" /><Input value={team.player2} onChange={(e) => { const newTeams = [...teams]; newTeams[idx].player2 = e.target.value; setTeams(newTeams); }} placeholder="Jugador 2" /></div></div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700 bg-slate-800/50"><Button onClick={onClose} className="w-full">Listo</Button></div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      {/* MARCA DE AGUA DE FONDO DE PÁGINA (NUEVO) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.05]">
         <img src="/logo.png" alt="Logo Fondo" className="w-[80%] h-[80%] object-contain mix-blend-lighten" />
      </div>

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0 h-16 z-50 shadow-lg relative">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-2 rounded-lg shadow-lg"><Hash className="text-white" size={20} /></div><h1 className="font-black text-xl tracking-tight text-white">Domino<span className="text-emerald-500">Master</span></h1></div>
          <div className="flex items-center gap-3">
             <Button variant="icon" onClick={toggleSound} className={soundEnabled ? "text-emerald-400" : "text-slate-600"} title={soundEnabled ? "Silenciar" : "Activar Sonido"}>{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</Button>
             {step !== 'winner' && step !== 'setup' && <Button variant="icon" onClick={() => setIsRankingOpen(!isRankingOpen)} className={`text-emerald-400 transition-colors ${isRankingOpen ? 'bg-white/10' : ''}`} title="Ver Tabla General"><Medal size={24} /><span className="hidden sm:inline text-sm font-bold ml-1">Tabla</span></Button>}
             {step !== 'setup' && step !== 'winner' && <Button variant="icon" onClick={() => setIsSettingsOpen(true)} title="Editar Nombres"><Settings size={20} /></Button>}
             {step !== 'setup' && <Button variant="icon" onClick={resetTournament} title="Reiniciar Torneo" className="text-red-400 hover:text-red-300 bg-red-900/10 hover:bg-red-900/30 ml-2"><Trash2 size={20} /></Button>}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth w-full">
          <div className="max-w-7xl mx-auto">
            {step === 'setup' && <SetupView teams={teams} setTeams={setTeams} config={config} setConfig={setConfig} onStart={startTournament} showToast={showToast} />}
            {step === 'active' && <ActiveRoundView round={round} matches={currentMatches} scores={scores} onScoreChange={handleScoreChange} onToggleStatus={toggleMatchStatus} onFinishRound={finishRound} timerState={timerState} onToggleTimer={toggleTimer} soundEnabled={soundEnabled} />}
            {step === 'ranking' && <RankingView round={round} teams={teams} onNextRound={nextRound} totalRounds={config.totalRounds} />}
            {step === 'winner' && <WinnerView teams={teams} onReset={resetTournament} />}
          </div>
        </main>
        {step !== 'setup' && step !== 'winner' && (
          <>
            {isRankingOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => setIsRankingOpen(false)} />}
            <aside className={`fixed inset-y-0 right-0 z-50 bg-slate-900 transform transition-transform duration-300 ease-out shadow-2xl border-l border-slate-800 ${isRankingOpen ? 'translate-x-0' : 'translate-x-full'}`}>
               <div className="h-full flex flex-col">
                  <div className="flex justify-end p-2"><button onClick={() => setIsRankingOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button></div>
                  <ScoreSidebar teams={teams} onUpdateHistory={updateHistoryScore} round={round} />
               </div>
            </aside>
          </>
        )}
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} teams={teams} setTeams={setTeams} />
      {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-lg shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-bottom fade-in duration-300 z-[100] whitespace-nowrap"><div className="bg-emerald-500/20 p-2 rounded-full"><Save size={20} className="text-emerald-400" /></div><div><p className="font-bold text-sm">Notificación</p><p className="text-xs text-slate-300">{toast}</p></div></div>}
    </div>
  );
}
