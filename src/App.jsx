import React, { useState, useEffect } from 'react';
import { RotateCw, Save, Hash, Medal, Settings, X, Edit2, User, ChevronDown, ChevronUp, AlertCircle, History, CheckCircle2, Lock, Unlock, Trophy } from 'lucide-react';

// --- COMPONENTES UI AUXILIARES ---

const Button = ({ onClick, disabled, children, variant = 'primary', className = "" }) => {
  const baseStyle = "px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-80";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:bg-slate-800",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    success: "bg-green-600 hover:bg-green-500 text-white shadow-emerald-900/50 shadow-lg",
    icon: "p-2 bg-transparent hover:bg-white/10 text-slate-300 rounded-full shadow-none"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
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

// --- COMPONENTES DE VISTA ---

const PlayerAvatar = ({ name }) => (
  <div className="flex flex-col items-center justify-center pointer-events-none">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 border-2 border-slate-400 shadow-md flex items-center justify-center text-slate-800 font-bold text-xs sm:text-sm overflow-hidden">
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
    <span className="text-[10px] text-emerald-100 max-w-[64px] truncate mt-1 font-medium bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
      {name || 'Jugador'}
    </span>
  </div>
);

const TableCard = ({ match, round, scores, onScoreChange, onToggleStatus }) => {
  const isCompleted = match.isCompleted;
  const score1 = scores[match.id]?.team1Score ?? '';
  const score2 = scores[match.id]?.team2Score ?? '';
  const hasScores = score1 !== '' && score2 !== '';

  return (
    <div className="relative group animate-in zoom-in-95 duration-300 w-full max-w-md mx-auto">
      {/* Mesa Visual */}
      <div className={`
        rounded-3xl border-[6px] shadow-2xl aspect-[4/3] flex flex-col relative overflow-hidden ring-1 ring-white/10 transition-all duration-500
        ${isCompleted ? 'bg-emerald-900 border-emerald-600/60 grayscale-[0.2]' : 'bg-emerald-800 border-amber-900/60'}
      `}>
        
        {/* Textura */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-40 pointer-events-none"></div>
        
        {/* Overlay de "Cerrada" */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/10 pointer-events-none z-10 flex items-center justify-center">
            <div className="bg-emerald-600/90 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl backdrop-blur-sm border border-emerald-400/30">
              Mesa Cerrada
            </div>
          </div>
        )}

        {/* Etiqueta Central - MESA y RONDA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center gap-1">
           <div className="bg-black/40 backdrop-blur-md text-white/90 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
             Mesa {match.table}
           </div>
           <div className="text-[9px] text-white/60 font-mono bg-black/20 px-2 rounded">Ronda {round}</div>
        </div>

        {/* Equipo 1 (Arriba) */}
        <div className="flex-1 flex flex-col items-center pt-3 z-20">
           <div className="font-bold text-white text-base drop-shadow-md mb-0.5 px-2 text-center leading-tight">
             {match.team1.player1} & {match.team1.player2}
           </div>
           
           <div className="flex items-end gap-3 w-full justify-center px-2 relative">
             <PlayerAvatar name={match.team1.player1} />
             <input
               type="text"
               inputMode="numeric"
               disabled={isCompleted}
               className={`w-20 text-center rounded-xl py-1 text-2xl font-bold text-white placeholder:text-white/10 transition-all mx-1 mb-2 shadow-inner
                 ${isCompleted 
                   ? 'bg-transparent border-none text-emerald-200' 
                   : 'bg-black/20 border-2 border-white/10 focus:bg-black/50 focus:outline-none focus:border-emerald-400'
                 }
               `}
               placeholder="-"
               value={score1}
               onChange={(e) => onScoreChange(match.id, 'team1Score', e.target.value)}
             />
             <PlayerAvatar name={match.team1.player2} />
           </div>
        </div>

        {/* Línea Divisoria */}
        <div className="h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

        {/* Equipo 2 (Abajo) */}
        <div className="flex-1 flex flex-col items-center justify-end pb-3 z-20">
           <div className="flex items-start gap-3 w-full justify-center px-2 relative mb-1">
             <PlayerAvatar name={match.team2.player1} />
             <input
               type="text"
               inputMode="numeric"
               disabled={isCompleted}
               className={`w-20 text-center rounded-xl py-1 text-2xl font-bold text-white placeholder:text-white/10 transition-all mx-1 mt-2 shadow-inner
                 ${isCompleted 
                   ? 'bg-transparent border-none text-emerald-200' 
                   : 'bg-black/20 border-2 border-white/10 focus:bg-black/50 focus:outline-none focus:border-emerald-400'
                 }
               `}
               placeholder="-"
               value={score2}
               onChange={(e) => onScoreChange(match.id, 'team2Score', e.target.value)}
             />
             <PlayerAvatar name={match.team2.player2} />
           </div>
           <div className="font-bold text-white text-base drop-shadow-md px-2 text-center leading-tight">
             {match.team2.player1} & {match.team2.player2}
           </div>
        </div>
      </div>

      {/* Botón de Acción Individual */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => onToggleStatus(match.id)}
          disabled={!isCompleted && !hasScores}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-lg transition-all active:scale-95
            ${isCompleted 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-500' 
              : hasScores 
                ? 'bg-emerald-500 text-white hover:bg-emerald-400 border border-emerald-300'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}
          `}
        >
          {isCompleted ? (
            <> <Unlock size={12} /> EDITAR </>
          ) : (
            <> <CheckCircle2 size={14} /> CONFIRMAR </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- SIDEBAR (TABLA GENERAL) ---
const ScoreSidebar = ({ teams, onUpdateHistory, round }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl w-full sm:w-96 max-w-[90vw]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Medal size={18} className="text-emerald-400" /> Tabla General
          </h3>
          <p className="text-xs text-slate-500 mt-1">Ronda actual: {round}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
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
const SetupView = ({ teams, setTeams, onStart }) => (
  <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">
    <div className="text-center space-y-2 py-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Registro de Parejas</h2>
      <p className="text-slate-400">Configuración inicial del torneo.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((team, index) => (
        <div key={team.id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex flex-col gap-2">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 flex items-center justify-center bg-emerald-900/50 text-emerald-400 rounded text-xs font-bold border border-emerald-700/30">
              #{index + 1}
            </div>
            <span className="text-slate-400 text-xs font-bold uppercase">Mesa {Math.floor(index/2) + 1}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={team.player1}
              onChange={(e) => {
                const newTeams = [...teams];
                newTeams[index].player1 = e.target.value;
                setTeams(newTeams);
              }}
              placeholder="Jugador 1"
              className="text-sm"
            />
            <Input
              value={team.player2}
              onChange={(e) => {
                const newTeams = [...teams];
                newTeams[index].player2 = e.target.value;
                setTeams(newTeams);
              }}
              placeholder="Jugador 2"
              className="text-sm"
            />
          </div>
        </div>
      ))}
    </div>

    {/* Botón de inicio fijo abajo en setup también */}
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur border-t border-slate-800 z-30 flex justify-center">
      <Button onClick={onStart} className="w-full max-w-md py-4 text-lg shadow-xl shadow-emerald-900/40">
        <RotateCw size={20} /> Iniciar Torneo
      </Button>
    </div>
  </div>
);

// --- PANTALLA ACTIVA ---
const ActiveRoundView = ({ round, matches, scores, onScoreChange, onToggleStatus, onFinishRound }) => {
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
        <div className="flex items-center text-sm text-slate-400 bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-700">
          <AlertCircle size={14} className="mr-2 text-emerald-500" />
          Confirma mesas para desbloquear avance
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-12 justify-items-center">
        {matches.map((match) => (
          <TableCard 
            key={match.id} 
            match={match} 
            round={round}
            scores={scores} 
            onScoreChange={onScoreChange}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>

      {/* BARRA DE ACCIÓN FIJA SIEMPRE VISIBLE */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-40 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <Button 
           onClick={onFinishRound} 
           disabled={!allCompleted}
           variant={allCompleted ? "success" : "primary"}
           className="w-full max-w-lg py-4 text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
         >
          {allCompleted ? (
            <span className="flex items-center gap-2"><RotateCw size={22} /> ¡CERRAR RONDA {round}!</span>
          ) : (
            <span className="flex items-center gap-2 text-slate-400"><Lock size={20} /> Faltan Mesas por Confirmar</span>
          )}
        </Button>
      </div>
    </div>
  );
};

// --- PANTALLA RANKING ---
const RankingView = ({ round, teams, onNextRound }) => {
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-32 max-w-4xl mx-auto">
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-full mb-4">
          <Trophy className="text-emerald-400" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Resultados Ronda {round}</h2>
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
                {idx === 0 ? <Medal className="text-yellow-400 drop-shadow-lg" size={26} /> : 
                 idx === 1 ? <Medal className="text-slate-300 drop-shadow-lg" size={24} /> :
                 idx === 2 ? <Medal className="text-amber-700 drop-shadow-lg" size={24} /> :
                 <span className="font-bold text-slate-500 text-lg">#{idx + 1}</span>}
              </div>
              <div className="col-span-7 flex flex-col">
                <span className="font-bold text-slate-200 text-base">{team.player1} & {team.player2}</span>
                {idx < 2 && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide mt-0.5">Líderes (Mesa 1)</span>}
              </div>
              <div className="col-span-3 text-center font-black text-emerald-400 text-xl">
                {team.totalPoints}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de acción fija para ranking también */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-40 flex justify-center">
        <Button onClick={onNextRound} className="w-full max-w-lg py-4 text-lg shadow-emerald-900/50 shadow-lg">
          Comenzar Ronda {round + 1} <RotateCw size={20} />
        </Button>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function DominoTournamentApp() {
  const [step, setStep] = useState('setup'); 
  const [teams, setTeams] = useState(Array(10).fill('').map((_, i) => ({ 
    id: i, 
    player1: '', 
    player2: '', 
    totalPoints: 0, 
    history: [] 
  })));
  const [round, setRound] = useState(1);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [scores, setScores] = useState({}); 
  const [toast, setToast] = useState(null);
  
  // Estados de Modales / Paneles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false); 

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  // LOGICA DE JUEGO
  const sortTeamsByScore = (teamList) => [...teamList].sort((a, b) => b.totalPoints - a.totalPoints);

  const startTournament = () => {
    const initializedTeams = teams.map((t, i) => ({
      ...t,
      player1: t.player1.trim() || `Jugador A${i+1}`,
      player2: t.player2.trim() || `Jugador B${i+1}`
    }));
    setTeams(initializedTeams);
    
    const sortedTeams = sortTeamsByScore(initializedTeams);
    generateMatches(sortedTeams);
    setStep('active');
    showToast("¡Torneo Iniciado!");
  };

  const generateMatches = (rankedTeams) => {
    const matches = [];
    for (let i = 0; i < rankedTeams.length; i += 2) {
      matches.push({
        id: `R${round}-M${(i/2)+1}`,
        table: (i / 2) + 1,
        team1: rankedTeams[i],
        team2: rankedTeams[i + 1],
        isCompleted: false 
      });
    }
    setCurrentMatches(matches);
    setScores({});
  };

  const handleScoreChange = (matchId, teamKey, value) => {
    if (value && !/^\d*$/.test(value)) return;
    setScores(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [teamKey]: value }
    }));
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

    setCurrentMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, isCompleted: !m.isCompleted } : m
    ));
  };

  const finishRound = () => {
    if (!currentMatches.every(m => m.isCompleted)) {
      showToast("⚠️ Faltan mesas por confirmar.");
      return;
    }

    const updatedTeams = teams.map(team => {
      let roundScore = 0;
      const match = currentMatches.find(m => m.team1.id === team.id || m.team2.id === team.id);
      if (match) {
        const s = scores[match.id];
        roundScore = match.team1.id === team.id ? Number(s.team1Score) : Number(s.team2Score);
      }
      const newHistory = [...team.history, roundScore];
      return {
        ...team,
        history: newHistory,
        totalPoints: newHistory.reduce((a, b) => a + b, 0)
      };
    });

    setTeams(updatedTeams);
    setStep('ranking');
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    const sortedTeams = sortTeamsByScore(teams);
    generateMatches(sortedTeams);
    setStep('active');
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
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Edit2 size={18} className="text-emerald-400"/> Corregir Nombres
            </h3>
            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white p-2">
              <X size={24} />
            </button>
          </div>
          <div className="overflow-y-auto p-4 space-y-4 flex-1">
            {teams.map((team, idx) => (
              <div key={team.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">Pareja #{idx + 1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    value={team.player1}
                    onChange={(e) => {
                      const newTeams = [...teams];
                      newTeams[idx].player1 = e.target.value;
                      setTeams(newTeams);
                    }}
                    placeholder="Jugador 1"
                  />
                  <Input 
                    value={team.player2}
                    onChange={(e) => {
                      const newTeams = [...teams];
                      newTeams[idx].player2 = e.target.value;
                      setTeams(newTeams);
                    }}
                    placeholder="Jugador 2"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
            <Button onClick={() => setIsSettingsOpen(false)} className="w-full">Listo</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0 h-16 z-50 shadow-lg">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-2 rounded-lg shadow-lg">
              <Hash className="text-white" size={20} />
            </div>
            <h1 className="font-black text-xl tracking-tight text-white">
              Domino<span className="text-emerald-500">Master</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {/* Botón de Tabla General (Visible siempre) */}
             <Button 
               variant="icon" 
               onClick={() => setIsRankingOpen(!isRankingOpen)} 
               className={`text-emerald-400 transition-colors ${isRankingOpen ? 'bg-white/10' : ''}`}
               title="Ver Tabla General"
             >
               <Medal size={24} />
               <span className="hidden sm:inline text-sm font-bold ml-1">Tabla</span>
             </Button>
            {step !== 'setup' && (
              <Button variant="icon" onClick={() => setIsSettingsOpen(true)} title="Editar Nombres">
                <Settings size={20} />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Layout Principal */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth w-full">
          <div className="max-w-7xl mx-auto">
            {step === 'setup' && (
              <SetupView 
                teams={teams} 
                setTeams={setTeams} 
                onStart={startTournament} 
              />
            )}
            {step === 'active' && (
              <ActiveRoundView 
                round={round} 
                matches={currentMatches} 
                scores={scores} 
                onScoreChange={handleScoreChange}
                onToggleStatus={toggleMatchStatus}
                onFinishRound={finishRound}
              />
            )}
            {step === 'ranking' && <RankingView round={round} teams={teams} onNextRound={nextRound} />}
          </div>
        </main>

        {/* SIDEBAR TIPO DRAWER (FLOTANTE EN TODAS LAS PANTALLAS) */}
        {step !== 'setup' && (
          <>
            {/* Overlay oscuro */}
            {isRankingOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={() => setIsRankingOpen(false)}
              />
            )}
            
            {/* Panel Deslizable */}
            <aside className={`
              fixed inset-y-0 right-0 z-50 bg-slate-900 transform transition-transform duration-300 ease-out shadow-2xl border-l border-slate-800
              ${isRankingOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
               <div className="h-full flex flex-col">
                  <div className="flex justify-end p-2">
                    <button onClick={() => setIsRankingOpen(false)} className="p-2 text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <ScoreSidebar teams={teams} onUpdateHistory={updateHistoryScore} round={round} />
               </div>
            </aside>
          </>
        )}
      </div>

      {/* Modales y Toast */}
      <SettingsModal />
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-lg shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-bottom fade-in duration-300 z-[100] whitespace-nowrap">
          <div className="bg-emerald-500/20 p-2 rounded-full">
            <Save size={20} className="text-emerald-400" />
          </div>
          <div>
             <p className="font-bold text-sm">Notificación</p>
             <p className="text-xs text-slate-300">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}