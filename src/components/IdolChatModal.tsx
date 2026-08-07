import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles, RefreshCw, Copy, Check, Zap, Lightbulb, MessageSquare } from "lucide-react";
import { ChatMessage } from "../types";
import { IDOL_INFO } from "../data/portfolioData";

interface IdolChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_IDOL_MESSAGE: ChatMessage = {
  id: "idol-welcome",
  role: "model",
  content: `Hello! I am Jensen Huang — CEO of NVIDIA and AI Coach. Tselmegbayar-ийн "🤖 My Idol" хэсэгт тавтай морилно уу!

I am thrilled to connect with young builders, engineers, and curious minds. Компьютерийн техник, GPU хурдасгуур, хиймэл интеллект эсвэл карьер болон суралцах арга барилын талаар юу ч асууж болно. How can I inspire your journey today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const SUGGESTED_IDOL_QUESTIONS = [
  "NVIDIA-г хэрхэн эхлүүлж, яаж GPU хувьсгал хийсэн бэ?",
  "PC техник ба AI сонирхдог залууст ямар зөвлөгөө өгөх вэ?",
  "First Principles сэтгэлгээ гэж юу вэ, инженерийн ажилд хэрхэн ашиглах вэ?",
  "GPU болон AI технологи ойрын 5 жилд хэрхэн хөгжих бэ?"
];

export const IdolChatModal: React.FC<IdolChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_IDOL_MESSAGE]);
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

  if (!isOpen) return null;

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
      // Prepare payload for Gemini API endpoint
      const payloadMessages = newHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: "idol",
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
      console.error("Idol Chat Error:", err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `Sorry, I encountered an issue: ${err.message || "Failed to reach AI service."}. Please ensure process.env.GEMINI_API_KEY is configured correctly.`,
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
    setMessages([INITIAL_IDOL_MESSAGE]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl h-[90vh] sm:h-[85vh] bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-950/50 flex flex-col overflow-hidden text-slate-100"
        id="idol-chat-modal"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-emerald-500/30 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  <Bot className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base sm:text-lg flex items-center gap-1.5">
                  {IDOL_INFO.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                    Idol Coach
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 text-emerald-400 inline" />
                CEO of NVIDIA • Powered by Gemini 3.6 Flash
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Шинэ яриа эхлүүлэх"
              id="idol-reset-btn"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              id="idol-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quotes banner */}
        <div className="bg-emerald-950/30 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-300/90 flex items-center gap-2 font-mono">
          <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate italic">"{IDOL_INFO.quote}"</span>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
                }`}
              >
                {msg.role === "user" ? "YOU" : "JH"}
              </div>

              {/* Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20"
                    : msg.error
                    ? "bg-rose-950/60 border border-rose-500/40 text-rose-200 rounded-tl-none"
                    : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none shadow-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[11px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.role === "model" && !msg.error && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Хууллаа</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Хуулах</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-bold">
                JH
              </div>
              <div className="bg-slate-800 border border-slate-700/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-xs text-slate-300 font-mono animate-pulse">
                  Jensen Huang тунгаан бодож байна...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        {messages.length < 3 && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-1.5">
            <p className="text-[11px] text-slate-400 font-medium px-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              Санал болгох асуултууд:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_IDOL_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-xs bg-slate-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 text-slate-300 rounded-lg px-2.5 py-1.5 transition-all text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 bg-slate-900 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Jensen Huang-аас асуух асуултаа энд бичнэ үү..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              id="idol-chat-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-medium text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
              id="idol-chat-send-btn"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Илгээх</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
