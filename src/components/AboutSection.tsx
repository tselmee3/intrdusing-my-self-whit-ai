import React from "react";
import { User, CheckCircle2, XCircle, Heart, Target, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";
import { PORTFOLIO_INFO } from "../data/portfolioData";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Mindset</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Tselmegbayar-ийн Тухай
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
            Сониуч байдал, асуудал шийдвэрлэх тэмүүлэл ба технологийн практик мэдлэг
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Card 1: Hobbies & Focus Areas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Гол сонирхол & Хобби
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PORTFOLIO_INFO.hobbies.map((hobby, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="font-semibold text-slate-200 text-sm mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      {hobby.title}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals & Mindset */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Зорилго & Мөрөөдөл</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Компьютерийн техник болон технологийн мэдлэгээ тасралтгүй хөгжүүлж, өөрийн сонирхсон төслүүдийг хийж, бусдад танилцуулах.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Likes vs Dislikes */}
          <div className="space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Likes */}
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Дуртай зүйлс:
                </h4>
                <div className="space-y-2">
                  {PORTFOLIO_INFO.likes.map((like, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{like}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dislikes */}
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Дургүй зүйл:
                </h4>
                <div className="space-y-2">
                  {PORTFOLIO_INFO.dislikes.map((dislike, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-medium"
                    >
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{dislike}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Badge */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>AI туслах нь аюулгүй байдлын дүрмийг чанд мөрдөнө.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
