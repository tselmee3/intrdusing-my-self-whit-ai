import React, { useState } from "react";
import { Cpu, Zap, RotateCcw, AlertTriangle, CheckCircle2, Sparkles, Server } from "lucide-react";

interface PcBuilderGameViewProps {
  onScoreUpdate: (newScore: number) => void;
}

interface ComponentOption {
  name: string;
  price: number;
  power: number; // Watts
  perfScore: number;
}

const CPUS: ComponentOption[] = [
  { name: "Intel Core i3 / Ryzen 3 (Budget)", price: 120, power: 65, perfScore: 40 },
  { name: "Intel Core i5-13600K / Ryzen 5 7600X (Mid)", price: 280, power: 125, perfScore: 75 },
  { name: "Intel Core i7-14700K / Ryzen 7 7800X3D (High)", price: 420, power: 170, perfScore: 98 },
];

const GPUS: ComponentOption[] = [
  { name: "NVIDIA GTX 1650 / RTX 3050 (Entry)", price: 180, power: 110, perfScore: 35 },
  { name: "NVIDIA RTX 4060 Ti 8GB (Mid-Tier)", price: 390, power: 160, perfScore: 72 },
  { name: "NVIDIA RTX 4080 Super 16GB (Pro)", price: 980, power: 320, perfScore: 100 },
];

const RAMS: ComponentOption[] = [
  { name: "8GB DDR4 3200MHz", price: 35, power: 10, perfScore: 30 },
  { name: "16GB DDR5 5600MHz", price: 75, power: 15, perfScore: 70 },
  { name: "32GB DDR5 6000MHz RGB", price: 140, power: 20, perfScore: 95 },
];

const PSUS: ComponentOption[] = [
  { name: "500W 80+ Bronze", price: 50, power: 500, perfScore: 40 },
  { name: "750W 80+ Gold Fully Modular", price: 110, power: 750, perfScore: 80 },
  { name: "1000W 80+ Platinum ATX 3.0", price: 190, power: 1000, perfScore: 100 },
];

