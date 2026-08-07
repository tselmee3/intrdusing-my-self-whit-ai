import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, RefreshCw, Copy, Check, ShieldCheck, User } from "lucide-react";
import { ChatMessage } from "../types";
import { PORTFOLIO_INFO } from "../data/portfolioData";

interface MeChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const INITIAL_ME_MESSAGE: ChatMessage = {
  id: "me-welcome",
  role: "model",
  content: `Сайн байна уу! 👋 Би бол **Tselmegbayar-ийн AI туслах** байна. 

Намаас Tselmegbayar-ийн сонирхол, PC техник угсралт, Minecraft ба CS2 тоглоомын механик, эсвэл манай портфолио сайтын хэсгүүдийн талаар юу ч асууж болно шүү! 💻🎮`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const ME_SUGGESTED_QUESTIONS = [
  "Сонирхол, хоббины чинь талаар яриач?",
  "Сайтын ямар хэсгүүдээр аялбал сонирхолтой вэ?",
  "PC техник болон компьютер угсрах хоббины талаар асууя",
  "Minecraft болон CS2-ын талаар яриач?"
];

export const MeChatWidget: React.FC<MeChatWidgetProps> = ({ isOpen, onToggle, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const payloadMessages = newHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: "me",
          messages: payloadMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server connection error");
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Me-AI Chat Error:", err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `Уучлаарай, алдаа гарлаа: ${err.message || "Сүлжээний холболтоо шалгана уу."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([INITIAL_ME_MESSAGE]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Popup Chat Window */}
      {isOpen && (
        <div 
          className="mb-4 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[520px] bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/60 flex flex-col overflow-hidden animate-fadeIn"
          id="me-chat-popup"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                  Me-AI Туслах
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    Tselmegbayar
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Portfolio Assistant • Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Шинэ яриа"
                id="me-reset-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                id="me-close-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-indigo-600/30 border border-indigo-500/40 text-indigo-300"
                  }`}
                >
                  {msg.role === "user" ? "YOU" : "ME"}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none shadow-md"
                      : msg.error
                      ? "bg-rose-950/70 border border-rose-500/40 text-rose-200 rounded-tl-none"
                      : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none shadow"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.role === "model" && !msg.error && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold">
                  ME
                </div>
                <div className="bg-slate-800 border border-slate-700/80 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-mono animate-pulse">
                    бичиж байна...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Chips */}
          {messages.length < 3 && (
            <div className="p-2 bg-slate-900 border-t border-slate-800/80 space-y-1">
              <p className="text-[10px] text-slate-400 px-1 font-mono">
                Түгээмэл асуултууд:
              </p>
              <div className="flex flex-wrap gap-1">
                {ME_SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="text-[11px] bg-slate-800/80 hover:bg-indigo-950/80 hover:text-indigo-200 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 text-left transition-all cursor-pointer truncate max-w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Aсуултаа энд бичнэ үү..."
                disabled={isLoading}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                id="me-chat-input"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                id="me-chat-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Messenger Button */}
      <button
        onClick={onToggle}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Toggle Me-AI Chat"
        id="me-chat-widget-toggle"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950"></span>
            </span>
          </>
        )}

        {/* Tooltip on hover */}
        {!isOpen && (
          <span className="absolute right-16 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            💬 Me-AI Туслахтай чатлах
          </span>
        )}
      </button>
    </div>
  );
};
