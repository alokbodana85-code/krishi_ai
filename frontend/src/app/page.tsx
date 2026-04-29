"use client";
import { useState } from "react";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import Loader from "@/components/Loader";
import { SLIDERS, DEFAULT_VALUES } from "@/lib/sliders";
import { FormValues, PredictResponse } from "@/lib/types";
import { Sprout, Cpu, ChevronRight } from "lucide-react";

export default function Home() {
  const [values, setValues]   = useState<FormValues>(DEFAULT_VALUES);
  const [result, setResult]   = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (key: keyof FormValues, val: number) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen:    values.nitrogen,
          phosphorus:  values.phosphorus,
          potassium:   values.potassium,
          temperature: values.temperature,
          humidity:    values.humidity,
          ph:          values.ph,
          rainfall:    values.rainfall,
        }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data: PredictResponse = await res.json();
      setResult(data);
    } catch (e) {
      setError("⚠️  Could not connect to the API. Make sure the FastAPI backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* ── Header ── */}
      <div className="text-center mb-10 page-enter">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-light mb-5 border border-green-400/20">
          <Cpu size={13} className="text-green-400" />
          <span className="text-green-300 text-xs font-body tracking-widest uppercase">AI-powered farming assistant</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-3 leading-tight text-glow">
          Smart Crop<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-lime-400">
            Recommendation
          </span>
        </h1>
        <p className="text-white/50 font-body text-base max-w-sm mx-auto">
          Enter your soil &amp; climate data below and let our Random Forest model pick the best crop for your field.
        </p>
      </div>

      {/* ── Main card ── */}
      <div className="w-full max-w-xl">
        {loading ? (
          <div className="glass-card rounded-3xl">
            <Loader />
          </div>
        ) : result ? (
          <ResultCard result={result} onReset={() => setResult(null)} />
        ) : (
          <div className="glass-card rounded-3xl p-6 md:p-8 page-enter">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-green-400/15 border border-green-400/25 flex items-center justify-center">
                <Sprout size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-white font-body font-semibold">Soil &amp; Climate Parameters</p>
                <p className="text-white/40 text-xs">Drag sliders to match your conditions</p>
              </div>
            </div>

            {/* Sliders grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {SLIDERS.map((s) => (
                <SliderInput
                  key={s.key}
                  config={s}
                  value={values[s.key]}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-body">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full py-4 rounded-2xl font-body font-semibold text-white text-base
                bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500
                hover:from-emerald-500 hover:via-green-400 hover:to-teal-400
                shadow-[0_8px_32px_rgba(16,185,129,0.35)]
                hover:shadow-[0_12px_40px_rgba(16,185,129,0.55)]
                transition-all duration-300
                hover:-translate-y-0.5 active:translate-y-0
                flex items-center justify-center gap-2
                relative overflow-hidden group
              "
            >
              {/* Shimmer overlay */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative flex items-center gap-2">
                <Cpu size={18} />
                Analyze &amp; Recommend
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Footer note */}
            <p className="text-center text-white/25 text-xs font-body mt-4">
              Powered by Random Forest · 25 crop varieties
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom brand strip ── */}
      <div className="mt-10 text-center">
        <p className="text-white/20 text-xs font-body">
          CropSage · Precision Agriculture Intelligence
        </p>
      </div>
    </main>
  );
}
