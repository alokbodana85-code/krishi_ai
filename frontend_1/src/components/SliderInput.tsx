"use client";
import { SliderConfig, FormValues } from "@/lib/types";

interface Props {
  config: SliderConfig;
  value: number;
  onChange: (key: keyof FormValues, val: number) => void;
}

export default function SliderInput({ config, value, onChange }: Props) {
  const pct = ((value - config.min) / (config.max - config.min)) * 100;

  return (
    <div className="glass-card-light rounded-2xl p-5 group hover:border-green-400/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{config.icon}</span>
          <div>
            <p className="text-white/90 font-body font-medium text-sm">{config.label}</p>
            <p className="text-white/40 text-xs">{config.description}</p>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-xl font-semibold text-green-400 tabular-nums">
            {typeof value === "number" && Number.isInteger(config.step)
              ? value.toFixed(0)
              : value.toFixed(1)}
          </span>
          <span className="text-white/50 text-xs font-mono">{config.unit}</span>
        </div>
      </div>

      {/* Track with fill */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ width: `${pct}%` }}>
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 to-green-400 rounded-l-full" />
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(config.key, parseFloat(e.target.value))}
          className="relative w-full z-10"
          style={{ background: "transparent" }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-white/25 text-xs font-mono">{config.min}{config.unit}</span>
        <span className="text-white/25 text-xs font-mono">{config.max}{config.unit}</span>
      </div>
    </div>
  );
}
