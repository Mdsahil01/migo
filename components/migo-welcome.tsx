 "use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type MigoWelcomeProps = {
  name: string;
};

export function MigoWelcome({
  name,
}: MigoWelcomeProps) {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const storageKey =
      `migo-welcome-${name}`;

    const alreadyShown =
      sessionStorage.getItem(storageKey);

    if (!alreadyShown) {
      sessionStorage.setItem(
        storageKey,
        "true",
      );

      setVisible(true);
    }
  }, [name]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-start justify-center pt-24">
      <div className="pointer-events-auto relative animate-[migoFade_0.6s_ease-out] rounded-2xl border border-cyan-500/30 bg-black/75 px-8 py-5 shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl">
        
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-3 text-zinc-500 transition hover:text-white"
        >
          <X size={18} />
        </button>

        <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
          MIGO VERIFIED
        </p>

        <h2 className="mt-3 text-center text-2xl font-bold text-white">
          Welcome back, {name}.
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Operational workspace access granted.
        </p>
      </div>

      <style jsx>{`
        @keyframes migoFade {
          0% {
            opacity: 0;
            transform: translateY(-14px)
              scale(0.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0)
              scale(1);
          }
        }
      `}</style>
    </div>
  );
}