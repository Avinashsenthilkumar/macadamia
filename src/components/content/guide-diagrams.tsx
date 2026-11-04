"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const view = { once: true, margin: "-60px" } as const;

function Frame({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="mt-8 rounded-3xl bg-white p-6 shadow-soft sm:p-8">
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-lg text-forest">{title}</span>
        <span className="text-xs text-ink/50">{note}</span>
      </figcaption>
      {children}
    </figure>
  );
}

/** Soil pH scale with the commonly cited 5.0–6.5 band highlighted */
export function PhScaleDiagram() {
  const stops = Array.from({ length: 11 }, (_, i) => i + 3); // 3..13
  const colors = ["#c0392b", "#d35400", "#e67e22", "#f1c40f", "#a8b89a", "#7fb069", "#426b45", "#2e7d6b", "#2f6690", "#3a3f8f", "#5b2a86"];
  const pct = (v: number) => ((v - 3) / 11) * 100;
  return (
    <Frame title="Soil pH scale" note="General reference range, not a local recommendation">
      <div className="relative pt-10">
        <div className="flex h-5 overflow-hidden rounded-full">
          {colors.map((c, i) => (
            <motion.span key={c} className="h-full flex-1" style={{ backgroundColor: c }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={view} transition={{ delay: i * 0.04, ease: EASE }} />
          ))}
        </div>
        <motion.div
          className="absolute top-0 flex h-[3.4rem] flex-col items-center rounded-xl border-2 border-forest bg-forest/10"
          style={{ left: `${pct(5)}%`, width: `${pct(6.5) - pct(5)}%` }}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="-mt-7 whitespace-nowrap rounded-full bg-forest px-2.5 py-0.5 text-xs font-bold text-ivory">≈ pH 5.0 – 6.5</span>
        </motion.div>
        <div className="mt-2 flex justify-between text-xs text-ink/50">
          {stops.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.7rem] font-semibold uppercase tracking-wider text-ink/40">
          <span>Acidic</span>
          <span>Neutral</span>
          <span>Alkaline</span>
        </div>
      </div>
    </Frame>
  );
}

/** Temperature band diagram */
export function TemperatureDiagram() {
  const min = 0;
  const max = 45;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const markers = [
    { v: 18, label: "≈18 °C flower initiation" },
    { v: 25, label: "≈25 °C growing-season optimum" },
  ];
  return (
    <Frame title="Temperature reference points" note="Sources: ICRAF Agroforestree Database">
      <div className="relative pb-16 pt-4">
        <div className="h-4 rounded-full bg-gradient-to-r from-sky-300 via-sage to-red-400" />
        <motion.div
          className="absolute top-2 h-8 rounded-xl border-2 border-forest bg-forest/15"
          style={{ left: `${pct(15)}%`, width: `${pct(25) - pct(15)}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: 1, ease: EASE }}
        />
        {markers.map((m, i) => (
          <motion.div key={m.v} className="absolute top-12 -translate-x-1/2 text-center" style={{ left: `${pct(m.v)}%` }} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ delay: 0.6 + i * 0.2 }}>
            <span className="mx-auto block h-3 w-px bg-forest" />
            <span className={`mt-1 block whitespace-nowrap text-[0.7rem] font-semibold text-forest ${i === 0 ? "-translate-x-1/4" : "translate-x-1/4"}`}>{m.label}</span>
          </motion.div>
        ))}
        <div className="absolute bottom-0 flex w-full justify-between text-xs text-ink/50">
          {[0, 10, 20, 30, 40].map((t) => (
            <span key={t}>{t} °C</span>
          ))}
        </div>
      </div>
      <p className="text-sm text-ink/60">Shaded band: mean annual temperature range of ≈15–25 °C reported where the tree is grown.</p>
    </Frame>
  );
}

/** Plan view of a row layout, with trees popping in one by one */
export function SpacingDiagram() {
  const rows = 4;
  const cols = 7;
  return (
    <Frame title="Example layout — 8 m × 5 m" note="Illustration only; adjust for variety and site">
      <svg viewBox="0 0 400 230" className="w-full" role="img" aria-label="Plan view of trees planted in rows 8 metres apart and 5 metres apart within the row">
        {Array.from({ length: rows }).map((_, r) => (
          <motion.line key={`row-${r}`} x1="20" x2="380" y1={30 + r * 55} y2={30 + r * 55} stroke="#A8B89A" strokeDasharray="4 6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={view} transition={{ duration: 1, delay: r * 0.1 }} />
        ))}
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          return (
            <motion.circle key={i} cx={40 + c * 53} cy={30 + r * 55} r="13" fill={r % 2 ? "#426B45" : "#173F2A"} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={view} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 + i * 0.025 }} />
          );
        })}
        <g fontSize="11" fill="#8A6545" fontWeight="700">
          <line x1="40" x2="93" y1="210" y2="210" stroke="#8A6545" />
          <text x="52" y="224">5 m</text>
          <line x1="392" x2="392" y1="30" y2="85" stroke="#8A6545" />
          <text x="356" y="62">8 m</text>
        </g>
      </svg>
    </Frame>
  );
}

/** Alternating rows of two compatible varieties with pollinators moving between them */
export function PollinationDiagram() {
  return (
    <Frame title="Inter-planting compatible varieties" note="Illustration only">
      <svg viewBox="0 0 400 190" className="w-full" role="img" aria-label="Alternating rows of variety A and variety B with bees moving between rows">
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <text x="6" y={38 + r * 42} fontSize="11" fontWeight="700" fill={r % 2 ? "#8A6545" : "#173F2A"}>
              {r % 2 ? "B" : "A"}
            </text>
            {Array.from({ length: 8 }).map((_, c) => (
              <motion.circle key={c} cx={40 + c * 46} cy={34 + r * 42} r="12" fill={r % 2 ? "#8A6545" : "#426B45"} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={view} transition={{ delay: r * 0.15 + c * 0.03, type: "spring", stiffness: 240, damping: 15 }} />
            ))}
          </g>
        ))}
        {[0, 1, 2].map((b) => (
          <motion.g
            key={b}
            initial={{ x: 60 + b * 110, y: 50 + b * 30 }}
            animate={{ x: [60 + b * 110, 120 + b * 100, 80 + b * 110, 60 + b * 110], y: [50 + b * 30, 90 + b * 10, 130 - b * 20, 50 + b * 30] }}
            transition={{ duration: 6 + b, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#f1c40f" stroke="#252A25" strokeWidth="1" />
            <ellipse cx="-2" cy="-5" rx="3.5" ry="2.5" fill="#fff" fillOpacity=".8" />
          </motion.g>
        ))}
      </svg>
      <p className="mt-3 text-sm text-ink/60">Rows of two compatible varieties (A and B) planted close together help bees carry pollen between them.</p>
    </Frame>
  );
}
