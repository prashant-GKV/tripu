import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PageTransition } from "../components/page-transition";
import { trips } from "../lib/sample-data";
import { fadeUp, stagger } from "../lib/motion";

export const Route = createFileRoute("/tripboards")({
  head: () => ({
    meta: [
      { title: "Tripboards — community-made trips · Tripu" },
      { name: "description", content: "Browse real, ready-to-remix trip plans from the Tripu community." },
    ],
  }),
  component: TripboardsPage,
});

function TripboardsPage() {
  const [filter, setFilter] = useState<string>("All");
  const countries = useMemo(() => ["All", ...Array.from(new Set(trips.map((t) => t.country)))], []);
  const visible = trips.filter((t) => filter === "All" || t.country === filter);

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--teal)]">Tripboards</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Real trips, ready to remix.</h1>
          <p className="mt-4 text-muted-foreground">No login required. Click any card to inspect the day-by-day plan.</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filter === c ? "bg-primary text-primary-foreground text-white border-transparent shadow-glow" : "border-border bg-surface hover:border-[color:var(--primary)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((t) => (
            <motion.div key={t.slug} variants={fadeUp}>
              <Link to="/t/$slug" params={{ slug: t.slug }} className="group block rounded-2xl border border-border bg-surface overflow-hidden card-hover">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={t.cover} alt={t.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 rounded-full glass px-2.5 py-1 text-xs font-semibold">{t.country}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">{t.days} days</span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">{t.budget}</span>
                    {t.tags.map((tg) => <span key={tg} className="rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)] px-2.5 py-1 font-medium">#{tg}</span>)}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </PageTransition>
  );
}
