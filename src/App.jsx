import React, { useState, useEffect } from 'react';
import { RotateCw, Save, Hash, Medal, Settings, X, Edit2, User, ChevronDown, ChevronUp, AlertCircle, History, CheckCircle2, Lock, Unlock, Trophy, Trash2, Crown, Clock, Timer } from 'lucide-react';

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
  const baseStyle = "px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-80";
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

const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-500 ${className}`}
  />
);

// --- VISTAS AUXILIARES (Avatar Mejorado) ---

const PlayerAvatar = ({ name, position }) => {
  const isHorizontal = position === 'left' || position === 'right';
  
  return (
    <div className={`flex flex-col items-center justify-center pointer-events-none absolute ${
      position === 'top' ? '-top-5 left-1/2 -translate-x-1/2' :
      position === 'bottom' ? '-bottom-5 left-1/2 -translate-x-1/2' :
      position === 'left' ? '-left-4 top-1/2 -translate-y-1/2' :
      '-right-4 top-1/2 -translate-y-1/2'
    }`}>
      <div className={`w-10 h-10 rounded-full bg-slate-200 border-2 ${isHorizontal ? 'border-amber-500' : 'border-emerald-500'} shadow-lg flex items-center justify-center text-slate-900 font-bold text-sm overflow-hidden z-20`}>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>
      <span className="text-[9px] text-white font-bold bg-black/60 px-2 py-0.5 rounded-full mt-1 backdrop-blur-sm whitespace-nowrap max-w-[80px] truncate border border-white/10 shadow-sm z-20">
        {name || 'Jugador'}
      </span>
    </div>
  );
};

// --- CRONÓMETRO ---
const RoundTimer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!targetTime) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime) return null;

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const isUrgent = minutes < 5;
  const isExpired = timeLeft === 0;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-xl shadow-lg border ${isExpired ? 'bg-red-900/80 border-red-500 text-red-200 animate-pulse' : isUrgent ? 'bg-amber-900/50 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-600 text-emerald-400'}`}>
      <Clock size={20} className={isExpired ? 'animate-bounce' : ''} />
      <span>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      {isExpired && <span className="text-xs uppercase ml-1">¡Tiempo!</span>}
    </div>
  );
};

