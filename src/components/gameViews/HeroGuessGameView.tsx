import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Flame,
  HelpCircle,
  Swords,
  Crown,
  Save,
  User,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Clock,
  Zap,
  AlertCircle,
} from "lucide-react";
import { HERO_QUESTIONS_DATA, HeroQuestion } from "../../data/guessHeroData";
import { saveGameScore, fetchTopScores, ScoreDoc, AnswerRecord } from "../../lib/firebase";

interface HeroGuessGameViewProps {
  onScoreUpdate: (newScore: number) => void;
}

// Fisher-Yates array shuffling helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Function to generate ordered shuffled game set:
// 1-6: EASY (5 pts)
// 7-10: MID (10 pts)
// 11-12: HARD (15 pts)
function generateShuffledQuestions(): HeroQuestion[] {
  const easy = HERO_QUESTIONS_DATA.filter(
    (q) => q.meta?.difficulty === "EASY" || (q.id >= 1 && q.id <= 6)
  );
  const mid = HERO_QUESTIONS_DATA.filter(
    (q) => q.meta?.difficulty === "MID" || (q.id >= 7 && q.id <= 10)
  );
  const hard = HERO_QUESTIONS_DATA.filter(
    (q) => q.meta?.difficulty === "HARD" || q.id >= 11
  );

  const shuffledEasy = shuffleArray(easy);
  const shuffledMid = shuffleArray(mid);
  const shuffledHard = shuffleArray(hard);

  return [...shuffledEasy, ...shuffledMid, ...shuffledHard];
}

