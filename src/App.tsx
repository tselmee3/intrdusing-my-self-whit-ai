import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { PcSpecsSection } from "./components/PcSpecsSection";
import { Footer } from "./components/Footer";
import { IdolChatModal } from "./components/IdolChatModal";
import { MeChatWidget } from "./components/MeChatWidget";

export default function App() {
  const [isIdolChatOpen, setIsIdolChatOpen] = useState(false);
  const [isMeChatOpen, setIsMeChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Navbar
        onOpenIdolChat={() => setIsIdolChatOpen(true)}
        onOpenMeChat={() => setIsMeChatOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenIdolChat={() => setIsIdolChatOpen(true)}
          onOpenMeChat={() => setIsMeChatOpen(true)}
        />
        <AboutSection />
        <ProjectsSection />
        <PcSpecsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenIdolChat={() => setIsIdolChatOpen(true)}
        onOpenMeChat={() => setIsMeChatOpen(true)}
      />

      {/* 1. "🤖 My Idol" Chat Modal (Jensen Huang - Idol Coach) */}
      <IdolChatModal
        isOpen={isIdolChatOpen}
        onClose={() => setIsIdolChatOpen(false)}
      />

      {/* 2. Messenger-style Popup Widget (Me-AI Assistant) */}
      <MeChatWidget
        isOpen={isMeChatOpen}
        onToggle={() => setIsMeChatOpen(!isMeChatOpen)}
        onClose={() => setIsMeChatOpen(false)}
      />
    </div>
  );
}
