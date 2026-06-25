import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Share2, Edit3, MapPin, DollarSign, CheckSquare, Square, Info } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "../components/page-transition";
import { trips, companions } from "../lib/sample-data";

export const Route = createFileRoute("/t/$slug")({
  loader: ({ params }) => {
    const trip = trips.find((t) => t.slug === params.slug);
    if (!trip) throw notFound();
    return { trip };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.trip.title} · Tripu` : "Trip · Tripu" },
      { name: "description", content: loaderData?.trip.summary ?? "" },
      ...(loaderData ? [
        { property: "og:title", content: loaderData.trip.title },
        { property: "og:description", content: loaderData.trip.summary },
        { property: "og:image", content: loaderData.trip.cover },
      ] : []),
    ],
  }),
  notFoundComponent: () => (
    <div className="pt-24 text-center">
      <h1 className="text-3xl font-bold">Trip not found</h1>
      <Link to="/tripboards" className="text-[color:var(--primary)] mt-4 inline-block">Browse trips</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="pt-24 text-center text-destructive">{error.message}</div>,
  component: TripDetail,
});

const CATS = ["Food", "Culture", "Nature", "Sights", "Transit"] as const;

function TripDetail() {
  const { trip } = Route.useLoaderData();
  const [packing, setPacking] = useState<Record<string, boolean>>({});
  const pack = ["Passport", "Comfortable shoes", "Power adapter", "Sun layer", "Reusable bottle", "Offline maps"];

  const days = Array.from({ length: trip.days }).map((_, i) => ({
    title: `Day ${i + 1} · ${trip.cities[i % trip.cities.length]}`,
    items: [
      { time: "09:00", t: "Slow breakfast at a neighborhood spot", cat: "Food", cost: 14, reason: "Match for relaxed pace and food tag." },
      { time: "11:00", t: "Heritage walk through old town", cat: "Culture", cost: 0, reason: "Highly rated, free, walkable from your stay." },
      { time: "14:30", t: "Lunch + viewpoint detour", cat: "Sights", cost: 22, reason: "Balances morning culture with a light afternoon." },
      { time: "19:30", t: "Locals-only dinner pick", cat: "Food", cost: 38, reason: "Curated based on dietary prefs and budget." },
    ],
  }));

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* header */}
        <div className="rounded-3xl overflow-hidden border border-border bg-surface">
          <div className="relative aspect-[16/6]">
            <img src={trip.cover} alt={trip.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-3 text-white">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest opacity-80">{trip.country} · {trip.days} days · {trip.budget}</div>
                <h1 className="mt-1 text-3xl sm:text-4xl font-display font-bold">{trip.title}</h1>
              </div>
              <div className="flex gap-2">
                <button className="h-9 rounded-lg bg-white/15 backdrop-blur px-3 text-sm font-medium hover:bg-white/25 inline-flex items-center gap-1.5"><Download className="h-4 w-4" /> PDF</button>
                <button className="h-9 rounded-lg bg-white/15 backdrop-blur px-3 text-sm font-medium hover:bg-white/25 inline-flex items-center gap-1.5"><Share2 className="h-4 w-4" /> Share</button>
                <button className="h-9 rounded-lg bg-white text-[color:var(--primary-deep)] px-3 text-sm font-semibold hover:bg-white/90 inline-flex items-center gap-1.5"><Edit3 className="h-4 w-4" /> Edit</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Timeline */}
          <div className="space-y-5">
            {days.map((d) => (
              <div key={d.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <h3 className="font-display font-semibold text-lg">{d.title}</h3>
                <ul className="mt-4 space-y-3">
                  {d.items.map((it, i) => (
                    <li key={i} className="group grid grid-cols-[60px_1fr_auto] gap-3 items-start p-3 rounded-xl hover:bg-secondary/60 transition-colors">
                      <span className="font-mono text-xs text-muted-foreground pt-1">{it.time}</span>
                      <div>
                        <div className="text-sm font-medium">{it.t}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{it.cat}</span>
                          <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{it.cost}</span>
                          <span title={it.reason} className="inline-flex items-center gap-1 cursor-help text-[color:var(--primary)]">
                            <Info className="h-3 w-3" /> AI reason
                          </span>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-xs text-[color:var(--primary)]">Edit</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sticky aside */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="aspect-square relative bg-secondary">
                <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
                  <path d="M 40 230 Q 150 60 260 220" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="6 6" />
                  {[[40, 230], [150, 110], [260, 220]].slice(0, trip.cities.length).map(([x, y], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="14" fill="white" stroke="var(--primary)" strokeWidth="2.5" />
                      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--primary)">{i + 1}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="p-4 text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {trip.cities.join(" → ")}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <h4 className="font-semibold">Budget breakdown</h4>
              <div className="mt-4 space-y-2 text-sm">
                {[
                  ["Stays", 45], ["Food", 25], ["Transit", 15], ["Activities", 15],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="flex justify-between text-xs"><span>{k}</span><span className="text-muted-foreground">{v}%</span></div>
                    <div className="h-1.5 mt-1 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary text-primary-foreground" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <h4 className="font-semibold">Packing list</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {pack.map((p) => (
                  <li key={p}>
                    <button onClick={() => setPacking((s) => ({ ...s, [p]: !s[p] }))} className="flex items-center gap-2 w-full text-left hover:text-[color:var(--primary)]">
                      {packing[p] ? <CheckSquare className="h-4 w-4 text-[color:var(--primary)]" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                      <span className={packing[p] ? "line-through text-muted-foreground" : ""}>{p}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Companion matches</h4>
                <Link to="/companions" className="text-xs font-semibold text-[color:var(--primary)]">See all</Link>
              </div>
              <ul className="mt-3 space-y-3">
                {companions.slice(0, 3).map((c) => (
                  <li key={c.name} className="flex items-center gap-3">
                    <img src={c.avatar} alt="" className="h-10 w-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{c.name}</div>
                      <div className="h-1 mt-1 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary text-primary-foreground" style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-display font-bold text-[color:var(--primary)]">{c.score}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
}
