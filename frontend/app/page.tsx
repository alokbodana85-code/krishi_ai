"use client";

import { useEffect, useMemo, useState } from "react";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import Loader from "@/components/Loader";
import { SLIDERS, DEFAULT_VALUES } from "@/lib/sliders";
import { FormValues, PredictResponse } from "@/lib/types";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Cpu,
  RotateCcw,
  Sprout,
  WandSparkles,
  WifiOff,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Preset = {
  name: string;
  description: string;
  values: FormValues;
};

const PRESETS: Preset[] = [
  {
    name: "Current example",
    description: "Balanced conditions with 120 mm rainfall",
    values: DEFAULT_VALUES,
  },
  {
    name: "Rice field",
    description: "Warm, humid and high-rainfall conditions",
    values: {
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      temperature: 21,
      humidity: 82,
      ph: 6.5,
      rainfall: 203,
    },
  },
  {
    name: "Dry climate",
    description: "Lower humidity and limited rainfall",
    values: {
      nitrogen: 35,
      phosphorus: 55,
      potassium: 75,
      temperature: 23,
      humidity: 35,
      ph: 7.1,
      rainfall: 65,
    },
  },
];

export default function Home() {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  const handleChange = (key: keyof FormValues, value: number) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setResult(null);
    setError("");
  };

  const applyPreset = (preset: Preset) => {
    setValues(preset.values);
    setResult(null);
    setError("");
  };

  const resetForm = () => {
    setValues(DEFAULT_VALUES);
    setResult(null);
    setError("");
  };

  const rainfallMessage = useMemo(() => {
    if (values.rainfall < 70) return "Dry rainfall profile";
    if (values.rainfall < 160) return "Moderate rainfall profile";
    return "High rainfall profile";
  }, [values.rainfall]);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/health`)
      .then((response) => {
        if (!response.ok) throw new Error("API offline");
        return response.json();
      })
      .then(() => {
        if (!cancelled) setApiOnline(true);
      })
      .catch(() => {
        if (!cancelled) setApiOnline(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Prediction failed");
      }

      const data: PredictResponse = await response.json();
      setResult(data);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      setError(
        "Could not connect to the crop model. Start the FastAPI backend on port 8000 and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 md:py-14">
      <div className="text-center mb-8 page-enter">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-light mb-5 border border-green-400/20">
          <Cpu size={13} className="text-green-400" />
          <span className="text-green-300 text-xs font-body tracking-widest uppercase">
            AI-powered farming assistant
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-3 leading-tight text-glow">
          Smart Crop<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-lime-400">
            Recommendation
          </span>
        </h1>
        <p className="text-white/50 font-body text-base max-w-md mx-auto">
          Tune your soil and climate profile, then let the trained Random Forest model find the best match for your field.
        </p>
      </div>

      <div className="w-full max-w-xl">
        {loading ? (
          <div className="glass-card rounded-3xl">
            <Loader />
          </div>
        ) : result ? (
          <ResultCard result={result} onReset={resetForm} />
        ) : (
          <div className="glass-card rounded-3xl p-5 md:p-8 page-enter">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-400/15 border border-green-400/25 flex items-center justify-center">
                  <Sprout size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-body font-semibold">Soil &amp; Climate Parameters</p>
                  <p className="text-white/40 text-xs">Drag sliders to match your conditions</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-body" title={`Backend: ${API_URL}`}>
                {apiOnline === true ? (
                  <>
                    <CheckCircle2 size={14} className="text-green-300" />
                    <span className="text-green-200/80">Online</span>
                  </>
                ) : apiOnline === false ? (
                  <>
                    <WifiOff size={14} className="text-amber-300" />
                    <span className="text-amber-200/80">Offline</span>
                  </>
                ) : (
                  <>
                    <Activity size={14} className="text-white/40 animate-pulse" />
                    <span className="text-white/40">Checking</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/40 text-xs uppercase tracking-widest font-body">Quick profiles</p>
                <button onClick={resetForm} className="text-white/45 hover:text-green-300 text-xs flex items-center gap-1 transition-colors">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="text-left rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 hover:border-green-400/40 hover:bg-green-400/[0.08] transition-all"
                  >
                    <span className="block text-white/85 text-xs font-semibold font-body">{preset.name}</span>
                    <span className="block text-white/35 text-[11px] leading-tight mt-1">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {SLIDERS.map((slider) => (
                <SliderInput
                  key={slider.key}
                  config={slider}
                  value={values[slider.key]}
                  onChange={handleChange}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl border border-sky-300/15 bg-sky-300/[0.06] px-3 py-2.5 mb-5">
              <CloudRain size={16} className="text-sky-300" />
              <span className="text-sky-100/80 text-xs font-body">
                Rainfall: <strong className="text-sky-200">{values.rainfall} mm</strong> · {rainfallMessage}
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-body">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-body font-semibold text-white text-base bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-500 hover:via-green-400 hover:to-teal-400 shadow-[0_8px_32px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.55)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative flex items-center gap-2">
                <WandSparkles size={18} />
                Analyze &amp; Recommend
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <p className="text-center text-white/25 text-xs font-body mt-4">
              Powered by Random Forest · 22 crop varieties · 2,200 training records
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-white/20 text-xs font-body">CropSage · Precision Agriculture Intelligence</p>
      </div>
    </main>
  );
}
