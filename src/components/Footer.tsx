import React from "react";
import { Bot, Sparkles, Cpu, Github, Mail, ShieldCheck } from "lucide-react";
import { PORTFOLIO_INFO } from "../data/portfolioData";

interface FooterProps {
  onOpenIdolChat: () => void;
  onOpenMeChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenIdolChat, onOpenMeChat }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-100 text-base">
                {PORTFOLIO_INFO.name}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Interactive Portfolio & Gemini AI Studio
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenIdolChat}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>🤖 My Idol (Jensen Huang)</span>
            </button>

            <button
              onClick={onOpenMeChat}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>💬 Me-AI Туслах</span>
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            © {new Date().getFullYear()} {PORTFOLIO_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Powered by Gemini API & Server-side AI Proxy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
