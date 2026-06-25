import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus, Plus, Check, ArrowLeft, ArrowRight, Loader2,
  MapPin, GripVertical, X, Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageTransition } from "../components/page-transition";
import { previewItinerary, type TripBriefInput } from "../lib/api";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a trip — Tripu" },
      { name: "description", content: "Answer 4 quick questions. Get a day-by-day itinerary in seconds." },
    ],
  }),
  component: PlanPage,
});

const steps = ["Who", "When", "Where", "How"] as const;

type City = { name: string; nights: number };

function Counter({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-secondary disabled:opacity-40" disabled={value <= min} aria-label={`Decrease ${label}`}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <motion.span key={value} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-6 text-center font-display font-semibold">{value}</motion.span>
        <button onClick={() => onChange(value + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-secondary" aria-label={`Increase ${label}`}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-primary text-primary-foreground text-white border-transparent shadow-glow"
          : "border-border bg-surface hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
      }`}
    >
      {children}
    </button>
  );
}

function MiniCalendar({ start, end, onSelect }: { start: Date | null; end: Date | null; onSelect: (d: Date) => void }) {
  const [view] = useState(() => new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const pad = first.getDay();
  const inRange = (d: Date) => start && end && d >= start && d <= end;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-semibold">{first.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</div>
        <div className="text-xs text-muted-foreground">Tap two dates</div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: pad }).map((_, i) => <div key={`p${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = new Date(year, month, i + 1);
          const isStart = start && d.toDateString() === start.toDateString();
          const isEnd = end && d.toDateString() === end.toDateString();
          const within = inRange(d);
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`h-9 rounded-lg text-sm transition-colors ${
                isStart || isEnd ? "bg-primary text-primary-foreground text-white font-semibold"
                : within ? "bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                : "hover:bg-secondary"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RouteMap({ cities }: { cities: City[] }) {
  // Pretend coordinates spread across a stylized canvas
  const pts = cities.map((_, i) => {
    const t = cities.length === 1 ? 0.5 : i / (cities.length - 1);
    return { x: 40 + t * 260, y: 60 + Math.sin(t * Math.PI * 1.4) * 60 + 60 };
  });
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden sticky top-24">
      <div className="aspect-[4/3] relative bg-secondary">
        <svg viewBox="0 0 360 280" className="absolute inset-0 w-full h-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 28} x2="360" y2={i * 28} stroke="rgba(15,23,42,0.05)" />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 28} y1="0" x2={i * 28} y2="280" stroke="rgba(15,23,42,0.05)" />
          ))}
          {pts.length > 1 && (
            <path
              d={pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
              fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6"
            />
          )}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="10" fill="white" stroke="var(--primary)" strokeWidth="2" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--primary)">{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="p-4 text-xs text-muted-foreground">
        Live route preview · updates as you add cities
      </div>
    </div>
  );
}

function PlanPage() {
  const [step, setStep] = useState(0);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0, infants: 0, elders: 0 });
  const [occasion, setOccasion] = useState<string | null>(null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [cities, setCities] = useState<City[]>([{ name: "Lisbon", nights: 3 }, { name: "Porto", nights: 2 }]);
  const [newCity, setNewCity] = useState("");
  const [accommodation, setAccommodation] = useState<string[]>(["hotel"]);
  const [budget, setBudget] = useState(120);
  const [currency, setCurrency] = useState("USD");
  const [pace, setPace] = useState("balanced");
  const [diet, setDiet] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<null | { days: { title: string; items: { time: string; t: string; cat: string }[] }[] }>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const totalNights = cities.reduce((a, c) => a + c.nights, 0);

  /** Build the backend TripBrief from wizard state. */
  const buildBrief = (): TripBriefInput => ({
    travelers,
    occasion: occasion && occasion !== "none" ? occasion : null,
    startDate: (start ?? new Date()).toISOString(),
    endDate: (end ?? start ?? new Date()).toISOString(),
    route: cities.map((c) => ({ city: c.name, country: "", nights: c.nights })),
    accommodationType: accommodation[0] ?? "hotel",
    budgetPerNight: { min: Math.round(budget * 0.7), max: budget, currency },
    pace,
    diet,
    interests: notes,
    currency,
  });

  /** Local fallback used only if the backend is unreachable. */
  const fallbackDays = () =>
    Array.from({ length: Math.max(3, totalNights || 4) }).map((_, i) => ({
      title: `Day ${i + 1} · ${cities[i % cities.length]?.name ?? "Explore"}`,
      items: [
        { time: "09:00", t: "Local breakfast at a neighborhood café", cat: "Food" },
        { time: "11:00", t: "Self-guided old town walk", cat: "Culture" },
        { time: "14:30", t: "Museum or viewpoint pick", cat: "Sights" },
        { time: "19:30", t: "Dinner at a curated local spot", cat: "Food" },
      ],
    }));

  const onDate = (d: Date) => {
    if (!start || (start && end)) { setStart(d); setEnd(null); }
    else if (d < start) { setStart(d); }
    else { setEnd(d); }
  };

  const valid = useMemo(() => {
    if (step === 0) return travelers.adults + travelers.children + travelers.infants + travelers.elders > 0;
    if (step === 1) return start && end;
    if (step === 2) return cities.length > 0 && totalNights > 0;
    if (step === 3) return accommodation.length > 0;
    return true;
  }, [step, travelers, start, end, cities, totalNights, accommodation]);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const generate = async () => {
    setGenerating(true);
    setNotice(null);
    try {
      // Real AI itinerary from the backend (works without a DB or API key).
      const itinerary = await previewItinerary(buildBrief());
      const days = itinerary.days.map((d) => ({
        title: `Day ${d.dayIndex + 1} · ${d.city || "Explore"}`,
        items: d.activities.map((a) => ({
          time: a.timeSlot || "—",
          t: a.title,
          cat: a.category || "Plan",
        })),
      }));
      setResult({ days: days.length ? days : fallbackDays() });
    } catch {
      // Backend unreachable — show a local sample so the UI still works.
      setNotice("Showing a sample itinerary — couldn't reach the AI server (is it running on :4000?).");
      setResult({ days: fallbackDays() });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--coral)]">Plan a trip</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Tell us about your trip</h1>
          <p className="mt-3 text-muted-foreground">Four quick steps. No account needed.</p>
        </div>

        {/* progress */}
        <div className="mt-10 grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="space-y-2">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary"}`} />
              <div className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{i + 1}. {s}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <h2 className="text-2xl font-semibold">Who's coming?</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Counter label="Adults" value={travelers.adults} onChange={(v) => setTravelers({ ...travelers, adults: v })} />
                      <Counter label="Children" value={travelers.children} onChange={(v) => setTravelers({ ...travelers, children: v })} />
                      <Counter label="Infants" value={travelers.infants} onChange={(v) => setTravelers({ ...travelers, infants: v })} />
                      <Counter label="Elders" value={travelers.elders} onChange={(v) => setTravelers({ ...travelers, elders: v })} />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Special occasion?</div>
                      <div className="flex flex-wrap gap-2">
                        {["birthday", "anniversary", "honeymoon", "bachelorette", "none"].map((o) => (
                          <Chip key={o} active={occasion === o} onClick={() => setOccasion(occasion === o ? null : o)}>{o}</Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-2xl font-semibold">When are you going?</h2>
                    <MiniCalendar start={start} end={end} onSelect={onDate} />
                    <div className="text-sm text-muted-foreground">
                      {start && end ? `${start.toDateString()} → ${end.toDateString()}` : start ? `Start: ${start.toDateString()} — pick an end date` : "Pick a start date"}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-2xl font-semibold">Where are you headed?</h2>
                    <div className="flex gap-2">
                      <input
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && newCity) { setCities([...cities, { name: newCity, nights: 2 }]); setNewCity(""); } }}
                        placeholder="Add a city (e.g. Tokyo)"
                        className="flex-1 h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
                      />
                      <button onClick={() => { if (newCity) { setCities([...cities, { name: newCity, nights: 2 }]); setNewCity(""); } }} className="h-11 rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold text-white">Add</button>
                    </div>
                    <ul className="space-y-2">
                      {cities.map((c, i) => (
                        <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <MapPin className="h-4 w-4 text-[color:var(--primary)]" />
                          <span className="flex-1 text-sm font-medium">{c.name}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { const n = [...cities]; n[i] = { ...c, nights: Math.max(1, c.nights - 1) }; setCities(n); }} className="grid h-7 w-7 place-items-center rounded-md border border-border"><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-semibold w-12 text-center">{c.nights} nights</span>
                            <button onClick={() => { const n = [...cities]; n[i] = { ...c, nights: c.nights + 1 }; setCities(n); }} className="grid h-7 w-7 place-items-center rounded-md border border-border"><Plus className="h-3 w-3" /></button>
                          </div>
                          <button onClick={() => setCities(cities.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-muted-foreground">Total nights assigned: <span className="font-semibold text-foreground">{totalNights}</span></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">How do you like to travel?</h2>
                    <div>
                      <div className="text-sm font-medium mb-2">Accommodation</div>
                      <div className="flex flex-wrap gap-2">
                        {["hotel", "apartment", "hostel", "unique"].map((o) => (
                          <Chip key={o} active={accommodation.includes(o)} onClick={() => toggle(accommodation, o, setAccommodation)}>{o}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm font-medium mb-2">
                        <span>Budget / night</span>
                        <span className="font-display font-semibold text-[color:var(--primary)]">{currency} {budget}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="range" min={30} max={600} step={10} value={budget} onChange={(e) => setBudget(+e.target.value)} className="flex-1 accent-[color:var(--primary)]" />
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
                          <option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Pace</div>
                      <div className="flex flex-wrap gap-2">
                        {["relaxed", "balanced", "packed"].map((o) => (
                          <Chip key={o} active={pace === o} onClick={() => setPace(o)}>{o}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Dietary</div>
                      <div className="flex flex-wrap gap-2">
                        {["veg", "nonveg", "egg", "vegan", "halal"].map((o) => (
                          <Chip key={o} active={diet.includes(o)} onClick={() => toggle(diet, o, setDiet)}>{o}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Tell us what you want</div>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Hidden cafés, quiet hikes, jazz bars…" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-2 h-10 rounded-lg border border-border px-4 text-sm font-medium disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} disabled={!valid} className="inline-flex items-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground px-5 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 h-10 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-secondary">Save & open tripboard</button>
                  <button onClick={generate} disabled={!valid || generating} className="inline-flex items-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground px-5 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Generate preview
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <RouteMap cities={cities} />
          </div>
        </div>

        {/* RESULT */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 rounded-3xl border border-border bg-surface p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-[color:var(--teal)] text-sm font-semibold">
                <Check className="h-4 w-4" /> Itinerary ready
              </div>
              {notice && (
                <p className="mt-2 text-xs text-[color:var(--coral)]">{notice}</p>
              )}
              <h2 className="mt-2 text-3xl font-bold">Your {result.days.length}-day plan</h2>
              <div className="mt-6 space-y-5">
                {result.days.map((d) => (
                  <div key={d.title} className="rounded-2xl border border-border p-5">
                    <h3 className="font-display font-semibold text-lg">{d.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {d.items.map((it, i) => (
                        <li key={i} className="grid grid-cols-[60px_1fr_auto] gap-3 items-center text-sm">
                          <span className="font-mono text-xs text-muted-foreground">{it.time}</span>
                          <span>{it.t}</span>
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{it.cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}
