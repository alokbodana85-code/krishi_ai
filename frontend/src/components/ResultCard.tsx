"use client";
import { useEffect, useState } from "react";
import { PredictResponse } from "@/lib/types";
import { RotateCcw, Leaf, Droplets, ThumbsUp } from "lucide-react";

interface Props {
  result: PredictResponse;
  onReset: () => void;
}

function ConfidenceBar({ value }: { value: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 200); return () => clearTimeout(t); }, [value]);

  const color =
    value >= 70 ? "#4ade80" :
    value >= 45 ? "#facc15" :
                  "#f87171";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/50 font-body">Confidence</span>
        <span className="font-mono font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

function SoilHealthBadge({ label, color, score }: { label: string; color: string; score: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: `${color}40`, background: `${color}15` }}>
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <span className="text-xs font-body font-medium" style={{ color }}>{label} Soil</span>
      <span className="text-xs font-mono text-white/40">{score}/100</span>
    </div>
  );
}

export default function ResultCard({ result, onReset }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  return (
    <div className={`page-enter space-y-4 ${visible ? "opacity-100" : "opacity-0"}`}>
      {/* Main result */}
      <div className="glass-card rounded-3xl p-8 text-center glow-green">
        {/* Crop emoji */}
        <div
          className="w-28 h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center text-6xl relative"
          style={{ background: `${result.color}20`, border: `1px solid ${result.color}40` }}
        >
          <div className="absolute inset-0 rounded-3xl animate-pulse-slow" style={{ background: `${result.color}10` }} />
          <span className="relative z-10">{result.emoji}</span>
        </div>

        <p className="text-white/50 text-sm font-body tracking-[0.2em] uppercase mb-2">Recommended Crop</p>
        <h2 className="font-display text-5xl font-bold text-white mb-1 text-glow">{result.crop}</h2>

        <div className="flex items-center justify-center gap-2 mb-6">
          <SoilHealthBadge {...result.soil_health} />
        </div>

        {/* Confidence bar */}
        <div className="max-w-sm mx-auto mb-6">
          <ConfidenceBar value={result.confidence} />
        </div>

        {/* Description */}
        <p className="text-white/65 font-body text-sm leading-relaxed max-w-md mx-auto">
          {result.description}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <ThumbsUp size={16} />, label: "Match Score", value: `${result.confidence}%` },
          { icon: <Leaf size={16} />,     label: "Soil Health", value: result.soil_health.label },
          { icon: <Droplets size={16} />, label: "Alternatives", value: `+${result.alternatives.length}` },
        ].map((s) => (
          <div key={s.label} className="glass-card-light rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1 text-green-400">{s.icon}</div>
            <p className="text-white font-body font-semibold text-lg">{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alternatives */}
      {result.alternatives.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <p className="text-white/60 text-xs font-body tracking-widest uppercase mb-3">Also Consider</p>
          <div className="space-y-3">
            {result.alternatives.map((alt) => (
              <div key={alt.name} className="flex items-center gap-3">
                <span className="text-xl w-8">{alt.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80 font-body font-medium">{alt.name}</span>
                    <span className="font-mono text-white/50">{alt.confidence}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600/70 to-green-400/70 transition-all duration-700"
                      style={{ width: `${alt.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-body font-medium text-white/70 border border-white/10 hover:border-green-400/30 hover:text-white hover:bg-white/5 transition-all duration-300 group"
      >
        <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
        Analyze Different Conditions
      </button>
    </div>
  );
}
