"use client";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Spinning ring */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-400 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-300 animate-spin"
          style={{ animationDuration: "0.7s", animationDirection: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
          🌱
        </div>
      </div>
      <div className="text-center">
        <p className="text-white/80 font-body font-medium">Analyzing soil conditions…</p>
        <p className="text-white/40 text-sm mt-1">Running AI model</p>
      </div>
    </div>
  );
}
