import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageTransition } from "../components/page-transition";
import { companions } from "../lib/sample-data";
import { fadeUp, stagger } from "../lib/motion";

export const Route = createFileRoute("/companions")({
  head: () => ({
    meta: [
      { title: "Companions — find your travel match · Tripu" },
      { name: "description", content: "Travelers matched to your style, dates and budget — with a transparent score." },
    ],
  }),
  component: CompanionsPage,
});

function ScoreRing({ value }: { value: number }) {
  const R = 26, C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
      <circle cx="32" cy="32" r={R} fill="none" stroke="var(--secondary)" strokeWidth="6" />
      <circle cx="32" cy="32" r={R} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(C * value) / 100} ${C}`} />
      <text x="32" y="36" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" className="rotate-90" transform="rotate(90 32 32)">{value}</text>
    </svg>
  );
}

function CompanionsPage() {
  const [style, setStyle] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");
  const styles = ["all", "culture", "food", "nature", "hiking", "nightlife", "photo"];
  const budgets = ["all", "Low", "Mid", "High"];

  const filtered = companions.filter((c) =>
    (style === "all" || c.style.includes(style)) &&
    (budget === "all" || c.budget === budget)
  );

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--coral)]">Companions</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Find your travel match.</h1>
          <p className="mt-4 text-muted-foreground">Ranked by style, dates, and budget — with a transparent breakdown so you know why.</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">Style:</span>
          {styles.map((s) => (
            <button key={s} onClick={() => setStyle(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${style === s ? "bg-primary text-primary-foreground text-white border-transparent" : "border-border bg-surface"}`}>{s}</button>
          ))}
          <span className="text-xs text-muted-foreground ml-4 mr-2">Budget:</span>
          {budgets.map((b) => (
            <button key={b} onClick={() => setBudget(b)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${budget === b ? "bg-primary text-primary-foreground text-white border-transparent" : "border-border bg-surface"}`}>{b}</button>
          ))}
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <motion.article key={c.name} variants={fadeUp} className="rounded-2xl border border-border bg-surface p-6 card-hover">
              <div className="flex items-center gap-4">
                <img src={c.avatar} alt="" className="h-14 w-14 rounded-full" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.country} · {c.dates}</p>
                </div>
                <ScoreRing value={c.score} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.style.map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">#{s}</span>)}
                <span className="rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)] px-2.5 py-0.5 text-xs font-medium">Budget: {c.budget}</span>
              </div>
              <div className="mt-5">
                <div className="text-xs font-semibold mb-2">Why you match</div>
                <div className="space-y-1.5">
                  {Object.entries(c.breakdown).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}%</span></div>
                      <div className="h-1 mt-0.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary text-primary-foreground" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-white text-xs font-semibold">Say hi</button>
                <button className="flex-1 h-9 rounded-lg border border-border text-xs font-semibold hover:bg-secondary">View profile</button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </PageTransition>
  );
}
