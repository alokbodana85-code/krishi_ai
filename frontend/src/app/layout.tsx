import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CropSage — Smart Crop Recommendation",
  description: "AI-powered farming assistant for precision agriculture",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-animated noise antialiased" suppressHydrationWarning>
        {/* Ambient floating orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="orb w-96 h-96 bg-green-500/20 top-[-10%] left-[-5%]" style={{ animationDelay: "0s" }} />
          <div className="orb w-72 h-72 bg-emerald-400/15 top-[30%] right-[-8%]" style={{ animationDelay: "2s" }} />
          <div className="orb w-80 h-80 bg-teal-500/15 bottom-[-10%] left-[30%]" style={{ animationDelay: "4s" }} />
          <div className="orb w-48 h-48 bg-lime-400/10 top-[60%] left-[10%]" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