export const PcBuilderGameView: React.FC<PcBuilderGameViewProps> = ({ onScoreUpdate }) => {
  const [selectedCpu, setSelectedCpu] = useState(1);
  const [selectedGpu, setSelectedGpu] = useState(1);
  const [selectedRam, setSelectedRam] = useState(1);
  const [selectedPsu, setSelectedPsu] = useState(1);

  const [benchmarkResult, setBenchmarkResult] = useState<{
    cs2Fps: number;
    cyberpunkFps: number;
    minecraftFps: number;
    bottleneckPercent: number;
    totalPrice: number;
    totalPower: number;
    psuSafe: boolean;
    score: number;
    aiAdvice: string;
  } | null>(null);

  const runBenchmark = () => {
    const cpu = CPUS[selectedCpu];
    const gpu = GPUS[selectedGpu];
    const ram = RAMS[selectedRam];
    const psu = PSUS[selectedPsu];

    const totalPrice = cpu.price + gpu.price + ram.price + psu.price;
    const totalPowerDemand = cpu.power + gpu.power + ram.power + 80; // system overhead
    const psuSafe = psu.power >= totalPowerDemand + 50;

    // Calculate Bottleneck
    const diff = Math.abs(cpu.perfScore - gpu.perfScore);
    const bottleneckPercent = Math.min(35, Math.round(diff * 0.45));

    // Base FPS calculations
    let cs2Fps = Math.round((cpu.perfScore * 1.8 + gpu.perfScore * 2.2 + ram.perfScore * 0.5) * 1.2);
    let cyberpunkFps = Math.round((gpu.perfScore * 1.1 + cpu.perfScore * 0.4) * 0.9);
    let minecraftFps = Math.round((cpu.perfScore * 2.5 + ram.perfScore * 1.2) * 1.8);

    if (!psuSafe) {
      cs2Fps = Math.round(cs2Fps * 0.4); // Thermal throttling / power limit
      cyberpunkFps = Math.round(cyberpunkFps * 0.4);
      minecraftFps = Math.round(minecraftFps * 0.4);
    }

    // Balance Score
    let score = Math.round((cs2Fps + cyberpunkFps + minecraftFps) - bottleneckPercent * 10);
    if (!psuSafe) score = Math.max(100, score - 400);

    let aiAdvice = "Систем маш тэнцвэртэй! CPU болон GPU-ийн гүйцэтгэл зохицож байна.";
    if (!psuSafe) {
      aiAdvice = "⚠️ АЮУЛ: PSU тэжээл хүрэлцэхгүй байна! Тоглох үед PC унтах эсвэл FPS огцом унах аюултай.";
    } else if (bottleneckPercent > 20) {
      if (cpu.perfScore < gpu.perfScore) {
        aiAdvice = "⚠️ CPU Bottleneck: График карт чинь маш хүчтэй боловч CPU чинь гүйцэхгүй байна.";
      } else {
        aiAdvice = "⚠️ GPU Bottleneck: Процессор өндөр үзүүлэлттэй ч GPU чинь тоглоомын графикийг дийлэхгүй байна.";
      }
    } else if (totalPrice < 1000 && cs2Fps > 200) {
      aiAdvice = "🔥 Шилдэг төсөвтэй систем! Бага зардлаар маш өндөр FPS авч чадлаа.";
    }

    setBenchmarkResult({
      cs2Fps,
      cyberpunkFps,
      minecraftFps,
      bottleneckPercent,
      totalPrice,
      totalPower: totalPowerDemand,
      psuSafe,
      score,
      aiAdvice,
    });

    onScoreUpdate(score);
  };

  const resetBuild = () => {
    setSelectedCpu(1);
    setSelectedGpu(1);
    setSelectedRam(1);
    setSelectedPsu(1);
    setBenchmarkResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            PC Hardware & Bottleneck Simulator
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">Компьютерийн эд ангиудыг тохируулах</h3>
        </div>
        <button
          onClick={resetBuild}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset Components"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Component Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPU */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold block">1. CPU (Процессор)</label>
          <select
            value={selectedCpu}
            onChange={(e) => setSelectedCpu(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {CPUS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.name} — ${opt.price} ({opt.power}W)
              </option>
            ))}
          </select>
        </div>

        {/* GPU */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold block">2. GPU (График Карт)</label>
          <select
            value={selectedGpu}
            onChange={(e) => setSelectedGpu(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {GPUS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.name} — ${opt.price} ({opt.power}W)
              </option>
            ))}
          </select>
        </div>

        {/* RAM */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold block">3. RAM (Санах ой)</label>
          <select
            value={selectedRam}
            onChange={(e) => setSelectedRam(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {RAMS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.name} — ${opt.price}
              </option>
            ))}
          </select>
        </div>

        {/* PSU */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold block">4. PSU (Тэжээлийн Блок)</label>
          <select
            value={selectedPsu}
            onChange={(e) => setSelectedPsu(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {PSUS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.name} — ${opt.price} ({opt.power}W Max)
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={runBenchmark}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-cyan-200" />
        AI БЕНЧМАРК & FPS ТУРШИЛТ ЭХЛҮҮЛЭХ
      </button>

      {/* Benchmark Results */}
      {benchmarkResult && (
        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-slate-400">BUILD SCORE</div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">{benchmarkResult.score} pts</div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-400">Total Cost:</span> <strong className="text-emerald-400">${benchmarkResult.totalPrice}</strong>
              </div>
              <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-400">Power Demand:</span> <strong className={benchmarkResult.psuSafe ? "text-cyan-400" : "text-rose-400"}>{benchmarkResult.totalPower}W</strong>
              </div>
            </div>
          </div>

          {/* FPS Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">CS2 1080p</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{benchmarkResult.cs2Fps} FPS</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">Cyberpunk 2077</div>
              <div className="text-xl font-bold text-indigo-400 font-mono mt-1">{benchmarkResult.cyberpunkFps} FPS</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">Minecraft Shaders</div>
              <div className="text-xl font-bold text-purple-400 font-mono mt-1">{benchmarkResult.minecraftFps} FPS</div>
            </div>
          </div>

          {/* AI Feedback */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
            benchmarkResult.psuSafe ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-200" : "bg-rose-950/40 border-rose-500/30 text-rose-200"
          }`}>
            {benchmarkResult.psuSafe ? <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            <div>
              <div className="font-bold text-sm mb-1">AI Систем Шинжилгээ:</div>
              <p>{benchmarkResult.aiAdvice}</p>
              <div className="mt-2 text-[11px] opacity-80">
                • CPU-GPU Bottleneck Rate: <strong>{benchmarkResult.bottleneckPercent}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
