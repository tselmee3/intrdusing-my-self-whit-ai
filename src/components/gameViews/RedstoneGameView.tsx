import React, { useState } from "react";
import { Zap, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, Trophy } from "lucide-react";

interface RedstoneGameViewProps {
  onScoreUpdate: (newScore: number) => void;
}

interface RedstoneLevel {
  id: number;
  title: string;
  targetDescription: string;
  gateType: "AND" | "OR" | "XOR" | "NAND";
  switchesCount: number;
  solution: boolean[]; // target switch states
}

const LEVELS: RedstoneLevel[] = [
  {
    id: 1,
    title: "Level 1: AND Gate Circuit",
    targetDescription: "Хоёр унтраалга (A ба B) хоёулаа ИДЭВХЖСЭН үед Beacon асаж дохио дамжина.",
    gateType: "AND",
    switchesCount: 2,
    solution: [true, true],
  },
  {
    id: 2,
    title: "Level 2: OR Gate Branch",
    targetDescription: "A эсвэл B унтраалгын ядаж нэг нь идэвхжсэн үед Redstone дохио дамжина.",
    gateType: "OR",
    switchesCount: 2,
    solution: [true, false], // or [false, true] or [true, true]
  },
  {
    id: 3,
    title: "Level 3: XOR Gate Inverter",
    targetDescription: "A ба B унтраалгуудын ЯГ НЭГ НЬ идэвхтэй байх үед сүлжээ ажиллана.",
    gateType: "XOR",
    switchesCount: 2,
    solution: [true, false],
  },
  {
    id: 4,
    title: "Level 4: Triple Repeater Circuit",
    targetDescription: "A, B, C гэсэн 3 унтраалгаас A ба C идэвхтэй, B унтарсан үед дохио асна.",
    gateType: "NAND",
    switchesCount: 3,
    solution: [true, false, true],
  },
];

export const RedstoneGameView: React.FC<RedstoneGameViewProps> = ({ onScoreUpdate }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [switches, setSwitches] = useState<boolean[]>([false, false, false]);
  const [score, setScore] = useState(0);
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const currentLevel = LEVELS[currentLevelIdx];

  const toggleSwitch = (index: number) => {
    const next = [...switches];
    next[index] = !next[index];
    setSwitches(next);
    checkSolution(next);
  };

  const checkSolution = (currentSwitches: boolean[]) => {
    let active = false;
    const gate = currentLevel.gateType;

    if (gate === "AND") {
      active = currentSwitches[0] && currentSwitches[1];
    } else if (gate === "OR") {
      active = currentSwitches[0] || currentSwitches[1];
    } else if (gate === "XOR") {
      active = (currentSwitches[0] && !currentSwitches[1]) || (!currentSwitches[0] && currentSwitches[1]);
    } else if (gate === "NAND") {
      active = currentSwitches[0] && !currentSwitches[1] && currentSwitches[2];
    }

    setIsBeaconActive(active);

    if (active && !completedLevels.includes(currentLevel.id)) {
      const addedScore = score + 200;
      setScore(addedScore);
      setCompletedLevels([...completedLevels, currentLevel.id]);
      onScoreUpdate(addedScore);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
      setSwitches([false, false, false]);
      setIsBeaconActive(false);
    }
  };

  const resetGame = () => {
    setCurrentLevelIdx(0);
    setSwitches([false, false, false]);
    setScore(0);
    setIsBeaconActive(false);
    setCompletedLevels([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-rose-500/30">
        <div>
          <div className="text-xs font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-rose-500 animate-pulse" />
            Minecraft Redstone Engine
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">{currentLevel.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
            <span className="text-slate-400">Score:</span>{" "}
            <span className="font-bold text-rose-400">{score} pts</span>
          </div>
          <button
            onClick={resetGame}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-sm text-slate-300">
        <p className="leading-relaxed"><strong className="text-rose-300">Даалгавар:</strong> {currentLevel.targetDescription}</p>
      </div>

      {/* Circuit Simulation Diagram */}
      <div className="relative bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-hidden min-h-[260px] flex flex-col items-center justify-center">
        {/* Ambient Redstone Glow */}
        <div className={`absolute inset-0 bg-rose-600/10 transition-opacity duration-500 ${isBeaconActive ? "opacity-100" : "opacity-0"}`} />

        <div className="relative z-10 w-full max-w-lg space-y-8">
          {/* Input Switches */}
          <div className="flex items-center justify-around gap-4">
            {Array.from({ length: currentLevel.switchesCount }).map((_, idx) => {
              const label = String.fromCharCode(65 + idx); // A, B, C
              const isOn = switches[idx];
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">Switch {label}</span>
                  <button
                    onClick={() => toggleSwitch(idx)}
                    className={`w-16 h-24 rounded-xl border-2 font-mono font-bold text-lg flex flex-col items-center justify-between p-2 transition-all cursor-pointer shadow-lg ${
                      isOn
                        ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-rose-500/20 scale-105"
                        : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-xs">{isOn ? "ON" : "OFF"}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOn ? "bg-rose-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-400"}`}>
                      {label}
                    </div>
                    <span className={`w-3 h-3 rounded-full ${isOn ? "bg-rose-500 animate-ping" : "bg-slate-700"}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Logic Gate Box */}
          <div className="flex items-center justify-center">
            <div className={`px-6 py-3 rounded-xl border-2 font-mono font-bold text-sm tracking-widest flex items-center gap-3 transition-all ${
              isBeaconActive ? "bg-rose-500/20 border-rose-400 text-rose-200 shadow-lg shadow-rose-500/20" : "bg-slate-900 border-slate-700 text-slate-400"
            }`}>
              <Zap className={`w-5 h-5 ${isBeaconActive ? "text-rose-400 animate-bounce" : "text-slate-500"}`} />
              LOGIC GATE: [{currentLevel.gateType}]
            </div>
          </div>

          {/* Output Beacon Status */}
          <div className="flex flex-col items-center justify-center gap-2 pt-2">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              isBeaconActive
                ? "bg-gradient-to-t from-cyan-500/40 via-rose-500/30 to-white/20 border-cyan-400 shadow-2xl shadow-cyan-500/50 scale-110"
                : "bg-slate-900 border-slate-800 text-slate-600"
            }`}>
              <Sparkles className={`w-10 h-10 transition-all ${isBeaconActive ? "text-cyan-300 animate-pulse" : "text-slate-700"}`} />
            </div>
            <div className="text-xs font-mono font-bold">
              BEACON STATUS:{" "}
              <span className={isBeaconActive ? "text-cyan-400" : "text-slate-500"}>
                {isBeaconActive ? "POWERED & ACTIVE ✨" : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Success & Controls */}
      {isBeaconActive && (
        <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="font-bold text-emerald-200 text-sm">Түвшин Амжилттай Биелээ!</h4>
              <p className="text-xs text-emerald-300/80">Redstone логик дохио дамжиж Beacon идэвхжлээ (+200 pts)</p>
            </div>
          </div>
          {currentLevelIdx < LEVELS.length - 1 ? (
            <button
              onClick={nextLevel}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-lg"
            >
              Дараагийн Түвшин ➔
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <Trophy className="w-4 h-4 text-amber-400" /> All Levels Mastered!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
