import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  X,
  Sparkles,
  Zap,
  Cpu,
  Target,
  Brain,
  Plus,
  Trophy,
  Play,
  RotateCcw,
  Loader2,
  Trash2,
  Bot,
  Filter,
} from "lucide-react";
import { AiGame } from "../types";
import { DEFAULT_AI_GAMES } from "../data/aiGamesData";
import { RedstoneGameView } from "./gameViews/RedstoneGameView";
import { PcBuilderGameView } from "./gameViews/PcBuilderGameView";
import { AimTrainerGameView } from "./gameViews/AimTrainerGameView";
import { MathMazeGameView } from "./gameViews/MathMazeGameView";
import { CustomQuizGameView } from "./gameViews/CustomQuizGameView";
import { HeroGuessGameView } from "./gameViews/HeroGuessGameView";

interface MyAiGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_STORAGE_KEY = "my_ai_games_custom_v1";

const PRESET_PROMPTS = [
  "Minecraft Redstone & Crafting Master Quiz",
  "NVIDIA GPU Architecture & Ray Tracing Challenge",
  "Cyberpunk Hacker Logic Puzzle",
  "Math & Geometry Speed Maze",
];

export const MyAiGamesModal: React.FC<MyAiGamesModalProps> = ({ isOpen, onClose }) => {
  const [games, setGames] = useState<AiGame[]>(DEFAULT_AI_GAMES);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedGame, setSelectedGame] = useState<AiGame | null>(null);

  // Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Load custom saved games from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: AiGame[] = JSON.parse(saved);
        setGames([...DEFAULT_AI_GAMES, ...parsed]);
      }
    } catch (e) {
      console.error("Failed to load saved AI games:", e);
    }
  }, []);

  if (!isOpen) return null;

  // Save new game
  const saveCustomGame = (newGame: AiGame) => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const customList: AiGame[] = saved ? JSON.parse(saved) : [];
      const updatedCustom = [newGame, ...customList];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCustom));
      setGames([...DEFAULT_AI_GAMES, ...updatedCustom]);
    } catch (e) {
      console.error("Failed to save custom AI game:", e);
    }
  };

  const deleteCustomGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const customList: AiGame[] = JSON.parse(saved);
        const filtered = customList.filter((g) => g.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        setGames([...DEFAULT_AI_GAMES, ...filtered]);
      }
    } catch (e) {
      console.error("Failed to delete custom game:", e);
    }
  };

  const handleScoreUpdate = (gameId: string, newScore: number) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const currentHigh = g.highScore || 0;
          return {
            ...g,
            playsCount: g.playsCount + 1,
            highScore: Math.max(currentHigh, newScore),
          };
        }
        return g;
      })
    );
  };

  const handleGenerateGame = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || promptInput;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/generate-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!res.ok) {
        throw new Error("Game generation failed.");
      }

      const data = await res.json();
      if (!data.game || !data.game.title) {
        throw new Error("Invalid AI game format received.");
      }

      const generated: AiGame = {
        id: `custom-${Date.now()}`,
        title: data.game.title,
        category: "AI Generated",
        description: data.game.description || "AI-аар бэлтгэгдсэн интерактив мини тоглоом.",
        tags: ["AI Built", "Custom Game", "Gemini 3.6"],
        difficulty: data.game.difficulty || "Medium",
        iconName: "Sparkles",
        builtByAi: "Gemini 3.6 Flash",
        playsCount: 1,
        highScore: 0,
        createdAt: new Date().toLocaleDateString(),
        isCustom: true,
        gameType: "custom_quiz",
        customData: {
          instructions: data.game.instructions,
          questions: data.game.questions,
        },
      };

      saveCustomGame(generated);
      setShowGenerator(false);
      setPromptInput("");
      setSelectedGame(generated);
    } catch (err: any) {
      console.error("Generation error:", err);
      setGenError("AI тоглоом бэлтгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredGames = games.filter((g) => {
    if (activeTab === "All") return true;
    if (activeTab === "Custom") return g.isCustom;
    return g.category === activeTab;
  });

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-5 h-5 text-rose-400" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case "Target":
        return <Target className="w-5 h-5 text-emerald-400" />;
      case "Brain":
        return <Brain className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getGameBanner = (game: AiGame) => {
    switch (game.gameType) {
      case "redstone":
        return (
          <div className="relative h-28 w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-950 to-red-950 border-b border-rose-500/20 flex items-center justify-between p-4 group-hover:scale-[1.02] transition-transform duration-500">
            {/* Background redstone wire circuit pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-rose-600/10 to-transparent" />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/20">
                <Zap className="w-6 h-6 text-rose-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 uppercase font-bold tracking-wider">
                  Minecraft Redstone
                </span>
                <div className="text-xs font-mono text-slate-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Logic Gate Simulator</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono text-slate-400">BEACON STATUS</span>
              <span className="text-xs font-mono font-bold text-rose-400">POWERED ✨</span>
            </div>
          </div>
        );

      case "pcbuilder":
        return (
          <div className="relative h-28 w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-cyan-950 via-slate-950 to-indigo-950 border-b border-cyan-500/20 flex items-center justify-between p-4 group-hover:scale-[1.02] transition-transform duration-500">
            {/* Background motherboard circuit traces */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:14px_14px]" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-cyan-600/10 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 uppercase font-bold tracking-wider">
                  Hardware & Bottleneck
                </span>
                <div className="text-xs font-mono text-slate-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>240+ FPS Benchmark</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono text-slate-400">SIMULATED GPU</span>
              <span className="text-xs font-mono font-bold text-cyan-400">RTX 4080 Super</span>
            </div>
          </div>
        );

      case "aim":
        return (
          <div className="relative h-28 w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-b border-emerald-500/20 flex items-center justify-between p-4 group-hover:scale-[1.02] transition-transform duration-500">
            {/* Radar / Crosshair grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-600/10 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Target className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold tracking-wider">
                  CS2 Reflex Trainer
                </span>
                <div className="text-xs font-mono text-slate-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>&lt; 180 ms Target Reaction</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono text-slate-400">TARGET MODE</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Fast Reflex 🎯</span>
            </div>
          </div>
        );

      case "math":
        return (
          <div className="relative h-28 w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-b border-purple-500/20 flex items-center justify-between p-4 group-hover:scale-[1.02] transition-transform duration-500">
            {/* Matrix code pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:14px_14px]" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-purple-600/10 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
                <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30 uppercase font-bold tracking-wider">
                  Math & Cipher Maze
                </span>
                <div className="text-xs font-mono text-slate-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>Binary & Probability Ciphers</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono text-slate-400">AI CIPHER</span>
              <span className="text-xs font-mono font-bold text-purple-400">Logic Matrix 🧠</span>
            </div>
          </div>
        );

      case "hero_quiz":
        return (
          <div className="relative h-28 w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-950 to-rose-950 border-b border-purple-500/30 flex items-center justify-between p-4 group-hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:14px_14px]" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-rose-600/10 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30 uppercase font-bold tracking-wider">
                  Аниме Тааварт Тоглоом
                </span>
                <div className="text-xs font-mono text-slate-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>Luffy, Naruto, Goku, Tanjiro & Gojo</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono text-slate-400">HERO QUIZ</span>
              <span className="text-xs font-mono font-bold text-purple-400">4 Сонголттой 👑</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative h-28 w-full rounded-t-2xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 border-b border-indigo-500/20 flex items-center justify-between p-4 group-hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:14px_14px]" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 uppercase font-bold tracking-wider">
                  Custom AI Generated
                </span>
                <div className="text-xs font-mono text-slate-300 mt-1">Gemini 3.6 Flash Engine</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Container Modal */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Navbar Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">MY AI GAMES</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                  AI Game Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tselmegbayar-ийн AI-аар бүтээсэн тоглоомуудын цуглуулга & Тоглох танхим
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!selectedGame && (
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Шинэ AI Тоглоом БҮТЭЭХ</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              id="close-ai-games-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Playing Active Game Overlay Screen */}
          {selectedGame ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    {getGameIcon(selectedGame.iconName)}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                      {selectedGame.category} • Built by {selectedGame.builtByAi}
                    </div>
                    <h3 className="text-lg font-extrabold text-white">{selectedGame.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGame(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  ◀ Тоглоомын жагсаалт руу буцах
                </button>
              </div>

              {/* Render specific game view */}
              {selectedGame.gameType === "redstone" && (
                <RedstoneGameView onScoreUpdate={(s) => handleScoreUpdate(selectedGame.id, s)} />
              )}
              {selectedGame.gameType === "pcbuilder" && (
                <PcBuilderGameView onScoreUpdate={(s) => handleScoreUpdate(selectedGame.id, s)} />
              )}
              {selectedGame.gameType === "aim" && (
                <AimTrainerGameView onScoreUpdate={(s) => handleScoreUpdate(selectedGame.id, s)} />
              )}
              {selectedGame.gameType === "math" && (
                <MathMazeGameView onScoreUpdate={(s) => handleScoreUpdate(selectedGame.id, s)} />
              )}
              {selectedGame.gameType === "hero_quiz" && (
                <HeroGuessGameView onScoreUpdate={(s) => handleScoreUpdate(selectedGame.id, s)} />
              )}
              {selectedGame.gameType === "custom_quiz" && (
                <CustomQuizGameView
                  instructions={selectedGame.customData?.instructions}
                  questions={selectedGame.customData?.questions}
                  onScoreUpdate={(s) => handleScoreUpdate(selectedGame.id, s)}
                />
              )}
            </div>
          ) : showGenerator ? (
            /* 2. AI Game Generator Creator Screen */
            <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/30 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">AI Game Creator (Gemini 3.6 Engine)</h3>
                </div>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Буцах
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Сэдэв эсвэл дуртай чиглэлээ бичвэл Gemini AI танд тусгайлсан интерактив мини-тоглоом, тааварт даалгавруудыг шууд кодлон бэлтгэж өгнө!
              </p>

              {/* Preset buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Бэлэн сэдвүүдээс сонгох:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGenerateGame(preset)}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-indigo-200 transition-all cursor-pointer"
                    >
                      ⚡ {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom prompt input */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-slate-300 font-bold block">
                  Эсвэл өөрийн хүссэн AI тоглоомын санааг бичээрэй:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Жишээ нь: CS2 Weapon Skin Quiz, PC Cooling Water Loop Challenge, Quantum Computing Logic..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => e.key === "Enter" && handleGenerateGame()}
                  />
                  <button
                    onClick={() => handleGenerateGame()}
                    disabled={isGenerating || !promptInput.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> БҮТЭЭЖ БАЙНА...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> AI БҮТЭЭХ
                      </>
                    )}
                  </button>
                </div>
              </div>

              {genError && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                  {genError}
                </div>
              )}
            </div>
          ) : (
            /* 3. Games Grid Showcase */
            <div className="space-y-5">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono pr-2 border-r border-slate-800">
                  <Filter className="w-3.5 h-3.5" /> Филтер:
                </span>
                {["All", "Anime Mechanics", "Minecraft Mechanics", "Hardware Simulator", "Aim & Reflex", "Math Logic", "Custom"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      {tab === "All" ? "Бүгд" : tab === "Custom" ? "Миний AI Тоглоомууд ✨" : tab}
                    </button>
                  )
                )}
              </div>

              {/* Games Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between cursor-pointer relative"
                  >
                    <div>
                      {/* Top Visual Game Banner */}
                      {getGameBanner(game)}

                      {/* Card Content Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                            {game.category}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              {game.difficulty}
                            </span>

                            {game.isCustom && (
                              <button
                                onClick={(e) => deleteCustomGame(game.id, e)}
                                className="p-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete custom game"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="font-extrabold text-base text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {game.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {game.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {game.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/80"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Stats & Launch Button */}
                    <div className="px-5 pb-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          High: <strong className="text-slate-200">{game.highScore || 0}</strong>
                        </span>
                        <span>•</span>
                        <span>{game.playsCount} plays</span>
                      </div>

                      <button className="px-4 py-1.5 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/10">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        ТОГЛОХ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