const TableCard = ({ match, round, scores, onScoreChange, onToggleStatus }) => {
  const isCompleted = match.isCompleted;
  const score1 = scores[match.id]?.team1Score ?? '';
  const score2 = scores[match.id]?.team2Score ?? '';

  return (
    <div className="relative group animate-in zoom-in-95 duration-300 w-full max-w-md mx-auto my-8"> 
      
      {/* Base de la Mesa (Suelo) */}
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700 aspect-square relative">
        
        {/* El Paño Verde (Mesa Real) */}
        <div className={`absolute inset-8 rounded-xl shadow-inner border-4 ${isCompleted ? 'bg-emerald-900 border-emerald-700 grayscale' : 'bg-emerald-700 border-amber-800'} transition-all duration-500 overflow-visible`}>
            
            {/* Textura Paño */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-40 pointer-events-none rounded-lg"></div>

            {/* Etiqueta Mesa Central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-30 pointer-events-none flex flex-col items-center">
                <div className="text-4xl font-black text-black/50 uppercase tracking-widest">Mesa</div>
                <div className="text-6xl font-black text-black/50">{match.table}</div>
            </div>

            {/* --- JUGADORES (SENTADOS) --- */}
            <PlayerAvatar name={match.team1.player1} position="top" />
            <PlayerAvatar name={match.team1.player2} position="bottom" />
            <PlayerAvatar name={match.team2.player1} position="left" />
            <PlayerAvatar name={match.team2.player2} position="right" />

            {/* --- INPUTS DE PUNTUACIÓN --- */}
            <div className="absolute inset-0 flex flex-col justify-between py-12 px-8 z-10">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider drop-shadow-md bg-black/20 px-2 rounded">Pareja 1 (N/S)</span>
                    <input type="text" inputMode="numeric" disabled={isCompleted} className={`w-20 text-center rounded-lg py-1 text-2xl font-bold text-white placeholder:text-white/20 transition-all shadow-lg border-2 ${isCompleted ? 'bg-transparent border-none' : 'bg-black/30 border-emerald-400/50 focus:bg-black/50 focus:border-emerald-400 focus:outline-none'}`} placeholder="0" value={score1} onChange={(e) => onScoreChange(match.id, 'team1Score', e.target.value)} />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-white/10"></div>
                <div className="flex flex-col items-center gap-1">
                     <input type="text" inputMode="numeric" disabled={isCompleted} className={`w-20 text-center rounded-lg py-1 text-2xl font-bold text-white placeholder:text-white/20 transition-all shadow-lg border-2 ${isCompleted ? 'bg-transparent border-none' : 'bg-black/30 border-amber-500/50 focus:bg-black/50 focus:border-amber-500 focus:outline-none'}`} placeholder="0" value={score2} onChange={(e) => onScoreChange(match.id, 'team2Score', e.target.value)} />
                    <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider drop-shadow-md bg-black/20 px-2 rounded">Pareja 2 (E/O)</span>
                </div>
            </div>

            {/* Overlay Cerrada */}
            {isCompleted && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30 flex items-center justify-center rounded-lg">
                   <Lock className="text-white/50 w-12 h-12" />
                </div>
            )}
        </div>
      </div>

      {/* Botón de Acción Individual - MOVIDO MÁS ABAJO */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center">
        <button onClick={() => onToggleStatus(match.id)} disabled={!isCompleted && (score1 === '' || score2 === '')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs shadow-xl transition-all active:scale-95 transform hover:-translate-y-1 ${isCompleted ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-500' : (score1 !== '' && score2 !== '') ? 'bg-emerald-500 text-white hover:bg-emerald-400 border border-emerald-300 ring-4 ring-emerald-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}>
          {isCompleted ? <><Unlock size={14} /> CORREGIR</> : <><CheckCircle2 size={16} /> CONFIRMAR RESULTADO</>}
        </button>
      </div>
    </div>
  );
};

// --- PANTALLA DE REGISTRO ---
const SetupView = ({ teams, setTeams, config, setConfig, onStart }) => {
  const handleTableCountChange = (val) => {
    const count = Math.max(1, parseInt(val) || 1);
    setConfig(prev => ({ ...prev, totalTables: count }));
    
    const newTeamCount = count * 2;
    const currentTeams = [...teams];
    
    if (newTeamCount > currentTeams.length) {
      const added = Array(newTeamCount - currentTeams.length).fill(null).map((_, i) => ({
        id: currentTeams.length + i, player1: '', player2: '', totalPoints: 0, history: []
      }));
      setTeams([...currentTeams, ...added]);
    } else {
      setTeams(currentTeams.slice(0, newTeamCount));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-24">
      <div className="text-center space-y-2 py-6">
        <h2 className="text-3xl font-black text-white tracking-tight">Configuración del Torneo</h2>
        <p className="text-slate-400">Define las reglas y registra a los participantes.</p>
      </div>

      {/* Panel de Reglas */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><Settings size={20}/> Reglas de Juego</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mesas (2 Parejas c/u)</label>
            <input type="number" min="1" max="50" value={config.totalTables} onChange={(e) => handleTableCountChange(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rondas Totales</label>
            <input type="number" min="1" max="20" value={config.totalRounds} onChange={(e) => setConfig(prev => ({ ...prev, totalRounds: Math.max(1, parseInt(e.target.value) || 1) }))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tiempo (Min/Ronda)</label>
            <input type="number" min="0" max="120" placeholder="0 = Sin Límite" value={config.minutesPerRound} onChange={(e) => setConfig(prev => ({ ...prev, minutesPerRound: Math.max(0, parseInt(e.target.value) || 0) }))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
            <span className="text-[10px] text-slate-500 block text-center mt-1">0 = Sin límite</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><User size={20}/> Registro de Parejas ({teams.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <div key={team.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col gap-3 relative group focus-within:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 flex items-center justify-center bg-emerald-900/50 text-emerald-400 rounded text-xs font-bold border border-emerald-700/30">#{index + 1}</div>
                   <span className="text-slate-400 text-xs font-bold uppercase">Mesa Inicial {Math.floor(index/2) + 1}</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={team.player1} onChange={(e) => { const t = [...teams]; t[index].player1 = e.target.value; setTeams(t); }} placeholder="Jugador 1" className="text-sm" />
                <Input value={team.player2} onChange={(e) => { const t = [...teams]; t[index].player2 = e.target.value; setTeams(t); }} placeholder="Jugador 2" className="text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800 z-30 flex justify-center">
        <Button onClick={onStart} className="w-full max-w-md py-4 text-lg shadow-xl shadow-emerald-900/40">
          <RotateCw size={20} /> Comenzar Torneo ({config.totalRounds} Rondas)
        </Button>
      </div>
    </div>
  );
};

const ActiveRoundView = ({ round, matches, scores, onScoreChange, onToggleStatus, onFinishRound, roundEndTime }) => {
  const allCompleted = matches.every(m => m.isCompleted);
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-32">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span className="bg-emerald-600 text-white text-sm px-2 py-1 rounded font-mono">Ronda {round}</span>
            <span className="hidden sm:inline">En Juego</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
             {roundEndTime && <RoundTimer targetTime={roundEndTime} />}
        </div>
      </div>

      {/* GRID CON MÁS ESPACIO VERTICAL (gap-y-24) PARA EVITAR SOLAPAMIENTO */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-24 justify-items-center pt-4">
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

const RankingView = ({ round, teams, onNextRound, totalRounds }) => {
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  const isFinalRound = round >= totalRounds;
  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-32 max-w-4xl mx-auto">
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-full mb-4"><Trophy className="text-emerald-400" size={40} /></div>
        <h2 className="text-3xl font-bold text-white mb-2">{isFinalRound ? "Resultados Finales" : `Resultados Ronda ${round}`}</h2>
        <p className="text-slate-400">{isFinalRound ? "Torneo completado. ¡Veamos a los campeones!" : `Progreso: ${round} de ${totalRounds} rondas jugadas.`}</p>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 gap-2 p-4 bg-slate-900/80 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-700">
          <div className="col-span-2 text-center">#</div>
          <div className="col-span-7">Pareja</div>
          <div className="col-span-3 text-center">Total</div>
        </div>
        <div className="divide-y divide-slate-700/50">
          {sortedTeams.map((team, idx) => (
            <div key={team.id} className={`grid grid-cols-12 gap-2 p-4 items-center transition-colors ${idx < 2 ? 'bg-emerald-900/10' : 'hover:bg-slate-700/30'}`}>
              <div className="col-span-2 flex justify-center">
                {idx === 0 ? <Medal className="text-yellow-400 drop-shadow-lg" size={26} /> : idx === 1 ? <Medal className="text-slate-300 drop-shadow-lg" size={24} /> : idx === 2 ? <Medal className="text-amber-700 drop-shadow-lg" size={24} /> : <span className="font-bold text-slate-500 text-lg">#{idx + 1}</span>}
              </div>
              <div className="col-span-7 flex flex-col">
                <span className="font-bold text-slate-200 text-base">{team.player1} & {team.player2}</span>
                {idx < 2 && !isFinalRound && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide mt-0.5">Líderes (Mesa 1)</span>}
              </div>
              <div className="col-span-3 text-center font-black text-emerald-400 text-xl">{team.totalPoints}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-40 flex justify-center">
        {isFinalRound ? (
           <Button onClick={onNextRound} variant="gold" className="w-full max-w-lg py-4 text-lg shadow-xl animate-pulse"><Crown size={24} /> Ver Ganadores y Ceremonia</Button>
        ) : (
           <Button onClick={onNextRound} className="w-full max-w-lg py-4 text-lg shadow-emerald-900/50 shadow-lg">Comenzar Ronda {round + 1} <RotateCw size={20} /></Button>
        )}
      </div>
    </div>
  );
};

const ScoreSidebar = ({ teams, onUpdateHistory, round }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  return (
    <div className="bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl w-full sm:w-96 max-w-[90vw]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
        <div><h3 className="text-lg font-bold text-white flex items-center gap-2"><Medal size={18} className="text-emerald-400" /> Tabla General</h3><p className="text-xs text-slate-500 mt-1">Ronda actual: {round}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sortedTeams.map((team, idx) => (
          <div key={team.id} className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${idx < 3 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>{idx + 1}</div>
                <div className="flex flex-col min-w-0"><span className="font-bold text-sm text-slate-200 truncate">{team.player1} / {team.player2}</span><span className="text-[10px] text-slate-500">Pareja #{team.id + 1}</span></div>
              </div>
              <div className="flex items-center gap-2"><span className="text-lg font-black text-emerald-400">{team.totalPoints}</span>{expandedTeam === team.id ? <ChevronUp size={16} className="text-slate-500"/> : <ChevronDown size={16} className="text-slate-500"/>}</div>
            </div>
            {expandedTeam === team.id && (
              <div className="bg-slate-950/50 p-3 border-t border-slate-700 space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><History size={12} /> Historial (Editable)</div>
                {team.history.map((points, roundIdx) => (
                  <div key={roundIdx} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800"><span className="text-xs text-slate-400 font-medium">R {roundIdx + 1}</span><input type="number" className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-right text-sm text-white font-mono focus:border-emerald-500 focus:outline-none" value={points} onChange={(e) => onUpdateHistory(team.id, roundIdx, e.target.value)} /></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const WinnerView = ({ teams, onReset }) => {
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  const [showConfetti, setShowConfetti] = useState(true);
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 p-4 animate-in zoom-in-90 duration-700">
      {showConfetti && <div className="fixed inset-0 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>}
      <div className="space-y-2 z-10">
        <div className="inline-flex p-4 bg-yellow-500/20 rounded-full mb-4 ring-4 ring-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.4)]"><Trophy className="text-yellow-400" size={64} /></div>
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight">¡CAMPEONES!</h1><p className="text-slate-400 text-lg">El torneo ha finalizado.</p>
      </div>
      <div className="w-full max-w-md space-y-4 z-10">
        <div className="bg-gradient-to-r from-yellow-900/80 to-yellow-600/20 border border-yellow-500/50 p-6 rounded-2xl shadow-2xl transform scale-105 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 text-yellow-500/10"><Crown size={120}/></div>
           <div className="flex items-center justify-between relative">
             <div className="text-left"><span className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-1 block">1er Lugar</span><div className="text-2xl font-black text-white">{sortedTeams[0].player1} & {sortedTeams[0].player2}</div></div>
             <div className="text-4xl font-black text-yellow-400">{sortedTeams[0].totalPoints} <span className="text-base font-medium text-yellow-200/60">pts</span></div>
           </div>
        </div>
        {sortedTeams[1] && <div className="bg-slate-800/80 border border-slate-600 p-4 rounded-xl flex items-center justify-between shadow-lg"><div className="flex items-center gap-4"><div className="bg-slate-300 text-slate-900 font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">2</div><div className="text-left font-bold text-slate-200 text-lg">{sortedTeams[1].player1} & {sortedTeams[1].player2}</div></div><div className="font-bold text-slate-400">{sortedTeams[1].totalPoints} pts</div></div>}
        {sortedTeams[2] && <div className="bg-amber-900/40 border border-amber-800/50 p-4 rounded-xl flex items-center justify-between shadow-lg"><div className="flex items-center gap-4"><div className="bg-amber-700 text-amber-100 font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">3</div><div className="text-left font-bold text-amber-200/80 text-lg">{sortedTeams[2].player1} & {sortedTeams[2].player2}</div></div><div className="font-bold text-amber-600">{sortedTeams[2].totalPoints} pts</div></div>}
      </div>
      <div className="pt-12 z-10"><Button onClick={onReset} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-8 py-4 text-lg shadow-xl"><RotateCw className="mr-2" size={20}/> Iniciar Nuevo Torneo</Button></div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function DominoTournamentApp() {
  const [step, setStep] = useStickyState('setup', 'domino_step');
  const [config, setConfig] = useStickyState({ totalTables: 5, totalRounds: 5, minutesPerRound: 0 }, 'domino_config');
  const [teams, setTeams] = useStickyState(Array(10).fill('').map((_, i) => ({ id: i, player1: '', player2: '', totalPoints: 0, history: [] })), 'domino_teams');
  const [round, setRound] = useStickyState(1, 'domino_round');
  const [currentMatches, setCurrentMatches] = useStickyState([], 'domino_matches');
  const [scores, setScores] = useStickyState({}, 'domino_scores');
  const [roundEndTime, setRoundEndTime] = useStickyState(null, 'domino_timer_end'); // Persistencia del timer
  
  const [toast, setToast] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false); 

  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
  const showToast = (msg) => setToast(msg);
  const sortTeamsByScore = (teamList) => [...teamList].sort((a, b) => b.totalPoints - a.totalPoints);

  // --- LOGICA ---
  const startTournament = () => {
    const initializedTeams = teams.map((t, i) => ({ ...t, player1: t.player1.trim() || `Jugador A${i+1}`, player2: t.player2.trim() || `Jugador B${i+1}`, totalPoints: 0, history: [] }));
    setTeams(initializedTeams);
    setRound(1);
    
    // Iniciar Timer si aplica
    if (config.minutesPerRound > 0) {
      setRoundEndTime(Date.now() + config.minutesPerRound * 60 * 1000);
    } else {
      setRoundEndTime(null);
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
    }
    setCurrentMatches(prev => prev.map(m => m.id === matchId ? { ...m, isCompleted: !m.isCompleted } : m));
  };

  const finishRound = () => {
    if (!currentMatches.every(m => m.isCompleted)) { showToast("⚠️ Faltan mesas por confirmar."); return; }
    const updatedTeams = teams.map(team => {
      let roundScore = 0;
      const match = currentMatches.find(m => m.team1.id === team.id || m.team2.id === team.id);
      if (match) {
        const s = scores[match.id];
        roundScore = match.team1.id === team.id ? Number(s.team1Score) : Number(s.team2Score);
      }
      const newHistory = [...team.history, roundScore];
      return { ...team, history: newHistory, totalPoints: newHistory.reduce((a, b) => a + b, 0) };
    });
    setTeams(updatedTeams);
    setRoundEndTime(null); // Pausar timer entre rondas
    setStep('ranking');
  };

  const nextRound = () => {
    if (round >= config.totalRounds) {
      setStep('winner');
    } else {
      const nextR = round + 1;
      setRound(nextR);
      
      // Reiniciar Timer para la nueva ronda
      if (config.minutesPerRound > 0) {
        setRoundEndTime(Date.now() + config.minutesPerRound * 60 * 1000);
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

  const SettingsModal = () => {
    if (!isSettingsOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-white text-lg flex items-center gap-2"><Edit2 size={18} className="text-emerald-400"/> Corregir Nombres</h3>
            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white p-2"><X size={24} /></button>
          </div>
          <div className="overflow-y-auto p-4 space-y-4 flex-1">
            {teams.map((team, idx) => (
              <div key={team.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">Pareja #{idx + 1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={team.player1} onChange={(e) => { const newTeams = [...teams]; newTeams[idx].player1 = e.target.value; setTeams(newTeams); }} placeholder="Jugador 1" />
                  <Input value={team.player2} onChange={(e) => { const newTeams = [...teams]; newTeams[idx].player2 = e.target.value; setTeams(newTeams); }} placeholder="Jugador 2" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700 bg-slate-800/50"><Button onClick={() => setIsSettingsOpen(false)} className="w-full">Listo</Button></div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <header className="bg-slate-900 border-b border-slate-800 shrink-0 h-16 z-50 shadow-lg">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-2 rounded-lg shadow-lg"><Hash className="text-white" size={20} /></div>
            <h1 className="font-black text-xl tracking-tight text-white">Domino<span className="text-emerald-500">Master</span></h1>
          </div>
          <div className="flex items-center gap-3">
             {step !== 'winner' && step !== 'setup' && <Button variant="icon" onClick={() => setIsRankingOpen(!isRankingOpen)} className={`text-emerald-400 transition-colors ${isRankingOpen ? 'bg-white/10' : ''}`} title="Ver Tabla General"><Medal size={24} /><span className="hidden sm:inline text-sm font-bold ml-1">Tabla</span></Button>}
             {step !== 'setup' && step !== 'winner' && <Button variant="icon" onClick={() => setIsSettingsOpen(true)} title="Editar Nombres"><Settings size={20} /></Button>}
             {step !== 'setup' && <Button variant="icon" onClick={resetTournament} title="Reiniciar Torneo" className="text-red-400 hover:text-red-300 bg-red-900/10 hover:bg-red-900/30 ml-2"><Trash2 size={20} /></Button>}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth w-full">
          <div className="max-w-7xl mx-auto">
            {step === 'setup' && <SetupView teams={teams} setTeams={setTeams} config={config} setConfig={setConfig} onStart={startTournament} />}
            {step === 'active' && <ActiveRoundView round={round} matches={currentMatches} scores={scores} onScoreChange={handleScoreChange} onToggleStatus={toggleMatchStatus} onFinishRound={finishRound} roundEndTime={roundEndTime} />}
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
      <SettingsModal />
      {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-lg shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-bottom fade-in duration-300 z-[100] whitespace-nowrap"><div className="bg-emerald-500/20 p-2 rounded-full"><Save size={20} className="text-emerald-400" /></div><div><p className="font-bold text-sm">Notificación</p><p className="text-xs text-slate-300">{toast}</p></div></div>}
    </div>
  );
}
