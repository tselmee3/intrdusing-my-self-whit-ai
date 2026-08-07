import React from "react";
import { Monitor, Cpu, Zap, Server, HardDrive, Layers, Wind, CheckCircle2 } from "lucide-react";
import { PC_SPECS } from "../data/portfolioData";

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-cyan-400" />,
  Zap: <Zap className="w-5 h-5 text-emerald-400" />,
  Server: <Server className="w-5 h-5 text-indigo-400" />,
  HardDrive: <HardDrive className="w-5 h-5 text-purple-400" />,
  Layers: <Layers className="w-5 h-5 text-amber-400" />,
  Wind: <Wind className="w-5 h-5 text-teal-400" />
};

export const PcSpecsSection: React.FC = () => {
  return (
    <section id="pc-specs" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
            <Monitor className="w-3.5 h-3.5" />
            <span>Hardware Specs & Rig</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            PC Техник & Угсралтын Үзүүлэлт
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
            Өндөр гүйцэтгэлтэй систем, NVIDIA GPU, хөргөлт болон тохиргооны стандартууд
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PC_SPECS.map((spec, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {ICON_MAP[spec.iconName] || <Cpu className="w-5 h-5 text-cyan-400" />}
                </div>
                <span className="text-[11px] font-mono text-slate-500 uppercase">Hardware</span>
              </div>

              <h3 className="text-sm font-semibold text-slate-400 font-mono">
                {spec.component}
              </h3>
              <p className="text-base font-bold text-slate-100 mt-1">
                {spec.model}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {spec.detail}
              </p>
            </div>
          ))}
        </div>

        {/* NVIDIA & Hardware Passion Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-300">
                NVIDIA-р тоноглогдсон систем & Jensen Huang-ийн загвар
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                GPU хурдасгуур, AI боловсруулалт ба компьютерийн техникийн хүчин чадлыг дээд цэгт нь хүргэх зорилготой.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">
              ⚡ Accelerated Computing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
