import React, { useState, useEffect, useRef } from "react";
import { Target, Zap, RotateCcw, Trophy, Activity, Play } from "lucide-react";

interface AimTrainerGameViewProps {
  onScoreUpdate: (newScore: number) => void;
}

interface TargetTarget {
  id: number;
  x: number; // percentage 10% - 90%
  y: number; // percentage 10% - 85%
  size: number;
  spawnTime: number;
}

export const AimTrainerGameView: React.FC<AimTrainerGameViewProps> = ({ onScoreUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactions, setReactions] = useState<number[]>([]);
  const [currentTarget, setCurrentTarget] = useState<TargetTarget | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTraining = () => {
    setIsPlaying(true);
    setTimeLeft(15);
    setHits(0);
    setMisses(0);
    setReactions([]);
    spawnNextTarget();
  };

  const spawnNextTarget = () => {
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 70) + 10;
    const size = Math.floor(Math.random() * 15) + 35; // 35px - 50px
    setCurrentTarget({
      id: Date.now(),
      x,
      y,
      size,
      spawnTime: Date.now(),
    });
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Compute score
      const finalScore = Math.max(0, hits * 100 - misses * 30);
      onScoreUpdate(finalScore);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying || !currentTarget) return;

    const reactionTime = Date.now() - currentTarget.spawnTime;
    setHits((prev) => prev + 1);
    setReactions((prev) => [...prev, reactionTime]);
    spawnNextTarget();
  };

  const handleMissClick = () => {
    if (!isPlaying) return;
    setMisses((prev) => prev + 1);
  };

  const avgReaction = reactions.length
    ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length)
    : 0;

  const totalClicks = hits + misses;
  const accuracy = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
  const score = Math.max(0, hits * 100 - misses * 30);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400 animate-pulse" />
            CS2 Cyber Reflex & AI Aim Trainer
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">Онилгоо ба Рефлексийн Танхим</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-mono">
            ⏱ <span className="font-bold text-amber-400">{timeLeft}s</span>
          </div>
          <button
            onClick={startTraining}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? "Дахин эхлэх" : "Эхлэх"}
          </button>
        </div>
      </div>

      {/* Target Canvas Board */}
      <div
        onClick={handleMissClick}
        className="relative bg-slate-950 rounded-2xl border-2 border-slate-800 min-h-[300px] h-[340px] w-full overflow-hidden cursor-crosshair flex flex-col items-center justify-center select-none"
      >
        {/* Grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

        {!isPlaying && timeLeft === 15 && (
          <div className="text-center space-y-3 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Target className="w-8 h-8 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <h4 className="text-lg font-bold text-white">Рефлекс туршихад бэлэн үү?</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              15 секундийн турш дэлгэцэн дээр гарч ирэх ногоон Target-ийг аль болох хурдан дараарай.
            </p>
            <button
              onClick={startTraining}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              🚀 БЭЛТГЭЛ ЭХЛҮҮЛЭХ
            </button>
          </div>
        )}

        {isPlaying && currentTarget && (
          <button
            onClick={handleTargetClick}
            style={{
              left: `${currentTarget.x}%`,
              top: `${currentTarget.y}%`,
              width: `${currentTarget.size}px`,
              height: `${currentTarget.size}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white shadow-lg shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center animate-pulse cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-slate-950" />
          </button>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="text-center space-y-4 p-6 z-10 animate-fade-in">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-extrabold text-white">Дасгал Өндөрлөлөө!</h4>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">SCORE</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">{score}</div>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">REACTION</div>
                <div className="text-xl font-bold text-cyan-400 font-mono">{avgReaction} ms</div>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">ACCURACY</div>
                <div className="text-xl font-bold text-indigo-400 font-mono">{accuracy}%</div>
              </div>
            </div>
            <button
              onClick={startTraining}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Дахин онох 🎯
            </button>
          </div>
        )}
      </div>

      {/* Realtime Stats Bar */}
      {isPlaying && (
        <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">HITS:</span> <strong className="text-emerald-400">{hits}</strong>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">MISSES:</span> <strong className="text-rose-400">{misses}</strong>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">REACTION:</span> <strong className="text-cyan-400">{avgReaction}ms</strong>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">ACCURACY:</span> <strong className="text-indigo-400">{accuracy}%</strong>
          </div>
        </div>
      )}
    </div>
  );
};
