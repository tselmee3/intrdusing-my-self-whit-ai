import React, { useState } from "react";
import { Sparkles, CheckCircle2, RotateCcw, Trophy, HelpCircle } from "lucide-react";
import { AiGameQuestion } from "../../types";

interface CustomQuizGameViewProps {
  instructions?: string;
  questions?: AiGameQuestion[];
  onScoreUpdate: (newScore: number) => void;
}

export const CustomQuizGameView: React.FC<CustomQuizGameViewProps> = ({
  instructions,
  questions = [],
  onScoreUpdate,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
        <p>Энэ тоглоомд одоогоор асуултууд бэлэн болоогүй байна.</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOpt === currentQ.correctIndex) {
      const newScore = score + 300;
      setScore(newScore);
      onScoreUpdate(newScore);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-6">
      {/* Instructions if present */}
      {instructions && (
        <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
          <strong>ℹ️ AI Тоглоомын дүрэм:</strong> {instructions}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30">
        <div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Dynamic Challenge
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Асуулт {currentIdx + 1} / {questions.length}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-mono">
            SCORE: <strong className="text-indigo-400">{score} pts</strong>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-base font-semibold text-slate-100 leading-relaxed">
          {currentQ.question}
        </h4>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((option, idx) => {
            let optionStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
            if (selectedOpt === idx) {
              optionStyle = "bg-indigo-600/20 border-indigo-500 text-indigo-200";
            }
            if (isSubmitted) {
              if (idx === currentQ.correctIndex) {
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
                {isSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOpt === null}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg transition-transform cursor-pointer"
            >
              Хариулт Илгээх
            </button>
          ) : currentIdx < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform cursor-pointer"
            >
              Дараагийн Асуулт ➔
            </button>
          ) : (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Тоглоом Дууслаа!
            </div>
          )}
        </div>

        {/* Explanation */}
        {isSubmitted && currentQ.explanation && (
          <div className="p-3.5 bg-slate-900 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed animate-fade-in">
            <strong>💡 AI Тайлбар:</strong> {currentQ.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
