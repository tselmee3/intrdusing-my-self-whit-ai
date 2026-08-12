import React, { useState } from "react";
import { Bot, Cpu, FolderKanban, Monitor, User, Menu, X, Sparkles, Gamepad2 } from "lucide-react";
import { PORTFOLIO_INFO } from "../data/portfolioData";

interface NavbarProps {
  onOpenIdolChat: () => void;
  onOpenMeChat: () => void;
  onOpenAiGames: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenIdolChat, onOpenMeChat, onOpenAiGames }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
          id="nav-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-100 text-base tracking-tight leading-none group-hover:text-cyan-400 transition-colors">
              {PORTFOLIO_INFO.shortName}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Portfolio & AI Studio
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => scrollToSection("about")}
            className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-about-btn"
          >
            <User className="w-4 h-4 text-cyan-400" />
            Миний тухай
          </button>

          <button
            onClick={() => scrollToSection("projects")}
            className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-projects-btn"
          >
            <FolderKanban className="w-4 h-4 text-purple-400" />
            Төслүүд
          </button>

          <button
            onClick={() => scrollToSection("pc-specs")}
            className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-pc-specs-btn"
          >
            <Monitor className="w-4 h-4 text-emerald-400" />
            PC Техник
          </button>

          {/* Special Prominent "My Idol" Menu Button */}
          <button
            onClick={onOpenIdolChat}
            className="ml-1 px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 group cursor-pointer"
            id="nav-my-idol-btn"
          >
            <Bot className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">🤖 My Idol</span>
          </button>

          <button
            onClick={onOpenMeChat}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-me-ai-btn"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Me-AI
          </button>

          {/* Prominent TOP RIGHT CORNER "MY AI GAMES" Button */}
          <button
            onClick={onOpenAiGames}
            className="ml-2 px-3.5 py-2 rounded-xl text-sm font-extrabold bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer border border-cyan-300/40"
            id="nav-my-ai-games-btn"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">MY AI GAMES</span>
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenAiGames}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white flex items-center gap-1 shadow-md cursor-pointer"
            id="nav-mobile-ai-games-btn"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>MY AI GAMES</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            id="nav-mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection("about")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <User className="w-4 h-4 text-cyan-400" />
            Миний тухай
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <FolderKanban className="w-4 h-4 text-purple-400" />
            Төслүүд
          </button>
          <button
            onClick={() => scrollToSection("pc-specs")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Monitor className="w-4 h-4 text-emerald-400" />
            PC Техник & Угсралт
          </button>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiGames();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border border-cyan-500/50 text-cyan-200 font-extrabold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                🎮 MY AI GAMES
              </span>
              <span className="text-xs bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 font-mono">
                Game Studio
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenIdolChat();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-200 font-semibold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                🤖 My Idol (Jensen Huang)
              </span>
              <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                AI Coach
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMeChat();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 font-medium text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Me-AI (Tselmegbayar Туслах)
              </span>
              <span className="text-xs bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">
                Popup Chat
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