export const HeroGuessGameView: React.FC<HeroGuessGameViewProps> = ({ onScoreUpdate }) => {
  const [heroList, setHeroList] = useState<HeroQuestion[]>(() => generateShuffledQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // 15 Second Timer per Question
  const [timeLeft, setTimeLeft] = useState(15);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Active View Tab: 'game' | 'leaderboard'
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard">("game");

  // Firestore state
  const [playerName, setPlayerName] = useState<string>("");
  const [answersHistory, setAnswersHistory] = useState<AnswerRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Leaderboard state
  const [topScores, setTopScores] = useState<ScoreDoc[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  const currentHero = heroList[currentIdx] || heroList[0];

  // 15-second Countdown Timer Logic
  useEffect(() => {
    if (activeTab !== "game" || gameFinished || isSubmitted) return;

    setTimeLeft(15);
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentIdx, isSubmitted, gameFinished, activeTab]);

  useEffect(() => {
    if (activeTab === "leaderboard") {
      loadLeaderboard();
    }
  }, [activeTab]);

  const handleTimeOut = () => {
    if (isSubmitted || !currentHero) return;
    setIsSubmitted(true);
    setIsTimedOut(true);
    setStreak(0);

    const record: AnswerRecord = {
      questionId: currentHero.id,
      heroName: currentHero.heroName,
      animeTitle: currentHero.animeTitle,
      selectedAnswer: "⏰ Цаг дууссан (15с)",
      correctAnswer: currentHero.answer,
      isCorrect: false,
    };

    setAnswersHistory((prev) => [...prev, record]);
  };

  const handleSelectOption = (optionName: string) => {
    if (isSubmitted) return;
    setSelectedOpt(optionName);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOpt || isSubmitted || !currentHero) return;
    setIsSubmitted(true);
    setIsTimedOut(false);

    const isCorrect = selectedOpt.toLowerCase() === currentHero.answer.toLowerCase();

    // Determine points based on question level (1-6: 5pts, 7-10: 10pts, 11-12: 15pts)
    const levelPoints = currentHero.meta?.points || (currentIdx < 6 ? 5 : currentIdx < 10 ? 10 : 15);

    const record: AnswerRecord = {
      questionId: currentHero.id,
      heroName: currentHero.heroName,
      animeTitle: currentHero.animeTitle,
      selectedAnswer: selectedOpt,
      correctAnswer: currentHero.answer,
      isCorrect,
    };

    setAnswersHistory((prev) => [...prev, record]);

    if (isCorrect) {
      const streakBonus = streak * 2;
      const finalGain = levelPoints + streakBonus;

      const newScore = score + finalGain;
      const newStreak = streak + 1;

      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      onScoreUpdate(newScore);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < heroList.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
      setIsTimedOut(false);
      setShowHint(false);
      setTimeLeft(15);
    } else {
      setGameFinished(true);
    }
  };

  const handleResetGame = () => {
    setHeroList(generateShuffledQuestions());
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setIsTimedOut(false);
    setShowHint(false);
    setTimeLeft(15);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAnswersHistory([]);
    setGameFinished(false);
    setSaveSuccess(false);
    setSaveError(null);
    setActiveTab("game");
  };

  const handleSaveToFirestore = async () => {
    if (!playerName.trim()) {
      setSaveError("Сурагчийн/Тоглогчийн нэрийг оруулна уу.");
      return;
    }
    setSaveError(null);
    setIsSaving(true);
    try {
      await saveGameScore(
        playerName.trim(),
        score,
        answersHistory,
        maxStreak,
        "Anime Hero Quiz"
      );
      setSaveSuccess(true);
      loadLeaderboard();
    } catch (err: any) {
      setSaveError(err?.message || "Оноо хадгалахад алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadLeaderboard = async () => {
    setIsLoadingScores(true);
    try {
      const scores = await fetchTopScores(10);
      setTopScores(scores);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    } finally {
      setIsLoadingScores(false);
    }
  };

  if (!currentHero) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
        <p>Асуултын өгөгдөл ачаалж байна...</p>
      </div>
    );
  }

  const isCorrectAnswer = selectedOpt?.toLowerCase() === currentHero.answer.toLowerCase();

  // Get current question difficulty label and points badge
  const diffLabel = currentIdx < 6 ? "EASY" : currentIdx < 10 ? "MID" : "HARD";
  const diffPoints = currentIdx < 6 ? 5 : currentIdx < 10 ? 10 : 15;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Scoreboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-purple-500/30 shadow-lg">
        <div>
          <div className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <Swords className="w-4 h-4 text-purple-400" />
            Баатрын Дүр Таах • Anime Hero Arena
          </div>
          <h3 className="text-base font-extrabold text-white mt-0.5 flex items-center gap-2">
            {activeTab === "game" ? (
              <>
                <span>Асуулт {currentIdx + 1} / {heroList.length}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    diffLabel === "EASY"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : diffLabel === "MID"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  {diffLabel} ({diffPoints} оноо)
                </span>
              </>
            ) : (
              "🏆 ТОП 10 Шилдэг Тоглогчид"
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Main View Tabs */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("game")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "game"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Swords className="w-3.5 h-3.5" /> Тоглох
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "leaderboard"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> ТОП 10 Оноо
            </button>
          </div>

          {activeTab === "game" && (
            <>
              {streak > 1 && (
                <div className="bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {streak}x
                </div>
              )}

              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-purple-500/30 text-xs font-mono text-slate-200 font-bold">
                ОНОО: <span className="text-purple-400 text-sm font-extrabold">{score}</span>
              </div>
            </>
          )}

          <button
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Дахин хольж эхлүүлэх"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === "game" ? (
        <>
          {/* Difficulty Level Indicator Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
            <div
              className={`p-2 rounded-xl border transition-all ${
                currentIdx < 6
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                  : "bg-slate-900/40 border-slate-800 text-slate-500"
              }`}
            >
              <span>1 - 6 Асуулт</span>
              <div className="text-[10px] text-emerald-400 font-normal">🟢 EASY (5 Оноо)</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                currentIdx >= 6 && currentIdx < 10
                  ? "bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10 scale-[1.02]"
                  : "bg-slate-900/40 border-slate-800 text-slate-500"
              }`}
            >
              <span>7 - 10 Асуулт</span>
              <div className="text-[10px] text-amber-400 font-normal">🟡 MID (10 Оноо)</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                currentIdx >= 10
                  ? "bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-lg shadow-rose-500/10 scale-[1.02]"
                  : "bg-slate-900/40 border-slate-800 text-slate-500"
              }`}
            >
              <span>11 - 12 Асуулт</span>
              <div className="text-[10px] text-rose-400 font-normal">🔴 HARD (15 Оноо)</div>
            </div>
          </div>

          {!gameFinished ? (
            /* Main Hero Card & Quiz View */
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden shadow-2xl">
              {/* Background Aura Glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* 15 SECOND TIMER PROGRESS BAR */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-extrabold">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className={`w-4 h-4 ${timeLeft <= 5 ? "text-rose-400 animate-bounce" : "text-purple-400"}`} />
                    Хугацаа: <span className={timeLeft <= 5 ? "text-rose-400 text-sm font-black" : "text-purple-300"}>{timeLeft} секунд</span>
                  </span>
                  <span className="text-[10px] text-slate-400">15с/асуулт тутамд</span>
                </div>

                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      timeLeft > 8
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                        : timeLeft > 4
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-rose-600 to-red-500 animate-pulse"
                    }`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Hero Avatar & Visual Badge */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 p-6 rounded-2xl border border-purple-500/20 flex flex-col sm:flex-row items-center gap-6 shadow-inner">
                {/* Visual Icon Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 p-1 shadow-xl shadow-purple-500/20 group">
                    <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
                      <span className="text-4xl sm:text-5xl select-none animate-bounce">
                        {currentHero.avatarSymbol || "✨"}
                      </span>
                      <div className="text-[10px] font-mono text-purple-300 mt-1 font-bold tracking-tight">
                        HERO BADGE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Specs & Clues */}
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      {currentHero.animeTitle}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                        diffLabel === "EASY"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : diffLabel === "MID"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {diffLabel} • {diffPoints} ОНОО
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    Дараах эможи ба шинжээр ямар баатар вэ?
                  </h4>

                  {/* Emoji Clue Bar */}
                  <div className="text-2xl sm:text-3xl tracking-widest py-1 bg-slate-900/80 px-4 rounded-xl border border-slate-800 inline-block shadow-inner">
                    {currentHero.emojis}
                  </div>

                  {/* Hint Toggle */}
                  <div className="pt-1">
                    {!showHint ? (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center justify-center sm:justify-start gap-1 cursor-pointer transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> 💡 Зөвлөгөө / Hint харах
                      </button>
                    ) : (
                      <div className="text-xs text-amber-200/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 animate-fade-in leading-relaxed">
                        <strong>💡 Зөвлөгөө:</strong> {currentHero.meta?.hint}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4 Choices Grid */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Зөв баатрын нэрийг сонгоно уу:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentHero.options.map((opt, idx) => {
                    const isSelected = selectedOpt === opt;
                    const isAnswerKey = opt.toLowerCase() === currentHero.answer.toLowerCase();

                    let style =
                      "bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500/50 hover:bg-slate-850";

                    if (isSelected) {
                      style = "bg-purple-600/20 border-purple-500 text-purple-200 shadow-md shadow-purple-500/10";
                    }

                    if (isSubmitted) {
                      if (isAnswerKey) {
                        style = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-extrabold shadow-lg shadow-emerald-500/10";
                      } else if (isSelected && !isAnswerKey) {
                        style = "bg-rose-500/20 border-rose-500 text-rose-200 font-bold";
                      } else {
                        style = "bg-slate-900/40 border-slate-850 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        disabled={isSubmitted}
                        className={`p-4 rounded-xl border text-left text-sm font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSubmitted && isAnswerKey && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                        )}
                        {isSubmitted && isSelected && !isAnswerKey && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  {isSubmitted ? (
                    isTimedOut ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> ⏰ ЦАГ ДУУСЛАА (15 СЕКУНД ХЭТЭРСЭН)! Зөв хариулт: {currentHero.answer}
                      </span>
                    ) : isCorrectAnswer ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> ЗӨВ ХАРИУЛЛАА! (+{diffPoints} оноо)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold">Буруу хариулт! Зөв нь: {currentHero.answer}</span>
                    )
                  ) : (
                    <span>15 секундийн дотор сонголтоо хийнэ үү.</span>
                  )}
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOpt}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    Хариулт Илгээх ➔
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    Дараагийн Баатар ➔
                  </button>
                )}
              </div>

              {/* Post Answer Details & Quote */}
              {isSubmitted && (
                <div className="p-4 bg-purple-950/30 rounded-2xl border border-purple-500/30 space-y-2 animate-fade-in text-xs leading-relaxed">
                  <div className="flex items-center justify-between text-purple-300 font-mono font-bold">
                    <span>⚔️ {currentHero.heroName} ({currentHero.animeTitle})</span>
                    {currentHero.meta?.powers && (
                      <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        Хүч: {currentHero.meta.powers}
                      </span>
                    )}
                  </div>
                  {currentHero.meta?.quote && (
                    <p className="text-slate-300 italic font-medium pt-1 border-t border-purple-500/20">
                      "{currentHero.meta.quote}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Game Summary & Firestore Score Save View */
            <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-purple-500/40 space-y-6 shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-1 mx-auto shadow-xl shadow-purple-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-amber-400">
                    <Crown className="w-8 h-8 animate-bounce" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
                    ТОГЛООМ АМЖИЛТТАЙ ДУУСЛАА
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    Аниме Баатрын Мастер Цол
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto text-left">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">НИЙТ ОНОО</span>
                  <strong className="text-xl font-black text-purple-400">{score} pts</strong>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">МАКС СТРЕЙК</span>
                  <strong className="text-xl font-black text-amber-400">{maxStreak}x Combo</strong>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-slate-400 block">НИЙТ АСУУЛТ</span>
                  <strong className="text-sm font-black text-emerald-400">{answersHistory.length} хариулсан</strong>
                </div>
              </div>

              {/* FIRESTORE SCORE SAVE FORM */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-purple-500/30 max-w-md mx-auto space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                  <Save className="w-4 h-4 text-purple-400" />
                  Оноогоо Firestore Мэдээллийн санд хадгалах
                </div>

                {!saveSuccess ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">Тоглогчийн нэр:</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Жишээ нь: Баатар, OtakuNinja..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                          maxLength={30}
                        />
                      </div>
                    </div>

                    {saveError && <p className="text-xs text-rose-400 font-mono">{saveError}</p>}

                    <button
                      onClick={handleSaveToFirestore}
                      disabled={isSaving || !playerName.trim()}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                          Firestore-д хадгалж байна...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Оноо + Хариултуудыг Хадгалах
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <p className="text-xs text-emerald-300 font-bold">
                      Оноо & Асуултын хариултууд Firestore-ийн "scores" collection-д амжилттай хадгалагдлаа!
                    </p>
                    <button
                      onClick={() => setActiveTab("leaderboard")}
                      className="text-xs font-mono text-purple-300 hover:text-purple-200 underline cursor-pointer font-bold inline-flex items-center gap-1"
                    >
                      🏆 ТОП 10 Онооны жагсаалтад өөрийн байрыг харах ➔
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="px-6 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> ТОП 10 Жагсаалт Харах
                </button>

                <button
                  onClick={handleResetGame}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Шинээр Хольж Тоглох
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* DEDICATED TOP 10 LEADERBOARD PAGE / VIEW */
        <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  FIRESTORE SCORES COLLECTION
                </span>
                <h3 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
                  ТОП 10 Эрэмбэлэгдсэн Онооны Жагсаалт
                </h3>
              </div>
            </div>

            <button
              onClick={loadLeaderboard}
              disabled={isLoadingScores}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isLoadingScores ? "animate-spin" : ""}`} />
              Шинэчлэх
            </button>
          </div>

          {isLoadingScores ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
              <p className="text-xs font-mono">Firestore "scores" collection-оос ТОП 10 оноог эрэмбэлэн татаж байна...</p>
            </div>
          ) : topScores.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-extrabold text-slate-300">Одоогоор Firestore дээр хадгалагдсан оноо байхгүй байна.</p>
              <p className="text-xs text-slate-500 font-mono">
                Та тоглоомоо тоглоод ТОП 10 жагсаалтыг тэргүүлээрэй!
              </p>
              <button
                onClick={() => setActiveTab("game")}
                className="mt-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Одоо Тоглох ➔
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-2">
                <span>Эрэмбэ & Тоглогч</span>
                <span>Оноо / Хариулт</span>
              </div>

              {topScores.map((entry, index) => {
                const isExpanded = expandedScoreId === entry.id;

                let rankBadge = (
                  <span className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 font-mono text-xs font-extrabold flex items-center justify-center shrink-0 border border-slate-700">
                    #{index + 1}
                  </span>
                );

                if (index === 0) {
                  rankBadge = (
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-mono text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border border-amber-300">
                      🥇 1
                    </span>
                  );
                } else if (index === 1) {
                  rankBadge = (
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-mono text-sm font-black flex items-center justify-center shrink-0 shadow-md border border-slate-200">
                      🥈 2
                    </span>
                  );
                } else if (index === 2) {
                  rankBadge = (
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-mono text-sm font-black flex items-center justify-center shrink-0 shadow-md border border-amber-400">
                      🥉 3
                    </span>
                  );
                }

                return (
                  <div
                    key={entry.id || index}
                    className={`rounded-2xl border transition-all ${
                      index === 0
                        ? "bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5"
                        : "bg-slate-900/60 border-slate-800 hover:border-purple-500/40"
                    }`}
                  >
                    <div
                      onClick={() =>
                        setExpandedScoreId(isExpanded ? null : entry.id || null)
                      }
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        {rankBadge}
                        <div>
                          <div className="font-black text-base text-white flex items-center gap-2">
                            <span>{entry.playerName}</span>
                            {entry.maxStreak && entry.maxStreak > 1 && (
                              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                                🔥 {entry.maxStreak}x combo
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{entry.gameType}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">{entry.answers?.length || 0} асуулт хариулсан</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-lg font-black text-purple-400 font-mono block tracking-tight">
                            {entry.score} pts
                          </span>
                        </div>

                        <button className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Detailed Answer History */}
                    {isExpanded && entry.answers && entry.answers.length > 0 && (
                      <div className="p-4 bg-slate-950 border-t border-slate-800 rounded-b-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
                          <span>📋 {entry.playerName}-ийн хариултууд ({entry.answers.length}):</span>
                          <span>Өндөр онооноос эрэмбэлэгдсэн</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {entry.answers.map((ans, aIdx) => (
                            <div
                              key={aIdx}
                              className={`p-3 rounded-xl border text-xs leading-snug flex items-start justify-between gap-2.5 ${
                                ans.isCorrect
                                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                                  : "bg-rose-950/20 border-rose-500/30 text-rose-200"
                              }`}
                            >
                              <div>
                                <strong className="block text-slate-100 font-bold">
                                  {ans.heroName} ({ans.animeTitle})
                                </strong>
                                <span className="text-[11px] opacity-80 block mt-1">
                                  Сонгосон: <span className="underline">{ans.selectedAnswer}</span>
                                </span>
                                {!ans.isCorrect && (
                                  <span className="text-[10px] text-emerald-400 block mt-0.5 font-mono">
                                    Зөв хариулт: {ans.correctAnswer}
                                  </span>
                                )}
                              </div>
                              {ans.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
