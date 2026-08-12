import React, { useState } from "react";
import { Brain, CheckCircle2, RotateCcw, Trophy, HelpCircle } from "lucide-react";

interface MathMazeGameViewProps {
  onScoreUpdate: (newScore: number) => void;
}

interface MathPuzzle {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const PUZZLES: MathPuzzle[] = [
  {
    id: 1,
    question: "Дарааллын дараагийн тоог олно уу: 2, 4, 8, 16, 32, [ ? ]",
    options: ["48", "64", "60", "128"],
    correctIndex: 1,
    explanation: "Тоо бүр өмнөх тоогоо 2-оор үржүүлсэнтэй тэнцүү (32 × 2 = 64).",
  },
  {
    id: 2,
    question: "Binary Code: 1010 тоог аравтын (Decimal) систем рүү шилжүүлбэл ямар тоо болох вэ?",
    options: ["8", "10", "12", "14"],
    correctIndex: 1,
    explanation: "(1×8) + (0×4) + (1×2) + (0×1) = 10.",
  },
  {
    id: 3,
    question: "Логик бодлого: Хэрэв A > B бөгөөд B > C бол [ A, C ] хоёрын харьцаа ямар вэ?",
    options: ["A < C", "A = C", "A > C", "Тодорхойлох боломжгүй"],
    correctIndex: 2,
    explanation: "Транзитив чанараар A нь B-гээс их, B нь C-гээс их тул A > C болно.",
  },
  {
    id: 4,
    question: "Нэг шоог орхиход 4-өөс дээш тоо буух магадлал (Probability) ямар вэ?",
    options: ["1/2", "1/3", "1/6", "2/3"],
    correctIndex: 1,
    explanation: "4-өөс дээш боломжууд: {5, 6} буюу 2 боломж / 6 нийт = 2/6 = 1/3.",
  },
];

export const MathMazeGameView: React.FC<MathMazeGameViewProps> = ({ onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentPuzzle = PUZZLES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOpt === currentPuzzle.correctIndex) {
      const newScore = score + 250;
      setScore(newScore);
      onScoreUpdate(newScore);
    }
  };

  const handleNext = () => {
    if (currentIdx < PUZZLES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
      setShowHint(false);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-purple-500/30">
        <div>
          <div className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Math Cipher & Logic Maze
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Бодлого {currentIdx + 1} / {PUZZLES.length}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-mono">
            SCORE: <strong className="text-purple-400">{score} pts</strong>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Puzzles"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Box */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-base font-semibold text-slate-100 leading-relaxed">
          {currentPuzzle.question}
        </h4>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {currentPuzzle.options.map((option, idx) => {
            let optionStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
            if (selectedOpt === idx) {
              optionStyle = "bg-purple-600/20 border-purple-500 text-purple-200";
            }
            if (isSubmitted) {
              if (idx === currentPuzzle.correctIndex) {
                optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
              } else if (selectedOpt === idx) {
                optionStyle = "bg-rose-500/20 border-rose-500 text-rose-200";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
              >
                <span>{option}</span>
                {isSubmitted && idx === currentPuzzle.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit / Next Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" /> AI Зөвлөмж {showHint ? "нуух" : "харах"}
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOpt === null}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg transition-transform cursor-pointer"
            >
              Хариулт Илгээх
            </button>
          ) : currentIdx < PUZZLES.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform cursor-pointer"
            >
              Дараагийн Бодлого ➔
            </button>
          ) : (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Бүх бодлого дууслаа!
            </div>
          )}
        </div>

        {/* Explanation / Hint */}
        {(isSubmitted || showHint) && (
          <div className="p-3.5 bg-slate-900 rounded-xl border border-purple-500/30 text-xs text-purple-200 leading-relaxed animate-fade-in">
            <strong>💡 AI Тайлбар:</strong> {currentPuzzle.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
