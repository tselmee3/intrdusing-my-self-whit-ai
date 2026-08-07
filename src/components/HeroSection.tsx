import React from "react";
import { Bot, Sparkles, Cpu, ArrowDown, ShieldAlert, Monitor, Gamepad2, Calculator } from "lucide-react";
import { PORTFOLIO_INFO } from "../data/portfolioData";

interface HeroSectionProps {
  onOpenIdolChat: () => void;
  onOpenMeChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenIdolChat, onOpenMeChat }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-slate-950 border-b border-slate-800/80">
      {/* Glow Effects Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner text-xs font-mono text-cyan-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tselmegbayar • Portfolio & AI Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Компьютерийн техник, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Инженеринг & AI
            </span>{" "}
            Сонирхогч
          </h1>

          {/* Bio paragraph */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            {PORTFOLIO_INFO.bio}
          </p>

          {/* Key Pillars */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
              <Monitor className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">PC Hardware</div>
                <div className="text-slate-400 text-[11px]">Угсралт & Тэжээл</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
              <Gamepad2 className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">Minecraft & CS2</div>
                <div className="text-slate-400 text-[11px]">Механик судлал</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">Math & Stats</div>
                <div className="text-slate-400 text-[11px]">Бодлого бодох</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-slate-200">Windows & OS</div>
                <div className="text-slate-400 text-[11px]">Алдаа шийдэх</div>
              </div>
            </div>
          </div>

          {/* AI Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Prominent My Idol Button */}
            <button
              onClick={onOpenIdolChat}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-semibold text-base shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              id="hero-idol-btn"
            >
              <Bot className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span>🤖 My Idol (Jensen Huang AI)</span>
            </button>

            {/* Me-AI Chat Button */}
            <button
              onClick={onOpenMeChat}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 hover:border-indigo-500/70 text-indigo-200 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-950/50"
              id="hero-me-btn"
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>💬 Me-AI Тэй Чатлах</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
